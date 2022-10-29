import * as React from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

function TooltipCustom({ item }) {
    const positionRef = React.useRef({
        x: 0,
        y: 0,
    });

    const popperRef = React.useRef(null);
    const areaRef = React.useRef(null);

    const handleMouseMove = (event) => {
        positionRef.current = { x: event.clientX, y: event.clientY };

        if (popperRef.current != null) {
            popperRef.current.update();
        }
    };
    return (
        <Tooltip
            title={item.title}
            placement="bottom"
            arrow
            PopperProps={{
                popperRef,
                anchorEl: {
                    getBoundingClientRect: () =>
                        // eslint-disable-next-line max-len, implicit-arrow-linebreak
                        new DOMRect(positionRef.current.x, areaRef.current.getBoundingClientRect().y + 30, 0, 0),
                },
            }}
        >
            <Box ref={areaRef} onMouseMove={handleMouseMove}>
                <a href={item.link}>{item.icon}</a>
            </Box>
        </Tooltip>
    );
}

export default TooltipCustom;
