const userTab = document.querySelector("[user-weather]");
const searchTab = document.querySelector("[search-weather]");

const userContainer = document.querySelector(".weather-container");


const searchForm = document.querySelector(".search-form-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const loadingScreen = document.querySelector(".loading-screen-container");
const userInfoContainer = document.querySelector(".user-weather-info");
const errorHandling=document.querySelector(".error-handling");
console.log(errorHandling);

let currentTab = userTab;
const API_KEY = "d7e0253f070a005fc012a3568ef13c68";

currentTab.classList.add("current-tab");
getSessionCoordinate();
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getSessionCoordinate();
        }
    }
}


userTab.addEventListener('click', () => {
    switchTab(userTab);
})
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getSessionCoordinate() {
    const localCoordinate = sessionStorage.getItem("user-Coordinate");
    if (!localCoordinate) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinate = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinate);
    }
}

async function fetchUserWeatherInfo(coordinate) {
    const { lat, lon } = coordinate;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
    }
}
function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[city-name]");
    const countryIcon = document.querySelector("[country-icon]");
    const desc = document.querySelector("[weather-desc]");
    const weatherIcon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    
    
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText = `${weatherInfo?.clouds?.all}%`;

}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {

    }
}
function showPosition(position) {
    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-Coordinate", JSON.stringify(userCoordinate));
   fetchUserWeatherInfo(userCoordinate);
}
const grandAccessButton = document.querySelector("[grant-access]");
grandAccessButton.addEventListener("click", getLocation);
const inputSearch = document.querySelector("[search-input]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = inputSearch.value;
    if (city === "")
        return
    else
        fetchSearchWeatherInfo(city);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(response.ok){

            const data = await response.json();
            loadingScreen.classList.remove("active");
            errorHandling.classList.remove("active");
            userInfoContainer.classList.add("active")
            renderWeatherInfo(data);
        }
        else{
            loadingScreen.classList.remove("active");
            errorHandling.classList.add("active");
        }
    } catch (error) {
        // errorHandling.classList.add("active");
         
    }
}