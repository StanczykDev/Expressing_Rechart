import React, {useEffect, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    Area, AreaChart, BarChart, Bar, Legend, ComposedChart, PieChart, Pie, Label } from 'recharts';
import { DataPageService } from "../DataPageService";

import "./Graph.css";

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 600;

const INTERPOLATION_TYPES = ['monotone', 'basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed',
    'natural', 'monotoneX', 'monotoneY', 'step', 'stepBefore', 'stepAfter' ];

export const Graph = ({ actorsData, requestCounter }) => {
    const initialState = {
        title: "Graph Title",
        xAxisLabel: "Actors",
        yAxisLabel: "Values",
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        isGridDisplayed: true,
        isLegendDisplayed: true,
        isTooltipDisplayed: true,
        marginTop: 35,
        marginRight: 20,
        marginBottom: 150,
        marginLeft: 100,
        interpolationType: "monotone"
    }
    const [data, setData] = useState([]);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        const getGraphData = async () => {
            const graphData = await (await DataPageService.fetchGraphData()).json();

            setData(graphData);
        }

        getGraphData();

    }, [requestCounter])


    // const getArea = (dataKey, color, key) => <Area key={key}
    //                                                dataKey={dataKey}
    //                                                type="monotone"
    //                                                stroke={color}
    //                                                fillOpactity={0.7}
    //                                                fill={color} />
    //
    //
    // const renderAreas = () => {
    //     return actorsData.map((actor, index) => getArea(actor.actorName, actor.actorColor, index))
    // }
    //
    // const getBar = (dataKey, color, key) => <Bar key={key}
    //                                                dataKey={dataKey}
    //                                                fill={color} />
    //
    //
    // const renderBars = () => {
    //     return actorsData.map((actor, index) => getBar(actor.actorName, actor.actorColor, index))
    // }

    const onSubmit = e => {
        e.preventDefault();
        console.log("Submit");
    }


    const getSelect = (id, labelText, values = []) => <div className="select">
        <label htmlFor={id}>{`${labelText}: `}</label>
        <select value={state[id]} name={id} id={id} onChange={event => onInputChange(event, id)}>
            {
                values.map((value, index) =>
                    <option value={value} key={index}>{value}</option>)
            }
        </select>
    </div>


    const onInputChange = (event, id) => {
        let value = event.target.value;

        if (typeof state[id] === "number") {
            value = parseInt(value);
        }

        if (typeof state[id] === "boolean") {
            setState(state => ({
                ...state,
                [id]: !state[id]
            }));

            return;
        }

        setState({
            ...state,
            [id]: value
        })
    }

    const getInput = (id, type, labelText) => <div className="input">
        <label htmlFor={id}>{`${labelText}: `}</label>
        <input type={type} id={id} name={id}
               value={state[id]} checked={!!(type==="checkbox" && !!state[id])}
               onChange={event => onInputChange(event, id)}
        />
        </div>

    const onDefaultClick = () => {
        setState(() => ({
            ...initialState
        }))
    }

    const renderForm = () => {
        return (
        <>
            <div className="toDefaultSubform">
                <button onClick={onDefaultClick}>To Default</button>
            </div>
            <form onSubmit={onSubmit}>
            <div className="subform">
                {getInput("title", "text", "Title")}
                {getInput("xAxisLabel", "text", "X-axis Title")}
                {getInput("yAxisLabel", "text", "Y-axis Title")}
            </div>
            <div className="subform">
                {getInput("width", "number", "Width")}
                {getInput("height", "number", "Height")}
                {getInput("marginRight", "number",
                    "Chart right margin")}
                {getInput("marginLeft", "number",
                    "Chart left margin")}
                {getInput("marginTop", "number",
                    "Chart top margin")}
                {getInput("marginBottom", "number",
                    "Chart bottom margin")}
            </div>
            <div className="subform">
                {getSelect("interpolationType", "Interpolation type",
                    INTERPOLATION_TYPES)}
                {getInput("isGridDisplayed", "checkbox",
                    "Display Grid")}
                {getInput("isLegendDisplayed", "checkbox",
                    "Display Legend")}
                {getInput("isTooltipDisplayed", "checkbox",
                    "Display Tooltip")}
            </div>
        </form>
            </>)
    }

    const renderZoomForm = () => {

    }

    if (!actorsData || !actorsData.length) {
        return null;
    }

    const getLine = (dataKey, color, key) =>
        <Line key={key}
              dataKey={dataKey}
              type={state.interpolationType}
              stroke={color}
        />


    const renderLines = () => {
        return actorsData.map((actor, index) => getLine(actor.actorName, actor.actorColor, index))
    }

    const getXLabel = () =>
        <Label value={state.xAxisLabel} offset={35} position="bottom" />

    const getYLabel = () =>
        <Label value={state.yAxisLabel} offset={35} position="left" />

    const getTitle = () =>
        <XAxis dataKey="name" xAxisId={1} orientation="top" tick={false}>
            <Label value={state.title} offset={5} position="top" />
        </XAxis>

    const getAxis = () => <>
        <XAxis xAxisId={0} dataKey="name" orientation="bottom">
            {getXLabel()}
        </XAxis>
        <YAxis type="number" domain={[0, 10]} scale="auto" allowDataOverflow>
            {getYLabel()}
        </YAxis>
    </>



   return (<div className="innerGraphContainer">
       {renderForm()}
        <LineChart
            className="chart"
            width={state.width}
            height={state.height}
            data={data}
            margin={
                {
                    top: state.marginTop,
                    right: state.marginRight,
                    bottom: state.marginBottom,
                    left: state.marginLeft
                }
            }
        >
            {getTitle()}
            {renderLines()}
            {state.isGridDisplayed && <CartesianGrid stroke="#ccc" />}
            {getAxis()}
            {state.isLegendDisplayed && <Legend className="legend" wrapperStyle={{
                bottom: 70
            }}/>}
            {state.isTooltipDisplayed && <Tooltip />}
        </LineChart>
       {/*<AreaChart className="chart"*/}
       {/*    width={CHART_WIDTH} height={CHART_HEIGHT} data={data}*/}
       {/*>*/}
       {/*    {renderAreas()}*/}
       {/*    {getAxis()}*/}
       {/*    <Legend />*/}
       {/*    <Tooltip />*/}
       {/*</AreaChart>*/}
       {/*<BarChart className="chart" width={CHART_WIDTH} height={CHART_HEIGHT} data={data}>*/}
       {/*    <CartesianGrid strokeDasharray="3 3" />*/}
       {/*    {getAxis()}*/}
       {/*    <Legend />*/}
       {/*    <Tooltip />*/}
       {/*    {renderBars()}*/}
       {/*</BarChart>*/}
       {/*<PieChart width={730} height={250}>*/}
       {/*    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />*/}
       {/*</PieChart>*/}
       {/*<ComposedChart width={1000} height={400} data={data}>*/}
       {/*    <XAxis dataKey="name" />*/}
       {/*    <YAxis />*/}
       {/*    <Tooltip />*/}
       {/*    <Legend />*/}
       {/*    <CartesianGrid stroke="#f5f5f5" />*/}
       {/*    {renderLines()}*/}
       {/*    {renderBars()}*/}
       {/*    {renderAreas()}*/}
       {/*</ComposedChart>*/}
   </div>)

}