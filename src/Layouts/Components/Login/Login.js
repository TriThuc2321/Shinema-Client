import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import { BsBell } from 'react-icons/bs';
import { GiFilmStrip } from 'react-icons/gi';
import { IoIosLogOut } from 'react-icons/io';
import userSlice from '~/Redux/slices/userSlice';

import styles from './Login.module.scss';

const cx = classNames.bind(styles);

const defaultColor = '#fff';

function Login() {
    const [logged, setLogged] = useState(false);
    useEffect(() => {
        const logedIn = localStorage.getItem('logged');
        setLogged(logedIn);
    }, []);

    return logged === 'true' ? <SignedInMenu /> : <NotSignInMenu />;
}

function NotSignInMenu() {
    const navigate = useNavigate();
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: red,
        },
    });

    return (
        <div className={cx('not-signed-in-menu')}>
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

function SignedInMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [menuToggle, setMenuToggle] = useState(false);
    const toggleHandle = () => {
        setMenuToggle(!menuToggle);
    };

    const logoutHandle = () => {
        localStorage.setItem('accessToken', '');
        localStorage.setItem('refreshToken', '');
        dispatch(userSlice.actions.update(''));
        navigate('/login');
    };

    return (
        <div className={cx('signed-in-menu')}>
            {menuToggle ? (
                <AiOutlineMenu color="#ff492094" size={27} onClick={toggleHandle} />
            ) : (
                <AiOutlineMenu color="#fff" size={27} onClick={toggleHandle} />
            )}

            {menuToggle && (
                <div className={cx('list-menu')}>
                    <div className={cx('menu-item')}>
                        <p>
                            <Link to="/profile">Profile</Link>
                        </p>
                        <AiOutlineUser className="menu__item__icon" color={defaultColor} size={25} />
                    </div>

                    <div className={cx('menu-item')}>
                        <p>
                            <Link to="/userInfor">Notification</Link>
                        </p>
                        <BsBell className="menu__item__icon" color={defaultColor} size={23} />
                    </div>

                    <div className={cx('menu-item')}>
                        <p>
                            <Link to="/corner/movie/popular">FILMDOM</Link>
                        </p>
                        <GiFilmStrip className="menu__item__icon" color={defaultColor} size={23} />
                    </div>

                    <div className={cx('menu__line')} />

                    <div className={cx('menu-item')} onClick={logoutHandle}>
                        <p>LOGOUT</p>
                        <IoIosLogOut className="menu__item__icon" color={defaultColor} size={23} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
