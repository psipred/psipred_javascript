import { process_file } from '../requests/requests_index.js';
import { get_text } from '../requests/requests_index.js';

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
  ractive.set('dgen_table', null);
  ractive.set('dgen_ann_set', {});
  ractive.set('bioserf_model', null);
  ractive.set('domserf_buttons', '');
  ractive.set('domserf_model_uris:', []);
  ractive.set('sch_schematic:', null);
  ractive.set('aa_composition', null);
  ractive.set('global_features', null);
  ractive.set('function_tables', null);
  ractive.set('metapsicov_map', null);
  ractive.set('metsite_table', null);
  ractive.set('hspred_table', null);
  ractive.set('metsite_pdb', null);
  ractive.set('hspred_initial_pdb', null);
  ractive.set('hspred_second_pdb', null);
  ractive.set('tdb_file', null);


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
      if(job_name === 'pgenthreader' || job_name === 'dompred'  ||
         job_name === 'pdomthreader' || job_name === 'metapsicov' ||
         job_name === 'ffpred')
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
        downloads_info.bioserf = {};
        downloads_info.bioserf.header = "<h5>"+job_names.bioserf+" DOWNLOADS</h5>";
      }
      if(job_name === 'domserf')
      {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>"+job_names.psipred+" DOWNLOADS</h5>";
        downloads_info.pdomthreader= {};
        downloads_info.pdomthreader.header = "<h5>"+job_names.pdomthreader+" DOWNLOADS</h5>";
        downloads_info.domserf = {};
        downloads_info.domserf.header = "<h5>"+job_names.domserf+" DOWNLOADS</h5>";
      }
      if(job_name === 'ffpred')
      {
        downloads_info.memsatsvm = {};
        downloads_info.memsatsvm.header = "<h5>"+job_names.memsatsvm+" DOWNLOADS</h5>";
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
        downloads_info.dompred= {};
        downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
        downloads_info.ffpred = {};
        downloads_info.ffpred.header = "<h5>"+job_names.ffpred+" DOWNLOADS</h5>";
      }
    }
  });
}

