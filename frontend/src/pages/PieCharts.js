import React, { useEffect, useState } from 'react';
import { aggregateCrimes, getYearRange } from '../api';
import Plot from 'react-plotly.js';
import YearSlider from '../components/YearSelector';

const PieCharts = () => {
    const [year, setYear] = useState(2011);
    const [data, setData] = useState([]);
    const [minYear, setMinYear] = useState(1900);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear());

    useEffect(() => {
        getYearRange()
            .then((response) => {
                setMinYear(Math.floor(response.data.min_year));
                setMaxYear(Math.floor(response.data.max_year));
            })
            .catch((error) => {
                console.error("Error getting year range:", error);
            });

        aggregateCrimes(year)
            .then((response) => {
                const violentData = transformData(response.data.hits[0], ['Murder and nonnegligent Manslaughter', 'Legacy rape /1', 'Robbery', 'Aggravated assault']);
                const propertyData = transformData(response.data.hits[0], ['Burglary', 'Larceny-theft', 'Motor vehicle theft']);
                setData([violentData, propertyData]);
            })
            .catch((error) => {
                console.error("Error aggregating crime data:", error);
            });
    }, [year]);

    // Function to transform data
    const transformData = (rawData, allowedKeys) => {
        if (rawData === undefined || rawData === null || rawData.length === 0) {
            return [];
        }
        return Object.entries(rawData._source)
            .filter(([key, value]) => value !== "" && !isNaN(value) && allowedKeys.includes(key)) // filter non-numerical fields
            .map(([key, value]) => ({ label: key, value: Number(value) })); // convert to the { label, value } format
    };

    return (
        <div>
            <h1>Crime Distribution</h1>
            <YearSlider minYear={minYear} maxYear={maxYear} year={year} setYear={setYear} />
            <br />
            {data.map((item, index) => (
                <div style={{ marginBottom: '20px' }} key={index}>
                    <Plot
                        data={[{
                            labels: item.map(subitem => subitem.label),
                            values: item.map(subitem => subitem.value),
                            type: 'pie',
                            text: item.map((_, i) => i + 1),
                            textinfo: 'label+text+value',
                            marker: { colors: item.map((_, i) => `hsl(${(i * 360 / item.length)}, 100%, 50%)`) },
                            name: index === 0 ? 'Violent Crimes' : 'Property Crimes'
                        }]}
                        layout={{
                            autosize: true,
                            title: index === 0 ? 'Violent Crimes' : 'Property Crimes',
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "50%" }}
                    />
                </div>
            ))}
        </div>
    );
};

export default PieCharts;
