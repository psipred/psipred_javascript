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
/* harmony export (immutable) */ __webpack_exports__["h"] = parse_ffpreds;
/* harmony export (immutable) */ __webpack_exports__["g"] = parse_featcfg;
/* unused harmony export get_memsat_ranges */
/* harmony export (immutable) */ __webpack_exports__["a"] = parse_ss2;
/* harmony export (immutable) */ __webpack_exports__["b"] = parse_pbdat;
/* harmony export (immutable) */ __webpack_exports__["c"] = parse_comb;
/* harmony export (immutable) */ __webpack_exports__["d"] = parse_memsatdata;
/* harmony export (immutable) */ __webpack_exports__["e"] = parse_presult;
/* harmony export (immutable) */ __webpack_exports__["f"] = parse_parseds;
function parse_ffpreds(ractive, file) {

  let lines = file.split('\n');
  let bp_data = [];
  let mf_data = [];
  let cc_data = [];
  let table_data = '';
  lines.forEach(function (line, i) {
    if (line.startsWith('#')) {
      return;
    }
    let entries = line.split('\t');
    if (entries.length < 4) {
      return;
    }
    if (entries[3] === 'BP') {
      bp_data.push(entries);
    }
    if (entries[3] === 'CC') {
      cc_data.push(entries);
    }
    if (entries[3] === 'MF') {
      mf_data.push(entries);
    }
  });

  table_data += "<b>Biological Process Predictions</b><br />";
  table_data += "<table><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr>";
  bp_data.forEach(function (entries, i) {
    let class_colour = 'safe';
    if (entries[2] === 'L') {
      class_colour = 'notsafe';
    }
    table_data += '<tr class="' + class_colour + '">';
    table_data += '<td>' + entries[1] + '</td>';
    table_data += '<td>' + entries[4] + '</td>';
    table_data += '<td>' + entries[0] + '</td>';
    table_data += '<td>' + entries[2] + '</td>';
    table_data += '</tr>';
  });
  table_data += '</table><br />';
  ractive.set('function_tables', table_data);

  table_data += "<b>Molecular Function Predictions</b><br />";
  table_data += "<table><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr>";
  mf_data.forEach(function (entries, i) {
    let class_colour = 'safe';
    if (entries[2] === 'L') {
      class_colour = 'notsafe';
    }
    table_data += '<tr class="' + class_colour + '">';
    table_data += '<td>' + entries[1] + '</td>';
    table_data += '<td>' + entries[4] + '</td>';
    table_data += '<td>' + entries[0] + '</td>';
    table_data += '<td>' + entries[2] + '</td>';
    table_data += '</tr>';
  });
  table_data += '</table><br />';
  ractive.set('function_tables', table_data);

  table_data += "<b>Cellular Component Predictions</b><br />";
  table_data += "<table><tr><th>GO term</th><th>Name</th><th>Prob</th><th>SVM Reliability</th></tr>";
  cc_data.forEach(function (entries, i) {
    let class_colour = 'safe';
    if (entries[2] === 'L') {
      class_colour = 'notsafe';
    }
    table_data += '<tr class="' + class_colour + '">';
    table_data += '<td>' + entries[1] + '</td>';
    table_data += '<td>' + entries[4] + '</td>';
    table_data += '<td>' + entries[0] + '</td>';
    table_data += '<td>' + entries[2] + '</td>';
    table_data += '</tr>';
  });
  table_data += '</table><br />';
  table_data += 'These prediction terms represent terms predicted where SVM training includes assigned GO terms across all evidence code types. SVM reliability is regarded as High (H) when MCC, sensitivity, specificity and precision are jointly above a given threshold. otherwise Reliability is indicated as Low (L). <br />';
  ractive.set('function_tables', table_data);
}

function set_aanorm() {
  let hAA_norm = {};
  hAA_norm.A = { val: 0.071783248006309,
    sde: 0.027367661524275 };
  hAA_norm.V = { val: 0.059624595369901,
    sde: 0.020377791528745 };
  hAA_norm.Y = { val: 0.026075068240437,
    sde: 0.014822471531379 };
  hAA_norm.W = { val: 0.014166002612771,
    sde: 0.010471835801996 };
  hAA_norm.T = { val: 0.052593582972714,
    sde: 0.020094793964597 };
  hAA_norm.S = { val: 0.082123241332099,
    sde: 0.028687566081512 };
  hAA_norm.P = { val: 0.065557531322241,
    sde: 0.034239398496736 };
  hAA_norm.F = { val: 0.037103994969002,
    sde: 0.018543423139186 };
  hAA_norm.M = { val: 0.022562818183955,
    sde: 0.011321039662481 };
  hAA_norm.K = { val: 0.054833979269185,
    sde: 0.029264083667157 };
  hAA_norm.L = { val: 0.10010591575906,
    sde: 0.030276808519009 };
  hAA_norm.I = { val: 0.042034526040467,
    sde: 0.020826849262495 };
  hAA_norm.H = { val: 0.027141403537598,
    sde: 0.01550566378985 };
  hAA_norm.G = { val: 0.069179820104536,
    sde: 0.030087562057328 };
  hAA_norm.Q = { val: 0.065920561931801,
    sde: 0.030103091008366 };
  hAA_norm.E = { val: 0.04647846225838,
    sde: 0.019946269461736 };
  hAA_norm.C = { val: 0.024908551872056,
    sde: 0.020822909589504 };
  hAA_norm.D = { val: 0.044337904726041,
    sde: 0.018436677256726 };
  hAA_norm.N = { val: 0.033507020987033,
    sde: 0.016536022288204 };
  hAA_norm.R = { val: 0.05974046903119,
    sde: 0.025165994773384 };
  return hAA_norm;
}

function set_fnorm() {
  let hF_norm = {};
  hF_norm.hydrophobicity = { val: -0.34876828080152,
    sde: 0.75559152769799 };
  hF_norm['percent positive residues'] = { val: 11.457717466948,
    sde: 3.567133341139 };
  hF_norm['aliphatic index'] = { val: 79.911549319099,
    sde: 16.787617978827 };
  hF_norm['isoelectric point'] = { val: 7.6102046383603,
    sde: 1.9716111020088 };
  hF_norm['molecular weight'] = { val: 48668.412839961,
    sde: 37838.324895969 };
  hF_norm.charge = { val: 5.0991763057604,
    sde: 16.83863659025 };
  hF_norm['percent negative residues'] = { val: 11.026190128176,
    sde: 4.0206631680926 };
  hF_norm['molar extinction coefficient'] = { val: 46475.293923926,
    sde: 39299.399848823 };
  return hF_norm;
}

function get_aa_color(val) {
  let ab_val = Math.abs(val);
  if (ab_val >= 2.96) {
    if (val > 0) {
      return "signif1p";
    }
    return "signif1n";
  } else if (ab_val >= 2.24) {
    if (val > 0) {
      return "signif2p";
    }
    return "signif2n";
  } else if (ab_val >= 1.96) {
    if (val > 0) {
      return "signif5p";
    }
    return "signif5n";
  } else if (ab_val >= 1.645) {
    if (val > 0) {
      return "signif10p";
    }
    return "signif10n";
  }
  return "plain";
}

//parse the ffpred featcfo features file
function parse_featcfg(ractive, file) {
  let lines = file.split('\n');
  let SF_data = {};
  let AA_data = {};
  let hF_norm = set_fnorm();
  let hAA_norm = set_aanorm();
  lines.forEach(function (line, i) {
    if (line.startsWith("AA")) {
      let columns = line.split('\t');
      AA_data[columns[1]] = columns[2];
    }
    if (line.startsWith("SF")) {
      let columns = line.split('\t');
      SF_data[columns[1]] = columns[2];
    }
  });

  // build html tables for the feature data
  let class_colour = '';
  let global_features = ractive.get('global_features');
  let feat_table = '<b>Global Features</b><br />';
  feat_table += 'Global features are calculated directly from sequence. Localisation values are predicted by the Psort algorithm and reflect the relative likelihood of the protein occupying different cellular localisations. The bias column is highlighted according to the significance of the feature value calculated from Z score of the feature.<br />';
  feat_table += '<table><tr><th>Feature Name</th><th>Value</th><th>Bias</th></tr>';

  Object.keys(SF_data).sort().forEach(function (feature_name) {
    let class_colour = '';
    if (feature_name in hF_norm) {
      class_colour = get_aa_color((parseFloat(SF_data[feature_name]) - hF_norm[feature_name].val) / hF_norm[feature_name].sde);
    }
    feat_table += '<tr><td>' + feature_name + '</td><td>' + parseFloat(SF_data[feature_name]).toFixed(2) + '</td><td class="' + class_colour + '">&nbsp;&nbsp;&nbsp;</td></tr>';
  });
  feat_table += '</table>';
  ractive.set('global_features', feat_table);

  //build html table for the AA data
  let aa_composition = ractive.get('aa_composition');
  let aa_table = '<b>Amino Acid Composition (percentages)</b><br />';
  aa_table += '<table><tr>';
  Object.keys(AA_data).sort().forEach(function (residue) {
    aa_table += '<th>' + residue + '</th>';
  });
  aa_table += '</tr><tr>';
  Object.keys(AA_data).sort().forEach(function (residue) {
    let class_colour = '';
    class_colour = get_aa_color((parseFloat(AA_data[residue]) - hAA_norm[residue].val) / hAA_norm[residue].sde);
    aa_table += '<td class="' + class_colour + '">' + (parseFloat(AA_data[residue]) * 100).toFixed(2) + '</td>';
  });
  aa_table += '</tr></table><br />';
  aa_table += '<b>Significance Key</b><br />';
  aa_table += '<table class="signifkey" align="center" cellpadding="2" cellspacing="0">';
  aa_table += '<tr>';
  aa_table += '<td><b>low</b></td>';
  aa_table += '<td colspan="9">&nbsp;</td>';
  aa_table += '<td align="right"><b>high</b></td>';
  aa_table += '</tr>';
  aa_table += '<tr>';
  aa_table += '<td></td>';
  aa_table += '<td class="signif1n">p &lt; 0.01</td>';
  aa_table += '<td class="signif2n">p &lt; 0.02</td>';
  aa_table += '<td class="signif5n">p &lt; 0.05</td>';
  aa_table += '<td class="signif10n">p &lt; 0.1</td>';
  aa_table += '<td>p &gt;= 0.1</td>';
  aa_table += '<td class="signif10p">p &lt; 0.1</td>';
  aa_table += '<td class="signif5p">p &lt; 0.05</td>';
  aa_table += '<td class="signif2p">p &lt; 0.02</td>';
  aa_table += '<td class="signif1p">p &lt; 0.01</td>';
  aa_table += '<td></td>';
  aa_table += '</tr>';
  aa_table += '<tr>';
  aa_table += '<td colspan="11">Significance p value is calculated using the Z score of the percent amino acid composition</td>';
  aa_table += '</tr>';
  aa_table += '</table>';
  ractive.set('aa_composition', aa_table);
}

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
    // console.log(match[1]);
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
    pseudo_table += '<th>Target Len</th>';
    pseudo_table += '<th>Query Len</th>';
    if (type === 'dgen') {
      pseudo_table += '<th>Region Start</th>';
      pseudo_table += '<th>Region End</th>';
      pseudo_table += '<th>CATH Domain</th>';
      pseudo_table += '<th>SEARCH SCOP</th>';
    } else {
      pseudo_table += '<th>Fold</th>';
      pseudo_table += '<th>SEARCH SCOP</th>';
      pseudo_table += '<th>SEARCH CATH</th>';
    }
    pseudo_table += '<th>PDBSUM</th>';
    pseudo_table += '<th>Alignment</th>';
    pseudo_table += '<th>MODEL</th>';

    // if MODELLER THINGY
    pseudo_table += '</tr><tbody">\n';
    lines.forEach(function (line, i) {
      //console.log(line);
      if (line.length === 0) {
        return;
      }
      let entries = line.split(/\s+/);
      let table_hit = entries[9];
      if (type === 'dgen') {
        table_hit = entries[11];
      }
      if (table_hit + "_" + i in ann_list) {
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
        if (type === 'dgen') {
          pdb = entries[11].substring(0, entries[11].length - 3);
        }
        if (type === 'dgen') {
          pseudo_table += "<td>" + entries[9] + "</td>";
          pseudo_table += "<td>" + entries[10] + "</td>";
          pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/version/latest/domain/" + table_hit + "'>" + table_hit + "</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/scop/pdb.cgi?pdb=" + pdb + "'>SCOP SEARCH</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=" + pdb + "'>Open PDBSUM</a></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='psipred.loadNewAlignment(\"" + ann_list[table_hit + "_" + i].aln + "\",\"" + ann_list[table_hit + "_" + i].ann + "\",\"" + (table_hit + "_" + i) + "\");' value='Display Alignment' /></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='psipred.buildModel(\"" + ann_list[table_hit + "_" + i].aln + "\", \"cath_modeller\");' value='Build Model' /></td>";
        } else {
          pseudo_table += "<td><a target='_blank' href='https://www.rcsb.org/pdb/explore/explore.do?structureId=" + pdb + "'>" + table_hit + "</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://scop.mrc-lmb.cam.ac.uk/scop/pdb.cgi?pdb=" + pdb + "'>SCOP SEARCH</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://www.cathdb.info/pdb/" + pdb + "'>CATH SEARCH</a></td>";
          pseudo_table += "<td><a target='_blank' href='http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=" + pdb + "'>Open PDBSUM</a></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='psipred.loadNewAlignment(\"" + ann_list[table_hit + "_" + i].aln + "\",\"" + ann_list[table_hit + "_" + i].ann + "\",\"" + (table_hit + "_" + i) + "\");' value='Display Alignment' /></td>";
          pseudo_table += "<td><input class='button' type='button' onClick='psipred.buildModel(\"" + ann_list[table_hit + "_" + i].aln + "\", \"pdb_modeller\");' value='Build Model' /></td>";
        }
        pseudo_table += "</tr>\n";
      }
    });
    pseudo_table += "</tbody></table>\n";
    ractive.set(type + "_table", pseudo_table);
  } else {
    ractive.set(type + "_table", "<h3>No good hits found. GUESS and LOW confidence hits can be found in the results file</h3>");
  }
}

function parse_parseds(ractive, file) {
  let prediction_regex = /Domain\sBoundary\slocations\spredicted\sDPS:\s(.+)/;
  let prediction_match = prediction_regex.exec(file);
  if (prediction_match) {
    let details = file.replace("\n", "<br />");
    details = details.replace("\n", "<br />");
    ractive.set("parseds_info", "<h4>" + details + "</h4>");
    let values = [];
    if (prediction_match[1].indexOf(",")) {
      values = prediction_match[1].split(',');
      values.forEach(function (value, i) {
        values[i] = parseInt(value);
      });
    } else {
      values[0] = parseInt(prediction_match[1]);
    }
    console.log(values);
    let annotations = ractive.get('annotations');
    values.forEach(function (value) {
      annotations[value].dompred = 'B';
    });
    ractive.set('annotations', annotations);
  } else {
    ractive.set("parseds_info", "No ParseDS Domain boundaries predicted");
  }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = show_panel;
/* harmony export (immutable) */ __webpack_exports__["f"] = clear_settings;
/* harmony export (immutable) */ __webpack_exports__["a"] = prepare_downloads_html;
/* harmony export (immutable) */ __webpack_exports__["b"] = handle_results;
/* harmony export (immutable) */ __webpack_exports__["e"] = display_structure;
/* harmony export (immutable) */ __webpack_exports__["c"] = set_downloads_panel;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(2);



function show_panel(value, ractive) {
  ractive.set('results_panel_visible', null);
  ractive.set('results_panel_visible', value);
}

//before a resubmission is sent all variables are reset to the page defaults
function clear_settings(ractive, gear_string, job_list, job_names) {
  ractive.set('results_visible', 2);
  ractive.set('results_panel_visible', 1);
  ractive.set('psipred_button', false);
  ractive.set('download_links', '');
  job_list.forEach(function (job_name) {
    ractive.set(job_name + '_waiting_message', '<h2>Please wait for your ' + job_names[job_name] + ' job to process</h2>');
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

  ractive.set('annotations', null);
  ractive.set('batch_uuid', null);
  biod3.clearSelection('div.sequence_plot');
  biod3.clearSelection('div.psipred_cartoon');
  biod3.clearSelection('div.comb_plot');

  zip = new JSZip();
}

//Take a couple of variables and prepare the html strings for the downloads panel
function prepare_downloads_html(data, downloads_info, job_list, job_names) {
  job_list.forEach(function (job_name) {
    if (data.job_name === job_name) {
      downloads_info[job_name] = {};
      downloads_info[job_name].header = "<h5>" + job_names[job_name] + " DOWNLOADS</h5>";
      //EXTRA PANELS FOR SOME JOBS TYPES:
      if (job_name === 'pgenthreader' || job_name === 'dompred' || job_name === 'pdomthreader' || job_name === 'metapsicov' || job_name === 'ffpred') {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>" + job_names.psipred + " DOWNLOADS</h5>";
      }
      if (job_name === 'mempack') {
        downloads_info.memsatsvm = {};
        downloads_info.memsatsvm.header = "<h5>" + job_names.memsatsvm + " DOWNLOADS</h5>";
      }
      if (job_name === 'bioserf') {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>" + job_names.psipred + " DOWNLOADS</h5>";
        downloads_info.pgenthreader = {};
        downloads_info.pgenthreader.header = "<h5>" + job_names.pgenthreader + " DOWNLOADS</h5>";
        downloads_info.bioserf = {};
        downloads_info.bioserf.header = "<h5>" + job_names.bioserf + " DOWNLOADS</h5>";
      }
      if (job_name === 'domserf') {
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>" + job_names.psipred + " DOWNLOADS</h5>";
        downloads_info.pdomthreader = {};
        downloads_info.pdomthreader.header = "<h5>" + job_names.pdomthreader + " DOWNLOADS</h5>";
        downloads_info.domserf = {};
        downloads_info.domserf.header = "<h5>" + job_names.domserf + " DOWNLOADS</h5>";
      }
      if (job_name === 'ffpred') {
        downloads_info.memsatsvm = {};
        downloads_info.memsatsvm.header = "<h5>" + job_names.memsatsvm + " DOWNLOADS</h5>";
        downloads_info.psipred = {};
        downloads_info.psipred.header = "<h5>Psipred DOWNLOADS</h5>";
        downloads_info.dompred = {};
        downloads_info.dompred.header = "<h5>DomPred DOWNLOADS</h5>";
        downloads_info.ffpred = {};
        downloads_info.ffpred.header = "<h5>" + job_names.ffpred + " DOWNLOADS</h5>";
      }
    }
  });
}

//take the datablob we've got and loop over the results
function handle_results(ractive, data, file_url, zip, downloads_info, job_names) {
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

  let image_regex = '';
  let results = data.results;
  let domain_count = 0;
  let mempack_result_found = false;
  let domserf_result_found = false;
  let reformat_domserf_models_found = false;
  let psipred_result_found = false;
  let pdomthreader_result_found = false;
  //Prepatory loop for information that is needed before results parsing:
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
    if (result_dict.name === 'GenAlignmentAnnotation_dom') {
      let ann_set = ractive.get("dgen_ann_set");
      let tmp = result_dict.data_path;
      let path = tmp.substr(0, tmp.lastIndexOf("."));
      let id = path.substr(path.lastIndexOf(".") + 1, path.length);
      ann_set[id] = {};
      ann_set[id].ann = path + ".ann";
      ann_set[id].aln = path + ".aln";
      ractive.set("dgen_ann_set", ann_set);
    }
  }
  console.log(results);
  //main results parsing loop
  for (let i in results) {
    let result_dict = results[i];
    //psipred files
    if (result_dict.name == 'psipass2') {
      psipred_result_found = true;
      let match = horiz_regex.exec(result_dict.data_path);
      if (match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'horiz', zip, ractive);
        ractive.set("psipred_waiting_message", '');
        ractive.set("psipred_waiting_icon", '');
        ractive.set("psipred_time", '');
        downloads_info.psipred.horiz = '<a href="' + file_url + result_dict.data_path + '">Horiz Format Output</a><br />';
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

    //memsat and mempack files
    if (result_dict.name === 'memsatsvm') {
      ractive.set("memsatsvm_waiting_message", '');
      ractive.set("memsatsvm_waiting_icon", '');
      ractive.set("memsatsvm_time", '');
      let scheme_match = memsat_schematic_regex.exec(result_dict.data_path);
      if (scheme_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('memsatsvm_schematic', '<img src="' + file_url + result_dict.data_path + '" />');
        downloads_info.memsatsvm.schematic = '<a href="' + file_url + result_dict.data_path + '">Schematic Diagram</a><br />';
      }
      let cartoon_match = memsat_cartoon_regex.exec(result_dict.data_path);
      if (cartoon_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('memsatsvm_cartoon', '<img src="' + file_url + result_dict.data_path + '" />');
        downloads_info.memsatsvm.cartoon = '<a href="' + file_url + result_dict.data_path + '">Cartoon Diagram</a><br />';
      }
      let memsat_match = memsat_data_regex.exec(result_dict.data_path);
      if (memsat_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'memsatdata', zip, ractive);
        downloads_info.memsatsvm.data = '<a href="' + file_url + result_dict.data_path + '">Memsat Output</a><br />';
      }
    }
    //mempack files
    if (result_dict.name === 'mempack_wrapper') {
      ractive.set("mempack_waiting_message", '');
      ractive.set("mempack_waiting_icon", '');
      ractive.set("mempack_time", '');
      let cartoon_match = mempack_cartoon_regex.exec(result_dict.data_path);
      if (cartoon_match) {
        mempack_result_found = true;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('mempack_cartoon', '<img width="1000px" src="' + file_url + result_dict.data_path + '" />');
        downloads_info.mempack.cartoon = '<a href="' + file_url + result_dict.data_path + '">Cartoon Diagram</a><br />';
      }
      let graph_match = mempack_graph_out.exec(result_dict.data_path);
      if (graph_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.graph_out = '<a href="' + file_url + result_dict.data_path + '">Diagram Data</a><br />';
      }
      let contact_match = mempack_contact_res.exec(result_dict.data_path);
      if (contact_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.contact = '<a href="' + file_url + result_dict.data_path + '">Contact Predictions</a><br />';
      }
      let lipid_match = mempack_lipid_res.exec(result_dict.data_path);
      if (lipid_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.mempack.lipid_out = '<a href="' + file_url + result_dict.data_path + '">Lipid Exposure Preditions</a><br />';
      }
    }
    //genthreader and pgenthreader
    if (result_dict.name === 'sort_presult') {
      ractive.set("pgenthreader_waiting_message", '');
      ractive.set("pgenthreader_waiting_icon", '');
      ractive.set("pgenthreader_time", '');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'presult', zip, ractive);
      downloads_info.pgenthreader.table = '<a href="' + file_url + result_dict.data_path + '">' + job_names.pgenthreader + ' Table</a><br />';
    }
    if (result_dict.name === 'gen_sort_presults') {
      ractive.set("genthreader_waiting_message", '');
      ractive.set("genthreader_waiting_icon", '');
      ractive.set("genthreader_time", '');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'gen_presult', zip, ractive);
      downloads_info.genthreader.table = '<a href="' + file_url + result_dict.data_path + '">' + job_names.genthreader + ' Table</a><br />';
    }
    if (result_dict.name === 'pseudo_bas_align') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pgenthreader.align = '<a href="' + file_url + result_dict.data_path + '">' + job_names.pgenthreader + ' Alignments</a><br />';
    }
    if (result_dict.name === 'pseudo_bas_models') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pgenthreader.align = '<a href="' + file_url + result_dict.data_path + '">' + job_names.pgenthreader + ' Alignments</a><br />';
    }

    if (result_dict.name === 'genthreader_pseudo_bas_align') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.genthreader.align = '<a href="' + file_url + result_dict.data_path + '">' + job_names.genthreader + ' Alignments</a><br />';
    }

    //pdomthreader
    if (result_dict.name === 'svm_prob_dom') {
      pdomthreader_result_found = true;
      ractive.set("pdomthreader_waiting_message", '');
      ractive.set("pdomthreader_waiting_icon", '');
      ractive.set("pdomthreader_time", '');
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'dom_presult', zip, ractive);
      downloads_info.pdomthreader.table = '<a href="' + file_url + result_dict.data_path + '">' + job_names.pdomthreader + ' Table</a><br />';
    }
    if (result_dict.name === 'pseudo_bas_dom_align') {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      downloads_info.pdomthreader.align = '<a href="' + file_url + result_dict.data_path + '">' + job_names.pdomthreader + ' Alignments</a><br />';
    }
    //dompred files
    if (result_dict.name === 'parseds') {
      ractive.set("dompred_waiting_message", '');
      ractive.set("dompred_waiting_icon", '');
      ractive.set("dompred_time", '');
      let png_match = png_regex.exec(result_dict.data_path);
      if (png_match) {
        downloads_info.dompred.boundary_png = '<a href="' + file_url + result_dict.data_path + '">Boundary PNG</a><br />';
        ractive.set('parseds_png', '<img src="' + file_url + result_dict.data_path + '" />');
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      } else {
        downloads_info.dompred.boundary = '<a href="' + file_url + result_dict.data_path + '">Boundary file</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'parseds', zip, ractive);
      }
    }
    if (result_dict.name === 'domssea') {
      let pred_match = domssea_pred_regex.exec(result_dict.data_path);
      if (pred_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.dompred.domsseapred = '<a href="' + file_url + result_dict.data_path + '">DOMSSEA predictions</a><br />';
      }
      let domssea_match = domssea_pred_regex.exec(result_dict.data_path);
      if (domssea_match) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        downloads_info.dompred.domssea = '<a href="' + file_url + result_dict.data_path + '">DOMSSEA file</a><br />';
      }
    }
    if (result_dict.name === 'runBioserf') {
      ractive.set("bioserf_waiting_message", '');
      ractive.set("bioserf_waiting_icon", '');
      ractive.set("bioserf_time", '');
      downloads_info.bioserf.model = '<a href="' + file_url + result_dict.data_path + '">Final Homology Model</a><br />';
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
      display_structure(file_url + result_dict.data_path, '#bioserf_model');
    }
    if (result_dict.name === 'hhblits_pdb70') {
      downloads_info.bioserf.hhblits = '<a href="' + file_url + result_dict.data_path + '">HHSearch Results</a><br />';
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if (result_dict.name === 'pgpblast_pdbaa') {
      downloads_info.bioserf.pdbaa = '<a href="' + file_url + result_dict.data_path + '">PDBaa Blast</a><br />';
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if (result_dict.name === 'psiblast_cath') {
      downloads_info.domserf.cathblast = '<a href="' + file_url + result_dict.data_path + '">CATH Blast</a><br />';
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if (result_dict.name === 'psiblast_pdbaa') {
      downloads_info.domserf.pdbblast = '<a href="' + file_url + result_dict.data_path + '">PDBaa Blast</a><br />';
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
    }
    if (result_dict.name === 'reformat_domserf_models' || result_dict.name === "parse_pdb_blast") {
      let domserf_match = domserf_regex.exec(result_dict.data_path);
      if (domserf_match) {
        ractive.set("domserf_waiting_message", '');
        ractive.set("domserf_waiting_icon", '');
        ractive.set("domserf_time", '');
        // TO DO ADD REGEX
        domain_count += 1;
        domserf_result_found = true;
        if (downloads_info.domserf.model) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
          downloads_info.domserf.model += '<a href="' + file_url + result_dict.data_path + '">Model ' + domserf_match[1] + '-' + domserf_match[2] + '</a><br />';
        } else {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
          downloads_info.domserf.model = '<a href="' + file_url + result_dict.data_path + '">Model ' + domserf_match[1] + '-' + domserf_match[2] + '</a><br />';
        }
        let buttons_tags = ractive.get("domserf_buttons");
        buttons_tags += '<button onClick="psipred.swapDomserf(' + domain_count + ')" type="button" class="btn btn-default">Domain ' + domserf_match[1] + '-' + domserf_match[2] + '</button>';
        ractive.set("domserf_buttons", buttons_tags);
        let paths = ractive.get("domserf_model_uris");
        paths.push(file_url + result_dict.data_path);
        ractive.set("domserf_model_uris", paths);
      }
    }

    if (result_dict.name === 'getSchematic') {
      ractive.set("ffpred_waiting_message", '');
      ractive.set("ffpred_waiting_icon", '');
      ractive.set("ffpred_time", '');

      let sch_match = ffpred_sch_regex.exec(result_dict.data_path);
      if (sch_match) {
        downloads_info.ffpred.sch = '<a href="' + file_url + result_dict.data_path + '">Feature Schematic PNG</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('sch_schematic', '<b>Sequence Feature Map</b><br />Position dependent feature predictions are mapped onto the sequence schematic shown below. The line height of the Phosphorylation and Glycosylation features reflects the confidence of the residue prediction.<br /><img src="' + file_url + result_dict.data_path + '" />');
      }
      let cartoon_match = ffpred_svm_regex.exec(result_dict.data_path);
      if (cartoon_match) {
        downloads_info.ffpred.cartoon = '<a href="' + file_url + result_dict.data_path + '">Memsat PNG</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'zip', zip, ractive);
        ractive.set('ffpred_cartoon', '<b>Predicted Transmembrane Topology</b><br /><img src="' + file_url + result_dict.data_path + '" />');
      }
    }

    if (result_dict.name === 'features') {
      let feat_match = ffpred_featcfg_regex.exec(result_dict.data_path);
      if (feat_match) {
        downloads_info.ffpred.features = '<a href="' + file_url + result_dict.data_path + '">Sequence Feature Summary</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'ffpredfeatures', zip, ractive);
      }
    }

    if (result_dict.name === 'ffpred_human') {
      let preds_match = ffpred_preds_regex.exec(result_dict.data_path);
      if (preds_match) {
        downloads_info.ffpred.preds = '<a href="' + file_url + result_dict.data_path + '">GO Predictions</a><br />';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["c" /* process_file */])(file_url, result_dict.data_path, 'ffpredpredictions', zip, ractive);
      }
    }
  }

  //Set no found statments for some jobs.
  if (!mempack_result_found) {
    ractive.set('mempack_cartoon', '<h3>No packing prediction possible</h3>');
  }
  if (!psipred_result_found) {
    ractive.set("psipred_waiting_message", 'No ' + job_names.psipred + ' data generated for this job');
    ractive.set("psipred_waiting_icon", '');
    ractive.set("psipred_time", '');
  }
  if (!pdomthreader_result_found) {
    ractive.set("pdomthreader_waiting_message", 'No ' + job_names.pdomthreader + ' table generated for this job');
    ractive.set("pdomthreader_waiting_icon", '');
    ractive.set("pdomthreader_time", '');
  }
  if (domserf_result_found) {
    let paths = ractive.get("domserf_model_uris");
    display_structure(paths[0], '#domserf_model');
  }
}

