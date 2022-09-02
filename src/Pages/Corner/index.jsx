import './corner.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { movieCornerSelector } from '../../redux/selector';
import movieCornerSlice from '../../Redux/slices/movieCornerSlice';

import CastCorner from '../../components/Corners/PeopleCorner/castCorner';
import FilmCorner from '../../components/Corners/FilmCorner/filmCorner';
import MainNavBar from '../../components/MainNavBar/mainNavBar';

function Corner() {
    const dispatch = useDispatch();

    const movieState = useSelector(movieCornerSelector);
    const [value, setValue] = useState('0');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        //   setCurrentURL(window.location.pathname);
        // console.log(currentURL);

        if (window.location.pathname.includes('/corner/people')) {
            setValue('1');
        } else {
            setValue('0');
        }
    }, [window.location.pathname]);

    useEffect(() => {
        if (movieState.chosenType === undefined) dispatch(movieCornerSlice.actions.setChosenType);
    }, [window.location.pathname]);

    const tabTheme = createTheme({
        palette: {
            primary: red,
        },
    });

    return (
        <div className="box-container">
            <Helmet>
                <title>Cimena Corner</title>
            </Helmet>
            <MainNavBar />
            <ThemeProvider theme={tabTheme}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} centered>
                                {
                                    movieState.chosenType !== undefined
                                        ? <Tab
                                            label="MOVIES"
                                            value="0"
                                            component={Link}
                                            to={`/corner/movie/${movieState.chosenType}`}
                                            sx={{ color: '#fff' }}
                                        />
                                        : <Tab
                                            label="MOVIES"
                                            value="0"
                                            component={Link}
                                            to="/corner/movie/popular"
                                            sx={{ color: '#fff' }}
                                        />
                                }

                                <Tab
                                    label="PEOPLE"
                                    value="1"
                                    component={Link}
                                    to="/corner/people"
                                    sx={{ color: '#fff' }}
                                />
                            </TabList>
                        </Box>

                        <TabPanel value="0">
                            <FilmCorner />
                        </TabPanel>

                        <TabPanel value="1">
                            <CastCorner />
                        </TabPanel>
                    </TabContext>
                </Box>
            </ThemeProvider>
        </div>

    );
}

export default Corner;
