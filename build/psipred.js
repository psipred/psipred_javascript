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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = send_job;
/* harmony export (immutable) */ __webpack_exports__["c"] = isInArray;
/* harmony export (immutable) */ __webpack_exports__["a"] = send_request;
//given a job name prep all the form elements and send an http request to the
//backend
function send_job(ractive, job_name, seq, name, email, ractive_instance, submit_url, times_url) {
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
    let times = send_request(times_url, 'GET', {});
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

//given and array return whether and element is present
function isInArray(value, array) {
  if (array.indexOf(value) > -1) {
    return true;
  } else {
    return false;
  }
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

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__forms_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_index_js__ = __webpack_require__(0);
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
let main_url = "http://bioinf.cs.ucl.ac.uk";
let app_path = "/psipred_beta";
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
    let batch = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_index_js__["a" /* send_request */])(url, "GET", {});
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_index_js__["a" /* verify_and_send_form */])(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, this);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_index_js__["a" /* verify_and_send_form */])(ractive, subsequence, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, this);
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
  let submission_response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_index_js__["a" /* send_request */])(url, "GET", {});
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
/* harmony export (immutable) */ __webpack_exports__["a"] = verify_and_send_form;
/* unused harmony export verify_form */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_index_js__ = __webpack_require__(0);



//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, ractive_instance) {
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
    response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_index_js__["b" /* send_job */])(ractive, job_string, seq, name, email, ractive_instance, submit_url, times_url);
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

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_index_js__["c" /* isInArray */])(true, checked_array) === false) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWE1NjJkNmMwMDM3YjlmODU1YjEiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbW1vbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZm9ybXMvaW5kZXguanMiXSwibmFtZXMiOlsic2VuZF9qb2IiLCJyYWN0aXZlIiwiam9iX25hbWUiLCJzZXEiLCJuYW1lIiwiZW1haWwiLCJyYWN0aXZlX2luc3RhbmNlIiwic3VibWl0X3VybCIsInRpbWVzX3VybCIsImNvbnNvbGUiLCJsb2ciLCJmaWxlIiwidXBwZXJfbmFtZSIsInRvVXBwZXJDYXNlIiwiQmxvYiIsImUiLCJhbGVydCIsImZkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZV9kYXRhIiwic2VuZF9yZXF1ZXN0IiwidGltZXMiLCJzZXQiLCJrIiwiZmlyZSIsImlzSW5BcnJheSIsInZhbHVlIiwiYXJyYXkiLCJpbmRleE9mIiwidXJsIiwidHlwZSIsInNlbmRfZGF0YSIsInJlc3BvbnNlIiwiJCIsImFqYXgiLCJkYXRhIiwiY2FjaGUiLCJjb250ZW50VHlwZSIsInByb2Nlc3NEYXRhIiwiYXN5bmMiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJlcnJvciIsInJlc3BvbnNlVGV4dCIsInJlc3BvbnNlSlNPTiIsImNsaXBib2FyZCIsIkNsaXBib2FyZCIsInppcCIsIkpTWmlwIiwib24iLCJlbmRwb2ludHNfdXJsIiwiZ2VhcnNfc3ZnIiwibWFpbl91cmwiLCJhcHBfcGF0aCIsImZpbGVfdXJsIiwibG9jYXRpb24iLCJob3N0bmFtZSIsImhyZWYiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsInJlc3VsdHNfdmlzaWJsZSIsInJlc3VsdHNfcGFuZWxfdmlzaWJsZSIsInN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUiLCJtb2RlbGxlcl9rZXkiLCJwc2lwcmVkX2NoZWNrZWQiLCJwc2lwcmVkX2J1dHRvbiIsImRpc29wcmVkX2NoZWNrZWQiLCJkaXNvcHJlZF9idXR0b24iLCJtZW1zYXRzdm1fY2hlY2tlZCIsIm1lbXNhdHN2bV9idXR0b24iLCJwZ2VudGhyZWFkZXJfY2hlY2tlZCIsInBnZW50aHJlYWRlcl9idXR0b24iLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfam9iIiwiZGlzb3ByZWRfam9iIiwibWVtc2F0c3ZtX2pvYiIsInBnZW50aHJlYWRlcl9qb2IiLCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZSIsInBzaXByZWRfd2FpdGluZ19pY29uIiwicHNpcHJlZF90aW1lIiwicHNpcHJlZF9ob3JpeiIsImRpc29wcmVkX3dhaXRpbmdfbWVzc2FnZSIsImRpc29wcmVkX3dhaXRpbmdfaWNvbiIsImRpc29wcmVkX3RpbWUiLCJkaXNvX3ByZWNpc2lvbiIsIm1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2UiLCJtZW1zYXRzdm1fd2FpdGluZ19pY29uIiwibWVtc2F0c3ZtX3RpbWUiLCJtZW1zYXRzdm1fc2NoZW1hdGljIiwibWVtc2F0c3ZtX2NhcnRvb24iLCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlIiwicGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbiIsInBnZW50aHJlYWRlcl90aW1lIiwicGdlbl90YWJsZSIsInBnZW5fYW5uX3NldCIsInNlcXVlbmNlIiwic2VxdWVuY2VfbGVuZ3RoIiwic3Vic2VxdWVuY2Vfc3RhcnQiLCJzdWJzZXF1ZW5jZV9zdG9wIiwiYmF0Y2hfdXVpZCIsImFubm90YXRpb25zIiwidXVpZF9yZWdleCIsInV1aWRfbWF0Y2giLCJleGVjIiwiZ2V0VXJsVmFycyIsInV1aWQiLCJzZXFfb2JzZXJ2ZXIiLCJvYnNlcnZlIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsInJlZ2V4IiwibWF0Y2giLCJpbml0IiwiZGVmZXIiLCJzZXFfbGVuZ3RoIiwiZ2V0Iiwic2VxX3N0YXJ0Iiwic2VxX3N0b3AiLCJqb2JfdHlwZSIsImhvcml6X3JlZ2V4Iiwic3MyX3JlZ2V4IiwibWVtc2F0X2NhcnRvb25fcmVnZXgiLCJtZW1zYXRfc2NoZW1hdGljX3JlZ2V4IiwibWVtc2F0X2RhdGFfcmVnZXgiLCJpbWFnZV9yZWdleCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiYmF0Y2giLCJkb3dubG9hZHNfaW5mbyIsInN0YXRlIiwic3VibWlzc2lvbnMiLCJmb3JFYWNoIiwiaW5jbHVkZXMiLCJwc2lwcmVkIiwiaGVhZGVyIiwiZGlzb3ByZWQiLCJtZW1zYXRzdm0iLCJwZ2VudGhyZWFkZXIiLCJyZXN1bHRzIiwiaSIsInJlc3VsdF9kaWN0IiwiYW5uX3NldCIsInRtcCIsImRhdGFfcGF0aCIsInBhdGgiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImlkIiwibGVuZ3RoIiwiYW5uIiwiYWxuIiwicHJvY2Vzc19maWxlIiwiaG9yaXoiLCJzczJfbWF0Y2giLCJzczIiLCJwYmRhdCIsImNvbWIiLCJzY2hlbWVfbWF0Y2giLCJzY2hlbWF0aWMiLCJjYXJ0b29uX21hdGNoIiwiY2FydG9vbiIsIm1lbXNhdF9tYXRjaCIsInRhYmxlIiwiYWxpZ24iLCJkb3dubG9hZHNfc3RyaW5nIiwiY29uY2F0IiwiY2xlYXJJbnRlcnZhbCIsInN1Ym1pc3Npb25fbWVzc2FnZSIsImxhc3RfbWVzc2FnZSIsImNvbnRleHQiLCJnZW5lcmF0ZUFzeW5jIiwidGhlbiIsImJsb2IiLCJzYXZlQXMiLCJldmVudCIsImJpb2QzIiwicGFyZW50IiwibWFyZ2luX3NjYWxlciIsImdlbmVyaWN4eUxpbmVDaGFydCIsImNoYXJ0VHlwZSIsInlfY3V0b2ZmIiwiZGVidWciLCJjb250YWluZXJfd2lkdGgiLCJ3aWR0aCIsImhlaWdodCIsImNvbnRhaW5lcl9oZWlnaHQiLCJyZXBsYWNlIiwidmVyaWZ5X2FuZF9zZW5kX2Zvcm0iLCJvcmlnaW5hbCIsInByZXZlbnREZWZhdWx0Iiwic3RhcnQiLCJzdG9wIiwic3Vic2VxdWVuY2UiLCJzdWJzdHJpbmciLCJjbGVhcl9zZXR0aW5ncyIsImNhbmNlbCIsInByZXZpb3VzX2RhdGEiLCJnZXRfcHJldmlvdXNfZGF0YSIsImpvYnMiLCJjbGVhclNlbGVjdGlvbiIsInJlc2lkdWVzIiwic3BsaXQiLCJyZXMiLCJwdXNoIiwiYW5ub3RhdGlvbkdyaWQiLCJzdWJtaXNzaW9uX3Jlc3BvbnNlIiwiZ2V0X3RleHQiLCJpbnB1dF9maWxlIiwic3VibWlzc2lvbiIsInNsaWNlIiwic3VibWlzc2lvbl9uYW1lIiwidXJsX3N0dWIiLCJjdGwiLCJwYXRoX2JpdHMiLCJmb2xkZXIiLCJsaW5lcyIsInNoaWZ0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImxpbmUiLCJlbnRyaWVzIiwic3MiLCJwcmVjaXNpb24iLCJwb3MiLCJ0b3BvX3JlZ2lvbnMiLCJnZXRfbWVtc2F0X3JhbmdlcyIsInNpZ25hbF9yZWdpb25zIiwicmVlbnRyYW50X3JlZ2lvbnMiLCJ0ZXJtaW5hbCIsImNvaWxfdHlwZSIsInRtcF9hbm5vIiwiQXJyYXkiLCJwcmV2X2VuZCIsInJlZ2lvbiIsImZpbGwiLCJhbm5vIiwibWVtc2F0IiwiYW5uX2xpc3QiLCJPYmplY3QiLCJrZXlzIiwicHNldWRvX3RhYmxlIiwidG9Mb3dlckNhc2UiLCJwZGIiLCJKU09OIiwic3RyaW5naWZ5IiwicmVnaW9ucyIsInBhcnNlSW50IiwidmFycyIsInBhcnRzIiwid2luZG93IiwibSIsImtleSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiaW1wb3J0YW50Iiwic3R5bGUiLCJnZXRFbVBpeGVscyIsImVsZW1lbnQiLCJleHRyYUJvZHkiLCJjcmVhdGVFbGVtZW50IiwiY3NzVGV4dCIsImluc2VydEJlZm9yZSIsImJvZHkiLCJ0ZXN0RWxlbWVudCIsImFwcGVuZENoaWxkIiwiY2xpZW50V2lkdGgiLCJyZW1vdmVDaGlsZCIsImxvYWROZXdBbGlnbm1lbnQiLCJhbG5VUkkiLCJhbm5VUkkiLCJ0aXRsZSIsIm9wZW4iLCJidWlsZE1vZGVsIiwibW9kX2tleSIsImVycm9yX21lc3NhZ2UiLCJqb2Jfc3RyaW5nIiwidmVyaWZ5X2Zvcm0iLCJjaGVja2VkX2FycmF5IiwidGVzdCIsIm51Y2xlb3RpZGVfY291bnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUNoRUE7QUFBQTtBQUNBO0FBQ08sU0FBU0EsUUFBVCxDQUFrQkMsT0FBbEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsSUFBMUMsRUFBZ0RDLEtBQWhELEVBQXVEQyxnQkFBdkQsRUFBeUVDLFVBQXpFLEVBQXFGQyxTQUFyRixFQUNQO0FBQ0U7QUFDQUMsVUFBUUMsR0FBUixDQUFZLG1CQUFaO0FBQ0EsTUFBSUMsT0FBTyxJQUFYO0FBQ0EsTUFBSUMsYUFBYVYsU0FBU1csV0FBVCxFQUFqQjtBQUNBLE1BQ0E7QUFDRUYsV0FBTyxJQUFJRyxJQUFKLENBQVMsQ0FBQ1gsR0FBRCxDQUFULENBQVA7QUFDRCxHQUhELENBR0UsT0FBT1ksQ0FBUCxFQUNGO0FBQ0VDLFVBQU1ELENBQU47QUFDRDtBQUNELE1BQUlFLEtBQUssSUFBSUMsUUFBSixFQUFUO0FBQ0FELEtBQUdFLE1BQUgsQ0FBVSxZQUFWLEVBQXdCUixJQUF4QixFQUE4QixXQUE5QjtBQUNBTSxLQUFHRSxNQUFILENBQVUsS0FBVixFQUFnQmpC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LGdCQUFnQixpREFBaEM7QUFDRDs7QUFFRCxNQUFHLDBGQUFBN1AsQ0FBVSxJQUFWLEVBQWdCZ1EsYUFBaEIsTUFBbUMsS0FBdEMsRUFBNkM7QUFDM0NILG9CQUFnQkEsZ0JBQWdCLCtDQUFoQztBQUNEO0FBQ0QsU0FBT0EsYUFBUDtBQUNELEMiLCJmaWxlIjoicHNpcHJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxYTU2MmQ2YzAwMzdiOWY4NTViMSIsIi8vZ2l2ZW4gYSBqb2IgbmFtZSBwcmVwIGFsbCB0aGUgZm9ybSBlbGVtZW50cyBhbmQgc2VuZCBhbiBodHRwIHJlcXVlc3QgdG8gdGhlXG4vL2JhY2tlbmRcbmV4cG9ydCBmdW5jdGlvbiBzZW5kX2pvYihyYWN0aXZlLCBqb2JfbmFtZSwgc2VxLCBuYW1lLCBlbWFpbCwgcmFjdGl2ZV9pbnN0YW5jZSwgc3VibWl0X3VybCwgdGltZXNfdXJsKVxue1xuICAvL2FsZXJ0KHNlcSk7XG4gIGNvbnNvbGUubG9nKFwiU2VuZGluZyBmb3JtIGRhdGFcIik7XG4gIHZhciBmaWxlID0gbnVsbDtcbiAgbGV0IHVwcGVyX25hbWUgPSBqb2JfbmFtZS50b1VwcGVyQ2FzZSgpO1xuICB0cnlcbiAge1xuICAgIGZpbGUgPSBuZXcgQmxvYihbc2VxXSk7XG4gIH0gY2F0Y2ggKGUpXG4gIHtcbiAgICBhbGVydChlKTtcbiAgfVxuICBsZXQgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgZmQuYXBwZW5kKFwiaW5wdXRfZGF0YVwiLCBmaWxlLCAnaW5wdXQudHh0Jyk7XG4gIGZkLmFwcGVuZChcImpvYlwiLGpvYl9uYW1lKTtcbiAgZmQuYXBwZW5kKFwic3VibWlzc2lvbl9uYW1lXCIsbmFtZSk7XG4gIGZkLmFwcGVuZChcImVtYWlsXCIsIGVtYWlsKTtcblxuICBsZXQgcmVzcG9uc2VfZGF0YSA9IHNlbmRfcmVxdWVzdChzdWJtaXRfdXJsLCBcIlBPU1RcIiwgZmQpO1xuICBpZihyZXNwb25zZV9kYXRhICE9PSBudWxsKVxuICB7XG4gICAgbGV0IHRpbWVzID0gc2VuZF9yZXF1ZXN0KHRpbWVzX3VybCwnR0VUJyx7fSk7XG4gICAgLy9hbGVydChKU09OLnN0cmluZ2lmeSh0aW1lcykpO1xuICAgIGlmKGpvYl9uYW1lIGluIHRpbWVzKVxuICAgIHtcbiAgICAgIHJhY3RpdmVfaW5zdGFuY2Uuc2V0KGpvYl9uYW1lKydfdGltZScsIHVwcGVyX25hbWUrXCIgam9icyB0eXBpY2FsbHkgdGFrZSBcIit0aW1lc1tqb2JfbmFtZV0rXCIgc2Vjb25kc1wiKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJhY3RpdmVfaW5zdGFuY2Uuc2V0KGpvYl9uYW1lKydfdGltZScsIFwiVW5hYmxlIHRvIHJldHJpZXZlIGF2ZXJhZ2UgdGltZSBmb3IgXCIrdXBwZXJfbmFtZStcIiBqb2JzLlwiKTtcbiAgICB9XG4gICAgZm9yKHZhciBrIGluIHJlc3BvbnNlX2RhdGEpXG4gICAge1xuICAgICAgaWYoayA9PSBcIlVVSURcIilcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZV9pbnN0YW5jZS5zZXQoJ2JhdGNoX3V1aWQnLCByZXNwb25zZV9kYXRhW2tdKTtcbiAgICAgICAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCBqb2JfbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2VcbiAge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vL2dpdmVuIGFuZCBhcnJheSByZXR1cm4gd2hldGhlciBhbmQgZWxlbWVudCBpcyBwcmVzZW50XG5leHBvcnQgZnVuY3Rpb24gaXNJbkFycmF5KHZhbHVlLCBhcnJheSkge1xuICBpZihhcnJheS5pbmRleE9mKHZhbHVlKSA+IC0xKVxuICB7XG4gICAgcmV0dXJuKHRydWUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybihmYWxzZSk7XG4gIH1cbn1cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5leHBvcnQgZnVuY3Rpb24gc2VuZF9yZXF1ZXN0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuICBjb25zb2xlLmxvZygnU2VuZGluZyBVUkkgcmVxdWVzdCcpO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuICBjb25zb2xlLmxvZyh0eXBlKTtcblxuICB2YXIgcmVzcG9uc2UgPSBudWxsO1xuICAkLmFqYXgoe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogc2VuZF9kYXRhLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGFzeW5jOiAgIGZhbHNlLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gc2VuZCBkYXRhXCIpO31cbiAgICAgIHJlc3BvbnNlPWRhdGE7XG4gICAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSlcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChcIlNlbmRpbmcgSm9iIHRvIFwiK3VybCtcIiBGYWlsZWQuIFwiK2Vycm9yLnJlc3BvbnNlVGV4dCtcIi4gVGhlIEJhY2tlbmQgcHJvY2Vzc2luZyBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUuIFNvbWV0aGluZyBDYXRhc3Ryb3BoaWMgaGFzIGdvbmUgd3JvbmcuIFBsZWFzZSBjb250YWN0IHBzaXByZWRAY3MudWNsLmFjLnVrXCIpOyByZXR1cm4gbnVsbDt9XG4gIH0pLnJlc3BvbnNlSlNPTjtcbiAgcmV0dXJuKHJlc3BvbnNlKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9jb21tb24vaW5kZXguanMiLCIvKiAxLiBDYXRjaCBmb3JtIGlucHV0XG4gICAgIDIuIFZlcmlmeSBmb3JtXG4gICAgIDMuIElmIGdvb2QgdGhlbiBtYWtlIGZpbGUgZnJvbSBkYXRhIGFuZCBwYXNzIHRvIGJhY2tlbmRcbiAgICAgNC4gc2hyaW5rIGZvcm0gYXdheVxuICAgICA1LiBPcGVuIHNlcSBwYW5lbFxuICAgICA2LiBTaG93IHByb2Nlc3NpbmcgYW5pbWF0aW9uXG4gICAgIDcuIGxpc3RlbiBmb3IgcmVzdWx0XG4qL1xuaW1wb3J0IHsgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0gfSBmcm9tICcuL2Zvcm1zL2luZGV4LmpzJztcbmltcG9ydCB7IHNlbmRfam9iIH0gZnJvbSAnLi9jb21tb24vaW5kZXguanMnO1xuaW1wb3J0IHsgc2VuZF9yZXF1ZXN0IH0gZnJvbSAnLi9jb21tb24vaW5kZXguanMnO1xuXG4vLyBpbXBvcnQgeyAgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVyL2luZGV4LmpzJztcbnZhciBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCcuY29weUJ1dHRvbicpO1xudmFyIHppcCA9IG5ldyBKU1ppcCgpO1xuXG5jbGlwYm9hcmQub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcbmNsaXBib2FyZC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcblxuLy8gU0VUIEVORFBPSU5UUyBGT1IgREVWLCBTVEFHSU5HIE9SIFBST0RcbmxldCBlbmRwb2ludHNfdXJsID0gbnVsbDtcbmxldCBzdWJtaXRfdXJsID0gbnVsbDtcbmxldCB0aW1lc191cmwgPSBudWxsO1xubGV0IGdlYXJzX3N2ZyA9IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG5sZXQgbWFpbl91cmwgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrXCI7XG5sZXQgYXBwX3BhdGggPSBcIi9wc2lwcmVkX2JldGFcIjtcbmxldCBmaWxlX3VybCA9ICcnO1xuXG5pZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCIxMjcuMC4wLjFcIiB8fCBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIilcbntcbiAgZW5kcG9pbnRzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9zdWJtaXNzaW9uLyc7XG4gIHRpbWVzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9qb2J0aW1lcy8nO1xuICBhcHBfcGF0aCA9ICcvaW50ZXJmYWNlJztcbiAgbWFpbl91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJztcbiAgZ2VhcnNfc3ZnID0gXCIuLi9zdGF0aWMvaW1hZ2VzL2dlYXJzLnN2Z1wiO1xuICBmaWxlX3VybCA9IG1haW5fdXJsO1xufVxuZWxzZSBpZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJiaW9pbmZzdGFnZTEuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgID09PSBcImJpb2luZi5jcy51Y2wuYWMudWtcIiB8fCBsb2NhdGlvbi5ocmVmICA9PT0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51ay9wc2lwcmVkX2JldGEvXCIpIHtcbiAgZW5kcG9pbnRzX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL2VuZHBvaW50cy8nO1xuICBzdWJtaXRfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9qb2J0aW1lcy8nO1xuICBmaWxlX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoK1wiL2FwaVwiO1xuICAvL2dlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbn1cbmVsc2Uge1xuICBhbGVydCgnVU5TRVRUSU5HIEVORFBPSU5UUyBXQVJOSU5HLCBXQVJOSU5HIScpO1xuICBlbmRwb2ludHNfdXJsID0gJyc7XG4gIHN1Ym1pdF91cmwgPSAnJztcbiAgdGltZXNfdXJsID0gJyc7XG59XG5cbi8vIERFQ0xBUkUgVkFSSUFCTEVTIGFuZCBpbml0IHJhY3RpdmUgaW5zdGFuY2VcblxudmFyIHJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XG4gIGVsOiAnI3BzaXByZWRfc2l0ZScsXG4gIHRlbXBsYXRlOiAnI2Zvcm1fdGVtcGxhdGUnLFxuICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0c192aXNpYmxlOiAxLFxuICAgICAgICAgIHJlc3VsdHNfcGFuZWxfdmlzaWJsZTogMSxcbiAgICAgICAgICBzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlOiAwLFxuICAgICAgICAgIG1vZGVsbGVyX2tleTogbnVsbCxcblxuICAgICAgICAgIHBzaXByZWRfY2hlY2tlZDogdHJ1ZSxcbiAgICAgICAgICBwc2lwcmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBtZW1zYXRzdm1fY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWVtc2F0c3ZtX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9idXR0b246IGZhbHNlLFxuXG5cbiAgICAgICAgICAvLyBwZ2VudGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gcGRvbXRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIGRvbXByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gbWVtcGFja19jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBmZnByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gYmlvc2VyZl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBkb21zZXJmX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGRvd25sb2FkX2xpbmtzOiAnJyxcbiAgICAgICAgICBwc2lwcmVkX2pvYjogJ3BzaXByZWRfam9iJyxcbiAgICAgICAgICBkaXNvcHJlZF9qb2I6ICdkaXNvcHJlZF9qb2InLFxuICAgICAgICAgIG1lbXNhdHN2bV9qb2I6ICdtZW1zYXRzdm1fam9iJyxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfam9iOiAncGdlbnRocmVhZGVyX2pvYicsXG5cbiAgICAgICAgICBwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBQU0lQUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIHBzaXByZWRfd2FpdGluZ19pY29uOiAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIj48L29iamVjdD4nLFxuICAgICAgICAgIHBzaXByZWRfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcHNpcHJlZF9ob3JpejogbnVsbCxcblxuICAgICAgICAgIGRpc29wcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBESVNPUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBkaXNvcHJlZF93YWl0aW5nX2ljb246ICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiPjwvb2JqZWN0PicsXG4gICAgICAgICAgZGlzb3ByZWRfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZGlzb19wcmVjaXNpb246IG51bGwsXG5cbiAgICAgICAgICBtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVNBVC1TVk0gam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgbWVtc2F0c3ZtX3dhaXRpbmdfaWNvbjogJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JyxcbiAgICAgICAgICBtZW1zYXRzdm1fdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0c3ZtX3NjaGVtYXRpYzogJycsXG4gICAgICAgICAgbWVtc2F0c3ZtX2NhcnRvb246ICcnLFxuXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbjogJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JyxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcGdlbl90YWJsZTogbnVsbCxcbiAgICAgICAgICBwZ2VuX2Fubl9zZXQ6IHt9LFxuXG4gICAgICAgICAgLy8gU2VxdWVuY2UgYW5kIGpvYiBpbmZvXG4gICAgICAgICAgc2VxdWVuY2U6ICcnLFxuICAgICAgICAgIHNlcXVlbmNlX2xlbmd0aDogMSxcbiAgICAgICAgICBzdWJzZXF1ZW5jZV9zdGFydDogMSxcbiAgICAgICAgICBzdWJzZXF1ZW5jZV9zdG9wOiAxLFxuICAgICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBiYXRjaF91dWlkOiBudWxsLFxuXG4gICAgICAgICAgLy9ob2xkIGFubm90YXRpb25zIHRoYXQgYXJlIHJlYWQgZnJvbSBkYXRhZmlsZXNcbiAgICAgICAgICBhbm5vdGF0aW9uczogbnVsbCxcbiAgICAgICAgfVxufSk7XG5cbmlmKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcIjEyNy4wLjAuMVwiKSB7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcsICdkYW5pZWwuYnVjaGFuQHVjbC5hYy51aycpO1xuICByYWN0aXZlLnNldCgnbmFtZScsICd0ZXN0Jyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsICdRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBUycpO1xufVxuXG4vLzRiNmFkNzkyLWVkMWYtMTFlNS04OTg2LTk4OTA5NmMxM2VlNlxubGV0IHV1aWRfcmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9JC9pO1xubGV0IHV1aWRfbWF0Y2ggPSB1dWlkX3JlZ2V4LmV4ZWMoZ2V0VXJsVmFycygpLnV1aWQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEFQUExJQ0FUSU9OIEhFUkVcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0hlcmUgd2VyZSBrZWVwIGFuIGV5ZSBvbiBzb21lIGZvcm0gZWxlbWVudHMgYW5kIHJld3JpdGUgdGhlIG5hbWUgaWYgcGVvcGxlXG4vL2hhdmUgcHJvdmlkZWQgYSBmYXN0YSBmb3JtYXR0ZWQgc2VxXG5sZXQgc2VxX29ic2VydmVyID0gcmFjdGl2ZS5vYnNlcnZlKCdzZXF1ZW5jZScsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgbGV0IHJlZ2V4ID0gL14+KC4rPylcXHMvO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG5ld1ZhbHVlKTtcbiAgaWYobWF0Y2gpXG4gIHtcbiAgICB0aGlzLnNldCgnbmFtZScsIG1hdGNoWzFdKTtcbiAgfVxuICAvLyBlbHNlIHtcbiAgLy8gICB0aGlzLnNldCgnbmFtZScsIG51bGwpO1xuICAvLyB9XG5cbiAgfSxcbiAge2luaXQ6IGZhbHNlLFxuICAgZGVmZXI6IHRydWVcbiB9KTtcblxuLy90aGVzZXMgdHdvIG9ic2VydmVycyBzdG9wIHBlb3BsZSBzZXR0aW5nIHRoZSByZXN1Ym1pc3Npb24gd2lkZ2V0IG91dCBvZiBib3VuZHNcbnJhY3RpdmUub2JzZXJ2ZSggJ3N1YnNlcXVlbmNlX3N0b3AnLCBmdW5jdGlvbiAoIHZhbHVlICkge1xuICBsZXQgc2VxX2xlbmd0aCA9IHJhY3RpdmUuZ2V0KCdzZXF1ZW5jZV9sZW5ndGgnKTtcbiAgbGV0IHNlcV9zdGFydCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcpO1xuICBpZih2YWx1ZSA+IHNlcV9sZW5ndGgpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9sZW5ndGgpO1xuICB9XG4gIGlmKHZhbHVlIDw9IHNlcV9zdGFydClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxX3N0YXJ0KzEpO1xuICB9XG59KTtcbnJhY3RpdmUub2JzZXJ2ZSggJ3N1YnNlcXVlbmNlX3N0YXJ0JywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9zdG9wID0gcmFjdGl2ZS5nZXQoJ3N1YnNlcXVlbmNlX3N0b3AnKTtcbiAgaWYodmFsdWUgPCAxKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0JywgMSk7XG4gIH1cbiAgaWYodmFsdWUgPj0gc2VxX3N0b3ApXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RhcnQnLCBzZXFfc3RvcC0xKTtcbiAgfVxufSk7XG5cbi8vQWZ0ZXIgYSBqb2IgaGFzIGJlZW4gc2VudCBvciBhIFVSTCBhY2NlcHRlZCB0aGlzIHJhY3RpdmUgYmxvY2sgaXMgY2FsbGVkIHRvXG4vL3BvbGwgdGhlIGJhY2tlbmQgdG8gZ2V0IHRoZSByZXN1bHRzXG5yYWN0aXZlLm9uKCdwb2xsX3RyaWdnZXInLCBmdW5jdGlvbihuYW1lLCBqb2JfdHlwZSl7XG4gIGNvbnNvbGUubG9nKFwiUG9sbGluZyBiYWNrZW5kIGZvciByZXN1bHRzXCIpO1xuICBsZXQgaG9yaXpfcmVnZXggPSAvXFwuaG9yaXokLztcbiAgbGV0IHNzMl9yZWdleCA9IC9cXC5zczIkLztcbiAgbGV0IG1lbXNhdF9jYXJ0b29uX3JlZ2V4ID0gL19jYXJ0b29uX21lbXNhdF9zdm1cXC5wbmckLztcbiAgbGV0IG1lbXNhdF9zY2hlbWF0aWNfcmVnZXggPSAvX3NjaGVtYXRpY1xcLnBuZyQvO1xuICBsZXQgbWVtc2F0X2RhdGFfcmVnZXggPSAvbWVtc2F0X3N2bSQvO1xuICBsZXQgaW1hZ2VfcmVnZXggPSAnJztcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwgKyByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgYXBwX3BhdGgrJy8mdXVpZD0nK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJykpO1xuXG4gIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCgpO1xuXG4gIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgbGV0IGJhdGNoID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGxldCBkb3dubG9hZHNfaW5mbyA9IHt9O1xuXG4gICAgaWYoYmF0Y2guc3RhdGUgPT09ICdDb21wbGV0ZScpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coXCJSZW5kZXIgcmVzdWx0c1wiKTtcbiAgICAgIGxldCBzdWJtaXNzaW9ucyA9IGJhdGNoLnN1Ym1pc3Npb25zO1xuICAgICAgc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwc2lwcmVkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5QU0lQUkVEIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2Rpc29wcmVkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQgPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlciA9IFwiPGg1PkRJU09QUkVEIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bT0ge307XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyID0gXCI8aDU+TUVNU0FUU1ZNIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ3BnZW50aHJlYWRlcicpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UFNJUFJFRCBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wR2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgcmVzdWx0cyA9IGRhdGEucmVzdWx0cztcbiAgICAgICAgICBmb3IodmFyIGkgaW4gcmVzdWx0cylcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0X2RpY3QgPSByZXN1bHRzW2ldO1xuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ0dlbkFsaWdubWVudEFubm90YXRpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJwZ2VuX2Fubl9zZXRcIik7XG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IHRtcC5zdWJzdHIoMCwgdG1wLmxhc3RJbmRleE9mKFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZihcIi5cIikrMSwgcGF0aC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgICAgICAgICAgYW5uX3NldFtpZF0uYW5uID0gcGF0aCtcIi5hbm5cIjtcbiAgICAgICAgICAgICAgICBhbm5fc2V0W2lkXS5hbG4gPSBwYXRoK1wiLmFsblwiO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvcih2YXIgaSBpbiByZXN1bHRzKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICAvL3BzaXByZWQgZmlsZXNcbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT0gJ3BzaXBhc3MyJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0gaG9yaXpfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICAgICAgICBpZihtYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnaG9yaXonKTtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+SG9yaXogRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF90aW1lXCIsICcnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc3MyX21hdGNoID0gc3MyX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgICAgICAgICAgaWYoc3MyX21hdGNoKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TUzIgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnc3MyJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdkaXNvX2Zvcm1hdCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlBCREFUIEZvcm1hdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3RpbWVcIiwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2Rpc29fY29tYmluZScpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnY29tYicpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5jb21iID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Q09NQiBOTiBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ21lbXNhdHN2bScpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3RpbWVcIiwgJycpO1xuICAgICAgICAgICAgICBsZXQgc2NoZW1lX21hdGNoID0gbWVtc2F0X3NjaGVtYXRpY19yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKHNjaGVtZV9tYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fc2NoZW1hdGljJywgJzxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLnNjaGVtYXRpYyA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlNjaGVtYXRpYyBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IGNhcnRvb25fbWF0Y2ggPSBtZW1zYXRfY2FydG9vbl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2NhcnRvb24nLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxldCBtZW1zYXRfbWF0Y2ggPSBtZW1zYXRfZGF0YV9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKG1lbXNhdF9tYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnbWVtc2F0ZGF0YScpO1xuICAgICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TWVtc2F0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnc29ydF9wcmVzdWx0JylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncHJlc3VsdCcpO1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIudGFibGUgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgVGFibGU8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfYWxpZ24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgQWxpZ25tZW50czwvYT48YnIgLz4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgICBsZXQgZG93bmxvYWRzX3N0cmluZyA9IHJhY3RpdmUuZ2V0KCdkb3dubG9hZF9saW5rcycpO1xuICAgICAgaWYoJ3BzaXByZWQnIGluIGRvd25sb2Fkc19pbmZvKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5ob3Jpeik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLnNzMik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgICAgIH1cbiAgICAgIGlmKCdkaXNvcHJlZCcgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgICAgIH1cbiAgICAgIGlmKCdtZW1zYXRzdm0nIGluIGRvd25sb2Fkc19pbmZvKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlcik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uZGF0YSk7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uc2NoZW1hdGljKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5jYXJ0b29uKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICAgICAgfVxuICAgICAgaWYoJ3BnZW50aHJlYWRlcicgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci50YWJsZSk7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24pO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gICAgICB9XG5cbiAgICAgIHJhY3RpdmUuc2V0KCdkb3dubG9hZF9saW5rcycsIGRvd25sb2Fkc19zdHJpbmcpO1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbnJhY3RpdmUub24oJ2dldF96aXAnLCBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGxldCB1dWlkID0gcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgICB6aXAuZ2VuZXJhdGVBc3luYyh7dHlwZTpcImJsb2JcIn0pLnRoZW4oZnVuY3Rpb24gKGJsb2IpIHtcbiAgICAgICAgc2F2ZUFzKGJsb2IsIHV1aWQrXCIuemlwXCIpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoZXNlIHJlYWN0IHRvIHRoZSBoZWFkZXJzIGJlaW5nIGNsaWNrZWQgdG8gdG9nZ2xlIHRoZSByZXN1bHRzIHBhbmVsXG5yYWN0aXZlLm9uKCAnZG93bmxvYWRzX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDExICk7XG59KTtcblxucmFjdGl2ZS5vbiggJ3BzaXByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSApO1xuICBpZihyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpKVxuICB7XG4gICAgYmlvZDMucHNpcHJlZChyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gIH1cbn0pO1xuXG5yYWN0aXZlLm9uKCAnZGlzb3ByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNCApO1xuICBpZihyYWN0aXZlLmdldCgnZGlzb19wcmVjaXNpb24nKSlcbiAge1xuICAgIGJpb2QzLmdlbmVyaWN4eUxpbmVDaGFydChyYWN0aXZlLmdldCgnZGlzb19wcmVjaXNpb24nKSwgJ3BvcycsIFsncHJlY2lzaW9uJ10sIFsnQmxhY2snLF0sICdEaXNvTk5DaGFydCcsIHtwYXJlbnQ6ICdkaXYuY29tYl9wbG90JywgY2hhcnRUeXBlOiAnbGluZScsIHlfY3V0b2ZmOiAwLjUsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgfVxufSk7XG5cbnJhY3RpdmUub24oICdtZW1zYXRzdm1fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNiApO1xufSk7XG5cbnJhY3RpdmUub24oICdwZ2VudGhyZWFkZXJfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMiApO1xufSk7XG5cbnJhY3RpdmUub24oICdzdWJtaXNzaW9uX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIGxldCBzdGF0ZSA9IHJhY3RpdmUuZ2V0KCdzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlJyk7XG4gIGlmKHN0YXRlID09PSAxKXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAwICk7XG4gIH1cbiAgZWxzZXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAxICk7XG4gIH1cbn0pO1xuXG4vL2dyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBtYWluIGZvcm0gYW5kIHNlbmQgdGhlIHNlcXVlbmNlIHRvIHRoZSBiYWNrZW5kXG5yYWN0aXZlLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnU3VibWl0dGluZyBkYXRhJyk7XG4gIGxldCBzZXEgPSB0aGlzLmdldCgnc2VxdWVuY2UnKTtcbiAgc2VxID0gc2VxLnJlcGxhY2UoL14+LiskL21nLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXFxufFxccy9nLFwiXCIpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHNlcSk7XG5cbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgbGV0IHBzaXByZWRfam9iID0gdGhpcy5nZXQoJ3BzaXByZWRfam9iJyk7XG4gIGxldCBwc2lwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgncHNpcHJlZF9jaGVja2VkJyk7XG4gIGxldCBkaXNvcHJlZF9qb2IgPSB0aGlzLmdldCgnZGlzb3ByZWRfam9iJyk7XG4gIGxldCBkaXNvcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ2Rpc29wcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1lbXNhdHN2bV9qb2IgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2pvYicpO1xuICBsZXQgbWVtc2F0c3ZtX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2NoZWNrZWQnKTtcbiAgbGV0IHBnZW50aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2pvYicpO1xuICBsZXQgcGdlbnRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2NoZWNrZWQnKTtcbiAgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgIG1lbXNhdHN2bV9jaGVja2VkLCBwZ2VudGhyZWFkZXJfY2hlY2tlZCwgdGhpcyk7XG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gZ3JhYiB0aGUgc3VibWl0IGV2ZW50IGZyb20gdGhlIFJlc3VibWlzc2lvbiB3aWRnZXQsIHRydW5jYXRlIHRoZSBzZXF1ZW5jZVxuLy8gYW5kIHNlbmQgYSBuZXcgam9iXG5yYWN0aXZlLm9uKCdyZXN1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKCdSZXN1Ym1pdHRpbmcgc2VnbWVudCcpO1xuICBsZXQgc3RhcnQgPSByYWN0aXZlLmdldChcInN1YnNlcXVlbmNlX3N0YXJ0XCIpO1xuICBsZXQgc3RvcCA9IHJhY3RpdmUuZ2V0KFwic3Vic2VxdWVuY2Vfc3RvcFwiKTtcbiAgbGV0IHNlcXVlbmNlID0gcmFjdGl2ZS5nZXQoXCJzZXF1ZW5jZVwiKTtcbiAgbGV0IHN1YnNlcXVlbmNlID0gc2VxdWVuY2Uuc3Vic3RyaW5nKHN0YXJ0LTEsIHN0b3ApO1xuICBsZXQgbmFtZSA9IHRoaXMuZ2V0KCduYW1lJykrXCJfc2VnXCI7XG4gIGxldCBlbWFpbCA9IHRoaXMuZ2V0KCdlbWFpbCcpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc3Vic2VxdWVuY2UubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzdWJzZXF1ZW5jZS5sZW5ndGgpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2UnLCBzdWJzZXF1ZW5jZSk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJywgbmFtZSk7XG4gIGxldCBwc2lwcmVkX2pvYiA9IHRoaXMuZ2V0KCdwc2lwcmVkX2pvYicpO1xuICBsZXQgcHNpcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ3BzaXByZWRfY2hlY2tlZCcpO1xuICBsZXQgZGlzb3ByZWRfam9iID0gdGhpcy5nZXQoJ2Rpc29wcmVkX2pvYicpO1xuICBsZXQgZGlzb3ByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdkaXNvcHJlZF9jaGVja2VkJyk7XG4gIGxldCBtZW1zYXRzdm1fam9iID0gdGhpcy5nZXQoJ21lbXNhdHN2bV9qb2InKTtcbiAgbGV0IG1lbXNhdHN2bV9jaGVja2VkID0gdGhpcy5nZXQoJ21lbXNhdHN2bV9jaGVja2VkJyk7XG4gIGxldCBwZ2VudGhyZWFkZXJfam9iID0gdGhpcy5nZXQoJ3BnZW50aHJlYWRlcl9qb2InKTtcbiAgbGV0IHBnZW50aHJlYWRlcl9jaGVja2VkID0gdGhpcy5nZXQoJ3BnZW50aHJlYWRlcl9jaGVja2VkJyk7XG5cbiAgLy9jbGVhciB3aGF0IHdlIGhhdmUgcHJldmlvdXNseSB3cml0dGVuXG4gIGNsZWFyX3NldHRpbmdzKCk7XG4gIC8vdmVyaWZ5IGZvcm0gY29udGVudHMgYW5kIHBvc3RcbiAgLy9jb25zb2xlLmxvZyhuYW1lKTtcbiAgLy9jb25zb2xlLmxvZyhlbWFpbCk7XG4gIHZlcmlmeV9hbmRfc2VuZF9mb3JtKHJhY3RpdmUsIHN1YnNlcXVlbmNlLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgIG1lbXNhdHN2bV9jaGVja2VkLCBwZ2VudGhyZWFkZXJfY2hlY2tlZCwgdGhpcyk7XG4gIC8vd3JpdGUgbmV3IGFubm90YXRpb24gZGlhZ3JhbVxuICAvL3N1Ym1pdCBzdWJzZWN0aW9uXG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gSGVyZSBoYXZpbmcgc2V0IHVwIHJhY3RpdmUgYW5kIHRoZSBmdW5jdGlvbnMgd2UgbmVlZCB3ZSB0aGVuIGNoZWNrXG4vLyBpZiB3ZSB3ZXJlIHByb3ZpZGVkIGEgVVVJRCwgSWYgdGhlIHBhZ2UgaXMgbG9hZGVkIHdpdGggYSBVVUlEIHJhdGhlciB0aGFuIGFcbi8vIGZvcm0gc3VibWl0LlxuLy9UT0RPOiBIYW5kbGUgbG9hZGluZyB0aGF0IHBhZ2Ugd2l0aCB1c2UgdGhlIE1FTVNBVCBhbmQgRElTT1BSRUQgVVVJRFxuLy9cbmlmKGdldFVybFZhcnMoKS51dWlkICYmIHV1aWRfbWF0Y2gpXG57XG4gIGNvbnNvbGUubG9nKCdDYXVnaHQgYW4gaW5jb21pbmcgVVVJRCcpO1xuICBzZXFfb2JzZXJ2ZXIuY2FuY2VsKCk7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7IC8vIHNob3VsZCBtYWtlIGEgZ2VuZXJpYyBvbmUgdmlzaWJsZSB1bnRpbCByZXN1bHRzIGFycml2ZS5cbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgcmFjdGl2ZS5zZXQoXCJiYXRjaF91dWlkXCIsIGdldFVybFZhcnMoKS51dWlkKTtcbiAgbGV0IHByZXZpb3VzX2RhdGEgPSBnZXRfcHJldmlvdXNfZGF0YShnZXRVcmxWYXJzKCkudXVpZCk7XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygncHNpcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdkaXNvcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZGlzb3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDQpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWVtc2F0c3ZtJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDYpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygncGdlbnRocmVhZGVyJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDIpO1xuICB9XG5cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL2JlZm9yZSBhIHJlc3VibWlzc2lvbiBpcyBzZW50IGFsbCB2YXJpYWJsZXMgYXJlIHJlc2V0IHRvIHRoZSBwYWdlIGRlZmF1bHRzXG5mdW5jdGlvbiBjbGVhcl9zZXR0aW5ncygpe1xuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMik7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCgnZG93bmxvYWRfbGlua3MnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgUFNJUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLG51bGwpO1xuICByYWN0aXZlLnNldCgnZGlzb3ByZWRfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBESVNPUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF93YWl0aW5nX2ljb24nLCAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIi8+Jyk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVNBVC1TVk0gam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3NjaGVtYXRpYycsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9jYXJ0b29uJywgJycpO1xuICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgcEdlblRIUkVBREVSIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl93YWl0aW5nX2ljb24nLCAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIi8+Jyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fdGFibGUnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VuX3NldCcsIHt9KTtcblxuICAvL3JhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuXG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdiYXRjaF91dWlkJyxudWxsKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5zZXF1ZW5jZV9wbG90Jyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYucHNpcHJlZF9jYXJ0b29uJyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYuY29tYl9wbG90Jyk7XG5cbiAgemlwID0gbmV3IEpTWmlwKCk7XG59XG5cbi8vd2hlbiBhIHJlc3VsdHMgcGFnZSBpcyBpbnN0YW50aWF0ZWQgYW5kIGJlZm9yZSBzb21lIGFubm90YXRpb25zIGhhdmUgY29tZSBiYWNrXG4vL3dlIGRyYXcgYW5kIGVtcHR5IGFubm90YXRpb24gcGFuZWxcbmZ1bmN0aW9uIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCgpe1xuXG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgbGV0IHJlc2lkdWVzID0gc2VxLnNwbGl0KCcnKTtcbiAgbGV0IGFubm90YXRpb25zID0gW107XG4gIHJlc2lkdWVzLmZvckVhY2goZnVuY3Rpb24ocmVzKXtcbiAgICBhbm5vdGF0aW9ucy5wdXNoKHsncmVzJzogcmVzfSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gIGJpb2QzLmFubm90YXRpb25HcmlkKHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG59XG5cbi8vdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIHNlcXVlbmNlIGZyb20gYSBwcmV2aW91cyBzdWJtaXNzaW9uIGlzIHRoZVxuLy9wYWdlIHdhcyBsb2FkZWQgd2l0aCBhIFVVSURcbmZ1bmN0aW9uIGdldF9wcmV2aW91c19kYXRhKHV1aWQpXG57XG4gICAgY29uc29sZS5sb2coJ1JlcXVlc3RpbmcgZGV0YWlscyBnaXZlbiBVUkknKTtcbiAgICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICAgIC8vYWxlcnQodXJsKTtcbiAgICBsZXQgc3VibWlzc2lvbl9yZXNwb25zZSA9IHNlbmRfcmVxdWVzdCh1cmwsIFwiR0VUXCIsIHt9KTtcbiAgICBpZighIHN1Ym1pc3Npb25fcmVzcG9uc2Upe2FsZXJ0KFwiTk8gU1VCTUlTU0lPTiBEQVRBXCIpO31cbiAgICBsZXQgc2VxID0gZ2V0X3RleHQoZmlsZV91cmwrc3VibWlzc2lvbl9yZXNwb25zZS5zdWJtaXNzaW9uc1swXS5pbnB1dF9maWxlLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGpvYnMgPSAnJztcbiAgICBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24oc3VibWlzc2lvbil7XG4gICAgICBqb2JzICs9IHN1Ym1pc3Npb24uam9iX25hbWUrXCIsXCI7XG4gICAgfSk7XG4gICAgam9icyA9IGpvYnMuc2xpY2UoMCwgLTEpO1xuICAgIHJldHVybih7J3NlcSc6IHNlcSwgJ2VtYWlsJzogc3VibWlzc2lvbl9yZXNwb25zZS5zdWJtaXNzaW9uc1swXS5lbWFpbCwgJ25hbWUnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLnN1Ym1pc3Npb25fbmFtZSwgJ2pvYnMnOiBqb2JzfSk7XG59XG5cbi8vcG9sbHMgdGhlIGJhY2tlbmQgdG8gZ2V0IHJlc3VsdHMgYW5kIHRoZW4gcGFyc2VzIHRob3NlIHJlc3VsdHMgdG8gZGlzcGxheVxuLy90aGVtIG9uIHRoZSBwYWdlXG5mdW5jdGlvbiBwcm9jZXNzX2ZpbGUodXJsX3N0dWIsIHBhdGgsIGN0bClcbntcbiAgbGV0IHVybCA9IHVybF9zdHViICsgcGF0aDtcbiAgbGV0IHBhdGhfYml0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAvL2dldCBhIHJlc3VsdHMgZmlsZSBhbmQgcHVzaCB0aGUgZGF0YSBpbiB0byB0aGUgYmlvM2Qgb2JqZWN0XG4gIC8vYWxlcnQodXJsKTtcbiAgY29uc29sZS5sb2coJ0dldHRpbmcgUmVzdWx0cyBGaWxlIGFuZCBwcm9jZXNzaW5nJyk7XG4gIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgYXN5bmM6ICAgdHJ1ZSxcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGZpbGUpXG4gICAge1xuICAgICAgemlwLmZvbGRlcihwYXRoX2JpdHNbMV0pLmZpbGUocGF0aF9iaXRzWzJdLCBmaWxlKTtcbiAgICAgIGlmKGN0bCA9PT0gJ2hvcml6JylcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLCBmaWxlKTtcbiAgICAgICAgYmlvZDMucHNpcHJlZChmaWxlLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdzczInKVxuICAgICAge1xuICAgICAgICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgICAgICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGxpbmVzLnNoaWZ0KCk7XG4gICAgICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgYW5ub3RhdGlvbnNbaV0uc3MgPSBlbnRyaWVzWzNdO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgIGFsZXJ0KFwiU1MyIGFubm90YXRpb24gbGVuZ3RoIGRvZXMgbm90IG1hdGNoIHF1ZXJ5IHNlcXVlbmNlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwYmRhdCcpXG4gICAgICB7XG4gICAgICAgIC8vYWxlcnQoJ1BCREFUIHByb2Nlc3MnKTtcbiAgICAgICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgaWYoYW5ub3RhdGlvbnMubGVuZ3RoID09IGxpbmVzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgIGlmKGVudHJpZXNbM10gPT09ICctJyl7YW5ub3RhdGlvbnNbaV0uZGlzb3ByZWQgPSAnRCc7fVxuICAgICAgICAgICAgaWYoZW50cmllc1szXSA9PT0gJ14nKXthbm5vdGF0aW9uc1tpXS5kaXNvcHJlZCA9ICdQQic7fVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdjb21iJylcbiAgICAgIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IFtdO1xuICAgICAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTtcbiAgICAgICAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgcHJlY2lzaW9uW2ldID0ge307XG4gICAgICAgICAgcHJlY2lzaW9uW2ldLnBvcyA9IGVudHJpZXNbMV07XG4gICAgICAgICAgcHJlY2lzaW9uW2ldLnByZWNpc2lvbiA9IGVudHJpZXNbNF07XG4gICAgICAgIH0pO1xuICAgICAgICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nLCBwcmVjaXNpb24pO1xuICAgICAgICBiaW9kMy5nZW5lcmljeHlMaW5lQ2hhcnQocHJlY2lzaW9uLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnbWVtc2F0ZGF0YScpXG4gICAgICB7XG4gICAgICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgICAgICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gICAgICAgIHRvcG9fcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9Ub3BvbG9neTpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgc2lnbmFsX3JlZ2lvbnMgPSBnZXRfbWVtc2F0X3JhbmdlcygvU2lnbmFsXFxzcGVwdGlkZTpcXHMrKC4rKVxcbi8sIGZpbGUpO1xuICAgICAgICByZWVudHJhbnRfcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9SZS1lbnRyYW50XFxzaGVsaWNlczpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgdGVybWluYWwgPSBnZXRfbWVtc2F0X3JhbmdlcygvTi10ZXJtaW5hbDpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzaWduYWxfcmVnaW9ucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlZW50cmFudF9yZWdpb25zKTtcbiAgICAgICAgY29pbF90eXBlID0gJ0NZJztcbiAgICAgICAgaWYodGVybWluYWwgPT09ICdvdXQnKVxuICAgICAgICB7XG4gICAgICAgICAgY29pbF90eXBlID0gJ0VDJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG1wX2Fubm8gPSBuZXcgQXJyYXkoc2VxLmxlbmd0aCk7XG4gICAgICAgIGlmKHRvcG9fcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKVxuICAgICAgICB7XG4gICAgICAgICAgbGV0IHByZXZfZW5kID0gMDtcbiAgICAgICAgICB0b3BvX3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdUTScsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgICAgaWYocHJldl9lbmQgPiAwKXtwcmV2X2VuZCAtPSAxO31cbiAgICAgICAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbChjb2lsX3R5cGUsIHByZXZfZW5kLCByZWdpb25bMF0pO1xuICAgICAgICAgICAgaWYoY29pbF90eXBlID09PSAnRUMnKXsgY29pbF90eXBlID0gJ0NZJzt9ZWxzZXtjb2lsX3R5cGUgPSAnRUMnO31cbiAgICAgICAgICAgIHByZXZfZW5kID0gcmVnaW9uWzFdKzI7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKGNvaWxfdHlwZSwgcHJldl9lbmQtMSwgc2VxLmxlbmd0aCk7XG5cbiAgICAgICAgfVxuICAgICAgICAvL3NpZ25hbF9yZWdpb25zID0gW1s3MCw4M10sIFsxMDIsMTE3XV07XG4gICAgICAgIGlmKHNpZ25hbF9yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpe1xuICAgICAgICAgIHNpZ25hbF9yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgICAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnUycsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVlbnRyYW50X3JlZ2lvbnMgPSBbWzQwLDUwXSwgWzIwMCwyMThdXTtcbiAgICAgICAgaWYocmVlbnRyYW50X3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJyl7XG4gICAgICAgICAgcmVlbnRyYW50X3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdSSCcsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRtcF9hbm5vLmZvckVhY2goZnVuY3Rpb24oYW5ubywgaSl7XG4gICAgICAgICAgYW5ub3RhdGlvbnNbaV0ubWVtc2F0ID0gYW5ubztcbiAgICAgICAgfSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgICAgYmlvZDMuYW5ub3RhdGlvbkdyaWQoYW5ub3RhdGlvbnMsIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3ByZXN1bHQnKVxuICAgICAge1xuXG4gICAgICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsZXQgYW5uX2xpc3QgPSByYWN0aXZlLmdldCgncGdlbl9hbm5fc2V0Jyk7XG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGFubl9saXN0KS5sZW5ndGggPiAwKXtcbiAgICAgICAgbGV0IHBzZXVkb190YWJsZSA9ICc8dGFibGUgY2xhc3M9XCJzbWFsbC10YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkXCI+XFxuJztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dHI+PHRoPkNvbmYuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5OZXQgU2NvcmU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPnAtdmFsdWU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlBhaXJFPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Tb2x2RTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxuIFNjb3JlPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gTGVuZ3RoPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TdHIgTGVuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TZXEgTGVuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Gb2xkPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggU0NPUDwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+U0VBUkNIIENBVEg8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlBEQlNVTTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxpZ25tZW50PC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5NT0RFTDwvdGg+JztcblxuICAgICAgICAvLyBpZiBNT0RFTExFUiBUSElOR1lcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8L3RyPjx0Ym9keVwiPlxcbic7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgaWYobGluZS5sZW5ndGggPT09IDApe3JldHVybjt9XG4gICAgICAgICAgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICBpZihlbnRyaWVzWzldK1wiX1wiK2kgaW4gYW5uX2xpc3QpXG4gICAgICAgICAge1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0cj5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQgY2xhc3M9J1wiK2VudHJpZXNbMF0udG9Mb3dlckNhc2UoKStcIic+XCIrZW50cmllc1swXStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbMV0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzJdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1szXStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNF0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzVdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s2XStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbN10rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzhdK1wiPC90ZD5cIjtcbiAgICAgICAgICBsZXQgcGRiID0gZW50cmllc1s5XS5zdWJzdHJpbmcoMCwgZW50cmllc1s5XS5sZW5ndGgtMik7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwczovL3d3dy5yY3NiLm9yZy9wZGIvZXhwbG9yZS9leHBsb3JlLmRvP3N0cnVjdHVyZUlkPVwiK3BkYitcIic+XCIrZW50cmllc1s5XStcIjwvYT48L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3Njb3AubXJjLWxtYi5jYW0uYWMudWsvc2NvcC9wZGIuY2dpP3BkYj1cIitwZGIrXCInPlNDT1AgU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmNhdGhkYi5pbmZvL3BkYi9cIitwZGIrXCInPkNBVEggU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmViaS5hYy51ay90aG9ybnRvbi1zcnYvZGF0YWJhc2VzL2NnaS1iaW4vcGRic3VtL0dldFBhZ2UucGw/cGRiY29kZT1cIitwZGIrXCInPk9wZW4gUERCU1VNPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J2xvYWROZXdBbGlnbm1lbnQoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiLFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKGVudHJpZXNbOV0rXCJfXCIraSkrXCJcXFwiKTsnIHZhbHVlPSdEaXNwbGF5IEFsaWdubWVudCcgLz48L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdidWlsZE1vZGVsKFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbG4pK1wiXFxcIik7JyB2YWx1ZT0nQnVpbGQgTW9kZWwnIC8+PC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8L3RyPlxcblwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSBcIjwvdGJvZHk+PC90YWJsZT5cXG5cIjtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VuX3RhYmxlXCIsIHBzZXVkb190YWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByYWN0aXZlLnNldChcInBnZW5fdGFibGVcIiwgXCI8aDM+Tm8gZ29vZCBoaXRzIGZvdW5kLiBHVUVTUyBhbmQgTE9XIGNvbmZpZGVuY2UgaGl0cyBjYW4gYmUgZm91bmQgaW4gdGhlIHJlc3VsdHMgZmlsZTwvaDM+XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChKU09OLnN0cmluZ2lmeShlcnJvcikpO31cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldF9tZW1zYXRfcmFuZ2VzKHJlZ2V4LCBkYXRhKVxue1xuICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoZGF0YSk7XG4gICAgaWYobWF0Y2hbMV0uaW5jbHVkZXMoJywnKSlcbiAgICB7XG4gICAgICBsZXQgcmVnaW9ucyA9IG1hdGNoWzFdLnNwbGl0KCcsJyk7XG4gICAgICByZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uLCBpKXtcbiAgICAgICAgcmVnaW9uc1tpXSA9IHJlZ2lvbi5zcGxpdCgnLScpO1xuICAgICAgICByZWdpb25zW2ldWzBdID0gcGFyc2VJbnQocmVnaW9uc1tpXVswXSk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMV0gPSBwYXJzZUludChyZWdpb25zW2ldWzFdKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuKHJlZ2lvbnMpO1xuICAgIH1cbiAgICByZXR1cm4obWF0Y2hbMV0pO1xufVxuXG4vL2dldCB0ZXh0IGNvbnRlbnRzIGZyb20gYSByZXN1bHQgVVJJXG5mdW5jdGlvbiBnZXRfdGV4dCh1cmwsIHR5cGUsIHNlbmRfZGF0YSlcbntcblxuIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgLy9kYXRhVHlwZTogXCJ0eHRcIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gcmVxdWVzdCBpbnB1dCBkYXRhIHRleHRcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiR2V0dGluZ3MgcmVzdWx0cyBmYWlsZWQuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSBpcyBub3QgYXZhaWxhYmxlLiBTb21ldGhpbmcgQ2F0YXN0cm9waGljIGhhcyBnb25lIHdyb25nLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTt9XG4gIH0pO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG4vL2dpdmVuIGEgVVJMIHJldHVybiB0aGUgYXR0YWNoZWQgdmFyaWFibGVzXG5mdW5jdGlvbiBnZXRVcmxWYXJzKCkge1xuICAgIGxldCB2YXJzID0ge307XG4gICAgLy9jb25zaWRlciB1c2luZyBsb2NhdGlvbi5zZWFyY2ggaW5zdGVhZCBoZXJlXG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvWz8mXSsoW149Jl0rKT0oW14mXSopL2dpLFxuICAgIGZ1bmN0aW9uKG0sa2V5LHZhbHVlKSB7XG4gICAgICB2YXJzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFycztcbiAgfVxuXG4vKiEgZ2V0RW1QaXhlbHMgIHwgQXV0aG9yOiBUeXNvbiBNYXRhbmljaCAoaHR0cDovL21hdGFuaWNoLmNvbSksIDIwMTMgfCBMaWNlbnNlOiBNSVQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIGRvY3VtZW50RWxlbWVudCkge1xuICAgIC8vIEVuYWJsZSBzdHJpY3QgbW9kZVxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gRm9ybSB0aGUgc3R5bGUgb24gdGhlIGZseSB0byByZXN1bHQgaW4gc21hbGxlciBtaW5pZmllZCBmaWxlXG4gICAgbGV0IGltcG9ydGFudCA9IFwiIWltcG9ydGFudDtcIjtcbiAgICBsZXQgc3R5bGUgPSBcInBvc2l0aW9uOmFic29sdXRlXCIgKyBpbXBvcnRhbnQgKyBcInZpc2liaWxpdHk6aGlkZGVuXCIgKyBpbXBvcnRhbnQgKyBcIndpZHRoOjFlbVwiICsgaW1wb3J0YW50ICsgXCJmb250LXNpemU6MWVtXCIgKyBpbXBvcnRhbnQgKyBcInBhZGRpbmc6MFwiICsgaW1wb3J0YW50O1xuXG4gICAgd2luZG93LmdldEVtUGl4ZWxzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICBsZXQgZXh0cmFCb2R5O1xuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRW11bGF0ZSB0aGUgZG9jdW1lbnRFbGVtZW50IHRvIGdldCByZW0gdmFsdWUgKGRvY3VtZW50RWxlbWVudCBkb2VzIG5vdCB3b3JrIGluIElFNi03KVxuICAgICAgICAgICAgZWxlbWVudCA9IGV4dHJhQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xuICAgICAgICAgICAgZXh0cmFCb2R5LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudDtcbiAgICAgICAgICAgIGRvY3VtZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFCb2R5LCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgc3R5bGUgYSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgbGV0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgIHRlc3RFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjbGllbnQgd2lkdGggb2YgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdmFsdWUgPSB0ZXN0RWxlbWVudC5jbGllbnRXaWR0aDtcblxuICAgICAgICBpZiAoZXh0cmFCb2R5KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGV4dHJhIGJvZHkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGV4dHJhQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIGVtIHZhbHVlIGluIHBpeGVsc1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn0oZG9jdW1lbnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpO1xuXG5cbi8vUmVsb2FkIGFsaWdubWVudHMgZm9yIEphbFZpZXcgZm9yIHRoZSBnZW5USFJFQURFUiB0YWJsZVxuZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5mdW5jdGlvbiBidWlsZE1vZGVsKGFsblVSSSkge1xuXG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIGxldCBtb2Rfa2V5ID0gcmFjdGl2ZS5nZXQoJ21vZGVsbGVyX2tleScpO1xuICBpZihtb2Rfa2V5ID09PSAnTScrJ08nKydEJysnRScrJ0wnKydJJysnUicrJ0EnKydOJysnSicrJ0UnKVxuICB7XG4gICAgd2luZG93Lm9wZW4oXCIuLlwiK2FwcF9wYXRoK1wiL21vZGVsL3Bvc3Q/YWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD02NzAsaGVpZ2h0PTcwMFwiKTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBhbGVydCgnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBNJysnTycrJ0QnKydFJysnTCcrJ0wnKydFJysnUiBMaWNlbmNlIEtleScpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvbWFpbi5qcyIsImltcG9ydCB7IHNlbmRfam9iIH0gZnJvbSAnLi4vY29tbW9uL2luZGV4LmpzJztcbmltcG9ydCB7IGlzSW5BcnJheSB9IGZyb20gJy4uL2NvbW1vbi9pbmRleC5qcyc7XG5cblxuLy9UYWtlcyB0aGUgZGF0YSBuZWVkZWQgdG8gdmVyaWZ5IHRoZSBpbnB1dCBmb3JtIGRhdGEsIGVpdGhlciB0aGUgbWFpbiBmb3JtXG4vL29yIHRoZSBzdWJtaXNzb24gd2lkZ2V0IHZlcmlmaWVzIHRoYXQgZGF0YSBhbmQgdGhlbiBwb3N0cyBpdCB0byB0aGUgYmFja2VuZC5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIHBzaXByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkLCBwZ2VudGhyZWFkZXJfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhY3RpdmVfaW5zdGFuY2UpXG57XG4gIC8qdmVyaWZ5IHRoYXQgZXZlcnl0aGluZyBoZXJlIGlzIG9rKi9cbiAgbGV0IGVycm9yX21lc3NhZ2U9bnVsbDtcbiAgbGV0IGpvYl9zdHJpbmcgPSAnJztcbiAgLy9lcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCwgW3BzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCwgbWVtc2F0c3ZtX2NoZWNrZWRdKTtcblxuICBlcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkXSk7XG4gIGlmKGVycm9yX21lc3NhZ2UubGVuZ3RoID4gMClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdmb3JtX2Vycm9yJywgZXJyb3JfbWVzc2FnZSk7XG4gICAgYWxlcnQoXCJGT1JNIEVSUk9SOlwiK2Vycm9yX21lc3NhZ2UpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vaW5pdGlhbGlzZSB0aGUgcGFnZVxuICAgIGxldCByZXNwb25zZSA9IHRydWU7XG4gICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7XG4gICAgLy9Qb3N0IHRoZSBqb2JzIGFuZCBpbnRpYWxpc2UgdGhlIGFubm90YXRpb25zIGZvciBlYWNoIGpvYlxuICAgIC8vV2UgYWxzbyBkb24ndCByZWR1bmRhbnRseSBzZW5kIGV4dHJhIHBzaXByZWQgZXRjLi4gam9ic1xuICAgIC8vYnl0IGRvaW5nIHRoZXNlIHRlc3QgaW4gYSBzcGVjaWZpYyBvcmRlclxuICAgIGlmKHBnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBnZW50aHJlYWRlcixcIik7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoZGlzb3ByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkaXNvcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgnZGlzb3ByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICAgIHBzaXByZWRfY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZihwc2lwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwicHNpcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYobWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtc2F0c3ZtLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuc2xpY2UoMCwgLTEpO1xuICAgIHJlc3BvbnNlID0gc2VuZF9qb2IocmFjdGl2ZSwgam9iX3N0cmluZywgc2VxLCBuYW1lLCBlbWFpbCwgcmFjdGl2ZV9pbnN0YW5jZSwgc3VibWl0X3VybCwgdGltZXNfdXJsKTtcbiAgICAvL3NldCB2aXNpYmlsaXR5IGFuZCByZW5kZXIgcGFuZWwgb25jZVxuICAgIGlmIChwc2lwcmVkX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwc2lwcmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCgpO1xuICAgICAgLy8gcGFyc2Ugc2VxdWVuY2UgYW5kIG1ha2Ugc2VxIHBsb3RcbiAgICB9XG4gICAgZWxzZSBpZihkaXNvcHJlZF9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAnZGlzb3ByZWRfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuICAgIGVsc2UgaWYobWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdtZW1zYXRzdm1fYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuICAgIGVsc2UgaWYocGdlbnRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwZ2VudGhyZWFkZXJfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKCk7XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2Zvcm0oc2VxLCBqb2JfbmFtZSwgZW1haWwsIGNoZWNrZWRfYXJyYXkpXG57XG4gIGxldCBlcnJvcl9tZXNzYWdlID0gXCJcIjtcbiAgaWYoISAvXltcXHgwMC1cXHg3Rl0rJC8udGVzdChqb2JfbmFtZSkpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiUGxlYXNlIHJlc3RyaWN0IEpvYiBOYW1lcyB0byB2YWxpZCBsZXR0ZXJzIG51bWJlcnMgYW5kIGJhc2ljIHB1bmN0dWF0aW9uPGJyIC8+XCI7XG4gIH1cblxuICAvKiBsZW5ndGggY2hlY2tzICovXG4gIGlmKHNlcS5sZW5ndGggPiAxNTAwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIGxvbmcgdG8gcHJvY2VzczxiciAvPlwiO1xuICB9XG4gIGlmKHNlcS5sZW5ndGggPCAzMClcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGlzIHRvbyBzaG9ydCB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cblxuICAvKiBudWNsZW90aWRlIGNoZWNrcyAqL1xuICBsZXQgbnVjbGVvdGlkZV9jb3VudCA9IChzZXEubWF0Y2goL0F8VHxDfEd8VXxOfGF8dHxjfGd8dXxuL2cpfHxbXSkubGVuZ3RoO1xuICBpZigobnVjbGVvdGlkZV9jb3VudC9zZXEubGVuZ3RoKSA+IDAuOTUpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBhcHBlYXJzIHRvIGJlIG51Y2xlb3RpZGUgc2VxdWVuY2UuIFRoaXMgc2VydmljZSByZXF1aXJlcyBwcm90ZWluIHNlcXVlbmNlIGFzIGlucHV0PGJyIC8+XCI7XG4gIH1cbiAgaWYoL1teQUNERUZHSElLTE1OUFFSU1RWV1lYXy1dKy9pLnRlc3Qoc2VxKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczxiciAvPlwiO1xuICB9XG5cbiAgaWYoaXNJbkFycmF5KHRydWUsIGNoZWNrZWRfYXJyYXkpID09PSBmYWxzZSkge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuYWx5c2lzIHByb2dyYW1cIjtcbiAgfVxuICByZXR1cm4oZXJyb3JfbWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvZm9ybXMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9