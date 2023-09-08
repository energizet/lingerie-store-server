'use strict';

const Response = require('../Response');
const fs = require("fs");
const path = require("path");

class ItemController {
    #items;

    constructor() {
        let baseUrl = `${process.env.SSL === 'true' ? 'https' : 'http'}://${process.env.ADDRESS}:${process.env.PORT}`;

        let itemsPath = path.join(__dirname, 'items.json');
        let itemsJson = fs.readFileSync(itemsPath)
            .toString();
        this.#items = JSON.parse(itemsJson ?? '[]');

        for (const item of this.#items) {
            item.img = item.img?.map(img => {
                if (img[0] === '/') {
                    return baseUrl + img;
                }
                return img;
            });
        }
    }

    async getItems() {
        return Response.ok(this.#items);
    }

    async getItem(id) {
        let item = this.#items.find(item => item.id === +id);
        if (item == null) {
            return Response.error(404, `Item with id(${id}) not found`);
        }
        return Response.ok(item);
    }
}

module.exports = new ItemController();