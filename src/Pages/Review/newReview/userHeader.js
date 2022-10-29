import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

function UserHeader() {
    const user = useSelector((state) => state.users.instance);
    const [backgroundColorAvatar, setBackgroundColorAvatar] = useState('#FF4820');
    useEffect(() => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBackgroundColorAvatar(randomColor);
    }, []);

    return (
        <Stack direction="row" sx={{ marginY: 1.5 }}>
            <Avatar sx={{ bgcolor: backgroundColorAvatar }}>{user.name.charAt(0)}</Avatar>
            <Stack sx={{ marginLeft: 2 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                <Typography sx={{ fontSize: 12 }}>{user.email}</Typography>
            </Stack>
        </Stack>
    );
}
export default UserHeader;
