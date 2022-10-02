/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import OutlinedInput from '@mui/material/OutlinedInput';

import { styled } from '@mui/material/styles';
import format from 'date-fns/format';

import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PublicOffRoundedIcon from '@mui/icons-material/PublicOffRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import reviewSlice from '~/Redux/slices/reviewSlice';
import ReviewApi from '~/Api/reviewApi';
import AccountApi from '~/Api/accountApi';

function Content({ item }) {
    return (
        <Stack sx={{ margin: '0 160px', paddingBottom: '20px' }}>
            <Header userId={item._userId} reviewItem={item} />

            <Typography variant="h3" sx={{ marginTop: '10px' }}>
                {item.title}
            </Typography>
            <Typography sx={{ fontWeight: 'lighter' }}>{item.description}</Typography>

            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', fontSize: '23px' }}>Plot</Typography>
            <Typography sx={{ fontWeight: 'lighter' }}>{item.plot}</Typography>

            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', fontSize: '23px' }}>Advantage</Typography>
            <Typography sx={{ fontWeight: 'lighter' }}>{item.advantage}</Typography>

            <Typography sx={{ fontWeight: 'bold', marginTop: '10px', fontSize: '23px' }}>Defect</Typography>
            <Typography sx={{ fontWeight: '1' }}>{item.defect}</Typography>

            <Typography sx={{ fontWeight: 'bold', marginTop: '10px', fontSize: '23px' }}>Overview</Typography>
            <Typography>{item.overview}</Typography>

            <Comment data={item.listComments} />
        </Stack>
    );
}

function Header({ userId, reviewItem }) {
    const censor = useSelector((state) => state.users.instance);
    const [backgroundColorAvatar, setBackgroundColorAvatar] = useState('#FF4820');
    useEffect(() => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBackgroundColorAvatar(randomColor);
    }, []);

    const [user, setUser] = useState();
    useEffect(() => {
        const getUser = () => {
            AccountApi.getById(userId)
                .then((res) => {
                    if (res.status === 200) {
                        setUser(res.data);
                    }
                })
                .catch((err) => console.log(err));
        };
        getUser();
    }, []);

    return (
        <div>
            {user && (
                <Stack direction="row" sx={{ marginY: 1.5, justifyContent: 'space-between' }}>
                    <Stack direction="row">
                        <Avatar sx={{ bgcolor: backgroundColorAvatar }}>{user.name.charAt(0)}</Avatar>
                        <Stack sx={{ marginLeft: 2 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                            <Typography sx={{ fontSize: 12 }}>{reviewItem.time}</Typography>
                        </Stack>
                    </Stack>

                    {censor.rank === 'Censor' && <ChangeStatusHandle />}
                </Stack>
            )}
        </div>
    );
}

function ChangeStatusHandle() {
    const status = useSelector((state) => state.review.current.status);
    const reviewId = useSelector((state) => state.review.current._id);
    const censorId = useSelector((state) => state.users.instance._id);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [statusConfirm, setStatusConfirm] = useState();

    const handleClickOpen = (type) => {
        if (type === 'Inspected') {
            setMessage('Are you sure to uninspect this review?');
            setStatusConfirm('Uninspected');
        } else {
            setMessage('Are you sure to inspect this review?');
            setStatusConfirm('Inspected');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = () => {
        const reviewObj = {
            _id: reviewId,
            status: statusConfirm,
            _censorId: censorId,
        };

        ReviewApi.update(reviewObj)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(reviewSlice.actions.updateCurrentStatus(statusConfirm));
                }
            })
            .catch((err) => console.log(err));

        setOpen(false);
    };

    return (
        <Stack>
            {status === 'Inspected' && (
                <InspectedButton
                    variant="contained"
                    endIcon={<PublicRoundedIcon />}
                    onClick={() => handleClickOpen('Inspected')}
                >
                    Inspected
                </InspectedButton>
            )}

            {status === 'Uninspected' && (
                <UninspectedButton
                    variant="contained"
                    endIcon={<PublicOffRoundedIcon />}
                    onClick={() => handleClickOpen('Uninspected')}
                >
                    Uninspected
                </UninspectedButton>
            )}

            {status === 'Inspecting' && (
                <InspectingButton
                    variant="contained"
                    endIcon={<DonutLargeRoundedIcon />}
                    onClick={() => handleClickOpen('Inspecting')}
                >
                    Inspecting
                </InspectingButton>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm status</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
function Comment({ data }) {
    return (
        <Stack
            sx={{ backgroundColor: 'rgb(23, 32, 48)', marginTop: 5, padding: 2, overflowY: 'scroll', maxHeight: 400 }}
        >
            <SendBox />
            {data && data.map((item, index) => <CmtItem item={item} key={index} />)}
        </Stack>
    );
}

function SendBox() {
    const user = useSelector((state) => state.users.instance);
    const { reviewId } = useParams();
    const dispatch = useDispatch();

    const sendMessageHandle = (text) => {
        const currentTime = new Date();
        const dateFormat = format(currentTime, 'PP p');

        const cmtObj = {
            message: text,
            time: dateFormat,
            _userId: user._id,
            _reviewId: reviewId,
        };

        ReviewApi.insertCmt(cmtObj)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(reviewSlice.actions.insertComment(cmtObj));
                }
            })
            .catch((err) => console.log(err));
    };

    const [message, setMessage] = useState('');

    return (
        <div>
            <OutlinedInput
                placeholder="Comment..."
                value={message}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        sendMessageHandle(message);
                        setMessage('');
                    }
                }}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ fontSize: 15, width: 'stretch', height: 45, borderRadius: 1, color: '#fff', marginBottom: 1 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => {
                                sendMessageHandle(message);
                                setMessage('');
                            }}
                            edge="end"
                            sx={{ color: '#42a5f5', marginRight: 0.3 }}
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </div>
    );
}

