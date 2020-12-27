// Oglas class
class Oglas {
    constructor(source, url, img, date, title, price, city) {
        this.source = source;
        this.url = url;
        this.img = img;
        this.date = date;
        this.title = title;
        this.price = price;
        this.city = city;
    }

    checkConditions(priceRange) {
        let rentWords = ['издава', 'izdava', 'издавам', 'izdavam'];
        return (!rentWords.some(word => this.title.toLowerCase().includes(word)) && this.price >= priceRange.from && this.price <= priceRange.to);
    }
}

module.exports = Oglas;