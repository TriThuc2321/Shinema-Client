/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */
/* eslint-disable prefer-template */
import React, { useState, useEffect } from 'react';
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
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';

import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styles } from './style';

import tmdbApi, { category } from '~/Api/tmdbApi';
import { subDate } from '~/Utils';
import TheaterApi from '~/Api/theaterApi';

import { ticketSlice } from '~/Redux/slices/ticketSlice';
import { currentCancelTicket } from '~/Redux/selector';
import TicketApi from '~/Api/ticketApi';
import { Success, Error } from '~/Components/Alert';
import Loading from '~/Components/Loading';
import apiConfig from '~/Api/apiConfig';
import emailApi from '~/Api/emailApi';

export const createData = (ticket) => {
    const id = ticket._id;
    const filmId = ticket._filmId;
    const theaterId = ticket._theaterId;
    const roomId = ticket._roomId;
    const { seatIdArray } = ticket;
    const { dateOccur } = ticket;
    const { timeOccur } = ticket;
    const { bookedTime } = ticket;
    const { invoice } = ticket;
    return {
        id,
        filmId,
        theaterId,
        roomId,
        seatIdArray,
        dateOccur,
        timeOccur,
        bookedTime,
        invoice,
    };
};

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const [theater, setTheater] = React.useState({});
    const [movie, setMovie] = React.useState({});
    const [ticket, setTicket] = React.useState(row);

    // const ticketArr = useSelector(currentTicketList);
    // const [_currentTicketList, setCurrentTicketList] = React.useState(ticketArr);

    const ticketCancel = useSelector(currentCancelTicket);

    const [status, setStatus] = useState({
        note: 'Pending',
        color: '#ad9403',
    });

    useEffect(() => {
        if (ticket.isCancelled) {
            if (movie != null || movie !== undefined) {
                const day = new Date().getDate();
                const month = new Date().getMonth();
                const year = new Date().getFullYear();

                const current = month + '/' + day + '/' + year;

                console.log(ticket.isCancelled);
                if (ticket.isCancelled) {
                    setStatus({
                        note: 'Cancelled',
                        color: 'red',
                    });
                } else if (subDate(row.dateOccur, current) < 1)
                    setStatus({
                        note: 'Was shown',
                        color: '#084d08',
                    });
            }
        }
    }, [ticket]);

    useEffect(() => {
        if (ticketCancel._id === row._id) {
            const object = ticketCancel;
            setTicket(object);
        }
    }, [ticketCancel]);

    // useEffect(() => {
    //   setCurrentTicketList(ticketArr)
    // }, [ticketArr])

    useEffect(() => {
        const getMovie = async () => {
            const params = {};

            try {
                const response = await tmdbApi.detail(category.movie, row._filmId, { params });
                setMovie(response);
            } catch (err) {
                console.log(err);
            }
        };

        getMovie();
    }, []);

    useEffect(() => {
        const getTheaters = async () => {
            await TheaterApi.getById(row._theaterId)
                .then((res) => setTheater(res.data))
                .catch((err) => console.log(err));
        };

        getTheaters();
    }, []);

    useEffect(() => {
        if (movie != null || movie !== undefined) {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            const current = month + '/' + day + '/' + year;

            if (row.isCancelled) {
                setStatus({
                    note: 'Cancelled',
                    color: 'red',
                });
            } else if (subDate(row.dateOccur, current) < 1)
                setStatus({
                    note: 'Was shown',
                    color: '#084d08',
                });
        }
    }, []);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{ backgroundColor: '#d7e1fc' }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>
                    {movie.title}
                </TableCell>
                <TableCell component="th" scope="row" style={{ fontStyle: 'italic' }}>
                    {ticket.bookedTime}
                </TableCell>
                <TableCell align="left" style={{}}>
                    {theater.name}
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {ticket.invoice.total}$
                </TableCell>
                <TableCell align="center">
                    {row.invoice.method === 'Cash' ? (
                        <LocalAtmIcon style={{ color: '#0c8243', fontSize: 30 }} />
                    ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                            }}
                            src="https://admin.money24h.vn/wp-content/uploads/2022/03/paypal-la-gi.jpg"
                        />
                    )}
                </TableCell>
                <TableCell align="center">
                    <Typography variant="subtitle2" style={{ color: status.color }}>
                        {status.note}
                    </Typography>
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
                                style={{ color: 'blue', fontWeight: 'bold' }}
                            >
                                Ticket information:
                            </Typography>

                            <TicketInformation data={ticket} theater={theater} movie={movie} />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     contact: PropTypes.string.isRequired,
//     address: PropTypes.string.isRequired,
//     //gender: PropTypes.string.isRequired,
//     birthday: PropTypes.string.isRequired,

//   }).isRequired,
// };

