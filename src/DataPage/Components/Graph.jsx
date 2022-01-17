import React, {useEffect, useState} from "react";
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    Area, AreaChart, BarChart, Bar, Legend, Label, PieChart, Pie, Cell
} from 'recharts';
import { DataPageService } from "../DataPageService";

import "./Graph.css";

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 600;

const INTERPOLATION_TYPES = ['monotone', 'basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed',
    'natural', 'monotoneX', 'monotoneY', 'step', 'stepBefore', 'stepAfter' ];
const SCALE_TYPES = ['auto', 'linear', 'pow', 'sqrt','log', 'identity', 'time',
    'band', 'point', 'ordinal', 'quantile', 'quantize', 'utc', 'sequential', 'threshold']
const GRAPH_TYPES = ['line', 'area', 'bar', 'pie'];
const COLOR_OPTIONS = ["#ff0000", "#00ff00", "#0000ff", "#000000", "#ffffff", "default"]

export const Graph = ({ actorsData, requestCounter, graphType, onGraphTypeChange }) => {
    const initialState = {
        title: "Graph Title",
        xAxisLabel: "Actors",
        yAxisLabel: "Values",
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        isGridDisplayed: true,
        isLegendDisplayed: true,
        isTooltipDisplayed: true,
        isDataOverflowAllowed: false,
        domainMin: 0,
        domainMax: 100,
        marginTop: 35,
        marginRight: 20,
        marginBottom: 150,
        marginLeft: 100,
        interpolationType: "monotone",
        scaleType: 'auto',
        zoomStep: 1,
        lineStrokeWidth: 1,
        areXTicksDisplayed: true,
        areYTicksDisplayed: true,
        gridStrokeDasharray: "",
        xAxisColor: COLOR_OPTIONS[5],
        yAxisColor: COLOR_OPTIONS[5]
    }
    const [data, setData] = useState([]);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        const getGraphData = async () => {
            const graphData = await (await DataPageService.fetchGraphData(graphType)).json();

            setData(graphData);
        }

        getGraphData();

    }, [requestCounter])

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

        if (id === "graphType") {
            onGraphTypeChange(value);
        }

        if (id === "isDataOverflowAllowed") {
            toDefaultZoom();
        }

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

    const zoomOutUp = () => {
        if (isZoomInUpDisabled() && state.domainMax < initialState.domainMax) {
            setState(state => ({
                ...state,
                domainMax: initialState.domainMax - state.zoomStep
            }))
        }

        setState(state => ({
            ...state,
            domainMax: state.domainMax + state.zoomStep
        }));
    }

    const isZoomInUpDisabled = () => !state.isDataOverflowAllowed &&
        state.domainMax <= initialState.domainMax

    const zoomInUp = () => {
        if (isZoomInUpDisabled()) {
            return;
        }

        // if (isZoomInDisabled() && state.domainMax < initialState.domainMax) {
        //     setState(state => ({
        //         ...state,
        //         domainMax: initialState.domainMax - 1
        //     }))
        // }

        setState(state => ({
            ...state,
            domainMax: state.domainMax - state.zoomStep
        }));
    }

    const zoomOutBottom = () => {
        if (isZoomInBottomDisabled() && state.domainMin > initialState.domainMin) {
            setState(state => ({
                ...state,
                domainMin: initialState.domainMin - state.zoomStep
            }))
        }

        setState(state => ({
            ...state,
            domainMin: state.domainMin - state.zoomStep
        }));
    }

    const isZoomInBottomDisabled = () => !state.isDataOverflowAllowed &&
        state.domainMin >= initialState.domainMin

    const zoomInBottom = () => {
        if (isZoomInBottomDisabled()) {
            return;
        }

        // if (isZoomInDisabled() && state.domainMax < initialState.domainMax) {
        //     setState(state => ({
        //         ...state,
        //         domainMax: initialState.domainMax - 1
        //     }))
        // }

        setState(state => ({
            ...state,
            domainMin: state.domainMin + state.zoomStep
        }));
    }

    const toDefaultZoom = () => {
        setState(state => ({
            ...state,
            domainMin: initialState.domainMin,
            domainMax: initialState.domainMax
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
                {getInput("areXTicksDisplayed", "checkbox", "Show X-axis Ticks")}
                {getInput("areYTicksDisplayed", "checkbox", "Show Y-axis Ticks")}
                {getSelect("xAxisColor", "X Axis Color",
                    COLOR_OPTIONS)}
                {getSelect("yAxisColor", "Y Axis Color",
                    COLOR_OPTIONS)}
                {getInput("lineStrokeWidth", "number",
                    "Width of the Lines")}
                {getInput("gridStrokeDasharray", "text",
                    "Pattern of Grid Dashes")}
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
                {getSelect("interpolationType", "Interpolation Type",
                    INTERPOLATION_TYPES)}
                {getSelect("scaleType", "Scale Type",
                    SCALE_TYPES)}
                {getSelect("graphType", "Graph Type",
                    GRAPH_TYPES)}
                {getInput("isGridDisplayed", "checkbox",
                    "Display Grid")}
                {getInput("isLegendDisplayed", "checkbox",
                    "Display Legend")}
                {getInput("isTooltipDisplayed", "checkbox",
                    "Display Tooltip")}
            </div>
        </form>
            <div className="zoomSubform">
                {getInput("isDataOverflowAllowed", "checkbox",
                    "Allow Data Overflow")}
                {getInput("zoomStep", "number",
                    "Zoom Step")}
                <div className="zoomButtonsContainer">
                    <button onClick={zoomInUp} disabled={isZoomInUpDisabled()}>
                        Zoom In Upper Border</button>
                    <button onClick={zoomOutUp}>Zoom Out Upper Border</button>
                </div>
                <div className="zoomButtonsContainer">
                    <button onClick={zoomInBottom} disabled={isZoomInBottomDisabled()}>
                        Zoom In Bottom Border</button>
                    <button onClick={zoomOutBottom}>Zoom Out Bottom Border</button>
                </div>
                <div className="zoomButtonsContainer">
                    <button onClick={toDefaultZoom}>
                        To Default Zoom</button>
                </div>
            </div>
            </>)
    }

    if (!actorsData || !actorsData.length) {
        return null;
    }

    const getLine = (dataKey, color, key) =>
        <Line key={key}
              dataKey={dataKey}
              type={state.interpolationType}
              stroke={color}
              strokeWidth={state.lineStrokeWidth}
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
        <XAxis xAxisId={0} dataKey="name" orientation="bottom"
               stroke={state.xAxisColor}
               tick={state.areXTicksDisplayed}>
            {getXLabel()}
        </XAxis>
        <YAxis type="number" domain={[state.domainMin, state.domainMax]}
               scale={state.scaleType} allowDataOverflow={state.isDataOverflowAllowed}
               stroke={state.yAxisColor}
               tick={state.areYTicksDisplayed}>
            {getYLabel()}
        </YAxis>
    </>

    const renderServiceElements = () => <>
        {graphType !== "pie" && getTitle()}
        {state.isGridDisplayed && graphType !== "pie" &&
            <CartesianGrid stroke="#ccc"
            strokeDasharray={state.gridStrokeDasharray} />}
        {graphType !== "pie" && getAxis()}
        {state.isLegendDisplayed && <Legend className="legend" wrapperStyle={{
            bottom: 70
        }}/>}
        {state.isTooltipDisplayed && <Tooltip />}
    </>

    const getArea = (dataKey, color, key) => <Area key={key}
                                                   dataKey={dataKey}
                                                   type={state.interpolationType}
                                                   stroke={color}
                                                   strokeWidth={state.lineStrokeWidth}
                                                   fillOpactity={0.7}
                                                   fill={color} />


    const renderAreas = () => {
        return actorsData.map((actor, index) => getArea(actor.actorName, actor.actorColor, index))
    }

    const getBar = (dataKey, color, key) => <Bar key={key}
                                                   dataKey={dataKey}
                                                   fill={color} />


    const renderBars = () => {
        return actorsData.map((actor, index) => getBar(actor.actorName, actor.actorColor, index))
    }


   return (<div className="innerGraphContainer">
       {renderForm()}
       {graphType === GRAPH_TYPES[0] &&
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
               {renderServiceElements()}
               {renderLines()}
           </LineChart>
       }
       {graphType === GRAPH_TYPES[1] &&
            <AreaChart
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
                {renderServiceElements()}
                {renderAreas()}
            </AreaChart>
       }
       {graphType === GRAPH_TYPES[2] &&
            <BarChart
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
                {renderServiceElements()}
                {renderBars()}
            </BarChart>
       }
       {graphType === GRAPH_TYPES[3] && data[0].color &&
           <PieChart
               className="chart"
               width={state.width}
               height={state.height}>
               <Pie data={data[0].data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={70}
                    fill={data[0].color}
               >
                   {data[0].data.map((dataItem, index) => (
                       <Cell key={`cell-${index}`} fill={dataItem.color} />
                   ))}
               </Pie>
               <Pie data={data[1].data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label
                    innerRadius={80}
                    outerRadius={100}
                    fill={data[1].color}
               />
               {renderServiceElements()}
           </PieChart>
       }
   </div>)

}