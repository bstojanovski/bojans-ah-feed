const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cheerio = require('cheerio');
const request = require('request');
const Feed = require('feed').Feed;

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
      link: "https://bojanstojanovski.com"
    }
});

// Reklama5
//
// Define IDs of cities
// Ohrid = 305
// Struga = 14
let citiesReklama5 = [305, 14];

// Reklama5 requests
citiesReklama5.forEach(cityID => {
    request({method: 'GET', url: 'http://www.reklama5.mk/Search?q=&city='+ cityID +'&sell=0&sell=1&buy=0&rent=0&includeforrent=0&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&f45_from=&f45_to=&f46_from=&f46_to=&priceFrom=10000&priceTo=35000&f48_from=&f48_to=&f47=&f10029=&f10030=&f10040=&private=0&company=0&page=1&SortByPrice=0&zz=1&cat=159'}, (err, res, body) => {
        if (err) return console.error(err);
        let $ = cheerio.load(body);
        let data = $('.OglasResults');
    
        $(data).each(function(i) {
            let oglas = []; // oglas = classified ad
            oglas.url = 'https://www.reklama5.mk' + $(this).find('.text-left.text-info a').attr('href');
            oglas.date = $(this).find('.adDate').text();
            oglas.title = $(this).find('.SearchAdTitle').text().substr(1);
            oglas.price = parseInt($(this).find('.text-left.text-success').text().replace('.', ''));
    
            // Check conditions
            if(oglas.price < 35000 && oglas.price > 10000) {
                // Add feed
                feed.addItem({
                    title: oglas.title + " - " + oglas.date,
                    link: oglas.url,
                    description: oglas.price.toString(),
                    content: oglas.date.toString()
                });
            }
        });
    });
});

// Pazar3
// 
// Define IDs of cities
// Ohrid = ohrid
// Struga = struga
let citiesPazar3 = ["ohrid", "struga"];

// Reklama5 requests
citiesPazar3.forEach(function(cityID) {
    request({method: 'GET', url: 'https://www.pazar3.mk/oglasi/zivealista/stanovi/se-prodava/'+ cityID +'?PriceFrom=10000&PriceTo=35000'}, (err, res, body) => {
        if (err) return console.error(err);
        let $ = cheerio.load(body);
        let data = $('.row-listing');

        $(data).each(function() {
            let oglas = []; // oglas = classified ad
            oglas.url = 'https://www.pazar3.mk' + $(this).find('.title h2 a').attr('href');
            oglas.date = $(this).find('.title .pull-right.text-right').text();
            oglas.title = $(this).find('.title h2 a').text();
            oglas.price = parseInt($(this).find('.title .list-price').text().replace(' ', ''));
    
            // Check conditions
            if(oglas.price < 35000 && oglas.price > 10000) {
                // Add feed
                feed.addItem({
                    title: oglas.title + " - " + oglas.date,
                    link: oglas.url,
                    description: oglas.price.toString(),
                    content: oglas.date.toString()
                });
            }
        });
    });
});

app.get('/', (req, res) => res.set('Content-Type', 'application/rss+xml').send(feed.rss2()));
app.listen(port, () => console.log('The feed is up and running!'));