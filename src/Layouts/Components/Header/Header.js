import React from 'react';
import classNames from 'classnames/bind';

import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import styles from './Header.module.scss';

import logoPng from '~/assets/logo_png.png';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('container')}>
            <NavbarLink />
            <NotSignInMenu />
        </div>
    );
}
function NavbarLink() {
    return (
        <div className={cx('nav-text')}>
            <img src={logoPng} alt="logo_png" />
            <p>
                <a href="#popular">Popular</a>
            </p>
            <p>
                <a href="#upcoming">Upcoming</a>
            </p>
            <p>
                <a href="#top_rated">Top-rated</a>
            </p>
        </div>
    );
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

export default Header;
