const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Feed = require('feed').Feed;

const scrapePazar3 = require('./scrapers/pazar3.js');
const scrapeReklama5 = require('./scrapers/reklama5.js');

const feed = new Feed({
    title: "Bojans AH Feed",
    description: "Searching for apartments in Ohrid and Struga via Reklama5 & Pazar3",
    link: "https://bojans-ah-feed.herokuapp.com/",
    image: "https://bojanstojanovski.com/dist/img/portret.jpg",
    favicon: "https://bojanstojanovski.com/favicon.ico",
    copyright: "Content belongs to Reklama5 & Pazar3",
    author: {
        name: "Bojan Stojanovski",
        email: "me@bojanstojanovski.com",
        link: "https://bojanstojanovski.com/blog/projects/apartment-hunting-rss-feed/"
    }
});

// Get the scraps
scraps = [];
renderData = [];
let citiesReklama5 = [305, 14];
let citiesPazar3 = ['ohrid', 'struga'];
let priceRange = {from: 10000, to: 35000};

citiesPazar3.forEach(function(city) {
    scraps.push(scrapePazar3(city, priceRange));
});

citiesReklama5.forEach(function(city) {
    scraps.push(scrapeReklama5(city, priceRange));
});

// Build the RSS feed
scraps.forEach(function(promise) {
    promise
        .then((data) => {
            data.forEach(oglas => {
                titleFormatted = (oglas.title + " - " + oglas.date + " - " + oglas.price + "€");
    
                feed.addItem({
                    title: titleFormatted,
                    link: oglas.url,
                    description: oglas.price.toString(),
                    content: oglas.date
                });

                if(oglas.date.startsWith("Денес") || oglas.date.startsWith("Вчера")) {
                    renderData.unshift(oglas);
                } else {
                    renderData.push(oglas);
                }
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

app.set('view engine', 'pug');
app.get('/', (req, res) => res.set('Content-Type', 'application/rss+xml').send(feed.rss2()));
app.get('/render', (req, res) => res.render("index", { title: "Bojan's AH Feed", scraps: renderData }));
app.use(express.static('public'));
app.listen(port, () => console.log('The feed is up and running on http://localhost:' + port));