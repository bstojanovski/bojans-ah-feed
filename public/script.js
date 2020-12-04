$(document).ready(function() {
    let urlParams = new URLSearchParams(window.location.search);
    let cities = urlParams.get('city');
    let prices = urlParams.get('price');

    if(prices) {
        num.value = prices.split(',')[1];
    } else {
        num.value = 350000;
    }

    $('select[name="city"]').select2();

    $(document.body).on('change','select[name="city"]', function(e) {
        cities = $(this).select2("val");

        if(validCities(cities) && validPrices(prices)) {
            refreshData(cities, prices);
        }
    });

    $(document.body).on('change','input[name="price"]', function() {
        prices = '10000,' +$(this).val();

        if(validCities(cities) && validPrices(prices)) {
            refreshData(cities, prices);
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

function refreshData(cities, prices) {
    let ext = '?city=' + cities + '&price=' + prices;

    window.location.href = window.location.pathname + ext;
}