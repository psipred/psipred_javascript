import { process_file } from '../requests/requests_index.js';

export function show_panel(value, ractive)
{
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', value );
}

//before a resubmission is sent all variables are reset to the page defaults
export function clear_settings(ractive, gear_string, job_list, job_names){
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  job_list.forEach(function(job_name){
    ractive.set(job_name+'_waiting_message', '<h2>Please wait for your '+job_names[job_name]+' job to process</h2>');
    ractive.set(job_name+'_waiting_icon', gear_string);
    ractive.set(job_name+'_time', 'Loading Data');
  });
  ractive.set('psipred_horiz',null);
  ractive.set('diso_precision');
  ractive.set('memsatsvm_schematic', '');
  ractive.set('memsatsvm_cartoon', '');
  ractive.set('pgen_table', '');
  ractive.set('pgen_set', {});
  ractive.set('gen_table', '');
  ractive.set('gen_set', {});
  ractive.set('parseds_info', null);
  ractive.set('parseds_png', null);

//ractive.set('diso_precision');
  ractive.set('annotations',null);
  ractive.set('batch_uuid',null);
  biod3.clearSelection('div.sequence_plot');
  biod3.clearSelection('div.psipred_cartoon');
  biod3.clearSelection('div.comb_plot');

  zip = new JSZip();
}

//Take a couple of variables and prepare the html strings for the downloads panel
export function prepare_downloads_html(data, downloads_info, job_list, job_names)
{
  job_list.forEach(function(job_name){
    if(data.job_name === job_name)
    {
      downloads_info[job_name] = {};
      downloads_info[job_name].header = "<h5>"+job_names[job_name]+" DOWNLOADS</h5>";

      //EXTRA PANELS FOR SOME JOBS TYPES:
      if(job_name === 'pgenthreader' || job_name === 'dompred'  || job_name === 'pdomthreader' || job_name === 'metapsicov')
      {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>"+job_names.psipred+" DOWNLOADS</h5>";
      }
      if(job_name === 'mempack')
      {
        downloads_info.memsatsvm= {};
        downloads_info.memsatsvm.header = "<h5>"+job_names.memsatsvm+" DOWNLOADS</h5>";
      }
      if(job_name === 'bioserf')
      {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>"+job_names.psipred+" DOWNLOADS</h5>";
        downloads_info.pgenthreader= {};
        downloads_info.pgenthreader.header = "<h5>"+job_names.pgenthreader+" DOWNLOADS</h5>";
      }
      if(job_name === 'domserf')
      {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>"+job_names.psipred+" DOWNLOADS</h5>";
        downloads_info.pdomthreader= {};
        downloads_info.pdomthreader.header = "<h5>"+job_names.pdomthreader+" DOWNLOADS</h5>";
      }
      if(job_name === 'domserf')
      {
        downloads_info.disopred = {};
        downloads_info.disopred.header = "<h5>DisoPredD DOWNLOADS</h5>";
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
        downloads_info.dompred= {};
        downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
      }
    }
  });

}

