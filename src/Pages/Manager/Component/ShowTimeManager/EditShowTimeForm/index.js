/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import VideoLabelOutlinedIcon from '@mui/icons-material/VideoLabelOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import format from 'date-fns/format';
import ShowTimeApi from '~/Api/showTimeApi';
import TheaterApi from '~/Api/theaterApi';
import { theaterSelector } from '~/Redux/selector';
import theaterSlice from '~/Redux/slices/theaterSlice';
import movieSlice from '~/Redux/slices/movieSlice';
import tmdbApi, { movieType, category } from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

import { Error } from '~/Components/Alert';
import styles from './styles';

function EditShowTimeForm({ successNewShowTimeHandle }) {
    const dispatch = useDispatch();
    const [, forceRender] = useState();

    const btnTheme = createTheme({
        shape: {
            borderRadius: 5,
        },
        palette: {
            primary: red,
        },
    });

    const currentShowTime = useSelector((state) => state.showTimes.currentShowTime);

    const [currentFilm, setCurrentFilm] = useState();
    const [currentFilmDefault, setCurrentFilmDefault] = useState();

    const [currentTheater, setCurrentTheater] = useState();
    const [currentTheaterDefault, setCurrentTheaterDefault] = useState();

    const [currentRoom, setCurrentRoom] = useState();
    const [currentRoomDefault, setCurrentRoomDefault] = useState();

    const [dateSelected, setDateSelected] = useState();

    const [listDateTime, setListDateTime] = useState([]);

    const [messageErrorVisible, setMessageErrorVisible] = useState({
        date: false,
        film: false,
        theater: false,
        times: false,
        showTimeExist: false,
        room: false,
        roomUnavailable: false,
    });

    const [errorTimes, setErrorTimes] = useState(false);

    const upcomingMovies = useSelector((state) => state.movies.upcoming);
    const theaters = useSelector(theaterSelector);

    const movieOptions = upcomingMovies.map((option) => {
        const firstLetter = option.title[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });

    const addDateHandle = () => {
        const dateFormat = format(dateSelected, 'MM/dd/yyyy');
        const today = new Date();

        if (
            dateSelected.getFullYear() >= today.getFullYear() &&
            dateSelected.getMonth() >= today.getMonth() &&
            dateSelected.getDate() >= today.getDate()
        ) {
            if (listDateTime.length !== 0 && listDateTime.find((e) => e.date === dateFormat)) return;

            setListDateTime([...listDateTime, { date: dateFormat, times: '' }]);
        } else {
            setMessageErrorVisible({ ...messageErrorVisible, date: true });
        }
    };

    const deleteDateHandle = (item) => {
        const temp = listDateTime.filter((e) => e.date !== item.date);
        setListDateTime(temp);
    };

    const onChangeTimeHandle = (item) => {
        const temp = listDateTime.map((e) => (e.date !== item.date ? e : item));
        setListDateTime(temp);

        setMessageErrorVisible({ ...messageErrorVisible, times: false, date: false, timeUnavailable: false });
    };

    const onChangeErrorTimeHandle = (val) => {
        setErrorTimes(val);
    };

    const updateShowTimeHandle = () => {
        // eslint-disable-next-line no-use-before-define
        if (checkShowTime()) {
            tmdbApi
                .detail(category.movie, currentFilm.id, { params: {} })
                .then((res) => {
                    const showTime = {
                        filmId: currentFilm.id,
                        theaterId: currentTheater._id,
                        listDateTime,
                        roomId: currentRoom.id,
                        runtime: res.runtime ? res.runtime : 100,
                    };

                    ShowTimeApi.update(showTime)
                        // eslint-disable-next-line no-shadow
                        .then((res) => {
                            if (res.data === 'Times is not available') {
                                setMessageErrorVisible({ ...messageErrorVisible, timeUnavailable: true });
                            } else if (res.data === 'Room is not available') {
                                setMessageErrorVisible({ ...messageErrorVisible, roomUnavailable: true });
                            } else if (res.data === 'Update successful') {
                                successNewShowTimeHandle();
                            }
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }
    };

    const checkShowTime = () => {
        if (currentFilm === null || currentTheater === null) {
            setMessageErrorVisible({ ...messageErrorVisible, film: true });
            return false;
        }
        if (currentTheater === null) {
            setMessageErrorVisible({ ...messageErrorVisible, theater: true });
            return false;
        }
        if (listDateTime.length === 0 || errorTimes) {
            setMessageErrorVisible({ ...messageErrorVisible, times: true });
            return false;
        }
        if (currentRoom === null) {
            setMessageErrorVisible({ ...messageErrorVisible, room: true });
            return false;
        }
        const err = listDateTime.find((e) => e.times === '');
        if (err) {
            setMessageErrorVisible({ ...messageErrorVisible, times: true });
            return false;
        }
        return true;
    };

    useEffect(() => {
        const getMovies = async () => {
            const params = {};
            try {
                const response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
                dispatch(movieSlice.actions.updateAllUpcoming(response.results));
            } catch {
                console.log('Film slider error');
            }
        };

        const getTheaters = () => {
            TheaterApi.getAll()
                .then((res) => {
                    if (res) {
                        dispatch(theaterSlice.actions.updateAll(res));
                    }
                })
                .catch((err) => console.log(err));
        };

        setDateSelected(new Date());
        getMovies();
        getTheaters();
    }, []);

    useEffect(() => {
        const setDefaultValue = () => {
            if (currentShowTime != null && theaters != null) {
                const currTheater = theaters.find((e) => e._id === currentShowTime.theaterId);
                if (currTheater != null) {
                    setCurrentFilm(currentShowTime.film);
                    setCurrentFilmDefault(currentShowTime.film);

                    setCurrentTheater(currTheater);
                    setCurrentTheaterDefault(currTheater);

                    setCurrentRoom(currTheater.listRoom.find((e) => e.id === currentShowTime.roomId));
                    setCurrentRoomDefault(currTheater.listRoom.find((e) => e.id === currentShowTime.roomId));

                    setListDateTime(currentShowTime.listDateTime);
                }
            }
        };

        setDefaultValue();
    }, [currentShowTime, theaters]);

    useEffect(() => {
        forceRender();
    }, [upcomingMovies, theaters, currentTheaterDefault, currentRoomDefault]);

    return (
        <div style={styles.container}>
            <div>
                {currentFilmDefault && (
                    <Autocomplete
                        onChange={(event, value) => {
                            setCurrentFilm(value);
                            setMessageErrorVisible({ ...messageErrorVisible, film: false });
                            setMessageErrorVisible({ ...messageErrorVisible, showTimeExist: false });
                        }}
                        disabled
                        defaultValue={movieOptions.find((e) => e.id === currentFilmDefault.id)}
                        options={movieOptions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        groupBy={(option) => option.firstLetter}
                        getOptionLabel={(option) => option.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{ width: 300 }}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        renderInput={(params) => <TextField {...params} label="Movie" />}
                    />
                )}

                {currentFilm && <CurrentFilm currentFilm={currentFilm} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 30, width: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        {currentTheaterDefault && (
                            <Autocomplete
                                onChange={(event, value) => {
                                    setCurrentTheater(value);
                                    setMessageErrorVisible({ ...messageErrorVisible, theater: false });
                                    setMessageErrorVisible({ ...messageErrorVisible, showTimeExist: false });
                                }}
                                disabled
                                defaultValue={theaters.find((e) => e._id === currentTheaterDefault._id)}
                                options={theaters}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Theater" />}
                            />
                        )}

                        {currentTheater && currentRoomDefault && (
                            <Autocomplete
                                onChange={(event, value) => {
                                    setCurrentRoom(value);
                                    setMessageErrorVisible({ ...messageErrorVisible, room: false });
                                    setMessageErrorVisible({ ...messageErrorVisible, showTimeExist: false });
                                }}
                                disabled
                                defaultValue={currentTheater.listRoom.find((e) => e.id === currentRoomDefault.id)}
                                options={currentTheater.listRoom}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={{ width: 300, marginLeft: 3 }}
                                renderInput={(params) => <TextField {...params} label="Room" />}
                            />
                        )}
                    </div>

                    <ThemeProvider theme={btnTheme}>
                        <Button
                            sx={{ paddingX: 2.5, paddingY: 1.5 }}
                            variant="contained"
                            endIcon={<VideoLabelOutlinedIcon />}
                            onClick={updateShowTimeHandle}
                        >
                            Update show time
                        </Button>
                    </ThemeProvider>
                </div>

                <div style={{ width: '100%', marginTop: 20 }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}
                    >
                        <p style={{ color: 'rgb(9, 24, 48)', fontSize: 20, marginTop: 5 }}>Show time</p>

                        <div>
                            <IconButton size="large" onClick={addDateHandle}>
                                <AddCircleOutlineOutlinedIcon fontSize="inherit" />
                            </IconButton>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date"
                                    value={dateSelected}
                                    onChange={(newValue) => {
                                        setDateSelected(newValue);
                                        setMessageErrorVisible({ ...messageErrorVisible, date: false });
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>

                    {listDateTime.length !== 0 && (
                        <div style={{ border: '1px solid #cfcfcf', width: '100%', borderRadius: 5, marginTop: 10 }}>
                            {listDateTime.map((item) => (
                                <DateTimeItem
                                    key={item}
                                    item={item}
                                    deleteDateHandle={deleteDateHandle}
                                    onChangeTimeHandle={onChangeTimeHandle}
                                    onChangeErrorTimeHandle={onChangeErrorTimeHandle}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Error message="Please schedule this time 1 day before occuring" status={messageErrorVisible.date} />
                <Error message="Please select movie " status={messageErrorVisible.film} />
                <Error message="Please select theater" status={messageErrorVisible.theater} />
                <Error message="Please select room" status={messageErrorVisible.room} />
                <Error message="Show time is not valid" status={messageErrorVisible.times} />
                <Error
                    message="Show time has already existed, please try to update it"
                    status={messageErrorVisible.showTimeExist}
                />
                <Error message="Room is not available in time list" status={messageErrorVisible.roomUnavailable} />
                <Error
                    message="The time between two show times is not suitable"
                    status={messageErrorVisible.timeUnavailable}
                />
            </div>
        </div>
    );
}

function DateTimeItem({ item, deleteDateHandle, onChangeTimeHandle, onChangeErrorTimeHandle }) {
    const [timesString, setTimesString] = useState();
    const [errorTimeVisible, setErrorTimeVisible] = useState(false);

    const [, forceRender] = useState();

    const handleChange = (event) => {
        setTimesString(event.target.value);

        // eslint-disable-next-line no-use-before-define
        if (checkTimeFormat(event.target.value)) {
            const timeString = event.target.value.trim();
            const timeArr = timeString.split(' ');
            onChangeTimeHandle({ date: item.date, times: timeArr });

            setErrorTimeVisible(false);
            onChangeErrorTimeHandle(false);
        } else {
            onChangeTimeHandle({ date: item.date, times: event.target.value });
            setErrorTimeVisible(true);
            onChangeErrorTimeHandle(true);
        }
    };
    const deleteHandle = () => {
        deleteDateHandle(item);
    };

    const checkTimeFormat = (timeArray) => {
        // eslint-disable-next-line no-shadow
        const timesString = timeArray.trim();
        const listTime = timesString.split(' ');

        const timeFormat = /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/;
        let result = true;
        // eslint-disable-next-line consistent-return
        listTime.forEach((element) => {
            if (element.match(timeFormat) === null) {
                result = false;
                return result;
            }
        });

        return result;
    };

    useEffect(() => {
        const setDefault = () => {
            let timeString = '';
            if (item.times != null && item.times !== '') {
                item.times.forEach((item) => {
                    // eslint-disable-next-line prefer-template
                    timeString += item + ' ';
                });
                setTimesString(timeString);
            }
        };

        setDefault();
    }, []);

    useEffect(() => {
        forceRender();
    }, [timesString]);

    return (
        <div style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'column', padding: 15 }}>
            <p style={{ color: 'rgb(9, 24, 48)' }}>{item.date}</p>

            <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Time. Ex: 8:30 10:30 ... </InputLabel>
                <Input
                    id="standard-adornment-password"
                    type="text"
                    value={timesString}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={deleteHandle}
                                onMouseDown={(event) => event.preventDefault()}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            {errorTimeVisible && (
                <div
                    style={{
                        padding: 8,
                        backgroundColor: '#fdeded',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 3,
                    }}
                >
                    <ErrorOutlineIcon sx={{ color: '#f16663' }} />
                    <p style={{ color: '#8d4a4a', fontFamily: 'sans-serif', marginLeft: 10 }}>
                        The time list is not correct
                    </p>
                </div>
            )}
        </div>
    );
}

function CurrentFilm({ currentFilm }) {
    const poster = apiConfig.originalImage(
        currentFilm.backdrop_path ? currentFilm.poster_path : currentFilm.backdrop_path,
    );

    return (
        <div style={{ maxWidth: 400 }}>
            <div
                style={{
                    backgroundImage: `url(${poster})`,
                    display: 'flex',
                    height: 400,
                    width: 280,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 20,
                    boxShadow: 5,
                    marginTop: 10,
                }}
            />

            <p style={{ color: 'rgb(9, 24, 48)', fontSize: 25 }}>Duration: {currentFilm.runtime} minutes</p>
        </div>
    );
}

export default EditShowTimeForm;
