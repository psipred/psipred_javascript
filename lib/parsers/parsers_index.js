
// for a given memsat data files extract coordinate ranges given some regex
export function get_memsat_ranges(regex, data)
{
    let match = regex.exec(data);
    if(match[1].includes(','))
    {
      let regions = match[1].split(',');
      regions.forEach(function(region, i){
        regions[i] = region.split('-');
        regions[i][0] = parseInt(regions[i][0]);
        regions[i][1] = parseInt(regions[i][1]);
      });
      return(regions);
    }
    else if(match[1].includes('-'))
    {
        console.log(match[1]);
        let seg = match[1].split('-');
        let regions = [[], ];
        regions[0][0] = parseInt(seg[0]);
        regions[0][1] = parseInt(seg[1]);
        return(regions);
    }
    return(match[1]);
}

// take and ss2 (file) and parse the details and write the new annotation grid
export function parse_ss2(ractive, file)
{
    let annotations = ractive.get('annotations');
    let lines = file.split('\n');
    lines.shift();
    lines = lines.filter(Boolean);
    if(annotations.length == lines.length)
    {
      lines.forEach(function(line, i){
        let entries = line.split(/\s+/);
        annotations[i].ss = entries[3];
      });
      ractive.set('annotations', annotations);
      biod3.annotationGrid(annotations, {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
    }
    else
    {
      alert("SS2 annotation length does not match query sequence");
    }
    return(annotations);
}

//take the disopred pbdat file, parse it and add the annotations to the annotation grid
export function parse_pbdat(ractive, file)
{
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

//parse the disopred comb file and add it to the annotation grid
export function parse_comb(ractive, file)
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

//parse the memsat output
export function parse_memsatdata(ractive, file)
{
  let annotations = ractive.get('annotations');
  let seq = ractive.get('sequence');
  //console.log(file);
  let topo_regions = get_memsat_ranges(/Topology:\s+(.+?)\n/, file);
  let signal_regions = get_memsat_ranges(/Signal\speptide:\s+(.+)\n/, file);
  let reentrant_regions = get_memsat_ranges(/Re-entrant\shelices:\s+(.+?)\n/, file);
  let terminal = get_memsat_ranges(/N-terminal:\s+(.+?)\n/, file);
  //console.log(signal_regions);
  // console.log(reentrant_regions);
  let coil_type = 'CY';
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

export function parse_presult(ractive, file, type)
{
  let lines = file.split('\n');
  //console.log(type+'_ann_set');
  let ann_list = ractive.get(type+'_ann_set');
  //console.log(ann_list);
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
    let entries = line.split(/\s+/);
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
    pseudo_table += "<td><input class='button' type='button' onClick='psipred.loadNewAlignment(\""+(ann_list[entries[9]+"_"+i].aln)+"\",\""+(ann_list[entries[9]+"_"+i].ann)+"\",\""+(entries[9]+"_"+i)+"\");' value='Display Alignment' /></td>";
    pseudo_table += "<td><input class='button' type='button' onClick='psipred.buildModel(\""+(ann_list[entries[9]+"_"+i].aln)+"\");' value='Build Model' /></td>";
    pseudo_table += "</tr>\n";
    }
  });
  pseudo_table += "</tbody></table>\n";
  ractive.set(type+"_table", pseudo_table);
  }
  else {
      ractive.set(type+"_table", "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>");
  }
}
