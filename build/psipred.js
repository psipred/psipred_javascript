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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = send_request;
/* harmony export (immutable) */ __webpack_exports__["d"] = send_job;
/* harmony export (immutable) */ __webpack_exports__["c"] = get_previous_data;
/* harmony export (immutable) */ __webpack_exports__["b"] = process_file;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__ = __webpack_require__(2);



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

//given a job name prep all the form elements and send an http request to the
//backend
function send_job(ractive, job_name, seq, name, email, submit_url, times_url) {
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
      ractive.set(job_name + '_time', upper_name + " jobs typically take " + times[job_name] + " seconds");
    } else {
      ractive.set(job_name + '_time', "Unable to retrieve average time for " + upper_name + " jobs.");
    }
    for (var k in response_data) {
      if (k == "UUID") {
        ractive.set('batch_uuid', response_data[k]);
        ractive.fire('poll_trigger', job_name);
      }
    }
  } else {
    return null;
  }
  return true;
}

//utility function that gets the sequence from a previous submission is the
//page was loaded with a UUID
function get_previous_data(uuid, submit_url, file_url, ractive) {
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

//polls the backend to get results and then parses those results to display
//them on the page
function process_file(url_stub, path, ctl, zip, ractive) {
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["a" /* parse_ss2 */])(ractive, file);
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
        topo_regions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["b" /* get_memsat_ranges */])(/Topology:\s+(.+?)\n/, file);
        signal_regions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["b" /* get_memsat_ranges */])(/Signal\speptide:\s+(.+)\n/, file);
        reentrant_regions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["b" /* get_memsat_ranges */])(/Re-entrant\shelices:\s+(.+?)\n/, file);
        terminal = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["b" /* get_memsat_ranges */])(/N-terminal:\s+(.+?)\n/, file);
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

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = isInArray;
/* harmony export (immutable) */ __webpack_exports__["b"] = draw_empty_annotation_panel;
/* harmony export (immutable) */ __webpack_exports__["a"] = getUrlVars;
//given and array return whether and element is present
function isInArray(value, array) {
  if (array.indexOf(value) > -1) {
    return true;
  } else {
    return false;
  }
}

//when a results page is instantiated and before some annotations have come back
//we draw and empty annotation panel
function draw_empty_annotation_panel(ractive) {

  let seq = ractive.get('sequence');
  let residues = seq.split('');
  let annotations = [];
  residues.forEach(function (res) {
    annotations.push({ 'res': res });
  });
  ractive.set('annotations', annotations);
  biod3.annotationGrid(ractive.get('annotations'), { parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
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

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = get_memsat_ranges;
/* harmony export (immutable) */ __webpack_exports__["a"] = parse_ss2;

// for a given memsat data files extract coordinate ranges given some regex
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

function parse_ss2(ractive, file) {
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
  return annotations;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_common_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__ = __webpack_require__(5);
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
let uuid_match = uuid_regex.exec(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["a" /* getUrlVars */])().uuid);

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

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);

  let interval = setInterval(function () {
    let batch = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["a" /* send_request */])(url, "GET", {});
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
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'horiz', zip, ractive);
              ractive.set("psipred_waiting_message", '');
              downloads_info.psipred.horiz = '<a href="' + file_url + result_dict.data_path + '">Horiz Format Output</a><br />';
              ractive.set("psipred_waiting_icon", '');
              ractive.set("psipred_time", '');
            }
            let ss2_match = ss2_regex.exec(result_dict.data_path);
            if (ss2_match) {
              downloads_info.psipred.ss2 = '<a href="' + file_url + result_dict.data_path + '">SS2 Format Output</a><br />';
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'ss2', zip, ractive);
            }
          }
          //disopred files
          if (result_dict.name === 'diso_format') {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'pbdat', zip, ractive);
            ractive.set("disopred_waiting_message", '');
            downloads_info.disopred.pbdat = '<a href="' + file_url + result_dict.data_path + '">PBDAT Format Output</a><br />';
            ractive.set("disopred_waiting_icon", '');
            ractive.set("disopred_time", '');
          }
          if (result_dict.name === 'diso_combine') {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'comb', zip, ractive);
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
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'memsatdata', zip, ractive);
              downloads_info.memsatsvm.data = '<a href="' + file_url + result_dict.data_path + '">Memsat Output</a><br />';
            }
          }
          if (result_dict.name === 'sort_presult') {
            ractive.set("pgenthreader_waiting_message", '');
            ractive.set("pgenthreader_waiting_icon", '');
            ractive.set("pgenthreader_time", '');
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* process_file */])(file_url, result_dict.data_path, 'presult', zip, ractive);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["a" /* clear_settings */])();
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, subsequence, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked);
  //write new annotation diagram
  //submit subsection
  event.original.preventDefault();
});

// Here having set up ractive and the functions we need we then check
// if we were provided a UUID, If the page is loaded with a UUID rather than a
// form submit.
//TODO: Handle loading that page with use the MEMSAT and DISOPRED UUID
//
if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["a" /* getUrlVars */])().uuid && uuid_match) {
  console.log('Caught an incoming UUID');
  seq_observer.cancel();
  ractive.set('results_visible', null); // should make a generic one visible until results arrive.
  ractive.set('results_visible', 2);
  ractive.set("batch_uuid", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["a" /* getUrlVars */])().uuid);
  let previous_data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["c" /* get_previous_data */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["a" /* getUrlVars */])().uuid, submit_url, file_url, ractive);
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
// New Pannel functions
//
///////////////////////////////////////////////////////////////////////////////


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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = verify_and_send_form;
/* unused harmony export verify_form */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_common_index_js__ = __webpack_require__(1);




