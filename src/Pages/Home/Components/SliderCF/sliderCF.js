/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './sliderCF.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Pagination, FreeMode, Navigation } from 'swiper';

import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import cfApi from '~/Api/cfApi';
import apiConfig from '~/Api/apiConfig';
import tmdbApi, { movieType } from '~/Api/tmdbApi';
import { userSelector } from '~/Redux/selector';

function SliderCF() {
    const [movieItems, setMovieItems] = useState([]);
    const user = useSelector(userSelector);

    useEffect(() => {
        const getCF = async () => {
            if (user.rank === 'Customer') {
                cfApi
                    .getByUserId(user.int_id)
                    .then(async (data) => {
                        const listPromise = [];
                        data.film_id_array.forEach((filmId) => {
                            listPromise.push(tmdbApi.getMovie(filmId));
                        });

                        setMovieItems(await Promise.all(listPromise));
                    })
                    .catch((err) => console.log(err));
            }
        };

        getCF();
    }, []);

    return (
        <div>
            {movieItems.length > 0 && (
                <div className="typeOfFilm__container">
                    <div className="typeOfFilm__container__header">
                        <h3 className="typeOfFilm__container__header__title">For you</h3>
                    </div>

                    <div className="typeOfFilm__container__content">
                        {/* {viewMoreVisible && <ViewMoreButton typeFilm={typeFilm} />} */}
                        <Swiper
                            className="typeOfFilm__container__content__swiper"
                            slidesPerView={5}
                            centeredSlides
                            loop
                            freeMode
                            navigation
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

export default SliderCF;
