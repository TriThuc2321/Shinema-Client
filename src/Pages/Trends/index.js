/* eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import './trends.css';

import googleTrendsApi from '~/Api/googleTrendsApi';

import MoviesKeyword from './MoviesKeyword/moviesKeyword';
import CountryFilter from './CountryFilter/countryFilter';
import Loading from '~/Components/Loading';

function Trends() {
    const [trendsMovie, setTrendsMovie] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({
        code: 'US',
        label: 'United States',
        phone: '1',
        suggested: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    const getTrends = async (selectedCountry) => {
        // eslint-disable-next-line no-unused-vars
        await googleTrendsApi
            .getDailyTrends(selectedCountry.code)
            .then((res) => {
                setTrendsMovie(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        setTrendsMovie([]);
        getTrends(selectedCountry);
    }, []);

    useEffect(() => {
        console.log(selectedCountry);
        if (selectedCountry && selectedCountry.label !== '') {
            setIsLoading(true);
            setTrendsMovie([]);
            getTrends(selectedCountry);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (trendsMovie.length !== 0) {
        }
    }, [trendsMovie]);

    return (
        <div class="trends-page-container">
            <Helmet>
                <title>Trends</title>
            </Helmet>
            <div class="menu-container">
                <CountryFilter selectedCountry={selectedCountry} setMethod={setSelectedCountry} />
            </div>

            {selectedCountry !== null && selectedCountry !== '' && (
                <div class="trends-title">Trends in {selectedCountry.label}: </div>
            )}

            {isLoading && <Loading />}
            {!isLoading &&
                (trendsMovie.length !== 0 ? (
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
                ))}
        </div>
    );
}

export default Trends;
