import React from 'react';

import Grid from '@mui/material/Grid';
import Filter from './filter';
import Display from './display';

function Censor() {
    return (
        <Grid container>
            <Grid item xs={2}>
                <Filter />
            </Grid>

            <Grid item xs={10}>
                <Display />
            </Grid>
        </Grid>
    );
}

export default Censor;
