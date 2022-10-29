/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-shadow */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { Button, Typography, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import format from 'date-fns/format';
import { makeStyles } from '@mui/styles';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { userSelector, bookingSelector } from '~/Redux/selector';
import { onlyLettersAndSpaces, validateEmail, validatePhoneNumber } from '~/Utils';

import apiConfig from '~/Api/apiConfig';
import PayPal from '../Paypal';
import TicketApi from '~/Api/ticketApi';
import Loading from '~/Components/Loading';
import { Success, Error } from '~/Components/Alert';

import emailApi from '~/Api/emailApi';

function BuyerInformation({ movieInfo }) {
    const currentUser = useSelector(userSelector);
    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [isLoading] = useState(false);
    const [data, setData] = useState({});

    const [values, setValues] = useState({
        name: currentUser.name,
        contact: currentUser.contact,
        address: '',
        email: currentUser.email,
    });

    const [validName, setValidName] = useState({
        check: true,
        alert: '',
    });

    const [validEmail, setValidEmail] = useState({
        check: true,
        alert: '',
    });

    const [validContact, setValidContact] = useState({
        check: true,
        alert: '',
    });

    const [validAdress, setValidAdress] = useState({
        check: true,
        alert: '',
    });

    const [updateSucceeded, setUpdateSucceeded] = useState({
        status: false,
        message: '',
    });

    const resetValidation = () => {
        setValidName({
            check: true,
        });
        setValidEmail({
            check: true,
        });
        setValidContact({
            check: true,
        });
        setValidAdress({
            check: true,
        });
    };

    const [errorNotification, setErrorNotification] = useState({
        status: false,
        message: '',
        display: false,
    });

    const handleChangeInformation = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setUpdateSucceeded({
            status: false,
            message: '',
            display: false,
        });
    };

    const [province, setProvince] = useState({});
    const [provinceList, setProvinceList] = useState([]);

    const [district, setDistrict] = useState({});
    const [districtList, setDistrictList] = useState([]);

    const [commune, setCommune] = useState({});
    const [communeList, setCommuneList] = useState([]);

    const [bigAddress, setBigAddress] = useState('');

    const [house, setHouse] = useState('');
    useEffect(() => {
        const getProvinceList = async () => {
            await fetch('https://sheltered-anchorage-60344.herokuapp.com/province')
                .then((res) => res.json())
                .then((data1) => setProvinceList(data1));
        };
        getProvinceList();
    }, []);

    function handleChangeProvince(event) {
        setProvince(event.target.value);
        setUpdateSucceeded({
            status: false,
            message: '',
            display: false,
        });
    }
    useEffect(() => {
        const getDistrict = async () => {
            await fetch(`https://sheltered-anchorage-60344.herokuapp.com/district/?idProvince=${province.idProvince}`)
                .then((res) => res.json())
                .then((data2) => setDistrictList(data2));
        };
        getDistrict();
    }, [province]);

    function handleChangeDistrict(event) {
        setDistrict(event.target.value);
        setUpdateSucceeded({
            status: false,
            message: '',
            display: false,
        });
    }

    useEffect(() => {
        const getCommune = async () => {
            await fetch(`https://sheltered-anchorage-60344.herokuapp.com/commune/?idDistrict=${district.idDistrict}`)
                .then((res) => res.json())
                .then((data3) => setCommuneList(data3));
        };
        getCommune();
    }, [district]);

    async function handleChangeCommune(event) {
        setCommune(event.target.value);
        setUpdateSucceeded({
            status: false,
            message: '',
            display: false,
        });
    }

    function handleChangeHouse(event) {
        setHouse(event.target.value);
        setUpdateSucceeded({
            status: false,
            message: '',
            display: false,
        });
    }

    const validate = () => {
        let flag = true;
        resetValidation();
        if (values.name === undefined || values.name === '') {
            setValidName({
                check: false,
                alert: 'Please enter your name!',
            });
            flag = false;
        } else if (onlyLettersAndSpaces(values.name)) {
            setValidName({
                check: false,
                alert: 'Invalid name!',
            });
            flag = false;
        }

        if (values.email === undefined || values.email === '') {
            setValidEmail({
                check: false,
                alert: 'Please enter email',
            });
            flag = false;
        } else if (validateEmail(values.email)) {
            setValidEmail({
                check: false,
                alert: 'Your email is not valid!',
            });
        }

        if (values.contact === undefined || values.contact === '') {
            setValidContact({
                check: false,
                alert: 'Please enter phone number',
            });
            flag = false;
        } else if (validatePhoneNumber(values.contact)) {
            setValidContact({
                check: false,
                alert: 'Invalid phone number!',
            });
            flag = false;
        }

        console.log(province.idProvince == null);

        if (house === undefined || house === '') {
            setValidAdress({
                check: false,
                alert: 'Please enter address',
            });
            flag = false;
        } else if (province.idProvince == null) {
            setValidAdress({
                check: false,
                alert: 'Please choose province',
            });
            flag = false;

            console.log('a');
        } else if (district.idDistrict == null) {
            setValidAdress({
                check: false,
                alert: 'Please choose district',
            });
            flag = false;

            console.log('b');
        } else if (commune.idCommune == null) {
            setValidAdress({
                check: false,
                alert: 'Please choose commune',
            });
            flag = false;

            console.log('c');
        }
        return flag;
    };

    useEffect(() => {
        setBigAddress(house + ', ' + commune.name + ', ' + district.name + ', ' + province.name);
    }, [house, province, district, commune]);

    const navigate = useNavigate();

    const [purchasesUnit, setPurchasesUnit] = useState([]);
    const makePurchases = () => {
        const unitAmountObj = {
            currency_code: 'USD',
            value: CURRENT_BOOKING.selectedTheater.price,
        };

        const name = movieInfo.title;
        const datetime = CURRENT_BOOKING.selectedDate + ' ' + CURRENT_BOOKING.selectedTime;
        const place = CURRENT_BOOKING.selectedTheater.name + ' ' + CURRENT_BOOKING.selectedRoom;
        const seats = CURRENT_BOOKING.selectedSeats;

        const sample = {
            name: name + ' - ' + datetime + ' - ' + place + ' - ' + seats,
            unit_amount: unitAmountObj,
            quantity: CURRENT_BOOKING.selectedSeats.length,
        };

        setPurchasesUnit([...purchasesUnit, sample]);
    };

    const order = async () => {
        await TicketApi.create(data)
            .then(() => {
                setUpdateSucceeded({
                    status: true,
                    message: 'Buy ticket successfully!',
                });
            })
            .catch((err) => {
                console.log(err);
                setErrorNotification({
                    status: true,
                    message: 'Sorry! There are something wrong with your request',
                });
            });

        emailApi
            .sendVerify({
                to: currentUser.email,
                subject: 'Your order information',
                text:
                    'Thank for buying movie ticket in Shinema site. \n' +
                    'Your order: \n' +
                    `Name: ${currentUser.name} \n` +
                    `Phone: ${currentUser.contact} \n` +
                    // `COD Address: ${bigAddress}` + "\n" +
                    '-------------------------------------------------------- \n' +
                    `Movie: ${movieInfo.title} \n` +
                    `Theater: ${CURRENT_BOOKING.selectedTheater.name + ' - Room: ' + CURRENT_BOOKING.selectedRoom} \n` +
                    `Seats: ${CURRENT_BOOKING.selectedSeats} \n` +
                    '-------------------------------------------------------- \n' +
                    `Total: ${CURRENT_BOOKING.selectedSeats.length * CURRENT_BOOKING.selectedTheater.price} USD` +
                    '\n' +
                    'Method: Cash' +
                    '\n' +
                    '-------------------------------------------------------- \n' +
                    'Any wondered things. Please contact with our shop with contact below site: shinema.com',
            })
            .then(() => {
                navigate('/transactions');
            })
            .catch((err) => console.log(err));
    };

    const [methodVisible, setMethodVisible] = useState(false);
    const [cash, setCash] = useState(true);
    const [pp, setPp] = useState(false);
    const [methodValue, setMethodValue] = useState('cash');
    const handleChangeMethod = (event) => {
        console.log(event.target.value);
        if (event.target.value === 'paypal') {
            setPp(true);
            setCash(false);
            makePurchases();
        }
        if (event.target.value === 'cash') {
            setCash(true);
            setPp(false);
        }

        setMethodValue(event.target.value);
    };

    const chooseMethod = () => {
        if (validate()) {
            const currentTime = new Date();
            const dateFormat = format(currentTime, 'PP p');
            setData({
                _filmId: movieInfo.id,
                _theaterId: CURRENT_BOOKING.selectedTheater._id,
                _roomId: CURRENT_BOOKING.selectedRoom,
                seatIdArray: CURRENT_BOOKING.selectedSeats,
                dateOccur: CURRENT_BOOKING.selectedDate,
                timeOccur: CURRENT_BOOKING.selectedTime,
                _userEmail: currentUser.email,
                bookedTime: dateFormat,
                isCancelled: false,
                invoice: {
                    quantity: CURRENT_BOOKING.selectedSeats.length,
                    price: CURRENT_BOOKING.selectedTheater.price,
                    total: CURRENT_BOOKING.selectedSeats.length * CURRENT_BOOKING.selectedTheater.price,
                    method: 'Cash',
                },
                address: bigAddress,
                contact: values.contact,
                name: values.name,
            });
            setMethodVisible(true);
        }
    };

    return (
        <div style={{ marginTop: 24 }}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    {/* Name */}
                    <Grid item container sx={{ p: 2, pl: 4 }}>
                        <Grid item xs={4}>
                            <Typography style={{ color: 'rgb(196, 196, 196)', fontSize: 15, fontStyle: 'italic' }}>
                                Name:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {validName.check === true ? (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.name}
                                    onChange={handleChangeInformation('name')}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.name}
                                    onChange={handleChangeInformation('name')}
                                    error
                                    helperText={validName.alert}
                                />
                            )}
                        </Grid>
                    </Grid>

                    {/* Contact */}
                    <Grid item container sx={{ p: 2, pl: 4 }}>
                        <Grid item xs={4}>
                            <Typography style={{ color: 'rgb(196, 196, 196)', fontSize: 15, fontStyle: 'italic' }}>
                                Contact:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {validContact.check === true ? (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.contact}
                                    onChange={handleChangeInformation('contact')}
                                />
                            ) : (
                                <TextField
                                    className="profile-information__item__content"
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.contact}
                                    onChange={handleChangeInformation('contact')}
                                    error
                                    helperText={validContact.alert}
                                />
                            )}
                        </Grid>
                    </Grid>

                    {/* Email */}
                    <Grid item container sx={{ p: 2, pl: 4 }}>
                        <Grid item xs={4}>
                            <Typography style={{ color: 'rgb(196, 196, 196)', fontSize: 15, fontStyle: 'italic' }}>
                                Email:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {validEmail.check === true ? (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.email}
                                    onChange={handleChangeInformation('email')}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    sx={{
                                        borderRadius: '0.5',
                                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                                        icons: { color: 'white' },
                                        // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                    }}
                                    defaultValue={currentUser.email}
                                    onChange={handleChangeInformation('email')}
                                    error
                                    helperText={validEmail.alert}
                                />
                            )}
                        </Grid>
                    </Grid>

                    {/* Address */}
                    <Grid item container sx={{ p: 2, pl: 4 }}>
                        <AddressInput
                            province={province}
                            provinceList={provinceList}
                            district={district}
                            districtList={districtList}
                            commune={commune}
                            communeList={communeList}
                            handleChangeHouse={handleChangeHouse}
                            handleChangeProvince={handleChangeProvince}
                            handleChangeDistrict={handleChangeDistrict}
                            handleChangeCommune={handleChangeCommune}
                        />
                        {!validAdress.check && (
                            <Typography style={{ fontSize: 12, color: 'red', fontStyle: 'italic' }} sx={{ pt: 1 }}>
                                {validAdress.alert}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <TicketInformation movie={movieInfo} />
                </Grid>
            </Grid>

            <Box textAlign="center" sx={{ p: 2 }}>
                <ChooseMethodBtn onClick={chooseMethod} />
                {methodVisible && (
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={methodValue}
                            onChange={handleChangeMethod}
                        >
                            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                            {cash && <OrderBtn onClick={order} />}
                            <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                            {pp && <PayPal purcharses={purchasesUnit} ticket={data} movieInfo={movieInfo} />}
                        </RadioGroup>
                    </FormControl>
                )}
            </Box>

            {updateSucceeded.status && <Success message={updateSucceeded.message} status={updateSucceeded.status} />}
            {errorNotification.status && (
                <Error message={errorNotification.message} status={errorNotification.status} />
            )}

            {isLoading && <Loading />}
        </div>
    );
}

function AddressInput({
    province,
    district,
    commune,
    handleChangeProvince,
    handleChangeDistrict,
    handleChangeCommune,
    handleChangeHouse,
    provinceList,
    districtList,
    communeList,
}) {
    const useStyles = makeStyles(() => ({
        select: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff',
            },
        },
    }));

    const classes = useStyles();

    return (
        <Grid item container>
            <TextField
                fullWidth
                id="outlined-basic"
                label="Your address"
                variant="standard"
                onChange={handleChangeHouse}
                sx={{
                    borderRadius: '0.5',
                    input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                    icons: { color: 'white' },
                    label: { color: 'rgb(153, 153, 153)', fontSize: 15 },
                    border: { color: 'rgb(153, 153, 153)' },
                }}
            />
            <Grid spacing={2} container sx={{ width: '100%', position: 'relative', marginTop: '1em' }}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">City/Province</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={province}
                            label="Province/City"
                            onChange={handleChangeProvince}
                            className={classes.select}
                            sx={{
                                svg: { color: '#fff' },
                                input: { color: '#fff' },
                                label: { color: '#fff' },
                            }}
                        >
                            {provinceList.map((province) => (
                                <MenuItem value={province}>{province.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">District</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={district}
                            label="District"
                            className={classes.select}
                            onChange={handleChangeDistrict}
                            sx={{
                                svg: { color: '#fff' },
                                input: { color: '#fff' },
                                label: { color: '#fff' },
                            }}
                        >
                            {districtList.map((district) => (
                                <MenuItem value={district}>{district.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Commune</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={commune}
                            label="Commune"
                            className={classes.select}
                            onChange={handleChangeCommune}
                            sx={{
                                svg: { color: '#fff' },
                                input: { color: '#fff' },
                                label: { color: '#fff' },
                            }}
                        >
                            {communeList.map((commune) => (
                                <MenuItem value={commune}>{commune.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    );
}

function TicketInformation({ movie }) {
    const CURRENT_BOOKING = useSelector(bookingSelector);
    const [movieInfo] = useState(movie);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const amount = CURRENT_BOOKING.selectedSeats.length;
        const { price } = CURRENT_BOOKING.selectedTheater;
        setTotal(amount * price);
    }, []);

    return (
        <Box style={{ backgroundColor: '#cfcfcf', boxShadow: '#fff 0px 5px 15px;' }} sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} style={{}}>
                    <div
                        className="poster"
                        style={{
                            backgroundImage: `url(${apiConfig.originalImage(movieInfo.poster_path)})`,
                            width: '100%',
                            height: '100%',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    />
                </Grid>

                <Grid item xs={7}>
                    <Stack direction="column">
                        <Typography variant="h5" style={{ fontWeight: 'bold', p: 2, color: 'red' }}>
                            {movieInfo.title}
                        </Typography>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', p: 2, color: 'black' }}>
                            {CURRENT_BOOKING.selectedTheater.name}
                        </Typography>
                        <Typography variant="caption" style={{ fontStyle: 'italic', p: 2, color: 'black' }}>
                            {CURRENT_BOOKING.selectedTheater.address}
                        </Typography>
                        <Typography variant="subtitle2" style={{ fontWeight: 'bold', color: 'black', p: 2 }}>
                            Price: {CURRENT_BOOKING.selectedTheater.price}$
                        </Typography>
                        <Typography variant="subtitle2" style={{ color: 'black', p: 2 }}>
                            Date - Time: {CURRENT_BOOKING.selectedDate} - {CURRENT_BOOKING.selectedTime}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            style={{ fontStyle: 'italic', fontWeight: 'bold', p: 2, color: 'black' }}
                        >
                            Seats:
                        </Typography>
                        <Stack direction="row" sx={{ pl: 2 }}>
                            {CURRENT_BOOKING.selectedSeats.map((item) => (
                                <Typography variant="subtitle2" sx={{ pr: 0.5, color: 'black' }}>
                                    {item}
                                </Typography>
                            ))}
                        </Stack>

                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'red' }}>
                            Total: {total}$
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>

            <Typography variant="caption" sx={{ pt: 1, color: 'black', fontStyle: 'italic', fontWeight: 800 }}>
                * We will send the booked ticket information to your email right after you order it! Please give this
                email for our staff before enter the room. Let enjoy the movie!
            </Typography>
        </Box>
    );
}

function ChooseMethodBtn({ onClick }) {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    return (
        <div>
            <ThemeProvider theme={btnTheme}>
                <Button
                    sx={{ paddingX: 5, paddingY: 0.8, mb: 2 }}
                    variant="text"
                    style={{ fontWeight: 'bold' }}
                    onClick={onClick}
                >
                    Choose paying method
                </Button>
            </ThemeProvider>
        </div>
    );
}

function OrderBtn({ onClick }) {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    return (
        <div>
            <ThemeProvider theme={btnTheme}>
                <Button sx={{ paddingX: 5, paddingY: 0.8, mb: 2 }} variant="contained" onClick={onClick}>
                    order
                </Button>
            </ThemeProvider>
        </div>
    );
}

export default BuyerInformation;
