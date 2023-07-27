import React, { useEffect, useState } from "react";
import { aggregateCrimes, getYearRange } from "../api";
import Plot from "react-plotly.js";
import YearSlider from "../components/YearSelector";

const AggregatePage = () => {
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
        setData(transformData(response.data.hits[0]));
      })
      .catch((error) => {
        console.error("Error aggregating crime data:", error);
      });
  }, [year]);

  // Function to transform data
  const transformData = (rawData) => {
    if (rawData === undefined || rawData === null || rawData.length === 0) {
      return [];
    }
    return Object.entries(rawData._source)
      .filter(
        ([key, value]) =>
          value !== "" && !isNaN(value) && key != "Population" && key != "Year"
      ) // filter non-numerical fields
      .map(([key, value]) => ({ x: key, y: Number(value) })); // convert to the { x, y } format
  };
  const processedData = data.map((item, index) => {
    return {
      x: [item.x],
      y: [item.y],
      type: "bar",
      marker: { color: `hsl(${(index * 360) / data.length}, 100%, 50%)` },
      name: item.x,
    };
  });

  return (
    <div>
      <h1>Crime Distribution</h1>
      <div>
        <b style={{ marginRight: "20px", fontWeight: 500 }}>Choose Year</b>
        <YearSlider
          minYear={minYear}
          maxYear={maxYear}
          year={year}
          setYear={setYear}
        />
      </div>
      <br />
      <Plot
        data={processedData}
        layout={{
          autosize: true,
          xaxis: {
            title: "Types of Crimes",
            showticklabels: false,
          },
          yaxis: {
            title: "Cases",
          },
          barmode: "stack",
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default AggregatePage;