//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked) {
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
    response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["d" /* send_job */])(ractive, job_string, seq, name, email, submit_url, times_url);
    //set visibility and render panel once
    if (psipred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('psipred_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
      // parse sequence and make seq plot
    } else if (disopred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('disopred_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (memsatsvm_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('memsatsvm_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (pgenthreader_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('pgenthreader_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
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

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["c" /* isInArray */])(true, checked_array) === false) {
    error_message = error_message + "You must select at least one analysis program";
  }
  return error_message;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = clear_settings;
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjA1OTY2ZTcwMmY3NGJhNzljY2MiLCJ3ZWJwYWNrOi8vLy4vbGliL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9jb21tb24vY29tbW9uX2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Zvcm1zL2Zvcm1zX2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbInNlbmRfcmVxdWVzdCIsInVybCIsInR5cGUiLCJzZW5kX2RhdGEiLCJjb25zb2xlIiwibG9nIiwicmVzcG9uc2UiLCIkIiwiYWpheCIsImRhdGEiLCJjYWNoZSIsImNvbnRlbnRUeXBlIiwicHJvY2Vzc0RhdGEiLCJhc3luYyIsImRhdGFUeXBlIiwic3VjY2VzcyIsImFsZXJ0IiwiZXJyb3IiLCJyZXNwb25zZVRleHQiLCJyZXNwb25zZUpTT04iLCJzZW5kX2pvYiIsInJhY3RpdmUiLCJqb2JfbmFtZSIsInNlcSIsIm5hbWUiLCJlbWFpbCIsInN1Ym1pdF91cmwiLCJ0aW1lc191cmwiLCJmaWxlIiwidXBwZXJfbmFtZSIsInRvVXBwZXJDYXNlIiwiQmxvYiIsImUiLCJmZCIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicmVzcG9uc2VfZGF0YSIsInRpbWVzIiwic2V0IiwiayIsImZpcmUiLCJnZXRfcHJldmlvdXNfZGF0YSIsInV1aWQiLCJmaWxlX3VybCIsImdldCIsInN1Ym1pc3Npb25fcmVzcG9uc2UiLCJnZXRfdGV4dCIsInN1Ym1pc3Npb25zIiwiaW5wdXRfZmlsZSIsImpvYnMiLCJmb3JFYWNoIiwic3VibWlzc2lvbiIsInNsaWNlIiwic3VibWlzc2lvbl9uYW1lIiwicHJvY2Vzc19maWxlIiwidXJsX3N0dWIiLCJwYXRoIiwiY3RsIiwiemlwIiwicGF0aF9iaXRzIiwic3BsaXQiLCJmb2xkZXIiLCJiaW9kMyIsInBzaXByZWQiLCJwYXJlbnQiLCJtYXJnaW5fc2NhbGVyIiwicGFyc2Vfc3MyIiwiYW5ub3RhdGlvbnMiLCJsaW5lcyIsInNoaWZ0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImxpbmUiLCJpIiwiZW50cmllcyIsImRpc29wcmVkIiwiYW5ub3RhdGlvbkdyaWQiLCJkZWJ1ZyIsImNvbnRhaW5lcl93aWR0aCIsIndpZHRoIiwiaGVpZ2h0IiwiY29udGFpbmVyX2hlaWdodCIsInByZWNpc2lvbiIsInBvcyIsImdlbmVyaWN4eUxpbmVDaGFydCIsImNoYXJ0VHlwZSIsInlfY3V0b2ZmIiwidG9wb19yZWdpb25zIiwiZ2V0X21lbXNhdF9yYW5nZXMiLCJzaWduYWxfcmVnaW9ucyIsInJlZW50cmFudF9yZWdpb25zIiwidGVybWluYWwiLCJjb2lsX3R5cGUiLCJ0bXBfYW5ubyIsIkFycmF5IiwicHJldl9lbmQiLCJyZWdpb24iLCJmaWxsIiwiYW5ubyIsIm1lbXNhdCIsImFubl9saXN0IiwiT2JqZWN0Iiwia2V5cyIsInBzZXVkb190YWJsZSIsInRvTG93ZXJDYXNlIiwicGRiIiwic3Vic3RyaW5nIiwiYWxuIiwiYW5uIiwiSlNPTiIsInN0cmluZ2lmeSIsImlzSW5BcnJheSIsInZhbHVlIiwiYXJyYXkiLCJpbmRleE9mIiwiZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIiwicmVzaWR1ZXMiLCJyZXMiLCJwdXNoIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJwYXJ0cyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJtIiwia2V5IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbXBvcnRhbnQiLCJzdHlsZSIsImdldEVtUGl4ZWxzIiwiZWxlbWVudCIsImV4dHJhQm9keSIsImNyZWF0ZUVsZW1lbnQiLCJjc3NUZXh0IiwiaW5zZXJ0QmVmb3JlIiwiYm9keSIsInRlc3RFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwicmVnZXgiLCJtYXRjaCIsImV4ZWMiLCJpbmNsdWRlcyIsInJlZ2lvbnMiLCJwYXJzZUludCIsInNzIiwiY2xpcGJvYXJkIiwiQ2xpcGJvYXJkIiwiSlNaaXAiLCJvbiIsImVuZHBvaW50c191cmwiLCJnZWFyc19zdmciLCJtYWluX3VybCIsImFwcF9wYXRoIiwiaG9zdG5hbWUiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsInJlc3VsdHNfdmlzaWJsZSIsInJlc3VsdHNfcGFuZWxfdmlzaWJsZSIsInN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUiLCJtb2RlbGxlcl9rZXkiLCJwc2lwcmVkX2NoZWNrZWQiLCJwc2lwcmVkX2J1dHRvbiIsImRpc29wcmVkX2NoZWNrZWQiLCJkaXNvcHJlZF9idXR0b24iLCJtZW1zYXRzdm1fY2hlY2tlZCIsIm1lbXNhdHN2bV9idXR0b24iLCJwZ2VudGhyZWFkZXJfY2hlY2tlZCIsInBnZW50aHJlYWRlcl9idXR0b24iLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfam9iIiwiZGlzb3ByZWRfam9iIiwibWVtc2F0c3ZtX2pvYiIsInBnZW50aHJlYWRlcl9qb2IiLCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZSIsInBzaXByZWRfd2FpdGluZ19pY29uIiwicHNpcHJlZF90aW1lIiwicHNpcHJlZF9ob3JpeiIsImRpc29wcmVkX3dhaXRpbmdfbWVzc2FnZSIsImRpc29wcmVkX3dhaXRpbmdfaWNvbiIsImRpc29wcmVkX3RpbWUiLCJkaXNvX3ByZWNpc2lvbiIsIm1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2UiLCJtZW1zYXRzdm1fd2FpdGluZ19pY29uIiwibWVtc2F0c3ZtX3RpbWUiLCJtZW1zYXRzdm1fc2NoZW1hdGljIiwibWVtc2F0c3ZtX2NhcnRvb24iLCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlIiwicGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbiIsInBnZW50aHJlYWRlcl90aW1lIiwicGdlbl90YWJsZSIsInBnZW5fYW5uX3NldCIsInNlcXVlbmNlIiwic2VxdWVuY2VfbGVuZ3RoIiwic3Vic2VxdWVuY2Vfc3RhcnQiLCJzdWJzZXF1ZW5jZV9zdG9wIiwiYmF0Y2hfdXVpZCIsInV1aWRfcmVnZXgiLCJ1dWlkX21hdGNoIiwic2VxX29ic2VydmVyIiwib2JzZXJ2ZSIsIm5ld1ZhbHVlIiwib2xkVmFsdWUiLCJpbml0IiwiZGVmZXIiLCJzZXFfbGVuZ3RoIiwic2VxX3N0YXJ0Iiwic2VxX3N0b3AiLCJqb2JfdHlwZSIsImhvcml6X3JlZ2V4Iiwic3MyX3JlZ2V4IiwibWVtc2F0X2NhcnRvb25fcmVnZXgiLCJtZW1zYXRfc2NoZW1hdGljX3JlZ2V4IiwibWVtc2F0X2RhdGFfcmVnZXgiLCJpbWFnZV9yZWdleCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiYmF0Y2giLCJkb3dubG9hZHNfaW5mbyIsInN0YXRlIiwiaGVhZGVyIiwibWVtc2F0c3ZtIiwicGdlbnRocmVhZGVyIiwicmVzdWx0cyIsInJlc3VsdF9kaWN0IiwiYW5uX3NldCIsInRtcCIsImRhdGFfcGF0aCIsInN1YnN0ciIsImxhc3RJbmRleE9mIiwiaWQiLCJob3JpeiIsInNzMl9tYXRjaCIsInNzMiIsInBiZGF0IiwiY29tYiIsInNjaGVtZV9tYXRjaCIsInNjaGVtYXRpYyIsImNhcnRvb25fbWF0Y2giLCJjYXJ0b29uIiwibWVtc2F0X21hdGNoIiwidGFibGUiLCJhbGlnbiIsImRvd25sb2Fkc19zdHJpbmciLCJjb25jYXQiLCJjbGVhckludGVydmFsIiwic3VibWlzc2lvbl9tZXNzYWdlIiwibGFzdF9tZXNzYWdlIiwiY29udGV4dCIsImdlbmVyYXRlQXN5bmMiLCJ0aGVuIiwiYmxvYiIsInNhdmVBcyIsImV2ZW50IiwidmVyaWZ5X2FuZF9zZW5kX2Zvcm0iLCJvcmlnaW5hbCIsInByZXZlbnREZWZhdWx0Iiwic3RhcnQiLCJzdG9wIiwic3Vic2VxdWVuY2UiLCJjbGVhcl9zZXR0aW5ncyIsImNhbmNlbCIsInByZXZpb3VzX2RhdGEiLCJsb2FkTmV3QWxpZ25tZW50IiwiYWxuVVJJIiwiYW5uVVJJIiwidGl0bGUiLCJvcGVuIiwiYnVpbGRNb2RlbCIsIm1vZF9rZXkiLCJlcnJvcl9tZXNzYWdlIiwiam9iX3N0cmluZyIsInZlcmlmeV9mb3JtIiwiY2hlY2tlZF9hcnJheSIsInRlc3QiLCJudWNsZW90aWRlX2NvdW50IiwiY2xlYXJTZWxlY3Rpb24iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNoRUE7QUFDQTs7QUFHQTtBQUNPLFNBQVNBLFlBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCQyxJQUEzQixFQUFpQ0MsU0FBakMsRUFDUDtBQUNFQyxVQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDQUQsVUFBUUMsR0FBUixDQUFZSixHQUFaO0FBQ0FHLFVBQVFDLEdBQVIsQ0FBWUgsSUFBWjs7QUFFQSxNQUFJSSxXQUFXLElBQWY7QUFDQUMsSUFBRUMsSUFBRixDQUFPO0FBQ0xOLFVBQU1BLElBREQ7QUFFTE8sVUFBTU4sU0FGRDtBQUdMTyxXQUFPLEtBSEY7QUFJTEMsaUJBQWEsS0FKUjtBQUtMQyxpQkFBYSxLQUxSO0FBTUxDLFdBQVMsS0FOSjtB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QUosRUFBTjtBQUNELEMiLCJmaWxlIjoicHNpcHJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMDU5NjZlNzAyZjc0YmE3OWNjYyIsImltcG9ydCB7IGdldF9tZW1zYXRfcmFuZ2VzIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX3NzMiB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5leHBvcnQgZnVuY3Rpb24gc2VuZF9yZXF1ZXN0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuICBjb25zb2xlLmxvZygnU2VuZGluZyBVUkkgcmVxdWVzdCcpO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuICBjb25zb2xlLmxvZyh0eXBlKTtcblxuICB2YXIgcmVzcG9uc2UgPSBudWxsO1xuICAkLmFqYXgoe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogc2VuZF9kYXRhLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGFzeW5jOiAgIGZhbHNlLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gc2VuZCBkYXRhXCIpO31cbiAgICAgIHJlc3BvbnNlPWRhdGE7XG4gICAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSlcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChcIlNlbmRpbmcgSm9iIHRvIFwiK3VybCtcIiBGYWlsZWQuIFwiK2Vycm9yLnJlc3BvbnNlVGV4dCtcIi4gVGhlIEJhY2tlbmQgcHJvY2Vzc2luZyBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUuIFNvbWV0aGluZyBDYXRhc3Ryb3BoaWMgaGFzIGdvbmUgd3JvbmcuIFBsZWFzZSBjb250YWN0IHBzaXByZWRAY3MudWNsLmFjLnVrXCIpOyByZXR1cm4gbnVsbDt9XG4gIH0pLnJlc3BvbnNlSlNPTjtcbiAgcmV0dXJuKHJlc3BvbnNlKTtcbn1cblxuLy9naXZlbiBhIGpvYiBuYW1lIHByZXAgYWxsIHRoZSBmb3JtIGVsZW1lbnRzIGFuZCBzZW5kIGFuIGh0dHAgcmVxdWVzdCB0byB0aGVcbi8vYmFja2VuZFxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRfam9iKHJhY3RpdmUsIGpvYl9uYW1lLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwpXG57XG4gIC8vYWxlcnQoc2VxKTtcbiAgY29uc29sZS5sb2coXCJTZW5kaW5nIGZvcm0gZGF0YVwiKTtcbiAgdmFyIGZpbGUgPSBudWxsO1xuICBsZXQgdXBwZXJfbmFtZSA9IGpvYl9uYW1lLnRvVXBwZXJDYXNlKCk7XG4gIHRyeVxuICB7XG4gICAgZmlsZSA9IG5ldyBCbG9iKFtzZXFdKTtcbiAgfSBjYXRjaCAoZSlcbiAge1xuICAgIGFsZXJ0KGUpO1xuICB9XG4gIGxldCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICBmZC5hcHBlbmQoXCJpbnB1dF9kYXRhXCIsIGZpbGUsICdpbnB1dC50eHQnKTtcbiAgZmQuYXBwZW5kKFwiam9iXCIsam9iX25hbWUpO1xuICBmZC5hcHBlbmQoXCJzdWJtaXNzaW9uX25hbWVcIixuYW1lKTtcbiAgZmQuYXBwZW5kKFwiZW1haWxcIiwgZW1haWwpO1xuXG4gIGxldCByZXNwb25zZV9kYXRhID0gc2VuZF9yZXF1ZXN0KHN1Ym1pdF91cmwsIFwiUE9TVFwiLCBmZCk7XG4gIGlmKHJlc3BvbnNlX2RhdGEgIT09IG51bGwpXG4gIHtcbiAgICBsZXQgdGltZXMgPSBzZW5kX3JlcXVlc3QodGltZXNfdXJsLCdHRVQnLHt9KTtcbiAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHRpbWVzKSk7XG4gICAgaWYoam9iX25hbWUgaW4gdGltZXMpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgdXBwZXJfbmFtZStcIiBqb2JzIHR5cGljYWxseSB0YWtlIFwiK3RpbWVzW2pvYl9uYW1lXStcIiBzZWNvbmRzXCIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgXCJVbmFibGUgdG8gcmV0cmlldmUgYXZlcmFnZSB0aW1lIGZvciBcIit1cHBlcl9uYW1lK1wiIGpvYnMuXCIpO1xuICAgIH1cbiAgICBmb3IodmFyIGsgaW4gcmVzcG9uc2VfZGF0YSlcbiAgICB7XG4gICAgICBpZihrID09IFwiVVVJRFwiKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsIHJlc3BvbnNlX2RhdGFba10pO1xuICAgICAgICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsIGpvYl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIHNlcXVlbmNlIGZyb20gYSBwcmV2aW91cyBzdWJtaXNzaW9uIGlzIHRoZVxuLy9wYWdlIHdhcyBsb2FkZWQgd2l0aCBhIFVVSURcbmV4cG9ydCBmdW5jdGlvbiBnZXRfcHJldmlvdXNfZGF0YSh1dWlkLCBzdWJtaXRfdXJsLCBmaWxlX3VybCwgcmFjdGl2ZSlcbntcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdGluZyBkZXRhaWxzIGdpdmVuIFVSSScpO1xuICAgIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgLy9hbGVydCh1cmwpO1xuICAgIGxldCBzdWJtaXNzaW9uX3Jlc3BvbnNlID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGlmKCEgc3VibWlzc2lvbl9yZXNwb25zZSl7YWxlcnQoXCJOTyBTVUJNSVNTSU9OIERBVEFcIik7fVxuICAgIGxldCBzZXEgPSBnZXRfdGV4dChmaWxlX3VybCtzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmlucHV0X2ZpbGUsIFwiR0VUXCIsIHt9KTtcbiAgICBsZXQgam9icyA9ICcnO1xuICAgIHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihzdWJtaXNzaW9uKXtcbiAgICAgIGpvYnMgKz0gc3VibWlzc2lvbi5qb2JfbmFtZStcIixcIjtcbiAgICB9KTtcbiAgICBqb2JzID0gam9icy5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuKHsnc2VxJzogc2VxLCAnZW1haWwnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmVtYWlsLCAnbmFtZSc6IHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnNbMF0uc3VibWlzc2lvbl9uYW1lLCAnam9icyc6IGpvYnN9KTtcbn1cblxuXG4vL2dldCB0ZXh0IGNvbnRlbnRzIGZyb20gYSByZXN1bHQgVVJJXG5mdW5jdGlvbiBnZXRfdGV4dCh1cmwsIHR5cGUsIHNlbmRfZGF0YSlcbntcblxuIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgLy9kYXRhVHlwZTogXCJ0eHRcIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gcmVxdWVzdCBpbnB1dCBkYXRhIHRleHRcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiR2V0dGluZ3MgcmVzdWx0cyBmYWlsZWQuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSBpcyBub3QgYXZhaWxhYmxlLiBTb21ldGhpbmcgQ2F0YXN0cm9waGljIGhhcyBnb25lIHdyb25nLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTt9XG4gIH0pO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG5cbi8vcG9sbHMgdGhlIGJhY2tlbmQgdG8gZ2V0IHJlc3VsdHMgYW5kIHRoZW4gcGFyc2VzIHRob3NlIHJlc3VsdHMgdG8gZGlzcGxheVxuLy90aGVtIG9uIHRoZSBwYWdlXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc19maWxlKHVybF9zdHViLCBwYXRoLCBjdGwsIHppcCwgcmFjdGl2ZSlcbntcbiAgbGV0IHVybCA9IHVybF9zdHViICsgcGF0aDtcbiAgbGV0IHBhdGhfYml0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAvL2dldCBhIHJlc3VsdHMgZmlsZSBhbmQgcHVzaCB0aGUgZGF0YSBpbiB0byB0aGUgYmlvM2Qgb2JqZWN0XG4gIC8vYWxlcnQodXJsKTtcbiAgY29uc29sZS5sb2coJ0dldHRpbmcgUmVzdWx0cyBGaWxlIGFuZCBwcm9jZXNzaW5nJyk7XG4gIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgYXN5bmM6ICAgdHJ1ZSxcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGZpbGUpXG4gICAge1xuICAgICAgemlwLmZvbGRlcihwYXRoX2JpdHNbMV0pLmZpbGUocGF0aF9iaXRzWzJdLCBmaWxlKTtcbiAgICAgIGlmKGN0bCA9PT0gJ2hvcml6JylcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLCBmaWxlKTtcbiAgICAgICAgYmlvZDMucHNpcHJlZChmaWxlLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdzczInKVxuICAgICAge1xuICAgICAgICBwYXJzZV9zczIocmFjdGl2ZSwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwYmRhdCcpXG4gICAgICB7XG4gICAgICAgIC8vYWxlcnQoJ1BCREFUIHByb2Nlc3MnKTtcbiAgICAgICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICAgICAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgaWYoYW5ub3RhdGlvbnMubGVuZ3RoID09IGxpbmVzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgIGlmKGVudHJpZXNbM10gPT09ICctJyl7YW5ub3RhdGlvbnNbaV0uZGlzb3ByZWQgPSAnRCc7fVxuICAgICAgICAgICAgaWYoZW50cmllc1szXSA9PT0gJ14nKXthbm5vdGF0aW9uc1tpXS5kaXNvcHJlZCA9ICdQQic7fVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdjb21iJylcbiAgICAgIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IFtdO1xuICAgICAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTtcbiAgICAgICAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgcHJlY2lzaW9uW2ldID0ge307XG4gICAgICAgICAgcHJlY2lzaW9uW2ldLnBvcyA9IGVudHJpZXNbMV07XG4gICAgICAgICAgcHJlY2lzaW9uW2ldLnByZWNpc2lvbiA9IGVudHJpZXNbNF07XG4gICAgICAgIH0pO1xuICAgICAgICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nLCBwcmVjaXNpb24pO1xuICAgICAgICBiaW9kMy5nZW5lcmljeHlMaW5lQ2hhcnQocHJlY2lzaW9uLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnbWVtc2F0ZGF0YScpXG4gICAgICB7XG4gICAgICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgICAgICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gICAgICAgIHRvcG9fcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9Ub3BvbG9neTpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgc2lnbmFsX3JlZ2lvbnMgPSBnZXRfbWVtc2F0X3JhbmdlcygvU2lnbmFsXFxzcGVwdGlkZTpcXHMrKC4rKVxcbi8sIGZpbGUpO1xuICAgICAgICByZWVudHJhbnRfcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9SZS1lbnRyYW50XFxzaGVsaWNlczpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgdGVybWluYWwgPSBnZXRfbWVtc2F0X3JhbmdlcygvTi10ZXJtaW5hbDpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzaWduYWxfcmVnaW9ucyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlZW50cmFudF9yZWdpb25zKTtcbiAgICAgICAgY29pbF90eXBlID0gJ0NZJztcbiAgICAgICAgaWYodGVybWluYWwgPT09ICdvdXQnKVxuICAgICAgICB7XG4gICAgICAgICAgY29pbF90eXBlID0gJ0VDJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG1wX2Fubm8gPSBuZXcgQXJyYXkoc2VxLmxlbmd0aCk7XG4gICAgICAgIGlmKHRvcG9fcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKVxuICAgICAgICB7XG4gICAgICAgICAgbGV0IHByZXZfZW5kID0gMDtcbiAgICAgICAgICB0b3BvX3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdUTScsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgICAgaWYocHJldl9lbmQgPiAwKXtwcmV2X2VuZCAtPSAxO31cbiAgICAgICAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbChjb2lsX3R5cGUsIHByZXZfZW5kLCByZWdpb25bMF0pO1xuICAgICAgICAgICAgaWYoY29pbF90eXBlID09PSAnRUMnKXsgY29pbF90eXBlID0gJ0NZJzt9ZWxzZXtjb2lsX3R5cGUgPSAnRUMnO31cbiAgICAgICAgICAgIHByZXZfZW5kID0gcmVnaW9uWzFdKzI7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKGNvaWxfdHlwZSwgcHJldl9lbmQtMSwgc2VxLmxlbmd0aCk7XG5cbiAgICAgICAgfVxuICAgICAgICAvL3NpZ25hbF9yZWdpb25zID0gW1s3MCw4M10sIFsxMDIsMTE3XV07XG4gICAgICAgIGlmKHNpZ25hbF9yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpe1xuICAgICAgICAgIHNpZ25hbF9yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgICAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnUycsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVlbnRyYW50X3JlZ2lvbnMgPSBbWzQwLDUwXSwgWzIwMCwyMThdXTtcbiAgICAgICAgaWYocmVlbnRyYW50X3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJyl7XG4gICAgICAgICAgcmVlbnRyYW50X3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdSSCcsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRtcF9hbm5vLmZvckVhY2goZnVuY3Rpb24oYW5ubywgaSl7XG4gICAgICAgICAgYW5ub3RhdGlvbnNbaV0ubWVtc2F0ID0gYW5ubztcbiAgICAgICAgfSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgICAgYmlvZDMuYW5ub3RhdGlvbkdyaWQoYW5ub3RhdGlvbnMsIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3ByZXN1bHQnKVxuICAgICAge1xuXG4gICAgICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgICAgICBsZXQgYW5uX2xpc3QgPSByYWN0aXZlLmdldCgncGdlbl9hbm5fc2V0Jyk7XG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGFubl9saXN0KS5sZW5ndGggPiAwKXtcbiAgICAgICAgbGV0IHBzZXVkb190YWJsZSA9ICc8dGFibGUgY2xhc3M9XCJzbWFsbC10YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkXCI+XFxuJztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dHI+PHRoPkNvbmYuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5OZXQgU2NvcmU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPnAtdmFsdWU8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlBhaXJFPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Tb2x2RTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxuIFNjb3JlPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gTGVuZ3RoPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TdHIgTGVuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TZXEgTGVuPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Gb2xkPC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggU0NPUDwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+U0VBUkNIIENBVEg8L3RoPic7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlBEQlNVTTwvdGg+JztcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxpZ25tZW50PC90aD4nO1xuICAgICAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5NT0RFTDwvdGg+JztcblxuICAgICAgICAvLyBpZiBNT0RFTExFUiBUSElOR1lcbiAgICAgICAgcHNldWRvX3RhYmxlICs9ICc8L3RyPjx0Ym9keVwiPlxcbic7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgICAgaWYobGluZS5sZW5ndGggPT09IDApe3JldHVybjt9XG4gICAgICAgICAgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICBpZihlbnRyaWVzWzldK1wiX1wiK2kgaW4gYW5uX2xpc3QpXG4gICAgICAgICAge1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0cj5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQgY2xhc3M9J1wiK2VudHJpZXNbMF0udG9Mb3dlckNhc2UoKStcIic+XCIrZW50cmllc1swXStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbMV0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzJdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1szXStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNF0rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzVdK1wiPC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s2XStcIjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbN10rXCI8L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzhdK1wiPC90ZD5cIjtcbiAgICAgICAgICBsZXQgcGRiID0gZW50cmllc1s5XS5zdWJzdHJpbmcoMCwgZW50cmllc1s5XS5sZW5ndGgtMik7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwczovL3d3dy5yY3NiLm9yZy9wZGIvZXhwbG9yZS9leHBsb3JlLmRvP3N0cnVjdHVyZUlkPVwiK3BkYitcIic+XCIrZW50cmllc1s5XStcIjwvYT48L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3Njb3AubXJjLWxtYi5jYW0uYWMudWsvc2NvcC9wZGIuY2dpP3BkYj1cIitwZGIrXCInPlNDT1AgU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmNhdGhkYi5pbmZvL3BkYi9cIitwZGIrXCInPkNBVEggU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmViaS5hYy51ay90aG9ybnRvbi1zcnYvZGF0YWJhc2VzL2NnaS1iaW4vcGRic3VtL0dldFBhZ2UucGw/cGRiY29kZT1cIitwZGIrXCInPk9wZW4gUERCU1VNPC9hPjwvdGQ+XCI7XG4gICAgICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J2xvYWROZXdBbGlnbm1lbnQoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiLFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKGVudHJpZXNbOV0rXCJfXCIraSkrXCJcXFwiKTsnIHZhbHVlPSdEaXNwbGF5IEFsaWdubWVudCcgLz48L3RkPlwiO1xuICAgICAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdidWlsZE1vZGVsKFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbG4pK1wiXFxcIik7JyB2YWx1ZT0nQnVpbGQgTW9kZWwnIC8+PC90ZD5cIjtcbiAgICAgICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8L3RyPlxcblwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBzZXVkb190YWJsZSArPSBcIjwvdGJvZHk+PC90YWJsZT5cXG5cIjtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VuX3RhYmxlXCIsIHBzZXVkb190YWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByYWN0aXZlLnNldChcInBnZW5fdGFibGVcIiwgXCI8aDM+Tm8gZ29vZCBoaXRzIGZvdW5kLiBHVUVTUyBhbmQgTE9XIGNvbmZpZGVuY2UgaGl0cyBjYW4gYmUgZm91bmQgaW4gdGhlIHJlc3VsdHMgZmlsZTwvaDM+XCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChKU09OLnN0cmluZ2lmeShlcnJvcikpO31cbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCIvL2dpdmVuIGFuZCBhcnJheSByZXR1cm4gd2hldGhlciBhbmQgZWxlbWVudCBpcyBwcmVzZW50XG5leHBvcnQgZnVuY3Rpb24gaXNJbkFycmF5KHZhbHVlLCBhcnJheSkge1xuICBpZihhcnJheS5pbmRleE9mKHZhbHVlKSA+IC0xKVxuICB7XG4gICAgcmV0dXJuKHRydWUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybihmYWxzZSk7XG4gIH1cbn1cblxuLy93aGVuIGEgcmVzdWx0cyBwYWdlIGlzIGluc3RhbnRpYXRlZCBhbmQgYmVmb3JlIHNvbWUgYW5ub3RhdGlvbnMgaGF2ZSBjb21lIGJhY2tcbi8vd2UgZHJhdyBhbmQgZW1wdHkgYW5ub3RhdGlvbiBwYW5lbFxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKXtcblxuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIGxldCByZXNpZHVlcyA9IHNlcS5zcGxpdCgnJyk7XG4gIGxldCBhbm5vdGF0aW9ucyA9IFtdO1xuICByZXNpZHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHJlcyl7XG4gICAgYW5ub3RhdGlvbnMucHVzaCh7J3Jlcyc6IHJlc30pO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICBiaW9kMy5hbm5vdGF0aW9uR3JpZChyYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKSwge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xufVxuXG5cbi8vZ2l2ZW4gYSBVUkwgcmV0dXJuIHRoZSBhdHRhY2hlZCB2YXJpYWJsZXNcbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmxWYXJzKCkge1xuICAgIGxldCB2YXJzID0ge307XG4gICAgLy9jb25zaWRlciB1c2luZyBsb2NhdGlvbi5zZWFyY2ggaW5zdGVhZCBoZXJlXG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvWz8mXSsoW149Jl0rKT0oW14mXSopL2dpLFxuICAgIGZ1bmN0aW9uKG0sa2V5LHZhbHVlKSB7XG4gICAgICB2YXJzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFycztcbiAgfVxuXG4vKiEgZ2V0RW1QaXhlbHMgIHwgQXV0aG9yOiBUeXNvbiBNYXRhbmljaCAoaHR0cDovL21hdGFuaWNoLmNvbSksIDIwMTMgfCBMaWNlbnNlOiBNSVQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIGRvY3VtZW50RWxlbWVudCkge1xuICAgIC8vIEVuYWJsZSBzdHJpY3QgbW9kZVxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gRm9ybSB0aGUgc3R5bGUgb24gdGhlIGZseSB0byByZXN1bHQgaW4gc21hbGxlciBtaW5pZmllZCBmaWxlXG4gICAgbGV0IGltcG9ydGFudCA9IFwiIWltcG9ydGFudDtcIjtcbiAgICBsZXQgc3R5bGUgPSBcInBvc2l0aW9uOmFic29sdXRlXCIgKyBpbXBvcnRhbnQgKyBcInZpc2liaWxpdHk6aGlkZGVuXCIgKyBpbXBvcnRhbnQgKyBcIndpZHRoOjFlbVwiICsgaW1wb3J0YW50ICsgXCJmb250LXNpemU6MWVtXCIgKyBpbXBvcnRhbnQgKyBcInBhZGRpbmc6MFwiICsgaW1wb3J0YW50O1xuXG4gICAgd2luZG93LmdldEVtUGl4ZWxzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICBsZXQgZXh0cmFCb2R5O1xuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRW11bGF0ZSB0aGUgZG9jdW1lbnRFbGVtZW50IHRvIGdldCByZW0gdmFsdWUgKGRvY3VtZW50RWxlbWVudCBkb2VzIG5vdCB3b3JrIGluIElFNi03KVxuICAgICAgICAgICAgZWxlbWVudCA9IGV4dHJhQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xuICAgICAgICAgICAgZXh0cmFCb2R5LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudDtcbiAgICAgICAgICAgIGRvY3VtZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFCb2R5LCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgc3R5bGUgYSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgbGV0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgIHRlc3RFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjbGllbnQgd2lkdGggb2YgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdmFsdWUgPSB0ZXN0RWxlbWVudC5jbGllbnRXaWR0aDtcblxuICAgICAgICBpZiAoZXh0cmFCb2R5KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGV4dHJhIGJvZHkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGV4dHJhQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIGVtIHZhbHVlIGluIHBpeGVsc1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn0oZG9jdW1lbnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2NvbW1vbi9jb21tb25faW5kZXguanMiLCJcbi8vIGZvciBhIGdpdmVuIG1lbXNhdCBkYXRhIGZpbGVzIGV4dHJhY3QgY29vcmRpbmF0ZSByYW5nZXMgZ2l2ZW4gc29tZSByZWdleFxuZXhwb3J0IGZ1bmN0aW9uIGdldF9tZW1zYXRfcmFuZ2VzKHJlZ2V4LCBkYXRhKVxue1xuICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoZGF0YSk7XG4gICAgaWYobWF0Y2hbMV0uaW5jbHVkZXMoJywnKSlcbiAgICB7XG4gICAgICBsZXQgcmVnaW9ucyA9IG1hdGNoWzFdLnNwbGl0KCcsJyk7XG4gICAgICByZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uLCBpKXtcbiAgICAgICAgcmVnaW9uc1tpXSA9IHJlZ2lvbi5zcGxpdCgnLScpO1xuICAgICAgICByZWdpb25zW2ldWzBdID0gcGFyc2VJbnQocmVnaW9uc1tpXVswXSk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMV0gPSBwYXJzZUludChyZWdpb25zW2ldWzFdKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuKHJlZ2lvbnMpO1xuICAgIH1cbiAgICByZXR1cm4obWF0Y2hbMV0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2Vfc3MyKHJhY3RpdmUsIGZpbGUpXG57XG4gICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgbGluZXMuc2hpZnQoKTtcbiAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBhbm5vdGF0aW9uc1tpXS5zcyA9IGVudHJpZXNbM107XG4gICAgICB9KTtcbiAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBhbGVydChcIlNTMiBhbm5vdGF0aW9uIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCBxdWVyeSBzZXF1ZW5jZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuKGFubm90YXRpb25zKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMiLCIvKiAxLiBDYXRjaCBmb3JtIGlucHV0XG4gICAgIDIuIFZlcmlmeSBmb3JtXG4gICAgIDMuIElmIGdvb2QgdGhlbiBtYWtlIGZpbGUgZnJvbSBkYXRhIGFuZCBwYXNzIHRvIGJhY2tlbmRcbiAgICAgNC4gc2hyaW5rIGZvcm0gYXdheVxuICAgICA1LiBPcGVuIHNlcSBwYW5lbFxuICAgICA2LiBTaG93IHByb2Nlc3NpbmcgYW5pbWF0aW9uXG4gICAgIDcuIGxpc3RlbiBmb3IgcmVzdWx0XG4qL1xuaW1wb3J0IHsgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0gfSBmcm9tICcuL2Zvcm1zL2Zvcm1zX2luZGV4LmpzJztcbmltcG9ydCB7IHNlbmRfam9iIH0gZnJvbSAnLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBzZW5kX3JlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGdldF9wcmV2aW91c19kYXRhIH0gZnJvbSAnLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBwcm9jZXNzX2ZpbGUgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCB9IGZyb20gJy4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5pbXBvcnQgeyBnZXRVcmxWYXJzIH0gZnJvbSAnLi9jb21tb24vY29tbW9uX2luZGV4LmpzJztcbmltcG9ydCB7IGNsZWFyX3NldHRpbmdzIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcblxuLy8gaW1wb3J0IHsgIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlci9pbmRleC5qcyc7XG52YXIgY2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgnLmNvcHlCdXR0b24nKTtcbnZhciB6aXAgPSBuZXcgSlNaaXAoKTtcblxuY2xpcGJvYXJkLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xufSk7XG5jbGlwYm9hcmQub24oJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xufSk7XG5cbi8vIFNFVCBFTkRQT0lOVFMgRk9SIERFViwgU1RBR0lORyBPUiBQUk9EXG5sZXQgZW5kcG9pbnRzX3VybCA9IG51bGw7XG5sZXQgc3VibWl0X3VybCA9IG51bGw7XG5sZXQgdGltZXNfdXJsID0gbnVsbDtcbmxldCBnZWFyc19zdmcgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrL3BzaXByZWRfYmV0YS9zdGF0aWMvaW1hZ2VzL2dlYXJzLnN2Z1wiO1xubGV0IG1haW5fdXJsID0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51a1wiO1xubGV0IGFwcF9wYXRoID0gXCIvcHNpcHJlZF9iZXRhXCI7XG5sZXQgZmlsZV91cmwgPSAnJztcblxuaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiMTI3LjAuMC4xXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIpXG57XG4gIGVuZHBvaW50c191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvZW5kcG9pbnRzLyc7XG4gIHN1Ym1pdF91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvam9idGltZXMvJztcbiAgYXBwX3BhdGggPSAnL2ludGVyZmFjZSc7XG4gIG1haW5fdXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCc7XG4gIGdlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbiAgZmlsZV91cmwgPSBtYWluX3VybDtcbn1cbmVsc2UgaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiYmlvaW5mc3RhZ2UxLmNzLnVjbC5hYy51a1wiIHx8IGxvY2F0aW9uLmhvc3RuYW1lICA9PT0gXCJiaW9pbmYuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaHJlZiAgPT09IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL1wiKSB7XG4gIGVuZHBvaW50c191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL3N1Ym1pc3Npb24vJztcbiAgdGltZXNfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvam9idGltZXMvJztcbiAgZmlsZV91cmwgPSBtYWluX3VybCthcHBfcGF0aCtcIi9hcGlcIjtcbiAgLy9nZWFyc19zdmcgPSBcIi4uL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG59XG5lbHNlIHtcbiAgYWxlcnQoJ1VOU0VUVElORyBFTkRQT0lOVFMgV0FSTklORywgV0FSTklORyEnKTtcbiAgZW5kcG9pbnRzX3VybCA9ICcnO1xuICBzdWJtaXRfdXJsID0gJyc7XG4gIHRpbWVzX3VybCA9ICcnO1xufVxuXG4vLyBERUNMQVJFIFZBUklBQkxFUyBhbmQgaW5pdCByYWN0aXZlIGluc3RhbmNlXG5cbnZhciByYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xuICBlbDogJyNwc2lwcmVkX3NpdGUnLFxuICB0ZW1wbGF0ZTogJyNmb3JtX3RlbXBsYXRlJyxcbiAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdHNfdmlzaWJsZTogMSxcbiAgICAgICAgICByZXN1bHRzX3BhbmVsX3Zpc2libGU6IDEsXG4gICAgICAgICAgc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZTogMCxcbiAgICAgICAgICBtb2RlbGxlcl9rZXk6IG51bGwsXG5cbiAgICAgICAgICBwc2lwcmVkX2NoZWNrZWQ6IHRydWUsXG4gICAgICAgICAgcHNpcHJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIGRpc29wcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGRpc29wcmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIG1lbXNhdHN2bV9idXR0b246IGZhbHNlLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfYnV0dG9uOiBmYWxzZSxcblxuXG4gICAgICAgICAgLy8gcGdlbnRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIHBkb210aHJlYWRlcl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBkb21wcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIG1lbXBhY2tfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gZmZwcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIGJpb3NlcmZfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gZG9tc2VyZl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBkb3dubG9hZF9saW5rczogJycsXG4gICAgICAgICAgcHNpcHJlZF9qb2I6ICdwc2lwcmVkX2pvYicsXG4gICAgICAgICAgZGlzb3ByZWRfam9iOiAnZGlzb3ByZWRfam9iJyxcbiAgICAgICAgICBtZW1zYXRzdm1fam9iOiAnbWVtc2F0c3ZtX2pvYicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX2pvYjogJ3BnZW50aHJlYWRlcl9qb2InLFxuXG4gICAgICAgICAgcHNpcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgUFNJUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBwc2lwcmVkX3dhaXRpbmdfaWNvbjogJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JyxcbiAgICAgICAgICBwc2lwcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBzaXByZWRfaG9yaXo6IG51bGwsXG5cbiAgICAgICAgICBkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRElTT1BSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZGlzb3ByZWRfd2FpdGluZ19pY29uOiAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIj48L29iamVjdD4nLFxuICAgICAgICAgIGRpc29wcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIGRpc29fcHJlY2lzaW9uOiBudWxsLFxuXG4gICAgICAgICAgbWVtc2F0c3ZtX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNRU1TQVQtU1ZNIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIG1lbXNhdHN2bV93YWl0aW5nX2ljb246ICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiPjwvb2JqZWN0PicsXG4gICAgICAgICAgbWVtc2F0c3ZtX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIG1lbXNhdHN2bV9zY2hlbWF0aWM6ICcnLFxuICAgICAgICAgIG1lbXNhdHN2bV9jYXJ0b29uOiAnJyxcblxuICAgICAgICAgIHBnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgcEdlblRIUkVBREVSIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl93YWl0aW5nX2ljb246ICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiPjwvb2JqZWN0PicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBnZW5fdGFibGU6IG51bGwsXG4gICAgICAgICAgcGdlbl9hbm5fc2V0OiB7fSxcblxuICAgICAgICAgIC8vIFNlcXVlbmNlIGFuZCBqb2IgaW5mb1xuICAgICAgICAgIHNlcXVlbmNlOiAnJyxcbiAgICAgICAgICBzZXF1ZW5jZV9sZW5ndGg6IDEsXG4gICAgICAgICAgc3Vic2VxdWVuY2Vfc3RhcnQ6IDEsXG4gICAgICAgICAgc3Vic2VxdWVuY2Vfc3RvcDogMSxcbiAgICAgICAgICBlbWFpbDogJycsXG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgYmF0Y2hfdXVpZDogbnVsbCxcblxuICAgICAgICAgIC8vaG9sZCBhbm5vdGF0aW9ucyB0aGF0IGFyZSByZWFkIGZyb20gZGF0YWZpbGVzXG4gICAgICAgICAgYW5ub3RhdGlvbnM6IG51bGwsXG4gICAgICAgIH1cbn0pO1xuXG5pZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCIxMjcuMC4wLjFcIikge1xuICByYWN0aXZlLnNldCgnZW1haWwnLCAnZGFuaWVsLmJ1Y2hhbkB1Y2wuYWMudWsnKTtcbiAgcmFjdGl2ZS5zZXQoJ25hbWUnLCAndGVzdCcpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2UnLCAnUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVMnKTtcbn1cblxuLy80YjZhZDc5Mi1lZDFmLTExZTUtODk4Ni05ODkwOTZjMTNlZTZcbmxldCB1dWlkX3JlZ2V4ID0gL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfSQvaTtcbmxldCB1dWlkX21hdGNoID0gdXVpZF9yZWdleC5leGVjKGdldFVybFZhcnMoKS51dWlkKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9cbi8vXG4vLyBBUFBMSUNBVElPTiBIRVJFXG4vL1xuLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9IZXJlIHdlcmUga2VlcCBhbiBleWUgb24gc29tZSBmb3JtIGVsZW1lbnRzIGFuZCByZXdyaXRlIHRoZSBuYW1lIGlmIHBlb3BsZVxuLy9oYXZlIHByb3ZpZGVkIGEgZmFzdGEgZm9ybWF0dGVkIHNlcVxubGV0IHNlcV9vYnNlcnZlciA9IHJhY3RpdmUub2JzZXJ2ZSgnc2VxdWVuY2UnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gIGxldCByZWdleCA9IC9ePiguKz8pXFxzLztcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhuZXdWYWx1ZSk7XG4gIGlmKG1hdGNoKVxuICB7XG4gICAgdGhpcy5zZXQoJ25hbWUnLCBtYXRjaFsxXSk7XG4gIH1cbiAgLy8gZWxzZSB7XG4gIC8vICAgdGhpcy5zZXQoJ25hbWUnLCBudWxsKTtcbiAgLy8gfVxuXG4gIH0sXG4gIHtpbml0OiBmYWxzZSxcbiAgIGRlZmVyOiB0cnVlXG4gfSk7XG5cbi8vdGhlc2VzIHR3byBvYnNlcnZlcnMgc3RvcCBwZW9wbGUgc2V0dGluZyB0aGUgcmVzdWJtaXNzaW9uIHdpZGdldCBvdXQgb2YgYm91bmRzXG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdG9wJywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9sZW5ndGggPSByYWN0aXZlLmdldCgnc2VxdWVuY2VfbGVuZ3RoJyk7XG4gIGxldCBzZXFfc3RhcnQgPSByYWN0aXZlLmdldCgnc3Vic2VxdWVuY2Vfc3RhcnQnKTtcbiAgaWYodmFsdWUgPiBzZXFfbGVuZ3RoKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXFfbGVuZ3RoKTtcbiAgfVxuICBpZih2YWx1ZSA8PSBzZXFfc3RhcnQpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9zdGFydCsxKTtcbiAgfVxufSk7XG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdGFydCcsIGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGxldCBzZXFfc3RvcCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdG9wJyk7XG4gIGlmKHZhbHVlIDwgMSlcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcsIDEpO1xuICB9XG4gIGlmKHZhbHVlID49IHNlcV9zdG9wKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0Jywgc2VxX3N0b3AtMSk7XG4gIH1cbn0pO1xuXG4vL0FmdGVyIGEgam9iIGhhcyBiZWVuIHNlbnQgb3IgYSBVUkwgYWNjZXB0ZWQgdGhpcyByYWN0aXZlIGJsb2NrIGlzIGNhbGxlZCB0b1xuLy9wb2xsIHRoZSBiYWNrZW5kIHRvIGdldCB0aGUgcmVzdWx0c1xucmFjdGl2ZS5vbigncG9sbF90cmlnZ2VyJywgZnVuY3Rpb24obmFtZSwgam9iX3R5cGUpe1xuICBjb25zb2xlLmxvZyhcIlBvbGxpbmcgYmFja2VuZCBmb3IgcmVzdWx0c1wiKTtcbiAgbGV0IGhvcml6X3JlZ2V4ID0gL1xcLmhvcml6JC87XG4gIGxldCBzczJfcmVnZXggPSAvXFwuc3MyJC87XG4gIGxldCBtZW1zYXRfY2FydG9vbl9yZWdleCA9IC9fY2FydG9vbl9tZW1zYXRfc3ZtXFwucG5nJC87XG4gIGxldCBtZW1zYXRfc2NoZW1hdGljX3JlZ2V4ID0gL19zY2hlbWF0aWNcXC5wbmckLztcbiAgbGV0IG1lbXNhdF9kYXRhX3JlZ2V4ID0gL21lbXNhdF9zdm0kLztcbiAgbGV0IGltYWdlX3JlZ2V4ID0gJyc7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsICsgcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgJycsIGFwcF9wYXRoKycvJnV1aWQ9JytyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpKTtcblxuICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG5cbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBsZXQgYmF0Y2ggPSBzZW5kX3JlcXVlc3QodXJsLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGRvd25sb2Fkc19pbmZvID0ge307XG5cbiAgICBpZihiYXRjaC5zdGF0ZSA9PT0gJ0NvbXBsZXRlJylcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlbmRlciByZXN1bHRzXCIpO1xuICAgICAgbGV0IHN1Ym1pc3Npb25zID0gYmF0Y2guc3VibWlzc2lvbnM7XG4gICAgICBzdWJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ3BzaXByZWQnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBTSVBSRUQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZCA9IHt9O1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuaGVhZGVyID0gXCI8aDU+RElTT1BSRUQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWVtc2F0c3ZtJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtPSB7fTtcbiAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5oZWFkZXIgPSBcIjxoNT5NRU1TQVRTVk0gRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygncGdlbnRocmVhZGVyJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5QU0lQUkVEIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXI9IHt9O1xuICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBHZW5USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCByZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuICAgICAgICAgIGZvcih2YXIgaSBpbiByZXN1bHRzKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnR2VuQWxpZ25tZW50QW5ub3RhdGlvbicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGV0IGFubl9zZXQgPSByYWN0aXZlLmdldChcInBnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgICAgICAgICBsZXQgdG1wID0gcmVzdWx0X2RpY3QuZGF0YV9wYXRoO1xuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gdG1wLnN1YnN0cigwLCB0bXAubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgYW5uX3NldFtpZF0gPSB7fTtcbiAgICAgICAgICAgICAgICBhbm5fc2V0W2lkXS5hbm4gPSBwYXRoK1wiLmFublwiO1xuICAgICAgICAgICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VuX2Fubl9zZXRcIiwgYW5uX3NldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yKHZhciBpIGluIHJlc3VsdHMpXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGV0IHJlc3VsdF9kaWN0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIC8vcHNpcHJlZCBmaWxlc1xuICAgICAgICAgICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PSAncHNpcGFzczInKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSBob3Jpel9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKG1hdGNoKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdob3JpeicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5ob3JpeiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkhvcml6IEZvcm1hdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfdGltZVwiLCAnJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHNzMl9tYXRjaCA9IHNzMl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICAgICAgICAgIGlmKHNzMl9tYXRjaClcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuc3MyID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+U1MyIEZvcm1hdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3NzMicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdkaXNvX2Zvcm1hdCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLnBiZGF0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+UEJEQVQgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KFwiZGlzb3ByZWRfdGltZVwiLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19jb21iaW5lJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdjb21iJywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNPTUIgTk4gT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdtZW1zYXRzdm0nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICAgICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV90aW1lXCIsICcnKTtcbiAgICAgICAgICAgICAgbGV0IHNjaGVtZV9tYXRjaCA9IG1lbXNhdF9zY2hlbWF0aWNfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICAgICAgICBpZihzY2hlbWVfbWF0Y2gpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3NjaGVtYXRpYycsICc8aW1nIHNyYz1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIiAvPicpO1xuICAgICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5zY2hlbWF0aWMgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TY2hlbWF0aWMgRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxldCBjYXJ0b29uX21hdGNoID0gbWVtc2F0X2NhcnRvb25fcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICAgICAgICBpZihjYXJ0b29uX21hdGNoKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9jYXJ0b29uJywgJzxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5DYXJ0b29uIERpYWdyYW08L2E+PGJyIC8+JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgbWVtc2F0X21hdGNoID0gbWVtc2F0X2RhdGFfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICAgICAgICBpZihtZW1zYXRfbWF0Y2gpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ21lbXNhdGRhdGEnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TWVtc2F0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnc29ydF9wcmVzdWx0JylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICAgICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci50YWJsZSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPnBHZW5USFJFQURFUiBUYWJsZTwvYT48YnIgLz4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAncHNldWRvX2Jhc19hbGlnbicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPnBHZW5USFJFQURFUiBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICAgIGxldCBkb3dubG9hZHNfc3RyaW5nID0gcmFjdGl2ZS5nZXQoJ2Rvd25sb2FkX2xpbmtzJyk7XG4gICAgICBpZigncHNpcHJlZCcgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlcik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6KTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuc3MyKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICAgICAgfVxuICAgICAgaWYoJ2Rpc29wcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlcik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCk7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5jb21iKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICAgICAgfVxuICAgICAgaWYoJ21lbXNhdHN2bScgaW4gZG93bmxvYWRzX2luZm8pXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5zY2hlbWF0aWMpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24pO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gICAgICB9XG4gICAgICBpZigncGdlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIpO1xuICAgICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlKTtcbiAgICAgICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbik7XG4gICAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgICAgIH1cblxuICAgICAgcmFjdGl2ZS5zZXQoJ2Rvd25sb2FkX2xpbmtzJywgZG93bmxvYWRzX3N0cmluZyk7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9XG4gICAgaWYoYmF0Y2guc3RhdGUgPT09ICdFcnJvcicgfHwgYmF0Y2guc3RhdGUgPT09ICdDcmFzaCcpXG4gICAge1xuICAgICAgbGV0IHN1Ym1pc3Npb25fbWVzc2FnZSA9IGJhdGNoLnN1Ym1pc3Npb25zWzBdLmxhc3RfbWVzc2FnZTtcbiAgICAgIGFsZXJ0KFwiUE9MTElORyBFUlJPUjogSm9iIEZhaWxlZFxcblwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgQ29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51ayBxdW90aW5nIHRoaXMgZXJyb3IgbWVzc2FnZSBhbmQgeW91ciBqb2IgSURcXG5cIitzdWJtaXNzaW9uX21lc3NhZ2UpO1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9XG4gIH0sIDUwMDApO1xuXG59LHtpbml0OiBmYWxzZSxcbiAgIGRlZmVyOiB0cnVlXG4gfVxuKTtcblxucmFjdGl2ZS5vbignZ2V0X3ppcCcsIGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgbGV0IHV1aWQgPSByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICAgIHppcC5nZW5lcmF0ZUFzeW5jKHt0eXBlOlwiYmxvYlwifSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICBzYXZlQXMoYmxvYiwgdXVpZCtcIi56aXBcIik7XG4gICAgfSk7XG59KTtcblxuLy8gVGhlc2UgcmVhY3QgdG8gdGhlIGhlYWRlcnMgYmVpbmcgY2xpY2tlZCB0byB0b2dnbGUgdGhlIHJlc3VsdHMgcGFuZWxcbnJhY3RpdmUub24oICdkb3dubG9hZHNfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAncHNpcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxICk7XG4gIGlmKHJhY3RpdmUuZ2V0KCdwc2lwcmVkX2hvcml6JykpXG4gIHtcbiAgICBiaW9kMy5wc2lwcmVkKHJhY3RpdmUuZ2V0KCdwc2lwcmVkX2hvcml6JyksICdwc2lwcmVkQ2hhcnQnLCB7cGFyZW50OiAnZGl2LnBzaXByZWRfY2FydG9vbicsIG1hcmdpbl9zY2FsZXI6IDJ9KTtcbiAgfVxufSk7XG5cbnJhY3RpdmUub24oICdkaXNvcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA0ICk7XG4gIGlmKHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpKVxuICB7XG4gICAgYmlvZDMuZ2VuZXJpY3h5TGluZUNoYXJ0KHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICB9XG59KTtcblxucmFjdGl2ZS5vbiggJ21lbXNhdHN2bV9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2ICk7XG59KTtcblxucmFjdGl2ZS5vbiggJ3BnZW50aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAyICk7XG59KTtcblxucmFjdGl2ZS5vbiggJ3N1Ym1pc3Npb25fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgbGV0IHN0YXRlID0gcmFjdGl2ZS5nZXQoJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnKTtcbiAgaWYoc3RhdGUgPT09IDEpe1xuICAgIHJhY3RpdmUuc2V0KCAnc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZScsIDAgKTtcbiAgfVxuICBlbHNle1xuICAgIHJhY3RpdmUuc2V0KCAnc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZScsIDEgKTtcbiAgfVxufSk7XG5cbi8vZ3JhYiB0aGUgc3VibWl0IGV2ZW50IGZyb20gdGhlIG1haW4gZm9ybSBhbmQgc2VuZCB0aGUgc2VxdWVuY2UgdG8gdGhlIGJhY2tlbmRcbnJhY3RpdmUub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKCdTdWJtaXR0aW5nIGRhdGEnKTtcbiAgbGV0IHNlcSA9IHRoaXMuZ2V0KCdzZXF1ZW5jZScpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXj4uKyQvbWcsIFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIHNlcSA9IHNlcS5yZXBsYWNlKC9cXG58XFxzL2csXCJcIik7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJywgc2VxKTtcblxuICBsZXQgbmFtZSA9IHRoaXMuZ2V0KCduYW1lJyk7XG4gIGxldCBlbWFpbCA9IHRoaXMuZ2V0KCdlbWFpbCcpO1xuICBsZXQgcHNpcHJlZF9qb2IgPSB0aGlzLmdldCgncHNpcHJlZF9qb2InKTtcbiAgbGV0IHBzaXByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwc2lwcmVkX2NoZWNrZWQnKTtcbiAgbGV0IGRpc29wcmVkX2pvYiA9IHRoaXMuZ2V0KCdkaXNvcHJlZF9qb2InKTtcbiAgbGV0IGRpc29wcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnZGlzb3ByZWRfY2hlY2tlZCcpO1xuICBsZXQgbWVtc2F0c3ZtX2pvYiA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fam9iJyk7XG4gIGxldCBtZW1zYXRzdm1fY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fY2hlY2tlZCcpO1xuICBsZXQgcGdlbnRocmVhZGVyX2pvYiA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfam9iJyk7XG4gIGxldCBwZ2VudGhyZWFkZXJfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfY2hlY2tlZCcpO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIHBzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkKTtcbiAgZXZlbnQub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBncmFiIHRoZSBzdWJtaXQgZXZlbnQgZnJvbSB0aGUgUmVzdWJtaXNzaW9uIHdpZGdldCwgdHJ1bmNhdGUgdGhlIHNlcXVlbmNlXG4vLyBhbmQgc2VuZCBhIG5ldyBqb2JcbnJhY3RpdmUub24oJ3Jlc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgY29uc29sZS5sb2coJ1Jlc3VibWl0dGluZyBzZWdtZW50Jyk7XG4gIGxldCBzdGFydCA9IHJhY3RpdmUuZ2V0KFwic3Vic2VxdWVuY2Vfc3RhcnRcIik7XG4gIGxldCBzdG9wID0gcmFjdGl2ZS5nZXQoXCJzdWJzZXF1ZW5jZV9zdG9wXCIpO1xuICBsZXQgc2VxdWVuY2UgPSByYWN0aXZlLmdldChcInNlcXVlbmNlXCIpO1xuICBsZXQgc3Vic2VxdWVuY2UgPSBzZXF1ZW5jZS5zdWJzdHJpbmcoc3RhcnQtMSwgc3RvcCk7XG4gIGxldCBuYW1lID0gdGhpcy5nZXQoJ25hbWUnKStcIl9zZWdcIjtcbiAgbGV0IGVtYWlsID0gdGhpcy5nZXQoJ2VtYWlsJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzdWJzZXF1ZW5jZS5sZW5ndGgpO1xuICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHN1YnNlcXVlbmNlLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHN1YnNlcXVlbmNlKTtcbiAgcmFjdGl2ZS5zZXQoJ25hbWUnLCBuYW1lKTtcbiAgbGV0IHBzaXByZWRfam9iID0gdGhpcy5nZXQoJ3BzaXByZWRfam9iJyk7XG4gIGxldCBwc2lwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgncHNpcHJlZF9jaGVja2VkJyk7XG4gIGxldCBkaXNvcHJlZF9qb2IgPSB0aGlzLmdldCgnZGlzb3ByZWRfam9iJyk7XG4gIGxldCBkaXNvcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ2Rpc29wcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1lbXNhdHN2bV9qb2IgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2pvYicpO1xuICBsZXQgbWVtc2F0c3ZtX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2NoZWNrZWQnKTtcbiAgbGV0IHBnZW50aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2pvYicpO1xuICBsZXQgcGdlbnRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2NoZWNrZWQnKTtcblxuICAvL2NsZWFyIHdoYXQgd2UgaGF2ZSBwcmV2aW91c2x5IHdyaXR0ZW5cbiAgY2xlYXJfc2V0dGluZ3MoKTtcbiAgLy92ZXJpZnkgZm9ybSBjb250ZW50cyBhbmQgcG9zdFxuICAvL2NvbnNvbGUubG9nKG5hbWUpO1xuICAvL2NvbnNvbGUubG9nKGVtYWlsKTtcbiAgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc3Vic2VxdWVuY2UsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIHBzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkKTtcbiAgLy93cml0ZSBuZXcgYW5ub3RhdGlvbiBkaWFncmFtXG4gIC8vc3VibWl0IHN1YnNlY3Rpb25cbiAgZXZlbnQub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBIZXJlIGhhdmluZyBzZXQgdXAgcmFjdGl2ZSBhbmQgdGhlIGZ1bmN0aW9ucyB3ZSBuZWVkIHdlIHRoZW4gY2hlY2tcbi8vIGlmIHdlIHdlcmUgcHJvdmlkZWQgYSBVVUlELCBJZiB0aGUgcGFnZSBpcyBsb2FkZWQgd2l0aCBhIFVVSUQgcmF0aGVyIHRoYW4gYVxuLy8gZm9ybSBzdWJtaXQuXG4vL1RPRE86IEhhbmRsZSBsb2FkaW5nIHRoYXQgcGFnZSB3aXRoIHVzZSB0aGUgTUVNU0FUIGFuZCBESVNPUFJFRCBVVUlEXG4vL1xuaWYoZ2V0VXJsVmFycygpLnV1aWQgJiYgdXVpZF9tYXRjaClcbntcbiAgY29uc29sZS5sb2coJ0NhdWdodCBhbiBpbmNvbWluZyBVVUlEJyk7XG4gIHNlcV9vYnNlcnZlci5jYW5jZWwoKTtcbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTsgLy8gc2hvdWxkIG1ha2UgYSBnZW5lcmljIG9uZSB2aXNpYmxlIHVudGlsIHJlc3VsdHMgYXJyaXZlLlxuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMiApO1xuICByYWN0aXZlLnNldChcImJhdGNoX3V1aWRcIiwgZ2V0VXJsVmFycygpLnV1aWQpO1xuICBsZXQgcHJldmlvdXNfZGF0YSA9IGdldF9wcmV2aW91c19kYXRhKGdldFVybFZhcnMoKS51dWlkLCBzdWJtaXRfdXJsLCBmaWxlX3VybCwgcmFjdGl2ZSk7XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygncHNpcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdkaXNvcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZGlzb3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDQpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWVtc2F0c3ZtJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDYpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygncGdlbnRocmVhZGVyJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDIpO1xuICB9XG5cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gTmV3IFBhbm5lbCBmdW5jdGlvbnNcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5mdW5jdGlvbiBsb2FkTmV3QWxpZ25tZW50KGFsblVSSSxhbm5VUkksdGl0bGUpIHtcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwrcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgd2luZG93Lm9wZW4oXCIuLlwiK2FwcF9wYXRoK1wiL21zYS8/YW5uPVwiK2ZpbGVfdXJsK2FublVSSStcIiZhbG49XCIrZmlsZV91cmwrYWxuVVJJLCBcIlwiLCBcIndpZHRoPTgwMCxoZWlnaHQ9NDAwXCIpO1xufVxuXG4vL1JlbG9hZCBhbGlnbm1lbnRzIGZvciBKYWxWaWV3IGZvciB0aGUgZ2VuVEhSRUFERVIgdGFibGVcbmZ1bmN0aW9uIGJ1aWxkTW9kZWwoYWxuVVJJKSB7XG5cbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwrcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgbGV0IG1vZF9rZXkgPSByYWN0aXZlLmdldCgnbW9kZWxsZXJfa2V5Jyk7XG4gIGlmKG1vZF9rZXkgPT09ICdNJysnTycrJ0QnKydFJysnTCcrJ0knKydSJysnQScrJ04nKydKJysnRScpXG4gIHtcbiAgICB3aW5kb3cub3BlbihcIi4uXCIrYXBwX3BhdGgrXCIvbW9kZWwvcG9zdD9hbG49XCIrZmlsZV91cmwrYWxuVVJJLCBcIlwiLCBcIndpZHRoPTY3MCxoZWlnaHQ9NzAwXCIpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIGFsZXJ0KCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIE0nKydPJysnRCcrJ0UnKydMJysnTCcrJ0UnKydSIExpY2VuY2UgS2V5Jyk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9tYWluLmpzIiwiaW1wb3J0IHsgc2VuZF9qb2IgfSBmcm9tICcuLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBpc0luQXJyYXkgfSBmcm9tICcuLi9jb21tb24vY29tbW9uX2luZGV4LmpzJztcbmltcG9ydCB7IGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCB9IGZyb20gJy4uL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuXG4vL1Rha2VzIHRoZSBkYXRhIG5lZWRlZCB0byB2ZXJpZnkgdGhlIGlucHV0IGZvcm0gZGF0YSwgZWl0aGVyIHRoZSBtYWluIGZvcm1cbi8vb3IgdGhlIHN1Ym1pc3NvbiB3aWRnZXQgdmVyaWZpZXMgdGhhdCBkYXRhIGFuZCB0aGVuIHBvc3RzIGl0IHRvIHRoZSBiYWNrZW5kLlxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeV9hbmRfc2VuZF9mb3JtKHJhY3RpdmUsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCwgcHNpcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzb3ByZWRfY2hlY2tlZCwgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkKVxue1xuICAvKnZlcmlmeSB0aGF0IGV2ZXJ5dGhpbmcgaGVyZSBpcyBvayovXG4gIGxldCBlcnJvcl9tZXNzYWdlPW51bGw7XG4gIGxldCBqb2Jfc3RyaW5nID0gJyc7XG4gIC8vZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkXSk7XG5cbiAgZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHNpcHJlZF9jaGVja2VkLCBkaXNvcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbXNhdHN2bV9jaGVja2VkLCBwZ2VudGhyZWFkZXJfY2hlY2tlZF0pO1xuICBpZihlcnJvcl9tZXNzYWdlLmxlbmd0aCA+IDApXG4gIHtcbiAgICByYWN0aXZlLnNldCgnZm9ybV9lcnJvcicsIGVycm9yX21lc3NhZ2UpO1xuICAgIGFsZXJ0KFwiRk9STSBFUlJPUjpcIitlcnJvcl9tZXNzYWdlKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvL2luaXRpYWxpc2UgdGhlIHBhZ2VcbiAgICBsZXQgcmVzcG9uc2UgPSB0cnVlO1xuICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgbnVsbCApO1xuICAgIC8vUG9zdCB0aGUgam9icyBhbmQgaW50aWFsaXNlIHRoZSBhbm5vdGF0aW9ucyBmb3IgZWFjaCBqb2JcbiAgICAvL1dlIGFsc28gZG9uJ3QgcmVkdW5kYW50bHkgc2VuZCBleHRyYSBwc2lwcmVkIGV0Yy4uIGpvYnNcbiAgICAvL2J5dCBkb2luZyB0aGVzZSB0ZXN0IGluIGEgc3BlY2lmaWMgb3JkZXJcbiAgICBpZihwZ2VudGhyZWFkZXJfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJwZ2VudGhyZWFkZXIsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgcHNpcHJlZF9jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmKGRpc29wcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZGlzb3ByZWQsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYocHNpcHJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBzaXByZWQsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKG1lbXNhdHN2bV9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1lbXNhdHN2bSxcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUpO1xuICAgIH1cblxuICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLnNsaWNlKDAsIC0xKTtcbiAgICByZXNwb25zZSA9IHNlbmRfam9iKHJhY3RpdmUsIGpvYl9zdHJpbmcsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCk7XG4gICAgLy9zZXQgdmlzaWJpbGl0eSBhbmQgcmVuZGVyIHBhbmVsIG9uY2VcbiAgICBpZiAocHNpcHJlZF9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAncHNpcHJlZF9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgICAvLyBwYXJzZSBzZXF1ZW5jZSBhbmQgbWFrZSBzZXEgcGxvdFxuICAgIH1cbiAgICBlbHNlIGlmKGRpc29wcmVkX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdkaXNvcHJlZF9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYobWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdtZW1zYXRzdm1fYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1cbiAgICBlbHNlIGlmKHBnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAncGdlbnRocmVhZGVyX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9XG5cbiAgICBpZighIHJlc3BvbnNlKXt3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO31cbiAgfVxufVxuXG4vL1Rha2VzIHRoZSBmb3JtIGVsZW1lbnRzIGFuZCBjaGVja3MgdGhleSBhcmUgdmFsaWRcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlfZm9ybShzZXEsIGpvYl9uYW1lLCBlbWFpbCwgY2hlY2tlZF9hcnJheSlcbntcbiAgbGV0IGVycm9yX21lc3NhZ2UgPSBcIlwiO1xuICBpZighIC9eW1xceDAwLVxceDdGXSskLy50ZXN0KGpvYl9uYW1lKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJQbGVhc2UgcmVzdHJpY3QgSm9iIE5hbWVzIHRvIHZhbGlkIGxldHRlcnMgbnVtYmVycyBhbmQgYmFzaWMgcHVuY3R1YXRpb248YnIgLz5cIjtcbiAgfVxuXG4gIC8qIGxlbmd0aCBjaGVja3MgKi9cbiAgaWYoc2VxLmxlbmd0aCA+IDE1MDApXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBpcyB0b28gbG9uZyB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cbiAgaWYoc2VxLmxlbmd0aCA8IDMwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIHNob3J0IHRvIHByb2Nlc3M8YnIgLz5cIjtcbiAgfVxuXG4gIC8qIG51Y2xlb3RpZGUgY2hlY2tzICovXG4gIGxldCBudWNsZW90aWRlX2NvdW50ID0gKHNlcS5tYXRjaCgvQXxUfEN8R3xVfE58YXx0fGN8Z3x1fG4vZyl8fFtdKS5sZW5ndGg7XG4gIGlmKChudWNsZW90aWRlX2NvdW50L3NlcS5sZW5ndGgpID4gMC45NSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGFwcGVhcnMgdG8gYmUgbnVjbGVvdGlkZSBzZXF1ZW5jZS4gVGhpcyBzZXJ2aWNlIHJlcXVpcmVzIHByb3RlaW4gc2VxdWVuY2UgYXMgaW5wdXQ8YnIgLz5cIjtcbiAgfVxuICBpZigvW15BQ0RFRkdISUtMTU5QUVJTVFZXWVhfLV0rL2kudGVzdChzZXEpKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzPGJyIC8+XCI7XG4gIH1cblxuICBpZihpc0luQXJyYXkodHJ1ZSwgY2hlY2tlZF9hcnJheSkgPT09IGZhbHNlKSB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdSBtdXN0IHNlbGVjdCBhdCBsZWFzdCBvbmUgYW5hbHlzaXMgcHJvZ3JhbVwiO1xuICB9XG4gIHJldHVybihlcnJvcl9tZXNzYWdlKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9mb3Jtcy9mb3Jtc19pbmRleC5qcyIsIi8vYmVmb3JlIGEgcmVzdWJtaXNzaW9uIGlzIHNlbnQgYWxsIHZhcmlhYmxlcyBhcmUgcmVzZXQgdG8gdGhlIHBhZ2UgZGVmYXVsdHNcbmV4cG9ydCBmdW5jdGlvbiBjbGVhcl9zZXR0aW5ncygpe1xuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMik7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCgnZG93bmxvYWRfbGlua3MnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgUFNJUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLG51bGwpO1xuICByYWN0aXZlLnNldCgnZGlzb3ByZWRfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBESVNPUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF93YWl0aW5nX2ljb24nLCAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIi8+Jyk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVNBVC1TVk0gam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3dhaXRpbmdfaWNvbicsICc8b2JqZWN0IHdpZHRoPVwiMTQwXCIgaGVpZ2h0PVwiMTQwXCIgdHlwZT1cImltYWdlL3N2Zyt4bWxcIiBkYXRhPVwiJytnZWFyc19zdmcrJ1wiLz4nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3NjaGVtYXRpYycsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9jYXJ0b29uJywgJycpO1xuICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgcEdlblRIUkVBREVSIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl93YWl0aW5nX2ljb24nLCAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIi8+Jyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fdGFibGUnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VuX3NldCcsIHt9KTtcblxuICAvL3JhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuXG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdiYXRjaF91dWlkJyxudWxsKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5zZXF1ZW5jZV9wbG90Jyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYucHNpcHJlZF9jYXJ0b29uJyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYuY29tYl9wbG90Jyk7XG5cbiAgemlwID0gbmV3IEpTWmlwKCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyJdLCJzb3VyY2VSb290IjoiIn0=