//take the datablob we've got and loop over the results
export function handle_results(ractive, data, file_url, zip, downloads_info, job_names)
{
  let horiz_regex = /\.horiz$/;
  let ss2_regex = /\.ss2$/;
  let png_regex = /\.png$/;
  let memsat_cartoon_regex = /_cartoon_memsat_svm\.png$/;
  let memsat_schematic_regex = /_schematic\.png$/;
  let memsat_data_regex = /memsat_svm$/;
  let mempack_cartoon_regex = /Kamada-Kawai_\d+.png$/;
  let mempack_graph_out = /input_graph.out$/;
  let mempack_contact_res = /CONTACT_DEF1.results$/;
  let mempack_lipid_res = /LIPID_EXPOSURE.results$/;
  let mempack_result_found = false;
  let domssea_pred_regex = /\.pred$/;
  let domssea_regex = /\.domssea$/;


  let image_regex = '';
  let results = data.results;
  //Prepatory loop for information that is needed before results parsing:
  for(let i in results)
  {
    let result_dict = results[i];
    if(result_dict.name === 'GenAlignmentAnnotation')
    {
        let ann_set = ractive.get("pgen_ann_set");
        let tmp = result_dict.data_path;
        let path = tmp.substr(0, tmp.lastIndexOf("."));
        let id = path.substr(path.lastIndexOf(".")+1, path.length);
        ann_set[id] = {};
        ann_set[id].ann = path+".ann";
        ann_set[id].aln = path+".aln";
        ractive.set("pgen_ann_set", ann_set);
    }
    if(result_dict.name === 'gen_genalignment_annotation')
    {
        let ann_set = ractive.get("gen_ann_set");
        let tmp = result_dict.data_path;
        let path = tmp.substr(0, tmp.lastIndexOf("."));
        let id = path.substr(path.lastIndexOf(".")+1, path.length);
        ann_set[id] = {};
        ann_set[id].ann = path+".ann";
        ann_set[id].aln = path+".aln";
        ractive.set("gen_ann_set", ann_set);
    }
  }
  console.log(results);
  //main results parsing loop
  for(let i in results)
  {
    let result_dict = results[i];
    //psipred files
    if(result_dict.name == 'psipass2')
    {
      let match = horiz_regex.exec(result_dict.data_path);
      if(match)
      {
        process_file(file_url, result_dict.data_path, 'horiz', zip, ractive);
        ractive.set("psipred_waiting_message", '');
        downloads_info.psipred.horiz = '<a href="'+file_url+result_dict.data_path+'">Horiz Format Output</a><br />';
        ractive.set("psipred_waiting_icon", '');
        ractive.set("psipred_time", '');
      }
      let ss2_match = ss2_regex.exec(result_dict.data_path);
      if(ss2_match)
      {
        downloads_info.psipred.ss2 = '<a href="'+file_url+result_dict.data_path+'">SS2 Format Output</a><br />';
        process_file(file_url, result_dict.data_path, 'ss2', zip, ractive);
      }
    }
    //disopred files
    if(result_dict.name === 'diso_format')
    {
      process_file(file_url, result_dict.data_path, 'pbdat', zip, ractive);
      ractive.set("disopred_waiting_message", '');
      downloads_info.disopred.pbdat = '<a href="'+file_url+result_dict.data_path+'">PBDAT Format Output</a><br />';
      ractive.set("disopred_waiting_icon", '');
      ractive.set("disopred_time", '');
    }
    if(result_dict.name === 'diso_combine')
    {
      process_file(file_url, result_dict.data_path, 'comb', zip, ractive);
      downloads_info.disopred.comb = '<a href="'+file_url+result_dict.data_path+'">COMB NN Output</a><br />';
    }

    //memsat and mempack files
    if(result_dict.name === 'memsatsvm')
    {
      ractive.set("memsatsvm_waiting_message", '');
      ractive.set("memsatsvm_waiting_icon", '');
      ractive.set("memsatsvm_time", '');
      let scheme_match = memsat_schematic_regex.exec(result_dict.data_path);
      if(scheme_match)
      {
        ractive.set('memsatsvm_schematic', '<img src="'+file_url+result_dict.data_path+'" />');
        downloads_info.memsatsvm.schematic = '<a href="'+file_url+result_dict.data_path+'">Schematic Diagram</a><br />';
      }
      let cartoon_match = memsat_cartoon_regex.exec(result_dict.data_path);
      if(cartoon_match)
      {
        ractive.set('memsatsvm_cartoon', '<img src="'+file_url+result_dict.data_path+'" />');
        downloads_info.memsatsvm.cartoon = '<a href="'+file_url+result_dict.data_path+'">Cartoon Diagram</a><br />';
      }
      let memsat_match = memsat_data_regex.exec(result_dict.data_path);
      if(memsat_match)
      {
        process_file(file_url, result_dict.data_path, 'memsatdata', zip, ractive);
        downloads_info.memsatsvm.data = '<a href="'+file_url+result_dict.data_path+'">Memsat Output</a><br />';
      }
    }
    //mempack files
    if(result_dict.name === 'mempack_wrapper')
    {
      ractive.set("mempack_waiting_message", '');
      ractive.set("mempack_waiting_icon", '');
      ractive.set("mempack_time", '');
      let cartoon_match =  mempack_cartoon_regex.exec(result_dict.data_path);
      if(cartoon_match)
      {
        mempack_result_found = true;
        ractive.set('mempack_cartoon', '<img width="1000px" src="'+file_url+result_dict.data_path+'" />');
        downloads_info.mempack.cartoon = '<a href="'+file_url+result_dict.data_path+'">Cartoon Diagram</a><br />';
      }
      let graph_match =  mempack_graph_out.exec(result_dict.data_path);
      if(graph_match)
      {
        downloads_info.mempack.graph_out = '<a href="'+file_url+result_dict.data_path+'">Diagram Data</a><br />';
      }
      let contact_match =  mempack_contact_res.exec(result_dict.data_path);
      if(contact_match)
      {
        downloads_info.mempack.contact = '<a href="'+file_url+result_dict.data_path+'">Contact Predictions</a><br />';
      }
      let lipid_match =  mempack_lipid_res.exec(result_dict.data_path);
      if(lipid_match)
      {
        downloads_info.mempack.lipid_out = '<a href="'+file_url+result_dict.data_path+'">Lipid Exposure Preditions</a><br />';
      }

    }
    //genthreader and pgenthreader
    if(result_dict.name === 'sort_presult')
    {
      ractive.set("pgenthreader_waiting_message", '');
      ractive.set("pgenthreader_waiting_icon", '');
      ractive.set("pgenthreader_time", '');
      process_file(file_url, result_dict.data_path, 'presult', zip, ractive);
      downloads_info.pgenthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pgenthreader+' Table</a><br />';
    }
    if(result_dict.name === 'gen_sort_presults')
    {
      ractive.set("genthreader_waiting_message", '');
      ractive.set("genthreader_waiting_icon", '');
      ractive.set("genthreader_time", '');
      process_file(file_url, result_dict.data_path, 'gen_presult', zip, ractive);
      downloads_info.genthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.genthreader+' Table</a><br />';
    }
    if(result_dict.name === 'pseudo_bas_align')
    {
      downloads_info.pgenthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pgenthreader+' Alignments</a><br />';
    }
    if(result_dict.name === 'genthreader_pseudo_bas_align')
    {
      downloads_info.genthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.genthreader+' Alignments</a><br />';
    }

    //dompred files
    if(result_dict.name === 'parseds')
    {
      ractive.set("dompred_waiting_message", '');
      ractive.set("dompred_waiting_icon", '');
      ractive.set("dompred_time", '');
      let png_match = png_regex.exec(result_dict.data_path);
      if(png_match)
      {
        downloads_info.dompred.boundary_png = '<a href="'+file_url+result_dict.data_path+'">Boundary PNG</a><br />';
        ractive.set('parseds_png', '<img src="'+file_url+result_dict.data_path+'" />');
      }
      else{
        downloads_info.dompred.boundary = '<a href="'+file_url+result_dict.data_path+'">Boundary file</a><br />';
        process_file(file_url, result_dict.data_path, 'parseds', zip, ractive);
      }
    }
    if(result_dict.name === 'domssea')
    {
      let pred_match =  domssea_pred_regex.exec(result_dict.data_path);
      if(pred_match)
      {
        downloads_info.dompred.domsseapred = '<a href="'+file_url+result_dict.data_path+'">DOMSSEA predictions</a><br />';
      }
      let domssea_match =  domssea_pred_regex.exec(result_dict.data_path);
      if(domssea_match)
      {
          downloads_info.dompred.domssea = '<a href="'+file_url+result_dict.data_path+'">DOMSSEA file</a><br />';
      }

    }
  }

  //Set no found statments for some jobs.
  if(! mempack_result_found)
  {
    ractive.set('mempack_cartoon', '<h3>No packing prediction possible</h3>');
  }
}

