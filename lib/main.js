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
import { parse_config } from './common/common_index.js';
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
let joblist_url = null;
let gears_svg = "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg";
let main_url = "http://bioinf.cs.ucl.ac.uk";
let app_path = "/psipred_beta";
let file_url = '';
let gear_string = '<object width="140" height="140" type="image/svg+xml" data="'+gears_svg+'"></object>';
let persistence_interval = 5; //time that we expire results
//JOB LISTS
let job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack",
                "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf",
                "domserf", "ffpred", "metsite", "hspred", "memembed", "gentdb",
                "dmp", "dmpfold", ];
let seq_job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack",
                    "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf",
                    "domserf", "ffpred", "dmp", "dmpfold", ];
let struct_job_list = ["metsite", "hspred", "memembed", "gentdb"];
let job_names = {
  'psipred': 'PSIPRED V4.0',
  'disopred': 'DISOPRED 3',
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
  'dmp': 'DeepMetaPSICOV 1.0',
  'dmpfold': 'DMPfold 1.0'
};

let interval = null; // used for the poll trigger interval
let poll_url = null;
console.log(location.hostname);
console.log(window.location.href);

if(location.hostname === "127.0.0.1" || location.hostname === "localhost")
{
  joblist_url = 'http://127.0.0.1:8000/analytics_automated/job/';
  endpoints_url = 'http://127.0.0.1:8000/analytics_automated/endpoints/';
  submit_url = 'http://127.0.0.1:8000/analytics_automated/submission/';
  times_url = 'http://127.0.0.1:8000/analytics_automated/jobtimes/';
  app_path = '/interface';
  main_url = 'http://127.0.0.1:8000';
  gears_svg = "../static/images/gears.svg";
  file_url = main_url;
}
else if(window.location.href === "http://bioinf.cs.ucl.ac.uk/psipred/" || (window.location.href.includes('psipred') && !  window.location.href.includes('psipred_beta')) )
{
  app_path = '/psipred';
  joblist_url = main_url+app_path+'/api/job/';
  endpoints_url = main_url+app_path+'/api/endpoints/';
  submit_url = main_url+app_path+'/api/submission/';
  times_url = main_url+app_path+'/api/jobtimes/';
  file_url = main_url+app_path+"/api";
  //gears_svg = "../static/images/gears.svg";
}
else if(location.hostname === "bioinfstage1.cs.ucl.ac.uk" || location.href  === "http://bioinf.cs.ucl.ac.uk/psipred_beta/" || window.location.href.includes('psipred_beta'))
{
  joblist_url = main_url+app_path+'/api/job/';
  endpoints_url = main_url+app_path+'/api/endpoints/';
  submit_url = main_url+app_path+'/api/submission/';
  times_url = main_url+app_path+'/api/jobtimes/';
  file_url = main_url+app_path+"/api";
  //gears_svg = "../static/images/gears.svg";
}
else {
  alert('UNSETTING ENDPOINTS WARNING, WARNING! WEBSITE NON FUNCTIONAL');
  joblist_url = '';
  endpoints_url = '';
  submit_url = '';
  times_url = '';
}
//INITIALISATION DATA
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
    dmp_map: null,
    dmpfold_pdb: null,
    dmpfold_tmscore: null,
    metsite_table: null,
    metsite_pdb: null,
    metsite_mol_viewer: null,
    hspred_table: null,
    hspred_initial_pdb: null,
    hspred_second_pdb: null,
    hspred_initial_mol_viewer: null,
    hspred_second_mol_viewer: null,
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
    config_text: "job,step,type,name,version,parameters\n",
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
//RESULT POLL FLAGS
function resultPoll(){
  let batch = send_request(poll_url, "GET", {});
  let downloads_info = {};
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
      dmp: false,
      dmpfold: false,
  };
  if(batch.state === 'Complete')
  {
    console.log("Render results");
    let submissions = batch.submissions;
    submissions.forEach(function(data){
        // console.log(data);
        prepare_downloads_html(data, downloads_info, job_list, job_names);
        handle_results(ractive, data, file_url, zip, downloads_info, job_names, job_list, results_found);
    });
    set_downloads_panel(ractive, downloads_info);
    $('.processing').remove();
    // var svg = document.getElementById('annotationGrid').outerHTML;
    // svg = svg.replace(/<g id="toggle".+?<\/g>/, '');
    // svg = svg.replace(/<g id="buttons".+?<\/g>/, '');
    // zip.folder('submissions').file('annotationPanel.svg', svg);
    ractive.set('time_visible', 0);
    ractive.set('loading_message', null);
    clearInterval(interval);
    return(true);
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
    return(true);
  }
  return(false);
}

