import React, { useState, useEffect } from 'react';
import './slider.css';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useNavigate } from 'react-router';
import tmdbApi, { movieType } from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

function Slider() {
    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState([]);

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

    return (
        <div className="slide__container">
            <Swiper modules={[Autoplay]} grabCursor spaceBetween={0} slidesPerView={1}>
                {movieItems.map((item) => (
                    <SwiperSlide key={item.id}>
                        <SlideItem item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function SlideItem(props) {
    const { item } = props;
    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const navigate = useNavigate();

    const GoToDetails = () => {
        navigate(`/filmDetails/${item.id}`);
    };

    const openBooking = () => {
        navigate(`/booking/${item.id}`);
    };

    return (
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
    );
}

export default Slider;
