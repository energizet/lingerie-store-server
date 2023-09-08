'use strict';

const Response = require('../Response');

class ItemController {
    #items = [
        {
            id: 1,
            title: 'Голубой комлпект белья',
            img: ['blueWhite_set_lingerie.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 1200,
            color: 'blue',
            option: {
                typeTop: [
                    {
                        value: 'classic',
                        label: 'Классический'
                    }, {
                        value: 'bralet',
                        label: 'Бралет'
                    },
                ],
                sizeTop: [
                    {
                        value: 'xs',
                        label: 'XS'
                    }, {
                        value: 's',
                        label: 'S'
                    }, {
                        value: 'm',
                        label: 'M'
                    }, {
                        value: 'l',
                        label: 'L'
                    },
                ],
                typeBottom: [
                    {
                        value: 'stringi',
                        label: 'Стринги'
                    }, {
                        value: 'stringiRegul',
                        label: 'Стринги на регуляторах'
                    }, {
                        value: 'brasilian',
                        label: 'Бразильяны'
                    }, {
                        value: 'brasilianRegul',
                        label: 'Бразильяны на регуляторах'
                    },
                ],
                sizeBottom: [
                    {
                        value: 'xs',
                        label: 'XS'
                    }, {
                        value: 's',
                        label: 'S'
                    }, {
                        value: 'm',
                        label: 'M'
                    }, {
                        value: 'l',
                        label: 'L'
                    },
                ]
            }
        }
        ,
        {
            id: 2,
            title: 'Персиковый комлпект белья',
            img: ['peach_set1.heic', 'peach_set2.heic', 'peach_set3.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 980,
            color: 'pink'
        },
        {
            id: 3,
            title: 'Розовые трусы(на регуляторах)',
            img: ['pink_underpants.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 550,
            color: 'pink'
        },
        {
            id: 4,
            title: 'Крсаный комплект белья',
            img: ['red_set_lingerie.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 1050,
            color: 'red'
        },
        {
            id: 5,
            title: 'Лифчики',
            img: ['redBlack-brssiere.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 340,
            color: 'red'
        },
        {
            id: 6,
            title: 'Белый комплект белья',
            img: ['white_set_lingerie1.heic', 'white_set_lingerie2.heic', 'white_set_lingerie3.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 1140,
            color: 'white'
        },
        {
            id: 7,
            title: 'Черный комплект белья',
            img: ['black_set.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 1140,
            color: 'black'
        },
        {
            id: 8,
            title: 'Розовый комплект белья',
            img: ['pink_set.heic'],
            desc: 'Тут какое-то краткое описание, материалы белья и прочее-прочее',
            price: 1140,
            color: 'pink'
        },
    ];

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