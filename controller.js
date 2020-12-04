const Feed = require('feed').Feed;
const scrapePazar3 = require('./scrapers/pazar3.js');
const scrapeReklama5 = require('./scrapers/reklama5.js');

/**
 * Get scraps from Pazar3 and Reklama5 based on parameters provided
 *
 * @param city - Cities array
 * @param price - Price range
 * @param rss - Return RSS feed data if true
 * @return {returnData}
 */
async function getScraps(city = 'ohrid,struga,tetovo,skopje', price = '10000,30000', rss = false) {
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

    // If RSS data is needed
    if(rss) {
        const feed = new Feed({
            title: "Bojans AH Feed",
            description: "Searching for real estate via Reklama5 & Pazar3",
            link: "https://bojanstojanovski.com/playground/ah-feed/",
            image: "https://bojanstojanovski.com/dist/img/portret.jpg",
            favicon: "https://bojanstojanovski.com/favicon.ico",
            copyright: "Content belongs to Reklama5 & Pazar3",
            author: {
                name: "Bojan Stojanovski",
                email: "me@bojanstojanovski.com",
                link: "https://bojanstojanovski.com/blog/projects/apartment-hunting-rss-feed/"
            }
        });

        returnData.forEach(function(oglas) {
            titleFormatted = (oglas.title + " - " + oglas.date + " - " + oglas.price + "€");
    
            feed.addItem({
                title: titleFormatted,
                link: oglas.url,
                description: oglas.price.toString(),
                content: oglas.date
            });
        });

        return feed;
    }
        
    return returnData;
}

module.exports = getScraps;