/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import userSlice from '~/Redux/slices/userSlice';
import reviewSlice from '~/Redux/slices/reviewSlice';
import ReviewApi from '~/Api/reviewApi';

import apiConfig from '~/Api/apiConfig';
import tmdbApi, { category } from '~/Api/tmdbApi';

import Content from './content';
import CastList from '~/Components/CastList/index';

function ReviewDetail() {
    const { reviewId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reviewIns = useSelector((state) => state.review.current);
    const userIns = useSelector((state) => state.users.instance);

    const [filmIns, setFilmIns] = useState();

    useEffect(() => {
        ReviewApi.getById(reviewId)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(reviewSlice.actions.updateCurrent(res.data));
                }
            })
            .catch((err) => console.log(err));
    }, [reviewId]);

    useEffect(() => {
        if (reviewIns) {
            const getMovie = async () => {
                const params = {};

                try {
                    const response = await tmdbApi.detail(category.movie, reviewIns._filmId, { params });
                    setFilmIns(response);
                    // setImg(apiConfig.originalImage(response.backdrop_path ? response.backdrop_path : response.poster_path))
                } catch (err) {
                    console.log(err);
                }
            };

            getMovie();
        }
    }, [reviewIns]);

    const logoutHandle = () => {
        localStorage.setItem('logged', false);
        dispatch(userSlice.actions.update(''));
        navigate('/login');
    };

    return (
        <div className="film-details">
            {filmIns && (
                <>
                    <Helmet>
                        <title>{filmIns.title || filmIns.name}</title>
                    </Helmet>

                    <div
                        className="banner"
                        style={{
                            backgroundImage: `url(${apiConfig.originalImage(
                                filmIns.backdrop_path || filmIns.poster_path,
                            )})`,
                            /// backgroundColor: 'white'
                        }}
                    >
                        {' '}
                    </div>

                    <div className="movie-content">
                        <div className="movie-content__poster">
                            <div
                                className="movie-content__poster__img"
                                style={{ backgroundImage: `url(${apiConfig.originalImage(filmIns.poster_path)})` }}
                            />
                        </div>

                        <div className="movie-content__info">
                            <div className="movie-content__info__title">{filmIns.name || filmIns.title}</div>
                            <div className="movie-content__info__duration">{filmIns.runtime} minutes</div>
                            <div className="movie-content__info__genres">
                                {filmIns.genres &&
                                    filmIns.genres.slice(0, 5).map((genre, i) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <span key={i} className="movie-content__info__genres__item">
                                            {genre.name}
                                        </span>
                                    ))}
                            </div>

                            <p className="movie-content__info__overview">{filmIns.overview}</p>

                            <div className="movie-content__info__cast">
                                <div className="movie-content__info__cast__section-header">
                                    <h2>Actors</h2>
                                </div>
                                <CastList id={filmIns.id} category={category.movie} />
                            </div>
                        </div>
                    </div>

                    <Content item={reviewIns} />
                    {userIns.rank !== 'Customer' && (
                        <LogoutButton onClick={() => logoutHandle()} variant="contained" endIcon={<LoginRoundedIcon />}>
                            Logout
                        </LogoutButton>
                    )}
                </>
            )}
        </div>
    );
}

const LogoutButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#f44336'),
    backgroundColor: '#f44336',
    '&:hover': {
        backgroundColor: '#c62828',
    },
    padding: '10px 20px',
    position: 'absolute',
    top: 30,
    right: 30,
}));

export default ReviewDetail;
