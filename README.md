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
3. Add new key(s) to initialisation_data to hold the results data for the job
4. Check if the active listeners need a new biod3 call (around line 280)
5. for UUID submission/lookup add new button trigger (from line 370)

6. In forms_index.js add new [job_name].checked to array in the verify_form() calls
7. In the checked loop (line 36)  add any new button addition exceptions

8. In parsers_index.js add any new parsers for the data files for your job. This will
   tie more closely to the parser calls in request_index.js see 13

9. In ractive_helpers.js add new unsetter in the clear_settings() to match any keys
   you added in step 3 above.
10. In prepare_downloads_html() add any exceptions for job types that have downloads of
    other types.
11. In handle_results() add new if(result_dict.name === [DATA_FILE]) to handle the
    news results file, adding to the downloads string, calling a process_file() etc.
12. Update set_downloads_panel() to show the links for your downloads that your
    added in handle_results()

13. In requests_index.js in process_file() add a new if for the new data type your want
    to parse see 8.
