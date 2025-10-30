const apiKey = "ee07482124626e46c60771d34530f1b7";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("cityInput");
  const output = document.getElementById("weatherResult");


  btn.addEventListener("click", () => {
    fetchWeather();
  });


  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather();
  });


  async function fetchWeather() {
    const city = input.value.trim();
    if (!city) {
      alert("Please enter a city name");
      return;
    }


    output.innerHTML = `<p>Loading...</p>`;


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    console.log("Fetching:", url);

    try {
      const res = await fetch(url);

     
      if (!res.ok) {
       
        let errMsg = `${res.status} ${res.statusText}`;
        try {
          const errBody = await res.json();
          if (errBody && errBody.message) errMsg = `${errBody.cod}: ${errBody.message}`;
        } catch (parseErr) {
      
        }

        throw new Error(`Error ${errMsg}`);
      }

      const data = await res.json();
      console.log("Data received:", data);


      const iconCode = data.weather?.[0]?.icon;
      const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : "";

      output.innerHTML = `
        <div class="card">
          <h2>${escapeHtml(data.name)}, ${escapeHtml(data.sys.country)}</h2>
          ${iconUrl ? `<img src="${iconUrl}" alt="${escapeHtml(data.weather[0].description)}">` : ""}
          <p>🌡️ <strong>${Math.round(data.main.temp)}°C</strong></p>
          <p>🌤️ ${escapeHtml(data.weather[0].description)}</p>
          <p>💧 Humidity: ${escapeHtml(String(data.main.humidity))}%</p>
          <p>💨 Wind: ${escapeHtml(String(data.wind.speed))} m/s</p>
        </div>
      `;
    } catch (err) {
      console.error("Fetch error:", err);

      if (err.message.includes("401") || err.message.toLowerCase().includes("invalid api key")) {
        output.innerHTML = `<p style="color:red;">Unauthorized — check your API key (401).</p>`;
      } else if (err.message.includes("404") || err.message.toLowerCase().includes("city not found")) {
        output.innerHTML = `<p style="color:red;">City not found — try "London" or "New York".</p>`;
      } else if (err.message.toLowerCase().includes("failed to fetch")) {
        output.innerHTML = `<p style="color:red;">Network error / CORS issue. Make sure you're running via http://localhost or Live Server.</p>`;
      } else {
        output.innerHTML = `<p style="color:red;">${escapeHtml(err.message)}</p>`;
      }
    }
  }


  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});