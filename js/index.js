const buttonSubmit = document.getElementById("buttonSubmit");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

//Making sure input takes only Numbers
const handleInput = (e) => {
  let inputValue = e.target.value;
  inputValue = inputValue.replace(/[^0-9]/g, "");
  e.target.value = inputValue;
};


//calculating the age
const ageCalculation = (enteredDate, currentDate) => {
  let ageInYears = 0,
    ageInMonths = 0,
    ageInDays = 0;
  ageInYears = currentDate.getFullYear() - enteredDate.getFullYear();
  ageInMonths = currentDate.getMonth() - enteredDate.getMonth();
  ageInDays = currentDate.getDate() - enteredDate.getDate();

  if (ageInDays < 0) {
    ageInMonths--;
    const lastMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    ageInDays += lastMonthDate.getDate();
  }

  if (ageInMonths < 0) {
    ageInMonths += 12;
    ageInYears--;
  }

  
  return {ageInYears, ageInMonths, ageInDays};
};

//Checking if day is valid
const isValidDay = (day, month, year) => {
  const dateObject = new Date(year, month - 1, day);
  if (dateObject.getMonth() == month - 1 && dateObject.getFullYear() == year) {
    return true;
  } else {
    return false;
  }
};


// First step that checks that data is entered or not
const dateEntryCheck = () => {
  let dError = "",
    mError = "",
    yError = "";
  let isValidEntry = true;

  if (dayInput.value == "") {
    dError = "This field is required";
    isValidEntry = false;
  }
  if (monthInput.value == "") {
    mError = "This field is required";
    isValidEntry = false;
  }
  if (yearInput.value == "") {
    yError = "This field is required";
    isValidEntry = false;
  }

  return isValidEntry == true
    ? dateValidation()
    : { isValidEntry, dError, mError, yError };
};

//Date validation in correct months, years and days
const dateValidation = () => {
  let dError = "",
    mError = "",
    yError = "";
  let isValid = true;
  let ageInDays=0, ageInMonths=0; ageInYears=0;
  const day = parseInt(dayInput.value);
  const month = parseInt(monthInput.value);
  const year = parseInt(yearInput.value);
  const currentDate = new Date();
  const enteredDate = new Date(year, month - 1, day);

  if (enteredDate > currentDate) {
    yError = "Must be in the past";
    isValid = false;
  }

  if (month > 12 || month < 1) {
    mError = "Must be a valid month";
    isValid = false;
  }

  if (isValidDay(day, month, year) == false) {
    dError = "Must be a valid day";
    isValid = false;
  }

  if (isValid) {
    ({ageInYears, ageInMonths, ageInDays} = ageCalculation(enteredDate, currentDate));
    
  }
  return { isValid, dError, mError, yError, ageInYears, ageInMonths, ageInDays };
};



//Button click event
buttonSubmit.addEventListener("click", async(e) => {
  e.preventDefault();
  const dayError = document.getElementById("dayError");
  const monthError = document.getElementById("monthError");
  const yearError = document.getElementById("yearError");
  const labels = document.querySelectorAll('.age__label');
  const inputs = document.querySelectorAll('.age__edit');
  const years = document.getElementById('years');
  const months = document.getElementById('months');
  const days = document.getElementById('days');
  dayError.innerText = "";
  monthError.innerText = "";
  yearError.innerText = "";
  years.innerText="--";
  months.innerText="--";
  days.innerText = "--"
  labels.forEach((label)=>{
    label.classList.remove('age__label--error')
  });
  inputs.forEach((input)=>{
    input.classList.remove('age__edit--error')
  });

  const { isValid, dError, mError, yError, ageInYears, ageInMonths, ageInDays } = dateEntryCheck();
  if (isValid) {
    const years = document.getElementById('years');
    const months = document.getElementById('months');
    const days = document.getElementById('days');


    startCounting(years, ageInYears, () => {
      startCounting(months, ageInMonths, () => {
        startCounting(days, ageInDays, () => {
        });
      });
    });
    
    
  } else {
    
    dayError.innerText = dError;
    monthError.innerText = mError;
    yearError.innerText = yError;
    if(dError!=""){
      labels[0].classList.add('age__label--error');
      inputs[0].classList.add('age__edit--error');
    }
    if(mError!=""){
      labels[1].classList.add('age__label--error');
      inputs[1].classList.add('age__edit--error');
    }
    if(yError!=""){
      labels[2].classList.add('age__label--error');
      inputs[2].classList.add('age__edit--error');
    }
  }
});

function startCounting(countElement, targetNumber,callback) {
  const duration = 2000; // Set the duration of the animation in milliseconds
  const startTimestamp = performance.now();

  function updateCount(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / duration);
      const currentNumber = Math.floor(progress * targetNumber);

      countElement.textContent = currentNumber;

      if (progress < 1) {
          requestAnimationFrame(updateCount);
      }
      else{
       if(callback) callback(); 
      }
  }

  requestAnimationFrame(updateCount);
}

dayInput.addEventListener("input", handleInput);
monthInput.addEventListener("input", handleInput);
yearInput.addEventListener("input", handleInput);
