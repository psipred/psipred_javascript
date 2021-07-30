import { send_job } from '../requests/requests_index.js';
import { isInArray } from '../common/common_index.js';
import { draw_empty_annotation_panel } from '../common/common_index.js';

//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
export function verify_and_send_form(ractive, data, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type, joblist_url, zip)
{
  /*verify that everything here is ok*/
  let error_message=null;
  let job_string = '';

  let check_list = [];
  job_list.forEach(function(job_name){
    check_list.push(check_states[job_name+'_checked']);
  });

  error_message="ARG";
  if(seq_type){
    error_message = verify_seq_form(data, name, email, check_list, check_states);
    if(error_message.length === 0){
      let seq_count = data.split(">").length - 1;
      let lines = data.split("\n");
      if(seq_count <= 1){
        data = data.replace(/^>.+$/mg, "").toUpperCase();
        data = data.replace(/\n|\s/g,"");
        data = data.replace(/-/g, '');
        ractive.set('sequence_length', data.length);
        ractive.set('subsequence_stop', data.length);
        ractive.set('sequence', data);
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
        ractive.set('sequence_length', seqs[1].length);
        ractive.set('subsequence_stop', seqs[1].length);
        ractive.set('msa', msa);
        ractive.set('sequence', seqs["1"].replace(/-/g, ''));
      }
    }
  }
  if(struct_type){
    error_message = verify_struct_form(data, name, email, check_list);
  }
  if(error_message.length > 0)
  {
    ractive.set('form_error', error_message);
    alert("FORM ERROR:"+error_message);
  }
  else {
    //initialise the page
    let response = true;
    ractive.set( 'results_visible', null );
    //Post the jobs and intialise the annotations for each job
    //We also don't redundantly send extra psipred etc.. jobs
    //by doing these test in a specific order

    job_list.forEach(function(job_name){
        if(check_states[job_name+'_checked'] === true)
        {
            job_string = job_string.concat(job_name+",");
            if(job_name === 'pgenthreader' || job_name === 'disopred' ||
               job_name === 'dompred' || job_name === 'pdomthreader' ||
               job_name === 'bioserf' || job_name === 'domserf' ||
               job_name === 'metapsicov')
            {
              if(check_states.psipred_checked){}else{
              check_states.psipred_checked = false;}
            }
            if(job_name === 'bioserf')
            {
              if(check_states.pgenthreader_checked){}else{
              check_states.pgenthreader_checked = false;}
            }
            if(job_name === 'domserf')
            {
              if(check_states.pdomthreader_checked){}else{
              check_states.pdomthreader_checked = false;}
            }
        }
    });

    // console.log(check_states);
    job_string = job_string.slice(0, -1);
    response = send_job(ractive, job_string, data, name, email, submit_url, times_url, job_names, options_data, joblist_url, zip);
    //set visibility and render panel once
    for (let i = 0; i < job_list.length; i++)
    {
      let job_name = job_list[i];
      if(check_states[job_name+'_checked'] === true && response )
      {
        ractive.set(job_name+'_results_visible', true);
        if(["metsite", "hspred", "memembed", "gentdb"].includes(job_name)){
          ractive.set( 'results_visible', 3 );
        }
        else{
          ractive.set( 'results_visible', 2 );
        }
        ractive.fire( job_name+'_active' );
        if(seq_type){
          ractive.set( 'resubmission_visible', 1 );
          draw_empty_annotation_panel(ractive);
        }
        //break;
      }
    }

    if(! response){window.location.href = window.location.href;}
  }
}

export function verify_struct_form(struct, job_name, email, checked_array)
{
  let error_message = "";
  if(! /^[\x00-\x7F]+$/.test(job_name))
  {
    error_message = error_message + "Please restrict Job Names to valid letters numbers and basic punctuation<br />";
  }
  // TODO: one day we should let these services take xml pdb files
  // if(! /^HEADER|^ATOM\s+\d+/i.test(struct)){
  if(! /ATOM\s+\d+/i.test(struct)){
      error_message = error_message + "Your file does not look like a plain text ascii pdb file. This service does not accept .gz or xml format pdb files";
  }
  if(isInArray(true, checked_array) === false) {
    error_message = error_message + "You must select at least one analysis program";
  }
  return(error_message);
}

function test_seq(seq)
{
  /* length checks */
  let error_message = '';
  if(seq.length > 1500)
  {
    error_message = error_message + "Your sequence is too long to process";
  }
  if(seq.length < 30)
  {
    error_message = error_message + "Your sequence is too short to process";
  }
  /* nucleotide checks */
  let nucleotide_count = (seq.match(/A|T|C|G|U|N|a|t|c|g|u|n/g)||[]).length;
  if((nucleotide_count/seq.length) > 0.95)
  {
    error_message = error_message + "Your sequence appears to be nucleotide sequence. This service requires protein sequence as input";
  }
  if(/[^ACDEFGHIKLMNPQRSTVWYX-]+/i.test(seq))
  {
    error_message = error_message + "Your sequence contains invalid characters";
  }
  return(error_message);
}


//Takes the form elements and checks they are valid
export function verify_seq_form(seq, job_name, email, checked_array, check_states)
{
  let error_message = "";
  if(seq.length > 500 && check_states.dmpfold_checked)
  {
    error_message = error_message + "DMPfold jobs have a maximum sequence length of 500 residues.";
  }
  if(seq.length > 500 && check_states.dmp_checked)
  {
    error_message = error_message + "DeepMetaPSICOV jobs have a maximum sequence length of 500 residues.";
  }
  if(! /^[\x00-\x7F]+$/.test(job_name))
  {
    error_message = error_message + "Please restrict Job Names to valid letters numbers and basic punctuation";
  }

  if(isInArray(true, checked_array) === false) {
    error_message = error_message + "You must select at least one analysis program";
  }

  let seq_count = seq.split(">").length - 1;
  let lines = seq.split("\n");
  if(seq_count <= 1) // dealing with single seq
  {
    let whole_seq = '';
    lines.forEach(function(line){
      if(! line.startsWith('>')){ whole_seq += line; }
    });
    if(whole_seq.length < 1){ error_message= error_message + "No sequence provided"; }
    error_message += test_seq(whole_seq);
  }
  else //dealing with MSA
  {
    let seq_count = 0;
    let residue_count = 0;
    let seqs = {};
    lines.forEach(function(line){
      if(line.startsWith(">")){
        seq_count += 1;
        seqs[seq_count] = '';
      }
      else
      {
        seqs[seq_count] += line;
        residue_count += line.length;
      }
    });
    //console.log(seqs);
    let msa_residue_total = seqs["1"].length*seq_count;

    if(residue_count != msa_residue_total){
        error_message += error_message + "MSA Sequences must be of same length";
    }
    for(let key in seqs)
    {
      error_message += test_seq(seqs[key]);
      if(error_message.length > 0){
        return(error_message);
      }
    }
  }
  return(error_message);
}
