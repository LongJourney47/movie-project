const debounce = (funct, delay = 900) => {
  // below is the "wrapper" that guards how many times funct can be invoked
  // the three dots gathers all of the different arguements passed into the function. eliminates the need to do arg1,arg2, etc...
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // the use of apply is to call the function as is nomally but to take the array and pass each seperately into the original function.
      //   the apply will automatically keep track of what is passed through
      funct.apply(null, args);
    }, delay);
  };
};
