import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from './Components/Slider/slider';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('container')}>
            <Slider />
        </div>
    );
}

export default Home;
