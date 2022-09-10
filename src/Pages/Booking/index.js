/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';

import './styles.css';
import { useParams, useNavigate } from 'react-router';

import { Helmet } from 'react-helmet';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';

import tmdbApi, { category } from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

import bookingSlice from '~/Redux/slices/bookingSlice';

// Import Swiper React components
import 'swiper/css';
import 'swiper/css/pagination';
// eslint-disable-next-line import/order
import { useDispatch, useSelector } from 'react-redux';
import ShowTimeApi from '~/Api/showTimeApi';

import BookingForm from './BookingForm';

import { bookingSelector } from '~/Redux/selector';
import RoomItem from './RoomItem';
import BuyerInformation from './BuyerInformation';

function Booking() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const steps = [
        'Firstly, let choose your ideal seats!',
        'Secondly, let fill out your personal information and choose the paying method!',
    ];

    const totalSteps = () => steps.length;

    const completedSteps = () => Object.keys(completed).length;

    const isLastStep = () => activeStep === totalSteps() - 1;

    const allStepsCompleted = () => completedSteps() === totalSteps();

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const { id } = useParams();

    const [movieInfo, setMovieInfo] = useState();
    const [showTimeList, setShowTimeList] = useState([]);
    const dispatch = useDispatch();
    const CURRENT_BOOKING = useSelector(bookingSelector);

    const [data, setData] = useState();

    useEffect(() => {
        const getMovie = async () => {
            const params = {};

            try {
                const response = await tmdbApi.detail(category.movie, id, { params });
                setMovieInfo(response);
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

        dispatch(bookingSlice.actions.setSelectedFilm(id));
    }, [id]);

    useEffect(() => {
        if (CURRENT_BOOKING.check === true) setData(CURRENT_BOOKING.selectedTheater);
    }, [CURRENT_BOOKING.check]);

    return (
        <div className="booking-container">
            <MovieInformation movieInfo={movieInfo} />
            <Box sx={{ width: '70%', mt: 15, ml: 25 }}>
                <div>
                    <Typography variant="h5" sx={{ p: 2 }}>
                        Booking tickets
                    </Typography>
                    <Stepper nonLinear activeStep={activeStep} sx={{ width: '90%', ml: 4 }}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton color="inherit" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        {allStepsCompleted() ? (
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1, color: 'red', fontWeight: 'bold' }}
                                    >
                                        Back
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    {CURRENT_BOOKING.selectedSeats.length !== 0 && activeStep !== totalSteps() - 1 ? (
                                        <Button onClick={handleNext} sx={{ mr: 1, color: 'red', fontWeight: 'bold' }}>
                                            Next
                                        </Button>
                                    ) : null}
                                    {/* {activeStep !== steps.length &&
                                        (completed[activeStep] ? (
                                            <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                                Step {activeStep + 1} already completed
                                            </Typography>
                                        ) : (
                                            <Button onClick={handleComplete}>
                                                {completedSteps() === totalSteps() - 1
                                                    ? 'Finish'
                                                    : 'Complete Step'}
                                            </Button>
                                        ))} */}
                                </Box>

                                {activeStep === 0 ? (
                                    <div>
                                        <BookingForm showTimeList={showTimeList} />
                                        {data && <RoomItem theater={data} key={data._id} />}
                                    </div>
                                ) : (
                                    <BuyerInformation movieInfo={movieInfo} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Box>
        </div>
    );
}

function MovieInformation({ movieInfo }) {
    const navigate = useNavigate();
    const viewDetails = () => {
        navigate(`/filmDetails/${movieInfo.id}`);
    };
    return (
        <div>
            {movieInfo && (
                <>
                    <Helmet>
                        <title>Booking: {movieInfo.title || movieInfo.name}</title>
                    </Helmet>

                    <div
                        className="booking-container__movie-cover"
                        style={{ backgroundImage: `url(${apiConfig.originalImage(movieInfo.backdrop_path)})` }}
                    >
                        <div className="booking-container__movie-cover__gradient" />
                        <div
                            className="booking-container__movie-cover__poster"
                            style={{ backgroundImage: `url(${apiConfig.originalImage(movieInfo.poster_path)})` }}
                        />

                        <div className="booking-container__movie-cover__content">
                            <div className="booking-container__movie-cover__title">
                                {movieInfo.name || movieInfo.title}
                            </div>
                            <div className="booking-container__movie-cover__duration">{movieInfo.runtime} minutes</div>
                            <div className="booking-container__movie-cover__genres">
                                {movieInfo.genres &&
                                    movieInfo.genres.slice(0, 5).map((genre) => (
                                        <span key={genre} className="booking-container__movie-cover__genres__item">
                                            {genre.name}
                                        </span>
                                    ))}
                            </div>
                            <div className="booking-containercontainer__movie-cover__overview">
                                {movieInfo.overview}
                            </div>

                            <div className="booking-container__movie-cover__view-more" onClick={viewDetails}>
                                View more detail
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Booking;

export function CheckBtn() {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const onClick = () => {};
    return (
        <div>
            <ThemeProvider theme={btnTheme}>
                <Button sx={{ paddingX: 5, paddingY: 0.8 }} variant="contained" onClick={onClick}>
                    CHECK
                </Button>
            </ThemeProvider>
        </div>
    );
}
