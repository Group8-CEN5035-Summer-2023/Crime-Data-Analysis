import React, { useState } from 'react';
import { searchCrimes } from '../api';
import CrimeChart from '../components/CrimeChart'; // You should replace this with your actual chart component

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);

    const handleSearch = () => {
        searchCrimes(query)
            .then((response) => {
                setData(response.data);
                console.log("Search results:", response.data);
            })
            .catch((error) => {
                console.error("Error searching crime data:", error);
            });
    };

    return (
        <div>
            <h1>Search Page</h1>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <CrimeChart data={data} />
        </div>
    );
};

export default SearchPage;
