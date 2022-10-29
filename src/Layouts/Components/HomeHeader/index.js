import React from 'react';
import classNames from 'classnames/bind';
import styles from './HomeHeader.module.scss';

import { Login, Navtext, IconLogo } from '../index';

const cx = classNames.bind(styles);

function HomeHeader() {
    return (
        <div className={cx('HomeHeader')}>
            <div className={cx('flex')}>
                <IconLogo />
                <Navtext />
            </div>

            <Login />
        </div>
    );
}

export default HomeHeader;
