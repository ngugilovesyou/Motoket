import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

function RegionPicker({ onRegionSelect }) {
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");

  const handleRegionChange = (country, state) => {
    const countryName = Country.getCountryByCode(country)?.name || "";
    const stateName =
      State.getStateByCodeAndCountry(state, country)?.name || "";
    const fullRegion = `${countryName},${stateName}`;
    onRegionSelect(fullRegion);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Country Picker */}
      <FormControl fullWidth>
        <InputLabel id="country-label"
        sx={{color:"white"}}
        >Country</InputLabel>
        <Select
          labelId="country-label"
          id="country-select"
          value={countryCode}
          label="Country"
          onChange={(e) => {
            setCountryCode(e.target.value);
            setStateCode("");
          }}
        >
          {Country.getAllCountries().map((country) => (
            <MenuItem key={country.isoCode} value={country.isoCode}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* State Picker */}
      {countryCode && (
        <FormControl fullWidth>
          <InputLabel id="state-label">State / Province</InputLabel>
          <Select
            labelId="state-label"
            id="state-select"
            value={stateCode}
            label="State / Province"
            onChange={(e) => {
              setStateCode(e.target.value);
              handleRegionChange(countryCode, e.target.value);
            }}
          >
            {State.getStatesOfCountry(countryCode).map((state) => (
              <MenuItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

export default RegionPicker;
