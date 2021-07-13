var psipred =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

//given a job name prep all the form elements and send an http request to the
//backend
function send_job(job_name, seq, name, email, ractive_instance) {
  //alert(seq);
  console.log("Sending form data");
  var file = null;
  let upper_name = job_name.toUpperCase();
  try {
    file = new Blob([seq]);
  } catch (e) {
    alert(e);
  }
  let fd = new FormData();
  fd.append("input_data", file, 'input.txt');
  fd.append("job", job_name);
  fd.append("submission_name", name);
  fd.append("email", email);

  let response_data = send_request(submit_url, "POST", fd);
  if (response_data !== null) {
    times = send_request(times_url, 'GET', {});
    //alert(JSON.stringify(times));
    if (job_name in times) {
      ractive_instance.set(job_name + '_time', upper_name + " jobs typically take " + times[job_name] + " seconds");
    } else {
      ractive_instance.set(job_name + '_time', "Unable to retrieve average time for " + upper_name + " jobs.");
    }
    for (var k in response_data) {
      if (k == "UUID") {
        ractive_instance.set('batch_uuid', response_data[k]);
        ractive.fire('poll_trigger', job_name);
      }
    }
  } else {
    return null;
  }
  return true;
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__forms_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_index_js__);
/* 1. Catch form input
     2. Verify form
     3. If good then make file from data and pass to backend
     4. shrink form away
     5. Open seq panel
     6. Show processing animation
     7. listen for result
*/



// import {  } from './ractive_helper/index.js';
var clipboard = new Clipboard('.copyButton');
var zip = new JSZip();

clipboard.on('success', function (e) {
  console.log(e);
});
clipboard.on('error', function (e) {
  console.log(e);
});

// SET ENDPOINTS FOR DEV, STAGING OR PROD
let endpoints_url = null;
let submit_url = null;
let times_url = null;
let gears_svg = "http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg";
let main_url = "http://bioinfstage3.cs.ucl.ac.uk";
let app_path = "/analytics_automated";
let file_url = '';

if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
  endpoints_url = 'http://127.0.0.1:8000/analytics_automated/endpoints/';
  submit_url = 'http://127.0.0.1:8000/analytics_automated/submission/';
  times_url = 'http://127.0.0.1:8000/analytics_automated/jobtimes/';
  app_path = '/interface';
  main_url = 'http://127.0.0.1:8000';
  gears_svg = "../static/images/gears.svg";
  file_url = main_url;
} else if (location.hostname === "bioinfstage1.cs.ucl.ac.uk" || location.hostname === "bioinf.cs.ucl.ac.uk" || location.href === "http://bioinf.cs.ucl.ac.uk/psipred_beta/") {
  endpoints_url = main_url + app_path + '/api/endpoints/';
  submit_url = main_url + app_path + '/api/submission/';
  times_url = main_url + app_path + '/api/jobtimes/';
  file_url = main_url + app_path + "/api";
  //gears_svg = "../static/images/gears.svg";
} else {
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
    results_visible: 1,
    results_panel_visible: 1,
    submission_widget_visible: 0,
    modeller_key: null,

    psipred_checked: true,
    psipred_button: false,
    disopred_checked: false,
    disopred_button: false,
    memsatsvm_checked: false,
    memsatsvm_button: false,
    pgenthreader_checked: false,
    pgenthreader_button: false,

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

    psipred_waiting_message: '<h2>Please wait for your PSIPRED job to process</h2>',
    psipred_waiting_icon: '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"></object>',
    psipred_time: 'Loading Data',
    psipred_horiz: null,

    disopred_waiting_message: '<h2>Please wait for your DISOPRED job to process</h2>',
    disopred_waiting_icon: '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"></object>',
    disopred_time: 'Loading Data',
    diso_precision: null,

    memsatsvm_waiting_message: '<h2>Please wait for your MEMSAT-SVM job to process</h2>',
    memsatsvm_waiting_icon: '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"></object>',
    memsatsvm_time: 'Loading Data',
    memsatsvm_schematic: '',
    memsatsvm_cartoon: '',

    pgenthreader_waiting_message: '<h2>Please wait for your pGenTHREADER job to process</h2>',
    pgenthreader_waiting_icon: '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"></object>',
    pgenthreader_time: 'Loading Data',
    pgen_table: null,
    pgen_ann_set: {},

    // Sequence and job info
    sequence: '',
    sequence_length: 1,
    subsequence_start: 1,
    subsequence_stop: 1,
    email: '',
    name: '',
    batch_uuid: null,

    //hold annotations that are read from datafiles
    annotations: null
  }
});

if (location.hostname === "127.0.0.1") {
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
let seq_observer = ractive.observe('sequence', function (newValue, oldValue) {
  let regex = /^>(.+?)\s/;
  let match = regex.exec(newValue);
  if (match) {
    this.set('name', match[1]);
  }
  // else {
  //   this.set('name', null);
  // }
}, { init: false,
  defer: true
});

//theses two observers stop people setting the resubmission widget out of bounds
ractive.observe('subsequence_stop', function (value) {
  let seq_length = ractive.get('sequence_length');
  let seq_start = ractive.get('subsequence_start');
  if (value > seq_length) {
    ractive.set('subsequence_stop', seq_length);
  }
  if (value <= seq_start) {
    ractive.set('subsequence_stop', seq_start + 1);
  }
});
ractive.observe('subsequence_start', function (value) {
  let seq_stop = ractive.get('subsequence_stop');
  if (value < 1) {
    ractive.set('subsequence_start', 1);
  }
  if (value >= seq_stop) {
    ractive.set('subsequence_start', seq_stop - 1);
  }
});

//After a job has been sent or a URL accepted this ractive block is called to
//poll the backend to get the results
ractive.on('poll_trigger', function (name, job_type) {
  console.log("Polling backend for results");
  let horiz_regex = /\.horiz$/;
  let ss2_regex = /\.ss2$/;
  let memsat_cartoon_regex = /_cartoon_memsat_svm\.png$/;
  let memsat_schematic_regex = /_schematic\.png$/;
  let memsat_data_regex = /memsat_svm$/;
  let image_regex = '';
  let url = submit_url + ractive.get('batch_uuid');
  history.pushState(null, '', app_path + '/&uuid=' + ractive.get('batch_uuid'));

  draw_empty_annotation_panel();

  let interval = setInterval(function () {
    let batch = send_request(url, "GET", {});
    let downloads_info = {};

    if (batch.state === 'Complete') {
      console.log("Render results");
      let submissions = batch.submissions;
      submissions.forEach(function (data) {
        // console.log(data);
        if (data.job_name.includes('psipred')) {
          downloads_info.psipred = {};
          downloads_info.psipred.header = "<h5>PSIPRED DOWNLOADS</h5>";
        }
        if (data.job_name.includes('disopred')) {
          downloads_info.disopred = {};
          downloads_info.disopred.header = "<h5>DISOPRED DOWNLOADS</h5>";
        }
        if (data.job_name.includes('memsatsvm')) {
          downloads_info.memsatsvm = {};
          downloads_info.memsatsvm.header = "<h5>MEMSATSVM DOWNLOADS</h5>";
        }
        if (data.job_name.includes('pgenthreader')) {
          downloads_info.psipred = {};
          downloads_info.psipred.header = "<h5>PSIPRED DOWNLOADS</h5>";
          downloads_info.pgenthreader = {};
          downloads_info.pgenthreader.header = "<h5>pGenTHREADER DOWNLOADS</h5>";
        }

        let results = data.results;
        for (var i in results) {
          let result_dict = results[i];
          if (result_dict.name === 'GenAlignmentAnnotation') {
            let ann_set = ractive.get("pgen_ann_set");
            let tmp = result_dict.data_path;
            let path = tmp.substr(0, tmp.lastIndexOf("."));
            let id = path.substr(path.lastIndexOf(".") + 1, path.length);
            ann_set[id] = {};
            ann_set[id].ann = path + ".ann";
            ann_set[id].aln = path + ".aln";
            ractive.set("pgen_ann_set", ann_set);
          }
        }

        for (var i in results) {
          let result_dict = results[i];
          //psipred files
          if (result_dict.name == 'psipass2') {
            let match = horiz_regex.exec(result_dict.data_path);
            if (match) {
              process_file(file_url, result_dict.data_path, 'horiz');
              ractive.set("psipred_waiting_message", '');
              downloads_info.psipred.horiz = '<a href="' + file_url + result_dict.data_path + '">Horiz Format Output</a><br />';
              ractive.set("psipred_waiting_icon", '');
              ractive.set("psipred_time", '');
            }
            let ss2_match = ss2_regex.exec(result_dict.data_path);
            if (ss2_match) {
              downloads_info.psipred.ss2 = '<a href="' + file_url + result_dict.data_path + '">SS2 Format Output</a><br />';
              process_file(file_url, result_dict.data_path, 'ss2');
            }
          }
          //disopred files
          if (result_dict.name === 'diso_format') {
            process_file(file_url, result_dict.data_path, 'pbdat');
            ractive.set("disopred_waiting_message", '');
            downloads_info.disopred.pbdat = '<a href="' + file_url + result_dict.data_path + '">PBDAT Format Output</a><br />';
            ractive.set("disopred_waiting_icon", '');
            ractive.set("disopred_time", '');
          }
          if (result_dict.name === 'diso_combine') {
            process_file(file_url, result_dict.data_path, 'comb');
            downloads_info.disopred.comb = '<a href="' + file_url + result_dict.data_path + '">COMB NN Output</a><br />';
          }

          if (result_dict.name === 'memsatsvm') {
            ractive.set("memsatsvm_waiting_message", '');
            ractive.set("memsatsvm_waiting_icon", '');
            ractive.set("memsatsvm_time", '');
            let scheme_match = memsat_schematic_regex.exec(result_dict.data_path);
            if (scheme_match) {
              ractive.set('memsatsvm_schematic', '<img src="' + file_url + result_dict.data_path + '" />');
              downloads_info.memsatsvm.schematic = '<a href="' + file_url + result_dict.data_path + '">Schematic Diagram</a><br />';
            }
            let cartoon_match = memsat_cartoon_regex.exec(result_dict.data_path);
            if (cartoon_match) {
              ractive.set('memsatsvm_cartoon', '<img src="' + file_url + result_dict.data_path + '" />');
              downloads_info.memsatsvm.cartoon = '<a href="' + file_url + result_dict.data_path + '">Cartoon Diagram</a><br />';
            }
            let memsat_match = memsat_data_regex.exec(result_dict.data_path);
            if (memsat_match) {
              process_file(file_url, result_dict.data_path, 'memsatdata');
              downloads_info.memsatsvm.data = '<a href="' + file_url + result_dict.data_path + '">Memsat Output</a><br />';
            }
          }
          if (result_dict.name === 'sort_presult') {
            ractive.set("pgenthreader_waiting_message", '');
            ractive.set("pgenthreader_waiting_icon", '');
            ractive.set("pgenthreader_time", '');
            process_file(file_url, result_dict.data_path, 'presult');
            downloads_info.pgenthreader.table = '<a href="' + file_url + result_dict.data_path + '">pGenTHREADER Table</a><br />';
          }
          if (result_dict.name === 'pseudo_bas_align') {
            downloads_info.pgenthreader.align = '<a href="' + file_url + result_dict.data_path + '">pGenTHREADER Alignments</a><br />';
          }
        }
      });
      let downloads_string = ractive.get('download_links');
      if ('psipred' in downloads_info) {
        downloads_string = downloads_string.concat(downloads_info.psipred.header);
        downloads_string = downloads_string.concat(downloads_info.psipred.horiz);
        downloads_string = downloads_string.concat(downloads_info.psipred.ss2);
        downloads_string = downloads_string.concat("<br />");
      }
      if ('disopred' in downloads_info) {
        downloads_string = downloads_string.concat(downloads_info.disopred.header);
        downloads_string = downloads_string.concat(downloads_info.disopred.pbdat);
        downloads_string = downloads_string.concat(downloads_info.disopred.comb);
        downloads_string = downloads_string.concat("<br />");
      }
      if ('memsatsvm' in downloads_info) {
        downloads_string = downloads_string.concat(downloads_info.memsatsvm.header);
        downloads_string = downloads_string.concat(downloads_info.memsatsvm.data);
        downloads_string = downloads_string.concat(downloads_info.memsatsvm.schematic);
        downloads_string = downloads_string.concat(downloads_info.memsatsvm.cartoon);
        downloads_string = downloads_string.concat("<br />");
      }
      if ('pgenthreader' in downloads_info) {
        downloads_string = downloads_string.concat(downloads_info.pgenthreader.header);
        downloads_string = downloads_string.concat(downloads_info.pgenthreader.table);
        downloads_string = downloads_string.concat(downloads_info.pgenthreader.align);
        downloads_string = downloads_string.concat("<br />");
      }

      ractive.set('download_links', downloads_string);
      clearInterval(interval);
    }
    if (batch.state === 'Error' || batch.state === 'Crash') {
      let submission_message = batch.submissions[0].last_message;
      alert("POLLING ERROR: Job Failed\n" + "Please Contact psipred@cs.ucl.ac.uk quoting this error message and your job ID\n" + submission_message);
      clearInterval(interval);
    }
  }, 5000);
}, { init: false,
  defer: true
});

ractive.on('get_zip', function (context) {
  let uuid = ractive.get('batch_uuid');
  zip.generateAsync({ type: "blob" }).then(function (blob) {
    saveAs(blob, uuid + ".zip");
  });
});

// These react to the headers being clicked to toggle the results panel
ractive.on('downloads_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 11);
});

