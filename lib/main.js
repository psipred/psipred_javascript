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
import { clear_settings } from './ractive_helpers/ractive_helpers.js';
import { prepare_downloads_html } from './ractive_helpers/ractive_helpers.js';
import { handle_results } from './ractive_helpers/ractive_helpers.js';
import { set_downloads_panel } from './ractive_helpers/ractive_helpers.js';

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
else {
  alert('UNSETTING ENDPOINTS WARNING, WARNING!');
  endpoints_url = '';
  submit_url = '';
  times_url = '';
}

// DECLARE VARIABLES and init ractive instance
var ractive = new Ractive({
  el: '#psipred_site',
  template: '#form_template',
  data: {
          sequence_form_visible: 1,
          structure_form_visible: 0,
          results_visible: 1,
          results_panel_visible: 1,
          submission_widget_visible: 0,
          modeller_key: null,

          psipred_checked: false,
          psipred_button: false,
          disopred_checked: false,
          disopred_button: false,
          memsatsvm_checked: false,
          memsatsvm_button: false,
          pgenthreader_checked: false,
          pgenthreader_button: false,
          mempack_checked: false,
          mempack_button: false,
          genthreader_checked: true,
          genthreader_button: false,
          dompred_checked: false,
          dompred_button: false,
          pdomthreader_checked: false,
          pdomthreader_button: false,
          bioserf_checked: false,
          bioserf_button: false,
          domserf_checked: false,
          domserf_button: false,
          ffpred_checked: false,
          ffpred_button: false,
          metsite_checked: false,
          metsite_button: false,
          hspred_checked: false,
          hspred_button: false,
          memembed_checked: false,
          memembed_button: false,
          gentdb_checked: false,
          gentdb_button: false,
          metapsicov_checked: false,
          metapsicov_button: false,

          // pgenthreader_checked: false,
          // pdomthreader_checked: false,
          // dompred_checked: false,
          // mempack_checked: false,
          // ffpred_checked: false,
          // bioserf_checked: false,
          // domserf_checked: false,
          download_links: '',
          psipred_job: 'psipred_job',
          disopred_job: 'disopred_job',
          memsatsvm_job: 'memsatsvm_job',
          pgenthreader_job: 'pgenthreader_job',
          mempack_job: 'mempack_job',
          genthreader_job: 'genthreader_job',
          dompred_job: 'dompred_job',
          pdomthreader_job: 'pdomthreader_job',
          bioserf_job: 'bioserf_job',
          domserf_job: 'domserf_job',
          ffpred_job: 'ffpred_job',
          metsite_job: 'metsite_job',
          hspred_job: 'hspred_job',
          memembed_job: 'memembed_job',
          gentdb_job: 'gentdb_job',
          metapsicov_job: 'metapsicov_job',


          psipred_waiting_message: '<h2>Please wait for your PSIPRED job to process</h2>',
          psipred_waiting_icon: gear_string,
          psipred_time: 'Loading Data',
          psipred_horiz: null,

          disopred_waiting_message: '<h2>Please wait for your DISOPRED job to process</h2>',
          disopred_waiting_icon: gear_string,
          disopred_time: 'Loading Data',
          diso_precision: null,

          memsatsvm_waiting_message: '<h2>Please wait for your MEMSAT-SVM job to process</h2>',
          memsatsvm_waiting_icon: gear_string,
          memsatsvm_time: 'Loading Data',
          memsatsvm_schematic: '',
          memsatsvm_cartoon: '',

          pgenthreader_waiting_message: '<h2>Please wait for your pGenTHREADER job to process</h2>',
          pgenthreader_waiting_icon: gear_string,
          pgenthreader_time: 'Loading Data',
          pgen_table: null,
          pgen_ann_set: {},

          mempack_waiting_message: '<h2>Please wait for your MEMPACK job to process</h2>',
          mempack_waiting_icon: gear_string,
          mempack_time: 'Loading Data',
          memsatpack_schematic: '',
          memsatpack_cartoon: '',

          genthreader_waiting_message: '<h2>Please wait for your GenTHREADER job to process</h2>',
          genthreader_waiting_icon: gear_string,
          genthreader_time: 'Loading Data',
          gen_table: null,
          gen_ann_set: {},

          dompred_waiting_message: '<h2>Please wait for your DOMPRED job to process</h2>',
          dompred_waiting_icon: gear_string,
          dompred_time: 'Loading Data',
          dompred_data: null,

          pdomthreader_waiting_message: '<h2>Please wait for your pDomTHREADER job to process</h2>',
          pdomthreader_waiting_icon: gear_string,
          pdomthreader_time: 'Loading Data',
          pdomthreader_data: null,

          bioserf_waiting_message: '<h2>Please wait for your BioSerf job to process</h2>',
          bioserf_waiting_icon: gear_string,
          bioserf_time: 'Loading Data',
          bioserf_data: null,

          domserf_waiting_message: '<h2>Please wait for your DomSerf job to process</h2>',
          domserf_waiting_icon: gear_string,
          domserf_time: 'Loading Data',
          domserf_data: null,

          ffpred_waiting_message: '<h2>Please wait for your FFPred job to process</h2>',
          ffpred_waiting_icon: gear_string,
          ffpred_time: 'Loading Data',
          ffpred_data: null,

          metapsicov_waiting_message: '<h2>Please wait for your MetaPSICOV job to process</h2>',
          metapsicov_waiting_icon: gear_string,
          metapsicov_time: 'Loading Data',
          metapsicov_data: null,

          metsite_waiting_message: '<h2>Please wait for your MetSite job to process</h2>',
          metsite_waiting_icon: gear_string,
          metsite_time: 'Loading Data',
          metsite_data: null,

          hspred_waiting_message: '<h2>Please wait for your HSPred job to process</h2>',
          hspred_waiting_icon: gear_string,
          hspred_time: 'Loading Data',
          hspred_data: null,

          memembed_waiting_message: '<h2>Please wait for your MEMEMBED job to process</h2>',
          memembed_waiting_icon: gear_string,
          memembed_time: 'Loading Data',
          memembed_data: null,

          gentdb_waiting_message: '<h2>Please wait for TDB Generation job to process</h2>',
          gentdb_waiting_icon: gear_string,
          gentdb_time: 'Loading Data',
          gentdb_data: null,

          // Sequence and job info
          sequence: '',
          sequence_length: 1,
          subsequence_start: 1,
          subsequence_stop: 1,
          email: '',
          name: '',
          batch_uuid: null,

          //hold annotations that are read from datafiles
          annotations: null,
        }
});

