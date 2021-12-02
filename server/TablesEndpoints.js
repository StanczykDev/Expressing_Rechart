const TablesIdentificators = require("./consts/TablesIdentificators");
const TablesColumns = require("./TablesColumns");
const DataGenerator = require("./DataGenerator")

const { TABLES_IDS } = TablesIdentificators;
const { COLUMNS } = TablesColumns;

const ENDPOINTS = [
    {
        method: "get",
        endpoint: "/api/tablesData",
        callback: (req, res, data) => {
            res.json({
                valuesData: data[TABLES_IDS.VALUES],
                actorsData: data[TABLES_IDS.ACTORS]
            });
        }
    },
    {
        method: "get",
        endpoint: `/api/${TABLES_IDS.VALUES}/columns`,
        callback: (req, res) => {
            res.json({
                columns: COLUMNS[TABLES_IDS.VALUES]
            });
        }
    },
    {
        method: "get",
        endpoint: `/api/${TABLES_IDS.ACTORS}/columns`,
        callback: (req, res) => {
            res.json({
                columns: COLUMNS[TABLES_IDS.ACTORS]
            });
        }
    }
]

module.exports = {
    ENDPOINTS
}