import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <NavText />
                <Menu />
            </div>
        </header>
    );
}

function NavText() {
    return (
        <div className={cx('nav-text')}>
            <div className={cx('item')}>
                <div className={cx('item-background')} />
                <a href="#top">Home</a>
            </div>

            <div className={cx('item')}>
                <div className={cx('item-background')} />
                <a href="#about">About</a>
            </div>

            <div className={cx('item')}>
                <div className={cx('item-background')} />
                <a href="#project">Project</a>
            </div>
        </div>
    );
}

function Menu() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const handleClose = () => {
        setToggleMenu(false);
    };

    return (
        <div className={cx('menu')}>
            <HiMenuAlt3 size="1.5em" onClick={() => setToggleMenu(!toggleMenu)} onBlur={() => console.log('blur')} />
            {toggleMenu && <ListMenu handleClose={handleClose} />}
        </div>
    );
}

function ListMenu({ handleClose }) {
    return (
        <div className={cx('list-menu')}>
            <a href="#top" onClick={handleClose}>
                Home
            </a>
            <a href="#about" onClick={handleClose}>
                About
            </a>
            <a href="#project" onClick={handleClose}>
                Project
            </a>
        </div>
    );
}

export default Header;
