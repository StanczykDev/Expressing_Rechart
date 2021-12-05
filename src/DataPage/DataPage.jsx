import React, { useState, useEffect, useMemo } from "react";


import { DataPageService } from "./DataPageService";
import { BaseTable } from "./Components/BaseTable";
import { Graph } from "./Components/Graph";

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

    const getData = async (update = false) => {
        const response = await DataPageService.fetchData(update);

        return await response.json();
    };

    const fetchTableData = async (update = false) => {
        const valuesColumns = await getColumns(TABLES_IDS.VALUES);
        const actorsColumns = await getColumns(TABLES_IDS.ACTORS);
        const { valuesData, actorsData } = await getData(update);

        setState(state => ({
            ...state, valuesColumns, actorsColumns, valuesData, actorsData,
            requestCounter: state.requestCounter + 1
        }))
    }

    useEffect(() => {
        fetchTableData();

    }, [])

    const setData = async (update = false) => {
        const data = await getData(update);

        setState(state => ({...state, ...data, requestCounter: state.requestCounter + 1}));
    };

    const onRandomDataClick = async () => {
        await DataPageService.updateData();
        fetchTableData(true);
    }

    const deriveTableProps = id => ({
        columns: state[`${id.toLowerCase()}Columns`],
        data: state[`${id.toLowerCase()}Data`],
        requestCounter: state.requestCounter
    })

    const deriveGraphProps = () => state.actorsData.map((actor, index) => ({
                ...state.valuesData[index],
                ...actor,
                requestCounter: state.requestCounter
            }))



    const valuesTableProps = useMemo(() => deriveTableProps(TABLES_IDS.VALUES),
        [state.requestCounter]);
    const actorsTableProps = useMemo(() => deriveTableProps(TABLES_IDS.ACTORS),
        [state.requestCounter]);
    const graphProps = useMemo(() => deriveGraphProps(),
        [state.requestCounter]);

    return <div className="dataPageContainer">
        <button onClick={onRandomDataClick}>Get Random Data</button>
        <div className="tablesContainer">
            <BaseTable
                {...valuesTableProps}
            />
            <BaseTable
                {...actorsTableProps}
            />
        </div>
        <div className="graphContainer">
            <Graph actorsData={actorsTableProps.data} requestCounter={state.requestCounter} />
        </div>
    </div>;
}