export function parse_config(json){
  console.log("HEY THERE");
}

//given and array return whether and element is present
export function isInArray(value, array) {
  if(array.indexOf(value) > -1)
  {
    return(true);
  }
  else {
    return(false);
  }
}

export function parseMSA(ractive, seq_data){

  let seq_count = seq_data.split(">").length - 1;
  let lines = seq_data.split("\n");
  let data = '';
  if(seq_count <= 1){
    data = seq_data.replace(/^>.+$/mg, "").toUpperCase();
    data = seq_data.replace(/\n|\s/g,"");
    return(data);
  }
  else{
    let seqs = {};
    let seq_num = 0;
    lines.forEach(function(line){
      if(line.startsWith(">")){
        seq_num += 1;
        seqs[seq_num] = '';
      }
      else
      {
        seqs[seq_num] += line;
      }
    });
    let msa = '';
    for(let key in seqs){
      msa += ">seq_"+key+"\n"+seqs[key]+"\n";
    }
    data = msa;
    ractive.set('msa', msa);
    return(seqs["1"]);
    }
}

//when a results page is instantiated and before some annotations have come back
//we draw and empty annotation panel
export function draw_empty_annotation_panel(ractive){

  let seq = ractive.get('sequence');
  let residues = seq.split('');
  let annotations = [];
  residues.forEach(function(res){
    annotations.push({'res': res});
  });
  ractive.set('annotations', annotations);
  // console.log(Math.ceil(residues.length/50));
  let panel_height = ((Math.ceil(annotations.length/50)+2)*20)+(8*20);
  if(panel_height < 300){panel_height = 300;}
  //console.log("INITIAL HEIGHT: "+panel_height);
  biod3.annotationGrid(ractive.get('annotations'), {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: panel_height, container_height: panel_height});
}

//given a URL return the attached variables
export function getUrlVars() {
    let vars = {};
    //consider using location.search instead here
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
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
        }
        else {
            // Remove the test element
            element.removeChild(testElement);
        }

        // Return the em value in pixels
        return value;
    };
}(document, document.documentElement));
