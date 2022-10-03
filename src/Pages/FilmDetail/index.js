/* eslint-disable no-restricted-syntax */
/* eslint-disable operator-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-equals-spacing */
import React, { useEffect } from 'react';
import './style.css';

import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useSelector } from 'react-redux';
// import tmdbApi, { category } from '~/Api/tmdbApi';
// import { ids3 } from './ids';

function FilmDetails() {
    useEffect(() => {
        // const getMovie = async () => {
        //     const params = {};
        //     try {
        //         const arr = [];
        //         for await (const res of ids3.map((e) => tmdbApi.detail(category.movie, e, { params }))) {
        //             arr.push(res);
        //         }
        //         console.log(JSON.stringify(arr));
        //     } catch (err) {
        //         console.log(err);
        //     }
        // };
        // getMovie();
    }, []);

    return <div>a</div>;
}

export default FilmDetails;

export function BookingBtn(props) {
    const _currentUser = useSelector((state) => state.users.instance);
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const navigate = useNavigate();

    const onClick = () => {
        const { id } = props;
        if (_currentUser === '') {
            navigate('/login');
        } else {
            navigate(`/booking/${id}`);
        }
    };

    return (
        <div>
            <ThemeProvider theme={btnTheme}>
                <Button sx={{ paddingX: 5, paddingY: 0.8 }} variant="contained" onClick={onClick}>
                    BOOKING NOW
                </Button>
            </ThemeProvider>
        </div>
    );
}
