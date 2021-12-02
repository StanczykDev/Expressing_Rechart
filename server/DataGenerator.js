const uuid4 = require('uuid4');
const { TABLES_IDS } = require('./consts/TablesIdentificators');

const ITEMS_QUANTITY_RANGE = [10, 50, 100];
const COLORS_RANGE = ["RED", "BLUE", "GREEN", "INDIGO", "BLACK"];
const VALUE_1_MAX = 1000;
const VALUE_1_MIN = 0;
const VALUE_2_MAX = 1000;
const VALUE_2_MIN = 0;
const NAME_PREFIX = ["Lawful", "Neutral", "Chaotic"];
const NAME_POSTFIX = ["Good", "Neutral", "Evil"];

const getRandomNumber = max => Math.floor(Math.random() * max);

const getActor = () => {
    const actor = {
        actorName: "",
        actorColor: COLORS_RANGE[getRandomNumber(COLORS_RANGE.length)],
        actorId: uuid4()
    };

    const actorNamePrefix = NAME_PREFIX[getRandomNumber(NAME_PREFIX.length)];
    const actorNamePostfix = NAME_POSTFIX[getRandomNumber(NAME_POSTFIX.length)];

    if (actorNamePrefix === actorNamePostfix) {
        actor.actorName = `True ${actorNamePostfix}`;
    } else {
        actor.actorName = `${actorNamePrefix} ${actorNamePostfix}`;
    }

    console.log(actor);

    return actor
}

const getActorsData = quantity => {
    const actorsData = [];

    console.log(quantity);

    for (let index = 0; index < quantity; index += 1) {
        actorsData.push(getActor());
    }

    return actorsData;
}

const getValue = actorId => ({
    valueOne: getRandomNumber(VALUE_1_MAX),
    valueTwo: getRandomNumber(VALUE_2_MAX),
    actorId: actorId
})

const getValuesData = (quantity, actors) => {
    const valuesData = [];

    for (let index = 0; index < quantity; index += 1) {
        valuesData.push(getValue(actors[index].actorId));
    }

    return valuesData;
}

const getData = () => {
    const itemsQuantity = ITEMS_QUANTITY_RANGE[getRandomNumber(ITEMS_QUANTITY_RANGE.length)];

    const actorsData = getActorsData(itemsQuantity);
    const valuesData = getValuesData(itemsQuantity, actorsData);

    return {
        [TABLES_IDS.ACTORS]: actorsData,
        [TABLES_IDS.VALUES]: valuesData
    }
}

module.exports = {
    getRandomData: getData
}
