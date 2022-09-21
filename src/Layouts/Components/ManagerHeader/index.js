import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import userSlice from '~/Redux/slices/userSlice';

function ManagerHeader() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tabTheme = createTheme({
        palette: {
            primary: red,
        },
    });

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
            </ThemeProvider>
        </div>
    );
}

export default ManagerHeader;
