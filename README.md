# Building and moving the code to the webiste project

1. npm run-script build
makes the js blob
2. cp build/psipred.js ~/Code/psipred_website/static/js

# Layout

## lib/main.js
The core of the application. Initialises all of the ractive components

## common/common_index.js
Useful helper functions of pure javascript

## forms/forms.js
Helper functions for verifying the form is filled in correctly and
posting the job to the backend

## parsers/parsers_index.js
Small routines for parsing the results files that comeback from the backend

## ractive_helpers/reactive_helpers.js
Functions for handling some ractive stuff that have been moved out of main.js
for clarity

## requests/requests_index.js
Functions for actually making API calls

# Adding new service functionality

1. Ensure you have completed the adding new functionality steps for the psipred_webiste application

2. In main.js update base vars and strings from var ractive = new Ractive({ 
      memsatsvm_checked: true,
      memsatsvm_button: false,
      memsatsvm_job: 'memsatsvm_job',
      memsatsvm_waiting_message: '<h2>Please wait for your MEMSAT_SVM job to process</h2>',
      memsatsvm_waiting_icon: '<object width="140" height="140" type="image/svg+xml" data="http://bioinf.cs.ucl.ac.uk/psipred_beta/static/images/gears.svg"/>',
      memsatsvm_time: 'Unknown',

3. Update ractive.on('poll_trigger'), updating functions:
      prepare_downloads_html():ractive_helpers/ractive_helpers.js
      handle_results():ractive_helpers/ractive_helpers.js
      set_downloads_panel():ractive_helpers/ractive_helpers.js


4. Update the button toggles. Find these below ractive.on( 'downloads_active', function ( event ) {

5. Update submit event at ractive.on('submit', and update_and_send_forms()
      verify_and_send_forms : forms/forms_index.js

6. Update resubmit event at ractive.on('resubmit', and clear_settings()
      clear_settings(): ractive_helpers/ractive_helpers.js

7. Update the watcher for the UUID at if(getUrlVars().uuid && uuid_match)