function CmtItem({ item }) {
    const [backgroundColorAvatar, setBackgroundColorAvatar] = useState('#FF4820');
    const reviewId = useSelector((state) => state.review.current._id);
    const [user, setUser] = useState();
    const dispatch = useDispatch();
    const userIns = useSelector((state) => state.users.instance);

    useEffect(() => {
        const getUser = () => {
            AccountApi.getById(item._userId)
                .then((res) => {
                    if (res.status === 200) {
                        setUser(res.data);
                    }
                })
                .catch((err) => console.log(err));
        };
        getUser();

        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBackgroundColorAvatar(randomColor);
    }, [item]);

    const deleteHandle = () => {
        ReviewApi.deleteCmt(reviewId, item.id).then((res) => {
            if (res.status === 200) {
                dispatch(reviewSlice.actions.deleteComment(item.id));
            }
        });
    };

    return (
        <div>
            {user && item && (
                <Stack direction="row" sx={{ marginY: 1.5 }}>
                    <Avatar sx={{ bgcolor: backgroundColorAvatar }}>{user.name.charAt(0)}</Avatar>
                    <Stack>
                        <Stack
                            sx={{ backgroundColor: 'rgb(18, 49, 100)', padding: 1.5, marginLeft: 2, borderRadius: 2 }}
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                            <Typography>{item.message}</Typography>
                        </Stack>

                        <Stack direction="row">
                            {(userIns.rank === 'Censor' || item._userId === userIns._id) && (
                                <DeleteButton variant="text" onClick={() => deleteHandle()}>
                                    Delete
                                </DeleteButton>
                            )}
                            <Typography sx={{ marginLeft: 2, fontSize: 12 }}>{item.time}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            )}
        </div>
    );
}

const DeleteButton = styled(Button)(() => ({
    color: '#fff',
    backgroundColor: 'rgb(23, 32, 48)',
    '&:hover': {
        backgroundColor: 'rgb(23, 32, 48)',
    },
    padding: 0,
    marginLeft: 15,
    fontSize: 11,
}));

const InspectedButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#1b5e20'),
    backgroundColor: '#1b5e20',
    '&:hover': {
        backgroundColor: '#388e3c',
    },
    padding: '6px 15px',
    borderRadius: '10px',
    minWidth: '150px',
}));

const UninspectedButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#b71c1c'),
    backgroundColor: '#b71c1c',
    '&:hover': {
        backgroundColor: '#d32f2f',
    },
    padding: '6px 15px',
    borderRadius: '10px',
    minWidth: '150px',
}));

const InspectingButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#f57f17'),
    backgroundColor: '#f57f17',
    '&:hover': {
        backgroundColor: '#fbc02d',
    },
    padding: '6px 15px',
    borderRadius: '10px',
    minWidth: '150px',
}));

export default Content;
