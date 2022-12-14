import classNames from 'classnames/bind';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import styles from './Home.module.scss';
import Slider from './Components/Slider/slider';
import FilmSlider from './Components/FilmSlider/filmSlider';
import SliderCF from './Components/SliderCF/sliderCF';
import { movieType, category } from '~/Api/tmdbApi';
import { userSelector } from '~/Redux/selector';

const cx = classNames.bind(styles);

function Home() {
    const user = useSelector(userSelector);
    return (
        <div className={cx('container')}>
            <Helmet>
                <title>Shemina</title>
            </Helmet>

            <Slider />
            {user && <SliderCF />}
            <FilmSlider category={category.movie} typeFilm={movieType.popular} />
            <FilmSlider category={category.movie} typeFilm={movieType.upcoming} />
            <FilmSlider category={category.movie} typeFilm={movieType.top_rated} />
        </div>
    );
}

export default Home;
