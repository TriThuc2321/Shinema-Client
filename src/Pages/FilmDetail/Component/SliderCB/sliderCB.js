/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './sliderCB.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Pagination, FreeMode, Navigation } from 'swiper';

import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import apiConfig from '~/Api/apiConfig';
import tmdbApi, { movieType } from '~/Api/tmdbApi';

function SliderCB(props) {
    const [movieItems, setMovieItems] = useState([]);
    const { currentMovieId } = props;
    const [id, setId] = useState();

    useEffect(() => {
        if (currentMovieId) setId(currentMovieId);
    }, [props]);

    useEffect(() => {
        const getCB = async () => {
            await fetch(`http://shinema-py.herokuapp.com/getCB?movieId=${id}`)
                .then((res) => {
                    if (res.status === 200) return res.json();
                    setId('19995');
                    return null;
                })
                .then(async (data) => {
                    if (data) {
                        const listPromise = [];
                        Object.values(data).forEach((filmId) => {
                            listPromise.push(tmdbApi.getMovie(filmId));
                        });
                        setMovieItems(await Promise.all(listPromise));
                    }
                })
                .catch((err) => console.log(err));
        };

        if (id) getCB();
    }, [id]);

    return (
        <div>
            {movieItems.length > 0 && (
                <div className="typeOfFilm__container">
                    <div className="typeOfFilm__container__header">
                        <h3 className="typeOfFilm__container__header__title">Same content</h3>
                    </div>

                    <div className="typeOfFilm__container__content">
                        {/* {viewMoreVisible && <ViewMoreButton typeFilm={typeFilm} />} */}
                        <Swiper
                            className="typeOfFilm__container__content__swiper"
                            slidesPerView={5}
                            centeredSlides
                            loop
                            freeMode
                            modules={[Pagination, Navigation, FreeMode]}
                        >
                            {movieItems.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <SlideItem item={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
}

function SlideItem(props) {
    const { item } = props;
    const background = apiConfig.originalImage(item.backdrop_path ? item.poster_path : item.backdrop_path);

    const navigate = useNavigate();

    const openBooking = () => {
        navigate(`/booking/${item.id}`);
    };

    const GoToDetails = () => {
        navigate(`/filmDetails/${item.id}`);
    };
    return (
        <div className="typeOfFilm__item__container">
            <div className="typeOfFilm__item__container__hoverItem">
                <button
                    className="typeOfFilm__item__container__hoverItem__buyTicketBtn"
                    onClick={openBooking}
                    type="button"
                >
                    Booking
                </button>
            </div>
            <img className="typeOfFilm__item__container__img" src={background} alt={item.title} onClick={GoToDetails} />
            <label className="typeOfFilm__item__container__title" onClick={GoToDetails}>
                {item.title}
            </label>
        </div>
    );
}

export function ViewMoreButton(props) {
    const { typeFilm } = props;
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: {
                main: '#fff',
                outline: '#fff',
            },
        },
    });

    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/corner/movie/${typeFilm}`);
    };

    return (
        <div className="typeOfFilm__container__content__viewMore">
            <ThemeProvider theme={btnTheme}>
                <Button sx={{ paddingX: 5, paddingY: 0.8 }} variant="outlined" onClick={onClick}>
                    View more
                </Button>
            </ThemeProvider>
        </div>
    );
}

// export const ViewMoreButton2 = (props) => {
//     const btnTheme = createTheme({
//         shape: {
//             borderRadius: 20
//         },
//         palette: {
//             primary: {
//                 main: '#fff',
//                 outline: '#fff',
//             }
//         },
//     })

//     return (
//         <div className='typeOfFilm__container__content__viewMore2'>
//             <ThemeProvider theme={btnTheme} >
//                 <Button sx={{ paddingX: 5, paddingY: 0.8 }} variant="outlined" onClick={props.onClick} >Xem thêm</Button>
//             </ThemeProvider>
//         </div >
//     )
// }

export default SliderCB;
