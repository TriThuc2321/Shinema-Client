import './style.css';
import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router';
import tmdbApi from '~/Api/tmdbApi';
import Person from './Component/person';

function PeopleDetails() {
    const { id } = useParams();
    const [person, setPerson] = useState();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const getPerson = async () => {
            try {
                const response = await tmdbApi.getDetailPerson(id);
                setPerson(response);
            } catch (err) {
                console.log(err);
            }
        };

        getPerson();

        const getMovie = async () => {
            try {
                const response = await tmdbApi.getMovieCredits(id);
                setMovies(response.cast.filter((item) => item.backdrop_path !== null || item.poster_path !== null));
            } catch (err) {
                console.log(err);
            }
        };
        getMovie();
    }, [id]);

    // eslint-disable-next-line react/jsx-one-expression-per-line
    return <div className="details"> {person && <Person person={person} movies={movies} />}</div>;
}

export default PeopleDetails;
