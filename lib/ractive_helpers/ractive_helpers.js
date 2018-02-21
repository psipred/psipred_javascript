import { process_file } from '../requests/requests_index.js';

//before a resubmission is sent all variables are reset to the page defaults
export function clear_settings(ractive, gear_string){
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  ractive.set('psipred_waiting_message', '<h2>Please wait for your PSIPRED job to process</h2>');
  ractive.set('psipred_waiting_icon', gear_string);
  ractive.set('psipred_time', 'Loading Data');
  ractive.set('psipred_horiz',null);
  ractive.set('disopred_waiting_message', '<h2>Please wait for your DISOPRED job to process</h2>');
  ractive.set('disopred_waiting_icon', gear_string);
  ractive.set('disopred_time', 'Loading Data');
  ractive.set('diso_precision');
  ractive.set('memsatsvm_waiting_message', '<h2>Please wait for your MEMSAT-SVM job to process</h2>');
  ractive.set('memsatsvm_waiting_icon', gear_string);
  ractive.set('memsatsvm_time', 'Loading Data');
  ractive.set('memsatsvm_schematic', '');
  ractive.set('memsatsvm_cartoon', '');
  ractive.set('pgenthreader_waiting_message', '<h2>Please wait for your pGenTHREADER job to process</h2>');
  ractive.set('pgenthreader_waiting_icon', gear_string);
  ractive.set('pgenthreader_time', 'Loading Data');
  ractive.set('pgen_table', '');
  ractive.set('pgen_set', {});

  ractive.set('mempack_waiting_message', '<h2>Please wait for your MEMPACK job to process</h2>');
  ractive.set('mempack_waiting_icon', gear_string);
  ractive.set('mempack_time', 'Loading Data');
  ractive.set('genthreader_waiting_message', '<h2>Please wait for your GenTHREADER job to process</h2>');
  ractive.set('genthreader_waiting_icon', gear_string);
  ractive.set('genthreader_time', 'Loading Data');
  ractive.set('dompred_waiting_message', '<h2>Please wait for your DomPRED job to process</h2>');
  ractive.set('dompred_waiting_icon', gear_string);
  ractive.set('dompred_time', 'Loading Data');
  ractive.set('pdomthreader_waiting_message', '<h2>Please wait for your pDomTHREADER job to process</h2>');
  ractive.set('pdomthreader_waiting_icon', gear_string);
  ractive.set('pdomthreader_time', 'Loading Data');
  ractive.set('bioserf_waiting_message', '<h2>Please wait for your BioSerf job to process</h2>');
  ractive.set('bioserf_waiting_icon', gear_string);
  ractive.set('bioserf_time', 'Loading Data');
  ractive.set('domserf_waiting_message', '<h2>Please wait for your DomSerf job to process</h2>');
  ractive.set('domserf_waiting_icon', gear_string);
  ractive.set('domserf_time', 'Loading Data');
  ractive.set('ffpred_waiting_message', '<h2>Please wait for your FFPred job to process</h2>');
  ractive.set('ffpred_waiting_icon', gear_string);
  ractive.set('ffpred_time', 'Loading Data');
  ractive.set('metapsicov_waiting_message', '<h2>Please wait for your MetaPSICOV job to process</h2>');
  ractive.set('metapsicov_waiting_icon', gear_string);
  ractive.set('metapsicov_time', 'Loading Data');
  ractive.set('metsite_waiting_message', '<h2>Please wait for your MetSite job to process</h2>');
  ractive.set('metsite_waiting_icon', gear_string);
  ractive.set('metsite_time', 'Loading Data');
  ractive.set('hspred_waiting_message', '<h2>Please wait for your HSPred job to process</h2>');
  ractive.set('hspred_waiting_icon', gear_string);
  ractive.set('hspred_time', 'Loading Data');
  ractive.set('memembed_waiting_message', '<h2>Please wait for your MEMEMBED job to process</h2>');
  ractive.set('memembed_waiting_icon', gear_string);
  ractive.set('memembed_time', 'Loading Data');
  ractive.set('gentdb_waiting_message', '<h2>Please wait for your TDB generation job to process</h2>');
  ractive.set('gentdb_waiting_icon', gear_string);
  ractive.set('gentdb_time', 'Loading Data');

  //ractive.set('diso_precision');
  ractive.set('annotations',null);
  ractive.set('batch_uuid',null);
  biod3.clearSelection('div.sequence_plot');
  biod3.clearSelection('div.psipred_cartoon');
  biod3.clearSelection('div.comb_plot');

  zip = new JSZip();
}

