import { configureStore } from '@reduxjs/toolkit';

import movieSlice from './slices/movieSlice';
import userSlice from './slices/userSlice';
import showTimeSlice from './slices/showTimeSlice';
import theaterSlice from './slices/theaterSlice';
import movieCornerSlice from './slices/movieCornerSlice';
import bookingSlice from './slices/bookingSlice';
import { staffSlice } from './slices/staffSlice';
import { ticketSlice } from './slices/ticketSlice';
import reviewSlice from './slices/reviewSlice';

const Store = configureStore({
    reducer: {
        movies: movieSlice.reducer,
        users: userSlice.reducer,
        showTimes: showTimeSlice.reducer,
        theaters: theaterSlice.reducer,
        corner__movie: movieCornerSlice.reducer,
        booking: bookingSlice.reducer,
        staff: staffSlice.reducer,
        ticket: ticketSlice.reducer,
        review: reviewSlice.reducer,
    },
});

export default Store;
