import * as React from 'react';

import Box from '@mui/material/Box';
// eslint-disable-next-line no-unused-vars
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import styles from './styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function FormRow({ row }) {
    return (
        <>
            {row.map((item) => (
                <Grid item xs={1} key={item}>
                    <Item>{item}</Item>
                </Grid>
            ))}
        </>
    );
}

function TheaterRoom({ item }) {
    return (
        <Box sx={styles.boxContainer}>
            <p style={styles.text}>{item.name}</p>
            <div
                style={{
                    backgroundColor: '#b71c1c',
                    height: 5,
                    width: '100%',
                    marginTop: 5,
                    marginBottom: 10,
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                }}
            />
            <p style={{ color: '#fff', marginBottom: 30 }}>Screen</p>

            <Grid container spacing={1}>
                {item.listSeat.map((row) => (
                    <Grid container item spacing={3} key={row}>
                        <FormRow row={row} />
                    </Grid>
                ))}
            </Grid>

            <div
                style={{
                    backgroundColor: '#cfcfcf',
                    height: 0.5,
                    width: '105%',
                    marginTop: 10,
                    marginBottom: 10,
                }}
            />
        </Box>
    );
}
export default TheaterRoom;
