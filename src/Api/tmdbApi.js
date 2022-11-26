/* eslint-disable prefer-const */
import axiosClient from './axiosClient';

export const category = {
    movie: 'movie',
    tv: 'tv',
};

export const movieType = {
    now_playing: 'now_playing',
    upcoming: 'upcoming',
    popular: 'popular',
    top_rated: 'top_rated',
};

export const tvType = {
    popular: 'popular',
    top_rated: 'top_rated',
    on_the_air: 'on_the_air',
};

const tmdbApi = {
    getMoviesList: (type, params) => {
        const url = `movie/${movieType[type]}`;
        return axiosClient.get(url, params);
    },
    getTvList: (type, params) => {
        const url = `tv/${tvType[type]}`;
        return axiosClient.get(url, params);
    },
    getVideos: (cate, id) => {
        const url = `${category[cate]}/${id}/videos`;
        return axiosClient.get(url, { params: {} });
    },
    search: (cate, params) => {
        const url = `search/${category[cate]}`;
        return axiosClient.get(url, params);
    },
    detail: (cate, id, params) => {
        const url = `${category[cate]}/${id}`;
        return axiosClient.get(url, params);
    },
    credits: (cate, id) => {
        const url = `${category[cate]}/${id}/credits`;
        return axiosClient.get(url, { params: {} });
    },
    similar: (cate, id) => {
        const url = `${category[cate]}/${id}/similar`;
        return axiosClient.get(url, { params: {} });
    },
    getPopularPeople: (params) => {
        const url = '/person/popular';
        return axiosClient.get(url, params);
    },
    searchPeople: (params) => {
        const url = '/search/person';
        return axiosClient.get(url, params);
    },
    getDetailPerson: (id) => {
        const url = `/person/${id}`;
        return axiosClient.get(url, { params: {} });
    },
    getMovieCredits: (personId) => {
        const url = `/person/${personId}/movie_credits`;
        return axiosClient.get(url, { params: {} });
    },
    getMovie: (movieId) => {
        const url = `/movie/${movieId}`;
        return axiosClient.get(url, { params: {} });
    },
    searchListKeyword: (keyword) => {
        const url = '/search/keyword';
        return axiosClient.get(url, { params: { query: keyword } });
    },
    discoverWithKeyword: (keywordId) => {
        const url = '/discover/movie';
        return axiosClient.get(url, { params: { with_keywords: keywordId } });
    },
};

export default tmdbApi;
