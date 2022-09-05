import { useEffect, forwardRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export function Error({ message, status }) {
    const [open, setOpen] = useState();
    useEffect(() => {
        setOpen(status);
    }, [status]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export function Warning({ message, status }) {
    const [open, setOpen] = useState();
    useEffect(() => {
        setOpen(status);
    }, [status]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export function Infor({ message, status }) {
    const [open, setOpen] = useState();
    useEffect(() => {
        setOpen(status);
    }, [status]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="infor" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export function Success({ message, status }) {
    const [open, setOpen] = useState();
    useEffect(() => {
        setOpen(status);
    }, [status]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
