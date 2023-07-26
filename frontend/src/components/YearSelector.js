import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const YearSlider = ({ year, setYear }) => {
    const handleChange = date => setYear(date.getFullYear());
    const selectedDate = new Date();
    selectedDate.setFullYear(year);

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="yyyy"
            showYearPicker
        />
    );
};

export default YearSlider;
