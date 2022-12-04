/* eslint-disable no-unused-vars */
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import styles from './Home.module.scss';
import Slider from './Components/Slider/slider';
import FilmSlider from './Components/FilmSlider/filmSlider';
import SliderCF from './Components/SliderCF/sliderCF';
import tmdbApi, { movieType, category } from '~/Api/tmdbApi';
import Chatbot from '~/Components/Chatbot';
import { userSelector } from '~/Redux/selector';

const cx = classNames.bind(styles);

function Home() {
    const user = useSelector(userSelector);
    return (
        <div className={cx('container')}>
            <Helmet>
                <title>Shemina</title>
            </Helmet>

            <Chatbot />
            <Slider />
            {user && <SliderCF />}
            <FilmSlider category={category.movie} typeFilm={movieType.popular} />
            <FilmSlider category={category.movie} typeFilm={movieType.upcoming} />
            <FilmSlider category={category.movie} typeFilm={movieType.top_rated} />
        </div>
    );
}

export default Home;
