// Fetch the countries data from the API
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        // Get the select control
        const countrySelect = document.getElementById('countrySelect');

        // Loop through the data and create an option for each country
        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2; // Using country code as the value
            option.textContent = country.name.common; // Using the common name of the country
            countrySelect.appendChild(option);
        });

        // Add event listener for when a country is selected
        countrySelect.addEventListener('change', (event) => {
            const countryCode = event.target.value;
            if (countryCode) {
                // Fetch and display country information
                fetchCountryInfo(countryCode);
            } else {
                clearCountryInfo();
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the country data:', error);
    });

// Function to fetch and display country information
function fetchCountryInfo(countryCode) {
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(response => response.json())
        .then(data => {
            const country = data[0];
            document.getElementById('countryInfo').classList.remove('hidden');
            document.getElementById('name').textContent = `Common Name: ${country.name.common}`;
            document.getElementById('officialName').textContent = `Official Name: ${country.name.official}`;
            document.getElementById('capital').textContent = `Capital: ${country.capital ? country.capital.join(', ') : 'N/A'}`;
            document.getElementById('region').textContent = `Region: ${country.region}`;
            document.getElementById('subregion').textContent = `Subregion: ${country.subregion || 'N/A'}`;
            document.getElementById('population').textContent = `Population: ${country.population.toLocaleString()}`;
            document.getElementById('languages').textContent = `Languages: ${Object.values(country.languages).join(', ')}`;
            document.getElementById('flag').src = country.flags.png;
            document.getElementById('flag').alt = `${country.name.common} flag`;
        })
        .catch(error => {
            console.error('Error fetching the country information:', error);
        });
}

// Function to clear country information
function clearCountryInfo() {
    document.getElementById('countryInfo').classList.add('hidden');
    document.getElementById('name').textContent = '';
    document.getElementById('officialName').textContent = '';
    document.getElementById('capital').textContent = '';
    document.getElementById('region').textContent = '';
    document.getElementById('subregion').textContent = '';
    document.getElementById('population').textContent = '';
    document.getElementById('languages').textContent = '';
    document.getElementById('flag').src = '';
    document.getElementById('flag').alt = '';
}
