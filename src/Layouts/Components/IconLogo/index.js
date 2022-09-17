import React from 'react';
import classNames from 'classnames/bind';
import styles from './IconLogo.module.scss';

import logoPng from '~/Assets/logo_png.png';

const cx = classNames.bind(styles);

function IconLogo() {
    return <img className={cx('container')} src={logoPng} alt="logo_png" />;
}

export default IconLogo;
