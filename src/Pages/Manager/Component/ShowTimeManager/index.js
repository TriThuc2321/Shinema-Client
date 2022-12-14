import * as React from 'react';
import { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { red } from '@mui/material/colors';

import format from 'date-fns/format';
import ShowTimeManagerItem from './ShowTimeManagerItem';
import NewShowTimeForm from './NewShowTimeForm';
import EditShowTimeForm from './EditShowTimeForm';

import Loading from '~/Components/Loading';
import { showTimeRemainingSelector } from '~/Redux/selector';
import showTimeSlice from '~/Redux/slices/showTimeSlice';
import tmdbApi, { category } from '~/Api/tmdbApi';
import { Success } from '~/Components/Alert';

import ShowTimeApi from '~/Api/showTimeApi';

function ShowTimeManager() {
    const [, forceRerender] = useState();
    const data = useSelector(showTimeRemainingSelector);

    const [dateSelect, setDateSelect] = useState(new Date());
    const [showNewForm, setShowNewForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const dispatch = useDispatch();
    // useEffect(() => {
    //     // const dateFormat = format(value, "MM/dd/yyyy");
    //     // console.log(dateFormat);

    //     console.log(listShowTimes)

    // }, [listShowTimes])

    const getShowTimes = async () => {
        await ShowTimeApi.getAll()
            // eslint-disable-next-line no-shadow
            .then((data) => {
                dispatch(showTimeSlice.actions.updateAll([]));
                const params = {};
                data.forEach((element) => {
                    tmdbApi
                        .detail(category.movie, element.filmId, { params })
                        .then((res) => {
                            const temp = { ...element, film: { ...res } };
                            // setListShowTimes(pre => [...pre, temp])
                            dispatch(showTimeSlice.actions.add(temp));
                        })
                        .catch((err) => console.log(err));
                });
            })
            .catch((err) => console.log(err));
    };

    const setDefaultFilter = () => {
        const dateFormat = format(dateSelect, 'MM/dd/yyyy');
        dispatch(showTimeSlice.actions.setFilter(dateFormat));
    };

    useEffect(() => {
        getShowTimes();
        setDefaultFilter();
    }, []);

    useEffect(() => {
        forceRerender();
    }, [data]);

    const [updateSuccessVisible, setUpdateSuccessVisible] = useState(false);
    const successNewShowTimeHandle = () => {
        setShowNewForm(false);
        setShowEditForm(false);

        setUpdateSuccessVisible(true);
        getShowTimes();
    };

    const openEdit = () => {
        setShowEditForm(true);
    };

    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    return (
        <ClickAwayListener
            onClickAway={() => {
                setShowNewForm(false);
                setShowEditForm(false);
            }}
        >
            <Box sx={{ width: '100%', minHeight: '75vh', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'self-start' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Date"
                            value={dateSelect}
                            onChange={(newValue) => {
                                setDateSelect(newValue);
                                const dateFormat = format(newValue, 'MM/dd/yyyy');
                                dispatch(showTimeSlice.actions.setFilter(dateFormat));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...params}
                                    sx={{
                                        svg: { color: '#fff' },
                                        input: { color: '#fff' },
                                        label: { color: '#fff' },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    <ThemeProvider theme={btnTheme}>
                        <Button
                            sx={{ paddingX: 2.5, paddingY: 1 }}
                            variant="contained"
                            endIcon={<AddRoundedIcon />}
                            onClick={() => {
                                setShowNewForm(true);
                                setUpdateSuccessVisible(false);
                            }}
                        >
                            New
                        </Button>
                    </ThemeProvider>
                </div>

                {data ? (
                    data.map((item) => <ShowTimeManagerItem key={item.id} item={item} openEdit={openEdit} />)
                ) : (
                    <Loading />
                )}

                {showNewForm && <NewShowTimeForm successNewShowTimeHandle={successNewShowTimeHandle} />}
                {showEditForm && <EditShowTimeForm successNewShowTimeHandle={successNewShowTimeHandle} />}

                <Success message="Insert successfully" status={updateSuccessVisible} />
            </Box>
        </ClickAwayListener>
    );
}
export default ShowTimeManager;
