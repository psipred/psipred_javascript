import { get_memsat_ranges } from '../parsers/parsers_index.js';
import { parse_ss2 } from '../parsers/parsers_index.js';
import { parse_pbdat } from '../parsers/parsers_index.js';
import { parse_comb } from '../parsers/parsers_index.js';
import { parse_memsatdata } from '../parsers/parsers_index.js';
import { parse_presult } from '../parsers/parsers_index.js';
import { parse_parseds } from '../parsers/parsers_index.js';
import { parse_featcfg } from '../parsers/parsers_index.js';
import { parse_ffpreds } from '../parsers/parsers_index.js';
import { parse_metsite } from '../parsers/parsers_index.js';
import { parse_hspred } from '../parsers/parsers_index.js';
import { parse_config } from '../common/common_index.js';

var moment = require('moment');

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
    error: function (error) {alert("Sending Job to "+url+" Failed. "+error.responseText+". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk"); return null;
  }}).responseJSON;
  return(response);
}

//given a job name prep all the form elements and send an http request to the
//backend
export function send_job(ractive, job_name, seq, name, email, submit_url, times_url, job_names, options_data, joblist_url, zip)
{
  //alert(seq);
  console.log("Sending form data");
  var file = null;
  try
  {
    file = new Blob([seq]);
  } catch (e)
  {
    alert(e);
  }
  let fd = new FormData();
  console.log(job_name);
  fd.append("input_data", file, 'input.txt');
  fd.append("job",job_name);
  fd.append("submission_name",name);
  fd.append("email", email);
  if(job_name.includes('dompred')){
  fd.append("psiblast_dompred_evalue", options_data.psiblast_dompred_evalue);
  fd.append("psiblast_dompred_iterations", options_data.psiblast_dompred_iterations);}
  if(job_name.includes('metsite')){
  fd.append("metsite_checkchains_chain", options_data.metsite_checkchains_chain);
  fd.append("extract_fasta_chain", options_data.extract_fasta_chain);
  fd.append("seedSiteFind_metal", options_data.seedSiteFind_metal);
  fd.append("seedSiteFind_chain", options_data.seedSiteFind_chain);
  fd.append("metpred_wrapper_chain", options_data.metpred_wrapper_chain);
  fd.append("metpred_wrapper_metal", options_data.metpred_wrapper_metal);
  fd.append("metpred_wrapper_fpr", options_data.metpred_wrapper_fpr);}
  if(job_name.includes('hspred')){
  fd.append("hspred_checkchains_chains", options_data.hspred_checkchains_chains);
  fd.append("hs_pred_first_chain", options_data.hs_pred_first_chain);
  fd.append("hs_pred_second_chain", options_data.hs_pred_second_chain);
  fd.append("split_pdb_files_first_chain", options_data.split_pdb_files_first_chain);
  fd.append("split_pdb_files_second_chain", options_data.split_pdb_files_second_chain);}
  if(job_name.includes('memembed')){
  fd.append("memembed_algorithm", options_data.memembed_algorithm);
  fd.append("memembed_barrel", options_data.memembed_barrel);
  fd.append("memembed_termini", options_data.memembed_termini);}
  if(job_name.includes('ffpred')){
  fd.append("ffpred_selection", options_data.ffpred_selection);
  //console.log("hey");
  }
  //console.log(options_data);
  let response_data = send_request(submit_url, "POST", fd);
  if(response_data !== null)
  {
    let times = send_request(times_url,'GET',{});
    let jobs = job_name.split(",");
    jobs.forEach(function(name){
      if(name in times)
      {
        ractive.set('loading_message', null);
        var duration = moment.duration(times[name]*1000);
        ractive.set(name+'_time', job_names[name]+": "+duration.humanize());
      }
      else
      {
        ractive.set('loading_message', null);
        ractive.set(name+'_time', "No time for "+job_names[name]+" job.");
      }
    });
    //alert(JSON.stringify(times));
    for(var k in response_data)
    {
      if(k == "UUID")
      {
        ractive.set('batch_uuid', response_data[k]);
        if(['metiste', 'hspred', 'gentdb', 'memembed'].includes(job_name))
        {
          ractive.fire('poll_trigger', false);
        }
        else
        {
          ractive.fire('poll_trigger', true);
        }
      }
    }
    let csv = '';
    jobs.forEach(function(name){
      let config = send_request(joblist_url+name,'GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
    });
    zip.folder("submissions/").file(ractive.get('batch_uuid')+".csv", csv);
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
    return({'modified': submission_response.submissions[0].modified, 'seq': seq, 'email': submission_response.submissions[0].email, 'name': submission_response.submissions[0].submission_name, 'jobs': jobs});
}


//get text contents from a result URI
export function get_text(url, type, send_data)
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
    error: function (error) {alert("Gettings results text failed. The Backend processing service is not available. Please contact psipred@cs.ucl.ac.uk");}
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
  console.log(url)
  console.log('Getting Results File and processing');
  let response = null;
  $.ajax({
    type: 'GET',
    async:   true,
    url: url,
    success : function (file)
    {
      if(path_bits[2].includes(".png") || path_bits[2].includes(".gif") || path_bits[2].includes(".jpg"))
      {
          //There ought to be a way of casting the file string back to binary but for now
          //we're just using JSzip utils to get the data AGAIN in binary format instead
          JSZipUtils.getBinaryContent(url, function (err, data) {
          if(err) {
              throw err; // or handle the error
          }
          zip.folder(path_bits[1]).file(path_bits[2], data, {binary: true});
          });
      }
      else {
          zip.folder(path_bits[1]).file(path_bits[2], file);
      }
      if(ctl === 'horiz')
      {
        ractive.set('psipred_horiz', file);
        let count = (file.match(/Conf/g) || []).length;
        //console.log(count);
        let panel_height = ((6*30)*(count+1))+120;
        //console.log(panel_height);
        //if(panel_height < 450){panel_height = 450;}
        // console.log(panel_height);
        biod3.psipred(file, 'psipredChart', {debug: true, parent: 'div.psipred_cartoon', margin_scaler: 2, width: 900, container_width: 900, height: panel_height, container_height: panel_height});
        var svg = document.getElementById('psipredChart').outerHTML;
        svg = svg.replace(/<g id="toggle".+?<\/g>/, '');
        svg = svg.replace(/<g id="buttons".+?<\/g>/, '');
        zip.folder(path_bits[1]).file('psipredCartoon.svg', svg);
      }
      //PARSE DECISION
      if(ctl === 'ss2')
      {
        parse_ss2(ractive, file);
      }
      if(ctl === 'pbdat')
      {
        parse_pbdat(ractive, file);
        //alert('PBDAT process');
      }
      if(ctl === 'comb')
      {
        parse_comb(ractive, file);
      }
      if(ctl === 'memsatdata')
      {
        parse_memsatdata(ractive, file);
      }
      if(ctl === 'presult')
      {
        parse_presult(ractive, file, 'pgen');
      }
      if(ctl === 'gen_presult')
      {
        parse_presult(ractive, file, 'gen');
      }
      if(ctl === 'dom_presult')
      {
        parse_presult(ractive, file, 'dgen');
      }
      if(ctl === 'parseds')
      {
        parse_parseds(ractive, file);
      }
      if(ctl === 'ffpredfeatures')
      {
        parse_featcfg(ractive, file);
      }
      if(ctl === 'ffpredpredictions')
      {
        parse_ffpreds(ractive, file);
      }
      if(ctl === 'metsite')
      {
        parse_metsite(ractive, file);
      }
      if(ctl === 'hspred')
      {
        parse_hspred(ractive, file);
      }

    },
    error: function (error) {alert(JSON.stringify(error));}
  });
}
