const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const getScraps = require('./controller.js');
let path = '/';

if(env == 'production') {
    path = '/playground/ah-feed/'; // The path I use on my server
}

app.set('view engine', 'pug');
app.use(path, express.static('public'));
app.get(path, (req, res) => {
    let city = req.query.city;
    let price = req.query.price;
    let sortby = req.query.sortby;
    let citiesListTranslation = {
        tetovo: 'Тетово',
        ohrid: 'Охрид',
        struga: 'Струга',
        skopje: 'Скопје',
        gostivar: 'Гостивар',
        veles: 'Велес',
        prilep: 'Прилеп',
        bitola: 'Битола',
        kumanovo: 'Куманово',
        svetinikole: 'Свети Николе',
        strumica: 'Струмица',
        kavadarci: 'Кавадарци',
        kocani: 'Кочани',
        kicevo: 'Кичево',
        radovis: 'Радовиш',
        gevgelija: 'Гевгелија',
        debar: 'Дебар',
        krivapalanka: 'Крива Паланка',
        negotino: 'Неготино',
        delcevo: 'Делчево',
        vinica: 'Виница',
        resen: 'Ресен',
        stip: 'Штип',
        probistip: 'Пробиштип',
        berovo: 'Берово',
        krusevo: 'Крушево',
        valandovo: 'Валандово'
    }

    // Redirect to default values
    if(city == undefined) {
        res.redirect('?city=struga,ohrid&price=10000,35000');
    }

    getScraps(city, price, sortby)
        .then(data => {
            res.render("index", {
                title: "Bojan's AH Feed", 
                path: path,
                selectedCities: city,
                priceRange: price,
                citiesListTranslation: citiesListTranslation,
                scraps: data
            })
        })
        .catch(e => {
            res.status(500, {
                error: e
            });
        })
        .catch((e) => {
            console.log(e);
        });
});
app.get(path + 'rss', (req, res) => {
    getScraps(req.query.city, req.query.price, req.query.sortby, true)
        .then(data => {
            res.set('Content-Type', 'application/rss+xml').send(data.rss2());
        })
        .catch(e => {
            res.status(500, {
                error: e
            });
        })
        .catch((e) => {
            console.log(e);
        });
});
app.listen(port, () => console.log('The feed is up and running on http://localhost:' + port));