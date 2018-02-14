import { get_memsat_ranges } from '../parsers/parsers_index.js';
import { parse_ss2 } from '../parsers/parsers_index.js';


//given a url, http request type and some form data make an http request
export function send_request(url, type, send_data)
{
  console.log('Sending URI request');
  console.log(url);
  console.log(type);

  var response = null;
  $.ajax({
    type: type,
    data: send_data,
    cache: false,
    contentType: false,
    processData: false,
    async:   false,
    dataType: "json",
    //contentType: "application/json",
    url: url,
    success : function (data)
    {
      if(data === null){alert("Failed to send data");}
      response=data;
      //alert(JSON.stringify(response, null, 2))
    },
    error: function (error) {alert("Sending Job to "+url+" Failed. "+error.responseText+". The Backend processing service is not available. Something Catastrophic has gone wrong. Please contact psipred@cs.ucl.ac.uk"); return null;}
  }).responseJSON;
  return(response);
}

//given a job name prep all the form elements and send an http request to the
//backend
export function send_job(ractive, job_name, seq, name, email, submit_url, times_url)
{
  //alert(seq);
  console.log("Sending form data");
  var file = null;
  let upper_name = job_name.toUpperCase();
  try
  {
    file = new Blob([seq]);
  } catch (e)
  {
    alert(e);
  }
  let fd = new FormData();
  fd.append("input_data", file, 'input.txt');
  fd.append("job",job_name);
  fd.append("submission_name",name);
  fd.append("email", email);

  let response_data = send_request(submit_url, "POST", fd);
  if(response_data !== null)
  {
    let times = send_request(times_url,'GET',{});
    //alert(JSON.stringify(times));
    if(job_name in times)
    {
      ractive.set(job_name+'_time', upper_name+" jobs typically take "+times[job_name]+" seconds");
    }
    else
    {
      ractive.set(job_name+'_time', "Unable to retrieve average time for "+upper_name+" jobs.");
    }
    for(var k in response_data)
    {
      if(k == "UUID")
      {
        ractive.set('batch_uuid', response_data[k]);
        ractive.fire('poll_trigger', job_name);
      }
    }
  }
  else
  {
    return null;
  }
  return true;
}

//utility function that gets the sequence from a previous submission is the
//page was loaded with a UUID
export function get_previous_data(uuid, submit_url, file_url, ractive)
{
    console.log('Requesting details given URI');
    let url = submit_url+ractive.get('batch_uuid');
    //alert(url);
    let submission_response = send_request(url, "GET", {});
    if(! submission_response){alert("NO SUBMISSION DATA");}
    let seq = get_text(file_url+submission_response.submissions[0].input_file, "GET", {});
    let jobs = '';
    submission_response.submissions.forEach(function(submission){
      jobs += submission.job_name+",";
    });
    jobs = jobs.slice(0, -1);
    return({'seq': seq, 'email': submission_response.submissions[0].email, 'name': submission_response.submissions[0].submission_name, 'jobs': jobs});
}


//get text contents from a result URI
function get_text(url, type, send_data)
{

 let response = null;
  $.ajax({
    type: type,
    data: send_data,
    cache: false,
    contentType: false,
    processData: false,
    async:   false,
    //dataType: "txt",
    //contentType: "application/json",
    url: url,
    success : function (data)
    {
      if(data === null){alert("Failed to request input data text");}
      response=data;
      //alert(JSON.stringify(response, null, 2))
    },
    error: function (error) {alert("Gettings results failed. The Backend processing service is not available. Something Catastrophic has gone wrong. Please contact psipred@cs.ucl.ac.uk");}
  });
  return(response);
}