//set some things on the page for the development server
if(location.hostname === "127.0.0.1") {
  ractive.set('email', 'daniel.buchan@ucl.ac.uk');
  ractive.set('name', 'test');
  ractive.set('sequence', 'QWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEASDQWEAS');
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
ractive.on('poll_trigger', function(name, job_type){
  console.log("Polling backend for results");
  let url = submit_url + ractive.get('batch_uuid');
  history.pushState(null, '', app_path+'/&uuid='+ractive.get('batch_uuid'));
  draw_empty_annotation_panel(ractive);

  let interval = setInterval(function(){
    let batch = send_request(url, "GET", {});
    let downloads_info = {};

    if(batch.state === 'Complete')
    {
      console.log("Render results");
      let submissions = batch.submissions;
      submissions.forEach(function(data){
          // console.log(data);
          prepare_downloads_html(data, downloads_info);
          handle_results(ractive, data, file_url, zip, downloads_info);

      });
      set_downloads_panel(ractive, downloads_info);

      clearInterval(interval);
    }
    if(batch.state === 'Error' || batch.state === 'Crash')
    {
      let submission_message = batch.submissions[0].last_message;
      alert("POLLING ERROR: Job Failed\n"+
            "Please Contact psipred@cs.ucl.ac.uk quoting this error message and your job ID\n"+submission_message);
        clearInterval(interval);
    }
  }, 5000);

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

// These react to the headers being clicked to toggle the results panel
//
ractive.on( 'sequence_active', function ( event ) {
  ractive.set( 'structure_form_visible', null );
  ractive.set( 'structure_form_visible', 0 );
  ractive.set( 'psipred_checked', true);
  ractive.set( 'disopred_checked', false);
  ractive.set( 'memsatsvm_checked', false);
  ractive.set( 'pgenthreader_checked', false);
  ractive.set( 'mempack_checked', false);
  ractive.set( 'genthreader_checked', false);
  ractive.set( 'dompred_checked', false);
  ractive.set( 'pdomthreader_checked', false);
  ractive.set( 'bioserf_checked', false);
  ractive.set( 'domserf_checked', false);
  ractive.set( 'ffpred_checked', false);
  ractive.set( 'metapsicov_checked', false);
  ractive.set( 'metsite_checked', false);
  ractive.set( 'hspred_checked', false);
  ractive.set( 'memembed_checked', false);
  ractive.set( 'gentdb_checked', false);
  ractive.set( 'sequence_form_visible', null );
  ractive.set( 'sequence_form_visible', 1 );
});
ractive.on( 'structure_active', function ( event ) {
  ractive.set( 'sequence_form_visible', null );
  ractive.set( 'sequence_form_visible', 0 );
  ractive.set( 'psipred_checked', false);
  ractive.set( 'disopred_checked', false);
  ractive.set( 'memsatsvm_checked', false);
  ractive.set( 'pgenthreader_checked', false);
  ractive.set( 'mempack_checked', false);
  ractive.set( 'genthreader_checked', false);
  ractive.set( 'dompred_checked', false);
  ractive.set( 'pdomthreader_checked', false);
  ractive.set( 'bioserf_checked', false);
  ractive.set( 'domserf_checked', false);
  ractive.set( 'ffpred_checked', false);
  ractive.set( 'metapsicov_checked', false);
  ractive.set( 'metsite_checked', false);
  ractive.set( 'hspred_checked', false);
  ractive.set( 'memembed_checked', false);
  ractive.set( 'gentdb_checked', false);
  ractive.set( 'structure_form_visible', null );
  ractive.set( 'structure_form_visible', 1 );
});

ractive.on( 'downloads_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 11 );
});
ractive.on( 'psipred_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 1 );
  if(ractive.get('psipred_horiz'))
  {
    biod3.psipred(ractive.get('psipred_horiz'), 'psipredChart', {parent: 'div.psipred_cartoon', margin_scaler: 2});
  }
});
ractive.on( 'disopred_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 4 );
  if(ractive.get('diso_precision'))
  {
    biod3.genericxyLineChart(ractive.get('diso_precision'), 'pos', ['precision'], ['Black',], 'DisoNNChart', {parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
  }
});
ractive.on( 'memsatsvm_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 6 );
});
ractive.on( 'pgenthreader_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 2 );
});
ractive.on( 'mempack_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 5 );
});
ractive.on( 'genthreader_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 7 );
});
ractive.on( 'dompred_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 8 );
});
ractive.on( 'pdomthreader_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 9 );
});
ractive.on( 'bioserf_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 10 );
});
ractive.on( 'domserf_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 12 );
});
ractive.on( 'ffpred_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 13 );
});
ractive.on( 'metapsicov_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 18 );
});
ractive.on( 'metsite_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 14 );
});
ractive.on( 'hspred_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 15 );
});
ractive.on( 'memembed_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 16 );
});
ractive.on( 'gentdb_active', function ( event ) {
  ractive.set( 'results_panel_visible', null );
  ractive.set( 'results_panel_visible', 17 );
});


