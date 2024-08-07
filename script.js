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
    })
    .catch(error => {
        console.error('Error fetching the country data:', error);
    });