//Take a couple of variables and prepare the html strings for the downloads panel
export function prepare_downloads_html(data, downloads_info)
{
  if(data.job_name.includes('psipred'))
  {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
  }
  if(data.job_name.includes('disopred'))
  {
    downloads_info.disopred = {};
    downloads_info.disopred.header = "<h5>DisoPredD DOWNLOADS</h5>";
  }
  if(data.job_name.includes('memsatsvm'))
  {
    downloads_info.memsatsvm= {};
    downloads_info.memsatsvm.header = "<h5>MEMSATSVM DOWNLOADS</h5>";
  }
  if(data.job_name.includes('pgenthreader'))
  {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pgenthreader= {};
    downloads_info.pgenthreader.header = "<h5>pGenTHREADER DOWNLOADS</h5>";
  }
  if(data.job_name.includes('mempack')){
    downloads_info.mempack = {};
    downloads_info.psipred.header = "<h5>MEMPACK DOWNLOADS</h5>";
  }
  if(data.job_name.includes('genthreader')){
    downloads_info.genthreader= {};
    downloads_info.genthreader.header = "<h5>GenTHREADER DOWNLOADS</h5>";
  }
  if(data.job_name.includes('dompred')){
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.dompred= {};
    downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
  }
  if(data.job_name.includes('pdomthreader')){
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pdomthreader= {};
    downloads_info.pdomthreader.header = "<h5>pDomTHREADER DOWNLOADS</h5>";
  }
  if(data.job_name.includes('bioserf')){
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pgenthreader= {};
    downloads_info.pgenthreader.header = "<h5>pGenTHREADER DOWNLOADS</h5>";
    downloads_info.bioserf= {};
    downloads_info.bioserf.header = "<h5>BioSerf DOWNLOADS</h5>";
  }
  if(data.job_name.includes('domserf')){
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pdomthreader= {};
    downloads_info.pdomthreader.header = "<h5>pDomTHREADER DOWNLOADS</h5>";
    downloads_info.domserf= {};
    downloads_info.domserf.header = "<h5>DomSerf DOWNLOADS</h5>";
  }
  if(data.job_name.includes('ffpred')){
    downloads_info.disopred = {};
    downloads_info.disopred.header = "<h5>DisoPredD DOWNLOADS</h5>";
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.dompred= {};
    downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
    downloads_info.ffpred= {};
    downloads_info.ffpred.header = "<h5>FFPred DOWNLOADS</h5>";
  }
  if(data.job_name.includes('metapsicov')){
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.metapsicov= {};
    downloads_info.metapsicov.header = "<h5>MetaPSICOV DOWNLOADS</h5>";
  }
  if(data.job_name.includes('metsite')){
    downloads_info.metsite = {};
    downloads_info.metsite.header = "<h5>Metsite DOWNLOADS</h5>";
  }
  if(data.job_name.includes('hspred')){
    downloads_info.hspred = {};
    downloads_info.hspred.header = "<h5>HSPred DOWNLOADS</h5>";
  }
  if(data.job_name.includes('memembed')){
    downloads_info.memembed = {};
    downloads_info.memembed.header = "<h5>MEMEMBED DOWNLOADS</h5>";
  }
  if(data.job_name.includes('gentdb')){
    downloads_info.gentdb = {};
    downloads_info.gentdb.header = "<h5>TDB DOWNLOAD</h5>";
  }

}

//take the datablob we've got and loop over the results
export function handle_results(ractive, data, file_url, zip, downloads_info)
{
  let horiz_regex = /\.horiz$/;
  let ss2_regex = /\.ss2$/;
  let memsat_cartoon_regex = /_cartoon_memsat_svm\.png$/;
  let memsat_schematic_regex = /_schematic\.png$/;
  let memsat_data_regex = /memsat_svm$/;
  let image_regex = '';
  let results = data.results;
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
  }

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
    if(result_dict.name === 'sort_presult')
    {
      ractive.set("pgenthreader_waiting_message", '');
      ractive.set("pgenthreader_waiting_icon", '');
      ractive.set("pgenthreader_time", '');
      process_file(file_url, result_dict.data_path, 'presult', zip, ractive);
      downloads_info.pgenthreader.table = '<a href="'+file_url+result_dict.data_path+'">pGenTHREADER Table</a><br />';
      }
    if(result_dict.name === 'pseudo_bas_align')
    {
      downloads_info.pgenthreader.align = '<a href="'+file_url+result_dict.data_path+'">pGenTHREADER Alignments</a><br />';
    }
  }
}

export function set_downloads_panel(ractive, downloads_info)
{
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
  ractive.set('download_links', downloads_string);
}
