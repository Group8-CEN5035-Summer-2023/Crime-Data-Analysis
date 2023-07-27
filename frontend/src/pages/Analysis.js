import React, { useEffect, useState } from "react";
import { aggregateCrimes, getYearRange } from "../api";
import Plot from "react-plotly.js";
import YearSlider from "../components/YearSelector";

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
        const violentData = transformData(response.data.hits[0], [
          "Murder and nonnegligent Manslaughter",
          "Legacy rape /1",
          "Robbery",
          "Aggravated assault",
        ]);
        const propertyData = transformData(response.data.hits[0], [
          "Burglary",
          "Larceny-theft",
          "Motor vehicle theft",
        ]);
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
      .filter(
        ([key, value]) =>
          value !== "" && !isNaN(value) && allowedKeys.includes(key)
      ) // filter non-numerical fields
      .map(([key, value]) => ({ label: key, value: Number(value) }));
  };

  return (
    <div>
      <h1>Analysis</h1>
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
      <div style={{ marginBottom: "20px" }}>
        {data?.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Plot
              data={[
                {
                  labels: data[0].map((subitem) => subitem.label),
                  values: data[0].map((subitem) => subitem.value),
                  type: "pie",
                  text: data[0].map((_, i) => i + 1),
                  textinfo: "label+text+value",
                  marker: {
                    colors: data[0].map(
                      (_, i) => `hsl(${(i * 360) / data[0].length}, 100%, 50%)`
                    ),
                  },
                  name: "Violent Crimes",
                },
              ]}
              layout={{
                autosize: true,
                title: "Violent Crimes",
              }}
              useResizeHandler={true}
              style={{ width: "50%", height: "50%" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <table border={1}>
                <tbody>
                  {data[0].map((subitem, index) => (
                    <tr key={`table-row-data-0-${index}`}>
                      <td align="left" style={{ padding: "5px 10px" }}>
                        {subitem.label}
                      </td>
                      <td align="right" style={{ padding: "5px 10px" }}>
                        {subitem.value}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      align="left"
                      style={{ padding: "5px 10px", fontWeight: 500 }}
                    >
                      Violent Crimes
                    </td>
                    <td
                      align="right"
                      style={{ padding: "5px 10px", fontWeight: 500 }}
                    >
                      {data[0]
                        .map((item) => item.value)
                        .reduce((a, b) => a + b)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        {data?.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <table border={1}>
                <tbody>
                  {data[1].map((subitem, index) => (
                    <tr key={`table-row-data-1-${index}`}>
                      <td align="left" style={{ padding: "5px 10px" }}>
                        {subitem.label}
                      </td>
                      <td align="right" style={{ padding: "5px 10px" }}>
                        {subitem.value}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      align="left"
                      style={{ padding: "5px 10px", fontWeight: 500 }}
                    >
                      Property Crimes
                    </td>
                    <td
                      align="right"
                      style={{ padding: "5px 10px", fontWeight: 500 }}
                    >
                      {data[1]
                        .map((item) => item.value)
                        .reduce((a, b) => a + b)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Plot
              data={[
                {
                  labels: data[1].map((subitem) => subitem.label),
                  values: data[1].map((subitem) => subitem.value),
                  type: "pie",
                  text: data[1].map((_, i) => i + 1),
                  textinfo: "label+text+value",
                  marker: {
                    colors: data[1].map(
                      (_, i) => `hsl(${(i * 360) / data[1].length}, 100%, 50%)`
                    ),
                  },
                  name: "Property Crimes",
                },
              ]}
              layout={{
                autosize: true,
                title: "Property Crimes",
              }}
              useResizeHandler={true}
              style={{ width: "50%", height: "50%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PieCharts;
