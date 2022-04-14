// will hold custom functions that will determine how the auto complete will work in the specific application(reuseable code)

// the property root is destructerd into the arguement, thus eliminating the need for the query selector

const createAutoComplete = ({
  root,
  rederOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //  the code  below is meant to lessen the cupling between the hmtl file and js file(dependency). So the html code that would normally be in the html file will be placed in the JS file using the method below./
  //   const root = document.querySelector(".autocomplete");
  root.innerHTML = `
  <label><strong>Search </strong></label>
  <input class="input"  />
  <div class="dropdown">
  <div class="dropdown-menu">
  <div class="dropdown-content results"></div>
  </div>
  </div>
  `;

  //  /////// instead of having the variables search the entire document they have been condensed down to just check the root ///
  // controls the text field a user would use to enter a movie
  const input = root.querySelector("input");
  // meant to open the wdiget up
  const dropdown = root.querySelector(".dropdown");
  // meant to render the content on the widget
  const resultsWrapper = root.querySelector(".results");
  /////////////////////////////////////////////////////////
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
    const items = await fetchData(event.target.value);

    // The if statement below will disable the dropdown(widget) drop being summoned upon user inputs that yield no results
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    // clears out the current list of videos when seeking a new selection. instead of compiling all ontop of eachother
    resultsWrapper.innerHTML = "";

    // makes sure the menu is opened by adding the is-active class
    dropdown.classList.add("is-active");
    // console.log(movies);
    for (let item of items) {
      // will show a selection of options a user can click
      const option = document.createElement("a");
      // will remove the borken image icon on any results that dont have a associated poster. The new result will be empty.
      //   const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

      // below will be the multi line information that will be printed for each result
      // the double quotes will serve to ensure the printed information is converted into a string
      option.classList.add("dropdown-item");
      option.innerHTML = rederOption(item);
      // is the first part to item selection, closes the dropdown when a option is selected from the list.
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        // inserts the title inside of the input when an option is selected
        // input.value = movie.Title; //NO LONGER NEEDED DUE TO inputValue()
        input.value = inputValue(item);
        // is a helper function that holds additonal logic
        // onMovieSelect(movie); //NO LONGER NEEDED DUE TO onOptionSelect()

        onOptionSelect(item);
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
};
