import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const CustomButton = styled(Button)({
  backgroundColor: "#057",
  color: "#fff",
  borderRadius: 16,
  margin: "8px",
  "&:hover": {
    backgroundColor: "#046",
  },
  fontSize: "0.875rem",
});

export default function Buttons({ onFilterChange }) {
  const [businesses, setBusinesses] = useState([]);
  const [diet, setDiet] = useState({
    "Gluten-Free": false,
    Vegetarian: false,
    Vegan: false,
  });
  const [weekday, setWeekday] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    console.log("Fetching businesses...");
    fetch("/api/business/all-details")
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched businesses:", data);
        setBusinesses(data);
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
      });
  }, []);

  const handleDietChange = (event) => {
    const newDiet = { ...diet, [event.target.name]: event.target.checked };
    console.log("Diet changed:", newDiet);
    setDiet(newDiet);
  };

  const handleWeekdayChange = (event) => {
    console.log("Weekday changed:", event.target.value);
    setWeekday(event.target.value);
  };

  const handleTimeChange = (event) => {
    console.log("Time changed:", event.target.value);
    setTime(event.target.value);
  };

  const resetWeekday = () => {
    setWeekday("");
  };

  const resetTime = () => {
    setTime("");
  };

  useEffect(() => {
    console.log("Current Diet Selection:", diet);
    console.log("Current Weekday Selection:", weekday);
    console.log("Current Time Selection:", time);
    console.log("Total businesses:", businesses.length);

    const filteredData = businesses.filter((item) => {
      if (!item) return false;

      console.log("Filtering item:", item);

      const dietMatch =
        Object.keys(diet).every((key) => !diet[key]) ||
        Object.keys(diet).some(
          (key) =>
            diet[key] &&
            item.diets &&
            item.diets.toLowerCase().includes(key.toLowerCase())
        );
      console.log("Diet Match:", dietMatch, "Item diets:", item.diets);

      const dayMatch =
        !weekday ||
        (item.day_of_week &&
          item.day_of_week.toLowerCase().includes(weekday.toLowerCase()));
      console.log(
        "Day Match:",
        dayMatch,
        "Item day_of_week:",
        item.day_of_week
      );

      const timeMatch =
        !time ||
        (item.start_time &&
          item.end_time &&
          new Date(`1970-01-01T${item.start_time}`) <=
            new Date(`1970-01-01T${time}`) &&
          new Date(`1970-01-01T${time}`) <=
            new Date(`1970-01-01T${item.end_time}`));
      console.log(
        "Time Match:",
        timeMatch,
        "Item start_time:",
        item.start_time,
        "Item end_time:",
        item.end_time
      );

      const result = dietMatch && dayMatch && timeMatch;
      console.log("Final Result for this item:", result);

      return result;
    });

    console.log("Filtered Data:", filteredData);
    onFilterChange(filteredData);
  }, [diet, weekday, time, businesses]);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#111",
        p: 2,
        gap: 0,
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {Object.keys(diet).map((label) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={diet[label]}
                onChange={handleDietChange}
                name={label}
                sx={{ color: "#fff", "&.Mui-checked": { color: "#046" } }}
              />
            }
            label={label}
            sx={{
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
            key={label}
          />
        ))}
      </Box>

      <FormControl fullWidth sx={{ backgroundColor: "#FFFFFF" }}>
      <InputLabel 
    id="weekday-select-label" 
    sx={{ marginTop: '10px' }} // Adjust the value as needed
  >
    Weekday
  </InputLabel>
  <Select
    labelId="weekday-select-label"
    id="weekday-select"
    value={weekday}
    label="Weekday"
    onChange={handleWeekdayChange}
  >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={resetWeekday}>Reset Weekday</Button>

      <FormControl fullWidth sx={{ backgroundColor: "#FFFFFF" }}>
      <InputLabel 
    id="time-select-label" 
    sx={{ marginTop: '10px' }} // Adjust the value as needed
  >
    Start Time
  </InputLabel>
        <Select
          labelId="time-select-label"
          id="time-select"
          value={time}
          label="Time"
          onChange={handleTimeChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {[
            "11:00AM",
            "12:00PM",
            "1:00PM",
            "2:00PM",
            "3:00PM",
            "4:00PM",
            "5:00PM",
            "6:00PM",
            "7:00PM",
            "8:00PM",
            "9:00PM",
            "10:00PM",
          ].map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={resetTime}>Reset Time</Button>
    </Box>
  );
}
