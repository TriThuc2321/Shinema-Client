import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const url = useLocation();
    const navigate = useNavigate();

    const [myClassNames, setMyClassNames] = useState([]);

    useEffect(() => {
        const { hash } = url;
        if (hash === '#top' || hash === '') {
            setMyClassNames(['item__selected', 'item', 'item', 'item']);
        } else if (hash === '#about') {
            setMyClassNames(['item', 'item__selected', 'item', 'item']);
        } else if (hash === '#project') {
            setMyClassNames(['item', 'item', 'item__selected', 'item']);
        }
    }, [url]);

    const handleClick = (id) => {
        navigate(id, { replace: true });
    };

    return (
        <div className={cx('container')}>
            <div className={cx(myClassNames[0])} onClick={() => handleClick('/#top')} />
            <div className={cx(myClassNames[1])} onClick={() => handleClick('/#about')} />
            <div className={cx(myClassNames[2])} onClick={() => handleClick('/#project')} />
        </div>
    );
}

export default Sidebar;
