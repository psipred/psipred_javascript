/* 1. Catch form input
     2. Verify form
     3. If good then make file from data and pass to backend
     4. shrink form away
     5. Open seq panel
     6. Show processing animation
     7. listen for result
*/
import { verify_and_send_form } from './forms/forms_index.js';
import { send_request } from './requests/requests_index.js';
import { get_previous_data } from './requests/requests_index.js';
import { draw_empty_annotation_panel } from './common/common_index.js';
import { getUrlVars } from './common/common_index.js';
import { parseMSA } from './common/common_index.js';
import { set_advanced_params } from './ractive_helpers/ractive_helpers.js';
import { clear_settings } from './ractive_helpers/ractive_helpers.js';
import { prepare_downloads_html } from './ractive_helpers/ractive_helpers.js';
import { handle_results } from './ractive_helpers/ractive_helpers.js';
import { set_downloads_panel } from './ractive_helpers/ractive_helpers.js';
import { show_panel } from './ractive_helpers/ractive_helpers.js';
import { display_structure } from './ractive_helpers/ractive_helpers.js';

var clipboard = new Clipboard('.copyButton');
var zip = new JSZip();

clipboard.on('success', function(e) {
    console.log(e);
});
clipboard.on('error', function(e) {
    console.log(e);
});

// SET ENDPOINTS FOR DEV, STAGING OR PROD
let endpoints_url = null;
let submit_url = null;
let times_url = null;
let gears_svg = "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg";
let main_url = "http://bioinf.cs.ucl.ac.uk";
let app_path = "/psipred_beta";
let file_url = '';
let gear_string = '<object width="140" height="140" type="image/svg+xml" data="'+gears_svg+'"></object>';
let job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack",
                "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf",
                "domserf", "ffpred", "metsite", "hspred", "memembed", "gentdb"];
let seq_job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack",
                    "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf",
                    "domserf", "ffpred",];
let struct_job_list = ["metsite", "hspred", "memembed", "gentdb"];
let job_names = {
  'psipred': 'PSIPRED V4.0',
  'disopred': 'DIOSPRED 3',
  'memsatsvm': 'MEMSAT-SVM',
  'pgenthreader': 'pGenTHREADER',
  'mempack': 'MEMPACK',
  'genthreader': 'GenTHREADER',
  'dompred': 'DomPred',
  'pdomthreader': 'pDomTHREADER',
  'bioserf': 'BiosSerf v2.0',
  'domserf': 'DomSerf v2.1',
  'ffpred': 'FFPred 3',
  'metapsicov': 'MetaPSICOV',
  'metsite': 'MetSite',
  'hspred': 'HSPred',
  'memembed': 'MEMEMBED',
  'gentdb': 'Generate TDB',
};

if(location.hostname === "127.0.0.1" || location.hostname === "localhost")
{
  endpoints_url = 'http://127.0.0.1:8000/analytics_automated/endpoints/';
  submit_url = 'http://127.0.0.1:8000/analytics_automated/submission/';
  times_url = 'http://127.0.0.1:8000/analytics_automated/jobtimes/';
  app_path = '/interface';
  main_url = 'http://127.0.0.1:8000';
  gears_svg = "../static/images/gears.svg";
  file_url = main_url;
}
else if(location.hostname === "bioinfstage1.cs.ucl.ac.uk" || location.hostname  === "bioinf.cs.ucl.ac.uk" || location.href  === "http://bioinf.cs.ucl.ac.uk/psipred_beta/") {
  endpoints_url = main_url+app_path+'/api/endpoints/';
  submit_url = main_url+app_path+'/api/submission/';
  times_url = main_url+app_path+'/api/jobtimes/';
  file_url = main_url+app_path+"/api";
  //gears_svg = "../static/images/gears.svg";
}
else if(location.hostname === "bioinf1.cs.ucl.ac.uk" || location.hostname  === "http://bioinf.cs.ucl.ac.uk/psipred_new/")
{
  app_path = '/psipred_new';
  endpoints_url = main_url+app_path+'/api/endpoints/';
  submit_url = main_url+app_path+'/api/submission/';
  times_url = main_url+app_path+'/api/jobtimes/';
  file_url = main_url+app_path+"/api";
  //gears_svg = "../static/images/gears.svg";
}
else {
  alert('UNSETTING ENDPOINTS WARNING, WARNING! WEBSITE NON FUNCTIONAL');
  endpoints_url = '';
  submit_url = '';
  times_url = '';
}

