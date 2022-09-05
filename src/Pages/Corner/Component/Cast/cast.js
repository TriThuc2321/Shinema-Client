/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useCallback } from 'react';

import './cast.css';
import { useNavigate, useParams } from 'react-router';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import apiConfig from '~/Api/apiConfig';
import tmdbApi from '~/Api/tmdbApi';

function CastCorner() {
    const [peopleItems, setPeopleItems] = useState([]);
    const [, setLoadMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    const { keyword } = useParams();

    const openMoreHandler = async () => {
        setLoadMore(true);

        const getPeople = async () => {
            // console.log("total page " + totalPages)
            // console.log('page now ' + page)

            if (page + 1 > totalPages) {
                setPage(totalPages);
            } else setPage(page + 1);

            if (keyword === undefined) {
                const params = { page };
                const response = await tmdbApi.getPopularPeople({ params });
                console.log(response.results);
                setPeopleItems([...peopleItems, ...response.results]);
                setTotalPages(response.total_pages);
            } else if (keyword !== undefined) {
                const params = { page, query: keyword };
                const response = await tmdbApi.searchPeople({ params });
                setPeopleItems([...peopleItems, ...response.results]);
                setTotalPages(response.total_pages);
            }
        };

        if (page < totalPages) await getPeople();
    };

    useEffect(() => {
        if (keyword === undefined) {
            const getPeople = async () => {
                try {
                    const params = {
                        page: 1,
                    };
                    const response = await tmdbApi.getPopularPeople({ params });
                    console.log(response.results);
                    setPeopleItems(response.results);
                    setTotalPages(response.total_pages);
                } catch (err) {
                    console.log(err);
                }
            };

            getPeople();
        } else if (keyword !== undefined) {
            const getPeople = async () => {
                try {
                    const params = {
                        page: 1,
                        query: keyword,
                    };
                    const response = await tmdbApi.searchPeople({ params });
                    console.log(response.results);
                    setPeopleItems(response.results);
                    setTotalPages(response.total_pages);
                } catch (err) {
                    console.log(err);
                }
            };
            getPeople();
        }
    }, [keyword]);

    return (
        <div className="people-container">
            <div className="people-filter">
                <SearchBar keyword={keyword} />
            </div>

            <div className="people__container">
                <div className="people__container__content">
                    <div className="people__container__view-more-content">
                        <div className="people__container__view-more-content-list">
                            {peopleItems.map((item) => (
                                <SlideItem item={item} key={item.id} />
                            ))}
                        </div>
                        {page < totalPages ? <ViewMoreButton onClick={openMoreHandler} /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SearchBar(props) {
    const txtFieldTheme = createTheme({
        shape: {
            borderRadius: 55,
        },
        palette: {
            primary: grey,
        },
        text: grey,
    });

    const navigate = useNavigate();

    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '');

    const goToSearch = useCallback(() => {
        if (keyword.trim().length > 0) {
            navigate(`/corner/people/search/${keyword}`);
        }
    }, [keyword, navigate]);

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) goToSearch();
        };

        document.addEventListener('keyup', enterEvent);

        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="people-search-bar">
            <ThemeProvider theme={txtFieldTheme}>
                <TextField
                    id="filled-search"
                    label="Find a person..."
                    type="search"
                    variant="filled"
                    text="primary"
                    color="primary"
                    /// value={movieSearch.search}
                    sx={{
                        marginTop: 1,
                        width: 450,
                        backgroundColor: 'rgb(9, 24, 48)',
                        borderRadius: 0.5,
                        input: { color: 'white', marginLeft: 10, marginX: 0.4 },
                        // eslint-disable-next-line object-curly-newline
                        label: { color: 'rgb(153, 153, 153)', marginLeft: 10, marginX: 2, fontSize: 15 },
                    }}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={goToSearch}>
                                    <SearchIcon sx={{ color: 'white' }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </ThemeProvider>
        </div>
    );
}

export default CastCorner;

export function ViewMoreButton(props) {
    const btnTheme = createTheme({
        shape: {
            borderRadius: 20,
        },
        palette: {
            primary: {
                main: '#fff',
                outline: '#fff',
            },
        },
    });

    return (
        <div className="people__container__content__viewMore">
            <ThemeProvider theme={btnTheme}>
                <Button sx={{ paddingX: 5, paddingY: 0.8 }} variant="outlined" onClick={props.onClick}>
                    Xem thêm
                </Button>
            </ThemeProvider>
        </div>
    );
}

function SlideItem(props) {
    const { item } = props;
    const background = apiConfig.originalImage(item.profile_path);
    // const dispatch = useDispatch();
    // const data = useSelector(movieSelector)
    const navigate = useNavigate();

    const GoToDetails = () => {
        navigate(`/peopleDetails/${item.id}`);
    };
    return (
        <div className="people__item__container" onClick={GoToDetails}>
            <img className="people__item__container__img" src={background} alt={item.title} />
            <div className="people__item__container__name">{item.name}</div>
        </div>
    );
}
