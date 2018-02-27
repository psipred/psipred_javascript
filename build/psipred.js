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
/* unused harmony export get_memsat_ranges */
/* harmony export (immutable) */ __webpack_exports__["a"] = parse_ss2;
/* harmony export (immutable) */ __webpack_exports__["b"] = parse_pbdat;
/* harmony export (immutable) */ __webpack_exports__["c"] = parse_comb;
/* harmony export (immutable) */ __webpack_exports__["d"] = parse_memsatdata;
/* harmony export (immutable) */ __webpack_exports__["e"] = parse_presult;

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
  } else if (match[1].includes('-')) {
    console.log(match[1]);
    let seg = match[1].split('-');
    let regions = [[]];
    regions[0][0] = parseInt(seg[0]);
    regions[0][1] = parseInt(seg[1]);
    return regions;
  }
  return match[1];
}

// take and ss2 (file) and parse the details and write the new annotation grid
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

//take the disopred pbdat file, parse it and add the annotations to the annotation grid
function parse_pbdat(ractive, file) {
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

//parse the disopred comb file and add it to the annotation grid
function parse_comb(ractive, file) {
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

//parse the memsat output
function parse_memsatdata(ractive, file) {
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

function parse_presult(ractive, file, type) {
  let lines = file.split('\n');
  //console.log(type+'_ann_set');
  let ann_list = ractive.get(type + '_ann_set');
  //console.log(ann_list);
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
      let entries = line.split(/\s+/);
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
        pseudo_table += "<td><input class='button' type='button' onClick='psipred.loadNewAlignment(\"" + ann_list[entries[9] + "_" + i].aln + "\",\"" + ann_list[entries[9] + "_" + i].ann + "\",\"" + (entries[9] + "_" + i) + "\");' value='Display Alignment' /></td>";
        pseudo_table += "<td><input class='button' type='button' onClick='psipred.buildModel(\"" + ann_list[entries[9] + "_" + i].aln + "\");' value='Build Model' /></td>";
        pseudo_table += "</tr>\n";
      }
    });
    pseudo_table += "</tbody></table>\n";
    ractive.set(type + "_table", pseudo_table);
  } else {
    ractive.set(type + "_table", "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>");
  }
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
/* harmony export (immutable) */ __webpack_exports__["d"] = clear_settings;
/* harmony export (immutable) */ __webpack_exports__["a"] = prepare_downloads_html;
/* harmony export (immutable) */ __webpack_exports__["b"] = handle_results;
/* harmony export (immutable) */ __webpack_exports__["c"] = set_downloads_panel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(3);


//before a resubmission is sent all variables are reset to the page defaults
function clear_settings(ractive, gear_string) {
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  ractive.set('psipred_waiting_message', '<h2>Please wait for your PSIPRED job to process</h2>');
  ractive.set('psipred_waiting_icon', gear_string);
  ractive.set('psipred_time', 'Loading Data');
  ractive.set('psipred_horiz', null);
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
  ractive.set('annotations', null);
  ractive.set('batch_uuid', null);
  biod3.clearSelection('div.sequence_plot');
  biod3.clearSelection('div.psipred_cartoon');
  biod3.clearSelection('div.comb_plot');

  zip = new JSZip();
}

//Take a couple of variables and prepare the html strings for the downloads panel
function prepare_downloads_html(data, downloads_info) {
  if (data.job_name.includes('psipred')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
  }
  if (data.job_name.includes('disopred')) {
    downloads_info.disopred = {};
    downloads_info.disopred.header = "<h5>DisoPredD DOWNLOADS</h5>";
  }
  if (data.job_name.includes('memsatsvm')) {
    downloads_info.memsatsvm = {};
    downloads_info.memsatsvm.header = "<h5>MEMSATSVM DOWNLOADS</h5>";
  }
  if (data.job_name.includes('pgenthreader')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pgenthreader = {};
    downloads_info.pgenthreader.header = "<h5>pGenTHREADER DOWNLOADS</h5>";
  }
  if (data.job_name.includes('mempack')) {
    downloads_info.memsatsvm = {};
    downloads_info.memsatsvm.header = "<h5>MEMSATSVM DOWNLOADS</h5>";
    downloads_info.mempack = {};
    downloads_info.mempack.header = "<h5>MEMPACK DOWNLOADS</h5>";
  }
  if (data.job_name.includes('genthreader')) {
    downloads_info.genthreader = {};
    downloads_info.genthreader.header = "<h5>GenTHREADER DOWNLOADS</h5>";
  }
  if (data.job_name.includes('dompred')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.dompred = {};
    downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
  }
  if (data.job_name.includes('pdomthreader')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pdomthreader = {};
    downloads_info.pdomthreader.header = "<h5>pDomTHREADER DOWNLOADS</h5>";
  }
  if (data.job_name.includes('bioserf')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pgenthreader = {};
    downloads_info.pgenthreader.header = "<h5>pGenTHREADER DOWNLOADS</h5>";
    downloads_info.bioserf = {};
    downloads_info.bioserf.header = "<h5>BioSerf DOWNLOADS</h5>";
  }
  if (data.job_name.includes('domserf')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.pdomthreader = {};
    downloads_info.pdomthreader.header = "<h5>pDomTHREADER DOWNLOADS</h5>";
    downloads_info.domserf = {};
    downloads_info.domserf.header = "<h5>DomSerf DOWNLOADS</h5>";
  }
  if (data.job_name.includes('ffpred')) {
    downloads_info.disopred = {};
    downloads_info.disopred.header = "<h5>DisoPredD DOWNLOADS</h5>";
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.dompred = {};
    downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
    downloads_info.ffpred = {};
    downloads_info.ffpred.header = "<h5>FFPred DOWNLOADS</h5>";
  }
  if (data.job_name.includes('metapsicov')) {
    downloads_info.psipred = {};
    downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
    downloads_info.metapsicov = {};
    downloads_info.metapsicov.header = "<h5>MetaPSICOV DOWNLOADS</h5>";
  }
  if (data.job_name.includes('metsite')) {
    downloads_info.metsite = {};
    downloads_info.metsite.header = "<h5>Metsite DOWNLOADS</h5>";
  }
  if (data.job_name.includes('hspred')) {
    downloads_info.hspred = {};
    downloads_info.hspred.header = "<h5>HSPred DOWNLOADS</h5>";
  }
  if (data.job_name.includes('memembed')) {
    downloads_info.memembed = {};
    downloads_info.memembed.header = "<h5>MEMEMBED DOWNLOADS</h5>";
  }
  if (data.job_name.includes('gentdb')) {
    downloads_info.gentdb = {};
    downloads_info.gentdb.header = "<h5>TDB DOWNLOAD</h5>";
  }
}

//take the datablob we've got and loop over the results
function handle_results(ractive, data, file_url, zip, downloads_info) {
  let horiz_regex = /\.horiz$/;
  let ss2_regex = /\.ss2$/;
  let memsat_cartoon_regex = /_cartoon_memsat_svm\.png$/;
  let memsat_schematic_regex = /_schematic\.png$/;
  let memsat_data_regex = /memsat_svm$/;
  let mempack_cartoon_regex = /Kamada-Kawai_\d+.png$/;
  let mempack_graph_out = /input_graph.out$/;
  let mempack_contact_res = /CONTACT_DEF1.results$/;
  let mempack_lipid_res = /LIPID_EXPOSURE.results$/;
  let mempack_result_found = false;

  let image_regex = '';
  let results = data.results;
  for (let i in results) {
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
    if (result_dict.name === 'gen_genalignment_annotation') {
      let ann_set = ractive.get("gen_ann_set");
      let tmp = result_dict.data_path;
      let path = tmp.substr(0, tmp.lastIndexOf("."));
      let id = path.substr(path.lastIndexOf(".") + 1, path.length);
      ann_set[id] = {};
      ann_set[id].ann = path + ".ann";
      ann_set[id].aln = path + ".aln";
      ractive.set("gen_ann_set", ann_set);
    }
  }
  console.log(results);
  for (let i in results) {
    let result_dict = results[i];
    //psipred files
    if (result_dict.name == 'psipass2') {
      let match = horiz_regex.exec(result_dict.data_path);
      if (match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'horiz', zip, ractive);
        ractive.set("psipred_waiting_message", '');
        downloads_info.psipred.horiz = '<a href="' + file_url + result_dict.data_path + '">Horiz Format Output</a><br />';
        ractive.set("psipred_waiting_icon", '');
        ractive.set("psipred_time", '');
      }
      let ss2_match = ss2_regex.exec(result_dict.data_path);
      if (ss2_match) {
        downloads_info.psipred.ss2 = '<a href="' + file_url + result_dict.data_path + '">SS2 Format Output</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'ss2', zip, ractive);
      }
    }
    //disopred files
    if (result_dict.name === 'diso_format') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'pbdat', zip, ractive);
      ractive.set("disopred_waiting_message", '');
      downloads_info.disopred.pbdat = '<a href="' + file_url + result_dict.data_path + '">PBDAT Format Output</a><br />';
      ractive.set("disopred_waiting_icon", '');
      ractive.set("disopred_time", '');
    }
    if (result_dict.name === 'diso_combine') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'comb', zip, ractive);
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'memsatdata', zip, ractive);
        downloads_info.memsatsvm.data = '<a href="' + file_url + result_dict.data_path + '">Memsat Output</a><br />';
      }
    }
    if (result_dict.name === 'mempack_wrapper') {
      ractive.set("mempack_waiting_message", '');
      ractive.set("mempack_waiting_icon", '');
      ractive.set("mempack_time", '');
      let cartoon_match = mempack_cartoon_regex.exec(result_dict.data_path);
      if (cartoon_match) {
        mempack_result_found = true;
        ractive.set('mempack_cartoon', '<img width="1000px" src="' + file_url + result_dict.data_path + '" />');
        downloads_info.mempack.cartoon = '<a href="' + file_url + result_dict.data_path + '">Cartoon Diagram</a><br />';
      }
      let graph_match = mempack_graph_out.exec(result_dict.data_path);
      if (graph_match) {
        downloads_info.mempack.graph_out = '<a href="' + file_url + result_dict.data_path + '">Diagram Data</a><br />';
      }
      let contact_match = mempack_contact_res.exec(result_dict.data_path);
      if (contact_match) {
        downloads_info.mempack.contact = '<a href="' + file_url + result_dict.data_path + '">Contact Predictions</a><br />';
      }
      let lipid_match = mempack_lipid_res.exec(result_dict.data_path);
      if (lipid_match) {
        downloads_info.mempack.lipid_out = '<a href="' + file_url + result_dict.data_path + '">Lipid Exposure Preditions</a><br />';
      }
    }
    if (result_dict.name === 'sort_presult') {
      ractive.set("pgenthreader_waiting_message", '');
      ractive.set("pgenthreader_waiting_icon", '');
      ractive.set("pgenthreader_time", '');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'presult', zip, ractive);
      downloads_info.pgenthreader.table = '<a href="' + file_url + result_dict.data_path + '">pGenTHREADER Table</a><br />';
    }
    if (result_dict.name === 'gen_sort_presults') {
      ractive.set("genthreader_waiting_message", '');
      ractive.set("genthreader_waiting_icon", '');
      ractive.set("genthreader_time", '');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'gen_presult', zip, ractive);
      downloads_info.genthreader.table = '<a href="' + file_url + result_dict.data_path + '">GenTHREADER Table</a><br />';
    }

    if (result_dict.name === 'pseudo_bas_align') {
      downloads_info.pgenthreader.align = '<a href="' + file_url + result_dict.data_path + '">pGenTHREADER Alignments</a><br />';
    }
    if (result_dict.name === 'genthreader_pseudo_bas_align') {
      downloads_info.genthreader.align = '<a href="' + file_url + result_dict.data_path + '">GenTHREADER Alignments</a><br />';
    }
  }
  if (!mempack_result_found) {
    ractive.set('mempack_cartoon', '<h3>No packing prediction possible</h3>');
  }
}

function set_downloads_panel(ractive, downloads_info) {
  console.log(downloads_info);
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
  if ('genthreader' in downloads_info) {
    downloads_string = downloads_string.concat(downloads_info.genthreader.header);
    downloads_string = downloads_string.concat(downloads_info.genthreader.table);
    downloads_string = downloads_string.concat(downloads_info.genthreader.align);
    downloads_string = downloads_string.concat("<br />");
  }
  if ('mempack' in downloads_info) {
    downloads_string = downloads_string.concat(downloads_info.mempack.header);
    if (downloads_info.mempack.cartoon) {
      downloads_string = downloads_string.concat(downloads_info.mempack.cartoon);
      downloads_string = downloads_string.concat(downloads_info.mempack.graph_out);
      downloads_string = downloads_string.concat(downloads_info.mempack.contact);
      downloads_string = downloads_string.concat(downloads_info.mempack.lipid_out);
    } else {
      downloads_string = downloads_string.concat("No packing prediction possible<br />");
    }
    downloads_string = downloads_string.concat("<br />");
  }

  ractive.set('download_links', downloads_string);
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = send_request;
/* harmony export (immutable) */ __webpack_exports__["d"] = send_job;
/* harmony export (immutable) */ __webpack_exports__["b"] = get_previous_data;
/* harmony export (immutable) */ __webpack_exports__["c"] = process_file;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__ = __webpack_require__(0);







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
      alert("Sending Job to " + url + " Failed. " + error.responseText + ". The Backend processing service was unable to process your submission. Please contact psipred@cs.ucl.ac.uk");return null;
    } }).responseJSON;
  return response;
}

//given a job name prep all the form elements and send an http request to the
//backend
function send_job(ractive, job_name, seq, name, email, submit_url, times_url) {
  //alert(seq);
  console.log("Sending form data");
  console.log(job_name);
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
      alert("Gettings results text failed. The Backend processing service is not available. Please contact psipred@cs.ucl.ac.uk");
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["b" /* parse_pbdat */])(ractive, file);
        //alert('PBDAT process');
      }
      if (ctl === 'comb') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["c" /* parse_comb */])(ractive, file);
      }
      if (ctl === 'memsatdata') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["d" /* parse_memsatdata */])(ractive, file);
      }
      if (ctl === 'presult') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["e" /* parse_presult */])(ractive, file, 'pgen');
      }
      if (ctl === 'gen_presult') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["e" /* parse_presult */])(ractive, file, 'gen');
      }
    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loadNewAlignment"] = loadNewAlignment;
/* harmony export (immutable) */ __webpack_exports__["buildModel"] = buildModel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_common_index_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__ = __webpack_require__(2);
/* 1. Catch form input
     2. Verify form
     3. If good then make file from data and pass to backend
     4. shrink form away
     5. Open seq panel
     6. Show processing animation
     7. listen for result
*/










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
let gear_string = '<object width="140" height="140" type="image/svg+xml" data="' + gears_svg + '"></object>';

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
    annotations: null
  }
});

//set some things on the page for the development server
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["a" /* prepare_downloads_html */])(data, downloads_info);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["b" /* handle_results */])(ractive, data, file_url, zip, downloads_info);
      });
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["c" /* set_downloads_panel */])(ractive, downloads_info);

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

// On clicking the Get Zip file link this watchers prepares the zip and hands it to the user
ractive.on('get_zip', function (context) {
  let uuid = ractive.get('batch_uuid');
  zip.generateAsync({ type: "blob" }).then(function (blob) {
    saveAs(blob, uuid + ".zip");
  });
});

