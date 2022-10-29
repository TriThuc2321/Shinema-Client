/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react';
import './styles.css';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '@mui/material';
import Typography from '@mui/material/Typography';

import { bookingSelector } from '~/Redux/selector';
import bookingSlice from '~/Redux/slices/bookingSlice';
import TheaterApi from '~/Api/theaterApi';
import { subDate, removeDuplicates } from '~/Utils';

function BookingForm(props) {
    const { showTimeList } = props;
    const [dateArray, setDateArray] = useState([]);
    const [theaterIdArray, setTheaterIdArray] = useState([]);
    const [timeArray, setTimeArray] = useState([]);

    const CURRENT_BOOKING = useSelector(bookingSelector);
    const dispatch = useDispatch();

    dispatch(bookingSlice.actions.setShowTimeList(showTimeList));

    useEffect(() => {
        const getDate = async () => {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            const current = month + '/' + day + '/' + year;

            await showTimeList.forEach((showTime) => {
                showTime.listDateTime.forEach((object) => {
                    if (subDate(object.date, current) >= 1) dateArray.push(object.date);
                });
            });

            setDateArray(removeDuplicates(dateArray));
        };

        getDate();
    }, [props]);

    useEffect(() => {
        setTimeArray(CURRENT_BOOKING.currentTimeArray);
        setTheaterIdArray(CURRENT_BOOKING.currentTheaterIdArray);
    }, [CURRENT_BOOKING.currentTimeArray]);

    useEffect(() => {
        setTheaterIdArray(CURRENT_BOOKING.currentTheaterIdArray);
    }, [CURRENT_BOOKING.currentTheaterIdArray]);

    return (
        <div className="booking-form__container">
            <Card sx={{ width: '80%', color: '#e3e4e8', borderRadius: 5, padding: 2 }}>
                <Typography textAlign="left" variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                    Choose the showtime here!
                </Typography>
                <div className="booking-form__container__check">
                    <Box textAlign="right">
                        <CheckBtn />
                    </Box>
                </div>

                <div className="booking-form__container__select">
                    <div className="booking-form__container__select__date">
                        <div className="booking-form__container__select__date__title">Date</div>
                        <div className="booking-form__container__select__date__swiper">
                            <ShowDateItem array={dateArray} />
                        </div>
                    </div>

                    <div className="booking-form__container__select__time">
                        <div className="booking-form__container__select__time__title">Time</div>
                        <div className="booking-form__container__select__time__swiper">
                            <ShowTimeItem array={timeArray} />
                        </div>
                    </div>

                    <div className="booking-form__container__select__theater">
                        <div className="booking-form__container__select__theater__title">Theater</div>
                        <div className="booking-form__container__select__theater__picker">
                            <ShowTheaterItem array={theaterIdArray} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default BookingForm;

export function CheckBtn() {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const CURRENT_BOOKING = useSelector(bookingSelector);
    const dispatch = useDispatch();

    const onClick = () => {
        if (
            CURRENT_BOOKING.selectedDate !== '' &&
            CURRENT_BOOKING.selectedTime !== '' &&
            CURRENT_BOOKING.selectedTheater !== {}
        ) {
            dispatch(bookingSlice.actions.setCheck(true));
        }
    };

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

export function DateItem(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const item = props.date;
    const [month, date, year] = item.split('/');
    const current = new Date(year, month, date);
    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (CURRENT_BOOKING.selectedDate === item) {
            setIsHighlighted(true);
        } else setIsHighlighted(false);
    }, [CURRENT_BOOKING.selectedDate]);

    const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="date-item__container" onClick={() => dispatch(bookingSlice.actions.setDate(item))}>
            {!isHighlighted ? (
                <div className="date-item__container__content">
                    <div className="date-item__container__content__day">{dayArr[current.getDay() - 1]}</div>
                    <div className="date-item__container__content__date">{current.getDate()}</div>
                    <div className="date-item__container__content__month">{monthArr[current.getMonth() - 1]}</div>
                    <div className="date-item__container__content__year">{current.getFullYear()}</div>
                </div>
            ) : (
                <div className="date-item__container__content_red">
                    <div className="date-item__container__content__day">{dayArr[current.getDay() - 1]}</div>
                    <div className="date-item__container__content__date">{current.getDate()}</div>
                    <div className="date-item__container__content__month">{monthArr[current.getMonth() - 1]}</div>
                    <div className="date-item__container__content__year">{current.getFullYear()}</div>
                </div>
            )}
        </div>
    );
}