let initialisation_data = {
    sequence_form_visible: 1,
    structure_form_visible: 0,
    results_visible: 1,
    resubmission_visible: 0,
    results_panel_visible: 1,
    submission_widget_visible: 0,
    time_visible: 1,
    bioserf_advanced: 0,
    domserf_advanced: 0,
    dompred_advanced: 0,
    ffpred_advanced: 0,
    metsite_advanced: 0,
    hspred_advanced: 0,
    memembad_advanced: 0,
    modeller_key: null,
    download_links: '',
    error_message: '',
    loading_message: 'Loading Data',

    psipred_horiz: null,
    diso_precision: null,
    memsatsvm_schematic: '',
    memsatsvm_cartoon: '',
    pgen_table: null,
    pgen_ann_set: {},
    memsatpack_schematic: '',
    memsatpack_cartoon: '',
    gen_table: null,
    gen_ann_set: {},
    parseds_info: null,
    parseds_png: null,
    dgen_table: null,
    dgen_ann_set: {},
    bioserf_model: null,
    domserf_buttons: '',
    domserf_model_uris: [],
    ffpred_cartoon: null,
    sch_schematic: null,
    aa_composition: null,
    global_features: null,
    function_tables: null,
    metapsicov_map: null,
    metsite_table: null,
    metsite_pdb: null,
    hspred_table: null,
    hspred_initial_pdb: null,
    hspred_second_pdb: null,
    tdb_file: null,
    memembed_pdb: null,

    metapsicov_data: null,
    metsite_data: null,
    hspred_data: null,
    memembed_data: null,
    gentdb_data: null,

    // Sequence and job info
    sequence: '',
    msa: '',
    sequence_length: 1,
    subsequence_start: 1,
    subsequence_stop: 1,
    email: '',
    name: '',
    batch_uuid: null,
    //hold annotations that are read from datafiles
    annotations: null,
};
job_list.forEach(function(job_name){
  initialisation_data[job_name+'_results_visible'] = false;
  initialisation_data[job_name+'_checked'] = false;
  initialisation_data[job_name+'_job'] = job_name+'_job';
  initialisation_data[job_name+'_waiting_message'] = '<h2>Please wait for your '+job_names[job_name]+' job to process</h2>';
  initialisation_data[job_name+'_waiting_icon'] = gear_string;
  initialisation_data[job_name+'_time'] = '';
});
initialisation_data.psipred_checked = true;
// initialisation_data.memembed_advanced = 1;
// initialisation_data.sequence_form_visible = 0;
// initialisation_data.structure_form_visible = 1;
// DECLARE VARIABLES and init ractive instance
var ractive = new Ractive({
  el: '#psipred_site',
  template: '#form_template',
  data: initialisation_data,
});

let poll_interval = 30000;
//set some things on the page for the development server
if(location.hostname === "127.0.0.1") {
  ractive.set('email', 'daniel.buchan@ucl.ac.uk');
  ractive.set('name', 'test');
  //ractive.set('sequence', '>this\nQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEAS\n>this\nQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEAS');
  ractive.set('sequence', 'QWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEAS');
  poll_interval = 5000;
}

//4b6ad792-ed1f-11e5-8986-989096c13ee6
let uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let uuid_match = uuid_regex.exec(getUrlVars().uuid);

///////////////////////////////////////////////////////////////////////////////
//
//
// APPLICATION HERE
//
//
///////////////////////////////////////////////////////////////////////////////

//Here were keep an eye on some form elements and rewrite the name if people
//have provided a fasta formatted seq
let seq_observer = ractive.observe('sequence', function(newValue, oldValue ) {
  let regex = /^>(.+?)\s/;
  let match = regex.exec(newValue);
  if(match)
  {
    this.set('name', match[1]);
  }
  // else {
  //   this.set('name', null);
  // }

  },
  {init: false,
   defer: true
 });

