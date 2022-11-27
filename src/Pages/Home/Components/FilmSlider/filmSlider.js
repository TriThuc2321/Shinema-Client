/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './filmSlider.css';

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
import googleTrendsApi from '~/Api/googleTrendsApi';

const NUM_FILM_LOADING = 8;

function FilmSlider(props) {
    const { id, typeFilm, category } = props;
    const [movieItems, setMovieItems] = useState([]);
    const [movieTypes, setMovieTypes] = useState('');
    const [trendsMovie, setTrendsMovie] = useState([]);

    const [viewMoreVisible, setViewMoreVisible] = useState(true);

    useEffect(() => {
        const getMovies = async () => {
            const params = {
                page: 1,
            };

            try {
                if (typeFilm !== 'similar') {
                    const response = await tmdbApi.getMoviesList(typeFilm, { params });
                    setMovieItems(response.results.slice(0, NUM_FILM_LOADING));
                } else {
                    const response = await tmdbApi.similar(category, id);
                    setMovieItems(response.results.slice(0, NUM_FILM_LOADING));
                    setViewMoreVisible(false);
                }
            } catch {
                console.log('Film slider error');
            }
        };

        getMovies();

        const getTypes = () => {
            if (typeFilm === movieType.popular) setMovieTypes('Popular');
            if (typeFilm === movieType.upcoming) setMovieTypes('Upcoming');
            if (typeFilm === movieType.top_rated) setMovieTypes('Top rated');
            if (typeFilm === 'similar') {
                setMovieTypes('Similar');
            }
        };

        getTypes();

        // const getTrends = async () => {
        //     // eslint-disable-next-line no-unused-vars
        //     let keywordsRes = [];
        //     await googleTrendsApi
        //         .getDailyTrends()
        //         .then(async (res) => {
        //             const listPromise = [];
        //             res.data.forEach((trendsWord) => {
        //                 listPromise.push(tmdbApi.searchListKeyword(trendsWord));
        //             });

        //             const resKeyword = await Promise.all(listPromise);
        //             resKeyword.map((item) => {
        //                 if (item.total_results !== 0) {
        //                     keywordsRes.push(item.results);
        //                 }
        //             });
        //         })
        //         .catch((err) => console.log(err));

        //     let listKeyword = [];
        //     keywordsRes.map((array) => {
        //         array.map((item) => listKeyword.push(item));
        //     });

        //     let discoverRes = [];
        //     let dictionary = [];
        //     if (listKeyword.length !== 0) {
        //         const listPromise = [];
        //         listKeyword.map((item) => {
        //             listPromise.push(tmdbApi.discoverWithKeyword(item.id));
        //         });
        //         discoverRes = await Promise.all(listPromise);

        //         console.log('discoverRes', discoverRes);

        //         console.log('listKeyword', listKeyword);
        //         for (let i = 0; i < listKeyword.length; i++) {
        //             const res = {
        //                 keyword: listKeyword[i],
        //                 movies: discoverRes[i].results,
        //             };
        //             dictionary.push(res);
        //         }
        //     }
        //     setTrendsMovie(dictionary);
        // };

        // getTrends();
    }, [props]);

    useEffect(() => {
        console.log(trendsMovie);
    }, [trendsMovie]);

    return (
        <div className="typeOfFilm__container" id={typeFilm}>
            <div className="typeOfFilm__container__header">
                <h3 className="typeOfFilm__container__header__title">{movieTypes}</h3>
            </div>

            <div className="typeOfFilm__container__content">
                {viewMoreVisible && <ViewMoreButton typeFilm={typeFilm} />}
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

export default FilmSlider;
