const wrapper = document.querySelector(".wrapper"),
      inputPart = wrapper.querySelector(".input-part"),
      infoTxt = inputPart.querySelector(".info-txt"),
      inputField = inputPart.querySelector("input"),
      locationBtn = inputPart.querySelector("button"),
      wIcon = document.querySelector(".weather-part img"),
      arrowBack = document.querySelector("header i");
let api;

inputField.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputField.value !== "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        console.log("Tarayıcınız geolocation'ı desteklemiyor...");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=a16e33bdb752c9b5778d38c42614a6e4`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a16e33bdb752c9b5778d38c42614a6e4`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Sonuçlar getiriliyor...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then(response => response.json())
        .then(result => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Bir hata oluştu.";
            infoTxt.classList.add("error");
        });
}

function weatherDetails(info) {
    if (info.cod === "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} şehri bulunamadı...`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id === 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "icons/rain.svg";
        }

      
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");

        let weatherChart; 

        function updateChart(data) {
            const ctx = document.getElementById("weatherChart").getContext("2d");
        
            if (weatherChart) {
                
                weatherChart.data.datasets[0].data = data;
                weatherChart.update();
            } else {
                
                weatherChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Sıcaklık (°C)', 'Hissedilen (°C)', 'Nem (%)'],
                        datasets: [{
                            label: 'Hava Durumu',
                            data: data, 
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(75, 192, 192, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(75, 192, 192, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true 
                            }
                        }
                    }
                });
            }
        }
        
}

updateChart([temp, feels_like, humidity]);

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});} 