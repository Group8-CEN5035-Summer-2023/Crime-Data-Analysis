import React, { useEffect, useState } from 'react';
import { aggregateCrimes } from '../api';
import CrimeChart from '../components/CrimeChart'; // You should replace this with your actual chart component

const AggregatePage = () => {
    const [field, setField] = useState('Violent crime total');
    const [data, setData] = useState([]);

    useEffect(() => {
        aggregateCrimes(field)
            .then((response) => {
                setData(response.data);
                console.log("Aggregate results:", response.data);
            })
            .catch((error) => {
                console.error("Error aggregating crime data:", error);
            });
    }, [field]);

    return (
        <div>
            <h1>Aggregate Page</h1>
            <select value={field} onChange={(e) => setField(e.target.value)}>
                {/* You should replace these options with your actual field names */}
                <option value="Violent crime total">Violent crime total</option>
                <option value="Murder and nonnegligent Manslaughter">Murder and nonnegligent Manslaughter</option>
                <option value="Robbery">Robbery</option>
                <option value="Aggravated assault">Aggravated assault</option>
            </select>
            <CrimeChart data={data} />
        </div>
    );
};

export default AggregatePage;
