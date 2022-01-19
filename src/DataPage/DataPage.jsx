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

export const GRAPH_TYPES = ['line', 'area', 'bar', 'pie', 'radar', 'radialBar', 'funnel', 'scatter'];

export const DataPage = () => {
    const initialState = {
        valuesColumns: [],
        actorsColumns: [],
        valuesData: [],
        actorsData: [],
        requestCounter: 0,
        graphType: GRAPH_TYPES[0]
    }

    const [state, setState] = useState(initialState);
    const [dataForm, setDataForm] = useState({
        maxValue: 150
    })

    const setGraphType = async graphType => {
        console.log(graphType);
        console.log("1", state.graphType);
        await setState(state => ({
            ...state,
            graphType
        }))
        console.log("2", state.graphType)
    }

    const getColumns = async id => {
        const response = await DataPageService.fetchColumns(id);

        return (await response.json()).columns;
    };

    const getData = async (pointsQuantity, actorsQuantity, maxValue) => {
        const response = await DataPageService.fetchData(pointsQuantity, actorsQuantity, maxValue);

        return await response.json();
    };

    const fetchTableData = async () => {
        const valuesColumns = await getColumns(TABLES_IDS.VALUES);
        const actorsColumns = await getColumns(TABLES_IDS.ACTORS);
        const { valuesData, actorsData } = await getData();

        setState(state => ({
            ...state, valuesColumns, actorsColumns, valuesData, actorsData,
            requestCounter: state.requestCounter + 1
        }))
    }

    useEffect(() => {
        onRandomDataClick()
    }, [])

    useEffect(() => {
        onRandomDataClick()
    }, [state.graphType]);

    const setData = async (update = false) => {
        const data = await getData(update);

        setState(state => ({...state, ...data, requestCounter: state.requestCounter + 1}));
    };

    const onRandomDataClick = async () => {
        console.log("onRandomDataClick");
        await DataPageService.updateData(dataForm.pointsQuantity,
                                        dataForm.actorsQuantity,
                                        dataForm.maxValue,
                                        state.graphType);
        fetchTableData();
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

    const onInputChange = (event, id) => {
        let value = event.target.value;

        setDataForm(dataForm => ({
            ...dataForm,
            [id]: value
        }));
    }

    const getInput = (id, type, labelText) => <div className="dataInput">
        <label htmlFor={id}>{`${labelText}: `}</label>
        <input type={type} id={id} name={id}
               value={dataForm[id]}
               onChange={event => onInputChange(event, id)}
        />
    </div>

    const renderDataForm = () => <div className="dataForm">
        <button onClick={onRandomDataClick} className="dataButton">Get Random Data</button>
        {getInput("pointsQuantity", "number", "Points Quantity")}
        {getInput("actorsQuantity", "number", "Actors Quantity")}
        {getInput("maxValue", "number", "Maximum Value")}
    </div>

    return <div className="dataPageContainer">
        {renderDataForm()}
        {state.graphType !== "scatter" &&
            (<div className="tablesContainer">
                    <BaseTable
                        {...valuesTableProps}
                    />
                    <BaseTable
                        {...actorsTableProps}
                    />
                </div>)
        }
        <div className="graphContainer">
            <Graph actorsData={actorsTableProps.data} requestCounter={state.requestCounter}
                    maxValue={dataForm.maxValue}
                    graphType={state.graphType}
                    onGraphTypeChange={setGraphType}/>
        </div>
    </div>;
}