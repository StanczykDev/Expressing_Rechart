import React, {useEffect, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart, BarChart, Bar, Legend, ComposedChart, PieChart, Pie, Label } from 'recharts';
import { DataPageService } from "../DataPageService";

import "./Graph.css";

const CHART_WIDTH = 1200;
const CHART_HEIGHT = 600;

export const Graph = ({ actorsData, requestCounter }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        console.log(actorsData);
        const getGraphData = async () => {
            const graphData = await (await DataPageService.fetchGraphData()).json();

            console.log(graphData);
            setData(graphData);
        }

        getGraphData();

    }, [requestCounter])


    const getLine = (dataKey, color, key) => <Line key={key}
                                              dataKey={dataKey}
                                              type="monotone"
                                              stroke={color}
                                              dot={{ stroke: 'black', strokeWidth: 2 }} />


    const renderLines = () => {
        return actorsData.map((actor, index) => getLine(actor.actorName, actor.actorColor, index))
    }

    const getArea = (dataKey, color, key) => <Area key={key}
                                                   dataKey={dataKey}
                                                   type="monotone"
                                                   stroke={color}
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

    const getPie = (dataKey, color, key) => <Bar key={key}
                                                 dataKey={dataKey}
                                                 fill={color} />

    const renderPies = () => {
        return actorsData.map((actor, index) => getPie(actor.actorName, actor.actorColor, index))
    }

    if (!actorsData || !actorsData.length) {
        return null;
    }

    const getXLabel = () =>
        <Label value="Actors" offset={35} position="bottom" />

    const getYLabel = () =>
        <Label value="Values" offset={35} position="left" />

    const getAxis = () => <>
        <XAxis dataKey="name">
            {getXLabel()}
        </XAxis>
        <YAxis>
            {getYLabel()}
        </YAxis>
    </>


   return (<>
        <LineChart className="chart" width={CHART_WIDTH} height={CHART_HEIGHT} data={data}>
            {renderLines()}
            <CartesianGrid stroke="#ccc" />
            {getAxis()}
            <Legend />
            <Tooltip />
        </LineChart>
       <AreaChart className="chart"
           width={CHART_WIDTH} height={CHART_HEIGHT} data={data}
       >
           {renderAreas()}
           {getAxis()}
           <Legend />
           <Tooltip />
       </AreaChart>
       <BarChart className="chart" width={CHART_WIDTH} height={CHART_HEIGHT} data={data}>
           <CartesianGrid strokeDasharray="3 3" />
           {getAxis()}
           <Legend />
           <Tooltip />
           {renderBars()}
       </BarChart>
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
   </>)

}