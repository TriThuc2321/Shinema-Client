/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-multi-spaces */
import React, { useState, useEffect } from 'react';
import './filmSlider.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Pagination, FreeMode, Navigation } from 'swiper';
// import { add, update, remove } from "../../redux/actions/movieAction"
// import { MovieReducer } from '../../redux/slices/movieSlice';

import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import apiConfig from '../../api/apiConfig';
import tmdbApi, { movieType } from '../../api/tmdbApi';

const NUM_FILM_LOADING = 8;

function FilmSlider(props) {
    const { typeFilm } = props;
    const { category } = props;
    const { id } = props;

    const [movieItems, setMovieItems] = useState([]);
    const [movieTypes, setMovieTypes] = useState('');
    const [page] = useState(1);
    const [, setTotalPages] = useState();

    const [viewMoreVisible, setViewMoreVisible] = useState(true);

    useEffect(() => {
        const getMovies = async () => {
            const params = {
                page,
            };
            try {
                if (typeFilm !== 'similar') {
                    const response = await tmdbApi.getMoviesList(typeFilm, { params });
                    setMovieItems(response.results.slice(0, NUM_FILM_LOADING));
                    setTotalPages(response.total_pages);
                } else {
                    const response = await tmdbApi.similar(category, id);
                    setMovieItems(response.results.slice(0, NUM_FILM_LOADING));
                    setTotalPages(response.total_pages);
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
    }, [props]);

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
                    // pagination={{
                    //     clickable: true,
                    // }}
                    loop
                    freeMode
                    // navigation={{
                    //     nextEl: {next},
                    //     prevEl: {prev}
                    // }}

                    // navigation
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
    // const dispatch = useDispatch();
    // const data = useSelector(movieSelector)
    const navigate = useNavigate();

    const openBooking = () => {
        navigate(`/booking/${item.id}`);
    };

    const GoToDetails = () => {
        // dispatch(
        //     movieSlice.actions.addMovie({name: 'ccccccc'})
        // )

        // console.log(data.movie)
        navigate(`/filmDetails/${item.id}`);
    };
    return (
        <div className="typeOfFilm__item__container">
            <div className="typeOfFilm__item__container__hoverItem">
                <button className="typeOfFilm__item__container__hoverItem__buyTicketBtn" onClick={openBooking}>
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
        const { typeFilm } = props;
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