//take the datablob we've got and loop over the results
export function handle_results(ractive, data, file_url, zip, downloads_info, job_names, job_list)
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
  let domssea_pred_regex = /\.pred$/;
  let domssea_regex = /\.domssea$/;
  let domserf_regex = /.+_(\d+)_(\d+).*\.pdb/;
  let ffpred_sch_regex = /.+_sch\.png/;
  let ffpred_svm_regex = /.+_cartoon_memsat_svm_.*\.png/;
  let ffpred_schematic_regex = /.+_schematic_.*\.png/;
  let ffpred_tm_regex = /.+_tmp\.png/;
  let ffpred_featcfg_regex = /\.featcfg/;
  let ffpred_preds_regex = /\.full_raw/;
  let metapsicov_ev_regex = /\.evfold/;
  let metapsicov_psicov_regex = /\.psicov/;
  let metapsicov_ccmpred_regex = /\.ccmpred/;
  let metsite_table_regex = /\.Metpred/;
  let metsite_pdb_regex = /\.MetPred/;
  let hspred_initial_regex = /_initial\.pdb/;
  let hspred_second_regex = /_second\.pdb/;

  let image_regex = '';
  let results = data.results;
  let domain_count = 0;
  let metsite_checkchains_seen = false;
  let hspred_checkchains_seen = false;
  let gentdb_checkchains_seen = false;
  let results_found = {
      psipred: false,
      disopred: false,
      memsatsvm: false,
      pgenthreader: false,
      metapsicov: false,
      mempack: false,
      genthreader: false,
      dompred: false,
      pdomthreader: false,
      bioserf: false,
      domserf: false,
      ffpred: false,
      metsite: false,
      hspred: false,
      memembed: false,
      gentdb: false,
  };
  let reformat_domserf_models_found = false;

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
    if(result_dict.name === 'GenAlignmentAnnotation_dom')
    {
        let ann_set = ractive.get("dgen_ann_set");
        let tmp = result_dict.data_path;
        let path = tmp.substr(0, tmp.lastIndexOf("."));
        let id = path.substr(path.lastIndexOf(".")+1, path.length);
        ann_set[id] = {};
        ann_set[id].ann = path+".ann";
        ann_set[id].aln = path+".aln";
        ractive.set("dgen_ann_set", ann_set);
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
      results_found.psipred = true;
      let match = horiz_regex.exec(result_dict.data_path);
      if(match)
      {
        process_file(file_url, result_dict.data_path, 'horiz', zip, ractive);
        ractive.set("psipred_waiting_message", '');
        ractive.set("psipred_waiting_icon", '');
        ractive.set("psipred_time", '');
        downloads_info.psipred.horiz = '<a href="'+file_url+result_dict.data_path+'">Horiz Format Output</a><br />';

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
      results_found.disopred = true;
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
      results_found.memsatsvm = true;
      ractive.set("memsatsvm_waiting_message", '');
      ractive.set("memsatsvm_waiting_icon", '');
      ractive.set("memsatsvm_time", '');
      let scheme_match = memsat_schematic_regex.exec(result_dict.data_path);
      if(scheme_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('memsatsvm_schematic', '<img src="'+file_url+result_dict.data_path+'" />');
        downloads_info.memsatsvm.schematic = '<a href="'+file_url+result_dict.data_path+'">Schematic Diagram</a><br />';
      }
      let cartoon_match = memsat_cartoon_regex.exec(result_dict.data_path);
      if(cartoon_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('memsatsvm_cartoon', '<img src="'+file_url+result_dict.data_path+'" />');
        downloads_info.memsatsvm.cartoon = '<a href="'+file_url+result_dict.data_path+'">Cartoon Diagram</a><br />';
      }
      let memsat_match = memsat_data_regex.exec(result_dict.data_path);
      if(memsat_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        process_file(file_url, result_dict.data_path, 'memsatdata', zip, ractive);
        downloads_info.memsatsvm.data = '<a href="'+file_url+result_dict.data_path+'">Memsat Output</a><br />';
      }
    }
    //mempack files
    if(result_dict.name === 'mempack_wrapper')
    {
      results_found.mempack = true;
      ractive.set("mempack_waiting_message", '');
      ractive.set("mempack_waiting_icon", '');
      ractive.set("mempack_time", '');
      let cartoon_match =  mempack_cartoon_regex.exec(result_dict.data_path);
      if(cartoon_match)
      {
        mempack_result_found = true;
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('mempack_cartoon', '<img width="1000px" src="'+file_url+result_dict.data_path+'" />');
        downloads_info.mempack.cartoon = '<a href="'+file_url+result_dict.data_path+'">Cartoon Diagram</a><br />';
      }
      let graph_match =  mempack_graph_out.exec(result_dict.data_path);
      if(graph_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.graph_out = '<a href="'+file_url+result_dict.data_path+'">Diagram Data</a><br />';
      }
      let contact_match =  mempack_contact_res.exec(result_dict.data_path);
      if(contact_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.contact = '<a href="'+file_url+result_dict.data_path+'">Contact Predictions</a><br />';
      }
      let lipid_match =  mempack_lipid_res.exec(result_dict.data_path);
      if(lipid_match)
      {
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.lipid_out = '<a href="'+file_url+result_dict.data_path+'">Lipid Exposure Preditions</a><br />';
      }

    }
    //genthreader and pgenthreader
    if(result_dict.name === 'sort_presult')
    {
      results_found.pgenthreader = true;
      ractive.set("pgenthreader_waiting_message", '');
      ractive.set("pgenthreader_waiting_icon", '');
      ractive.set("pgenthreader_time", '');
      process_file(file_url, result_dict.data_path, 'presult', zip, ractive);
      downloads_info.pgenthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pgenthreader+' Table</a><br />';
    }
    if(result_dict.name === 'gen_sort_presults')
    {
      results_found.genthreader = true;
      ractive.set("genthreader_waiting_message", '');
      ractive.set("genthreader_waiting_icon", '');
      ractive.set("genthreader_time", '');
      process_file(file_url, result_dict.data_path, 'gen_presult', zip, ractive);
      downloads_info.genthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.genthreader+' Table</a><br />';
    }
    if(result_dict.name === 'dom_sort_presults')
    {
      results_found.pdomthreader = true;
      ractive.set("pdomthreader_waiting_message", '');
      ractive.set("pdomthreader_waiting_icon", '');
      ractive.set("pdomthreader_time", '');
      process_file(file_url, result_dict.data_path, 'dom_presult', zip, ractive);
      downloads_info.pdomthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pdomthreader+' Table</a><br />';
    }

    if(result_dict.name === 'pseudo_bas_align')
    {
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pgenthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pgenthreader+' Alignments</a><br />';
    }
    if(result_dict.name === 'pseudo_bas_models')
    {
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pgenthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pgenthreader+' Alignments</a><br />';
    }

    if(result_dict.name === 'genthreader_pseudo_bas_align')
    {
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.genthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.genthreader+' Alignments</a><br />';
    }
    //pdomthreader
    // if(result_dict.name === 'svm_prob_dom')
    // {
    //   pdomthreader_result_found = true;
    //   ractive.set("pdomthreader_waiting_message", '');
    //   ractive.set("pdomthreader_waiting_icon", '');
    //   ractive.set("pdomthreader_time", '');
    //   process_file(file_url, result_dict.data_path, 'dom_presult', zip, ractive);
    //   downloads_info.pdomthreader.table = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pdomthreader+' Table</a><br />';
    // }
    if(result_dict.name === 'pseudo_bas_dom_align')
    {
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pdomthreader.align = '<a href="'+file_url+result_dict.data_path+'">'+job_names.pdomthreader+' Alignments</a><br />';
    }
    //dompred files
    if(result_dict.name === 'parseds')
    {
      results_found.dompred = true;
      ractive.set("dompred_waiting_message", '');
      ractive.set("dompred_waiting_icon", '');
      ractive.set("dompred_time", '');
      let png_match = png_regex.exec(result_dict.data_path);
      if(png_match)
      {
        downloads_info.dompred.boundary_png = '<a href="'+file_url+result_dict.data_path+'">Boundary PNG</a><br />';
        ractive.set('parseds_png', '<img src="'+file_url+result_dict.data_path+'" />');
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
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
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.dompred.domsseapred = '<a href="'+file_url+result_dict.data_path+'">DOMSSEA predictions</a><br />';
      }
      let domssea_match =  domssea_pred_regex.exec(result_dict.data_path);
      if(domssea_match)
      {
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
          downloads_info.dompred.domssea = '<a href="'+file_url+result_dict.data_path+'">DOMSSEA file</a><br />';
      }
    }
    if(result_dict.name === 'runBioserf')
    {
      results_found.bioserf = true;
      ractive.set("bioserf_waiting_message", '');
      ractive.set("bioserf_waiting_icon", '');
      ractive.set("bioserf_time", '');
      downloads_info.bioserf.model = '<a href="'+file_url+result_dict.data_path+'">Final Homology Model</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      display_structure(file_url+result_dict.data_path, '#bioserf_model', true);
    }
    if(result_dict.name === 'hhblits_pdb70')
    {
      downloads_info.bioserf.hhblits = '<a href="'+file_url+result_dict.data_path+'">HHSearch Results</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if(result_dict.name === 'pgpblast_pdbaa')
    {
      downloads_info.bioserf.pdbaa = '<a href="'+file_url+result_dict.data_path+'">PDBaa Blast</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if(result_dict.name === 'psiblast_cath')
    {
      downloads_info.domserf.cathblast = '<a href="'+file_url+result_dict.data_path+'">CATH Blast</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if(result_dict.name === 'psiblast_pdbaa')
    {
      downloads_info.domserf.pdbblast = '<a href="'+file_url+result_dict.data_path+'">PDBaa Blast</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if(result_dict.name === 'reformat_domserf_models' || result_dict.name === "parse_pdb_blast")
    {
      let domserf_match = domserf_regex.exec(result_dict.data_path);
      if(domserf_match)
      {
        ractive.set("domserf_waiting_message", '');
        ractive.set("domserf_waiting_icon", '');
        ractive.set("domserf_time", '');
        // TO DO ADD REGEX
        domain_count+=1;
        results_found.domserf = true;
        if(downloads_info.domserf.model){
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
          downloads_info.domserf.model += '<a href="'+file_url+result_dict.data_path+'">Model '+domserf_match[1]+'-'+domserf_match[2]+'</a><br />';
        }
        else {
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
          downloads_info.domserf.model = '<a href="'+file_url+result_dict.data_path+'">Model '+domserf_match[1]+'-'+domserf_match[2]+'</a><br />';
        }
        let buttons_tags = ractive.get("domserf_buttons");
        buttons_tags += '<button onClick="psipred.swapDomserf('+domain_count+')" type="button" class="btn btn-default">Domain '+domserf_match[1]+'-'+domserf_match[2]+'</button>';
        ractive.set("domserf_buttons", buttons_tags);
        let paths = ractive.get("domserf_model_uris");
        paths.push(file_url+result_dict.data_path);
        ractive.set("domserf_model_uris", paths);
      }
    }

    if(result_dict.name === 'getSchematic')
    {
      results_found.ffpred = true;
      ractive.set("ffpred_waiting_message", '');
      ractive.set("ffpred_waiting_icon", '');
      ractive.set("ffpred_time", '');

      let sch_match =  ffpred_sch_regex.exec(result_dict.data_path);
      if(sch_match)
      {
        downloads_info.ffpred.sch = '<a href="'+file_url+result_dict.data_path+'">Feature Schematic PNG</a><br />';
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('sch_schematic', '<b>Sequence Feature Map</b><br />Position dependent feature predictions are mapped onto the sequence schematic shown below. The line height of the Phosphorylation and Glycosylation features reflects the confidence of the residue prediction.<br /><img src="'+file_url+result_dict.data_path+'" />');
      }
      let cartoon_match =  ffpred_svm_regex.exec(result_dict.data_path);
      if(cartoon_match)
      {
        downloads_info.ffpred.cartoon = '<a href="'+file_url+result_dict.data_path+'">Memsat PNG</a><br />';
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('ffpred_cartoon', '<b>Predicted Transmembrane Topology</b><br /><img src="'+file_url+result_dict.data_path+'" />');
      }
    }

    if(result_dict.name === 'features')
    {
      let feat_match = ffpred_featcfg_regex.exec(result_dict.data_path);
      if(feat_match)
      {
        downloads_info.ffpred.features = '<a href="'+file_url+result_dict.data_path+'">Sequence Feature Summary</a><br />';
        process_file(file_url, result_dict.data_path, 'ffpredfeatures', zip, ractive);
      }
    }

    if(result_dict.name === 'ffpred')
    {
      let preds_match = ffpred_preds_regex.exec(result_dict.data_path);
      if(preds_match)
      {
        downloads_info.ffpred.preds = '<a href="'+file_url+result_dict.data_path+'">GO Predictions</a><br />';
        process_file(file_url, result_dict.data_path, 'ffpredpredictions', zip, ractive);
      }
    }

    if(result_dict.name === 'plot_self_contact_map')
    {
      results_found.metapsicov = true;
      ractive.set("metapsicov_waiting_message", '');
      ractive.set("metapsicov_waiting_icon", '');
      ractive.set("metapsicov_time", '');
      downloads_info.metapsicov.map = '<a href="'+file_url+result_dict.data_path+'">Contact Map</a><br />';
      ractive.set('metapsicov_map', '<b>Contact Map</b><br /><img height="800" width="800" src="'+file_url+result_dict.data_path+'">');
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if(result_dict.name === 'contact_predictors')
    {
        // let metapsicov_ev_regex = /\.evfold/;
        // let metapsicov_psicov_regex = /\.psicov/;
        // let metapsicov_ccmpred_regex = /\.ccmpred/;
        let ev_match = metapsicov_ev_regex.exec(result_dict.data_path);
        if(ev_match)
        {
          downloads_info.metapsicov.freecontact = '<a href="'+file_url+result_dict.data_path+'">FreeContact predictions</a><br />';
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        }
        let ps_match = metapsicov_psicov_regex.exec(result_dict.data_path);
        if(ps_match)
        {
          downloads_info.metapsicov.psicov = '<a href="'+file_url+result_dict.data_path+'">PSICOV predictions</a><br />';
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        }
        let cc_match = metapsicov_ccmpred_regex.exec(result_dict.data_path);
        if(cc_match)
        {
          downloads_info.metapsicov.ccmpred = '<a href="'+file_url+result_dict.data_path+'">CCMPRED predictions</a><br />';
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
        }

    }
    if(result_dict.name  === 'metapsicov_stage2')
    {
      downloads_info.metapsicov.preds = '<a href="'+file_url+result_dict.data_path+'">Contact Predictions</a><br />';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
    }

    if(result_dict.name === 'metsite_checkchains')
    {
        metsite_checkchains_seen = true;
    }
    if(result_dict.name === 'metpred_wrapper')
    {
      let table_match = metsite_table_regex.exec(result_dict.data_path);
      let pdb_match = metsite_pdb_regex.exec(result_dict.data_path);
      results_found.metsite = true;
      ractive.set("metsite_waiting_message", '');
      ractive.set("metsite_waiting_icon", '');
      ractive.set("metsite_time", '');
      if(table_match)
      {
        downloads_info.metsite.table = '<a href="'+file_url+result_dict.data_path+'">Metsite Table</a><br />';
        process_file(file_url, result_dict.data_path, 'metsite', zip, ractive);

      }
      if(pdb_match)
      {
        downloads_info.metsite.pdb = '<a href="'+file_url+result_dict.data_path+'">Metsite PDB</a><br />';
        ractive.set('metsite_pdb', file_url+result_dict.data_path);
        display_structure(file_url+result_dict.data_path, '#metsite_model', false);
        process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      }
    }
    if(result_dict.name === 'hspred_checkchains')
    {
      hspred_checkchains_seen = true;
    }
    if(result_dict.name === 'hs_pred')
    {
        results_found.hspred = true;
        ractive.set("hspred_waiting_message", '');
        ractive.set("hspred_waiting_icon", '');
        ractive.set("hspred_time", '');
        downloads_info.hspred.table = '<a href="'+file_url+result_dict.data_path+'">HSPred Table</a><br />';
        process_file(file_url, result_dict.data_path, 'hspred', zip, ractive);
    }
    if(result_dict.name === 'split_pdb_files')
    {
      let initial_match = hspred_initial_regex.exec(result_dict.data_path);
      let second_match = hspred_second_regex.exec(result_dict.data_path);
      if(initial_match)
      {
          downloads_info.hspred.initial = '<a href="'+file_url+result_dict.data_path+'">Initial PDB</a><br />';
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
          ractive.set('hspred_initial_pdb', file_url+result_dict.data_path);
          display_structure(file_url+result_dict.data_path, '#hspred_initial_model', false);
      }
      if(second_match)
      {
          downloads_info.hspred.second = '<a href="'+file_url+result_dict.data_path+'">Second PDB</a><br />';
          process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
          ractive.set('hspred_second_pdb', file_url+result_dict.data_path);
          display_structure(file_url+result_dict.data_path, '#hspred_second_model', false);
      }
    }
    if(result_dict.name === 'check_pdb_tdb'){
      gentdb_checkchains_seen = true;
    }
    if(result_dict.name === 'maketdb')
    {
      results_found.gentdb = true;
      ractive.set("gentdb_waiting_message", '');
      ractive.set("gentdb_waiting_icon", '');
      ractive.set("gentdb_time", '');
      downloads_info.gentdb.tdb = '<a href="'+file_url+result_dict.data_path+'">TDB File</a>';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      ractive.set('tdb_file', '<h3><a href="'+file_url+result_dict.data_path+'">Click here to download your TDB File</a></h3>');
    }
    if(result_dict.name === 'memembed')
    {
      results_found.memembed = true;
      ractive.set("memembed_waiting_message", '');
      ractive.set("memembed_waiting_icon", '');
      ractive.set("memembed_time", '');
      downloads_info.memembed.pdb = '<a href="'+file_url+result_dict.data_path+'">Memembed PDB file</a>';
      process_file(file_url, result_dict.data_path, 'zip', zip, ractive);
      display_structure(file_url+result_dict.data_path, '#memembed_model', false);
      ractive.set('memembed_pdb', file_url+result_dict.data_path);
    }

  }

  job_list.forEach(function(job_name){
    if(! results_found[job_name])
    {
    ractive.set(job_name+"_waiting_message", 'The job completed succesful but no prediction was possible for the input data. No '+job_names[job_name]+' data generated for this job');
    ractive.set(job_name+"_waiting_icon", '');
    ractive.set(job_name+"_time", '');
    }
  });
  if(! results_found.mempack)
  {
    ractive.set('mempack_cartoon', '<h3>No packing prediction possible</h3>');
  }
  if(metsite_checkchains_seen && ! results_found.metsite)
  {
    ractive.set("metsite_waiting_message", 'We could not find the PDB Chain ID provided');

  }
  if(hspred_checkchains_seen && ! results_found.hspred)
  {
    ractive.set("hspred_waiting_message", 'We could not find the PDB Chain IDs provided');
  }
  if(gentdb_checkchains_seen && ! results_found.gentdb)
  {
    ractive.set("gentdb_waiting_message", 'PDB provided did not contain a single chain labled as chain A');
  }


  if(results_found.domserf)
  {
    let paths = ractive.get("domserf_model_uris");
    display_structure(paths[0], '#domserf_model', true);
  }
}

export function display_structure(uri, css_id, cartoon)
{
  let cartoon_color = function(atom) {
    if(atom.ss === 'h'){return '#e353e3';}
    if(atom.ss === 's'){return '#e5dd55';}
    return('grey');
  };
  let hotspot_color = function(atom){
    if(atom.b == 1.0){return 'red';}
    if(atom.b == 0.5){return 'black';}
    if(atom.b == 50){return 'white';}
    if(atom.b == 100){return 'red';}
    return("blue");
  };
  console.log("LOADING: "+uri);
  let element = $(css_id);
  let config = { backgroundColor: '#ffffff' };
  let viewer = $3Dmol.createViewer( element, config );
  let data = get_text(uri, "GET", {});
  viewer.addModel( data, "pdb" );                       /* load data */
  if(cartoon)
  {
    viewer.setStyle({}, {cartoon: {colorfunc: cartoon_color}});  /* style all atoms */
  }
  else {
    viewer.setStyle({}, {cartoon: {colorfunc: hotspot_color}});  /* style all atoms */
  }
  if(css_id.startsWith('#memembed')){
    viewer.addSurface($3Dmol.SurfaceType.VDW, {'opacity':0.8, colorscheme: 'whiteCarbon'}, {hetflag:true},{});
  }
  viewer.zoomTo();                                      /* set camera */
  viewer.render();                                      /* render scene */
  viewer.zoom(1.7, 3000);
}

export function set_downloads_panel(ractive, downloads_info)
{
  //console.log(downloads_info);
  let downloads_string = ractive.get('download_links');
  if('psipred' in downloads_info)
  {
    if(downloads_info.psipred.horiz){
    downloads_string = downloads_string.concat(downloads_info.psipred.header);
    downloads_string = downloads_string.concat(downloads_info.psipred.horiz);
    downloads_string = downloads_string.concat(downloads_info.psipred.ss2);
    downloads_string = downloads_string.concat("<br />");}
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
  if('pdomthreader' in downloads_info)
  {
    if(downloads_info.pdomthreader.table){
    downloads_string = downloads_string.concat(downloads_info.pdomthreader.header);
    downloads_string = downloads_string.concat(downloads_info.pdomthreader.table);
    downloads_string = downloads_string.concat(downloads_info.pdomthreader.align);
    downloads_string = downloads_string.concat("<br />");
    }
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
  if('bioserf' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.bioserf.header);
    downloads_string = downloads_string.concat(downloads_info.bioserf.model);
    downloads_string = downloads_string.concat(downloads_info.bioserf.hhblits);
    downloads_string = downloads_string.concat(downloads_info.bioserf.pdbaa);
    downloads_string = downloads_string.concat("<br />");
  }
  if('domserf' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.domserf.header);
    downloads_string = downloads_string.concat(downloads_info.domserf.model);
    downloads_string = downloads_string.concat(downloads_info.domserf.cathblast);
    downloads_string = downloads_string.concat(downloads_info.domserf.pdbblast);
    downloads_string = downloads_string.concat("<br />");
  }
  if('ffpred' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.ffpred.header);
    downloads_string = downloads_string.concat(downloads_info.ffpred.sch);
    downloads_string = downloads_string.concat(downloads_info.ffpred.cartoon);
    downloads_string = downloads_string.concat(downloads_info.ffpred.features);
    downloads_string = downloads_string.concat(downloads_info.ffpred.preds);
    downloads_string = downloads_string.concat("<br />");
  }
  if('metapsicov' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.metapsicov.header);
    downloads_string = downloads_string.concat(downloads_info.metapsicov.preds);
    downloads_string = downloads_string.concat(downloads_info.metapsicov.map);
    downloads_string = downloads_string.concat(downloads_info.metapsicov.psicov);
    downloads_string = downloads_string.concat(downloads_info.metapsicov.freecontact);
    downloads_string = downloads_string.concat(downloads_info.metapsicov.ccmpred);
    downloads_string = downloads_string.concat("<br />");
  }
  if('metsite' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.metsite.header);
    downloads_string = downloads_string.concat(downloads_info.metsite.table);
    downloads_string = downloads_string.concat(downloads_info.metsite.pdb);
    downloads_string = downloads_string.concat("<br />");
  }
  if('hspred' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.hspred.header);
    downloads_string = downloads_string.concat(downloads_info.hspred.table);
    downloads_string = downloads_string.concat(downloads_info.hspred.initial);
    downloads_string = downloads_string.concat(downloads_info.hspred.second);
    downloads_string = downloads_string.concat("<br />");
  }
  if('gentdb' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.gentdb.header);
    downloads_string = downloads_string.concat(downloads_info.gentdb.tdb);
    downloads_string = downloads_string.concat("<br />");
  }
  if('memembed' in downloads_info)
  {
    downloads_string = downloads_string.concat(downloads_info.memembed.header);
    downloads_string = downloads_string.concat(downloads_info.memembed.pdb);
    downloads_string = downloads_string.concat("<br />");
  }

  ractive.set('download_links', downloads_string);
}