ractive.on( 'submission_active', function ( event ) {
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
  console.log('Submitting data');
  let seq = this.get('sequence');
  seq = seq.replace(/^>.+$/mg, "").toUpperCase();
  seq = seq.replace(/\n|\s/g,"");
  ractive.set('sequence_length', seq.length);
  ractive.set('subsequence_stop', seq.length);
  ractive.set('sequence', seq);

  let name = this.get('name');
  let email = this.get('email');
  let psipred_job = this.get('psipred_job');
  let psipred_checked = this.get('psipred_checked');
  let disopred_job = this.get('disopred_job');
  let disopred_checked = this.get('disopred_checked');
  let memsatsvm_job = this.get('memsatsvm_job');
  let memsatsvm_checked = this.get('memsatsvm_checked');
  let pgenthreader_job = this.get('pgenthreader_job');
  let pgenthreader_checked = this.get('pgenthreader_checked');
  let mempack_job = this.get('mempack_job');
  let mempack_checked = this.get('mempack_checked');
  let genthreader_job = this.get('genthreader_job');
  let genthreader_checked = this.get('genthreader_checked');
  let dompred_job = this.get('dompred_job');
  let dompred_checked = this.get('dompred_checked');
  let pdomthreader_job = this.get('pdomthreader_job');
  let pdomthreader_checked = this.get('pdomthreader_checked');
  let bioserf_job = this.get('bioserf_job');
  let bioserf_checked = this.get('bioserf_checked');
  let domserf_job = this.get('domserf_job');
  let domserf_checked = this.get('domserf_checked');
  let ffpred_job = this.get('ffpred_job');
  let ffpred_checked = this.get('ffpred_checked');
  let metapsicov_job = this.get('metapsicov_job');
  let metapsicov_checked = this.get('metapsicov_checked');
  let metsite_job = this.get('metasite_job');
  let metsite_checked = this.get('metasite_checked');
  let hspred_job = this.get('hspred_job');
  let hspred_checked = this.get('hspred_checked');
  let memembed_job = this.get('memembed_job');
  let memembed_checked = this.get('memembed_checked');
  let gentdb_job = this.get('gentdb_job');
  let gentdb_checked = this.get('gentdb_checked');

  verify_and_send_form(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked,
                       memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked,
                       pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked,
                       metsite_checked, hspred_checked, memembed_checked, gentdb_checked);
  event.original.preventDefault();
});

