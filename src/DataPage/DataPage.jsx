import React, {useState, useEffect, useMemo} from "react";


import { DataPageService } from "./DataPageService";
import { BaseTable } from "./Components/BaseTable";

const TABLES_IDS = {
    VALUES: "VALUES",
    ACTORS: "ACTORS"
};

import "./DataPage.css";

const VALUES_BUTTON_TEXT = "Get random values";
const ACTORS_BUTTON_TEXT = "Get random actors";

export const DataPage = () => {
    const initialState = {
        valuesColumns: [],
        actorsColumns: [],
        valuesData: [],
        actorsData: [],
        requestCounter: 0
    }

    const [state, setState] = useState(initialState);

    const getColumns = async id => {
        const response = await DataPageService.fetchColumns(id);

        return (await response.json()).columns;
    };

    const getData = async () => {
        const response = await DataPageService.fetchData();

        return await response.json();
    };

    useEffect(() => {
        const fetchTableData = async () => {
            const valuesColumns = await getColumns(TABLES_IDS.VALUES);
            const actorsColumns = await getColumns(TABLES_IDS.ACTORS);
            const { valuesData, actorsData } = await getData();

            setState(state => ({
                ...state, valuesColumns, actorsColumns, valuesData, actorsData,
                 requestCounter: state.requestCounter + 1
            }))
        }

        fetchTableData();

    }, [])

    const setData = async () => {
        const data = await getData();

        setState(state => ({...state, ...data}));
    };

    const deriveTableProps = id => ({
        columns: state[`${id.toLowerCase()}Columns`],
        data: state[`${id.toLowerCase()}Data`]
    })

    const valuesTableProps = useMemo(() => deriveTableProps(TABLES_IDS.VALUES),
        [state.requestCounter]);
    const actorsTableProps = useMemo(() => deriveTableProps(TABLES_IDS.ACTORS),
        [state.requestCounter]);

    console.log(valuesTableProps);
    console.log(actorsTableProps);

    return <div>
        <button onClick={setData}>Get Random Data</button>
        <div className="tablesContainer">
            <BaseTable
                {...valuesTableProps}
            />
            <BaseTable
                {...actorsTableProps}
            />
        </div>
    </div>;
}