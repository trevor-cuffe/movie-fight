//===================================//
//=== Pull Data from the OMDB API ===//
//===================================//

const baseURL = "https://www.omdbapi.com/";

const fetchSearchResults = async (searchTerm) => {
    const response = await axios.get(
        baseURL,
        {
            params: {
                apikey: "4541d5ee",
                s: searchTerm
            }
        }
    );

    // Return empty array instead of error
    if (response.data.Error) {
        return [];
    }

    // Return an array of movies from the search results
    return response.data.Search;
}

const fetchMovieData = async (id) => {
    const response = await axios.get(
        baseURL,
        {
            params: {
                apikey: "4541d5ee",
                i: id
            }
        }
    )

    return response.data;
}



//========================================//
//===== Create Autocomplete Elements =====//
//========================================//

const autoCompleteWidgets = document.querySelectorAll('.autocomplete');

for (let widget of autoCompleteWidgets) {
    createAutoComplete({
        //=== Config Options ===//

        //root element
        root: widget,

        //how to render each dropdown result
        renderOption: (movie) => {
            const imgSrc = movie.Poster === 'N/A' ? '':movie.Poster;

            return `
                <img src="${imgSrc}" />
                ${movie.Title} (${movie.Year})
            `;

        },

        //event listener for 'click' on movie result
        onOptionSelect: (movie) => {
            document.querySelector('.tutorial').classList.add('is-hidden');
            onMovieSelect(movie, widget);
        },

        //return the value to assign to the input when an option is selected
        setInputValue: (movie) => {
            return movie.Title;
        },

        fetchData: fetchSearchResults,
    });
}



//=======================================//
//=========== Movie Selection ===========//
//=======================================//

const onMovieSelect = async (movie, root) => {
    const data = await fetchMovieData(movie.imdbID);

    //construct HTML element
    const movieDisplay = movieTemplate(data);
    //attach the element to the movieSummary div NEXT to the root element
    root.parentElement.querySelector('.movieSummary').innerHTML = movieDisplay;

    //store the movie data locally for comparison
    if (root.classList.contains('left')) {
        leftMovie = data;
    } else if (root.classList.contains('right')) {
        rightMovie = data;
    }

    if (leftMovie && rightMovie) {
        compareMovies();
    }
}

const movieTemplate = (movieData) => {

    //---convert data strings to numbers---//
    const boxOffice = movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, '');
    const metascore = movieData.Metascore;
    const imdbRating = movieData.imdbRating;
    const imdbVotes = movieData.imdbVotes.replace(/,/g, '');

    //awards:
    const awards = movieData.Awards.split(' ').reduce( (prev, word, i, arr) => {

        //--- Return the number that immediately precedes "Wins": ---//
        if (arr[i+1] && arr[i+1] === 'wins') {
            return word;
        } else {
            return prev;
        }

        //--- Return the TOTAL of any numbers appearing in the string: ---//
        // return prev + (parseInt(word) || 0 );

    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieData.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieData.Title}</h1>
                    <h4>${movieData.Genre}</h4>
                    <p>${movieData.Plot}</p>
                </div>
            </div>
        </article>

        <article class="notification is-primary" data-value=${awards}>
            <p class="title">${movieData.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary" data-value=${boxOffice}>
            <p class="title">${movieData.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary" data-value=${metascore}>
            <p class="title">${movieData.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary" data-value=${imdbRating}>
            <p class="title">${movieData.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary" data-value="${imdbVotes}">
            <p class="title">${movieData.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}



//========================================//
//=========== Movie Comparison ===========//
//========================================//

let leftMovie;
let rightMovie

function compareMovies() {

    //find and identify articles
    const movies = document.querySelectorAll('.movieSummary');
    const leftStats = movies[0].querySelectorAll('.notification');
    const rightStats = movies[1].querySelectorAll('.notification');

    //compare each article, and apply style
    leftStats.forEach((leftStat, i) => {
        let rightStat = rightStats[i]
        
        //get value from dataset for comparison
        let num1 = parseFloat(leftStat.dataset.value);
        let num2 = parseFloat(rightStat.dataset.value);

        //reset classes
        leftStat.classList.remove('is-primary', 'is-warning');
        rightStat.classList.remove('is-primary', 'is-warning');

        //add the appropriate classes
        leftStat.classList.add( (num1 > num2) ? 'is-warning' : 'is-primary');
        rightStat.classList.add( (num1 < num2) ? 'is-warning' : 'is-primary');

    });

}