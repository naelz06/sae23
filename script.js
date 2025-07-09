const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");
const nbJoursSelect = document.getElementById("nbJoursSelect");

async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    return await response.json();
  } catch (error) {
    console.error("Erreur API communes :", error);
    throw error;
  }
}

function displayCommunes(data) {
  communeSelect.innerHTML = "";

  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });

    communeSelect.style.display = "block";
    validationButton.style.display = "block";
  } else {
    const existing = document.getElementById("error-message");
    if (!existing) {
      const msg = document.createElement("p");
      msg.id = "error-message";
      msg.textContent = "Le code postal saisi n'est pas valide";
      msg.classList.add("errorMessage");
      document.body.appendChild(msg);
    }

    communeSelect.style.display = "none";
    validationButton.style.display = "none";
    setTimeout(() => location.reload(), 3000);
  }
}

async function fetchMeteoByCommune(selectedCommune, nbJours) {
  try {
    const response = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily?token=7459e816e4ae4b9642561b0d07d030139ea2966a921a61686314f167cfa2956b&insee=${selectedCommune}`
    );
    const data = await response.json();
    return data.forecast.slice(0, nbJours);
  } catch (error) {
    console.error("Erreur API météo :", error);
    throw error;
  }
}

codePostalInput.addEventListener("input", async () => {
  const codePostal = codePostalInput.value;
  communeSelect.style.display = "none";
  validationButton.style.display = "none";

  if (/^\d{5}$/.test(codePostal)) {
    try {
      const data = await fetchCommunesByCodePostal(codePostal);
      displayCommunes(data);
    } catch (error) {
      console.error("Erreur recherche commune :", error);
    }
  }
});

validationButton.addEventListener("click", async () => {
  const selectedCommune = communeSelect.value;
  const nbJours = parseInt(nbJoursSelect.value, 10);

  if (selectedCommune) {
    try {
      const meteoData = await fetchMeteoByCommune(selectedCommune, nbJours);
      createCard(meteoData);
    } catch (error) {
      console.error("Erreur météo :", error);
    }
  }
});

function createCard(forecasts) {
  const container = document.getElementById("meteoResultats");
  container.innerHTML = "<h3>Prévisions météo :</h3>";

  if (!forecasts || forecasts.length === 0) {
    container.innerHTML += "<p>Aucune donnée météo disponible.</p>";
    return;
  }

  forecasts.forEach((meteo, index) => {
    const jourDiv = document.createElement("div");
    jourDiv.classList.add("jour-meteo");

    jourDiv.innerHTML = `
      <h4>Jour ${index + 1}</h4>
      <p>​❄️​ <strong>Temp. min :</strong> ${meteo.tmin} °C</p>
      <p>🔥​ <strong>Temp. max :</strong> ${meteo.tmax} °C</p>
      <p>​🌧️ <strong>Pluie :</strong> ${meteo.probarain} %</p>
      <p>​☀️ <strong>Ensoleillement :</strong> ${meteo.sun_hours} h</p>
    `;

    if (showLat.checked || showLon.checked) {
      const latlon = meteo.latitude && meteo.longitude
        ? { lat: meteo.latitude, lon: meteo.longitude }
        : forecasts[0]; 

      if (showLat.checked) {
        jourDiv.innerHTML += `<p>️🗺️ <strong>Latitude :</strong> ${latlon.lat || "?"}</p>`;
      }
      if (showLon.checked) {
        jourDiv.innerHTML += `<p>️🗺️ <strong>Longitude :</strong> ${latlon.lon || "?"}</p>`;
      }
    }

    if (showRain.checked) {
      jourDiv.innerHTML += `<p>💧​ <strong>Cumul de pluie :</strong> ${meteo.rr10} mm</p>`;
    }

    if (showWind.checked) {
      jourDiv.innerHTML += `<p>💨 <strong>Vent moyen :</strong> ${meteo.wind10m} km/h</p>`;
    }

    if (showWindDir.checked) {
      jourDiv.innerHTML += `<p>🧭 <strong>Direction du vent :</strong> ${meteo.dirwind10m}°</p>`;
    }

    container.appendChild(jourDiv);
  });
}
const toggleBtn = document.getElementById("DarkMode");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️ Mode clair";
  } else {
    toggleBtn.textContent = "🌙 Mode sombre";
  }
});




