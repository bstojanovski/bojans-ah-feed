const scrapePazar3 = require('./scrapers/pazar3.js');
const scrapeReklama5 = require('./scrapers/reklama5.js');

// Get the scraps
async function getScraps(city, price) {
    scrapPromises = [];
    returnData = [];

    let cities = [];
    if(city) {
        cities = city.split(',');
    } else {
        return 0;
    }

    let priceRange = [];
    if(price) {
        prices = price.split(',');
        priceRange = {from: prices[0], to: prices[1]};
    } else {
        priceRange = {from: '', to: ''};
    }

    // Get the scrap promises for each city
    cities.forEach(function(city) {
        // Scrape Pazar3
        scrapPromises.push(scrapePazar3(city, priceRange)
            .then(function data(e) {
                return e;
            })
        );

        // Scrape Reklmata5
        // City value mapping
        if(city == 'ohrid') {
            city = 305;
        } else if(city == 'struga') {
            city = 14;
        }
        scrapPromises.push(scrapeReklama5(city, priceRange)
            .then(function data(e) {
                return e;
            })
        );
    });

    // Run the promises
    promisesData = await Promise.all(scrapPromises).catch(error => console.log(`Error: ${error}`));

    // Fill up the array with data
    promisesData.forEach(function(oglasi) {
        oglasi.forEach(function(oglas) {
            if(oglas.date.startsWith("Денес") || oglas.date.startsWith("Вчера")) {
                returnData.unshift(oglas);
            } else {
                returnData.push(oglas);
            }
        });
    });
        
    return returnData;
}

module.exports = getScraps;