import React, { useState, useEffect } from "react";

import { TableWithButton } from "./Components/TableWithButton";

import { DataPageService } from "./DataPageService";

import { TABLES_IDS } from "../../consts/TablesIdentificators";


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
        return await DataPageService.fetchColumns(id);
    };

    const getData = async id => {
        return await DataPageService.fetchData(id);
    };

    useEffect(async () => {
        const valuesColumns = await getColumns(TABLES_IDS.VALUES);
        const actorsColumns = await getColumns(TABLES_IDS.ACTORS);
        const valuesData = await getData(TABLES_IDS.VALUES);
        const actorsData = await getData(TABLES_IDS.ACTORS);

        setState({
            valuesColumns, actorsColumns, valuesData, actorsData
        })
    })

    const setValuesData = async () => {
        const valuesData = await getData(TABLES_IDS.VALUES);

        setState({...state, valuesData});
    };


    const setActorsData = async () => {
        const actorsData = await getData(TABLES_IDS.ACTORS);

        setState({...state, actorsData});
    }

    const deriveTableProps = id => ({
        columns: state[`${id.toLowerCase()}Columns`],
        data: state[`${id.toLowerCase()}Data`]
    })


    return <div>
        <TableWithButton
            key={0}
            buttonCallback = {setValuesData}
            buttonText = {VALUES_BUTTON_TEXT}
            tableProps = {deriveTableProps(TABLES_IDS.VALUES)}
        />
        <TableWithButton
            key={1}
            buttonCallback = {setActorsData}
            buttonText = {ACTORS_BUTTON_TEXT}
            tableProps = {deriveTableProps(TABLES_IDS.ACTORS)}
        />
    </div>;
}