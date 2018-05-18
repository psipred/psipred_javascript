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

1. Ensure you have completed the adding new functionality steps for the psipred_webiste application. Adding new model fields and updating the results panel template. Take a note of the new results panel value you added.

2. In main.js add new job to the end of job_list and a name to job_name
3. Add new key(s) to initialisation_data to hold the results data for the job (probably needs to happen with step 9 though)
4. Check if the active listeners need a new biod3 call (around line 280)
5. for UUID submission/lookup add new button trigger (from line 470)

6. In forms_index.js in the checked loop (line 36) add any new button addition exceptions
    (adds the select buttons on submission that are added in step 5)

7. In ractive_helpers.js add new unsetter in the clear_settings() to match any keys
   you added in step 3 above.
8. In prepare_downloads_html() add any exceptions for job types that have downloads of
    other types.
9. In handle_results() add new if(result_dict.name === [DATA_FILE]) to handle the
    news results file, adding to the downloads string, calling a process_file() etc.
10. Update set_downloads_panel() to show the links for your downloads that your
    added in handle_results()

11. In requests_index.js in process_file() add a new if for the new data type your want
    to parse see 14.

12. In parsers_index.js add any new parsers for the data files for your job. This will
    tie more closely to the parser calls in request_index.js see 13
13. Doublecheck 7 above in case you added new things to hold data in step 12

14. In ractive.on(submit) makes sure you catch all the form elements and pass them to verif_and_send(). Note that form elements are only available if they are visible
25. Ensure send_job() correctly appends new options to the form