export function ShowDateItem(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const dateArray = props.array;

    return (
        <div
            className="showdate-item-container"
            // style={{ backgroundColor: 'white' }}
        >
            {dateArray && (
                <Swiper
                    slidesPerView={3}
                    centeredSlides
                    spaceBetween={10}
                    // grabCursor={true}
                    // pagination={{
                    //     clickable: true,
                    // }}
                    // modules={[Pagination]}
                    /// clickable={true}
                    className="mySwiper"
                >
                    {dateArray.map((item) => (
                        <SwiperSlide key={item}>
                            <DateItem date={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export function TimeItem(props) {
    const { time } = props;

    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (CURRENT_BOOKING.selectedTime === time) {
            setIsHighlighted(true);
        } else setIsHighlighted(false);
    }, [CURRENT_BOOKING.selectedTime]);

    return (
        <div className="time-item__container" onClick={() => dispatch(bookingSlice.actions.setTime(time))}>
            {!isHighlighted ? (
                <div className="time-item__container__content">{time}</div>
            ) : (
                <div className="time-item__container__content_red">{time}</div>
            )}
        </div>
    );
}

export function ShowTimeItem(props) {
    const { time } = props;
    const [timeArray, setTimeArray] = useState(time);

    const CURRENT_BOOKING = useSelector(bookingSelector);

    const [display, setDisplay] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeArray(time);
    }, [time]);

    useEffect(() => {
        dispatch(bookingSlice.actions.setTime(''));
    }, [CURRENT_BOOKING.selectedDate]);

    useEffect(() => {
        if (timeArray.length !== 0) {
            setDisplay(true);
        } else setDisplay(false);
    }, [timeArray]);

    return (
        <div
            className="showtime-item-container"
            // style={{ backgroundColor: 'white' }}
        >
            {display ? (
                <Swiper
                    slidesPerView={3}
                    centeredSlides
                    spaceBetween={10}
                    // grabCursor={true}
                    /// clickable={true}
                    // pagination={{
                    //     clickable: true,
                    // }}
                    className="showtime-item-container__swp"
                >
                    {timeArray.map((item) => (
                        <SwiperSlide key={item}>
                            <TimeItem time={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="showtime-item-container__require">Please choose the date</div>
            )}
        </div>
    );
}

export function ShowTheaterItem(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const [theaterIdArray, setTheaterIdArray] = useState(props.array);

    const dispatch = useDispatch();
    const CURRENT_BOOKING = useSelector(bookingSelector);

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        if (theaterIdArray.length !== 0) {
            setDisplay(true);
        } else setDisplay(false);
    }, [theaterIdArray]);

    useEffect(() => {
        // eslint-disable-next-line react/destructuring-assignment
        setTheaterIdArray(props.array);
        // eslint-disable-next-line react/destructuring-assignment
    }, [props.array]);

    useEffect(() => {
        setDisplay(false);
        dispatch(bookingSlice.actions.setSelectedTheater({}));
    }, [CURRENT_BOOKING.selectedDate]);

    useEffect(() => {
        dispatch(bookingSlice.actions.setSelectedTheater({}));
    }, [CURRENT_BOOKING.currentTimeArray]);

    return (
        <div
            className="showtime-item-container"
            // style={{ backgroundColor: 'white' }}
        >
            {display ? (
                <Swiper
                    slidesPerView={3}
                    centeredSlides
                    spaceBetween={10}
                    // grabCursor={true}
                    // clickable={true}
                    // pagination={{
                    //     clickable: true,
                    // }}
                    className="showtime-item-container__swp"
                >
                    {theaterIdArray.map((item) => (
                        <SwiperSlide key={item}>
                            <TheaterItem theaterId={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="showtime-item-container__require">Please choose the showtime</div>
            )}
        </div>
    );
}

function TheaterItem(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const [itemId] = useState(props.theaterId);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const dispatch = useDispatch();
    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [item, setItem] = useState({});

    useEffect(async () => {
        const getTheater = async () => {
            await TheaterApi.getById(itemId)
                .then((res) => {
                    setItem(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        await getTheater();
    }, []);

    useEffect(() => {
        if (CURRENT_BOOKING.selectedTheater === item) {
            setIsHighlighted(true);
        } else setIsHighlighted(false);
    }, [CURRENT_BOOKING.selectedTheater]);

    return (
        <div
            className="theater-item__container"
            onClick={() => dispatch(bookingSlice.actions.setSelectedTheater(item))}
        >
            {!isHighlighted ? (
                <div className="theater-item__container__content">
                    <div className="theater-item__container__content__name">{item.name}</div>
                    <div className="theater-item__container__content__address">{item.address}</div>
                </div>
            ) : (
                <div className="theater-item__container__content_red">
                    <div className="theater-item__container__content__name_red">{item.name}</div>
                    <div className="theater-item__container__content__address_red">{item.address}</div>
                </div>
            )}
        </div>
    );
}
