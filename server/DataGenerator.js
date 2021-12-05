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



const getRandomColor = () => {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


const getRandomNumber = max => Math.floor(Math.random() * max);

const getActor = index => {
    const actor = {
        actorName: "",
        actorColor: getRandomColor(),
        actorId: uuid4()
    };

    const actorNamePrefix = NAME_PREFIX[getRandomNumber(NAME_PREFIX.length)];
    const actorNamePostfix = NAME_POSTFIX[getRandomNumber(NAME_POSTFIX.length)];

    if (actorNamePrefix === actorNamePostfix) {
        actor.actorName = `True ${actorNamePostfix} ${index + 1}`;
    } else {
        actor.actorName = `${actorNamePrefix} ${actorNamePostfix} ${index + 1}`;
    }

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
        points.push(getRandomNumber(VALUE_1_MAX));
    }

    return {
        points,
        actorId: actorId
    };
}


const getValuesData = (quantity, actors, pointsQuantity) => {
    const valuesData = [];

    for (let index = 0; index < quantity; index += 1) {
        valuesData.push(getValue(actors[index].actorId, pointsQuantity));
    }

    return valuesData;
}

const getData = pointsQuantity => {
    const itemsQuantity = ITEMS_QUANTITY_RANGE[getRandomNumber(ITEMS_QUANTITY_RANGE.length)];

    const actorsData = getActorsData(itemsQuantity);
    const valuesData = getValuesData(itemsQuantity, actorsData, pointsQuantity);

    return {
        [TABLES_IDS.ACTORS]: actorsData,
        [TABLES_IDS.VALUES]: valuesData,
    }
}

module.exports = {
    getRandomData: getData,
    getRandomNumber
}