//polls the backend to get results and then parses those results to display
//them on the page
export function process_file(url_stub, path, ctl, zip, ractive)
{
  let url = url_stub + path;
  let path_bits = path.split("/");
  //get a results file and push the data in to the bio3d object
  //alert(url);
  console.log('Getting Results File and processing');
  let response = null;
  $.ajax({
    type: 'GET',
    async:   true,
    url: url,
    success : function (file)
    {
      zip.folder(path_bits[1]).file(path_bits[2], file);
      if(ctl === 'horiz')
      {
        ractive.set('psipred_horiz', file);
        biod3.psipred(file, 'psipredChart', {parent: 'div.psipred_cartoon', margin_scaler: 2});
      }
      if(ctl === 'ss2')
      {
        parse_ss2(ractive, file);
      }
      if(ctl === 'pbdat')
      {
        //alert('PBDAT process');
        let annotations = ractive.get('annotations');
        let lines = file.split('\n');
        lines.shift(); lines.shift(); lines.shift(); lines.shift(); lines.shift();
        lines = lines.filter(Boolean);
        if(annotations.length == lines.length)
        {
          lines.forEach(function(line, i){
            let entries = line.split(/\s+/);
            if(entries[3] === '-'){annotations[i].disopred = 'D';}
            if(entries[3] === '^'){annotations[i].disopred = 'PB';}
          });
          ractive.set('annotations', annotations);
          biod3.annotationGrid(annotations, {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
        }
      }
      if(ctl === 'comb')
      {
        let precision = [];
        let lines = file.split('\n');
        lines.shift(); lines.shift(); lines.shift();
        lines = lines.filter(Boolean);
        lines.forEach(function(line, i){
          let entries = line.split(/\s+/);
          precision[i] = {};
          precision[i].pos = entries[1];
          precision[i].precision = entries[4];
        });
        ractive.set('diso_precision', precision);
        biod3.genericxyLineChart(precision, 'pos', ['precision'], ['Black',], 'DisoNNChart', {parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
      }
      if(ctl === 'memsatdata')
      {
        let annotations = ractive.get('annotations');
        let seq = ractive.get('sequence');
        topo_regions = get_memsat_ranges(/Topology:\s+(.+?)\n/, file);
        signal_regions = get_memsat_ranges(/Signal\speptide:\s+(.+)\n/, file);
        reentrant_regions = get_memsat_ranges(/Re-entrant\shelices:\s+(.+?)\n/, file);
        terminal = get_memsat_ranges(/N-terminal:\s+(.+?)\n/, file);
        //console.log(signal_regions);
        // console.log(reentrant_regions);
        coil_type = 'CY';
        if(terminal === 'out')
        {
          coil_type = 'EC';
        }
        let tmp_anno = new Array(seq.length);
        if(topo_regions !== 'Not detected.')
        {
          let prev_end = 0;
          topo_regions.forEach(function(region){
            tmp_anno = tmp_anno.fill('TM', region[0], region[1]+1);
            if(prev_end > 0){prev_end -= 1;}
            tmp_anno = tmp_anno.fill(coil_type, prev_end, region[0]);
            if(coil_type === 'EC'){ coil_type = 'CY';}else{coil_type = 'EC';}
            prev_end = region[1]+2;
          });
          tmp_anno = tmp_anno.fill(coil_type, prev_end-1, seq.length);

        }
        //signal_regions = [[70,83], [102,117]];
        if(signal_regions !== 'Not detected.'){
          signal_regions.forEach(function(region){
            tmp_anno = tmp_anno.fill('S', region[0], region[1]+1);
          });
        }
        //reentrant_regions = [[40,50], [200,218]];
        if(reentrant_regions !== 'Not detected.'){
          reentrant_regions.forEach(function(region){
            tmp_anno = tmp_anno.fill('RH', region[0], region[1]+1);
          });
        }
        tmp_anno.forEach(function(anno, i){
          annotations[i].memsat = anno;
        });
        ractive.set('annotations', annotations);
        biod3.annotationGrid(annotations, {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
      }
      if(ctl === 'presult')
      {

        let lines = file.split('\n');
        let ann_list = ractive.get('pgen_ann_set');
        if(Object.keys(ann_list).length > 0){
        let pseudo_table = '<table class="small-table table-striped table-bordered">\n';
        pseudo_table += '<tr><th>Conf.</th>';
        pseudo_table += '<th>Net Score</th>';
        pseudo_table += '<th>p-value</th>';
        pseudo_table += '<th>PairE</th>';
        pseudo_table += '<th>SolvE</th>';
        pseudo_table += '<th>Aln Score</th>';
        pseudo_table += '<th>Aln Length</th>';
        pseudo_table += '<th>Str Len</th>';
        pseudo_table += '<th>Seq Len</th>';
        pseudo_table += '<th>Fold</th>';
        pseudo_table += '<th>SEARCH SCOP</th>';
        pseudo_table += '<th>SEARCH CATH</th>';
        pseudo_table += '<th>PDBSUM</th>';
        pseudo_table += '<th>Alignment</th>';
        pseudo_table += '<th>MODEL</th>';

        // if MODELLER THINGY
        pseudo_table += '</tr><tbody">\n';
        lines.forEach(function(line, i){
          if(line.length === 0){return;}
          entries = line.split(/\s+/);
          if(entries[9]+"_"+i in ann_list)
          {
          pseudo_table += "<tr>";
          pseudo_table += "<td class='"+entries[0].toLowerCase()+"'>"+entries[0]+"</td>";
          pseudo_table += "<td>"+entries[1]+"</td>";
          pseudo_table += "<td>"+entries[2]+"</td>";
          pseudo_table += "<td>"+entries[3]+"</td>";
          pseudo_table += "<td>"+entries[4]+"</td>";
          pseudo_table += "<td>"+entries[5]+"</td>";
          pseudo_table += "<td>"+entries[6]+"</td>";
          pseudo_table += "<td>"+entries[7]+"</td>";
          pseudo_table += "<td>"+entries[8]+"</td>";
          let pdb = entries[9].substring(0, entries[9].length-2);
          pseudo_table += "<td><a target='_blank' href='https://www.rcsb.org/pdb/explore/explore.do?structureId="+pdb+"'>"+entries[9]+"</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/scop/pdb.cgi?pdb="+pdb+"'>SCOP SEARCH</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/pdb/"+pdb+"'>CATH SEARCH</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode="+pdb+"'>Open PDBSUM</a></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='loadNewAlignment(\""+(ann_list[entries[9]+"_"+i].aln)+"\",\""+(ann_list[entries[9]+"_"+i].ann)+"\",\""+(entries[9]+"_"+i)+"\");' value='Display Alignment' /></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='buildModel(\""+(ann_list[entries[9]+"_"+i].aln)+"\");' value='Build Model' /></td>";
          pseudo_table += "</tr>\n";
          }
        });
        pseudo_table += "</tbody></table>\n";
        ractive.set("pgen_table", pseudo_table);
        }
        else {
            ractive.set("pgen_table", "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>");
        }
      }

    },
    error: function (error) {alert(JSON.stringify(error));}
  });
}
