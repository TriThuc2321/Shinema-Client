/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Logo from '../../../assets/logo.png';
import Loading from '../../Loading/loading';
import { styles } from './styles';
import { Success, Error } from '../../Alert/alert';

// eslint-disable-next-line import/no-cycle
import { CustomFillButton, CustomOutlineButton } from '../../index';
import AccountApi from '../../../api/accountApi';
import { staffSlice } from '../../../redux/slices/staffSlice';

export const createData = (staff) => {
    const { email } = staff;
    const { contact } = staff;
    const { name } = staff;
    const { address } = staff;
    const { gender } = staff;
    const { birthday } = staff;
    return {
        email,
        name,
        contact,
        gender,
        address,
        birthday,
    };
};

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{ backgroundColor: '#d7e1fc' }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    {row.name}
                </TableCell>
                <TableCell align="left">{row.rank}</TableCell>
                <TableCell align="left" style={{ fontStyle: 'italic' }}>
                    {row.email}
                </TableCell>
                <TableCell align="left" style={{ fontStyle: 'italic' }}>
                    {row.contact}
                </TableCell>
                <TableCell align="center">
                    {row.gender === 'male' ? (
                        <MaleIcon style={{ color: '#180c75' }} />
                    ) : (
                        <FemaleIcon style={{ color: '#ba0666' }} />
                    )}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1, ml: 8, p: 2 }}>
                            <Typography
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                                style={{ color: 'red', fontWeight: 'bold' }}
                            >
                                Staff information:
                            </Typography>

                            <StaffInformation data={row} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        birthday: PropTypes.string.isRequired,
    }).isRequired,
};

function StaffInformation(props) {
    const { data } = props;
    const dispatch = useDispatch();

    const handleDelete = async () => {
        // eslint-disable-next-line no-use-before-define
        closeConfirm(true);
        // eslint-disable-next-line no-use-before-define
        setIsLoading(false);
        await AccountApi.deleteByEmail(data.email)
            .then(() => {
                dispatch(staffSlice.actions.deleteStaff(data._id));
                setUpdateSucceeded({
                    status: true,
                    message: 'Delete staff successfully!',
                });
            })
            .catch((error) => {
                console.log(error);
                setErrorNotification({
                    status: true,
                    message: 'Sorry! There are something wrong with your request',
                });
            });
        setIsLoading(false);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const openConfirm = () => {
        setCancelConfirm(true);
    };
    const closeConfirm = () => {
        setCancelConfirm(false);
    };

    const [updateSucceeded, setUpdateSucceeded] = useState({
        status: false,
        message: '',
    });

    const [errorNotification, setErrorNotification] = useState({
        status: false,
        message: '',
        display: false,
    });
    const navigate = useNavigate();
    return (
        <Box sx={{}}>
            <Grid container spacing={2}>
                <Grid item container xs={5}>
                    <Box textAlign="center">
                        {data.avatar === '' ? (
                            <img src={Logo} style={styles.avatar} />
                        ) : (
                            <img src={data.avatar} style={styles.avatar} />
                        )}
                    </Box>
                </Grid>

                <Grid item container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', p: 2 }} xs={7}>
                    <Grid xs={1} rowSpacing={2} item>
                        <PersonIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Name: </Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.name}</Typography>
                    </Grid>

                    <Grid xs={1} item>
                        <EmailIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Email:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.email}</Typography>
                    </Grid>
                    <Grid xs={1} item>
                        <PhoneIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Phone:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.contact}</Typography>
                    </Grid>

                    <Grid item xs={1}>
                        <HomeIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Address:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.address}</Typography>
                    </Grid>

                    <Grid xs={1} item>
                        <PersonIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Gender:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.gender}</Typography>
                    </Grid>

                    <Grid xs={1} item>
                        <CakeIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Birthday:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.birthday}</Typography>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Box textAlign="center">
                        <CustomOutlineButton
                            onClick={() => {
                                navigate(`/manager/staff/edit/${data._id}`);
                            }}
                        >
                            Modify
                        </CustomOutlineButton>
                        <CustomFillButton variant="contained" onClick={openConfirm}>
                            Delete
                        </CustomFillButton>
                    </Box>
                </Grid>

                <Dialog open={cancelConfirm}>
                    <DialogTitle>Are you sure to remove this staff?</DialogTitle>
                    <Button
                        onClick={closeConfirm}
                        style={{
                            alignSelf: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '15px',
                            border: '1px solid red',
                            /// backgroundColor: 'red',
                            color: 'red',
                            fontSize: '13px',
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            padding: '12px 45px',
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleDelete}
                        style={{
                            alignSelf: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '15px',
                            border: '1px solid red',
                            backgroundColor: 'red',
                            color: 'white',
                            fontSize: '13px',
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            padding: '12px 45px',
                        }}
                    >
                        Yes
                    </Button>
                </Dialog>
            </Grid>

            {updateSucceeded.status && <Success message={updateSucceeded.message} status={updateSucceeded.status} />}
            {errorNotification.status && (
                <Error message={errorNotification.message} status={errorNotification.status} />
            )}

            {isLoading && <Loading />}
        </Box>
    );
}

export default Row;
