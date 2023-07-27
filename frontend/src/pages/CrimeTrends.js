import React, { useEffect, useState } from "react";
import { getPopulation, getCrimeData } from "../api";
import Plot from "react-plotly.js";

const PopulationAndCrime = () => {
  const [data, setData] = useState([]);

  const transformData = (populationHits) => {
    if (!Array.isArray(populationHits) || populationHits.length === 0) {
      return [];
    }

    return populationHits.map((hit, i) => {
      const { Year, Population } = hit._source;
      const {
        "Violent crime total": violentCrime,
        "Property crime total": propertyCrime,
      } = hit._source;
      const totalCrime = Number(violentCrime) + Number(propertyCrime);
      return {
        x: Year,
        yPopulation: Number(Population),
        yViolentCrime: Number(violentCrime),
        yPropertyCrime: Number(propertyCrime),
        yTotalCrime: totalCrime,
      };
    });
  };

  useEffect(() => {
    Promise.all([getPopulation()])
      .then(([populationResponse]) => {
        setData(transformData(populationResponse.data.hits));
      })
      .catch((error) => {
        console.error("Error getting data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Crime Trends with Population</h1>
      <Plot
        data={[
          {
            x: data.map((item) => item.x),
            y: data.map((item) => item.yPopulation),
            type: "scatter",
            mode: "lines+markers",
            name: "Crime Trends",
          },
          {
            x: data.map((item) => item.x),
            y: data.map((item) => item.yViolentCrime),
            type: "scatter",
            mode: "lines+markers",
            name: "Violent Crime",
          },
          {
            x: data.map((item) => item.x),
            y: data.map((item) => item.yPropertyCrime),
            type: "scatter",
            mode: "lines+markers",
            name: "Property Crime",
          },
          {
            x: data.map((item) => item.x),
            y: data.map((item) => item.yTotalCrime),
            type: "scatter",
            mode: "lines+markers",
            name: "Total Crime",
          },
        ]}
        layout={{
          autosize: true,
          xaxis: {
            title: "Year",
            type: "date",
          },
          yaxis: {
            title: "Count",
          },
          title: "Population and Crime Trends in LA",
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PopulationAndCrime;
