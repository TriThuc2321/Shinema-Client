/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { MdOutlineDeleteOutline } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import showTimeSlice from '~/Redux/slices/showTimeSlice';
import TheaterApi from '~/Api/theaterApi';

import apiConfig from '~/Api/apiConfig';
import styles from './styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function ShowTimeManagerItem({ item, openEdit }) {
    const [theater, setTheater] = useState();
    const [room, setRoom] = useState();
    const dispatch = useDispatch();

    const openEditHandle = () => {
        dispatch(showTimeSlice.actions.updateCurrentShowtime(item));
        openEdit();
    };

    useEffect(() => {
        let cancel = false;

        TheaterApi.getById(item.theaterId).then((res) => {
            if (cancel) return;
            setTheater(res.data);
            setRoom(res.data.listRoom.filter((e) => e.id === item.roomId));
        });
        return () => {
            cancel = true;
        };
    }, []);

    const poster = apiConfig.originalImage(item.film.backdrop_path ? item.film.poster_path : item.film.backdrop_path);
    return (
        <Box>
            {theater && room && (
                <Box sx={styles.boxContainer}>
                    <div>
                        <Box sx={styles.container}>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    position: 'absolute',
                                    top: 80,
                                    right: 100,
                                }}
                            >
                                <AiOutlineEdit
                                    style={{ width: 30, height: 30, cursor: 'pointer' }}
                                    onClick={openEditHandle}
                                />
                                <MdOutlineDeleteOutline
                                    style={{ width: 30, height: 30, marginLeft: 10, cursor: 'pointer' }}
                                />
                            </div>

                            <h1 style={{ color: 'white', fontSize: 45 }}>{item.film.title}</h1>
                            {/* <p style={{ color: 'white', }}>{item.film.overview}</p> */}

                            <p style={{ color: 'white', fontSize: 18, marginTop: 30 }}>{item.film.runtime} minutes</p>
                            <p style={{ color: 'white', fontSize: 18 }}>{room[0].name}</p>
                            <p style={{ color: 'white', fontSize: 18 }}>{theater.address}</p>

                            <Grid sx={{ paddingLeft: 0, paddingTop: 1 }} container spacing={{ md: 1 }}>
                                {item.listDateTime[0].times.map((_, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Grid item key={index} sx={{ minWidth: 80 }}>
                                        <Item>{item.listDateTime[0].times[index]}</Item>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </div>

                    <div
                        style={{
                            backgroundImage: `url(${poster})`,
                            display: 'flex',
                            height: 500,
                            width: 350,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: 20,
                            boxShadow: 5,
                            marginLeft: 10,
                            position: 'absolute',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default ShowTimeManagerItem;
