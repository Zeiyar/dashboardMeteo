// Inputs & boutons
const inputCity = document.getElementById("input-city");
const buttonDayly14 = document.getElementById("Dayly14");
const buttonSearch = document.getElementById("search-button");
const convertionBtn = document.getElementById("convertion");
// Infos générales*
const city = document.getElementById("city");
const country = document.getElementById("country");
const dateOfToday = document.getElementById("dateOfToday");
const hoursOfToday = document.getElementById("hoursOfToday");

// Section météo du jour
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const imageCondition = document.getElementById("image-condition");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const cloud = document.getElementById("cloud");
const feelslike = document.getElementById("feelslike");
const uv = document.getElementById("uv");
const meteoOfToday = document.getElementById("MeteoOfToday");
const meteoOf14Day = document.getElementById("meteoOf14Day");

// Section météo par heures
const hoursSection = document.getElementById("hours");

//valeur de convertion et de toggle
let toggleIsTrue = true;
localStorage.setItem("degorfar",true)
let deg = true;
let i = 0;
// valeur de base du dashboard
const setTown = (ville) =>{
    localStorage.setItem("maville",ville)
    updateMeteo(`https://api.weatherapi.com/v1/forecast.json?key=374547ebcd3e48ff973140713250409&q=${ville}&aqi=yes&alerts=yes`)
}

// horloge en fonction du pays
const updateClockWithTimezone = () => {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: currentTimezone
    };
    const localTime = now.toLocaleString("en-GB", options);
    dateOfToday.textContent = localTime;
};
setInterval(() => updateClockWithTimezone(), 1000);
//mis a jour des infos pour la date d aujourdhui
window.onload = () => {
    setTown(localStorage.getItem("maville")||"Paris");
    setInterval(()=>setTown(localStorage.getItem("maville")), 5 * 60 * 1000)
    inputCity.value=""
}

const updateMeteo = (api) => {
    fetch(api)
        .then(Response => Response.json())
        .then(data => {
            city.textContent = data.location.name
            country.textContent = data.location.country
            temperature.textContent = `${deg ? data.current.temp_c+"C" : data.current.temp_f+"F"}°`
            condition.innerHTML = `<img src="${data.current.condition.icon}">`
            wind.textContent = `💨${deg ? data.current.wind_kph+"km/h" : data.current.wind_mph+"mp/h"}`
            humidity.textContent = `💧${data.current.humidity}%`
            cloud.textContent = `☁️${data.current.cloud}%`
            feelslike.textContent = `Feels like : ${deg ? data.current.feelslike_c : data.current.feelslike_f}°`
            uv.textContent = `${data.current.uv} UV`
            currentTimezone = data.location.tz_id;
        })
        .catch(err => console.error("error Api current", err))
}

//pour 14 jours
const updateMeteoDaily = (api) => {
    meteoOf14Day.innerHTML = "";
    buttonDayly14.textContent="Minus";
    meteoOfToday.classList.add("hidding");
    fetch(api)
        .then(Response => Response.json())
        .then(data => {
            let forecast = data.forecast.forecastday
            forecast.forEach((day,index) => {
                const card = document.createElement("div");
                card.className = "meteo14Day";
                card.innerHTML = `
                    <span><img src="${day.day.condition.icon}"></span>
                    <span><strong>${day.date}</strong></span>
                    <span>Max: ${deg ? day.day.maxtemp_c : day.day.maxtemp_f}°</span>
                    <span>Min: ${deg ? day.day.mintemp_c : day.day.mintemp_f}°</span>
                    <span>💧${day.day.avghumidity}%</span>
                    <span>${day.day.uv}UV</span>
                `;
                meteoOf14Day.appendChild(card);

                card.addEventListener("click", () => {
                    displayHourly(data, index);
                })}
            );
}
        )
        .catch(err => console.error("error Api Daily", err))

}

//par heure
const displayHourly = (data,dayIndex) => {
    hoursSection.innerHTML = "";
    const hours = data.forecast.forecastday[dayIndex].hour;

    hours.forEach(hour => {
        const hourDiv = document.createElement("div");
        hourDiv.className = "hours";
        hourDiv.innerHTML = `
            <span><img src="${hour.condition.icon}"></span>
            <span><strong>${hour.time.split(" ")[1]}</strong></span>
            <span>${deg ? hour.temp_c+"C" : hour.temp_f+"F"}°</span>
            <span>💧${hour.humidity}%</span>
            <span>${hour.uv}UV</span>
        `;
        hoursSection.appendChild(hourDiv);
    });
}



//button
buttonSearch.addEventListener("click",()=>{
    if (inputCity.value===""){
        alert("please research a city of your choice");
    }
    else {
        meteoOfToday.classList.remove("hidding");
        if(!toggleIsTrue) buttonDayly14.click();
        localStorage.setItem("maville",inputCity.value);
        setTown(localStorage.getItem("maville"));
}
})

buttonDayly14.addEventListener("click",()=>{
    if(toggleIsTrue){
    updateMeteoDaily(`https://api.weatherapi.com/v1/forecast.json?key=374547ebcd3e48ff973140713250409&q=${localStorage.getItem("maville")}&days=14&aqi=yes&alerts=yes`);
    toggleIsTrue = false;
    
}   else{
    meteoOf14Day.innerHTML = "";
    toggleIsTrue = true;
    buttonDayly14.textContent="Dayly for 14 day !!!";
    meteoOfToday.classList.remove("hidding");
    hoursSection.innerHTML = "";
}
})

convertionBtn.addEventListener("click",()=>{
    if(deg){
        localStorage.setItem("degorfar",false);
        deg = localStorage.getItem("degorfar")==="true";
        setTown(localStorage.getItem("maville")||"Paris");
        convertionBtn.textContent = "F° to C°";
        buttonDayly14.click()
    } else {
        localStorage.setItem("degorfar",true);
        deg = localStorage.getItem("degorfar")==="true";
        setTown(localStorage.getItem("maville")||"Paris");
        convertionBtn.textContent = "C° to F°";
        buttonDayly14.click()
    }
})