const autoCompleteConfig = {
  //   the rederoption function was created to store all reder logic inside
  // #3 HOW TO SHOW AN INDIVIDUAL ITEM
  rederOption(movie) {
    // will remove the borken image icon on any results that dont have a associated poster. The new result will be empty.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    //below the movie title and year will be produced on as options to select from
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
  },

  // #5 WHAT TO BACKFILL WHEN USER CLICKS ON ONE
  inputValue(movie) {
    return movie.Title;
  },
  // NEW!!!! fetchData is being passed as an arguement into the create auto conif object
  // THE api allows for the collection of movie data and games
  // Helper function to collect data from movie api.
  // Any network requests will use an async function and thus an await. You want to wait until the network data has been gathered before running the rest of the code hence the usage below.
  // #6 HOW TO ACTUALLY FETCH DATA
  async fetchData(searchTerm) {
    // response will represent all the data related to the request
    //   only part of the response is gathered since a key will be used along with other parameters
    const response = await axios.get("http://www.omdbapi.com/", {
      //   The second arguement is an object for the sake of cleanliness
      // The arguement will be converted into a string then appended to the aobve URL
      params: {
        // personal key needed to use api, 1000 data collection attempts a day
        apikey: "15385f9a",
        //   the s parameter symbolizes the s search option of collecting data from the movie api
        //   The data collected from the user into the fetchData will come into the s parameter for conversion.
        s: searchTerm,
      },
    });
    // omits the default error result. returning an emtpy arrary results in no content being shown in case of error results.
    if (response.data.Error) {
      return [];
    }
    // it is standard to see property names with all lower cases concerning api's
    return response.data.Search;
  },
};

// NEW!!!! the triple dots copies everything in autocompleteconfig and throws them into createautocomplete then add the root. ALlows for addional auto completes to be created/used
// PURPOSE OF CODE IN ORDER TO REUSE!!!!!!#1 CALL FUNCTION
createAutoComplete({
  ...autoCompleteConfig,
  // #2 SPECIFY WHERE TO AUTOCOMPLETE TOO
  root: document.querySelector("#left-autocomplete"),
  // #4 WHAT TO DO WHEN A USER CLICKS ON ONE
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    // the second element is just to ensure it is rendered on the correct side
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
// the refactored copy below
createAutoComplete({
  ...autoCompleteConfig,
  // #2 SPECIFY WHERE TO AUTOCOMPLETE TOO
  root: document.querySelector("#right-autocomplete"),
  // #4 WHAT TO DO WHEN A USER CLICKS ON ONE
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    // the second element is just to ensure it is rendered on the correct side
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;
// The helper function will be used to select additonal data that the parameter s is unable to provide
// the asynce here serves more has a movie summary
const onMovieSelect = async (movie, summaryElement, side) => {
  // // just to check out movie data to test functionality
  // console.log(movie);
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "15385f9a",
      i: movie.imdbID,
    },
  });
  // // just to check out additional movie data to test functionality
  // console.log(movie);
  // attaches the specific pieces of information from movieTemplate into the summary id. using the response.data to initialize the process
  summaryElement.innerHTML = moiveTemplate(response.data);

  //   NEW!!  the if statement is meant to
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

// const runComparison = () => {
//   console.log("testing");
// };
const runComparison = () => {
  // console.log("time for comparison");
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  // index will gather data from the right side
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    // used to link idex to right side
    // console.log(leftStat, rightStat);
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
// another helper function that will contain the more specific pieces of information
const moiveTemplate = (movieDetail) => {
  // data below is meant to be used to gather and compare the numeric scores of both search results specific fields
  //  NEW!! the replace section is meant to cut out the extra "fat" of the results such as, 1,000 = 1000
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  //  NEW!! testing purposes
  //  NEW!! console.log(dollars);
  const metascore = parseInt(movieDetail.Metascore);
  // float is needed since the rating may have a decimal otherwise use int
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  // NEW!! testing purposes
  //  NEW!! console.log(metascore, imdbRating, imdbVotes);

  //  NEW!! REFACTORED APPROACH
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    //  NEW!!  checks to see if your working with an actual number or not
    const value = parseInt(word);

    // NEW!!  if(isNaN) is a built in function that checks if a value is a number or not
    if (isNaN(value)) {
      //  NEW!! will stop the process
      return prev;
    } else {
      return (prev = value);
    }
  }, 0);
  // console.log(awards);

  // // NEW!!  the approach below is fine but not optimal
  // let count = 0;
  // const awards = movieDetail.Awards.split(" ").forEach((word) => {
  //   //  NEW!!  checks to see if your working with an actual number or not
  //   const value = parseInt(word);

  //   // NEW!!  if(isNaN) is a built in function that checks if a value is a number or not
  //   if (isNaN(value)) {
  //     //  NEW!! will stop the process
  //     return;
  //   } else {
  //     count = count = value;
  //   }
  // });
  // console.log(count);

  return `
    <article class="media">
    <figure class=media-left>
    <p class="image">
    <img src="${movieDetail.Poster}" />
    </p>
    </figure>
  
  <div class="media-content">
  <div class="content">
  <h1>${movieDetail.Title}</h1>
  <h4>${movieDetail.Genre}</h4>
  <p>${movieDetail.Plot}</p>
  </div>
  
  </div>
   <article/>
    
  
   <article data-value=${awards} class="notification is-primary">
   <p class="title">${movieDetail.Awards}</p>
   <p class="subtitle">Awards</p>
   </article>
  
   <article data-value=${dollars} class="notification is-primary">
   <p class="title">${movieDetail.BoxOffice}</p>
   <p class="subtitle">Box Office</p>
   </article>
  
   <article data-value=${metascore} class="notification is-primary">
   <p class="title">${movieDetail.Metascore}</p>
   <p class="subtitle">Metascore</p>
   </article>
  
   <article data-value=${imdbRating} class="notification is-primary">
   <p class="title">${movieDetail.imdbRating}</p>
   <p class="subtitle"> <p class="title">IMDB Rating</p>
   </p>
   </article>
  
   <article data-value=${imdbVotes} class="notification is-primary">
   <p class="title">${movieDetail.imdbVotes}</p>
   <p class="subtitle"> <p class="title">IMDB Votes</p>
   </p>
   </article>
  
    `;
};
