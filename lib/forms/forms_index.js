import { send_job } from '../requests/requests_index.js';
import { isInArray } from '../common/common_index.js';
import { draw_empty_annotation_panel } from '../common/common_index.js';

//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
export function verify_and_send_form(ractive, data, name, email, submit_url, times_url, check_states, job_list, job_names, options_data, seq_type, struct_type)
{
  /*verify that everything here is ok*/
  let error_message=null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  let check_list = [];
  job_list.forEach(function(job_name){
    check_list.push(check_states[job_name+'_checked']);
  });

  error_message="ARG";
  if(seq_type){
    error_message = verify_seq_form(data, name, email, check_list);
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
    //byt doing these test in a specific order
    job_list.forEach(function(job_name){
        if(check_states[job_name+'_checked'] === true)
        {
            job_string = job_string.concat(job_name+",");
            ractive.set(job_name+'_button', true);
            if(job_name === 'pgenthreader' || job_name === 'disopred' ||
               job_name === 'dompred' || job_name === 'pdomthreader' ||
               job_name === 'bioserf' || job_name === 'domserf' ||
               job_name === 'metapsicov')
            {
              ractive.set('psipred_button', true);
              check_states.psipred_checked = false;
            }
            if(job_name === 'bioserf')
            {
              ractive.set('pgenthreader_button', true);
              check_states.pgenthreader_checked = false;
            }
            if(job_name === 'domserf')
            {
              ractive.set('pdomthreader_button', true);
              check_states.pdomthreader_checked = false;
            }
            if(job_name === 'mempack')
            {
                ractive.set('memsatsvm_button', true);
            }
        }
    });
    job_string = job_string.slice(0, -1);
    response = send_job(ractive, job_string, data, name, email, submit_url, times_url, job_names, options_data);
    //set visibility and render panel once
    for (let i = 0; i < job_list.length; i++)
    {
      let job_name = job_list[i];
      if(check_states[job_name+'_checked'] === true && response )
      {
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
        break;
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

//Takes the form elements and checks they are valid
export function verify_seq_form(seq, job_name, email, checked_array)
{
  let error_message = "";
  if(! /^[\x00-\x7F]+$/.test(job_name))
  {
    error_message = error_message + "Please restrict Job Names to valid letters numbers and basic punctuation<br />";
  }

  /* length checks */
  if(seq.length > 1500)
  {
    error_message = error_message + "Your sequence is too long to process<br />";
  }
  if(seq.length < 30)
  {
    error_message = error_message + "Your sequence is too short to process<br />";
  }

  /* nucleotide checks */
  let nucleotide_count = (seq.match(/A|T|C|G|U|N|a|t|c|g|u|n/g)||[]).length;
  if((nucleotide_count/seq.length) > 0.95)
  {
    error_message = error_message + "Your sequence appears to be nucleotide sequence. This service requires protein sequence as input<br />";
  }
  if(/[^ACDEFGHIKLMNPQRSTVWYX_-]+/i.test(seq))
  {
    error_message = error_message + "Your sequence contains invalid characters<br />";
  }

  if(isInArray(true, checked_array) === false) {
    error_message = error_message + "You must select at least one analysis program";
  }

  return(error_message);
}
