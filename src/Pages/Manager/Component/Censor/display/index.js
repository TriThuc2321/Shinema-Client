import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import reviewSlice from '~/Redux/slices/reviewSlice';
import { reviewListByStatusSelector } from '~/Redux/selector';

import ReviewItem from './item';

import ReviewApi from '~/Api/reviewApi';

function Display() {
    const dispatch = useDispatch();
    const data = useSelector(reviewListByStatusSelector);

    useEffect(() => {
        ReviewApi.getAll()
            .then((res) => {
                if (res.status === 200) {
                    dispatch(reviewSlice.actions.updateData(res.data));
                    dispatch(reviewSlice.actions.updateStatusSearch('All'));
                } else {
                    console.log(res);
                }
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <Grid container spacing={2}>
            {!data ? (
                <LoadingBlog />
            ) : (
                data.map((item) => (
                    <Grid item key={item._id}>
                        <ReviewItem item={item} />
                    </Grid>
                ))
            )}
        </Grid>
    );
}

function LoadingBlog() {
    return (
        <Stack spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={118} />
        </Stack>
    );
}

export default Display;
