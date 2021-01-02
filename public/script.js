let urlParams = new URLSearchParams(window.location.search);
let query = urlParams.get('query');
let cities = urlParams.get('city');
let prices = urlParams.get('price');

$(document).ready(function() {
    if(prices) {
        num.value = prices.split(',')[1];
    } else {
        num.value = 350000; // Default value
    }

    $('select[name="city"]').select2();

    $(document.body).on('change','select[name="city"]', function(e) {
        selectedCities = $(this).select2("val");

        if(validCities(selectedCities) && validPrices(prices)) {
            if(cities == 'all') {
                if(selectedCities.includes('all')) {
                    selectedCities.splice(0, 1);
                }
            }
            
            if(selectedCities.includes('all')) {
                cities = 'all';
                selectedCities = 'all';
            }

            refreshData(query, selectedCities, prices);
        } else {
            cities = 'all';
            selectedCities = 'all';

            refreshData(query, selectedCities, prices);
        }
    });

    $(document.body).on('change','input[name="price"]', function() {
        prices = parseInt(prices.toString().split(',')[0]) + ',' + $(this).val();

        if(validCities(cities) && validPrices(prices)) {
            refreshData(query, cities, prices);
        }
    });
});

function validCities(cities) {
    let firstCity = cities.toString().split(',')[0];

    return firstCity;
}

function validPrices(prices) {
    let minPrice = parseInt(prices.toString().split(',')[0]);
    let maxPrice = parseInt(prices.toString().split(',')[1]);

    return maxPrice;
}

function refreshData(query, cities, prices) {
    let ext = '?query=' + query + '&city=' + cities + '&price=' + prices;

    window.location.href = window.location.pathname + ext;
}

// Search query
function search(e) {
    if(event.key === 'Enter') {
        refreshData(e.value, cities, prices);
    }
}