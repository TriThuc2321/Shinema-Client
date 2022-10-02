/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import reviewSlice from '~/Redux/slices/reviewSlice';
import ReviewApi from '~/Api/reviewApi';
import Loading from '~/Components/Loading';

function ReviewContent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        title: '',
        description: '',
        plot: '',
        advantage: '',
        defect: '',
        overview: '',
    });

    const handleChange = (prop) => (event) => {
        const newVal = { ...values, [prop]: event.target.value };
        setValues(newVal);
        dispatch(reviewSlice.actions.newContentChange(newVal));
    };

    const user = useSelector((state) => state.users.instance);
    const currentFilm = useSelector((state) => state.movies.selectForReview);

    const postHandle = () => {
        if (checkData()) {
            setLoading(true);

            const currentTime = new Date();
            const dateFormat = format(currentTime, 'PP p');

            const reviewObj = {
                title: values.title,
                description: values.description,
                plot: values.plot,
                advantage: values.advantage,
                defect: values.defect,
                overview: values.overview,
                time: dateFormat,
                star: 0,
                status: 'Inspecting',
                listComments: [],
                _userId: user._id,
                _filmId: currentFilm.id,
            };

            ReviewApi.create(reviewObj)
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false);
                        openAlert('Post new review successful', 'success');
                        navigate('/reviews');
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const checkData = () => {
        if (currentFilm.title == null) {
            openAlert('Please choose the movie', 'error');
            return false;
        }
        if (values.title === '') {
            openAlert('Please fill out title of movie', 'error');
            return false;
        }
        if (values.description === '') {
            openAlert('Please fill out description of movie', 'error');
            return false;
        }
        return true;
    };

    const [alertObj, setAlertObj] = useState({
        message: '',
        status: false,
        type: 'error',
    });

    const openAlert = (text, type) => {
        setAlertObj({ message: text, status: true, type });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertObj({ ...alertObj, status: false });
    };

    return (
        <Stack sx={{ marginLeft: 10, width: '65%' }}>
            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                label="Title"
                variant="standard"
                onChange={handleChange('title')}
            />

            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                minRows={3}
                inputProps={{ sx: { color: '#fff' } }}
                label="Description"
                variant="standard"
                multiline
                onChange={handleChange('description')}
            />

            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                minRows={3}
                inputProps={{ sx: { color: '#fff' } }}
                label="Plot"
                variant="standard"
                multiline
                onChange={handleChange('plot')}
            />

            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                minRows={3}
                inputProps={{ sx: { color: '#fff' } }}
                label="Advantage"
                variant="standard"
                multiline
                onChange={handleChange('advantage')}
            />

            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                minRows={3}
                inputProps={{ sx: { color: '#fff' } }}
                label="Defect"
                variant="standard"
                multiline
                onChange={handleChange('defect')}
            />

            <CustomTextField
                sx={{
                    marginY: 1,
                    input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                    label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                }}
                minRows={3}
                inputProps={{ sx: { color: '#fff' } }}
                label="Overview"
                variant="standard"
                multiline
                onChange={handleChange('overview')}
            />

            <CustomFillButton onClick={() => postHandle()}>Post</CustomFillButton>

            <Snackbar open={alertObj.status} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertObj.type} variant="filled">
                    {alertObj.message}
                </Alert>
            </Snackbar>

            {loading && <Loading />}
        </Stack>
    );
}

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#fff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#fff',
        },
        '&:hover fieldset': {
            borderColor: '#fff',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#fff',
        },
    },
});

const CustomFillButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[900]),
    backgroundColor: red[800],
    '&:hover': {
        backgroundColor: red[500],
    },
    padding: '6px 35px',
    borderRadius: '10px',
}));

export default ReviewContent;