export function set_advanced_params()
{
  let options_data = {};
  try{
    options_data.psiblast_dompred_evalue = document.getElementById("dompred_e_value_cutoff").value;
  }
  catch(err) {
    options_data.psiblast_dompred_evalue = "0.01";
  }
  try{
    options_data.psiblast_dompred_iterations = document.getElementById("dompred_psiblast_iterations").value;
  }
  catch(err) {
    options_data.psiblast_dompred_iterations = 5;
  }

  try{
    options_data.bioserf_modeller_key = document.getElementById("bioserf_modeller_key").value;
  }
  catch(err) {
    options_data.bioserf_modeller_key = "";
  }
  try{
    options_data.domserf_modeller_key = document.getElementById("domserf_modeller_key").value;
  }
  catch(err) {
    options_data.domserf_modeller_key = "";
  }
  try{
    if(document.getElementById("ffpred_fly").checked)
    {  options_data.ffpred_selection = "fly";}
    else
    {options_data.ffpred_selection = "human";}
  }
  catch(err) {
    options_data.ffpred_selection = "human";
  }
  try{
    options_data.metsite_checkchains_chain = document.getElementById("metsite_chain_id").value;
    options_data.extract_fasta_chain = document.getElementById("metsite_chain_id").value;
    options_data.seedSiteFind_chain = document.getElementById("metsite_chain_id").value;
    options_data.metpred_wrapper_chain = document.getElementById("metsite_chain_id").value;
  }
  catch(err) {
    options_data.metsite_checkchains_chain = "A";
    options_data.extract_fasta_chain = "A";
    options_data.seedSiteFind_chain = "A";
    options_data.metpred_wrapper_chain = "A";
  }
  try{
    options_data.seedSiteFind_metal = document.getElementById("metsite_metal_type").value;
    options_data.metpred_wrapper_metal = document.getElementById("metsite_metal_type").value;
  }
  catch(err) {
    options_data.seedSiteFind_metal = "Ca";
    options_data.metpred_wrapper_metal = "Ca";
  }
  try{
    options_data.metpred_wrapper_fpr = document.getElementById("metsite_fpr").value;
  }
  catch(err) {
    options_data.metpred_wrapper_fpr = "5";
  }

  try{
    options_data.hspred_checkchains_chains = document.getElementById("hspred_protein_1").value+document.getElementById("hspred_protein_2").value;
  }
  catch(err) {
    options_data.hspred_checkchains_chains = "AB";
  }
  try{
    options_data.hs_pred_first_chain = document.getElementById("hspred_protein_1").value;
    options_data.split_pdb_files_first_chain =  document.getElementById("hspred_protein_1").value;
  }
  catch(err) {
    options_data.hs_pred_first_chain = "A";
    options_data.split_pdb_files_first_chain = "A";
  }
  try{
    options_data.hs_pred_second_chain = document.getElementById("hspred_protein_2").value;
    options_data.split_pdb_files_second_chain = document.getElementById("hspred_protein_2").value;
  }
  catch(err) {
    options_data.hs_pred_first_chain = "B";
    options_data.split_pdb_files_first_chain = "B";
  }

  try{
    options_data.memembed_algorithm = document.getElementById("memembed_algorithm").value;
    if(document.getElementById("memembed_barrel_yes").checked){
      options_data.memembed_barrel = 'TRUE';
    }else{
      options_data.memembed_barrel = 'FALSE';
    }
    if(document.getElementById("memembed_terminal_in").checked)
    {
      options_data.memembed_termini = "in";
    }
    else
    {
      options_data.memembed_termini = "out";
    }
    //options_data. = document.getElementById("memembed_boundaries");
  }
  catch(err)
  {
    options_data.memembed_barrel = 'FALSE';
    options_data.memembed_termini = "in";
    options_data.memembed_algorithm = 0;
  }

  return(options_data);
}
