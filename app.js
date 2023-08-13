// JavScript
const currentDate = new Date();
let dayName;
switch (currentDate.getDay()) {
  case 0:
    dayName = "Sunday";
    break;
  case 1:
    dayName = "Monday";
    break;
  case 2:
    dayName = "Tuesday";
    break;
  case 3:
    dayName = "Wednesday";
    break;
  case 4:
    dayName = "Thursday";
    break;
  case 5:
    dayName = "Friday";
    break;
  case 6:
    dayName = "Saturday";
    break;
  default:
    dayName = "Unknown";
}

let monthName;
switch (currentDate.getMonth()) {
  case 0:
    monthName = "Jan";
    break;
  case 1:
    monthName = "Feb";
    break;
  case 2:
    monthName = "Mar";
    break;
  case 3:
    monthName = "Apr";
    break;
  case 4:
    monthName = "May";
    break;
  case 5:
    monthName = "Jun";
    break;
  case 6:
    monthName = "Jul";
    break;
  case 7:
    monthName = "Aug";
    break;
  case 8:
    monthName = "Sep";
    break;
  case 9:
    monthName = "Oct";
    break;
  case 10:
    monthName = "Nov";
    break;
  case 11:
    monthName = "Dec";
    break;
  default:
    monthName = "Unknown";
}
const currentDayOfMonth = currentDate.getDate();

const current = dayName + " " + currentDayOfMonth + "," + monthName;
document.getElementById('current_date').innerText = current;


// ------
const btn = document.getElementById('btn')
const CityName = document.getElementById('input')

const today = document.getElementById('today')
const week = document.getElementById('week')
const weather_img = document.querySelector('.icons')

const getCurrentData = async (lat, lon) => {
  today.innerHTML = ""
  week.innerHTML = ""
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8cdb8cfbeda27e1e1162654b0cdfbf22`
    const response = await fetch(url)
    const Data = await response.json()

    getSortCurrentData(Data)
    showMessage('successBlock', 'success', `Successfully fetched weather for  ${CityName.value}.`)
    CityName.value = '';

  } catch (error) {
    console.log(error)
  }
}









function getSortCurrentData(data) {
  weather_img.src = weatherIcons(data)
  const { weather,
    main: { temp, temp_min, temp_max, pressure, humidity, feels_like },
    visibility,
    wind: { speed },
    sys: { sunrise, sunset }
  } = data;
  Temperature.innerText = `${Math.round(temp - 273.15)}`
  description.innerText = `${weather[0].description}`
  document.getElementById('sunrise').innerText = sun(`${sunrise}`) + "AM"
  document.getElementById('sunset').innerText = sun(`${sunset}`) + "PM"
  document.getElementById('max_min_temp').innerHTML = `${Math.round(temp_max
    - 273.15)}&#8451;/${Math.round(temp_min
      - 273.15)}&#8451;`
  document.getElementById('humi').innerText = `${(humidity)}%`
  document.getElementById('feels_like').innerHTML = `${Math.round(feels_like - 273.15)}&#8451`
  document.getElementById('wind').innerText = `${Math.round(speed * 3.6)} km/h`
  document.getElementById('pressure').innerText = `${(pressure)} hPa`
  document.getElementById('visibility').innerText = `${(visibility / 1000)} Km`
}




function sun(time) {
  const unixTimestamp = time;
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDate = `${hours}:${minutes}:${seconds} `;
  return (convertTo12Hour(formattedDate));
}

function convertTo12Hour(time24) {
  var [hours, minutes] = time24.split(":");

  if (hours === "00") {
    hours = "12";
  } else if (hours > 12) {
    hours = String(hours - 12);
  }

  return hours + ":" + minutes + " "
}


const getForecast = async (lat, lon) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=8cdb8cfbeda27e1e1162654b0cdfbf22`;
    const response = await fetch(url);
    const data = await response.json();
    getSortForecastData(data)
    Forecast(data)
  } catch (error) {
    console.error(error);
  }
}
// days
function getSortForecastData(data) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const currentDay = currentDate.getDate();
  const CDateFormate = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}-${currentDay < 10 ? '0' : ''}${currentDay}`
  data.list.splice(0, 6).map((item, index) => {
    const dateTimeString = item.dt_txt;
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1
    const day = dateTime.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    if (formattedDate === CDateFormate) {
      const dateTimeString = item.dt_txt;
      const dateTime = new Date(dateTimeString);
      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      const seconds = dateTime.getSeconds();
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      const template = `<div class="card">
        <div class="card-body d-flex w-100 h-100 flex-column align-items-center justify-content-center gap-2">
            <h6 class="card-title">${hours}:${minutes}:${seconds}</h6>
            <img class="days" src=${weatherIcons(item)} alt="" />
            <h5 class="card-text">${Math.round(item.main.temp_max
        - 273.15)}&#8451;/${Math.round(item.main.temp_min
          - 273.15)}&#8451;</h5>
        </div>
        </div>  `
      const newCard = document.createElement('div')
      newCard.setAttribute('class', 'col-sm-3 mb-3 mb-sm-0  swiper-slide')
      newCard.innerHTML = template

      today.appendChild(newCard)

    }
  })

}

