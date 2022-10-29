import React from 'react';
import Grid from '@mui/material/Grid';

import MovieSelect from './movieSelect';
import ReviewContent from './reviewContent';

function NewReviewForm() {
    return (
        <Grid container>
            <MovieSelect item xs={2} />
            <ReviewContent item xs={10} />
        </Grid>
    );
}

export default NewReviewForm;