ractive.on('psipred_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 1);
  if (ractive.get('psipred_horiz')) {
    biod3.psipred(ractive.get('psipred_horiz'), 'psipredChart', { parent: 'div.psipred_cartoon', margin_scaler: 2 });
  }
});

ractive.on('disopred_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 4);
  if (ractive.get('diso_precision')) {
    biod3.genericxyLineChart(ractive.get('diso_precision'), 'pos', ['precision'], ['Black'], 'DisoNNChart', { parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
  }
});

ractive.on('memsatsvm_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 6);
});

ractive.on('pgenthreader_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 2);
});

ractive.on('submission_active', function (event) {
  let state = ractive.get('submission_widget_visible');
  if (state === 1) {
    ractive.set('submission_widget_visible', 0);
  } else {
    ractive.set('submission_widget_visible', 1);
  }
});

//grab the submit event from the main form and send the sequence to the backend
ractive.on('submit', function (event) {
  console.log('Submitting data');
  let seq = this.get('sequence');
  seq = seq.replace(/^>.+$/mg, "").toUpperCase();
  seq = seq.replace(/\n|\s/g, "");
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_index_js__["verify_and_send_form"])(seq, name, email, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, this);
  event.original.preventDefault();
});

// grab the submit event from the Resubmission widget, truncate the sequence
// and send a new job
ractive.on('resubmit', function (event) {
  console.log('Resubmitting segment');
  let start = ractive.get("subsequence_start");
  let stop = ractive.get("subsequence_stop");
  let sequence = ractive.get("sequence");
  let subsequence = sequence.substring(start - 1, stop);
  let name = this.get('name') + "_seg";
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

  //clear what we have previously written
  clear_settings();
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_index_js__["verify_and_send_form"])(subsequence, name, email, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, this);
  //write new annotation diagram
  //submit subsection
  event.original.preventDefault();
});

// Here having set up ractive and the functions we need we then check
// if we were provided a UUID, If the page is loaded with a UUID rather than a
// form submit.
//TODO: Handle loading that page with use the MEMSAT and DISOPRED UUID
//
if (getUrlVars().uuid && uuid_match) {
  console.log('Caught an incoming UUID');
  seq_observer.cancel();
  ractive.set('results_visible', null); // should make a generic one visible until results arrive.
  ractive.set('results_visible', 2);
  ractive.set("batch_uuid", getUrlVars().uuid);
  let previous_data = get_previous_data(getUrlVars().uuid);
  if (previous_data.jobs.includes('psipred')) {
    ractive.set('psipred_button', true);
    ractive.set('results_panel_visible', 1);
  }
  if (previous_data.jobs.includes('disopred')) {
    ractive.set('disopred_button', true);
    ractive.set('results_panel_visible', 4);
  }
  if (previous_data.jobs.includes('memsatsvm')) {
    ractive.set('memsatsvm_button', true);
    ractive.set('results_panel_visible', 6);
  }
  if (previous_data.jobs.includes('pgenthreader')) {
    ractive.set('psipred_button', true);
    ractive.set('pgenthreader_button', true);
    ractive.set('results_panel_visible', 2);
  }

  ractive.set('sequence', previous_data.seq);
  ractive.set('email', previous_data.email);
  ractive.set('name', previous_data.name);
  let seq = ractive.get('sequence');
  ractive.set('sequence_length', seq.length);
  ractive.set('subsequence_stop', seq.length);
  ractive.fire('poll_trigger', 'psipred');
}

///////////////////////////////////////////////////////////////////////////////
//
//
// HELPER FUNCTIONS
//
//
///////////////////////////////////////////////////////////////////////////////

//before a resubmission is sent all variables are reset to the page defaults
function clear_settings() {
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  ractive.set('psipred_waiting_message', '<h2>Please wait for your PSIPRED job to process</h2>');
  ractive.set('psipred_waiting_icon', '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"/>');
  ractive.set('psipred_time', 'Loading Data');
  ractive.set('psipred_horiz', null);
  ractive.set('disopred_waiting_message', '<h2>Please wait for your DISOPRED job to process</h2>');
  ractive.set('disopred_waiting_icon', '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"/>');
  ractive.set('disopred_time', 'Loading Data');
  ractive.set('diso_precision');
  ractive.set('memsatsvm_waiting_message', '<h2>Please wait for your MEMSAT-SVM job to process</h2>');
  ractive.set('memsatsvm_waiting_icon', '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"/>');
  ractive.set('memsatsvm_time', 'Loading Data');
  ractive.set('memsatsvm_schematic', '');
  ractive.set('memsatsvm_cartoon', '');
  ractive.set('pgenthreader_waiting_message', '<h2>Please wait for your pGenTHREADER job to process</h2>');
  ractive.set('pgenthreader_waiting_icon', '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"/>');
  ractive.set('pgenthreader_time', 'Loading Data');
  ractive.set('pgen_table', '');
  ractive.set('pgen_set', {});

  //ractive.set('diso_precision');

  ractive.set('annotations', null);
  ractive.set('batch_uuid', null);
  biod3.clearSelection('div.sequence_plot');
  biod3.clearSelection('div.psipred_cartoon');
  biod3.clearSelection('div.comb_plot');

  zip = new JSZip();
}

