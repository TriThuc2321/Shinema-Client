/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import Box from '@mui/material/Box';
import styles from './styles';

import TheaterRoom from './TheaterRoom/index';

function TheaterManagerItem({ item }) {
    return (
        <Box sx={styles.boxContainer}>
            <h2 style={styles.text}>{item.name}</h2>
            <p style={styles.text}>{item.address}</p>
            <p style={styles.text}>Contact: {item.contact}</p>

            {item.listRoom.map((i) => (
                <TheaterRoom key={i} item={i} />
            ))}
        </Box>
    );
}
export default TheaterManagerItem;
