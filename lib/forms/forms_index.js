import { send_job } from '../requests/requests_index.js';
import { isInArray } from '../common/common_index.js';
import { draw_empty_annotation_panel } from '../common/common_index.js';

//Takes the data needed to verify the input form data, either the main form
//or the submisson widget verifies that data and then posts it to the backend.
export function verify_and_send_form(ractive, seq, name, email, submit_url, times_url, psipred_checked,
                              disopred_checked, memsatsvm_checked, pgenthreader_checked)
{
  /*verify that everything here is ok*/
  let error_message=null;
  let job_string = '';
  //error_message = verify_form(seq, name, email, [psipred_checked, disopred_checked, memsatsvm_checked]);

  error_message = verify_form(seq, name, email,
                              [psipred_checked, disopred_checked,
                               memsatsvm_checked, pgenthreader_checked]);
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
    if(pgenthreader_checked === true)
    {
      job_string = job_string.concat("pgenthreader,");
      ractive.set('pgenthreader_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if(disopred_checked === true)
    {
      job_string = job_string.concat("disopred,");
      ractive.set('disopred_button', true);
      ractive.set('psipred_button', true);
      psipred_checked = false;
    }
    if(psipred_checked === true)
    {
      job_string = job_string.concat("psipred,");
      ractive.set('psipred_button', true);
    }
    if(memsatsvm_checked === true)
    {
      job_string = job_string.concat("memsatsvm,");
      ractive.set('memsatsvm_button', true);
    }

    job_string = job_string.slice(0, -1);
    response = send_job(ractive, job_string, seq, name, email, submit_url, times_url);
    //set visibility and render panel once
    if (psipred_checked === true && response)
    {
      ractive.set( 'results_visible', 2 );
      ractive.fire( 'psipred_active' );
      draw_empty_annotation_panel(ractive);
      // parse sequence and make seq plot
    }
    else if(disopred_checked === true && response)
    {
      ractive.set( 'results_visible', 2 );
      ractive.fire( 'disopred_active' );
      draw_empty_annotation_panel(ractive);
    }
    else if(memsatsvm_checked === true && response)
    {
      ractive.set( 'results_visible', 2 );
      ractive.fire( 'memsatsvm_active' );
      draw_empty_annotation_panel(ractive);
    }
    else if(pgenthreader_checked === true && response)
    {
      ractive.set( 'results_visible', 2 );
      ractive.fire( 'pgenthreader_active' );
      draw_empty_annotation_panel(ractive);
    }

    if(! response){window.location.href = window.location.href;}
  }
}

//Takes the form elements and checks they are valid
export function verify_form(seq, job_name, email, checked_array)
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
