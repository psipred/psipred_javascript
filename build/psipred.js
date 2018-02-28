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
  'psipred': 'PSIPRED V4.0',
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

let initialisation_data = {
  sequence_form_visible: 1,
  structure_form_visible: 0,
  results_visible: 1,
  results_panel_visible: 1,
  submission_widget_visible: 0,
  modeller_key: null,
  download_links: '',
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
  dompred_data: null,
  pdomthreader_data: null,
  bioserf_data: null,
  domserf_data: null,
  ffpred_data: null,
  metapsicov_data: null,
  metsite_data: null,
  hspred_data: null,
  memembed_data: null,
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
};
job_list.forEach(function (job_name) {
  initialisation_data[job_name + '_checked'] = false;
  initialisation_data[job_name + '_button'] = false;
  initialisation_data[job_name + '_job'] = job_name + '_job';
  initialisation_data[job_name + '_waiting_message'] = '<h2>Please wait for your ' + job_names[job_name] + ' job to process</h2>';
  initialisation_data[job_name + '_waiting_icon'] = gear_string;
  initialisation_data[job_name + '_waiting_time'] = 'Loading Data';
});

// DECLARE VARIABLES and init ractive instance
var ractive = new Ractive({
  el: '#psipred_site',
  template: '#form_template',
  data: initialisation_data
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzQ4MjQ2ZWYwODA4OTRmNWM0ZmYiLCJ3ZWJwYWNrOi8vLy4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29tbW9uL2NvbW1vbl9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Zvcm1zL2Zvcm1zX2luZGV4LmpzIl0sIm5hbWVzIjpbImdldF9tZW1zYXRfcmFuZ2VzIiwicmVnZXgiLCJkYXRhIiwibWF0Y2giLCJleGVjIiwiaW5jbHVkZXMiLCJyZWdpb25zIiwic3BsaXQiLCJmb3JFYWNoIiwicmVnaW9uIiwiaSIsInBhcnNlSW50IiwiY29uc29sZSIsImxvZyIsInNlZyIsInBhcnNlX3NzMiIsInJhY3RpdmUiLCJmaWxlIiwiYW5ub3RhdGlvbnMiLCJnZXQiLCJsaW5lcyIsInNoaWZ0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImxpbmUiLCJlbnRyaWVzIiwic3MiLCJzZXQiLCJiaW9kMyIsImFubm90YXRpb25HcmlkIiwicGFyZW50IiwibWFyZ2luX3NjYWxlciIsImRlYnVnIiwiY29udGFpbmVyX3dpZHRoIiwid2lkdGgiLCJoZWlnaHQiLCJjb250YWluZXJfaGVpZ2h0IiwiYWxlcnQiLCJwYXJzZV9wYmRhdCIsImRpc29wcmVkIiwicGFyc2VfY29tYiIsInByZWNpc2lvbiIsInBvcyIsImdlbmVyaWN4eUxpbmVDaGFydCIsImNoYXJ0VHlwZSIsInlfY3V0b2ZmIiwicGFyc2VfbWVtc2F0ZGF0YSIsInNlcSIsInRvcG9fcmVnaW9ucyIsInNpZ25hbF9yZWdpb25zIiwicmVlbnRyYW50X3JlZ2lvbnMiLCJ0ZXJtaW5hbCIsImNvaWxfdHlwZSIsInRtcF9hbm5vIiwiQXJyYXkiLCJwcmV2X2VuZCIsImZpbGwiLCJhbm5vIiwibWVtc2F0IiwicGFyc2VfcHJlc3VsdCIsInR5cGUiLCJhbm5fbGlzdCIsIk9iamVjdCIsImtleXMiLCJwc2V1ZG9fdGFibGUiLCJ0b0xvd2VyQ2FzZSIsInBkYiIsInN1YnN0cmluZyIsImFsbiIsImFubiIsInNob3dfcGFuZWwiLCJ2YWx1ZSIsImNsZWFyX3NldHRpbmdzIiwiZ2Vhcl9zdHJpbmciLCJqb2JfbGlzdCIsImpvYl9uYW1lIiwidG9VcHBlckNhc2UiLCJjbGVhclNlbGVjdGlvbiIsInppcCIsIkpTWmlwIiwicHJlcGFyZV9kb3dubG9hZHNfaHRtbCIsImRvd25sb2Fkc19pbmZvIiwicHNpcHJlZCIsImhlYWRlciIsIm1lbXNhdHN2bSIsInBnZW50aHJlYWRlciIsIm1lbXBhY2siLCJnZW50aHJlYWRlciIsImRvbXByZWQiLCJwZG9tdGhyZWFkZXIiLCJiaW9zZXJmIiwiZG9tc2VyZiIsImZmcHJlZCIsIm1ldGFwc2ljb3YiLCJtZXRzaXRlIiwiaHNwcmVkIiwibWVtZW1iZWQiLCJnZW50ZGIiLCJoYW5kbGVfcmVzdWx0cyIsImZpbGVfdXJsIiwiaG9yaXpfcmVnZXgiLCJzczJfcmVnZXgiLCJtZW1zYXRfY2FydG9vbl9yZWdleCIsIm1lbXNhdF9zY2hlbWF0aWNfcmVnZXgiLCJtZW1zYXRfZGF0YV9yZWdleCIsIm1lbXBhY2tfY2FydG9vbl9yZWdleCIsIm1lbXBhY2tfZ3JhcGhfb3V0IiwibWVtcGFja19jb250YWN0X3JlcyIsIm1lbXBhY2tfbGlwaWRfcmVzIiwibWVtcGFja19yZXN1bHRfZm91bmQiLCJpbWFnZV9yZWdleCIsInJlc3VsdHMiLCJyZXN1bHRfZGljdCIsIm5hbWUiLCJhbm5fc2V0IiwidG1wIiwiZGF0YV9wYXRoIiwicGF0aCIsInN1YnN0ciIsImxhc3RJbmRleE9mIiwiaWQiLCJwcm9jZXNzX2ZpbGUiLCJob3JpeiIsInNzMl9tYXRjaCIsInNzMiIsInBiZGF0IiwiY29tYiIsInNjaGVtZV9tYXRjaCIsInNjaGVtYXRpYyIsImNhcnRvb25fbWF0Y2giLCJjYXJ0b29uIiwibWVtc2F0X21hdGNoIiwiZ3JhcGhfbWF0Y2giLCJncmFwaF9vdXQiLCJjb250YWN0X21hdGNoIiwiY29udGFjdCIsImxpcGlkX21hdGNoIiwibGlwaWRfb3V0IiwidGFibGUiLCJhbGlnbiIsInNldF9kb3dubG9hZHNfcGFuZWwiLCJkb3dubG9hZHNfc3RyaW5nIiwiY29uY2F0IiwiaXNJbkFycmF5IiwiYXJyYXkiLCJpbmRleE9mIiwiZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIiwicmVzaWR1ZXMiLCJyZXMiLCJwdXNoIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJwYXJ0cyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJtIiwia2V5IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbXBvcnRhbnQiLCJzdHlsZSIsImdldEVtUGl4ZWxzIiwiZWxlbWVudCIsImV4dHJhQm9keSIsImNyZWF0ZUVsZW1lbnQiLCJjc3NUZXh0IiwiaW5zZXJ0QmVmb3JlIiwiYm9keSIsInRlc3RFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJjbGllbnRXaWR0aCIsInJlbW92ZUNoaWxkIiwic2VuZF9yZXF1ZXN0IiwidXJsIiwic2VuZF9kYXRhIiwicmVzcG9uc2UiLCIkIiwiYWpheCIsImNhY2hlIiwiY29udGVudFR5cGUiLCJwcm9jZXNzRGF0YSIsImFzeW5jIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwiZXJyb3IiLCJyZXNwb25zZVRleHQiLCJyZXNwb25zZUpTT04iLCJzZW5kX2pvYiIsImVtYWlsIiwic3VibWl0X3VybCIsInRpbWVzX3VybCIsInVwcGVyX25hbWUiLCJCbG9iIiwiZSIsImZkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZV9kYXRhIiwidGltZXMiLCJrIiwiZmlyZSIsImdldF9wcmV2aW91c19kYXRhIiwidXVpZCIsInN1Ym1pc3Npb25fcmVzcG9uc2UiLCJnZXRfdGV4dCIsInN1Ym1pc3Npb25zIiwiaW5wdXRfZmlsZSIsImpvYnMiLCJzdWJtaXNzaW9uIiwic2xpY2UiLCJzdWJtaXNzaW9uX25hbWUiLCJ1cmxfc3R1YiIsImN0bCIsInBhdGhfYml0cyIsImZvbGRlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGlwYm9hcmQiLCJDbGlwYm9hcmQiLCJvbiIsImVuZHBvaW50c191cmwiLCJnZWFyc19zdmciLCJtYWluX3VybCIsImFwcF9wYXRoIiwiam9iX25hbWVzIiwiaG9zdG5hbWUiLCJpbml0aWFsaXNhdGlvbl9kYXRhIiwic2VxdWVuY2VfZm9ybV92aXNpYmxlIiwic3RydWN0dXJlX2Zvcm1fdmlzaWJsZSIsInJlc3VsdHNfdmlzaWJsZSIsInJlc3VsdHNfcGFuZWxfdmlzaWJsZSIsInN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUiLCJtb2RlbGxlcl9rZXkiLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfaG9yaXoiLCJkaXNvX3ByZWNpc2lvbiIsIm1lbXNhdHN2bV9zY2hlbWF0aWMiLCJtZW1zYXRzdm1fY2FydG9vbiIsInBnZW5fdGFibGUiLCJwZ2VuX2Fubl9zZXQiLCJtZW1zYXRwYWNrX3NjaGVtYXRpYyIsIm1lbXNhdHBhY2tfY2FydG9vbiIsImdlbl90YWJsZSIsImdlbl9hbm5fc2V0IiwiZG9tcHJlZF9kYXRhIiwicGRvbXRocmVhZGVyX2RhdGEiLCJiaW9zZXJmX2RhdGEiLCJkb21zZXJmX2RhdGEiLCJmZnByZWRfZGF0YSIsIm1ldGFwc2ljb3ZfZGF0YSIsIm1ldHNpdGVfZGF0YSIsImhzcHJlZF9kYXRhIiwibWVtZW1iZWRfZGF0YSIsImdlbnRkYl9kYXRhIiwic2VxdWVuY2UiLCJzZXF1ZW5jZV9sZW5ndGgiLCJzdWJzZXF1ZW5jZV9zdGFydCIsInN1YnNlcXVlbmNlX3N0b3AiLCJiYXRjaF91dWlkIiwiUmFjdGl2ZSIsImVsIiwidGVtcGxhdGUiLCJ1dWlkX3JlZ2V4IiwidXVpZF9tYXRjaCIsInNlcV9vYnNlcnZlciIsIm9ic2VydmUiLCJuZXdWYWx1ZSIsIm9sZFZhbHVlIiwiaW5pdCIsImRlZmVyIiwic2VxX2xlbmd0aCIsInNlcV9zdGFydCIsInNlcV9zdG9wIiwiam9iX3R5cGUiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImJhdGNoIiwic3RhdGUiLCJjbGVhckludGVydmFsIiwic3VibWlzc2lvbl9tZXNzYWdlIiwibGFzdF9tZXNzYWdlIiwiY29udGV4dCIsImdlbmVyYXRlQXN5bmMiLCJ0aGVuIiwiYmxvYiIsInNhdmVBcyIsImV2ZW50Iiwic2V0dGluZyIsImNoZWNrX3N0YXRlcyIsInZlcmlmeV9hbmRfc2VuZF9mb3JtIiwib3JpZ2luYWwiLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Iiwic3RvcCIsInN1YnNlcXVlbmNlIiwiY2FuY2VsIiwicHJldmlvdXNfZGF0YSIsImxvYWROZXdBbGlnbm1lbnQiLCJhbG5VUkkiLCJhbm5VUkkiLCJ0aXRsZSIsIm9wZW4iLCJidWlsZE1vZGVsIiwibW9kX2tleSIsImVycm9yX21lc3NhZ2UiLCJqb2Jfc3RyaW5nIiwidmVyaWZ5X2Zvcm0iLCJwc2lwcmVkX2NoZWNrZWQiLCJkaXNvcHJlZF9jaGVja2VkIiwibWVtc2F0c3ZtX2NoZWNrZWQiLCJwZ2VudGhyZWFkZXJfY2hlY2tlZCIsIm1lbXBhY2tfY2hlY2tlZCIsImdlbnRocmVhZGVyX2NoZWNrZWQiLCJkb21wcmVkX2NoZWNrZWQiLCJwZG9tdGhyZWFkZXJfY2hlY2tlZCIsImJpb3NlcmZfY2hlY2tlZCIsImRvbXNlcmZfY2hlY2tlZCIsImZmcHJlZF9jaGVja2VkIiwibWV0YXBzaWNvdl9jaGVja2VkIiwibWV0c2l0ZV9jaGVja2VkIiwiaHNwcmVkX2NoZWNrZWQiLCJtZW1lbWJlZF9jaGVja2VkIiwiZ2VudGRiX2NoZWNrZWQiLCJjaGVja2VkX2FycmF5IiwidGVzdCIsIm51Y2xlb3RpZGVfY291bnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVB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QyxDQUFILEVBQ0E7QUFDRXFRLG9CQUFnQkEsZ0JBQWdCLGlEQUFoQztBQUNEOztBQUVELE1BQUcsaUdBQUFySyxDQUFVLElBQVYsRUFBZ0J3TCxhQUFoQixNQUFtQyxLQUF0QyxFQUE2QztBQUMzQ25CLG9CQUFnQkEsZ0JBQWdCLCtDQUFoQztBQUNEO0FBQ0QsU0FBT0EsYUFBUDtBQUNELEMiLCJmaWxlIjoicHNpcHJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjNDgyNDZlZjA4MDg5NGY1YzRmZiIsIlxuLy8gZm9yIGEgZ2l2ZW4gbWVtc2F0IGRhdGEgZmlsZXMgZXh0cmFjdCBjb29yZGluYXRlIHJhbmdlcyBnaXZlbiBzb21lIHJlZ2V4XG5leHBvcnQgZnVuY3Rpb24gZ2V0X21lbXNhdF9yYW5nZXMocmVnZXgsIGRhdGEpXG57XG4gICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhkYXRhKTtcbiAgICBpZihtYXRjaFsxXS5pbmNsdWRlcygnLCcpKVxuICAgIHtcbiAgICAgIGxldCByZWdpb25zID0gbWF0Y2hbMV0uc3BsaXQoJywnKTtcbiAgICAgIHJlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24sIGkpe1xuICAgICAgICByZWdpb25zW2ldID0gcmVnaW9uLnNwbGl0KCctJyk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMF0gPSBwYXJzZUludChyZWdpb25zW2ldWzBdKTtcbiAgICAgICAgcmVnaW9uc1tpXVsxXSA9IHBhcnNlSW50KHJlZ2lvbnNbaV1bMV0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ocmVnaW9ucyk7XG4gICAgfVxuICAgIGVsc2UgaWYobWF0Y2hbMV0uaW5jbHVkZXMoJy0nKSlcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoWzFdKTtcbiAgICAgICAgbGV0IHNlZyA9IG1hdGNoWzFdLnNwbGl0KCctJyk7XG4gICAgICAgIGxldCByZWdpb25zID0gW1tdLCBdO1xuICAgICAgICByZWdpb25zWzBdWzBdID0gcGFyc2VJbnQoc2VnWzBdKTtcbiAgICAgICAgcmVnaW9uc1swXVsxXSA9IHBhcnNlSW50KHNlZ1sxXSk7XG4gICAgICAgIHJldHVybihyZWdpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuKG1hdGNoWzFdKTtcbn1cblxuLy8gdGFrZSBhbmQgc3MyIChmaWxlKSBhbmQgcGFyc2UgdGhlIGRldGFpbHMgYW5kIHdyaXRlIHRoZSBuZXcgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2Vfc3MyKHJhY3RpdmUsIGZpbGUpXG57XG4gICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgbGluZXMuc2hpZnQoKTtcbiAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBhbm5vdGF0aW9uc1tpXS5zcyA9IGVudHJpZXNbM107XG4gICAgICB9KTtcbiAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBhbGVydChcIlNTMiBhbm5vdGF0aW9uIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCBxdWVyeSBzZXF1ZW5jZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuKGFubm90YXRpb25zKTtcbn1cblxuLy90YWtlIHRoZSBkaXNvcHJlZCBwYmRhdCBmaWxlLCBwYXJzZSBpdCBhbmQgYWRkIHRoZSBhbm5vdGF0aW9ucyB0byB0aGUgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfcGJkYXQocmFjdGl2ZSwgZmlsZSlcbntcbiAgICBsZXQgYW5ub3RhdGlvbnMgPSByYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKTtcbiAgICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICAgIGxpbmVzID0gbGluZXMuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmKGFubm90YXRpb25zLmxlbmd0aCA9PSBsaW5lcy5sZW5ndGgpXG4gICAge1xuICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICAgICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGlmKGVudHJpZXNbM10gPT09ICctJyl7YW5ub3RhdGlvbnNbaV0uZGlzb3ByZWQgPSAnRCc7fVxuICAgICAgICBpZihlbnRyaWVzWzNdID09PSAnXicpe2Fubm90YXRpb25zW2ldLmRpc29wcmVkID0gJ1BCJzt9XG4gICAgICB9KTtcbiAgICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgICAgIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgfVxufVxuXG4vL3BhcnNlIHRoZSBkaXNvcHJlZCBjb21iIGZpbGUgYW5kIGFkZCBpdCB0byB0aGUgYW5ub3RhdGlvbiBncmlkXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VfY29tYihyYWN0aXZlLCBmaWxlKVxue1xuICBsZXQgcHJlY2lzaW9uID0gW107XG4gIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpOyBsaW5lcy5zaGlmdCgpO1xuICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICBwcmVjaXNpb25baV0gPSB7fTtcbiAgICBwcmVjaXNpb25baV0ucG9zID0gZW50cmllc1sxXTtcbiAgICBwcmVjaXNpb25baV0ucHJlY2lzaW9uID0gZW50cmllc1s0XTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCdkaXNvX3ByZWNpc2lvbicsIHByZWNpc2lvbik7XG4gIGJpb2QzLmdlbmVyaWN4eUxpbmVDaGFydChwcmVjaXNpb24sICdwb3MnLCBbJ3ByZWNpc2lvbiddLCBbJ0JsYWNrJyxdLCAnRGlzb05OQ2hhcnQnLCB7cGFyZW50OiAnZGl2LmNvbWJfcGxvdCcsIGNoYXJ0VHlwZTogJ2xpbmUnLCB5X2N1dG9mZjogMC41LCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG5cbn1cblxuLy9wYXJzZSB0aGUgbWVtc2F0IG91dHB1dFxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX21lbXNhdGRhdGEocmFjdGl2ZSwgZmlsZSlcbntcbiAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gIGxldCBzZXEgPSByYWN0aXZlLmdldCgnc2VxdWVuY2UnKTtcbiAgLy9jb25zb2xlLmxvZyhmaWxlKTtcbiAgbGV0IHRvcG9fcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9Ub3BvbG9neTpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgbGV0IHNpZ25hbF9yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1NpZ25hbFxcc3BlcHRpZGU6XFxzKyguKylcXG4vLCBmaWxlKTtcbiAgbGV0IHJlZW50cmFudF9yZWdpb25zID0gZ2V0X21lbXNhdF9yYW5nZXMoL1JlLWVudHJhbnRcXHNoZWxpY2VzOlxccysoLis/KVxcbi8sIGZpbGUpO1xuICBsZXQgdGVybWluYWwgPSBnZXRfbWVtc2F0X3JhbmdlcygvTi10ZXJtaW5hbDpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgLy9jb25zb2xlLmxvZyhzaWduYWxfcmVnaW9ucyk7XG4gIC8vIGNvbnNvbGUubG9nKHJlZW50cmFudF9yZWdpb25zKTtcbiAgbGV0IGNvaWxfdHlwZSA9ICdDWSc7XG4gIGlmKHRlcm1pbmFsID09PSAnb3V0JylcbiAge1xuICAgIGNvaWxfdHlwZSA9ICdFQyc7XG4gIH1cbiAgbGV0IHRtcF9hbm5vID0gbmV3IEFycmF5KHNlcS5sZW5ndGgpO1xuICBpZih0b3BvX3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJylcbiAge1xuICAgIGxldCBwcmV2X2VuZCA9IDA7XG4gICAgdG9wb19yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnVE0nLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICAgIGlmKHByZXZfZW5kID4gMCl7cHJldl9lbmQgLT0gMTt9XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoY29pbF90eXBlLCBwcmV2X2VuZCwgcmVnaW9uWzBdKTtcbiAgICAgIGlmKGNvaWxfdHlwZSA9PT0gJ0VDJyl7IGNvaWxfdHlwZSA9ICdDWSc7fWVsc2V7Y29pbF90eXBlID0gJ0VDJzt9XG4gICAgICBwcmV2X2VuZCA9IHJlZ2lvblsxXSsyO1xuICAgIH0pO1xuICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbChjb2lsX3R5cGUsIHByZXZfZW5kLTEsIHNlcS5sZW5ndGgpO1xuXG4gIH1cbiAgLy9zaWduYWxfcmVnaW9ucyA9IFtbNzAsODNdLCBbMTAyLDExN11dO1xuICBpZihzaWduYWxfcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKXtcbiAgICBzaWduYWxfcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1MnLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICB9KTtcbiAgfVxuICAvL3JlZW50cmFudF9yZWdpb25zID0gW1s0MCw1MF0sIFsyMDAsMjE4XV07XG4gIGlmKHJlZW50cmFudF9yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpe1xuICAgIHJlZW50cmFudF9yZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKXtcbiAgICAgIHRtcF9hbm5vID0gdG1wX2Fubm8uZmlsbCgnUkgnLCByZWdpb25bMF0sIHJlZ2lvblsxXSsxKTtcbiAgICB9KTtcbiAgfVxuICB0bXBfYW5uby5mb3JFYWNoKGZ1bmN0aW9uKGFubm8sIGkpe1xuICAgIGFubm90YXRpb25zW2ldLm1lbXNhdCA9IGFubm87XG4gIH0pO1xuICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gIGJpb2QzLmFubm90YXRpb25HcmlkKGFubm90YXRpb25zLCB7cGFyZW50OiAnZGl2LnNlcXVlbmNlX3Bsb3QnLCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX3ByZXN1bHQocmFjdGl2ZSwgZmlsZSwgdHlwZSlcbntcbiAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gIC8vY29uc29sZS5sb2codHlwZSsnX2Fubl9zZXQnKTtcbiAgbGV0IGFubl9saXN0ID0gcmFjdGl2ZS5nZXQodHlwZSsnX2Fubl9zZXQnKTtcbiAgLy9jb25zb2xlLmxvZyhhbm5fbGlzdCk7XG4gIGlmKE9iamVjdC5rZXlzKGFubl9saXN0KS5sZW5ndGggPiAwKXtcbiAgbGV0IHBzZXVkb190YWJsZSA9ICc8dGFibGUgY2xhc3M9XCJzbWFsbC10YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkXCI+XFxuJztcbiAgcHNldWRvX3RhYmxlICs9ICc8dHI+PHRoPkNvbmYuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5OZXQgU2NvcmU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPnAtdmFsdWU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlBhaXJFPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Tb2x2RTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxuIFNjb3JlPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5BbG4gTGVuZ3RoPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TdHIgTGVuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TZXEgTGVuPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5Gb2xkPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggU0NPUDwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+U0VBUkNIIENBVEg8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPlBEQlNVTTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxpZ25tZW50PC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5NT0RFTDwvdGg+JztcblxuICAvLyBpZiBNT0RFTExFUiBUSElOR1lcbiAgcHNldWRvX3RhYmxlICs9ICc8L3RyPjx0Ym9keVwiPlxcbic7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgaWYobGluZS5sZW5ndGggPT09IDApe3JldHVybjt9XG4gICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgaWYoZW50cmllc1s5XStcIl9cIitpIGluIGFubl9saXN0KVxuICAgIHtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dHI+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkIGNsYXNzPSdcIitlbnRyaWVzWzBdLnRvTG93ZXJDYXNlKCkrXCInPlwiK2VudHJpZXNbMF0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzFdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1syXStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbM10rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzRdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s1XStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNl0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzddK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s4XStcIjwvdGQ+XCI7XG4gICAgbGV0IHBkYiA9IGVudHJpZXNbOV0uc3Vic3RyaW5nKDAsIGVudHJpZXNbOV0ubGVuZ3RoLTIpO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cHM6Ly93d3cucmNzYi5vcmcvcGRiL2V4cGxvcmUvZXhwbG9yZS5kbz9zdHJ1Y3R1cmVJZD1cIitwZGIrXCInPlwiK2VudHJpZXNbOV0rXCI8L2E+PC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly9zY29wLm1yYy1sbWIuY2FtLmFjLnVrL3Njb3AvcGRiLmNnaT9wZGI9XCIrcGRiK1wiJz5TQ09QIFNFQVJDSDwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5jYXRoZGIuaW5mby9wZGIvXCIrcGRiK1wiJz5DQVRIIFNFQVJDSDwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5lYmkuYWMudWsvdGhvcm50b24tc3J2L2RhdGFiYXNlcy9jZ2ktYmluL3BkYnN1bS9HZXRQYWdlLnBsP3BkYmNvZGU9XCIrcGRiK1wiJz5PcGVuIFBEQlNVTTwvYT48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdwc2lwcmVkLmxvYWROZXdBbGlnbm1lbnQoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiLFxcXCJcIisoYW5uX2xpc3RbZW50cmllc1s5XStcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKGVudHJpZXNbOV0rXCJfXCIraSkrXCJcXFwiKTsnIHZhbHVlPSdEaXNwbGF5IEFsaWdubWVudCcgLz48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48aW5wdXQgY2xhc3M9J2J1dHRvbicgdHlwZT0nYnV0dG9uJyBvbkNsaWNrPSdwc2lwcmVkLmJ1aWxkTW9kZWwoXFxcIlwiKyhhbm5fbGlzdFtlbnRyaWVzWzldK1wiX1wiK2ldLmFsbikrXCJcXFwiKTsnIHZhbHVlPSdCdWlsZCBNb2RlbCcgLz48L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjwvdHI+XFxuXCI7XG4gICAgfVxuICB9KTtcbiAgcHNldWRvX3RhYmxlICs9IFwiPC90Ym9keT48L3RhYmxlPlxcblwiO1xuICByYWN0aXZlLnNldCh0eXBlK1wiX3RhYmxlXCIsIHBzZXVkb190YWJsZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgICByYWN0aXZlLnNldCh0eXBlK1wiX3RhYmxlXCIsIFwiPGgzPk5vIGdvb2QgaGl0cyBmb3VuZC4gR1VFU1MgYW5kIExPVyBjb25maWRlbmNlIGhpdHMgY2FuIGJlIGZvdW5kIGluIHRoZSByZXN1bHRzIGZpbGU8L2gzPlwiKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsImltcG9ydCB7IHByb2Nlc3NfZmlsZSB9IGZyb20gJy4uL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dfcGFuZWwodmFsdWUsIHJhY3RpdmUpXG57XG4gIHJhY3RpdmUuc2V0KCAncmVzdWx0c19wYW5lbF92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIHZhbHVlICk7XG59XG5cbi8vYmVmb3JlIGEgcmVzdWJtaXNzaW9uIGlzIHNlbnQgYWxsIHZhcmlhYmxlcyBhcmUgcmVzZXQgdG8gdGhlIHBhZ2UgZGVmYXVsdHNcbmV4cG9ydCBmdW5jdGlvbiBjbGVhcl9zZXR0aW5ncyhyYWN0aXZlLCBnZWFyX3N0cmluZywgam9iX2xpc3Qpe1xuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMik7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCgnZG93bmxvYWRfbGlua3MnLCAnJyk7XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgIHJhY3RpdmUuc2V0KGpvYl9uYW1lKydfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciAnK2pvYl9uYW1lLnRvVXBwZXJDYXNlKCkrJyBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ193YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLG51bGwpO1xuICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9zY2hlbWF0aWMnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fdGFibGUnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VuX3NldCcsIHt9KTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbl90YWJsZScsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbl9zZXQnLCB7fSk7XG5cbiAgLy9yYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nKTtcbiAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJyxudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ2JhdGNoX3V1aWQnLG51bGwpO1xuICBiaW9kMy5jbGVhclNlbGVjdGlvbignZGl2LnNlcXVlbmNlX3Bsb3QnKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5wc2lwcmVkX2NhcnRvb24nKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5jb21iX3Bsb3QnKTtcblxuICB6aXAgPSBuZXcgSlNaaXAoKTtcbn1cblxuLy9UYWtlIGEgY291cGxlIG9mIHZhcmlhYmxlcyBhbmQgcHJlcGFyZSB0aGUgaHRtbCBzdHJpbmdzIGZvciB0aGUgZG93bmxvYWRzIHBhbmVsXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZV9kb3dubG9hZHNfaHRtbChkYXRhLCBkb3dubG9hZHNfaW5mbylcbntcbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygncHNpcHJlZCcpKVxuICB7XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaGVhZGVyID0gXCI8aDU+UHNpcHJlZCBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ2Rpc29wcmVkJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmhlYWRlciA9IFwiPGg1PkRpc29QcmVkRCBET1dOTE9BRFM8L2g1PlwiO1xuICB9XG4gIGlmKGRhdGEuam9iX25hbWUuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICB7XG4gICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyID0gXCI8aDU+TUVNU0FUU1ZNIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygncGdlbnRocmVhZGVyJykpXG4gIHtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyID0gXCI8aDU+cEdlblRIUkVBREVSIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWVtcGFjaycpKXtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm09IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5oZWFkZXIgPSBcIjxoNT5NRU1TQVRTVk0gRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1wYWNrID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5oZWFkZXIgPSBcIjxoNT5NRU1QQUNLIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZ2VudGhyZWFkZXInKSl7XG4gICAgZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmdlbnRocmVhZGVyLmhlYWRlciA9IFwiPGg1PkdlblRIUkVBREVSIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZG9tcHJlZCcpKXtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZD0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZC5oZWFkZXIgPSBcIjxoNT5Eb21QcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygncGRvbXRocmVhZGVyJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wRG9tVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdiaW9zZXJmJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wR2VuVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5iaW9zZXJmPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5iaW9zZXJmLmhlYWRlciA9IFwiPGg1PkJpb1NlcmYgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdkb21zZXJmJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlciA9IFwiPGg1PlBzaXByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXI9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlci5oZWFkZXIgPSBcIjxoNT5wRG9tVEhSRUFERVIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5kb21zZXJmPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kb21zZXJmLmhlYWRlciA9IFwiPGg1PkRvbVNlcmYgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdmZnByZWQnKSl7XG4gICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQgPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIgPSBcIjxoNT5EaXNvUHJlZEQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZD0ge307XG4gICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZC5oZWFkZXIgPSBcIjxoNT5Eb21QcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgZG93bmxvYWRzX2luZm8uZmZwcmVkPSB7fTtcbiAgICBkb3dubG9hZHNfaW5mby5mZnByZWQuaGVhZGVyID0gXCI8aDU+RkZQcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWV0YXBzaWNvdicpKXtcbiAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgZG93bmxvYWRzX2luZm8ubWV0YXBzaWNvdj0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWV0YXBzaWNvdi5oZWFkZXIgPSBcIjxoNT5NZXRhUFNJQ09WIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnbWV0c2l0ZScpKXtcbiAgICBkb3dubG9hZHNfaW5mby5tZXRzaXRlID0ge307XG4gICAgZG93bmxvYWRzX2luZm8ubWV0c2l0ZS5oZWFkZXIgPSBcIjxoNT5NZXRzaXRlIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnaHNwcmVkJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLmhzcHJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmhzcHJlZC5oZWFkZXIgPSBcIjxoNT5IU1ByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgfVxuICBpZihkYXRhLmpvYl9uYW1lLmluY2x1ZGVzKCdtZW1lbWJlZCcpKXtcbiAgICBkb3dubG9hZHNfaW5mby5tZW1lbWJlZCA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLm1lbWVtYmVkLmhlYWRlciA9IFwiPGg1Pk1FTUVNQkVEIERPV05MT0FEUzwvaDU+XCI7XG4gIH1cbiAgaWYoZGF0YS5qb2JfbmFtZS5pbmNsdWRlcygnZ2VudGRiJykpe1xuICAgIGRvd25sb2Fkc19pbmZvLmdlbnRkYiA9IHt9O1xuICAgIGRvd25sb2Fkc19pbmZvLmdlbnRkYi5oZWFkZXIgPSBcIjxoNT5UREIgRE9XTkxPQUQ8L2g1PlwiO1xuICB9XG5cbn1cblxuLy90YWtlIHRoZSBkYXRhYmxvYiB3ZSd2ZSBnb3QgYW5kIGxvb3Agb3ZlciB0aGUgcmVzdWx0c1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZV9yZXN1bHRzKHJhY3RpdmUsIGRhdGEsIGZpbGVfdXJsLCB6aXAsIGRvd25sb2Fkc19pbmZvKVxue1xuICBsZXQgaG9yaXpfcmVnZXggPSAvXFwuaG9yaXokLztcbiAgbGV0IHNzMl9yZWdleCA9IC9cXC5zczIkLztcbiAgbGV0IG1lbXNhdF9jYXJ0b29uX3JlZ2V4ID0gL19jYXJ0b29uX21lbXNhdF9zdm1cXC5wbmckLztcbiAgbGV0IG1lbXNhdF9zY2hlbWF0aWNfcmVnZXggPSAvX3NjaGVtYXRpY1xcLnBuZyQvO1xuICBsZXQgbWVtc2F0X2RhdGFfcmVnZXggPSAvbWVtc2F0X3N2bSQvO1xuICBsZXQgbWVtcGFja19jYXJ0b29uX3JlZ2V4ID0gL0thbWFkYS1LYXdhaV9cXGQrLnBuZyQvO1xuICBsZXQgbWVtcGFja19ncmFwaF9vdXQgPSAvaW5wdXRfZ3JhcGgub3V0JC87XG4gIGxldCBtZW1wYWNrX2NvbnRhY3RfcmVzID0gL0NPTlRBQ1RfREVGMS5yZXN1bHRzJC87XG4gIGxldCBtZW1wYWNrX2xpcGlkX3JlcyA9IC9MSVBJRF9FWFBPU1VSRS5yZXN1bHRzJC87XG4gIGxldCBtZW1wYWNrX3Jlc3VsdF9mb3VuZCA9IGZhbHNlO1xuXG4gIGxldCBpbWFnZV9yZWdleCA9ICcnO1xuICBsZXQgcmVzdWx0cyA9IGRhdGEucmVzdWx0cztcbiAgZm9yKGxldCBpIGluIHJlc3VsdHMpXG4gIHtcbiAgICBsZXQgcmVzdWx0X2RpY3QgPSByZXN1bHRzW2ldO1xuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdHZW5BbGlnbm1lbnRBbm5vdGF0aW9uJylcbiAgICB7XG4gICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJwZ2VuX2Fubl9zZXRcIik7XG4gICAgICAgIGxldCB0bXAgPSByZXN1bHRfZGljdC5kYXRhX3BhdGg7XG4gICAgICAgIGxldCBwYXRoID0gdG1wLnN1YnN0cigwLCB0bXAubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgbGV0IGlkID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZihcIi5cIikrMSwgcGF0aC5sZW5ndGgpO1xuICAgICAgICBhbm5fc2V0W2lkXSA9IHt9O1xuICAgICAgICBhbm5fc2V0W2lkXS5hbm4gPSBwYXRoK1wiLmFublwiO1xuICAgICAgICBhbm5fc2V0W2lkXS5hbG4gPSBwYXRoK1wiLmFsblwiO1xuICAgICAgICByYWN0aXZlLnNldChcInBnZW5fYW5uX3NldFwiLCBhbm5fc2V0KTtcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dlbl9nZW5hbGlnbm1lbnRfYW5ub3RhdGlvbicpXG4gICAge1xuICAgICAgICBsZXQgYW5uX3NldCA9IHJhY3RpdmUuZ2V0KFwiZ2VuX2Fubl9zZXRcIik7XG4gICAgICAgIGxldCB0bXAgPSByZXN1bHRfZGljdC5kYXRhX3BhdGg7XG4gICAgICAgIGxldCBwYXRoID0gdG1wLnN1YnN0cigwLCB0bXAubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgbGV0IGlkID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZihcIi5cIikrMSwgcGF0aC5sZW5ndGgpO1xuICAgICAgICBhbm5fc2V0W2lkXSA9IHt9O1xuICAgICAgICBhbm5fc2V0W2lkXS5hbm4gPSBwYXRoK1wiLmFublwiO1xuICAgICAgICBhbm5fc2V0W2lkXS5hbG4gPSBwYXRoK1wiLmFsblwiO1xuICAgICAgICByYWN0aXZlLnNldChcImdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgZm9yKGxldCBpIGluIHJlc3VsdHMpXG4gIHtcbiAgICBsZXQgcmVzdWx0X2RpY3QgPSByZXN1bHRzW2ldO1xuICAgIC8vcHNpcHJlZCBmaWxlc1xuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT0gJ3BzaXBhc3MyJylcbiAgICB7XG4gICAgICBsZXQgbWF0Y2ggPSBob3Jpel9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihtYXRjaClcbiAgICAgIHtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdob3JpeicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+SG9yaXogRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3RpbWVcIiwgJycpO1xuICAgICAgfVxuICAgICAgbGV0IHNzMl9tYXRjaCA9IHNzMl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihzczJfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQuc3MyID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+U1MyIEZvcm1hdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdzczInLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2Rpc29wcmVkIGZpbGVzXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2Rpc29fZm9ybWF0JylcbiAgICB7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3BiZGF0JywgemlwLCByYWN0aXZlKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwiZGlzb3ByZWRfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLnBiZGF0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+UEJEQVQgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF90aW1lXCIsICcnKTtcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2Rpc29fY29tYmluZScpXG4gICAge1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdjb21iJywgemlwLCByYWN0aXZlKTtcbiAgICAgIGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmNvbWIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5DT01CIE5OIE91dHB1dDwvYT48YnIgLz4nO1xuICAgIH1cblxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdtZW1zYXRzdm0nKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1zYXRzdm1fdGltZVwiLCAnJyk7XG4gICAgICBsZXQgc2NoZW1lX21hdGNoID0gbWVtc2F0X3NjaGVtYXRpY19yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihzY2hlbWVfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fc2NoZW1hdGljJywgJzxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5zY2hlbWF0aWMgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TY2hlbWF0aWMgRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGNhcnRvb25fbWF0Y2ggPSBtZW1zYXRfY2FydG9vbl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihjYXJ0b29uX21hdGNoKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2NhcnRvb24nLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5DYXJ0b29uIERpYWdyYW08L2E+PGJyIC8+JztcbiAgICAgIH1cbiAgICAgIGxldCBtZW1zYXRfbWF0Y2ggPSBtZW1zYXRfZGF0YV9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihtZW1zYXRfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnbWVtc2F0ZGF0YScsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TWVtc2F0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnbWVtcGFja193cmFwcGVyJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXBhY2tfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtcGFja193YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1wYWNrX3RpbWVcIiwgJycpO1xuICAgICAgbGV0IGNhcnRvb25fbWF0Y2ggPSAgbWVtcGFja19jYXJ0b29uX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIG1lbXBhY2tfcmVzdWx0X2ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfY2FydG9vbicsICc8aW1nIHdpZHRoPVwiMTAwMHB4XCIgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGdyYXBoX21hdGNoID0gIG1lbXBhY2tfZ3JhcGhfb3V0LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGdyYXBoX21hdGNoKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1wYWNrLmdyYXBoX291dCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkRpYWdyYW0gRGF0YTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGNvbnRhY3RfbWF0Y2ggPSAgbWVtcGFja19jb250YWN0X3Jlcy5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihjb250YWN0X21hdGNoKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNvbnRhY3QgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5Db250YWN0IFByZWRpY3Rpb25zPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgbGlwaWRfbWF0Y2ggPSAgbWVtcGFja19saXBpZF9yZXMuZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYobGlwaWRfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2subGlwaWRfb3V0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TGlwaWQgRXhwb3N1cmUgUHJlZGl0aW9uczwvYT48YnIgLz4nO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdzb3J0X3ByZXN1bHQnKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KFwicGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcInBnZW50aHJlYWRlcl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ByZXN1bHQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+cEdlblRIUkVBREVSIFRhYmxlPC9hPjxiciAvPic7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdnZW5fc29ydF9wcmVzdWx0cycpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJnZW50aHJlYWRlcl93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJnZW50aHJlYWRlcl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJnZW50aHJlYWRlcl90aW1lXCIsICcnKTtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnZ2VuX3ByZXN1bHQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIudGFibGUgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5HZW5USFJFQURFUiBUYWJsZTwvYT48YnIgLz4nO1xuICAgIH1cblxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdwc2V1ZG9fYmFzX2FsaWduJylcbiAgICB7XG4gICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5wR2VuVEhSRUFERVIgQWxpZ25tZW50czwvYT48YnIgLz4nO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZ2VudGhyZWFkZXJfcHNldWRvX2Jhc19hbGlnbicpXG4gICAge1xuICAgICAgZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIuYWxpZ24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5HZW5USFJFQURFUiBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgfVxuICB9XG4gIGlmKCEgbWVtcGFja19yZXN1bHRfZm91bmQpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnbWVtcGFja19jYXJ0b29uJywgJzxoMz5ObyBwYWNraW5nIHByZWRpY3Rpb24gcG9zc2libGU8L2gzPicpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRfZG93bmxvYWRzX3BhbmVsKHJhY3RpdmUsIGRvd25sb2Fkc19pbmZvKVxue1xuICBjb25zb2xlLmxvZyhkb3dubG9hZHNfaW5mbyk7XG4gIGxldCBkb3dubG9hZHNfc3RyaW5nID0gcmFjdGl2ZS5nZXQoJ2Rvd25sb2FkX2xpbmtzJyk7XG4gIGlmKCdwc2lwcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhlYWRlcik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBzaXByZWQuaG9yaXopO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLnNzMik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG4gIGlmKCdkaXNvcHJlZCcgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5jb21iKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ21lbXNhdHN2bScgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlcik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5kYXRhKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLnNjaGVtYXRpYyk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5jYXJ0b29uKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ3BnZW50aHJlYWRlcicgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmhlYWRlcik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci50YWJsZSk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG4gIGlmKCdnZW50aHJlYWRlcicgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZ2VudGhyZWFkZXIudGFibGUpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5hbGlnbik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG4gIGlmKCdtZW1wYWNrJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmhlYWRlcik7XG4gICAgaWYoZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uKVxuICAgIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtcGFjay5ncmFwaF9vdXQpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNvbnRhY3QpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmxpcGlkX291dCk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCJObyBwYWNraW5nIHByZWRpY3Rpb24gcG9zc2libGU8YnIgLz5cIik7XG4gICAgfVxuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuXG4gIHJhY3RpdmUuc2V0KCdkb3dubG9hZF9saW5rcycsIGRvd25sb2Fkc19zdHJpbmcpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMiLCIvL2dpdmVuIGFuZCBhcnJheSByZXR1cm4gd2hldGhlciBhbmQgZWxlbWVudCBpcyBwcmVzZW50XG5leHBvcnQgZnVuY3Rpb24gaXNJbkFycmF5KHZhbHVlLCBhcnJheSkge1xuICBpZihhcnJheS5pbmRleE9mKHZhbHVlKSA+IC0xKVxuICB7XG4gICAgcmV0dXJuKHRydWUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybihmYWxzZSk7XG4gIH1cbn1cblxuLy93aGVuIGEgcmVzdWx0cyBwYWdlIGlzIGluc3RhbnRpYXRlZCBhbmQgYmVmb3JlIHNvbWUgYW5ub3RhdGlvbnMgaGF2ZSBjb21lIGJhY2tcbi8vd2UgZHJhdyBhbmQgZW1wdHkgYW5ub3RhdGlvbiBwYW5lbFxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKXtcblxuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIGxldCByZXNpZHVlcyA9IHNlcS5zcGxpdCgnJyk7XG4gIGxldCBhbm5vdGF0aW9ucyA9IFtdO1xuICByZXNpZHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHJlcyl7XG4gICAgYW5ub3RhdGlvbnMucHVzaCh7J3Jlcyc6IHJlc30pO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICBiaW9kMy5hbm5vdGF0aW9uR3JpZChyYWN0aXZlLmdldCgnYW5ub3RhdGlvbnMnKSwge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xufVxuXG5cbi8vZ2l2ZW4gYSBVUkwgcmV0dXJuIHRoZSBhdHRhY2hlZCB2YXJpYWJsZXNcbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmxWYXJzKCkge1xuICAgIGxldCB2YXJzID0ge307XG4gICAgLy9jb25zaWRlciB1c2luZyBsb2NhdGlvbi5zZWFyY2ggaW5zdGVhZCBoZXJlXG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvWz8mXSsoW149Jl0rKT0oW14mXSopL2dpLFxuICAgIGZ1bmN0aW9uKG0sa2V5LHZhbHVlKSB7XG4gICAgICB2YXJzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFycztcbiAgfVxuXG4vKiEgZ2V0RW1QaXhlbHMgIHwgQXV0aG9yOiBUeXNvbiBNYXRhbmljaCAoaHR0cDovL21hdGFuaWNoLmNvbSksIDIwMTMgfCBMaWNlbnNlOiBNSVQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIGRvY3VtZW50RWxlbWVudCkge1xuICAgIC8vIEVuYWJsZSBzdHJpY3QgbW9kZVxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gRm9ybSB0aGUgc3R5bGUgb24gdGhlIGZseSB0byByZXN1bHQgaW4gc21hbGxlciBtaW5pZmllZCBmaWxlXG4gICAgbGV0IGltcG9ydGFudCA9IFwiIWltcG9ydGFudDtcIjtcbiAgICBsZXQgc3R5bGUgPSBcInBvc2l0aW9uOmFic29sdXRlXCIgKyBpbXBvcnRhbnQgKyBcInZpc2liaWxpdHk6aGlkZGVuXCIgKyBpbXBvcnRhbnQgKyBcIndpZHRoOjFlbVwiICsgaW1wb3J0YW50ICsgXCJmb250LXNpemU6MWVtXCIgKyBpbXBvcnRhbnQgKyBcInBhZGRpbmc6MFwiICsgaW1wb3J0YW50O1xuXG4gICAgd2luZG93LmdldEVtUGl4ZWxzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICBsZXQgZXh0cmFCb2R5O1xuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRW11bGF0ZSB0aGUgZG9jdW1lbnRFbGVtZW50IHRvIGdldCByZW0gdmFsdWUgKGRvY3VtZW50RWxlbWVudCBkb2VzIG5vdCB3b3JrIGluIElFNi03KVxuICAgICAgICAgICAgZWxlbWVudCA9IGV4dHJhQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO1xuICAgICAgICAgICAgZXh0cmFCb2R5LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZToxZW1cIiArIGltcG9ydGFudDtcbiAgICAgICAgICAgIGRvY3VtZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZXh0cmFCb2R5LCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgc3R5bGUgYSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgbGV0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgIHRlc3RFbGVtZW50LnN0eWxlLmNzc1RleHQgPSBzdHlsZTtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjbGllbnQgd2lkdGggb2YgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICBsZXQgdmFsdWUgPSB0ZXN0RWxlbWVudC5jbGllbnRXaWR0aDtcblxuICAgICAgICBpZiAoZXh0cmFCb2R5KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGV4dHJhIGJvZHkgZWxlbWVudFxuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGV4dHJhQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHRlc3QgZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZCh0ZXN0RWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIGVtIHZhbHVlIGluIHBpeGVsc1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn0oZG9jdW1lbnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2NvbW1vbi9jb21tb25faW5kZXguanMiLCJpbXBvcnQgeyBnZXRfbWVtc2F0X3JhbmdlcyB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9zczIgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfcGJkYXQgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfY29tYiB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9tZW1zYXRkYXRhIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX3ByZXN1bHQgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuXG5cbi8vZ2l2ZW4gYSB1cmwsIGh0dHAgcmVxdWVzdCB0eXBlIGFuZCBzb21lIGZvcm0gZGF0YSBtYWtlIGFuIGh0dHAgcmVxdWVzdFxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRfcmVxdWVzdCh1cmwsIHR5cGUsIHNlbmRfZGF0YSlcbntcbiAgY29uc29sZS5sb2coJ1NlbmRpbmcgVVJJIHJlcXVlc3QnKTtcbiAgY29uc29sZS5sb2codXJsKTtcbiAgY29uc29sZS5sb2codHlwZSk7XG4gIHZhciByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBzZW5kX2RhdGEsXG4gICAgY2FjaGU6IGZhbHNlLFxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgYXN5bmM6ICAgZmFsc2UsXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIC8vY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIHVybDogdXJsLFxuICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSlcbiAgICB7XG4gICAgICBpZihkYXRhID09PSBudWxsKXthbGVydChcIkZhaWxlZCB0byBzZW5kIGRhdGFcIik7fVxuICAgICAgcmVzcG9uc2U9ZGF0YTtcbiAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKVxuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge2FsZXJ0KFwiU2VuZGluZyBKb2IgdG8gXCIrdXJsK1wiIEZhaWxlZC4gXCIrZXJyb3IucmVzcG9uc2VUZXh0K1wiLiBUaGUgQmFja2VuZCBwcm9jZXNzaW5nIHNlcnZpY2Ugd2FzIHVuYWJsZSB0byBwcm9jZXNzIHlvdXIgc3VibWlzc2lvbi4gUGxlYXNlIGNvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWtcIik7IHJldHVybiBudWxsO1xuICB9fSkucmVzcG9uc2VKU09OO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG4vL2dpdmVuIGEgam9iIG5hbWUgcHJlcCBhbGwgdGhlIGZvcm0gZWxlbWVudHMgYW5kIHNlbmQgYW4gaHR0cCByZXF1ZXN0IHRvIHRoZVxuLy9iYWNrZW5kXG5leHBvcnQgZnVuY3Rpb24gc2VuZF9qb2IocmFjdGl2ZSwgam9iX25hbWUsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybClcbntcbiAgLy9hbGVydChzZXEpO1xuICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZm9ybSBkYXRhXCIpO1xuICBjb25zb2xlLmxvZyhqb2JfbmFtZSk7XG4gIHZhciBmaWxlID0gbnVsbDtcbiAgbGV0IHVwcGVyX25hbWUgPSBqb2JfbmFtZS50b1VwcGVyQ2FzZSgpO1xuICB0cnlcbiAge1xuICAgIGZpbGUgPSBuZXcgQmxvYihbc2VxXSk7XG4gIH0gY2F0Y2ggKGUpXG4gIHtcbiAgICBhbGVydChlKTtcbiAgfVxuICBsZXQgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgZmQuYXBwZW5kKFwiaW5wdXRfZGF0YVwiLCBmaWxlLCAnaW5wdXQudHh0Jyk7XG4gIGZkLmFwcGVuZChcImpvYlwiLGpvYl9uYW1lKTtcbiAgZmQuYXBwZW5kKFwic3VibWlzc2lvbl9uYW1lXCIsbmFtZSk7XG4gIGZkLmFwcGVuZChcImVtYWlsXCIsIGVtYWlsKTtcblxuICBsZXQgcmVzcG9uc2VfZGF0YSA9IHNlbmRfcmVxdWVzdChzdWJtaXRfdXJsLCBcIlBPU1RcIiwgZmQpO1xuICBpZihyZXNwb25zZV9kYXRhICE9PSBudWxsKVxuICB7XG4gICAgbGV0IHRpbWVzID0gc2VuZF9yZXF1ZXN0KHRpbWVzX3VybCwnR0VUJyx7fSk7XG4gICAgLy9hbGVydChKU09OLnN0cmluZ2lmeSh0aW1lcykpO1xuICAgIGlmKGpvYl9uYW1lIGluIHRpbWVzKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KGpvYl9uYW1lKydfdGltZScsIHVwcGVyX25hbWUrXCIgam9icyB0eXBpY2FsbHkgdGFrZSBcIit0aW1lc1tqb2JfbmFtZV0rXCIgc2Vjb25kc1wiKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KGpvYl9uYW1lKydfdGltZScsIFwiVW5hYmxlIHRvIHJldHJpZXZlIGF2ZXJhZ2UgdGltZSBmb3IgXCIrdXBwZXJfbmFtZStcIiBqb2JzLlwiKTtcbiAgICB9XG4gICAgZm9yKHZhciBrIGluIHJlc3BvbnNlX2RhdGEpXG4gICAge1xuICAgICAgaWYoayA9PSBcIlVVSURcIilcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ2JhdGNoX3V1aWQnLCByZXNwb25zZV9kYXRhW2tdKTtcbiAgICAgICAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCBqb2JfbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2VcbiAge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vL3V0aWxpdHkgZnVuY3Rpb24gdGhhdCBnZXRzIHRoZSBzZXF1ZW5jZSBmcm9tIGEgcHJldmlvdXMgc3VibWlzc2lvbiBpcyB0aGVcbi8vcGFnZSB3YXMgbG9hZGVkIHdpdGggYSBVVUlEXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3ByZXZpb3VzX2RhdGEodXVpZCwgc3VibWl0X3VybCwgZmlsZV91cmwsIHJhY3RpdmUpXG57XG4gICAgY29uc29sZS5sb2coJ1JlcXVlc3RpbmcgZGV0YWlscyBnaXZlbiBVUkknKTtcbiAgICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICAgIC8vYWxlcnQodXJsKTtcbiAgICBsZXQgc3VibWlzc2lvbl9yZXNwb25zZSA9IHNlbmRfcmVxdWVzdCh1cmwsIFwiR0VUXCIsIHt9KTtcbiAgICBpZighIHN1Ym1pc3Npb25fcmVzcG9uc2Upe2FsZXJ0KFwiTk8gU1VCTUlTU0lPTiBEQVRBXCIpO31cbiAgICBsZXQgc2VxID0gZ2V0X3RleHQoZmlsZV91cmwrc3VibWlzc2lvbl9yZXNwb25zZS5zdWJtaXNzaW9uc1swXS5pbnB1dF9maWxlLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGpvYnMgPSAnJztcbiAgICBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zLmZvckVhY2goZnVuY3Rpb24oc3VibWlzc2lvbil7XG4gICAgICBqb2JzICs9IHN1Ym1pc3Npb24uam9iX25hbWUrXCIsXCI7XG4gICAgfSk7XG4gICAgam9icyA9IGpvYnMuc2xpY2UoMCwgLTEpO1xuICAgIHJldHVybih7J3NlcSc6IHNlcSwgJ2VtYWlsJzogc3VibWlzc2lvbl9yZXNwb25zZS5zdWJtaXNzaW9uc1swXS5lbWFpbCwgJ25hbWUnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLnN1Ym1pc3Npb25fbmFtZSwgJ2pvYnMnOiBqb2JzfSk7XG59XG5cblxuLy9nZXQgdGV4dCBjb250ZW50cyBmcm9tIGEgcmVzdWx0IFVSSVxuZnVuY3Rpb24gZ2V0X3RleHQodXJsLCB0eXBlLCBzZW5kX2RhdGEpXG57XG5cbiBsZXQgcmVzcG9uc2UgPSBudWxsO1xuICAkLmFqYXgoe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogc2VuZF9kYXRhLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGFzeW5jOiAgIGZhbHNlLFxuICAgIC8vZGF0YVR5cGU6IFwidHh0XCIsXG4gICAgLy9jb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgdXJsOiB1cmwsXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKVxuICAgIHtcbiAgICAgIGlmKGRhdGEgPT09IG51bGwpe2FsZXJ0KFwiRmFpbGVkIHRvIHJlcXVlc3QgaW5wdXQgZGF0YSB0ZXh0XCIpO31cbiAgICAgIHJlc3BvbnNlPWRhdGE7XG4gICAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSlcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChcIkdldHRpbmdzIHJlc3VsdHMgdGV4dCBmYWlsZWQuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTt9XG4gIH0pO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG5cbi8vcG9sbHMgdGhlIGJhY2tlbmQgdG8gZ2V0IHJlc3VsdHMgYW5kIHRoZW4gcGFyc2VzIHRob3NlIHJlc3VsdHMgdG8gZGlzcGxheVxuLy90aGVtIG9uIHRoZSBwYWdlXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc19maWxlKHVybF9zdHViLCBwYXRoLCBjdGwsIHppcCwgcmFjdGl2ZSlcbntcbiAgbGV0IHVybCA9IHVybF9zdHViICsgcGF0aDtcbiAgbGV0IHBhdGhfYml0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAvL2dldCBhIHJlc3VsdHMgZmlsZSBhbmQgcHVzaCB0aGUgZGF0YSBpbiB0byB0aGUgYmlvM2Qgb2JqZWN0XG4gIC8vYWxlcnQodXJsKTtcbiAgY29uc29sZS5sb2coJ0dldHRpbmcgUmVzdWx0cyBGaWxlIGFuZCBwcm9jZXNzaW5nJyk7XG4gIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgYXN5bmM6ICAgdHJ1ZSxcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGZpbGUpXG4gICAge1xuICAgICAgemlwLmZvbGRlcihwYXRoX2JpdHNbMV0pLmZpbGUocGF0aF9iaXRzWzJdLCBmaWxlKTtcbiAgICAgIGlmKGN0bCA9PT0gJ2hvcml6JylcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLCBmaWxlKTtcbiAgICAgICAgYmlvZDMucHNpcHJlZChmaWxlLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdzczInKVxuICAgICAge1xuICAgICAgICBwYXJzZV9zczIocmFjdGl2ZSwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwYmRhdCcpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3BiZGF0KHJhY3RpdmUsIGZpbGUpO1xuICAgICAgICAvL2FsZXJ0KCdQQkRBVCBwcm9jZXNzJyk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdjb21iJylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfY29tYihyYWN0aXZlLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ21lbXNhdGRhdGEnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9tZW1zYXRkYXRhKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAncHJlc3VsdCcpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3ByZXN1bHQocmFjdGl2ZSwgZmlsZSwgJ3BnZW4nKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ2dlbl9wcmVzdWx0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcHJlc3VsdChyYWN0aXZlLCBmaWxlLCAnZ2VuJyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTt9XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzIiwiLyogMS4gQ2F0Y2ggZm9ybSBpbnB1dFxuICAgICAyLiBWZXJpZnkgZm9ybVxuICAgICAzLiBJZiBnb29kIHRoZW4gbWFrZSBmaWxlIGZyb20gZGF0YSBhbmQgcGFzcyB0byBiYWNrZW5kXG4gICAgIDQuIHNocmluayBmb3JtIGF3YXlcbiAgICAgNS4gT3BlbiBzZXEgcGFuZWxcbiAgICAgNi4gU2hvdyBwcm9jZXNzaW5nIGFuaW1hdGlvblxuICAgICA3LiBsaXN0ZW4gZm9yIHJlc3VsdFxuKi9cbmltcG9ydCB7IHZlcmlmeV9hbmRfc2VuZF9mb3JtIH0gZnJvbSAnLi9mb3Jtcy9mb3Jtc19pbmRleC5qcyc7XG5pbXBvcnQgeyBzZW5kX3JlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGdldF9wcmV2aW91c19kYXRhIH0gZnJvbSAnLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwgfSBmcm9tICcuL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuaW1wb3J0IHsgZ2V0VXJsVmFycyB9IGZyb20gJy4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5pbXBvcnQgeyBjbGVhcl9zZXR0aW5ncyB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5pbXBvcnQgeyBwcmVwYXJlX2Rvd25sb2Fkc19odG1sIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IGhhbmRsZV9yZXN1bHRzIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IHNldF9kb3dubG9hZHNfcGFuZWwgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgc2hvd19wYW5lbCB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5cbnZhciBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCcuY29weUJ1dHRvbicpO1xudmFyIHppcCA9IG5ldyBKU1ppcCgpO1xuXG5jbGlwYm9hcmQub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcbmNsaXBib2FyZC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcblxuLy8gU0VUIEVORFBPSU5UUyBGT1IgREVWLCBTVEFHSU5HIE9SIFBST0RcbmxldCBlbmRwb2ludHNfdXJsID0gbnVsbDtcbmxldCBzdWJtaXRfdXJsID0gbnVsbDtcbmxldCB0aW1lc191cmwgPSBudWxsO1xubGV0IGdlYXJzX3N2ZyA9IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG5sZXQgbWFpbl91cmwgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrXCI7XG5sZXQgYXBwX3BhdGggPSBcIi9wc2lwcmVkX2JldGFcIjtcbmxldCBmaWxlX3VybCA9ICcnO1xubGV0IGdlYXJfc3RyaW5nID0gJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JztcbmxldCBqb2JfbGlzdCA9IFtcInBzaXByZWRcIiwgXCJkaXNvcHJlZFwiLCBcIm1lbXNhdHN2bVwiLCBcInBnZW50aHJlYWRlclwiLCBcIm1lbXBhY2tcIixcbiAgICAgICAgICAgICAgICBcImdlbnRocmVhZGVyXCIsIFwiZG9tcHJlZFwiLCBcInBkb210aHJlYWRlclwiLCBcImJpb3NlcmZcIiwgXCJkb21zZXJmXCIsXG4gICAgICAgICAgICAgICAgXCJmZnByZWRcIiwgXCJtZXRhcHNpY292XCIsIFwibWV0c2l0ZVwiLCBcImhzcHJlZFwiLCBcIm1lbWVtYmVkXCIsIFwiZ2VudGRiXCJdO1xubGV0IGpvYl9uYW1lcyA9IHtcbiAgJ3BzaXByZWQnOiAnUFNJUFJFRCBWNC4wJyxcbiAgJ2Rpc29wcmVkJzogJ0RJT1NQUkVEIDMnLFxuICAnbWVtc2F0c3ZtJzogJ01FTVNBVC1TVk0nLFxuICAncGdlbnRocmVhZGVyJzogJ3BHZW5USFJFQURFUicsXG4gICdtZW1wYWNrJzogJ01FTVBBQ0snLFxuICAnZ2VudGhyZWFkZXInOiAnR2VuVEhSRUFERVInLFxuICAnZG9tcHJlZCc6ICdEb21QcmVkJyxcbiAgJ3Bkb210aHJlYWRlcic6ICdQU0lQUkVEJyxcbiAgJ2Jpb3NlcmYnOiAnQmlvc1NlcmYgdjIuMCcsXG4gICdkb21zZXJmJzogJ0RvbVNlcmYgdjIuMScsXG4gICdmZnByZWQnOiAnRkZQcmVkIDMnLFxuICAnbWV0YXBzaWNvdic6ICdNZXRhUFNJQ09WJyxcbiAgJ21ldHNpdGUnOiAnTWV0U2l0ZScsXG4gICdoc3ByZWQnOiAnSFNQcmVkJyxcbiAgJ21lbWVtYmVkJzogJ01FTUVNQkVEJyxcbiAgJ2dlbnRkYic6ICdHZW5lcmF0ZSBUREInLFxufTtcblxuaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiMTI3LjAuMC4xXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIpXG57XG4gIGVuZHBvaW50c191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvZW5kcG9pbnRzLyc7XG4gIHN1Ym1pdF91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FuYWx5dGljc19hdXRvbWF0ZWQvam9idGltZXMvJztcbiAgYXBwX3BhdGggPSAnL2ludGVyZmFjZSc7XG4gIG1haW5fdXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMCc7XG4gIGdlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbiAgZmlsZV91cmwgPSBtYWluX3VybDtcbn1cbmVsc2UgaWYobG9jYXRpb24uaG9zdG5hbWUgPT09IFwiYmlvaW5mc3RhZ2UxLmNzLnVjbC5hYy51a1wiIHx8IGxvY2F0aW9uLmhvc3RuYW1lICA9PT0gXCJiaW9pbmYuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaHJlZiAgPT09IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL1wiKSB7XG4gIGVuZHBvaW50c191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL3N1Ym1pc3Npb24vJztcbiAgdGltZXNfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvam9idGltZXMvJztcbiAgZmlsZV91cmwgPSBtYWluX3VybCthcHBfcGF0aCtcIi9hcGlcIjtcbiAgLy9nZWFyc19zdmcgPSBcIi4uL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG59XG5lbHNlIHtcbiAgYWxlcnQoJ1VOU0VUVElORyBFTkRQT0lOVFMgV0FSTklORywgV0FSTklORyEnKTtcbiAgZW5kcG9pbnRzX3VybCA9ICcnO1xuICBzdWJtaXRfdXJsID0gJyc7XG4gIHRpbWVzX3VybCA9ICcnO1xufVxuXG5sZXQgaW5pdGlhbGlzYXRpb25fZGF0YSA9IHtcbiAgICBzZXF1ZW5jZV9mb3JtX3Zpc2libGU6IDEsXG4gICAgc3RydWN0dXJlX2Zvcm1fdmlzaWJsZTogMCxcbiAgICByZXN1bHRzX3Zpc2libGU6IDEsXG4gICAgcmVzdWx0c19wYW5lbF92aXNpYmxlOiAxLFxuICAgIHN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGU6IDAsXG4gICAgbW9kZWxsZXJfa2V5OiBudWxsLFxuICAgIGRvd25sb2FkX2xpbmtzOiAnJyxcbiAgICBwc2lwcmVkX2hvcml6OiBudWxsLFxuICAgIGRpc29fcHJlY2lzaW9uOiBudWxsLFxuICAgIG1lbXNhdHN2bV9zY2hlbWF0aWM6ICcnLFxuICAgIG1lbXNhdHN2bV9jYXJ0b29uOiAnJyxcbiAgICBwZ2VuX3RhYmxlOiBudWxsLFxuICAgIHBnZW5fYW5uX3NldDoge30sXG4gICAgbWVtc2F0cGFja19zY2hlbWF0aWM6ICcnLFxuICAgIG1lbXNhdHBhY2tfY2FydG9vbjogJycsXG4gICAgZ2VuX3RhYmxlOiBudWxsLFxuICAgIGdlbl9hbm5fc2V0OiB7fSxcbiAgICBkb21wcmVkX2RhdGE6IG51bGwsXG4gICAgcGRvbXRocmVhZGVyX2RhdGE6IG51bGwsXG4gICAgYmlvc2VyZl9kYXRhOiBudWxsLFxuICAgIGRvbXNlcmZfZGF0YTogbnVsbCxcbiAgICBmZnByZWRfZGF0YTogbnVsbCxcbiAgICBtZXRhcHNpY292X2RhdGE6IG51bGwsXG4gICAgbWV0c2l0ZV9kYXRhOiBudWxsLFxuICAgIGhzcHJlZF9kYXRhOiBudWxsLFxuICAgIG1lbWVtYmVkX2RhdGE6IG51bGwsXG4gICAgZ2VudGRiX2RhdGE6IG51bGwsXG5cbiAgICAvLyBTZXF1ZW5jZSBhbmQgam9iIGluZm9cbiAgICBzZXF1ZW5jZTogJycsXG4gICAgc2VxdWVuY2VfbGVuZ3RoOiAxLFxuICAgIHN1YnNlcXVlbmNlX3N0YXJ0OiAxLFxuICAgIHN1YnNlcXVlbmNlX3N0b3A6IDEsXG4gICAgZW1haWw6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGJhdGNoX3V1aWQ6IG51bGwsXG4gICAgLy9ob2xkIGFubm90YXRpb25zIHRoYXQgYXJlIHJlYWQgZnJvbSBkYXRhZmlsZXNcbiAgICBhbm5vdGF0aW9uczogbnVsbCxcbn07XG5qb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX2NoZWNrZWQnXSA9IGZhbHNlO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfYnV0dG9uJ10gPSBmYWxzZTtcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX2pvYiddID0gam9iX25hbWUrJ19qb2InO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfd2FpdGluZ19tZXNzYWdlJ10gPSAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyICcram9iX25hbWVzW2pvYl9uYW1lXSsnIGpvYiB0byBwcm9jZXNzPC9oMj4nO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfd2FpdGluZ19pY29uJ10gPSBnZWFyX3N0cmluZztcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX3dhaXRpbmdfdGltZSddID0gJ0xvYWRpbmcgRGF0YSc7XG5cbn0pO1xuXG4vLyBERUNMQVJFIFZBUklBQkxFUyBhbmQgaW5pdCByYWN0aXZlIGluc3RhbmNlXG52YXIgcmFjdGl2ZSA9IG5ldyBSYWN0aXZlKHtcbiAgZWw6ICcjcHNpcHJlZF9zaXRlJyxcbiAgdGVtcGxhdGU6ICcjZm9ybV90ZW1wbGF0ZScsXG4gIGRhdGE6IGluaXRpYWxpc2F0aW9uX2RhdGEsXG59KTtcblxuLy9zZXQgc29tZSB0aGluZ3Mgb24gdGhlIHBhZ2UgZm9yIHRoZSBkZXZlbG9wbWVudCBzZXJ2ZXJcbmlmKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcIjEyNy4wLjAuMVwiKSB7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcsICdkYW5pZWwuYnVjaGFuQHVjbC5hYy51aycpO1xuICByYWN0aXZlLnNldCgnbmFtZScsICd0ZXN0Jyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsICdRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBU0RRV0VBUycpO1xufVxuXG4vLzRiNmFkNzkyLWVkMWYtMTFlNS04OTg2LTk4OTA5NmMxM2VlNlxubGV0IHV1aWRfcmVnZXggPSAvXlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9JC9pO1xubGV0IHV1aWRfbWF0Y2ggPSB1dWlkX3JlZ2V4LmV4ZWMoZ2V0VXJsVmFycygpLnV1aWQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy9cbi8vIEFQUExJQ0FUSU9OIEhFUkVcbi8vXG4vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL0hlcmUgd2VyZSBrZWVwIGFuIGV5ZSBvbiBzb21lIGZvcm0gZWxlbWVudHMgYW5kIHJld3JpdGUgdGhlIG5hbWUgaWYgcGVvcGxlXG4vL2hhdmUgcHJvdmlkZWQgYSBmYXN0YSBmb3JtYXR0ZWQgc2VxXG5sZXQgc2VxX29ic2VydmVyID0gcmFjdGl2ZS5vYnNlcnZlKCdzZXF1ZW5jZScsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSApIHtcbiAgbGV0IHJlZ2V4ID0gL14+KC4rPylcXHMvO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKG5ld1ZhbHVlKTtcbiAgaWYobWF0Y2gpXG4gIHtcbiAgICB0aGlzLnNldCgnbmFtZScsIG1hdGNoWzFdKTtcbiAgfVxuICAvLyBlbHNlIHtcbiAgLy8gICB0aGlzLnNldCgnbmFtZScsIG51bGwpO1xuICAvLyB9XG5cbiAgfSxcbiAge2luaXQ6IGZhbHNlLFxuICAgZGVmZXI6IHRydWVcbiB9KTtcbi8vdGhlc2VzIHR3byBvYnNlcnZlcnMgc3RvcCBwZW9wbGUgc2V0dGluZyB0aGUgcmVzdWJtaXNzaW9uIHdpZGdldCBvdXQgb2YgYm91bmRzXG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdG9wJywgZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgbGV0IHNlcV9sZW5ndGggPSByYWN0aXZlLmdldCgnc2VxdWVuY2VfbGVuZ3RoJyk7XG4gIGxldCBzZXFfc3RhcnQgPSByYWN0aXZlLmdldCgnc3Vic2VxdWVuY2Vfc3RhcnQnKTtcbiAgaWYodmFsdWUgPiBzZXFfbGVuZ3RoKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXFfbGVuZ3RoKTtcbiAgfVxuICBpZih2YWx1ZSA8PSBzZXFfc3RhcnQpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RvcCcsIHNlcV9zdGFydCsxKTtcbiAgfVxufSk7XG5yYWN0aXZlLm9ic2VydmUoICdzdWJzZXF1ZW5jZV9zdGFydCcsIGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGxldCBzZXFfc3RvcCA9IHJhY3RpdmUuZ2V0KCdzdWJzZXF1ZW5jZV9zdG9wJyk7XG4gIGlmKHZhbHVlIDwgMSlcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcsIDEpO1xuICB9XG4gIGlmKHZhbHVlID49IHNlcV9zdG9wKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0Jywgc2VxX3N0b3AtMSk7XG4gIH1cbn0pO1xuXG4vL0FmdGVyIGEgam9iIGhhcyBiZWVuIHNlbnQgb3IgYSBVUkwgYWNjZXB0ZWQgdGhpcyByYWN0aXZlIGJsb2NrIGlzIGNhbGxlZCB0b1xuLy9wb2xsIHRoZSBiYWNrZW5kIHRvIGdldCB0aGUgcmVzdWx0c1xucmFjdGl2ZS5vbigncG9sbF90cmlnZ2VyJywgZnVuY3Rpb24obmFtZSwgam9iX3R5cGUpe1xuICBjb25zb2xlLmxvZyhcIlBvbGxpbmcgYmFja2VuZCBmb3IgcmVzdWx0c1wiKTtcbiAgbGV0IHVybCA9IHN1Ym1pdF91cmwgKyByYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAnJywgYXBwX3BhdGgrJy8mdXVpZD0nK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJykpO1xuICBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSk7XG5cbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBsZXQgYmF0Y2ggPSBzZW5kX3JlcXVlc3QodXJsLCBcIkdFVFwiLCB7fSk7XG4gICAgbGV0IGRvd25sb2Fkc19pbmZvID0ge307XG5cbiAgICBpZihiYXRjaC5zdGF0ZSA9PT0gJ0NvbXBsZXRlJylcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlbmRlciByZXN1bHRzXCIpO1xuICAgICAgbGV0IHN1Ym1pc3Npb25zID0gYmF0Y2guc3VibWlzc2lvbnM7XG4gICAgICBzdWJtaXNzaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIHByZXBhcmVfZG93bmxvYWRzX2h0bWwoZGF0YSwgZG93bmxvYWRzX2luZm8pO1xuICAgICAgICAgIGhhbmRsZV9yZXN1bHRzKHJhY3RpdmUsIGRhdGEsIGZpbGVfdXJsLCB6aXAsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgfSk7XG4gICAgICBzZXRfZG93bmxvYWRzX3BhbmVsKHJhY3RpdmUsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbi8vIE9uIGNsaWNraW5nIHRoZSBHZXQgWmlwIGZpbGUgbGluayB0aGlzIHdhdGNoZXJzIHByZXBhcmVzIHRoZSB6aXAgYW5kIGhhbmRzIGl0IHRvIHRoZSB1c2VyXG5yYWN0aXZlLm9uKCdnZXRfemlwJywgZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBsZXQgdXVpZCA9IHJhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgemlwLmdlbmVyYXRlQXN5bmMoe3R5cGU6XCJibG9iXCJ9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XG4gICAgICAgIHNhdmVBcyhibG9iLCB1dWlkK1wiLnppcFwiKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGVzZSByZWFjdCB0byB0aGUgaGVhZGVycyBiZWluZyBjbGlja2VkIHRvIHRvZ2dsZSB0aGUgcGFuZWxcbi8vXG5yYWN0aXZlLm9uKCAnc2VxdWVuY2VfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCAwICk7XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgICAgbGV0IHNldHRpbmcgPSBmYWxzZTtcbiAgICAgIGlmKGpvYl9uYW1lID09PSAncHNpcHJlZCcpe3NldHRpbmcgPSB0cnVlO31cbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBzZXR0aW5nKTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnc3RydWN0dXJlX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDAgKTtcbiAgICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBmYWxzZSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAnc3RydWN0dXJlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnZG93bmxvYWRzX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTEsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAncHNpcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDEsIHJhY3RpdmUpO1xuICBpZihyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpKVxuICB7XG4gICAgYmlvZDMucHNpcHJlZChyYWN0aXZlLmdldCgncHNpcHJlZF9ob3JpeicpLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gIH1cbn0pO1xucmFjdGl2ZS5vbiggJ2Rpc29wcmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoNCwgcmFjdGl2ZSk7XG4gIGlmKHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpKVxuICB7XG4gICAgYmlvZDMuZ2VuZXJpY3h5TGluZUNoYXJ0KHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICB9XG59KTtcbnJhY3RpdmUub24oICdtZW1zYXRzdm1fYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg2LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3BnZW50aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDIsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnbWVtcGFja19hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDUsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnZ2VudGhyZWFkZXJfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg3LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2RvbXByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCg4LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ3Bkb210aHJlYWRlcl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDksIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnYmlvc2VyZl9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDEwLCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2RvbXNlcmZfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCgxMiwgcmFjdGl2ZSk7XG59KTtcbnJhY3RpdmUub24oICdmZnByZWRfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgc2hvd19wYW5lbCgxMywgcmFjdGl2ZSk7XG59KTtcbnJhY3RpdmUub24oICdtZXRhcHNpY292X2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTgsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnbWV0c2l0ZV9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDE0LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ2hzcHJlZF9hY3RpdmUnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuICBzaG93X3BhbmVsKDE1LCByYWN0aXZlKTtcbn0pO1xucmFjdGl2ZS5vbiggJ21lbWVtYmVkX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTYsIHJhY3RpdmUpO1xufSk7XG5yYWN0aXZlLm9uKCAnZ2VudGRiX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMTcsIHJhY3RpdmUpO1xufSk7XG5cbnJhY3RpdmUub24oICdzdWJtaXNzaW9uX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIGxldCBzdGF0ZSA9IHJhY3RpdmUuZ2V0KCdzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlJyk7XG4gIGlmKHN0YXRlID09PSAxKXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAwICk7XG4gIH1cbiAgZWxzZXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAxICk7XG4gIH1cbn0pO1xuXG4vL2dyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBtYWluIGZvcm0gYW5kIHNlbmQgdGhlIHNlcXVlbmNlIHRvIHRoZSBiYWNrZW5kXG5yYWN0aXZlLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnU3VibWl0dGluZyBkYXRhJyk7XG4gIGxldCBzZXEgPSB0aGlzLmdldCgnc2VxdWVuY2UnKTtcbiAgc2VxID0gc2VxLnJlcGxhY2UoL14+LiskL21nLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXFxufFxccy9nLFwiXCIpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHNlcSk7XG5cbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgbGV0IGNoZWNrX3N0YXRlcyA9IHt9O1xuICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICBjaGVja19zdGF0ZXNbam9iX25hbWUrJ19qb2InXSA9IHJhY3RpdmUuZ2V0KGpvYl9uYW1lKydfam9iJyk7XG4gICAgY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID0gcmFjdGl2ZS5nZXQoam9iX25hbWUrJ19jaGVja2VkJyk7XG4gIH0pO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIGNoZWNrX3N0YXRlcywgam9iX2xpc3QpO1xuICBldmVudC5vcmlnaW5hbC5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIGdyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBSZXN1Ym1pc3Npb24gd2lkZ2V0LCB0cnVuY2F0ZSB0aGUgc2VxdWVuY2Vcbi8vIGFuZCBzZW5kIGEgbmV3IGpvYlxucmFjdGl2ZS5vbigncmVzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnUmVzdWJtaXR0aW5nIHNlZ21lbnQnKTtcbiAgbGV0IHN0YXJ0ID0gcmFjdGl2ZS5nZXQoXCJzdWJzZXF1ZW5jZV9zdGFydFwiKTtcbiAgbGV0IHN0b3AgPSByYWN0aXZlLmdldChcInN1YnNlcXVlbmNlX3N0b3BcIik7XG4gIGxldCBzZXF1ZW5jZSA9IHJhY3RpdmUuZ2V0KFwic2VxdWVuY2VcIik7XG4gIGxldCBzdWJzZXF1ZW5jZSA9IHNlcXVlbmNlLnN1YnN0cmluZyhzdGFydC0xLCBzdG9wKTtcbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpK1wiX3NlZ1wiO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlX2xlbmd0aCcsIHN1YnNlcXVlbmNlLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc3Vic2VxdWVuY2UubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJywgc3Vic2VxdWVuY2UpO1xuICByYWN0aXZlLnNldCgnbmFtZScsIG5hbWUpO1xuICBsZXQgY2hlY2tfc3RhdGVzID0ge307XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgIGNoZWNrX3N0YXRlc1tqb2JfbmFtZSsnX2pvYiddID0gcmFjdGl2ZS5nZXQoam9iX25hbWUrJ19qb2InKTtcbiAgICBjaGVja19zdGF0ZXNbam9iX25hbWUrJ19jaGVja2VkJ10gPSByYWN0aXZlLmdldChqb2JfbmFtZSsnX2NoZWNrZWQnKTtcbiAgfSk7XG4gIC8vY2xlYXIgd2hhdCB3ZSBoYXZlIHByZXZpb3VzbHkgd3JpdHRlblxuICBjbGVhcl9zZXR0aW5ncyhyYWN0aXZlLCBnZWFyX3N0cmluZywgam9iX2xpc3QpO1xuICAvL3ZlcmlmeSBmb3JtIGNvbnRlbnRzIGFuZCBwb3N0XG4gIC8vY29uc29sZS5sb2cobmFtZSk7XG4gIC8vY29uc29sZS5sb2coZW1haWwpO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzdWJzZXF1ZW5jZSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCwgY2hlY2tfc3RhdGVzLCBqb2JfbGlzdCk7XG4gIC8vd3JpdGUgbmV3IGFubm90YXRpb24gZGlhZ3JhbVxuICAvL3N1Ym1pdCBzdWJzZWN0aW9uXG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gSGVyZSBoYXZpbmcgc2V0IHVwIHJhY3RpdmUgYW5kIHRoZSBmdW5jdGlvbnMgd2UgbmVlZCB3ZSB0aGVuIGNoZWNrXG4vLyBpZiB3ZSB3ZXJlIHByb3ZpZGVkIGEgVVVJRCwgSWYgdGhlIHBhZ2UgaXMgbG9hZGVkIHdpdGggYSBVVUlEIHJhdGhlciB0aGFuIGFcbi8vIGZvcm0gc3VibWl0LlxuLy9UT0RPOiBIYW5kbGUgbG9hZGluZyB0aGF0IHBhZ2Ugd2l0aCB1c2UgdGhlIE1FTVNBVCBhbmQgRElTT1BSRUQgVVVJRFxuLy9cbmlmKGdldFVybFZhcnMoKS51dWlkICYmIHV1aWRfbWF0Y2gpXG57XG4gIGNvbnNvbGUubG9nKCdDYXVnaHQgYW4gaW5jb21pbmcgVVVJRCcpO1xuICBzZXFfb2JzZXJ2ZXIuY2FuY2VsKCk7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7IC8vIHNob3VsZCBtYWtlIGEgZ2VuZXJpYyBvbmUgdmlzaWJsZSB1bnRpbCByZXN1bHRzIGFycml2ZS5cbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgcmFjdGl2ZS5zZXQoXCJiYXRjaF91dWlkXCIsIGdldFVybFZhcnMoKS51dWlkKTtcbiAgbGV0IHByZXZpb3VzX2RhdGEgPSBnZXRfcHJldmlvdXNfZGF0YShnZXRVcmxWYXJzKCkudXVpZCwgc3VibWl0X3VybCwgZmlsZV91cmwsIHJhY3RpdmUpO1xuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BzaXByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZGlzb3ByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA0KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAyKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXBhY2snKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnbWVtcGFja19idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdnZW50aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDcpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZG9tcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnZG9tcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdwZG9tdGhyZWFkZXInKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdiaW9zZXJmJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Jpb3NlcmZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEwKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2RvbXNlcmYnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTIpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZmZwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkaXNvcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTMpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWV0c2l0ZScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWV0c2l0ZV9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTQpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnaHNwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdoc3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE1KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbWVtYmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTYpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZ2VudGRiJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50ZGJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE3KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21ldGFwc2ljb3YnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21ldGFwc2ljb3ZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE4KTtcbiAgfVxuXG5cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gTmV3IFBhbm5lbCBmdW5jdGlvbnNcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb2RlbChhbG5VUkkpIHtcblxuICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBsZXQgbW9kX2tleSA9IHJhY3RpdmUuZ2V0KCdtb2RlbGxlcl9rZXknKTtcbiAgaWYobW9kX2tleSA9PT0gJ00nKydPJysnRCcrJ0UnKydMJysnSScrJ1InKydBJysnTicrJ0onKydFJylcbiAge1xuICAgIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tb2RlbC9wb3N0P2Fsbj1cIitmaWxlX3VybCthbG5VUkksIFwiXCIsIFwid2lkdGg9NjcwLGhlaWdodD03MDBcIik7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgYWxlcnQoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgTScrJ08nKydEJysnRScrJ0wnKydMJysnRScrJ1IgTGljZW5jZSBLZXknKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL21haW4uanMiLCJpbXBvcnQgeyBzZW5kX2pvYiB9IGZyb20gJy4uL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGlzSW5BcnJheSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuaW1wb3J0IHsgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5cbi8vVGFrZXMgdGhlIGRhdGEgbmVlZGVkIHRvIHZlcmlmeSB0aGUgaW5wdXQgZm9ybSBkYXRhLCBlaXRoZXIgdGhlIG1haW4gZm9ybVxuLy9vciB0aGUgc3VibWlzc29uIHdpZGdldCB2ZXJpZmllcyB0aGF0IGRhdGEgYW5kIHRoZW4gcG9zdHMgaXQgdG8gdGhlIGJhY2tlbmQuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBjaGVja19zdGF0ZXMsIGpvYl9saXN0KVxue1xuICAvKnZlcmlmeSB0aGF0IGV2ZXJ5dGhpbmcgaGVyZSBpcyBvayovXG4gIGxldCBlcnJvcl9tZXNzYWdlPW51bGw7XG4gIGxldCBqb2Jfc3RyaW5nID0gJyc7XG4gIC8vZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkXSk7XG5cbiAgZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2hlY2tfc3RhdGVzLnBzaXByZWRfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLmRpc29wcmVkX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLm1lbXNhdHN2bV9jaGVja2VkLCBjaGVja19zdGF0ZXMucGdlbnRocmVhZGVyX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLm1lbXBhY2tfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLmdlbnRocmVhZGVyX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmRvbXByZWRfY2hlY2tlZCwgY2hlY2tfc3RhdGVzLnBkb210aHJlYWRlcl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3N0YXRlcy5iaW9zZXJmX2NoZWNrZWQsIGNoZWNrX3N0YXRlcy5kb21zZXJmX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmZmcHJlZF9jaGVja2VkLCBjaGVja19zdGF0ZXMubWV0YXBzaWNvdl9jaGVja2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX3N0YXRlcy5jaGVja19zdGF0ZXMsIGNoZWNrX3N0YXRlcy5tZXRzaXRlX2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfc3RhdGVzLmhzcHJlZF9jaGVja2VkLCBjaGVja19zdGF0ZXMubWVtZW1iZWRfY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja19zdGF0ZXMuZ2VudGRiX2NoZWNrZWRdKTtcbiAgaWYoZXJyb3JfbWVzc2FnZS5sZW5ndGggPiAwKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ2Zvcm1fZXJyb3InLCBlcnJvcl9tZXNzYWdlKTtcbiAgICBhbGVydChcIkZPUk0gRVJST1I6XCIrZXJyb3JfbWVzc2FnZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9pbml0aWFsaXNlIHRoZSBwYWdlXG4gICAgbGV0IHJlc3BvbnNlID0gdHJ1ZTtcbiAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTtcbiAgICAvL1Bvc3QgdGhlIGpvYnMgYW5kIGludGlhbGlzZSB0aGUgYW5ub3RhdGlvbnMgZm9yIGVhY2ggam9iXG4gICAgLy9XZSBhbHNvIGRvbid0IHJlZHVuZGFudGx5IHNlbmQgZXh0cmEgcHNpcHJlZCBldGMuLiBqb2JzXG4gICAgLy9ieXQgZG9pbmcgdGhlc2UgdGVzdCBpbiBhIHNwZWNpZmljIG9yZGVyXG4gICAgaWYoY2hlY2tfc3RhdGVzLnBnZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcInBnZW50aHJlYWRlcixcIik7XG4gICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRpc29wcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZGlzb3ByZWQsXCIpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Rpc29wcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICBwc2lwcmVkX2NoZWNrZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLnBzaXByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJwc2lwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMubWVtc2F0c3ZtX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtc2F0c3ZtLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZW1wYWNrX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWVtcGFjayxcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWVtcGFja19idXR0b24nLCB0cnVlKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5nZW50aHJlYWRlcl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImdlbnRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRvbXByZWRfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkb21wcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkb21wcmVkX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMucGRvbXRocmVhZGVyX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwicGRvbXRocmVhZGVyLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZG9tdGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5iaW9zZXJmX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiYmlvc2VyZixcIik7XG4gICAgICByYWN0aXZlLnNldCgnYmlvc2VyZl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmRvbXNlcmZfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJkb21zZXJmLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkb21zZXJmX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMuZmZwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiZmZwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdmZnByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZXRhcHNpY292X2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwibWV0YXBzaWNvdixcIik7XG4gICAgICByYWN0aXZlLnNldCgnbWV0YXBzaWNvdl9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLm1ldHNpdGVfY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICB7XG4gICAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5jb25jYXQoXCJtZXRzaXRlLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZXRzaXRlX2J1dHRvbicsIHRydWUpO1xuICAgIH1cbiAgICBpZihjaGVja19zdGF0ZXMuaHNwcmVkX2NoZWNrZWQgPT09IHRydWUpXG4gICAge1xuICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KFwiaHNwcmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdoc3ByZWRfYnV0dG9uJywgdHJ1ZSk7XG4gICAgfVxuICAgIGlmKGNoZWNrX3N0YXRlcy5tZW1lbWJlZF9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcIm1lbWVtYmVkLFwiKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1lbWJlZF9idXR0b24nLCB0cnVlKTtcbiAgICB9XG4gICAgaWYoY2hlY2tfc3RhdGVzLmdlbnRkYl9jaGVja2VkID09PSB0cnVlKVxuICAgIHtcbiAgICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLmNvbmNhdChcImdlbnRkYixcIik7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGRiX2J1dHRvbicsIHRydWUpO1xuICAgIH1cblxuICAgIGpvYl9zdHJpbmcgPSBqb2Jfc3RyaW5nLnNsaWNlKDAsIC0xKTtcbiAgICByZXNwb25zZSA9IHNlbmRfam9iKHJhY3RpdmUsIGpvYl9zdHJpbmcsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCk7XG4gICAgLy9zZXQgdmlzaWJpbGl0eSBhbmQgcmVuZGVyIHBhbmVsIG9uY2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvYl9saXN0Lmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGxldCBqb2JfbmFtZSA9IGpvYl9saXN0W2ldO1xuICAgICAgaWYoY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID09PSB0cnVlICYmIHJlc3BvbnNlIClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICAgIHJhY3RpdmUuZmlyZSggam9iX25hbWUrJ19hY3RpdmUnICk7XG4gICAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2Zvcm0oc2VxLCBqb2JfbmFtZSwgZW1haWwsIGNoZWNrZWRfYXJyYXkpXG57XG4gIGxldCBlcnJvcl9tZXNzYWdlID0gXCJcIjtcbiAgaWYoISAvXltcXHgwMC1cXHg3Rl0rJC8udGVzdChqb2JfbmFtZSkpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiUGxlYXNlIHJlc3RyaWN0IEpvYiBOYW1lcyB0byB2YWxpZCBsZXR0ZXJzIG51bWJlcnMgYW5kIGJhc2ljIHB1bmN0dWF0aW9uPGJyIC8+XCI7XG4gIH1cblxuICAvKiBsZW5ndGggY2hlY2tzICovXG4gIGlmKHNlcS5sZW5ndGggPiAxNTAwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIGxvbmcgdG8gcHJvY2VzczxiciAvPlwiO1xuICB9XG4gIGlmKHNlcS5sZW5ndGggPCAzMClcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGlzIHRvbyBzaG9ydCB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cblxuICAvKiBudWNsZW90aWRlIGNoZWNrcyAqL1xuICBsZXQgbnVjbGVvdGlkZV9jb3VudCA9IChzZXEubWF0Y2goL0F8VHxDfEd8VXxOfGF8dHxjfGd8dXxuL2cpfHxbXSkubGVuZ3RoO1xuICBpZigobnVjbGVvdGlkZV9jb3VudC9zZXEubGVuZ3RoKSA+IDAuOTUpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBhcHBlYXJzIHRvIGJlIG51Y2xlb3RpZGUgc2VxdWVuY2UuIFRoaXMgc2VydmljZSByZXF1aXJlcyBwcm90ZWluIHNlcXVlbmNlIGFzIGlucHV0PGJyIC8+XCI7XG4gIH1cbiAgaWYoL1teQUNERUZHSElLTE1OUFFSU1RWV1lYXy1dKy9pLnRlc3Qoc2VxKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczxiciAvPlwiO1xuICB9XG5cbiAgaWYoaXNJbkFycmF5KHRydWUsIGNoZWNrZWRfYXJyYXkpID09PSBmYWxzZSkge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuYWx5c2lzIHByb2dyYW1cIjtcbiAgfVxuICByZXR1cm4oZXJyb3JfbWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvZm9ybXMvZm9ybXNfaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9