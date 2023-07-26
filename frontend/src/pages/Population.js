import React, { useEffect, useState } from 'react';
import { getPopulation } from '../api';
import Plot from 'react-plotly.js';

const Population = () => {
    const [data, setData] = useState([]);

    const transformData = (hits) => {
        if (!Array.isArray(hits) || hits.length === 0) {
            return [];
        }

        return hits.map(hit => {
            const { Year, Population } = hit._source;
            return { x: Year, y: Number(Population) };
        });
    };

    useEffect(() => {
        getPopulation()
            .then((response) => {
                setData(transformData(response.data.hits));
            })
            .catch((error) => {
                console.error("Error getting population data:", error);
            });
    }, []);

    return (
        <div>
            <h1>Population</h1>
            <Plot
                data={[
                    {
                        x: data.map(item => item.x),
                        y: data.map(item => item.y),
                        type: 'scatter',
                        mode: 'lines+markers'
                    }
                ]}
                layout={{
                    autosize: true,
                    xaxis: {
                        title: 'Year',
                        type: 'date',
                    },
                    yaxis: {
                        title: 'Population',
                    },
                    title: 'Population of the LA',
                }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    )
}

export default Population;
