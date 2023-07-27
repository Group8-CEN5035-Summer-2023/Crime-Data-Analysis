import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const YearSlider = ({ year, setYear, minYear, maxYear }) => {
  const handleChange = (date) => setYear(date.getFullYear());
  const selectedDate = new Date();
  selectedDate.setFullYear(year);

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="yyyy"
      showYearPicker
      minDate={new Date(minYear, 1, 1)}
      maxDate={new Date(maxYear, 1, 1)}
    />
  );
};

export default YearSlider;
