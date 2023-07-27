import React, { useEffect, useState } from "react";
import { getAllCrimes } from "../api";
import CrimeChart from "../components/CrimeChart";

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllCrimes()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching crime data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <CrimeChart data={data} />
    </div>
  );
};

export default HomePage;
