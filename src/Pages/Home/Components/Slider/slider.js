import React, { useState, useEffect } from 'react';
import './slider.css';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useNavigate } from 'react-router';
import { Skeleton, Typography } from '@mui/material';
import tmdbApi, { movieType } from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

function Slider() {
    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState();

    useEffect(() => {
        const getMovies = async () => {
            const params = {
                page: 1,
            };

            try {
                const response = await tmdbApi.getMoviesList(movieType.now_playing, { params });
                setMovieItems(response.results.slice(4, 9));
            } catch {
                console.log('error');
            }
        };
        getMovies();
    }, []);

    return movieItems ? (
        <div className="slide__container">
            <Swiper modules={[Autoplay]} grabCursor spaceBetween={0} slidesPerView={1}>
                {movieItems.map((item) => (
                    <SwiperSlide key={item.id}>
                        <SlideItem item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    ) : (
        <SlideItem />
    );
}

function SlideItem(props) {
    const { item } = props;
    let background = '';
    try {
        background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);
    } catch (err) {
        background = '';
    }

    const navigate = useNavigate();

    const GoToDetails = () => {
        navigate(`/filmDetails/${item.id}`);
    };

    const openBooking = () => {
        navigate(`/booking/${item.id}`);
    };

    return item ? (
        <div className="slide__item" style={{ backgroundImage: `url(${background})` }}>
            <div className="slide__item__contain">
                <div className="slide__item__content__info">
                    <h2 className="slide__item__content__info__title">{item.title}</h2>
                    <div className="slide__item__content__info__overview">{item.overview}</div>
                    <div className="slide__item__content__info__button">
                        <button
                            className="slide__item__content__info__button__bookTicket"
                            type="button"
                            onClick={openBooking}
                        >
                            BUY TICKET
                        </button>
                        <button
                            className="slide__item__content__info__button__trailer"
                            type="button"
                            onClick={GoToDetails}
                        >
                            DETAILS
                        </button>
                    </div>
                </div>

                <img className="slider__item__content__poster" src={apiConfig.originalImage(item.poster_path)} alt="" />
            </div>
        </div>
    ) : (
        <div className="slide__item">
            <div className="slide__item__contain">
                <div className="slide__item__content__info">
                    <Typography variant="h1">
                        <Skeleton />
                    </Typography>
                    <Typography>
                        <Skeleton height="30vh" />
                    </Typography>
                    <div className="slide__item__content__info__button">
                        <Skeleton height="10vh" width="10vw" />
                        <Skeleton height="10vh" width="10vw" sx={{ marginLeft: 5 }} />
                    </div>
                </div>

                <div className="slider__item__content__poster">
                    <Skeleton width="20vw" />
                </div>
            </div>
        </div>
    );
}

export default Slider;
