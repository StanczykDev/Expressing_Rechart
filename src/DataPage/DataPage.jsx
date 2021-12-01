import React, {useState, useEffect, useMemo} from "react";

import { TableWithButton } from "./Components/TableWithButton";

import { DataPageService } from "./DataPageService";
import {BaseTable} from "./Components/BaseTable";

const TABLES_IDS = {
    VALUES: "VALUES",
    ACTORS: "ACTORS"
};

const VALUES_BUTTON_TEXT = "Get random values";
const ACTORS_BUTTON_TEXT = "Get random actors";

export const DataPage = () => {
    const initialState = {
        valuesColumns: [],
        actorsColumns: [],
        valuesData: [],
        actorsData: []
    }

    const [state, setState] = useState(initialState);

    const getColumns = async id => {
        console.log("Getting columns")
        return await DataPageService.fetchColumns(id);
    };

    const getData = async () => {
        console.log("Getting data")
        return await DataPageService.fetchData();
    };

    useEffect(() => {
        const fetchTableData = async () => {
            const valuesColumns = await getColumns(TABLES_IDS.VALUES);
            const actorsColumns = await getColumns(TABLES_IDS.ACTORS);
            const { valuesData, actorsData } = await getData();

            setState(state => ({
                ...state, valuesColumns, actorsColumns, valuesData, actorsData
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

    const valuesTableProps = useMemo(() => deriveTableProps(TABLES_IDS.VALUES), [TABLES_IDS.VALUES]);
    const actorsTableProps = useMemo(() => deriveTableProps(TABLES_IDS.ACTORS), [TABLES_IDS.ACTORS]);


    return <div>
        <button onClick={setData}>Get Random Data</button>
        <BaseTable
            {...valuesTableProps}
        />
        <BaseTable
            {...actorsTableProps}
        />
    </div>;
}