function display_structure(uri, css_id) {
  let cartoon_color = function (atom) {
    if (atom.ss === 'h') {
      return '#e353e3';
    }
    if (atom.ss === 's') {
      return '#e5dd55';
    }
    return 'grey';
  };
  console.log("LOADING: " + uri);
  let element = $(css_id);
  let config = { backgroundColor: '#ffffff' };
  let viewer = $3Dmol.createViewer(element, config);
  let data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["d" /* get_text */])(uri, "GET", {});
  viewer.addModel(data, "pdb"); /* load data */
  viewer.setStyle({}, { cartoon: { colorfunc: cartoon_color } }); /* style all atoms */
  viewer.zoomTo(); /* set camera */
  viewer.render(); /* render scene */
  viewer.zoom(1.7, 3000);
}

function set_downloads_panel(ractive, downloads_info) {
  //console.log(downloads_info);
  let downloads_string = ractive.get('download_links');
  if ('psipred' in downloads_info) {
    if (downloads_info.psipred.horiz) {
      downloads_string = downloads_string.concat(downloads_info.psipred.header);
      downloads_string = downloads_string.concat(downloads_info.psipred.horiz);
      downloads_string = downloads_string.concat(downloads_info.psipred.ss2);
      downloads_string = downloads_string.concat("<br />");
    }
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
  if ('pdomthreader' in downloads_info) {
    if (downloads_info.pdomthreader.table) {
      downloads_string = downloads_string.concat(downloads_info.pdomthreader.header);
      downloads_string = downloads_string.concat(downloads_info.pdomthreader.table);
      downloads_string = downloads_string.concat(downloads_info.pdomthreader.align);
      downloads_string = downloads_string.concat("<br />");
    }
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
  if ('bioserf' in downloads_info) {
    downloads_string = downloads_string.concat(downloads_info.bioserf.header);
    downloads_string = downloads_string.concat(downloads_info.bioserf.model);
    downloads_string = downloads_string.concat(downloads_info.bioserf.hhblits);
    downloads_string = downloads_string.concat(downloads_info.bioserf.pdbaa);
    downloads_string = downloads_string.concat("<br />");
  }
  if ('domserf' in downloads_info) {
    downloads_string = downloads_string.concat(downloads_info.domserf.header);
    downloads_string = downloads_string.concat(downloads_info.domserf.model);
    downloads_string = downloads_string.concat(downloads_info.domserf.cathblast);
    downloads_string = downloads_string.concat(downloads_info.domserf.pdbblast);
    downloads_string = downloads_string.concat("<br />");
  }
  if ('ffpred' in downloads_info) {
    downloads_string = downloads_string.concat(downloads_info.ffpred.header);
    downloads_string = downloads_string.concat(downloads_info.ffpred.sch);
    downloads_string = downloads_string.concat(downloads_info.ffpred.cartoon);
    downloads_string = downloads_string.concat(downloads_info.ffpred.features);
    downloads_string = downloads_string.concat(downloads_info.ffpred.preds);
    downloads_string = downloads_string.concat("<br />");
  }
  ractive.set('download_links', downloads_string);
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = send_request;
/* harmony export (immutable) */ __webpack_exports__["e"] = send_job;
/* harmony export (immutable) */ __webpack_exports__["b"] = get_previous_data;
/* harmony export (immutable) */ __webpack_exports__["d"] = get_text;
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
function send_job(ractive, job_name, seq, name, email, submit_url, times_url, job_names) {
  //alert(seq);
  console.log("Sending form data");
  console.log(job_name);
  var file = null;
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
      ractive.set(job_name + '_time', job_names[job_name] + " jobs typically take " + times[job_name] + " seconds");
    } else {
      ractive.set(job_name + '_time', "Unable to retrieve average time for " + job_names[job_name] + " jobs.");
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
      if (ctl === 'dom_presult') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["e" /* parse_presult */])(ractive, file, 'dgen');
      }
      if (ctl === 'parseds') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["f" /* parse_parseds */])(ractive, file);
      }
      if (ctl === 'ffpredfeatures') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["g" /* parse_featcfg */])(ractive, file);
      }
      if (ctl === 'ffpredpredictions') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__parsers_parsers_index_js__["h" /* parse_ffpreds */])(ractive, file);
      }
    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loadNewAlignment"] = loadNewAlignment;
/* harmony export (immutable) */ __webpack_exports__["buildModel"] = buildModel;
/* harmony export (immutable) */ __webpack_exports__["swapDomserf"] = swapDomserf;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requests_requests_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_common_index_js__ = __webpack_require__(3);
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
let job_list = ["psipred", "pgenthreader", "metapsicov", "disopred", "mempack", "memsatsvm", "genthreader", "dompred", "pdomthreader", "bioserf", "domserf", "ffpred", "metsite", "hspred", "memembed", "gentdb"];
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
initialisation_data.ffpred_checked = true;
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["a" /* prepare_downloads_html */])(data, downloads_info, job_list, job_names);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["b" /* handle_results */])(ractive, data, file_url, zip, downloads_info, job_names);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(1, ractive);
});

