/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

import { BiError } from 'react-icons/bi';

import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CircularProgress from '@mui/material/CircularProgress';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

import { Helmet } from 'react-helmet';
import { makeId, validateEmail, validatePassword } from '~/Utils';
import EmailApi from '../../Api/emailApi';
import AccountApi from '../../Api/accountApi';
// eslint-disable-next-line camelcase
import logoPng from '../../Assets/logo_png.png';
// eslint-disable-next-line camelcase
import backgroundLogin from '../../Assets/background_login.jpg';

function Register() {
    const navigate = useNavigate();

    const [emailErrVisible, setEmailErrVisible] = useState(false);
    const [emailWarningVisible, setEmailWarningVisible] = useState(false);

    const [passwordErrVisible, setPasswordErrVisible] = useState(false);

    const [confirmPasswordErrVisible, setConfirmPasswordErrVisible] = useState(false);

    const [verifyCode, setVerifyCode] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        confirmPassword: '',
        showConfirmPassword: false,
        confirmVerify: '',
        isLoading: false,
        correctVerify: true,
    });

    const checkInfo = async () => {
        let errEmail = false;
        let errPassword = false;
        let errConfirmPassword = false;

        if (!validateEmail(values.email)) {
            setEmailErrVisible(true);
            errEmail = true;
        } else {
            setEmailErrVisible(false);
            errEmail = false;
        }

        if (!validatePassword(values.password)) {
            setPasswordErrVisible(true);
            errPassword = true;
        } else {
            setPasswordErrVisible(false);
            errPassword = false;
        }

        if (values.password !== values.confirmPassword) {
            setConfirmPasswordErrVisible(true);
            errConfirmPassword = true;
        } else {
            setConfirmPasswordErrVisible(false);
            errConfirmPassword = false;
        }

        if (!errEmail && !errPassword && !errConfirmPassword) {
            await AccountApi.checkEmail(values.email)
                .then((res) => {
                    if (res !== 'Email already exists') {
                        setEmailWarningVisible(false);
                    } else {
                        setEmailWarningVisible(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            return !emailWarningVisible;
        }
        return false;
    };

    // --------------------countdown-------------------- //
    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:00');

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        const { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            // eslint-disable-next-line prefer-template
            const time = (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds);
            setTimer(time);
        }
    };

    const clearTimer = (e) => {
        setTimer('01:00');
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    };

    const handleClickOpenDialog = () => {
        setValues({
            ...values,
            correctVerify: true,
        });

        setOpenDialog(true);
        clearTimer(getDeadTime());
    };

    const sendMail = () => {
        setValues({
            ...values,
            isLoading: true,
        });

        const code = makeId(6);

        setVerifyCode(code);

        const mailOptions = {
            to: values.email,
            subject: 'Verify account',
            text: `Thanks for using Shinema, your verify code is: ${verifyCode}`,
        };

        EmailApi.sendVerify(mailOptions)
            .then(() => {
                setValues({
                    ...values,
                    isLoading: false,
                });
                handleClickOpenDialog();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const registerHandle = async () => {
        checkInfo().then((res) => {
            if (res) sendMail();
        });
    };

    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const txtFieldThem = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: grey,
        },
        text: grey,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleClickShowConfirmPassword = () => {
        setValues({
            ...values,
            showConfirmPassword: !values.showConfirmPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleResendMail = () => {
        sendMail();
    };

    const createAccount = () => {
        const account = {
            name: values.email,
            contact: '',
            identifyNumber: '',
            address: '',
            birthday: '',
            email: values.email,
            password: values.password,
            rank: 'Customer',
            score: 0,
            listTicketId: [],
            listReview: [],
        };
        AccountApi.create(account)
            .then(() => {
                navigate('/login');
            })
            .catch((err) => console.log(err));
    };

    const handleConfirmDialog = () => {
        if (verifyCode === values.confirmVerify) {
            setValues({ ...values, correctVerify: true });
            setOpenDialog(false);
            createAccount();
        } else {
            setValues({ ...values, correctVerify: false });
        }
    };

    return (
        <div className="register">
            <Helmet>
                <title>Register</title>
            </Helmet>

            <div className="register__background">
                <img className="register__background__img" src={backgroundLogin} alt="background" />
                <div className="register__color__gradient" />
            </div>

            <div className="register__form__container">
                <div className="register__form__title">
                    <img style={{ width: 40 }} src={logoPng} alt="logo_png" />
                    <h2>REGISTER</h2>
                </div>

                <ThemeProvider theme={txtFieldThem}>
                    <TextField
                        label="Email"
                        variant="filled"
                        color="primary"
                        text="primary"
                        sx={{
                            marginTop: 1,
                            backgroundColor: 'rgb(9, 24, 48)',
                            borderRadius: 0.5,
                            input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                            label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                        }}
                        value={values.email}
                        onChange={handleChange('email')}
                    />
                </ThemeProvider>

                {emailErrVisible && <Message message="Invalid email" type="err" />}
                {emailWarningVisible && <Message message="Email is already used" type="warning" />}

                <ThemeProvider theme={txtFieldThem}>
                    <FormControl
                        sx={{
                            marginTop: 2,
                            backgroundColor: 'rgb(9, 24, 48)',
                            borderRadius: 0.5,
                        }}
                        variant="filled"
                    >
                        <InputLabel
                            sx={{ color: 'rgb(153, 153, 153)', marginLeft: 1 }}
                            htmlFor="filled-adornment-password"
                        >
                            Password
                        </InputLabel>
                        <FilledInput
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            sx={{ color: '#fff', marginLeft: 1, fontSize: 15 }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        sx={{ color: 'rgb(153, 153, 153)', marginRight: 0.3 }}
                                    >
                                        {values.showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </ThemeProvider>

                {passwordErrVisible && <Message message="Password has least 6 character" type="err" />}

                <ThemeProvider theme={txtFieldThem}>
                    <FormControl
                        sx={{
                            marginTop: 2,
                            backgroundColor: 'rgb(9, 24, 48)',
                            borderRadius: 0.5,
                        }}
                        variant="filled"
                    >
                        <InputLabel
                            sx={{ color: 'rgb(153, 153, 153)', marginLeft: 1 }}
                            htmlFor="filled-adornment-password"
                        >
                            Confirm password
                        </InputLabel>
                        <FilledInput
                            type={values.showConfirmPassword ? 'text' : 'password'}
                            value={values.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            sx={{ color: '#fff', marginLeft: 1, fontSize: 15 }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        sx={{ color: 'rgb(153, 153, 153)', marginRight: 0.3 }}
                                    >
                                        {values.showConfirmPassword ? (
                                            <VisibilityOutlined />
                                        ) : (
                                            <VisibilityOffOutlined />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </ThemeProvider>

                {confirmPasswordErrVisible && <Message message="Confirm password is not correct" type="err" />}

                <ThemeProvider theme={btnTheme}>
                    <Button sx={{ padding: 1, marginTop: 3 }} variant="contained" onClick={registerHandle}>
                        Register
                    </Button>
                </ThemeProvider>

                <div className="register__form__register">
                    <p>Had you have account already?</p>
                    <a>
                        <Link to="/login">Login</Link>
                    </a>
                </div>
            </div>

            {/* -----------------------dialog custom--------------------- */}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{ color: '#040C18' }}>Confirm email</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Shinema has already sent you a email. Please check and confirm your verify code below.
                    </DialogContentText>
                    {values.correctVerify ? (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Verify code"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={values.confirmVerify}
                            onChange={handleChange('confirmVerify')}
                        />
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Mã xác nhận"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={values.confirmVerify}
                            onChange={handleChange('confirmVerify')}
                            error
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <p>{timer}</p>

                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    {timer === '00:00' ? (
                        <Button onClick={handleResendMail}>Resend</Button>
                    ) : (
                        <Button disabled>Resend</Button>
                    )}

                    {timer === '00:00' ? (
                        <Button disabled>Confirm</Button>
                    ) : (
                        <Button onClick={handleConfirmDialog}>Confirm</Button>
                    )}
                </DialogActions>
            </Dialog>

            {values.isLoading && (
                <div
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}

function Message(props) {
    const { mess, type } = props;

    return (
        <div className="login__form__message" style={{ color: type === 'err' ? 'rgb(192, 7, 7)' : '#e9be00' }}>
            <BiError size={15} />
            <p>{mess}</p>
        </div>
    );
}

export default Register;