//when a results page is instantiated and before some annotations have come back
//we draw and empty annotation panel
function draw_empty_annotation_panel() {

  let seq = ractive.get('sequence');
  let residues = seq.split('');
  let annotations = [];
  residues.forEach(function (res) {
    annotations.push({ 'res': res });
  });
  ractive.set('annotations', annotations);
  biod3.annotationGrid(ractive.get('annotations'), { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
}

//utility function that gets the sequence from a previous submission is the
//page was loaded with a UUID
function get_previous_data(uuid) {
  console.log('Requesting details given URI');
  let url = submit_url + ractive.get('batch_uuid');
  //alert(url);
  let submission_response = send_request(url, "GET", {});
  if (!submission_response) {
    alert("NO SUBMISSION DATA");
  }
  let seq = get_text(file_url + submission_response.submissions[0].input_file, "GET", {});
  let jobs = '';
  submission_response.submissions.forEach(function (submission) {
    jobs += submission.job_name + ",";
  });
  jobs = jobs.slice(0, -1);
  return { 'seq': seq, 'email': submission_response.submissions[0].email, 'name': submission_response.submissions[0].submission_name, 'jobs': jobs };
}

//polls the backend to get results and then parses those results to display
//them on the page
function process_file(url_stub, path, ctl) {
  let url = url_stub + path;
  let path_bits = path.split("/");
  //get a results file and push the data in to the bio3d object
  //alert(url);
  console.log('Getting Results File and processing');
  let response = null;
  $.ajax({
    type: 'GET',
    async: true,
    url: url,
    success: function (file) {
      zip.folder(path_bits[1]).file(path_bits[2], file);
      if (ctl === 'horiz') {
        ractive.set('psipred_horiz', file);
        biod3.psipred(file, 'psipredChart', { parent: 'div.psipred_cartoon', margin_scaler: 2 });
      }
      if (ctl === 'ss2') {
        let annotations = ractive.get('annotations');
        let lines = file.split('\n');
        lines.shift();
        lines = lines.filter(Boolean);
        if (annotations.length == lines.length) {
          lines.forEach(function (line, i) {
            let entries = line.split(/\s+/);
            annotations[i].ss = entries[3];
          });
          ractive.set('annotations', annotations);
          biod3.annotationGrid(annotations, { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
        } else {
          alert("SS2 annotation length does not match query sequence");
        }
      }
      if (ctl === 'pbdat') {
        //alert('PBDAT process');
        let annotations = ractive.get('annotations');
        let lines = file.split('\n');
        lines.shift();lines.shift();lines.shift();lines.shift();lines.shift();
        lines = lines.filter(Boolean);
        if (annotations.length == lines.length) {
          lines.forEach(function (line, i) {
            let entries = line.split(/\s+/);
            if (entries[3] === '-') {
              annotations[i].disopred = 'D';
            }
            if (entries[3] === '^') {
              annotations[i].disopred = 'PB';
            }
          });
          ractive.set('annotations', annotations);
          biod3.annotationGrid(annotations, { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
        }
      }
      if (ctl === 'comb') {
        let precision = [];
        let lines = file.split('\n');
        lines.shift();lines.shift();lines.shift();
        lines = lines.filter(Boolean);
        lines.forEach(function (line, i) {
          let entries = line.split(/\s+/);
          precision[i] = {};
          precision[i].pos = entries[1];
          precision[i].precision = entries[4];
        });
        ractive.set('diso_precision', precision);
        biod3.genericxyLineChart(precision, 'pos', ['precision'], ['Black'], 'DisoNNChart', { parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
      }
      if (ctl === 'memsatdata') {
        let annotations = ractive.get('annotations');
        let seq = ractive.get('sequence');
        topo_regions = get_memsat_ranges(/Topology:\s+(.+?)\n/, file);
        signal_regions = get_memsat_ranges(/Signal\speptide:\s+(.+)\n/, file);
        reentrant_regions = get_memsat_ranges(/Re-entrant\shelices:\s+(.+?)\n/, file);
        terminal = get_memsat_ranges(/N-terminal:\s+(.+?)\n/, file);
        //console.log(signal_regions);
        // console.log(reentrant_regions);
        coil_type = 'CY';
        if (terminal === 'out') {
          coil_type = 'EC';
        }
        let tmp_anno = new Array(seq.length);
        if (topo_regions !== 'Not detected.') {
          let prev_end = 0;
          topo_regions.forEach(function (region) {
            tmp_anno = tmp_anno.fill('TM', region[0], region[1] + 1);
            if (prev_end > 0) {
              prev_end -= 1;
            }
            tmp_anno = tmp_anno.fill(coil_type, prev_end, region[0]);
            if (coil_type === 'EC') {
              coil_type = 'CY';
            } else {
              coil_type = 'EC';
            }
            prev_end = region[1] + 2;
          });
          tmp_anno = tmp_anno.fill(coil_type, prev_end - 1, seq.length);
        }
        //signal_regions = [[70,83], [102,117]];
        if (signal_regions !== 'Not detected.') {
          signal_regions.forEach(function (region) {
            tmp_anno = tmp_anno.fill('S', region[0], region[1] + 1);
          });
        }
        //reentrant_regions = [[40,50], [200,218]];
        if (reentrant_regions !== 'Not detected.') {
          reentrant_regions.forEach(function (region) {
            tmp_anno = tmp_anno.fill('RH', region[0], region[1] + 1);
          });
        }
        tmp_anno.forEach(function (anno, i) {
          annotations[i].memsat = anno;
        });
        ractive.set('annotations', annotations);
        biod3.annotationGrid(annotations, { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
      }
      if (ctl === 'presult') {

        let lines = file.split('\n');
        let ann_list = ractive.get('pgen_ann_set');
        if (Object.keys(ann_list).length > 0) {
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
          lines.forEach(function (line, i) {
            if (line.length === 0) {
              return;
            }
            entries = line.split(/\s+/);
            if (entries[9] + "_" + i in ann_list) {
              pseudo_table += "<tr>";
              pseudo_table += "<td class='" + entries[0].toLowerCase() + "'>" + entries[0] + "</td>";
              pseudo_table += "<td>" + entries[1] + "</td>";
              pseudo_table += "<td>" + entries[2] + "</td>";
              pseudo_table += "<td>" + entries[3] + "</td>";
              pseudo_table += "<td>" + entries[4] + "</td>";
              pseudo_table += "<td>" + entries[5] + "</td>";
              pseudo_table += "<td>" + entries[6] + "</td>";
              pseudo_table += "<td>" + entries[7] + "</td>";
              pseudo_table += "<td>" + entries[8] + "</td>";
              let pdb = entries[9].substring(0, entries[9].length - 2);
              pseudo_table += "<td><a target='_blank' href='https://www.rcsb.org/pdb/explore/explore.do?structureId=" + pdb + "'>" + entries[9] + "</a></td>";
              pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/scop/pdb.cgi?pdb=" + pdb + "'>SCOP SEARCH</a></td>";
              pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/pdb/" + pdb + "'>CATH SEARCH</a></td>";
              pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=" + pdb + "'>Open PDBSUM</a></td>";
              pseudo_table += "<td><input class='button' type='button' onClick='loadNewAlignment(\"" + ann_list[entries[9] + "_" + i].aln + "\",\"" + ann_list[entries[9] + "_" + i].ann + "\",\"" + (entries[9] + "_" + i) + "\");' value='Display Alignment' /></td>";
              pseudo_table += "<td><input class='button' type='button' onClick='buildModel(\"" + ann_list[entries[9] + "_" + i].aln + "\");' value='Build Model' /></td>";
              pseudo_table += "</tr>\n";
            }
          });
          pseudo_table += "</tbody></table>\n";
          ractive.set("pgen_table", pseudo_table);
        } else {
          ractive.set("pgen_table", "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>");
        }
      }
    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}

function get_memsat_ranges(regex, data) {
  let match = regex.exec(data);
  if (match[1].includes(',')) {
    let regions = match[1].split(',');
    regions.forEach(function (region, i) {
      regions[i] = region.split('-');
      regions[i][0] = parseInt(regions[i][0]);
      regions[i][1] = parseInt(regions[i][1]);
    });
    return regions;
  }
  return match[1];
}

//get text contents from a result URI
function get_text(url, type, send_data) {

  let response = null;
  $.ajax({
    type: type,
    data: send_data,
    cache: false,
    contentType: false,
    processData: false,
    async: false,
    //dataType: "txt",
    //contentType: "application/json",
    url: url,
    success: function (data) {
      if (data === null) {
        alert("Failed to request input data text");
      }
      response = data;
      //alert(JSON.stringify(response, null, 2))
    },
    error: function (error) {
      alert("Gettings results failed. The Backend processing service is not available. Something Catastrophic has gone wrong. Please contact psipred@cs.ucl.ac.uk");
    }
  });
  return response;
}

//given a url, http request type and some form data make an http request
function send_request(url, type, send_data) {
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
    async: false,
    dataType: "json",
    //contentType: "application/json",
    url: url,
    success: function (data) {
      if (data === null) {
        alert("Failed to send data");
      }
      response = data;
      //alert(JSON.stringify(response, null, 2))
    },
    error: function (error) {
      alert("Sending Job to " + url + " Failed. " + error.responseText + ". The Backend processing service is not available. Something Catastrophic has gone wrong. Please contact psipred@cs.ucl.ac.uk");return null;
    }
  }).responseJSON;
  return response;
}

//guven and array return whether and element is present
function isInArray(value, array) {
  if (array.indexOf(value) > -1) {
    return true;
  } else {
    return false;
  }
}

//given a URL return the attached variables
function getUrlVars() {
  let vars = {};
  //consider using location.search instead here
  let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function (document, documentElement) {
  // Enable strict mode
  "use strict";

  // Form the style on the fly to result in smaller minified file

  let important = "!important;";
  let style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

  window.getEmPixels = function (element) {

    let extraBody;

    if (!element) {
      // Emulate the documentElement to get rem value (documentElement does not work in IE6-7)
      element = extraBody = document.createElement("body");
      extraBody.style.cssText = "font-size:1em" + important;
      documentElement.insertBefore(extraBody, document.body);
    }

    // Create and style a test element
    let testElement = document.createElement("i");
    testElement.style.cssText = style;
    element.appendChild(testElement);

    // Get the client width of the test element
    let value = testElement.clientWidth;

    if (extraBody) {
      // Remove the extra body element
      documentElement.removeChild(extraBody);
    } else {
      // Remove the test element
      element.removeChild(testElement);
    }

    // Return the em value in pixels
    return value;
  };
})(document, document.documentElement);

//Reload alignments for JalView for the genTHREADER table
function loadNewAlignment(alnURI, annURI, title) {
  let url = submit_url + ractive.get('batch_uuid');
  window.open(".." + app_path + "/msa/?ann=" + file_url + annURI + "&aln=" + file_url + alnURI, "", "width=800,height=400");
}

//Reload alignments for JalView for the genTHREADER table
function buildModel(alnURI) {

  let url = submit_url + ractive.get('batch_uuid');
  let mod_key = ractive.get('modeller_key');
  if (mod_key === 'M' + 'O' + 'D' + 'E' + 'L' + 'I' + 'R' + 'A' + 'N' + 'J' + 'E') {
    window.open(".." + app_path + "/model/post?aln=" + file_url + alnURI, "", "width=670,height=700");
  } else {
    alert('Please provide a valid M' + 'O' + 'D' + 'E' + 'L' + 'L' + 'E' + 'R Licence Key');
  }
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_index_js__);


//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(seq, name, email, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, ractive_instance) {
  /*verify that everything here is ok*/
  let error_message = null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked]);
  if (error_message.length > 0) {
    ractive.set('form_error', error_message);
    alert("FORM ERROR:" + error_message);
  } else {
    //initialise the page
    let response = true;
    ractive.set('results_visible', null);
    //Post the jobs and intialise the annotations for each job
    //We also don't redundantly send extra psipred etc.. jobs
    //byt doing these test in a specific order
    if (pgenthreader_checked === true) {
      job_string = job_string.concat("pgenthreader,");
      ractive.set('pgenthreader_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if (disopred_checked === true) {
      job_string = job_string.concat("disopred,");
      ractive.set('disopred_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if (psipred_checked === true) {
      job_string = job_string.concat("psipred,");
      ractive.set('psipred_button', true);
    }
    if (memsatsvm_checked === true) {
      job_string = job_string.concat("memsatsvm,");
      ractive.set('memsatsvm_button', true);
    }

    job_string = job_string.slice(0, -1);
    response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_index_js__["send_job"])(job_string, seq, name, email, ractive_instance);
    //set visibility and render panel once
    if (psipred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('psipred_active');
      draw_empty_annotation_panel();
      // parse sequence and make seq plot
    } else if (disopred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('disopred_active');
      draw_empty_annotation_panel();
    } else if (memsatsvm_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('memsatsvm_active');
      draw_empty_annotation_panel();
    } else if (pgenthreader_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('pgenthreader_active');
      draw_empty_annotation_panel();
    }

    if (!response) {
      window.location.href = window.location.href;
    }
  }
}

//Takes the form elements and checks they are valid
function verify_form(seq, job_name, email, checked_array) {
  let error_message = "";
  if (!/^[\x00-\x7F]+$/.test(job_name)) {
    error_message = error_message + "Please restrict Job Names to valid letters numbers and basic punctuation<br />";
  }

  /* length checks */
  if (seq.length > 1500) {
    error_message = error_message + "Your sequence is too long to process<br />";
  }
  if (seq.length < 30) {
    error_message = error_message + "Your sequence is too short to process<br />";
  }

  /* nucleotide checks */
  let nucleotide_count = (seq.match(/A|T|C|G|U|N|a|t|c|g|u|n/g) || []).length;
  if (nucleotide_count / seq.length > 0.95) {
    error_message = error_message + "Your sequence appears to be nucleotide sequence. This service requires protein sequence as input<br />";
  }
  if (/[^ACDEFGHIKLMNPQRSTVWYX_-]+/i.test(seq)) {
    error_message = error_message + "Your sequence contains invalid characters<br />";
  }

  if (isInArray(true, checked_array) === false) {
    error_message = error_message + "You must select at least one analysis program";
  }
  return error_message;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDRlOWZiM2FjZDFiNGNkNmFkZmYiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbW1vbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZm9ybXMvaW5kZXguanMiXSwibmFtZXMiOlsic2VuZF9qb2IiLCJqb2JfbmFtZSIsInNlcSIsIm5hbWUiLCJlbWFpbCIsInJhY3RpdmVfaW5zdGFuY2UiLCJjb25zb2xlIiwibG9nIiwiZmlsZSIsInVwcGVyX25hbWUiLCJ0b1VwcGVyQ2FzZSIsIkJsb2IiLCJlIiwiYWxlcnQiLCJmZCIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicmVzcG9uc2VfZGF0YSIsInNlbmRfcmVxdWVzdCIsInN1Ym1pdF91cmwiLCJ0aW1lcyIsInRpbWVzX3VybCIsInNldCIsImsiLCJyYWN0aXZlIiwiZmlyZSIsImNsaXBib2FyZCIsIkNsaXBib2FyZCIsInppcCIsIkpTWmlwIiwib24iLCJlbmRwb2ludHNfdXJsIiwiZ2VhcnNfc3ZnIiwibWFpbl91cmwiLCJhcHBfcGF0aCIsImZpbGVfdXJsIiwibG9jYXRpb24iLCJob3N0bmFtZSIsImhyZWYiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsImRhdGEiLCJyZXN1bHRzX3Zpc2libGUiLCJyZXN1bHRzX3BhbmVsX3Zpc2libGUiLCJzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlIiwibW9kZWxsZXJfa2V5IiwicHNpcHJlZF9jaGVja2VkIiwicHNpcHJlZF9idXR0b24iLCJkaXNvcHJlZF9jaGVja2VkIiwiZGlzb3ByZWRfYnV0dG9uIiwibWVtc2F0c3ZtX2NoZWNrZWQiLCJtZW1zYXRzdm1fYnV0dG9uIiwicGdlbnRocmVhZGVyX2NoZWNrZWQiLCJwZ2VudGhyZWFkZXJfYnV0dG9uIiwiZG93bmxvYWRfbGlua3MiLCJwc2lwcmVkX2pvYiIsImRpc29wcmVkX2pvYiIsIm1lbXNhdHN2bV9qb2IiLCJwZ2VudGhyZWFkZXJfam9iIiwicHNpcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJwc2lwcmVkX3dhaXRpbmdfaWNvbiIsInBzaXByZWRfdGltZSIsInBzaXByZWRfaG9yaXoiLCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJkaXNvcHJlZF93YWl0aW5nX2ljb24iLCJkaXNvcHJlZF90aW1lIiwiZGlzb19wcmVjaXNpb24iLCJtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlIiwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvbiIsIm1lbXNhdHN2bV90aW1lIiwibWVtc2F0c3ZtX3NjaGVtYXRpYyIsIm1lbXNhdHN2bV9jYXJ0b29uIiwicGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZSIsInBnZW50aHJlYWRlcl93YWl0aW5nX2ljb24iLCJwZ2VudGhyZWFkZXJfdGltZSIsInBnZW5fdGFibGUiLCJwZ2VuX2Fubl9zZXQiLCJzZXF1ZW5jZSIsInNlcXVlbmNlX2xlbmd0aCIsInN1YnNlcXVlbmNlX3N0YXJ0Iiwic3Vic2VxdWVuY2Vfc3RvcCIsImJhdGNoX3V1aWQiLCJhbm5vdGF0aW9ucyIsInV1aWRfcmVnZXgiLCJ1dWlkX21hdGNoIiwiZXhlYyIsImdldFVybFZhcnMiLCJ1dWlkIiwic2VxX29ic2VydmVyIiwib2JzZXJ2ZSIsIm5ld1ZhbHVlIiwib2xkVmFsdWUiLCJyZWdleCIsIm1hdGNoIiwiaW5pdCIsImRlZmVyIiwidmFsdWUiLCJzZXFfbGVuZ3RoIiwiZ2V0Iiwic2VxX3N0YXJ0Iiwic2VxX3N0b3AiLCJqb2JfdHlwZSIsImhvcml6X3JlZ2V4Iiwic3MyX3JlZ2V4IiwibWVtc2F0X2NhcnRvb25fcmVnZXgiLCJtZW1zYXRfc2NoZW1hdGljX3JlZ2V4IiwibWVtc2F0X2RhdGFfcmVnZXgiLCJpbWFnZV9yZWdleCIsInVybCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiYmF0Y2giLCJkb3dubG9hZHNfaW5mbyIsInN0YXRlIiwic3VibWlzc2lvbnMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJwc2lwcmVkIiwiaGVhZGVyIiwiZGlzb3ByZWQiLCJtZW1zYXRzdm0iLCJwZ2VudGhyZWFkZXIiLCJyZXN1bHRzIiwiaSIsInJlc3VsdF9kaWN0IiwiYW5uX3NldCIsInRtcCIsImRhdGFfcGF0aCIsInBhdGgiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImlkIiwibGVuZ3RoIiwiYW5uIiwiYWxuIiwicHJvY2Vzc19maWxlIiwiaG9yaXoiLCJzczJfbWF0Y2giLCJzczIiLCJwYmRhdCIsImNvbWIiLCJzY2hlbWVfbWF0Y2giLCJzY2hlbWF0aWMiLCJjYXJ0b29uX21hdGNoIiwiY2FydG9vbiIsIm1lbXNhdF9tYXRjaCIsInRhYmxlIiwiYWxpZ24iLCJkb3dubG9hZHNfc3RyaW5nIiwiY29uY2F0IiwiY2xlYXJJbnRlcnZhbCIsInN1Ym1pc3Npb25fbWVzc2FnZSIsImxhc3RfbWVzc2FnZSIsImNvbnRleHQiLCJnZW5lcmF0ZUFzeW5jIiwidHlwZSIsInRoZW4iLCJibG9iIiwic2F2ZUFzIiwiZXZlbnQiLCJiaW9kMyIsInBhcmVudCIsIm1hcmdpbl9zY2FsZXIiLCJnZW5lcmljeHlMaW5lQ2hhcnQiLCJjaGFydFR5cGUiLCJ5X2N1dG9mZiIsImRlYnVnIiwiY29udGFpbmVyX3dpZHRoIiwid2lkdGgiLCJoZWlnaHQiLCJjb250YWluZXJfaGVpZ2h0IiwicmVwbGFjZSIsInZlcmlmeV9hbmRfc2VuZF9mb3JtIiwib3JpZ2luYWwiLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Iiwic3RvcCIsInN1YnNlcXVlbmNlIiwic3Vic3RyaW5nIiwiY2xlYXJfc2V0dGluZ3MiLCJjYW5jZWwiLCJwcmV2aW91c19kYXRhIiwiZ2V0X3ByZXZpb3VzX2RhdGEiLCJqb2JzIiwiY2xlYXJTZWxlY3Rpb24iLCJyZXNpZHVlcyIsInNwbGl0IiwicmVzIiwicHVzaCIsImFubm90YXRpb25HcmlkIiwic3VibWlzc2lvbl9yZXNwb25zZSIsImdldF90ZXh0IiwiaW5wdXRfZmlsZSIsInN1Ym1pc3Npb24iLCJzbGljZSIsInN1Ym1pc3Npb25fbmFtZSIsInVybF9zdHViIiwiY3RsIiwicGF0aF9iaXRzIiwicmVzcG9uc2UiLCIkIiwiYWpheCIsImFzeW5jIiwic3VjY2VzcyIsImZvbGRlciIsImxpbmVzIiwic2hpZnQiLCJmaWx0ZXIiLCJCb29sZWFuIiwibGluZSIsImVudHJpZXMiLCJzcyIsInByZWNpc2lvbiIsInBvcyIsInRvcG9fcmVnaW9ucyIsImdldF9tZW1zYXRfcmFuZ2VzIiwic2lnbmFsX3JlZ2lvbnMiLCJyZWVudHJhbnRfcmVnaW9ucyIsInRlcm1pbmFsIiwiY29pbF90eXBlIiwidG1wX2Fubm8iLCJBcnJheSIsInByZXZfZW5kIiwicmVnaW9uIiwiZmlsbCIsImFubm8iLCJtZW1zYXQiLCJhbm5fbGlzdCIsIk9iamVjdCIsImtleXMiLCJwc2V1ZG9fdGFibGUiLCJ0b0xvd2VyQ2FzZSIsInBkYiIsImVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlZ2lvbnMiLCJwYXJzZUludCIsInNlbmRfZGF0YSIsImNhY2hlIiwiY29udGVudFR5cGUiLCJwcm9jZXNzRGF0YSIsImRhdGFUeXBlIiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2VKU09OIiwiaXNJbkFycmF5IiwiYXJyYXkiLCJpbmRleE9mIiwidmFycyIsInBhcnRzIiwid2luZG93IiwibSIsImtleSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiaW1wb3J0YW50Iiwic3R5bGUiLCJnZXRFbVBpeGVscyIsImVsZW1lbnQiLCJleHRyYUJvZHkiLCJjcmVhdGVFbGVtZW50IiwiY3NzVGV4dCIsImluc2VydEJlZm9yZSIsImJvZHkiLCJ0ZXN0RWxlbWVudCIsImFwcGVuZENoaWxkIiwiY2xpZW50V2lkdGgiLCJyZW1vdmVDaGlsZCIsImxvYWROZXdBbGlnbm1lbnQiLCJhbG5VUkkiLCJhbm5VUkkiLCJ0aXRsZSIsIm9wZW4iLCJidWlsZE1vZGVsIiwibW9kX2tleSIsImVycm9yX21lc3NhZ2UiLCJqb2Jfc3RyaW5nIiwidmVyaWZ5X2Zvcm0iLCJjaGVja2VkX2FycmF5IiwidGVzdCIsIm51Y2xlb3RpZGVfY291bnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBLFNBQVNBLFFBQVQsQ0FBa0JDLFFBQWxCLEVBQTRCQyxHQUE1QixFQUFpQ0MsSUFBakMsRUFBdUNDLEtBQXZDLEVBQThDQyxnQkFBOUMsRUFDQTtBQUNFO0FBQ0FDLFVBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNBLE1BQUlDLE9BQU8sSUFBWDtBQUNBLE1BQUlDLGFBQWFSLFNBQVNTLFdBQVQsRUFBakI7QUFDQSxNQUNBO0FBQ0VGLFdBQU8sSUFBSUcsSUFBSixDQUFTLENBQUNULEdBQUQsQ0FBVCxDQUFQO0FBQ0QsR0FIRCxDQUdFLE9BQU9VLENBQVAsRUFDRjtBQUNFQyxVQUFNRCxDQUFOO0FBQ0Q7QUFDRCxNQUFJRSxLQUFLLElBQUlDLFFBQUosRUFBVDtBQUNBRCxLQUFHRSxNQUFILENBQVUsWUFBVixFQUF3QlIsSUFBeEIsRUFBOEIsV0FBOUI7QUFDQU0sS0FBR0UsTUFBSCxDQUFVLEtBQVYsRUFBZ0JmLFFBQWhCO0FBQ0FhLEtBQUdFLE1BQUgsQ0FBVSxpQkFBVixFQUE0QmIsSUFBNUI7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QUEyQ3NSLGFBQTNDLEVBQ0E7QUFDRSxNQUFJSCxnQkFBZ0IsRUFBcEI7QUFDQSxNQUFHLENBQUUsaUJBQWlCSSxJQUFqQixDQUFzQjFSLFFBQXRCLENBQUwsRUFDQTtBQUNFc1Isb0JBQWdCQSxnQkFBZ0IsZ0ZBQWhDO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFHclIsSUFBSXNJLE1BQUosR0FBYSxJQUFoQixFQUNBO0FBQ0UrSSxvQkFBZ0JBLGdCQUFnQiw0Q0FBaEM7QUFDRDtBQUNELE1BQUdyUixJQUFJc0ksTUFBSixHQUFhLEVBQWhCLEVBQ0E7QUFDRStJLG9CQUFnQkEsZ0JBQWdCLDZDQUFoQztBQUNEOztBQUVEO0FBQ0EsTUFBSUssbUJBQW1CLENBQUMxUixJQUFJNEYsS0FBSixDQUFVLDBCQUFWLEtBQXVDLEVBQXhDLEVBQTRDMEMsTUFBbkU7QUFDQSxNQUFJb0osbUJBQWlCMVIsSUFBSXNJLE1BQXRCLEdBQWdDLElBQW5DLEVBQ0E7QUFDRStJLG9CQUFnQkEsZ0JBQWdCLHdHQUFoQztBQUNEO0FBQ0QsTUFBRywrQkFBK0JJLElBQS9CLENBQW9DelIsR0FBcEMsQ0FBSCxFQUNBO0FBQ0VxUixvQkFBZ0JBLGdCQUFnQixpREFBaEM7QUFDRDs7QUFFRCxNQUFHOUIsVUFBVSxJQUFWLEVBQWdCaUMsYUFBaEIsTUFBbUMsS0FBdEMsRUFBNkM7QUFDM0NILG9CQUFnQkEsZ0JBQWdCLCtDQUFoQztBQUNEO0FBQ0QsU0FBT0EsYUFBUDtBQUNELEMiLCJmaWxlIjoicHNpcHJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkNGU5ZmIzYWNkMWI0Y2Q2YWRmZiIsIi8vZ2l2ZW4gYSBqb2IgbmFtZSBwcmVwIGFsbCB0aGUgZm9ybSBlbGVtZW50cyBhbmQgc2VuZCBhbiBodHRwIHJlcXVlc3QgdG8gdGhlXG4vL2JhY2tlbmRcbmZ1bmN0aW9uIHNlbmRfam9iKGpvYl9uYW1lLCBzZXEsIG5hbWUsIGVtYWlsLCByYWN0aXZlX2luc3RhbmNlKVxue1xuICAvL2FsZXJ0KHNlcSk7XG4gIGNvbnNvbGUubG9nKFwiU2VuZGluZyBmb3JtIGRhdGFcIik7XG4gIHZhciBmaWxlID0gbnVsbDtcbiAgbGV0IHVwcGVyX25hbWUgPSBqb2JfbmFtZS50b1VwcGVyQ2FzZSgpO1xuICB0cnlcbiAge1xuICAgIGZpbGUgPSBuZXcgQmxvYihbc2VxXSk7XG4gIH0gY2F0Y2ggKGUpXG4gIHtcbiAgICBhbGVydChlKTtcbiAgfVxuICBsZXQgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgZmQuYXBwZW5kKFwiaW5wdXRfZGF0YVwiLCBmaWxlLCAnaW5wdXQudHh0Jyk7XG4gIGZkLmFwcGVuZChcImpvYlwiLGpvYl9uYW1lKTtcbiAgZmQuYXBwZW5kKFwic3VibWlzc2lvbl9uYW1lXCIsbmFtZSk7XG4gIGZkLmFwcGVuZChcImVtYWlsXCIsIGVtYWlsKTtcblxuICBsZXQgcmVzcG9uc2VfZGF0YSA9IHNlbmRfcmVxdWVzdChzdWJtaXRfdXJsLCBcIlBPU1RcIiwgZmQpO1xuICBpZihyZXNwb25zZV9kYXRhICE9PSBudWxsKVxuICB7XG4gICAgdGltZXMgPSBzZW5kX3JlcXVlc3QodGltZXNfdXJsLCdHRVQnLHt9KTtcbiAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHRpbWVzKSk7XG4gICAgaWYoam9iX25hbWUgaW4gdGltZXMpXG4gICAge1xuICAgICAgcmFjdGl2ZV9pbnN0YW5jZS5zZXQoam9iX25hbWUrJ190aW1lJywgdXBwZXJfbmFtZStcIiBqb2JzIHR5cGljYWxseSB0YWtlIFwiK3RpbWVzW2pvYl9uYW1lXStcIiBzZWNvbmRzXCIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgcmFjdGl2ZV9pbnN0YW5jZS5zZXQoam9iX25hbWUrJ190aW1lJywgXCJVbmFibGUgdG8gcmV0cmlldmUgYXZlcmFnZSB0aW1lIGZvciBcIit1cHBlcl9uYW1lK1wiIGpvYnMuXCIpO1xuICAgIH1cbiAgICBmb3IodmFyIGsgaW4gcmVzcG9uc2VfZGF0YSlcbiAgICB7XG4gICAgICBpZihrID09IFwiVVVJRFwiKVxuICAgICAge1xuICAgICAgICByYWN0aXZlX2luc3RhbmNlLnNldCgnYmF0Y2hfdXVpZCcsIHJlc3BvbnNlX2RhdGFba10pO1xuICAgICAgICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsIGpvYl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvY29tbW9uL2luZGV4LmpzIiwiLyogMS4gQ2F0Y2ggZm9ybSBpbnB1dFxuICAgICAyLiBWZXJpZnkgZm9ybVxuICAgICAzLiBJZiBnb29kIHRoZW4gbWFrZSBmaWxlIGZyb20gZGF0YSBhbmQgcGFzcyB0byBiYWNrZW5kXG4gICAgIDQuIHNocmluayBmb3JtIGF3YXlcbiAgICAgNS4gT3BlbiBzZXEgcGFuZWxcbiAgICAgNi4gU2hvdyBwcm9jZXNzaW5nIGFuaW1hdGlvblxuICAgICA3LiBsaXN0ZW4gZm9yIHJlc3VsdFxuKi9cbmltcG9ydCB7IHZlcmlmeV9hbmRfc2VuZF9mb3JtIH0gZnJvbSAnLi9mb3Jtcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBzZW5kX2pvYiB9IGZyb20gJy4vY29tbW9uL2luZGV4LmpzJztcblxuLy8gaW1wb3J0IHsgIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlci9pbmRleC5qcyc7XG52YXIgY2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgnLmNvcHlCdXR0b24nKTtcbnZhciB6aXAgPSBuZXcgSlNaaXAoKTtcblxuY2xpcGJvYXJkLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xufSk7XG5jbGlwYm9hcmQub24oJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xufSk7XG5cbi8vIFNFVCBFTkRQT0lOVFMgRk9SIERFViwgU1RBR0lORyBPUiBQUk9EXG5sZXQgZW5kcG9pbnRzX3VybCA9IG51bGw7XG5sZXQgc3VibWl0X3VybCA9IG51bGw7XG5sZXQgdGltZXNfdXJsID0gbnVsbDtcbmxldCBnZWFyc19zdmcgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrL3BzaXByZWRfYmV0YS9zdGF0aWMvaW1hZ2VzL2dlYXJzLnN2Z1wiO1xubGV0IG1haW5fdXJsID0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51a1wiO1xubGV0IGFwcF9wYXRoID0gXCIvcHNpcHJlZF9iZXRhXCI7XG5sZXQgZmlsZV91cmwgPSAnJztcblxuaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiMTI3LjAuMC4xXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIpXG57XG4gIGVuZHBvaW50c191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvZW5kcG9pbnRzLyc7XG4gIHN1Ym1pdF91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvam9idGltZXMvJztcbiAgYXBwX3BhdGggPSAnL2ludGVyZmFjZSc7XG4gIG1haW5fdXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCc7XG4gIGdlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbiAgZmlsZV91cmwgPSBtYWluX3VybDtcbn1cbmVsc2UgaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiYmlvaW5mc3RhZ2UxLmNzLnVjbC5hYy51a1wiIHx8IGxvY2F0aW9uLmhvc3RuYW1lICA9PT0gXCJiaW9pbmYuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaHJlZiAgPT09IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL1wiKSB7XG4gIGVuZHBvaW50c191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL3N1Ym1pc3Npb24vJztcbiAgdGltZXNfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvam9idGltZXMvJztcbiAgZmlsZV91cmwgPSBtYWluX3VybCthcHBfcGF0aCtcIi9hcGlcIjtcbiAgLy9nZWFyc19zdmcgPSBcIi4uL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG59XG5lbHNlIHtcbiAgYWxlcnQoJ1VOU0VUVElORyBFTkRQT0lOVFMgV0FSTklORywgV0FSTklORyEnKTtcbiAgZW5kcG9pbnRzX3VybCA9ICcnO1xuICBzdWJtaXRfdXJsID0gJyc7XG4gIHRpbWVzX3VybCA9ICcnO1xufVxuXG5cbi8vIERFQ0xBUkUgVkFSSUFCTEVTIGFuZCBpbml0IHJhY3RpdmUgaW5zdGFuY2VcblxudmFyIHJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XG4gIGVsOiAnI3BzaXByZWRfc2l0ZScsXG4gIHRlbXBsYXRlOiAnI2Zvcm1fdGVtcGxhdGUnLFxuICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0c192aXNpYmxlOiAxLFxuICAgICAgICAgIHJlc3VsdHNfcGFuZWxfdmlzaWJsZTogMSxcbiAgICAgICAgICBzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlOiAwLFxuICAgICAgICAgIG1vZGVsbGVyX2tleTogbnVsbCxcblxuICAgICAgICAgIHBzaXByZWRfY2hlY2tlZDogdHJ1ZSxcbiAgICAgICAgICBwc2lwcmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBtZW1zYXRzdm1fY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWVtc2F0c3ZtX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9idXR0b246IGZhbHNlLFxuXG5cbiAgICAgICAgICAvLyBwZ2VudGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gcGRvbXRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIGRvbXByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gbWVtcGFja19jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBmZnByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gYmlvc2VyZl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBkb21zZXJmX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGRvd25sb2FkX2xpbmtzOiAnJyxcbiAgICAgICAgICBwc2lwcmVkX2pvYjogJ3BzaXByZWRfam9iJyxcbiAgICAgICAgICBkaXNvcHJlZF9qb2I6ICdkaXNvcHJlZF9qb2InLFxuICAgICAgICAgIG1lbXNhdHN2bV9qb2I6ICdtZW1zYXRzdm1fam9iJyxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfam9iOiAncGdlbnRocmVhZGVyX2pvYicsXG5cbiAgICAgICAgICBwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBQU0lQUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIHBzaXByZWRfd2FpdGluZ19pY29uOiAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIj48L29iamVjdD4nLFxuICAgICAgICAgIHBzaXByZWRfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcHNpcHJlZF9ob3JpejogbnVsbCxcblxuICAgICAgICAgIGRpc29wcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBESVNPUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBkaXNvcHJlZF93YWl0aW5nX2ljb246ICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiPjwvb2JqZWN0PicsXG4gICAgICAgICAgZGlzb3ByZWRfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZGlzb19wcmVjaXNpb246IG51bGwsXG5cbiAgICAgICAgICBtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVNBVC1TVk0gam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgbWVtc2F0c3ZtX3dhaXRpbmdfaWNvbjogJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JyxcbiAgICAgICAgICBtZW1zYXRzdm1fdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0c3ZtX3NjaGVtYXRpYzogJycsXG4gICAgICAgICAgbWVtc2F0c3ZtX2NhcnRvb246ICcnLFxuXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbjogJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JyxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcGdlbl90YWJsZTogbnVsbCxcbiAgICAgICAgICBwZ2VuX2Fubl9zZXQ6IHt9LFxuXG4gICAgICAgICAgLy8gU2VxdWVuY2UgYW5kIGpvYiBpbmZvXG4gICAgICAgICAgc2VxdWVuY2U6ICcnLFxuICAgICAgICAgIHNlcXVlbmNlX2xlbmd0aDogMSxcbiAgICAgICAgICBzdWJzZXF1ZW5jZV9zdGFydDogMSxcbiAgICAgICAgICBzdWJzZXF1ZW5jZV9zdG9wOiAxLFxuICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBiYXRjaF91dWlkOiBudWxsLFxuXG4gICAgICAgICAgLy9ob2xkIGFubm90YXRpb25zIHRoYXQgYXJlIHJlYWQgZnJvbSBkYXRhZmlsZXNcbiAgICAgICAgICBhbm5vdGF0aW9uczogbnVsbCxcbiAgICAgICAgfVxufSk7XG5cbmlmKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcIjEyNy4wLjAuMVwiKSB7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcsICdkYW5pZWwuYnVjaGFuQHVjbC5hYy51aycpO1xuICByYWN0aXZlLnNldCgnbmFtZScsICd0ZXN0Jyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsICdRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBUycpO1xufVxuXG4vLzRiNmFkNzkyLWVkMWYtMTFlNS04OTg2LTk4OTA5NmMxM2VlNlxubGV0IHV1aWRfcmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9JC9pO1xubGV0IHV1aWRfbWF0Y2ggPSB1dWlkX3JlZ2V4LmV4ZWMoZ2V0VXJsVmFycygpLnV1aWQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEFQUExJQ0FUSU9OIEhFUkVcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0hlcmUgd2VyZSBrZWVwIGFuIGV5ZSBvbiBzb21lIGZvcm0gZWxlbWVudHMgYW5kIHJld3JpdGUgdGhlIG5hbWUgaWYgcGVvcGxlXG4vL2hhdmUgcHJvdmlkZWQgYSBmYXN0YSBmb3JtYXR0ZWQgc2VxXG5sZXQgc2VxX29ic2VydmVyID0gcmFjdGl2ZS5vYnNlcnZlKCdzZXF1ZW5jZScsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgbGV0IHJlZ2V4ID0gL14+KC4rPylcXHMvO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG5ld1ZhbHVlKTtcbiAgaWYobWF0Y2gpXG4gIHtcbiAgICB0aGlzLnNldCgnbmFtZScsIG1hdGNoWzFdKTtcbiAgfVxuICAvLyBlbHNlIHtcbiAgLy8gICB0aGlzLnNldCgnbmFtZScsIG51bGwpO1xuICAvLyB9XG5cbiAgfSxcbiAge2luaXQ6IGZhbHNlLFxuICAgZGVmZXI6IHRydWVcbiB9KTtcblxuLy90aGVzZXMgdHdvIG9ic2VydmVycyBzdG9wIHBlb3BsZSBzZXR0aW5nIHRoZSByZXN1Ym1pc3Npb24gd2lkZ2V0IG91dCBvZiBib3VuZHNcbnJhY3RpdmUub2JzZXJ2ZSggJ3N1YnNlcXVlbmNlX3N0b3AnLCBmdW5jdGlvbiAoIHZhbHVlICkge1xuICBsZXQgc2VxX2xlbmd0aCA9IHJhY3RpdmUuZ2V0KCdzZXF1ZW5jZV9sZW5ndGgnKTtcbiAgbGV0IHNlcV9zdGFydCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcpO1xuICBpZih2YWx1ZSA+IHNlcV9sZW5ndGgpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9sZW5ndGgpO1xuICB9XG4gIGlmKHZhbHVlIDw9IHNlcV9zdGFydClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxX3N0YXJ0KzEpO1xuICB9XG59KTtcbnJhY3RpdmUub2JzZXJ2ZSggJ3N1YnNlcXVlbmNlX3N0YXJ0JywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9zdG9wID0gcmFjdGl2ZS5nZXQoJ3N1YnNlcXVlbmNlX3N0b3AnKTtcbiAgaWYodmFsdWUgPCAxKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0JywgMSk7XG4gIH1cbiAgaWYodmFsdWUgPj0gc2VxX3N0b3ApXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RhcnQnLCBzZXFfc3RvcC0xKTtcbiAgfVxufSk7XG5cbi8vQWZ0ZXIgYSBqb2IgaGFzIGJlZW4gc2VudCBvciBhIFVSTCBhY2NlcHRlZCB0aGlzIHJhY3RpdmUgYmxvY2sgaXMgY2FsbGVkIHRvXG4vL3BvbGwgdGhlIGJhY2tlbmQgdG8gZ2V0IHRoZSByZXN1bHRzXG5yYWN0aXZlLm9uKCdwb2xsX3RyaWdnZXInLCBmdW5jdGlvbihuYW1lLCBqb2JfdHlwZSl7XG4gIGNvbnNvbGUubG9nKFwiUG9sbGluZyBiYWNrZW5kIGZvciByZXN1bHRzXCIpO1xuICBsZXQgaG9yaXpfcmVnZXggPSAvXFwuaG9yaXokLztcbiAgbGV0IHNzMl9yZWdleCA9IC9cXC5zczIkLztcbiAgbGV0IG1lbXNhdF9jYXJ0b29uX3JlZ2V4ID0gL19jYXJ0b29uX21lbXNhdF9zdm1cXC5wbmckLztcbiAgbGV0IG1lbXNhdF9zY2hlbWF0aWNfcmVnZXggPSAvX3NjaGVtYXRpY1xcLnBuZyQvO1xuICBsZXQgbWVtc2F0X2RhdGFfcmVnZXggPSAvbWVtc2F0X3N2bSQvO1xuICBsZXQgaW1hZ2VfcmVnZXggPSAnJztcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwgKyByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgYXBwX3BhdGgrJy8mdXVpZD0nK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJykpO1xuXG4gIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCgpO1xuXG4gIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgbGV0IGJhdGNoID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGxldCBkb3dubG9hZHNfaW5mbyA9IHt9O1xuXG4gICAgaWYoYmF0Y2guc3RhdGUgPT09ICdDb21wbGV0ZScpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coXCJSZW5kZXIgcmVzdWx0c1wiKTtcbiAgICAgIGxldCBzdWJtaXNzaW9ucyA9IGJhdGNoLnN1Ym1pc3Npb25zO1xuICAgICAgc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwc2lwcmVkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5QU0lQUkVEIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2Rpc29wcmVkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQgPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlciA9IFwiPGg1PkRJU09QUkVEIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bT0ge307XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyID0gXCI8aDU+TUVNU0FUU1ZNIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ3BnZW50aHJlYWRlcicpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UFNJUFJFRCBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wR2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgcmVzdWx0cyA9IGRhdGEucmVzdWx0cztcbiAgICAgICAgICBmb3IodmFyIGkgaW4gcmVzdWx0cylcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0X2RpY3QgPSByZXN1bHRzW2ldO1xuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ0dlbkFsaWdubWVudEFubm90YXRpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJwZ2VuX2Fubl9zZXRcIik7XG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IHRtcC5zdWJzdHIoMCwgdG1wLmxhc3RJbmRleE9mKFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZihcIi5cIikrMSwgcGF0aC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgICAgICAgICAgYW5uX3NldFtpZF0uYW5uID0gcGF0aCtcIi5hbm5cIjtcbiAgICAgICAgICAgICAgICBhbm5fc2V0W2lkXS5hbG4gPSBwYXRoK1wiLmFsblwiO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvcih2YXIgaSBpbiByZXN1bHRzKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICAvL3BzaXByZWQgZmlsZXNcbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT0gJ3BzaXBhc3MyJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0gaG9yaXpfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICAgICAgICBpZihtYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnaG9yaXonKTtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+SG9yaXogRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF90aW1lXCIsICcnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc3MyX21hdGNoID0gc3MyX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgICAgICAgICAgaWYoc3MyX21hdGNoKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TUzIgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnc3MyJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdkaXNvX2Zvcm1hdCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlBCREFUIEZvcm1hdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3RpbWVcIiwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2Rpc29fY29tYmluZScpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnY29tYicpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5jb21iID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Q09NQiBOTiBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ21lbXNhdHN2bScpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3RpbWVcIiwgJycpO1xuICAgICAgICAgICAgICBsZXQgc2NoZW1lX21hdGNoID0gbWVtc2F0X3NjaGVtYXRpY19yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKHNjaGVtZV9tYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fc2NoZW1hdGljJywgJzxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLnNjaGVtYXRpYyA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlNjaGVtYXRpYyBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IGNhcnRvb25fbWF0Y2ggPSBtZW1zYXRfY2FydG9vbl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2NhcnRvb24nLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxldCBtZW1zYXRfbWF0Y2ggPSBtZW1zYXRfZGF0YV9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKG1lbXNhdF9tYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnbWVtc2F0ZGF0YScpO1xuICAgICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TWVtc2F0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnc29ydF9wcmVzdWx0JylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncHJlc3VsdCcpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIudGFibGUgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgVGFibGU8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfYWxpZ24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgQWxpZ25tZW50czwvYT48YnIgLz4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgICBsZXQgZG93bmxvYWRzX3N0cmluZyA9IHJhY3RpdmUuZ2V0KCdkb3dubG9hZF9saW5rcycpO1xuICAgICAgaWYoJ3BzaXByZWQnIGluIGRvd25sb2Fkc19pbmZvKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5ob3Jpeik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLnNzMik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgICAgIH1cbiAgICAgIGlmKCdkaXNvcHJlZCcgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgICAgIH1cbiAgICAgIGlmKCdtZW1zYXRzdm0nIGluIGRvd25sb2Fkc19pbmZvKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlcik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uZGF0YSk7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uc2NoZW1hdGljKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5jYXJ0b29uKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICAgICAgfVxuICAgICAgaWYoJ3BnZW50aHJlYWRlcicgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci50YWJsZSk7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24pO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gICAgICB9XG5cbiAgICAgIHJhY3RpdmUuc2V0KCdkb3dubG9hZF9saW5rcycsIGRvd25sb2Fkc19zdHJpbmcpO1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbnJhY3RpdmUub24oJ2dldF96aXAnLCBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGxldCB1dWlkID0gcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgICB6aXAuZ2VuZXJhdGVBc3luYyh7dHlwZTpcImJsb2JcIn0pLnRoZW4oZnVuY3Rpb24gKGJsb2IpIHtcbiAgICAgICAgc2F2ZUFzKGJsb2IsIHV1aWQrXCIuemlwXCIpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoZXNlIHJlYWN0IHRvIHRoZSBoZWFkZXJzIGJlaW5nIGNsaWNrZWQgdG8gdG9nZ2xlIHRoZSByZXN1bHRzIHBhbmVsXG5yYWN0aXZlLm9uKCAnZG93bmxvYWRzX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDExICk7XG59KTtcblxucmFjdGl2ZS5vbiggJ3BzaXByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSApO1xuICBpZihyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpKVxuICB7XG4gICAgYmlvZDMucHNpcHJlZChyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gIH1cbn0pO1xuXG5yYWN0aXZlLm9uKCAnZGlzb3ByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNCApO1xuICBpZihyYWN0aXZlLmdldCgnZGlzb19wcmVjaXNpb24nKSlcbiAge1xuICAgIGJpb2QzLmdlbmVyaWN4eUxpbmVDaGFydChyYWN0aXZlLmdldCgnZGlzb19wcmVjaXNpb24nKSwgJ3BvcycsIFsncHJlY2lzaW9uJ10sIFsnQmxhY2snLF0sICdEaXNvTk5DaGFydCcsIHtwYXJlbnQ6ICdkaXYuY29tYl9wbG90JywgY2hhcnRUeXBlOiAnbGluZScsIHlfY3V0b2ZmOiAwLjUsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgfVxufSk7XG5cbnJhY3RpdmUub24oICdtZW1zYXRzdm1fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNiApO1xufSk7XG5cbnJhY3RpdmUub24oICdwZ2VudGhyZWFkZXJfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMiApO1xufSk7XG5cbnJhY3RpdmUub24oICdzdWJtaXNzaW9uX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIGxldCBzdGF0ZSA9IHJhY3RpdmUuZ2V0KCdzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlJyk7XG4gIGlmKHN0YXRlID09PSAxKXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAwICk7XG4gIH1cbiAgZWxzZXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAxICk7XG4gIH1cbn0pO1xuXG4vL2dyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBtYWluIGZvcm0gYW5kIHNlbmQgdGhlIHNlcXVlbmNlIHRvIHRoZSBiYWNrZW5kXG5yYWN0aXZlLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnU3VibWl0dGluZyBkYXRhJyk7XG4gIGxldCBzZXEgPSB0aGlzLmdldCgnc2VxdWVuY2UnKTtcbiAgc2VxID0gc2VxLnJlcGxhY2UoL14+LiskL21nLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXFxufFxccy9nLFwiXCIpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHNlcSk7XG5cbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgbGV0IHBzaXByZWRfam9iID0gdGhpcy5nZXQoJ3BzaXByZWRfam9iJyk7XG4gIGxldCBwc2lwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgncHNpcHJlZF9jaGVja2VkJyk7XG4gIGxldCBkaXNvcHJlZF9qb2IgPSB0aGlzLmdldCgnZGlzb3ByZWRfam9iJyk7XG4gIGxldCBkaXNvcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ2Rpc29wcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1lbXNhdHN2bV9qb2IgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2pvYicpO1xuICBsZXQgbWVtc2F0c3ZtX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2NoZWNrZWQnKTtcbiAgbGV0IHBnZW50aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2pvYicpO1xuICBsZXQgcGdlbnRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2NoZWNrZWQnKTtcbiAgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCwgcHNpcHJlZF9jaGVja2VkLCBkaXNvcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICBtZW1zYXRzdm1fY2hlY2tlZCwgcGdlbnRocmVhZGVyX2NoZWNrZWQsIHRoaXMpO1xuICBldmVudC5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIGdyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBSZXN1Ym1pc3Npb24gd2lkZ2V0LCB0cnVuY2F0ZSB0aGUgc2VxdWVuY2Vcbi8vIGFuZCBzZW5kIGEgbmV3IGpvYlxucmFjdGl2ZS5vbigncmVzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnUmVzdWJtaXR0aW5nIHNlZ21lbnQnKTtcbiAgbGV0IHN0YXJ0ID0gcmFjdGl2ZS5nZXQoXCJzdWJzZXF1ZW5jZV9zdGFydFwiKTtcbiAgbGV0IHN0b3AgPSByYWN0aXZlLmdldChcInN1YnNlcXVlbmNlX3N0b3BcIik7XG4gIGxldCBzZXF1ZW5jZSA9IHJhY3RpdmUuZ2V0KFwic2VxdWVuY2VcIik7XG4gIGxldCBzdWJzZXF1ZW5jZSA9IHNlcXVlbmNlLnN1YnN0cmluZyhzdGFydC0xLCBzdG9wKTtcbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpK1wiX3NlZ1wiO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlX2xlbmd0aCcsIHN1YnNlcXVlbmNlLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc3Vic2VxdWVuY2UubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJywgc3Vic2VxdWVuY2UpO1xuICByYWN0aXZlLnNldCgnbmFtZScsIG5hbWUpO1xuICBsZXQgcHNpcHJlZF9qb2IgPSB0aGlzLmdldCgncHNpcHJlZF9qb2InKTtcbiAgbGV0IHBzaXByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwc2lwcmVkX2NoZWNrZWQnKTtcbiAgbGV0IGRpc29wcmVkX2pvYiA9IHRoaXMuZ2V0KCdkaXNvcHJlZF9qb2InKTtcbiAgbGV0IGRpc29wcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnZGlzb3ByZWRfY2hlY2tlZCcpO1xuICBsZXQgbWVtc2F0c3ZtX2pvYiA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fam9iJyk7XG4gIGxldCBtZW1zYXRzdm1fY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fY2hlY2tlZCcpO1xuICBsZXQgcGdlbnRocmVhZGVyX2pvYiA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfam9iJyk7XG4gIGxldCBwZ2VudGhyZWFkZXJfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfY2hlY2tlZCcpO1xuXG4gIC8vY2xlYXIgd2hhdCB3ZSBoYXZlIHByZXZpb3VzbHkgd3JpdHRlblxuICBjbGVhcl9zZXR0aW5ncygpO1xuICAvL3ZlcmlmeSBmb3JtIGNvbnRlbnRzIGFuZCBwb3N0XG4gIC8vY29uc29sZS5sb2cobmFtZSk7XG4gIC8vY29uc29sZS5sb2coZW1haWwpO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShzdWJzZXF1ZW5jZSwgbmFtZSwgZW1haWwsIHBzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkLCB0aGlzKTtcbiAgLy93cml0ZSBuZXcgYW5ub3RhdGlvbiBkaWFncmFtXG4gIC8vc3VibWl0IHN1YnNlY3Rpb25cbiAgZXZlbnQub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBIZXJlIGhhdmluZyBzZXQgdXAgcmFjdGl2ZSBhbmQgdGhlIGZ1bmN0aW9ucyB3ZSBuZWVkIHdlIHRoZW4gY2hlY2tcbi8vIGlmIHdlIHdlcmUgcHJvdmlkZWQgYSBVVUlELCBJZiB0aGUgcGFnZSBpcyBsb2FkZWQgd2l0aCBhIFVVSUQgcmF0aGVyIHRoYW4gYVxuLy8gZm9ybSBzdWJtaXQuXG4vL1RPRE86IEhhbmRsZSBsb2FkaW5nIHRoYXQgcGFnZSB3aXRoIHVzZSB0aGUgTUVNU0FUIGFuZCBESVNPUFJFRCBVVUlEXG4vL1xuaWYoZ2V0VXJsVmFycygpLnV1aWQgJiYgdXVpZF9tYXRjaClcbntcbiAgY29uc29sZS5sb2coJ0NhdWdodCBhbiBpbmNvbWluZyBVVUlEJyk7XG4gIHNlcV9vYnNlcnZlci5jYW5jZWwoKTtcbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTsgLy8gc2hvdWxkIG1ha2UgYSBnZW5lcmljIG9uZSB2aXNpYmxlIHVudGlsIHJlc3VsdHMgYXJyaXZlLlxuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMiApO1xuICByYWN0aXZlLnNldChcImJhdGNoX3V1aWRcIiwgZ2V0VXJsVmFycygpLnV1aWQpO1xuICBsZXQgcHJldmlvdXNfZGF0YSA9IGdldF9wcmV2aW91c19kYXRhKGdldFVybFZhcnMoKS51dWlkKTtcbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdwc2lwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2Rpc29wcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdtZW1zYXRzdm0nKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNik7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdwZ2VudGhyZWFkZXInKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMik7XG4gIH1cblxuICByYWN0aXZlLnNldCgnc2VxdWVuY2UnLHByZXZpb3VzX2RhdGEuc2VxKTtcbiAgcmFjdGl2ZS5zZXQoJ2VtYWlsJyxwcmV2aW91c19kYXRhLmVtYWlsKTtcbiAgcmFjdGl2ZS5zZXQoJ25hbWUnLHByZXZpb3VzX2RhdGEubmFtZSk7XG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlX2xlbmd0aCcsIHNlcS5sZW5ndGgpO1xuICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcS5sZW5ndGgpO1xuICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsICdwc2lwcmVkJyk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vXG4vL1xuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy9cbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vYmVmb3JlIGEgcmVzdWJtaXNzaW9uIGlzIHNlbnQgYWxsIHZhcmlhYmxlcyBhcmUgcmVzZXQgdG8gdGhlIHBhZ2UgZGVmYXVsdHNcbmZ1bmN0aW9uIGNsZWFyX3NldHRpbmdzKCl7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCAyKTtcbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCdkb3dubG9hZF9saW5rcycsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBQU0lQUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfd2FpdGluZ19pY29uJywgJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCIvPicpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF9ob3JpeicsbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIERJU09QUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTUVNU0FULVNWTSBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fd2FpdGluZ19pY29uJywgJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCIvPicpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fc2NoZW1hdGljJywgJycpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2NhcnRvb24nLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgncGdlbl90YWJsZScsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fc2V0Jywge30pO1xuXG4gIC8vcmFjdGl2ZS5zZXQoJ2Rpc29fcHJlY2lzaW9uJyk7XG5cbiAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJyxudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ2JhdGNoX3V1aWQnLG51bGwpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LnNlcXVlbmNlX3Bsb3QnKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5wc2lwcmVkX2NhcnRvb24nKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5jb21iX3Bsb3QnKTtcblxuICB6aXAgPSBuZXcgSlNaaXAoKTtcbn1cblxuLy93aGVuIGEgcmVzdWx0cyBwYWdlIGlzIGluc3RhbnRpYXRlZCBhbmQgYmVmb3JlIHNvbWUgYW5ub3RhdGlvbnMgaGF2ZSBjb21lIGJhY2tcbi8vd2UgZHJhdyBhbmQgZW1wdHkgYW5ub3RhdGlvbiBwYW5lbFxuZnVuY3Rpb24gZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCl7XG5cbiAgbGV0IHNlcSA9IHJhY3RpdmUuZ2V0KCdzZXF1ZW5jZScpO1xuICBsZXQgcmVzaWR1ZXMgPSBzZXEuc3BsaXQoJycpO1xuICBsZXQgYW5ub3RhdGlvbnMgPSBbXTtcbiAgcmVzaWR1ZXMuZm9yRWFjaChmdW5jdGlvbihyZXMpe1xuICAgIGFubm90YXRpb25zLnB1c2goeydyZXMnOiByZXN9KTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgYmlvZDMuYW5ub3RhdGlvbkdyaWQocmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyksIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbn1cblxuLy91dGlsaXR5IGZ1bmN0aW9uIHRoYXQgZ2V0cyB0aGUgc2VxdWVuY2UgZnJvbSBhIHByZXZpb3VzIHN1Ym1pc3Npb24gaXMgdGhlXG4vL3BhZ2Ugd2FzIGxvYWRlZCB3aXRoIGEgVVVJRFxuZnVuY3Rpb24gZ2V0X3ByZXZpb3VzX2RhdGEodXVpZClcbntcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdGluZyBkZXRhaWxzIGdpdmVuIFVSSScpO1xuICAgIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgLy9hbGVydCh1cmwpO1xuICAgIGxldCBzdWJtaXNzaW9uX3Jlc3BvbnNlID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGlmKCEgc3VibWlzc2lvbl9yZXNwb25zZSl7YWxlcnQoXCJOTyBTVUJNSVNTSU9OIERBVEFcIik7fVxuICAgIGxldCBzZXEgPSBnZXRfdGV4dChmaWxlX3VybCtzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmlucHV0X2ZpbGUsIFwiR0VUXCIsIHt9KTtcbiAgICBsZXQgam9icyA9ICcnO1xuICAgIHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihzdWJtaXNzaW9uKXtcbiAgICAgIGpvYnMgKz0gc3VibWlzc2lvbi5qb2JfbmFtZStcIixcIjtcbiAgICB9KTtcbiAgICBqb2JzID0gam9icy5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuKHsnc2VxJzogc2VxLCAnZW1haWwnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmVtYWlsLCAnbmFtZSc6IHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnNbMF0uc3VibWlzc2lvbl9uYW1lLCAnam9icyc6IGpvYnN9KTtcbn1cblxuLy9wb2xscyB0aGUgYmFja2VuZCB0byBnZXQgcmVzdWx0cyBhbmQgdGhlbiBwYXJzZXMgdGhvc2UgcmVzdWx0cyB0byBkaXNwbGF5XG4vL3RoZW0gb24gdGhlIHBhZ2VcbmZ1bmN0aW9uIHByb2Nlc3NfZmlsZSh1cmxfc3R1YiwgcGF0aCwgY3RsKVxue1xuICBsZXQgdXJsID0gdXJsX3N0dWIgKyBwYXRoO1xuICBsZXQgcGF0aF9iaXRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIC8vZ2V0IGEgcmVzdWx0cyBmaWxlIGFuZCBwdXNoIHRoZSBkYXRhIGluIHRvIHRoZSBiaW8zZCBvYmplY3RcbiAgLy9hbGVydCh1cmwpO1xuICBjb25zb2xlLmxvZygnR2V0dGluZyBSZXN1bHRzIEZpbGUgYW5kIHByb2Nlc3NpbmcnKTtcbiAgbGV0IHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnR0VUJyxcbiAgICBhc3luYzogICB0cnVlLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZmlsZSlcbiAgICB7XG4gICAgICB6aXAuZm9sZGVyKHBhdGhfYml0c1sxXSkuZmlsZShwYXRoX2JpdHNbMl0sIGZpbGUpO1xuICAgICAgaWYoY3RsID09PSAnaG9yaXonKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9ob3JpeicsIGZpbGUpO1xuICAgICAgICBiaW9kMy5wc2lwcmVkKGZpbGUsICdwc2lwcmVkQ2hhcnQnLCB7cGFyZW50OiAnZGl2LnBzaXByZWRfY2FydG9vbicsIG1hcmdpbl9zY2FsZXI6IDJ9KTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3NzMicpXG4gICAgICB7XG4gICAgICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgICAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgbGluZXMuc2hpZnQoKTtcbiAgICAgICAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGlmKGFubm90YXRpb25zLmxlbmd0aCA9PSBsaW5lcy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgICAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICBhbm5vdGF0aW9uc1tpXS5zcyA9IGVudHJpZXNbM107XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICAgICAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgYWxlcnQoXCJTUzIgYW5ub3RhdGlvbiBsZW5ndGggZG9lcyBub3QgbWF0Y2ggcXVlcnkgc2VxdWVuY2VcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3BiZGF0JylcbiAgICAgIHtcbiAgICAgICAgLy9hbGVydCgnUEJEQVQgcHJvY2VzcycpO1xuICAgICAgICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgICAgICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7XG4gICAgICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgaWYoZW50cmllc1szXSA9PT0gJy0nKXthbm5vdGF0aW9uc1tpXS5kaXNvcHJlZCA9ICdEJzt9XG4gICAgICAgICAgICBpZihlbnRyaWVzWzNdID09PSAnXicpe2Fubm90YXRpb25zW2ldLmRpc29wcmVkID0gJ1BCJzt9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICAgICAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ2NvbWInKVxuICAgICAge1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gW107XG4gICAgICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICBwcmVjaXNpb25baV0gPSB7fTtcbiAgICAgICAgICBwcmVjaXNpb25baV0ucG9zID0gZW50cmllc1sxXTtcbiAgICAgICAgICBwcmVjaXNpb25baV0ucHJlY2lzaW9uID0gZW50cmllc1s0XTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicsIHByZWNpc2lvbik7XG4gICAgICAgIGJpb2QzLmdlbmVyaWN4eUxpbmVDaGFydChwcmVjaXNpb24sICdwb3MnLCBbJ3ByZWNpc2lvbiddLCBbJ0JsYWNrJyxdLCAnRGlzb05OQ2hhcnQnLCB7cGFyZW50OiAnZGl2LmNvbWJfcGxvdCcsIGNoYXJ0VHlwZTogJ2xpbmUnLCB5X2N1dG9mZjogMC41LCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdtZW1zYXRkYXRhJylcbiAgICAgIHtcbiAgICAgICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgICAgIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgICAgICAgdG9wb19yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1RvcG9sb2d5OlxccysoLis/KVxcbi8sIGZpbGUpO1xuICAgICAgICBzaWduYWxfcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9TaWduYWxcXHNwZXB0aWRlOlxccysoLispXFxuLywgZmlsZSk7XG4gICAgICAgIHJlZW50cmFudF9yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1JlLWVudHJhbnRcXHNoZWxpY2VzOlxccysoLis/KVxcbi8sIGZpbGUpO1xuICAgICAgICB0ZXJtaW5hbCA9IGdldF9tZW1zYXRfcmFuZ2VzKC9OLXRlcm1pbmFsOlxccysoLis/KVxcbi8sIGZpbGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNpZ25hbF9yZWdpb25zKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVlbnRyYW50X3JlZ2lvbnMpO1xuICAgICAgICBjb2lsX3R5cGUgPSAnQ1knO1xuICAgICAgICBpZih0ZXJtaW5hbCA9PT0gJ291dCcpXG4gICAgICAgIHtcbiAgICAgICAgICBjb2lsX3R5cGUgPSAnRUMnO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0bXBfYW5ubyA9IG5ldyBBcnJheShzZXEubGVuZ3RoKTtcbiAgICAgICAgaWYodG9wb19yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpXG4gICAgICAgIHtcbiAgICAgICAgICBsZXQgcHJldl9lbmQgPSAwO1xuICAgICAgICAgIHRvcG9fcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICAgICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1RNJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgICAgICAgICBpZihwcmV2X2VuZCA+IDApe3ByZXZfZW5kIC09IDE7fVxuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKGNvaWxfdHlwZSwgcHJldl9lbmQsIHJlZ2lvblswXSk7XG4gICAgICAgICAgICBpZihjb2lsX3R5cGUgPT09ICdFQycpeyBjb2lsX3R5cGUgPSAnQ1knO31lbHNle2NvaWxfdHlwZSA9ICdFQyc7fVxuICAgICAgICAgICAgcHJldl9lbmQgPSByZWdpb25bMV0rMjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoY29pbF90eXBlLCBwcmV2X2VuZC0xLCBzZXEubGVuZ3RoKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vc2lnbmFsX3JlZ2lvbnMgPSBbWzcwLDgzXSwgWzEwMiwxMTddXTtcbiAgICAgICAgaWYoc2lnbmFsX3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJyl7XG4gICAgICAgICAgc2lnbmFsX3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdTJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWVudHJhbnRfcmVnaW9ucyA9IFtbNDAsNTBdLCBbMjAwLDIxOF1dO1xuICAgICAgICBpZihyZWVudHJhbnRfcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKXtcbiAgICAgICAgICByZWVudHJhbnRfcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICAgICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1JIJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdG1wX2Fubm8uZm9yRWFjaChmdW5jdGlvbihhbm5vLCBpKXtcbiAgICAgICAgICBhbm5vdGF0aW9uc1tpXS5tZW1zYXQgPSBhbm5vO1xuICAgICAgICB9KTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICAgICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAncHJlc3VsdCcpXG4gICAgICB7XG5cbiAgICAgICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGxldCBhbm5fbGlzdCA9IHJhY3RpdmUuZ2V0KCdwZ2VuX2Fubl9zZXQnKTtcbiAgICAgICAgaWYoT2JqZWN0LmtleXMoYW5uX2xpc3QpLmxlbmd0aCA+IDApe1xuICAgICAgICBsZXQgcHNldWRvX3RhYmxlID0gJzx0YWJsZSBjbGFzcz1cInNtYWxsLXRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWRcIj5cXG4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0cj48dGg+Q29uZi48L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPk5ldCBTY29yZTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+cC12YWx1ZTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+UGFpckU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlNvbHZFPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gU2NvcmU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPkFsbiBMZW5ndGg8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlN0ciBMZW48L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlNlcSBMZW48L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPkZvbGQ8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlNFQVJDSCBTQ09QPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggQ0FUSDwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+UERCU1VNPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbGlnbm1lbnQ8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPk1PREVMPC90aD4nO1xuXG4gICAgICAgIC8vIGlmIE1PREVMTEVSIFRISU5HWVxuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzwvdHI+PHRib2R5XCI+XFxuJztcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgICBpZihsaW5lLmxlbmd0aCA9PT0gMCl7cmV0dXJuO31cbiAgICAgICAgICBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgIGlmKGVudHJpZXNbOV0rXCJfXCIraSBpbiBhbm5fbGlzdClcbiAgICAgICAgICB7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRyPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZCBjbGFzcz0nXCIrZW50cmllc1swXS50b0xvd2VyQ2FzZSgpK1wiJz5cIitlbnRyaWVzWzBdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1sxXStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbMl0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzNdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s0XStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNV0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzZdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s3XStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbOF0rXCI8L3RkPlwiO1xuICAgICAgICAgIGxldCBwZGIgPSBlbnRyaWVzWzldLnN1YnN0cmluZygwLCBlbnRyaWVzWzldLmxlbmd0aC0yKTtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHBzOi8vd3d3LnJjc2Iub3JnL3BkYi9leHBsb3JlL2V4cGxvcmUuZG8/c3RydWN0dXJlSWQ9XCIrcGRiK1wiJz5cIitlbnRyaWVzWzldK1wiPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vc2NvcC5tcmMtbG1iLmNhbS5hYy51ay9zY29wL3BkYi5jZ2k/cGRiPVwiK3BkYitcIic+U0NPUCBTRUFSQ0g8L2E+PC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly93d3cuY2F0aGRiLmluZm8vcGRiL1wiK3BkYitcIic+Q0FUSCBTRUFSQ0g8L2E+PC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly93d3cuZWJpLmFjLnVrL3Rob3JudG9uLXNydi9kYXRhYmFzZXMvY2dpLWJpbi9wZGJzdW0vR2V0UGFnZS5wbD9wZGJjb2RlPVwiK3BkYitcIic+T3BlbiBQREJTVU08L2E+PC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGlucHV0IGNsYXNzPSdidXR0b24nIHR5cGU9J2J1dHRvbicgb25DbGljaz0nbG9hZE5ld0FsaWdubWVudChcXFwiXCIrKGFubl9saXN0W2VudHJpZXNbOV0rXCJfXCIraV0uYWxuKStcIlxcXCIsXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFubikrXCJcXFwiLFxcXCJcIisoZW50cmllc1s5XStcIl9cIitpKStcIlxcXCIpOycgdmFsdWU9J0Rpc3BsYXkgQWxpZ25tZW50JyAvPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J2J1aWxkTW9kZWwoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiKTsnIHZhbHVlPSdCdWlsZCBNb2RlbCcgLz48L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPC90Ym9keT48L3RhYmxlPlxcblwiO1xuICAgICAgICByYWN0aXZlLnNldChcInBnZW5fdGFibGVcIiwgcHNldWRvX3RhYmxlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl90YWJsZVwiLCBcIjxoMz5ObyBnb29kIGhpdHMgZm91bmQuIEdVRVNTIGFuZCBMT1cgY29uZmlkZW5jZSBoaXRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgcmVzdWx0cyBmaWxlPC9oMz5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KEpTT04uc3RyaW5naWZ5KGVycm9yKSk7fVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0X21lbXNhdF9yYW5nZXMocmVnZXgsIGRhdGEpXG57XG4gICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhkYXRhKTtcbiAgICBpZihtYXRjaFsxXS5pbmNsdWRlcygnLCcpKVxuICAgIHtcbiAgICAgIGxldCByZWdpb25zID0gbWF0Y2hbMV0uc3BsaXQoJywnKTtcbiAgICAgIHJlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24sIGkpe1xuICAgICAgICByZWdpb25zW2ldID0gcmVnaW9uLnNwbGl0KCctJyk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMF0gPSBwYXJzZUludChyZWdpb25zW2ldWzBdKTtcbiAgICAgICAgcmVnaW9uc1tpXVsxXSA9IHBhcnNlSW50KHJlZ2lvbnNbaV1bMV0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ocmVnaW9ucyk7XG4gICAgfVxuICAgIHJldHVybihtYXRjaFsxXSk7XG59XG5cbi8vZ2V0IHRleHQgY29udGVudHMgZnJvbSBhIHJlc3VsdCBVUklcbmZ1bmN0aW9uIGdldF90ZXh0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuXG4gbGV0IHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IHNlbmRfZGF0YSxcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBhc3luYzogICBmYWxzZSxcbiAgICAvL2RhdGFUeXBlOiBcInR4dFwiLFxuICAgIC8vY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSlcbiAgICB7XG4gICAgICBpZihkYXRhID09PSBudWxsKXthbGVydChcIkZhaWxlZCB0byByZXF1ZXN0IGlucHV0IGRhdGEgdGV4dFwiKTt9XG4gICAgICByZXNwb25zZT1kYXRhO1xuICAgICAgLy9hbGVydChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoXCJHZXR0aW5ncyByZXN1bHRzIGZhaWxlZC4gVGhlIEJhY2tlbmQgcHJvY2Vzc2luZyBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUuIFNvbWV0aGluZyBDYXRhc3Ryb3BoaWMgaGFzIGdvbmUgd3JvbmcuIFBsZWFzZSBjb250YWN0IHBzaXByZWRAY3MudWNsLmFjLnVrXCIpO31cbiAgfSk7XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5mdW5jdGlvbiBzZW5kX3JlcXVlc3QodXJsLCB0eXBlLCBzZW5kX2RhdGEpXG57XG4gIGNvbnNvbGUubG9nKCdTZW5kaW5nIFVSSSByZXF1ZXN0Jyk7XG4gIGNvbnNvbGUubG9nKHVybCk7XG4gIGNvbnNvbGUubG9nKHR5cGUpO1xuXG4gIHZhciByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIC8vY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSlcbiAgICB7XG4gICAgICBpZihkYXRhID09PSBudWxsKXthbGVydChcIkZhaWxlZCB0byBzZW5kIGRhdGFcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiU2VuZGluZyBKb2IgdG8gXCIrdXJsK1wiIEZhaWxlZC4gXCIrZXJyb3IucmVzcG9uc2VUZXh0K1wiLiBUaGUgQmFja2VuZCBwcm9jZXNzaW5nIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZS4gU29tZXRoaW5nIENhdGFzdHJvcGhpYyBoYXMgZ29uZSB3cm9uZy4gUGxlYXNlIGNvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWtcIik7IHJldHVybiBudWxsO31cbiAgfSkucmVzcG9uc2VKU09OO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG4vL2d1dmVuIGFuZCBhcnJheSByZXR1cm4gd2hldGhlciBhbmQgZWxlbWVudCBpcyBwcmVzZW50XG5mdW5jdGlvbiBpc0luQXJyYXkodmFsdWUsIGFycmF5KSB7XG4gIGlmKGFycmF5LmluZGV4T2YodmFsdWUpID4gLTEpXG4gIHtcbiAgICByZXR1cm4odHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuKGZhbHNlKTtcbiAgfVxufVxuXG4vL2dpdmVuIGEgVVJMIHJldHVybiB0aGUgYXR0YWNoZWQgdmFyaWFibGVzXG5mdW5jdGlvbiBnZXRVcmxWYXJzKCkge1xuICAgIGxldCB2YXJzID0ge307XG4gICAgLy9jb25zaWRlciB1c2luZyBsb2NhdGlvbi5zZWFyY2ggaW5zdGVhZCBoZXJlXG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvWz8mXSsoW149Jl0rKT0oW14mXSopL2dpLFxuICAgIGZ1bmN0aW9uKG0sa2V5LHZhbHVlKSB7XG4gICAgICB2YXJzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFycztcbiAgfVxuXG4vKiEgZ2V0RW1QaXhlbHMgIHwgQXV0aG9yOiBUeXNvbiBNYXRhbmljaCAoaHR0cDovL21hdGFuaWNoLmNvbSksIDIwMTMgfCBMaWNlbnNlOiBNSVQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIGRvY3VtZW50RWxlbWVudCkge1xuICAgIC8vIEVuYWJsZSBzdHJpY3QgbW9kZVxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gRm9ybSB0aGUgc3R5bGUgb24gdGhlIGZseSB0byByZXN1bHQgaW4gc21hbGxlciBtaW5pZmllZCBmaWxlXG4gICAgbGV0IGltcG9ydGFudCA9IFwiIWltcG9ydGFudDtcIjtcbiAgICBsZXQgc3R5bGUgPSBcInBvc2l0aW9uOmFic29sdXRlXCIgKyBpbXBvcnRhbnQgKyBcInZpc2liaWxpdHk6aGlkZGVuXCIgKyBpbXBvcnRhbnQgKyBcIndpZHRoOjFlbVwiICsgaW1wb3J0YW50ICsgXCJmb250LXNpemU6MWVtXCIgKyBpbXBvcnRhbnQgKyBcInBhZGRpbmc6MFwiICsgaW1wb3J0YW50O1xuXG4gICAgd2luZG93LmdldEVtUGl4ZWxzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICBsZXQgZXh0cmFCb2R5O1xuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRW11bGF0ZSB0aGUgZG9jdW1lbnRFbGVtZW50IHRvIGdldCByZW0gdmFsdWUgKGRvY3VtZW50RWxlbWVudCBkb2VzIG5vdCB3b3JrIGluIElFNi03KVxuICAgICAgICAgICAgZWxlbWVudCA9IGV4dHJhQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xuICAgICAgICAgICAgZXh0cmFCb2R5LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudDtcbiAgICAgICAgICAgIGRvY3VtZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFCb2R5LCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgc3R5bGUgYSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgbGV0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgIHRlc3RFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjbGllbnQgd2lkdGggb2YgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdmFsdWUgPSB0ZXN0RWxlbWVudC5jbGllbnRXaWR0aDtcblxuICAgICAgICBpZiAoZXh0cmFCb2R5KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGV4dHJhIGJvZHkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGV4dHJhQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIGVtIHZhbHVlIGluIHBpeGVsc1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn0oZG9jdW1lbnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpO1xuXG5cbi8vUmVsb2FkIGFsaWdubWVudHMgZm9yIEphbFZpZXcgZm9yIHRoZSBnZW5USFJFQURFUiB0YWJsZVxuZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5mdW5jdGlvbiBidWlsZE1vZGVsKGFsblVSSSkge1xuXG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIGxldCBtb2Rfa2V5ID0gcmFjdGl2ZS5nZXQoJ21vZGVsbGVyX2tleScpO1xuICBpZihtb2Rfa2V5ID09PSAnTScrJ08nKydEJysnRScrJ0wnKydJJysnUicrJ0EnKydOJysnSicrJ0UnKVxuICB7XG4gICAgd2luZG93Lm9wZW4oXCIuLlwiK2FwcF9wYXRoK1wiL21vZGVsL3Bvc3Q/YWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD02NzAsaGVpZ2h0PTcwMFwiKTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBhbGVydCgnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBNJysnTycrJ0QnKydFJysnTCcrJ0wnKydFJysnUiBMaWNlbmNlIEtleScpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvbWFpbi5qcyIsImltcG9ydCB7IHNlbmRfam9iIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcblxuLy9UYWtlcyB0aGUgZGF0YSBuZWVkZWQgdG8gdmVyaWZ5IHRoZSBpbnB1dCBmb3JtIGRhdGEsIGVpdGhlciB0aGUgbWFpbiBmb3JtXG4vL29yIHRoZSBzdWJtaXNzb24gd2lkZ2V0IHZlcmlmaWVzIHRoYXQgZGF0YSBhbmQgdGhlbiBwb3N0cyBpdCB0byB0aGUgYmFja2VuZC5cbmZ1bmN0aW9uIHZlcmlmeV9hbmRfc2VuZF9mb3JtKHNlcSwgbmFtZSwgZW1haWwsIHBzaXByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkLCBwZ2VudGhyZWFkZXJfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhY3RpdmVfaW5zdGFuY2UpXG57XG4gIC8qdmVyaWZ5IHRoYXQgZXZlcnl0aGluZyBoZXJlIGlzIG9rKi9cbiAgbGV0IGVycm9yX21lc3NhZ2U9bnVsbDtcbiAgbGV0IGpvYl9zdHJpbmcgPSAnJztcbiAgLy9lcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCwgW3BzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCwgbWVtc2F0c3ZtX2NoZWNrZWRdKTtcblxuICBlcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkXSk7XG4gIGlmKGVycm9yX21lc3NhZ2UubGVuZ3RoID4gMClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdmb3JtX2Vycm9yJywgZXJyb3JfbWVzc2FnZSk7XG4gICAgYWxlcnQoXCJGT1JNIEVSUk9SOlwiK2Vycm9yX21lc3NhZ2UpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vaW5pdGlhbGlzZSB0aGUgcGFnZVxuICAgIGxldCByZXNwb25zZSA9IHRydWU7XG4gICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7XG4gICAgLy9Qb3N0IHRoZSBqb2JzIGFuZCBpbnRpYWxpc2UgdGhlIGFubm90YXRpb25zIGZvciBlYWNoIGpvYlxuICAgIC8vV2UgYWxzbyBkb24ndCByZWR1bmRhbnRseSBzZW5kIGV4dHJhIHBzaXByZWQgZXRjLi4gam9ic1xuICAgIC8vYnl0IGRvaW5nIHRoZXNlIHRlc3QgaW4gYSBzcGVjaWZpYyBvcmRlclxuICAgIGlmKHBnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBnZW50aHJlYWRlcixcIik7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoZGlzb3ByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkaXNvcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgnZGlzb3ByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICAgIHBzaXByZWRfY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZihwc2lwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwicHNpcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYobWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtc2F0c3ZtLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuXG5cbiAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5zbGljZSgwLCAtMSk7XG4gICAgcmVzcG9uc2UgPSBzZW5kX2pvYihqb2Jfc3RyaW5nLCBzZXEsIG5hbWUsIGVtYWlsLCByYWN0aXZlX2luc3RhbmNlKTtcbiAgICAvL3NldCB2aXNpYmlsaXR5IGFuZCByZW5kZXIgcGFuZWwgb25jZVxuICAgIGlmIChwc2lwcmVkX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwc2lwcmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCgpO1xuICAgICAgLy8gcGFyc2Ugc2VxdWVuY2UgYW5kIG1ha2Ugc2VxIHBsb3RcbiAgICB9XG4gICAgZWxzZSBpZihkaXNvcHJlZF9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAnZGlzb3ByZWRfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuICAgIGVsc2UgaWYobWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdtZW1zYXRzdm1fYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuICAgIGVsc2UgaWYocGdlbnRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwZ2VudGhyZWFkZXJfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5mdW5jdGlvbiB2ZXJpZnlfZm9ybShzZXEsIGpvYl9uYW1lLCBlbWFpbCwgY2hlY2tlZF9hcnJheSlcbntcbiAgbGV0IGVycm9yX21lc3NhZ2UgPSBcIlwiO1xuICBpZighIC9eW1xceDAwLVxceDdGXSskLy50ZXN0KGpvYl9uYW1lKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJQbGVhc2UgcmVzdHJpY3QgSm9iIE5hbWVzIHRvIHZhbGlkIGxldHRlcnMgbnVtYmVycyBhbmQgYmFzaWMgcHVuY3R1YXRpb248YnIgLz5cIjtcbiAgfVxuXG4gIC8qIGxlbmd0aCBjaGVja3MgKi9cbiAgaWYoc2VxLmxlbmd0aCA+IDE1MDApXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBpcyB0b28gbG9uZyB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cbiAgaWYoc2VxLmxlbmd0aCA8IDMwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIHNob3J0IHRvIHByb2Nlc3M8YnIgLz5cIjtcbiAgfVxuXG4gIC8qIG51Y2xlb3RpZGUgY2hlY2tzICovXG4gIGxldCBudWNsZW90aWRlX2NvdW50ID0gKHNlcS5tYXRjaCgvQXxUfEN8R3xVfE58YXx0fGN8Z3x1fG4vZyl8fFtdKS5sZW5ndGg7XG4gIGlmKChudWNsZW90aWRlX2NvdW50L3NlcS5sZW5ndGgpID4gMC45NSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGFwcGVhcnMgdG8gYmUgbnVjbGVvdGlkZSBzZXF1ZW5jZS4gVGhpcyBzZXJ2aWNlIHJlcXVpcmVzIHByb3RlaW4gc2VxdWVuY2UgYXMgaW5wdXQ8YnIgLz5cIjtcbiAgfVxuICBpZigvW15BQ0RFRkdISUtMTU5QUVJTVFZXWVhfLV0rL2kudGVzdChzZXEpKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzPGJyIC8+XCI7XG4gIH1cblxuICBpZihpc0luQXJyYXkodHJ1ZSwgY2hlY2tlZF9hcnJheSkgPT09IGZhbHNlKSB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdSBtdXN0IHNlbGVjdCBhdCBsZWFzdCBvbmUgYW5hbHlzaXMgcHJvZ3JhbVwiO1xuICB9XG4gIHJldHVybihlcnJvcl9tZXNzYWdlKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9mb3Jtcy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=