//theses two observers stop people setting the resubmission widget out of bounds
ractive.observe( 'subsequence_stop', function ( value ) {
  let seq_length = ractive.get('sequence_length');
  let seq_start = ractive.get('subsequence_start');
  if(value > seq_length)
  {
    ractive.set('subsequence_stop', seq_length);
  }
  if(value <= seq_start)
  {
    ractive.set('subsequence_stop', seq_start+1);
  }
});
ractive.observe( 'subsequence_start', function ( value ) {
  let seq_stop = ractive.get('subsequence_stop');
  if(value < 1)
  {
    ractive.set('subsequence_start', 1);
  }
  if(value >= seq_stop)
  {
    ractive.set('subsequence_start', seq_stop-1);
  }
});

//After a job has been sent or a URL accepted this ractive block is called to
//poll the backend to get the results
ractive.on('poll_trigger', function(name, seq_type){
  console.log("Polling backend for results");
  let url = submit_url + ractive.get('batch_uuid');
  history.pushState(null, '', app_path+'/&uuid='+ractive.get('batch_uuid'));
  if(seq_type){
    draw_empty_annotation_panel(ractive);
  }
  let interval = setInterval(function(){
    let batch = send_request(url, "GET", {});
    let downloads_info = {};

    if(batch.state === 'Complete')
    {
      console.log("Render results");
      let submissions = batch.submissions;
      submissions.forEach(function(data){
          // console.log(data);
          prepare_downloads_html(data, downloads_info, job_list, job_names);
          handle_results(ractive, data, file_url, zip, downloads_info, job_names, job_list);

      });
      set_downloads_panel(ractive, downloads_info);
      $('.processing').remove();
      ractive.set('time_visible', 0);
      ractive.set('loading_message', null);

      clearInterval(interval);
    }
    if(batch.state === 'Error' || batch.state === 'Crash')
    {
      job_list.forEach(function(job_name){
        ractive.set(job_name+'_waiting_message', null);
        ractive.set(job_name+'_waiting_icon', null);
        ractive.set(job_name+'_waiting_time', null);
      });
      let submission_message = batch.submissions[0].last_message;
      let error_text = "<h3>POLLING ERROR: Job Failed</h3>"+
      "<h4>Please Contact psipred@cs.ucl.ac.uk quoting the error message and job ID:"+ractive.get('batch_uuid')+"</h4>"+
      "<h5>Error Message:<br />"+submission_message+"</h5>";
      ractive.set('error_message', error_text);
      $('.processing').remove();
      ractive.set('time_visible', 0);
      ractive.set('loading_message', null);
      clearInterval(interval);
    }
  }, poll_interval);

},{init: false,
   defer: true
 }
);

// On clicking the Get Zip file link this watchers prepares the zip and hands it to the user
ractive.on('get_zip', function (context) {
    let uuid = ractive.get('batch_uuid');
    zip.generateAsync({type:"blob"}).then(function (blob) {
        saveAs(blob, uuid+".zip");
    });
});

ractive.on('show_bioserf', function(event) {
  let adv = ractive.get('bioserf_advanced');
  if(adv){
    ractive.set('bioserf_advanced', 0);
  }
  else
  {
    ractive.set('bioserf_advanced', 1);
  }
});
ractive.on('show_domserf', function(event) {
  let adv = ractive.get('domserf_advanced');
  if(adv){
    ractive.set('domserf_advanced', 0);
  }
  else
  {
    ractive.set('domserf_advanced', 1);
  }
});
ractive.on('show_dompred', function(event) {
  let adv = ractive.get('dompred_advanced');
  if(adv){
    ractive.set('dompred_advanced', 0);
  }
  else
  {
    ractive.set('dompred_advanced', 1);
  }
});
ractive.on('show_ffpred', function(event) {
  let adv = ractive.get('ffpred_advanced');
  if(adv){
    ractive.set('ffpred_advanced', 0);
  }
  else
  {
    ractive.set('ffpred_advanced', 1);
  }
});
ractive.on('show_metsite', function(event) {
  let adv = ractive.get('metsite_advanced');
  if(adv){
    ractive.set('metsite_advanced', 0);
  }
  else
  {
    ractive.set('metsite_advanced', 1);
  }
});
ractive.on('show_hspred', function(event) {
  let adv = ractive.get('hspred_advanced');
  if(adv){
    ractive.set('hspred_advanced', 0);
  }
  else
  {
    ractive.set('hspred_advanced', 1);
  }
});
ractive.on('show_memembed', function(event) {
  let adv = ractive.get('memembed_advanced');
  if(adv){
    ractive.set('memembed_advanced', 0);
  }
  else
  {
    ractive.set('memembed_advanced', 1);
  }
});
// These react to the headers being clicked to toggle the panel
//
ractive.on( 'sequence_active', function ( event ) {
  $('.form-header').css("background-color", "#173958");
  ractive.set( 'structure_form_visible', null );
  ractive.set( 'structure_form_visible', 0 );
  ractive.set('memembed_advanced', 0);
  ractive.set('hspred_advanced', 0);
  ractive.set('metsite_advanced', 0);
  ractive.set('ffpred_advanced', 0);
  ractive.set('dompred_advanced', 0);
  ractive.set('domserf_advanced', 0);
  ractive.set('bioserf_advanced', 0);
  job_list.forEach(function(job_name){
      let setting = false;
      if(job_name === 'psipred'){setting = true;}
      ractive.set( job_name+'_checked', setting);
  });
  ractive.set( 'sequence_form_visible', null );
  ractive.set( 'sequence_form_visible', 1 );
});

