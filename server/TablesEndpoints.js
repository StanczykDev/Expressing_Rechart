const TableIdentificators = require("./consts/TablesIdentificators");

const TABLES_IDS = TableIdentificators.TABLES_IDS;

const ENDPOINTS = [
    {
        method: "get",
        endpoint: `/${TABLES_IDS.VALUES}/data`,
        callback: (req, res) => {
            res.json({
                values: []
            });
        }
    },
    {
        method: "get",
        endpoint: `/${TABLES_IDS.ACTORS}/data`,
        callback: (req, res) => {
            res.json({
                values: []
            });
        }
    }
]

module.exports = {
    ENDPOINTS
}