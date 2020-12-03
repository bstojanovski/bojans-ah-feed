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
app.get(path + 'rss', (req, res) => {
    getScraps(req.query.city, req.query.price, true)
        .then(data => {
            res.set('Content-Type', 'application/rss+xml').send(data.rss2());
        })
});
app.get(path, (req, res) => {
    getScraps(req.query.city, req.query.price)
        .then(data => {
            res.render("index", {
                title: "Bojan's AH Feed", 
                path: path,
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
app.listen(port, () => console.log('The feed is up and running on http://localhost:' + port));