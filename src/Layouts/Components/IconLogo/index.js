import React from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router';
import styles from './IconLogo.module.scss';

import logoPng from '~/Assets/logo_png.png';

const cx = classNames.bind(styles);

function IconLogo() {
    const navigate = useNavigate();
    const homeNavigate = () => {
        navigate('/');
    };
    return <img className={cx('container')} src={logoPng} alt="logo_png" onClick={homeNavigate} />;
}

export default IconLogo;
