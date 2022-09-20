import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from './Components/Slider/slider';
import FilmSlider from './Components/FilmSlider/filmSlider';
import { movieType, category } from '~/Api/tmdbApi';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('container')}>
            <Slider />
            <FilmSlider category={category.movie} typeFilm={movieType.popular} />
            <FilmSlider category={category.movie} typeFilm={movieType.upcoming} />
            <FilmSlider category={category.movie} typeFilm={movieType.top_rated} />
        </div>
    );
}

export default Home;