//After a job has been sent or a URL accepted this ractive block is called to
//poll the backend to get the results
ractive.on('poll_trigger', function(name, seq_type){
  console.log("Polling backend for results");
  poll_url = submit_url + ractive.get('batch_uuid');
  history.pushState(null, '', app_path+'/&uuid='+ractive.get('batch_uuid'));
  if(seq_type){
    draw_empty_annotation_panel(ractive);
  }
  let success = resultPoll();
  //console.log("INTERVAL: "+poll_interval);
  if(!success){
    interval = setInterval(resultPoll, poll_interval);
  }
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

// On clicking the Get Zip file link this watchers prepares the zip and hands it to the user
ractive.on('get_job_details', function (context) {
    let uuid = ractive.get('batch_uuid');
    let csv_data = ractive.get('config_text');
    //console.log(csv_data);
    console.log(typeof(csv_data));
    let csvBlob = new Blob([csv_data], {type: 'text/csv'});
    saveAs(csvBlob, uuid+".csv");
});

//ADVANCED PANELS
ractive.on('show_bioserf', function(event) {
  alert("Bioserf analyses can take longer than 6 hours. If you wish to run multiple analyses consdier running Bioserf as a seperate job submission");
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
  alert("Domserf analyses can take longer than 6 hours. If you wish to run multiple analyses consdier running Domserf as a seperate job submission");
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
//LISTENERS
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
          display_structure(bioserf_model, '#bioserf_model', true, ractive);
        }
      }
    }
    if(job_name === 'domserf')
    {
      if(ractive.get('domserf_model_uris')){
        if(ractive.get('domserf_model_uris').length)
        {
          let paths = ractive.get('domserf_model_uris');
          display_structure(paths[0], '#domserf_model', true, ractive);
        }
      }
    }
    if(job_name === 'dmpfold')
    {
      if(ractive.get('dmpfold_model')){
        if(ractive.get('dmpfold_model').length)
        {
          let paths = ractive.get('dmpfold_pdb');
          display_structure(paths[0], '#dmpfold_model', false, ractive);
        }
      }
    }
    if(job_name === 'metsite')
    {
      if(ractive.get('metsite_pdb')){
        if(ractive.get('metsite_pdb').length)
        {
          let met_pdb = ractive.get('metsite_pdb');
          display_structure(met_pdb, '#metsite_model', false, ractive);
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
        display_structure(initial_pdb, '#hspred_initial_model', false, ractive);
        display_structure(second_pdb,  '#hspred_second_model', false, ractive);
      }}
    }

    if(job_name === 'memembed')
    {
      if(ractive.get('memembed_pdb').length)
      {
         let memembed_pdb = ractive.get('memembed_pdb');
         display_structure(memembed_pdb, '#memembed_model', false, ractive);
      }
    }
    if(job_name === 'pgenthreader' ||job_name === 'genthreader' || job_name === 'pdomthreader')
    {
      let key_fields = document.getElementsByClassName('modeller-key');
      for(let field of key_fields)
      {
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
  let checked_count = 0;
  job_list.forEach(function(job_name){
    console.log(job_name);
    check_states[job_name+'_job'] = ractive.get(job_name+'_job');
    check_states[job_name+'_checked'] = ractive.get(job_name+'_checked');
    if(check_states[job_name+'_checked'] && struct_job_list.includes(job_name))
    {
      checked_count++;
      struct_type = true;
    }
    if(check_states[job_name+'_checked'] && seq_job_list.includes(job_name))
    {
      checked_count++;
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
  if(!struct_type && !seq_type){
    alert("You have not selected any analyses");
    submit_job = false;
  }
  if(struct_type && checked_count === 4)
  {
    alert("You have selected every analysis method. We don't allow submissions which select all analyses. Please consider more carefully which predictions you require.");
    submit_job = false;
  }
  if(seq_type && checked_count === 12)
  {
    alert("You have selected every analysis method. We don't allow submissions which select all analyses. Please consider more carefully which predictions you require.");
    submit_job = false;
  }
  if(email.length === 0)
  {
    var r = confirm("No email address was provided.\n\nAnalyses can be long running and we recommend users leave an\nemail address to receive completion alerts. Leaving an email address\nalso allows us to contact you if there are any problems with you analyses\n\nPress OK to submit without an email address.");
    if(r == true)
    {
      email = 'dummy@dummy.com';
    }
    else
    {
      submit_job = false;
    }
  }

  if(submit_job)
  {
    console.log("Submitting");
    if(seq_type)
    {
      verify_and_send_form(ractive, seq, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type, joblist_url, zip);
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
        verify_and_send_form(ractive, pdbData, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type, joblist_url, zip);
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
  let submit_job = false;
  ractive.set('sequence_length', subsequence.length);
  ractive.set('subsequence_stop', subsequence.length);
  ractive.set('sequence', subsequence);
  ractive.set('name', name);
  let check_states = {};
  job_list.forEach(function(job_name){
    check_states[job_name+'_job'] = ractive.get(job_name+'_job');
    check_states[job_name+'_checked'] = ractive.get(job_name+'_checked');
  });

  //verify form contents and post
  //add form defaults but null the structes ones as we don't allow structure job resubmission
  let options_data = set_advanced_params();
  if(email.length === 0)
  {
    email = 'dummy@dummy.com';
  }
  if(check_states.bioserf_checked || check_states.domserf_checked)
  {
    let bios_doms_modeller_test = test_modeller_key(options_data.bioserf_domserf_modeller_key);
    // console.log("STATE OF THIS: "+bios_doms_modeller_test);
    if(bios_doms_modeller_test)
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
  if(submit_job)
  {
    //clear what we have previously written
    ractive.set('time_visible', 1);
    $('.processing').remove();
    $('#resubmission_widget').boxWidget('collapse');
    $('<div class="overlay processing"><i class="fa fa-refresh fa-spin"></i></div>').appendTo("#resubmission_widget");
    clear_settings(ractive, gear_string, job_list, job_names, zip);
    verify_and_send_form(ractive, subsequence, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, true, false, joblist_url, zip);
  }
  //write new annotation diagram
  //submit subsection
  event.original.preventDefault();
});

function test_modeller_key(input)
{
  if(input === 'M'+'O'+'D'+'E'+'L'+'I'+'R'+'A'+'N'+'J'+'E')
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
  //ractive.set("psipred_uuid", getUrlVars().uuid);
  let previous_data = get_previous_data(getUrlVars().uuid, submit_url, file_url, ractive);
  let seq_type = true;
  let current_date = new Date();
  let previous_date = new Date(previous_data.modified);
  let date_interval = current_date - previous_date;
  let one_day = 1000*60*60*24;
  // console.log(previous_date);
  // console.log(current_date);
  // console.log(date_interval);
  let day_interval = Math.floor(date_interval/one_day);
  let csv = '';
  // PANEL DISPLAY
  if(previous_data.jobs.includes('psipred'))
  {
      let config = send_request(joblist_url+'psipred','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('psipred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('pgenthreader'))
  {
      let config = send_request(joblist_url+'pgenthreader','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('pgenthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  // if(previous_data.jobs.includes('metapsicov'))
  // {
  //     let config = send_request(joblist_url+'metapsicov','GET',{});
  //     csv = ractive.get('config_text');
  //     csv += parse_config(config);
  //     ractive.set('config_text', csv);
  //     ractive.set('metapsicov_results_visible', true);
  //     ractive.set('results_visible', 2 );
  // }
  if(previous_data.jobs.includes('disopred'))
  {
      let config = send_request(joblist_url+'disopred','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('disopred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('mempack'))
  {
      let config = send_request(joblist_url+'mempack','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('mempack_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('memsatsvm'))
  {
      let config = send_request(joblist_url+'memsatsvm','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('memsatsvm_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('genthreader') && ! previous_data.jobs.includes('pgenthreader'))
  {
      let config = send_request(joblist_url+'genthreader','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('genthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('dompred'))
  {
      let config = send_request(joblist_url+'dompred','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('dompred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('pdomthreader'))
  {
      let config = send_request(joblist_url+'pdomthreader','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('pdomthreader_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('bioserf'))
  {
      let config = send_request(joblist_url+'bioserf','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('bioserf_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('domserf'))
  {
      let config = send_request(joblist_url+'domserf','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('domserf_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('ffpred'))
  {
      let config = send_request(joblist_url+'ffpred','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('ffpred_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('metsite'))
  {
      let config = send_request(joblist_url+'metsite','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('metsite_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('hspred'))
  {
      let config = send_request(joblist_url+'hspred','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('hspred_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('memembed'))
  {
      let config = send_request(joblist_url+'memembed','GET',{});
      let csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('memembed_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('gentdb'))
  {
      let config = send_request(joblist_url+'gentdb','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('gentdb_results_visible', true);
      ractive.set('results_visible', 3 );
      seq_type = false;
  }
  if(previous_data.jobs.includes('dmp') && ! previous_data.jobs.includes('dmpfold'))
  {
      let config = send_request(joblist_url+'dmp','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('dmp_results_visible', true);
      ractive.set('results_visible', 2 );
  }
  if(previous_data.jobs.includes('dmpfold'))
  {
      let config = send_request(joblist_url+'dmpfold','GET',{});
      csv = ractive.get('config_text');
      csv += parse_config(config);
      ractive.set('config_text', csv);
      ractive.set('dmpfold_results_visible', true);
      ractive.set('results_visible', 2 );
  }

  if(day_interval > persistence_interval)
  {
    alert("You submission is older than "+persistence_interval+" days. The results have been deleted from our server");
    window.location.href = main_url+app_path;
  }
  else{
      ractive.set('email',previous_data.email);
      ractive.set('name',previous_data.name);
      if(seq_type)
      {
        ractive.set( 'resubmission_visible', 1 );
        ractive.set('sequence', parseMSA(ractive, previous_data.seq));
        let seq = ractive.get('sequence');
        ractive.set('sequence_length', seq.length);
        ractive.set('subsequence_stop', seq.length);
      }
      else
      {
        ractive.set('sequence', previous_data.seq);
        ractive.set('sequence_length', 0);
        ractive.set('subsequence_stop', 0);
      }
      zip.folder("submissions/").file(getUrlVars().uuid+".csv", csv);
      ractive.fire('poll_trigger', seq_type);
  }
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
  display_structure(paths[uri_number], '#domserf_model', true, ractive);
}

export function highlight_hs_residue(residue_id)
{
  //console.log(residue_id);
  let matches = residue_id.match(/(\D+)(\d+)/);
  let chain = matches[1];
  let res_id = matches[2];
  let initial_viewer = ractive.get('hspred_initial_mol_viewer');
  let second_viewer = ractive.get('hspred_second_mol_viewer');
  let hotspot_color = function(atom){
    //console.log(atom);
    if(atom.b == 1.0){atom.color = 'red'; return 'red';}
    if(atom.b == 0.5){atom.color = 'black'; return 'black';}
    if(atom.b == 50){atom.color = 'white'; return 'white';}
    if(atom.b == 100){atom.color = 'red'; return 'red';}
    atom.color = 'blue';
    return("blue");
  };
  if(document.getElementById(residue_id).checked)
  {
    initial_viewer.setStyle({chain: chain, resi:[res_id]},{cartoon:{color:"green",thickness:1}});
    second_viewer.setStyle({chain: chain, resi:[res_id]},{cartoon:{color:"green",thickness:1}});
  }
  else {
    initial_viewer.setStyle({chain: chain, resi:[res_id]},{cartoon:{colorfunc:hotspot_color}});
    second_viewer.setStyle({chain: chain, resi:[res_id]},{cartoon:{colorfunc:hotspot_color}});
  }
  initial_viewer.render();
  second_viewer.render();

  initial_viewer = ractive.get('hspred_initial_mol_viewer', initial_viewer);
  second_viewer = ractive.get('hspred_second_mol_viewer', second_viewer);

}

export function highlight_metsite_residue(residue_id)
{
  let matches = residue_id.match(/(\D+)(\d+)/);
  let aa = matches[1];
  let res_id = matches[2];
  let met_viewer = ractive.get('metsite_mol_viewer');
  if(document.getElementById(residue_id).checked)
  {
    met_viewer.setStyle({resi:[res_id], resn:aa},{cartoon:{color:"green"}});
  }
  else
  {
    met_viewer.setStyle({resi:[res_id], resn:aa},{cartoon:{color:"red"}});
  }
  met_viewer.render();
  ractive.set('metsite_mol_viewer', met_viewer);
}
