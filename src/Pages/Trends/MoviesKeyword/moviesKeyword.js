/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from 'react';
import './moviesKeyword.css';
import { useNavigate } from 'react-router';
import apiConfig from '~/Api/apiConfig';

function MoviesKeyword({ keyword, movies }) {
    const [movieItems] = useState(movies);
    return (
        <div className="moviekeyword-container">
            <div className="film__container">
                <div className="film__container__header">
                    <h3 className="film__container__header__title">{keyword}</h3>
                </div>

                <div className="film__container__content">
                    <div className="film__container__view-more-content">
                        <div className="film__container__view-more-content-list">
                            {movieItems.map((item) => (
                                <SlideItem item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SlideItem(props) {
    const { item } = props;
    const background = apiConfig.originalImage(item.poster_path ? item.poster_path : item.backdrop_path);
    const navigate = useNavigate();

    const GoToDetails = () => {
        navigate(`/filmDetails/${item.id}`);
    };
    return (
        <div className="film__item__container" onClick={GoToDetails}>
            <img className="film__item__container__img" src={background} alt={item.title} />
            <babel className="film__item__container__title">{item.title}</babel>
        </div>
    );
}

export default MoviesKeyword;
