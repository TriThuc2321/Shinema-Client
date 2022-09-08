/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import { Helmet } from 'react-helmet-async';
import ShowTimeManager from './Component/ShowTimeManager';
import TheaterManager from './Component/TheaterManager';
import Statistics from './Component/Statistics';
import StaffManager from './Component/StaffManager';
import Censor from '../Censor';
// eslint-disable-next-line import/named
import { userSlice } from '~/Redux/slices/userSlice';
import { userSelector } from '~/Redux/selector';

function Manager() {
    const user = useSelector(userSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = () => {
            if (user) {
                if (user.rank !== 'Manager' && user.rank !== 'Admin') {
                    navigate('/');
                }
            }
        };
        checkAuth();
    }, [user]);

    const tabTheme = createTheme({
        palette: {
            primary: red,
        },
    });

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            navigate('/manager/showtime');
        } else if (newValue === 1) {
            navigate('/manage=r/statistic');
        } else if (newValue === 2) {
            navigate('/manager/theater');
        } else if (newValue === 3) {
            navigate('/manager/staff');
        }
    };

    useEffect(() => {
        const path = window.location.pathname;

        if (path.includes('manager/statistic')) {
            setValue(1);
        } else if (path.includes('manager/theater')) {
            setValue(2);
        }
        if (path.includes('manager/staff')) {
            setValue(3);
        }
    }, []);

    const logoutHandle = () => {
        localStorage.setItem('logged', false);
        dispatch(userSlice.actions.update(''));
        navigate('/login');
    };

    return (
        <div>
            <Helmet>
                <title>Data Manager</title>
            </Helmet>

            <ThemeProvider theme={tabTheme}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', margin: 5 }}>
                    <Typography sx={{ color: '#fff', fontSize: 20 }}>MANAGER</Typography>
                    <Button
                        sx={{ paddingX: 2.5, paddingY: 1 }}
                        onClick={() => logoutHandle()}
                        variant="contained"
                        endIcon={<LoginRoundedIcon />}
                    >
                        Logout
                    </Button>
                </Stack>

                {user.rank === 'Censor' ? (
                    <Censor />
                ) : (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 5, marginLeft: 5 }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Show time" {...a11yProps(0)} sx={{ color: '#fff' }} />
                                <Tab label="Statistic" {...a11yProps(1)} sx={{ color: '#fff' }} />
                                <Tab label="Theater" {...a11yProps(2)} sx={{ color: '#fff' }} />
                                <Tab label="Staff" {...a11yProps(3)} sx={{ color: '#fff' }} />
                            </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                            <ShowTimeManager />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Statistics />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <TheaterManager />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <StaffManager />
                        </TabPanel>
                    </Box>
                )}
            </ThemeProvider>
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    // eslint-disable-next-line react/require-default-props
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default Manager;
