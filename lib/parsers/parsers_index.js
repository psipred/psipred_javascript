
// for a given memsat data files extract coordinate ranges given some regex
export function get_memsat_ranges(regex, data)
{
    let match = regex.exec(data);
    if(match[1].includes(','))
    {
      let regions = match[1].split(',');
      regions.forEach(function(region, i){
        regions[i] = region.split('-');
        regions[i][0] = parseInt(regions[i][0]);
        regions[i][1] = parseInt(regions[i][1]);
      });
      return(regions);
    }
    return(match[1]);
}

// take and ss2 (file) and parse the details and write the new annotation grid
export function parse_ss2(ractive, file)
{
    let annotations = ractive.get('annotations');
    let lines = file.split('\n');
    lines.shift();
    lines = lines.filter(Boolean);
    if(annotations.length == lines.length)
    {
      lines.forEach(function(line, i){
        let entries = line.split(/\s+/);
        annotations[i].ss = entries[3];
      });
      ractive.set('annotations', annotations);
      biod3.annotationGrid(annotations, {parent: 'div.sequence_plot', margin_scaler: 2, debug: false, container_width: 900, width: 900, height: 300, container_height: 300});
    }
    else
    {
      alert("SS2 annotation length does not match query sequence");
    }
    return(annotations);
}
