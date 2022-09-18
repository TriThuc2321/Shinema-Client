import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from './Components/Slider/slider';

import { checkLogged } from '~/Utils/auth';

const cx = classNames.bind(styles);

function Home() {
    checkLogged();
    return (
        <div className={cx('container')}>
            <Slider />
        </div>
    );
}

export default Home;