function TicketInformation(props) {
    const { data } = props;
    const { theater } = props;
    const { movie } = props;

    const dispatch = useDispatch();

    const [updateSucceeded, setUpdateSucceeded] = useState({
        status: false,
        message: '',
    });

    const [errorNotification, setErrorNotification] = useState({
        status: false,
        message: '',
        display: false,
    });

    const [isLoading] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const openConfirm = () => {
        setCancelConfirm(true);
    };
    const closeConfirm = () => {
        setCancelConfirm(false);
    };

    const navigate = useNavigate();

    const openDetailFilm = () => {
        navigate('/filmDetails/' + movie.id);
    };

    const [cancelable, setCancelable] = useState({
        flag: true,
        note: '',
    });

    useEffect(() => {
        const checkAbleToCancel = () => {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            const current = month + '/' + day + '/' + year;

            if (subDate(data.dateOccur, current) < 1)
                setCancelable({
                    flag: false,
                    note: 'You cannot cancel this ticket before it shown 1 day',
                });

            if (data.invoice.method === 'Paypal') {
                setCancelable({
                    flag: false,
                    note: 'You can not cancel this order which is paid by PayPal',
                });
            }

            if (data.isCancelled) {
                setCancelable({
                    flag: false,
                    note: 'You have cancelled this ticket',
                });
            }
        };

        checkAbleToCancel();
    }, []);

    const cancelTicket = async () => {
        closeConfirm();
        await TicketApi.update({ ...data, isCancelled: true })
            .then(() => {
                dispatch(ticketSlice.actions.cancelTicket(data._id));
                setUpdateSucceeded({
                    status: true,
                    message: 'Cancel ticket successfully!',
                });

                emailApi
                    .sendVerify({
                        to: data._userEmail,
                        subject: 'Cancelling ticket',
                        text:
                            'You have just cancelled this ticket which has these information below:  \n' +
                            `Name: ${data.name} \n` +
                            `Phone: ${data.contact} \n` +
                            // `COD Address: ${bigAddress}` + "\n" +
                            '-------------------------------------------------------- \n' +
                            `Movie: ${movie.title} \n` +
                            `Theater: ${theater.name + ' - Room: ' + data._roomId} \n` +
                            `Seats: ${data.seatIdArray} \n` +
                            '-------------------------------------------------------- \n' +
                            `Total: ${data.invoice.total} USD` +
                            '\n' +
                            `Method: ${data.invoice.method}` +
                            '\n' +
                            '-------------------------------------------------------- \n' +
                            'Any wondered things. Please contact with our shop with contact below site: shinema.com',
                    })
                    .then(() => {})
                    .catch((err) => console.log(err));

                setCancelable({ note: 'You have cancelled this ticket', flag: false });
            })
            .catch(() => {
                setErrorNotification({
                    status: true,
                    message: 'Sorry! There are something wrong with your request',
                });
            });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={6} sx={{ p: 2 }}>
                {/* ShowTime Information */}
                <Grid item container spacing={2} xs={7}>
                    <Grid xs={1} rowSpacing={2} item>
                        <Grid3x3Icon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Ticket ID: </Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data._id.toUpperCase()}</Typography>
                    </Grid>

                    <Grid xs={1} item>
                        <PlaceIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Place:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>
                            {theater.name} ({theater.address}) - Room {data._roomId}
                        </Typography>
                    </Grid>

                    <Grid xs={12} item>
                        <Box sx={{ height: '1px', backgroundColor: 'black' }} />
                    </Grid>

                    <Grid xs={1} item>
                        <PersonIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography style={styles.title}>Name: </Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography style={styles.item}>{data.name}</Typography>
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

                    <Grid xs={1} item>
                        <HomeIcon style={styles.icon} />
                    </Grid>
                    <Grid xs={4} item>
                        <Typography sx={styles.title}>Address:</Typography>
                    </Grid>
                    <Grid xs={7} item>
                        <Typography sx={styles.item}>{data.address}</Typography>
                    </Grid>
                </Grid>

                {/* Invoice Information */}
                <Grid item container spacing={2} xs={5}>
                    <Grid item container xs={12}>
                        <Grid item xs={5}>
                            <div
                                className="poster"
                                style={{
                                    backgroundImage: `url(${apiConfig.originalImage(movie.poster_path)})`,
                                    width: '100%',
                                    height: '100%',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    cursor: 'pointer',
                                }}
                                onClick={openDetailFilm}
                            />
                        </Grid>

                        <Grid item xs={7} sx={{ backgroundColor: '#ededed' }}>
                            <Stack direction="column" sx={{ pl: 1.5, pt: 1.5, pr: 1, pb: 1.5 }}>
                                <Typography
                                    variant="h5"
                                    style={{ fontWeight: 'bold', p: 2, color: 'black', mt: 2, cursor: 'pointer' }}
                                    onClick={openDetailFilm}
                                >
                                    {movie.title}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{ fontWeight: 'bold', color: 'black', p: 2, mt: 2 }}
                                >
                                    Price: {theater.price}$
                                </Typography>
                                <Typography variant="subtitle2" style={{ color: 'black', p: 2, fontWeight: 'bold' }}>
                                    Date - Time: {data.dateOccur} - {data.timeOccur}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{ fontStyle: 'italic', fontWeight: 'bold', p: 2, color: 'black' }}
                                >
                                    Seats:{' '}
                                </Typography>
                                <Stack direction="row" sx={{ pl: 2 }}>
                                    {data.seatIdArray.map((item) => (
                                        <Typography key={item} variant="subtitle2" sx={{ pr: 0.5, color: 'black' }}>
                                            {item}{' '}
                                        </Typography>
                                    ))}
                                </Stack>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'red' }}>
                                    Total: {data.invoice.total}$
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'black' }}>
                                    Method: {data.invoice.method}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Button */}
                {cancelable.flag ? (
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <CustomFillButton onClick={openConfirm}>Cancel this order</CustomFillButton>
                        </Box>

                        <Dialog open={cancelConfirm}>
                            <DialogTitle>Are you sure to cancel this ticket?</DialogTitle>
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
                                onClick={cancelTicket}
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

                        {updateSucceeded.status && (
                            <Success message={updateSucceeded.message} status={updateSucceeded.status} />
                        )}
                        {errorNotification.status && (
                            <Error message={errorNotification.message} status={errorNotification.status} />
                        )}

                        {isLoading && <Loading />}
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <Typography
                                variant="subtitle2"
                                style={{ color: 'red', fontStyle: 'italic', fontWeight: 'bold', p: 2 }}
                            >
                                *{cancelable.note}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
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

export default Row;
