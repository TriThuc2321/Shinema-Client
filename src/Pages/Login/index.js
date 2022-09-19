import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './login.css';

import { decode, encode } from 'base-64';

import { AiOutlineGoogle } from 'react-icons/ai';
import { FaFacebookF } from 'react-icons/fa';
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

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import AccountApi from '~/Api/accountApi';
import { validateEmail, validatePassword } from '~/Utils';
import Loading from '~/Components/Loading';
import logoPng from '~/Assets/logo_png.png';
import backgroundLogin from '~/Assets/background_login.jpg';
import userSlice from '~/Redux/slices/userSlice.js';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const txtFieldThem = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: grey,
        },
        text: grey,
    });

    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        isLoading: false,
        rememberAccount: false,
        verifyCode: '',
    });

    const [emailErrVisible, setEmailErrVisible] = useState(false);
    const [emailWarningVisible, setEmailWarningVisible] = useState(false);
    const [passwordErrVisible, setPasswordErrVisible] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const checkBoxChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.checked });
    };
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const checkInfo = () => {
        if (!validateEmail(values.email)) {
            setEmailErrVisible(true);
            return false;
        }
        setEmailErrVisible(false);

        if (!validatePassword(values.password)) {
            setPasswordErrVisible(true);
            return false;
        }
        setPasswordErrVisible(false);

        return true;
    };

    const loginHandle = async () => {
        const result = checkInfo();
        if (result) {
            setValues({ ...values, isLoading: true });
            AccountApi.login(values.email, values.password)
                .then((res) => {
                    setValues({ ...values, isLoading: false });
                    if (result.data === 'Email not exist') {
                        setEmailWarningVisible(true);
                        setPasswordErrVisible(false);
                    } else if (result.data === 'Password incorrect') {
                        setEmailWarningVisible(false);
                        setPasswordErrVisible(true);
                    } else {
                        setEmailWarningVisible(false);
                        setPasswordErrVisible(false);

                        localStorage.setItem('logged', true);
                        if (!values.rememberAccount) {
                            localStorage.setItem('rememberAccount', false);
                            localStorage.setItem(encode('rememberEmail'), encode(values.email));
                        } else {
                            localStorage.setItem('rememberAccount', true);
                            localStorage.setItem(encode('rememberEmail'), encode(values.email));
                            localStorage.setItem(encode('rememberPassword'), encode(values.password));
                        }

                        dispatch(userSlice.actions.update(res.data));
                        navigate('/');
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const getAccount = () => {
        if (localStorage.getItem('logged') === 'true') {
            navigate('/');
            return;
        }

        if (localStorage.getItem('rememberAccount') === 'true') {
            setValues({
                ...values,
                rememberAccount: true,
                email: decode(localStorage.getItem(encode('rememberEmail'))),
                password: decode(localStorage.getItem(encode('rememberPassword'))),
            });
        } else {
            setValues({
                ...values,
                rememberAccount: false,
                email: '',
                password: '',
            });
        }
    };
    useEffect(getAccount, []);

    return (
        <div className="login">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="login__background">
                <img className="login__background__img" src={backgroundLogin} alt="background" />
                <div className="login__color__gradient" />
            </div>

            <div className="login__form__container">
                <div className="login__form__title">
                    <img style={{ width: 40 }} src={logoPng} alt="logo_png" />
                    <h2>LOGIN</h2>
                </div>

                <ThemeProvider theme={txtFieldThem}>
                    <TextField
                        id="filled-basic"
                        label="Email"
                        variant="filled"
                        color="primary"
                        text="primary"
                        sx={{
                            marginTop: 1,
                            backgroundColor: 'rgb(9, 24, 48)',
                            borderRadius: 0.2,
                            input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                            label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                        }}
                        value={values.email}
                        onChange={handleChange('email')}
                    />
                </ThemeProvider>

                {emailErrVisible && <Message message="Invalid email" type="err" />}
                {emailWarningVisible && <Message message="Email do not register" type="warning" />}

                <ThemeProvider theme={txtFieldThem}>
                    <FormControl
                        sx={{
                            marginY: 2,
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

                {passwordErrVisible && <Message message="Password is incorrect" type="err" />}

                <div className="login__form__remember__container">
                    <p>
                        <Link to="/forgotPassword">Forgot your password?</Link>
                    </p>

                    <div className="login__form__remember">
                        <p>Remember me</p>
                        <input
                            type="checkbox"
                            checked={values.rememberAccount}
                            onChange={checkBoxChange('rememberAccount')}
                        />
                    </div>
                </div>

                <ThemeProvider theme={btnTheme}>
                    <Button sx={{ padding: 1, marginTop: 3 }} variant="contained" onClick={loginHandle}>
                        Login
                    </Button>
                </ThemeProvider>

                <hr style={{ marginBottom: 60, marginTop: 20 }} />

                <div className="login__form__socialMedia">
                    <AiOutlineGoogle size={23} />
                    <p>Login with Google</p>
                </div>

                <div className="login__form__socialMedia">
                    <FaFacebookF size={21} />
                    <p>Login with Facebook</p>
                </div>

                <div className="login__form__register">
                    <p>You do not have account? </p>
                    <p>
                        <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>

            {values.isLoading && <Loading />}
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

export default Login;
