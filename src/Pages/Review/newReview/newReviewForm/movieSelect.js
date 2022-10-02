import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import tmdbApi from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';
import movieSlice from '~/Redux/slices/movieSlice';

function MovieSelect() {
    const txtFieldThem = createTheme({
        palette: {
            primary: grey,
        },
        text: grey,
    });

    const dispatch = useDispatch();
    const keyword = useSelector((state) => state.movies.keywordReview);
    const currentFilm = useSelector((state) => state.movies.selectForReview);

    const getMovies = async () => {
        try {
            if (keyword != null && keyword !== '') {
                const params = {
                    query: keyword,
                    page: 1,
                };
                const response = await tmdbApi.search('movie', { params });
                dispatch(
                    movieSlice.actions.updateListFromReviewSelect(
                        response.results.filter((item) => item.backdrop_path != null || item.poster_path != null),
                    ),
                );
            }
        } catch {
            console.log('Film slider error');
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            getMovies();
        }, 100);

        return () => clearTimeout(timeout);
    }, [keyword]);

    const handleSearchChange = (event) => {
        dispatch(movieSlice.actions.updateKeywordReview(event.target.value));
    };

    const [showListSuggestions, setShowListSuggestions] = useState(false);
    const onBlurSearchHandle = () => {
        const timeout = setTimeout(() => {
            setShowListSuggestions(false);
        }, 200);

        return () => clearTimeout(timeout);
    };

    const onFocusSearchHandle = () => {
        setShowListSuggestions(true);
    };
    return (
        <Stack>
            <ThemeProvider theme={txtFieldThem}>
                <CustomTextField
                    sx={{
                        width: 350,
                        input: { color: 'white', marginLeft: 1, marginX: 0.4 },
                        label: { color: 'rgb(153, 153, 153)', marginLeft: 1, marginX: 0.4 },
                    }}
                    label="Movie"
                    variant="standard"
                    onChange={handleSearchChange}
                    onBlur={() => onBlurSearchHandle()}
                    onFocus={() => onFocusSearchHandle()}
                />
            </ThemeProvider>
            {showListSuggestions && <ListSuggestions />}
            {currentFilm && <CurrentFilm currentFilm={currentFilm} />}
        </Stack>
    );
}

function ListSuggestions() {
    const listFromReviewSelect = useSelector((state) => state.movies.listFromReviewSelect);

    return (
        <Stack sx={{ maxHeight: 300, width: 350, overflowY: 'scroll', backgroundColor: 'rgb(9, 24, 48)' }}>
            {listFromReviewSelect && listFromReviewSelect.map((item) => <SuggestionItem item={item} key={item.id} />)}
        </Stack>
    );
}

function SuggestionItem({ item }) {
    const dispatch = useDispatch();
    const onClickItem = (e) => {
        dispatch(movieSlice.actions.updateSelectForReview(e));
    };

    const poster = apiConfig.originalImage(item.backdrop_path ? item.poster_path : item.backdrop_path);

    return (
        <Stack direction="row" sx={{ marginY: 0.5, width: '100%' }}>
            <div
                style={{
                    backgroundImage: `url(${poster})`,
                    display: 'flex',
                    height: 60,
                    width: 40,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            <CustomItemSelectButton onClick={() => onClickItem(item)} variant="text">
                {item.title}
            </CustomItemSelectButton>
        </Stack>
    );
}

function CurrentFilm({ currentFilm }) {
    const poster = apiConfig.originalImage(
        currentFilm.backdrop_path ? currentFilm.poster_path : currentFilm.backdrop_path,
    );

    return (
        <div style={{ maxWidth: 400 }}>
            <div
                style={{
                    backgroundImage: `url(${poster})`,
                    display: 'flex',
                    height: 400,
                    width: 280,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 10,
                    boxShadow: 5,
                    marginTop: 10,
                }}
            />

            <p style={{ color: '#fff', fontSize: 25 }}>{currentFilm.title}</p>
        </div>
    );
}

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#fff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#fff',
        },
        '&:hover fieldset': {
            borderColor: '#fff',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#fff',
        },
    },
});

const CustomItemSelectButton = styled(Button)(() => ({
    color: '#fff',
    backgroundColor: 'rgb(9, 24, 48)',
    '&:hover': {
        backgroundColor: 'rgb(15, 40, 80)',
    },
    textAlign: 'left',
    textTransform: 'none',
    padding: '10px 10px',
    margin: 0,
    justifyContent: 'stretch',
    width: '90%',
}));

export default MovieSelect;
