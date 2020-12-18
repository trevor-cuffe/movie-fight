//================================================================//
//===================  AUTO-COMPLETION WIDGET  ===================//
//================================================================//
//
// Author: Trevor Cuffe
// Created as part of my Modern Javascript Bootcamp course
// Original design by Stephen Grider
//
// Description:
// This widget is designed to work within the Bulma framework
// Also requires
// It can be used to generate multiple autocomplete elements in
// a single page.
//
//----------------------------------------------------------------//

const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    setInputValue,
    fetchData,
}) => {
    
    //================================================//
    //====  Create HTML For Autocomplete Web App  ====//
    //================================================//

    root.innerHTML = `
        <label><strong>Search</strong></label>
        <input type="text" class="input">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
        </div>
    `;
    // ================================= //



    // -------------------- //
    // Set Up DOM Variables //
    // -------------------- //

    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // -------------------- //


    //======================================//
    //============= User Input =============//
    //======================================//

    //*** DROPDOWN ***//
    const onInput = debounce(async event => {
        const results = await fetchData(event.target.value);

        resultsWrapper.innerHTML = '';

        if (!results.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        dropdown.classList.add('is-active');

        //Set Up DOM Element for each result:
        for (let result of results) {
            let option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(result);

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = setInputValue(result);
                onOptionSelect(result);
            });

            resultsWrapper.appendChild(option);
        }

    }, 500);

    input.addEventListener('input', onInput);


    //*** Remove dropdown when user clicks outside ***/
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });

    
    //*** If there are results, restore them on input focus ***/
    input.addEventListener('focusin', () => {
        if(resultsWrapper.innerHTML !== '') dropdown.classList.add('is-active');
    });
}