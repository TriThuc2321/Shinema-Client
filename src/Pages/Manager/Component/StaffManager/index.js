/* eslint-disable import/no-cycle */
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import EditStaff from './editStaff/index';
import NewStaff from './newStaff/index';
import DisplayStaff from './displayStaff/index';

export function StaffManager() {
    return (
        <div>
            <Routes>
                <Route path="manager/staff/" element={<DisplayStaff />} />
                <Route path="manager/staff/add" element={<NewStaff />} />
                <Route path="manager/staff/edit/:id" element={<EditStaff />} />
            </Routes>
        </div>
    );
}

export const CustomFillButton = styled(Button)(() => ({
    color: '#fff',
    backgroundColor: red[600],
    '&:hover': {
        backgroundColor: red[700],
    },
    padding: '6px 35px',
    marginLeft: '20px',
    borderRadius: '20px',
}));

export const CustomOutlineButton = styled(Button)(({ theme }) => ({
    color: red[700],
    borderColor: red[700],
    borderWidth: 1,
    borderStyle: 'solid',
    '&:hover': {
        backgroundColor: red[900],
        color: theme.palette.getContrastText(red[900]),
    },
    padding: '6px 35px',
    marginLeft: '20px',
    borderRadius: '20px',
}));
