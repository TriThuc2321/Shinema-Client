/* eslint-disable no-shadow */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import TheaterSeat from '../TheaterSeat';

import styles from './styles';

import { bookingSelector } from '~/Redux/selector';

function RoomItem({ theater }) {
    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [theaterFilmAvailable, setTheaterFilmAvailable] = useState(theater);
    const [listRoomId] = useState(CURRENT_BOOKING.currentRoomIdArray);

    useEffect(() => {
        let tmpList = [];
        listRoomId.forEach((roomId) => {
            theaterFilmAvailable.listRoom.forEach((room) => {
                if (roomId === room.id) {
                    tmpList.push(room);
                }
            });
        });

        setTheaterFilmAvailable({ ...theaterFilmAvailable, listRoom: tmpList });
    }, []);

    // useEffect(() => { console.log(theaterFilmAvailable) }, [theaterFilmAvailable]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
    }));

    const BookedItem = styled(Paper)(({ theme }) => ({
        backgroundColor: '#07162b',
        border: '1px solid #fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: '#fff',
    }));

    const ChooseItem = styled(Paper)(({ theme }) => ({
        backgroundColor: '#eb4034',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: '#eb4034',
        cursor: 'pointer',
    }));

    return (
        <Box sx={styles.boxContainer}>
            <Box alignItems="center">
                <Stack direction="row">
                    <Stack direction="row" sx={{ pl: 1, pr: 1 }}>
                        <Item />
                        <Typography variant="caption" sx={{ pl: 1 }} style={{ fontStyle: 'italic' }}>
                            Available
                        </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ pl: 1, pr: 1 }}>
                        <BookedItem />
                        <Typography variant="caption" sx={{ pl: 1 }} style={{ fontStyle: 'italic' }}>
                            Booked
                        </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ pl: 1, pr: 1 }}>
                        <ChooseItem />
                        <Typography variant="caption" sx={{ pl: 1 }} style={{ fontStyle: 'italic' }}>
                            Choose
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            <h2 style={styles.text}>{theater.name}</h2>
            <p style={styles.text}>{theater.address}</p>
            <p style={styles.text}>Contact: {theater.contact}</p>

            {theaterFilmAvailable.listRoom.map((theater) => (
                <TheaterSeat key={theater._id} item={theater} />
            ))}
        </Box>
    );
}

export default RoomItem;
