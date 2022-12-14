/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-equals-spacing */
import React, { useState, useEffect } from 'react';
import './style.css';

import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import tmdbApi, { category } from '~/Api/tmdbApi';

import apiConfig from '~/Api/apiConfig';
import ShowTimeApi from '~/Api/showTimeApi';
import ReportAnalysisApi from '~/Api/reportAnalysis';
import { subDate, removeDuplicates } from '~/Utils';

import CastList from './Component/CastList/castList';
import VideoList from './Component/VideoList/videoList';
import FilmSlider from './Component/FilmSlider/filmSlider';
import SliderCB from './Component/SliderCB/sliderCB';
import { userSelector } from '~/Redux/selector';
import cfApi from '~/Api/cfApi';

function FilmDetails() {
    const { id } = useParams();
    const [film, setFilm] = useState();
    const [showTimeList, setShowTimeList] = useState([]);
    const [dateArray, setDateArray] = useState([]);
    const user = useSelector(userSelector);
    useEffect(() => {
        const getMovie = async () => {
            const params = {};

            try {
                const response = await tmdbApi.detail(category.movie, id, { params });
                setFilm(response);
                const report = {
                    title: response.title,
                    _filmId: response.id,
                };
                ReportAnalysisApi.report(report);
            } catch (err) {
                console.log(err);
            }
        };

        getMovie();

        const fetchShowTimeByFilmId = async () => {
            await ShowTimeApi.getByFilmId(id).then((res) => {
                setShowTimeList(res.data);
            });
        };

        fetchShowTimeByFilmId();

        const sendDataCF = async () => {
            const data = {
                _user: user.int_id,
                _item: id,
                _rating: 3,
            };

            await cfApi
                .update(data)
                .then((res) => {})
                .catch((err) => console.log(err));
        };

        if (user && user.rank === 'Customer') sendDataCF();
    }, [id]);

    useEffect(() => {
        const getDate = async () => {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            const current = `${month}/${day}/${year}`;

            await showTimeList.forEach((showTime) => {
                showTime.listDateTime.forEach((object) => {
                    console.log(object.date);
                    if (subDate(object.date, current) >= 1) dateArray.push(object.date);
                    setDateArray([...dateArray, object.date]);
                });
            });

            setDateArray(removeDuplicates(dateArray));
        };

        getDate();
    }, [showTimeList]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="film-details">
            {film && (
                <>
                    <Helmet>
                        <title>{film.title || film.name}</title>
                    </Helmet>

                    <div
                        className="banner"
                        style={{
                            backgroundImage: `url(${apiConfig.originalImage(film.backdrop_path || film.poster_path)})`,
                            /// backgroundColor: 'white'
                        }}
                    />

                    <div className="movie-content">
                        <div className="movie-content__poster">
                            <div
                                className="movie-content__poster__img"
                                style={{ backgroundImage: `url(${apiConfig.originalImage(film.poster_path)})` }}
                            />
                            {dateArray.length > 0 && (
                                <div className="movie-content__booking">
                                    <Box textAlign="center">
                                        <BookingBtn id={id} />
                                    </Box>
                                </div>
                            )}
                        </div>

                        <div className="movie-content__info">
                            <div className="movie-content__info__title">{film.name || film.title}</div>
                            <div className="movie-content__info__duration">{`${film.runtime} minutes`}</div>
                            <div className="movie-content__info__genres">
                                {film.genres &&
                                    film.genres.slice(0, 5).map((genre, i) => (
                                        <span key={i} className="movie-content__info__genres__item">
                                            {genre.name}
                                        </span>
                                    ))}
                            </div>

                            <p className="movie-content__info__overview">{film.overview}</p>

                            <div className="movie-content__info__cast">
                                <div className="movie-content__info__cast__section-header">
                                    <h2>Actors</h2>
                                </div>
                                <CastList id={film.id} category={category.movie} />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="section mb-3">
                            <VideoList id={film.id} category={category.movie} />
                        </div>

                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <SliderCB currentMovieId={film.id} />
                            </div>
                        </div>

                        <div className="section mb-3">
                            <div className="section__header mb-2">
                                <FilmSlider category={category.movie} typeFilm="similar" id={film.id} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
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
