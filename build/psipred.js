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
/* harmony export (immutable) */ __webpack_exports__["d"] = show_panel;
/* harmony export (immutable) */ __webpack_exports__["e"] = clear_settings;
/* harmony export (immutable) */ __webpack_exports__["a"] = prepare_downloads_html;
/* harmony export (immutable) */ __webpack_exports__["b"] = handle_results;
/* harmony export (immutable) */ __webpack_exports__["c"] = set_downloads_panel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(3);


function show_panel(value, ractive) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', value);
}

//before a resubmission is sent all variables are reset to the page defaults
function clear_settings(ractive, gear_string, job_list) {
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  job_list.forEach(function (job_name) {
    ractive.set(job_name + '_waiting_message', '<h2>Please wait for your ' + job_name.toUpperCase() + ' job to process</h2>');
    ractive.set(job_name + '_waiting_icon', gear_string);
    ractive.set(job_name + '_time', 'Loading Data');
  });
  ractive.set('psipred_horiz', null);
  ractive.set('diso_precision');
  ractive.set('memsatsvm_schematic', '');
  ractive.set('memsatsvm_cartoon', '');
  ractive.set('pgen_table', '');
  ractive.set('pgen_set', {});
  ractive.set('gen_table', '');
  ractive.set('gen_set', {});

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
/* 2 */
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_common_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__ = __webpack_require__(1);
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
let job_list = ["psipred", "disopred", "memsatsvm", "pgenthreader", "mempack", "genthreader", "dompred", "pdomthreader", "bioserf", "domserf", "ffpred", "metapsicov", "metsite", "hspred", "memembed", "gentdb"];
let job_names = {
  'psipred': 'PSIPRED V3.3',
  'disopred': 'DIOSPRED 3',
  'memsatsvm': 'MEMSAT-SVM',
  'pgenthreader': 'pGenTHREADER',
  'mempack': 'MEMPACK',
  'genthreader': 'GenTHREADER',
  'dompred': 'DomPred',
  'pdomthreader': 'PSIPRED',
  'bioserf': 'BiosSerf v2.0',
  'domserf': 'DomSerf v2.1',
  'ffpred': 'FFPred 3',
  'metapsicov': 'MetaPSICOV',
  'metsite': 'MetSite',
  'hspred': 'HSPred',
  'memembed': 'MEMEMBED',
  'gentdb': 'Generate TDB'
};

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
    genthreader_checked: false,
    genthreader_button: false,
    dompred_checked: true,
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

// These react to the headers being clicked to toggle the panel
//
ractive.on('sequence_active', function (event) {
  ractive.set('structure_form_visible', null);
  ractive.set('structure_form_visible', 0);
  job_list.forEach(function (job_name) {
    let setting = false;
    if (job_name === 'psipred') {
      setting = true;
    }
    ractive.set(job_name + '_checked', setting);
  });
  ractive.set('sequence_form_visible', null);
  ractive.set('sequence_form_visible', 1);
});

ractive.on('structure_active', function (event) {
  ractive.set('sequence_form_visible', null);
  ractive.set('sequence_form_visible', 0);
  job_list.forEach(function (job_name) {
    ractive.set(job_name + '_checked', false);
  });
  ractive.set('structure_form_visible', null);
  ractive.set('structure_form_visible', 1);
});

ractive.on('downloads_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(11, ractive);
});
ractive.on('psipred_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(1, ractive);
  if (ractive.get('psipred_horiz')) {
    biod3.psipred(ractive.get('psipred_horiz'), 'psipredChart', { parent: 'div.psipred_cartoon', margin_scaler: 2 });
  }
});
ractive.on('disopred_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(4, ractive);
  if (ractive.get('diso_precision')) {
    biod3.genericxyLineChart(ractive.get('diso_precision'), 'pos', ['precision'], ['Black'], 'DisoNNChart', { parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
  }
});
ractive.on('memsatsvm_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(6, ractive);
});
ractive.on('pgenthreader_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(2, ractive);
});
ractive.on('mempack_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(5, ractive);
});
ractive.on('genthreader_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(7, ractive);
});
ractive.on('dompred_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(8, ractive);
});
ractive.on('pdomthreader_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(9, ractive);
});
ractive.on('bioserf_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(10, ractive);
});
ractive.on('domserf_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(12, ractive);
});
ractive.on('ffpred_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(13, ractive);
});
ractive.on('metapsicov_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(18, ractive);
});
ractive.on('metsite_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(14, ractive);
});
ractive.on('hspred_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(15, ractive);
});
ractive.on('memembed_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(16, ractive);
});
ractive.on('gentdb_active', function (event) {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(17, ractive);
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
  let check_states = {};
  job_list.forEach(function (job_name) {
    check_states[job_name + '_job'] = ractive.get(job_name + '_job');
    check_states[job_name + '_checked'] = ractive.get(job_name + '_checked');
  });
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, seq, name, email, submit_url, times_url, check_states, job_list);
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
  let check_states = {};
  job_list.forEach(function (job_name) {
    check_states[job_name + '_job'] = ractive.get(job_name + '_job');
    check_states[job_name + '_checked'] = ractive.get(job_name + '_checked');
  });
  //clear what we have previously written
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["e" /* clear_settings */])(ractive, gear_string, job_list);
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, subsequence, name, email, submit_url, times_url, check_states, job_list);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_common_index_js__ = __webpack_require__(2);