// grab the submit event from the Resubmission widget, truncate the sequence
// and send a new job
ractive.on('resubmit', function(event) {
  console.log('Resubmitting segment');
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
  let psipred_job = this.get('psipred_job');
  let psipred_checked = this.get('psipred_checked');
  let disopred_job = this.get('disopred_job');
  let disopred_checked = this.get('disopred_checked');
  let memsatsvm_job = this.get('memsatsvm_job');
  let memsatsvm_checked = this.get('memsatsvm_checked');
  let pgenthreader_job = this.get('pgenthreader_job');
  let pgenthreader_checked = this.get('pgenthreader_checked');
  let mempack_job = this.get('mempack_job');
  let mempack_checked = this.get('mempack_checked');
  let genthreader_job = this.get('genthreader_job');
  let genthreader_checked = this.get('genthreader_checked');
  let dompred_job = this.get('dompred_job');
  let dompred_checked = this.get('dompred_checked');
  let pdomthreader_job = this.get('pdomthreader_job');
  let pdomthreader_checked = this.get('pdomthreader_checked');
  let bioserf_job = this.get('bioserf_job');
  let bioserf_checked = this.get('bioserf_checked');
  let domserf_job = this.get('domserf_job');
  let domserf_checked = this.get('domserf_checked');
  let ffpred_job = this.get('ffpred_job');
  let ffpred_checked = this.get('ffpred_checked');
  let metapsicov_job = this.get('metapsicov_job');
  let metapsicov_checked = this.get('metapsicov_checked');
  let metsite_job = this.get('metasite_job');
  let metsite_checked = this.get('metasite_checked');
  let hspred_job = this.get('hspred_job');
  let hspred_checked = this.get('hspred_checked');
  let memembed_job = this.get('memembed_job');
  let memembed_checked = this.get('memembed_checked');
  let gentdb_job = this.get('gentdb_job');
  let gentdb_checked = this.get('gentdb_checked');
  //clear what we have previously written
  clear_settings(ractive, gear_string);
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  verify_and_send_form(ractive, subsequence, name, email, submit_url, times_url, psipred_checked, disopred_checked,
                       memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked,
                       pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked,
                       metsite_checked, hspred_checked, memembed_checked, gentdb_checked);
  //write new annotation diagram
  //submit subsection
  event.original.preventDefault();
});

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
  ractive.set('results_visible', 2 );
  ractive.set("batch_uuid", getUrlVars().uuid);
  let previous_data = get_previous_data(getUrlVars().uuid, submit_url, file_url, ractive);
  if(previous_data.jobs.includes('psipred'))
  {
      ractive.set('psipred_button', true );
      ractive.set('results_panel_visible', 1);
  }
  if(previous_data.jobs.includes('disopred'))
  {
      ractive.set('disopred_button', true );
      ractive.set('results_panel_visible', 4);
  }
  if(previous_data.jobs.includes('memsatsvm'))
  {
      ractive.set('memsatsvm_button', true );
      ractive.set('results_panel_visible', 6);
  }
  if(previous_data.jobs.includes('pgenthreader'))
  {
      ractive.set('psipred_button', true );
      ractive.set('pgenthreader_button', true );
      ractive.set('results_panel_visible', 2);
  }
  if(previous_data.jobs.includes('mempack'))
  {
      ractive.set('memsatsvm_button', true );
      ractive.set('mempack_button', true );
      ractive.set('results_panel_visible', 5);
  }
  if(previous_data.jobs.includes('genthreader'))
  {
      ractive.set('genthreader_button', true );
      ractive.set('results_panel_visible', 7);
  }
  if(previous_data.jobs.includes('dompred'))
  {
      ractive.set('psipred_button', true );
      ractive.set('dompred_button', true );
      ractive.set('results_panel_visible', 8);
  }
  if(previous_data.jobs.includes('pdomthreader'))
  {
      ractive.set('psipred_button', true );
      ractive.set('pdomthreader_button', true );
      ractive.set('results_panel_visible', 9);
  }
  if(previous_data.jobs.includes('bioserf'))
  {
      ractive.set('psipred_button', true );
      ractive.set('pgenthreader_button', true );
      ractive.set('bioserf_button', true );
      ractive.set('results_panel_visible', 10);
  }
  if(previous_data.jobs.includes('domserf'))
  {
      ractive.set('psipred_button', true );
      ractive.set('pdomthreader_button', true );
      ractive.set('results_panel_visible', 12);
  }
  if(previous_data.jobs.includes('ffpred'))
  {
      ractive.set('psipred_button', true );
      ractive.set('disopred_button', true );
      ractive.set('results_panel_visible', 13);
  }
  if(previous_data.jobs.includes('metsite'))
  {
      ractive.set('metsite_button', true );
      ractive.set('results_panel_visible', 14);
  }
  if(previous_data.jobs.includes('hspred'))
  {
      ractive.set('hspred_button', true );
      ractive.set('results_panel_visible', 15);
  }
  if(previous_data.jobs.includes('memembed'))
  {
      ractive.set('memembed_button', true );
      ractive.set('results_panel_visible', 16);
  }
  if(previous_data.jobs.includes('gentdb'))
  {
      ractive.set('gentdb_button', true );
      ractive.set('results_panel_visible', 17);
  }
  if(previous_data.jobs.includes('metapsicov'))
  {
      ractive.set('metapsicov_button', true );
      ractive.set('results_panel_visible', 18);
  }


  ractive.set('sequence',previous_data.seq);
  ractive.set('email',previous_data.email);
  ractive.set('name',previous_data.name);
  let seq = ractive.get('sequence');
  ractive.set('sequence_length', seq.length);
  ractive.set('subsequence_stop', seq.length);
  ractive.fire('poll_trigger', 'psipred');
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
export function buildModel(alnURI) {

  let url = submit_url+ractive.get('batch_uuid');
  let mod_key = ractive.get('modeller_key');
  if(mod_key === 'M'+'O'+'D'+'E'+'L'+'I'+'R'+'A'+'N'+'J'+'E')
  {
    window.open(".."+app_path+"/model/post?aln="+file_url+alnURI, "", "width=670,height=700");
  }
  else
  {
    alert('Please provide a valid M'+'O'+'D'+'E'+'L'+'L'+'E'+'R Licence Key');
  }
}