//register listeners for each results panel
job_list.forEach(function (job_name, i) {
  console.log("adding jobs watchers");
  ractive.on(job_name + '_active', function (event) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["d" /* show_panel */])(i + 2, ractive);
    if (job_name === "psipred") {
      if (ractive.get('psipred_horiz')) {
        biod3.psipred(ractive.get('psipred_horiz'), 'psipredChart', { parent: 'div.psipred_cartoon', margin_scaler: 2 });
      }
    }
    if (job_name === "disopred") {
      if (ractive.get('diso_precision')) {
        biod3.genericxyLineChart(ractive.get('diso_precision'), 'pos', ['precision'], ['Black'], 'DisoNNChart', { parent: 'div.comb_plot', chartType: 'line', y_cutoff: 0.5, margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300 });
      }
    }
    if (job_name === 'domserf') {
      if (ractive.get('domserf_model_uris').length) {
        let paths = ractive.get('domserf_model_uris');
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["e" /* display_structure */])(paths[0], '#domserf_model');
      }
    }
  });
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, seq, name, email, submit_url, times_url, check_states, job_list, job_names);
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
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["f" /* clear_settings */])(ractive, gear_string, job_list, job_names);
  //verify form contents and post
  //console.log(name);
  //console.log(email);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__forms_forms_index_js__["a" /* verify_and_send_form */])(ractive, subsequence, name, email, submit_url, times_url, check_states, job_list, job_names);
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
    ractive.set('results_panel_visible', 2);
  }
  if (previous_data.jobs.includes('pgenthreader')) {
    ractive.set('psipred_button', true);
    ractive.set('pgenthreader_button', true);
    ractive.set('results_panel_visible', 3);
  }
  if (previous_data.jobs.includes('metapsicov')) {
    ractive.set('metapsicov_button', true);
    ractive.set('results_panel_visible', 4);
  }
  if (previous_data.jobs.includes('disopred')) {
    ractive.set('disopred_button', true);
    ractive.set('results_panel_visible', 5);
  }
  if (previous_data.jobs.includes('mempack')) {
    ractive.set('memsatsvm_button', true);
    ractive.set('mempack_button', true);
    ractive.set('results_panel_visible', 6);
  }
  if (previous_data.jobs.includes('memsatsvm')) {
    ractive.set('memsatsvm_button', true);
    ractive.set('results_panel_visible', 7);
  }
  if (previous_data.jobs.includes('genthreader')) {
    ractive.set('genthreader_button', true);
    ractive.set('results_panel_visible', 8);
  }
  if (previous_data.jobs.includes('dompred')) {
    ractive.set('psipred_button', true);
    ractive.set('dompred_button', true);
    ractive.set('results_panel_visible', 9);
  }
  if (previous_data.jobs.includes('pdomthreader')) {
    ractive.set('psipred_button', true);
    ractive.set('pdomthreader_button', true);
    ractive.set('results_panel_visible', 10);
  }
  if (previous_data.jobs.includes('bioserf')) {
    ractive.set('psipred_button', true);
    ractive.set('pgenthreader_button', true);
    ractive.set('bioserf_button', true);
    ractive.set('results_panel_visible', 11);
  }
  if (previous_data.jobs.includes('domserf')) {
    ractive.set('psipred_button', true);
    ractive.set('pdomthreader_button', true);
    ractive.set('domserf_button', true);
    ractive.set('results_panel_visible', 12);
  }
  if (previous_data.jobs.includes('ffpred')) {
    ractive.set('ffpred_button', true);
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
function buildModel(alnURI, type) {

  let url = submit_url + ractive.get('batch_uuid');
  let mod_key = ractive.get('modeller_key');
  if (mod_key === 'M' + 'O' + 'D' + 'E' + 'L' + 'I' + 'R' + 'A' + 'N' + 'J' + 'E') {
    //alert(type);
    window.open(".." + app_path + "/model/post?type=" + type + "&aln=" + file_url + alnURI, "", "width=670,height=700");
  } else {
    alert('Please provide a valid M' + 'O' + 'D' + 'E' + 'L' + 'L' + 'E' + 'R Licence Key');
  }
}

// Swaps out the domserf model when those buttons are clicked
function swapDomserf(uri_number) {
  uri_number = uri_number - 1;
  let paths = ractive.get("domserf_model_uris");
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__ractive_helpers_ractive_helpers_js__["e" /* display_structure */])(paths[uri_number], '#domserf_model');
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = verify_and_send_form;
/* unused harmony export verify_form */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_common_index_js__ = __webpack_require__(3);




//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, check_states, job_list, job_names) {
  /*verify that everything here is ok*/
  let error_message = null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  let check_list = [];
  job_list.forEach(function (job_name) {
    check_list.push(check_states[job_name + '_checked']);
  });
  error_message = verify_form(seq, name, email, check_list);

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
    job_list.forEach(function (job_name) {
      if (check_states[job_name + '_checked'] === true) {
        job_string = job_string.concat(job_name + ",");
        ractive.set(job_name + '_button', true);
        if (job_name === 'pgenthreader' || job_name === 'disopred' || job_name === 'dompred' || job_name === 'pdomthreader' || job_name === 'bioserf' || job_name === 'domserf') {
          ractive.set('psipred_button', true);
          check_states.psipred_checked = false;
        }
        if (job_name === 'bioserf') {
          ractive.set('pgenthreader_button', true);
          check_states.pgenthreader_checked = false;
        }
        if (job_name === 'domserf') {
          ractive.set('pdomthreader_button', true);
          check_states.pdomthreader_checked = false;
        }
        if (job_name === 'mempack') {
          ractive.set('memsatsvm_button', true);
        }
      }
    });

    job_string = job_string.slice(0, -1);
    response = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__requests_requests_index_js__["e" /* send_job */])(ractive, job_string, seq, name, email, submit_url, times_url, job_names);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDkwZTUzZmVhNGRhNzhlOGMzOWIiLCJ3ZWJwYWNrOi8vLy4vbGliL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbW1vbi9jb21tb25faW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Zvcm1zL2Zvcm1zX2luZGV4LmpzIl0sIm5hbWVzIjpbInBhcnNlX2ZmcHJlZHMiLCJyYWN0aXZlIiwiZmlsZSIsImxpbmVzIiwic3BsaXQiLCJicF9kYXRhIiwibWZfZGF0YSIsImNjX2RhdGEiLCJ0YWJsZV9kYXRhIiwiZm9yRWFjaCIsImxpbmUiLCJpIiwic3RhcnRzV2l0aCIsImVudHJpZXMiLCJsZW5ndGgiLCJwdXNoIiwiY2xhc3NfY29sb3VyIiwic2V0Iiwic2V0X2Fhbm9ybSIsImhBQV9ub3JtIiwiQSIsInZhbCIsInNkZSIsIlYiLCJZIiwiVyIsIlQiLCJTIiwiUCIsIkYiLCJNIiwiSyIsIkwiLCJJIiwiSCIsIkciLCJRIiwiRSIsIkMiLCJEIiwiTiIsIlIiLCJzZXRfZm5vcm0iLCJoRl9ub3JtIiwiaHlkcm9waG9iaWNpdHkiLCJjaGFyZ2UiLCJnZXRfYWFfY29sb3IiLCJhYl92YWwiLCJNYXRoIiwiYWJzIiwicGFyc2VfZmVhdGNmZyIsIlNGX2RhdGEiLCJBQV9kYXRhIiwiY29sdW1ucyIsImdsb2JhbF9mZWF0dXJlcyIsImdldCIsImZlYXRfdGFibGUiLCJPYmplY3QiLCJrZXlzIiwic29ydCIsImZlYXR1cmVfbmFtZSIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwiYWFfY29tcG9zaXRpb24iLCJhYV90YWJsZSIsInJlc2lkdWUiLCJnZXRfbWVtc2F0X3JhbmdlcyIsInJlZ2V4IiwiZGF0YSIsIm1hdGNoIiwiZXhlYyIsImluY2x1ZGVzIiwicmVnaW9ucyIsInJlZ2lvbiIsInBhcnNlSW50Iiwic2VnIiwicGFyc2Vfc3MyIiwiYW5ub3RhdGlvbnMiLCJzaGlmdCIsImZpbHRlciIsIkJvb2xlYW4iLCJzcyIsImJpb2QzIiwiYW5ub3RhdGlvbkdyaWQiLCJwYXJlbnQiLCJtYXJnaW5fc2NhbGVyIiwiZGVidWciLCJjb250YWluZXJfd2lkdGgiLCJ3aWR0aCIsImhlaWdodCIsImNvbnRhaW5lcl9oZWlnaHQiLCJhbGVydCIsInBhcnNlX3BiZGF0IiwiZGlzb3ByZWQiLCJwYXJzZV9jb21iIiwicHJlY2lzaW9uIiwicG9zIiwiZ2VuZXJpY3h5TGluZUNoYXJ0IiwiY2hhcnRUeXBlIiwieV9jdXRvZmYiLCJwYXJzZV9tZW1zYXRkYXRhIiwic2VxIiwidG9wb19yZWdpb25zIiwic2lnbmFsX3JlZ2lvbnMiLCJyZWVudHJhbnRfcmVnaW9ucyIsInRlcm1pbmFsIiwiY29pbF90eXBlIiwidG1wX2Fubm8iLCJBcnJheSIsInByZXZfZW5kIiwiZmlsbCIsImFubm8iLCJtZW1zYXQiLCJwYXJzZV9wcmVzdWx0IiwidHlwZSIsImFubl9saXN0IiwicHNldWRvX3RhYmxlIiwidGFibGVfaGl0IiwidG9Mb3dlckNhc2UiLCJwZGIiLCJzdWJzdHJpbmciLCJhbG4iLCJhbm4iLCJwYXJzZV9wYXJzZWRzIiwicHJlZGljdGlvbl9yZWdleCIsInByZWRpY3Rpb25fbWF0Y2giLCJkZXRhaWxzIiwicmVwbGFjZSIsInZhbHVlcyIsImluZGV4T2YiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJkb21wcmVkIiwic2hvd19wYW5lbCIsImNsZWFyX3NldHRpbmdzIiwiZ2Vhcl9zdHJpbmciLCJqb2JfbGlzdCIsImpvYl9uYW1lcyIsImpvYl9uYW1lIiwiY2xlYXJTZWxlY3Rpb24iLCJ6aXAiLCJKU1ppcCIsInByZXBhcmVfZG93bmxvYWRzX2h0bWwiLCJkb3dubG9hZHNfaW5mbyIsImhlYWRlciIsInBzaXByZWQiLCJtZW1zYXRzdm0iLCJwZ2VudGhyZWFkZXIiLCJiaW9zZXJmIiwicGRvbXRocmVhZGVyIiwiZG9tc2VyZiIsImZmcHJlZCIsImhhbmRsZV9yZXN1bHRzIiwiZmlsZV91cmwiLCJob3Jpel9yZWdleCIsInNzMl9yZWdleCIsInBuZ19yZWdleCIsIm1lbXNhdF9jYXJ0b29uX3JlZ2V4IiwibWVtc2F0X3NjaGVtYXRpY19yZWdleCIsIm1lbXNhdF9kYXRhX3JlZ2V4IiwibWVtcGFja19jYXJ0b29uX3JlZ2V4IiwibWVtcGFja19ncmFwaF9vdXQiLCJtZW1wYWNrX2NvbnRhY3RfcmVzIiwibWVtcGFja19saXBpZF9yZXMiLCJkb21zc2VhX3ByZWRfcmVnZXgiLCJkb21zc2VhX3JlZ2V4IiwiZG9tc2VyZl9yZWdleCIsImZmcHJlZF9zY2hfcmVnZXgiLCJmZnByZWRfc3ZtX3JlZ2V4IiwiZmZwcmVkX3NjaGVtYXRpY19yZWdleCIsImZmcHJlZF90bV9yZWdleCIsImZmcHJlZF9mZWF0Y2ZnX3JlZ2V4IiwiZmZwcmVkX3ByZWRzX3JlZ2V4IiwiaW1hZ2VfcmVnZXgiLCJyZXN1bHRzIiwiZG9tYWluX2NvdW50IiwibWVtcGFja19yZXN1bHRfZm91bmQiLCJkb21zZXJmX3Jlc3VsdF9mb3VuZCIsInJlZm9ybWF0X2RvbXNlcmZfbW9kZWxzX2ZvdW5kIiwicHNpcHJlZF9yZXN1bHRfZm91bmQiLCJwZG9tdGhyZWFkZXJfcmVzdWx0X2ZvdW5kIiwicmVzdWx0X2RpY3QiLCJuYW1lIiwiYW5uX3NldCIsInRtcCIsImRhdGFfcGF0aCIsInBhdGgiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImlkIiwicHJvY2Vzc19maWxlIiwiaG9yaXoiLCJzczJfbWF0Y2giLCJzczIiLCJwYmRhdCIsImNvbWIiLCJzY2hlbWVfbWF0Y2giLCJzY2hlbWF0aWMiLCJjYXJ0b29uX21hdGNoIiwiY2FydG9vbiIsIm1lbXNhdF9tYXRjaCIsIm1lbXBhY2siLCJncmFwaF9tYXRjaCIsImdyYXBoX291dCIsImNvbnRhY3RfbWF0Y2giLCJjb250YWN0IiwibGlwaWRfbWF0Y2giLCJsaXBpZF9vdXQiLCJ0YWJsZSIsImdlbnRocmVhZGVyIiwiYWxpZ24iLCJwbmdfbWF0Y2giLCJib3VuZGFyeV9wbmciLCJib3VuZGFyeSIsInByZWRfbWF0Y2giLCJkb21zc2VhcHJlZCIsImRvbXNzZWFfbWF0Y2giLCJkb21zc2VhIiwibW9kZWwiLCJkaXNwbGF5X3N0cnVjdHVyZSIsImhoYmxpdHMiLCJwZGJhYSIsImNhdGhibGFzdCIsInBkYmJsYXN0IiwiZG9tc2VyZl9tYXRjaCIsImJ1dHRvbnNfdGFncyIsInBhdGhzIiwic2NoX21hdGNoIiwic2NoIiwiZmVhdF9tYXRjaCIsImZlYXR1cmVzIiwicHJlZHNfbWF0Y2giLCJwcmVkcyIsInVyaSIsImNzc19pZCIsImNhcnRvb25fY29sb3IiLCJhdG9tIiwiZWxlbWVudCIsIiQiLCJjb25maWciLCJiYWNrZ3JvdW5kQ29sb3IiLCJ2aWV3ZXIiLCIkM0Rtb2wiLCJjcmVhdGVWaWV3ZXIiLCJnZXRfdGV4dCIsImFkZE1vZGVsIiwic2V0U3R5bGUiLCJjb2xvcmZ1bmMiLCJ6b29tVG8iLCJyZW5kZXIiLCJ6b29tIiwic2V0X2Rvd25sb2Fkc19wYW5lbCIsImRvd25sb2Fkc19zdHJpbmciLCJjb25jYXQiLCJzZW5kX3JlcXVlc3QiLCJ1cmwiLCJzZW5kX2RhdGEiLCJyZXNwb25zZSIsImFqYXgiLCJjYWNoZSIsImNvbnRlbnRUeXBlIiwicHJvY2Vzc0RhdGEiLCJhc3luYyIsImRhdGFUeXBlIiwic3VjY2VzcyIsImVycm9yIiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2VKU09OIiwic2VuZF9qb2IiLCJlbWFpbCIsInN1Ym1pdF91cmwiLCJ0aW1lc191cmwiLCJCbG9iIiwiZSIsImZkIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZV9kYXRhIiwidGltZXMiLCJrIiwiZmlyZSIsImdldF9wcmV2aW91c19kYXRhIiwidXVpZCIsInN1Ym1pc3Npb25fcmVzcG9uc2UiLCJzdWJtaXNzaW9ucyIsImlucHV0X2ZpbGUiLCJqb2JzIiwic3VibWlzc2lvbiIsInNsaWNlIiwic3VibWlzc2lvbl9uYW1lIiwidXJsX3N0dWIiLCJjdGwiLCJwYXRoX2JpdHMiLCJmb2xkZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiaXNJbkFycmF5IiwiYXJyYXkiLCJkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwiLCJyZXNpZHVlcyIsInJlcyIsImdldFVybFZhcnMiLCJ2YXJzIiwicGFydHMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJtIiwia2V5IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbXBvcnRhbnQiLCJzdHlsZSIsImdldEVtUGl4ZWxzIiwiZXh0cmFCb2R5IiwiY3JlYXRlRWxlbWVudCIsImNzc1RleHQiLCJpbnNlcnRCZWZvcmUiLCJib2R5IiwidGVzdEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImNsaWVudFdpZHRoIiwicmVtb3ZlQ2hpbGQiLCJjbGlwYm9hcmQiLCJDbGlwYm9hcmQiLCJvbiIsImVuZHBvaW50c191cmwiLCJnZWFyc19zdmciLCJtYWluX3VybCIsImFwcF9wYXRoIiwiaG9zdG5hbWUiLCJpbml0aWFsaXNhdGlvbl9kYXRhIiwic2VxdWVuY2VfZm9ybV92aXNpYmxlIiwic3RydWN0dXJlX2Zvcm1fdmlzaWJsZSIsInJlc3VsdHNfdmlzaWJsZSIsInJlc3VsdHNfcGFuZWxfdmlzaWJsZSIsInN1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUiLCJtb2RlbGxlcl9rZXkiLCJkb3dubG9hZF9saW5rcyIsInBzaXByZWRfaG9yaXoiLCJkaXNvX3ByZWNpc2lvbiIsIm1lbXNhdHN2bV9zY2hlbWF0aWMiLCJtZW1zYXRzdm1fY2FydG9vbiIsInBnZW5fdGFibGUiLCJwZ2VuX2Fubl9zZXQiLCJtZW1zYXRwYWNrX3NjaGVtYXRpYyIsIm1lbXNhdHBhY2tfY2FydG9vbiIsImdlbl90YWJsZSIsImdlbl9hbm5fc2V0IiwicGFyc2Vkc19pbmZvIiwicGFyc2Vkc19wbmciLCJkZ2VuX3RhYmxlIiwiZGdlbl9hbm5fc2V0IiwiYmlvc2VyZl9tb2RlbCIsImRvbXNlcmZfYnV0dG9ucyIsImRvbXNlcmZfbW9kZWxfdXJpcyIsImZmcHJlZF9jYXJ0b29uIiwic2NoX3NjaGVtYXRpYyIsImZ1bmN0aW9uX3RhYmxlcyIsIm1ldGFwc2ljb3ZfZGF0YSIsIm1ldHNpdGVfZGF0YSIsImhzcHJlZF9kYXRhIiwibWVtZW1iZWRfZGF0YSIsImdlbnRkYl9kYXRhIiwic2VxdWVuY2UiLCJzZXF1ZW5jZV9sZW5ndGgiLCJzdWJzZXF1ZW5jZV9zdGFydCIsInN1YnNlcXVlbmNlX3N0b3AiLCJiYXRjaF91dWlkIiwiZmZwcmVkX2NoZWNrZWQiLCJSYWN0aXZlIiwiZWwiLCJ0ZW1wbGF0ZSIsInV1aWRfcmVnZXgiLCJ1dWlkX21hdGNoIiwic2VxX29ic2VydmVyIiwib2JzZXJ2ZSIsIm5ld1ZhbHVlIiwib2xkVmFsdWUiLCJpbml0IiwiZGVmZXIiLCJzZXFfbGVuZ3RoIiwic2VxX3N0YXJ0Iiwic2VxX3N0b3AiLCJqb2JfdHlwZSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiYmF0Y2giLCJzdGF0ZSIsImNsZWFySW50ZXJ2YWwiLCJzdWJtaXNzaW9uX21lc3NhZ2UiLCJsYXN0X21lc3NhZ2UiLCJjb250ZXh0IiwiZ2VuZXJhdGVBc3luYyIsInRoZW4iLCJibG9iIiwic2F2ZUFzIiwiZXZlbnQiLCJzZXR0aW5nIiwidG9VcHBlckNhc2UiLCJjaGVja19zdGF0ZXMiLCJ2ZXJpZnlfYW5kX3NlbmRfZm9ybSIsIm9yaWdpbmFsIiwicHJldmVudERlZmF1bHQiLCJzdGFydCIsInN0b3AiLCJzdWJzZXF1ZW5jZSIsImNhbmNlbCIsInByZXZpb3VzX2RhdGEiLCJsb2FkTmV3QWxpZ25tZW50IiwiYWxuVVJJIiwiYW5uVVJJIiwidGl0bGUiLCJvcGVuIiwiYnVpbGRNb2RlbCIsIm1vZF9rZXkiLCJzd2FwRG9tc2VyZiIsInVyaV9udW1iZXIiLCJlcnJvcl9tZXNzYWdlIiwiam9iX3N0cmluZyIsImNoZWNrX2xpc3QiLCJ2ZXJpZnlfZm9ybSIsInBzaXByZWRfY2hlY2tlZCIsInBnZW50aHJlYWRlcl9jaGVja2VkIiwicGRvbXRocmVhZGVyX2NoZWNrZWQiLCJjaGVja2VkX2FycmF5IiwidGVzdCIsIm51Y2xlb3RpZGVfY291bnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEVPLFNBQVNBLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQWdDQyxJQUFoQyxFQUFxQzs7QUFFMUMsTUFBSUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLElBQVgsQ0FBWjtBQUNBLE1BQUlDLFVBQVUsRUFBZDtBQUNBLE1BQUlDLFVBQVUsRUFBZDtBQUNBLE1BQUlDLFVBQVUsRUFBZDtBQUNBLE1BQUlDLGFBQWEsRUFBakI7QUFDQUwsUUFBTU0sT0FBTixDQUFjLFVBQVNDLElBQVQsRUFBZUMsQ0FBZixFQUFpQjtBQUM3QixRQUFHRCxLQUFLRSxVQUFMLENBQWdCLEdBQWhCLENBQUgsRUFBd0I7QUFBQztBQUFRO0FBQ2pDLFFBQUlDLFVBQVVILEtBQUtOLEtBQUwsQ0FBVyxJQUFYLENBQWQ7QUFDQSxRQUFHUyxRQUFRQyxNQUFSLEdBQWlCLENBQXBCLEVBQXNCO0FBQUM7QUFB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QUNFdVosb0JBQWdCQSxnQkFBZ0IsNkNBQWhDO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJUyxtQkFBbUIsQ0FBQ3pVLElBQUloQyxLQUFKLENBQVUsMEJBQVYsS0FBdUMsRUFBeEMsRUFBNEN2RCxNQUFuRTtBQUNBLE1BQUlnYSxtQkFBaUJ6VSxJQUFJdkYsTUFBdEIsR0FBZ0MsSUFBbkMsRUFDQTtBQUNFdVosb0JBQWdCQSxnQkFBZ0Isd0dBQWhDO0FBQ0Q7QUFDRCxNQUFHLCtCQUErQlEsSUFBL0IsQ0FBb0N4VSxHQUFwQyxDQUFILEVBQ0E7QUFDRWdVLG9CQUFnQkEsZ0JBQWdCLGlEQUFoQztBQUNEOztBQUVELE1BQUcsaUdBQUE1SCxDQUFVLElBQVYsRUFBZ0JtSSxhQUFoQixNQUFtQyxLQUF0QyxFQUE2QztBQUMzQ1Asb0JBQWdCQSxnQkFBZ0IsK0NBQWhDO0FBQ0Q7QUFDRCxTQUFPQSxhQUFQO0FBQ0QsQyIsImZpbGUiOiJwc2lwcmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYXNzZXRzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ5MGU1M2ZlYTRkYTc4ZThjMzliIiwiZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX2ZmcHJlZHMocmFjdGl2ZSwgZmlsZSl7XG5cbiAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gIGxldCBicF9kYXRhID0gW107XG4gIGxldCBtZl9kYXRhID0gW107XG4gIGxldCBjY19kYXRhID0gW107XG4gIGxldCB0YWJsZV9kYXRhID0gJyc7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgaWYobGluZS5zdGFydHNXaXRoKCcjJykpe3JldHVybjt9XG4gICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KCdcXHQnKTtcbiAgICBpZihlbnRyaWVzLmxlbmd0aCA8IDQpe3JldHVybjt9XG4gICAgaWYoZW50cmllc1szXSA9PT0gJ0JQJyl7YnBfZGF0YS5wdXNoKGVudHJpZXMpO31cbiAgICBpZihlbnRyaWVzWzNdID09PSAnQ0MnKXtjY19kYXRhLnB1c2goZW50cmllcyk7fVxuICAgIGlmKGVudHJpZXNbM10gPT09ICdNRicpe21mX2RhdGEucHVzaChlbnRyaWVzKTt9XG4gIH0pO1xuXG4gIHRhYmxlX2RhdGEgKz0gXCI8Yj5CaW9sb2dpY2FsIFByb2Nlc3MgUHJlZGljdGlvbnM8L2I+PGJyIC8+XCI7XG4gIHRhYmxlX2RhdGEgKz0gXCI8dGFibGU+PHRyPjx0aD5HTyB0ZXJtPC90aD48dGg+TmFtZTwvdGg+PHRoPlByb2I8L3RoPjx0aD5TVk0gUmVsaWFiaWxpdHk8L3RoPjwvdHI+XCI7XG4gIGJwX2RhdGEuZm9yRWFjaChmdW5jdGlvbihlbnRyaWVzLCBpKXtcbiAgICBsZXQgY2xhc3NfY29sb3VyID0gJ3NhZmUnO1xuICAgIGlmKGVudHJpZXNbMl09PT0nTCcpe2NsYXNzX2NvbG91ciA9ICdub3RzYWZlJzt9XG4gICAgdGFibGVfZGF0YSArPSAnPHRyIGNsYXNzPVwiJytjbGFzc19jb2xvdXIrJ1wiPic7XG4gICAgdGFibGVfZGF0YSArPSAnPHRkPicrZW50cmllc1sxXSsnPC90ZD4nO1xuICAgIHRhYmxlX2RhdGEgKz0gJzx0ZD4nK2VudHJpZXNbNF0rJzwvdGQ+JztcbiAgICB0YWJsZV9kYXRhICs9ICc8dGQ+JytlbnRyaWVzWzBdKyc8L3RkPic7XG4gICAgdGFibGVfZGF0YSArPSAnPHRkPicrZW50cmllc1syXSsnPC90ZD4nO1xuICAgIHRhYmxlX2RhdGEgKz0gJzwvdHI+JztcblxuICB9KTtcbiAgdGFibGVfZGF0YSArPSAnPC90YWJsZT48YnIgLz4nO1xuICByYWN0aXZlLnNldCgnZnVuY3Rpb25fdGFibGVzJywgdGFibGVfZGF0YSk7XG5cbiAgdGFibGVfZGF0YSArPSBcIjxiPk1vbGVjdWxhciBGdW5jdGlvbiBQcmVkaWN0aW9uczwvYj48YnIgLz5cIjtcbiAgdGFibGVfZGF0YSArPSBcIjx0YWJsZT48dHI+PHRoPkdPIHRlcm08L3RoPjx0aD5OYW1lPC90aD48dGg+UHJvYjwvdGg+PHRoPlNWTSBSZWxpYWJpbGl0eTwvdGg+PC90cj5cIjtcbiAgbWZfZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVudHJpZXMsIGkpe1xuICAgIGxldCBjbGFzc19jb2xvdXIgPSAnc2FmZSc7XG4gICAgaWYoZW50cmllc1syXT09PSdMJyl7Y2xhc3NfY29sb3VyID0gJ25vdHNhZmUnO31cbiAgICB0YWJsZV9kYXRhICs9ICc8dHIgY2xhc3M9XCInK2NsYXNzX2NvbG91cisnXCI+JztcbiAgICB0YWJsZV9kYXRhICs9ICc8dGQ+JytlbnRyaWVzWzFdKyc8L3RkPic7XG4gICAgdGFibGVfZGF0YSArPSAnPHRkPicrZW50cmllc1s0XSsnPC90ZD4nO1xuICAgIHRhYmxlX2RhdGEgKz0gJzx0ZD4nK2VudHJpZXNbMF0rJzwvdGQ+JztcbiAgICB0YWJsZV9kYXRhICs9ICc8dGQ+JytlbnRyaWVzWzJdKyc8L3RkPic7XG4gICAgdGFibGVfZGF0YSArPSAnPC90cj4nO1xuXG4gIH0pO1xuICB0YWJsZV9kYXRhICs9ICc8L3RhYmxlPjxiciAvPic7XG4gIHJhY3RpdmUuc2V0KCdmdW5jdGlvbl90YWJsZXMnLCB0YWJsZV9kYXRhKTtcblxuICB0YWJsZV9kYXRhICs9IFwiPGI+Q2VsbHVsYXIgQ29tcG9uZW50IFByZWRpY3Rpb25zPC9iPjxiciAvPlwiO1xuICB0YWJsZV9kYXRhICs9IFwiPHRhYmxlPjx0cj48dGg+R08gdGVybTwvdGg+PHRoPk5hbWU8L3RoPjx0aD5Qcm9iPC90aD48dGg+U1ZNIFJlbGlhYmlsaXR5PC90aD48L3RyPlwiO1xuICBjY19kYXRhLmZvckVhY2goZnVuY3Rpb24oZW50cmllcywgaSl7XG4gICAgbGV0IGNsYXNzX2NvbG91ciA9ICdzYWZlJztcbiAgICBpZihlbnRyaWVzWzJdPT09J0wnKXtjbGFzc19jb2xvdXIgPSAnbm90c2FmZSc7fVxuICAgIHRhYmxlX2RhdGEgKz0gJzx0ciBjbGFzcz1cIicrY2xhc3NfY29sb3VyKydcIj4nO1xuICAgIHRhYmxlX2RhdGEgKz0gJzx0ZD4nK2VudHJpZXNbMV0rJzwvdGQ+JztcbiAgICB0YWJsZV9kYXRhICs9ICc8dGQ+JytlbnRyaWVzWzRdKyc8L3RkPic7XG4gICAgdGFibGVfZGF0YSArPSAnPHRkPicrZW50cmllc1swXSsnPC90ZD4nO1xuICAgIHRhYmxlX2RhdGEgKz0gJzx0ZD4nK2VudHJpZXNbMl0rJzwvdGQ+JztcbiAgICB0YWJsZV9kYXRhICs9ICc8L3RyPic7XG4gIH0pO1xuICB0YWJsZV9kYXRhICs9ICc8L3RhYmxlPjxiciAvPic7XG4gIHRhYmxlX2RhdGEgKz0gJ1RoZXNlIHByZWRpY3Rpb24gdGVybXMgcmVwcmVzZW50IHRlcm1zIHByZWRpY3RlZCB3aGVyZSBTVk0gdHJhaW5pbmcgaW5jbHVkZXMgYXNzaWduZWQgR08gdGVybXMgYWNyb3NzIGFsbCBldmlkZW5jZSBjb2RlIHR5cGVzLiBTVk0gcmVsaWFiaWxpdHkgaXMgcmVnYXJkZWQgYXMgSGlnaCAoSCkgd2hlbiBNQ0MsIHNlbnNpdGl2aXR5LCBzcGVjaWZpY2l0eSBhbmQgcHJlY2lzaW9uIGFyZSBqb2ludGx5IGFib3ZlIGEgZ2l2ZW4gdGhyZXNob2xkLiBvdGhlcndpc2UgUmVsaWFiaWxpdHkgaXMgaW5kaWNhdGVkIGFzIExvdyAoTCkuIDxiciAvPic7XG4gIHJhY3RpdmUuc2V0KCdmdW5jdGlvbl90YWJsZXMnLCB0YWJsZV9kYXRhKTtcblxufVxuXG5mdW5jdGlvbiBzZXRfYWFub3JtKCl7XG4gIGxldCBoQUFfbm9ybSA9IHt9O1xuICBoQUFfbm9ybS5BID0geyB2YWw6IDAuMDcxNzgzMjQ4MDA2MzA5LFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDI3MzY3NjYxNTI0Mjc1fTtcbiAgaEFBX25vcm0uViA9IHsgdmFsOiAwLjA1OTYyNDU5NTM2OTkwMSxcbiAgICAgICAgICAgICAgICAgc2RlOiAwLjAyMDM3Nzc5MTUyODc0NX07XG4gIGhBQV9ub3JtLlkgPSB7IHZhbDogMC4wMjYwNzUwNjgyNDA0MzcsXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMTQ4MjI0NzE1MzEzNzl9O1xuICBoQUFfbm9ybS5XID0geyB2YWw6IDAuMDE0MTY2MDAyNjEyNzcxLFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDEwNDcxODM1ODAxOTk2fTtcbiAgaEFBX25vcm0uVCA9IHsgdmFsOiAwLjA1MjU5MzU4Mjk3MjcxNCxcbiAgICAgICAgICAgICAgICAgc2RlOiAwLjAyMDA5NDc5Mzk2NDU5N307XG4gIGhBQV9ub3JtLlMgPSB7IHZhbDogMC4wODIxMjMyNDEzMzIwOTksXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMjg2ODc1NjYwODE1MTJ9O1xuICBoQUFfbm9ybS5QID0geyB2YWw6IDAuMDY1NTU3NTMxMzIyMjQxLFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDM0MjM5Mzk4NDk2NzM2fTtcbiAgaEFBX25vcm0uRiA9IHsgdmFsOiAwLjAzNzEwMzk5NDk2OTAwMixcbiAgICAgICAgICAgICAgICAgc2RlOiAwLjAxODU0MzQyMzEzOTE4Nn07XG4gIGhBQV9ub3JtLk0gPSB7IHZhbDogMC4wMjI1NjI4MTgxODM5NTUsXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMTEzMjEwMzk2NjI0ODF9O1xuICBoQUFfbm9ybS5LID0geyB2YWw6IDAuMDU0ODMzOTc5MjY5MTg1LFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDI5MjY0MDgzNjY3MTU3fTtcbiAgaEFBX25vcm0uTCA9IHsgdmFsOiAwLjEwMDEwNTkxNTc1OTA2LFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDMwMjc2ODA4NTE5MDA5fTtcbiAgaEFBX25vcm0uSSA9IHsgdmFsOiAwLjA0MjAzNDUyNjA0MDQ2NyxcbiAgICAgICAgICAgICAgICAgc2RlOiAwLjAyMDgyNjg0OTI2MjQ5NX07XG4gIGhBQV9ub3JtLkggPSB7IHZhbDogMC4wMjcxNDE0MDM1Mzc1OTgsXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMTU1MDU2NjM3ODk4NX07XG4gIGhBQV9ub3JtLkcgPSB7IHZhbDogMC4wNjkxNzk4MjAxMDQ1MzYsXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMzAwODc1NjIwNTczMjh9O1xuICBoQUFfbm9ybS5RID0geyB2YWw6IDAuMDY1OTIwNTYxOTMxODAxLFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDMwMTAzMDkxMDA4MzY2fTtcbiAgaEFBX25vcm0uRSA9IHsgdmFsOiAwLjA0NjQ3ODQ2MjI1ODM4LFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDE5OTQ2MjY5NDYxNzM2fTtcbiAgaEFBX25vcm0uQyA9IHsgdmFsOiAwLjAyNDkwODU1MTg3MjA1NixcbiAgICAgICAgICAgICAgICAgc2RlOiAwLjAyMDgyMjkwOTU4OTUwNH07XG4gIGhBQV9ub3JtLkQgPSB7IHZhbDogMC4wNDQzMzc5MDQ3MjYwNDEsXG4gICAgICAgICAgICAgICAgIHNkZTogMC4wMTg0MzY2NzcyNTY3MjZ9O1xuICBoQUFfbm9ybS5OID0geyB2YWw6IDAuMDMzNTA3MDIwOTg3MDMzLFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDE2NTM2MDIyMjg4MjA0fTtcbiAgaEFBX25vcm0uUiA9IHsgdmFsOiAwLjA1OTc0MDQ2OTAzMTE5LFxuICAgICAgICAgICAgICAgICBzZGU6IDAuMDI1MTY1OTk0NzczMzg0fTtcbiAgcmV0dXJuKGhBQV9ub3JtKTtcbn1cblxuZnVuY3Rpb24gc2V0X2Zub3JtKCl7XG4gIGxldCBoRl9ub3JtID0ge307XG4gIGhGX25vcm0uaHlkcm9waG9iaWNpdHkgPSB7dmFsOiAtMC4zNDg3NjgyODA4MDE1MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZGU6IDAuNzU1NTkxNTI3Njk3OTl9O1xuICBoRl9ub3JtWydwZXJjZW50IHBvc2l0aXZlIHJlc2lkdWVzJ10gPSB7dmFsOiAxMS40NTc3MTc0NjY5NDgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZGU6IDMuNTY3MTMzMzQxMTM5fTtcbiAgaEZfbm9ybVsnYWxpcGhhdGljIGluZGV4J10gPSB7dmFsOiA3OS45MTE1NDkzMTkwOTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNkZTogMTYuNzg3NjE3OTc4ODI3fTtcbiAgaEZfbm9ybVsnaXNvZWxlY3RyaWMgcG9pbnQnXSA9IHt2YWw6IDcuNjEwMjA0NjM4MzYwMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZGU6IDEuOTcxNjExMTAyMDA4OH07XG4gIGhGX25vcm1bJ21vbGVjdWxhciB3ZWlnaHQnXSA9IHt2YWw6IDQ4NjY4LjQxMjgzOTk2MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNkZTogMzc4MzguMzI0ODk1OTY5fTtcbiAgaEZfbm9ybS5jaGFyZ2UgPSB7dmFsOiA1LjA5OTE3NjMwNTc2MDQsXG4gICAgICAgICAgICAgICAgICAgIHNkZTogMTYuODM4NjM2NTkwMjV9O1xuICBoRl9ub3JtWydwZXJjZW50IG5lZ2F0aXZlIHJlc2lkdWVzJ10gPSB7dmFsOiAxMS4wMjYxOTAxMjgxNzYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZGU6IDQuMDIwNjYzMTY4MDkyNn07XG4gIGhGX25vcm1bJ21vbGFyIGV4dGluY3Rpb24gY29lZmZpY2llbnQnXSA9IHt2YWw6IDQ2NDc1LjI5MzkyMzkyNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNkZTogMzkyOTkuMzk5ODQ4ODIzfTtcbiAgcmV0dXJuKGhGX25vcm0pO1xufVxuXG5mdW5jdGlvbiBnZXRfYWFfY29sb3IodmFsKXtcbiAgICBsZXQgYWJfdmFsID0gTWF0aC5hYnModmFsKTtcbiAgICBpZihhYl92YWwgPj0gMi45NiApe1xuICAgICAgICBpZih2YWwgPiAwKXtyZXR1cm4gXCJzaWduaWYxcFwiO31cbiAgICAgICAgcmV0dXJuIFwic2lnbmlmMW5cIjtcbiAgICB9XG4gICAgZWxzZSBpZihhYl92YWwgPj0gMi4yNCl7XG4gICAgICAgIGlmKHZhbCA+IDApe3JldHVybiBcInNpZ25pZjJwXCI7fVxuICAgICAgICByZXR1cm4gXCJzaWduaWYyblwiO1xuICAgIH1cbiAgICBlbHNlIGlmKGFiX3ZhbCA+PSAxLjk2ICl7XG4gICAgICAgIGlmKHZhbCA+IDApe3JldHVybiBcInNpZ25pZjVwXCI7fVxuICAgICAgICByZXR1cm4gXCJzaWduaWY1blwiO1xuICAgIH1cbiAgICBlbHNlIGlmKGFiX3ZhbCA+PSAxLjY0NSApIHtcbiAgICAgICAgaWYodmFsID4gMCl7cmV0dXJuIFwic2lnbmlmMTBwXCI7fVxuICAgICAgICByZXR1cm4gXCJzaWduaWYxMG5cIjtcbiAgICB9XG4gICAgcmV0dXJuIFwicGxhaW5cIjtcbn1cblxuLy9wYXJzZSB0aGUgZmZwcmVkIGZlYXRjZm8gZmVhdHVyZXMgZmlsZVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX2ZlYXRjZmcocmFjdGl2ZSwgZmlsZSlcbntcbiAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gIGxldCBTRl9kYXRhID0ge307XG4gIGxldCBBQV9kYXRhID0ge307XG4gIGxldCBoRl9ub3JtID1zZXRfZm5vcm0oKTtcbiAgbGV0IGhBQV9ub3JtPXNldF9hYW5vcm0oKTtcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICBpZihsaW5lLnN0YXJ0c1dpdGgoXCJBQVwiKSl7XG4gICAgICBsZXQgY29sdW1ucyA9IGxpbmUuc3BsaXQoJ1xcdCcpO1xuICAgICAgQUFfZGF0YVtjb2x1bW5zWzFdXSA9IGNvbHVtbnNbMl07XG4gICAgfVxuICAgIGlmKGxpbmUuc3RhcnRzV2l0aChcIlNGXCIpKVxuICAgIHtcbiAgICAgIGxldCBjb2x1bW5zID0gbGluZS5zcGxpdCgnXFx0Jyk7XG4gICAgICBTRl9kYXRhW2NvbHVtbnNbMV1dID0gY29sdW1uc1syXTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGJ1aWxkIGh0bWwgdGFibGVzIGZvciB0aGUgZmVhdHVyZSBkYXRhXG4gIGxldCBjbGFzc19jb2xvdXIgPSAnJztcbiAgbGV0IGdsb2JhbF9mZWF0dXJlcyA9IHJhY3RpdmUuZ2V0KCdnbG9iYWxfZmVhdHVyZXMnKTtcbiAgbGV0IGZlYXRfdGFibGUgPSAnPGI+R2xvYmFsIEZlYXR1cmVzPC9iPjxiciAvPic7XG4gIGZlYXRfdGFibGUgKz0gJ0dsb2JhbCBmZWF0dXJlcyBhcmUgY2FsY3VsYXRlZCBkaXJlY3RseSBmcm9tIHNlcXVlbmNlLiBMb2NhbGlzYXRpb24gdmFsdWVzIGFyZSBwcmVkaWN0ZWQgYnkgdGhlIFBzb3J0IGFsZ29yaXRobSBhbmQgcmVmbGVjdCB0aGUgcmVsYXRpdmUgbGlrZWxpaG9vZCBvZiB0aGUgcHJvdGVpbiBvY2N1cHlpbmcgZGlmZmVyZW50IGNlbGx1bGFyIGxvY2FsaXNhdGlvbnMuIFRoZSBiaWFzIGNvbHVtbiBpcyBoaWdobGlnaHRlZCBhY2NvcmRpbmcgdG8gdGhlIHNpZ25pZmljYW5jZSBvZiB0aGUgZmVhdHVyZSB2YWx1ZSBjYWxjdWxhdGVkIGZyb20gWiBzY29yZSBvZiB0aGUgZmVhdHVyZS48YnIgLz4nO1xuICBmZWF0X3RhYmxlICs9ICc8dGFibGU+PHRyPjx0aD5GZWF0dXJlIE5hbWU8L3RoPjx0aD5WYWx1ZTwvdGg+PHRoPkJpYXM8L3RoPjwvdHI+JztcblxuICBPYmplY3Qua2V5cyhTRl9kYXRhKS5zb3J0KCkuZm9yRWFjaChmdW5jdGlvbihmZWF0dXJlX25hbWUpe1xuICAgIGxldCBjbGFzc19jb2xvdXIgPSAnJztcbiAgICBpZihmZWF0dXJlX25hbWUgaW4gaEZfbm9ybSl7XG4gICAgICBjbGFzc19jb2xvdXIgPSBnZXRfYWFfY29sb3IoIChwYXJzZUZsb2F0KFNGX2RhdGFbZmVhdHVyZV9uYW1lXSktaEZfbm9ybVtmZWF0dXJlX25hbWVdLnZhbCkgLyBoRl9ub3JtW2ZlYXR1cmVfbmFtZV0uc2RlKTtcbiAgICB9XG4gICAgZmVhdF90YWJsZSArPSAnPHRyPjx0ZD4nK2ZlYXR1cmVfbmFtZSsnPC90ZD48dGQ+JytwYXJzZUZsb2F0KFNGX2RhdGFbZmVhdHVyZV9uYW1lXSkudG9GaXhlZCgyKSsnPC90ZD48dGQgY2xhc3M9XCInK2NsYXNzX2NvbG91cisnXCI+Jm5ic3A7Jm5ic3A7Jm5ic3A7PC90ZD48L3RyPic7XG4gIH0pO1xuICBmZWF0X3RhYmxlICs9ICc8L3RhYmxlPic7XG4gIHJhY3RpdmUuc2V0KCdnbG9iYWxfZmVhdHVyZXMnLCBmZWF0X3RhYmxlKTtcblxuICAvL2J1aWxkIGh0bWwgdGFibGUgZm9yIHRoZSBBQSBkYXRhXG4gIGxldCBhYV9jb21wb3NpdGlvbiA9IHJhY3RpdmUuZ2V0KCdhYV9jb21wb3NpdGlvbicpO1xuICBsZXQgYWFfdGFibGUgPSAnPGI+QW1pbm8gQWNpZCBDb21wb3NpdGlvbiAocGVyY2VudGFnZXMpPC9iPjxiciAvPic7XG4gIGFhX3RhYmxlICs9ICc8dGFibGU+PHRyPic7XG4gIE9iamVjdC5rZXlzKEFBX2RhdGEpLnNvcnQoKS5mb3JFYWNoKGZ1bmN0aW9uKHJlc2lkdWUpe1xuICAgIGFhX3RhYmxlICs9ICc8dGg+JytyZXNpZHVlKyc8L3RoPic7XG4gIH0pO1xuICBhYV90YWJsZSArPSAnPC90cj48dHI+JztcbiAgT2JqZWN0LmtleXMoQUFfZGF0YSkuc29ydCgpLmZvckVhY2goZnVuY3Rpb24ocmVzaWR1ZSl7XG4gICAgbGV0IGNsYXNzX2NvbG91ciA9ICcnO1xuICAgIGNsYXNzX2NvbG91ciA9IGdldF9hYV9jb2xvcigocGFyc2VGbG9hdChBQV9kYXRhW3Jlc2lkdWVdKS1oQUFfbm9ybVtyZXNpZHVlXS52YWwpIC8gaEFBX25vcm1bcmVzaWR1ZV0uc2RlKTtcbiAgICBhYV90YWJsZSArPSAnPHRkIGNsYXNzPVwiJytjbGFzc19jb2xvdXIrJ1wiPicrKHBhcnNlRmxvYXQoQUFfZGF0YVtyZXNpZHVlXSkqMTAwKS50b0ZpeGVkKDIpKyc8L3RkPic7XG4gIH0pO1xuICBhYV90YWJsZSArPSAnPC90cj48L3RhYmxlPjxiciAvPic7XG4gIGFhX3RhYmxlICs9ICc8Yj5TaWduaWZpY2FuY2UgS2V5PC9iPjxiciAvPic7XG4gIGFhX3RhYmxlICs9ICc8dGFibGUgY2xhc3M9XCJzaWduaWZrZXlcIiBhbGlnbj1cImNlbnRlclwiIGNlbGxwYWRkaW5nPVwiMlwiIGNlbGxzcGFjaW5nPVwiMFwiPic7XG4gIGFhX3RhYmxlICs9ICc8dHI+JztcbiAgYWFfdGFibGUgKz0gJzx0ZD48Yj5sb3c8L2I+PC90ZD4nO1xuICBhYV90YWJsZSArPSAnPHRkIGNvbHNwYW49XCI5XCI+Jm5ic3A7PC90ZD4nO1xuICBhYV90YWJsZSArPSAnPHRkIGFsaWduPVwicmlnaHRcIj48Yj5oaWdoPC9iPjwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzwvdHI+JztcbiAgYWFfdGFibGUgKz0gJzx0cj4nO1xuICBhYV90YWJsZSArPSAnPHRkPjwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzx0ZCBjbGFzcz1cInNpZ25pZjFuXCI+cCAmbHQ7IDAuMDE8L3RkPic7XG4gIGFhX3RhYmxlICs9ICc8dGQgY2xhc3M9XCJzaWduaWYyblwiPnAgJmx0OyAwLjAyPC90ZD4nO1xuICBhYV90YWJsZSArPSAnPHRkIGNsYXNzPVwic2lnbmlmNW5cIj5wICZsdDsgMC4wNTwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzx0ZCBjbGFzcz1cInNpZ25pZjEwblwiPnAgJmx0OyAwLjE8L3RkPic7XG4gIGFhX3RhYmxlICs9ICc8dGQ+cCAmZ3Q7PSAwLjE8L3RkPic7XG4gIGFhX3RhYmxlICs9ICc8dGQgY2xhc3M9XCJzaWduaWYxMHBcIj5wICZsdDsgMC4xPC90ZD4nO1xuICBhYV90YWJsZSArPSAnPHRkIGNsYXNzPVwic2lnbmlmNXBcIj5wICZsdDsgMC4wNTwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzx0ZCBjbGFzcz1cInNpZ25pZjJwXCI+cCAmbHQ7IDAuMDI8L3RkPic7XG4gIGFhX3RhYmxlICs9ICc8dGQgY2xhc3M9XCJzaWduaWYxcFwiPnAgJmx0OyAwLjAxPC90ZD4nO1xuICBhYV90YWJsZSArPSAnPHRkPjwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzwvdHI+JztcbiAgYWFfdGFibGUgKz0gJzx0cj4nO1xuICBhYV90YWJsZSArPSAnPHRkIGNvbHNwYW49XCIxMVwiPlNpZ25pZmljYW5jZSBwIHZhbHVlIGlzIGNhbGN1bGF0ZWQgdXNpbmcgdGhlIFogc2NvcmUgb2YgdGhlIHBlcmNlbnQgYW1pbm8gYWNpZCBjb21wb3NpdGlvbjwvdGQ+JztcbiAgYWFfdGFibGUgKz0gJzwvdHI+JztcbiAgYWFfdGFibGUgKz0gJzwvdGFibGU+JztcbiAgcmFjdGl2ZS5zZXQoJ2FhX2NvbXBvc2l0aW9uJywgYWFfdGFibGUpO1xufVxuXG5cbi8vIGZvciBhIGdpdmVuIG1lbXNhdCBkYXRhIGZpbGVzIGV4dHJhY3QgY29vcmRpbmF0ZSByYW5nZXMgZ2l2ZW4gc29tZSByZWdleFxuZXhwb3J0IGZ1bmN0aW9uIGdldF9tZW1zYXRfcmFuZ2VzKHJlZ2V4LCBkYXRhKVxue1xuICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoZGF0YSk7XG4gICAgaWYobWF0Y2hbMV0uaW5jbHVkZXMoJywnKSlcbiAgICB7XG4gICAgICBsZXQgcmVnaW9ucyA9IG1hdGNoWzFdLnNwbGl0KCcsJyk7XG4gICAgICByZWdpb25zLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uLCBpKXtcbiAgICAgICAgcmVnaW9uc1tpXSA9IHJlZ2lvbi5zcGxpdCgnLScpO1xuICAgICAgICByZWdpb25zW2ldWzBdID0gcGFyc2VJbnQocmVnaW9uc1tpXVswXSk7XG4gICAgICAgIHJlZ2lvbnNbaV1bMV0gPSBwYXJzZUludChyZWdpb25zW2ldWzFdKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuKHJlZ2lvbnMpO1xuICAgIH1cbiAgICBlbHNlIGlmKG1hdGNoWzFdLmluY2x1ZGVzKCctJykpXG4gICAge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaFsxXSk7XG4gICAgICAgIGxldCBzZWcgPSBtYXRjaFsxXS5zcGxpdCgnLScpO1xuICAgICAgICBsZXQgcmVnaW9ucyA9IFtbXSwgXTtcbiAgICAgICAgcmVnaW9uc1swXVswXSA9IHBhcnNlSW50KHNlZ1swXSk7XG4gICAgICAgIHJlZ2lvbnNbMF1bMV0gPSBwYXJzZUludChzZWdbMV0pO1xuICAgICAgICByZXR1cm4ocmVnaW9ucyk7XG4gICAgfVxuICAgIHJldHVybihtYXRjaFsxXSk7XG59XG5cbi8vIHRha2UgYW5kIHNzMiAoZmlsZSkgYW5kIHBhcnNlIHRoZSBkZXRhaWxzIGFuZCB3cml0ZSB0aGUgbmV3IGFubm90YXRpb24gZ3JpZFxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX3NzMihyYWN0aXZlLCBmaWxlKVxue1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAgIGxpbmVzLnNoaWZ0KCk7XG4gICAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYoYW5ub3RhdGlvbnMubGVuZ3RoID09IGxpbmVzLmxlbmd0aClcbiAgICB7XG4gICAgICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgICAgICBsZXQgZW50cmllcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgYW5ub3RhdGlvbnNbaV0uc3MgPSBlbnRyaWVzWzNdO1xuICAgICAgfSk7XG4gICAgICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgYWxlcnQoXCJTUzIgYW5ub3RhdGlvbiBsZW5ndGggZG9lcyBub3QgbWF0Y2ggcXVlcnkgc2VxdWVuY2VcIik7XG4gICAgfVxuICAgIHJldHVybihhbm5vdGF0aW9ucyk7XG59XG5cbi8vdGFrZSB0aGUgZGlzb3ByZWQgcGJkYXQgZmlsZSwgcGFyc2UgaXQgYW5kIGFkZCB0aGUgYW5ub3RhdGlvbnMgdG8gdGhlIGFubm90YXRpb24gZ3JpZFxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX3BiZGF0KHJhY3RpdmUsIGZpbGUpXG57XG4gICAgbGV0IGFubm90YXRpb25zID0gcmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyk7XG4gICAgbGV0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTtcbiAgICBsaW5lcyA9IGxpbmVzLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZihhbm5vdGF0aW9ucy5sZW5ndGggPT0gbGluZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICAgIGxldCBlbnRyaWVzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBpZihlbnRyaWVzWzNdID09PSAnLScpe2Fubm90YXRpb25zW2ldLmRpc29wcmVkID0gJ0QnO31cbiAgICAgICAgaWYoZW50cmllc1szXSA9PT0gJ14nKXthbm5vdGF0aW9uc1tpXS5kaXNvcHJlZCA9ICdQQic7fVxuICAgICAgfSk7XG4gICAgICByYWN0aXZlLnNldCgnYW5ub3RhdGlvbnMnLCBhbm5vdGF0aW9ucyk7XG4gICAgICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuICAgIH1cbn1cblxuLy9wYXJzZSB0aGUgZGlzb3ByZWQgY29tYiBmaWxlIGFuZCBhZGQgaXQgdG8gdGhlIGFubm90YXRpb24gZ3JpZFxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlX2NvbWIocmFjdGl2ZSwgZmlsZSlcbntcbiAgbGV0IHByZWNpc2lvbiA9IFtdO1xuICBsZXQgbGluZXMgPSBmaWxlLnNwbGl0KCdcXG4nKTtcbiAgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTsgbGluZXMuc2hpZnQoKTtcbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIoQm9vbGVhbik7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgaSl7XG4gICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgcHJlY2lzaW9uW2ldID0ge307XG4gICAgcHJlY2lzaW9uW2ldLnBvcyA9IGVudHJpZXNbMV07XG4gICAgcHJlY2lzaW9uW2ldLnByZWNpc2lvbiA9IGVudHJpZXNbNF07XG4gIH0pO1xuICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nLCBwcmVjaXNpb24pO1xuICBiaW9kMy5nZW5lcmljeHlMaW5lQ2hhcnQocHJlY2lzaW9uLCAncG9zJywgWydwcmVjaXNpb24nXSwgWydCbGFjaycsXSwgJ0Rpc29OTkNoYXJ0Jywge3BhcmVudDogJ2Rpdi5jb21iX3Bsb3QnLCBjaGFydFR5cGU6ICdsaW5lJywgeV9jdXRvZmY6IDAuNSwgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuXG59XG5cbi8vcGFyc2UgdGhlIG1lbXNhdCBvdXRwdXRcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9tZW1zYXRkYXRhKHJhY3RpdmUsIGZpbGUpXG57XG4gIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIC8vY29uc29sZS5sb2coZmlsZSk7XG4gIGxldCB0b3BvX3JlZ2lvbnMgPSBnZXRfbWVtc2F0X3JhbmdlcygvVG9wb2xvZ3k6XFxzKyguKz8pXFxuLywgZmlsZSk7XG4gIGxldCBzaWduYWxfcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9TaWduYWxcXHNwZXB0aWRlOlxccysoLispXFxuLywgZmlsZSk7XG4gIGxldCByZWVudHJhbnRfcmVnaW9ucyA9IGdldF9tZW1zYXRfcmFuZ2VzKC9SZS1lbnRyYW50XFxzaGVsaWNlczpcXHMrKC4rPylcXG4vLCBmaWxlKTtcbiAgbGV0IHRlcm1pbmFsID0gZ2V0X21lbXNhdF9yYW5nZXMoL04tdGVybWluYWw6XFxzKyguKz8pXFxuLywgZmlsZSk7XG4gIC8vY29uc29sZS5sb2coc2lnbmFsX3JlZ2lvbnMpO1xuICAvLyBjb25zb2xlLmxvZyhyZWVudHJhbnRfcmVnaW9ucyk7XG4gIGxldCBjb2lsX3R5cGUgPSAnQ1knO1xuICBpZih0ZXJtaW5hbCA9PT0gJ291dCcpXG4gIHtcbiAgICBjb2lsX3R5cGUgPSAnRUMnO1xuICB9XG4gIGxldCB0bXBfYW5ubyA9IG5ldyBBcnJheShzZXEubGVuZ3RoKTtcbiAgaWYodG9wb19yZWdpb25zICE9PSAnTm90IGRldGVjdGVkLicpXG4gIHtcbiAgICBsZXQgcHJldl9lbmQgPSAwO1xuICAgIHRvcG9fcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1RNJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgICBpZihwcmV2X2VuZCA+IDApe3ByZXZfZW5kIC09IDE7fVxuICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKGNvaWxfdHlwZSwgcHJldl9lbmQsIHJlZ2lvblswXSk7XG4gICAgICBpZihjb2lsX3R5cGUgPT09ICdFQycpeyBjb2lsX3R5cGUgPSAnQ1knO31lbHNle2NvaWxfdHlwZSA9ICdFQyc7fVxuICAgICAgcHJldl9lbmQgPSByZWdpb25bMV0rMjtcbiAgICB9KTtcbiAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoY29pbF90eXBlLCBwcmV2X2VuZC0xLCBzZXEubGVuZ3RoKTtcblxuICB9XG4gIC8vc2lnbmFsX3JlZ2lvbnMgPSBbWzcwLDgzXSwgWzEwMiwxMTddXTtcbiAgaWYoc2lnbmFsX3JlZ2lvbnMgIT09ICdOb3QgZGV0ZWN0ZWQuJyl7XG4gICAgc2lnbmFsX3JlZ2lvbnMuZm9yRWFjaChmdW5jdGlvbihyZWdpb24pe1xuICAgICAgdG1wX2Fubm8gPSB0bXBfYW5uby5maWxsKCdTJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgfSk7XG4gIH1cbiAgLy9yZWVudHJhbnRfcmVnaW9ucyA9IFtbNDAsNTBdLCBbMjAwLDIxOF1dO1xuICBpZihyZWVudHJhbnRfcmVnaW9ucyAhPT0gJ05vdCBkZXRlY3RlZC4nKXtcbiAgICByZWVudHJhbnRfcmVnaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbil7XG4gICAgICB0bXBfYW5ubyA9IHRtcF9hbm5vLmZpbGwoJ1JIJywgcmVnaW9uWzBdLCByZWdpb25bMV0rMSk7XG4gICAgfSk7XG4gIH1cbiAgdG1wX2Fubm8uZm9yRWFjaChmdW5jdGlvbihhbm5vLCBpKXtcbiAgICBhbm5vdGF0aW9uc1tpXS5tZW1zYXQgPSBhbm5vO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ2Fubm90YXRpb25zJywgYW5ub3RhdGlvbnMpO1xuICBiaW9kMy5hbm5vdGF0aW9uR3JpZChhbm5vdGF0aW9ucywge3BhcmVudDogJ2Rpdi5zZXF1ZW5jZV9wbG90JywgbWFyZ2luX3NjYWxlcjogMiwgZGVidWc6IGZhbHNlLCBjb250YWluZXJfd2lkdGg6IDkwMCwgd2lkdGg6IDkwMCwgaGVpZ2h0OiAzMDAsIGNvbnRhaW5lcl9oZWlnaHQ6IDMwMH0pO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9wcmVzdWx0KHJhY3RpdmUsIGZpbGUsIHR5cGUpXG57XG4gIGxldCBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcbicpO1xuICAvL2NvbnNvbGUubG9nKHR5cGUrJ19hbm5fc2V0Jyk7XG4gIGxldCBhbm5fbGlzdCA9IHJhY3RpdmUuZ2V0KHR5cGUrJ19hbm5fc2V0Jyk7XG4gIC8vY29uc29sZS5sb2coYW5uX2xpc3QpO1xuICBpZihPYmplY3Qua2V5cyhhbm5fbGlzdCkubGVuZ3RoID4gMCl7XG4gIGxldCBwc2V1ZG9fdGFibGUgPSAnPHRhYmxlIGNsYXNzPVwic21hbGwtdGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZFwiPlxcbic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRyPjx0aD5Db25mLjwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+TmV0IFNjb3JlPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5wLXZhbHVlPC90aD4nO1xuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5QYWlyRTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+U29sdkU8L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPkFsbiBTY29yZTwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+QWxuIExlbmd0aDwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+VGFyZ2V0IExlbjwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+UXVlcnkgTGVuPC90aD4nO1xuICBpZih0eXBlID09PSAnZGdlbicpe1xuICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlJlZ2lvbiBTdGFydDwvdGg+JztcbiAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5SZWdpb24gRW5kPC90aD4nO1xuICAgIHBzZXVkb190YWJsZSArPSAnPHRoPkNBVEggRG9tYWluPC90aD4nO1xuICAgIHBzZXVkb190YWJsZSArPSAnPHRoPlNFQVJDSCBTQ09QPC90aD4nO1xuICB9ZWxzZSB7XG4gICAgcHNldWRvX3RhYmxlICs9ICc8dGg+Rm9sZDwvdGg+JztcbiAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggU0NPUDwvdGg+JztcbiAgICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5TRUFSQ0ggQ0FUSDwvdGg+JztcbiAgfVxuICBwc2V1ZG9fdGFibGUgKz0gJzx0aD5QREJTVU08L3RoPic7XG4gIHBzZXVkb190YWJsZSArPSAnPHRoPkFsaWdubWVudDwvdGg+JztcbiAgcHNldWRvX3RhYmxlICs9ICc8dGg+TU9ERUw8L3RoPic7XG5cbiAgLy8gaWYgTU9ERUxMRVIgVEhJTkdZXG4gIHBzZXVkb190YWJsZSArPSAnPC90cj48dGJvZHlcIj5cXG4nO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIC8vY29uc29sZS5sb2cobGluZSk7XG4gICAgaWYobGluZS5sZW5ndGggPT09IDApe3JldHVybjt9XG4gICAgbGV0IGVudHJpZXMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XG4gICAgbGV0IHRhYmxlX2hpdCA9IGVudHJpZXNbOV07XG4gICAgaWYodHlwZSA9PT0gJ2RnZW4nKXsgdGFibGVfaGl0ID0gZW50cmllc1sxMV07fVxuICAgIGlmKHRhYmxlX2hpdCtcIl9cIitpIGluIGFubl9saXN0KVxuICAgIHtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dHI+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkIGNsYXNzPSdcIitlbnRyaWVzWzBdLnRvTG93ZXJDYXNlKCkrXCInPlwiK2VudHJpZXNbMF0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzFdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1syXStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbM10rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzRdK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s1XStcIjwvdGQ+XCI7XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPlwiK2VudHJpZXNbNl0rXCI8L3RkPlwiO1xuICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD5cIitlbnRyaWVzWzddK1wiPC90ZD5cIjtcbiAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s4XStcIjwvdGQ+XCI7XG4gICAgbGV0IHBkYiA9IGVudHJpZXNbOV0uc3Vic3RyaW5nKDAsIGVudHJpZXNbOV0ubGVuZ3RoLTIpO1xuICAgIGlmKHR5cGUgPT09ICdkZ2VuJyl7IHBkYiA9IGVudHJpZXNbMTFdLnN1YnN0cmluZygwLCBlbnRyaWVzWzExXS5sZW5ndGgtMyk7fVxuICAgIGlmKHR5cGUgPT09ICdkZ2VuJyl7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1s5XStcIjwvdGQ+XCI7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+XCIrZW50cmllc1sxMF0rXCI8L3RkPlwiO1xuICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmNhdGhkYi5pbmZvL3ZlcnNpb24vbGF0ZXN0L2RvbWFpbi9cIit0YWJsZV9oaXQrXCInPlwiK3RhYmxlX2hpdCtcIjwvYT48L3RkPlwiO1xuICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vc2NvcC5tcmMtbG1iLmNhbS5hYy51ay9zY29wL3BkYi5jZ2k/cGRiPVwiK3BkYitcIic+U0NPUCBTRUFSQ0g8L2E+PC90ZD5cIjtcbiAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5lYmkuYWMudWsvdGhvcm50b24tc3J2L2RhdGFiYXNlcy9jZ2ktYmluL3BkYnN1bS9HZXRQYWdlLnBsP3BkYmNvZGU9XCIrcGRiK1wiJz5PcGVuIFBEQlNVTTwvYT48L3RkPlwiO1xuICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J3BzaXByZWQubG9hZE5ld0FsaWdubWVudChcXFwiXCIrKGFubl9saXN0W3RhYmxlX2hpdCtcIl9cIitpXS5hbG4pK1wiXFxcIixcXFwiXCIrKGFubl9saXN0W3RhYmxlX2hpdCtcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKHRhYmxlX2hpdCtcIl9cIitpKStcIlxcXCIpOycgdmFsdWU9J0Rpc3BsYXkgQWxpZ25tZW50JyAvPjwvdGQ+XCI7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGlucHV0IGNsYXNzPSdidXR0b24nIHR5cGU9J2J1dHRvbicgb25DbGljaz0ncHNpcHJlZC5idWlsZE1vZGVsKFxcXCJcIisoYW5uX2xpc3RbdGFibGVfaGl0K1wiX1wiK2ldLmFsbikrXCJcXFwiLCBcXFwiY2F0aF9tb2RlbGxlclxcXCIpOycgdmFsdWU9J0J1aWxkIE1vZGVsJyAvPjwvdGQ+XCI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHBzOi8vd3d3LnJjc2Iub3JnL3BkYi9leHBsb3JlL2V4cGxvcmUuZG8/c3RydWN0dXJlSWQ9XCIrcGRiK1wiJz5cIit0YWJsZV9oaXQrXCI8L2E+PC90ZD5cIjtcbiAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3Njb3AubXJjLWxtYi5jYW0uYWMudWsvc2NvcC9wZGIuY2dpP3BkYj1cIitwZGIrXCInPlNDT1AgU0VBUkNIPC9hPjwvdGQ+XCI7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly93d3cuY2F0aGRiLmluZm8vcGRiL1wiK3BkYitcIic+Q0FUSCBTRUFSQ0g8L2E+PC90ZD5cIjtcbiAgICAgIHBzZXVkb190YWJsZSArPSBcIjx0ZD48YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cDovL3d3dy5lYmkuYWMudWsvdGhvcm50b24tc3J2L2RhdGFiYXNlcy9jZ2ktYmluL3BkYnN1bS9HZXRQYWdlLnBsP3BkYmNvZGU9XCIrcGRiK1wiJz5PcGVuIFBEQlNVTTwvYT48L3RkPlwiO1xuICAgICAgcHNldWRvX3RhYmxlICs9IFwiPHRkPjxpbnB1dCBjbGFzcz0nYnV0dG9uJyB0eXBlPSdidXR0b24nIG9uQ2xpY2s9J3BzaXByZWQubG9hZE5ld0FsaWdubWVudChcXFwiXCIrKGFubl9saXN0W3RhYmxlX2hpdCtcIl9cIitpXS5hbG4pK1wiXFxcIixcXFwiXCIrKGFubl9saXN0W3RhYmxlX2hpdCtcIl9cIitpXS5hbm4pK1wiXFxcIixcXFwiXCIrKHRhYmxlX2hpdCtcIl9cIitpKStcIlxcXCIpOycgdmFsdWU9J0Rpc3BsYXkgQWxpZ25tZW50JyAvPjwvdGQ+XCI7XG4gICAgICBwc2V1ZG9fdGFibGUgKz0gXCI8dGQ+PGlucHV0IGNsYXNzPSdidXR0b24nIHR5cGU9J2J1dHRvbicgb25DbGljaz0ncHNpcHJlZC5idWlsZE1vZGVsKFxcXCJcIisoYW5uX2xpc3RbdGFibGVfaGl0K1wiX1wiK2ldLmFsbikrXCJcXFwiLCBcXFwicGRiX21vZGVsbGVyXFxcIik7JyB2YWx1ZT0nQnVpbGQgTW9kZWwnIC8+PC90ZD5cIjtcbiAgICB9XG4gICAgcHNldWRvX3RhYmxlICs9IFwiPC90cj5cXG5cIjtcbiAgICB9XG4gIH0pO1xuICBwc2V1ZG9fdGFibGUgKz0gXCI8L3Rib2R5PjwvdGFibGU+XFxuXCI7XG4gIHJhY3RpdmUuc2V0KHR5cGUrXCJfdGFibGVcIiwgcHNldWRvX3RhYmxlKTtcbiAgfVxuICBlbHNlIHtcbiAgICAgIHJhY3RpdmUuc2V0KHR5cGUrXCJfdGFibGVcIiwgXCI8aDM+Tm8gZ29vZCBoaXRzIGZvdW5kLiBHVUVTUyBhbmQgTE9XIGNvbmZpZGVuY2UgaGl0cyBjYW4gYmUgZm91bmQgaW4gdGhlIHJlc3VsdHMgZmlsZTwvaDM+XCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZV9wYXJzZWRzKHJhY3RpdmUsIGZpbGUpXG57XG4gIGxldCBwcmVkaWN0aW9uX3JlZ2V4ID0gL0RvbWFpblxcc0JvdW5kYXJ5XFxzbG9jYXRpb25zXFxzcHJlZGljdGVkXFxzRFBTOlxccyguKykvO1xuICBsZXQgcHJlZGljdGlvbl9tYXRjaCA9ICBwcmVkaWN0aW9uX3JlZ2V4LmV4ZWMoZmlsZSk7XG4gIGlmKHByZWRpY3Rpb25fbWF0Y2gpXG4gIHtcbiAgICBsZXQgZGV0YWlscyA9IGZpbGUucmVwbGFjZShcIlxcblwiLFwiPGJyIC8+XCIpO1xuICAgIGRldGFpbHMgPSBkZXRhaWxzLnJlcGxhY2UoXCJcXG5cIixcIjxiciAvPlwiKTtcbiAgICByYWN0aXZlLnNldChcInBhcnNlZHNfaW5mb1wiLCBcIjxoND5cIitkZXRhaWxzK1wiPC9oND5cIik7XG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgIGlmKHByZWRpY3Rpb25fbWF0Y2hbMV0uaW5kZXhPZihcIixcIikpXG4gICAge1xuICAgICAgdmFsdWVzID0gcHJlZGljdGlvbl9tYXRjaFsxXS5zcGxpdCgnLCcpO1xuICAgICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGkpe1xuICAgICAgICB2YWx1ZXNbaV0gPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHZhbHVlc1swXSA9IHBhcnNlSW50KHByZWRpY3Rpb25fbWF0Y2hbMV0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpO1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHJhY3RpdmUuZ2V0KCdhbm5vdGF0aW9ucycpO1xuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGFubm90YXRpb25zW3ZhbHVlXS5kb21wcmVkID0gJ0InO1xuICAgIH0pO1xuICAgIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICByYWN0aXZlLnNldChcInBhcnNlZHNfaW5mb1wiLCBcIk5vIFBhcnNlRFMgRG9tYWluIGJvdW5kYXJpZXMgcHJlZGljdGVkXCIpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzIiwiaW1wb3J0IHsgcHJvY2Vzc19maWxlIH0gZnJvbSAnLi4vcmVxdWVzdHMvcmVxdWVzdHNfaW5kZXguanMnO1xuaW1wb3J0IHsgZ2V0X3RleHQgfSBmcm9tICcuLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93X3BhbmVsKHZhbHVlLCByYWN0aXZlKVxue1xuICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIG51bGwgKTtcbiAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCB2YWx1ZSApO1xufVxuXG4vL2JlZm9yZSBhIHJlc3VibWlzc2lvbiBpcyBzZW50IGFsbCB2YXJpYWJsZXMgYXJlIHJlc2V0IHRvIHRoZSBwYWdlIGRlZmF1bHRzXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJfc2V0dGluZ3MocmFjdGl2ZSwgZ2Vhcl9zdHJpbmcsIGpvYl9saXN0LCBqb2JfbmFtZXMpe1xuICByYWN0aXZlLnNldCgncmVzdWx0c192aXNpYmxlJywgMik7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxKTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgZmFsc2UpO1xuICByYWN0aXZlLnNldCgnZG93bmxvYWRfbGlua3MnLCAnJyk7XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgIHJhY3RpdmUuc2V0KGpvYl9uYW1lKydfd2FpdGluZ19tZXNzYWdlJywgJzxoMj5QbGVhc2Ugd2FpdCBmb3IgeW91ciAnK2pvYl9uYW1lc1tqb2JfbmFtZV0rJyBqb2IgdG8gcHJvY2VzczwvaDI+Jyk7XG4gICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ193YWl0aW5nX2ljb24nLCBnZWFyX3N0cmluZyk7XG4gICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgJ0xvYWRpbmcgRGF0YScpO1xuICB9KTtcbiAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLG51bGwpO1xuICByYWN0aXZlLnNldCgnZGlzb19wcmVjaXNpb24nKTtcbiAgcmFjdGl2ZS5zZXQoJ21lbXNhdHN2bV9zY2hlbWF0aWMnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ3BnZW5fdGFibGUnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdwZ2VuX3NldCcsIHt9KTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbl90YWJsZScsICcnKTtcbiAgcmFjdGl2ZS5zZXQoJ2dlbl9zZXQnLCB7fSk7XG4gIHJhY3RpdmUuc2V0KCdwYXJzZWRzX2luZm8nLCBudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ3BhcnNlZHNfcG5nJywgbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdkZ2VuX3RhYmxlJywgbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdkZ2VuX2Fubl9zZXQnLCB7fSk7XG4gIHJhY3RpdmUuc2V0KCdiaW9zZXJmX21vZGVsJywgbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdkb21zZXJmX2J1dHRvbnMnLCAnJyk7XG4gIHJhY3RpdmUuc2V0KCdkb21zZXJmX21vZGVsX3VyaXM6JywgW10pO1xuICByYWN0aXZlLnNldCgnc2NoX3NjaGVtYXRpYzonLCBudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ2FhX2NvbXBvc2l0aW9uJywgbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdnbG9iYWxfZmVhdHVyZXMnLCBudWxsKTtcbiAgcmFjdGl2ZS5zZXQoJ2Z1bmN0aW9uX3RhYmxlcycsIG51bGwpO1xuXG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsbnVsbCk7XG4gIHJhY3RpdmUuc2V0KCdiYXRjaF91dWlkJyxudWxsKTtcbiAgYmlvZDMuY2xlYXJTZWxlY3Rpb24oJ2Rpdi5zZXF1ZW5jZV9wbG90Jyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYucHNpcHJlZF9jYXJ0b29uJyk7XG4gIGJpb2QzLmNsZWFyU2VsZWN0aW9uKCdkaXYuY29tYl9wbG90Jyk7XG5cbiAgemlwID0gbmV3IEpTWmlwKCk7XG59XG5cbi8vVGFrZSBhIGNvdXBsZSBvZiB2YXJpYWJsZXMgYW5kIHByZXBhcmUgdGhlIGh0bWwgc3RyaW5ncyBmb3IgdGhlIGRvd25sb2FkcyBwYW5lbFxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVfZG93bmxvYWRzX2h0bWwoZGF0YSwgZG93bmxvYWRzX2luZm8sIGpvYl9saXN0LCBqb2JfbmFtZXMpXG57XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgIGlmKGRhdGEuam9iX25hbWUgPT09IGpvYl9uYW1lKVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19pbmZvW2pvYl9uYW1lXSA9IHt9O1xuICAgICAgZG93bmxvYWRzX2luZm9bam9iX25hbWVdLmhlYWRlciA9IFwiPGg1PlwiK2pvYl9uYW1lc1tqb2JfbmFtZV0rXCIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgIC8vRVhUUkEgUEFORUxTIEZPUiBTT01FIEpPQlMgVFlQRVM6XG4gICAgICBpZihqb2JfbmFtZSA9PT0gJ3BnZW50aHJlYWRlcicgfHwgam9iX25hbWUgPT09ICdkb21wcmVkJyAgfHxcbiAgICAgICAgIGpvYl9uYW1lID09PSAncGRvbXRocmVhZGVyJyB8fCBqb2JfbmFtZSA9PT0gJ21ldGFwc2ljb3YnIHx8XG4gICAgICAgICBqb2JfbmFtZSA9PT0gJ2ZmcHJlZCcpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5cIitqb2JfbmFtZXMucHNpcHJlZCtcIiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgfVxuICAgICAgaWYoam9iX25hbWUgPT09ICdtZW1wYWNrJylcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtPSB7fTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmhlYWRlciA9IFwiPGg1PlwiK2pvYl9uYW1lcy5tZW1zYXRzdm0rXCIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgIH1cbiAgICAgIGlmKGpvYl9uYW1lID09PSAnYmlvc2VyZicpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5cIitqb2JfbmFtZXMucHNpcHJlZCtcIiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXI9IHt9O1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyID0gXCI8aDU+XCIram9iX25hbWVzLnBnZW50aHJlYWRlcitcIiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5iaW9zZXJmID0ge307XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmYuaGVhZGVyID0gXCI8aDU+XCIram9iX25hbWVzLmJpb3NlcmYrXCIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgIH1cbiAgICAgIGlmKGpvYl9uYW1lID09PSAnZG9tc2VyZicpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5cIitqb2JfbmFtZXMucHNpcHJlZCtcIiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXI9IHt9O1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXIuaGVhZGVyID0gXCI8aDU+XCIram9iX25hbWVzLnBkb210aHJlYWRlcitcIiBET1dOTE9BRFM8L2g1PlwiO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5kb21zZXJmID0ge307XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmYuaGVhZGVyID0gXCI8aDU+XCIram9iX25hbWVzLmRvbXNlcmYrXCIgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgIH1cbiAgICAgIGlmKGpvYl9uYW1lID09PSAnZmZwcmVkJylcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtID0ge307XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5oZWFkZXIgPSBcIjxoNT5cIitqb2JfbmFtZXMubWVtc2F0c3ZtK1wiIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLnBzaXByZWQgPSB7fTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIgPSBcIjxoNT5Qc2lwcmVkIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmRvbXByZWQ9IHt9O1xuICAgICAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmhlYWRlciA9IFwiPGg1PkRvbVByZWQgRE9XTkxPQURTPC9oNT5cIjtcbiAgICAgICAgZG93bmxvYWRzX2luZm8uZmZwcmVkID0ge307XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmZmcHJlZC5oZWFkZXIgPSBcIjxoNT5cIitqb2JfbmFtZXMuZmZwcmVkK1wiIERPV05MT0FEUzwvaDU+XCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLy90YWtlIHRoZSBkYXRhYmxvYiB3ZSd2ZSBnb3QgYW5kIGxvb3Agb3ZlciB0aGUgcmVzdWx0c1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZV9yZXN1bHRzKHJhY3RpdmUsIGRhdGEsIGZpbGVfdXJsLCB6aXAsIGRvd25sb2Fkc19pbmZvLCBqb2JfbmFtZXMpXG57XG4gIGxldCBob3Jpel9yZWdleCA9IC9cXC5ob3JpeiQvO1xuICBsZXQgc3MyX3JlZ2V4ID0gL1xcLnNzMiQvO1xuICBsZXQgcG5nX3JlZ2V4ID0gL1xcLnBuZyQvO1xuICBsZXQgbWVtc2F0X2NhcnRvb25fcmVnZXggPSAvX2NhcnRvb25fbWVtc2F0X3N2bVxcLnBuZyQvO1xuICBsZXQgbWVtc2F0X3NjaGVtYXRpY19yZWdleCA9IC9fc2NoZW1hdGljXFwucG5nJC87XG4gIGxldCBtZW1zYXRfZGF0YV9yZWdleCA9IC9tZW1zYXRfc3ZtJC87XG4gIGxldCBtZW1wYWNrX2NhcnRvb25fcmVnZXggPSAvS2FtYWRhLUthd2FpX1xcZCsucG5nJC87XG4gIGxldCBtZW1wYWNrX2dyYXBoX291dCA9IC9pbnB1dF9ncmFwaC5vdXQkLztcbiAgbGV0IG1lbXBhY2tfY29udGFjdF9yZXMgPSAvQ09OVEFDVF9ERUYxLnJlc3VsdHMkLztcbiAgbGV0IG1lbXBhY2tfbGlwaWRfcmVzID0gL0xJUElEX0VYUE9TVVJFLnJlc3VsdHMkLztcbiAgbGV0IGRvbXNzZWFfcHJlZF9yZWdleCA9IC9cXC5wcmVkJC87XG4gIGxldCBkb21zc2VhX3JlZ2V4ID0gL1xcLmRvbXNzZWEkLztcbiAgbGV0IGRvbXNlcmZfcmVnZXggPSAvLitfKFxcZCspXyhcXGQrKS4qXFwucGRiLztcbiAgbGV0IGZmcHJlZF9zY2hfcmVnZXggPSAvLitfc2NoXFwucG5nLztcbiAgbGV0IGZmcHJlZF9zdm1fcmVnZXggPSAvLitfY2FydG9vbl9tZW1zYXRfc3ZtXy4qXFwucG5nLztcbiAgbGV0IGZmcHJlZF9zY2hlbWF0aWNfcmVnZXggPSAvLitfc2NoZW1hdGljXy4qXFwucG5nLztcbiAgbGV0IGZmcHJlZF90bV9yZWdleCA9IC8uK190bXBcXC5wbmcvO1xuICBsZXQgZmZwcmVkX2ZlYXRjZmdfcmVnZXggPSAvXFwuZmVhdGNmZy87XG4gIGxldCBmZnByZWRfcHJlZHNfcmVnZXggPSAvXFwuZnVsbF9yYXcvO1xuXG4gIGxldCBpbWFnZV9yZWdleCA9ICcnO1xuICBsZXQgcmVzdWx0cyA9IGRhdGEucmVzdWx0cztcbiAgbGV0IGRvbWFpbl9jb3VudCA9IDA7XG4gIGxldCBtZW1wYWNrX3Jlc3VsdF9mb3VuZCA9IGZhbHNlO1xuICBsZXQgZG9tc2VyZl9yZXN1bHRfZm91bmQgPSBmYWxzZTtcbiAgbGV0IHJlZm9ybWF0X2RvbXNlcmZfbW9kZWxzX2ZvdW5kID0gZmFsc2U7XG4gIGxldCBwc2lwcmVkX3Jlc3VsdF9mb3VuZCA9IGZhbHNlO1xuICBsZXQgcGRvbXRocmVhZGVyX3Jlc3VsdF9mb3VuZCA9IGZhbHNlO1xuICAvL1ByZXBhdG9yeSBsb29wIGZvciBpbmZvcm1hdGlvbiB0aGF0IGlzIG5lZWRlZCBiZWZvcmUgcmVzdWx0cyBwYXJzaW5nOlxuICBmb3IobGV0IGkgaW4gcmVzdWx0cylcbiAge1xuICAgIGxldCByZXN1bHRfZGljdCA9IHJlc3VsdHNbaV07XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ0dlbkFsaWdubWVudEFubm90YXRpb24nKVxuICAgIHtcbiAgICAgICAgbGV0IGFubl9zZXQgPSByYWN0aXZlLmdldChcInBnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicGdlbl9hbm5fc2V0XCIsIGFubl9zZXQpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZ2VuX2dlbmFsaWdubWVudF9hbm5vdGF0aW9uJylcbiAgICB7XG4gICAgICAgIGxldCBhbm5fc2V0ID0gcmFjdGl2ZS5nZXQoXCJnZW5fYW5uX3NldFwiKTtcbiAgICAgICAgbGV0IHRtcCA9IHJlc3VsdF9kaWN0LmRhdGFfcGF0aDtcbiAgICAgICAgbGV0IHBhdGggPSB0bXAuc3Vic3RyKDAsIHRtcC5sYXN0SW5kZXhPZihcIi5cIikpO1xuICAgICAgICBsZXQgaWQgPSBwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSsxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgIGFubl9zZXRbaWRdID0ge307XG4gICAgICAgIGFubl9zZXRbaWRdLmFubiA9IHBhdGgrXCIuYW5uXCI7XG4gICAgICAgIGFubl9zZXRbaWRdLmFsbiA9IHBhdGgrXCIuYWxuXCI7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwiZ2VuX2Fubl9zZXRcIiwgYW5uX3NldCk7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdHZW5BbGlnbm1lbnRBbm5vdGF0aW9uX2RvbScpXG4gICAge1xuICAgICAgICBsZXQgYW5uX3NldCA9IHJhY3RpdmUuZ2V0KFwiZGdlbl9hbm5fc2V0XCIpO1xuICAgICAgICBsZXQgdG1wID0gcmVzdWx0X2RpY3QuZGF0YV9wYXRoO1xuICAgICAgICBsZXQgcGF0aCA9IHRtcC5zdWJzdHIoMCwgdG1wLmxhc3RJbmRleE9mKFwiLlwiKSk7XG4gICAgICAgIGxldCBpZCA9IHBhdGguc3Vic3RyKHBhdGgubGFzdEluZGV4T2YoXCIuXCIpKzEsIHBhdGgubGVuZ3RoKTtcbiAgICAgICAgYW5uX3NldFtpZF0gPSB7fTtcbiAgICAgICAgYW5uX3NldFtpZF0uYW5uID0gcGF0aCtcIi5hbm5cIjtcbiAgICAgICAgYW5uX3NldFtpZF0uYWxuID0gcGF0aCtcIi5hbG5cIjtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJkZ2VuX2Fubl9zZXRcIiwgYW5uX3NldCk7XG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAvL21haW4gcmVzdWx0cyBwYXJzaW5nIGxvb3BcbiAgZm9yKGxldCBpIGluIHJlc3VsdHMpXG4gIHtcbiAgICBsZXQgcmVzdWx0X2RpY3QgPSByZXN1bHRzW2ldO1xuICAgIC8vcHNpcHJlZCBmaWxlc1xuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT0gJ3BzaXBhc3MyJylcbiAgICB7XG4gICAgICBwc2lwcmVkX3Jlc3VsdF9mb3VuZCA9IHRydWU7XG4gICAgICBsZXQgbWF0Y2ggPSBob3Jpel9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihtYXRjaClcbiAgICAgIHtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdob3JpeicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgICByYWN0aXZlLnNldChcInBzaXByZWRfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3RpbWVcIiwgJycpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+SG9yaXogRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuXG4gICAgICB9XG4gICAgICBsZXQgc3MyX21hdGNoID0gc3MyX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNzMl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TUzIgRm9ybWF0IE91dHB1dDwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3NzMicsIHppcCwgcmFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vZGlzb3ByZWQgZmlsZXNcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19mb3JtYXQnKVxuICAgIHtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAncGJkYXQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkaXNvcHJlZF93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQucGJkYXQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5QQkRBVCBGb3JtYXQgT3V0cHV0PC9hPjxiciAvPic7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImRpc29wcmVkX3RpbWVcIiwgJycpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnZGlzb19jb21iaW5lJylcbiAgICB7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2NvbWInLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8uZGlzb3ByZWQuY29tYiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNPTUIgTk4gT3V0cHV0PC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgLy9tZW1zYXQgYW5kIG1lbXBhY2sgZmlsZXNcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnbWVtc2F0c3ZtJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXNhdHN2bV93YWl0aW5nX21lc3NhZ2VcIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1zYXRzdm1fd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtc2F0c3ZtX3RpbWVcIiwgJycpO1xuICAgICAgbGV0IHNjaGVtZV9tYXRjaCA9IG1lbXNhdF9zY2hlbWF0aWNfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoc2NoZW1lX21hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fc2NoZW1hdGljJywgJzxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXNhdHN2bS5zY2hlbWF0aWMgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TY2hlbWF0aWMgRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGNhcnRvb25fbWF0Y2ggPSBtZW1zYXRfY2FydG9vbl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihjYXJ0b29uX21hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdtZW1zYXRzdm1fY2FydG9vbicsICc8aW1nIHNyYz1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIiAvPicpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IG1lbXNhdF9tYXRjaCA9IG1lbXNhdF9kYXRhX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKG1lbXNhdF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ21lbXNhdGRhdGEnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgICBkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uZGF0YSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPk1lbXNhdCBPdXRwdXQ8L2E+PGJyIC8+JztcbiAgICAgIH1cbiAgICB9XG4gICAgLy9tZW1wYWNrIGZpbGVzXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ21lbXBhY2tfd3JhcHBlcicpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJtZW1wYWNrX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcIm1lbXBhY2tfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwibWVtcGFja190aW1lXCIsICcnKTtcbiAgICAgIGxldCBjYXJ0b29uX21hdGNoID0gIG1lbXBhY2tfY2FydG9vbl9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihjYXJ0b29uX21hdGNoKVxuICAgICAge1xuICAgICAgICBtZW1wYWNrX3Jlc3VsdF9mb3VuZCA9IHRydWU7XG4gICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnemlwJywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfY2FydG9vbicsICc8aW1nIHdpZHRoPVwiMTAwMHB4XCIgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suY2FydG9vbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkNhcnRvb24gRGlhZ3JhbTwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGdyYXBoX21hdGNoID0gIG1lbXBhY2tfZ3JhcGhfb3V0LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGdyYXBoX21hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2suZ3JhcGhfb3V0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+RGlhZ3JhbSBEYXRhPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgY29udGFjdF9tYXRjaCA9ICBtZW1wYWNrX2NvbnRhY3RfcmVzLmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNvbnRhY3RfbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnemlwJywgemlwLCByYWN0aXZlKTtcbiAgICAgICAgZG93bmxvYWRzX2luZm8ubWVtcGFjay5jb250YWN0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Q29udGFjdCBQcmVkaWN0aW9uczwvYT48YnIgLz4nO1xuICAgICAgfVxuICAgICAgbGV0IGxpcGlkX21hdGNoID0gIG1lbXBhY2tfbGlwaWRfcmVzLmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGxpcGlkX21hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLm1lbXBhY2subGlwaWRfb3V0ID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TGlwaWQgRXhwb3N1cmUgUHJlZGl0aW9uczwvYT48YnIgLz4nO1xuICAgICAgfVxuXG4gICAgfVxuICAgIC8vZ2VudGhyZWFkZXIgYW5kIHBnZW50aHJlYWRlclxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdzb3J0X3ByZXN1bHQnKVxuICAgIHtcbiAgICAgIHJhY3RpdmUuc2V0KFwicGdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcInBnZW50aHJlYWRlcl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJwZ2VudGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ByZXN1bHQnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Jytqb2JfbmFtZXMucGdlbnRocmVhZGVyKycgVGFibGU8L2E+PGJyIC8+JztcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dlbl9zb3J0X3ByZXN1bHRzJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImdlbnRocmVhZGVyX3RpbWVcIiwgJycpO1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdnZW5fcHJlc3VsdCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPicram9iX25hbWVzLmdlbnRocmVhZGVyKycgVGFibGU8L2E+PGJyIC8+JztcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfYWxpZ24nKVxuICAgIHtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnemlwJywgemlwLCByYWN0aXZlKTtcbiAgICAgIGRvd25sb2Fkc19pbmZvLnBnZW50aHJlYWRlci5hbGlnbiA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPicram9iX25hbWVzLnBnZW50aHJlYWRlcisnIEFsaWdubWVudHM8L2E+PGJyIC8+JztcbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ3BzZXVkb19iYXNfbW9kZWxzJylcbiAgICB7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuYWxpZ24gPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj4nK2pvYl9uYW1lcy5wZ2VudGhyZWFkZXIrJyBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dlbnRocmVhZGVyX3BzZXVkb19iYXNfYWxpZ24nKVxuICAgIHtcbiAgICAgIHByb2Nlc3NfZmlsZShmaWxlX3VybCwgcmVzdWx0X2RpY3QuZGF0YV9wYXRoLCAnemlwJywgemlwLCByYWN0aXZlKTtcbiAgICAgIGRvd25sb2Fkc19pbmZvLmdlbnRocmVhZGVyLmFsaWduID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Jytqb2JfbmFtZXMuZ2VudGhyZWFkZXIrJyBBbGlnbm1lbnRzPC9hPjxiciAvPic7XG4gICAgfVxuXG4gICAgLy9wZG9tdGhyZWFkZXJcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnc3ZtX3Byb2JfZG9tJylcbiAgICB7XG4gICAgICBwZG9tdGhyZWFkZXJfcmVzdWx0X2ZvdW5kID0gdHJ1ZTtcbiAgICAgIHJhY3RpdmUuc2V0KFwicGRvbXRocmVhZGVyX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcInBkb210aHJlYWRlcl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJwZG9tdGhyZWFkZXJfdGltZVwiLCAnJyk7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2RvbV9wcmVzdWx0JywgemlwLCByYWN0aXZlKTtcbiAgICAgIGRvd25sb2Fkc19pbmZvLnBkb210aHJlYWRlci50YWJsZSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPicram9iX25hbWVzLnBkb210aHJlYWRlcisnIFRhYmxlPC9hPjxiciAvPic7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdwc2V1ZG9fYmFzX2RvbV9hbGlnbicpXG4gICAge1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmFsaWduID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+Jytqb2JfbmFtZXMucGRvbXRocmVhZGVyKycgQWxpZ25tZW50czwvYT48YnIgLz4nO1xuICAgIH1cbiAgICAvL2RvbXByZWQgZmlsZXNcbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAncGFyc2VkcycpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJkb21wcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImRvbXByZWRfd2FpdGluZ19pY29uXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwiZG9tcHJlZF90aW1lXCIsICcnKTtcbiAgICAgIGxldCBwbmdfbWF0Y2ggPSBwbmdfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYocG5nX21hdGNoKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfaW5mby5kb21wcmVkLmJvdW5kYXJ5X3BuZyA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkJvdW5kYXJ5IFBORzwvYT48YnIgLz4nO1xuICAgICAgICByYWN0aXZlLnNldCgncGFyc2Vkc19wbmcnLCAnPGltZyBzcmM9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCIgLz4nKTtcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZC5ib3VuZGFyeSA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkJvdW5kYXJ5IGZpbGU8L2E+PGJyIC8+JztcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdwYXJzZWRzJywgemlwLCByYWN0aXZlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2RvbXNzZWEnKVxuICAgIHtcbiAgICAgIGxldCBwcmVkX21hdGNoID0gIGRvbXNzZWFfcHJlZF9yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihwcmVkX21hdGNoKVxuICAgICAge1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmRvbXByZWQuZG9tc3NlYXByZWQgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5ET01TU0VBIHByZWRpY3Rpb25zPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgICBsZXQgZG9tc3NlYV9tYXRjaCA9ICBkb21zc2VhX3ByZWRfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoZG9tc3NlYV9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgICAgZG93bmxvYWRzX2luZm8uZG9tcHJlZC5kb21zc2VhID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+RE9NU1NFQSBmaWxlPC9hPjxiciAvPic7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdydW5CaW9zZXJmJylcbiAgICB7XG4gICAgICByYWN0aXZlLnNldChcImJpb3NlcmZfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwiYmlvc2VyZl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgcmFjdGl2ZS5zZXQoXCJiaW9zZXJmX3RpbWVcIiwgJycpO1xuICAgICAgZG93bmxvYWRzX2luZm8uYmlvc2VyZi5tb2RlbCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkZpbmFsIEhvbW9sb2d5IE1vZGVsPC9hPjxiciAvPic7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICBkaXNwbGF5X3N0cnVjdHVyZShmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgsICcjYmlvc2VyZl9tb2RlbCcpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAnaGhibGl0c19wZGI3MCcpXG4gICAge1xuICAgICAgZG93bmxvYWRzX2luZm8uYmlvc2VyZi5oaGJsaXRzID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+SEhTZWFyY2ggUmVzdWx0czwvYT48YnIgLz4nO1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAncGdwYmxhc3RfcGRiYWEnKVxuICAgIHtcbiAgICAgIGRvd25sb2Fkc19pbmZvLmJpb3NlcmYucGRiYWEgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5QREJhYSBCbGFzdDwvYT48YnIgLz4nO1xuICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgIH1cbiAgICBpZihyZXN1bHRfZGljdC5uYW1lID09PSAncHNpYmxhc3RfY2F0aCcpXG4gICAge1xuICAgICAgZG93bmxvYWRzX2luZm8uZG9tc2VyZi5jYXRoYmxhc3QgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5DQVRIIEJsYXN0PC9hPjxiciAvPic7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdwc2libGFzdF9wZGJhYScpXG4gICAge1xuICAgICAgZG93bmxvYWRzX2luZm8uZG9tc2VyZi5wZGJibGFzdCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPlBEQmFhIEJsYXN0PC9hPjxiciAvPic7XG4gICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgfVxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdyZWZvcm1hdF9kb21zZXJmX21vZGVscycgfHwgcmVzdWx0X2RpY3QubmFtZSA9PT0gXCJwYXJzZV9wZGJfYmxhc3RcIilcbiAgICB7XG4gICAgICBsZXQgZG9tc2VyZl9tYXRjaCA9IGRvbXNlcmZfcmVnZXguZXhlYyhyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgaWYoZG9tc2VyZl9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoXCJkb21zZXJmX3dhaXRpbmdfbWVzc2FnZVwiLCAnJyk7XG4gICAgICAgIHJhY3RpdmUuc2V0KFwiZG9tc2VyZl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgICAgICByYWN0aXZlLnNldChcImRvbXNlcmZfdGltZVwiLCAnJyk7XG4gICAgICAgIC8vIFRPIERPIEFERCBSRUdFWFxuICAgICAgICBkb21haW5fY291bnQrPTE7XG4gICAgICAgIGRvbXNlcmZfcmVzdWx0X2ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgaWYoZG93bmxvYWRzX2luZm8uZG9tc2VyZi5tb2RlbCl7XG4gICAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICd6aXAnLCB6aXAsIHJhY3RpdmUpO1xuICAgICAgICAgIGRvd25sb2Fkc19pbmZvLmRvbXNlcmYubW9kZWwgKz0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TW9kZWwgJytkb21zZXJmX21hdGNoWzFdKyctJytkb21zZXJmX21hdGNoWzJdKyc8L2E+PGJyIC8+JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgICAgZG93bmxvYWRzX2luZm8uZG9tc2VyZi5tb2RlbCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPk1vZGVsICcrZG9tc2VyZl9tYXRjaFsxXSsnLScrZG9tc2VyZl9tYXRjaFsyXSsnPC9hPjxiciAvPic7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJ1dHRvbnNfdGFncyA9IHJhY3RpdmUuZ2V0KFwiZG9tc2VyZl9idXR0b25zXCIpO1xuICAgICAgICBidXR0b25zX3RhZ3MgKz0gJzxidXR0b24gb25DbGljaz1cInBzaXByZWQuc3dhcERvbXNlcmYoJytkb21haW5fY291bnQrJylcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5Eb21haW4gJytkb21zZXJmX21hdGNoWzFdKyctJytkb21zZXJmX21hdGNoWzJdKyc8L2J1dHRvbj4nO1xuICAgICAgICByYWN0aXZlLnNldChcImRvbXNlcmZfYnV0dG9uc1wiLCBidXR0b25zX3RhZ3MpO1xuICAgICAgICBsZXQgcGF0aHMgPSByYWN0aXZlLmdldChcImRvbXNlcmZfbW9kZWxfdXJpc1wiKTtcbiAgICAgICAgcGF0aHMucHVzaChmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgpO1xuICAgICAgICByYWN0aXZlLnNldChcImRvbXNlcmZfbW9kZWxfdXJpc1wiLCBwYXRocyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2dldFNjaGVtYXRpYycpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoXCJmZnByZWRfd2FpdGluZ19tZXNzYWdlXCIsICcnKTtcbiAgICAgIHJhY3RpdmUuc2V0KFwiZmZwcmVkX3dhaXRpbmdfaWNvblwiLCAnJyk7XG4gICAgICByYWN0aXZlLnNldChcImZmcHJlZF90aW1lXCIsICcnKTtcblxuICAgICAgbGV0IHNjaF9tYXRjaCA9ICBmZnByZWRfc2NoX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHNjaF9tYXRjaClcbiAgICAgIHtcbiAgICAgICAgZG93bmxvYWRzX2luZm8uZmZwcmVkLnNjaCA9ICc8YSBocmVmPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiPkZlYXR1cmUgU2NoZW1hdGljIFBORzwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdzY2hfc2NoZW1hdGljJywgJzxiPlNlcXVlbmNlIEZlYXR1cmUgTWFwPC9iPjxiciAvPlBvc2l0aW9uIGRlcGVuZGVudCBmZWF0dXJlIHByZWRpY3Rpb25zIGFyZSBtYXBwZWQgb250byB0aGUgc2VxdWVuY2Ugc2NoZW1hdGljIHNob3duIGJlbG93LiBUaGUgbGluZSBoZWlnaHQgb2YgdGhlIFBob3NwaG9yeWxhdGlvbiBhbmQgR2x5Y29zeWxhdGlvbiBmZWF0dXJlcyByZWZsZWN0cyB0aGUgY29uZmlkZW5jZSBvZiB0aGUgcmVzaWR1ZSBwcmVkaWN0aW9uLjxiciAvPjxpbWcgc3JjPVwiJytmaWxlX3VybCtyZXN1bHRfZGljdC5kYXRhX3BhdGgrJ1wiIC8+Jyk7XG4gICAgICB9XG4gICAgICBsZXQgY2FydG9vbl9tYXRjaCA9ICBmZnByZWRfc3ZtX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKGNhcnRvb25fbWF0Y2gpXG4gICAgICB7XG4gICAgICAgIGRvd25sb2Fkc19pbmZvLmZmcHJlZC5jYXJ0b29uID0gJzxhIGhyZWY9XCInK2ZpbGVfdXJsK3Jlc3VsdF9kaWN0LmRhdGFfcGF0aCsnXCI+TWVtc2F0IFBORzwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ3ppcCcsIHppcCwgcmFjdGl2ZSk7XG4gICAgICAgIHJhY3RpdmUuc2V0KCdmZnByZWRfY2FydG9vbicsICc8Yj5QcmVkaWN0ZWQgVHJhbnNtZW1icmFuZSBUb3BvbG9neTwvYj48YnIgLz48aW1nIHNyYz1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIiAvPicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHJlc3VsdF9kaWN0Lm5hbWUgPT09ICdmZWF0dXJlcycpXG4gICAge1xuICAgICAgbGV0IGZlYXRfbWF0Y2ggPSBmZnByZWRfZmVhdGNmZ19yZWdleC5leGVjKHJlc3VsdF9kaWN0LmRhdGFfcGF0aCk7XG4gICAgICBpZihmZWF0X21hdGNoKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfaW5mby5mZnByZWQuZmVhdHVyZXMgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5TZXF1ZW5jZSBGZWF0dXJlIFN1bW1hcnk8L2E+PGJyIC8+JztcbiAgICAgICAgcHJvY2Vzc19maWxlKGZpbGVfdXJsLCByZXN1bHRfZGljdC5kYXRhX3BhdGgsICdmZnByZWRmZWF0dXJlcycsIHppcCwgcmFjdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYocmVzdWx0X2RpY3QubmFtZSA9PT0gJ2ZmcHJlZF9odW1hbicpXG4gICAge1xuICAgICAgbGV0IHByZWRzX21hdGNoID0gZmZwcmVkX3ByZWRzX3JlZ2V4LmV4ZWMocmVzdWx0X2RpY3QuZGF0YV9wYXRoKTtcbiAgICAgIGlmKHByZWRzX21hdGNoKVxuICAgICAge1xuICAgICAgICBkb3dubG9hZHNfaW5mby5mZnByZWQucHJlZHMgPSAnPGEgaHJlZj1cIicrZmlsZV91cmwrcmVzdWx0X2RpY3QuZGF0YV9wYXRoKydcIj5HTyBQcmVkaWN0aW9uczwvYT48YnIgLz4nO1xuICAgICAgICBwcm9jZXNzX2ZpbGUoZmlsZV91cmwsIHJlc3VsdF9kaWN0LmRhdGFfcGF0aCwgJ2ZmcHJlZHByZWRpY3Rpb25zJywgemlwLCByYWN0aXZlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8vU2V0IG5vIGZvdW5kIHN0YXRtZW50cyBmb3Igc29tZSBqb2JzLlxuICBpZighIG1lbXBhY2tfcmVzdWx0X2ZvdW5kKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ21lbXBhY2tfY2FydG9vbicsICc8aDM+Tm8gcGFja2luZyBwcmVkaWN0aW9uIHBvc3NpYmxlPC9oMz4nKTtcbiAgfVxuICBpZighIHBzaXByZWRfcmVzdWx0X2ZvdW5kKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoXCJwc2lwcmVkX3dhaXRpbmdfbWVzc2FnZVwiLCAnTm8gJytqb2JfbmFtZXMucHNpcHJlZCsnIGRhdGEgZ2VuZXJhdGVkIGZvciB0aGlzIGpvYicpO1xuICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgIHJhY3RpdmUuc2V0KFwicHNpcHJlZF90aW1lXCIsICcnKTtcbiAgfVxuICBpZighIHBkb210aHJlYWRlcl9yZXN1bHRfZm91bmQpXG4gIHtcbiAgICByYWN0aXZlLnNldChcInBkb210aHJlYWRlcl93YWl0aW5nX21lc3NhZ2VcIiwgJ05vICcram9iX25hbWVzLnBkb210aHJlYWRlcisnIHRhYmxlIGdlbmVyYXRlZCBmb3IgdGhpcyBqb2InKTtcbiAgICByYWN0aXZlLnNldChcInBkb210aHJlYWRlcl93YWl0aW5nX2ljb25cIiwgJycpO1xuICAgIHJhY3RpdmUuc2V0KFwicGRvbXRocmVhZGVyX3RpbWVcIiwgJycpO1xuICB9XG4gIGlmKGRvbXNlcmZfcmVzdWx0X2ZvdW5kKVxuICB7XG4gICAgbGV0IHBhdGhzID0gcmFjdGl2ZS5nZXQoXCJkb21zZXJmX21vZGVsX3VyaXNcIik7XG4gICAgZGlzcGxheV9zdHJ1Y3R1cmUocGF0aHNbMF0sICcjZG9tc2VyZl9tb2RlbCcpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5X3N0cnVjdHVyZSh1cmksIGNzc19pZClcbntcbiAgbGV0IGNhcnRvb25fY29sb3IgPSBmdW5jdGlvbihhdG9tKSB7XG4gICAgICAgICBpZihhdG9tLnNzID09PSAnaCcpe3JldHVybiAnI2UzNTNlMyc7fVxuICAgICAgICAgaWYoYXRvbS5zcyA9PT0gJ3MnKXtyZXR1cm4gJyNlNWRkNTUnO31cbiAgICAgICAgIHJldHVybignZ3JleScpO1xuICB9O1xuICBjb25zb2xlLmxvZyhcIkxPQURJTkc6IFwiK3VyaSk7XG4gIGxldCBlbGVtZW50ID0gJChjc3NfaWQpO1xuICBsZXQgY29uZmlnID0geyBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyB9O1xuICBsZXQgdmlld2VyID0gJDNEbW9sLmNyZWF0ZVZpZXdlciggZWxlbWVudCwgY29uZmlnICk7XG4gIGxldCBkYXRhID0gZ2V0X3RleHQodXJpLCBcIkdFVFwiLCB7fSk7XG4gIHZpZXdlci5hZGRNb2RlbCggZGF0YSwgXCJwZGJcIiApOyAgICAgICAgICAgICAgICAgICAgICAgLyogbG9hZCBkYXRhICovXG4gIHZpZXdlci5zZXRTdHlsZSh7fSwge2NhcnRvb246IHtjb2xvcmZ1bmM6IGNhcnRvb25fY29sb3J9fSk7ICAvKiBzdHlsZSBhbGwgYXRvbXMgKi9cbiAgdmlld2VyLnpvb21UbygpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogc2V0IGNhbWVyYSAqL1xuICB2aWV3ZXIucmVuZGVyKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiByZW5kZXIgc2NlbmUgKi9cbiAgdmlld2VyLnpvb20oMS43LCAzMDAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF9kb3dubG9hZHNfcGFuZWwocmFjdGl2ZSwgZG93bmxvYWRzX2luZm8pXG57XG4gIC8vY29uc29sZS5sb2coZG93bmxvYWRzX2luZm8pO1xuICBsZXQgZG93bmxvYWRzX3N0cmluZyA9IHJhY3RpdmUuZ2V0KCdkb3dubG9hZF9saW5rcycpO1xuICBpZigncHNpcHJlZCcgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBpZihkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6KXtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wc2lwcmVkLmhvcml6KTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucHNpcHJlZC5zczIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTt9XG4gIH1cbiAgaWYoJ2Rpc29wcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kaXNvcHJlZC5wYmRhdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRpc29wcmVkLmNvbWIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZignbWVtc2F0c3ZtJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmRhdGEpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1zYXRzdm0uc2NoZW1hdGljKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtc2F0c3ZtLmNhcnRvb24pO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZigncGdlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZ2VudGhyZWFkZXIuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLnRhYmxlKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ2dlbnRocmVhZGVyJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5nZW50aHJlYWRlci50YWJsZSk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmdlbnRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgaWYoJ3Bkb210aHJlYWRlcicgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBpZihkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXIudGFibGUpe1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5wZG9tdGhyZWFkZXIuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLnRhYmxlKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ucGRvbXRocmVhZGVyLmFsaWduKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gICAgfVxuICB9XG4gIGlmKCdtZW1wYWNrJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmhlYWRlcik7XG4gICAgaWYoZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uKVxuICAgIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtcGFjay5jYXJ0b29uKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8ubWVtcGFjay5ncmFwaF9vdXQpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmNvbnRhY3QpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5tZW1wYWNrLmxpcGlkX291dCk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCJObyBwYWNraW5nIHByZWRpY3Rpb24gcG9zc2libGU8YnIgLz5cIik7XG4gICAgfVxuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZignYmlvc2VyZicgaW4gZG93bmxvYWRzX2luZm8pXG4gIHtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uYmlvc2VyZi5oZWFkZXIpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5iaW9zZXJmLm1vZGVsKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uYmlvc2VyZi5oaGJsaXRzKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uYmlvc2VyZi5wZGJhYSk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KFwiPGJyIC8+XCIpO1xuICB9XG4gIGlmKCdkb21zZXJmJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kb21zZXJmLmhlYWRlcik7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRvbXNlcmYubW9kZWwpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5kb21zZXJmLmNhdGhibGFzdCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmRvbXNlcmYucGRiYmxhc3QpO1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChcIjxiciAvPlwiKTtcbiAgfVxuICBpZignZmZwcmVkJyBpbiBkb3dubG9hZHNfaW5mbylcbiAge1xuICAgIGRvd25sb2Fkc19zdHJpbmcgPSBkb3dubG9hZHNfc3RyaW5nLmNvbmNhdChkb3dubG9hZHNfaW5mby5mZnByZWQuaGVhZGVyKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZmZwcmVkLnNjaCk7XG4gICAgZG93bmxvYWRzX3N0cmluZyA9IGRvd25sb2Fkc19zdHJpbmcuY29uY2F0KGRvd25sb2Fkc19pbmZvLmZmcHJlZC5jYXJ0b29uKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZmZwcmVkLmZlYXR1cmVzKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoZG93bmxvYWRzX2luZm8uZmZwcmVkLnByZWRzKTtcbiAgICBkb3dubG9hZHNfc3RyaW5nID0gZG93bmxvYWRzX3N0cmluZy5jb25jYXQoXCI8YnIgLz5cIik7XG4gIH1cbiAgcmFjdGl2ZS5zZXQoJ2Rvd25sb2FkX2xpbmtzJywgZG93bmxvYWRzX3N0cmluZyk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyIsImltcG9ydCB7IGdldF9tZW1zYXRfcmFuZ2VzIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX3NzMiB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9wYmRhdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9jb21iIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX21lbXNhdGRhdGEgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfcHJlc3VsdCB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5pbXBvcnQgeyBwYXJzZV9wYXJzZWRzIH0gZnJvbSAnLi4vcGFyc2Vycy9wYXJzZXJzX2luZGV4LmpzJztcbmltcG9ydCB7IHBhcnNlX2ZlYXRjZmcgfSBmcm9tICcuLi9wYXJzZXJzL3BhcnNlcnNfaW5kZXguanMnO1xuaW1wb3J0IHsgcGFyc2VfZmZwcmVkcyB9IGZyb20gJy4uL3BhcnNlcnMvcGFyc2Vyc19pbmRleC5qcyc7XG5cblxuLy9naXZlbiBhIHVybCwgaHR0cCByZXF1ZXN0IHR5cGUgYW5kIHNvbWUgZm9ybSBkYXRhIG1ha2UgYW4gaHR0cCByZXF1ZXN0XG5leHBvcnQgZnVuY3Rpb24gc2VuZF9yZXF1ZXN0KHVybCwgdHlwZSwgc2VuZF9kYXRhKVxue1xuICBjb25zb2xlLmxvZygnU2VuZGluZyBVUkkgcmVxdWVzdCcpO1xuICBjb25zb2xlLmxvZyh1cmwpO1xuICBjb25zb2xlLmxvZyh0eXBlKTtcbiAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgJC5hamF4KHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IHNlbmRfZGF0YSxcbiAgICBjYWNoZTogZmFsc2UsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICBhc3luYzogICBmYWxzZSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgLy9jb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgdXJsOiB1cmwsXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKVxuICAgIHtcbiAgICAgIGlmKGRhdGEgPT09IG51bGwpe2FsZXJ0KFwiRmFpbGVkIHRvIHNlbmQgZGF0YVwiKTt9XG4gICAgICByZXNwb25zZT1kYXRhO1xuICAgICAgLy9hbGVydChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoXCJTZW5kaW5nIEpvYiB0byBcIit1cmwrXCIgRmFpbGVkLiBcIitlcnJvci5yZXNwb25zZVRleHQrXCIuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSB3YXMgdW5hYmxlIHRvIHByb2Nlc3MgeW91ciBzdWJtaXNzaW9uLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTsgcmV0dXJuIG51bGw7XG4gIH19KS5yZXNwb25zZUpTT047XG4gIHJldHVybihyZXNwb25zZSk7XG59XG5cbi8vZ2l2ZW4gYSBqb2IgbmFtZSBwcmVwIGFsbCB0aGUgZm9ybSBlbGVtZW50cyBhbmQgc2VuZCBhbiBodHRwIHJlcXVlc3QgdG8gdGhlXG4vL2JhY2tlbmRcbmV4cG9ydCBmdW5jdGlvbiBzZW5kX2pvYihyYWN0aXZlLCBqb2JfbmFtZSwgc2VxLCBuYW1lLCBlbWFpbCwgc3VibWl0X3VybCwgdGltZXNfdXJsLCBqb2JfbmFtZXMpXG57XG4gIC8vYWxlcnQoc2VxKTtcbiAgY29uc29sZS5sb2coXCJTZW5kaW5nIGZvcm0gZGF0YVwiKTtcbiAgY29uc29sZS5sb2coam9iX25hbWUpO1xuICB2YXIgZmlsZSA9IG51bGw7XG4gIHRyeVxuICB7XG4gICAgZmlsZSA9IG5ldyBCbG9iKFtzZXFdKTtcbiAgfSBjYXRjaCAoZSlcbiAge1xuICAgIGFsZXJ0KGUpO1xuICB9XG4gIGxldCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICBmZC5hcHBlbmQoXCJpbnB1dF9kYXRhXCIsIGZpbGUsICdpbnB1dC50eHQnKTtcbiAgZmQuYXBwZW5kKFwiam9iXCIsam9iX25hbWUpO1xuICBmZC5hcHBlbmQoXCJzdWJtaXNzaW9uX25hbWVcIixuYW1lKTtcbiAgZmQuYXBwZW5kKFwiZW1haWxcIiwgZW1haWwpO1xuXG4gIGxldCByZXNwb25zZV9kYXRhID0gc2VuZF9yZXF1ZXN0KHN1Ym1pdF91cmwsIFwiUE9TVFwiLCBmZCk7XG4gIGlmKHJlc3BvbnNlX2RhdGEgIT09IG51bGwpXG4gIHtcbiAgICBsZXQgdGltZXMgPSBzZW5kX3JlcXVlc3QodGltZXNfdXJsLCdHRVQnLHt9KTtcbiAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHRpbWVzKSk7XG4gICAgaWYoam9iX25hbWUgaW4gdGltZXMpXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgam9iX25hbWVzW2pvYl9uYW1lXStcIiBqb2JzIHR5cGljYWxseSB0YWtlIFwiK3RpbWVzW2pvYl9uYW1lXStcIiBzZWNvbmRzXCIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgcmFjdGl2ZS5zZXQoam9iX25hbWUrJ190aW1lJywgXCJVbmFibGUgdG8gcmV0cmlldmUgYXZlcmFnZSB0aW1lIGZvciBcIitqb2JfbmFtZXNbam9iX25hbWVdK1wiIGpvYnMuXCIpO1xuICAgIH1cbiAgICBmb3IodmFyIGsgaW4gcmVzcG9uc2VfZGF0YSlcbiAgICB7XG4gICAgICBpZihrID09IFwiVVVJRFwiKVxuICAgICAge1xuICAgICAgICByYWN0aXZlLnNldCgnYmF0Y2hfdXVpZCcsIHJlc3BvbnNlX2RhdGFba10pO1xuICAgICAgICByYWN0aXZlLmZpcmUoJ3BvbGxfdHJpZ2dlcicsIGpvYl9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIHNlcXVlbmNlIGZyb20gYSBwcmV2aW91cyBzdWJtaXNzaW9uIGlzIHRoZVxuLy9wYWdlIHdhcyBsb2FkZWQgd2l0aCBhIFVVSURcbmV4cG9ydCBmdW5jdGlvbiBnZXRfcHJldmlvdXNfZGF0YSh1dWlkLCBzdWJtaXRfdXJsLCBmaWxlX3VybCwgcmFjdGl2ZSlcbntcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdGluZyBkZXRhaWxzIGdpdmVuIFVSSScpO1xuICAgIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgLy9hbGVydCh1cmwpO1xuICAgIGxldCBzdWJtaXNzaW9uX3Jlc3BvbnNlID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGlmKCEgc3VibWlzc2lvbl9yZXNwb25zZSl7YWxlcnQoXCJOTyBTVUJNSVNTSU9OIERBVEFcIik7fVxuICAgIGxldCBzZXEgPSBnZXRfdGV4dChmaWxlX3VybCtzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmlucHV0X2ZpbGUsIFwiR0VUXCIsIHt9KTtcbiAgICBsZXQgam9icyA9ICcnO1xuICAgIHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihzdWJtaXNzaW9uKXtcbiAgICAgIGpvYnMgKz0gc3VibWlzc2lvbi5qb2JfbmFtZStcIixcIjtcbiAgICB9KTtcbiAgICBqb2JzID0gam9icy5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuKHsnc2VxJzogc2VxLCAnZW1haWwnOiBzdWJtaXNzaW9uX3Jlc3BvbnNlLnN1Ym1pc3Npb25zWzBdLmVtYWlsLCAnbmFtZSc6IHN1Ym1pc3Npb25fcmVzcG9uc2Uuc3VibWlzc2lvbnNbMF0uc3VibWlzc2lvbl9uYW1lLCAnam9icyc6IGpvYnN9KTtcbn1cblxuXG4vL2dldCB0ZXh0IGNvbnRlbnRzIGZyb20gYSByZXN1bHQgVVJJXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3RleHQodXJsLCB0eXBlLCBzZW5kX2RhdGEpXG57XG5cbiBsZXQgcmVzcG9uc2UgPSBudWxsO1xuICAkLmFqYXgoe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogc2VuZF9kYXRhLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIGFzeW5jOiAgIGZhbHNlLFxuICAgIC8vZGF0YVR5cGU6IFwidHh0XCIsXG4gICAgLy9jb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgdXJsOiB1cmwsXG4gICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKVxuICAgIHtcbiAgICAgIGlmKGRhdGEgPT09IG51bGwpe2FsZXJ0KFwiRmFpbGVkIHRvIHJlcXVlc3QgaW5wdXQgZGF0YSB0ZXh0XCIpO31cbiAgICAgIHJlc3BvbnNlPWRhdGE7XG4gICAgICAvL2FsZXJ0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSlcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHthbGVydChcIkdldHRpbmdzIHJlc3VsdHMgdGV4dCBmYWlsZWQuIFRoZSBCYWNrZW5kIHByb2Nlc3Npbmcgc2VydmljZSBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgY29udGFjdCBwc2lwcmVkQGNzLnVjbC5hYy51a1wiKTt9XG4gIH0pO1xuICByZXR1cm4ocmVzcG9uc2UpO1xufVxuXG5cbi8vcG9sbHMgdGhlIGJhY2tlbmQgdG8gZ2V0IHJlc3VsdHMgYW5kIHRoZW4gcGFyc2VzIHRob3NlIHJlc3VsdHMgdG8gZGlzcGxheVxuLy90aGVtIG9uIHRoZSBwYWdlXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc19maWxlKHVybF9zdHViLCBwYXRoLCBjdGwsIHppcCwgcmFjdGl2ZSlcbntcbiAgbGV0IHVybCA9IHVybF9zdHViICsgcGF0aDtcbiAgbGV0IHBhdGhfYml0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAvL2dldCBhIHJlc3VsdHMgZmlsZSBhbmQgcHVzaCB0aGUgZGF0YSBpbiB0byB0aGUgYmlvM2Qgb2JqZWN0XG4gIC8vYWxlcnQodXJsKTtcbiAgY29uc29sZS5sb2coJ0dldHRpbmcgUmVzdWx0cyBGaWxlIGFuZCBwcm9jZXNzaW5nJyk7XG4gIGxldCByZXNwb25zZSA9IG51bGw7XG4gICQuYWpheCh7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgYXN5bmM6ICAgdHJ1ZSxcbiAgICB1cmw6IHVybCxcbiAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGZpbGUpXG4gICAge1xuICAgICAgemlwLmZvbGRlcihwYXRoX2JpdHNbMV0pLmZpbGUocGF0aF9iaXRzWzJdLCBmaWxlKTtcbiAgICAgIGlmKGN0bCA9PT0gJ2hvcml6JylcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfaG9yaXonLCBmaWxlKTtcbiAgICAgICAgYmlvZDMucHNpcHJlZChmaWxlLCAncHNpcHJlZENoYXJ0Jywge3BhcmVudDogJ2Rpdi5wc2lwcmVkX2NhcnRvb24nLCBtYXJnaW5fc2NhbGVyOiAyfSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdzczInKVxuICAgICAge1xuICAgICAgICBwYXJzZV9zczIocmFjdGl2ZSwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdwYmRhdCcpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3BiZGF0KHJhY3RpdmUsIGZpbGUpO1xuICAgICAgICAvL2FsZXJ0KCdQQkRBVCBwcm9jZXNzJyk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdjb21iJylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfY29tYihyYWN0aXZlLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ21lbXNhdGRhdGEnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9tZW1zYXRkYXRhKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAncHJlc3VsdCcpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3ByZXN1bHQocmFjdGl2ZSwgZmlsZSwgJ3BnZW4nKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ2dlbl9wcmVzdWx0JylcbiAgICAgIHtcbiAgICAgICAgcGFyc2VfcHJlc3VsdChyYWN0aXZlLCBmaWxlLCAnZ2VuJyk7XG4gICAgICB9XG4gICAgICBpZihjdGwgPT09ICdkb21fcHJlc3VsdCcpXG4gICAgICB7XG4gICAgICAgIHBhcnNlX3ByZXN1bHQocmFjdGl2ZSwgZmlsZSwgJ2RnZW4nKTtcbiAgICAgIH1cbiAgICAgIGlmKGN0bCA9PT0gJ3BhcnNlZHMnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9wYXJzZWRzKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnZmZwcmVkZmVhdHVyZXMnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9mZWF0Y2ZnKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYoY3RsID09PSAnZmZwcmVkcHJlZGljdGlvbnMnKVxuICAgICAge1xuICAgICAgICBwYXJzZV9mZnByZWRzKHJhY3RpdmUsIGZpbGUpO1xuICAgICAgfVxuXG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7YWxlcnQoSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTt9XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzIiwiLy9naXZlbiBhbmQgYXJyYXkgcmV0dXJuIHdoZXRoZXIgYW5kIGVsZW1lbnQgaXMgcHJlc2VudFxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5BcnJheSh2YWx1ZSwgYXJyYXkpIHtcbiAgaWYoYXJyYXkuaW5kZXhPZih2YWx1ZSkgPiAtMSlcbiAge1xuICAgIHJldHVybih0cnVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4oZmFsc2UpO1xuICB9XG59XG5cbi8vd2hlbiBhIHJlc3VsdHMgcGFnZSBpcyBpbnN0YW50aWF0ZWQgYW5kIGJlZm9yZSBzb21lIGFubm90YXRpb25zIGhhdmUgY29tZSBiYWNrXG4vL3dlIGRyYXcgYW5kIGVtcHR5IGFubm90YXRpb24gcGFuZWxcbmV4cG9ydCBmdW5jdGlvbiBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwocmFjdGl2ZSl7XG5cbiAgbGV0IHNlcSA9IHJhY3RpdmUuZ2V0KCdzZXF1ZW5jZScpO1xuICBsZXQgcmVzaWR1ZXMgPSBzZXEuc3BsaXQoJycpO1xuICBsZXQgYW5ub3RhdGlvbnMgPSBbXTtcbiAgcmVzaWR1ZXMuZm9yRWFjaChmdW5jdGlvbihyZXMpe1xuICAgIGFubm90YXRpb25zLnB1c2goeydyZXMnOiByZXN9KTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCdhbm5vdGF0aW9ucycsIGFubm90YXRpb25zKTtcbiAgYmlvZDMuYW5ub3RhdGlvbkdyaWQocmFjdGl2ZS5nZXQoJ2Fubm90YXRpb25zJyksIHtwYXJlbnQ6ICdkaXYuc2VxdWVuY2VfcGxvdCcsIG1hcmdpbl9zY2FsZXI6IDIsIGRlYnVnOiBmYWxzZSwgY29udGFpbmVyX3dpZHRoOiA5MDAsIHdpZHRoOiA5MDAsIGhlaWdodDogMzAwLCBjb250YWluZXJfaGVpZ2h0OiAzMDB9KTtcbn1cblxuXG4vL2dpdmVuIGEgVVJMIHJldHVybiB0aGUgYXR0YWNoZWQgdmFyaWFibGVzXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXJsVmFycygpIHtcbiAgICBsZXQgdmFycyA9IHt9O1xuICAgIC8vY29uc2lkZXIgdXNpbmcgbG9jYXRpb24uc2VhcmNoIGluc3RlYWQgaGVyZVxuICAgIGxldCBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1s/Jl0rKFtePSZdKyk9KFteJl0qKS9naSxcbiAgICBmdW5jdGlvbihtLGtleSx2YWx1ZSkge1xuICAgICAgdmFyc1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhcnM7XG4gIH1cblxuLyohIGdldEVtUGl4ZWxzICB8IEF1dGhvcjogVHlzb24gTWF0YW5pY2ggKGh0dHA6Ly9tYXRhbmljaC5jb20pLCAyMDEzIHwgTGljZW5zZTogTUlUICovXG4oZnVuY3Rpb24gKGRvY3VtZW50LCBkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAvLyBFbmFibGUgc3RyaWN0IG1vZGVcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vIEZvcm0gdGhlIHN0eWxlIG9uIHRoZSBmbHkgdG8gcmVzdWx0IGluIHNtYWxsZXIgbWluaWZpZWQgZmlsZVxuICAgIGxldCBpbXBvcnRhbnQgPSBcIiFpbXBvcnRhbnQ7XCI7XG4gICAgbGV0IHN0eWxlID0gXCJwb3NpdGlvbjphYnNvbHV0ZVwiICsgaW1wb3J0YW50ICsgXCJ2aXNpYmlsaXR5OmhpZGRlblwiICsgaW1wb3J0YW50ICsgXCJ3aWR0aDoxZW1cIiArIGltcG9ydGFudCArIFwiZm9udC1zaXplOjFlbVwiICsgaW1wb3J0YW50ICsgXCJwYWRkaW5nOjBcIiArIGltcG9ydGFudDtcblxuICAgIHdpbmRvdy5nZXRFbVBpeGVscyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cbiAgICAgICAgbGV0IGV4dHJhQm9keTtcblxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIEVtdWxhdGUgdGhlIGRvY3VtZW50RWxlbWVudCB0byBnZXQgcmVtIHZhbHVlIChkb2N1bWVudEVsZW1lbnQgZG9lcyBub3Qgd29yayBpbiBJRTYtNylcbiAgICAgICAgICAgIGVsZW1lbnQgPSBleHRyYUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtcbiAgICAgICAgICAgIGV4dHJhQm9keS5zdHlsZS5jc3NUZXh0ID0gXCJmb250LXNpemU6MWVtXCIgKyBpbXBvcnRhbnQ7XG4gICAgICAgICAgICBkb2N1bWVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGV4dHJhQm9keSwgZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYW5kIHN0eWxlIGEgdGVzdCBlbGVtZW50XG4gICAgICAgIGxldCB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuICAgICAgICB0ZXN0RWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGU7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGVzdEVsZW1lbnQpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgY2xpZW50IHdpZHRoIG9mIHRoZSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgbGV0IHZhbHVlID0gdGVzdEVsZW1lbnQuY2xpZW50V2lkdGg7XG5cbiAgICAgICAgaWYgKGV4dHJhQm9keSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBleHRyYSBib2R5IGVsZW1lbnRcbiAgICAgICAgICAgIGRvY3VtZW50RWxlbWVudC5yZW1vdmVDaGlsZChleHRyYUJvZHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSB0ZXN0IGVsZW1lbnRcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQodGVzdEVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIHRoZSBlbSB2YWx1ZSBpbiBwaXhlbHNcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59KGRvY3VtZW50LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9jb21tb24vY29tbW9uX2luZGV4LmpzIiwiLyogMS4gQ2F0Y2ggZm9ybSBpbnB1dFxuICAgICAyLiBWZXJpZnkgZm9ybVxuICAgICAzLiBJZiBnb29kIHRoZW4gbWFrZSBmaWxlIGZyb20gZGF0YSBhbmQgcGFzcyB0byBiYWNrZW5kXG4gICAgIDQuIHNocmluayBmb3JtIGF3YXlcbiAgICAgNS4gT3BlbiBzZXEgcGFuZWxcbiAgICAgNi4gU2hvdyBwcm9jZXNzaW5nIGFuaW1hdGlvblxuICAgICA3LiBsaXN0ZW4gZm9yIHJlc3VsdFxuKi9cbmltcG9ydCB7IHZlcmlmeV9hbmRfc2VuZF9mb3JtIH0gZnJvbSAnLi9mb3Jtcy9mb3Jtc19pbmRleC5qcyc7XG5pbXBvcnQgeyBzZW5kX3JlcXVlc3QgfSBmcm9tICcuL3JlcXVlc3RzL3JlcXVlc3RzX2luZGV4LmpzJztcbmltcG9ydCB7IGdldF9wcmV2aW91c19kYXRhIH0gZnJvbSAnLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBkcmF3X2VtcHR5X2Fubm90YXRpb25fcGFuZWwgfSBmcm9tICcuL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuaW1wb3J0IHsgZ2V0VXJsVmFycyB9IGZyb20gJy4vY29tbW9uL2NvbW1vbl9pbmRleC5qcyc7XG5pbXBvcnQgeyBjbGVhcl9zZXR0aW5ncyB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5pbXBvcnQgeyBwcmVwYXJlX2Rvd25sb2Fkc19odG1sIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IGhhbmRsZV9yZXN1bHRzIH0gZnJvbSAnLi9yYWN0aXZlX2hlbHBlcnMvcmFjdGl2ZV9oZWxwZXJzLmpzJztcbmltcG9ydCB7IHNldF9kb3dubG9hZHNfcGFuZWwgfSBmcm9tICcuL3JhY3RpdmVfaGVscGVycy9yYWN0aXZlX2hlbHBlcnMuanMnO1xuaW1wb3J0IHsgc2hvd19wYW5lbCB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5pbXBvcnQgeyBkaXNwbGF5X3N0cnVjdHVyZSB9IGZyb20gJy4vcmFjdGl2ZV9oZWxwZXJzL3JhY3RpdmVfaGVscGVycy5qcyc7XG5cbnZhciBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCcuY29weUJ1dHRvbicpO1xudmFyIHppcCA9IG5ldyBKU1ppcCgpO1xuXG5jbGlwYm9hcmQub24oJ3N1Y2Nlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcbmNsaXBib2FyZC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG59KTtcblxuLy8gU0VUIEVORFBPSU5UUyBGT1IgREVWLCBTVEFHSU5HIE9SIFBST0RcbmxldCBlbmRwb2ludHNfdXJsID0gbnVsbDtcbmxldCBzdWJtaXRfdXJsID0gbnVsbDtcbmxldCB0aW1lc191cmwgPSBudWxsO1xubGV0IGdlYXJzX3N2ZyA9IFwiaHR0cDovL2Jpb2luZi5jcy51Y2wuYWMudWsvcHNpcHJlZF9iZXRhL3N0YXRpYy9pbWFnZXMvZ2VhcnMuc3ZnXCI7XG5sZXQgbWFpbl91cmwgPSBcImh0dHA6Ly9iaW9pbmYuY3MudWNsLmFjLnVrXCI7XG5sZXQgYXBwX3BhdGggPSBcIi9wc2lwcmVkX2JldGFcIjtcbmxldCBmaWxlX3VybCA9ICcnO1xubGV0IGdlYXJfc3RyaW5nID0gJzxvYmplY3Qgd2lkdGg9XCIxNDBcIiBoZWlnaHQ9XCIxNDBcIiB0eXBlPVwiaW1hZ2Uvc3ZnK3htbFwiIGRhdGE9XCInK2dlYXJzX3N2ZysnXCI+PC9vYmplY3Q+JztcbmxldCBqb2JfbGlzdCA9IFtcInBzaXByZWRcIiwgXCJwZ2VudGhyZWFkZXJcIiwgXCJtZXRhcHNpY292XCIsIFwiZGlzb3ByZWRcIiwgXCJtZW1wYWNrXCIsXG4gICAgICAgICAgICAgICAgXCJtZW1zYXRzdm1cIiwgXCJnZW50aHJlYWRlclwiLCBcImRvbXByZWRcIiwgXCJwZG9tdGhyZWFkZXJcIiwgXCJiaW9zZXJmXCIsXG4gICAgICAgICAgICAgICAgXCJkb21zZXJmXCIsIFwiZmZwcmVkXCIsIFwibWV0c2l0ZVwiLCBcImhzcHJlZFwiLCBcIm1lbWVtYmVkXCIsIFwiZ2VudGRiXCJdO1xubGV0IGpvYl9uYW1lcyA9IHtcbiAgJ3BzaXByZWQnOiAnUFNJUFJFRCBWNC4wJyxcbiAgJ2Rpc29wcmVkJzogJ0RJT1NQUkVEIDMnLFxuICAnbWVtc2F0c3ZtJzogJ01FTVNBVC1TVk0nLFxuICAncGdlbnRocmVhZGVyJzogJ3BHZW5USFJFQURFUicsXG4gICdtZW1wYWNrJzogJ01FTVBBQ0snLFxuICAnZ2VudGhyZWFkZXInOiAnR2VuVEhSRUFERVInLFxuICAnZG9tcHJlZCc6ICdEb21QcmVkJyxcbiAgJ3Bkb210aHJlYWRlcic6ICdwRG9tVEhSRUFERVInLFxuICAnYmlvc2VyZic6ICdCaW9zU2VyZiB2Mi4wJyxcbiAgJ2RvbXNlcmYnOiAnRG9tU2VyZiB2Mi4xJyxcbiAgJ2ZmcHJlZCc6ICdGRlByZWQgMycsXG4gICdtZXRhcHNpY292JzogJ01ldGFQU0lDT1YnLFxuICAnbWV0c2l0ZSc6ICdNZXRTaXRlJyxcbiAgJ2hzcHJlZCc6ICdIU1ByZWQnLFxuICAnbWVtZW1iZWQnOiAnTUVNRU1CRUQnLFxuICAnZ2VudGRiJzogJ0dlbmVyYXRlIFREQicsXG59O1xuXG5pZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCIxMjcuMC4wLjFcIiB8fCBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIilcbntcbiAgZW5kcG9pbnRzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9lbmRwb2ludHMvJztcbiAgc3VibWl0X3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9zdWJtaXNzaW9uLyc7XG4gIHRpbWVzX3VybCA9ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAvYW5hbHl0aWNzX2F1dG9tYXRlZC9qb2J0aW1lcy8nO1xuICBhcHBfcGF0aCA9ICcvaW50ZXJmYWNlJztcbiAgbWFpbl91cmwgPSAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJztcbiAgZ2VhcnNfc3ZnID0gXCIuLi9zdGF0aWMvaW1hZ2VzL2dlYXJzLnN2Z1wiO1xuICBmaWxlX3VybCA9IG1haW5fdXJsO1xufVxuZWxzZSBpZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJiaW9pbmZzdGFnZTEuY3MudWNsLmFjLnVrXCIgfHwgbG9jYXRpb24uaG9zdG5hbWUgID09PSBcImJpb2luZi5jcy51Y2wuYWMudWtcIiB8fCBsb2NhdGlvbi5ocmVmICA9PT0gXCJodHRwOi8vYmlvaW5mLmNzLnVjbC5hYy51ay9wc2lwcmVkX2JldGEvXCIpIHtcbiAgZW5kcG9pbnRzX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoKycvYXBpL2VuZHBvaW50cy8nO1xuICBzdWJtaXRfdXJsID0gbWFpbl91cmwrYXBwX3BhdGgrJy9hcGkvc3VibWlzc2lvbi8nO1xuICB0aW1lc191cmwgPSBtYWluX3VybCthcHBfcGF0aCsnL2FwaS9qb2J0aW1lcy8nO1xuICBmaWxlX3VybCA9IG1haW5fdXJsK2FwcF9wYXRoK1wiL2FwaVwiO1xuICAvL2dlYXJzX3N2ZyA9IFwiLi4vc3RhdGljL2ltYWdlcy9nZWFycy5zdmdcIjtcbn1cbmVsc2Uge1xuICBhbGVydCgnVU5TRVRUSU5HIEVORFBPSU5UUyBXQVJOSU5HLCBXQVJOSU5HIScpO1xuICBlbmRwb2ludHNfdXJsID0gJyc7XG4gIHN1Ym1pdF91cmwgPSAnJztcbiAgdGltZXNfdXJsID0gJyc7XG59XG5cbmxldCBpbml0aWFsaXNhdGlvbl9kYXRhID0ge1xuICAgIHNlcXVlbmNlX2Zvcm1fdmlzaWJsZTogMSxcbiAgICBzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlOiAwLFxuICAgIHJlc3VsdHNfdmlzaWJsZTogMSxcbiAgICByZXN1bHRzX3BhbmVsX3Zpc2libGU6IDEsXG4gICAgc3VibWlzc2lvbl93aWRnZXRfdmlzaWJsZTogMCxcbiAgICBtb2RlbGxlcl9rZXk6IG51bGwsXG4gICAgZG93bmxvYWRfbGlua3M6ICcnLFxuXG4gICAgcHNpcHJlZF9ob3JpejogbnVsbCxcbiAgICBkaXNvX3ByZWNpc2lvbjogbnVsbCxcbiAgICBtZW1zYXRzdm1fc2NoZW1hdGljOiAnJyxcbiAgICBtZW1zYXRzdm1fY2FydG9vbjogJycsXG4gICAgcGdlbl90YWJsZTogbnVsbCxcbiAgICBwZ2VuX2Fubl9zZXQ6IHt9LFxuICAgIG1lbXNhdHBhY2tfc2NoZW1hdGljOiAnJyxcbiAgICBtZW1zYXRwYWNrX2NhcnRvb246ICcnLFxuICAgIGdlbl90YWJsZTogbnVsbCxcbiAgICBnZW5fYW5uX3NldDoge30sXG4gICAgcGFyc2Vkc19pbmZvOiBudWxsLFxuICAgIHBhcnNlZHNfcG5nOiBudWxsLFxuICAgIGRnZW5fdGFibGU6IG51bGwsXG4gICAgZGdlbl9hbm5fc2V0OiB7fSxcbiAgICBiaW9zZXJmX21vZGVsOiBudWxsLFxuICAgIGRvbXNlcmZfYnV0dG9uczogJycsXG4gICAgZG9tc2VyZl9tb2RlbF91cmlzOiBbXSxcbiAgICBmZnByZWRfY2FydG9vbjogbnVsbCxcbiAgICBzY2hfc2NoZW1hdGljOiBudWxsLFxuICAgIGFhX2NvbXBvc2l0aW9uOiBudWxsLFxuICAgIGdsb2JhbF9mZWF0dXJlczogbnVsbCxcbiAgICBmdW5jdGlvbl90YWJsZXM6IG51bGwsXG5cbiAgICBtZXRhcHNpY292X2RhdGE6IG51bGwsXG4gICAgbWV0c2l0ZV9kYXRhOiBudWxsLFxuICAgIGhzcHJlZF9kYXRhOiBudWxsLFxuICAgIG1lbWVtYmVkX2RhdGE6IG51bGwsXG4gICAgZ2VudGRiX2RhdGE6IG51bGwsXG5cbiAgICAvLyBTZXF1ZW5jZSBhbmQgam9iIGluZm9cbiAgICBzZXF1ZW5jZTogJycsXG4gICAgc2VxdWVuY2VfbGVuZ3RoOiAxLFxuICAgIHN1YnNlcXVlbmNlX3N0YXJ0OiAxLFxuICAgIHN1YnNlcXVlbmNlX3N0b3A6IDEsXG4gICAgZW1haWw6ICcnLFxuICAgIG5hbWU6ICcnLFxuICAgIGJhdGNoX3V1aWQ6IG51bGwsXG4gICAgLy9ob2xkIGFubm90YXRpb25zIHRoYXQgYXJlIHJlYWQgZnJvbSBkYXRhZmlsZXNcbiAgICBhbm5vdGF0aW9uczogbnVsbCxcbn07XG5qb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX2NoZWNrZWQnXSA9IGZhbHNlO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfYnV0dG9uJ10gPSBmYWxzZTtcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX2pvYiddID0gam9iX25hbWUrJ19qb2InO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfd2FpdGluZ19tZXNzYWdlJ10gPSAnPGgyPlBsZWFzZSB3YWl0IGZvciB5b3VyICcram9iX25hbWVzW2pvYl9uYW1lXSsnIGpvYiB0byBwcm9jZXNzPC9oMj4nO1xuICBpbml0aWFsaXNhdGlvbl9kYXRhW2pvYl9uYW1lKydfd2FpdGluZ19pY29uJ10gPSBnZWFyX3N0cmluZztcbiAgaW5pdGlhbGlzYXRpb25fZGF0YVtqb2JfbmFtZSsnX3dhaXRpbmdfdGltZSddID0gJ0xvYWRpbmcgRGF0YSc7XG59KTtcbmluaXRpYWxpc2F0aW9uX2RhdGEuZmZwcmVkX2NoZWNrZWQgPSB0cnVlO1xuLy8gREVDTEFSRSBWQVJJQUJMRVMgYW5kIGluaXQgcmFjdGl2ZSBpbnN0YW5jZVxudmFyIHJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XG4gIGVsOiAnI3BzaXByZWRfc2l0ZScsXG4gIHRlbXBsYXRlOiAnI2Zvcm1fdGVtcGxhdGUnLFxuICBkYXRhOiBpbml0aWFsaXNhdGlvbl9kYXRhLFxufSk7XG5cbi8vc2V0IHNvbWUgdGhpbmdzIG9uIHRoZSBwYWdlIGZvciB0aGUgZGV2ZWxvcG1lbnQgc2VydmVyXG5pZihsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCIxMjcuMC4wLjFcIikge1xuICByYWN0aXZlLnNldCgnZW1haWwnLCAnZGFuaWVsLmJ1Y2hhbkB1Y2wuYWMudWsnKTtcbiAgcmFjdGl2ZS5zZXQoJ25hbWUnLCAndGVzdCcpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2UnLCAnUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVNEUVdFQVMnKTtcbn1cblxuLy80YjZhZDc5Mi1lZDFmLTExZTUtODk4Ni05ODkwOTZjMTNlZTZcbmxldCB1dWlkX3JlZ2V4ID0gL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfSQvaTtcbmxldCB1dWlkX21hdGNoID0gdXVpZF9yZWdleC5leGVjKGdldFVybFZhcnMoKS51dWlkKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9cbi8vXG4vLyBBUFBMSUNBVElPTiBIRVJFXG4vL1xuLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9IZXJlIHdlcmUga2VlcCBhbiBleWUgb24gc29tZSBmb3JtIGVsZW1lbnRzIGFuZCByZXdyaXRlIHRoZSBuYW1lIGlmIHBlb3BsZVxuLy9oYXZlIHByb3ZpZGVkIGEgZmFzdGEgZm9ybWF0dGVkIHNlcVxubGV0IHNlcV9vYnNlcnZlciA9IHJhY3RpdmUub2JzZXJ2ZSgnc2VxdWVuY2UnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7XG4gIGxldCByZWdleCA9IC9ePiguKz8pXFxzLztcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhuZXdWYWx1ZSk7XG4gIGlmKG1hdGNoKVxuICB7XG4gICAgdGhpcy5zZXQoJ25hbWUnLCBtYXRjaFsxXSk7XG4gIH1cbiAgLy8gZWxzZSB7XG4gIC8vICAgdGhpcy5zZXQoJ25hbWUnLCBudWxsKTtcbiAgLy8gfVxuXG4gIH0sXG4gIHtpbml0OiBmYWxzZSxcbiAgIGRlZmVyOiB0cnVlXG4gfSk7XG4vL3RoZXNlcyB0d28gb2JzZXJ2ZXJzIHN0b3AgcGVvcGxlIHNldHRpbmcgdGhlIHJlc3VibWlzc2lvbiB3aWRnZXQgb3V0IG9mIGJvdW5kc1xucmFjdGl2ZS5vYnNlcnZlKCAnc3Vic2VxdWVuY2Vfc3RvcCcsIGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIGxldCBzZXFfbGVuZ3RoID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlX2xlbmd0aCcpO1xuICBsZXQgc2VxX3N0YXJ0ID0gcmFjdGl2ZS5nZXQoJ3N1YnNlcXVlbmNlX3N0YXJ0Jyk7XG4gIGlmKHZhbHVlID4gc2VxX2xlbmd0aClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxX2xlbmd0aCk7XG4gIH1cbiAgaWYodmFsdWUgPD0gc2VxX3N0YXJ0KVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXFfc3RhcnQrMSk7XG4gIH1cbn0pO1xucmFjdGl2ZS5vYnNlcnZlKCAnc3Vic2VxdWVuY2Vfc3RhcnQnLCBmdW5jdGlvbiAoIHZhbHVlICkge1xuICBsZXQgc2VxX3N0b3AgPSByYWN0aXZlLmdldCgnc3Vic2VxdWVuY2Vfc3RvcCcpO1xuICBpZih2YWx1ZSA8IDEpXG4gIHtcbiAgICByYWN0aXZlLnNldCgnc3Vic2VxdWVuY2Vfc3RhcnQnLCAxKTtcbiAgfVxuICBpZih2YWx1ZSA+PSBzZXFfc3RvcClcbiAge1xuICAgIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdGFydCcsIHNlcV9zdG9wLTEpO1xuICB9XG59KTtcblxuLy9BZnRlciBhIGpvYiBoYXMgYmVlbiBzZW50IG9yIGEgVVJMIGFjY2VwdGVkIHRoaXMgcmFjdGl2ZSBibG9jayBpcyBjYWxsZWQgdG9cbi8vcG9sbCB0aGUgYmFja2VuZCB0byBnZXQgdGhlIHJlc3VsdHNcbnJhY3RpdmUub24oJ3BvbGxfdHJpZ2dlcicsIGZ1bmN0aW9uKG5hbWUsIGpvYl90eXBlKXtcbiAgY29uc29sZS5sb2coXCJQb2xsaW5nIGJhY2tlbmQgZm9yIHJlc3VsdHNcIik7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsICsgcmFjdGl2ZS5nZXQoJ2JhdGNoX3V1aWQnKTtcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgJycsIGFwcF9wYXRoKycvJnV1aWQ9JytyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpKTtcbiAgZHJhd19lbXB0eV9hbm5vdGF0aW9uX3BhbmVsKHJhY3RpdmUpO1xuXG4gIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgbGV0IGJhdGNoID0gc2VuZF9yZXF1ZXN0KHVybCwgXCJHRVRcIiwge30pO1xuICAgIGxldCBkb3dubG9hZHNfaW5mbyA9IHt9O1xuXG4gICAgaWYoYmF0Y2guc3RhdGUgPT09ICdDb21wbGV0ZScpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coXCJSZW5kZXIgcmVzdWx0c1wiKTtcbiAgICAgIGxldCBzdWJtaXNzaW9ucyA9IGJhdGNoLnN1Ym1pc3Npb25zO1xuICAgICAgc3VibWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICBwcmVwYXJlX2Rvd25sb2Fkc19odG1sKGRhdGEsIGRvd25sb2Fkc19pbmZvLCBqb2JfbGlzdCwgam9iX25hbWVzKTtcbiAgICAgICAgICBoYW5kbGVfcmVzdWx0cyhyYWN0aXZlLCBkYXRhLCBmaWxlX3VybCwgemlwLCBkb3dubG9hZHNfaW5mbywgam9iX25hbWVzKTtcblxuICAgICAgfSk7XG4gICAgICBzZXRfZG93bmxvYWRzX3BhbmVsKHJhY3RpdmUsIGRvd25sb2Fkc19pbmZvKTtcblxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICAgIGlmKGJhdGNoLnN0YXRlID09PSAnRXJyb3InIHx8IGJhdGNoLnN0YXRlID09PSAnQ3Jhc2gnKVxuICAgIHtcbiAgICAgIGxldCBzdWJtaXNzaW9uX21lc3NhZ2UgPSBiYXRjaC5zdWJtaXNzaW9uc1swXS5sYXN0X21lc3NhZ2U7XG4gICAgICBhbGVydChcIlBPTExJTkcgRVJST1I6IEpvYiBGYWlsZWRcXG5cIitcbiAgICAgICAgICAgIFwiUGxlYXNlIENvbnRhY3QgcHNpcHJlZEBjcy51Y2wuYWMudWsgcXVvdGluZyB0aGlzIGVycm9yIG1lc3NhZ2UgYW5kIHlvdXIgam9iIElEXFxuXCIrc3VibWlzc2lvbl9tZXNzYWdlKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuICB9LCA1MDAwKTtcblxufSx7aW5pdDogZmFsc2UsXG4gICBkZWZlcjogdHJ1ZVxuIH1cbik7XG5cbi8vIE9uIGNsaWNraW5nIHRoZSBHZXQgWmlwIGZpbGUgbGluayB0aGlzIHdhdGNoZXJzIHByZXBhcmVzIHRoZSB6aXAgYW5kIGhhbmRzIGl0IHRvIHRoZSB1c2VyXG5yYWN0aXZlLm9uKCdnZXRfemlwJywgZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBsZXQgdXVpZCA9IHJhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gICAgemlwLmdlbmVyYXRlQXN5bmMoe3R5cGU6XCJibG9iXCJ9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XG4gICAgICAgIHNhdmVBcyhibG9iLCB1dWlkK1wiLnppcFwiKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGVzZSByZWFjdCB0byB0aGUgaGVhZGVycyBiZWluZyBjbGlja2VkIHRvIHRvZ2dsZSB0aGUgcGFuZWxcbi8vXG5yYWN0aXZlLm9uKCAnc2VxdWVuY2VfYWN0aXZlJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgcmFjdGl2ZS5zZXQoICdzdHJ1Y3R1cmVfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCAwICk7XG4gIGpvYl9saXN0LmZvckVhY2goZnVuY3Rpb24oam9iX25hbWUpe1xuICAgICAgbGV0IHNldHRpbmcgPSBmYWxzZTtcbiAgICAgIGlmKGpvYl9uYW1lID09PSAncHNpcHJlZCcpe3NldHRpbmcgPSB0cnVlO31cbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBzZXR0aW5nKTtcbiAgfSk7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnc3RydWN0dXJlX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHJhY3RpdmUuc2V0KCAnc2VxdWVuY2VfZm9ybV92aXNpYmxlJywgbnVsbCApO1xuICByYWN0aXZlLnNldCggJ3NlcXVlbmNlX2Zvcm1fdmlzaWJsZScsIDAgKTtcbiAgICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICAgIHJhY3RpdmUuc2V0KCBqb2JfbmFtZSsnX2NoZWNrZWQnLCBmYWxzZSk7XG4gIH0pO1xuICByYWN0aXZlLnNldCggJ3N0cnVjdHVyZV9mb3JtX3Zpc2libGUnLCBudWxsICk7XG4gIHJhY3RpdmUuc2V0KCAnc3RydWN0dXJlX2Zvcm1fdmlzaWJsZScsIDEgKTtcbn0pO1xuXG5yYWN0aXZlLm9uKCAnZG93bmxvYWRzX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIHNob3dfcGFuZWwoMSwgcmFjdGl2ZSk7XG59KTtcblxuLy9yZWdpc3RlciBsaXN0ZW5lcnMgZm9yIGVhY2ggcmVzdWx0cyBwYW5lbFxuam9iX2xpc3QuZm9yRWFjaChmdW5jdGlvbihqb2JfbmFtZSwgaSl7XG4gIGNvbnNvbGUubG9nKFwiYWRkaW5nIGpvYnMgd2F0Y2hlcnNcIik7XG4gIHJhY3RpdmUub24oam9iX25hbWUrJ19hY3RpdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcbiAgICBzaG93X3BhbmVsKGkrMiwgcmFjdGl2ZSk7XG4gICAgaWYoam9iX25hbWUgPT09IFwicHNpcHJlZFwiKVxuICAgIHtcbiAgICAgIGlmKHJhY3RpdmUuZ2V0KCdwc2lwcmVkX2hvcml6JykpXG4gICAgICB7XG4gICAgICAgIGJpb2QzLnBzaXByZWQocmFjdGl2ZS5nZXQoJ3BzaXByZWRfaG9yaXonKSwgJ3BzaXByZWRDaGFydCcsIHtwYXJlbnQ6ICdkaXYucHNpcHJlZF9jYXJ0b29uJywgbWFyZ2luX3NjYWxlcjogMn0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZihqb2JfbmFtZSA9PT0gXCJkaXNvcHJlZFwiKVxuICAgIHtcbiAgICAgIGlmKHJhY3RpdmUuZ2V0KCdkaXNvX3ByZWNpc2lvbicpKVxuICAgICAge1xuICAgICAgICBiaW9kMy5nZW5lcmljeHlMaW5lQ2hhcnQocmFjdGl2ZS5nZXQoJ2Rpc29fcHJlY2lzaW9uJyksICdwb3MnLCBbJ3ByZWNpc2lvbiddLCBbJ0JsYWNrJyxdLCAnRGlzb05OQ2hhcnQnLCB7cGFyZW50OiAnZGl2LmNvbWJfcGxvdCcsIGNoYXJ0VHlwZTogJ2xpbmUnLCB5X2N1dG9mZjogMC41LCBtYXJnaW5fc2NhbGVyOiAyLCBkZWJ1ZzogZmFsc2UsIGNvbnRhaW5lcl93aWR0aDogOTAwLCB3aWR0aDogOTAwLCBoZWlnaHQ6IDMwMCwgY29udGFpbmVyX2hlaWdodDogMzAwfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGpvYl9uYW1lID09PSAnZG9tc2VyZicpXG4gICAge1xuICAgICAgaWYocmFjdGl2ZS5nZXQoJ2RvbXNlcmZfbW9kZWxfdXJpcycpLmxlbmd0aClcbiAgICAgIHtcbiAgICAgICAgbGV0IHBhdGhzID0gcmFjdGl2ZS5nZXQoJ2RvbXNlcmZfbW9kZWxfdXJpcycpO1xuICAgICAgICBkaXNwbGF5X3N0cnVjdHVyZShwYXRoc1swXSwgJyNkb21zZXJmX21vZGVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxufSk7XG5cbnJhY3RpdmUub24oICdzdWJtaXNzaW9uX2FjdGl2ZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG4gIGxldCBzdGF0ZSA9IHJhY3RpdmUuZ2V0KCdzdWJtaXNzaW9uX3dpZGdldF92aXNpYmxlJyk7XG4gIGlmKHN0YXRlID09PSAxKXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAwICk7XG4gIH1cbiAgZWxzZXtcbiAgICByYWN0aXZlLnNldCggJ3N1Ym1pc3Npb25fd2lkZ2V0X3Zpc2libGUnLCAxICk7XG4gIH1cbn0pO1xuXG4vL2dyYWIgdGhlIHN1Ym1pdCBldmVudCBmcm9tIHRoZSBtYWluIGZvcm0gYW5kIHNlbmQgdGhlIHNlcXVlbmNlIHRvIHRoZSBiYWNrZW5kXG5yYWN0aXZlLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZygnU3VibWl0dGluZyBkYXRhJyk7XG4gIGxldCBzZXEgPSB0aGlzLmdldCgnc2VxdWVuY2UnKTtcbiAgc2VxID0gc2VxLnJlcGxhY2UoL14+LiskL21nLCBcIlwiKS50b1VwcGVyQ2FzZSgpO1xuICBzZXEgPSBzZXEucmVwbGFjZSgvXFxufFxccy9nLFwiXCIpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzdWJzZXF1ZW5jZV9zdG9wJywgc2VxLmxlbmd0aCk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZScsIHNlcSk7XG5cbiAgbGV0IG5hbWUgPSB0aGlzLmdldCgnbmFtZScpO1xuICBsZXQgZW1haWwgPSB0aGlzLmdldCgnZW1haWwnKTtcbiAgbGV0IGNoZWNrX3N0YXRlcyA9IHt9O1xuICBqb2JfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGpvYl9uYW1lKXtcbiAgICBjaGVja19zdGF0ZXNbam9iX25hbWUrJ19qb2InXSA9IHJhY3RpdmUuZ2V0KGpvYl9uYW1lKydfam9iJyk7XG4gICAgY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID0gcmFjdGl2ZS5nZXQoam9iX25hbWUrJ19jaGVja2VkJyk7XG4gIH0pO1xuICB2ZXJpZnlfYW5kX3NlbmRfZm9ybShyYWN0aXZlLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIGNoZWNrX3N0YXRlcywgam9iX2xpc3QsIGpvYl9uYW1lcyk7XG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gZ3JhYiB0aGUgc3VibWl0IGV2ZW50IGZyb20gdGhlIFJlc3VibWlzc2lvbiB3aWRnZXQsIHRydW5jYXRlIHRoZSBzZXF1ZW5jZVxuLy8gYW5kIHNlbmQgYSBuZXcgam9iXG5yYWN0aXZlLm9uKCdyZXN1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKCdSZXN1Ym1pdHRpbmcgc2VnbWVudCcpO1xuICBsZXQgc3RhcnQgPSByYWN0aXZlLmdldChcInN1YnNlcXVlbmNlX3N0YXJ0XCIpO1xuICBsZXQgc3RvcCA9IHJhY3RpdmUuZ2V0KFwic3Vic2VxdWVuY2Vfc3RvcFwiKTtcbiAgbGV0IHNlcXVlbmNlID0gcmFjdGl2ZS5nZXQoXCJzZXF1ZW5jZVwiKTtcbiAgbGV0IHN1YnNlcXVlbmNlID0gc2VxdWVuY2Uuc3Vic3RyaW5nKHN0YXJ0LTEsIHN0b3ApO1xuICBsZXQgbmFtZSA9IHRoaXMuZ2V0KCduYW1lJykrXCJfc2VnXCI7XG4gIGxldCBlbWFpbCA9IHRoaXMuZ2V0KCdlbWFpbCcpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2VfbGVuZ3RoJywgc3Vic2VxdWVuY2UubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzdWJzZXF1ZW5jZS5sZW5ndGgpO1xuICByYWN0aXZlLnNldCgnc2VxdWVuY2UnLCBzdWJzZXF1ZW5jZSk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJywgbmFtZSk7XG4gIGxldCBjaGVja19zdGF0ZXMgPSB7fTtcbiAgam9iX2xpc3QuZm9yRWFjaChmdW5jdGlvbihqb2JfbmFtZSl7XG4gICAgY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfam9iJ10gPSByYWN0aXZlLmdldChqb2JfbmFtZSsnX2pvYicpO1xuICAgIGNoZWNrX3N0YXRlc1tqb2JfbmFtZSsnX2NoZWNrZWQnXSA9IHJhY3RpdmUuZ2V0KGpvYl9uYW1lKydfY2hlY2tlZCcpO1xuICB9KTtcbiAgLy9jbGVhciB3aGF0IHdlIGhhdmUgcHJldmlvdXNseSB3cml0dGVuXG4gIGNsZWFyX3NldHRpbmdzKHJhY3RpdmUsIGdlYXJfc3RyaW5nLCBqb2JfbGlzdCwgam9iX25hbWVzKTtcbiAgLy92ZXJpZnkgZm9ybSBjb250ZW50cyBhbmQgcG9zdFxuICAvL2NvbnNvbGUubG9nKG5hbWUpO1xuICAvL2NvbnNvbGUubG9nKGVtYWlsKTtcbiAgdmVyaWZ5X2FuZF9zZW5kX2Zvcm0ocmFjdGl2ZSwgc3Vic2VxdWVuY2UsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIGNoZWNrX3N0YXRlcywgam9iX2xpc3QsIGpvYl9uYW1lcyk7XG4gIC8vd3JpdGUgbmV3IGFubm90YXRpb24gZGlhZ3JhbVxuICAvL3N1Ym1pdCBzdWJzZWN0aW9uXG4gIGV2ZW50Lm9yaWdpbmFsLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gSGVyZSBoYXZpbmcgc2V0IHVwIHJhY3RpdmUgYW5kIHRoZSBmdW5jdGlvbnMgd2UgbmVlZCB3ZSB0aGVuIGNoZWNrXG4vLyBpZiB3ZSB3ZXJlIHByb3ZpZGVkIGEgVVVJRCwgSWYgdGhlIHBhZ2UgaXMgbG9hZGVkIHdpdGggYSBVVUlEIHJhdGhlciB0aGFuIGFcbi8vIGZvcm0gc3VibWl0LlxuLy9UT0RPOiBIYW5kbGUgbG9hZGluZyB0aGF0IHBhZ2Ugd2l0aCB1c2UgdGhlIE1FTVNBVCBhbmQgRElTT1BSRUQgVVVJRFxuLy9cbmlmKGdldFVybFZhcnMoKS51dWlkICYmIHV1aWRfbWF0Y2gpXG57XG4gIGNvbnNvbGUubG9nKCdDYXVnaHQgYW4gaW5jb21pbmcgVVVJRCcpO1xuICBzZXFfb2JzZXJ2ZXIuY2FuY2VsKCk7XG4gIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3Zpc2libGUnLCBudWxsICk7IC8vIHNob3VsZCBtYWtlIGEgZ2VuZXJpYyBvbmUgdmlzaWJsZSB1bnRpbCByZXN1bHRzIGFycml2ZS5cbiAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfdmlzaWJsZScsIDIgKTtcbiAgcmFjdGl2ZS5zZXQoXCJiYXRjaF91dWlkXCIsIGdldFVybFZhcnMoKS51dWlkKTtcbiAgbGV0IHByZXZpb3VzX2RhdGEgPSBnZXRfcHJldmlvdXNfZGF0YShnZXRVcmxWYXJzKCkudXVpZCwgc3VibWl0X3VybCwgZmlsZV91cmwsIHJhY3RpdmUpO1xuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3BzaXByZWQnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDIpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygncGdlbnRocmVhZGVyJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDMpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWV0YXBzaWNvdicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWV0YXBzaWNvdl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgNCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdkaXNvcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZGlzb3ByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDUpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnbWVtcGFjaycpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdtZW1wYWNrX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA2KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21lbXNhdHN2bScpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA3KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2dlbnRocmVhZGVyJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdnZW50aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgOCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdkb21wcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdkb21wcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCA5KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ3Bkb210aHJlYWRlcicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgncHNpcHJlZF9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncGRvbXRocmVhZGVyX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxMCk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdiaW9zZXJmJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdwZ2VudGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ2Jpb3NlcmZfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDExKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2RvbXNlcmYnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ3BzaXByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Bkb210aHJlYWRlcl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgnZG9tc2VyZl9idXR0b24nLCB0cnVlICk7XG4gICAgICByYWN0aXZlLnNldCgncmVzdWx0c19wYW5lbF92aXNpYmxlJywgMTIpO1xuICB9XG4gIGlmKHByZXZpb3VzX2RhdGEuam9icy5pbmNsdWRlcygnZmZwcmVkJykpXG4gIHtcbiAgICAgIHJhY3RpdmUuc2V0KCdmZnByZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDEzKTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ21ldHNpdGUnKSlcbiAge1xuICAgICAgcmFjdGl2ZS5zZXQoJ21ldHNpdGVfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE0KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2hzcHJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnaHNwcmVkX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxNSk7XG4gIH1cbiAgaWYocHJldmlvdXNfZGF0YS5qb2JzLmluY2x1ZGVzKCdtZW1lbWJlZCcpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnbWVtZW1iZWRfYnV0dG9uJywgdHJ1ZSApO1xuICAgICAgcmFjdGl2ZS5zZXQoJ3Jlc3VsdHNfcGFuZWxfdmlzaWJsZScsIDE2KTtcbiAgfVxuICBpZihwcmV2aW91c19kYXRhLmpvYnMuaW5jbHVkZXMoJ2dlbnRkYicpKVxuICB7XG4gICAgICByYWN0aXZlLnNldCgnZ2VudGRiX2J1dHRvbicsIHRydWUgKTtcbiAgICAgIHJhY3RpdmUuc2V0KCdyZXN1bHRzX3BhbmVsX3Zpc2libGUnLCAxNyk7XG4gIH1cbiAgcmFjdGl2ZS5zZXQoJ3NlcXVlbmNlJyxwcmV2aW91c19kYXRhLnNlcSk7XG4gIHJhY3RpdmUuc2V0KCdlbWFpbCcscHJldmlvdXNfZGF0YS5lbWFpbCk7XG4gIHJhY3RpdmUuc2V0KCduYW1lJyxwcmV2aW91c19kYXRhLm5hbWUpO1xuICBsZXQgc2VxID0gcmFjdGl2ZS5nZXQoJ3NlcXVlbmNlJyk7XG4gIHJhY3RpdmUuc2V0KCdzZXF1ZW5jZV9sZW5ndGgnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5zZXQoJ3N1YnNlcXVlbmNlX3N0b3AnLCBzZXEubGVuZ3RoKTtcbiAgcmFjdGl2ZS5maXJlKCdwb2xsX3RyaWdnZXInLCAncHNpcHJlZCcpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gTmV3IFBhbm5lbCBmdW5jdGlvbnNcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gbG9hZE5ld0FsaWdubWVudChhbG5VUkksYW5uVVJJLHRpdGxlKSB7XG4gIGxldCB1cmwgPSBzdWJtaXRfdXJsK3JhY3RpdmUuZ2V0KCdiYXRjaF91dWlkJyk7XG4gIHdpbmRvdy5vcGVuKFwiLi5cIithcHBfcGF0aCtcIi9tc2EvP2Fubj1cIitmaWxlX3VybCthbm5VUkkrXCImYWxuPVwiK2ZpbGVfdXJsK2FsblVSSSwgXCJcIiwgXCJ3aWR0aD04MDAsaGVpZ2h0PTQwMFwiKTtcbn1cblxuLy9SZWxvYWQgYWxpZ25tZW50cyBmb3IgSmFsVmlldyBmb3IgdGhlIGdlblRIUkVBREVSIHRhYmxlXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb2RlbChhbG5VUkksIHR5cGUpIHtcblxuICBsZXQgdXJsID0gc3VibWl0X3VybCtyYWN0aXZlLmdldCgnYmF0Y2hfdXVpZCcpO1xuICBsZXQgbW9kX2tleSA9IHJhY3RpdmUuZ2V0KCdtb2RlbGxlcl9rZXknKTtcbiAgaWYobW9kX2tleSA9PT0gJ00nKydPJysnRCcrJ0UnKydMJysnSScrJ1InKydBJysnTicrJ0onKydFJylcbiAge1xuICAgIC8vYWxlcnQodHlwZSk7XG4gICAgd2luZG93Lm9wZW4oXCIuLlwiK2FwcF9wYXRoK1wiL21vZGVsL3Bvc3Q/dHlwZT1cIit0eXBlK1wiJmFsbj1cIitmaWxlX3VybCthbG5VUkksIFwiXCIsIFwid2lkdGg9NjcwLGhlaWdodD03MDBcIik7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgYWxlcnQoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgTScrJ08nKydEJysnRScrJ0wnKydMJysnRScrJ1IgTGljZW5jZSBLZXknKTtcbiAgfVxufVxuXG4vLyBTd2FwcyBvdXQgdGhlIGRvbXNlcmYgbW9kZWwgd2hlbiB0aG9zZSBidXR0b25zIGFyZSBjbGlja2VkXG5leHBvcnQgZnVuY3Rpb24gc3dhcERvbXNlcmYodXJpX251bWJlcilcbntcbiAgdXJpX251bWJlciA9IHVyaV9udW1iZXItMTtcbiAgbGV0IHBhdGhzID0gcmFjdGl2ZS5nZXQoXCJkb21zZXJmX21vZGVsX3VyaXNcIik7XG4gIGRpc3BsYXlfc3RydWN0dXJlKHBhdGhzW3VyaV9udW1iZXJdLCAnI2RvbXNlcmZfbW9kZWwnKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9tYWluLmpzIiwiaW1wb3J0IHsgc2VuZF9qb2IgfSBmcm9tICcuLi9yZXF1ZXN0cy9yZXF1ZXN0c19pbmRleC5qcyc7XG5pbXBvcnQgeyBpc0luQXJyYXkgfSBmcm9tICcuLi9jb21tb24vY29tbW9uX2luZGV4LmpzJztcbmltcG9ydCB7IGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbCB9IGZyb20gJy4uL2NvbW1vbi9jb21tb25faW5kZXguanMnO1xuXG4vL1Rha2VzIHRoZSBkYXRhIG5lZWRlZCB0byB2ZXJpZnkgdGhlIGlucHV0IGZvcm0gZGF0YSwgZWl0aGVyIHRoZSBtYWluIGZvcm1cbi8vb3IgdGhlIHN1Ym1pc3NvbiB3aWRnZXQgdmVyaWZpZXMgdGhhdCBkYXRhIGFuZCB0aGVuIHBvc3RzIGl0IHRvIHRoZSBiYWNrZW5kLlxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeV9hbmRfc2VuZF9mb3JtKHJhY3RpdmUsIHNlcSwgbmFtZSwgZW1haWwsIHN1Ym1pdF91cmwsIHRpbWVzX3VybCwgY2hlY2tfc3RhdGVzLCBqb2JfbGlzdCwgam9iX25hbWVzKVxue1xuICAvKnZlcmlmeSB0aGF0IGV2ZXJ5dGhpbmcgaGVyZSBpcyBvayovXG4gIGxldCBlcnJvcl9tZXNzYWdlPW51bGw7XG4gIGxldCBqb2Jfc3RyaW5nID0gJyc7XG4gIC8vZXJyb3JfbWVzc2FnZSA9IHZlcmlmeV9mb3JtKHNlcSwgbmFtZSwgZW1haWwsIFtwc2lwcmVkX2NoZWNrZWQsIGRpc29wcmVkX2NoZWNrZWQsIG1lbXNhdHN2bV9jaGVja2VkXSk7XG5cbiAgbGV0IGNoZWNrX2xpc3QgPSBbXTtcbiAgam9iX2xpc3QuZm9yRWFjaChmdW5jdGlvbihqb2JfbmFtZSl7XG4gICAgY2hlY2tfbGlzdC5wdXNoKGNoZWNrX3N0YXRlc1tqb2JfbmFtZSsnX2NoZWNrZWQnXSk7XG4gIH0pO1xuICBlcnJvcl9tZXNzYWdlID0gdmVyaWZ5X2Zvcm0oc2VxLCBuYW1lLCBlbWFpbCwgY2hlY2tfbGlzdCk7XG5cbiAgaWYoZXJyb3JfbWVzc2FnZS5sZW5ndGggPiAwKVxuICB7XG4gICAgcmFjdGl2ZS5zZXQoJ2Zvcm1fZXJyb3InLCBlcnJvcl9tZXNzYWdlKTtcbiAgICBhbGVydChcIkZPUk0gRVJST1I6XCIrZXJyb3JfbWVzc2FnZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9pbml0aWFsaXNlIHRoZSBwYWdlXG4gICAgbGV0IHJlc3BvbnNlID0gdHJ1ZTtcbiAgICByYWN0aXZlLnNldCggJ3Jlc3VsdHNfdmlzaWJsZScsIG51bGwgKTtcbiAgICAvL1Bvc3QgdGhlIGpvYnMgYW5kIGludGlhbGlzZSB0aGUgYW5ub3RhdGlvbnMgZm9yIGVhY2ggam9iXG4gICAgLy9XZSBhbHNvIGRvbid0IHJlZHVuZGFudGx5IHNlbmQgZXh0cmEgcHNpcHJlZCBldGMuLiBqb2JzXG4gICAgLy9ieXQgZG9pbmcgdGhlc2UgdGVzdCBpbiBhIHNwZWNpZmljIG9yZGVyXG4gICAgam9iX2xpc3QuZm9yRWFjaChmdW5jdGlvbihqb2JfbmFtZSl7XG4gICAgICAgIGlmKGNoZWNrX3N0YXRlc1tqb2JfbmFtZSsnX2NoZWNrZWQnXSA9PT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgam9iX3N0cmluZyA9IGpvYl9zdHJpbmcuY29uY2F0KGpvYl9uYW1lK1wiLFwiKTtcbiAgICAgICAgICAgIHJhY3RpdmUuc2V0KGpvYl9uYW1lKydfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICAgICAgICBpZihqb2JfbmFtZSA9PT0gJ3BnZW50aHJlYWRlcicgfHwgam9iX25hbWUgPT09ICdkaXNvcHJlZCcgfHxcbiAgICAgICAgICAgICAgIGpvYl9uYW1lID09PSAnZG9tcHJlZCcgfHwgam9iX25hbWUgPT09ICdwZG9tdGhyZWFkZXInIHx8XG4gICAgICAgICAgICAgICBqb2JfbmFtZSA9PT0gJ2Jpb3NlcmYnIHx8IGpvYl9uYW1lID09PSAnZG9tc2VyZicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KCdwc2lwcmVkX2J1dHRvbicsIHRydWUpO1xuICAgICAgICAgICAgICBjaGVja19zdGF0ZXMucHNpcHJlZF9jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihqb2JfbmFtZSA9PT0gJ2Jpb3NlcmYnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYWN0aXZlLnNldCgncGdlbnRocmVhZGVyX2J1dHRvbicsIHRydWUpO1xuICAgICAgICAgICAgICBjaGVja19zdGF0ZXMucGdlbnRocmVhZGVyX2NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGpvYl9uYW1lID09PSAnZG9tc2VyZicpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhY3RpdmUuc2V0KCdwZG9tdGhyZWFkZXJfYnV0dG9uJywgdHJ1ZSk7XG4gICAgICAgICAgICAgIGNoZWNrX3N0YXRlcy5wZG9tdGhyZWFkZXJfY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoam9iX25hbWUgPT09ICdtZW1wYWNrJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYWN0aXZlLnNldCgnbWVtc2F0c3ZtX2J1dHRvbicsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBqb2Jfc3RyaW5nID0gam9iX3N0cmluZy5zbGljZSgwLCAtMSk7XG4gICAgcmVzcG9uc2UgPSBzZW5kX2pvYihyYWN0aXZlLCBqb2Jfc3RyaW5nLCBzZXEsIG5hbWUsIGVtYWlsLCBzdWJtaXRfdXJsLCB0aW1lc191cmwsIGpvYl9uYW1lcyk7XG4gICAgLy9zZXQgdmlzaWJpbGl0eSBhbmQgcmVuZGVyIHBhbmVsIG9uY2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvYl9saXN0Lmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGxldCBqb2JfbmFtZSA9IGpvYl9saXN0W2ldO1xuICAgICAgaWYoY2hlY2tfc3RhdGVzW2pvYl9uYW1lKydfY2hlY2tlZCddID09PSB0cnVlICYmIHJlc3BvbnNlIClcbiAgICAgIHtcbiAgICAgICAgcmFjdGl2ZS5zZXQoICdyZXN1bHRzX3Zpc2libGUnLCAyICk7XG4gICAgICAgIHJhY3RpdmUuZmlyZSggam9iX25hbWUrJ19hY3RpdmUnICk7XG4gICAgICAgIGRyYXdfZW1wdHlfYW5ub3RhdGlvbl9wYW5lbChyYWN0aXZlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoISByZXNwb25zZSl7d2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjt9XG4gIH1cbn1cblxuLy9UYWtlcyB0aGUgZm9ybSBlbGVtZW50cyBhbmQgY2hlY2tzIHRoZXkgYXJlIHZhbGlkXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X2Zvcm0oc2VxLCBqb2JfbmFtZSwgZW1haWwsIGNoZWNrZWRfYXJyYXkpXG57XG4gIGxldCBlcnJvcl9tZXNzYWdlID0gXCJcIjtcbiAgaWYoISAvXltcXHgwMC1cXHg3Rl0rJC8udGVzdChqb2JfbmFtZSkpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiUGxlYXNlIHJlc3RyaWN0IEpvYiBOYW1lcyB0byB2YWxpZCBsZXR0ZXJzIG51bWJlcnMgYW5kIGJhc2ljIHB1bmN0dWF0aW9uPGJyIC8+XCI7XG4gIH1cblxuICAvKiBsZW5ndGggY2hlY2tzICovXG4gIGlmKHNlcS5sZW5ndGggPiAxNTAwKVxuICB7XG4gICAgZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UgKyBcIllvdXIgc2VxdWVuY2UgaXMgdG9vIGxvbmcgdG8gcHJvY2VzczxiciAvPlwiO1xuICB9XG4gIGlmKHNlcS5sZW5ndGggPCAzMClcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGlzIHRvbyBzaG9ydCB0byBwcm9jZXNzPGJyIC8+XCI7XG4gIH1cblxuICAvKiBudWNsZW90aWRlIGNoZWNrcyAqL1xuICBsZXQgbnVjbGVvdGlkZV9jb3VudCA9IChzZXEubWF0Y2goL0F8VHxDfEd8VXxOfGF8dHxjfGd8dXxuL2cpfHxbXSkubGVuZ3RoO1xuICBpZigobnVjbGVvdGlkZV9jb3VudC9zZXEubGVuZ3RoKSA+IDAuOTUpXG4gIHtcbiAgICBlcnJvcl9tZXNzYWdlID0gZXJyb3JfbWVzc2FnZSArIFwiWW91ciBzZXF1ZW5jZSBhcHBlYXJzIHRvIGJlIG51Y2xlb3RpZGUgc2VxdWVuY2UuIFRoaXMgc2VydmljZSByZXF1aXJlcyBwcm90ZWluIHNlcXVlbmNlIGFzIGlucHV0PGJyIC8+XCI7XG4gIH1cbiAgaWYoL1teQUNERUZHSElLTE1OUFFSU1RWV1lYXy1dKy9pLnRlc3Qoc2VxKSlcbiAge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3VyIHNlcXVlbmNlIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczxiciAvPlwiO1xuICB9XG5cbiAgaWYoaXNJbkFycmF5KHRydWUsIGNoZWNrZWRfYXJyYXkpID09PSBmYWxzZSkge1xuICAgIGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlICsgXCJZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuYWx5c2lzIHByb2dyYW1cIjtcbiAgfVxuICByZXR1cm4oZXJyb3JfbWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvZm9ybXMvZm9ybXNfaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9