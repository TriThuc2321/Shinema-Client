import React from 'react';

import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import NewReviewForm from './newReviewForm';
import UserHeader from './userHeader';

function NewReview() {
    return (
        <Stack>
            <Helmet>
                <title>Review</title>
            </Helmet>

            <Typography variant="h5" sx={{ marginTop: 5, marginLeft: 2 }}>
                REVIEWS FILM
            </Typography>

            <Stack sx={{ backgroundColor: 'rgb(9, 24, 48)', marginX: 9, marginY: 5, padding: 3, borderRadius: 3 }}>
                <UserHeader />
                <NewReviewForm />
            </Stack>
        </Stack>
    );
}

export default NewReview;