// These react to the headers being clicked to toggle the results panel
//
ractive.on('sequence_active', function (event) {
  ractive.set('structure_form_visible', null);
  ractive.set('structure_form_visible', 0);
  ractive.set('psipred_checked', true);
  ractive.set('disopred_checked', false);
  ractive.set('memsatsvm_checked', false);
  ractive.set('pgenthreader_checked', false);
  ractive.set('mempack_checked', false);
  ractive.set('genthreader_checked', false);
  ractive.set('dompred_checked', false);
  ractive.set('pdomthreader_checked', false);
  ractive.set('bioserf_checked', false);
  ractive.set('domserf_checked', false);
  ractive.set('ffpred_checked', false);
  ractive.set('metapsicov_checked', false);
  ractive.set('metsite_checked', false);
  ractive.set('hspred_checked', false);
  ractive.set('memembed_checked', false);
  ractive.set('gentdb_checked', false);
  ractive.set('sequence_form_visible', null);
  ractive.set('sequence_form_visible', 1);
});
ractive.on('structure_active', function (event) {
  ractive.set('sequence_form_visible', null);
  ractive.set('sequence_form_visible', 0);
  ractive.set('psipred_checked', false);
  ractive.set('disopred_checked', false);
  ractive.set('memsatsvm_checked', false);
  ractive.set('pgenthreader_checked', false);
  ractive.set('mempack_checked', false);
  ractive.set('genthreader_checked', false);
  ractive.set('dompred_checked', false);
  ractive.set('pdomthreader_checked', false);
  ractive.set('bioserf_checked', false);
  ractive.set('domserf_checked', false);
  ractive.set('ffpred_checked', false);
  ractive.set('metapsicov_checked', false);
  ractive.set('metsite_checked', false);
  ractive.set('hspred_checked', false);
  ractive.set('memembed_checked', false);
  ractive.set('gentdb_checked', false);
  ractive.set('structure_form_visible', null);
  ractive.set('structure_form_visible', 1);
});

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
ractive.on('mempack_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 5);
});
ractive.on('genthreader_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 7);
});
ractive.on('dompred_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 8);
});
ractive.on('pdomthreader_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 9);
});
ractive.on('bioserf_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 10);
});
ractive.on('domserf_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 12);
});
ractive.on('ffpred_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 13);
});
ractive.on('metapsicov_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 18);
});
ractive.on('metsite_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 14);
});
ractive.on('hspred_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 15);
});
ractive.on('memembed_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 16);
});
ractive.on('gentdb_active', function (event) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', 17);
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

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked, pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked, metsite_checked, hspred_checked, memembed_checked, gentdb_checked);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* clear_settings */])(ractive, gear_string);
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, subsequence, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked, pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked, metsite_checked, hspred_checked, memembed_checked, gentdb_checked);
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
  let previous_data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__["b" /* get_previous_data */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_common_index_js__["a" /* getUrlVars */])().uuid, submit_url, file_url, ractive);
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
  if (previous_data.jobs.includes('mempack')) {
    ractive.set('memsatsvm_button', true);
    ractive.set('mempack_button', true);
    ractive.set('results_panel_visible', 5);
  }
  if (previous_data.jobs.includes('genthreader')) {
    ractive.set('genthreader_button', true);
    ractive.set('results_panel_visible', 7);
  }
  if (previous_data.jobs.includes('dompred')) {
    ractive.set('psipred_button', true);
    ractive.set('dompred_button', true);
    ractive.set('results_panel_visible', 8);
  }
  if (previous_data.jobs.includes('pdomthreader')) {
    ractive.set('psipred_button', true);
    ractive.set('pdomthreader_button', true);
    ractive.set('results_panel_visible', 9);
  }
  if (previous_data.jobs.includes('bioserf')) {
    ractive.set('psipred_button', true);
    ractive.set('pgenthreader_button', true);
    ractive.set('bioserf_button', true);
    ractive.set('results_panel_visible', 10);
  }
  if (previous_data.jobs.includes('domserf')) {
    ractive.set('psipred_button', true);
    ractive.set('pdomthreader_button', true);
    ractive.set('results_panel_visible', 12);
  }
  if (previous_data.jobs.includes('ffpred')) {
    ractive.set('psipred_button', true);
    ractive.set('disopred_button', true);
    ractive.set('results_panel_visible', 13);
  }
  if (previous_data.jobs.includes('metsite')) {
    ractive.set('metsite_button', true);
    ractive.set('results_panel_visible', 14);
  }
  if (previous_data.jobs.includes('hspred')) {
    ractive.set('hspred_button', true);
    ractive.set('results_panel_visible', 15);
  }
  if (previous_data.jobs.includes('memembed')) {
    ractive.set('memembed_button', true);
    ractive.set('results_panel_visible', 16);
  }
  if (previous_data.jobs.includes('gentdb')) {
    ractive.set('gentdb_button', true);
    ractive.set('results_panel_visible', 17);
  }
  if (previous_data.jobs.includes('metapsicov')) {
    ractive.set('metapsicov_button', true);
    ractive.set('results_panel_visible', 18);
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = verify_and_send_form;
/* unused harmony export verify_form */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_common_index_js__ = __webpack_require__(1);




//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked, pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked, metsite_checked, hspred_checked, memembed_checked, gentdb_checked) {
  /*verify that everything here is ok*/
  let error_message = null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked, pgenthreader_checked, mempack_checked, genthreader_checked, dompred_checked, pdomthreader_checked, bioserf_checked, domserf_checked, ffpred_checked, metapsicov_checked, metsite_checked, hspred_checked, memembed_checked, gentdb_checked]);
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
    if (mempack_checked === true) {
      job_string = job_string.concat("mempack,");
      ractive.set('mempack_button', true);
      ractive.set('memsatsvm_button', true);
    }
    if (genthreader_checked === true) {
      job_string = job_string.concat("genthreader,");
      ractive.set('genthreader_button', true);
    }
    if (dompred_checked === true) {
      job_string = job_string.concat("dompred,");
      ractive.set('dompred_button', true);
    }
    if (pdomthreader_checked === true) {
      job_string = job_string.concat("pdomthreader,");
      ractive.set('pdomthreader_button', true);
    }
    if (bioserf_checked === true) {
      job_string = job_string.concat("bioserf,");
      ractive.set('bioserf_button', true);
    }
    if (domserf_checked === true) {
      job_string = job_string.concat("domserf,");
      ractive.set('domserf_button', true);
    }
    if (ffpred_checked === true) {
      job_string = job_string.concat("ffpred,");
      ractive.set('ffpred_button', true);
    }
    if (metapsicov_checked === true) {
      job_string = job_string.concat("metapsicov,");
      ractive.set('metapsicov_button', true);
    }
    if (metsite_checked === true) {
      job_string = job_string.concat("metsite,");
      ractive.set('metsite_button', true);
    }
    if (hspred_checked === true) {
      job_string = job_string.concat("hspred,");
      ractive.set('hspred_button', true);
    }
    if (memembed_checked === true) {
      job_string = job_string.concat("memembed,");
      ractive.set('memembed_button', true);
    }
    if (gentdb_checked === true) {
      job_string = job_string.concat("gentdb,");
      ractive.set('gentdb_button', true);
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
    } else if (mempack_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('mempack_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (genthreader_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('genthreader_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (dompred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('dompred_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (pdomthreader_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('pdomthreader_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (bioserf_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('bioserf_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (domserf_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('domserf_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (ffpred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('ffpred_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (metapsicov_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('metapsicov_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (metsite_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('metsite_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (hspred_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('hspred_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (memembed_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('memembed_active');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
    } else if (gentdb_checked === true && response) {
      ractive.set('results_visible', 2);
      ractive.fire('gentdb_active');
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGE4NzQyODFjODFmMGYxOTUyNGQiLCJ3ZWJwYWNrOi8vLy4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tbW9uL2NvbW1vbl9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Zvcm1zL2Zvcm1zX2luZGV4LmpzIl0sIm5hbWVzIjpbImdldF9tZW1zYXRfcmFuZ2VzIiwicmVnZXgiLCJkYXRhIiwibWF0Y2giLCJleGVjIiwiaW5jbHVkZXMiLCJyZWdpb25zIiwic3BsaXQiLCJmb3JFYWNoIiwicmVnaW9uIiwiaSIsInBhcnNlSW50IiwiY29uc29sZSIsImxvZyIsInNlZyIsInBhcnNlX3NzMiIsInJhY3RpdmUiLCJmaWxlIiwiYW5ub3RhdGlvbnMiLCJnZXQiLCJsaW5lcyIsInNoaWZ0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImxpbmUiLCJlbnRyaWVzIiwic3MiLCJzZXQiLCJiaW9kMyIsImFubm90YXRpb25HcmlkIiwicGFyZW50IiwibWFyZ2luX3NjYWxlciIsImRlYnVnIiwiY29udGFpbmVyX3dpZHRoIiwid2lkdGgiLCJoZWlnaHQiLCJjb250YWluZXJfaGVpZ2h0IiwiYWxlcnQiLCJwYXJzZV9wYmRhdCIsImRpc29wcmVkIiwicGFyc2VfY29tYiIsInByZWNpc2lvbiIsInBvcyIsImdlbmVyaWN4eUxpbmVDaGFydCIsImNoYXJ0VHlwZSIsInlfY3V0b2ZmIiwicGFyc2VfbWVtc2F0ZGF0YSIsInNlcSIsInRvcG9fcmVnaW9ucyIsInNpZ25hbF9yZWdpb25zIiwicmVlbnRyYW50X3JlZ2lvbnMiLCJ0ZXJtaW5hbCIsImNvaWxfdHlwZSIsInRtcF9hbm5vIiwiQXJyYXkiLCJwcmV2X2VuZCIsImZpbGwiLCJhbm5vIiwibWVtc2F0IiwicGFyc2VfcHJlc3VsdCIsInR5cGUiLCJhbm5fbGlzdCIsIk9iamVjdCIsImtleXMiLCJwc2V1ZG9fdGFibGUiLCJ0b0xvd2VyQ2FzZSIsInBkYiIsInN1YnN0cmluZyIsImFsbiIsImFubiIsImlzSW5BcnJheSIsInZhbHVlIiwiYXJyYXkiLCJpbmRleE9mIiwiZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIiwicmVzaWR1ZXMiLCJyZXMiLCJwdXNoIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJwYXJ0cyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJtIiwia2V5IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbXBvcnRhbnQiLCJzdHlsZSIsImdldEVtUGl4ZWxzIiwiZWxlbWVudCIsImV4dHJhQm9keSIsImNyZWF0ZUVsZW1lbnQiLCJjc3NUZXh0IiwiaW5zZXJ0QmVmb3JlIiwiYm9keSIsInRlc3RFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwiY2xlYXJfc2V0dGluZ3MiLCJnZWFyX3N0cmluZyIsImNsZWFyU2VsZWN0aW9uIiwiemlwIiwiSlNaaXAiLCJwcmVwYXJlX2Rvd25sb2Fkc19odG1sIiwiZG93bmxvYWRzX2luZm8iLCJqb2JfbmFtZSIsInBzaXByZWQiLCJoZWFkZXIiLCJtZW1zYXRzdm0iLCJwZ2VudGhyZWFkZXIiLCJtZW1wYWNrIiwiZ2VudGhyZWFkZXIiLCJkb21wcmVkIiwicGRvbXRocmVhZGVyIiwiYmlvc2VyZiIsImRvbXNlcmYiLCJmZnByZWQiLCJtZXRhcHNpY292IiwibWV0c2l0ZSIsImhzcHJlZCIsIm1lbWVtYmVkIiwiZ2VudGRiIiwiaGFuZGxlX3Jlc3VsdHMiLCJmaWxlX3VybCIsImhvcml6X3JlZ2V4Iiwic3MyX3JlZ2V4IiwibWVtc2F0X2NhcnRvb25fcmVnZXgiLCJtZW1zYXRfc2NoZW1hdGljX3JlZ2V4IiwibWVtc2F0X2RhdGFfcmVnZXgiLCJtZW1wYWNrX2NhcnRvb25fcmVnZXgiLCJtZW1wYWNrX2dyYXBoX291dCIsIm1lbXBhY2tfY29udGFjdF9yZXMiLCJtZW1wYWNrX2xpcGlkX3JlcyIsIm1lbXBhY2tfcmVzdWx0X2ZvdW5kIiwiaW1hZ2VfcmVnZXgiLCJyZXN1bHRzIiwicmVzdWx0X2RpY3QiLCJuYW1lIiwiYW5uX3NldCIsInRtcCIsImRhdGFfcGF0aCIsInBhdGgiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImlkIiwicHJvY2Vzc19maWxlIiwiaG9yaXoiLCJzczJfbWF0Y2giLCJzczIiLCJwYmRhdCIsImNvbWIiLCJzY2hlbWVfbWF0Y2giLCJzY2hlbWF0aWMiLCJjYXJ0b29uX21hdGNoIiwiY2FydG9vbiIsIm1lbXNhdF9tYXRjaCIsImdyYXBoX21hdGNoIiwiZ3JhcGhfb3V0IiwiY29udGFjdF9tYXRjaCIsImNvbnRhY3QiLCJsaXBpZF9tYXRjaCIsImxpcGlkX291dCIsInRhYmxlIiwiYWxpZ24iLCJzZXRfZG93bmxvYWRzX3BhbmVsIiwiZG93bmxvYWRzX3N0cmluZyIsImNvbmNhdCIsInNlbmRfcmVxdWVzdCIsInVybCIsInNlbmRfZGF0YSIsInJlc3BvbnNlIiwiJCIsImFqYXgiLCJjYWNoZSIsImNvbnRlbnRUeXBlIiwicHJvY2Vzc0RhdGEiLCJhc3luYyIsImRhdGFUeXBlIiwic3VjY2VzcyIsImVycm9yIiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2VKU09OIiwic2VuZF9qb2IiLCJlbWFpbCIsInN1Ym1pdF91cmwiLCJ0aW1lc191cmwiLCJ1cHBlcl9uYW1lIiwidG9VcHBlckNhc2UiLCJCbG9iIiwiZSIsImZkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZV9kYXRhIiwidGltZXMiLCJrIiwiZmlyZSIsImdldF9wcmV2aW91c19kYXRhIiwidXVpZCIsInN1Ym1pc3Npb25fcmVzcG9uc2UiLCJnZXRfdGV4dCIsInN1Ym1pc3Npb25zIiwiaW5wdXRfZmlsZSIsImpvYnMiLCJzdWJtaXNzaW9uIiwic2xpY2UiLCJzdWJtaXNzaW9uX25hbWUiLCJ1cmxfc3R1YiIsImN0bCIsInBhdGhfYml0cyIsImZvbGRlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGlwYm9hcmQiLCJDbGlwYm9hcmQiLCJvbiIsImVuZHBvaW50c191cmwiLCJnZWFyc19zdmciLCJtYWluX3VybCIsImFwcF9wYXRoIiwiaG9zdG5hbWUiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsInNlcXVlbmNlX2Zvcm1fdmlzaWJsZSIsInN0cnVjdHVyZV9mb3JtX3Zpc2libGUiLCJyZXN1bHRzX3Zpc2libGUiLCJyZXN1bHRzX3BhbmVsX3Zpc2libGUiLCJzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlIiwibW9kZWxsZXJfa2V5IiwicHNpcHJlZF9jaGVja2VkIiwicHNpcHJlZF9idXR0b24iLCJkaXNvcHJlZF9jaGVja2VkIiwiZGlzb3ByZWRfYnV0dG9uIiwibWVtc2F0c3ZtX2NoZWNrZWQiLCJtZW1zYXRzdm1fYnV0dG9uIiwicGdlbnRocmVhZGVyX2NoZWNrZWQiLCJwZ2VudGhyZWFkZXJfYnV0dG9uIiwibWVtcGFja19jaGVja2VkIiwibWVtcGFja19idXR0b24iLCJnZW50aHJlYWRlcl9jaGVja2VkIiwiZ2VudGhyZWFkZXJfYnV0dG9uIiwiZG9tcHJlZF9jaGVja2VkIiwiZG9tcHJlZF9idXR0b24iLCJwZG9tdGhyZWFkZXJfY2hlY2tlZCIsInBkb210aHJlYWRlcl9idXR0b24iLCJiaW9zZXJmX2NoZWNrZWQiLCJiaW9zZXJmX2J1dHRvbiIsImRvbXNlcmZfY2hlY2tlZCIsImRvbXNlcmZfYnV0dG9uIiwiZmZwcmVkX2NoZWNrZWQiLCJmZnByZWRfYnV0dG9uIiwibWV0c2l0ZV9jaGVja2VkIiwibWV0c2l0ZV9idXR0b24iLCJoc3ByZWRfY2hlY2tlZCIsImhzcHJlZF9idXR0b24iLCJtZW1lbWJlZF9jaGVja2VkIiwibWVtZW1iZWRfYnV0dG9uIiwiZ2VudGRiX2NoZWNrZWQiLCJnZW50ZGJfYnV0dG9uIiwibWV0YXBzaWNvdl9jaGVja2VkIiwibWV0YXBzaWNvdl9idXR0b24iLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfam9iIiwiZGlzb3ByZWRfam9iIiwibWVtc2F0c3ZtX2pvYiIsInBnZW50aHJlYWRlcl9qb2IiLCJtZW1wYWNrX2pvYiIsImdlbnRocmVhZGVyX2pvYiIsImRvbXByZWRfam9iIiwicGRvbXRocmVhZGVyX2pvYiIsImJpb3NlcmZfam9iIiwiZG9tc2VyZl9qb2IiLCJmZnByZWRfam9iIiwibWV0c2l0ZV9qb2IiLCJoc3ByZWRfam9iIiwibWVtZW1iZWRfam9iIiwiZ2VudGRiX2pvYiIsIm1ldGFwc2ljb3Zfam9iIiwicHNpcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJwc2lwcmVkX3dhaXRpbmdfaWNvbiIsInBzaXByZWRfdGltZSIsInBzaXByZWRfaG9yaXoiLCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJkaXNvcHJlZF93YWl0aW5nX2ljb24iLCJkaXNvcHJlZF90aW1lIiwiZGlzb19wcmVjaXNpb24iLCJtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlIiwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvbiIsIm1lbXNhdHN2bV90aW1lIiwibWVtc2F0c3ZtX3NjaGVtYXRpYyIsIm1lbXNhdHN2bV9jYXJ0b29uIiwicGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZSIsInBnZW50aHJlYWRlcl93YWl0aW5nX2ljb24iLCJwZ2VudGhyZWFkZXJfdGltZSIsInBnZW5fdGFibGUiLCJwZ2VuX2Fubl9zZXQiLCJtZW1wYWNrX3dhaXRpbmdfbWVzc2FnZSIsIm1lbXBhY2tfd2FpdGluZ19pY29uIiwibWVtcGFja190aW1lIiwibWVtc2F0cGFja19zY2hlbWF0aWMiLCJtZW1zYXRwYWNrX2NhcnRvb24iLCJnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2UiLCJnZW50aHJlYWRlcl93YWl0aW5nX2ljb24iLCJnZW50aHJlYWRlcl90aW1lIiwiZ2VuX3RhYmxlIiwiZ2VuX2Fubl9zZXQiLCJkb21wcmVkX3dhaXRpbmdfbWVzc2FnZSIsImRvbXByZWRfd2FpdGluZ19pY29uIiwiZG9tcHJlZF90aW1lIiwiZG9tcHJlZF9kYXRhIiwicGRvbXRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZSIsInBkb210aHJlYWRlcl93YWl0aW5nX2ljb24iLCJwZG9tdGhyZWFkZXJfdGltZSIsInBkb210aHJlYWRlcl9kYXRhIiwiYmlvc2VyZl93YWl0aW5nX21lc3NhZ2UiLCJiaW9zZXJmX3dhaXRpbmdfaWNvbiIsImJpb3NlcmZfdGltZSIsImJpb3NlcmZfZGF0YSIsImRvbXNlcmZfd2FpdGluZ19tZXNzYWdlIiwiZG9tc2VyZl93YWl0aW5nX2ljb24iLCJkb21zZXJmX3RpbWUiLCJkb21zZXJmX2RhdGEiLCJmZnByZWRfd2FpdGluZ19tZXNzYWdlIiwiZmZwcmVkX3dhaXRpbmdfaWNvbiIsImZmcHJlZF90aW1lIiwiZmZwcmVkX2RhdGEiLCJtZXRhcHNpY292X3dhaXRpbmdfbWVzc2FnZSIsIm1ldGFwc2ljb3Zfd2FpdGluZ19pY29uIiwibWV0YXBzaWNvdl90aW1lIiwibWV0YXBzaWNvdl9kYXRhIiwibWV0c2l0ZV93YWl0aW5nX21lc3NhZ2UiLCJtZXRzaXRlX3dhaXRpbmdfaWNvbiIsIm1ldHNpdGVfdGltZSIsIm1ldHNpdGVfZGF0YSIsImhzcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJoc3ByZWRfd2FpdGluZ19pY29uIiwiaHNwcmVkX3RpbWUiLCJoc3ByZWRfZGF0YSIsIm1lbWVtYmVkX3dhaXRpbmdfbWVzc2FnZSIsIm1lbWVtYmVkX3dhaXRpbmdfaWNvbiIsIm1lbWVtYmVkX3RpbWUiLCJtZW1lbWJlZF9kYXRhIiwiZ2VudGRiX3dhaXRpbmdfbWVzc2FnZSIsImdlbnRkYl93YWl0aW5nX2ljb24iLCJnZW50ZGJfdGltZSIsImdlbnRkYl9kYXRhIiwic2VxdWVuY2UiLCJzZXF1ZW5jZV9sZW5ndGgiLCJzdWJzZXF1ZW5jZV9zdGFydCIsInN1YnNlcXVlbmNlX3N0b3AiLCJiYXRjaF91dWlkIiwidXVpZF9yZWdleCIsInV1aWRfbWF0Y2giLCJzZXFfb2JzZXJ2ZXIiLCJvYnNlcnZlIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsImluaXQiLCJkZWZlciIsInNlcV9sZW5ndGgiLCJzZXFfc3RhcnQiLCJzZXFfc3RvcCIsImpvYl90eXBlIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJiYXRjaCIsInN0YXRlIiwiY2xlYXJJbnRlcnZhbCIsInN1Ym1pc3Npb25fbWVzc2FnZSIsImxhc3RfbWVzc2FnZSIsImNvbnRleHQiLCJnZW5lcmF0ZUFzeW5jIiwidGhlbiIsImJsb2IiLCJzYXZlQXMiLCJldmVudCIsInZlcmlmeV9hbmRfc2VuZF9mb3JtIiwib3JpZ2luYWwiLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Iiwic3RvcCIsInN1YnNlcXVlbmNlIiwiY2FuY2VsIiwicHJldmlvdXNfZGF0YSIsImxvYWROZXdBbGlnbm1lbnQiLCJhbG5VUkkiLCJhbm5VUkkiLCJ0aXRsZSIsIm9wZW4iLCJidWlsZE1vZGVsIiwibW9kX2tleSIsImVycm9yX21lc3NhZ2UiLCJqb2Jfc3RyaW5nIiwidmVyaWZ5X2Zvcm0iLCJjaGVja2VkX2FycmF5IiwidGVzdCIsIm51Y2xlb3RpZGVfY291bnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQy9EQTtBQUNPLFNBQVNBLGlCQUFULENBQTJCQyxLQUEzQixFQUFrQ0MsSUFBbEMsRUFDUDtBQUNJLE1BQUlDLFFBQVFGLE1BQU1HLElBQU4sQ0FBV0YsSUFBWCxDQUFaO0FBQ0EsTUFBR0MsTUFBTSxDQUFOLEVBQVNFLFFBQVQsQ0FBa0IsR0FBbEIsQ0FBSCxFQUNBO0FBQ0UsUUFBSUMsVUFBVUgsTUFBTSxDQUFOLEVBQVNJLEtBQVQsQ0FBZSxHQUFmLENBQWQ7QUFDQUQsWUFBUUUsT0FBUixDQUFnQixVQUFTQyxNQUFULEVBQWlCQyxDQUFqQixFQUFtQjtBQUNqQ0osY0FBUUksQ0FBUixJQUFhRCxPQUFPRixLQUFQLENBQWEsR0FBYixDQUFiO0FBQ0FELGNBQVFJLENBQVIsRUFBVyxDQUFYLElBQWdCQyxTQUFTTCxRQUFRSSxDQUFSLEVBQVcsQ0FBWCxDQUFULENBQWhCO0FBQ0FKLGNBQVFJLENBQVIsRUFBVyxDQUFYLElBQWdCQyxTQUFTTCxRQUFRSSxDQUFSLEVBQVcsQ0FBWCxDQUFULENBQWhCO0FBQ0QsS0FKRDtBQUtBLFdBQU9KLE9BQVA7QUFDRCxHQVRELE1BVUssSUFBR0gsTUFBTSxDQUFOLEVBQVNFLFFBQVQsQ0FBa0IsR0FBbEIsQ0FBSCxFQUNMO0FBQ0lPLFlBQVFDLEdBQVIsQ0FBWVYsTUFBTSxDQUFOLENBQVo7QUFDQSxRQUFJVyxNQUFNWCxNQUFNLENBQU4sRUFBU0ksS0FBVCxDQUFlLEdBQWYsQ0FBVjtBQUNBLFFBQUlELFVBQVUsQ0FBQyxFQUFELENBQWQ7QUFDQUEsWUFBUSxDQUFSLEVBQVcsQ0FBWCxJQUFnQkssU0FBU0csSUFBSSxDQUFKLENBQVQsQ0FBaEI7QUFDQVIsWUFBUSxDQUFSLEVBQVcsQ0FBWCxJQUFnQkssU0FBU0csSUFBSSxDQUFKLENBQVQsQ0FBaEI7QUFDQSxXQUFPUixPQUFQO0FBQ0g7QUFDRCxTQUFPSCxNQUFNLENBQU4sQ0FBUDtBQUNIOztBQUVEO0FBQ08sU0FBU1ksU0FBVCxDQUFtQkMsT0FBbkIsRUFBNEJDLElBQTVCLEVBQ1A7QUFDSSxNQUFJQyxjQUFjRixRQUFRRyxHQUFSLENBQVksYUFBWixDQUFsQjtBQUNBLE1BQUlDLFFBQVFILEtBQUtWLEtBQUwsQ0FBVyxJQUFYLENBQVo7QUFDQWEsUUFBTUMsS0FBTjtBQUNBRCxVQUFRQSxNQUFNRSxNQUFOLENBQWFDLE9BQWIsQ0FBUjtBQUNBLE1BQUdMLFlBQVlNLE1BQVosSUFBc0JKLE1BQU1JLE1BQS9CLEVBQ0E7QUFDRUosVUFBTVosT0FBTixDQUFjLFVBQVNpQixJQUFULEVBQWVmLENBQWYsRUFBaUI7QUFDN0IsVUFBSWdCLFVBQVVELEtBQUtsQixLQUFMLENBQVcsS0FBWCxDQUFkO0FBQ0FXLGtCQUFZUixDQUFaLEVBQWVpQixFQUFmLEdBQW9CRCxRQUFRLENBQVIsQ0FBcEI7QUFDRCxLQUhEO0FBSUFWLFlBQVFZLEdBQVIsQ0FBWSxhQUFaLEVBQTJCVixXQUEzQjtBQUNBVyxVQUFNQyxjQUFOLENBQXFCWixXQUFyQixFQUFrQyxFQUFDYSxRQUFRLG1CQUFULEVBQThCQyxlQUFlLENBQTdDLEVBQWdEQyxPQUFPLEtBQXZELEVBQThEQyxpQkFBaUIsR0FBL0UsRUFBb0ZDLE9BQU8sR0FBM0YsRUFBZ0dDLFFBQVEsR0FBeEcsRUFBNkdDLGtCQUFrQixHQUEvSCxFQUFsQztBQUNELEdBUkQsTUFVQTtBQUNFQyxVQUFNLHFEQUFOO0FBQ0Q7QUFDRCxTQUFPcEIsV0FBUDtBQUNIOztBQUVEO0FBQ08sU0FBU3FCLFdBQVQsQ0FBcUJ2QixPQUFyQixFQUE4QkMsSUFBOUIsRUFDUDtBQUNJLE1BQUlDLGNBQWNGLFFBQVFHLEdBQVIsQ0FBWSxhQUFaLENBQWxCO0FBQ0EsTUFBSUMsUUFBUUgsS0FBS1YsS0FBTCxDQUFXLElBQVgsQ0FBWjtBQUNBYSxRQUFNQyxLQUFOLEdBQWVELE1BQU1DLEtBQU4sR0FBZUQsTUFBTUMsS0FBTixHQUFlRCxNQUFNQyxLQUFOLEdBQWVELE1BQU1DLEtBQU47QUFDNURELFVBQVFBLE1BQU1FLE1BQU4sQ0FBYUMsT0FBYixDQUFSO0FBQ0EsTUFBR0wsWUFBWU0sTUFBWixJQUFzQkosTUFBTUksTUFBL0IsRUFDQTtBQUNFSixVQUFNWixPQUFOLENBQWMsVUFBU2lCLElBQVQsRUFBZWYsQ0FBZixFQUFpQjtBQUM3QixVQUFJZ0IsVUFBVUQsS0FBS2xCLEtBQUwsQ0FBVyxLQUFYLENBQWQ7QUFDQSxVQUFHbUIsUUFBUSxDQUFSLE1BQWUsR0FBbEIsRUFBc0I7QUFBQ1Isb0JBQVlSLENBQVosRUFBZThCLFFBQWYsR0FBMEIsR0FBMUI7QUFBK0I7QUFDdEQsVUFBR2QsUUFBUSxDQUFSLE1BQWUsR0FBbEIsRUFBc0I7QUFBQ1Isb0JBQVlSLENBQVosRUFBZThCLFFBQWYsR0FBMEIsSUFBMUI7QUFBZ0M7QUFDeEQsS0FKRDtBQUtBeEIsWUFBUVksR0FBUixDQUFZLGFBQVosRUFBMkJWLFdBQTNCO0FBQ0FXLFVBQU1DLGNBQU4sQ0FBcUJaLFdBQXJCLEVBQWtDLEVBQUNhLFFBQVEsbUJBQVQsRUFBOEJDLGVBQWUsQ0FBN0MsRUFBZ0RDLE9BQU8sS0FBdkQsRUFBOERDLGlCQUFpQixHQUEvRSxFQUFvRkMsT0FBTyxHQUEzRixFQUFnR0MsUUFBUSxHQUF4RyxFQUE2R0Msa0JBQWtCLEdBQS9ILEVBQWxDO0FBQ0Q7QUFDSjs7QUFFRDtBQUNPLFNBQVNJLFVBQVQsQ0FBb0J6QixPQUFwQixFQUE2QkMsSUFBN0IsRUFDUDtBQUNFLE1BQUl5QixZQUFZLEVBQWhCO0FBQ0EsTUFBSXRCLFFBQVFILEtBQUtWLEtBQUwsQ0FBVyxJQUFYLENBQVo7QUFDQWEsUUFBTUMsS0FBTixHQUFlRCxNQUFNQyxLQUFOLEdBQWVELE1BQU1DLEtBQU47QUFDOUJELFVBQVFBLE1BQU1FLE1BQU4sQ0FBYUMsT0FBYixDQUFSO0FBQ0FILFFBQU1aLE9BQU4sQ0FBYyxVQUFTaUIsSUFBVCxFQUFlZixDQUFmLEVBQWlCO0FBQzdCLFFBQUlnQixVQUFVRCxLQUFLbEIsS0FBTCxDQUFXLEtBQVgsQ0FBZDtBQUNBbUMsY0FBVWhDLENBQVYsSUFBZSxFQUFmO0FBQ0FnQyxjQUFVaEMsQ0FBVixFQUFhaUMsR0FBYixHQUFtQmpCLFFBQVEsQ0FBUixDQUFuQjtBQUNBZ0IsY0FBVWhDLENBQVYsRUFBYWdDLFNBQWIsR0FBeUJoQixRQUFRLENBQVIsQ0FBekI7QUFDRCxHQUxEO0FBTUFWLFVBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QmMsU0FBOUI7QUFDQWIsUUFBTWUsa0JBQU4sQ0FBeUJGLFNBQXpCLEVBQW9DLEtBQXBDLEVBQTJDLENBQUMsV0FBRCxDQUEzQyxFQUEwRCxDQUFDLE9BQUQsQ0FBMUQsRUFBc0UsYUFBdEUsRUFBcUYsRUFBQ1gsUUFBUSxlQUFULEVBQTBCYyxXQUFXLE1BQXJDLEVBQTZDQyxVQUFVLEdBQXZELEVBQTREZCxlQUFlLENBQTNFLEVBQThFQyxPQUFPLEtBQXJGLEVBQTRGQyxpQkFBaUIsR0FBN0csRUFBa0hDLE9BQU8sR0FBekgsRUFBOEhDLFFBQVEsR0FBdEksRUFBMklDLGtCQUFrQixHQUE3SixFQUFyRjtBQUVEOztBQUVEO0FBQ08sU0FBU1UsZ0JBQVQsQ0FBMEIvQixPQUExQixFQUFtQ0MsSUFBbkMsRUFDUDtBQUNFLE1BQUlDLGNBQWNGLFFBQVFHLEdBQVIsQ0FBWSxhQUFaLENBQWxCO0FBQ0EsTUFBSTZCLE1BQU1oQyxRQUFRRyxHQUFSLENBQVksVUFBWixDQUFWO0FBQ0E7QUFDQSxNQUFJOEIsZUFBZWpELGtCQUFrQixxQkFBbEIsRUFBeUNpQixJQUF6QyxDQUFuQjtBQUNBLE1BQUlpQyxpQkFBaUJsRCxrQkFBa0IsMkJBQWxCLEVBQStDaUIsSUFBL0MsQ0FBckI7QUFDQSxNQUFJa0Msb0JBQW9CbkQsa0JBQWtCLGdDQUFsQixFQUFvRGlCLElBQXBELENBQXhCO0FBQ0EsTUFBSW1DLFdBQVdwRCxrQkFBa0IsdUJBQWxCLEVBQTJDaUIsSUFBM0MsQ0FBZjtBQUNBO0FBQ0E7QUFDQSxNQUFJb0MsWUFBWSxJQUFoQjtBQUNBLE1BQUdELGFBQWEsS0FBaEIsRUFDQTtBQUNFQyxnQkFBWSxJQUFaO0FBQ0Q7QUFDRCxNQUFJQyxXQUFXLElBQUlDLEtBQUosQ0FBVVAsSUFBSXhCLE1BQWQsQ0FBZjtBQUNBLE1BQUd5QixpQkFBaUIsZUFBcEIsRUFDQTtBQUNFLFFBQUlPLFdBQVcsQ0FBZjtBQUNBUCxpQkFBYXpDLE9BQWIsQ0FBcUIsVUFBU0MsTUFBVCxFQUFnQjtBQUNuQzZDLGlCQUFXQSxTQUFTRyxJQUFULENBQWMsSUFBZCxFQUFvQmhELE9BQU8sQ0FBUCxDQUFwQixFQUErQkEsT0FBTyxDQUFQLElBQVUsQ0FBekMsQ0FBWDtBQUNBLFVBQUcrQyxXQUFXLENBQWQsRUFBZ0I7QUFBQ0Esb0JBQVksQ0FBWjtBQUFlO0FBQ2hDRixpQkFBV0EsU0FBU0csSUFBVCxDQUFjSixTQUFkLEVBQXlCRyxRQUF6QixFQUFtQy9DLE9BQU8sQ0FBUCxDQUFuQyxDQUFYO0FBQ0EsVUFBRzRDLGNBQWMsSUFBakIsRUFBc0I7QUFBRUEsb0JBQVksSUFBWjtBQUFrQixPQUExQyxNQUE4QztBQUFDQSxvQkFBWSxJQUFaO0FBQWtCO0FBQ2pFRyxpQkFBVy9DLE9BQU8sQ0FBUCxJQUFVLENBQXJCO0FBQ0QsS0FORDtBQU9BNkMsZUFBV0EsU0FBU0csSUFBVCxDQUFjSixTQUFkLEVBQXlCRyxXQUFTLENBQWxDLEVBQXFDUixJQUFJeEIsTUFBekMsQ0FBWDtBQUVEO0FBQ0Q7QUFDQSxNQUFHMEIsbUJBQW1CLGVBQXRCLEVBQXNDO0FBQ3BDQSxtQkFBZTFDLE9BQWYsQ0FBdUIsVUFBU0MsTUFBVCxFQUFnQjtBQUNyQzZDLGlCQUFXQSxTQUFTRyxJQUFULENBQWMsR0FBZCxFQUFtQmhELE9BQU8sQ0FBUCxDQUFuQixFQUE4QkEsT0FBTyxDQUFQLElBQVUsQ0FBeEMsQ0FBWDtBQUNELEtBRkQ7QUFHRDtBQUNEO0FBQ0EsTUFBRzBDLHNCQUFzQixlQUF6QixFQUF5QztBQUN2Q0Esc0JBQWtCM0MsT0FBbEIsQ0FBMEIsVUFBU0MsTUFBVCxFQUFnQjtBQUN4QzZDLGlCQUFXQSxTQUFTRyxJQUFULENBQWMsSUFBZCxFQUFvQmhELE9BQU8sQ0FBUCxDQUFwQixFQUErQkEsT0FBTyxDQUFQLElBQVUsQ0FBekMsQ0FBWDtBQUNELEtBRkQ7QUFHRDtBQUNENkMsV0FBUzlDLE9BQVQsQ0FBaUIsVUFBU2tELElBQVQsRUFBZWhELENBQWYsRUFBaUI7QUFDaENRLGdCQUFZUixDQUFaLEVBQWVpRCxNQUFmLEdBQXdCRCxJQUF4QjtBQUNELEdBRkQ7QUFHQTFDLFVBQVFZLEdBQVIsQ0FBWSxhQUFaLEVBQTJCVixXQUEzQjtBQUNBVyxRQUFNQyxjQUFOLENBQXFCWixXQUFyQixFQUFrQyxFQUFDYSxRQUFRLG1CQUFULEVBQThCQyxlQUFlLENBQTdDLEVBQWdEQyxPQUFPLEtBQXZELEVBQThEQyxpQkFBaUIsR0FBL0UsRUFBb0ZDLE9BQU8sR0FBM0YsRUFBZ0dDLFFBQVEsR0FBeEcsRUFBNkdDLGtCQUFrQixHQUEvSCxFQUFsQztBQUVEOztBQUVNLFNBQVN1QixhQUFULENBQXVCNUMsT0FBdkIsRUFBZ0NDLElBQWhDLEVBQXNDNEMsSUFBdEMsRUFDUDtBQUNFLE1BQUl6QyxRQUFRSCxLQUFLVixLQUFMLENBQVcsSUFBWCxDQUFaO0FBQ0E7QUFDQSxNQUFJdUQsV0FBVzlDLFFBQVFHLEdBQVIsQ0FBWTBDLE9BQUssVUFBakIsQ0FBZjtBQUNBO0FBQ0EsTUFBR0UsT0FBT0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCdEMsTUFBdEIsR0FBK0IsQ0FBbEMsRUFBb0M7QUFDcEMsUUFBSXlDLGVBQWUsNERBQW5CO0FBQ0FBLG9CQUFnQixvQkFBaEI7QUFDQUEsb0JBQWdCLG9CQUFoQjtBQUNBQSxvQkFBZ0Isa0JBQWhCO0FBQ0FBLG9CQUFnQixnQkFBaEI7QUFDQUEsb0JBQWdCLGdCQUFoQjtBQUNBQSxvQkFBZ0Isb0JBQWhCO0FBQ0FBLG9CQUFnQixxQkFBaEI7QUFDQUEsb0JBQWdCLGtCQUFoQjtBQUNBQSxvQkFBZ0Isa0JBQWhCO0FBQ0FBLG9CQUFnQixlQUFoQjtBQUNBQSxvQkFBZ0Isc0JBQWhCO0FBQ0FBLG9CQUFnQixzQkFBaEI7QUFDQUEsb0JBQWdCLGlCQUFoQjtBQUNBQSxvQkFBZ0Isb0JBQWhCO0FBQ0FBLG9CQUFnQixnQkFBaEI7O0FBRUE7QUFDQUEsb0JBQWdCLGlCQUFoQjtBQUNBN0MsVUFBTVosT0FBTixDQUFjLFVBQVNpQixJQUFULEVBQWVmLENBQWYsRUFBaUI7QUFDN0IsVUFBR2UsS0FBS0QsTUFBTCxLQUFnQixDQUFuQixFQUFxQjtBQUFDO0FBQVE7QUFDOUIsVUFBSUUsVUFBVUQsS0FBS2xCLEtBQUwsQ0FBVyxLQUFYLENBQWQ7QUFDQSxVQUFHbUIsUUFBUSxDQUFSLElBQVcsR0FBWCxHQUFlaEIsQ0FBZixJQUFvQm9ELFFBQXZCLEVBQ0E7QUFDQUcsd0JBQWdCLE1BQWhCO0FBQ0FBLHdCQUFnQixnQkFBY3ZDLFFBQVEsQ0FBUixFQUFXd0MsV0FBWCxFQUFkLEdBQXVDLElBQXZDLEdBQTRDeEMsUUFBUSxDQUFSLENBQTVDLEdBQXVELE9BQXZFO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0F1Qyx3QkFBZ0IsU0FBT3ZDLFFBQVEsQ0FBUixDQUFQLEdBQWtCLE9BQWxDO0FBQ0EsWUFBSXlDLE1BQU16QyxRQUFRLENBQVIsRUFBVzBDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IxQyxRQUFRLENBQVIsRUFBV0YsTUFBWCxHQUFrQixDQUExQyxDQUFWO0FBQ0F5Qyx3QkFBZ0IsMEZBQXdGRSxHQUF4RixHQUE0RixJQUE1RixHQUFpR3pDLFFBQVEsQ0FBUixDQUFqRyxHQUE0RyxXQUE1SDtBQUNBdUMsd0JBQWdCLGlGQUErRUUsR0FBL0UsR0FBbUYsd0JBQW5HO0FBQ0FGLHdCQUFnQiw2REFBMkRFLEdBQTNELEdBQStELHdCQUEvRTtBQUNBRix3QkFBZ0IsZ0hBQThHRSxHQUE5RyxHQUFrSCx3QkFBbEk7QUFDQUYsd0JBQWdCLGlGQUFnRkgsU0FBU3BDLFFBQVEsQ0FBUixJQUFXLEdBQVgsR0FBZWhCLENBQXhCLEVBQTJCMkQsR0FBM0csR0FBZ0gsT0FBaEgsR0FBeUhQLFNBQVNwQyxRQUFRLENBQVIsSUFBVyxHQUFYLEdBQWVoQixDQUF4QixFQUEyQjRELEdBQXBKLEdBQXlKLE9BQXpKLElBQWtLNUMsUUFBUSxDQUFSLElBQVcsR0FBWCxHQUFlaEIsQ0FBakwsSUFBb0wseUNBQXBNO0FBQ0F1RCx3QkFBZ0IsMkVBQTBFSCxTQUFTcEMsUUFBUSxDQUFSLElBQVcsR0FBWCxHQUFlaEIsQ0FBeEIsRUFBMkIyRCxHQUFyRyxHQUEwRyxtQ0FBMUg7QUFDQUosd0JBQWdCLFNBQWhCO0FBQ0M7QUFDRixLQXhCRDtBQXlCQUEsb0JBQWdCLG9CQUFoQjtBQUNBakQsWUFBUVksR0FBUixDQUFZaUMsT0FBSyxRQUFqQixFQUEyQkksWUFBM0I7QUFDQyxHQS9DRCxNQWdESztBQUNEakQsWUFBUVksR0FBUixDQUFZaUMsT0FBSyxRQUFqQixFQUEyQiw2RkFBM0I7QUFDSDtBQUNGLEM7Ozs7Ozs7OztBQ25NRDtBQUFBO0FBQ08sU0FBU1UsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEJDLEtBQTFCLEVBQWlDO0FBQ3RDLE1BQUdBLE1BQU1DLE9BQU4sQ0FBY0YsS0FBZCxJQUF1QixDQUFDLENBQTNCLEVBQ0E7QUFDRSxXQUFPLElBQVA7QUFDRCxHQUhELE1BSUs7QUFDSCxXQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDTyxTQUFTRywyQkFBVCxDQUFxQzNELE9BQXJDLEVBQTZDOztBQUVsRCxNQUFJZ0MsTUFBTWhDLFFBQVFHLEdBQVIsQ0FBWSxVQUFaLENBQVY7QUFDQSxNQUFJeUQsV0FBVzVCLElBQUl6QyxLQUFKLENBQVUsRUFBVixDQUFmO0FBQ0EsTUFBSVcsY0FBYyxFQUFsQjtBQUNBMEQsV0FBU3BFLE9BQVQsQ0FBaUIsVUFBU3FFLEdBQVQsRUFBYTtBQUM1QjNELGdCQUFZNEQsSUFBWixDQUFpQixFQUFDLE9BQU9ELEdBQVIsRUFBakI7QUFDRCxHQUZEO0FBR0E3RCxVQUFRWSxHQUFSLENBQVksYUFBWixFQUEyQlYsV0FBM0I7QUFDQVcsUUFBTUMsY0FBTixDQUFxQmQsUUFBUUcsR0FBUixDQUFZLGFBQVosQ0FBckIsRUFBaUQsRUFBQ1ksUUFBUSxtQkFBVCxFQUE4QkMsZUFBZSxDQUE3QyxFQUFnREMsT0FBTyxLQUF2RCxFQUE4REMsaUJBQWlCLEdBQS9FLEVBQW9GQyxPQUFPLEdBQTNGLEVBQWdHQyxRQUFRLEdBQXhHLEVBQTZHQyxrQkFBa0IsR0FBL0gsRUFBakQ7QUFDRDs7QUFHRDtBQUNPLFNBQVMwQyxVQUFULEdBQXNCO0FBQ3pCLE1BQUlDLE9BQU8sRUFBWDtBQUNBO0FBQ0EsTUFBSUMsUUFBUUMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE9BQXJCLENBQTZCLHlCQUE3QixFQUNaLFVBQVNDLENBQVQsRUFBV0MsR0FBWCxFQUFlZixLQUFmLEVBQXNCO0FBQ3BCUSxTQUFLTyxHQUFMLElBQVlmLEtBQVo7QUFDRCxHQUhXLENBQVo7QUFJQSxTQUFPUSxJQUFQO0FBQ0Q7O0FBRUg7QUFDQyxXQUFVUSxRQUFWLEVBQW9CQyxlQUFwQixFQUFxQztBQUNsQztBQUNBOztBQUVBOztBQUNBLE1BQUlDLFlBQVksYUFBaEI7QUFDQSxNQUFJQyxRQUFRLHNCQUFzQkQsU0FBdEIsR0FBa0MsbUJBQWxDLEdBQXdEQSxTQUF4RCxHQUFvRSxXQUFwRSxHQUFrRkEsU0FBbEYsR0FBOEYsZUFBOUYsR0FBZ0hBLFNBQWhILEdBQTRILFdBQTVILEdBQTBJQSxTQUF0Sjs7QUFFQVIsU0FBT1UsV0FBUCxHQUFxQixVQUFVQyxPQUFWLEVBQW1COztBQUVwQyxRQUFJQyxTQUFKOztBQUVBLFFBQUksQ0FBQ0QsT0FBTCxFQUFjO0FBQ1Y7QUFDQUEsZ0JBQVVDLFlBQVlOLFNBQVNPLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBdEI7QUFDQUQsZ0JBQVVILEtBQVYsQ0FBZ0JLLE9BQWhCLEdBQTBCLGtCQUFrQk4sU0FBNUM7QUFDQUQsc0JBQWdCUSxZQUFoQixDQUE2QkgsU0FBN0IsRUFBd0NOLFNBQVNVLElBQWpEO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJQyxjQUFjWCxTQUFTTyxhQUFULENBQXVCLEdBQXZCLENBQWxCO0FBQ0FJLGdCQUFZUixLQUFaLENBQWtCSyxPQUFsQixHQUE0QkwsS0FBNUI7QUFDQUUsWUFBUU8sV0FBUixDQUFvQkQsV0FBcEI7O0FBRUE7QUFDQSxRQUFJM0IsUUFBUTJCLFlBQVlFLFdBQXhCOztBQUVBLFFBQUlQLFNBQUosRUFBZTtBQUNYO0FBQ0FMLHNCQUFnQmEsV0FBaEIsQ0FBNEJSLFNBQTVCO0FBQ0gsS0FIRCxNQUlLO0FBQ0Q7QUFDQUQsY0FBUVMsV0FBUixDQUFvQkgsV0FBcEI7QUFDSDs7QUFFRDtBQUNBLFdBQU8zQixLQUFQO0FBQ0gsR0E5QkQ7QUErQkgsQ0F2Q0EsRUF1Q0NnQixRQXZDRCxFQXVDV0EsU0FBU0MsZUF2Q3BCLENBQUQsQzs7Ozs7Ozs7Ozs7O0FDdENBOztBQUVBO0FBQ08sU0FBU2MsY0FBVCxDQUF3QnZGLE9BQXhCLEVBQWlDd0YsV0FBakMsRUFBNkM7QUFDbER4RixVQUFRWSxHQUFSLENBQVksaUJBQVosRUFBK0IsQ0FBL0I7QUFDQVosVUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLENBQXJDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixLQUE5QjtBQUNBWixVQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsRUFBOUI7QUFDQVosVUFBUVksR0FBUixDQUFZLHlCQUFaLEVBQXVDLHNEQUF2QztBQUNBWixVQUFRWSxHQUFSLENBQVksc0JBQVosRUFBb0M0RSxXQUFwQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGNBQVosRUFBNEIsY0FBNUI7QUFDQVosVUFBUVksR0FBUixDQUFZLGVBQVosRUFBNEIsSUFBNUI7QUFDQVosVUFBUVksR0FBUixDQUFZLDBCQUFaLEVBQXdDLHVEQUF4QztBQUNBWixVQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUM0RSxXQUFyQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGVBQVosRUFBNkIsY0FBN0I7QUFDQVosVUFBUVksR0FBUixDQUFZLGdCQUFaO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSwyQkFBWixFQUF5Qyx5REFBekM7QUFDQVosVUFBUVksR0FBUixDQUFZLHdCQUFaLEVBQXNDNEUsV0FBdEM7QUFDQXhGLFVBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixjQUE5QjtBQUNBWixVQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUMsRUFBbkM7QUFDQVosVUFBUVksR0FBUixDQUFZLG1CQUFaLEVBQWlDLEVBQWpDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSw4QkFBWixFQUE0QywyREFBNUM7QUFDQVosVUFBUVksR0FBUixDQUFZLDJCQUFaLEVBQXlDNEUsV0FBekM7QUFDQXhGLFVBQVFZLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxjQUFqQztBQUNBWixVQUFRWSxHQUFSLENBQVksWUFBWixFQUEwQixFQUExQjtBQUNBWixVQUFRWSxHQUFSLENBQVksVUFBWixFQUF3QixFQUF4Qjs7QUFFQVosVUFBUVksR0FBUixDQUFZLHlCQUFaLEVBQXVDLHNEQUF2QztBQUNBWixVQUFRWSxHQUFSLENBQVksc0JBQVosRUFBb0M0RSxXQUFwQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGNBQVosRUFBNEIsY0FBNUI7QUFDQVosVUFBUVksR0FBUixDQUFZLDZCQUFaLEVBQTJDLDBEQUEzQztBQUNBWixVQUFRWSxHQUFSLENBQVksMEJBQVosRUFBd0M0RSxXQUF4QztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGtCQUFaLEVBQWdDLGNBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSx5QkFBWixFQUF1QyxzREFBdkM7QUFDQVosVUFBUVksR0FBUixDQUFZLHNCQUFaLEVBQW9DNEUsV0FBcEM7QUFDQXhGLFVBQVFZLEdBQVIsQ0FBWSxjQUFaLEVBQTRCLGNBQTVCO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSw4QkFBWixFQUE0QywyREFBNUM7QUFDQVosVUFBUVksR0FBUixDQUFZLDJCQUFaLEVBQXlDNEUsV0FBekM7QUFDQXhGLFVBQVFZLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxjQUFqQztBQUNBWixVQUFRWSxHQUFSLENBQVkseUJBQVosRUFBdUMsc0RBQXZDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSxzQkFBWixFQUFvQzRFLFdBQXBDO0FBQ0F4RixVQUFRWSxHQUFSLENBQVksY0FBWixFQUE0QixjQUE1QjtBQUNBWixVQUFRWSxHQUFSLENBQVkseUJBQVosRUFBdUMsc0RBQXZDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSxzQkFBWixFQUFvQzRFLFdBQXBDO0FBQ0F4RixVQUFRWSxHQUFSLENBQVksY0FBWixFQUE0QixjQUE1QjtBQUNBWixVQUFRWSxHQUFSLENBQVksd0JBQVosRUFBc0MscURBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSxxQkFBWixFQUFtQzRFLFdBQW5DO0FBQ0F4RixVQUFRWSxHQUFSLENBQVksYUFBWixFQUEyQixjQUEzQjtBQUNBWixVQUFRWSxHQUFSLENBQVksNEJBQVosRUFBMEMseURBQTFDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBWSx5QkFBWixFQUF1QzRFLFdBQXZDO0FBQ0F4RixVQUFRWSxHQUFSLENBQVksaUJBQVosRUFBK0IsY0FBL0I7QUFDQVosVUFBUVksR0FBUixDQUFZLHlCQUFaLEVBQXVDLHNEQUF2QztBQUNBWixVQUFRWSxHQUFSLENBQVksc0JBQVosRUFBb0M0RSxXQUFwQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGNBQVosRUFBNEIsY0FBNUI7QUFDQVosVUFBUVksR0FBUixDQUFZLHdCQUFaLEVBQXNDLHFEQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUM0RSxXQUFuQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGFBQVosRUFBMkIsY0FBM0I7QUFDQVosVUFBUVksR0FBUixDQUFZLDBCQUFaLEVBQXdDLHVEQUF4QztBQUNBWixVQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUM0RSxXQUFyQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGVBQVosRUFBNkIsY0FBN0I7QUFDQVosVUFBUVksR0FBUixDQUFZLHdCQUFaLEVBQXNDLDZEQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUM0RSxXQUFuQztBQUNBeEYsVUFBUVksR0FBUixDQUFZLGFBQVosRUFBMkIsY0FBM0I7O0FBRUE7QUFDQVosVUFBUVksR0FBUixDQUFZLGFBQVosRUFBMEIsSUFBMUI7QUFDQVosVUFBUVksR0FBUixDQUFZLFlBQVosRUFBeUIsSUFBekI7QUFDQUMsUUFBTTRFLGNBQU4sQ0FBcUIsbUJBQXJCO0FBQ0E1RSxRQUFNNEUsY0FBTixDQUFxQixxQkFBckI7QUFDQTVFLFFBQU00RSxjQUFOLENBQXFCLGVBQXJCOztBQUVBQyxRQUFNLElBQUlDLEtBQUosRUFBTjtBQUNEOztBQUVEO0FBQ08sU0FBU0Msc0JBQVQsQ0FBZ0MxRyxJQUFoQyxFQUFzQzJHLGNBQXRDLEVBQ1A7QUFDRSxNQUFHM0csS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsU0FBdkIsQ0FBSCxFQUNBO0FBQ0V3RyxtQkFBZUUsT0FBZixHQUF5QixFQUF6QjtBQUNBRixtQkFBZUUsT0FBZixDQUF1QkMsTUFBdkIsR0FBZ0MsNEJBQWhDO0FBQ0Q7QUFDRCxNQUFHOUcsS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsVUFBdkIsQ0FBSCxFQUNBO0FBQ0V3RyxtQkFBZXJFLFFBQWYsR0FBMEIsRUFBMUI7QUFDQXFFLG1CQUFlckUsUUFBZixDQUF3QndFLE1BQXhCLEdBQWlDLDhCQUFqQztBQUNEO0FBQ0QsTUFBRzlHLEtBQUs0RyxRQUFMLENBQWN6RyxRQUFkLENBQXVCLFdBQXZCLENBQUgsRUFDQTtBQUNFd0csbUJBQWVJLFNBQWYsR0FBMEIsRUFBMUI7QUFDQUosbUJBQWVJLFNBQWYsQ0FBeUJELE1BQXpCLEdBQWtDLDhCQUFsQztBQUNEO0FBQ0QsTUFBRzlHLEtBQUs0RyxRQUFMLENBQWN6RyxRQUFkLENBQXVCLGNBQXZCLENBQUgsRUFDQTtBQUNFd0csbUJBQWVFLE9BQWYsR0FBeUIsRUFBekI7QUFDQUYsbUJBQWVFLE9BQWYsQ0FBdUJDLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNBSCxtQkFBZUssWUFBZixHQUE2QixFQUE3QjtBQUNBTCxtQkFBZUssWUFBZixDQUE0QkYsTUFBNUIsR0FBcUMsaUNBQXJDO0FBQ0Q7QUFDRCxNQUFHOUcsS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsU0FBdkIsQ0FBSCxFQUFxQztBQUNuQ3dHLG1CQUFlSSxTQUFmLEdBQTBCLEVBQTFCO0FBQ0FKLG1CQUFlSSxTQUFmLENBQXlCRCxNQUF6QixHQUFrQyw4QkFBbEM7QUFDQUgsbUJBQWVNLE9BQWYsR0FBeUIsRUFBekI7QUFDQU4sbUJBQWVNLE9BQWYsQ0FBdUJILE1BQXZCLEdBQWdDLDRCQUFoQztBQUNEO0FBQ0QsTUFBRzlHLEtBQUs0RyxRQUFMLENBQWN6RyxRQUFkLENBQXVCLGFBQXZCLENBQUgsRUFBeUM7QUFDdkN3RyxtQkFBZU8sV0FBZixHQUE0QixFQUE1QjtBQUNBUCxtQkFBZU8sV0FBZixDQUEyQkosTUFBM0IsR0FBb0MsZ0NBQXBDO0FBQ0Q7QUFDRCxNQUFHOUcsS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsU0FBdkIsQ0FBSCxFQUFxQztBQUNuQ3dHLG1CQUFlRSxPQUFmLEdBQXlCLEVBQXpCO0FBQ0FGLG1CQUFlRSxPQUFmLENBQXVCQyxNQUF2QixHQUFnQyw0QkFBaEM7QUFDQUgsbUJBQWVRLE9BQWYsR0FBd0IsRUFBeEI7QUFDQVIsbUJBQWVRLE9BQWYsQ0FBdUJMLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNEO0FBQ0QsTUFBRzlHLEtBQUs0RyxRQUFMLENBQWN6RyxRQUFkLENBQXVCLGNBQXZCLENBQUgsRUFBMEM7QUFDeEN3RyxtQkFBZUUsT0FBZixHQUF5QixFQUF6QjtBQUNBRixtQkFBZUUsT0FBZixDQUF1QkMsTUFBdkIsR0FBZ0MsNEJBQWhDO0FBQ0FILG1CQUFlUyxZQUFmLEdBQTZCLEVBQTdCO0FBQ0FULG1CQUFlUyxZQUFmLENBQTRCTixNQUE1QixHQUFxQyxpQ0FBckM7QUFDRDtBQUNELE1BQUc5RyxLQUFLNEcsUUFBTCxDQUFjekcsUUFBZCxDQUF1QixTQUF2QixDQUFILEVBQXFDO0FBQ25Dd0csbUJBQWVFLE9BQWYsR0FBeUIsRUFBekI7QUFDQUYsbUJBQWVFLE9BQWYsQ0FBdUJDLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNBSCxtQkFBZUssWUFBZixHQUE2QixFQUE3QjtBQUNBTCxtQkFBZUssWUFBZixDQUE0QkYsTUFBNUIsR0FBcUMsaUNBQXJDO0FBQ0FILG1CQUFlVSxPQUFmLEdBQXdCLEVBQXhCO0FBQ0FWLG1CQUFlVSxPQUFmLENBQXVCUCxNQUF2QixHQUFnQyw0QkFBaEM7QUFDRDtBQUNELE1BQUc5RyxLQUFLNEcsUUFBTCxDQUFjekcsUUFBZCxDQUF1QixTQUF2QixDQUFILEVBQXFDO0FBQ25Dd0csbUJBQWVFLE9BQWYsR0FBeUIsRUFBekI7QUFDQUYsbUJBQWVFLE9BQWYsQ0FBdUJDLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNBSCxtQkFBZVMsWUFBZixHQUE2QixFQUE3QjtBQUNBVCxtQkFBZVMsWUFBZixDQUE0Qk4sTUFBNUIsR0FBcUMsaUNBQXJDO0FBQ0FILG1CQUFlVyxPQUFmLEdBQXdCLEVBQXhCO0FBQ0FYLG1CQUFlVyxPQUFmLENBQXVCUixNQUF2QixHQUFnQyw0QkFBaEM7QUFDRDtBQUNELE1BQUc5RyxLQUFLNEcsUUFBTCxDQUFjekcsUUFBZCxDQUF1QixRQUF2QixDQUFILEVBQW9DO0FBQ2xDd0csbUJBQWVyRSxRQUFmLEdBQTBCLEVBQTFCO0FBQ0FxRSxtQkFBZXJFLFFBQWYsQ0FBd0J3RSxNQUF4QixHQUFpQyw4QkFBakM7QUFDQUgsbUJBQWVFLE9BQWYsR0FBeUIsRUFBekI7QUFDQUYsbUJBQWVFLE9BQWYsQ0FBdUJDLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNBSCxtQkFBZVEsT0FBZixHQUF3QixFQUF4QjtBQUNBUixtQkFBZVEsT0FBZixDQUF1QkwsTUFBdkIsR0FBZ0MsNEJBQWhDO0FBQ0FILG1CQUFlWSxNQUFmLEdBQXVCLEVBQXZCO0FBQ0FaLG1CQUFlWSxNQUFmLENBQXNCVCxNQUF0QixHQUErQiwyQkFBL0I7QUFDRDtBQUNELE1BQUc5RyxLQUFLNEcsUUFBTCxDQUFjekcsUUFBZCxDQUF1QixZQUF2QixDQUFILEVBQXdDO0FBQ3RDd0csbUJBQWVFLE9BQWYsR0FBeUIsRUFBekI7QUFDQUYsbUJBQWVFLE9BQWYsQ0FBdUJDLE1BQXZCLEdBQWdDLDRCQUFoQztBQUNBSCxtQkFBZWEsVUFBZixHQUEyQixFQUEzQjtBQUNBYixtQkFBZWEsVUFBZixDQUEwQlYsTUFBMUIsR0FBbUMsK0JBQW5DO0FBQ0Q7QUFDRCxNQUFHOUcsS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsU0FBdkIsQ0FBSCxFQUFxQztBQUNuQ3dHLG1CQUFlYyxPQUFmLEdBQXlCLEVBQXpCO0FBQ0FkLG1CQUFlYyxPQUFmLENBQXVCWCxNQUF2QixHQUFnQyw0QkFBaEM7QUFDRDtBQUNELE1BQUc5RyxLQUFLNEcsUUFBTCxDQUFjekcsUUFBZCxDQUF1QixRQUF2QixDQUFILEVBQW9DO0FBQ2xDd0csbUJBQWVlLE1BQWYsR0FBd0IsRUFBeEI7QUFDQWYsbUJBQWVlLE1BQWYsQ0FBc0JaLE1BQXRCLEdBQStCLDJCQUEvQjtBQUNEO0FBQ0QsTUFBRzlHLEtBQUs0RyxRQUFMLENBQWN6RyxRQUFkLENBQXVCLFVBQXZCLENBQUgsRUFBc0M7QUFDcEN3RyxtQkFBZWdCLFFBQWYsR0FBMEIsRUFBMUI7QUFDQWhCLG1CQUFlZ0IsUUFBZixDQUF3QmIsTUFBeEIsR0FBaUMsNkJBQWpDO0FBQ0Q7QUFDRCxNQUFHOUcsS0FBSzRHLFFBQUwsQ0FBY3pHLFFBQWQsQ0FBdUIsUUFBdkIsQ0FBSCxFQUFvQztBQUNsQ3dHLG1CQUFlaUIsTUFBZixHQUF3QixFQUF4QjtBQUNBakIsbUJBQWVpQixNQUFmLENBQXNCZCxNQUF0QixHQUErQix1QkFBL0I7QUFDRDtBQUVGOztBQUVEO0FBQ08sU0FBU2UsY0FBVCxDQUF3Qi9HLE9BQXhCLEVBQWlDZCxJQUFqQyxFQUF1QzhILFFBQXZDLEVBQWlEdEIsR0FBakQsRUFBc0RHLGNBQXRELEVBQ1A7QUFDRSxNQUFJb0IsY0FBYyxVQUFsQjtBQUNBLE1BQUlDLFlBQVksUUFBaEI7QUFDQSxNQUFJQyx1QkFBdUIsMkJBQTNCO0FBQ0EsTUFBSUMseUJBQXlCLGtCQUE3QjtBQUNBLE1BQUlDLG9CQUFvQixhQUF4QjtBQUNBLE1BQUlDLHdCQUF3Qix1QkFBNUI7QUFDQSxNQUFJQyxvQkFBb0Isa0JBQXhCO0FBQ0EsTUFBSUMsc0JBQXNCLHVCQUExQjtBQUNBLE1BQUlDLG9CQUFvQix5QkFBeEI7QUFDQSxNQUFJQyx1QkFBdUIsS0FBM0I7O0FBRUEsTUFBSUMsY0FBYyxFQUFsQjtBQUNBLE1BQUlDLFVBQVUxSSxLQUFLMEksT0FBbkI7QUFDQSxPQUFJLElBQUlsSSxDQUFSLElBQWFrSSxPQUFiLEVBQ0E7QUFDRSxRQUFJQyxjQUFjRCxRQUFRbEksQ0FBUixDQUFsQjtBQUNBLFFBQUdtSSxZQUFZQyxJQUFaLEtBQXFCLHdCQUF4QixFQUNBO0FBQ0ksVUFBSUMsVUFBVS9ILFFBQVFHLEdBQVIsQ0FBWSxjQUFaLENBQWQ7QUFDQSxVQUFJNkgsTUFBTUgsWUFBWUksU0FBdEI7QUFDQSxVQUFJQyxPQUFPRixJQUFJRyxNQUFKLENBQVcsQ0FBWCxFQUFjSCxJQUFJSSxXQUFKLENBQWdCLEdBQWhCLENBQWQsQ0FBWDtBQUNBLFVBQUlDLEtBQUtILEtBQUtDLE1BQUwsQ0FBWUQsS0FBS0UsV0FBTCxDQUFpQixHQUFqQixJQUFzQixDQUFsQyxFQUFxQ0YsS0FBSzFILE1BQTFDLENBQVQ7QUFDQXVILGNBQVFNLEVBQVIsSUFBYyxFQUFkO0FBQ0FOLGNBQVFNLEVBQVIsRUFBWS9FLEdBQVosR0FBa0I0RSxPQUFLLE1BQXZCO0FBQ0FILGNBQVFNLEVBQVIsRUFBWWhGLEdBQVosR0FBa0I2RSxPQUFLLE1BQXZCO0FBQ0FsSSxjQUFRWSxHQUFSLENBQVksY0FBWixFQUE0Qm1ILE9BQTVCO0FBQ0g7QUFDRCxRQUFHRixZQUFZQyxJQUFaLEtBQXFCLDZCQUF4QixFQUNBO0FBQ0ksVUFBSUMsVUFBVS9ILFFBQVFHLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUFDQSxVQUFJNkgsTUFBTUgsWUFBWUksU0FBdEI7QUFDQSxVQUFJQyxPQUFPRixJQUFJRyxNQUFKLENBQVcsQ0FBWCxFQUFjSCxJQUFJSSxXQUFKLENBQWdCLEdBQWhCLENBQWQsQ0FBWDtBQUNBLFVBQUlDLEtBQUtILEtBQUtDLE1BQUwsQ0FBWUQsS0FBS0UsV0FBTCxDQUFpQixHQUFqQixJQUFzQixDQUFsQyxFQUFxQ0YsS0FBSzFILE1BQTFDLENBQVQ7QUFDQXVILGNBQVFNLEVBQVIsSUFBYyxFQUFkO0FBQ0FOLGNBQVFNLEVBQVIsRUFBWS9FLEdBQVosR0FBa0I0RSxPQUFLLE1BQXZCO0FBQ0FILGNBQVFNLEVBQVIsRUFBWWhGLEdBQVosR0FBa0I2RSxPQUFLLE1BQXZCO0FBQ0FsSSxjQUFRWSxHQUFSLENBQVksYUFBWixFQUEyQm1ILE9BQTNCO0FBQ0g7QUFDRjtBQUNEbkksVUFBUUMsR0FBUixDQUFZK0gsT0FBWjtBQUNBLE9BQUksSUFBSWxJLENBQVIsSUFBYWtJLE9BQWIsRUFDQTtBQUNFLFFBQUlDLGNBQWNELFFBQVFsSSxDQUFSLENBQWxCO0FBQ0E7QUFDQSxRQUFHbUksWUFBWUMsSUFBWixJQUFvQixVQUF2QixFQUNBO0FBQ0UsVUFBSTNJLFFBQVE4SCxZQUFZN0gsSUFBWixDQUFpQnlJLFlBQVlJLFNBQTdCLENBQVo7QUFDQSxVQUFHOUksS0FBSCxFQUNBO0FBQ0VtSixRQUFBLHdHQUFBQSxDQUFhdEIsUUFBYixFQUF1QmEsWUFBWUksU0FBbkMsRUFBOEMsT0FBOUMsRUFBdUR2QyxHQUF2RCxFQUE0RDFGLE9BQTVEO0FBQ0FBLGdCQUFRWSxHQUFSLENBQVkseUJBQVosRUFBdUMsRUFBdkM7QUFDQWlGLHVCQUFlRSxPQUFmLENBQXVCd0MsS0FBdkIsR0FBK0IsY0FBWXZCLFFBQVosR0FBcUJhLFlBQVlJLFNBQWpDLEdBQTJDLGlDQUExRTtBQUNBakksZ0JBQVFZLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxFQUFwQztBQUNBWixnQkFBUVksR0FBUixDQUFZLGNBQVosRUFBNEIsRUFBNUI7QUFDRDtBQUNELFVBQUk0SCxZQUFZdEIsVUFBVTlILElBQVYsQ0FBZXlJLFlBQVlJLFNBQTNCLENBQWhCO0FBQ0EsVUFBR08sU0FBSCxFQUNBO0FBQ0UzQyx1QkFBZUUsT0FBZixDQUF1QjBDLEdBQXZCLEdBQTZCLGNBQVl6QixRQUFaLEdBQXFCYSxZQUFZSSxTQUFqQyxHQUEyQywrQkFBeEU7QUFDQUssUUFBQSx3R0FBQUEsQ0FBYXRCLFFBQWIsRUFBdUJhLFlBQVlJLFNBQW5DLEVBQThDLEtBQTlDLEVBQXFEdkMsR0FBckQsRUFBMEQxRixPQUExRDtBQUNEO0FBQ0Y7QUFDRDtBQUNBLFFBQUc2SCxZQUFZQyxJQUFaLEtBQXFCLGFBQXhCLEVBQ0E7QUFDRVEsTUFBQSx3R0FBQUEsQ0FBYXRCLFFBQWIsRUFBdUJhLFlBQVlJLFNBQW5DLEVBQThDLE9BQTlDLEVBQXVEdkMsR0FBdkQsRUFBNEQxRixPQUE1RDtBQUNBQSxjQUFRWSxHQUFSLENBQVksMEJBQVosRUFBd0MsRUFBeEM7QUFDQWlGLHFCQUFlckUsUUFBZixDQUF3QmtILEtBQXhCLEdBQWdDLGNBQVkxQixRQUFaLEdBQXFCYSxZQUFZSSxTQUFqQyxHQUEyQyxpQ0FBM0U7QUFDQWpJLGNBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxFQUFyQztBQUNBWixjQUFRWSxHQUFSLENBQVksZUFBWixFQUE2QixFQUE3QjtBQUNEO0FBQ0QsUUFBR2lILFlBQVlDLElBQVosS0FBcUIsY0FBeEIsRUFDQTtBQUNFUSxNQUFBLHdHQUFBQSxDQUFhdEIsUUFBYixFQUF1QmEsWUFBWUksU0FBbkMsRUFBOEMsTUFBOUMsRUFBc0R2QyxHQUF0RCxFQUEyRDFGLE9BQTNEO0FBQ0E2RixxQkFBZXJFLFFBQWYsQ0FBd0JtSCxJQUF4QixHQUErQixjQUFZM0IsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsNEJBQTFFO0FBQ0Q7O0FBRUQsUUFBR0osWUFBWUMsSUFBWixLQUFxQixXQUF4QixFQUNBO0FBQ0U5SCxjQUFRWSxHQUFSLENBQVksMkJBQVosRUFBeUMsRUFBekM7QUFDQVosY0FBUVksR0FBUixDQUFZLHdCQUFaLEVBQXNDLEVBQXRDO0FBQ0FaLGNBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixFQUE5QjtBQUNBLFVBQUlnSSxlQUFleEIsdUJBQXVCaEksSUFBdkIsQ0FBNEJ5SSxZQUFZSSxTQUF4QyxDQUFuQjtBQUNBLFVBQUdXLFlBQUgsRUFDQTtBQUNFNUksZ0JBQVFZLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxlQUFhb0csUUFBYixHQUFzQmEsWUFBWUksU0FBbEMsR0FBNEMsTUFBL0U7QUFDQXBDLHVCQUFlSSxTQUFmLENBQXlCNEMsU0FBekIsR0FBcUMsY0FBWTdCLFFBQVosR0FBcUJhLFlBQVlJLFNBQWpDLEdBQTJDLCtCQUFoRjtBQUNEO0FBQ0QsVUFBSWEsZ0JBQWdCM0IscUJBQXFCL0gsSUFBckIsQ0FBMEJ5SSxZQUFZSSxTQUF0QyxDQUFwQjtBQUNBLFVBQUdhLGFBQUgsRUFDQTtBQUNFOUksZ0JBQVFZLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxlQUFhb0csUUFBYixHQUFzQmEsWUFBWUksU0FBbEMsR0FBNEMsTUFBN0U7QUFDQXBDLHVCQUFlSSxTQUFmLENBQXlCOEMsT0FBekIsR0FBbUMsY0FBWS9CLFFBQVosR0FBcUJhLFlBQVlJLFNBQWpDLEdBQTJDLDZCQUE5RTtBQUNEO0FBQ0QsVUFBSWUsZUFBZTNCLGtCQUFrQmpJLElBQWxCLENBQXVCeUksWUFBWUksU0FBbkMsQ0FBbkI7QUFDQSxVQUFHZSxZQUFILEVBQ0E7QUFDRVYsUUFBQSx3R0FBQUEsQ0FBYXRCLFFBQWIsRUFBdUJhLFlBQVlJLFNBQW5DLEVBQThDLFlBQTlDLEVBQTREdkMsR0FBNUQsRUFBaUUxRixPQUFqRTtBQUNBNkYsdUJBQWVJLFNBQWYsQ0FBeUIvRyxJQUF6QixHQUFnQyxjQUFZOEgsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsMkJBQTNFO0FBQ0Q7QUFDRjtBQUNELFFBQUdKLFlBQVlDLElBQVosS0FBcUIsaUJBQXhCLEVBQ0E7QUFDRTlILGNBQVFZLEdBQVIsQ0FBWSx5QkFBWixFQUF1QyxFQUF2QztBQUNBWixjQUFRWSxHQUFSLENBQVksc0JBQVosRUFBb0MsRUFBcEM7QUFDQVosY0FBUVksR0FBUixDQUFZLGNBQVosRUFBNEIsRUFBNUI7QUFDQSxVQUFJa0ksZ0JBQWlCeEIsc0JBQXNCbEksSUFBdEIsQ0FBMkJ5SSxZQUFZSSxTQUF2QyxDQUFyQjtBQUNBLFVBQUdhLGFBQUgsRUFDQTtBQUNFcEIsK0JBQXVCLElBQXZCO0FBQ0ExSCxnQkFBUVksR0FBUixDQUFZLGlCQUFaLEVBQStCLDhCQUE0Qm9HLFFBQTVCLEdBQXFDYSxZQUFZSSxTQUFqRCxHQUEyRCxNQUExRjtBQUNBcEMsdUJBQWVNLE9BQWYsQ0FBdUI0QyxPQUF2QixHQUFpQyxjQUFZL0IsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsNkJBQTVFO0FBQ0Q7QUFDRCxVQUFJZ0IsY0FBZTFCLGtCQUFrQm5JLElBQWxCLENBQXVCeUksWUFBWUksU0FBbkMsQ0FBbkI7QUFDQSxVQUFHZ0IsV0FBSCxFQUNBO0FBQ0VwRCx1QkFBZU0sT0FBZixDQUF1QitDLFNBQXZCLEdBQW1DLGNBQVlsQyxRQUFaLEdBQXFCYSxZQUFZSSxTQUFqQyxHQUEyQywwQkFBOUU7QUFDRDtBQUNELFVBQUlrQixnQkFBaUIzQixvQkFBb0JwSSxJQUFwQixDQUF5QnlJLFlBQVlJLFNBQXJDLENBQXJCO0FBQ0EsVUFBR2tCLGFBQUgsRUFDQTtBQUNFdEQsdUJBQWVNLE9BQWYsQ0FBdUJpRCxPQUF2QixHQUFpQyxjQUFZcEMsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsaUNBQTVFO0FBQ0Q7QUFDRCxVQUFJb0IsY0FBZTVCLGtCQUFrQnJJLElBQWxCLENBQXVCeUksWUFBWUksU0FBbkMsQ0FBbkI7QUFDQSxVQUFHb0IsV0FBSCxFQUNBO0FBQ0V4RCx1QkFBZU0sT0FBZixDQUF1Qm1ELFNBQXZCLEdBQW1DLGNBQVl0QyxRQUFaLEdBQXFCYSxZQUFZSSxTQUFqQyxHQUEyQyx1Q0FBOUU7QUFDRDtBQUVGO0FBQ0QsUUFBR0osWUFBWUMsSUFBWixLQUFxQixjQUF4QixFQUNBO0FBQ0U5SCxjQUFRWSxHQUFSLENBQVksOEJBQVosRUFBNEMsRUFBNUM7QUFDQVosY0FBUVksR0FBUixDQUFZLDJCQUFaLEVBQXlDLEVBQXpDO0FBQ0FaLGNBQVFZLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxFQUFqQztBQUNBMEgsTUFBQSx3R0FBQUEsQ0FBYXRCLFFBQWIsRUFBdUJhLFlBQVlJLFNBQW5DLEVBQThDLFNBQTlDLEVBQXlEdkMsR0FBekQsRUFBOEQxRixPQUE5RDtBQUNBNkYscUJBQWVLLFlBQWYsQ0FBNEJxRCxLQUE1QixHQUFvQyxjQUFZdkMsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsZ0NBQS9FO0FBQ0Q7QUFDRCxRQUFHSixZQUFZQyxJQUFaLEtBQXFCLG1CQUF4QixFQUNBO0FBQ0U5SCxjQUFRWSxHQUFSLENBQVksNkJBQVosRUFBMkMsRUFBM0M7QUFDQVosY0FBUVksR0FBUixDQUFZLDBCQUFaLEVBQXdDLEVBQXhDO0FBQ0FaLGNBQVFZLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztBQUNBMEgsTUFBQSx3R0FBQUEsQ0FBYXRCLFFBQWIsRUFBdUJhLFlBQVlJLFNBQW5DLEVBQThDLGFBQTlDLEVBQTZEdkMsR0FBN0QsRUFBa0UxRixPQUFsRTtBQUNBNkYscUJBQWVPLFdBQWYsQ0FBMkJtRCxLQUEzQixHQUFtQyxjQUFZdkMsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMsK0JBQTlFO0FBQ0Q7O0FBRUQsUUFBR0osWUFBWUMsSUFBWixLQUFxQixrQkFBeEIsRUFDQTtBQUNFakMscUJBQWVLLFlBQWYsQ0FBNEJzRCxLQUE1QixHQUFvQyxjQUFZeEMsUUFBWixHQUFxQmEsWUFBWUksU0FBakMsR0FBMkMscUNBQS9FO0FBQ0Q7QUFDRCxRQUFHSixZQUFZQyxJQUFaLEtBQXFCLDhCQUF4QixFQUNBO0FBQ0VqQyxxQkFBZU8sV0FBZixDQUEyQm9ELEtBQTNCLEdBQW1DLGNBQVl4QyxRQUFaLEdBQXFCYSxZQUFZSSxTQUFqQyxHQUEyQyxvQ0FBOUU7QUFDRDtBQUNGO0FBQ0QsTUFBRyxDQUFFUCxvQkFBTCxFQUNBO0FBQ0UxSCxZQUFRWSxHQUFSLENBQVksaUJBQVosRUFBK0IseUNBQS9CO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTNkksbUJBQVQsQ0FBNkJ6SixPQUE3QixFQUFzQzZGLGNBQXRDLEVBQ1A7QUFDRWpHLFVBQVFDLEdBQVIsQ0FBWWdHLGNBQVo7QUFDQSxNQUFJNkQsbUJBQW1CMUosUUFBUUcsR0FBUixDQUFZLGdCQUFaLENBQXZCO0FBQ0EsTUFBRyxhQUFhMEYsY0FBaEIsRUFDQTtBQUNFNkQsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZUUsT0FBZixDQUF1QkMsTUFBL0MsQ0FBbkI7QUFDQTBELHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVFLE9BQWYsQ0FBdUJ3QyxLQUEvQyxDQUFuQjtBQUNBbUIsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZUUsT0FBZixDQUF1QjBDLEdBQS9DLENBQW5CO0FBQ0FpQix1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0IsUUFBeEIsQ0FBbkI7QUFDRDtBQUNELE1BQUcsY0FBYzlELGNBQWpCLEVBQ0E7QUFDRTZELHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVyRSxRQUFmLENBQXdCd0UsTUFBaEQsQ0FBbkI7QUFDQTBELHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVyRSxRQUFmLENBQXdCa0gsS0FBaEQsQ0FBbkI7QUFDQWdCLHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVyRSxRQUFmLENBQXdCbUgsSUFBaEQsQ0FBbkI7QUFDQWUsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCLFFBQXhCLENBQW5CO0FBQ0Q7QUFDRCxNQUFHLGVBQWU5RCxjQUFsQixFQUNBO0FBQ0U2RCx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlSSxTQUFmLENBQXlCRCxNQUFqRCxDQUFuQjtBQUNBMEQsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZUksU0FBZixDQUF5Qi9HLElBQWpELENBQW5CO0FBQ0F3Syx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlSSxTQUFmLENBQXlCNEMsU0FBakQsQ0FBbkI7QUFDQWEsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZUksU0FBZixDQUF5QjhDLE9BQWpELENBQW5CO0FBQ0FXLHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QixRQUF4QixDQUFuQjtBQUNEO0FBQ0QsTUFBRyxrQkFBa0I5RCxjQUFyQixFQUNBO0FBQ0U2RCx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlSyxZQUFmLENBQTRCRixNQUFwRCxDQUFuQjtBQUNBMEQsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZUssWUFBZixDQUE0QnFELEtBQXBELENBQW5CO0FBQ0FHLHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVLLFlBQWYsQ0FBNEJzRCxLQUFwRCxDQUFuQjtBQUNBRSx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0IsUUFBeEIsQ0FBbkI7QUFDRDtBQUNELE1BQUcsaUJBQWlCOUQsY0FBcEIsRUFDQTtBQUNFNkQsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZU8sV0FBZixDQUEyQkosTUFBbkQsQ0FBbkI7QUFDQTBELHVCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVPLFdBQWYsQ0FBMkJtRCxLQUFuRCxDQUFuQjtBQUNBRyx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlTyxXQUFmLENBQTJCb0QsS0FBbkQsQ0FBbkI7QUFDQUUsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCLFFBQXhCLENBQW5CO0FBQ0Q7QUFDRCxNQUFHLGFBQWE5RCxjQUFoQixFQUNBO0FBQ0U2RCx1QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlTSxPQUFmLENBQXVCSCxNQUEvQyxDQUFuQjtBQUNBLFFBQUdILGVBQWVNLE9BQWYsQ0FBdUI0QyxPQUExQixFQUNBO0FBQ0FXLHlCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVNLE9BQWYsQ0FBdUI0QyxPQUEvQyxDQUFuQjtBQUNBVyx5QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0I5RCxlQUFlTSxPQUFmLENBQXVCK0MsU0FBL0MsQ0FBbkI7QUFDQVEseUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCOUQsZUFBZU0sT0FBZixDQUF1QmlELE9BQS9DLENBQW5CO0FBQ0FNLHlCQUFtQkEsaUJBQWlCQyxNQUFqQixDQUF3QjlELGVBQWVNLE9BQWYsQ0FBdUJtRCxTQUEvQyxDQUFuQjtBQUNDLEtBTkQsTUFRQTtBQUNFSSx5QkFBbUJBLGlCQUFpQkMsTUFBakIsQ0FBd0Isc0NBQXhCLENBQW5CO0FBQ0Q7QUFDREQsdUJBQW1CQSxpQkFBaUJDLE1BQWpCLENBQXdCLFFBQXhCLENBQW5CO0FBQ0Q7O0FBRUQzSixVQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEI4SSxnQkFBOUI7QUFDRCxDOzs7Ozs7Ozs7Ozs7QUMzWUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ08sU0FBU0UsWUFBVCxDQUFzQkMsR0FBdEIsRUFBMkJoSCxJQUEzQixFQUFpQ2lILFNBQWpDLEVBQ1A7QUFDRWxLLFVBQVFDLEdBQVIsQ0FBWSxxQkFBWjtBQUNBRCxVQUFRQyxHQUFSLENBQVlnSyxHQUFaO0FBQ0FqSyxVQUFRQyxHQUFSLENBQVlnRCxJQUFaO0FBQ0EsTUFBSWtILFdBQVcsSUFBZjtBQUNBQyxJQUFFQyxJQUFGLENBQU87QUFDTHBILFVBQU1BLElBREQ7QUFFTDNELFVBQU00SyxTQUZEO0FBR0xJLFdBQU8sS0FIRjtBQUlMQyxpQkFBYSxLQUpSO0FBS0xDLGlCQUFhLEtBTFI7QUFNTEMsV0FBUyxLQU5KO0FBT0xDLGNBQVUsTUFQTDtBQVFMO0FBQ0FULFNBQUtBLEdBVEE7QUFVTFUsYUFBVSxVQUFVckwsSUFBVixFQUNWO0FBQ0UsVUFBR0EsU0FBUyxJQUFaLEVBQWlCO0FBQUNvQyxjQUFNLHFCQUFOO0FBQThCO0FBQ2hEeUksaUJBQVM3SyxJQUFUO0FBQ0E7QUFDRCxLQWZJO0FBZ0JMc0wsV0FBTyxVQUFVQSxLQUFWLEVBQWlCO0FBQUNsSixZQUFNLG9CQUFrQnVJLEdBQWxCLEdBQXNCLFdBQXRCLEdBQWtDVyxNQUFNQyxZQUF4QyxHQUFxRCw2R0FBM0QsRUFBMkssT0FBTyxJQUFQO0FBQ3JNLEtBakJNLEVBQVAsRUFpQklDLFlBakJKO0FBa0JBLFNBQU9YLFFBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ08sU0FBU1ksUUFBVCxDQUFrQjNLLE9BQWxCLEVBQTJCOEYsUUFBM0IsRUFBcUM5RCxHQUFyQyxFQUEwQzhGLElBQTFDLEVBQWdEOEMsS0FBaEQsRUFBdURDLFVBQXZELEVBQW1FQyxTQUFuRSxFQUNQO0FBQ0U7QUFDQWxMLFVBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNBRCxVQUFRQyxHQUFSLENBQVlpRyxRQUFaO0FBQ0EsTUFBSTdGLE9BQU8sSUFBWDtBQUNBLE1BQUk4SyxhQUFhakYsU0FBU2tGLFdBQVQsRUFBakI7QUFDQSxNQUNBO0FBQ0UvSyxXQUFPLElBQUlnTCxJQUFKLENBQVMsQ0FBQ2pKLEdBQUQsQ0FBVCxDQUFQO0FBQ0QsR0FIRCxDQUdFLE9BQU9rSixDQUFQLEVBQ0Y7QUFDRTVKLFVBQU00SixDQUFOO0FBQ0Q7QUFDRCxNQUFJQyxLQUFLLElBQUlDLFFBQUosRUFBVDtBQUNBRCxLQUFHRSxNQUFILENBQVUsWUFBVixFQUF3QnBMLElBQXhCLEVBQThCLFdBQTlCO0FBQ0FrTCxLQUFHRSxNQUFILENBQVUsS0FBVixFQUFnQnZGLFFBQWhCO0FBQ0FxRixLQUFHRSxNQUFILENBQVUsaUJBQVYsRUFBNEJ2RCxJQUE1QjtBQUNBcUQsS0FBR0UsTUFBSCxDQUFVLE9BQVYsRUFBbUJULEtBQW5COztBQUVBLE1BQUlVLGdCQUFnQjFCLGFBQWFpQixVQUFiLEVBQXlCLE1BQXpCLEVBQWlDTSxFQUFqQyxDQUFwQjtBQUNBLE1BQUdHLGtCQUFrQixJQUFyQixFQUNBO0FBQ0UsUUFBSUMsUUFBUTNCLGFBQWFrQixTQUFiLEVBQXVCLEtBQXZCLEVBQTZCLEVBQTdCLENBQVo7QUFDQTtBQUNBLFFBQUdoRixZQUFZeUYsS0FBZixFQUNBO0FBQ0V2TCxjQUFRWSxHQUFSLENBQVlrRixXQUFTLE9BQXJCLEVBQThCaUYsYUFBVyx1QkFBWCxHQUFtQ1EsTUFBTXpGLFFBQU4sQ0FBbkMsR0FBbUQsVUFBakY7QUFDRCxLQUhELE1BS0E7QUFDRTlGLGNBQVFZLEdBQVIsQ0FBWWtGLFdBQVMsT0FBckIsRUFBOEIseUNBQXVDaUYsVUFBdkMsR0FBa0QsUUFBaEY7QUFDRDtBQUNELFNBQUksSUFBSVMsQ0FBUixJQUFhRixhQUFiLEVBQ0E7QUFDRSxVQUFHRSxLQUFLLE1BQVIsRUFDQTtBQUNFeEwsZ0JBQVFZLEdBQVIsQ0FBWSxZQUFaLEVBQTBCMEssY0FBY0UsQ0FBZCxDQUExQjtBQUNBeEwsZ0JBQVF5TCxJQUFSLENBQWEsY0FBYixFQUE2QjNGLFFBQTdCO0FBQ0Q7QUFDRjtBQUNGLEdBcEJELE1Bc0JBO0FBQ0UsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ08sU0FBUzRGLGlCQUFULENBQTJCQyxJQUEzQixFQUFpQ2QsVUFBakMsRUFBNkM3RCxRQUE3QyxFQUF1RGhILE9BQXZELEVBQ1A7QUFDSUosVUFBUUMsR0FBUixDQUFZLDhCQUFaO0FBQ0EsTUFBSWdLLE1BQU1nQixhQUFXN0ssUUFBUUcsR0FBUixDQUFZLFlBQVosQ0FBckI7QUFDQTtBQUNBLE1BQUl5TCxzQkFBc0JoQyxhQUFhQyxHQUFiLEVBQWtCLEtBQWxCLEVBQXlCLEVBQXpCLENBQTFCO0FBQ0EsTUFBRyxDQUFFK0IsbUJBQUwsRUFBeUI7QUFBQ3RLLFVBQU0sb0JBQU47QUFBNkI7QUFDdkQsTUFBSVUsTUFBTTZKLFNBQVM3RSxXQUFTNEUsb0JBQW9CRSxXQUFwQixDQUFnQyxDQUFoQyxFQUFtQ0MsVUFBckQsRUFBaUUsS0FBakUsRUFBd0UsRUFBeEUsQ0FBVjtBQUNBLE1BQUlDLE9BQU8sRUFBWDtBQUNBSixzQkFBb0JFLFdBQXBCLENBQWdDdE0sT0FBaEMsQ0FBd0MsVUFBU3lNLFVBQVQsRUFBb0I7QUFDMURELFlBQVFDLFdBQVduRyxRQUFYLEdBQW9CLEdBQTVCO0FBQ0QsR0FGRDtBQUdBa0csU0FBT0EsS0FBS0UsS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFDLENBQWYsQ0FBUDtBQUNBLFNBQU8sRUFBQyxPQUFPbEssR0FBUixFQUFhLFNBQVM0SixvQkFBb0JFLFdBQXBCLENBQWdDLENBQWhDLEVBQW1DbEIsS0FBekQsRUFBZ0UsUUFBUWdCLG9CQUFvQkUsV0FBcEIsQ0FBZ0MsQ0FBaEMsRUFBbUNLLGVBQTNHLEVBQTRILFFBQVFILElBQXBJLEVBQVA7QUFDSDs7QUFHRDtBQUNBLFNBQVNILFFBQVQsQ0FBa0JoQyxHQUFsQixFQUF1QmhILElBQXZCLEVBQTZCaUgsU0FBN0IsRUFDQTs7QUFFQyxNQUFJQyxXQUFXLElBQWY7QUFDQ0MsSUFBRUMsSUFBRixDQUFPO0FBQ0xwSCxVQUFNQSxJQUREO0FBRUwzRCxVQUFNNEssU0FGRDtBQUdMSSxXQUFPLEtBSEY7QUFJTEMsaUJBQWEsS0FKUjtBQUtMQyxpQkFBYSxLQUxSO0FBTUxDLFdBQVMsS0FOSjtBQU9MO0FBQ0E7QUFDQVIsU0FBS0EsR0FUQTtBQVVMVSxhQUFVLFVBQVVyTCxJQUFWLEVBQ1Y7QUFDRSxVQUFHQSxTQUFTLElBQVosRUFBaUI7QUFBQ29DLGNBQU0sbUNBQU47QUFBNEM7QUFDOUR5SSxpQkFBUzdLLElBQVQ7QUFDQTtBQUNELEtBZkk7QUFnQkxzTCxXQUFPLFVBQVVBLEtBQVYsRUFBaUI7QUFBQ2xKLFlBQU0sb0hBQU47QUFBNkg7QUFoQmpKLEdBQVA7QUFrQkEsU0FBT3lJLFFBQVA7QUFDRDs7QUFHRDtBQUNBO0FBQ08sU0FBU3pCLFlBQVQsQ0FBc0I4RCxRQUF0QixFQUFnQ2xFLElBQWhDLEVBQXNDbUUsR0FBdEMsRUFBMkMzRyxHQUEzQyxFQUFnRDFGLE9BQWhELEVBQ1A7QUFDRSxNQUFJNkosTUFBTXVDLFdBQVdsRSxJQUFyQjtBQUNBLE1BQUlvRSxZQUFZcEUsS0FBSzNJLEtBQUwsQ0FBVyxHQUFYLENBQWhCO0FBQ0E7QUFDQTtBQUNBSyxVQUFRQyxHQUFSLENBQVkscUNBQVo7QUFDQSxNQUFJa0ssV0FBVyxJQUFmO0FBQ0FDLElBQUVDLElBQUYsQ0FBTztBQUNMcEgsVUFBTSxLQUREO0FBRUx3SCxXQUFTLElBRko7QUFHTFIsU0FBS0EsR0FIQTtBQUlMVSxhQUFVLFVBQVV0SyxJQUFWLEVBQ1Y7QUFDRXlGLFVBQUk2RyxNQUFKLENBQVdELFVBQVUsQ0FBVixDQUFYLEVBQXlCck0sSUFBekIsQ0FBOEJxTSxVQUFVLENBQVYsQ0FBOUIsRUFBNENyTSxJQUE1QztBQUNBLFVBQUdvTSxRQUFRLE9BQVgsRUFDQTtBQUNFck0sZ0JBQVFZLEdBQVIsQ0FBWSxlQUFaLEVBQTZCWCxJQUE3QjtBQUNBWSxjQUFNa0YsT0FBTixDQUFjOUYsSUFBZCxFQUFvQixjQUFwQixFQUFvQyxFQUFDYyxRQUFRLHFCQUFULEVBQWdDQyxlQUFlLENBQS9DLEVBQXBDO0FBQ0Q7QUFDRCxVQUFHcUwsUUFBUSxLQUFYLEVBQ0E7QUFDRXRNLFFBQUEsbUdBQUFBLENBQVVDLE9BQVYsRUFBbUJDLElBQW5CO0FBQ0Q7QUFDRCxVQUFHb00sUUFBUSxPQUFYLEVBQ0E7QUFDRTlLLFFBQUEscUdBQUFBLENBQVl2QixPQUFaLEVBQXFCQyxJQUFyQjtBQUNBO0FBQ0Q7QUFDRCxVQUFHb00sUUFBUSxNQUFYLEVBQ0E7QUFDRTVLLFFBQUEsb0dBQUFBLENBQVd6QixPQUFYLEVBQW9CQyxJQUFwQjtBQUNEO0FBQ0QsVUFBR29NLFFBQVEsWUFBWCxFQUNBO0FBQ0V0SyxRQUFBLDBHQUFBQSxDQUFpQi9CLE9BQWpCLEVBQTBCQyxJQUExQjtBQUNEO0FBQ0QsVUFBR29NLFFBQVEsU0FBWCxFQUNBO0FBQ0V6SixRQUFBLHVHQUFBQSxDQUFjNUMsT0FBZCxFQUF1QkMsSUFBdkIsRUFBNkIsTUFBN0I7QUFDRDtBQUNELFVBQUdvTSxRQUFRLGFBQVgsRUFDQTtBQUNFekosUUFBQSx1R0FBQUEsQ0FBYzVDLE9BQWQsRUFBdUJDLElBQXZCLEVBQTZCLEtBQTdCO0FBQ0Q7QUFDRixLQXJDSTtBQXNDTHVLLFdBQU8sVUFBVUEsS0FBVixFQUFpQjtBQUFDbEosWUFBTWtMLEtBQUtDLFNBQUwsQ0FBZWpDLEtBQWYsQ0FBTjtBQUE4QjtBQXRDbEQsR0FBUDtBQXdDRCxDOzs7Ozs7Ozs7Ozs7OztBQ3ZMRDs7Ozs7Ozs7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSWtDLFlBQVksSUFBSUMsU0FBSixDQUFjLGFBQWQsQ0FBaEI7QUFDQSxJQUFJakgsTUFBTSxJQUFJQyxLQUFKLEVBQVY7O0FBRUErRyxVQUFVRSxFQUFWLENBQWEsU0FBYixFQUF3QixVQUFTMUIsQ0FBVCxFQUFZO0FBQ2hDdEwsVUFBUUMsR0FBUixDQUFZcUwsQ0FBWjtBQUNILENBRkQ7QUFHQXdCLFVBQVVFLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFVBQVMxQixDQUFULEVBQVk7QUFDOUJ0TCxVQUFRQyxHQUFSLENBQVlxTCxDQUFaO0FBQ0gsQ0FGRDs7QUFJQTtBQUNBLElBQUkyQixnQkFBZ0IsSUFBcEI7QUFDQSxJQUFJaEMsYUFBYSxJQUFqQjtBQUNBLElBQUlDLFlBQVksSUFBaEI7QUFDQSxJQUFJZ0MsWUFBWSxpRUFBaEI7QUFDQSxJQUFJQyxXQUFXLDRCQUFmO0FBQ0EsSUFBSUMsV0FBVyxlQUFmO0FBQ0EsSUFBSWhHLFdBQVcsRUFBZjtBQUNBLElBQUl4QixjQUFjLGlFQUErRHNILFNBQS9ELEdBQXlFLGFBQTNGOztBQUVBLElBQUczSSxTQUFTOEksUUFBVCxLQUFzQixXQUF0QixJQUFxQzlJLFNBQVM4SSxRQUFULEtBQXNCLFdBQTlELEVBQ0E7QUFDRUosa0JBQWdCLHNEQUFoQjtBQUNBaEMsZUFBYSx1REFBYjtBQUNBQyxjQUFZLHFEQUFaO0FBQ0FrQyxhQUFXLFlBQVg7QUFDQUQsYUFBVyx1QkFBWDtBQUNBRCxjQUFZLDRCQUFaO0FBQ0E5RixhQUFXK0YsUUFBWDtBQUNELENBVEQsTUFVSyxJQUFHNUksU0FBUzhJLFFBQVQsS0FBc0IsMkJBQXRCLElBQXFEOUksU0FBUzhJLFFBQVQsS0FBdUIscUJBQTVFLElBQXFHOUksU0FBU0MsSUFBVCxLQUFtQiwwQ0FBM0gsRUFBdUs7QUFDMUt5SSxrQkFBZ0JFLFdBQVNDLFFBQVQsR0FBa0IsaUJBQWxDO0FBQ0FuQyxlQUFha0MsV0FBU0MsUUFBVCxHQUFrQixrQkFBL0I7QUFDQWxDLGNBQVlpQyxXQUFTQyxRQUFULEdBQWtCLGdCQUE5QjtBQUNBaEcsYUFBVytGLFdBQVNDLFFBQVQsR0FBa0IsTUFBN0I7QUFDQTtBQUNELENBTkksTUFPQTtBQUNIMUwsUUFBTSx1Q0FBTjtBQUNBdUwsa0JBQWdCLEVBQWhCO0FBQ0FoQyxlQUFhLEVBQWI7QUFDQUMsY0FBWSxFQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxJQUFJOUssVUFBVSxJQUFJa04sT0FBSixDQUFZO0FBQ3hCQyxNQUFJLGVBRG9CO0FBRXhCQyxZQUFVLGdCQUZjO0FBR3hCbE8sUUFBTTtBQUNFbU8sMkJBQXVCLENBRHpCO0FBRUVDLDRCQUF3QixDQUYxQjtBQUdFQyxxQkFBaUIsQ0FIbkI7QUFJRUMsMkJBQXVCLENBSnpCO0FBS0VDLCtCQUEyQixDQUw3QjtBQU1FQyxrQkFBYyxJQU5oQjs7QUFRRUMscUJBQWlCLEtBUm5CO0FBU0VDLG9CQUFnQixLQVRsQjtBQVVFQyxzQkFBa0IsS0FWcEI7QUFXRUMscUJBQWlCLEtBWG5CO0FBWUVDLHVCQUFtQixLQVpyQjtBQWFFQyxzQkFBa0IsS0FicEI7QUFjRUMsMEJBQXNCLEtBZHhCO0FBZUVDLHlCQUFxQixLQWZ2QjtBQWdCRUMscUJBQWlCLEtBaEJuQjtBQWlCRUMsb0JBQWdCLEtBakJsQjtBQWtCRUMseUJBQXFCLElBbEJ2QjtBQW1CRUMsd0JBQW9CLEtBbkJ0QjtBQW9CRUMscUJBQWlCLEtBcEJuQjtBQXFCRUMsb0JBQWdCLEtBckJsQjtBQXNCRUMsMEJBQXNCLEtBdEJ4QjtBQXVCRUMseUJBQXFCLEtBdkJ2QjtBQXdCRUMscUJBQWlCLEtBeEJuQjtBQXlCRUMsb0JBQWdCLEtBekJsQjtBQTBCRUMscUJBQWlCLEtBMUJuQjtBQTJCRUMsb0JBQWdCLEtBM0JsQjtBQTRCRUMsb0JBQWdCLEtBNUJsQjtBQTZCRUMsbUJBQWUsS0E3QmpCO0FBOEJFQyxxQkFBaUIsS0E5Qm5CO0FBK0JFQyxvQkFBZ0IsS0EvQmxCO0FBZ0NFQyxvQkFBZ0IsS0FoQ2xCO0FBaUNFQyxtQkFBZSxLQWpDakI7QUFrQ0VDLHNCQUFrQixLQWxDcEI7QUFtQ0VDLHFCQUFpQixLQW5DbkI7QUFvQ0VDLG9CQUFnQixLQXBDbEI7QUFxQ0VDLG1CQUFlLEtBckNqQjtBQXNDRUMsd0JBQW9CLEtBdEN0QjtBQXVDRUMsdUJBQW1CLEtBdkNyQjs7QUF5Q0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsb0JBQWdCLEVBaERsQjtBQWlERUMsaUJBQWEsYUFqRGY7QUFrREVDLGtCQUFjLGNBbERoQjtBQW1ERUMsbUJBQWUsZUFuRGpCO0FBb0RFQyxzQkFBa0Isa0JBcERwQjtBQXFERUMsaUJBQWEsYUFyRGY7QUFzREVDLHFCQUFpQixpQkF0RG5CO0FBdURFQyxpQkFBYSxhQXZEZjtBQXdERUMsc0JBQWtCLGtCQXhEcEI7QUF5REVDLGlCQUFhLGFBekRmO0FBMERFQyxpQkFBYSxhQTFEZjtBQTJERUMsZ0JBQVksWUEzRGQ7QUE0REVDLGlCQUFhLGFBNURmO0FBNkRFQyxnQkFBWSxZQTdEZDtBQThERUMsa0JBQWMsY0E5RGhCO0FBK0RFQyxnQkFBWSxZQS9EZDtBQWdFRUMsb0JBQWdCLGdCQWhFbEI7O0FBbUVFQyw2QkFBeUIsc0RBbkUzQjtBQW9FRUMsMEJBQXNCckwsV0FwRXhCO0FBcUVFc0wsa0JBQWMsY0FyRWhCO0FBc0VFQyxtQkFBZSxJQXRFakI7O0FBd0VFQyw4QkFBMEIsdURBeEU1QjtBQXlFRUMsMkJBQXVCekwsV0F6RXpCO0FBMEVFMEwsbUJBQWUsY0ExRWpCO0FBMkVFQyxvQkFBZ0IsSUEzRWxCOztBQTZFRUMsK0JBQTJCLHlEQTdFN0I7QUE4RUVDLDRCQUF3QjdMLFdBOUUxQjtBQStFRThMLG9CQUFnQixjQS9FbEI7QUFnRkVDLHlCQUFxQixFQWhGdkI7QUFpRkVDLHVCQUFtQixFQWpGckI7O0FBbUZFQyxrQ0FBOEIsMkRBbkZoQztBQW9GRUMsK0JBQTJCbE0sV0FwRjdCO0FBcUZFbU0sdUJBQW1CLGNBckZyQjtBQXNGRUMsZ0JBQVksSUF0RmQ7QUF1RkVDLGtCQUFjLEVBdkZoQjs7QUF5RkVDLDZCQUF5QixzREF6RjNCO0FBMEZFQywwQkFBc0J2TSxXQTFGeEI7QUEyRkV3TSxrQkFBYyxjQTNGaEI7QUE0RkVDLDBCQUFzQixFQTVGeEI7QUE2RkVDLHdCQUFvQixFQTdGdEI7O0FBK0ZFQyxpQ0FBNkIsMERBL0YvQjtBQWdHRUMsOEJBQTBCNU0sV0FoRzVCO0FBaUdFNk0sc0JBQWtCLGNBakdwQjtBQWtHRUMsZUFBVyxJQWxHYjtBQW1HRUMsaUJBQWEsRUFuR2Y7O0FBcUdFQyw2QkFBeUIsc0RBckczQjtBQXNHRUMsMEJBQXNCak4sV0F0R3hCO0FBdUdFa04sa0JBQWMsY0F2R2hCO0FBd0dFQyxrQkFBYyxJQXhHaEI7O0FBMEdFQyxrQ0FBOEIsMkRBMUdoQztBQTJHRUMsK0JBQTJCck4sV0EzRzdCO0FBNEdFc04sdUJBQW1CLGNBNUdyQjtBQTZHRUMsdUJBQW1CLElBN0dyQjs7QUErR0VDLDZCQUF5QixzREEvRzNCO0FBZ0hFQywwQkFBc0J6TixXQWhIeEI7QUFpSEUwTixrQkFBYyxjQWpIaEI7QUFrSEVDLGtCQUFjLElBbEhoQjs7QUFvSEVDLDZCQUF5QixzREFwSDNCO0FBcUhFQywwQkFBc0I3TixXQXJIeEI7QUFzSEU4TixrQkFBYyxjQXRIaEI7QUF1SEVDLGtCQUFjLElBdkhoQjs7QUF5SEVDLDRCQUF3QixxREF6SDFCO0FBMEhFQyx5QkFBcUJqTyxXQTFIdkI7QUEySEVrTyxpQkFBYSxjQTNIZjtBQTRIRUMsaUJBQWEsSUE1SGY7O0FBOEhFQyxnQ0FBNEIseURBOUg5QjtBQStIRUMsNkJBQXlCck8sV0EvSDNCO0FBZ0lFc08scUJBQWlCLGNBaEluQjtBQWlJRUMscUJBQWlCLElBakluQjs7QUFtSUVDLDZCQUF5QixzREFuSTNCO0FBb0lFQywwQkFBc0J6TyxXQXBJeEI7QUFxSUUwTyxrQkFBYyxjQXJJaEI7QUFzSUVDLGtCQUFjLElBdEloQjs7QUF3SUVDLDRCQUF3QixxREF4STFCO0FBeUlFQyx5QkFBcUI3TyxXQXpJdkI7QUEwSUU4TyxpQkFBYSxjQTFJZjtBQTJJRUMsaUJBQWEsSUEzSWY7O0FBNklFQyw4QkFBMEIsdURBN0k1QjtBQThJRUMsMkJBQXVCalAsV0E5SXpCO0FBK0lFa1AsbUJBQWUsY0EvSWpCO0FBZ0pFQyxtQkFBZSxJQWhKakI7O0FBa0pFQyw0QkFBd0Isd0RBbEoxQjtBQW1KRUMseUJBQXFCclAsV0FuSnZCO0FBb0pFc1AsaUJBQWEsY0FwSmY7QUFxSkVDLGlCQUFhLElBckpmOztBQXVKRTtBQUNBQyxjQUFVLEVBeEpaO0FBeUpFQyxxQkFBaUIsQ0F6Sm5CO0FBMEpFQyx1QkFBbUIsQ0ExSnJCO0FBMkpFQyxzQkFBa0IsQ0EzSnBCO0FBNEpFdkssV0FBTyxFQTVKVDtBQTZKRTlDLFVBQU0sRUE3SlI7QUE4SkVzTixnQkFBWSxJQTlKZDs7QUFnS0U7QUFDQWxWLGlCQUFhO0FBaktmO0FBSGtCLENBQVosQ0FBZDs7QUF3S0E7QUFDQSxJQUFHaUUsU0FBUzhJLFFBQVQsS0FBc0IsV0FBekIsRUFBc0M7QUFDcENqTixVQUFRWSxHQUFSLENBQVksT0FBWixFQUFxQix5QkFBckI7QUFDQVosVUFBUVksR0FBUixDQUFZLE1BQVosRUFBb0IsTUFBcEI7QUFDQVosVUFBUVksR0FBUixDQUFZLFVBQVosRUFBd0IsdURBQXhCO0FBQ0Q7O0FBRUQ7QUFDQSxJQUFJeVUsYUFBYSw0RUFBakI7QUFDQSxJQUFJQyxhQUFhRCxXQUFXalcsSUFBWCxDQUFnQixrR0FBQTJFLEdBQWE0SCxJQUE3QixDQUFqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTRKLGVBQWV2VixRQUFRd1YsT0FBUixDQUFnQixVQUFoQixFQUE0QixVQUFTQyxRQUFULEVBQW1CQyxRQUFuQixFQUE4QjtBQUMzRSxNQUFJelcsUUFBUSxXQUFaO0FBQ0EsTUFBSUUsUUFBUUYsTUFBTUcsSUFBTixDQUFXcVcsUUFBWCxDQUFaO0FBQ0EsTUFBR3RXLEtBQUgsRUFDQTtBQUNFLFNBQUt5QixHQUFMLENBQVMsTUFBVCxFQUFpQnpCLE1BQU0sQ0FBTixDQUFqQjtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBRUMsQ0FYZ0IsRUFZakIsRUFBQ3dXLE1BQU0sS0FBUDtBQUNDQyxTQUFPO0FBRFIsQ0FaaUIsQ0FBbkI7QUFlQTtBQUNBNVYsUUFBUXdWLE9BQVIsQ0FBaUIsa0JBQWpCLEVBQXFDLFVBQVdoUyxLQUFYLEVBQW1CO0FBQ3RELE1BQUlxUyxhQUFhN1YsUUFBUUcsR0FBUixDQUFZLGlCQUFaLENBQWpCO0FBQ0EsTUFBSTJWLFlBQVk5VixRQUFRRyxHQUFSLENBQVksbUJBQVosQ0FBaEI7QUFDQSxNQUFHcUQsUUFBUXFTLFVBQVgsRUFDQTtBQUNFN1YsWUFBUVksR0FBUixDQUFZLGtCQUFaLEVBQWdDaVYsVUFBaEM7QUFDRDtBQUNELE1BQUdyUyxTQUFTc1MsU0FBWixFQUNBO0FBQ0U5VixZQUFRWSxHQUFSLENBQVksa0JBQVosRUFBZ0NrVixZQUFVLENBQTFDO0FBQ0Q7QUFDRixDQVhEO0FBWUE5VixRQUFRd1YsT0FBUixDQUFpQixtQkFBakIsRUFBc0MsVUFBV2hTLEtBQVgsRUFBbUI7QUFDdkQsTUFBSXVTLFdBQVcvVixRQUFRRyxHQUFSLENBQVksa0JBQVosQ0FBZjtBQUNBLE1BQUdxRCxRQUFRLENBQVgsRUFDQTtBQUNFeEQsWUFBUVksR0FBUixDQUFZLG1CQUFaLEVBQWlDLENBQWpDO0FBQ0Q7QUFDRCxNQUFHNEMsU0FBU3VTLFFBQVosRUFDQTtBQUNFL1YsWUFBUVksR0FBUixDQUFZLG1CQUFaLEVBQWlDbVYsV0FBUyxDQUExQztBQUNEO0FBQ0YsQ0FWRDs7QUFZQTtBQUNBO0FBQ0EvVixRQUFRNE0sRUFBUixDQUFXLGNBQVgsRUFBMkIsVUFBUzlFLElBQVQsRUFBZWtPLFFBQWYsRUFBd0I7QUFDakRwVyxVQUFRQyxHQUFSLENBQVksNkJBQVo7QUFDQSxNQUFJZ0ssTUFBTWdCLGFBQWE3SyxRQUFRRyxHQUFSLENBQVksWUFBWixDQUF2QjtBQUNBOFYsVUFBUUMsU0FBUixDQUFrQixJQUFsQixFQUF3QixFQUF4QixFQUE0QmxKLFdBQVMsU0FBVCxHQUFtQmhOLFFBQVFHLEdBQVIsQ0FBWSxZQUFaLENBQS9DO0FBQ0F3RCxFQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCOztBQUVBLE1BQUltVyxXQUFXQyxZQUFZLFlBQVU7QUFDbkMsUUFBSUMsUUFBUSx3R0FBQXpNLENBQWFDLEdBQWIsRUFBa0IsS0FBbEIsRUFBeUIsRUFBekIsQ0FBWjtBQUNBLFFBQUloRSxpQkFBaUIsRUFBckI7O0FBRUEsUUFBR3dRLE1BQU1DLEtBQU4sS0FBZ0IsVUFBbkIsRUFDQTtBQUNFMVcsY0FBUUMsR0FBUixDQUFZLGdCQUFaO0FBQ0EsVUFBSWlNLGNBQWN1SyxNQUFNdkssV0FBeEI7QUFDQUEsa0JBQVl0TSxPQUFaLENBQW9CLFVBQVNOLElBQVQsRUFBYztBQUM5QjtBQUNBMEcsUUFBQSwwSEFBQUEsQ0FBdUIxRyxJQUF2QixFQUE2QjJHLGNBQTdCO0FBQ0FrQixRQUFBLGtIQUFBQSxDQUFlL0csT0FBZixFQUF3QmQsSUFBeEIsRUFBOEI4SCxRQUE5QixFQUF3Q3RCLEdBQXhDLEVBQTZDRyxjQUE3QztBQUVILE9BTEQ7QUFNQTRELE1BQUEsdUhBQUFBLENBQW9CekosT0FBcEIsRUFBNkI2RixjQUE3Qjs7QUFFQTBRLG9CQUFjSixRQUFkO0FBQ0Q7QUFDRCxRQUFHRSxNQUFNQyxLQUFOLEtBQWdCLE9BQWhCLElBQTJCRCxNQUFNQyxLQUFOLEtBQWdCLE9BQTlDLEVBQ0E7QUFDRSxVQUFJRSxxQkFBcUJILE1BQU12SyxXQUFOLENBQWtCLENBQWxCLEVBQXFCMkssWUFBOUM7QUFDQW5WLFlBQU0sZ0NBQ0Esa0ZBREEsR0FDbUZrVixrQkFEekY7QUFFRUQsb0JBQWNKLFFBQWQ7QUFDSDtBQUNGLEdBekJjLEVBeUJaLElBekJZLENBQWY7QUEyQkQsQ0FqQ0QsRUFpQ0UsRUFBQ1IsTUFBTSxLQUFQO0FBQ0NDLFNBQU87QUFEUixDQWpDRjs7QUFzQ0E7QUFDQTVWLFFBQVE0TSxFQUFSLENBQVcsU0FBWCxFQUFzQixVQUFVOEosT0FBVixFQUFtQjtBQUNyQyxNQUFJL0ssT0FBTzNMLFFBQVFHLEdBQVIsQ0FBWSxZQUFaLENBQVg7QUFDQXVGLE1BQUlpUixhQUFKLENBQWtCLEVBQUM5VCxNQUFLLE1BQU4sRUFBbEIsRUFBaUMrVCxJQUFqQyxDQUFzQyxVQUFVQyxJQUFWLEVBQWdCO0FBQ2xEQyxXQUFPRCxJQUFQLEVBQWFsTCxPQUFLLE1BQWxCO0FBQ0gsR0FGRDtBQUdILENBTEQ7O0FBT0E7QUFDQTtBQUNBM0wsUUFBUTRNLEVBQVIsQ0FBWSxpQkFBWixFQUErQixVQUFXbUssS0FBWCxFQUFtQjtBQUNoRC9XLFVBQVFZLEdBQVIsQ0FBYSx3QkFBYixFQUF1QyxJQUF2QztBQUNBWixVQUFRWSxHQUFSLENBQWEsd0JBQWIsRUFBdUMsQ0FBdkM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLElBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxrQkFBYixFQUFpQyxLQUFqQztBQUNBWixVQUFRWSxHQUFSLENBQWEsbUJBQWIsRUFBa0MsS0FBbEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHNCQUFiLEVBQXFDLEtBQXJDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxLQUFoQztBQUNBWixVQUFRWSxHQUFSLENBQWEscUJBQWIsRUFBb0MsS0FBcEM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxzQkFBYixFQUFxQyxLQUFyQztBQUNBWixVQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsS0FBaEM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxnQkFBYixFQUErQixLQUEvQjtBQUNBWixVQUFRWSxHQUFSLENBQWEsb0JBQWIsRUFBbUMsS0FBbkM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxnQkFBYixFQUErQixLQUEvQjtBQUNBWixVQUFRWSxHQUFSLENBQWEsa0JBQWIsRUFBaUMsS0FBakM7QUFDQVosVUFBUVksR0FBUixDQUFhLGdCQUFiLEVBQStCLEtBQS9CO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsQ0FBdEM7QUFDRCxDQXJCRDtBQXNCQVosUUFBUTRNLEVBQVIsQ0FBWSxrQkFBWixFQUFnQyxVQUFXbUssS0FBWCxFQUFtQjtBQUNqRC9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsQ0FBdEM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxrQkFBYixFQUFpQyxLQUFqQztBQUNBWixVQUFRWSxHQUFSLENBQWEsbUJBQWIsRUFBa0MsS0FBbEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHNCQUFiLEVBQXFDLEtBQXJDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxLQUFoQztBQUNBWixVQUFRWSxHQUFSLENBQWEscUJBQWIsRUFBb0MsS0FBcEM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxzQkFBYixFQUFxQyxLQUFyQztBQUNBWixVQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsS0FBaEM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxnQkFBYixFQUErQixLQUEvQjtBQUNBWixVQUFRWSxHQUFSLENBQWEsb0JBQWIsRUFBbUMsS0FBbkM7QUFDQVosVUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLEtBQWhDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSxnQkFBYixFQUErQixLQUEvQjtBQUNBWixVQUFRWSxHQUFSLENBQWEsa0JBQWIsRUFBaUMsS0FBakM7QUFDQVosVUFBUVksR0FBUixDQUFhLGdCQUFiLEVBQStCLEtBQS9CO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx3QkFBYixFQUF1QyxJQUF2QztBQUNBWixVQUFRWSxHQUFSLENBQWEsd0JBQWIsRUFBdUMsQ0FBdkM7QUFDRCxDQXJCRDs7QUF1QkFaLFFBQVE0TSxFQUFSLENBQVksa0JBQVosRUFBZ0MsVUFBV21LLEtBQVgsRUFBbUI7QUFDakQvVyxVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLEVBQXRDO0FBQ0QsQ0FIRDtBQUlBWixRQUFRNE0sRUFBUixDQUFZLGdCQUFaLEVBQThCLFVBQVdtSyxLQUFYLEVBQW1CO0FBQy9DL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxDQUF0QztBQUNBLE1BQUdaLFFBQVFHLEdBQVIsQ0FBWSxlQUFaLENBQUgsRUFDQTtBQUNFVSxVQUFNa0YsT0FBTixDQUFjL0YsUUFBUUcsR0FBUixDQUFZLGVBQVosQ0FBZCxFQUE0QyxjQUE1QyxFQUE0RCxFQUFDWSxRQUFRLHFCQUFULEVBQWdDQyxlQUFlLENBQS9DLEVBQTVEO0FBQ0Q7QUFDRixDQVBEO0FBUUFoQixRQUFRNE0sRUFBUixDQUFZLGlCQUFaLEVBQStCLFVBQVdtSyxLQUFYLEVBQW1CO0FBQ2hEL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxDQUF0QztBQUNBLE1BQUdaLFFBQVFHLEdBQVIsQ0FBWSxnQkFBWixDQUFILEVBQ0E7QUFDRVUsVUFBTWUsa0JBQU4sQ0FBeUI1QixRQUFRRyxHQUFSLENBQVksZ0JBQVosQ0FBekIsRUFBd0QsS0FBeEQsRUFBK0QsQ0FBQyxXQUFELENBQS9ELEVBQThFLENBQUMsT0FBRCxDQUE5RSxFQUEwRixhQUExRixFQUF5RyxFQUFDWSxRQUFRLGVBQVQsRUFBMEJjLFdBQVcsTUFBckMsRUFBNkNDLFVBQVUsR0FBdkQsRUFBNERkLGVBQWUsQ0FBM0UsRUFBOEVDLE9BQU8sS0FBckYsRUFBNEZDLGlCQUFpQixHQUE3RyxFQUFrSEMsT0FBTyxHQUF6SCxFQUE4SEMsUUFBUSxHQUF0SSxFQUEySUMsa0JBQWtCLEdBQTdKLEVBQXpHO0FBQ0Q7QUFDRixDQVBEO0FBUUFyQixRQUFRNE0sRUFBUixDQUFZLGtCQUFaLEVBQWdDLFVBQVdtSyxLQUFYLEVBQW1CO0FBQ2pEL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxDQUF0QztBQUNELENBSEQ7QUFJQVosUUFBUTRNLEVBQVIsQ0FBWSxxQkFBWixFQUFtQyxVQUFXbUssS0FBWCxFQUFtQjtBQUNwRC9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsQ0FBdEM7QUFDRCxDQUhEO0FBSUFaLFFBQVE0TSxFQUFSLENBQVksZ0JBQVosRUFBOEIsVUFBV21LLEtBQVgsRUFBbUI7QUFDL0MvVyxVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLENBQXRDO0FBQ0QsQ0FIRDtBQUlBWixRQUFRNE0sRUFBUixDQUFZLG9CQUFaLEVBQWtDLFVBQVdtSyxLQUFYLEVBQW1CO0FBQ25EL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxDQUF0QztBQUNELENBSEQ7QUFJQVosUUFBUTRNLEVBQVIsQ0FBWSxnQkFBWixFQUE4QixVQUFXbUssS0FBWCxFQUFtQjtBQUMvQy9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsQ0FBdEM7QUFDRCxDQUhEO0FBSUFaLFFBQVE0TSxFQUFSLENBQVkscUJBQVosRUFBbUMsVUFBV21LLEtBQVgsRUFBbUI7QUFDcEQvVyxVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLENBQXRDO0FBQ0QsQ0FIRDtBQUlBWixRQUFRNE0sRUFBUixDQUFZLGdCQUFaLEVBQThCLFVBQVdtSyxLQUFYLEVBQW1CO0FBQy9DL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxFQUF0QztBQUNELENBSEQ7QUFJQVosUUFBUTRNLEVBQVIsQ0FBWSxnQkFBWixFQUE4QixVQUFXbUssS0FBWCxFQUFtQjtBQUMvQy9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsRUFBdEM7QUFDRCxDQUhEO0FBSUFaLFFBQVE0TSxFQUFSLENBQVksZUFBWixFQUE2QixVQUFXbUssS0FBWCxFQUFtQjtBQUM5Qy9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsRUFBdEM7QUFDRCxDQUhEO0FBSUFaLFFBQVE0TSxFQUFSLENBQVksbUJBQVosRUFBaUMsVUFBV21LLEtBQVgsRUFBbUI7QUFDbEQvVyxVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEM7QUFDQVosVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLEVBQXRDO0FBQ0QsQ0FIRDtBQUlBWixRQUFRNE0sRUFBUixDQUFZLGdCQUFaLEVBQThCLFVBQVdtSyxLQUFYLEVBQW1CO0FBQy9DL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxFQUF0QztBQUNELENBSEQ7QUFJQVosUUFBUTRNLEVBQVIsQ0FBWSxlQUFaLEVBQTZCLFVBQVdtSyxLQUFYLEVBQW1CO0FBQzlDL1csVUFBUVksR0FBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDO0FBQ0FaLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxFQUF0QztBQUNELENBSEQ7QUFJQVosUUFBUTRNLEVBQVIsQ0FBWSxpQkFBWixFQUErQixVQUFXbUssS0FBWCxFQUFtQjtBQUNoRC9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsRUFBdEM7QUFDRCxDQUhEO0FBSUFaLFFBQVE0TSxFQUFSLENBQVksZUFBWixFQUE2QixVQUFXbUssS0FBWCxFQUFtQjtBQUM5Qy9XLFVBQVFZLEdBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QztBQUNBWixVQUFRWSxHQUFSLENBQWEsdUJBQWIsRUFBc0MsRUFBdEM7QUFDRCxDQUhEOztBQU1BWixRQUFRNE0sRUFBUixDQUFZLG1CQUFaLEVBQWlDLFVBQVdtSyxLQUFYLEVBQW1CO0FBQ2xELE1BQUlULFFBQVF0VyxRQUFRRyxHQUFSLENBQVksMkJBQVosQ0FBWjtBQUNBLE1BQUdtVyxVQUFVLENBQWIsRUFBZTtBQUNidFcsWUFBUVksR0FBUixDQUFhLDJCQUFiLEVBQTBDLENBQTFDO0FBQ0QsR0FGRCxNQUdJO0FBQ0ZaLFlBQVFZLEdBQVIsQ0FBYSwyQkFBYixFQUEwQyxDQUExQztBQUNEO0FBQ0YsQ0FSRDs7QUFVQTtBQUNBWixRQUFRNE0sRUFBUixDQUFXLFFBQVgsRUFBcUIsVUFBU21LLEtBQVQsRUFBZ0I7QUFDbkNuWCxVQUFRQyxHQUFSLENBQVksaUJBQVo7QUFDQSxNQUFJbUMsTUFBTSxLQUFLN0IsR0FBTCxDQUFTLFVBQVQsQ0FBVjtBQUNBNkIsUUFBTUEsSUFBSXFDLE9BQUosQ0FBWSxTQUFaLEVBQXVCLEVBQXZCLEVBQTJCMkcsV0FBM0IsRUFBTjtBQUNBaEosUUFBTUEsSUFBSXFDLE9BQUosQ0FBWSxRQUFaLEVBQXFCLEVBQXJCLENBQU47QUFDQXJFLFVBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQm9CLElBQUl4QixNQUFuQztBQUNBUixVQUFRWSxHQUFSLENBQVksa0JBQVosRUFBZ0NvQixJQUFJeEIsTUFBcEM7QUFDQVIsVUFBUVksR0FBUixDQUFZLFVBQVosRUFBd0JvQixHQUF4Qjs7QUFFQSxNQUFJOEYsT0FBTyxLQUFLM0gsR0FBTCxDQUFTLE1BQVQsQ0FBWDtBQUNBLE1BQUl5SyxRQUFRLEtBQUt6SyxHQUFMLENBQVMsT0FBVCxDQUFaO0FBQ0EsTUFBSXlQLGNBQWMsS0FBS3pQLEdBQUwsQ0FBUyxhQUFULENBQWxCO0FBQ0EsTUFBSXdOLGtCQUFrQixLQUFLeE4sR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSTBQLGVBQWUsS0FBSzFQLEdBQUwsQ0FBUyxjQUFULENBQW5CO0FBQ0EsTUFBSTBOLG1CQUFtQixLQUFLMU4sR0FBTCxDQUFTLGtCQUFULENBQXZCO0FBQ0EsTUFBSTJQLGdCQUFnQixLQUFLM1AsR0FBTCxDQUFTLGVBQVQsQ0FBcEI7QUFDQSxNQUFJNE4sb0JBQW9CLEtBQUs1TixHQUFMLENBQVMsbUJBQVQsQ0FBeEI7QUFDQSxNQUFJNFAsbUJBQW1CLEtBQUs1UCxHQUFMLENBQVMsa0JBQVQsQ0FBdkI7QUFDQSxNQUFJOE4sdUJBQXVCLEtBQUs5TixHQUFMLENBQVMsc0JBQVQsQ0FBM0I7QUFDQSxNQUFJNlAsY0FBYyxLQUFLN1AsR0FBTCxDQUFTLGFBQVQsQ0FBbEI7QUFDQSxNQUFJZ08sa0JBQWtCLEtBQUtoTyxHQUFMLENBQVMsaUJBQVQsQ0FBdEI7QUFDQSxNQUFJOFAsa0JBQWtCLEtBQUs5UCxHQUFMLENBQVMsaUJBQVQsQ0FBdEI7QUFDQSxNQUFJa08sc0JBQXNCLEtBQUtsTyxHQUFMLENBQVMscUJBQVQsQ0FBMUI7QUFDQSxNQUFJK1AsY0FBYyxLQUFLL1AsR0FBTCxDQUFTLGFBQVQsQ0FBbEI7QUFDQSxNQUFJb08sa0JBQWtCLEtBQUtwTyxHQUFMLENBQVMsaUJBQVQsQ0FBdEI7QUFDQSxNQUFJZ1EsbUJBQW1CLEtBQUtoUSxHQUFMLENBQVMsa0JBQVQsQ0FBdkI7QUFDQSxNQUFJc08sdUJBQXVCLEtBQUt0TyxHQUFMLENBQVMsc0JBQVQsQ0FBM0I7QUFDQSxNQUFJaVEsY0FBYyxLQUFLalEsR0FBTCxDQUFTLGFBQVQsQ0FBbEI7QUFDQSxNQUFJd08sa0JBQWtCLEtBQUt4TyxHQUFMLENBQVMsaUJBQVQsQ0FBdEI7QUFDQSxNQUFJa1EsY0FBYyxLQUFLbFEsR0FBTCxDQUFTLGFBQVQsQ0FBbEI7QUFDQSxNQUFJME8sa0JBQWtCLEtBQUsxTyxHQUFMLENBQVMsaUJBQVQsQ0FBdEI7QUFDQSxNQUFJbVEsYUFBYSxLQUFLblEsR0FBTCxDQUFTLFlBQVQsQ0FBakI7QUFDQSxNQUFJNE8saUJBQWlCLEtBQUs1TyxHQUFMLENBQVMsZ0JBQVQsQ0FBckI7QUFDQSxNQUFJd1EsaUJBQWlCLEtBQUt4USxHQUFMLENBQVMsZ0JBQVQsQ0FBckI7QUFDQSxNQUFJc1AscUJBQXFCLEtBQUt0UCxHQUFMLENBQVMsb0JBQVQsQ0FBekI7QUFDQSxNQUFJb1EsY0FBYyxLQUFLcFEsR0FBTCxDQUFTLGNBQVQsQ0FBbEI7QUFDQSxNQUFJOE8sa0JBQWtCLEtBQUs5TyxHQUFMLENBQVMsa0JBQVQsQ0FBdEI7QUFDQSxNQUFJcVEsYUFBYSxLQUFLclEsR0FBTCxDQUFTLFlBQVQsQ0FBakI7QUFDQSxNQUFJZ1AsaUJBQWlCLEtBQUtoUCxHQUFMLENBQVMsZ0JBQVQsQ0FBckI7QUFDQSxNQUFJc1EsZUFBZSxLQUFLdFEsR0FBTCxDQUFTLGNBQVQsQ0FBbkI7QUFDQSxNQUFJa1AsbUJBQW1CLEtBQUtsUCxHQUFMLENBQVMsa0JBQVQsQ0FBdkI7QUFDQSxNQUFJdVEsYUFBYSxLQUFLdlEsR0FBTCxDQUFTLFlBQVQsQ0FBakI7QUFDQSxNQUFJb1AsaUJBQWlCLEtBQUtwUCxHQUFMLENBQVMsZ0JBQVQsQ0FBckI7O0FBRUE2VyxFQUFBLDBHQUFBQSxDQUFxQmhYLE9BQXJCLEVBQThCZ0MsR0FBOUIsRUFBbUM4RixJQUFuQyxFQUF5QzhDLEtBQXpDLEVBQWdEQyxVQUFoRCxFQUE0REMsU0FBNUQsRUFBdUU2QyxlQUF2RSxFQUF3RkUsZ0JBQXhGLEVBQ3FCRSxpQkFEckIsRUFDd0NFLG9CQUR4QyxFQUM4REUsZUFEOUQsRUFDK0VFLG1CQUQvRSxFQUNvR0UsZUFEcEcsRUFFcUJFLG9CQUZyQixFQUUyQ0UsZUFGM0MsRUFFNERFLGVBRjVELEVBRTZFRSxjQUY3RSxFQUU2RlUsa0JBRjdGLEVBR3FCUixlQUhyQixFQUdzQ0UsY0FIdEMsRUFHc0RFLGdCQUh0RCxFQUd3RUUsY0FIeEU7QUFJQXdILFFBQU1FLFFBQU4sQ0FBZUMsY0FBZjtBQUNELENBakREOztBQW1EQTtBQUNBO0FBQ0FsWCxRQUFRNE0sRUFBUixDQUFXLFVBQVgsRUFBdUIsVUFBU21LLEtBQVQsRUFBZ0I7QUFDckNuWCxVQUFRQyxHQUFSLENBQVksc0JBQVo7QUFDQSxNQUFJc1gsUUFBUW5YLFFBQVFHLEdBQVIsQ0FBWSxtQkFBWixDQUFaO0FBQ0EsTUFBSWlYLE9BQU9wWCxRQUFRRyxHQUFSLENBQVksa0JBQVosQ0FBWDtBQUNBLE1BQUk2VSxXQUFXaFYsUUFBUUcsR0FBUixDQUFZLFVBQVosQ0FBZjtBQUNBLE1BQUlrWCxjQUFjckMsU0FBUzVSLFNBQVQsQ0FBbUIrVCxRQUFNLENBQXpCLEVBQTRCQyxJQUE1QixDQUFsQjtBQUNBLE1BQUl0UCxPQUFPLEtBQUszSCxHQUFMLENBQVMsTUFBVCxJQUFpQixNQUE1QjtBQUNBLE1BQUl5SyxRQUFRLEtBQUt6SyxHQUFMLENBQVMsT0FBVCxDQUFaO0FBQ0FILFVBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQnlXLFlBQVk3VyxNQUEzQztBQUNBUixVQUFRWSxHQUFSLENBQVksa0JBQVosRUFBZ0N5VyxZQUFZN1csTUFBNUM7QUFDQVIsVUFBUVksR0FBUixDQUFZLFVBQVosRUFBd0J5VyxXQUF4QjtBQUNBclgsVUFBUVksR0FBUixDQUFZLE1BQVosRUFBb0JrSCxJQUFwQjtBQUNBLE1BQUk4SCxjQUFjLEtBQUt6UCxHQUFMLENBQVMsYUFBVCxDQUFsQjtBQUNBLE1BQUl3TixrQkFBa0IsS0FBS3hOLEdBQUwsQ0FBUyxpQkFBVCxDQUF0QjtBQUNBLE1BQUkwUCxlQUFlLEtBQUsxUCxHQUFMLENBQVMsY0FBVCxDQUFuQjtBQUNBLE1BQUkwTixtQkFBbUIsS0FBSzFOLEdBQUwsQ0FBUyxrQkFBVCxDQUF2QjtBQUNBLE1BQUkyUCxnQkFBZ0IsS0FBSzNQLEdBQUwsQ0FBUyxlQUFULENBQXBCO0FBQ0EsTUFBSTROLG9CQUFvQixLQUFLNU4sR0FBTCxDQUFTLG1CQUFULENBQXhCO0FBQ0EsTUFBSTRQLG1CQUFtQixLQUFLNVAsR0FBTCxDQUFTLGtCQUFULENBQXZCO0FBQ0EsTUFBSThOLHVCQUF1QixLQUFLOU4sR0FBTCxDQUFTLHNCQUFULENBQTNCO0FBQ0EsTUFBSTZQLGNBQWMsS0FBSzdQLEdBQUwsQ0FBUyxhQUFULENBQWxCO0FBQ0EsTUFBSWdPLGtCQUFrQixLQUFLaE8sR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSThQLGtCQUFrQixLQUFLOVAsR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSWtPLHNCQUFzQixLQUFLbE8sR0FBTCxDQUFTLHFCQUFULENBQTFCO0FBQ0EsTUFBSStQLGNBQWMsS0FBSy9QLEdBQUwsQ0FBUyxhQUFULENBQWxCO0FBQ0EsTUFBSW9PLGtCQUFrQixLQUFLcE8sR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSWdRLG1CQUFtQixLQUFLaFEsR0FBTCxDQUFTLGtCQUFULENBQXZCO0FBQ0EsTUFBSXNPLHVCQUF1QixLQUFLdE8sR0FBTCxDQUFTLHNCQUFULENBQTNCO0FBQ0EsTUFBSWlRLGNBQWMsS0FBS2pRLEdBQUwsQ0FBUyxhQUFULENBQWxCO0FBQ0EsTUFBSXdPLGtCQUFrQixLQUFLeE8sR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSWtRLGNBQWMsS0FBS2xRLEdBQUwsQ0FBUyxhQUFULENBQWxCO0FBQ0EsTUFBSTBPLGtCQUFrQixLQUFLMU8sR0FBTCxDQUFTLGlCQUFULENBQXRCO0FBQ0EsTUFBSW1RLGFBQWEsS0FBS25RLEdBQUwsQ0FBUyxZQUFULENBQWpCO0FBQ0EsTUFBSTRPLGlCQUFpQixLQUFLNU8sR0FBTCxDQUFTLGdCQUFULENBQXJCO0FBQ0EsTUFBSXdRLGlCQUFpQixLQUFLeFEsR0FBTCxDQUFTLGdCQUFULENBQXJCO0FBQ0EsTUFBSXNQLHFCQUFxQixLQUFLdFAsR0FBTCxDQUFTLG9CQUFULENBQXpCO0FBQ0EsTUFBSW9RLGNBQWMsS0FBS3BRLEdBQUwsQ0FBUyxjQUFULENBQWxCO0FBQ0EsTUFBSThPLGtCQUFrQixLQUFLOU8sR0FBTCxDQUFTLGtCQUFULENBQXRCO0FBQ0EsTUFBSXFRLGFBQWEsS0FBS3JRLEdBQUwsQ0FBUyxZQUFULENBQWpCO0FBQ0EsTUFBSWdQLGlCQUFpQixLQUFLaFAsR0FBTCxDQUFTLGdCQUFULENBQXJCO0FBQ0EsTUFBSXNRLGVBQWUsS0FBS3RRLEdBQUwsQ0FBUyxjQUFULENBQW5CO0FBQ0EsTUFBSWtQLG1CQUFtQixLQUFLbFAsR0FBTCxDQUFTLGtCQUFULENBQXZCO0FBQ0EsTUFBSXVRLGFBQWEsS0FBS3ZRLEdBQUwsQ0FBUyxZQUFULENBQWpCO0FBQ0EsTUFBSW9QLGlCQUFpQixLQUFLcFAsR0FBTCxDQUFTLGdCQUFULENBQXJCO0FBQ0E7QUFDQW9GLEVBQUEsa0hBQUFBLENBQWV2RixPQUFmLEVBQXdCd0YsV0FBeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQXdSLEVBQUEsMEdBQUFBLENBQXFCaFgsT0FBckIsRUFBOEJxWCxXQUE5QixFQUEyQ3ZQLElBQTNDLEVBQWlEOEMsS0FBakQsRUFBd0RDLFVBQXhELEVBQW9FQyxTQUFwRSxFQUErRTZDLGVBQS9FLEVBQWdHRSxnQkFBaEcsRUFDcUJFLGlCQURyQixFQUN3Q0Usb0JBRHhDLEVBQzhERSxlQUQ5RCxFQUMrRUUsbUJBRC9FLEVBQ29HRSxlQURwRyxFQUVxQkUsb0JBRnJCLEVBRTJDRSxlQUYzQyxFQUU0REUsZUFGNUQsRUFFNkVFLGNBRjdFLEVBRTZGVSxrQkFGN0YsRUFHcUJSLGVBSHJCLEVBR3NDRSxjQUh0QyxFQUdzREUsZ0JBSHRELEVBR3dFRSxjQUh4RTtBQUlBO0FBQ0E7QUFDQXdILFFBQU1FLFFBQU4sQ0FBZUMsY0FBZjtBQUNELENBeEREOztBQTBEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRyxrR0FBQW5ULEdBQWE0SCxJQUFiLElBQXFCMkosVUFBeEIsRUFDQTtBQUNFMVYsVUFBUUMsR0FBUixDQUFZLHlCQUFaO0FBQ0EwVixlQUFhK0IsTUFBYjtBQUNBdFgsVUFBUVksR0FBUixDQUFZLGlCQUFaLEVBQStCLElBQS9CLEVBSEYsQ0FHeUM7QUFDdkNaLFVBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQixDQUEvQjtBQUNBWixVQUFRWSxHQUFSLENBQVksWUFBWixFQUEwQixrR0FBQW1ELEdBQWE0SCxJQUF2QztBQUNBLE1BQUk0TCxnQkFBZ0IsNkdBQUE3TCxDQUFrQixrR0FBQTNILEdBQWE0SCxJQUEvQixFQUFxQ2QsVUFBckMsRUFBaUQ3RCxRQUFqRCxFQUEyRGhILE9BQTNELENBQXBCO0FBQ0EsTUFBR3VYLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUMsQ0FBckM7QUFDSDtBQUNELE1BQUcyVyxjQUFjdkwsSUFBZCxDQUFtQjNNLFFBQW5CLENBQTRCLFVBQTVCLENBQUgsRUFDQTtBQUNJVyxZQUFRWSxHQUFSLENBQVksaUJBQVosRUFBK0IsSUFBL0I7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLENBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixXQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGtCQUFaLEVBQWdDLElBQWhDO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxDQUFyQztBQUNIO0FBQ0QsTUFBRzJXLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsY0FBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUMsSUFBbkM7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLENBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixTQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGtCQUFaLEVBQWdDLElBQWhDO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUMsQ0FBckM7QUFDSDtBQUNELE1BQUcyVyxjQUFjdkwsSUFBZCxDQUFtQjNNLFFBQW5CLENBQTRCLGFBQTVCLENBQUgsRUFDQTtBQUNJVyxZQUFRWSxHQUFSLENBQVksb0JBQVosRUFBa0MsSUFBbEM7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLENBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixTQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUMsQ0FBckM7QUFDSDtBQUNELE1BQUcyVyxjQUFjdkwsSUFBZCxDQUFtQjNNLFFBQW5CLENBQTRCLGNBQTVCLENBQUgsRUFDQTtBQUNJVyxZQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDQVosWUFBUVksR0FBUixDQUFZLHFCQUFaLEVBQW1DLElBQW5DO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxDQUFyQztBQUNIO0FBQ0QsTUFBRzJXLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUMsSUFBbkM7QUFDQVosWUFBUVksR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxFQUFyQztBQUNIO0FBQ0QsTUFBRzJXLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsU0FBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBWixZQUFRWSxHQUFSLENBQVkscUJBQVosRUFBbUMsSUFBbkM7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLEVBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixRQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQixJQUEvQjtBQUNBWixZQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUMsRUFBckM7QUFDSDtBQUNELE1BQUcyVyxjQUFjdkwsSUFBZCxDQUFtQjNNLFFBQW5CLENBQTRCLFNBQTVCLENBQUgsRUFDQTtBQUNJVyxZQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLEVBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixRQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGVBQVosRUFBNkIsSUFBN0I7QUFDQVosWUFBUVksR0FBUixDQUFZLHVCQUFaLEVBQXFDLEVBQXJDO0FBQ0g7QUFDRCxNQUFHMlcsY0FBY3ZMLElBQWQsQ0FBbUIzTSxRQUFuQixDQUE0QixVQUE1QixDQUFILEVBQ0E7QUFDSVcsWUFBUVksR0FBUixDQUFZLGlCQUFaLEVBQStCLElBQS9CO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxFQUFyQztBQUNIO0FBQ0QsTUFBRzJXLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsUUFBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLElBQTdCO0FBQ0FaLFlBQVFZLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxFQUFyQztBQUNIO0FBQ0QsTUFBRzJXLGNBQWN2TCxJQUFkLENBQW1CM00sUUFBbkIsQ0FBNEIsWUFBNUIsQ0FBSCxFQUNBO0FBQ0lXLFlBQVFZLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxJQUFqQztBQUNBWixZQUFRWSxHQUFSLENBQVksdUJBQVosRUFBcUMsRUFBckM7QUFDSDs7QUFHRFosVUFBUVksR0FBUixDQUFZLFVBQVosRUFBdUIyVyxjQUFjdlYsR0FBckM7QUFDQWhDLFVBQVFZLEdBQVIsQ0FBWSxPQUFaLEVBQW9CMlcsY0FBYzNNLEtBQWxDO0FBQ0E1SyxVQUFRWSxHQUFSLENBQVksTUFBWixFQUFtQjJXLGNBQWN6UCxJQUFqQztBQUNBLE1BQUk5RixNQUFNaEMsUUFBUUcsR0FBUixDQUFZLFVBQVosQ0FBVjtBQUNBSCxVQUFRWSxHQUFSLENBQVksaUJBQVosRUFBK0JvQixJQUFJeEIsTUFBbkM7QUFDQVIsVUFBUVksR0FBUixDQUFZLGtCQUFaLEVBQWdDb0IsSUFBSXhCLE1BQXBDO0FBQ0FSLFVBQVF5TCxJQUFSLENBQWEsY0FBYixFQUE2QixTQUE3QjtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ08sU0FBUytMLGdCQUFULENBQTBCQyxNQUExQixFQUFpQ0MsTUFBakMsRUFBd0NDLEtBQXhDLEVBQStDO0FBQ3BELE1BQUk5TixNQUFNZ0IsYUFBVzdLLFFBQVFHLEdBQVIsQ0FBWSxZQUFaLENBQXJCO0FBQ0ErRCxTQUFPMFQsSUFBUCxDQUFZLE9BQUs1SyxRQUFMLEdBQWMsWUFBZCxHQUEyQmhHLFFBQTNCLEdBQW9DMFEsTUFBcEMsR0FBMkMsT0FBM0MsR0FBbUQxUSxRQUFuRCxHQUE0RHlRLE1BQXhFLEVBQWdGLEVBQWhGLEVBQW9GLHNCQUFwRjtBQUNEOztBQUVEO0FBQ08sU0FBU0ksVUFBVCxDQUFvQkosTUFBcEIsRUFBNEI7O0FBRWpDLE1BQUk1TixNQUFNZ0IsYUFBVzdLLFFBQVFHLEdBQVIsQ0FBWSxZQUFaLENBQXJCO0FBQ0EsTUFBSTJYLFVBQVU5WCxRQUFRRyxHQUFSLENBQVksY0FBWixDQUFkO0FBQ0EsTUFBRzJYLFlBQVksTUFBSSxHQUFKLEdBQVEsR0FBUixHQUFZLEdBQVosR0FBZ0IsR0FBaEIsR0FBb0IsR0FBcEIsR0FBd0IsR0FBeEIsR0FBNEIsR0FBNUIsR0FBZ0MsR0FBaEMsR0FBb0MsR0FBcEMsR0FBd0MsR0FBdkQsRUFDQTtBQUNFNVQsV0FBTzBULElBQVAsQ0FBWSxPQUFLNUssUUFBTCxHQUFjLGtCQUFkLEdBQWlDaEcsUUFBakMsR0FBMEN5USxNQUF0RCxFQUE4RCxFQUE5RCxFQUFrRSxzQkFBbEU7QUFDRCxHQUhELE1BS0E7QUFDRW5XLFVBQU0sNkJBQTJCLEdBQTNCLEdBQStCLEdBQS9CLEdBQW1DLEdBQW5DLEdBQXVDLEdBQXZDLEdBQTJDLEdBQTNDLEdBQStDLEdBQS9DLEdBQW1ELGVBQXpEO0FBQ0Q7QUFDRixDOzs7Ozs7Ozs7OztBQ3J0QkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDTyxTQUFTMFYsb0JBQVQsQ0FBOEJoWCxPQUE5QixFQUF1Q2dDLEdBQXZDLEVBQTRDOEYsSUFBNUMsRUFBa0Q4QyxLQUFsRCxFQUF5REMsVUFBekQsRUFBcUVDLFNBQXJFLEVBQWdGNkMsZUFBaEYsRUFDdUJFLGdCQUR2QixFQUN5Q0UsaUJBRHpDLEVBQzRERSxvQkFENUQsRUFDa0ZFLGVBRGxGLEVBQ21HRSxtQkFEbkcsRUFDd0hFLGVBRHhILEVBRXVCRSxvQkFGdkIsRUFFNkNFLGVBRjdDLEVBRThERSxlQUY5RCxFQUUrRUUsY0FGL0UsRUFFK0ZVLGtCQUYvRixFQUd1QlIsZUFIdkIsRUFHd0NFLGNBSHhDLEVBR3dERSxnQkFIeEQsRUFHMEVFLGNBSDFFLEVBSVA7QUFDRTtBQUNBLE1BQUl3SSxnQkFBYyxJQUFsQjtBQUNBLE1BQUlDLGFBQWEsRUFBakI7QUFDQTs7QUFFQUQsa0JBQWdCRSxZQUFZalcsR0FBWixFQUFpQjhGLElBQWpCLEVBQXVCOEMsS0FBdkIsRUFDWSxDQUFDK0MsZUFBRCxFQUFrQkUsZ0JBQWxCLEVBQ0NFLGlCQURELEVBQ29CRSxvQkFEcEIsRUFDMENFLGVBRDFDLEVBQzJERSxtQkFEM0QsRUFDZ0ZFLGVBRGhGLEVBRUNFLG9CQUZELEVBRXVCRSxlQUZ2QixFQUV3Q0UsZUFGeEMsRUFFeURFLGNBRnpELEVBRXlFVSxrQkFGekUsRUFHQ1IsZUFIRCxFQUdrQkUsY0FIbEIsRUFHa0NFLGdCQUhsQyxFQUdvREUsY0FIcEQsQ0FEWixDQUFoQjtBQUtBLE1BQUd3SSxjQUFjdlgsTUFBZCxHQUF1QixDQUExQixFQUNBO0FBQ0VSLFlBQVFZLEdBQVIsQ0FBWSxZQUFaLEVBQTBCbVgsYUFBMUI7QUFDQXpXLFVBQU0sZ0JBQWN5VyxhQUFwQjtBQUNELEdBSkQsTUFLSztBQUNIO0FBQ0EsUUFBSWhPLFdBQVcsSUFBZjtBQUNBL0osWUFBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLElBQWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBR3FOLHlCQUF5QixJQUE1QixFQUNBO0FBQ0UrSixtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsZUFBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLHFCQUFaLEVBQW1DLElBQW5DO0FBQ0FaLGNBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNBK00sd0JBQWtCLEtBQWxCO0FBQ0Q7QUFDRCxRQUFHRSxxQkFBcUIsSUFBeEIsRUFDQTtBQUNFbUssbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLFdBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQixJQUEvQjtBQUNBWixjQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDQStNLHdCQUFrQixLQUFsQjtBQUNEO0FBQ0QsUUFBR0Esb0JBQW9CLElBQXZCLEVBQ0E7QUFDRXFLLG1CQUFhQSxXQUFXck8sTUFBWCxDQUFrQixVQUFsQixDQUFiO0FBQ0EzSixjQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDRDtBQUNELFFBQUdtTixzQkFBc0IsSUFBekIsRUFDQTtBQUNFaUssbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLFlBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxJQUFoQztBQUNEO0FBQ0QsUUFBR3VOLG9CQUFvQixJQUF2QixFQUNBO0FBQ0U2SixtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsVUFBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCO0FBQ0FaLGNBQVFZLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxJQUFoQztBQUNEO0FBQ0QsUUFBR3lOLHdCQUF3QixJQUEzQixFQUNBO0FBQ0UySixtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsY0FBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLG9CQUFaLEVBQWtDLElBQWxDO0FBQ0Q7QUFDRCxRQUFHMk4sb0JBQW9CLElBQXZCLEVBQ0E7QUFDRXlKLG1CQUFhQSxXQUFXck8sTUFBWCxDQUFrQixVQUFsQixDQUFiO0FBQ0EzSixjQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDRDtBQUNELFFBQUc2Tix5QkFBeUIsSUFBNUIsRUFDQTtBQUNFdUosbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLGVBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxJQUFuQztBQUNEO0FBQ0QsUUFBRytOLG9CQUFvQixJQUF2QixFQUNBO0FBQ0VxSixtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsVUFBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQTlCO0FBQ0Q7QUFDRCxRQUFHaU8sb0JBQW9CLElBQXZCLEVBQ0E7QUFDRW1KLG1CQUFhQSxXQUFXck8sTUFBWCxDQUFrQixVQUFsQixDQUFiO0FBQ0EzSixjQUFRWSxHQUFSLENBQVksZ0JBQVosRUFBOEIsSUFBOUI7QUFDRDtBQUNELFFBQUdtTyxtQkFBbUIsSUFBdEIsRUFDQTtBQUNFaUosbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLFNBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLElBQTdCO0FBQ0Q7QUFDRCxRQUFHNk8sdUJBQXVCLElBQTFCLEVBQ0E7QUFDRXVJLG1CQUFhQSxXQUFXck8sTUFBWCxDQUFrQixhQUFsQixDQUFiO0FBQ0EzSixjQUFRWSxHQUFSLENBQVksbUJBQVosRUFBaUMsSUFBakM7QUFDRDtBQUNELFFBQUdxTyxvQkFBb0IsSUFBdkIsRUFDQTtBQUNFK0ksbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLFVBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QjtBQUNEO0FBQ0QsUUFBR3VPLG1CQUFtQixJQUF0QixFQUNBO0FBQ0U2SSxtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsU0FBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLGVBQVosRUFBNkIsSUFBN0I7QUFDRDtBQUNELFFBQUd5TyxxQkFBcUIsSUFBeEIsRUFDQTtBQUNFMkksbUJBQWFBLFdBQVdyTyxNQUFYLENBQWtCLFdBQWxCLENBQWI7QUFDQTNKLGNBQVFZLEdBQVIsQ0FBWSxpQkFBWixFQUErQixJQUEvQjtBQUNEO0FBQ0QsUUFBRzJPLG1CQUFtQixJQUF0QixFQUNBO0FBQ0V5SSxtQkFBYUEsV0FBV3JPLE1BQVgsQ0FBa0IsU0FBbEIsQ0FBYjtBQUNBM0osY0FBUVksR0FBUixDQUFZLGVBQVosRUFBNkIsSUFBN0I7QUFDRDs7QUFFRG9YLGlCQUFhQSxXQUFXOUwsS0FBWCxDQUFpQixDQUFqQixFQUFvQixDQUFDLENBQXJCLENBQWI7QUFDQW5DLGVBQVcsb0dBQUFZLENBQVMzSyxPQUFULEVBQWtCZ1ksVUFBbEIsRUFBOEJoVyxHQUE5QixFQUFtQzhGLElBQW5DLEVBQXlDOEMsS0FBekMsRUFBZ0RDLFVBQWhELEVBQTREQyxTQUE1RCxDQUFYO0FBQ0E7QUFDQSxRQUFJNkMsb0JBQW9CLElBQXBCLElBQTRCNUQsUUFBaEMsRUFDQTtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsZ0JBQWQ7QUFDQTlILE1BQUEsbUhBQUFBLENBQTRCM0QsT0FBNUI7QUFDQTtBQUNELEtBTkQsTUFPSyxJQUFHNk4scUJBQXFCLElBQXJCLElBQTZCOUQsUUFBaEMsRUFDTDtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsaUJBQWQ7QUFDQTlILE1BQUEsbUhBQUFBLENBQTRCM0QsT0FBNUI7QUFDRCxLQUxJLE1BTUEsSUFBRytOLHNCQUFzQixJQUF0QixJQUE4QmhFLFFBQWpDLEVBQ0w7QUFDRS9KLGNBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxDQUFoQztBQUNBWixjQUFReUwsSUFBUixDQUFjLGtCQUFkO0FBQ0E5SCxNQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCO0FBQ0QsS0FMSSxNQU1BLElBQUdpTyx5QkFBeUIsSUFBekIsSUFBaUNsRSxRQUFwQyxFQUNMO0FBQ0UvSixjQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsQ0FBaEM7QUFDQVosY0FBUXlMLElBQVIsQ0FBYyxxQkFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNELEtBTEksTUFNQSxJQUFHbU8sb0JBQW9CLElBQXBCLElBQTRCcEUsUUFBL0IsRUFDTDtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsZ0JBQWQ7QUFDQTlILE1BQUEsbUhBQUFBLENBQTRCM0QsT0FBNUI7QUFDRCxLQUxJLE1BS0MsSUFBR3FPLHdCQUF3QixJQUF4QixJQUFnQ3RFLFFBQW5DLEVBQ047QUFDRS9KLGNBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxDQUFoQztBQUNBWixjQUFReUwsSUFBUixDQUFjLG9CQUFkO0FBQ0E5SCxNQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCO0FBQ0QsS0FMSyxNQUtBLElBQUd1TyxvQkFBb0IsSUFBcEIsSUFBNEJ4RSxRQUEvQixFQUNOO0FBQ0UvSixjQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsQ0FBaEM7QUFDQVosY0FBUXlMLElBQVIsQ0FBYyxnQkFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNELEtBTEssTUFLQSxJQUFHeU8seUJBQXlCLElBQXpCLElBQWlDMUUsUUFBcEMsRUFDTjtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMscUJBQWQ7QUFDQTlILE1BQUEsbUhBQUFBLENBQTRCM0QsT0FBNUI7QUFDRCxLQUxLLE1BS0EsSUFBRzJPLG9CQUFvQixJQUFwQixJQUE0QjVFLFFBQS9CLEVBQ047QUFDRS9KLGNBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxDQUFoQztBQUNBWixjQUFReUwsSUFBUixDQUFjLGdCQUFkO0FBQ0E5SCxNQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCO0FBQ0QsS0FMSyxNQUtBLElBQUc2TyxvQkFBb0IsSUFBcEIsSUFBNEI5RSxRQUEvQixFQUNOO0FBQ0UvSixjQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsQ0FBaEM7QUFDQVosY0FBUXlMLElBQVIsQ0FBYyxnQkFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNELEtBTEssTUFLQSxJQUFHK08sbUJBQW1CLElBQW5CLElBQTJCaEYsUUFBOUIsRUFDTjtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsZUFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNELEtBTEssTUFLQSxJQUFHeVAsdUJBQXVCLElBQXZCLElBQStCMUYsUUFBbEMsRUFDTjtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsbUJBQWQ7QUFDQTlILE1BQUEsbUhBQUFBLENBQTRCM0QsT0FBNUI7QUFDRCxLQUxLLE1BS0EsSUFBR2lQLG9CQUFvQixJQUFwQixJQUE0QmxGLFFBQS9CLEVBQ047QUFDRS9KLGNBQVFZLEdBQVIsQ0FBYSxpQkFBYixFQUFnQyxDQUFoQztBQUNBWixjQUFReUwsSUFBUixDQUFjLGdCQUFkO0FBQ0E5SCxNQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCO0FBQ0QsS0FMSyxNQUtBLElBQUdtUCxtQkFBbUIsSUFBbkIsSUFBMkJwRixRQUE5QixFQUNOO0FBQ0UvSixjQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsQ0FBaEM7QUFDQVosY0FBUXlMLElBQVIsQ0FBYyxlQUFkO0FBQ0E5SCxNQUFBLG1IQUFBQSxDQUE0QjNELE9BQTVCO0FBQ0QsS0FMSyxNQUtBLElBQUdxUCxxQkFBcUIsSUFBckIsSUFBNkJ0RixRQUFoQyxFQUNOO0FBQ0UvSixjQUFRWSxHQUFSLENBQWEsaUJBQWIsRUFBZ0MsQ0FBaEM7QUFDQVosY0FBUXlMLElBQVIsQ0FBYyxpQkFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNELEtBTEssTUFLQSxJQUFHdVAsbUJBQW1CLElBQW5CLElBQTJCeEYsUUFBOUIsRUFDTjtBQUNFL0osY0FBUVksR0FBUixDQUFhLGlCQUFiLEVBQWdDLENBQWhDO0FBQ0FaLGNBQVF5TCxJQUFSLENBQWMsZUFBZDtBQUNBOUgsTUFBQSxtSEFBQUEsQ0FBNEIzRCxPQUE1QjtBQUNEOztBQUVELFFBQUcsQ0FBRStKLFFBQUwsRUFBYztBQUFDN0YsYUFBT0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJGLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQXZDO0FBQTZDO0FBQzdEO0FBQ0Y7O0FBRUQ7QUFDTyxTQUFTNlQsV0FBVCxDQUFxQmpXLEdBQXJCLEVBQTBCOEQsUUFBMUIsRUFBb0M4RSxLQUFwQyxFQUEyQ3NOLGFBQTNDLEVBQ1A7QUFDRSxNQUFJSCxnQkFBZ0IsRUFBcEI7QUFDQSxNQUFHLENBQUUsaUJBQWlCSSxJQUFqQixDQUFzQnJTLFFBQXRCLENBQUwsRUFDQTtBQUNFaVMsb0JBQWdCQSxnQkFBZ0IsZ0ZBQWhDO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFHL1YsSUFBSXhCLE1BQUosR0FBYSxJQUFoQixFQUNBO0FBQ0V1WCxvQkFBZ0JBLGdCQUFnQiw0Q0FBaEM7QUFDRDtBQUNELE1BQUcvVixJQUFJeEIsTUFBSixHQUFhLEVBQWhCLEVBQ0E7QUFDRXVYLG9CQUFnQkEsZ0JBQWdCLDZDQUFoQztBQUNEOztBQUVEO0FBQ0EsTUFBSUssbUJBQW1CLENBQUNwVyxJQUFJN0MsS0FBSixDQUFVLDBCQUFWLEtBQXVDLEVBQXhDLEVBQTRDcUIsTUFBbkU7QUFDQSxNQUFJNFgsbUJBQWlCcFcsSUFBSXhCLE1BQXRCLEdBQWdDLElBQW5DLEVBQ0E7QUFDRXVYLG9CQUFnQkEsZ0JBQWdCLHdHQUFoQztBQUNEO0FBQ0QsTUFBRywrQkFBK0JJLElBQS9CLENBQW9DblcsR0FBcEMsQ0FBSCxFQUNBO0FBQ0UrVixvQkFBZ0JBLGdCQUFnQixpREFBaEM7QUFDRDs7QUFFRCxNQUFHLGlHQUFBeFUsQ0FBVSxJQUFWLEVBQWdCMlUsYUFBaEIsTUFBbUMsS0FBdEMsRUFBNkM7QUFDM0NILG9CQUFnQkEsZ0JBQWdCLCtDQUFoQztBQUNEO0FBQ0QsU0FBT0EsYUFBUDtBQUNELEMiLCJmaWxlIjoicHNpcHJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4YTg3NDI4MWM4MWYwZjE5NTI0ZCIsIlxuLy8gZm9yIGEgZ2l2ZW4gbWVtc2F0IGRhdGEgZmlsZXMgZXh0cmFjdCBjb29yZGluYXRlIHJhbmdlcyBnaXZlbiBzb21lIHJlZ2V4XG5leHBvcnQgZnVuY3Rpb24gZ2V0X21lbXNhdF9yYW5nZXMocmVnZXgsIGRhdGEpXG57XG4gICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhkYXRhKTtcbiAgICBpZihtYXRjaFsxXS5pbmNsdWRlcygnLCcpKVxuICAgIHtcbiAgICAgIGxldCByZWdpb25zID0gbWF0Y2hbMV0uc3BsaXQoJywnKTtcbiAgICAgIHJlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24sIGkpe1xuICAgICAgICByZWdpb25zW2ldID0gcmVnaW9uLnNwbGl0KCctJyk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMF0gPSBwYXJzZUludChyZWdpb25zW2ldWzBdKTtcbiAgICAgICAgcmVnaW9uc1tpXVsxXSA9IHBhcnNlSW50KHJlZ2lvbnNbaV1bMV0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ocmVnaW9ucyk7XG4gICAgfVxuICAgIGVsc2UgaWYobWF0Y2hbMV0uaW5jbHVkZXMoJy0nKSlcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoWzFdKTtcbiAgICAgICAgbGV0IHNlZyA9IG1hdGNoWzFdLnNwbGl0KCctJyk7XG4gICAgICAgIGxldCByZWdpb25zID0gW1tdLCBdO1xuICAgICAgICByZWdpb25zWzBdWzBdID0gcGFyc2VJbnQoc2VnWzBdKTtcbiAgICAgICAgcmVnaW9uc1swXVsxXSA9IHBhcnNlSW50KHNlZ1sxXSk7XG4gICAgICAgIHJldHVybihyZWdpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuKG1hdGNoWzFdKTtcbn1cblxuLy8gdGFrZSBhbmQgc3MyIChmaWxlKSBhbmQgcGFyc2UgdGhlIGRldGFpbHMgYW5kIHdyaXRlIHRoZSBuZXcgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2Vfc3MyKHJhY3RpdmUsIGZpbGUpXG57XG4gICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgbGluZXMuc2hpZnQoKTtcbiAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBhbm5vdGF0aW9uc1tpXS5zcyA9IGVudHJpZXNbM107XG4gICAgICB9KTtcbiAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBhbGVydChcIlNTMiBhbm5vdGF0aW9uIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCBxdWVyeSBzZXF1ZW5jZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuKGFubm90YXRpb25zKTtcbn1cblxuLy90YWtlIHRoZSBkaXNvcHJlZCBwYmRhdCBmaWxlLCBwYXJzZSBpdCBhbmQgYWRkIHRoZSBhbm5vdGF0aW9ucyB0byB0aGUgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfcGJkYXQocmFjdGl2ZSwgZmlsZSlcbntcbiAgICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmKGFubm90YXRpb25zLmxlbmd0aCA9PSBsaW5lcy5sZW5ndGgpXG4gICAge1xuICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGlmKGVudHJpZXNbM10gPT09ICctJyl7YW5ub3RhdGlvbnNbaV0uZGlzb3ByZWQgPSAnRCc7fVxuICAgICAgICBpZihlbnRyaWVzWzNdID09PSAnXicpe2Fubm90YXRpb25zW2ldLmRpc29wcmVkID0gJ1BCJzt9XG4gICAgICB9KTtcbiAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgfVxufVxuXG4vL3BhcnNlIHRoZSBkaXNvcHJlZCBjb21iIGZpbGUgYW5kIGFkZCBpdCB0byB0aGUgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfY29tYihyYWN0aXZlLCBmaWxlKVxue1xuICBsZXQgcHJlY2lzaW9uID0gW107XG4gIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICBwcmVjaXNpb25baV0gPSB7fTtcbiAgICBwcmVjaXNpb25baV0ucG9zID0gZW50cmllc1sxXTtcbiAgICBwcmVjaXNpb25baV0ucHJlY2lzaW9uID0gZW50cmllc1s0XTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicsIHByZWNpc2lvbik7XG4gIGJpb2QzLmdlbmVyaWN4eUxpbmVDaGFydChwcmVjaXNpb24sICdwb3MnLCBbJ3ByZWNpc2lvbiddLCBbJ0JsYWNrJyxdLCAnRGlzb05OQ2hhcnQnLCB7cGFyZW50OiAnZGl2LmNvbWJfcGxvdCcsIGNoYXJ0VHlwZTogJ2xpbmUnLCB5X2N1dG9mZjogMC41LCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG5cbn1cblxuLy9wYXJzZSB0aGUgbWVtc2F0IG91dHB1dFxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX21lbXNhdGRhdGEocmFjdGl2ZSwgZmlsZSlcbntcbiAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgLy9jb25zb2xlLmxvZyhmaWxlKTtcbiAgbGV0IHRvcG9fcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9Ub3BvbG9neTpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgbGV0IHNpZ25hbF9yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1NpZ25hbFxcc3BlcHRpZGU6XFxzKyguKylcXG4vLCBmaWxlKTtcbiAgbGV0IHJlZW50cmFudF9yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1JlLWVudHJhbnRcXHNoZWxpY2VzOlxccysoLis/KVxcbi8sIGZpbGUpO1xuICBsZXQgdGVybWluYWwgPSBnZXRfbWVtc2F0X3JhbmdlcygvTi10ZXJtaW5hbDpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgLy9jb25zb2xlLmxvZyhzaWduYWxfcmVnaW9ucyk7XG4gIC8vIGNvbnNvbGUubG9nKHJlZW50cmFudF9yZWdpb25zKTtcbiAgbGV0IGNvaWxfdHlwZSA9ICdDWSc7XG4gIGlmKHRlcm1pbmFsID09PSAnb3V0JylcbiAge1xuICAgIGNvaWxfdHlwZSA9ICdFQyc7XG4gIH1cbiAgbGV0IHRtcF9hbm5vID0gbmV3IEFycmF5KHNlcS5sZW5ndGgpO1xuICBpZih0b3BvX3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJylcbiAge1xuICAgIGxldCBwcmV2X2VuZCA9IDA7XG4gICAgdG9wb19yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnVE0nLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICAgIGlmKHByZXZfZW5kID4gMCl7cHJldl9lbmQgLT0gMTt9XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoY29pbF90eXBlLCBwcmV2X2VuZCwgcmVnaW9uWzBdKTtcbiAgICAgIGlmKGNvaWxfdHlwZSA9PT0gJ0VDJyl7IGNvaWxfdHlwZSA9ICdDWSc7fWVsc2V7Y29pbF90eXBlID0gJ0VDJzt9XG4gICAgICBwcmV2X2VuZCA9IHJlZ2lvblsxXSsyO1xuICAgIH0pO1xuICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbChjb2lsX3R5cGUsIHByZXZfZW5kLTEsIHNlcS5sZW5ndGgpO1xuXG4gIH1cbiAgLy9zaWduYWxfcmVnaW9ucyA9IFtbNzAsODNdLCBbMTAyLDExN11dO1xuICBpZihzaWduYWxfcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKXtcbiAgICBzaWduYWxfcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1MnLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICB9KTtcbiAgfVxuICAvL3JlZW50cmFudF9yZWdpb25zID0gW1s0MCw1MF0sIFsyMDAsMjE4XV07XG4gIGlmKHJlZW50cmFudF9yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpe1xuICAgIHJlZW50cmFudF9yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnUkgnLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICB9KTtcbiAgfVxuICB0bXBfYW5uby5mb3JFYWNoKGZ1bmN0aW9uKGFubm8sIGkpe1xuICAgIGFubm90YXRpb25zW2ldLm1lbXNhdCA9IGFubm87XG4gIH0pO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX3ByZXN1bHQocmFjdGl2ZSwgZmlsZSwgdHlwZSlcbntcbiAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gIC8vY29uc29sZS5sb2codHlwZSsnX2Fubl9zZXQnKTtcbiAgbGV0IGFubl9saXN0ID0gcmFjdGl2ZS5nZXQodHlwZSsnX2Fubl9zZXQnKTtcbiAgLy9jb25zb2xlLmxvZyhhbm5fbGlzdCk7XG4gIGlmKE9iamVjdC5rZXlzKGFubl9saXN0KS5sZW5ndGggPiAwKXtcbiAgbGV0IHBzZXVkb190YWJsZSA9ICc8dGFibGUgY2xhc3M9XCJzbWFsbC10YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkXCI+XFxuJztcbiAgcHNldWRvX3RhYmxlICs9ICc8dHI+PHRoPkNvbmYuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5OZXQgU2NvcmU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPnAtdmFsdWU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlBhaXJFPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Tb2x2RTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxuIFNjb3JlPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gTGVuZ3RoPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TdHIgTGVuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TZXEgTGVuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Gb2xkPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggU0NPUDwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+U0VBUkNIIENBVEg8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlBEQlNVTTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxpZ25tZW50PC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5NT0RFTDwvdGg+JztcblxuICAvLyBpZiBNT0RFTExFUiBUSElOR1lcbiAgcHNldWRvX3RhYmxlICs9ICc8L3RyPjx0Ym9keVwiPlxcbic7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgaWYobGluZS5sZW5ndGggPT09IDApe3JldHVybjt9XG4gICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYoZW50cmllc1s5XStcIl9cIitpIGluIGFubl9saXN0KVxuICAgIHtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dHI+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkIGNsYXNzPSdcIitlbnRyaWVzWzBdLnRvTG93ZXJDYXNlKCkrXCInPlwiK2VudHJpZXNbMF0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzFdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1syXStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbM10rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzRdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s1XStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNl0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzddK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s4XStcIjwvdGQ+XCI7XG4gICAgbGV0IHBkYiA9IGVudHJpZXNbOV0uc3Vic3RyaW5nKDAsIGVudHJpZXNbOV0ubGVuZ3RoLTIpO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cHM6Ly93d3cucmNzYi5vcmcvcGRiL2V4cGxvcmUvZXhwbG9yZS5kbz9zdHJ1Y3R1cmVJZD1cIitwZGIrXCInPlwiK2VudHJpZXNbOV0rXCI8L2E+PC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly9zY29wLm1yYy1sbWIuY2FtLmFjLnVrL3Njb3AvcGRiLmNnaT9wZGI9XCIrcGRiK1wiJz5TQ09QIFNFQVJDSDwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5jYXRoZGIuaW5mby9wZGIvXCIrcGRiK1wiJz5DQVRIIFNFQVJDSDwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5lYmkuYWMudWsvdGhvcm50b24tc3J2L2RhdGFiYXNlcy9jZ2ktYmluL3BkYnN1bS9HZXRQYWdlLnBsP3BkYmNvZGU9XCIrcGRiK1wiJz5PcGVuIFBEQlNVTTwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdwc2lwcmVkLmxvYWROZXdBbGlnbm1lbnQoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiLFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKGVudHJpZXNbOV0rXCJfXCIraSkrXCJcXFwiKTsnIHZhbHVlPSdEaXNwbGF5IEFsaWdubWVudCcgLz48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdwc2lwcmVkLmJ1aWxkTW9kZWwoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiKTsnIHZhbHVlPSdCdWlsZCBNb2RlbCcgLz48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgfVxuICB9KTtcbiAgcHNldWRvX3RhYmxlICs9IFwiPC90Ym9keT48L3RhYmxlPlxcblwiO1xuICByYWN0aXZlLnNldCh0eXBlK1wiX3RhYmxlXCIsIHBzZXVkb190YWJsZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgICByYWN0aXZlLnNldCh0eXBlK1wiX3RhYmxlXCIsIFwiPGgzPk5vIGdvb2QgaGl0cyBmb3VuZC4gR1VFU1MgYW5kIExPVyBjb25maWRlbmNlIGhpdHMgY2FuIGJlIGZvdW5kIGluIHRoZSByZXN1bHRzIGZpbGU8L2gzPlwiKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsIi8vZ2l2ZW4gYW5kIGFycmF5IHJldHVybiB3aGV0aGVyIGFuZCBlbGVtZW50IGlzIHByZXNlbnRcbmV4cG9ydCBmdW5jdGlvbiBpc0luQXJyYXkodmFsdWUsIGFycmF5KSB7XG4gIGlmKGFycmF5LmluZGV4T2YodmFsdWUpID4gLTEpXG4gIHtcbiAgICByZXR1cm4odHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuKGZhbHNlKTtcbiAgfVxufVxuXG4vL3doZW4gYSByZXN1bHRzIHBhZ2UgaXMgaW5zdGFudGlhdGVkIGFuZCBiZWZvcmUgc29tZSBhbm5vdGF0aW9ucyBoYXZlIGNvbWUgYmFja1xuLy93ZSBkcmF3IGFuZCBlbXB0eSBhbm5vdGF0aW9uIHBhbmVsXG5leHBvcnQgZnVuY3Rpb24gZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpe1xuXG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgbGV0IHJlc2lkdWVzID0gc2VxLnNwbGl0KCcnKTtcbiAgbGV0IGFubm90YXRpb25zID0gW107XG4gIHJlc2lkdWVzLmZvckVhY2goZnVuY3Rpb24ocmVzKXtcbiAgICBhbm5vdGF0aW9ucy5wdXNoKHsncmVzJzogcmVzfSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gIGJpb2QzLmFubm90YXRpb25HcmlkKHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG59XG5cblxuLy9naXZlbiBhIFVSTCByZXR1cm4gdGhlIGF0dGFjaGVkIHZhcmlhYmxlc1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVybFZhcnMoKSB7XG4gICAgbGV0IHZhcnMgPSB7fTtcbiAgICAvL2NvbnNpZGVyIHVzaW5nIGxvY2F0aW9uLnNlYXJjaCBpbnN0ZWFkIGhlcmVcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bPyZdKyhbXj0mXSspPShbXiZdKikvZ2ksXG4gICAgZnVuY3Rpb24obSxrZXksdmFsdWUpIHtcbiAgICAgIHZhcnNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB2YXJzO1xuICB9XG5cbi8qISBnZXRFbVBpeGVscyAgfCBBdXRob3I6IFR5c29uIE1hdGFuaWNoIChodHRwOi8vbWF0YW5pY2guY29tKSwgMjAxMyB8IExpY2Vuc2U6IE1JVCAqL1xuKGZ1bmN0aW9uIChkb2N1bWVudCwgZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgLy8gRW5hYmxlIHN0cmljdCBtb2RlXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyBGb3JtIHRoZSBzdHlsZSBvbiB0aGUgZmx5IHRvIHJlc3VsdCBpbiBzbWFsbGVyIG1pbmlmaWVkIGZpbGVcbiAgICBsZXQgaW1wb3J0YW50ID0gXCIhaW1wb3J0YW50O1wiO1xuICAgIGxldCBzdHlsZSA9IFwicG9zaXRpb246YWJzb2x1dGVcIiArIGltcG9ydGFudCArIFwidmlzaWJpbGl0eTpoaWRkZW5cIiArIGltcG9ydGFudCArIFwid2lkdGg6MWVtXCIgKyBpbXBvcnRhbnQgKyBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudCArIFwicGFkZGluZzowXCIgKyBpbXBvcnRhbnQ7XG5cbiAgICB3aW5kb3cuZ2V0RW1QaXhlbHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgIGxldCBleHRyYUJvZHk7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBFbXVsYXRlIHRoZSBkb2N1bWVudEVsZW1lbnQgdG8gZ2V0IHJlbSB2YWx1ZSAoZG9jdW1lbnRFbGVtZW50IGRvZXMgbm90IHdvcmsgaW4gSUU2LTcpXG4gICAgICAgICAgICBlbGVtZW50ID0gZXh0cmFCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvZHlcIik7XG4gICAgICAgICAgICBleHRyYUJvZHkuc3R5bGUuY3NzVGV4dCA9IFwiZm9udC1zaXplOjFlbVwiICsgaW1wb3J0YW50O1xuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50Lmluc2VydEJlZm9yZShleHRyYUJvZHksIGRvY3VtZW50LmJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuZCBzdHlsZSBhIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcbiAgICAgICAgdGVzdEVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRlc3RFbGVtZW50KTtcblxuICAgICAgICAvLyBHZXQgdGhlIGNsaWVudCB3aWR0aCBvZiB0aGUgdGVzdCBlbGVtZW50XG4gICAgICAgIGxldCB2YWx1ZSA9IHRlc3RFbGVtZW50LmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGlmIChleHRyYUJvZHkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXh0cmEgYm9keSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZXh0cmFCb2R5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgdGVzdCBlbGVtZW50XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKHRlc3RFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgZW0gdmFsdWUgaW4gcGl4ZWxzXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufShkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvY29tbW9uL2NvbW1vbl9pbmRleC5qcyIsImltcG9ydCB7IHByb2Nlc3NfZmlsZSB9IGZyb20gJy4uL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcblxuLy9iZWZvcmUgYSByZXN1Ym1pc3Npb24gaXMgc2VudCBhbGwgdmFyaWFibGVzIGFyZSByZXNldCB0byB0aGUgcGFnZSBkZWZhdWx0c1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyX3NldHRpbmdzKHJhY3RpdmUsIGdlYXJfc3RyaW5nKXtcbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIpO1xuICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoJ2Rvd25sb2FkX2xpbmtzJywgJycpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIFBTSVBSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2hvcml6JyxudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRElTT1BSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnZGlzb3ByZWRfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgnZGlzb3ByZWRfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ2Rpc29fcHJlY2lzaW9uJyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNRU1TQVQtU1ZNIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9zY2hlbWF0aWMnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIHBHZW5USFJFQURFUiBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VuX3RhYmxlJywgJycpO1xuICByYWN0aXZlLnNldCgncGdlbl9zZXQnLCB7fSk7XG5cbiAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNRU1QQUNLIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgnbWVtcGFja190aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBHZW5USFJFQURFUiBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnZG9tcHJlZF93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIERvbVBSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnZG9tcHJlZF93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdkb21wcmVkX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdwZG9tdGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwRG9tVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgncGRvbXRocmVhZGVyX3dhaXRpbmdfaWNvbicsIGdlYXJfc3RyaW5nKTtcbiAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnYmlvc2VyZl93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIEJpb1NlcmYgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnYmlvc2VyZl93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdiaW9zZXJmX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdkb21zZXJmX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRG9tU2VyZiBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdkb21zZXJmX3dhaXRpbmdfaWNvbicsIGdlYXJfc3RyaW5nKTtcbiAgcmFjdGl2ZS5zZXQoJ2RvbXNlcmZfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ2ZmcHJlZF93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIEZGUHJlZCBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdmZnByZWRfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgnZmZwcmVkX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIHJhY3RpdmUuc2V0KCdtZXRhcHNpY292X3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTWV0YVBTSUNPViBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gIHJhY3RpdmUuc2V0KCdtZXRhcHNpY292X3dhaXRpbmdfaWNvbicsIGdlYXJfc3RyaW5nKTtcbiAgcmFjdGl2ZS5zZXQoJ21ldGFwc2ljb3ZfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ21ldHNpdGVfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNZXRTaXRlIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ21ldHNpdGVfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgnbWV0c2l0ZV90aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICByYWN0aXZlLnNldCgnaHNwcmVkX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgSFNQcmVkIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ2hzcHJlZF93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdoc3ByZWRfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbWVtYmVkX3dhaXRpbmdfbWVzc2FnZScsICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTUVNRU1CRUQgam9iIHRvIHByb2Nlc3M8L2gyPicpO1xuICByYWN0aXZlLnNldCgnbWVtZW1iZWRfd2FpdGluZ19pY29uJywgZ2Vhcl9zdHJpbmcpO1xuICByYWN0aXZlLnNldCgnbWVtZW1iZWRfdGltZScsICdMb2FkaW5nIERhdGEnKTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbnRkYl93YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIFREQiBnZW5lcmF0aW9uIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbnRkYl93YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gIHJhY3RpdmUuc2V0KCdnZW50ZGJfdGltZScsICdMb2FkaW5nIERhdGEnKTtcblxuICAvL3JhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLG51bGwpO1xuICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsbnVsbCk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYuc2VxdWVuY2VfcGxvdCcpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LnBzaXByZWRfY2FydG9vbicpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LmNvbWJfcGxvdCcpO1xuXG4gIHppcCA9IG5ldyBKU1ppcCgpO1xufVxuXG4vL1Rha2UgYSBjb3VwbGUgb2YgdmFyaWFibGVzIGFuZCBwcmVwYXJlIHRoZSBodG1sIHN0cmluZ3MgZm9yIHRoZSBkb3dubG9hZHMgcGFuZWxcbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlX2Rvd25sb2Fkc19odG1sKGRhdGEsIGRvd25sb2Fkc19pbmZvKVxue1xuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwc2lwcmVkJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAge1xuICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuaGVhZGVyID0gXCI8aDU+RGlzb1ByZWREIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWVtc2F0c3ZtJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm09IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5oZWFkZXIgPSBcIjxoNT5NRU1TQVRTVk0gRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwZ2VudGhyZWFkZXInKSlcbiAge1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wR2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZW1wYWNrJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bT0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlciA9IFwiPGg1Pk1FTVNBVFNWTSBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2sgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1wYWNrLmhlYWRlciA9IFwiPGg1Pk1FTVBBQ0sgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdnZW50aHJlYWRlcicpKXtcbiAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIuaGVhZGVyID0gXCI8aDU+R2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdkb21wcmVkJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmhlYWRlciA9IFwiPGg1PkRvbVByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwZG9tdGhyZWFkZXInKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBEb21USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2Jpb3NlcmYnKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBHZW5USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmY9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmYuaGVhZGVyID0gXCI8aDU+QmlvU2VyZiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2RvbXNlcmYnKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBEb21USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmY9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmYuaGVhZGVyID0gXCI8aDU+RG9tU2VyZiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2ZmcHJlZCcpKXtcbiAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlciA9IFwiPGg1PkRpc29QcmVkRCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmhlYWRlciA9IFwiPGg1PkRvbVByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5mZnByZWQ9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmZmcHJlZC5oZWFkZXIgPSBcIjxoNT5GRlByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZXRhcHNpY292Jykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRhcHNpY292PSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRhcHNpY292LmhlYWRlciA9IFwiPGg1Pk1ldGFQU0lDT1YgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZXRzaXRlJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1ldHNpdGUgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRzaXRlLmhlYWRlciA9IFwiPGg1Pk1ldHNpdGUgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdoc3ByZWQnKSl7XG4gICAgZG93bmxvYWRzX2luZm8uaHNwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uaHNwcmVkLmhlYWRlciA9IFwiPGg1PkhTUHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ21lbWVtYmVkJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbWVtYmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWVtZW1iZWQuaGVhZGVyID0gXCI8aDU+TUVNRU1CRUQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdnZW50ZGInKSl7XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGRiID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGRiLmhlYWRlciA9IFwiPGg1PlREQiBET1dOTE9BRDwvaDU+XCI7XG4gIH1cblxufVxuXG4vL3Rha2UgdGhlIGRhdGFibG9iIHdlJ3ZlIGdvdCBhbmQgbG9vcCBvdmVyIHRoZSByZXN1bHRzXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlX3Jlc3VsdHMocmFjdGl2ZSwgZGF0YSwgZmlsZV91cmwsIHppcCwgZG93bmxvYWRzX2luZm8pXG57XG4gIGxldCBob3Jpel9yZWdleCA9IC9cXC5ob3JpeiQvO1xuICBsZXQgc3MyX3JlZ2V4ID0gL1xcLnNzMiQvO1xuICBsZXQgbWVtc2F0X2NhcnRvb25fcmVnZXggPSAvX2NhcnRvb25fbWVtc2F0X3N2bVxcLnBuZyQvO1xuICBsZXQgbWVtc2F0X3NjaGVtYXRpY19yZWdleCA9IC9fc2NoZW1hdGljXFwucG5nJC87XG4gIGxldCBtZW1zYXRfZGF0YV9yZWdleCA9IC9tZW1zYXRfc3ZtJC87XG4gIGxldCBtZW1wYWNrX2NhcnRvb25fcmVnZXggPSAvS2FtYWRhLUthd2FpX1xcZCsucG5nJC87XG4gIGxldCBtZW1wYWNrX2dyYXBoX291dCA9IC9pbnB1dF9ncmFwaC5vdXQkLztcbiAgbGV0IG1lbXBhY2tfY29udGFjdF9yZXMgPSAvQ09OVEFDVF9ERUYxLnJlc3VsdHMkLztcbiAgbGV0IG1lbXBhY2tfbGlwaWRfcmVzID0gL0xJUElEX0VYUE9TVVJFLnJlc3VsdHMkLztcbiAgbGV0IG1lbXBhY2tfcmVzdWx0X2ZvdW5kID0gZmFsc2U7XG5cbiAgbGV0IGltYWdlX3JlZ2V4ID0gJyc7XG4gIGxldCByZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuICBmb3IobGV0IGkgaW4gcmVzdWx0cylcbiAge1xuICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ0dlbkFsaWdubWVudEFubm90YXRpb24nKVxuICAgIHtcbiAgICAgICAgbGV0IGFubl9zZXQgPSByYWN0aXZlLmdldChcInBnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZ2VuX2dlbmFsaWdubWVudF9hbm5vdGF0aW9uJylcbiAgICB7XG4gICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwiZ2VuX2Fubl9zZXRcIiwgYW5uX3NldCk7XG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICBmb3IobGV0IGkgaW4gcmVzdWx0cylcbiAge1xuICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgLy9wc2lwcmVkIGZpbGVzXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PSAncHNpcGFzczInKVxuICAgIHtcbiAgICAgIGxldCBtYXRjaCA9IGhvcml6X3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKG1hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2hvcml6JywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaG9yaXogPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5Ib3JpeiBGb3JtYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfdGltZVwiLCAnJyk7XG4gICAgICB9XG4gICAgICBsZXQgc3MyX21hdGNoID0gc3MyX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNzMl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TUzIgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3NzMicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19mb3JtYXQnKVxuICAgIHtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5QQkRBVCBGb3JtYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3RpbWVcIiwgJycpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19jb21iaW5lJylcbiAgICB7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2NvbWInLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNPTUIgTk4gT3V0cHV0PC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ21lbXNhdHN2bScpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV90aW1lXCIsICcnKTtcbiAgICAgIGxldCBzY2hlbWVfbWF0Y2ggPSBtZW1zYXRfc2NoZW1hdGljX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNjaGVtZV9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9zY2hlbWF0aWMnLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLnNjaGVtYXRpYyA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlNjaGVtYXRpYyBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgY2FydG9vbl9tYXRjaCA9IG1lbXNhdF9jYXJ0b29uX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICc8aW1nIHNyYz1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIiAvPicpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IG1lbXNhdF9tYXRjaCA9IG1lbXNhdF9kYXRhX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKG1lbXNhdF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdtZW1zYXRkYXRhJywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmRhdGEgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5NZW1zYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdtZW1wYWNrX3dyYXBwZXInKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtcGFja193YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1wYWNrX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXBhY2tfdGltZVwiLCAnJyk7XG4gICAgICBsZXQgY2FydG9vbl9tYXRjaCA9ICBtZW1wYWNrX2NhcnRvb25fcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoY2FydG9vbl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgbWVtcGFja19yZXN1bHRfZm91bmQgPSB0cnVlO1xuICAgICAgICByYWN0aXZlLnNldCgnbWVtcGFja19jYXJ0b29uJywgJzxpbWcgd2lkdGg9XCIxMDAwcHhcIiBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Q2FydG9vbiBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgZ3JhcGhfbWF0Y2ggPSAgbWVtcGFja19ncmFwaF9vdXQuZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoZ3JhcGhfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suZ3JhcGhfb3V0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+RGlhZ3JhbSBEYXRhPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgY29udGFjdF9tYXRjaCA9ICBtZW1wYWNrX2NvbnRhY3RfcmVzLmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNvbnRhY3RfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY29udGFjdCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNvbnRhY3QgUHJlZGljdGlvbnM8L2E+PGJyIC8+JztcbiAgICAgIH1cbiAgICAgIGxldCBsaXBpZF9tYXRjaCA9ICBtZW1wYWNrX2xpcGlkX3Jlcy5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihsaXBpZF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5saXBpZF9vdXQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5MaXBpZCBFeHBvc3VyZSBQcmVkaXRpb25zPC9hPjxiciAvPic7XG4gICAgICB9XG5cbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3NvcnRfcHJlc3VsdCcpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwicGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcInBnZW50aHJlYWRlcl90aW1lXCIsICcnKTtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIudGFibGUgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgVGFibGU8L2E+PGJyIC8+JztcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dlbl9zb3J0X3ByZXN1bHRzJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3RpbWVcIiwgJycpO1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdnZW5fcHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkdlblRIUkVBREVSIFRhYmxlPC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfYWxpZ24nKVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPnBHZW5USFJFQURFUiBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdnZW50aHJlYWRlcl9wc2V1ZG9fYmFzX2FsaWduJylcbiAgICB7XG4gICAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkdlblRIUkVBREVSIEFsaWdubWVudHM8L2E+PGJyIC8+JztcbiAgICB9XG4gIH1cbiAgaWYoISBtZW1wYWNrX3Jlc3VsdF9mb3VuZClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdtZW1wYWNrX2NhcnRvb24nLCAnPGgzPk5vIHBhY2tpbmcgcHJlZGljdGlvbiBwb3NzaWJsZTwvaDM+Jyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF9kb3dubG9hZHNfcGFuZWwocmFjdGl2ZSwgZG93bmxvYWRzX2luZm8pXG57XG4gIGNvbnNvbGUubG9nKGRvd25sb2Fkc19pbmZvKTtcbiAgbGV0IGRvd25sb2Fkc19zdHJpbmcgPSByYWN0aXZlLmdldCgnZG93bmxvYWRfbGlua3MnKTtcbiAgaWYoJ3BzaXByZWQnIGluIGRvd25sb2Fkc19pbmZvKVxuICB7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5ob3Jpeik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuc3MyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ2Rpc29wcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmNvbWIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZignbWVtc2F0c3ZtJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmRhdGEpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uc2NoZW1hdGljKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24pO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZigncGdlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ2dlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ21lbXBhY2snIGluIGRvd25sb2Fkc19pbmZvKVxuICB7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2suaGVhZGVyKTtcbiAgICBpZihkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNhcnRvb24pXG4gICAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNhcnRvb24pO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmdyYXBoX291dCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY29udGFjdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2subGlwaWRfb3V0KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIk5vIHBhY2tpbmcgcHJlZGljdGlvbiBwb3NzaWJsZTxiciAvPlwiKTtcbiAgICB9XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG5cbiAgcmFjdGl2ZS5zZXQoJ2Rvd25sb2FkX2xpbmtzJywgZG93bmxvYWRzX3N0cmluZyk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsImltcG9ydCB7IGdldF9tZW1zYXRfcmFuZ2VzIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX3NzMiB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9wYmRhdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9jb21iIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX21lbXNhdGRhdGEgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfcHJlc3VsdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5leHBvcnQgZnVuY3Rpb24gc2VuZF9yZXF1ZXN0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuICBjb25zb2xlLmxvZygnU2VuZGluZyBVUkkgcmVxdWVzdCcpO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuICBjb25zb2xlLmxvZyh0eXBlKTtcbiAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IHNlbmRfZGF0YSxcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBhc3luYzogICBmYWxzZSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgLy9jb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgdXJsOiB1cmwsXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKVxuICAgIHtcbiAgICAgIGlmKGRhdGEgPT09IG51bGwpe2FsZXJ0KFwiRmFpbGVkIHRvIHNlbmQgZGF0YVwiKTt9XG4gICAgICByZXNwb25zZT1kYXRhO1xuICAgICAgLy9hbGVydChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoXCJTZW5kaW5nIEpvYiB0byBcIit1cmwrXCIgRmFpbGVkLiBcIitlcnJvci5yZXNwb25zZVRleHQrXCIuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSB3YXMgdW5hYmxlIHRvIHByb2Nlc3MgeW91ciBzdWJtaXNzaW9uLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTsgcmV0dXJuIG51bGw7XG4gIH19KS5yZXNwb25zZUpTT047XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cbi8vZ2l2ZW4gYSBqb2IgbmFtZSBwcmVwIGFsbCB0aGUgZm9ybSBlbGVtZW50cyBhbmQgc2VuZCBhbiBodHRwIHJlcXVlc3QgdG8gdGhlXG4vL2JhY2tlbmRcbmV4cG9ydCBmdW5jdGlvbiBzZW5kX2pvYihyYWN0aXZlLCBqb2JfbmFtZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsKVxue1xuICAvL2FsZXJ0KHNlcSk7XG4gIGNvbnNvbGUubG9nKFwiU2VuZGluZyBmb3JtIGRhdGFcIik7XG4gIGNvbnNvbGUubG9nKGpvYl9uYW1lKTtcbiAgdmFyIGZpbGUgPSBudWxsO1xuICBsZXQgdXBwZXJfbmFtZSA9IGpvYl9uYW1lLnRvVXBwZXJDYXNlKCk7XG4gIHRyeVxuICB7XG4gICAgZmlsZSA9IG5ldyBCbG9iKFtzZXFdKTtcbiAgfSBjYXRjaCAoZSlcbiAge1xuICAgIGFsZXJ0KGUpO1xuICB9XG4gIGxldCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICBmZC5hcHBlbmQoXCJpbnB1dF9kYXRhXCIsIGZpbGUsICdpbnB1dC50eHQnKTtcbiAgZmQuYXBwZW5kKFwiam9iXCIsam9iX25hbWUpO1xuICBmZC5hcHBlbmQoXCJzdWJtaXNzaW9uX25hbWVcIixuYW1lKTtcbiAgZmQuYXBwZW5kKFwiZW1haWxcIiwgZW1haWwpO1xuXG4gIGxldCByZXNwb25zZV9kYXRhID0gc2VuZF9yZXF1ZXN0KHN1Ym1pdF91cmwsIFwiUE9TVFwiLCBmZCk7XG4gIGlmKHJlc3BvbnNlX2RhdGEgIT09IG51bGwpXG4gIHtcbiAgICBsZXQgdGltZXMgPSBzZW5kX3JlcXVlc3QodGltZXNfdXJsLCdHRVQnLHt9KTtcbiAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHRpbWVzKSk7XG4gICAgaWYoam9iX25hbWUgaW4gdGltZXMpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgdXBwZXJfbmFtZStcIiBqb2JzIHR5cGljYWxseSB0YWtlIFwiK3RpbWVzW2pvYl9uYW1lXStcIiBzZWNvbmRzXCIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgXCJVbmFibGUgdG8gcmV0cmlldmUgYXZlcmFnZSB0aW1lIGZvciBcIit1cHBlcl9uYW1lK1wiIGpvYnMuXCIpO1xuICAgIH1cbiAgICBmb3IodmFyIGsgaW4gcmVzcG9uc2VfZGF0YSlcbiAgICB7XG4gICAgICBpZihrID09IFwiVVVJRFwiKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsIHJlc3BvbnNlX2RhdGFba10pO1xuICAgICAgICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsIGpvYl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIHNlcXVlbmNlIGZyb20gYSBwcmV2aW91cyBzdWJtaXNzaW9uIGlzIHRoZVxuLy9wYWdlIHdhcyBsb2FkZWQgd2l0aCBhIFVVSURcbmV4cG9ydCBmdW5jdGlvbiBnZXRfcHJldmlvdXNfZGF0YSh1dWlkLCBzdWJtaXRfdXJsLCBmaWxlX3VybCwgcmFjdGl2ZSlcbntcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdGluZyBkZXRhaWxzIGdpdmVuIFVSSScpO1xuICAgIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgLy9hbGVydCh1cmwpO1xuICAgIGxldCBzdWJtaXNzaW9uX3Jlc3BvbnNlID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGlmKCEgc3VibWlzc2lvbl9yZXNwb25zZSl7YWxlcnQoXCJOTyBTVUJNSVNTSU9OIERBVEFcIik7fVxuICAgIGxldCBzZXEgPSBnZXRfdGV4dChmaWxlX3VybCtzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmlucHV0X2ZpbGUsIFwiR0VUXCIsIHt9KTtcbiAgICBsZXQgam9icyA9ICcnO1xuICAgIHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihzdWJtaXNzaW9uKXtcbiAgICAgIGpvYnMgKz0gc3VibWlzc2lvbi5qb2JfbmFtZStcIixcIjtcbiAgICB9KTtcbiAgICBqb2JzID0gam9icy5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuKHsnc2VxJzogc2VxLCAnZW1haWwnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmVtYWlsLCAnbmFtZSc6IHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnNbMF0uc3VibWlzc2lvbl9uYW1lLCAnam9icyc6IGpvYnN9KTtcbn1cblxuXG4vL2dldCB0ZXh0IGNvbnRlbnRzIGZyb20gYSByZXN1bHQgVVJJXG5mdW5jdGlvbiBnZXRfdGV4dCh1cmwsIHR5cGUsIHNlbmRfZGF0YSlcbntcblxuIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgLy9kYXRhVHlwZTogXCJ0eHRcIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gcmVxdWVzdCBpbnB1dCBkYXRhIHRleHRcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiR2V0dGluZ3MgcmVzdWx0cyB0ZXh0IGZhaWxlZC4gVGhlIEJhY2tlbmQgcHJvY2Vzc2luZyBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBjb250YWN0IHBzaXByZWRAY3MudWNsLmFjLnVrXCIpO31cbiAgfSk7XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cblxuLy9wb2xscyB0aGUgYmFja2VuZCB0byBnZXQgcmVzdWx0cyBhbmQgdGhlbiBwYXJzZXMgdGhvc2UgcmVzdWx0cyB0byBkaXNwbGF5XG4vL3RoZW0gb24gdGhlIHBhZ2VcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzX2ZpbGUodXJsX3N0dWIsIHBhdGgsIGN0bCwgemlwLCByYWN0aXZlKVxue1xuICBsZXQgdXJsID0gdXJsX3N0dWIgKyBwYXRoO1xuICBsZXQgcGF0aF9iaXRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIC8vZ2V0IGEgcmVzdWx0cyBmaWxlIGFuZCBwdXNoIHRoZSBkYXRhIGluIHRvIHRoZSBiaW8zZCBvYmplY3RcbiAgLy9hbGVydCh1cmwpO1xuICBjb25zb2xlLmxvZygnR2V0dGluZyBSZXN1bHRzIEZpbGUgYW5kIHByb2Nlc3NpbmcnKTtcbiAgbGV0IHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnR0VUJyxcbiAgICBhc3luYzogICB0cnVlLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZmlsZSlcbiAgICB7XG4gICAgICB6aXAuZm9sZGVyKHBhdGhfYml0c1sxXSkuZmlsZShwYXRoX2JpdHNbMl0sIGZpbGUpO1xuICAgICAgaWYoY3RsID09PSAnaG9yaXonKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9ob3JpeicsIGZpbGUpO1xuICAgICAgICBiaW9kMy5wc2lwcmVkKGZpbGUsICdwc2lwcmVkQ2hhcnQnLCB7cGFyZW50OiAnZGl2LnBzaXByZWRfY2FydG9vbicsIG1hcmdpbl9zY2FsZXI6IDJ9KTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3NzMicpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3NzMihyYWN0aXZlLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3BiZGF0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcGJkYXQocmFjdGl2ZSwgZmlsZSk7XG4gICAgICAgIC8vYWxlcnQoJ1BCREFUIHByb2Nlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ2NvbWInKVxuICAgICAge1xuICAgICAgICBwYXJzZV9jb21iKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnbWVtc2F0ZGF0YScpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX21lbXNhdGRhdGEocmFjdGl2ZSwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwcmVzdWx0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcHJlc3VsdChyYWN0aXZlLCBmaWxlLCAncGdlbicpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnZ2VuX3ByZXN1bHQnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9wcmVzdWx0KHJhY3RpdmUsIGZpbGUsICdnZW4nKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChKU09OLnN0cmluZ2lmeShlcnJvcikpO31cbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCIvKiAxLiBDYXRjaCBmb3JtIGlucHV0XG4gICAgIDIuIFZlcmlmeSBmb3JtXG4gICAgIDMuIElmIGdvb2QgdGhlbiBtYWtlIGZpbGUgZnJvbSBkYXRhIGFuZCBwYXNzIHRvIGJhY2tlbmRcbiAgICAgNC4gc2hyaW5rIGZvcm0gYXdheVxuICAgICA1LiBPcGVuIHNlcSBwYW5lbFxuICAgICA2LiBTaG93IHByb2Nlc3NpbmcgYW5pbWF0aW9uXG4gICAgIDcuIGxpc3RlbiBmb3IgcmVzdWx0XG4qL1xuaW1wb3J0IHsgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0gfSBmcm9tICcuL2Zvcm1zL2Zvcm1zX2luZGV4LmpzJztcbmltcG9ydCB7IHNlbmRfcmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMnO1xuaW1wb3J0IHsgZ2V0X3ByZXZpb3VzX2RhdGEgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCB9IGZyb20gJy4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5pbXBvcnQgeyBnZXRVcmxWYXJzIH0gZnJvbSAnLi9jb21tb24vY29tbW9uX2luZGV4LmpzJztcbmltcG9ydCB7IGNsZWFyX3NldHRpbmdzIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IHByZXBhcmVfZG93bmxvYWRzX2h0bWwgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgaGFuZGxlX3Jlc3VsdHMgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgc2V0X2Rvd25sb2Fkc19wYW5lbCB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5cbnZhciBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCcuY29weUJ1dHRvbicpO1xudmFyIHppcCA9IG5ldyBKU1ppcCgpO1xuXG5jbGlwYm9hcmQub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcbmNsaXBib2FyZC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcblxuLy8gU0VUIEVORFBPSU5UUyBGT1IgREVWLCBTVEFHSU5HIE9SIFBST0RcbmxldCBlbmRwb2ludHNfdXJsID0gbnVsbDtcbmxldCBzdWJtaXRfdXJsID0gbnVsbDtcbmxldCB0aW1lc191cmwgPSBudWxsO1xubGV0IGdlYXJzX3N2ZyA9IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG5sZXQgbWFpbl91cmwgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrXCI7XG5sZXQgYXBwX3BhdGggPSBcIi9wc2lwcmVkX2JldGFcIjtcbmxldCBmaWxlX3VybCA9ICcnO1xubGV0IGdlYXJfc3RyaW5nID0gJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JztcblxuaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiMTI3LjAuMC4xXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIpXG57XG4gIGVuZHBvaW50c191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvZW5kcG9pbnRzLyc7XG4gIHN1Ym1pdF91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvam9idGltZXMvJztcbiAgYXBwX3BhdGggPSAnL2ludGVyZmFjZSc7XG4gIG1haW5fdXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCc7XG4gIGdlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbiAgZmlsZV91cmwgPSBtYWluX3VybDtcbn1cbmVsc2UgaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiYmlvaW5mc3RhZ2UxLmNzLnVjbC5hYy51a1wiIHx8IGxvY2F0aW9uLmhvc3RuYW1lICA9PT0gXCJiaW9pbmYuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaHJlZiAgPT09IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL1wiKSB7XG4gIGVuZHBvaW50c191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL3N1Ym1pc3Npb24vJztcbiAgdGltZXNfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvam9idGltZXMvJztcbiAgZmlsZV91cmwgPSBtYWluX3VybCthcHBfcGF0aCtcIi9hcGlcIjtcbiAgLy9nZWFyc19zdmcgPSBcIi4uL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG59XG5lbHNlIHtcbiAgYWxlcnQoJ1VOU0VUVElORyBFTkRQT0lOVFMgV0FSTklORywgV0FSTklORyEnKTtcbiAgZW5kcG9pbnRzX3VybCA9ICcnO1xuICBzdWJtaXRfdXJsID0gJyc7XG4gIHRpbWVzX3VybCA9ICcnO1xufVxuXG4vLyBERUNMQVJFIFZBUklBQkxFUyBhbmQgaW5pdCByYWN0aXZlIGluc3RhbmNlXG52YXIgcmFjdGl2ZSA9IG5ldyBSYWN0aXZlKHtcbiAgZWw6ICcjcHNpcHJlZF9zaXRlJyxcbiAgdGVtcGxhdGU6ICcjZm9ybV90ZW1wbGF0ZScsXG4gIGRhdGE6IHtcbiAgICAgICAgICBzZXF1ZW5jZV9mb3JtX3Zpc2libGU6IDEsXG4gICAgICAgICAgc3RydWN0dXJlX2Zvcm1fdmlzaWJsZTogMCxcbiAgICAgICAgICByZXN1bHRzX3Zpc2libGU6IDEsXG4gICAgICAgICAgcmVzdWx0c19wYW5lbF92aXNpYmxlOiAxLFxuICAgICAgICAgIHN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGU6IDAsXG4gICAgICAgICAgbW9kZWxsZXJfa2V5OiBudWxsLFxuXG4gICAgICAgICAgcHNpcHJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBwc2lwcmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZGlzb3ByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBtZW1zYXRzdm1fY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWVtc2F0c3ZtX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9idXR0b246IGZhbHNlLFxuICAgICAgICAgIG1lbXBhY2tfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWVtcGFja19idXR0b246IGZhbHNlLFxuICAgICAgICAgIGdlbnRocmVhZGVyX2NoZWNrZWQ6IHRydWUsXG4gICAgICAgICAgZ2VudGhyZWFkZXJfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBkb21wcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGRvbXByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgcGRvbXRocmVhZGVyX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgYmlvc2VyZl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBiaW9zZXJmX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZG9tc2VyZl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBkb21zZXJmX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZmZwcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGZmcHJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIG1ldHNpdGVfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWV0c2l0ZV9idXR0b246IGZhbHNlLFxuICAgICAgICAgIGhzcHJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBoc3ByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBtZW1lbWJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBtZW1lbWJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIGdlbnRkYl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBnZW50ZGJfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBtZXRhcHNpY292X2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIG1ldGFwc2ljb3ZfYnV0dG9uOiBmYWxzZSxcblxuICAgICAgICAgIC8vIHBnZW50aHJlYWRlcl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBwZG9tdGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgLy8gZG9tcHJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBtZW1wYWNrX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIGZmcHJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICAvLyBiaW9zZXJmX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIGRvbXNlcmZfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZG93bmxvYWRfbGlua3M6ICcnLFxuICAgICAgICAgIHBzaXByZWRfam9iOiAncHNpcHJlZF9qb2InLFxuICAgICAgICAgIGRpc29wcmVkX2pvYjogJ2Rpc29wcmVkX2pvYicsXG4gICAgICAgICAgbWVtc2F0c3ZtX2pvYjogJ21lbXNhdHN2bV9qb2InLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9qb2I6ICdwZ2VudGhyZWFkZXJfam9iJyxcbiAgICAgICAgICBtZW1wYWNrX2pvYjogJ21lbXBhY2tfam9iJyxcbiAgICAgICAgICBnZW50aHJlYWRlcl9qb2I6ICdnZW50aHJlYWRlcl9qb2InLFxuICAgICAgICAgIGRvbXByZWRfam9iOiAnZG9tcHJlZF9qb2InLFxuICAgICAgICAgIHBkb210aHJlYWRlcl9qb2I6ICdwZG9tdGhyZWFkZXJfam9iJyxcbiAgICAgICAgICBiaW9zZXJmX2pvYjogJ2Jpb3NlcmZfam9iJyxcbiAgICAgICAgICBkb21zZXJmX2pvYjogJ2RvbXNlcmZfam9iJyxcbiAgICAgICAgICBmZnByZWRfam9iOiAnZmZwcmVkX2pvYicsXG4gICAgICAgICAgbWV0c2l0ZV9qb2I6ICdtZXRzaXRlX2pvYicsXG4gICAgICAgICAgaHNwcmVkX2pvYjogJ2hzcHJlZF9qb2InLFxuICAgICAgICAgIG1lbWVtYmVkX2pvYjogJ21lbWVtYmVkX2pvYicsXG4gICAgICAgICAgZ2VudGRiX2pvYjogJ2dlbnRkYl9qb2InLFxuICAgICAgICAgIG1ldGFwc2ljb3Zfam9iOiAnbWV0YXBzaWNvdl9qb2InLFxuXG5cbiAgICAgICAgICBwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBQU0lQUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIHBzaXByZWRfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBwc2lwcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBzaXByZWRfaG9yaXo6IG51bGwsXG5cbiAgICAgICAgICBkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRElTT1BSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZGlzb3ByZWRfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBkaXNvcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBkaXNvX3ByZWNpc2lvbjogbnVsbCxcblxuICAgICAgICAgIG1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTUVNU0FULVNWTSBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZW1zYXRzdm1fd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBtZW1zYXRzdm1fdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0c3ZtX3NjaGVtYXRpYzogJycsXG4gICAgICAgICAgbWVtc2F0c3ZtX2NhcnRvb246ICcnLFxuXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBnZW5fdGFibGU6IG51bGwsXG4gICAgICAgICAgcGdlbl9hbm5fc2V0OiB7fSxcblxuICAgICAgICAgIG1lbXBhY2tfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVBBQ0sgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgbWVtcGFja193YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIG1lbXBhY2tfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0cGFja19zY2hlbWF0aWM6ICcnLFxuICAgICAgICAgIG1lbXNhdHBhY2tfY2FydG9vbjogJycsXG5cbiAgICAgICAgICBnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBnZW50aHJlYWRlcl90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBnZW5fdGFibGU6IG51bGwsXG4gICAgICAgICAgZ2VuX2Fubl9zZXQ6IHt9LFxuXG4gICAgICAgICAgZG9tcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRE9NUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBkb21wcmVkX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgZG9tcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBkb21wcmVkX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBwZG9tdGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIHBEb21USFJFQURFUiBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcGRvbXRocmVhZGVyX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBiaW9zZXJmX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBCaW9TZXJmIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIGJpb3NlcmZfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBiaW9zZXJmX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIGJpb3NlcmZfZGF0YTogbnVsbCxcblxuICAgICAgICAgIGRvbXNlcmZfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIERvbVNlcmYgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZG9tc2VyZl93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIGRvbXNlcmZfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZG9tc2VyZl9kYXRhOiBudWxsLFxuXG4gICAgICAgICAgZmZwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBGRlByZWQgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZmZwcmVkX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgZmZwcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIGZmcHJlZF9kYXRhOiBudWxsLFxuXG4gICAgICAgICAgbWV0YXBzaWNvdl93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTWV0YVBTSUNPViBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZXRhcHNpY292X3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgbWV0YXBzaWNvdl90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBtZXRhcHNpY292X2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBtZXRzaXRlX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNZXRTaXRlIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIG1ldHNpdGVfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBtZXRzaXRlX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIG1ldHNpdGVfZGF0YTogbnVsbCxcblxuICAgICAgICAgIGhzcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgSFNQcmVkIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIGhzcHJlZF93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIGhzcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBoc3ByZWRfZGF0YTogbnVsbCxcblxuICAgICAgICAgIG1lbWVtYmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNRU1FTUJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZW1lbWJlZF93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIG1lbWVtYmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIG1lbWVtYmVkX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBnZW50ZGJfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciBUREIgR2VuZXJhdGlvbiBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBnZW50ZGJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBnZW50ZGJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZ2VudGRiX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICAvLyBTZXF1ZW5jZSBhbmQgam9iIGluZm9cbiAgICAgICAgICBzZXF1ZW5jZTogJycsXG4gICAgICAgICAgc2VxdWVuY2VfbGVuZ3RoOiAxLFxuICAgICAgICAgIHN1YnNlcXVlbmNlX3N0YXJ0OiAxLFxuICAgICAgICAgIHN1YnNlcXVlbmNlX3N0b3A6IDEsXG4gICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIGJhdGNoX3V1aWQ6IG51bGwsXG5cbiAgICAgICAgICAvL2hvbGQgYW5ub3RhdGlvbnMgdGhhdCBhcmUgcmVhZCBmcm9tIGRhdGFmaWxlc1xuICAgICAgICAgIGFubm90YXRpb25zOiBudWxsLFxuICAgICAgICB9XG59KTtcblxuLy9zZXQgc29tZSB0aGluZ3Mgb24gdGhlIHBhZ2UgZm9yIHRoZSBkZXZlbG9wbWVudCBzZXJ2ZXJcbmlmKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcIjEyNy4wLjAuMVwiKSB7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcsICdkYW5pZWwuYnVjaGFuQHVjbC5hYy51aycpO1xuICByYWN0aXZlLnNldCgnbmFtZScsICd0ZXN0Jyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsICdRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBUycpO1xufVxuXG4vLzRiNmFkNzkyLWVkMWYtMTFlNS04OTg2LTk4OTA5NmMxM2VlNlxubGV0IHV1aWRfcmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9JC9pO1xubGV0IHV1aWRfbWF0Y2ggPSB1dWlkX3JlZ2V4LmV4ZWMoZ2V0VXJsVmFycygpLnV1aWQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEFQUExJQ0FUSU9OIEhFUkVcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0hlcmUgd2VyZSBrZWVwIGFuIGV5ZSBvbiBzb21lIGZvcm0gZWxlbWVudHMgYW5kIHJld3JpdGUgdGhlIG5hbWUgaWYgcGVvcGxlXG4vL2hhdmUgcHJvdmlkZWQgYSBmYXN0YSBmb3JtYXR0ZWQgc2VxXG5sZXQgc2VxX29ic2VydmVyID0gcmFjdGl2ZS5vYnNlcnZlKCdzZXF1ZW5jZScsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgbGV0IHJlZ2V4ID0gL14+KC4rPylcXHMvO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG5ld1ZhbHVlKTtcbiAgaWYobWF0Y2gpXG4gIHtcbiAgICB0aGlzLnNldCgnbmFtZScsIG1hdGNoWzFdKTtcbiAgfVxuICAvLyBlbHNlIHtcbiAgLy8gICB0aGlzLnNldCgnbmFtZScsIG51bGwpO1xuICAvLyB9XG5cbiAgfSxcbiAge2luaXQ6IGZhbHNlLFxuICAgZGVmZXI6IHRydWVcbiB9KTtcbi8vdGhlc2VzIHR3byBvYnNlcnZlcnMgc3RvcCBwZW9wbGUgc2V0dGluZyB0aGUgcmVzdWJtaXNzaW9uIHdpZGdldCBvdXQgb2YgYm91bmRzXG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdG9wJywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9sZW5ndGggPSByYWN0aXZlLmdldCgnc2VxdWVuY2VfbGVuZ3RoJyk7XG4gIGxldCBzZXFfc3RhcnQgPSByYWN0aXZlLmdldCgnc3Vic2VxdWVuY2Vfc3RhcnQnKTtcbiAgaWYodmFsdWUgPiBzZXFfbGVuZ3RoKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXFfbGVuZ3RoKTtcbiAgfVxuICBpZih2YWx1ZSA8PSBzZXFfc3RhcnQpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9zdGFydCsxKTtcbiAgfVxufSk7XG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdGFydCcsIGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGxldCBzZXFfc3RvcCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdG9wJyk7XG4gIGlmKHZhbHVlIDwgMSlcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcsIDEpO1xuICB9XG4gIGlmKHZhbHVlID49IHNlcV9zdG9wKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0Jywgc2VxX3N0b3AtMSk7XG4gIH1cbn0pO1xuXG4vL0FmdGVyIGEgam9iIGhhcyBiZWVuIHNlbnQgb3IgYSBVUkwgYWNjZXB0ZWQgdGhpcyByYWN0aXZlIGJsb2NrIGlzIGNhbGxlZCB0b1xuLy9wb2xsIHRoZSBiYWNrZW5kIHRvIGdldCB0aGUgcmVzdWx0c1xucmFjdGl2ZS5vbigncG9sbF90cmlnZ2VyJywgZnVuY3Rpb24obmFtZSwgam9iX3R5cGUpe1xuICBjb25zb2xlLmxvZyhcIlBvbGxpbmcgYmFja2VuZCBmb3IgcmVzdWx0c1wiKTtcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwgKyByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgYXBwX3BhdGgrJy8mdXVpZD0nK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJykpO1xuICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG5cbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBsZXQgYmF0Y2ggPSBzZW5kX3JlcXVlc3QodXJsLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGRvd25sb2Fkc19pbmZvID0ge307XG5cbiAgICBpZihiYXRjaC5zdGF0ZSA9PT0gJ0NvbXBsZXRlJylcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlbmRlciByZXN1bHRzXCIpO1xuICAgICAgbGV0IHN1Ym1pc3Npb25zID0gYmF0Y2guc3VibWlzc2lvbnM7XG4gICAgICBzdWJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIHByZXBhcmVfZG93bmxvYWRzX2h0bWwoZGF0YSwgZG93bmxvYWRzX2luZm8pO1xuICAgICAgICAgIGhhbmRsZV9yZXN1bHRzKHJhY3RpdmUsIGRhdGEsIGZpbGVfdXJsLCB6aXAsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgfSk7XG4gICAgICBzZXRfZG93bmxvYWRzX3BhbmVsKHJhY3RpdmUsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbi8vIE9uIGNsaWNraW5nIHRoZSBHZXQgWmlwIGZpbGUgbGluayB0aGlzIHdhdGNoZXJzIHByZXBhcmVzIHRoZSB6aXAgYW5kIGhhbmRzIGl0IHRvIHRoZSB1c2VyXG5yYWN0aXZlLm9uKCdnZXRfemlwJywgZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBsZXQgdXVpZCA9IHJhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgemlwLmdlbmVyYXRlQXN5bmMoe3R5cGU6XCJibG9iXCJ9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XG4gICAgICAgIHNhdmVBcyhibG9iLCB1dWlkK1wiLnppcFwiKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGVzZSByZWFjdCB0byB0aGUgaGVhZGVycyBiZWluZyBjbGlja2VkIHRvIHRvZ2dsZSB0aGUgcmVzdWx0cyBwYW5lbFxuLy9cbnJhY3RpdmUub24oICdzZXF1ZW5jZV9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAnc3RydWN0dXJlX2Zvcm1fdmlzaWJsZScsIDAgKTtcbiAgcmFjdGl2ZS5zZXQoICdwc2lwcmVkX2NoZWNrZWQnLCB0cnVlKTtcbiAgcmFjdGl2ZS5zZXQoICdkaXNvcHJlZF9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ21lbXNhdHN2bV9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ3BnZW50aHJlYWRlcl9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ21lbXBhY2tfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdnZW50aHJlYWRlcl9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ2RvbXByZWRfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdwZG9tdGhyZWFkZXJfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdiaW9zZXJmX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnZG9tc2VyZl9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ2ZmcHJlZF9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ21ldGFwc2ljb3ZfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdtZXRzaXRlX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnaHNwcmVkX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnbWVtZW1iZWRfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdnZW50ZGJfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdzZXF1ZW5jZV9mb3JtX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgMSApO1xufSk7XG5yYWN0aXZlLm9uKCAnc3RydWN0dXJlX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDAgKTtcbiAgcmFjdGl2ZS5zZXQoICdwc2lwcmVkX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnZGlzb3ByZWRfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdtZW1zYXRzdm1fY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdwZ2VudGhyZWFkZXJfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdtZW1wYWNrX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnZ2VudGhyZWFkZXJfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdkb21wcmVkX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAncGRvbXRocmVhZGVyX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnYmlvc2VyZl9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ2RvbXNlcmZfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdmZnByZWRfY2hlY2tlZCcsIGZhbHNlKTtcbiAgcmFjdGl2ZS5zZXQoICdtZXRhcHNpY292X2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnbWV0c2l0ZV9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ2hzcHJlZF9jaGVja2VkJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCggJ21lbWVtYmVkX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnZ2VudGRiX2NoZWNrZWQnLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCAnc3RydWN0dXJlX2Zvcm1fdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlJywgMSApO1xufSk7XG5cbnJhY3RpdmUub24oICdkb3dubG9hZHNfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTEgKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3BzaXByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMSApO1xuICBpZihyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpKVxuICB7XG4gICAgYmlvZDMucHNpcHJlZChyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gIH1cbn0pO1xucmFjdGl2ZS5vbiggJ2Rpc29wcmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDQgKTtcbiAgaWYocmFjdGl2ZS5nZXQoJ2Rpc29fcHJlY2lzaW9uJykpXG4gIHtcbiAgICBiaW9kMy5nZW5lcmljeHlMaW5lQ2hhcnQocmFjdGl2ZS5nZXQoJ2Rpc29fcHJlY2lzaW9uJyksICdwb3MnLCBbJ3ByZWNpc2lvbiddLCBbJ0JsYWNrJyxdLCAnRGlzb05OQ2hhcnQnLCB7cGFyZW50OiAnZGl2LmNvbWJfcGxvdCcsIGNoYXJ0VHlwZTogJ2xpbmUnLCB5X2N1dG9mZjogMC41LCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gIH1cbn0pO1xucmFjdGl2ZS5vbiggJ21lbXNhdHN2bV9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2ICk7XG59KTtcbnJhY3RpdmUub24oICdwZ2VudGhyZWFkZXJfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMiApO1xufSk7XG5yYWN0aXZlLm9uKCAnbWVtcGFja19hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA1ICk7XG59KTtcbnJhY3RpdmUub24oICdnZW50aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA3ICk7XG59KTtcbnJhY3RpdmUub24oICdkb21wcmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDggKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3Bkb210aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA5ICk7XG59KTtcbnJhY3RpdmUub24oICdiaW9zZXJmX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEwICk7XG59KTtcbnJhY3RpdmUub24oICdkb21zZXJmX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEyICk7XG59KTtcbnJhY3RpdmUub24oICdmZnByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTMgKTtcbn0pO1xucmFjdGl2ZS5vbiggJ21ldGFwc2ljb3ZfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTggKTtcbn0pO1xucmFjdGl2ZS5vbiggJ21ldHNpdGVfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTQgKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2hzcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxNSApO1xufSk7XG5yYWN0aXZlLm9uKCAnbWVtZW1iZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTYgKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2dlbnRkYl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxNyApO1xufSk7XG5cblxucmFjdGl2ZS5vbiggJ3N1Ym1pc3Npb25fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgbGV0IHN0YXRlID0gcmFjdGl2ZS5nZXQoJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnKTtcbiAgaWYoc3RhdGUgPT09IDEpe1xuICAgIHJhY3RpdmUuc2V0KCAnc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZScsIDAgKTtcbiAgfVxuICBlbHNle1xuICAgIHJhY3RpdmUuc2V0KCAnc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZScsIDEgKTtcbiAgfVxufSk7XG5cbi8vZ3JhYiB0aGUgc3VibWl0IGV2ZW50IGZyb20gdGhlIG1haW4gZm9ybSBhbmQgc2VuZCB0aGUgc2VxdWVuY2UgdG8gdGhlIGJhY2tlbmRcbnJhY3RpdmUub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKCdTdWJtaXR0aW5nIGRhdGEnKTtcbiAgbGV0IHNlcSA9IHRoaXMuZ2V0KCdzZXF1ZW5jZScpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXj4uKyQvbWcsIFwiXCIpLnRvVXBwZXJDYXNlKCk7XG4gIHNlcSA9IHNlcS5yZXBsYWNlKC9cXG58XFxzL2csXCJcIik7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJywgc2VxKTtcblxuICBsZXQgbmFtZSA9IHRoaXMuZ2V0KCduYW1lJyk7XG4gIGxldCBlbWFpbCA9IHRoaXMuZ2V0KCdlbWFpbCcpO1xuICBsZXQgcHNpcHJlZF9qb2IgPSB0aGlzLmdldCgncHNpcHJlZF9qb2InKTtcbiAgbGV0IHBzaXByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwc2lwcmVkX2NoZWNrZWQnKTtcbiAgbGV0IGRpc29wcmVkX2pvYiA9IHRoaXMuZ2V0KCdkaXNvcHJlZF9qb2InKTtcbiAgbGV0IGRpc29wcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnZGlzb3ByZWRfY2hlY2tlZCcpO1xuICBsZXQgbWVtc2F0c3ZtX2pvYiA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fam9iJyk7XG4gIGxldCBtZW1zYXRzdm1fY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZW1zYXRzdm1fY2hlY2tlZCcpO1xuICBsZXQgcGdlbnRocmVhZGVyX2pvYiA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfam9iJyk7XG4gIGxldCBwZ2VudGhyZWFkZXJfY2hlY2tlZCA9IHRoaXMuZ2V0KCdwZ2VudGhyZWFkZXJfY2hlY2tlZCcpO1xuICBsZXQgbWVtcGFja19qb2IgPSB0aGlzLmdldCgnbWVtcGFja19qb2InKTtcbiAgbGV0IG1lbXBhY2tfY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZW1wYWNrX2NoZWNrZWQnKTtcbiAgbGV0IGdlbnRocmVhZGVyX2pvYiA9IHRoaXMuZ2V0KCdnZW50aHJlYWRlcl9qb2InKTtcbiAgbGV0IGdlbnRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgnZ2VudGhyZWFkZXJfY2hlY2tlZCcpO1xuICBsZXQgZG9tcHJlZF9qb2IgPSB0aGlzLmdldCgnZG9tcHJlZF9qb2InKTtcbiAgbGV0IGRvbXByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdkb21wcmVkX2NoZWNrZWQnKTtcbiAgbGV0IHBkb210aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgncGRvbXRocmVhZGVyX2pvYicpO1xuICBsZXQgcGRvbXRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgncGRvbXRocmVhZGVyX2NoZWNrZWQnKTtcbiAgbGV0IGJpb3NlcmZfam9iID0gdGhpcy5nZXQoJ2Jpb3NlcmZfam9iJyk7XG4gIGxldCBiaW9zZXJmX2NoZWNrZWQgPSB0aGlzLmdldCgnYmlvc2VyZl9jaGVja2VkJyk7XG4gIGxldCBkb21zZXJmX2pvYiA9IHRoaXMuZ2V0KCdkb21zZXJmX2pvYicpO1xuICBsZXQgZG9tc2VyZl9jaGVja2VkID0gdGhpcy5nZXQoJ2RvbXNlcmZfY2hlY2tlZCcpO1xuICBsZXQgZmZwcmVkX2pvYiA9IHRoaXMuZ2V0KCdmZnByZWRfam9iJyk7XG4gIGxldCBmZnByZWRfY2hlY2tlZCA9IHRoaXMuZ2V0KCdmZnByZWRfY2hlY2tlZCcpO1xuICBsZXQgbWV0YXBzaWNvdl9qb2IgPSB0aGlzLmdldCgnbWV0YXBzaWNvdl9qb2InKTtcbiAgbGV0IG1ldGFwc2ljb3ZfY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZXRhcHNpY292X2NoZWNrZWQnKTtcbiAgbGV0IG1ldHNpdGVfam9iID0gdGhpcy5nZXQoJ21ldGFzaXRlX2pvYicpO1xuICBsZXQgbWV0c2l0ZV9jaGVja2VkID0gdGhpcy5nZXQoJ21ldGFzaXRlX2NoZWNrZWQnKTtcbiAgbGV0IGhzcHJlZF9qb2IgPSB0aGlzLmdldCgnaHNwcmVkX2pvYicpO1xuICBsZXQgaHNwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnaHNwcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1lbWVtYmVkX2pvYiA9IHRoaXMuZ2V0KCdtZW1lbWJlZF9qb2InKTtcbiAgbGV0IG1lbWVtYmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtZW1iZWRfY2hlY2tlZCcpO1xuICBsZXQgZ2VudGRiX2pvYiA9IHRoaXMuZ2V0KCdnZW50ZGJfam9iJyk7XG4gIGxldCBnZW50ZGJfY2hlY2tlZCA9IHRoaXMuZ2V0KCdnZW50ZGJfY2hlY2tlZCcpO1xuXG4gIHZlcmlmeV9hbmRfc2VuZF9mb3JtKHJhY3RpdmUsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCwgcHNpcHJlZF9jaGVja2VkLCBkaXNvcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICBtZW1zYXRzdm1fY2hlY2tlZCwgcGdlbnRocmVhZGVyX2NoZWNrZWQsIG1lbXBhY2tfY2hlY2tlZCwgZ2VudGhyZWFkZXJfY2hlY2tlZCwgZG9tcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICBwZG9tdGhyZWFkZXJfY2hlY2tlZCwgYmlvc2VyZl9jaGVja2VkLCBkb21zZXJmX2NoZWNrZWQsIGZmcHJlZF9jaGVja2VkLCBtZXRhcHNpY292X2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgIG1ldHNpdGVfY2hlY2tlZCwgaHNwcmVkX2NoZWNrZWQsIG1lbWVtYmVkX2NoZWNrZWQsIGdlbnRkYl9jaGVja2VkKTtcbiAgZXZlbnQub3JpZ2luYWwucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBncmFiIHRoZSBzdWJtaXQgZXZlbnQgZnJvbSB0aGUgUmVzdWJtaXNzaW9uIHdpZGdldCwgdHJ1bmNhdGUgdGhlIHNlcXVlbmNlXG4vLyBhbmQgc2VuZCBhIG5ldyBqb2JcbnJhY3RpdmUub24oJ3Jlc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgY29uc29sZS5sb2coJ1Jlc3VibWl0dGluZyBzZWdtZW50Jyk7XG4gIGxldCBzdGFydCA9IHJhY3RpdmUuZ2V0KFwic3Vic2VxdWVuY2Vfc3RhcnRcIik7XG4gIGxldCBzdG9wID0gcmFjdGl2ZS5nZXQoXCJzdWJzZXF1ZW5jZV9zdG9wXCIpO1xuICBsZXQgc2VxdWVuY2UgPSByYWN0aXZlLmdldChcInNlcXVlbmNlXCIpO1xuICBsZXQgc3Vic2VxdWVuY2UgPSBzZXF1ZW5jZS5zdWJzdHJpbmcoc3RhcnQtMSwgc3RvcCk7XG4gIGxldCBuYW1lID0gdGhpcy5nZXQoJ25hbWUnKStcIl9zZWdcIjtcbiAgbGV0IGVtYWlsID0gdGhpcy5nZXQoJ2VtYWlsJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzdWJzZXF1ZW5jZS5sZW5ndGgpO1xuICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHN1YnNlcXVlbmNlLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHN1YnNlcXVlbmNlKTtcbiAgcmFjdGl2ZS5zZXQoJ25hbWUnLCBuYW1lKTtcbiAgbGV0IHBzaXByZWRfam9iID0gdGhpcy5nZXQoJ3BzaXByZWRfam9iJyk7XG4gIGxldCBwc2lwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgncHNpcHJlZF9jaGVja2VkJyk7XG4gIGxldCBkaXNvcHJlZF9qb2IgPSB0aGlzLmdldCgnZGlzb3ByZWRfam9iJyk7XG4gIGxldCBkaXNvcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ2Rpc29wcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1lbXNhdHN2bV9qb2IgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2pvYicpO1xuICBsZXQgbWVtc2F0c3ZtX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtc2F0c3ZtX2NoZWNrZWQnKTtcbiAgbGV0IHBnZW50aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2pvYicpO1xuICBsZXQgcGdlbnRocmVhZGVyX2NoZWNrZWQgPSB0aGlzLmdldCgncGdlbnRocmVhZGVyX2NoZWNrZWQnKTtcbiAgbGV0IG1lbXBhY2tfam9iID0gdGhpcy5nZXQoJ21lbXBhY2tfam9iJyk7XG4gIGxldCBtZW1wYWNrX2NoZWNrZWQgPSB0aGlzLmdldCgnbWVtcGFja19jaGVja2VkJyk7XG4gIGxldCBnZW50aHJlYWRlcl9qb2IgPSB0aGlzLmdldCgnZ2VudGhyZWFkZXJfam9iJyk7XG4gIGxldCBnZW50aHJlYWRlcl9jaGVja2VkID0gdGhpcy5nZXQoJ2dlbnRocmVhZGVyX2NoZWNrZWQnKTtcbiAgbGV0IGRvbXByZWRfam9iID0gdGhpcy5nZXQoJ2RvbXByZWRfam9iJyk7XG4gIGxldCBkb21wcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnZG9tcHJlZF9jaGVja2VkJyk7XG4gIGxldCBwZG9tdGhyZWFkZXJfam9iID0gdGhpcy5nZXQoJ3Bkb210aHJlYWRlcl9qb2InKTtcbiAgbGV0IHBkb210aHJlYWRlcl9jaGVja2VkID0gdGhpcy5nZXQoJ3Bkb210aHJlYWRlcl9jaGVja2VkJyk7XG4gIGxldCBiaW9zZXJmX2pvYiA9IHRoaXMuZ2V0KCdiaW9zZXJmX2pvYicpO1xuICBsZXQgYmlvc2VyZl9jaGVja2VkID0gdGhpcy5nZXQoJ2Jpb3NlcmZfY2hlY2tlZCcpO1xuICBsZXQgZG9tc2VyZl9qb2IgPSB0aGlzLmdldCgnZG9tc2VyZl9qb2InKTtcbiAgbGV0IGRvbXNlcmZfY2hlY2tlZCA9IHRoaXMuZ2V0KCdkb21zZXJmX2NoZWNrZWQnKTtcbiAgbGV0IGZmcHJlZF9qb2IgPSB0aGlzLmdldCgnZmZwcmVkX2pvYicpO1xuICBsZXQgZmZwcmVkX2NoZWNrZWQgPSB0aGlzLmdldCgnZmZwcmVkX2NoZWNrZWQnKTtcbiAgbGV0IG1ldGFwc2ljb3Zfam9iID0gdGhpcy5nZXQoJ21ldGFwc2ljb3Zfam9iJyk7XG4gIGxldCBtZXRhcHNpY292X2NoZWNrZWQgPSB0aGlzLmdldCgnbWV0YXBzaWNvdl9jaGVja2VkJyk7XG4gIGxldCBtZXRzaXRlX2pvYiA9IHRoaXMuZ2V0KCdtZXRhc2l0ZV9qb2InKTtcbiAgbGV0IG1ldHNpdGVfY2hlY2tlZCA9IHRoaXMuZ2V0KCdtZXRhc2l0ZV9jaGVja2VkJyk7XG4gIGxldCBoc3ByZWRfam9iID0gdGhpcy5nZXQoJ2hzcHJlZF9qb2InKTtcbiAgbGV0IGhzcHJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ2hzcHJlZF9jaGVja2VkJyk7XG4gIGxldCBtZW1lbWJlZF9qb2IgPSB0aGlzLmdldCgnbWVtZW1iZWRfam9iJyk7XG4gIGxldCBtZW1lbWJlZF9jaGVja2VkID0gdGhpcy5nZXQoJ21lbWVtYmVkX2NoZWNrZWQnKTtcbiAgbGV0IGdlbnRkYl9qb2IgPSB0aGlzLmdldCgnZ2VudGRiX2pvYicpO1xuICBsZXQgZ2VudGRiX2NoZWNrZWQgPSB0aGlzLmdldCgnZ2VudGRiX2NoZWNrZWQnKTtcbiAgLy9jbGVhciB3aGF0IHdlIGhhdmUgcHJldmlvdXNseSB3cml0dGVuXG4gIGNsZWFyX3NldHRpbmdzKHJhY3RpdmUsIGdlYXJfc3RyaW5nKTtcbiAgLy92ZXJpZnkgZm9ybSBjb250ZW50cyBhbmQgcG9zdFxuICAvL2NvbnNvbGUubG9nKG5hbWUpO1xuICAvL2NvbnNvbGUubG9nKGVtYWlsKTtcbiAgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc3Vic2VxdWVuY2UsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIHBzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkLCBtZW1wYWNrX2NoZWNrZWQsIGdlbnRocmVhZGVyX2NoZWNrZWQsIGRvbXByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgcGRvbXRocmVhZGVyX2NoZWNrZWQsIGJpb3NlcmZfY2hlY2tlZCwgZG9tc2VyZl9jaGVja2VkLCBmZnByZWRfY2hlY2tlZCwgbWV0YXBzaWNvdl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICBtZXRzaXRlX2NoZWNrZWQsIGhzcHJlZF9jaGVja2VkLCBtZW1lbWJlZF9jaGVja2VkLCBnZW50ZGJfY2hlY2tlZCk7XG4gIC8vd3JpdGUgbmV3IGFubm90YXRpb24gZGlhZ3JhbVxuICAvL3N1Ym1pdCBzdWJzZWN0aW9uXG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gSGVyZSBoYXZpbmcgc2V0IHVwIHJhY3RpdmUgYW5kIHRoZSBmdW5jdGlvbnMgd2UgbmVlZCB3ZSB0aGVuIGNoZWNrXG4vLyBpZiB3ZSB3ZXJlIHByb3ZpZGVkIGEgVVVJRCwgSWYgdGhlIHBhZ2UgaXMgbG9hZGVkIHdpdGggYSBVVUlEIHJhdGhlciB0aGFuIGFcbi8vIGZvcm0gc3VibWl0LlxuLy9UT0RPOiBIYW5kbGUgbG9hZGluZyB0aGF0IHBhZ2Ugd2l0aCB1c2UgdGhlIE1FTVNBVCBhbmQgRElTT1BSRUQgVVVJRFxuLy9cbmlmKGdldFVybFZhcnMoKS51dWlkICYmIHV1aWRfbWF0Y2gpXG57XG4gIGNvbnNvbGUubG9nKCdDYXVnaHQgYW4gaW5jb21pbmcgVVVJRCcpO1xuICBzZXFfb2JzZXJ2ZXIuY2FuY2VsKCk7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7IC8vIHNob3VsZCBtYWtlIGEgZ2VuZXJpYyBvbmUgdmlzaWJsZSB1bnRpbCByZXN1bHRzIGFycml2ZS5cbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgcmFjdGl2ZS5zZXQoXCJiYXRjaF91dWlkXCIsIGdldFVybFZhcnMoKS51dWlkKTtcbiAgbGV0IHByZXZpb3VzX2RhdGEgPSBnZXRfcHJldmlvdXNfZGF0YShnZXRVcmxWYXJzKCkudXVpZCwgc3VibWl0X3VybCwgZmlsZV91cmwsIHJhY3RpdmUpO1xuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BzaXByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA0KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAyKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXBhY2snKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnbWVtcGFja19idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDcpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZG9tcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnZG9tcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdwZG9tdGhyZWFkZXInKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdiaW9zZXJmJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Jpb3NlcmZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEwKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2RvbXNlcmYnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTIpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZmZwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTMpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWV0c2l0ZScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWV0c2l0ZV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTQpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnaHNwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdoc3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE1KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbWVtYmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTYpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZ2VudGRiJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50ZGJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE3KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21ldGFwc2ljb3YnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21ldGFwc2ljb3ZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE4KTtcbiAgfVxuXG5cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gTmV3IFBhbm5lbCBmdW5jdGlvbnNcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb2RlbChhbG5VUkkpIHtcblxuICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBsZXQgbW9kX2tleSA9IHJhY3RpdmUuZ2V0KCdtb2RlbGxlcl9rZXknKTtcbiAgaWYobW9kX2tleSA9PT0gJ00nKydPJysnRCcrJ0UnKydMJysnSScrJ1InKydBJysnTicrJ0onKydFJylcbiAge1xuICAgIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tb2RlbC9wb3N0P2Fsbj1cIitmaWxlX3VybCthbG5VUkksIFwiXCIsIFwid2lkdGg9NjcwLGhlaWdodD03MDBcIik7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgYWxlcnQoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgTScrJ08nKydEJysnRScrJ0wnKydMJysnRScrJ1IgTGljZW5jZSBLZXknKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL21haW4uanMiLCJpbXBvcnQgeyBzZW5kX2pvYiB9IGZyb20gJy4uL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGlzSW5BcnJheSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuaW1wb3J0IHsgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5cbi8vVGFrZXMgdGhlIGRhdGEgbmVlZGVkIHRvIHZlcmlmeSB0aGUgaW5wdXQgZm9ybSBkYXRhLCBlaXRoZXIgdGhlIG1haW4gZm9ybVxuLy9vciB0aGUgc3VibWlzc29uIHdpZGdldCB2ZXJpZmllcyB0aGF0IGRhdGEgYW5kIHRoZW4gcG9zdHMgaXQgdG8gdGhlIGJhY2tlbmQuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBwc2lwcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNvcHJlZF9jaGVja2VkLCBtZW1zYXRzdm1fY2hlY2tlZCwgcGdlbnRocmVhZGVyX2NoZWNrZWQsIG1lbXBhY2tfY2hlY2tlZCwgZ2VudGhyZWFkZXJfY2hlY2tlZCwgZG9tcHJlZF9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRvbXRocmVhZGVyX2NoZWNrZWQsIGJpb3NlcmZfY2hlY2tlZCwgZG9tc2VyZl9jaGVja2VkLCBmZnByZWRfY2hlY2tlZCwgbWV0YXBzaWNvdl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0c2l0ZV9jaGVja2VkLCBoc3ByZWRfY2hlY2tlZCwgbWVtZW1iZWRfY2hlY2tlZCwgZ2VudGRiX2NoZWNrZWQpXG57XG4gIC8qdmVyaWZ5IHRoYXQgZXZlcnl0aGluZyBoZXJlIGlzIG9rKi9cbiAgbGV0IGVycm9yX21lc3NhZ2U9bnVsbDtcbiAgbGV0IGpvYl9zdHJpbmcgPSAnJztcbiAgLy9lcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCwgW3BzaXByZWRfY2hlY2tlZCwgZGlzb3ByZWRfY2hlY2tlZCwgbWVtc2F0c3ZtX2NoZWNrZWRdKTtcblxuICBlcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtc2F0c3ZtX2NoZWNrZWQsIHBnZW50aHJlYWRlcl9jaGVja2VkLCBtZW1wYWNrX2NoZWNrZWQsIGdlbnRocmVhZGVyX2NoZWNrZWQsIGRvbXByZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZG9tdGhyZWFkZXJfY2hlY2tlZCwgYmlvc2VyZl9jaGVja2VkLCBkb21zZXJmX2NoZWNrZWQsIGZmcHJlZF9jaGVja2VkLCBtZXRhcHNpY292X2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0c2l0ZV9jaGVja2VkLCBoc3ByZWRfY2hlY2tlZCwgbWVtZW1iZWRfY2hlY2tlZCwgZ2VudGRiX2NoZWNrZWRdKTtcbiAgaWYoZXJyb3JfbWVzc2FnZS5sZW5ndGggPiAwKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ2Zvcm1fZXJyb3InLCBlcnJvcl9tZXNzYWdlKTtcbiAgICBhbGVydChcIkZPUk0gRVJST1I6XCIrZXJyb3JfbWVzc2FnZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9pbml0aWFsaXNlIHRoZSBwYWdlXG4gICAgbGV0IHJlc3BvbnNlID0gdHJ1ZTtcbiAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTtcbiAgICAvL1Bvc3QgdGhlIGpvYnMgYW5kIGludGlhbGlzZSB0aGUgYW5ub3RhdGlvbnMgZm9yIGVhY2ggam9iXG4gICAgLy9XZSBhbHNvIGRvbid0IHJlZHVuZGFudGx5IHNlbmQgZXh0cmEgcHNpcHJlZCBldGMuLiBqb2JzXG4gICAgLy9ieXQgZG9pbmcgdGhlc2UgdGVzdCBpbiBhIHNwZWNpZmljIG9yZGVyXG4gICAgaWYocGdlbnRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwicGdlbnRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICAgIHBzaXByZWRfY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZihkaXNvcHJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImRpc29wcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF9idXR0b24nLCB0cnVlKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgcHNpcHJlZF9jaGVja2VkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmKHBzaXByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJwc2lwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihtZW1zYXRzdm1fY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJtZW1zYXRzdm0sXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYobWVtcGFja19jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1lbXBhY2ssXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImdlbnRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoZG9tcHJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImRvbXByZWQsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2RvbXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKHBkb210aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBkb210aHJlYWRlcixcIik7XG4gICAgICByYWN0aXZlLnNldCgncGRvbXRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihiaW9zZXJmX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiYmlvc2VyZixcIik7XG4gICAgICByYWN0aXZlLnNldCgnYmlvc2VyZl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoZG9tc2VyZl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImRvbXNlcmYsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2RvbXNlcmZfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGZmcHJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImZmcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgnZmZwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihtZXRhcHNpY292X2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWV0YXBzaWNvdixcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWV0YXBzaWNvdl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYobWV0c2l0ZV9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1ldHNpdGUsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ21ldHNpdGVfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGhzcHJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImhzcHJlZCxcIik7XG4gICAgICByYWN0aXZlLnNldCgnaHNwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihtZW1lbWJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1lbWVtYmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoZ2VudGRiX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZ2VudGRiLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50ZGJfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuc2xpY2UoMCwgLTEpO1xuICAgIHJlc3BvbnNlID0gc2VuZF9qb2IocmFjdGl2ZSwgam9iX3N0cmluZywgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsKTtcbiAgICAvL3NldCB2aXNpYmlsaXR5IGFuZCByZW5kZXIgcGFuZWwgb25jZVxuICAgIGlmIChwc2lwcmVkX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwc2lwcmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICAgIC8vIHBhcnNlIHNlcXVlbmNlIGFuZCBtYWtlIHNlcSBwbG90XG4gICAgfVxuICAgIGVsc2UgaWYoZGlzb3ByZWRfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ2Rpc29wcmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9XG4gICAgZWxzZSBpZihtZW1zYXRzdm1fY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ21lbXNhdHN2bV9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYocGdlbnRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwZ2VudGhyZWFkZXJfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1cbiAgICBlbHNlIGlmKG1lbXBhY2tfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ21lbXBhY2tfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1lbHNlIGlmKGdlbnRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdnZW50aHJlYWRlcl9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfWVsc2UgaWYoZG9tcHJlZF9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAnZG9tcHJlZF9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfWVsc2UgaWYocGRvbXRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdwZG9tdGhyZWFkZXJfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1lbHNlIGlmKGJpb3NlcmZfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ2Jpb3NlcmZfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1lbHNlIGlmKGRvbXNlcmZfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ2RvbXNlcmZfYWN0aXZlJyApO1xuICAgICAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuICAgIH1lbHNlIGlmKGZmcHJlZF9jaGVja2VkID09PSB0cnVlICYmIHJlc3BvbnNlKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KCAncmVzdWx0c192aXNpYmxlJywgMiApO1xuICAgICAgcmFjdGl2ZS5maXJlKCAnZmZwcmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9ZWxzZSBpZihtZXRhcHNpY292X2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdtZXRhcHNpY292X2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9ZWxzZSBpZihtZXRzaXRlX2NoZWNrZWQgPT09IHRydWUgJiYgcmVzcG9uc2UpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICByYWN0aXZlLmZpcmUoICdtZXRzaXRlX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9ZWxzZSBpZihoc3ByZWRfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ2hzcHJlZF9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfWVsc2UgaWYobWVtZW1iZWRfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ21lbWVtYmVkX2FjdGl2ZScgKTtcbiAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICB9ZWxzZSBpZihnZW50ZGJfY2hlY2tlZCA9PT0gdHJ1ZSAmJiByZXNwb25zZSlcbiAgICB7XG4gICAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgICAgIHJhY3RpdmUuZmlyZSggJ2dlbnRkYl9hY3RpdmUnICk7XG4gICAgICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2Zvcm0oc2VxLCBqb2JfbmFtZSwgZW1haWwsIGNoZWNrZWRfYXJyYXkpXG57XG4gIGxldCBlcnJvcl9tZXNzYWdlID0gXCJcIjtcbiAgaWYoISAvXltcXHgwMC1cXHg3Rl0rJC8udGVzdChqb2JfbmFtZSkpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiUGxlYXNlIHJlc3RyaWN0IEpvYiBOYW1lcyB0byB2YWxpZCBsZXR0ZXJzIG51bWJlcnMgYW5kIGJhc2ljIHB1bmN0dWF0aW9uPGJyIC8+XCI7XG4gIH1cblxuICAvKiBsZW5ndGggY2hlY2tzICovXG4gIGlmKHNlcS5sZW5ndGggPiAxNTAwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIGxvbmcgdG8gcHJvY2VzczxiciAvPlwiO1xuICB9XG4gIGlmKHNlcS5sZW5ndGggPCAzMClcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGlzIHRvbyBzaG9ydCB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cblxuICAvKiBudWNsZW90aWRlIGNoZWNrcyAqL1xuICBsZXQgbnVjbGVvdGlkZV9jb3VudCA9IChzZXEubWF0Y2goL0F8VHxDfEd8VXxOfGF8dHxjfGd8dXxuL2cpfHxbXSkubGVuZ3RoO1xuICBpZigobnVjbGVvdGlkZV9jb3VudC9zZXEubGVuZ3RoKSA+IDAuOTUpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBhcHBlYXJzIHRvIGJlIG51Y2xlb3RpZGUgc2VxdWVuY2UuIFRoaXMgc2VydmljZSByZXF1aXJlcyBwcm90ZWluIHNlcXVlbmNlIGFzIGlucHV0PGJyIC8+XCI7XG4gIH1cbiAgaWYoL1teQUNERUZHSElLTE1OUFFSU1RWV1lYXy1dKy9pLnRlc3Qoc2VxKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczxiciAvPlwiO1xuICB9XG5cbiAgaWYoaXNJbkFycmF5KHRydWUsIGNoZWNrZWRfYXJyYXkpID09PSBmYWxzZSkge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuYWx5c2lzIHByb2dyYW1cIjtcbiAgfVxuICByZXR1cm4oZXJyb3JfbWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvZm9ybXMvZm9ybXNfaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9