//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, check_states, job_list) {
  /*verify that everything here is ok*/
  let error_message = null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  error_message = verify_form(seq, name, email, [check_states.psipred_checked, check_states.disopred_checked, check_states.memsatsvm_checked, check_states.pgenthreader_checked, check_states.mempack_checked, check_states.genthreader_checked, check_states.dompred_checked, check_states.pdomthreader_checked, check_states.bioserf_checked, check_states.domserf_checked, check_states.ffpred_checked, check_states.metapsicov_checked, check_states.check_states, check_states.metsite_checked, check_states.hspred_checked, check_states.memembed_checked, check_states.gentdb_checked]);
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
    if (check_states.pgenthreader_checked === true) {
      job_string = job_string.concat("pgenthreader,");
      ractive.set('pgenthreader_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if (check_states.disopred_checked === true) {
      job_string = job_string.concat("disopred,");
      ractive.set('disopred_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if (check_states.psipred_checked === true) {
      job_string = job_string.concat("psipred,");
      ractive.set('psipred_button', true);
    }
    if (check_states.memsatsvm_checked === true) {
      job_string = job_string.concat("memsatsvm,");
      ractive.set('memsatsvm_button', true);
    }
    if (check_states.mempack_checked === true) {
      job_string = job_string.concat("mempack,");
      ractive.set('mempack_button', true);
      ractive.set('memsatsvm_button', true);
    }
    if (check_states.genthreader_checked === true) {
      job_string = job_string.concat("genthreader,");
      ractive.set('genthreader_button', true);
    }
    if (check_states.dompred_checked === true) {
      job_string = job_string.concat("dompred,");
      ractive.set('dompred_button', true);
    }
    if (check_states.pdomthreader_checked === true) {
      job_string = job_string.concat("pdomthreader,");
      ractive.set('pdomthreader_button', true);
    }
    if (check_states.bioserf_checked === true) {
      job_string = job_string.concat("bioserf,");
      ractive.set('bioserf_button', true);
    }
    if (check_states.domserf_checked === true) {
      job_string = job_string.concat("domserf,");
      ractive.set('domserf_button', true);
    }
    if (check_states.ffpred_checked === true) {
      job_string = job_string.concat("ffpred,");
      ractive.set('ffpred_button', true);
    }
    if (check_states.metapsicov_checked === true) {
      job_string = job_string.concat("metapsicov,");
      ractive.set('metapsicov_button', true);
    }
    if (check_states.metsite_checked === true) {
      job_string = job_string.concat("metsite,");
      ractive.set('metsite_button', true);
    }
    if (check_states.hspred_checked === true) {
      job_string = job_string.concat("hspred,");
      ractive.set('hspred_button', true);
    }
    if (check_states.memembed_checked === true) {
      job_string = job_string.concat("memembed,");
      ractive.set('memembed_button', true);
    }
    if (check_states.gentdb_checked === true) {
      job_string = job_string.concat("gentdb,");
      ractive.set('gentdb_button', true);
    }

    job_string = job_string.slice(0, -1);
    response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["d" /* send_job */])(ractive, job_string, seq, name, email, submit_url, times_url);
    //set visibility and render panel once
    for (let i = 0; i < job_list.length; i++) {
      let job_name = job_list[i];
      if (check_states[job_name + '_checked'] === true && response) {
        ractive.set('results_visible', 2);
        ractive.fire(job_name + '_active');
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_common_index_js__["b" /* draw_empty_annotation_panel */])(ractive);
        break;
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjhkNzk3NmY2MmNjMWQ2ZDE5MzgiLCJ3ZWJwYWNrOi8vLy4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tbW9uL2NvbW1vbl9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Zvcm1zL2Zvcm1zX2luZGV4LmpzIl0sIm5hbWVzIjpbImdldF9tZW1zYXRfcmFuZ2VzIiwicmVnZXgiLCJkYXRhIiwibWF0Y2giLCJleGVjIiwiaW5jbHVkZXMiLCJyZWdpb25zIiwic3BsaXQiLCJmb3JFYWNoIiwicmVnaW9uIiwiaSIsInBhcnNlSW50IiwiY29uc29sZSIsImxvZyIsInNlZyIsInBhcnNlX3NzMiIsInJhY3RpdmUiLCJmaWxlIiwiYW5ub3RhdGlvbnMiLCJnZXQiLCJsaW5lcyIsInNoaWZ0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImxpbmUiLCJlbnRyaWVzIiwic3MiLCJzZXQiLCJiaW9kMyIsImFubm90YXRpb25HcmlkIiwicGFyZW50IiwibWFyZ2luX3NjYWxlciIsImRlYnVnIiwiY29udGFpbmVyX3dpZHRoIiwid2lkdGgiLCJoZWlnaHQiLCJjb250YWluZXJfaGVpZ2h0IiwiYWxlcnQiLCJwYXJzZV9wYmRhdCIsImRpc29wcmVkIiwicGFyc2VfY29tYiIsInByZWNpc2lvbiIsInBvcyIsImdlbmVyaWN4eUxpbmVDaGFydCIsImNoYXJ0VHlwZSIsInlfY3V0b2ZmIiwicGFyc2VfbWVtc2F0ZGF0YSIsInNlcSIsInRvcG9fcmVnaW9ucyIsInNpZ25hbF9yZWdpb25zIiwicmVlbnRyYW50X3JlZ2lvbnMiLCJ0ZXJtaW5hbCIsImNvaWxfdHlwZSIsInRtcF9hbm5vIiwiQXJyYXkiLCJwcmV2X2VuZCIsImZpbGwiLCJhbm5vIiwibWVtc2F0IiwicGFyc2VfcHJlc3VsdCIsInR5cGUiLCJhbm5fbGlzdCIsIk9iamVjdCIsImtleXMiLCJwc2V1ZG9fdGFibGUiLCJ0b0xvd2VyQ2FzZSIsInBkYiIsInN1YnN0cmluZyIsImFsbiIsImFubiIsInNob3dfcGFuZWwiLCJ2YWx1ZSIsImNsZWFyX3NldHRpbmdzIiwiZ2Vhcl9zdHJpbmciLCJqb2JfbGlzdCIsImpvYl9uYW1lIiwidG9VcHBlckNhc2UiLCJjbGVhclNlbGVjdGlvbiIsInppcCIsIkpTWmlwIiwicHJlcGFyZV9kb3dubG9hZHNfaHRtbCIsImRvd25sb2Fkc19pbmZvIiwicHNpcHJlZCIsImhlYWRlciIsIm1lbXNhdHN2bSIsInBnZW50aHJlYWRlciIsIm1lbXBhY2siLCJnZW50aHJlYWRlciIsImRvbXByZWQiLCJwZG9tdGhyZWFkZXIiLCJiaW9zZXJmIiwiZG9tc2VyZiIsImZmcHJlZCIsIm1ldGFwc2ljb3YiLCJtZXRzaXRlIiwiaHNwcmVkIiwibWVtZW1iZWQiLCJnZW50ZGIiLCJoYW5kbGVfcmVzdWx0cyIsImZpbGVfdXJsIiwiaG9yaXpfcmVnZXgiLCJzczJfcmVnZXgiLCJtZW1zYXRfY2FydG9vbl9yZWdleCIsIm1lbXNhdF9zY2hlbWF0aWNfcmVnZXgiLCJtZW1zYXRfZGF0YV9yZWdleCIsIm1lbXBhY2tfY2FydG9vbl9yZWdleCIsIm1lbXBhY2tfZ3JhcGhfb3V0IiwibWVtcGFja19jb250YWN0X3JlcyIsIm1lbXBhY2tfbGlwaWRfcmVzIiwibWVtcGFja19yZXN1bHRfZm91bmQiLCJpbWFnZV9yZWdleCIsInJlc3VsdHMiLCJyZXN1bHRfZGljdCIsIm5hbWUiLCJhbm5fc2V0IiwidG1wIiwiZGF0YV9wYXRoIiwicGF0aCIsInN1YnN0ciIsImxhc3RJbmRleE9mIiwiaWQiLCJwcm9jZXNzX2ZpbGUiLCJob3JpeiIsInNzMl9tYXRjaCIsInNzMiIsInBiZGF0IiwiY29tYiIsInNjaGVtZV9tYXRjaCIsInNjaGVtYXRpYyIsImNhcnRvb25fbWF0Y2giLCJjYXJ0b29uIiwibWVtc2F0X21hdGNoIiwiZ3JhcGhfbWF0Y2giLCJncmFwaF9vdXQiLCJjb250YWN0X21hdGNoIiwiY29udGFjdCIsImxpcGlkX21hdGNoIiwibGlwaWRfb3V0IiwidGFibGUiLCJhbGlnbiIsInNldF9kb3dubG9hZHNfcGFuZWwiLCJkb3dubG9hZHNfc3RyaW5nIiwiY29uY2F0IiwiaXNJbkFycmF5IiwiYXJyYXkiLCJpbmRleE9mIiwiZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIiwicmVzaWR1ZXMiLCJyZXMiLCJwdXNoIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJwYXJ0cyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJtIiwia2V5IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbXBvcnRhbnQiLCJzdHlsZSIsImdldEVtUGl4ZWxzIiwiZWxlbWVudCIsImV4dHJhQm9keSIsImNyZWF0ZUVsZW1lbnQiLCJjc3NUZXh0IiwiaW5zZXJ0QmVmb3JlIiwiYm9keSIsInRlc3RFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwic2VuZF9yZXF1ZXN0IiwidXJsIiwic2VuZF9kYXRhIiwicmVzcG9uc2UiLCIkIiwiYWpheCIsImNhY2hlIiwiY29udGVudFR5cGUiLCJwcm9jZXNzRGF0YSIsImFzeW5jIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwiZXJyb3IiLCJyZXNwb25zZVRleHQiLCJyZXNwb25zZUpTT04iLCJzZW5kX2pvYiIsImVtYWlsIiwic3VibWl0X3VybCIsInRpbWVzX3VybCIsInVwcGVyX25hbWUiLCJCbG9iIiwiZSIsImZkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZV9kYXRhIiwidGltZXMiLCJrIiwiZmlyZSIsImdldF9wcmV2aW91c19kYXRhIiwidXVpZCIsInN1Ym1pc3Npb25fcmVzcG9uc2UiLCJnZXRfdGV4dCIsInN1Ym1pc3Npb25zIiwiaW5wdXRfZmlsZSIsImpvYnMiLCJzdWJtaXNzaW9uIiwic2xpY2UiLCJzdWJtaXNzaW9uX25hbWUiLCJ1cmxfc3R1YiIsImN0bCIsInBhdGhfYml0cyIsImZvbGRlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGlwYm9hcmQiLCJDbGlwYm9hcmQiLCJvbiIsImVuZHBvaW50c191cmwiLCJnZWFyc19zdmciLCJtYWluX3VybCIsImFwcF9wYXRoIiwiam9iX25hbWVzIiwiaG9zdG5hbWUiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsInNlcXVlbmNlX2Zvcm1fdmlzaWJsZSIsInN0cnVjdHVyZV9mb3JtX3Zpc2libGUiLCJyZXN1bHRzX3Zpc2libGUiLCJyZXN1bHRzX3BhbmVsX3Zpc2libGUiLCJzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlIiwibW9kZWxsZXJfa2V5IiwicHNpcHJlZF9jaGVja2VkIiwicHNpcHJlZF9idXR0b24iLCJkaXNvcHJlZF9jaGVja2VkIiwiZGlzb3ByZWRfYnV0dG9uIiwibWVtc2F0c3ZtX2NoZWNrZWQiLCJtZW1zYXRzdm1fYnV0dG9uIiwicGdlbnRocmVhZGVyX2NoZWNrZWQiLCJwZ2VudGhyZWFkZXJfYnV0dG9uIiwibWVtcGFja19jaGVja2VkIiwibWVtcGFja19idXR0b24iLCJnZW50aHJlYWRlcl9jaGVja2VkIiwiZ2VudGhyZWFkZXJfYnV0dG9uIiwiZG9tcHJlZF9jaGVja2VkIiwiZG9tcHJlZF9idXR0b24iLCJwZG9tdGhyZWFkZXJfY2hlY2tlZCIsInBkb210aHJlYWRlcl9idXR0b24iLCJiaW9zZXJmX2NoZWNrZWQiLCJiaW9zZXJmX2J1dHRvbiIsImRvbXNlcmZfY2hlY2tlZCIsImRvbXNlcmZfYnV0dG9uIiwiZmZwcmVkX2NoZWNrZWQiLCJmZnByZWRfYnV0dG9uIiwibWV0c2l0ZV9jaGVja2VkIiwibWV0c2l0ZV9idXR0b24iLCJoc3ByZWRfY2hlY2tlZCIsImhzcHJlZF9idXR0b24iLCJtZW1lbWJlZF9jaGVja2VkIiwibWVtZW1iZWRfYnV0dG9uIiwiZ2VudGRiX2NoZWNrZWQiLCJnZW50ZGJfYnV0dG9uIiwibWV0YXBzaWNvdl9jaGVja2VkIiwibWV0YXBzaWNvdl9idXR0b24iLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfam9iIiwiZGlzb3ByZWRfam9iIiwibWVtc2F0c3ZtX2pvYiIsInBnZW50aHJlYWRlcl9qb2IiLCJtZW1wYWNrX2pvYiIsImdlbnRocmVhZGVyX2pvYiIsImRvbXByZWRfam9iIiwicGRvbXRocmVhZGVyX2pvYiIsImJpb3NlcmZfam9iIiwiZG9tc2VyZl9qb2IiLCJmZnByZWRfam9iIiwibWV0c2l0ZV9qb2IiLCJoc3ByZWRfam9iIiwibWVtZW1iZWRfam9iIiwiZ2VudGRiX2pvYiIsIm1ldGFwc2ljb3Zfam9iIiwicHNpcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJwc2lwcmVkX3dhaXRpbmdfaWNvbiIsInBzaXByZWRfdGltZSIsInBzaXByZWRfaG9yaXoiLCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJkaXNvcHJlZF93YWl0aW5nX2ljb24iLCJkaXNvcHJlZF90aW1lIiwiZGlzb19wcmVjaXNpb24iLCJtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlIiwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvbiIsIm1lbXNhdHN2bV90aW1lIiwibWVtc2F0c3ZtX3NjaGVtYXRpYyIsIm1lbXNhdHN2bV9jYXJ0b29uIiwicGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZSIsInBnZW50aHJlYWRlcl93YWl0aW5nX2ljb24iLCJwZ2VudGhyZWFkZXJfdGltZSIsInBnZW5fdGFibGUiLCJwZ2VuX2Fubl9zZXQiLCJtZW1wYWNrX3dhaXRpbmdfbWVzc2FnZSIsIm1lbXBhY2tfd2FpdGluZ19pY29uIiwibWVtcGFja190aW1lIiwibWVtc2F0cGFja19zY2hlbWF0aWMiLCJtZW1zYXRwYWNrX2NhcnRvb24iLCJnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2UiLCJnZW50aHJlYWRlcl93YWl0aW5nX2ljb24iLCJnZW50aHJlYWRlcl90aW1lIiwiZ2VuX3RhYmxlIiwiZ2VuX2Fubl9zZXQiLCJkb21wcmVkX3dhaXRpbmdfbWVzc2FnZSIsImRvbXByZWRfd2FpdGluZ19pY29uIiwiZG9tcHJlZF90aW1lIiwiZG9tcHJlZF9kYXRhIiwicGRvbXRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZSIsInBkb210aHJlYWRlcl93YWl0aW5nX2ljb24iLCJwZG9tdGhyZWFkZXJfdGltZSIsInBkb210aHJlYWRlcl9kYXRhIiwiYmlvc2VyZl93YWl0aW5nX21lc3NhZ2UiLCJiaW9zZXJmX3dhaXRpbmdfaWNvbiIsImJpb3NlcmZfdGltZSIsImJpb3NlcmZfZGF0YSIsImRvbXNlcmZfd2FpdGluZ19tZXNzYWdlIiwiZG9tc2VyZl93YWl0aW5nX2ljb24iLCJkb21zZXJmX3RpbWUiLCJkb21zZXJmX2RhdGEiLCJmZnByZWRfd2FpdGluZ19tZXNzYWdlIiwiZmZwcmVkX3dhaXRpbmdfaWNvbiIsImZmcHJlZF90aW1lIiwiZmZwcmVkX2RhdGEiLCJtZXRhcHNpY292X3dhaXRpbmdfbWVzc2FnZSIsIm1ldGFwc2ljb3Zfd2FpdGluZ19pY29uIiwibWV0YXBzaWNvdl90aW1lIiwibWV0YXBzaWNvdl9kYXRhIiwibWV0c2l0ZV93YWl0aW5nX21lc3NhZ2UiLCJtZXRzaXRlX3dhaXRpbmdfaWNvbiIsIm1ldHNpdGVfdGltZSIsIm1ldHNpdGVfZGF0YSIsImhzcHJlZF93YWl0aW5nX21lc3NhZ2UiLCJoc3ByZWRfd2FpdGluZ19pY29uIiwiaHNwcmVkX3RpbWUiLCJoc3ByZWRfZGF0YSIsIm1lbWVtYmVkX3dhaXRpbmdfbWVzc2FnZSIsIm1lbWVtYmVkX3dhaXRpbmdfaWNvbiIsIm1lbWVtYmVkX3RpbWUiLCJtZW1lbWJlZF9kYXRhIiwiZ2VudGRiX3dhaXRpbmdfbWVzc2FnZSIsImdlbnRkYl93YWl0aW5nX2ljb24iLCJnZW50ZGJfdGltZSIsImdlbnRkYl9kYXRhIiwic2VxdWVuY2UiLCJzZXF1ZW5jZV9sZW5ndGgiLCJzdWJzZXF1ZW5jZV9zdGFydCIsInN1YnNlcXVlbmNlX3N0b3AiLCJiYXRjaF91dWlkIiwidXVpZF9yZWdleCIsInV1aWRfbWF0Y2giLCJzZXFfb2JzZXJ2ZXIiLCJvYnNlcnZlIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsImluaXQiLCJkZWZlciIsInNlcV9sZW5ndGgiLCJzZXFfc3RhcnQiLCJzZXFfc3RvcCIsImpvYl90eXBlIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJiYXRjaCIsInN0YXRlIiwiY2xlYXJJbnRlcnZhbCIsInN1Ym1pc3Npb25fbWVzc2FnZSIsImxhc3RfbWVzc2FnZSIsImNvbnRleHQiLCJnZW5lcmF0ZUFzeW5jIiwidGhlbiIsImJsb2IiLCJzYXZlQXMiLCJldmVudCIsInNldHRpbmciLCJjaGVja19zdGF0ZXMiLCJ2ZXJpZnlfYW5kX3NlbmRfZm9ybSIsIm9yaWdpbmFsIiwicHJldmVudERlZmF1bHQiLCJzdGFydCIsInN0b3AiLCJzdWJzZXF1ZW5jZSIsImNhbmNlbCIsInByZXZpb3VzX2RhdGEiLCJsb2FkTmV3QWxpZ25tZW50IiwiYWxuVVJJIiwiYW5uVVJJIiwidGl0bGUiLCJvcGVuIiwiYnVpbGRNb2RlbCIsIm1vZF9rZXkiLCJlcnJvcl9tZXNzYWdlIiwiam9iX3N0cmluZyIsInZlcmlmeV9mb3JtIiwiY2hlY2tlZF9hcnJheSIsInRlc3QiLCJudWNsZW90aWRlX2NvdW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FB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QUFoQixHQUF1QkYsT0FBT0MsUUFBUCxDQUFnQkMsSUFBdkM7QUFBNkM7QUFDN0Q7QUFDRjs7QUFFRDtBQUNPLFNBQVMwUCxXQUFULENBQXFCdFcsR0FBckIsRUFBMEI0QixRQUExQixFQUFvQ21ILEtBQXBDLEVBQTJDd04sYUFBM0MsRUFDUDtBQUNFLE1BQUlILGdCQUFnQixFQUFwQjtBQUNBLE1BQUcsQ0FBRSxpQkFBaUJJLElBQWpCLENBQXNCNVUsUUFBdEIsQ0FBTCxFQUNBO0FBQ0V3VSxvQkFBZ0JBLGdCQUFnQixnRkFBaEM7QUFDRDs7QUFFRDtBQUNBLE1BQUdwVyxJQUFJeEIsTUFBSixHQUFhLElBQWhCLEVBQ0E7QUFDRTRYLG9CQUFnQkEsZ0JBQWdCLDRDQUFoQztBQUNEO0FBQ0QsTUFBR3BXLElBQUl4QixNQUFKLEdBQWEsRUFBaEIsRUFDQTtBQUNFNFgsb0JBQWdCQSxnQkFBZ0IsNkNBQWhDO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJSyxtQkFBbUIsQ0FBQ3pXLElBQUk3QyxLQUFKLENBQVUsMEJBQVYsS0FBdUMsRUFBeEMsRUFBNENxQixNQUFuRTtBQUNBLE1BQUlpWSxtQkFBaUJ6VyxJQUFJeEIsTUFBdEIsR0FBZ0MsSUFBbkMsRUFDQTtBQUNFNFgsb0JBQWdCQSxnQkFBZ0Isd0dBQWhDO0FBQ0Q7QUFDRCxNQUFHLCtCQUErQkksSUFBL0IsQ0FBb0N4VyxHQUFwQyxDQUFILEVBQ0E7QUFDRW9XLG9CQUFnQkEsZ0JBQWdCLGlEQUFoQztBQUNEOztBQUVELE1BQUcsaUdBQUFwUSxDQUFVLElBQVYsRUFBZ0J1USxhQUFoQixNQUFtQyxLQUF0QyxFQUE2QztBQUMzQ0gsb0JBQWdCQSxnQkFBZ0IsK0NBQWhDO0FBQ0Q7QUFDRCxTQUFPQSxhQUFQO0FBQ0QsQyIsImZpbGUiOiJwc2lwcmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYXNzZXRzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY4ZDc5NzZmNjJjYzFkNmQxOTM4IiwiXG4vLyBmb3IgYSBnaXZlbiBtZW1zYXQgZGF0YSBmaWxlcyBleHRyYWN0IGNvb3JkaW5hdGUgcmFuZ2VzIGdpdmVuIHNvbWUgcmVnZXhcbmV4cG9ydCBmdW5jdGlvbiBnZXRfbWVtc2F0X3JhbmdlcyhyZWdleCwgZGF0YSlcbntcbiAgICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKGRhdGEpO1xuICAgIGlmKG1hdGNoWzFdLmluY2x1ZGVzKCcsJykpXG4gICAge1xuICAgICAgbGV0IHJlZ2lvbnMgPSBtYXRjaFsxXS5zcGxpdCgnLCcpO1xuICAgICAgcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbiwgaSl7XG4gICAgICAgIHJlZ2lvbnNbaV0gPSByZWdpb24uc3BsaXQoJy0nKTtcbiAgICAgICAgcmVnaW9uc1tpXVswXSA9IHBhcnNlSW50KHJlZ2lvbnNbaV1bMF0pO1xuICAgICAgICByZWdpb25zW2ldWzFdID0gcGFyc2VJbnQocmVnaW9uc1tpXVsxXSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybihyZWdpb25zKTtcbiAgICB9XG4gICAgZWxzZSBpZihtYXRjaFsxXS5pbmNsdWRlcygnLScpKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2cobWF0Y2hbMV0pO1xuICAgICAgICBsZXQgc2VnID0gbWF0Y2hbMV0uc3BsaXQoJy0nKTtcbiAgICAgICAgbGV0IHJlZ2lvbnMgPSBbW10sIF07XG4gICAgICAgIHJlZ2lvbnNbMF1bMF0gPSBwYXJzZUludChzZWdbMF0pO1xuICAgICAgICByZWdpb25zWzBdWzFdID0gcGFyc2VJbnQoc2VnWzFdKTtcbiAgICAgICAgcmV0dXJuKHJlZ2lvbnMpO1xuICAgIH1cbiAgICByZXR1cm4obWF0Y2hbMV0pO1xufVxuXG4vLyB0YWtlIGFuZCBzczIgKGZpbGUpIGFuZCBwYXJzZSB0aGUgZGV0YWlscyBhbmQgd3JpdGUgdGhlIG5ldyBhbm5vdGF0aW9uIGdyaWRcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9zczIocmFjdGl2ZSwgZmlsZSlcbntcbiAgICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICBsaW5lcy5zaGlmdCgpO1xuICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmKGFubm90YXRpb25zLmxlbmd0aCA9PSBsaW5lcy5sZW5ndGgpXG4gICAge1xuICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGFubm90YXRpb25zW2ldLnNzID0gZW50cmllc1szXTtcbiAgICAgIH0pO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICAgICAgYmlvZDMuYW5ub3RhdGlvbkdyaWQoYW5ub3RhdGlvbnMsIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGFsZXJ0KFwiU1MyIGFubm90YXRpb24gbGVuZ3RoIGRvZXMgbm90IG1hdGNoIHF1ZXJ5IHNlcXVlbmNlXCIpO1xuICAgIH1cbiAgICByZXR1cm4oYW5ub3RhdGlvbnMpO1xufVxuXG4vL3Rha2UgdGhlIGRpc29wcmVkIHBiZGF0IGZpbGUsIHBhcnNlIGl0IGFuZCBhZGQgdGhlIGFubm90YXRpb25zIHRvIHRoZSBhbm5vdGF0aW9uIGdyaWRcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9wYmRhdChyYWN0aXZlLCBmaWxlKVxue1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgIGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7XG4gICAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYoYW5ub3RhdGlvbnMubGVuZ3RoID09IGxpbmVzLmxlbmd0aClcbiAgICB7XG4gICAgICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgICAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgaWYoZW50cmllc1szXSA9PT0gJy0nKXthbm5vdGF0aW9uc1tpXS5kaXNvcHJlZCA9ICdEJzt9XG4gICAgICAgIGlmKGVudHJpZXNbM10gPT09ICdeJyl7YW5ub3RhdGlvbnNbaV0uZGlzb3ByZWQgPSAnUEInO31cbiAgICAgIH0pO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICAgICAgYmlvZDMuYW5ub3RhdGlvbkdyaWQoYW5ub3RhdGlvbnMsIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbiAgICB9XG59XG5cbi8vcGFyc2UgdGhlIGRpc29wcmVkIGNvbWIgZmlsZSBhbmQgYWRkIGl0IHRvIHRoZSBhbm5vdGF0aW9uIGdyaWRcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9jb21iKHJhY3RpdmUsIGZpbGUpXG57XG4gIGxldCBwcmVjaXNpb24gPSBbXTtcbiAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gIGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7IGxpbmVzLnNoaWZ0KCk7XG4gIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgIHByZWNpc2lvbltpXSA9IHt9O1xuICAgIHByZWNpc2lvbltpXS5wb3MgPSBlbnRyaWVzWzFdO1xuICAgIHByZWNpc2lvbltpXS5wcmVjaXNpb24gPSBlbnRyaWVzWzRdO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ2Rpc29fcHJlY2lzaW9uJywgcHJlY2lzaW9uKTtcbiAgYmlvZDMuZ2VuZXJpY3h5TGluZUNoYXJ0KHByZWNpc2lvbiwgJ3BvcycsIFsncHJlY2lzaW9uJ10sIFsnQmxhY2snLF0sICdEaXNvTk5DaGFydCcsIHtwYXJlbnQ6ICdkaXYuY29tYl9wbG90JywgY2hhcnRUeXBlOiAnbGluZScsIHlfY3V0b2ZmOiAwLjUsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcblxufVxuXG4vL3BhcnNlIHRoZSBtZW1zYXQgb3V0cHV0XG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfbWVtc2F0ZGF0YShyYWN0aXZlLCBmaWxlKVxue1xuICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgbGV0IHNlcSA9IHJhY3RpdmUuZ2V0KCdzZXF1ZW5jZScpO1xuICAvL2NvbnNvbGUubG9nKGZpbGUpO1xuICBsZXQgdG9wb19yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1RvcG9sb2d5OlxccysoLis/KVxcbi8sIGZpbGUpO1xuICBsZXQgc2lnbmFsX3JlZ2lvbnMgPSBnZXRfbWVtc2F0X3JhbmdlcygvU2lnbmFsXFxzcGVwdGlkZTpcXHMrKC4rKVxcbi8sIGZpbGUpO1xuICBsZXQgcmVlbnRyYW50X3JlZ2lvbnMgPSBnZXRfbWVtc2F0X3JhbmdlcygvUmUtZW50cmFudFxcc2hlbGljZXM6XFxzKyguKz8pXFxuLywgZmlsZSk7XG4gIGxldCB0ZXJtaW5hbCA9IGdldF9tZW1zYXRfcmFuZ2VzKC9OLXRlcm1pbmFsOlxccysoLis/KVxcbi8sIGZpbGUpO1xuICAvL2NvbnNvbGUubG9nKHNpZ25hbF9yZWdpb25zKTtcbiAgLy8gY29uc29sZS5sb2cocmVlbnRyYW50X3JlZ2lvbnMpO1xuICBsZXQgY29pbF90eXBlID0gJ0NZJztcbiAgaWYodGVybWluYWwgPT09ICdvdXQnKVxuICB7XG4gICAgY29pbF90eXBlID0gJ0VDJztcbiAgfVxuICBsZXQgdG1wX2Fubm8gPSBuZXcgQXJyYXkoc2VxLmxlbmd0aCk7XG4gIGlmKHRvcG9fcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKVxuICB7XG4gICAgbGV0IHByZXZfZW5kID0gMDtcbiAgICB0b3BvX3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdUTScsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgICAgaWYocHJldl9lbmQgPiAwKXtwcmV2X2VuZCAtPSAxO31cbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbChjb2lsX3R5cGUsIHByZXZfZW5kLCByZWdpb25bMF0pO1xuICAgICAgaWYoY29pbF90eXBlID09PSAnRUMnKXsgY29pbF90eXBlID0gJ0NZJzt9ZWxzZXtjb2lsX3R5cGUgPSAnRUMnO31cbiAgICAgIHByZXZfZW5kID0gcmVnaW9uWzFdKzI7XG4gICAgfSk7XG4gICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKGNvaWxfdHlwZSwgcHJldl9lbmQtMSwgc2VxLmxlbmd0aCk7XG5cbiAgfVxuICAvL3NpZ25hbF9yZWdpb25zID0gW1s3MCw4M10sIFsxMDIsMTE3XV07XG4gIGlmKHNpZ25hbF9yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpe1xuICAgIHNpZ25hbF9yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnUycsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgIH0pO1xuICB9XG4gIC8vcmVlbnRyYW50X3JlZ2lvbnMgPSBbWzQwLDUwXSwgWzIwMCwyMThdXTtcbiAgaWYocmVlbnRyYW50X3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJyl7XG4gICAgcmVlbnRyYW50X3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdSSCcsIHJlZ2lvblswXSwgcmVnaW9uWzFdKzEpO1xuICAgIH0pO1xuICB9XG4gIHRtcF9hbm5vLmZvckVhY2goZnVuY3Rpb24oYW5ubywgaSl7XG4gICAgYW5ub3RhdGlvbnNbaV0ubWVtc2F0ID0gYW5ubztcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgYmlvZDMuYW5ub3RhdGlvbkdyaWQoYW5ub3RhdGlvbnMsIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfcHJlc3VsdChyYWN0aXZlLCBmaWxlLCB0eXBlKVxue1xuICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgLy9jb25zb2xlLmxvZyh0eXBlKydfYW5uX3NldCcpO1xuICBsZXQgYW5uX2xpc3QgPSByYWN0aXZlLmdldCh0eXBlKydfYW5uX3NldCcpO1xuICAvL2NvbnNvbGUubG9nKGFubl9saXN0KTtcbiAgaWYoT2JqZWN0LmtleXMoYW5uX2xpc3QpLmxlbmd0aCA+IDApe1xuICBsZXQgcHNldWRvX3RhYmxlID0gJzx0YWJsZSBjbGFzcz1cInNtYWxsLXRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWRcIj5cXG4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0cj48dGg+Q29uZi48L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPk5ldCBTY29yZTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+cC12YWx1ZTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+UGFpckU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlNvbHZFPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gU2NvcmU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPkFsbiBMZW5ndGg8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlN0ciBMZW48L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlNlcSBMZW48L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPkZvbGQ8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlNFQVJDSCBTQ09QPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggQ0FUSDwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+UERCU1VNPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbGlnbm1lbnQ8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPk1PREVMPC90aD4nO1xuXG4gIC8vIGlmIE1PREVMTEVSIFRISU5HWVxuICBwc2V1ZG9fdGFibGUgKz0gJzwvdHI+PHRib2R5XCI+XFxuJztcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICBpZihsaW5lLmxlbmd0aCA9PT0gMCl7cmV0dXJuO31cbiAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICBpZihlbnRyaWVzWzldK1wiX1wiK2kgaW4gYW5uX2xpc3QpXG4gICAge1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0cj5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQgY2xhc3M9J1wiK2VudHJpZXNbMF0udG9Mb3dlckNhc2UoKStcIic+XCIrZW50cmllc1swXStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbMV0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzJdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1szXStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNF0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzVdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s2XStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbN10rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzhdK1wiPC90ZD5cIjtcbiAgICBsZXQgcGRiID0gZW50cmllc1s5XS5zdWJzdHJpbmcoMCwgZW50cmllc1s5XS5sZW5ndGgtMik7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwczovL3d3dy5yY3NiLm9yZy9wZGIvZXhwbG9yZS9leHBsb3JlLmRvP3N0cnVjdHVyZUlkPVwiK3BkYitcIic+XCIrZW50cmllc1s5XStcIjwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3Njb3AubXJjLWxtYi5jYW0uYWMudWsvc2NvcC9wZGIuY2dpP3BkYj1cIitwZGIrXCInPlNDT1AgU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmNhdGhkYi5pbmZvL3BkYi9cIitwZGIrXCInPkNBVEggU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmViaS5hYy51ay90aG9ybnRvbi1zcnYvZGF0YWJhc2VzL2NnaS1iaW4vcGRic3VtL0dldFBhZ2UucGw/cGRiY29kZT1cIitwZGIrXCInPk9wZW4gUERCU1VNPC9hPjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J3BzaXByZWQubG9hZE5ld0FsaWdubWVudChcXFwiXCIrKGFubl9saXN0W2VudHJpZXNbOV0rXCJfXCIraV0uYWxuKStcIlxcXCIsXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFubikrXCJcXFwiLFxcXCJcIisoZW50cmllc1s5XStcIl9cIitpKStcIlxcXCIpOycgdmFsdWU9J0Rpc3BsYXkgQWxpZ25tZW50JyAvPjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J3BzaXByZWQuYnVpbGRNb2RlbChcXFwiXCIrKGFubl9saXN0W2VudHJpZXNbOV0rXCJfXCIraV0uYWxuKStcIlxcXCIpOycgdmFsdWU9J0J1aWxkIE1vZGVsJyAvPjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPC90cj5cXG5cIjtcbiAgICB9XG4gIH0pO1xuICBwc2V1ZG9fdGFibGUgKz0gXCI8L3Rib2R5PjwvdGFibGU+XFxuXCI7XG4gIHJhY3RpdmUuc2V0KHR5cGUrXCJfdGFibGVcIiwgcHNldWRvX3RhYmxlKTtcbiAgfVxuICBlbHNlIHtcbiAgICAgIHJhY3RpdmUuc2V0KHR5cGUrXCJfdGFibGVcIiwgXCI8aDM+Tm8gZ29vZCBoaXRzIGZvdW5kLiBHVUVTUyBhbmQgTE9XIGNvbmZpZGVuY2UgaGl0cyBjYW4gYmUgZm91bmQgaW4gdGhlIHJlc3VsdHMgZmlsZTwvaDM+XCIpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzIiwiaW1wb3J0IHsgcHJvY2Vzc19maWxlIH0gZnJvbSAnLi4vcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hvd19wYW5lbCh2YWx1ZSwgcmFjdGl2ZSlcbntcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgdmFsdWUgKTtcbn1cblxuLy9iZWZvcmUgYSByZXN1Ym1pc3Npb24gaXMgc2VudCBhbGwgdmFyaWFibGVzIGFyZSByZXNldCB0byB0aGUgcGFnZSBkZWZhdWx0c1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyX3NldHRpbmdzKHJhY3RpdmUsIGdlYXJfc3RyaW5nLCBqb2JfbGlzdCl7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCAyKTtcbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEpO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCBmYWxzZSk7XG4gIHJhY3RpdmUuc2V0KCdkb3dubG9hZF9saW5rcycsICcnKTtcbiAgam9iX2xpc3QuZm9yRWFjaChmdW5jdGlvbihqb2JfbmFtZSl7XG4gICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ193YWl0aW5nX21lc3NhZ2UnLCAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyICcram9iX25hbWUudG9VcHBlckNhc2UoKSsnIGpvYiB0byBwcm9jZXNzPC9oMj4nKTtcbiAgICByYWN0aXZlLnNldChqb2JfbmFtZSsnX3dhaXRpbmdfaWNvbicsIGdlYXJfc3RyaW5nKTtcbiAgICByYWN0aXZlLnNldChqb2JfbmFtZSsnX3RpbWUnLCAnTG9hZGluZyBEYXRhJyk7XG4gIH0pO1xuICByYWN0aXZlLnNldCgncHNpcHJlZF9ob3JpeicsbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX3NjaGVtYXRpYycsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9jYXJ0b29uJywgJycpO1xuICByYWN0aXZlLnNldCgncGdlbl90YWJsZScsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fc2V0Jywge30pO1xuICByYWN0aXZlLnNldCgnZ2VuX3RhYmxlJywgJycpO1xuICByYWN0aXZlLnNldCgnZ2VuX3NldCcsIHt9KTtcblxuICAvL3JhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicpO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLG51bGwpO1xuICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsbnVsbCk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYuc2VxdWVuY2VfcGxvdCcpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LnBzaXByZWRfY2FydG9vbicpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LmNvbWJfcGxvdCcpO1xuXG4gIHppcCA9IG5ldyBKU1ppcCgpO1xufVxuXG4vL1Rha2UgYSBjb3VwbGUgb2YgdmFyaWFibGVzIGFuZCBwcmVwYXJlIHRoZSBodG1sIHN0cmluZ3MgZm9yIHRoZSBkb3dubG9hZHMgcGFuZWxcbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlX2Rvd25sb2Fkc19odG1sKGRhdGEsIGRvd25sb2Fkc19pbmZvKVxue1xuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwc2lwcmVkJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAge1xuICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuaGVhZGVyID0gXCI8aDU+RGlzb1ByZWREIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWVtc2F0c3ZtJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm09IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5oZWFkZXIgPSBcIjxoNT5NRU1TQVRTVk0gRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwZ2VudGhyZWFkZXInKSlcbiAge1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wR2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZW1wYWNrJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bT0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlciA9IFwiPGg1Pk1FTVNBVFNWTSBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2sgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1wYWNrLmhlYWRlciA9IFwiPGg1Pk1FTVBBQ0sgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdnZW50aHJlYWRlcicpKXtcbiAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIuaGVhZGVyID0gXCI8aDU+R2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdkb21wcmVkJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmhlYWRlciA9IFwiPGg1PkRvbVByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdwZG9tdGhyZWFkZXInKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBEb21USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2Jpb3NlcmYnKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBHZW5USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmY9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmYuaGVhZGVyID0gXCI8aDU+QmlvU2VyZiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2RvbXNlcmYnKSl7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlcj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmhlYWRlciA9IFwiPGg1PnBEb21USFJFQURFUiBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmY9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmYuaGVhZGVyID0gXCI8aDU+RG9tU2VyZiBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2ZmcHJlZCcpKXtcbiAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlciA9IFwiPGg1PkRpc29QcmVkRCBET1dOTE9BRFM8L2g1PlwiO1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmhlYWRlciA9IFwiPGg1PkRvbVByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5mZnByZWQ9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmZmcHJlZC5oZWFkZXIgPSBcIjxoNT5GRlByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZXRhcHNpY292Jykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRhcHNpY292PSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRhcHNpY292LmhlYWRlciA9IFwiPGg1Pk1ldGFQU0lDT1YgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZXRzaXRlJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1ldHNpdGUgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRzaXRlLmhlYWRlciA9IFwiPGg1Pk1ldHNpdGUgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdoc3ByZWQnKSl7XG4gICAgZG93bmxvYWRzX2luZm8uaHNwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uaHNwcmVkLmhlYWRlciA9IFwiPGg1PkhTUHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ21lbWVtYmVkJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbWVtYmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWVtZW1iZWQuaGVhZGVyID0gXCI8aDU+TUVNRU1CRUQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdnZW50ZGInKSl7XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGRiID0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGRiLmhlYWRlciA9IFwiPGg1PlREQiBET1dOTE9BRDwvaDU+XCI7XG4gIH1cblxufVxuXG4vL3Rha2UgdGhlIGRhdGFibG9iIHdlJ3ZlIGdvdCBhbmQgbG9vcCBvdmVyIHRoZSByZXN1bHRzXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlX3Jlc3VsdHMocmFjdGl2ZSwgZGF0YSwgZmlsZV91cmwsIHppcCwgZG93bmxvYWRzX2luZm8pXG57XG4gIGxldCBob3Jpel9yZWdleCA9IC9cXC5ob3JpeiQvO1xuICBsZXQgc3MyX3JlZ2V4ID0gL1xcLnNzMiQvO1xuICBsZXQgbWVtc2F0X2NhcnRvb25fcmVnZXggPSAvX2NhcnRvb25fbWVtc2F0X3N2bVxcLnBuZyQvO1xuICBsZXQgbWVtc2F0X3NjaGVtYXRpY19yZWdleCA9IC9fc2NoZW1hdGljXFwucG5nJC87XG4gIGxldCBtZW1zYXRfZGF0YV9yZWdleCA9IC9tZW1zYXRfc3ZtJC87XG4gIGxldCBtZW1wYWNrX2NhcnRvb25fcmVnZXggPSAvS2FtYWRhLUthd2FpX1xcZCsucG5nJC87XG4gIGxldCBtZW1wYWNrX2dyYXBoX291dCA9IC9pbnB1dF9ncmFwaC5vdXQkLztcbiAgbGV0IG1lbXBhY2tfY29udGFjdF9yZXMgPSAvQ09OVEFDVF9ERUYxLnJlc3VsdHMkLztcbiAgbGV0IG1lbXBhY2tfbGlwaWRfcmVzID0gL0xJUElEX0VYUE9TVVJFLnJlc3VsdHMkLztcbiAgbGV0IG1lbXBhY2tfcmVzdWx0X2ZvdW5kID0gZmFsc2U7XG5cbiAgbGV0IGltYWdlX3JlZ2V4ID0gJyc7XG4gIGxldCByZXN1bHRzID0gZGF0YS5yZXN1bHRzO1xuICBmb3IobGV0IGkgaW4gcmVzdWx0cylcbiAge1xuICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ0dlbkFsaWdubWVudEFubm90YXRpb24nKVxuICAgIHtcbiAgICAgICAgbGV0IGFubl9zZXQgPSByYWN0aXZlLmdldChcInBnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZ2VuX2dlbmFsaWdubWVudF9hbm5vdGF0aW9uJylcbiAgICB7XG4gICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwiZ2VuX2Fubl9zZXRcIiwgYW5uX3NldCk7XG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICBmb3IobGV0IGkgaW4gcmVzdWx0cylcbiAge1xuICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgLy9wc2lwcmVkIGZpbGVzXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PSAncHNpcGFzczInKVxuICAgIHtcbiAgICAgIGxldCBtYXRjaCA9IGhvcml6X3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKG1hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2hvcml6JywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaG9yaXogPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5Ib3JpeiBGb3JtYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfdGltZVwiLCAnJyk7XG4gICAgICB9XG4gICAgICBsZXQgc3MyX21hdGNoID0gc3MyX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNzMl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TUzIgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3NzMicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19mb3JtYXQnKVxuICAgIHtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5QQkRBVCBGb3JtYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3RpbWVcIiwgJycpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19jb21iaW5lJylcbiAgICB7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2NvbWInLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNPTUIgTk4gT3V0cHV0PC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ21lbXNhdHN2bScpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1zYXRzdm1fd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV90aW1lXCIsICcnKTtcbiAgICAgIGxldCBzY2hlbWVfbWF0Y2ggPSBtZW1zYXRfc2NoZW1hdGljX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNjaGVtZV9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9zY2hlbWF0aWMnLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLnNjaGVtYXRpYyA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlNjaGVtYXRpYyBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgY2FydG9vbl9tYXRjaCA9IG1lbXNhdF9jYXJ0b29uX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICc8aW1nIHNyYz1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIiAvPicpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IG1lbXNhdF9tYXRjaCA9IG1lbXNhdF9kYXRhX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKG1lbXNhdF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdtZW1zYXRkYXRhJywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmRhdGEgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5NZW1zYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdtZW1wYWNrX3dyYXBwZXInKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtcGFja193YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1wYWNrX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXBhY2tfdGltZVwiLCAnJyk7XG4gICAgICBsZXQgY2FydG9vbl9tYXRjaCA9ICBtZW1wYWNrX2NhcnRvb25fcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoY2FydG9vbl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgbWVtcGFja19yZXN1bHRfZm91bmQgPSB0cnVlO1xuICAgICAgICByYWN0aXZlLnNldCgnbWVtcGFja19jYXJ0b29uJywgJzxpbWcgd2lkdGg9XCIxMDAwcHhcIiBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Q2FydG9vbiBEaWFncmFtPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgZ3JhcGhfbWF0Y2ggPSAgbWVtcGFja19ncmFwaF9vdXQuZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoZ3JhcGhfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suZ3JhcGhfb3V0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+RGlhZ3JhbSBEYXRhPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgY29udGFjdF9tYXRjaCA9ICBtZW1wYWNrX2NvbnRhY3RfcmVzLmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNvbnRhY3RfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY29udGFjdCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNvbnRhY3QgUHJlZGljdGlvbnM8L2E+PGJyIC8+JztcbiAgICAgIH1cbiAgICAgIGxldCBsaXBpZF9tYXRjaCA9ICBtZW1wYWNrX2xpcGlkX3Jlcy5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihsaXBpZF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5saXBpZF9vdXQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5MaXBpZCBFeHBvc3VyZSBQcmVkaXRpb25zPC9hPjxiciAvPic7XG4gICAgICB9XG5cbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3NvcnRfcHJlc3VsdCcpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwicGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcInBnZW50aHJlYWRlcl90aW1lXCIsICcnKTtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIudGFibGUgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgVGFibGU8L2E+PGJyIC8+JztcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dlbl9zb3J0X3ByZXN1bHRzJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3RpbWVcIiwgJycpO1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdnZW5fcHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkdlblRIUkVBREVSIFRhYmxlPC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfYWxpZ24nKVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPnBHZW5USFJFQURFUiBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdnZW50aHJlYWRlcl9wc2V1ZG9fYmFzX2FsaWduJylcbiAgICB7XG4gICAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkdlblRIUkVBREVSIEFsaWdubWVudHM8L2E+PGJyIC8+JztcbiAgICB9XG4gIH1cbiAgaWYoISBtZW1wYWNrX3Jlc3VsdF9mb3VuZClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdtZW1wYWNrX2NhcnRvb24nLCAnPGgzPk5vIHBhY2tpbmcgcHJlZGljdGlvbiBwb3NzaWJsZTwvaDM+Jyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF9kb3dubG9hZHNfcGFuZWwocmFjdGl2ZSwgZG93bmxvYWRzX2luZm8pXG57XG4gIGNvbnNvbGUubG9nKGRvd25sb2Fkc19pbmZvKTtcbiAgbGV0IGRvd25sb2Fkc19zdHJpbmcgPSByYWN0aXZlLmdldCgnZG93bmxvYWRfbGlua3MnKTtcbiAgaWYoJ3BzaXByZWQnIGluIGRvd25sb2Fkc19pbmZvKVxuICB7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5ob3Jpeik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuc3MyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ2Rpc29wcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmNvbWIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZignbWVtc2F0c3ZtJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmRhdGEpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uc2NoZW1hdGljKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24pO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZigncGdlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ2dlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ21lbXBhY2snIGluIGRvd25sb2Fkc19pbmZvKVxuICB7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2suaGVhZGVyKTtcbiAgICBpZihkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNhcnRvb24pXG4gICAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNhcnRvb24pO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmdyYXBoX291dCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY29udGFjdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXBhY2subGlwaWRfb3V0KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIk5vIHBhY2tpbmcgcHJlZGljdGlvbiBwb3NzaWJsZTxiciAvPlwiKTtcbiAgICB9XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG5cbiAgcmFjdGl2ZS5zZXQoJ2Rvd25sb2FkX2xpbmtzJywgZG93bmxvYWRzX3N0cmluZyk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsIi8vZ2l2ZW4gYW5kIGFycmF5IHJldHVybiB3aGV0aGVyIGFuZCBlbGVtZW50IGlzIHByZXNlbnRcbmV4cG9ydCBmdW5jdGlvbiBpc0luQXJyYXkodmFsdWUsIGFycmF5KSB7XG4gIGlmKGFycmF5LmluZGV4T2YodmFsdWUpID4gLTEpXG4gIHtcbiAgICByZXR1cm4odHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuKGZhbHNlKTtcbiAgfVxufVxuXG4vL3doZW4gYSByZXN1bHRzIHBhZ2UgaXMgaW5zdGFudGlhdGVkIGFuZCBiZWZvcmUgc29tZSBhbm5vdGF0aW9ucyBoYXZlIGNvbWUgYmFja1xuLy93ZSBkcmF3IGFuZCBlbXB0eSBhbm5vdGF0aW9uIHBhbmVsXG5leHBvcnQgZnVuY3Rpb24gZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpe1xuXG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgbGV0IHJlc2lkdWVzID0gc2VxLnNwbGl0KCcnKTtcbiAgbGV0IGFubm90YXRpb25zID0gW107XG4gIHJlc2lkdWVzLmZvckVhY2goZnVuY3Rpb24ocmVzKXtcbiAgICBhbm5vdGF0aW9ucy5wdXNoKHsncmVzJzogcmVzfSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gIGJpb2QzLmFubm90YXRpb25HcmlkKHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG59XG5cblxuLy9naXZlbiBhIFVSTCByZXR1cm4gdGhlIGF0dGFjaGVkIHZhcmlhYmxlc1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVybFZhcnMoKSB7XG4gICAgbGV0IHZhcnMgPSB7fTtcbiAgICAvL2NvbnNpZGVyIHVzaW5nIGxvY2F0aW9uLnNlYXJjaCBpbnN0ZWFkIGhlcmVcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bPyZdKyhbXj0mXSspPShbXiZdKikvZ2ksXG4gICAgZnVuY3Rpb24obSxrZXksdmFsdWUpIHtcbiAgICAgIHZhcnNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB2YXJzO1xuICB9XG5cbi8qISBnZXRFbVBpeGVscyAgfCBBdXRob3I6IFR5c29uIE1hdGFuaWNoIChodHRwOi8vbWF0YW5pY2guY29tKSwgMjAxMyB8IExpY2Vuc2U6IE1JVCAqL1xuKGZ1bmN0aW9uIChkb2N1bWVudCwgZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgLy8gRW5hYmxlIHN0cmljdCBtb2RlXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyBGb3JtIHRoZSBzdHlsZSBvbiB0aGUgZmx5IHRvIHJlc3VsdCBpbiBzbWFsbGVyIG1pbmlmaWVkIGZpbGVcbiAgICBsZXQgaW1wb3J0YW50ID0gXCIhaW1wb3J0YW50O1wiO1xuICAgIGxldCBzdHlsZSA9IFwicG9zaXRpb246YWJzb2x1dGVcIiArIGltcG9ydGFudCArIFwidmlzaWJpbGl0eTpoaWRkZW5cIiArIGltcG9ydGFudCArIFwid2lkdGg6MWVtXCIgKyBpbXBvcnRhbnQgKyBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudCArIFwicGFkZGluZzowXCIgKyBpbXBvcnRhbnQ7XG5cbiAgICB3aW5kb3cuZ2V0RW1QaXhlbHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgIGxldCBleHRyYUJvZHk7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBFbXVsYXRlIHRoZSBkb2N1bWVudEVsZW1lbnQgdG8gZ2V0IHJlbSB2YWx1ZSAoZG9jdW1lbnRFbGVtZW50IGRvZXMgbm90IHdvcmsgaW4gSUU2LTcpXG4gICAgICAgICAgICBlbGVtZW50ID0gZXh0cmFCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvZHlcIik7XG4gICAgICAgICAgICBleHRyYUJvZHkuc3R5bGUuY3NzVGV4dCA9IFwiZm9udC1zaXplOjFlbVwiICsgaW1wb3J0YW50O1xuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50Lmluc2VydEJlZm9yZShleHRyYUJvZHksIGRvY3VtZW50LmJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuZCBzdHlsZSBhIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcbiAgICAgICAgdGVzdEVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlO1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRlc3RFbGVtZW50KTtcblxuICAgICAgICAvLyBHZXQgdGhlIGNsaWVudCB3aWR0aCBvZiB0aGUgdGVzdCBlbGVtZW50XG4gICAgICAgIGxldCB2YWx1ZSA9IHRlc3RFbGVtZW50LmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGlmIChleHRyYUJvZHkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXh0cmEgYm9keSBlbGVtZW50XG4gICAgICAgICAgICBkb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZXh0cmFCb2R5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgdGVzdCBlbGVtZW50XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKHRlc3RFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgZW0gdmFsdWUgaW4gcGl4ZWxzXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufShkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvY29tbW9uL2NvbW1vbl9pbmRleC5qcyIsImltcG9ydCB7IGdldF9tZW1zYXRfcmFuZ2VzIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX3NzMiB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9wYmRhdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9jb21iIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX21lbXNhdGRhdGEgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfcHJlc3VsdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5leHBvcnQgZnVuY3Rpb24gc2VuZF9yZXF1ZXN0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuICBjb25zb2xlLmxvZygnU2VuZGluZyBVUkkgcmVxdWVzdCcpO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuICBjb25zb2xlLmxvZyh0eXBlKTtcbiAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IHNlbmRfZGF0YSxcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBhc3luYzogICBmYWxzZSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgLy9jb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgdXJsOiB1cmwsXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKVxuICAgIHtcbiAgICAgIGlmKGRhdGEgPT09IG51bGwpe2FsZXJ0KFwiRmFpbGVkIHRvIHNlbmQgZGF0YVwiKTt9XG4gICAgICByZXNwb25zZT1kYXRhO1xuICAgICAgLy9hbGVydChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoXCJTZW5kaW5nIEpvYiB0byBcIit1cmwrXCIgRmFpbGVkLiBcIitlcnJvci5yZXNwb25zZVRleHQrXCIuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSB3YXMgdW5hYmxlIHRvIHByb2Nlc3MgeW91ciBzdWJtaXNzaW9uLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTsgcmV0dXJuIG51bGw7XG4gIH19KS5yZXNwb25zZUpTT047XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cbi8vZ2l2ZW4gYSBqb2IgbmFtZSBwcmVwIGFsbCB0aGUgZm9ybSBlbGVtZW50cyBhbmQgc2VuZCBhbiBodHRwIHJlcXVlc3QgdG8gdGhlXG4vL2JhY2tlbmRcbmV4cG9ydCBmdW5jdGlvbiBzZW5kX2pvYihyYWN0aXZlLCBqb2JfbmFtZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsKVxue1xuICAvL2FsZXJ0KHNlcSk7XG4gIGNvbnNvbGUubG9nKFwiU2VuZGluZyBmb3JtIGRhdGFcIik7XG4gIGNvbnNvbGUubG9nKGpvYl9uYW1lKTtcbiAgdmFyIGZpbGUgPSBudWxsO1xuICBsZXQgdXBwZXJfbmFtZSA9IGpvYl9uYW1lLnRvVXBwZXJDYXNlKCk7XG4gIHRyeVxuICB7XG4gICAgZmlsZSA9IG5ldyBCbG9iKFtzZXFdKTtcbiAgfSBjYXRjaCAoZSlcbiAge1xuICAgIGFsZXJ0KGUpO1xuICB9XG4gIGxldCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICBmZC5hcHBlbmQoXCJpbnB1dF9kYXRhXCIsIGZpbGUsICdpbnB1dC50eHQnKTtcbiAgZmQuYXBwZW5kKFwiam9iXCIsam9iX25hbWUpO1xuICBmZC5hcHBlbmQoXCJzdWJtaXNzaW9uX25hbWVcIixuYW1lKTtcbiAgZmQuYXBwZW5kKFwiZW1haWxcIiwgZW1haWwpO1xuXG4gIGxldCByZXNwb25zZV9kYXRhID0gc2VuZF9yZXF1ZXN0KHN1Ym1pdF91cmwsIFwiUE9TVFwiLCBmZCk7XG4gIGlmKHJlc3BvbnNlX2RhdGEgIT09IG51bGwpXG4gIHtcbiAgICBsZXQgdGltZXMgPSBzZW5kX3JlcXVlc3QodGltZXNfdXJsLCdHRVQnLHt9KTtcbiAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHRpbWVzKSk7XG4gICAgaWYoam9iX25hbWUgaW4gdGltZXMpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgdXBwZXJfbmFtZStcIiBqb2JzIHR5cGljYWxseSB0YWtlIFwiK3RpbWVzW2pvYl9uYW1lXStcIiBzZWNvbmRzXCIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgXCJVbmFibGUgdG8gcmV0cmlldmUgYXZlcmFnZSB0aW1lIGZvciBcIit1cHBlcl9uYW1lK1wiIGpvYnMuXCIpO1xuICAgIH1cbiAgICBmb3IodmFyIGsgaW4gcmVzcG9uc2VfZGF0YSlcbiAgICB7XG4gICAgICBpZihrID09IFwiVVVJRFwiKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsIHJlc3BvbnNlX2RhdGFba10pO1xuICAgICAgICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsIGpvYl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIHNlcXVlbmNlIGZyb20gYSBwcmV2aW91cyBzdWJtaXNzaW9uIGlzIHRoZVxuLy9wYWdlIHdhcyBsb2FkZWQgd2l0aCBhIFVVSURcbmV4cG9ydCBmdW5jdGlvbiBnZXRfcHJldmlvdXNfZGF0YSh1dWlkLCBzdWJtaXRfdXJsLCBmaWxlX3VybCwgcmFjdGl2ZSlcbntcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdGluZyBkZXRhaWxzIGdpdmVuIFVSSScpO1xuICAgIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgLy9hbGVydCh1cmwpO1xuICAgIGxldCBzdWJtaXNzaW9uX3Jlc3BvbnNlID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGlmKCEgc3VibWlzc2lvbl9yZXNwb25zZSl7YWxlcnQoXCJOTyBTVUJNSVNTSU9OIERBVEFcIik7fVxuICAgIGxldCBzZXEgPSBnZXRfdGV4dChmaWxlX3VybCtzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmlucHV0X2ZpbGUsIFwiR0VUXCIsIHt9KTtcbiAgICBsZXQgam9icyA9ICcnO1xuICAgIHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihzdWJtaXNzaW9uKXtcbiAgICAgIGpvYnMgKz0gc3VibWlzc2lvbi5qb2JfbmFtZStcIixcIjtcbiAgICB9KTtcbiAgICBqb2JzID0gam9icy5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuKHsnc2VxJzogc2VxLCAnZW1haWwnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmVtYWlsLCAnbmFtZSc6IHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnNbMF0uc3VibWlzc2lvbl9uYW1lLCAnam9icyc6IGpvYnN9KTtcbn1cblxuXG4vL2dldCB0ZXh0IGNvbnRlbnRzIGZyb20gYSByZXN1bHQgVVJJXG5mdW5jdGlvbiBnZXRfdGV4dCh1cmwsIHR5cGUsIHNlbmRfZGF0YSlcbntcblxuIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgLy9kYXRhVHlwZTogXCJ0eHRcIixcbiAgICAvL2NvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpXG4gICAge1xuICAgICAgaWYoZGF0YSA9PT0gbnVsbCl7YWxlcnQoXCJGYWlsZWQgdG8gcmVxdWVzdCBpbnB1dCBkYXRhIHRleHRcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiR2V0dGluZ3MgcmVzdWx0cyB0ZXh0IGZhaWxlZC4gVGhlIEJhY2tlbmQgcHJvY2Vzc2luZyBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBjb250YWN0IHBzaXByZWRAY3MudWNsLmFjLnVrXCIpO31cbiAgfSk7XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cblxuLy9wb2xscyB0aGUgYmFja2VuZCB0byBnZXQgcmVzdWx0cyBhbmQgdGhlbiBwYXJzZXMgdGhvc2UgcmVzdWx0cyB0byBkaXNwbGF5XG4vL3RoZW0gb24gdGhlIHBhZ2VcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzX2ZpbGUodXJsX3N0dWIsIHBhdGgsIGN0bCwgemlwLCByYWN0aXZlKVxue1xuICBsZXQgdXJsID0gdXJsX3N0dWIgKyBwYXRoO1xuICBsZXQgcGF0aF9iaXRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIC8vZ2V0IGEgcmVzdWx0cyBmaWxlIGFuZCBwdXNoIHRoZSBkYXRhIGluIHRvIHRoZSBiaW8zZCBvYmplY3RcbiAgLy9hbGVydCh1cmwpO1xuICBjb25zb2xlLmxvZygnR2V0dGluZyBSZXN1bHRzIEZpbGUgYW5kIHByb2Nlc3NpbmcnKTtcbiAgbGV0IHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnR0VUJyxcbiAgICBhc3luYzogICB0cnVlLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZmlsZSlcbiAgICB7XG4gICAgICB6aXAuZm9sZGVyKHBhdGhfYml0c1sxXSkuZmlsZShwYXRoX2JpdHNbMl0sIGZpbGUpO1xuICAgICAgaWYoY3RsID09PSAnaG9yaXonKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9ob3JpeicsIGZpbGUpO1xuICAgICAgICBiaW9kMy5wc2lwcmVkKGZpbGUsICdwc2lwcmVkQ2hhcnQnLCB7cGFyZW50OiAnZGl2LnBzaXByZWRfY2FydG9vbicsIG1hcmdpbl9zY2FsZXI6IDJ9KTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3NzMicpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3NzMihyYWN0aXZlLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3BiZGF0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcGJkYXQocmFjdGl2ZSwgZmlsZSk7XG4gICAgICAgIC8vYWxlcnQoJ1BCREFUIHByb2Nlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ2NvbWInKVxuICAgICAge1xuICAgICAgICBwYXJzZV9jb21iKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnbWVtc2F0ZGF0YScpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX21lbXNhdGRhdGEocmFjdGl2ZSwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwcmVzdWx0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcHJlc3VsdChyYWN0aXZlLCBmaWxlLCAncGdlbicpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnZ2VuX3ByZXN1bHQnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9wcmVzdWx0KHJhY3RpdmUsIGZpbGUsICdnZW4nKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChKU09OLnN0cmluZ2lmeShlcnJvcikpO31cbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCIvKiAxLiBDYXRjaCBmb3JtIGlucHV0XG4gICAgIDIuIFZlcmlmeSBmb3JtXG4gICAgIDMuIElmIGdvb2QgdGhlbiBtYWtlIGZpbGUgZnJvbSBkYXRhIGFuZCBwYXNzIHRvIGJhY2tlbmRcbiAgICAgNC4gc2hyaW5rIGZvcm0gYXdheVxuICAgICA1LiBPcGVuIHNlcSBwYW5lbFxuICAgICA2LiBTaG93IHByb2Nlc3NpbmcgYW5pbWF0aW9uXG4gICAgIDcuIGxpc3RlbiBmb3IgcmVzdWx0XG4qL1xuaW1wb3J0IHsgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0gfSBmcm9tICcuL2Zvcm1zL2Zvcm1zX2luZGV4LmpzJztcbmltcG9ydCB7IHNlbmRfcmVxdWVzdCB9IGZyb20gJy4vcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMnO1xuaW1wb3J0IHsgZ2V0X3ByZXZpb3VzX2RhdGEgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCB9IGZyb20gJy4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5pbXBvcnQgeyBnZXRVcmxWYXJzIH0gZnJvbSAnLi9jb21tb24vY29tbW9uX2luZGV4LmpzJztcbmltcG9ydCB7IGNsZWFyX3NldHRpbmdzIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IHByZXBhcmVfZG93bmxvYWRzX2h0bWwgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgaGFuZGxlX3Jlc3VsdHMgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgc2V0X2Rvd25sb2Fkc19wYW5lbCB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5pbXBvcnQgeyBzaG93X3BhbmVsIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcblxudmFyIGNsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoJy5jb3B5QnV0dG9uJyk7XG52YXIgemlwID0gbmV3IEpTWmlwKCk7XG5cbmNsaXBib2FyZC5vbignc3VjY2VzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbn0pO1xuY2xpcGJvYXJkLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbn0pO1xuXG4vLyBTRVQgRU5EUE9JTlRTIEZPUiBERVYsIFNUQUdJTkcgT1IgUFJPRFxubGV0IGVuZHBvaW50c191cmwgPSBudWxsO1xubGV0IHN1Ym1pdF91cmwgPSBudWxsO1xubGV0IHRpbWVzX3VybCA9IG51bGw7XG5sZXQgZ2VhcnNfc3ZnID0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51ay9wc2lwcmVkX2JldGEvc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbmxldCBtYWluX3VybCA9IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWtcIjtcbmxldCBhcHBfcGF0aCA9IFwiL3BzaXByZWRfYmV0YVwiO1xubGV0IGZpbGVfdXJsID0gJyc7XG5sZXQgZ2Vhcl9zdHJpbmcgPSAnPG9iamVjdCB3aWR0aD1cIjE0MFwiIGhlaWdodD1cIjE0MFwiIHR5cGU9XCJpbWFnZS9zdmcreG1sXCIgZGF0YT1cIicrZ2VhcnNfc3ZnKydcIj48L29iamVjdD4nO1xubGV0IGpvYl9saXN0ID0gW1wicHNpcHJlZFwiLCBcImRpc29wcmVkXCIsIFwibWVtc2F0c3ZtXCIsIFwicGdlbnRocmVhZGVyXCIsIFwibWVtcGFja1wiLFxuICAgICAgICAgICAgICAgIFwiZ2VudGhyZWFkZXJcIiwgXCJkb21wcmVkXCIsIFwicGRvbXRocmVhZGVyXCIsIFwiYmlvc2VyZlwiLCBcImRvbXNlcmZcIixcbiAgICAgICAgICAgICAgICBcImZmcHJlZFwiLCBcIm1ldGFwc2ljb3ZcIiwgXCJtZXRzaXRlXCIsIFwiaHNwcmVkXCIsIFwibWVtZW1iZWRcIiwgXCJnZW50ZGJcIl07XG5sZXQgam9iX25hbWVzID0ge1xuICAncHNpcHJlZCc6ICdQU0lQUkVEIFYzLjMnLFxuICAnZGlzb3ByZWQnOiAnRElPU1BSRUQgMycsXG4gICdtZW1zYXRzdm0nOiAnTUVNU0FULVNWTScsXG4gICdwZ2VudGhyZWFkZXInOiAncEdlblRIUkVBREVSJyxcbiAgJ21lbXBhY2snOiAnTUVNUEFDSycsXG4gICdnZW50aHJlYWRlcic6ICdHZW5USFJFQURFUicsXG4gICdkb21wcmVkJzogJ0RvbVByZWQnLFxuICAncGRvbXRocmVhZGVyJzogJ1BTSVBSRUQnLFxuICAnYmlvc2VyZic6ICdCaW9zU2VyZiB2Mi4wJyxcbiAgJ2RvbXNlcmYnOiAnRG9tU2VyZiB2Mi4xJyxcbiAgJ2ZmcHJlZCc6ICdGRlByZWQgMycsXG4gICdtZXRhcHNpY292JzogJ01ldGFQU0lDT1YnLFxuICAnbWV0c2l0ZSc6ICdNZXRTaXRlJyxcbiAgJ2hzcHJlZCc6ICdIU1ByZWQnLFxuICAnbWVtZW1iZWQnOiAnTUVNRU1CRUQnLFxuICAnZ2VudGRiJzogJ0dlbmVyYXRlIFREQicsXG59O1xuXG5pZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCIxMjcuMC4wLjFcIiB8fCBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIilcbntcbiAgZW5kcG9pbnRzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9zdWJtaXNzaW9uLyc7XG4gIHRpbWVzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9qb2J0aW1lcy8nO1xuICBhcHBfcGF0aCA9ICcvaW50ZXJmYWNlJztcbiAgbWFpbl91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJztcbiAgZ2VhcnNfc3ZnID0gXCIuLi9zdGF0aWMvaW1hZ2VzL2dlYXJzLnN2Z1wiO1xuICBmaWxlX3VybCA9IG1haW5fdXJsO1xufVxuZWxzZSBpZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJiaW9pbmZzdGFnZTEuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgID09PSBcImJpb2luZi5jcy51Y2wuYWMudWtcIiB8fCBsb2NhdGlvbi5ocmVmICA9PT0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51ay9wc2lwcmVkX2JldGEvXCIpIHtcbiAgZW5kcG9pbnRzX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL2VuZHBvaW50cy8nO1xuICBzdWJtaXRfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9qb2J0aW1lcy8nO1xuICBmaWxlX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoK1wiL2FwaVwiO1xuICAvL2dlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbn1cbmVsc2Uge1xuICBhbGVydCgnVU5TRVRUSU5HIEVORFBPSU5UUyBXQVJOSU5HLCBXQVJOSU5HIScpO1xuICBlbmRwb2ludHNfdXJsID0gJyc7XG4gIHN1Ym1pdF91cmwgPSAnJztcbiAgdGltZXNfdXJsID0gJyc7XG59XG5cbi8vIERFQ0xBUkUgVkFSSUFCTEVTIGFuZCBpbml0IHJhY3RpdmUgaW5zdGFuY2VcbnZhciByYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xuICBlbDogJyNwc2lwcmVkX3NpdGUnLFxuICB0ZW1wbGF0ZTogJyNmb3JtX3RlbXBsYXRlJyxcbiAgZGF0YToge1xuICAgICAgICAgIHNlcXVlbmNlX2Zvcm1fdmlzaWJsZTogMSxcbiAgICAgICAgICBzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlOiAwLFxuICAgICAgICAgIHJlc3VsdHNfdmlzaWJsZTogMSxcbiAgICAgICAgICByZXN1bHRzX3BhbmVsX3Zpc2libGU6IDEsXG4gICAgICAgICAgc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZTogMCxcbiAgICAgICAgICBtb2RlbGxlcl9rZXk6IG51bGwsXG5cbiAgICAgICAgICBwc2lwcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIHBzaXByZWRfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBkaXNvcHJlZF9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBkaXNvcHJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIG1lbXNhdHN2bV9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBtZW1zYXRzdm1fYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBwZ2VudGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgbWVtcGFja19jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBtZW1wYWNrX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZ2VudGhyZWFkZXJfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZ2VudGhyZWFkZXJfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBkb21wcmVkX2NoZWNrZWQ6IHRydWUsXG4gICAgICAgICAgZG9tcHJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIHBkb210aHJlYWRlcl9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBiaW9zZXJmX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGJpb3NlcmZfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBkb21zZXJmX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGRvbXNlcmZfYnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBmZnByZWRfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgZmZwcmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgbWV0c2l0ZV9jaGVja2VkOiBmYWxzZSxcbiAgICAgICAgICBtZXRzaXRlX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgaHNwcmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGhzcHJlZF9idXR0b246IGZhbHNlLFxuICAgICAgICAgIG1lbWVtYmVkX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIG1lbWVtYmVkX2J1dHRvbjogZmFsc2UsXG4gICAgICAgICAgZ2VudGRiX2NoZWNrZWQ6IGZhbHNlLFxuICAgICAgICAgIGdlbnRkYl9idXR0b246IGZhbHNlLFxuICAgICAgICAgIG1ldGFwc2ljb3ZfY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgbWV0YXBzaWNvdl9idXR0b246IGZhbHNlLFxuXG4gICAgICAgICAgZG93bmxvYWRfbGlua3M6ICcnLFxuICAgICAgICAgIHBzaXByZWRfam9iOiAncHNpcHJlZF9qb2InLFxuICAgICAgICAgIGRpc29wcmVkX2pvYjogJ2Rpc29wcmVkX2pvYicsXG4gICAgICAgICAgbWVtc2F0c3ZtX2pvYjogJ21lbXNhdHN2bV9qb2InLFxuICAgICAgICAgIHBnZW50aHJlYWRlcl9qb2I6ICdwZ2VudGhyZWFkZXJfam9iJyxcbiAgICAgICAgICBtZW1wYWNrX2pvYjogJ21lbXBhY2tfam9iJyxcbiAgICAgICAgICBnZW50aHJlYWRlcl9qb2I6ICdnZW50aHJlYWRlcl9qb2InLFxuICAgICAgICAgIGRvbXByZWRfam9iOiAnZG9tcHJlZF9qb2InLFxuICAgICAgICAgIHBkb210aHJlYWRlcl9qb2I6ICdwZG9tdGhyZWFkZXJfam9iJyxcbiAgICAgICAgICBiaW9zZXJmX2pvYjogJ2Jpb3NlcmZfam9iJyxcbiAgICAgICAgICBkb21zZXJmX2pvYjogJ2RvbXNlcmZfam9iJyxcbiAgICAgICAgICBmZnByZWRfam9iOiAnZmZwcmVkX2pvYicsXG4gICAgICAgICAgbWV0c2l0ZV9qb2I6ICdtZXRzaXRlX2pvYicsXG4gICAgICAgICAgaHNwcmVkX2pvYjogJ2hzcHJlZF9qb2InLFxuICAgICAgICAgIG1lbWVtYmVkX2pvYjogJ21lbWVtYmVkX2pvYicsXG4gICAgICAgICAgZ2VudGRiX2pvYjogJ2dlbnRkYl9qb2InLFxuICAgICAgICAgIG1ldGFwc2ljb3Zfam9iOiAnbWV0YXBzaWNvdl9qb2InLFxuXG5cbiAgICAgICAgICBwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBQU0lQUkVEIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIHBzaXByZWRfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBwc2lwcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBzaXByZWRfaG9yaXo6IG51bGwsXG5cbiAgICAgICAgICBkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRElTT1BSRUQgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZGlzb3ByZWRfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBkaXNvcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBkaXNvX3ByZWNpc2lvbjogbnVsbCxcblxuICAgICAgICAgIG1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTUVNU0FULVNWTSBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZW1zYXRzdm1fd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBtZW1zYXRzdm1fdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0c3ZtX3NjaGVtYXRpYzogJycsXG4gICAgICAgICAgbWVtc2F0c3ZtX2NhcnRvb246ICcnLFxuXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBwR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgcGdlbnRocmVhZGVyX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIHBnZW5fdGFibGU6IG51bGwsXG4gICAgICAgICAgcGdlbl9hbm5fc2V0OiB7fSxcblxuICAgICAgICAgIG1lbXBhY2tfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIE1FTVBBQ0sgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgbWVtcGFja193YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIG1lbXBhY2tfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgbWVtc2F0cGFja19zY2hlbWF0aWM6ICcnLFxuICAgICAgICAgIG1lbXNhdHBhY2tfY2FydG9vbjogJycsXG5cbiAgICAgICAgICBnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgR2VuVEhSRUFERVIgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZ2VudGhyZWFkZXJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBnZW50aHJlYWRlcl90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBnZW5fdGFibGU6IG51bGwsXG4gICAgICAgICAgZ2VuX2Fubl9zZXQ6IHt9LFxuXG4gICAgICAgICAgZG9tcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgRE9NUFJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBkb21wcmVkX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgZG9tcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBkb21wcmVkX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBwZG9tdGhyZWFkZXJfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIHBEb21USFJFQURFUiBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBwZG9tdGhyZWFkZXJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgcGRvbXRocmVhZGVyX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBiaW9zZXJmX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBCaW9TZXJmIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIGJpb3NlcmZfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBiaW9zZXJmX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIGJpb3NlcmZfZGF0YTogbnVsbCxcblxuICAgICAgICAgIGRvbXNlcmZfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyIERvbVNlcmYgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZG9tc2VyZl93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIGRvbXNlcmZfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZG9tc2VyZl9kYXRhOiBudWxsLFxuXG4gICAgICAgICAgZmZwcmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBGRlByZWQgam9iIHRvIHByb2Nlc3M8L2gyPicsXG4gICAgICAgICAgZmZwcmVkX3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgZmZwcmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIGZmcHJlZF9kYXRhOiBudWxsLFxuXG4gICAgICAgICAgbWV0YXBzaWNvdl93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgTWV0YVBTSUNPViBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZXRhcHNpY292X3dhaXRpbmdfaWNvbjogZ2Vhcl9zdHJpbmcsXG4gICAgICAgICAgbWV0YXBzaWNvdl90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBtZXRhcHNpY292X2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBtZXRzaXRlX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNZXRTaXRlIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIG1ldHNpdGVfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBtZXRzaXRlX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIG1ldHNpdGVfZGF0YTogbnVsbCxcblxuICAgICAgICAgIGhzcHJlZF93YWl0aW5nX21lc3NhZ2U6ICc8aDI+UGxlYXNlIHdhaXQgZm9yIHlvdXIgSFNQcmVkIGpvYiB0byBwcm9jZXNzPC9oMj4nLFxuICAgICAgICAgIGhzcHJlZF93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIGhzcHJlZF90aW1lOiAnTG9hZGluZyBEYXRhJyxcbiAgICAgICAgICBoc3ByZWRfZGF0YTogbnVsbCxcblxuICAgICAgICAgIG1lbWVtYmVkX3dhaXRpbmdfbWVzc2FnZTogJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciBNRU1FTUJFRCBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBtZW1lbWJlZF93YWl0aW5nX2ljb246IGdlYXJfc3RyaW5nLFxuICAgICAgICAgIG1lbWVtYmVkX3RpbWU6ICdMb2FkaW5nIERhdGEnLFxuICAgICAgICAgIG1lbWVtYmVkX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICBnZW50ZGJfd2FpdGluZ19tZXNzYWdlOiAnPGgyPlBsZWFzZSB3YWl0IGZvciBUREIgR2VuZXJhdGlvbiBqb2IgdG8gcHJvY2VzczwvaDI+JyxcbiAgICAgICAgICBnZW50ZGJfd2FpdGluZ19pY29uOiBnZWFyX3N0cmluZyxcbiAgICAgICAgICBnZW50ZGJfdGltZTogJ0xvYWRpbmcgRGF0YScsXG4gICAgICAgICAgZ2VudGRiX2RhdGE6IG51bGwsXG5cbiAgICAgICAgICAvLyBTZXF1ZW5jZSBhbmQgam9iIGluZm9cbiAgICAgICAgICBzZXF1ZW5jZTogJycsXG4gICAgICAgICAgc2VxdWVuY2VfbGVuZ3RoOiAxLFxuICAgICAgICAgIHN1YnNlcXVlbmNlX3N0YXJ0OiAxLFxuICAgICAgICAgIHN1YnNlcXVlbmNlX3N0b3A6IDEsXG4gICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIGJhdGNoX3V1aWQ6IG51bGwsXG5cbiAgICAgICAgICAvL2hvbGQgYW5ub3RhdGlvbnMgdGhhdCBhcmUgcmVhZCBmcm9tIGRhdGFmaWxlc1xuICAgICAgICAgIGFubm90YXRpb25zOiBudWxsLFxuICAgICAgICB9XG59KTtcblxuLy9zZXQgc29tZSB0aGluZ3Mgb24gdGhlIHBhZ2UgZm9yIHRoZSBkZXZlbG9wbWVudCBzZXJ2ZXJcbmlmKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcIjEyNy4wLjAuMVwiKSB7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcsICdkYW5pZWwuYnVjaGFuQHVjbC5hYy51aycpO1xuICByYWN0aXZlLnNldCgnbmFtZScsICd0ZXN0Jyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsICdRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBUycpO1xufVxuXG4vLzRiNmFkNzkyLWVkMWYtMTFlNS04OTg2LTk4OTA5NmMxM2VlNlxubGV0IHV1aWRfcmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9JC9pO1xubGV0IHV1aWRfbWF0Y2ggPSB1dWlkX3JlZ2V4LmV4ZWMoZ2V0VXJsVmFycygpLnV1aWQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEFQUExJQ0FUSU9OIEhFUkVcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0hlcmUgd2VyZSBrZWVwIGFuIGV5ZSBvbiBzb21lIGZvcm0gZWxlbWVudHMgYW5kIHJld3JpdGUgdGhlIG5hbWUgaWYgcGVvcGxlXG4vL2hhdmUgcHJvdmlkZWQgYSBmYXN0YSBmb3JtYXR0ZWQgc2VxXG5sZXQgc2VxX29ic2VydmVyID0gcmFjdGl2ZS5vYnNlcnZlKCdzZXF1ZW5jZScsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgbGV0IHJlZ2V4ID0gL14+KC4rPylcXHMvO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG5ld1ZhbHVlKTtcbiAgaWYobWF0Y2gpXG4gIHtcbiAgICB0aGlzLnNldCgnbmFtZScsIG1hdGNoWzFdKTtcbiAgfVxuICAvLyBlbHNlIHtcbiAgLy8gICB0aGlzLnNldCgnbmFtZScsIG51bGwpO1xuICAvLyB9XG5cbiAgfSxcbiAge2luaXQ6IGZhbHNlLFxuICAgZGVmZXI6IHRydWVcbiB9KTtcbi8vdGhlc2VzIHR3byBvYnNlcnZlcnMgc3RvcCBwZW9wbGUgc2V0dGluZyB0aGUgcmVzdWJtaXNzaW9uIHdpZGdldCBvdXQgb2YgYm91bmRzXG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdG9wJywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9sZW5ndGggPSByYWN0aXZlLmdldCgnc2VxdWVuY2VfbGVuZ3RoJyk7XG4gIGxldCBzZXFfc3RhcnQgPSByYWN0aXZlLmdldCgnc3Vic2VxdWVuY2Vfc3RhcnQnKTtcbiAgaWYodmFsdWUgPiBzZXFfbGVuZ3RoKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXFfbGVuZ3RoKTtcbiAgfVxuICBpZih2YWx1ZSA8PSBzZXFfc3RhcnQpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9zdGFydCsxKTtcbiAgfVxufSk7XG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdGFydCcsIGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGxldCBzZXFfc3RvcCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdG9wJyk7XG4gIGlmKHZhbHVlIDwgMSlcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcsIDEpO1xuICB9XG4gIGlmKHZhbHVlID49IHNlcV9zdG9wKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0Jywgc2VxX3N0b3AtMSk7XG4gIH1cbn0pO1xuXG4vL0FmdGVyIGEgam9iIGhhcyBiZWVuIHNlbnQgb3IgYSBVUkwgYWNjZXB0ZWQgdGhpcyByYWN0aXZlIGJsb2NrIGlzIGNhbGxlZCB0b1xuLy9wb2xsIHRoZSBiYWNrZW5kIHRvIGdldCB0aGUgcmVzdWx0c1xucmFjdGl2ZS5vbigncG9sbF90cmlnZ2VyJywgZnVuY3Rpb24obmFtZSwgam9iX3R5cGUpe1xuICBjb25zb2xlLmxvZyhcIlBvbGxpbmcgYmFja2VuZCBmb3IgcmVzdWx0c1wiKTtcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwgKyByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgYXBwX3BhdGgrJy8mdXVpZD0nK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJykpO1xuICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG5cbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBsZXQgYmF0Y2ggPSBzZW5kX3JlcXVlc3QodXJsLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGRvd25sb2Fkc19pbmZvID0ge307XG5cbiAgICBpZihiYXRjaC5zdGF0ZSA9PT0gJ0NvbXBsZXRlJylcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlbmRlciByZXN1bHRzXCIpO1xuICAgICAgbGV0IHN1Ym1pc3Npb25zID0gYmF0Y2guc3VibWlzc2lvbnM7XG4gICAgICBzdWJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIHByZXBhcmVfZG93bmxvYWRzX2h0bWwoZGF0YSwgZG93bmxvYWRzX2luZm8pO1xuICAgICAgICAgIGhhbmRsZV9yZXN1bHRzKHJhY3RpdmUsIGRhdGEsIGZpbGVfdXJsLCB6aXAsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgfSk7XG4gICAgICBzZXRfZG93bmxvYWRzX3BhbmVsKHJhY3RpdmUsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbi8vIE9uIGNsaWNraW5nIHRoZSBHZXQgWmlwIGZpbGUgbGluayB0aGlzIHdhdGNoZXJzIHByZXBhcmVzIHRoZSB6aXAgYW5kIGhhbmRzIGl0IHRvIHRoZSB1c2VyXG5yYWN0aXZlLm9uKCdnZXRfemlwJywgZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBsZXQgdXVpZCA9IHJhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgemlwLmdlbmVyYXRlQXN5bmMoe3R5cGU6XCJibG9iXCJ9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XG4gICAgICAgIHNhdmVBcyhibG9iLCB1dWlkK1wiLnppcFwiKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGVzZSByZWFjdCB0byB0aGUgaGVhZGVycyBiZWluZyBjbGlja2VkIHRvIHRvZ2dsZSB0aGUgcGFuZWxcbi8vXG5yYWN0aXZlLm9uKCAnc2VxdWVuY2VfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCAwICk7XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgICAgbGV0IHNldHRpbmcgPSBmYWxzZTtcbiAgICAgIGlmKGpvYl9uYW1lID09PSAncHNpcHJlZCcpe3NldHRpbmcgPSB0cnVlO31cbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBzZXR0aW5nKTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnc3RydWN0dXJlX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDAgKTtcbiAgICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBmYWxzZSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAnc3RydWN0dXJlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnZG93bmxvYWRzX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTEsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAncHNpcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDEsIHJhY3RpdmUpO1xuICBpZihyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpKVxuICB7XG4gICAgYmlvZDMucHNpcHJlZChyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gIH1cbn0pO1xucmFjdGl2ZS5vbiggJ2Rpc29wcmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoNCwgcmFjdGl2ZSk7XG4gIGlmKHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpKVxuICB7XG4gICAgYmlvZDMuZ2VuZXJpY3h5TGluZUNoYXJ0KHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICB9XG59KTtcbnJhY3RpdmUub24oICdtZW1zYXRzdm1fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg2LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3BnZW50aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDIsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnbWVtcGFja19hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDUsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnZ2VudGhyZWFkZXJfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg3LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2RvbXByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg4LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3Bkb210aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDksIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnYmlvc2VyZl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDEwLCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2RvbXNlcmZfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCgxMiwgcmFjdGl2ZSk7XG59KTtcbnJhY3RpdmUub24oICdmZnByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCgxMywgcmFjdGl2ZSk7XG59KTtcbnJhY3RpdmUub24oICdtZXRhcHNpY292X2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTgsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnbWV0c2l0ZV9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDE0LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2hzcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDE1LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ21lbWVtYmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTYsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnZ2VudGRiX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTcsIHJhY3RpdmUpO1xufSk7XG5cbnJhY3RpdmUub24oICdzdWJtaXNzaW9uX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIGxldCBzdGF0ZSA9IHJhY3RpdmUuZ2V0KCdzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlJyk7XG4gIGlmKHN0YXRlID09PSAxKXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAwICk7XG4gIH1cbiAgZWxzZXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAxICk7XG4gIH1cbn0pO1xuXG4vL2dyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBtYWluIGZvcm0gYW5kIHNlbmQgdGhlIHNlcXVlbmNlIHRvIHRoZSBiYWNrZW5kXG5yYWN0aXZlLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnU3VibWl0dGluZyBkYXRhJyk7XG4gIGxldCBzZXEgPSB0aGlzLmdldCgnc2VxdWVuY2UnKTtcbiAgc2VxID0gc2VxLnJlcGxhY2UoL14+LiskL21nLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXFxufFxccy9nLFwiXCIpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHNlcSk7XG5cbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgbGV0IGNoZWNrX3N0YXRlcyA9IHt9O1xuICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICBjaGVja19zdGF0ZXNbam9iX25hbWUrJ19qb2InXSA9IHJhY3RpdmUuZ2V0KGpvYl9uYW1lKydfam9iJyk7XG4gICAgY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID0gcmFjdGl2ZS5nZXQoam9iX25hbWUrJ19jaGVja2VkJyk7XG4gIH0pO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIGNoZWNrX3N0YXRlcywgam9iX2xpc3QpO1xuICBldmVudC5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIGdyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBSZXN1Ym1pc3Npb24gd2lkZ2V0LCB0cnVuY2F0ZSB0aGUgc2VxdWVuY2Vcbi8vIGFuZCBzZW5kIGEgbmV3IGpvYlxucmFjdGl2ZS5vbigncmVzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnUmVzdWJtaXR0aW5nIHNlZ21lbnQnKTtcbiAgbGV0IHN0YXJ0ID0gcmFjdGl2ZS5nZXQoXCJzdWJzZXF1ZW5jZV9zdGFydFwiKTtcbiAgbGV0IHN0b3AgPSByYWN0aXZlLmdldChcInN1YnNlcXVlbmNlX3N0b3BcIik7XG4gIGxldCBzZXF1ZW5jZSA9IHJhY3RpdmUuZ2V0KFwic2VxdWVuY2VcIik7XG4gIGxldCBzdWJzZXF1ZW5jZSA9IHNlcXVlbmNlLnN1YnN0cmluZyhzdGFydC0xLCBzdG9wKTtcbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpK1wiX3NlZ1wiO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlX2xlbmd0aCcsIHN1YnNlcXVlbmNlLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc3Vic2VxdWVuY2UubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJywgc3Vic2VxdWVuY2UpO1xuICByYWN0aXZlLnNldCgnbmFtZScsIG5hbWUpO1xuICBsZXQgY2hlY2tfc3RhdGVzID0ge307XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgIGNoZWNrX3N0YXRlc1tqb2JfbmFtZSsnX2pvYiddID0gcmFjdGl2ZS5nZXQoam9iX25hbWUrJ19qb2InKTtcbiAgICBjaGVja19zdGF0ZXNbam9iX25hbWUrJ19jaGVja2VkJ10gPSByYWN0aXZlLmdldChqb2JfbmFtZSsnX2NoZWNrZWQnKTtcbiAgfSk7XG4gIC8vY2xlYXIgd2hhdCB3ZSBoYXZlIHByZXZpb3VzbHkgd3JpdHRlblxuICBjbGVhcl9zZXR0aW5ncyhyYWN0aXZlLCBnZWFyX3N0cmluZywgam9iX2xpc3QpO1xuICAvL3ZlcmlmeSBmb3JtIGNvbnRlbnRzIGFuZCBwb3N0XG4gIC8vY29uc29sZS5sb2cobmFtZSk7XG4gIC8vY29uc29sZS5sb2coZW1haWwpO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzdWJzZXF1ZW5jZSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCwgY2hlY2tfc3RhdGVzLCBqb2JfbGlzdCk7XG4gIC8vd3JpdGUgbmV3IGFubm90YXRpb24gZGlhZ3JhbVxuICAvL3N1Ym1pdCBzdWJzZWN0aW9uXG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gSGVyZSBoYXZpbmcgc2V0IHVwIHJhY3RpdmUgYW5kIHRoZSBmdW5jdGlvbnMgd2UgbmVlZCB3ZSB0aGVuIGNoZWNrXG4vLyBpZiB3ZSB3ZXJlIHByb3ZpZGVkIGEgVVVJRCwgSWYgdGhlIHBhZ2UgaXMgbG9hZGVkIHdpdGggYSBVVUlEIHJhdGhlciB0aGFuIGFcbi8vIGZvcm0gc3VibWl0LlxuLy9UT0RPOiBIYW5kbGUgbG9hZGluZyB0aGF0IHBhZ2Ugd2l0aCB1c2UgdGhlIE1FTVNBVCBhbmQgRElTT1BSRUQgVVVJRFxuLy9cbmlmKGdldFVybFZhcnMoKS51dWlkICYmIHV1aWRfbWF0Y2gpXG57XG4gIGNvbnNvbGUubG9nKCdDYXVnaHQgYW4gaW5jb21pbmcgVVVJRCcpO1xuICBzZXFfb2JzZXJ2ZXIuY2FuY2VsKCk7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7IC8vIHNob3VsZCBtYWtlIGEgZ2VuZXJpYyBvbmUgdmlzaWJsZSB1bnRpbCByZXN1bHRzIGFycml2ZS5cbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgcmFjdGl2ZS5zZXQoXCJiYXRjaF91dWlkXCIsIGdldFVybFZhcnMoKS51dWlkKTtcbiAgbGV0IHByZXZpb3VzX2RhdGEgPSBnZXRfcHJldmlvdXNfZGF0YShnZXRVcmxWYXJzKCkudXVpZCwgc3VibWl0X3VybCwgZmlsZV91cmwsIHJhY3RpdmUpO1xuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BzaXByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA0KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAyKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXBhY2snKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnbWVtcGFja19idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDcpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZG9tcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnZG9tcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdwZG9tdGhyZWFkZXInKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdiaW9zZXJmJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Jpb3NlcmZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEwKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2RvbXNlcmYnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTIpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZmZwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTMpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWV0c2l0ZScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWV0c2l0ZV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTQpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnaHNwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdoc3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE1KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbWVtYmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTYpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZ2VudGRiJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50ZGJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE3KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21ldGFwc2ljb3YnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21ldGFwc2ljb3ZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE4KTtcbiAgfVxuXG5cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gTmV3IFBhbm5lbCBmdW5jdGlvbnNcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb2RlbChhbG5VUkkpIHtcblxuICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBsZXQgbW9kX2tleSA9IHJhY3RpdmUuZ2V0KCdtb2RlbGxlcl9rZXknKTtcbiAgaWYobW9kX2tleSA9PT0gJ00nKydPJysnRCcrJ0UnKydMJysnSScrJ1InKydBJysnTicrJ0onKydFJylcbiAge1xuICAgIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tb2RlbC9wb3N0P2Fsbj1cIitmaWxlX3VybCthbG5VUkksIFwiXCIsIFwid2lkdGg9NjcwLGhlaWdodD03MDBcIik7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgYWxlcnQoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgTScrJ08nKydEJysnRScrJ0wnKydMJysnRScrJ1IgTGljZW5jZSBLZXknKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL21haW4uanMiLCJpbXBvcnQgeyBzZW5kX2pvYiB9IGZyb20gJy4uL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGlzSW5BcnJheSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuaW1wb3J0IHsgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5cbi8vVGFrZXMgdGhlIGRhdGEgbmVlZGVkIHRvIHZlcmlmeSB0aGUgaW5wdXQgZm9ybSBkYXRhLCBlaXRoZXIgdGhlIG1haW4gZm9ybVxuLy9vciB0aGUgc3VibWlzc29uIHdpZGdldCB2ZXJpZmllcyB0aGF0IGRhdGEgYW5kIHRoZW4gcG9zdHMgaXQgdG8gdGhlIGJhY2tlbmQuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBjaGVja19zdGF0ZXMsIGpvYl9saXN0KVxue1xuICAvKnZlcmlmeSB0aGF0IGV2ZXJ5dGhpbmcgaGVyZSBpcyBvayovXG4gIGxldCBlcnJvcl9tZXNzYWdlPW51bGw7XG4gIGxldCBqb2Jfc3RyaW5nID0gJyc7XG4gIC8vZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkXSk7XG5cbiAgZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2hlY2tfc3RhdGVzLnBzaXByZWRfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLmRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLm1lbXNhdHN2bV9jaGVja2VkLCBjaGVja19zdGF0ZXMucGdlbnRocmVhZGVyX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLm1lbXBhY2tfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLmdlbnRocmVhZGVyX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmRvbXByZWRfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLnBkb210aHJlYWRlcl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3N0YXRlcy5iaW9zZXJmX2NoZWNrZWQsIGNoZWNrX3N0YXRlcy5kb21zZXJmX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmZmcHJlZF9jaGVja2VkLCBjaGVja19zdGF0ZXMubWV0YXBzaWNvdl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3N0YXRlcy5jaGVja19zdGF0ZXMsIGNoZWNrX3N0YXRlcy5tZXRzaXRlX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmhzcHJlZF9jaGVja2VkLCBjaGVja19zdGF0ZXMubWVtZW1iZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja19zdGF0ZXMuZ2VudGRiX2NoZWNrZWRdKTtcbiAgaWYoZXJyb3JfbWVzc2FnZS5sZW5ndGggPiAwKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ2Zvcm1fZXJyb3InLCBlcnJvcl9tZXNzYWdlKTtcbiAgICBhbGVydChcIkZPUk0gRVJST1I6XCIrZXJyb3JfbWVzc2FnZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9pbml0aWFsaXNlIHRoZSBwYWdlXG4gICAgbGV0IHJlc3BvbnNlID0gdHJ1ZTtcbiAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTtcbiAgICAvL1Bvc3QgdGhlIGpvYnMgYW5kIGludGlhbGlzZSB0aGUgYW5ub3RhdGlvbnMgZm9yIGVhY2ggam9iXG4gICAgLy9XZSBhbHNvIGRvbid0IHJlZHVuZGFudGx5IHNlbmQgZXh0cmEgcHNpcHJlZCBldGMuLiBqb2JzXG4gICAgLy9ieXQgZG9pbmcgdGhlc2UgdGVzdCBpbiBhIHNwZWNpZmljIG9yZGVyXG4gICAgaWYoY2hlY2tfc3RhdGVzLnBnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBnZW50aHJlYWRlcixcIik7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRpc29wcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZGlzb3ByZWQsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLnBzaXByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJwc2lwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMubWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtc2F0c3ZtLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZW1wYWNrX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtcGFjayxcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWVtcGFja19idXR0b24nLCB0cnVlKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5nZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImdlbnRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRvbXByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkb21wcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkb21wcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMucGRvbXRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwicGRvbXRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZG9tdGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5iaW9zZXJmX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiYmlvc2VyZixcIik7XG4gICAgICByYWN0aXZlLnNldCgnYmlvc2VyZl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRvbXNlcmZfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkb21zZXJmLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkb21zZXJmX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMuZmZwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZmZwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdmZnByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZXRhcHNpY292X2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWV0YXBzaWNvdixcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWV0YXBzaWNvdl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLm1ldHNpdGVfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJtZXRzaXRlLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZXRzaXRlX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMuaHNwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiaHNwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdoc3ByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZW1lbWJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1lbWVtYmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmdlbnRkYl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImdlbnRkYixcIik7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGRiX2J1dHRvbicsIHRydWUpO1xuICAgIH1cblxuICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLnNsaWNlKDAsIC0xKTtcbiAgICByZXNwb25zZSA9IHNlbmRfam9iKHJhY3RpdmUsIGpvYl9zdHJpbmcsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCk7XG4gICAgLy9zZXQgdmlzaWJpbGl0eSBhbmQgcmVuZGVyIHBhbmVsIG9uY2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvYl9saXN0Lmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGxldCBqb2JfbmFtZSA9IGpvYl9saXN0W2ldO1xuICAgICAgaWYoY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID09PSB0cnVlICYmIHJlc3BvbnNlIClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICAgIHJhY3RpdmUuZmlyZSggam9iX25hbWUrJ19hY3RpdmUnICk7XG4gICAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2Zvcm0oc2VxLCBqb2JfbmFtZSwgZW1haWwsIGNoZWNrZWRfYXJyYXkpXG57XG4gIGxldCBlcnJvcl9tZXNzYWdlID0gXCJcIjtcbiAgaWYoISAvXltcXHgwMC1cXHg3Rl0rJC8udGVzdChqb2JfbmFtZSkpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiUGxlYXNlIHJlc3RyaWN0IEpvYiBOYW1lcyB0byB2YWxpZCBsZXR0ZXJzIG51bWJlcnMgYW5kIGJhc2ljIHB1bmN0dWF0aW9uPGJyIC8+XCI7XG4gIH1cblxuICAvKiBsZW5ndGggY2hlY2tzICovXG4gIGlmKHNlcS5sZW5ndGggPiAxNTAwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIGxvbmcgdG8gcHJvY2VzczxiciAvPlwiO1xuICB9XG4gIGlmKHNlcS5sZW5ndGggPCAzMClcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGlzIHRvbyBzaG9ydCB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cblxuICAvKiBudWNsZW90aWRlIGNoZWNrcyAqL1xuICBsZXQgbnVjbGVvdGlkZV9jb3VudCA9IChzZXEubWF0Y2goL0F8VHxDfEd8VXxOfGF8dHxjfGd8dXxuL2cpfHxbXSkubGVuZ3RoO1xuICBpZigobnVjbGVvdGlkZV9jb3VudC9zZXEubGVuZ3RoKSA+IDAuOTUpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBhcHBlYXJzIHRvIGJlIG51Y2xlb3RpZGUgc2VxdWVuY2UuIFRoaXMgc2VydmljZSByZXF1aXJlcyBwcm90ZWluIHNlcXVlbmNlIGFzIGlucHV0PGJyIC8+XCI7XG4gIH1cbiAgaWYoL1teQUNERUZHSElLTE1OUFFSU1RWV1lYXy1dKy9pLnRlc3Qoc2VxKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczxiciAvPlwiO1xuICB9XG5cbiAgaWYoaXNJbkFycmF5KHRydWUsIGNoZWNrZWRfYXJyYXkpID09PSBmYWxzZSkge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuYWx5c2lzIHByb2dyYW1cIjtcbiAgfVxuICByZXR1cm4oZXJyb3JfbWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvZm9ybXMvZm9ybXNfaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9