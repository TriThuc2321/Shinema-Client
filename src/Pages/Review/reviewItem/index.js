import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import AccountApi from '~/Api/accountApi';
import tmdbApi, { category } from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

function ReviewItem({ item }) {
    const navigate = useNavigate();
    const LIMIT_CONTENT_LENGTH = 130;
    const [img, setImg] = useState();

    const [content, setContent] = useState();

    const onClickHandle = () => {
        navigate(`/reviews/detail/${item._id}`);
    };

    useEffect(() => {
        const getMovie = async () => {
            const params = {};
            console.log(item);

            try {
                const response = await tmdbApi.detail(category.movie, item._filmId, { params });
                setImg(apiConfig.originalImage(response.backdrop_path ? response.backdrop_path : response.poster_path));

                if (item.description.length < LIMIT_CONTENT_LENGTH) {
                    setContent(item.description);
                } else {
                    const toShow = `${item.description.substring(0, LIMIT_CONTENT_LENGTH)}...`;
                    setContent(toShow);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getMovie();
    }, []);
    return (
        <Card sx={{ maxWidth: 345, minHeight: 400, backgroundColor: 'rgb(9, 24, 48)' }}>
            <CardActionArea onClick={() => onClickHandle()}>
                {img && <CardMedia component="img" height="200" image={img} alt="green iguana" />}

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {item.title}
                    </Typography>

                    <Header userId={item._userId} />
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

function Header({ userId }) {
    const [backgroundColorAvatar, setBackgroundColorAvatar] = useState('#FF4820');
    useEffect(() => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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
                <Stack direction="row" sx={{ marginY: 1.5 }}>
                    <Avatar sx={{ bgcolor: backgroundColorAvatar }}>{user.name.charAt(0)}</Avatar>
                    <Stack sx={{ marginLeft: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                        <Typography sx={{ fontSize: 12 }}>{user.email}</Typography>
                    </Stack>
                </Stack>
            )}
        </div>
    );
}
export default ReviewItem;
