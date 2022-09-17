import React from 'react';
import classNames from 'classnames/bind';

import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    return <NotSignInMenu />;
}

function NotSignInMenu() {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    const navigate = useNavigate();

    return (
        <div className={cx('login')}>
            <p>
                <Link to="/corner/movie/popular">FILMDOM</Link>
            </p>

            <p>
                <Link to="/login">LOGIN</Link>
            </p>

            <ThemeProvider theme={btnTheme}>
                <Button
                    sx={{
                        paddingX: 5,
                        paddingY: 0.8,
                    }}
                    variant="contained"
                    onClick={() => navigate('/register')}
                >
                    REGISTER
                </Button>
            </ThemeProvider>
        </div>
    );
}

export default Login;
