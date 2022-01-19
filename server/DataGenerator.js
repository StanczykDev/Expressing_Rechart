const uuid4 = require('uuid4');
const { TABLES_IDS } = require('./consts/TablesIdentificators');

const ITEMS_QUANTITY_RANGE = [3, 5, 10];
const COLORS_RANGE = ["#DB2B39", "#29335C", "#F3A712", "#F0CEA0", "#534D41"];
const VALUE_1_MAX = 100;
const VALUE_1_MIN = 0;
const VALUE_2_MAX = 120;
const VALUE_2_MIN = 0;
const VALUE_3_MAX = 90;
const NAME_PREFIX = ["Lawful", "Neutral", "Chaotic"];
const NAME_POSTFIX = ["Good", "Neutral", "Evil"];

let currentMaxValue;



const getRandomColor = () => {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


const getRandomNumber = max => Math.floor(Math.random() * max);

const getActorName = index => {
    const actorNamePrefix = NAME_PREFIX[getRandomNumber(NAME_PREFIX.length)];
    const actorNamePostfix = NAME_POSTFIX[getRandomNumber(NAME_POSTFIX.length)];

    if (actorNamePrefix === actorNamePostfix) {
        return `True ${actorNamePostfix} ${index + 1}`;
    }

    return `${actorNamePrefix} ${actorNamePostfix} ${index + 1}`;
}

const getActor = index => {
    const actor = {
        actorName: "",
        actorColor: getRandomColor(),
        actorId: uuid4()
    };

    actor.actorName = getActorName(index);

    return actor
}

const getActorsData = quantity => {
    const actorsData = [];

    for (let index = 0; index < quantity; index += 1) {
        actorsData.push(getActor(index));
    }

    return actorsData;
}

const getValue = (actorId, pointsQuantity) => {
    const points = [];

    for (let i = 0; i < pointsQuantity; i++) {
        points.push(getRandomNumber(currentMaxValue));
    }

    return {
        points,
        actorId: actorId
    };
}

const getPieValues = actors => {
    const values = [];

    for (let actor of actors) {
        console.log(actor);
        values.push({
            name: actor.actorName,
            value: getRandomNumber(currentMaxValue),
            color: getRandomColor()
        })
    }

    return values;
}

const getValuesData = (quantity, actors, pointsQuantity) => {
    const valuesData = [];

    for (let index = 0; index < quantity; index += 1) {
        valuesData.push(getValue(actors[index].actorId, pointsQuantity));
    }

    return valuesData;
}

const getPieValuesData = (actors, pointsQuantity) => {
    const pieValuesData = [];

    for (let index = 0; index < pointsQuantity; index += 1) {
        pieValuesData.push({
            data: getPieValues(actors),
            color: getRandomColor()
        });
    }

    return pieValuesData;
}

const getData = (pointsQuantity,
                 itemsQuantity = ITEMS_QUANTITY_RANGE[getRandomNumber(ITEMS_QUANTITY_RANGE.length)],
                 maxValue = VALUE_1_MAX) => {
    currentMaxValue = maxValue;
    const actorsData = getActorsData(itemsQuantity);
    const valuesData = getValuesData(itemsQuantity, actorsData, pointsQuantity);

    return {
        [TABLES_IDS.ACTORS]: actorsData,
        [TABLES_IDS.VALUES]: valuesData,
    }
}

const getPieData = ( pointsQuantity,
                 itemsQuantity = ITEMS_QUANTITY_RANGE[getRandomNumber(ITEMS_QUANTITY_RANGE.length)],
                 maxValue = VALUE_1_MAX) => {
    currentMaxValue = maxValue;
    const actorsData = getActorsData(itemsQuantity);
    return getPieValuesData(actorsData, pointsQuantity);
}

const getScatterData = (pointsQuantity, actorsQuantity, maxValue = VALUE_1_MAX) => {
    const data = [];

    for (let i = 0; i < actorsQuantity; i++) {
        data.push([]);

        for (let j = 0; j < pointsQuantity; j++) {
            data[i].push({
                x: getRandomNumber(maxValue),
                y: getRandomNumber(maxValue),
                z: getRandomNumber(maxValue)
            })
        }
    }

    return data;
}

module.exports = {
    getRandomData: getData,
    getRandomPieData: getPieData,
    getRandomNumber,
    getRandomColor,
    getScatterData,
    VALUE_1_MAX
}
