// Oglas class
class Oglas {
    constructor(url, img, date, title, price) {
        this.url = url;
        this.img = img;
        this.date = date;
        this.title = title;
        this.price = price;
    }

    get conditions() {
        return this.checkConditions();
    }

    checkConditions() {
        let rentWords = ['издава', 'izdava', 'издавам', 'izdavam'];
        return (!rentWords.some(word => this.title.toLowerCase().includes(word)) && this.price <= 35000 && this.price > 10000);
    }
}

module.exports = Oglas;