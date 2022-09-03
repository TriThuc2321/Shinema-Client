import '../style.css';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import apiConfig from '../../api/apiConfig';
import MainNavBar from '../../components/MainNavBar/mainNavBar';

function Person(props) {
    const { person } = props;
    const [value, setValue] = React.useState(0);
    const [movies, setMovies] = useState(props.movies);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tabTheme = createTheme({
        palette: {
            primary: red,
        },
    });

    return (
        <>
            <Helmet>
                <title>
                    {person.name}
                </title>
            </Helmet>

            <MainNavBar />
            <div className="person-detail">
                <div
                    className="person-detail__avatar"
                    style={{ backgroundImage: `url(${apiConfig.originalImage(person.profile_path)})` }}
                />
                <div className="person-detail__general-info">
                    <div className="person-detail__general-info__name">{person.name}</div>

                    <div className="person-detail__general-info__department">{person.known_for_department}</div>

                    <div className="person-detail__general-info__other-name">
                        <div className="general-title">Other name:</div>
                        <div className="general-content">{person.also_known_as[0]}</div>
                    </div>

                    <div className="person-detail__general-info__birthday">
                        <div className="general-title">Birthday:</div>
                        <div className="general-content">{person.birthday}</div>
                    </div>

                    <div className="person-detail__general-info__place-of-birth">
                        <div className="general-title">Birthplace:</div>
                        <div className="general-content">{person.place_of_birth}</div>
                    </div>
                </div>

            </div>

            <ThemeProvider theme={tabTheme}>
                <Box
                    sx={{ width: '80%', typography: 'body1', marginLeft: '50px' }}
                    className="box"
                >
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab
                                    label="INTRODUCE"
                                    value={0}
                                    sx={{ color: '#fff', fontSize: '40' }}
                                />

                                <Tab
                                    label="MOVIES"
                                    value={1}
                                    sx={{ color: '#fff' }}
                                />
                            </TabList>
                        </Box>

                        <TabPanel value={0}>
                            <div className="person-detail__bio">
                                {/* <div className="person-detail__intro">Giới thiệu</div> */}
                                <div className="person-detail__bio__content">{person.biography}</div>
                            </div>
                        </TabPanel>

                        <TabPanel value={1}>
                            {movies.length !== 0
                                ? (
                                    <div className="movies-list">
                                        {
                                            movies.map((item) => (
                                                <SlideItem item={item} key={item._id} />
                                            ))
                                        }
                                    </div>
                                )
                                : (
                                    <div className="movies-list__updating">Updating...</div>
                                )}
                        </TabPanel>
                    </TabContext>
                </Box>
            </ThemeProvider>
        </>
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
        <div className="item__container" onClick={GoToDetails}>
            <img className="item__container__img" src={background} alt={item.original_title} />
            <div className="item__container__title">{item.original_title}</div>
            <br />
            <div className="item__container__character">{item.character}</div>
        </div>
    );
}

export default Person;