ractive.on( 'structure_active', function ( event ) {
  $('.form-header').css({"background-color": "#581717"});

  ractive.set( 'sequence_form_visible', null );
  ractive.set( 'sequence_form_visible', 0 );
  ractive.set('memembed_advanced', 0);
  ractive.set('hspred_advanced', 0);
  ractive.set('metsite_advanced', 0);
  ractive.set('ffpred_advanced', 0);
  ractive.set('dompred_advanced', 0);
  ractive.set('domserf_advanced', 0);
  ractive.set('bioserf_advanced', 0);
    job_list.forEach(function(job_name){
      ractive.set( job_name+'_checked', false);
  });
  ractive.set( 'structure_form_visible', null );
  ractive.set( 'structure_form_visible', 1 );
});

ractive.on( 'downloads_active', function ( event ) {
  show_panel(1, ractive);
});

//register listeners for each results panel
job_list.forEach(function(job_name, i){
  console.log("adding jobs watchers");
  ractive.on(job_name+'_active', function( event ){
    show_panel(i+2, ractive);
    if(job_name === "psipred")
    {
      if(ractive.get('psipred_horiz'))
      {
        biod3.psipred(ractive.get('psipred_horiz'), 'psipredChart', {parent: 'div.psipred_cartoon', margin_scaler: 2});
      }
    }
    if(job_name === "disopred")
    {
      if(ractive.get('diso_precision'))
      {
        biod3.genericxyLineChart(ractive.get('diso_precision'), 'pos', ['precision'], ['Black',], 'DisoNNChart', {parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
      }
    }
    if(job_name === 'bioserf')
    {
      if(ractive.get('bioserf_model')){
        if(ractive.get('bioserf_model').length)
        {
          let bioserf_model = ractive.get('bioserf_model');
          display_structure(bioserf_model, '#bioserf_model', true);
        }
      }
    }
    if(job_name === 'domserf')
    {
      if(ractive.get('domserf_model_uris')){
        if(ractive.get('domserf_model_uris').length)
        {
          let paths = ractive.get('domserf_model_uris');
          display_structure(paths[0], '#domserf_model', true);
        }
      }
    }
    if(job_name === 'metsite')
    {
      if(ractive.get('metsite_pdb')){
        if(ractive.get('metsite_pdb').length)
        {
          let met_pdb = ractive.get('metsite_pdb');
          display_structure(met_pdb, '#metsite_model', false);
        }
      }
    }
    if(job_name === 'hspred')
    {
      if(ractive.get('hspred_initial_pdb')){
      if(ractive.get('hspred_initial_pdb').length)
      {
        let initial_pdb = ractive.get('hspred_initial_pdb');
        let second_pdb = ractive.get('hspred_second_pdb');
        display_structure(initial_pdb, '#hspred_initial_model', false);
        display_structure(second_pdb,  '#hspred_second_model', false);
      }}
    }
    if(job_name === 'memembed')
    {
      if(ractive.get('memembed_pdb').length)
      {
         let memembed_pdb = ractive.get('memembed_pdb');
         display_structure(memembed_pdb, '#memembed_model', false);
      }
    }
    if(job_name === 'pgenthreader' ||job_name === 'genthreader' || job_name === 'pdomthreader')
    {
      let key_fields = document.getElementsByClassName('modeller-key');
      for(let field of key_fields)
      {
        // console.log("Hello");
        field.style.visibility = "visible";
      }
    }

  });

});

ractive.on('submission_active', function ( event ) {
  console.log("SUBMISSION ACTIVE");
  let state = ractive.get('submission_widget_visible');

  if(state === 1){
    ractive.set( 'submission_widget_visible', 0 );
  }
  else{
    ractive.set( 'submission_widget_visible', 1 );
  }
});

//grab the submit event from the main form and send the sequence to the backend
ractive.on('submit', function(event) {
  let submit_job = false;
  console.log('Submitting data');
  let seq = this.get('sequence');

  //process seq to decide if MSA or
  //let seq_count = seq.split(">").length;
  //seq = seq.replace(/^>.+$/mg, "").toUpperCase();
  //seq = seq.replace(/\n|\s/g,"");
  ractive.set('sequence_length', seq.length);
  ractive.set('subsequence_stop', seq.length);
  ractive.set('sequence', seq);

  let name = this.get('name');
  let email = this.get('email');
  let check_states = {};
  let struct_type = false;
  let seq_type = false;
  job_list.forEach(function(job_name){
    check_states[job_name+'_job'] = ractive.get(job_name+'_job');
    check_states[job_name+'_checked'] = ractive.get(job_name+'_checked');
    if(check_states[job_name+'_checked'] && struct_job_list.includes(job_name))
    {
      struct_type = true;
    }
    if(check_states[job_name+'_checked'] && seq_job_list.includes(job_name))
    {
      seq_type = true;
    }

  });

  let options_data = set_advanced_params();
  //HANDLE FFPRED JOB SELECTION.
  if(check_states.bioserf_checked || check_states.domserf_checked)
  {
    let bios_modeller_test = test_modeller_key(options_data.bioserf_modeller_key);
    let doms_modeller_test = test_modeller_key(options_data.domserf_modeller_key);
    if(bios_modeller_test || doms_modeller_test)
    {
      submit_job =true;
  }
    else{
      alert("You have not provided a valid MODELLER key. Contact the Sali lab for a MODELLER licence.");
    }
  }
  else{
    submit_job=true;
  }
  if(seq_type && struct_type)
  {
    alert("You can not submit both sequence and structure analysis jobs");
    submit_job = false;
  }


  if(email.length === 0)
  {
    email = 'dummy@dummy.com';
  }
  if(submit_job)
  {
    console.log("Submitting");
    if(seq_type)
    {
      verify_and_send_form(ractive, seq, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type);
    }
    if(struct_type)
    {
      let pdbFile = null;
      let pdbData = '';
      try{
       pdbFile = document.getElementById("pdbFile");
       let file = pdbFile.files[0];
       let fr = new FileReader();
       fr.readAsText(file);
       fr.onload = function(e) {
        pdbData = fr.result;
        verify_and_send_form(ractive, pdbData, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type);
        };
      }
      catch(err) {
        pdbData = "";
        if(err.message.includes("FileReader.readAsText is not an object")){
          alert("You have not selected a PDB file");
        }
        console.log(err);
      }
    }
  }
  event.original.preventDefault();
});

// grab the submit event from the Resubmission widget, truncate the sequence
// and send a new job
ractive.on('resubmit', function(event) {
  console.log('Resubmitting segment');
  history.pushState(null, '', app_path+"/");
  let start = ractive.get("subsequence_start");
  let stop = ractive.get("subsequence_stop");
  let sequence = ractive.get("sequence");
  let subsequence = sequence.substring(start-1, stop);
  let name = this.get('name')+"_seg";
  let email = this.get('email');
  ractive.set('sequence_length', subsequence.length);
  ractive.set('subsequence_stop', subsequence.length);
  ractive.set('sequence', subsequence);
  ractive.set('name', name);
  let check_states = {};
  job_list.forEach(function(job_name){
    check_states[job_name+'_job'] = ractive.get(job_name+'_job');
    check_states[job_name+'_checked'] = ractive.get(job_name+'_checked');
  });
  //clear what we have previously written
  clear_settings(ractive, gear_string, job_list, job_names, zip);
  //verify form contents and post
  //add form defaults but null the structes ones as we don't allow structure job resubmission
  let options_data = set_advanced_params();
  ractive.set('time_visible', 1);
  $('.processing').remove();
  $('#resubmission_widget').boxWidget('collapse');
  $('<div class="overlay processing"><i class="fa fa-refresh fa-spin"></i></div>').appendTo("#resubmission_widget");
  if(email.length === 0)
  {
    email = 'dummy@dummy.com';
  }
  verify_and_send_form(ractive, subsequence, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, true, false);
  ractive.set('time_visible', 1);

  //write new annotation diagram
  //submit subsection
  event.original.preventDefault();
});

function test_modeller_key(input)
{
  if(input === 'MODELIRANJE')
  {
    return(true);
  }
  return(false);
}

// Here having set up ractive and the functions we need we then check
// if we were provided a UUID, If the page is loaded with a UUID rather than a
// form submit.
//TODO: Handle loading that page with use the MEMSAT and DISOPRED UUID
//
if(getUrlVars().uuid && uuid_match)
{
  console.log('Caught an incoming UUID');
  seq_observer.cancel();
  ractive.set('results_visible', null ); // should make a generic one visible until results arrive.
  ractive.set("batch_uuid", getUrlVars().uuid);
  let previous_data = get_previous_data(getUrlVars().uuid, submit_url, file_url, ractive);
  let seq_type = true;
  console.log(previous_data);
  if(previous_data.jobs.includes('psipred'))
  {
      ractive.set('psipred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('pgenthreader'))
  {
      ractive.set('pgenthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('metapsicov'))
  {
      ractive.set('metapsicov_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('disopred'))
  {
      ractive.set('disopred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('mempack'))
  {
      ractive.set('mempack_result_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('memsatsvm'))
  {
      ractive.set('memsatsvm_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('genthreader') && ! previous_data.jobs.includes('pgenthreader'))
  {
      ractive.set('genthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('dompred'))
  {
      ractive.set('dompred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('pdomthreader'))
  {
      ractive.set('pdomthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('bioserf'))
  {
      ractive.set('bioserf_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('domserf'))
  {
      ractive.set('domserf_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('ffpred'))
  {
      ractive.set('ffpred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('metsite'))
  {
      ractive.set('metsite_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('hspred'))
  {
      ractive.set('hspred_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('memembed'))
  {
      ractive.set('memembed_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('gentdb'))
  {
      ractive.set('gentdb_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }

  ractive.set('sequence', parseMSA(ractive, previous_data.seq));
  ractive.set('email',previous_data.email);
  ractive.set('name',previous_data.name);
  let seq = ractive.get('sequence');
  ractive.set('sequence_length', seq.length);
  ractive.set('subsequence_stop', seq.length);
  if(seq_type)
  {
    ractive.set( 'resubmission_visible', 1 );
  }
  ractive.fire('poll_trigger', seq_type);
}

///////////////////////////////////////////////////////////////////////////////
//
// New Pannel functions
//
///////////////////////////////////////////////////////////////////////////////


//Reload alignments for JalView for the genTHREADER table
export function loadNewAlignment(alnURI,annURI,title) {
  let url = submit_url+ractive.get('batch_uuid');
  window.open(".."+app_path+"/msa/?ann="+file_url+annURI+"&aln="+file_url+alnURI, "", "width=800,height=400");
}

//Reload alignments for JalView for the genTHREADER table
export function buildModel(alnURI, type) {

  let url = submit_url+ractive.get('batch_uuid');
  let mod_key = ractive.get('modeller_key');
  if(mod_key === 'M'+'O'+'D'+'E'+'L'+'I'+'R'+'A'+'N'+'J'+'E')
  {
    //alert(type);
    window.open(".."+app_path+"/model/post?type="+type+"&aln="+file_url+alnURI, "", "width=670,height=700");
  }
  else
  {
    alert('Please provide a valid M'+'O'+'D'+'E'+'L'+'L'+'E'+'R Licence Key');
  }
}

// Swaps out the domserf model when those buttons are clicked
export function swapDomserf(uri_number)
{
  uri_number = uri_number-1;
  let paths = ractive.get("domserf_model_uris");
  display_structure(paths[uri_number], '#domserf_model', true);
}
