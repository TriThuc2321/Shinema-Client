import React from 'react';
import classNames from 'classnames/bind';
import styles from './DetailHeader.module.scss';

import { Login, IconLogo } from '../index';

const cx = classNames.bind(styles);

function DetailHeader() {
    return (
        <div className={cx('DetailHeader')}>
            <IconLogo />
            <Login />
        </div>
    );
}

export default DetailHeader;
