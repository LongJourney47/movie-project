// /////////////////////////////////THE CODE BELOW IS NOT RESUABLE. IT IS STILL FUNCTIONAL AND ADEQUATE BUT NOT TRANSFERABLE TO OTHER PROJECTS AS IT. THE REJACTOR.JS FILE WILL HAVE REUSABLE CODE.
//////////////////////////////////////////////////

// THE api allows for the collection of movie data and games
// Helper function to collect data from movie api.
// Any network requests will use an async function and thus an await. You want to wait until the network data has been gathered before running the rest of the code hence the usage below.
const fetchData = async (searchTerm) => {
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
};

//  the code  below is meant to lessen the cupling between the hmtl file and js file(dependency). So the html code that would normally be in the html file will be placed in the JS file using the method below./
const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><strong>Search For a Movie </strong></label>
<input class="input"  />
<div class="dropdown">
<div class="dropdown-menu">
<div class="dropdown-content results"></div>
</div>
</div>
`;

// controls the text field a user would use to enter a movie
const input = document.querySelector("input");
// meant to open the wdiget up
const dropdown = document.querySelector(".dropdown");
// meant to render the content on the widget
const resultsWrapper = document.querySelector(".results");

// // let is used since it allows for change
// let timeoutId;
// below the line of code will represent what the user inputs into the field
//the value will be inserted into fetchData as an arugement
// the data being collected by the user is being stored in a variable so that a Set TimeOut can be applied. Followed by a if statement containing Set Clear to reset the time on input. in order to avoid a excess of wasted data being collect.  Allows the user to actually finish typing before having data collected. Otherwise the system would attpmpt to collect data per every input.
///////////// --ATTENTION-- ///////// the data below is commented out since the debounce will be used. Otherwise use the approach below. ///////
// const onInput = (event) => {
//   if (timeoutId) {
//       clearTimeout(timeoutId);
//     }

//     timeoutId = setTimeout(() => {
//       fetchData(event.target.value);
//     }, 1200);
// };
// will note any changes made by the user
// ////////////   --ATTENTION--   ///////////////////////
// since await was used to wait for the promise(data) in fetchData the following was made into an async function
const onInput = async (event) => {
  // since fetchData was made an async function the below was made into an await.
  const movies = await fetchData(event.target.value);

  // The if statement below will disable the dropdown(widget) drop being summoned upon user inputs that yield no results
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  // clears out the current list of videos when seeking a new selection. instead of compiling all ontop of eachother
  resultsWrapper.innerHTML = "";

  // makes sure the menu is opened by adding the is-active class
  dropdown.classList.add("is-active");
  // console.log(movies);
  for (let movie of movies) {
    // will show a selection of options a user can click
    const option = document.createElement("a");
    // will remove the borken image icon on any results that dont have a associated poster. The new result will be empty.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    // below will be the multi line information that will be printed for each result
    // the double quotes will serve to ensure the printed information is converted into a string
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movie.Title}
    `;

    // is the first part to item selection, closes the dropdown when a option is selected from the list.
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      // inserts the title inside of the input when an option is selected
      input.value = movie.Title;
      // is a helper function that holds additonal logic
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
};
// below is the apporach made for the use of a debounce function
input.addEventListener("input", debounce(onInput, 900));

// the code below will control when the widget of selections close upon a user clicking outside of it.
document.addEventListener("click", (event) => {
  //   // prints out a varity of different elements on the console. simply used to confirm functionality
  //   console.log(event.target);
  if (!root.contains(event.target)) {
    // removes is-active from dropdown to close the selection
    dropdown.classList.remove("is-active");
  }
});

// The helper function will be used to select additonal data that the parameter s is unable to provide
// the asynce here serves more has a movie summary
const onMovieSelect = async (movie) => {
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
  document.querySelector("#summary").innerHTML = moiveTemplate(response.data);
};

// another helper function that will contain the more specific pieces of information
const moiveTemplate = (moiveDetail) => {
  return `
  <article class="media">
  <figure class=media-left>
  <p class="image">
  <img src="${moiveDetail.Poster}" />
  </p>
  </figure>

<div class="media-content">
<div class="content">
<h1>${moiveDetail.Title}</h1>
<h4>${moiveDetail.Genre}</h4>
<p>${moiveDetail.Plot}</p>
</div>

</div>
 <article/>
  

 <article class="notification is-primary">
 <p class="title">${moiveDetail.Awards}</p>
 <p class="subtitle">Awards</p>
 </article>

 <article class="notification is-primary">
 <p class="title">${moiveDetail.BoxOffice}</p>
 <p class="subtitle">Box Office</p>
 </article>

 <article class="notification is-primary">
 <p class="title">${moiveDetail.Metascore}</p>
 <p class="subtitle">Metascore</p>
 </article>

 <article class="notification is-primary">
 <p class="title">${moiveDetail.imdbRating}</p>
 <p class="subtitle"> <p class="title">IMDB Rating</p>
 </p>
 </article>

 <article class="notification is-primary">
 <p class="title">${moiveDetail.imdbVotes}</p>
 <p class="subtitle"> <p class="title">IMDB Votes</p>
 </p>
 </article>

  `;
};
