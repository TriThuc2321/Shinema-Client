/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './trends.css';

import tmdbApi from '~/Api/tmdbApi';
import googleTrendsApi from '~/Api/googleTrendsApi';

import MoviesKeyword from './MoviesKeyword/moviesKeyword';
import CountryFilter from './CountryFilter/countryFilter';

function Trends() {
    const [trendsMovie, setTrendsMovie] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({
        code: 'US',
        label: 'United States',
        phone: '1',
        suggested: true,
    });

    const getTrends = async (selectedCountry) => {
        // eslint-disable-next-line no-unused-vars
        await googleTrendsApi
            .getDailyTrends(selectedCountry.code)
            .then((res) => {
                setTrendsMovie(res.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        setTrendsMovie([]);
        getTrends(selectedCountry);
    }, []);

    useEffect(() => {
        setTrendsMovie([]);
        getTrends(selectedCountry);
    }, [selectedCountry]);

    useEffect(() => {
        if (trendsMovie.length !== 0) {
        }
    }, [trendsMovie]);

    return (
        <div>
            <Helmet>
                <title>Trends</title>
            </Helmet>
            <div class="menu-container">
                <CountryFilter selectedCountry={selectedCountry} setMethod={setSelectedCountry} />
            </div>

            {trendsMovie.length !== 0 ? (
                <div class="trends-container">
                    {trendsMovie.map(
                        (item) =>
                            item.movies.length !== 0 && (
                                <MoviesKeyword keyword={item.keyword} movies={item.movies} key={item.keyword} />
                            ),
                    )}
                </div>
            ) : (
                <div class="no-data">No data.</div>
            )}
        </div>
    );
}

export default Trends;