export function set_downloads_panel(ractive, downloads_info)
{
  //console.log(downloads_info);
  let downloads_string = ractive.get('download_links');
  if('psipred' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.psipred.header);
    downloads_string = downloads_string.concat(downloads_info.psipred.horiz);
    downloads_string = downloads_string.concat(downloads_info.psipred.ss2);
    downloads_string = downloads_string.concat("<br />");
  }
  if('disopred' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.disopred.header);
    downloads_string = downloads_string.concat(downloads_info.disopred.pbdat);
    downloads_string = downloads_string.concat(downloads_info.disopred.comb);
    downloads_string = downloads_string.concat("<br />");
  }
  if('memsatsvm' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.memsatsvm.header);
    downloads_string = downloads_string.concat(downloads_info.memsatsvm.data);
    downloads_string = downloads_string.concat(downloads_info.memsatsvm.schematic);
    downloads_string = downloads_string.concat(downloads_info.memsatsvm.cartoon);
    downloads_string = downloads_string.concat("<br />");
  }
  if('pgenthreader' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.pgenthreader.header);
    downloads_string = downloads_string.concat(downloads_info.pgenthreader.table);
    downloads_string = downloads_string.concat(downloads_info.pgenthreader.align);
    downloads_string = downloads_string.concat("<br />");
  }
  if('genthreader' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.genthreader.header);
    downloads_string = downloads_string.concat(downloads_info.genthreader.table);
    downloads_string = downloads_string.concat(downloads_info.genthreader.align);
    downloads_string = downloads_string.concat("<br />");
  }
  if('mempack' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.mempack.header);
    if(downloads_info.mempack.cartoon)
    {
    downloads_string = downloads_string.concat(downloads_info.mempack.cartoon);
    downloads_string = downloads_string.concat(downloads_info.mempack.graph_out);
    downloads_string = downloads_string.concat(downloads_info.mempack.contact);
    downloads_string = downloads_string.concat(downloads_info.mempack.lipid_out);
    }
    else
    {
      downloads_string = downloads_string.concat("No packing prediction possible<br />");
    }
    downloads_string = downloads_string.concat("<br />");
  }

  ractive.set('download_links', downloads_string);
}
