# Building and moving the code to the webiste project

1. npm install (if not already done)
2. npm run-script build
makes the js blob
3. cp build/psipred.js ~/Code/psipred_website/static/js

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
Have added the comment lines that mark the areas

1. Ensure you have completed the adding new functionality steps for the psipred_website application. Adding new model fields and updating the results panel template. Take a note of the new results panel values you added.

2. In main.js add new job to the end of job_list and a name to job_name, (line 40)
    //JOB LISTS
3. Add new key(s) to initialisation_data to hold the results data for the job (probably needs to happen with step 7 and 9  though) near line 120ish
    //INITIALISATION DATA
4. Check if the active listeners need a new biod3 call (around line 496) and if the results found object needs updating
    //RESULT POLL FLAGS
    //LISTENERS
    listeners need updated if a pdb or biod3 object needs redrawn when
5. Does the method need an advanced panel toggle (around line 370) and the sections below for toggling the seq and struct
   forms
    //ADVANCED PANELS
6. for UUID submission/lookup add new panel display trigger (from line 790). Ensure you have the correct results_visible set
    // PANEL DISPLAY
7. In ractive_helpers.js add new unsetter in the clear_settings() to match any keys
   you added in step 3 above. (line 10)
    //UNSETTERS
8. In prepare_downloads_html() add any exceptions for job types that have downloads of
    other types. e.g bioserf also server pgenthreader results
    //DOWNLOAD EXCEPTIONS
9. In handle_results() add new if(result_dict.name === [DATA_FILE]) to handle the
    news results file, adding to the downloads string, calling a process_file() etc.
    Follow along with others in the file
    //RESULTS VARS
    //RESULTS DECISIONS
    //PRODUCED NOTHING
    //DOWNLOADS PANEL
    Some downloads needs setting by //EXTRA PANELS FOR SOME JOBS TYPES:
11. In requests_index.js in process_file() add a new if for the new data type you want
    to parse, if a parser is needed, see point 14.
    //PARSE DECISION
12. In parsers_index.js add any new parsers for the data files for your job. This will
    tie more closely to the parser calls in request_index.js see 13
13. Doublecheck 7 above in case you added new things to hold data in step 12
14. In main.js  - ractive.on(submit) makes sure you catch all the form elements and pass them to verify_and_send(). Note that form elements are only available if they are visible on the html page - redundant because now handle as code
15. Ensure send_job() correctly appends new options to the form - if you have advanced options
