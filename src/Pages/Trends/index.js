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
    const [dictionary, setDictionary] = useState([]);
    const [numberOfKeyword, setNumberOfKeyword] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState({
        code: 'US',
        label: 'United States',
        phone: '1',
        suggested: true,
    });

    const getTrends = async (selectedCountry) => {
        // eslint-disable-next-line no-unused-vars
        let keywordsRes = [];
        let listKeyword = [];
        await googleTrendsApi
            .getDailyTrends(selectedCountry.code)
            .then(async (res) => {
                const listPromise = [];
                res.data.forEach((trendsWord) => {
                    listPromise.push(tmdbApi.searchListKeyword(trendsWord));
                });

                const resKeyword = await Promise.all(listPromise);

                for (let i = 0; i < resKeyword.length; i++) {
                    if (resKeyword[i].total_results !== 0) {
                        keywordsRes.push({
                            trend: res.data[i],
                            result: resKeyword[i],
                        });
                    }
                }
            })
            .catch((err) => console.log(err));

        keywordsRes.map((trendsWordCollection) => {
            let tmpList = [];
            const getListKW = () => {
                trendsWordCollection.result.results.map((item) => tmpList.push({ item }));
                return tmpList;
            };
            listKeyword.push({
                trend: trendsWordCollection.trend,
                list: getListKW(),
            });
        });

        if (listKeyword.length !== 0) {
            listKeyword.map(async (trendKW) => {
                let listPromise = [];
                trendKW.list.map((keyword) => {
                    listPromise.push(tmdbApi.discoverWithKeyword(keyword.item.id, selectedCountry.code));
                });
                const discoverRes = await Promise.all(listPromise);
                const obj = {
                    keyword: trendKW.trend,
                    movies: discoverRes[0].results,
                };
                //setTrendsMovie([...trendsMovie, obj]);
                setDictionary([
                    ...dictionary,
                    {
                        keyword: trendKW.trend,
                        movies: discoverRes[0].results,
                    },
                ]);
                // dictionary.push({
                //     keyword: trendKW.trend,
                //     movies: discoverRes[0].results,
                // });
            });
            setNumberOfKeyword(listKeyword.length);
        }
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
        console.log('numberOfKeyword', numberOfKeyword);
        console.log('dictionary length', dictionary.length);
        if (dictionary.length === numberOfKeyword) {
            setTrendsMovie(dictionary);
        }
    }, [dictionary, numberOfKeyword]);

    useEffect(() => {
        if (trendsMovie.length !== 0) {
            console.log(trendsMovie.length, trendsMovie);
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

            <div class="trends-container">
                {trendsMovie.length !== 0 &&
                    trendsMovie.map(
                        (item) =>
                            item.movies.length !== 0 && (
                                <MoviesKeyword keyword={item.keyword} movies={item.movies} key={item.keyword} />
                            ),
                    )}
            </div>
        </div>
    );
}

export default Trends;
