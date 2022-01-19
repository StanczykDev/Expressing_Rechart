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

const initialTreeData = [
    {
        "name": "axis",
        "children": [
            {
                "name": "Axis",
                "size": 24593
            },
            {
                "name": "Axes",
                "size": 1302
            },
            {
                "name": "AxisGridLine",
                "size": 652
            },
            {
                "name": "AxisLabel",
                "size": 636
            },
            {
                "name": "CartesianAxes",
                "size": 6703
            }
        ]
    },
    {
        "name": "controls",
        "children": [
            {
                "name": "TooltipControl",
                "size": 8435
            },
            {
                "name": "SelectionControl",
                "size": 7862
            },
            {
                "name": "PanZoomControl",
                "size": 5222
            },
            {
                "name": "HoverControl",
                "size": 4896
            },
            {
                "name": "ControlList",
                "size": 4665
            },
            {
                "name": "ClickControl",
                "size": 3824
            },
            {
                "name": "ExpandControl",
                "size": 2832
            },
            {
                "name": "DragControl",
                "size": 2649
            },
            {
                "name": "AnchorControl",
                "size": 2138
            },
            {
                "name": "Control",
                "size": 1353
            },
            {
                "name": "IControl",
                "size": 763
            }
        ]
    },
    {
        "name": "data",
        "children": [
            {
                "name": "Data",
                "size": 20544
            },
            {
                "name": "NodeSprite",
                "size": 19382
            },
            {
                "name": "DataList",
                "size": 19788
            },
            {
                "name": "DataSprite",
                "size": 10349
            },
            {
                "name": "EdgeSprite",
                "size": 3301
            },
            {
                "name": "render",
                "children": [
                    {
                        "name": "EdgeRenderer",
                        "size": 5569
                    },
                    {
                        "name": "ShapeRenderer",
                        "size": 2247
                    },
                    {
                        "name": "ArrowType",
                        "size": 698
                    },
                    {
                        "name": "IRenderer",
                        "size": 353
                    }
                ]
            },
            {
                "name": "ScaleBinding",
                "size": 11275
            },
            {
                "name": "TreeBuilder",
                "size": 9930
            },
            {
                "name": "Tree",
                "size": 7147
            }
        ]
    },
    {
        "name": "events",
        "children": [
            {
                "name": "DataEvent",
                "size": 7313
            },
            {
                "name": "SelectionEvent",
                "size": 6880
            },
            {
                "name": "TooltipEvent",
                "size": 3701
            },
            {
                "name": "VisualizationEvent",
                "size": 2117
            }
        ]
    },
    {
        "name": "legend",
        "children": [
            {
                "name": "Legend",
                "size": 20859
            },
            {
                "name": "LegendRange",
                "size": 10530
            },
            {
                "name": "LegendItem",
                "size": 4614
            }
        ]
    },
    {
        "name": "operator",
        "children": [
            {
                "name": "distortion",
                "children": [
                    {
                        "name": "Distortion",
                        "size": 6314
                    },
                    {
                        "name": "BifocalDistortion",
                        "size": 4461
                    },
                    {
                        "name": "FisheyeDistortion",
                        "size": 3444
                    }
                ]
            },
            {
                "name": "encoder",
                "children": [
                    {
                        "name": "PropertyEncoder",
                        "size": 4138
                    },
                    {
                        "name": "Encoder",
                        "size": 4060
                    },
                    {
                        "name": "ColorEncoder",
                        "size": 3179
                    },
                    {
                        "name": "SizeEncoder",
                        "size": 1830
                    },
                    {
                        "name": "ShapeEncoder",
                        "size": 1690
                    }
                ]
            },
            {
                "name": "filter",
                "children": [
                    {
                        "name": "FisheyeTreeFilter",
                        "size": 5219
                    },
                    {
                        "name": "VisibilityFilter",
                        "size": 3509
                    },
                    {
                        "name": "GraphDistanceFilter",
                        "size": 3165
                    }
                ]
            },
            {
                "name": "IOperator",
                "size": 1286
            },
            {
                "name": "label",
                "children": [
                    {
                        "name": "Labeler",
                        "size": 9956
                    },
                    {
                        "name": "RadialLabeler",
                        "size": 3899
                    },
                    {
                        "name": "StackedAreaLabeler",
                        "size": 3202
                    }
                ]
            },
            {
                "name": "layout",
                "children": [
                    {
                        "name": "RadialTreeLayout",
                        "size": 12348
                    },
                    {
                        "name": "NodeLinkTreeLayout",
                        "size": 12870
                    },
                    {
                        "name": "CirclePackingLayout",
                        "size": 12003
                    },
                    {
                        "name": "CircleLayout",
                        "size": 9317
                    },
                    {
                        "name": "TreeMapLayout",
                        "size": 9191
                    },
                    {
                        "name": "StackedAreaLayout",
                        "size": 9121
                    },
                    {
                        "name": "Layout",
                        "size": 7881
                    },
                    {
                        "name": "AxisLayout",
                        "size": 6725
                    },
                    {
                        "name": "IcicleTreeLayout",
                        "size": 4864
                    },
                    {
                        "name": "DendrogramLayout",
                        "size": 4853
                    },
                    {
                        "name": "ForceDirectedLayout",
                        "size": 8411
                    },
                    {
                        "name": "BundledEdgeRouter",
                        "size": 3727
                    },
                    {
                        "name": "IndentedTreeLayout",
                        "size": 3174
                    },
                    {
                        "name": "PieLayout",
                        "size": 2728
                    },
                    {
                        "name": "RandomLayout",
                        "size": 870
                    }
                ]
            },
            {
                "name": "OperatorList",
                "size": 5248
            },
            {
                "name": "OperatorSequence",
                "size": 4190
            },
            {
                "name": "OperatorSwitch",
                "size": 2581
            },
            {
                "name": "Operator",
                "size": 2490
            },
            {
                "name": "SortOperator",
                "size": 2023
            }
        ]
    }
]
let treeData = initialTreeData;

const initialSankeyData = {
    "nodes": [
        {
            "name": "Visit"
        },
        {
            "name": "Direct-Favourite"
        },
        {
            "name": "Page-Click"
        },
        {
            "name": "Detail-Favourite"
        },
        {
            "name": "Lost"
        }
    ],
    "links": [
        {
            "source": 0,
            "target": 1,
            "value": 3728.3
        },
        {
            "source": 0,
            "target": 2,
            "value": 354170
        },
        {
            "source": 2,
            "target": 3,
            "value": 62429
        },
        {
            "source": 2,
            "target": 4,
            "value": 291741
        }
    ]
};
let sankeyData = initialSankeyData;



function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

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

    treeData = shuffle(initialTreeData);

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
    treeData,
    sankeyData,
    VALUE_1_MAX
}
