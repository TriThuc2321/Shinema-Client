/* eslint-disable*/
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from './countriesList';

export default function CountryFilter({ selectedCountry, setMethod }) {
    return (
        <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => {
                setMethod(value);
            }}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                    />
                    {option.label} ({option.code})
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Choose a country"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    sx={{
                        marginTop: 1,
                        width: 350,
                        backgroundColor: 'rgb(9, 24, 48)',
                        borderRadius: 0.5,
                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                        // eslint-disable-next-line object-curly-newline
                        label: { color: 'rgb(153, 153, 153)', marginLeft: 10, marginX: 2, fontSize: 15 },
                    }}
                />
            )}
        />
    );
}
