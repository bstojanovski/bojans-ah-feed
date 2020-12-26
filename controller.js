const Feed = require('feed').Feed;
const e = require('express');
const scrapePazar3 = require('./scrapers/pazar3.js');
const scrapeReklama5 = require('./scrapers/reklama5.js');
var moment = require('moment'); // require
moment().format(); 

/**
 * Get scraps from Pazar3 and Reklama5 based on parameters provided
 *
 * @param city - Cities array
 * @param price - Price range
 * @param rss - Return RSS feed data if true
 * @return {returnData}
 */
async function getScraps(city = 'ohrid,struga,tetovo,skopje', price = '10000,30000', sortby = 'date', rss = false) {
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
            moment.locale('mk');

            // Get date from scraps
            if(oglas.date.startsWith("Денес")) {
                let time = moment(oglas.date, ' H:mm');
                let momentDate = moment(time);
                oglas.date = momentDate;
            } else if(oglas.date.startsWith("Вчера")) {
                let time = moment(oglas.date, ' H:mm');
                let momentDate = moment(time).add(-1, 'days');
                oglas.date = momentDate;
            } else {
                let momentDate = moment(oglas.date, 'DD MMMM H:mm');
                oglas.date = momentDate;
            }

            returnData.push(oglas);
        });
    });

    // Sort the array using sortby parameter (date or price)
    returnData.sort((a, b) => b[sortby] - a[sortby]);

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
            let titleFormatted = (oglas.title + " - " + oglas.price + "€");
            let date = oglas.date;

            feed.addItem({
                title: titleFormatted,
                id: oglas.url,
                link: oglas.url,
                content: date.format('llll') + ' - ' + oglas.price.toString(),
                pubDate: date.format('YYYY-MM-DD H:mm:ss')
            });
        });

        return feed;
    }
        
    return returnData;
}

module.exports = getScraps;