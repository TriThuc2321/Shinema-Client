import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
    return (
        <div
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <CircularProgress />
        </div>
    );
}

export default Loading;
