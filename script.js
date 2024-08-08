document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect');
    const countryDetailsSection = document.getElementById('countryDetailsSection');
    const comparisonContainer = document.getElementById('comparisonContainer');
    
    let countries = [];
    let languages = [];
    let currencies = [];

    // Fetch countries data
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            countries = data;
            populateCountrySelect();
            populateFilters();
        })
        .catch(error => showToast(`Error fetching countries: ${error.message}`));

    // Populate country select
    function populateCountrySelect() {
        countrySelect.innerHTML = '<option value="" disabled selected>Select a country</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca3;
            option.textContent = country.name.common;
            countrySelect.appendChild(option);
        });
    }

    // Populate filter selects
    function populateFilters() {
        const languageFilter = document.getElementById('languageFilter');
        const currencyFilter = document.getElementById('currencyFilter');

        // Populate languages filter
        languageFilter.innerHTML = '<option value="" disabled selected>Filter by Language</option>';
        languageFilter.innerHTML += '<option value="">All Languages</option>'; // Add "All Languages" option
        languages = [...new Set(countries.flatMap(country => Object.values(country.languages || {})))];
        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        });

        // Populate currencies filter
        currencyFilter.innerHTML = '<option value="" disabled selected>Filter by Currency</option>';
        currencyFilter.innerHTML += '<option value="">All Currencies</option>'; // Add "All Currencies" option
        currencies = [...new Set(countries.flatMap(country => Object.values(country.currencies || {}).map(currency => currency.name)))];
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            currencyFilter.appendChild(option);
        });
    }

    // Handle country selection
    countrySelect.addEventListener('change', event => {
        const countryCode = event.target.value;
        const country = countries.find(c => c.cca3 === countryCode);

        if (country) {
            displayCountryDetails(country);
        } else {
            showToast('Country not found.');
        }
    });

    // Display country details
    function displayCountryDetails(country) {
        const commonName = document.getElementById('commonName');
        const officialName = document.getElementById('officialName');
        const capital = document.getElementById('capital');
        const region = document.getElementById('region');
        const population = document.getElementById('population');
        const languages = document.getElementById('languages');
        const currencies = document.getElementById('currencies');
        const flag = document.getElementById('flag');

        commonName.textContent = country.name.common;
        officialName.textContent = country.name.official;
        capital.textContent = country.capital ? country.capital.join(', ') : 'N/A';
        region.textContent = country.region;
        population.textContent = country.population.toLocaleString();
        languages.textContent = Object.values(country.languages || {}).join(', ');
        currencies.textContent = Object.values(country.currencies || {}).map(c => c.name).join(', ');
        flag.src = country.flags.svg;
    }

    // Show toast notifications
    function showToast(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: "#333", // Background color
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function(){} // Callback after click
        }).showToast();
    }

    // Filter and display comparison section
    const languageFilter = document.getElementById('languageFilter');
    const currencyFilter = document.getElementById('currencyFilter');

    languageFilter.addEventListener('change', updateComparison);
    currencyFilter.addEventListener('change', updateComparison);

    function updateComparison() {
        const selectedLanguage = languageFilter.value;
        const selectedCurrency = currencyFilter.value;

        const filteredCountries = countries.filter(country => {
            const countryLanguages = Object.values(country.languages || {});
            const countryCurrencies = Object.values(country.currencies || {}).map(c => c.name);

            return (selectedLanguage === '' || selectedLanguage === undefined || countryLanguages.includes(selectedLanguage)) &&
                   (selectedCurrency === '' || selectedCurrency === undefined || countryCurrencies.includes(selectedCurrency));
        });

        displayComparison(filteredCountries);
    }

    function displayComparison(countries) {
        comparisonContainer.innerHTML = '';

        countries.forEach(country => {
            const countryDiv = document.createElement('div');
            countryDiv.classList.add('country-details');

            countryDiv.innerHTML = `
                <div class="info">
                    <p><strong>Common Name:</strong> ${country.name.common}</p>
                    <p><strong>Official Name:</strong> ${country.name.official}</p>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'N/A'}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
                    <p><strong>Currencies:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
                </div>
                <div class="flag-container">
                    <img src="${country.flags.svg}" alt="${country.name.common} Flag">
                </div>
            `;

            comparisonContainer.appendChild(countryDiv);
        });
    }
});
