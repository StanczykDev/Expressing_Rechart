import { TABLES_IDS } from "../consts/TablesIdentificators";

export const TablesEndpoints = [
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