// Week

function Forecast(data) {
  const da = data
  const groupedData = {};
  da.list.forEach(item => {
    const dateTime = item.dt_txt.split(' ')[0];
    if (!groupedData[dateTime]) {
      groupedData[dateTime] = [];
    }
    groupedData[dateTime].push(item);
  });


  const dateKeys = Object.keys(groupedData);
  if (dateKeys.length >= 2) {
    const keysToSkip = dateKeys.slice(0);
    for (const date of keysToSkip) {
      if (groupedData.hasOwnProperty(date)) {


        const detailsForDate = groupedData[date];

        detailsForDate.forEach(item => {

          const dateTimeString = item.dt_txt;
          const dateTime = new Date(dateTimeString);
          let hours = dateTime.getHours();
          const minutes = dateTime.getMinutes();
          const seconds = dateTime.getSeconds();
          if (hours === 0) {
            hours = 1
          }

          const template = `<div class="card">
        <div class="card-body d-flex w-100 h-100 flex-column align-items-center justify-content-center gap-2">
            <h6 class="text-center card-title">${DateName(item.dt_txt)}
            <br/>
            ${hours}:${minutes}:${seconds}
            </h6>
            <img class="days" src=${weatherIcons(item)} alt="" />
            <h5 class="card-text">${Math.round(item.main.temp_max
            - 273.15)}&#8451;/${Math.round(item.main.temp_min
              - 273.15)}&#8451;</h5>
        </div>
        </div>  `
          const newCard = document.createElement('div')
          newCard.setAttribute('class', 'col-sm-3 mb-3 mb-sm-0  swiper-slide')
          newCard.innerHTML = template
          week.appendChild(newCard)

        });

      }

    }
  } else {
    console.log("Not enough data available to skip.");
  }
}

function DateName(dt_txt) {
  const date = new Date(dt_txt);
  const options = { weekday: 'short' };
  const dayOfWeek = date.toLocaleDateString('en-US', options);
  return (dayOfWeek);
}




const getCoordinate = async (city) => {
  try {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=8cdb8cfbeda27e1e1162654b0cdfbf22`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.length) {

      showMessage('errorBlock', 'error', `No Data found for ${city}`)
      CityName.value = '';
      return
    }

    const { name, lat, lon } = data[0];
    document.getElementById('location').innerText = `${name}, ${data[0].country}`
    getForecast(lat, lon)
    getCurrentData(lat, lon)

  } catch (error) {

    console.error(error);
  }
}

btn.addEventListener('click', (e) => {
  showMessage('alert', 'msg', `Fetching weather for ${CityName.value}.`)
  e.preventDefault();
  getCoordinate(CityName.value)

})

getCoordinate("Mangalore")

function showMessage(element, span, msg) {

  const errorMessage = document.getElementById(element);
  document.getElementById(span).innerHTML = msg
  errorMessage.style.display = "block";
  setTimeout(function () {
    errorMessage.style.display = "none";
  }, 5000); // 1000 milliseconds = 1 second
}





// getCoordinate("Kanyadi")
function weatherIcons(data) {
  var weatherCode = data.weather[0].id;
  let icon
  switch (true) {
    case weatherCode >= 801 && weatherCode <= 804:
      icon = "./img/Clouds.png"
      break
    case weatherCode === 800:
      function isDayIcon(iconCode) {
        return iconCode.charAt(iconCode.length - 1) === 'd';
      }
      const weatherIcon = data.weather[0].icon
      const isDay = isDayIcon(weatherIcon);
      if (isDay) {
        icon = "./img/sun.png"
      } else {
        return ("./img/night.png")
      }
      break
    case weatherCode >= 500 && weatherCode <= 531:
      icon = "./img/rain.png"
      break
    case weatherCode >= 600 && weatherCode <= 622:
      icon = "./img/snow.png"
      break
    case weatherCode >= 701 && weatherCode <= 781:
      icon = "./img/mist.png"
      break
    case weatherCode >= 200 && weatherCode <= 232:
      icon = "./img/thunderstorm.png"
      break
    case weatherCode >= 300 && weatherCode <= 321:
      icon = "./img/Drizzle.png"
      break

  }
  return (icon)
}