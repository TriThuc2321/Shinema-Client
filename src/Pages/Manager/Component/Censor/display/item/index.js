/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import apiConfig from '~/Api/apiConfig';
import AccountApi from '~/Api/accountApi';
import tmdbApi, { category } from '~/Api/tmdbApi';

function ReviewItem({ item }) {
    const navigate = useNavigate();
    const LIMIT_CONTENT_LENGTH = 130;
    const [img, setImg] = useState();

    const [content, setContent] = useState();

    const onClickHandle = () => {
        navigate('/reviews/detail/' + item._id);
    };

    useEffect(() => {
        const getMovie = async () => {
            const params = {};

            try {
                const response = await tmdbApi.detail(category.movie, item._filmId, { params });
                setImg(apiConfig.originalImage(response.backdrop_path ? response.backdrop_path : response.poster_path));

                if (item.plot.length < LIMIT_CONTENT_LENGTH) {
                    setContent(item.plot);
                } else {
                    const toShow = item.plot.substring(0, LIMIT_CONTENT_LENGTH) + '...';
                    setContent(toShow);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getMovie();
    }, [item]);
    return (
        <Card sx={{ maxWidth: 400, minHeight: 460, backgroundColor: 'rgb(9, 24, 48)' }}>
            <CardActionArea onClick={() => onClickHandle()}>
                {img && <CardMedia component="img" height="200" image={img} alt="green iguana" />}

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {item.title}
                    </Typography>
                    <Header userId={item._userId} status={item.status} />
                    <div
                        style={{
                            width: '40%',
                            height: '2px',
                            backgroundColor: '#c62828',
                            marginTop: '10px',
                            marginBottom: '5px',
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ color: 'rgb(203, 203, 203' }}>
                        {content}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

function Header({ userId, status }) {
    const [, setBackgroundColorAvatar] = useState('#FF4820');
    useEffect(() => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setBackgroundColorAvatar(randomColor);
    }, []);

    const [user, setUser] = useState();
    useEffect(() => {
        const getUser = () => {
            AccountApi.getById(userId)
                .then((res) => {
                    if (res.status === 200) {
                        setUser(res.data);
                    }
                })
                .catch((err) => console.log(err));
        };
        getUser();
    }, []);

    return (
        <div>
            {user && (
                <Stack direction="row" sx={{ justifyContent: 'space-between', marginY: 1.5 }}>
                    <Stack direction="row">
                        <Avatar>{user.name.charAt(0)}</Avatar>
                        <Stack sx={{ marginLeft: 2 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                            <Typography sx={{ fontSize: 12 }}>{user.email}</Typography>
                        </Stack>
                    </Stack>

                    {status === 'Inspected' && (
                        <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }}>{status}</Typography>
                    )}
                    {status === 'Inspecting' && (
                        <Typography sx={{ color: '#f57f17', fontWeight: 'bold' }}>{status}</Typography>
                    )}
                    {status === 'Uninspected' && (
                        <Typography sx={{ color: '#b71c1c', fontWeight: 'bold' }}>{status}</Typography>
                    )}
                </Stack>
            )}
        </div>
    );
}

export default ReviewItem;
