import React, {useEffect, useState} from "react";
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip,
    Area, AreaChart, BarChart, Bar, Legend, Label, PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    RadialBarChart, RadialBar,
    FunnelChart, Funnel, LabelList,
    ScatterChart, Scatter,
    Treemap, Sankey
} from 'recharts';
import { DataPageService } from "../DataPageService";
import { GRAPH_TYPES } from "../DataPage";

import "./Graph.css";

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 600;

const INTERPOLATION_TYPES = ['monotone', 'basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed',
    'natural', 'monotoneX', 'monotoneY', 'step', 'stepBefore', 'stepAfter' ];
const SCALE_TYPES = ['auto', 'linear', 'pow', 'sqrt','log', 'identity', 'time',
    'band', 'point', 'ordinal', 'quantile', 'quantize', 'utc', 'sequential', 'threshold']
const COLOR_OPTIONS = ["#ff0000", "#00ff00", "#0000ff", "#000000", "#ffffff", "default"]

export const Graph = ({ actorsData, requestCounter, graphType, onGraphTypeChange, maxValue }) => {
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
        domainXMin: 0,
        domainXMax: 100,
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
        yAxisColor: COLOR_OPTIONS[5],
        filteredIndex: -1,
        outerRadiusFirst: 70,
        innerRadiusSecond: 80,
        outerRadiusSecond: 100,
        startAngleFirst: 0,
        endAngleFirst: 360,
        paddingAngleFirst: 0,
        startAngleSecond: 0,
        endAngleSecond: 360,
        paddingAngleSecond: 0,
        radarXAxisAngle: 30,
        innerRadiusRadar: 0,
        outerRadiusRadar: 80,
        startAngleRadar: 90,
        endAngleRadar: -270,
        treeMapRatioNumerator: 4,
        treeMapRatioDenominator: 3,
        clockWise: true,
        radialBarMinAngle: 30
    }
    const [data, setData] = useState([]);
    const [localActorsData, setActorsData] = useState([]);
    const [state, setState] = useState(initialState);
    const [hiddenElement, setHiddenElement] = useState({
        hiddenElement: -1
    })

    useEffect(() => {
        const getGraphData = async () => {
            const graphData = await (await DataPageService.fetchGraphData(graphType)).json();
            console.log(graphData);
            setData(graphData);
        }

        getGraphData();

    }, [requestCounter])

    useEffect(() => {
        console.log(state.filteredIndex);
        if (state.filteredIndex !== -1) {
            console.log("hmm");
            setActorsData(() => [actorsData[state.filteredIndex]]);
        } else {
            setActorsData(actorsData);
        }

        console.log(localActorsData);

    }, [requestCounter, state.filteredIndex])

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

        console.log(value);

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

    const zoomXOutUp = () => {
        if (isZoomInUpDisabled() && state.domainXMax < initialState.domainXMax) {
            setState(state => ({
                ...state,
                domainXMax: initialState.domainXMax - state.zoomStep
            }))
        }

        setState(state => ({
            ...state,
            domainXMax: state.domainXMax + state.zoomStep
        }));
    }

    const isZoomXInUpDisabled = () => !state.isDataOverflowAllowed &&
        state.domainXMax <= initialState.domainXMax

    const zoomXInUp = () => {
        if (isZoomXInUpDisabled()) {
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
            domainXMax: state.domainXMax - state.zoomStep
        }));
    }

    const zoomXOutBottom = () => {
        if (isZoomInBottomDisabled() && state.domainXMin > initialState.domainXMin) {
            setState(state => ({
                ...state,
                domainXMin: initialState.domainXMin - state.zoomStep
            }))
        }

        setState(state => ({
            ...state,
            domainXMin: state.domainXMin - state.zoomStep
        }));
    }

    const isZoomXInBottomDisabled = () => !state.isDataOverflowAllowed &&
        state.domainXMin >= initialState.domainXMin

    const zoomXInBottom = () => {
        if (isZoomXInBottomDisabled()) {
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
            domainXMin: state.domainXMin + state.zoomStep
        }));
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
            domainMax: initialState.domainMax,
            domainXMin: initialState.domainXMin,
            domainXMax: initialState.domainXMax,
        }))
    }

    const resetFilter = () => {
        setState(state => ({
            ...state,
            filteredIndex: -1
        }));
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
                {getInput("treeMapRatioNumerator", "number",
                    "Tree Map Ratio Numerator")}
                {getInput("treeMapRatioDenominator", "number",
                    "Tree Map Ratio Denominator")}
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
                <div className="subform">
                    {getInput("outerRadiusFirst", "number",
                        "First Pie Outer Radius")}
                    {getInput("innerRadiusSecond", "number",
                        "Second Pie Inner Radius")}
                    {getInput("outerRadiusSecond", "number",
                        "Second Pie Outer Radius")}
                    {getInput("startAngleFirst", "number",
                        "First Pie Start Angle")}
                    {getInput("endAngleFirst", "number",
                        "First Pie Start Angle")}
                    {getInput("paddingAngleFirst", "number",
                        "First Pie Padding Angle")}
                    {getInput("startAngleSecond", "number",
                        "Second Pie Start Angle")}
                    {getInput("endAngleSecond", "number",
                        "Second Pie End Angle")}
                    {getInput("paddingAngleSecond", "number",
                        "Second Pie Padding Angle")}
                </div>
                <div className="subform">
                    {getInput("innerRadiusRadar", "number",
                        "Radar Inner Radius")}
                    {getInput("outerRadiusRadar", "number",
                        "Radar Outer Radius")}
                    {getInput("radarXAxisAngle", "number",
                        "Radar Axis Angle")}
                    {getInput("startAngleRadar", "number",
                        "Radar Start Angle")}
                    {getInput("endAngleRadar", "number",
                        "Radar End Angle")}
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
                    <button onClick={zoomXInUp} disabled={isZoomXInUpDisabled()}>
                        Zoom X In Upper Border</button>
                    <button onClick={zoomXOutUp}>Zoom X Out Upper Border</button>
                </div>
                <div className="zoomXButtonsContainer">
                    <button onClick={zoomXInBottom} disabled={isZoomXInBottomDisabled()}>
                        Zoom X In Bottom Border</button>
                    <button onClick={zoomXOutBottom}>Zoom X Out Bottom Border</button>
                </div>
                <div className="zoomButtonsContainer">
                    <button onClick={toDefaultZoom}>
                        To Default Zoom</button>
                    <button onClick={resetFilter}>
                        Reset Filter</button>
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
        return localActorsData.map((actor, index) => getLine(actor.actorName, actor.actorColor, index))
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

    const isAdvancedGraph = () => {
        return graphType === "pie" || graphType === "radar" || graphType === "radialBar" || graphType === "funnel";
    }

    const onLegendClick = (data, index) => {
        setState(state => ({
            ...state,
            filteredIndex: index
        }))
    }


    const renderServiceElements = () => <>
        {!isAdvancedGraph() && getTitle()}
        {state.isGridDisplayed && !isAdvancedGraph() &&
            <CartesianGrid stroke="#ccc"
            strokeDasharray={state.gridStrokeDasharray} />}
        {!isAdvancedGraph() && graphType !== "scatter" && getAxis()}
        {state.isLegendDisplayed && graphType !== "funnel" &&
            <Legend onClick={onLegendClick} className="legend" wrapperStyle={{
                bottom: 70
        }}  />}
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
        return localActorsData.map((actor, index) => getArea(actor.actorName, actor.actorColor, index))
    }

    const getBar = (dataKey, color, key) => <Bar key={key}
                                                   dataKey={dataKey}
                                                   fill={color} />


    const renderBars = () => {
        return localActorsData.map((actor, index) => getBar(actor.actorName, actor.actorColor, index))
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
               height={state.height}
               margin={
                   {
                       top: state.marginTop,
                       right: state.marginRight,
                       bottom: state.marginBottom,
                       left: state.marginLeft
                   }
               }>
               <Pie data={data[0].data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={state.outerRadiusFirst}
                    startAngle={state.startAngleFirst}
                    endAngle={state.endAngleFirst}
                    paddingAngle={state.paddingAngleFirst}
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
                    innerRadius={state.innerRadiusSecond}
                    outerRadius={state.outerRadiusSecond}
                    startAngle={state.startAngleSecond}
                    endAngle={state.endAngleSecond}
                    paddingAngle={state.paddingAngleSecond}
                    fill={data[1].color}
               />
               {renderServiceElements()}
           </PieChart>
       }
       {graphType === GRAPH_TYPES[4] &&
           (
               <RadarChart
                   innerRadius={state.innerRadiusRadar}
                   outerRadius={state.outerRadiusRadar}
                   startAngle={state.startAngleRadar}
                   endAngle={state.endAngleRadar}
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
                   }>
                   {state.isGridDisplayed && <PolarGrid />}
                   <PolarAngleAxis dataKey="name" />
                   <PolarRadiusAxis angle={state.radarXAxisAngle}
                                    domain={[state.domainMin, state.domainMax]} />
                   {
                       data.map((dataItem, index) => {
                           if (!actorsData[index]) {
                               return null;
                           }

                           return (<Radar
                                    key={actorsData[index].actorName}
                                    name={actorsData[index].actorName}
                                    dataKey={actorsData[index].actorName}
                                    fill={actorsData[index].actorColor}
                                    fillOpacity={0.6} />)
                       })
                   }
                   {renderServiceElements()}
               </RadarChart>
           )
       }
       {graphType === GRAPH_TYPES[5] &&
       (
           <RadialBarChart
               width={state.width}
               height={state.height}
               innerRadius="10%"
               outerRadius="80%"
               data={data}
               startAngle={state.startAngleRadar}
               endAngle={state.endAngleRadar}
               margin={
                   {
                       top: state.marginTop,
                       right: state.marginRight,
                       bottom: state.marginBottom,
                       left: state.marginLeft
                   }
               }
           >
               {actorsData.map((actor, index) => {
                   console.log(hiddenElement);
                   if (hiddenElement === index) {
                       return null;
                   }

                    return (
                   <RadialBar key={`${actor.actorName}-${index}`}
                              minAngle={state.radialBarMinAngle} label={{ fill: '#000', position: 'insideStart' }}
                              background clockWise={state.clockWise} dataKey={actor.actorName}
                   onClick={() => {
                       setHiddenElement(index);
                   }}/>
               )})}

               {renderServiceElements()}
           </RadialBarChart>
       )
       }
       {graphType === GRAPH_TYPES[6] && (
           <FunnelChart
               width={state.width}
               height={state.height}
               margin={
                   {
                       top: state.marginTop,
                       right: state.marginRight,
                       bottom: state.marginBottom,
                       left: state.marginLeft
                   }
               }>
               <Funnel
                   dataKey="value"
                   data={data[0].data}
                   isAnimationActive
               >
                   <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
               </Funnel>
               {renderServiceElements()}
           </FunnelChart>
       )
       }
       {graphType === GRAPH_TYPES[7] && data.data &&
         (
           <ScatterChart width={state.width}
                         height={state.height}
                         margin={
                             {
                                 top: state.marginTop,
                                 right: state.marginRight,
                                 bottom: state.marginBottom,
                                 left: state.marginLeft
                             }
                         }>
               <XAxis dataKey="x" domain={[state.domainXMin, state.domainXMax]}
                      name="stature" unit="cm" type="number" />
               <YAxis dataKey="y" domain={[state.domainMin, state.domainMax]}
                      name="weight" unit="kg" type="number" />
               <ZAxis dataKey="z" range={[64, 144]} name="score" unit="km" />
               {
                   data.data.map((dataItem, index) => (
                       <Scatter name={`Actor-${index}`} data={dataItem} fill={data.colors[index]} />
                   ))
               }
               {renderServiceElements()}
           </ScatterChart>
         )
       }
       {graphType === GRAPH_TYPES[8] &&
        (
            <Treemap
                width={state.width}
                height={state.height}
                data={data.data}
                dataKey="size"
                ratio={state.treeMapRatioNumerator / state.treeMapRatioDenominator}
                stroke="#fff"
                fill={data.color}
            />
        )
       }
       {graphType === GRAPH_TYPES[9] && data.data &&
       (
           <Sankey
               width={state.width}
               height={state.height}
               data={data.data}
               node={{stroke: data.color, strokeWidth: state.lineStrokeWidth}}
               nodePading={50}
               margin={{
                   top: state.marginTop,
                   right: state.marginRight,
                   bottom: state.marginBottom,
                   left: state.marginLeft
               }}
               link={{ stroke: data.color }}
           >
               {state.isTooltipDisplayed && <Tooltip />}
           </Sankey>
       )

       }
   </div>)

}