import React from 'react';
import classNames from 'classnames/bind';

import styles from './Navtext.module.scss';

const cx = classNames.bind(styles);

function Navtext() {
    return (
        <div className={cx('nav-text')}>
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

export default Navtext;
