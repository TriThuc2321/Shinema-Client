import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        data: [],
        upcoming: [],
        movie: {},
        listFromReviewSelect: [],
        keywordReview: '',
        selectForReview: {},
    },
    reducers: {
        addMovie: (state, action) => {
            state.data.push(action.payload);
        }, /// type: movie/addMovie

        updateMovie: (state, action) => {
            let updateData = state.data;
            updateData = updateData.map((movie) => {
                if (movie.id === action.payload.id) return action.payload;
                return movie;
            });

            state.data = updateData;
        }, /// type: movie/updateMovie

        removeMovie: (state, action) => {
            const removeMovie = state.data;
            removeMovie.movie = removeMovie.filter((movie) => movie.id !== action.payload.id);
            state.data = removeMovie;
        },

        updateAllUpcoming: (state, action) => {
            state.upcoming = action.payload;
        },

        addUpcoming: (state, action) => {
            const upcoming = state.upcoming.filter((e) => e.id === action.payload.id);
            if (upcoming.length === 0) {
                state.upcoming.push(action.payload);
            }
        },
        updateListFromReviewSelect: (state, action) => {
            state.listFromReviewSelect = action.payload;
        },
        updateKeywordReview: (state, action) => {
            state.keywordReview = action.payload;
        },
        updateSelectForReview: (state, action) => {
            state.selectForReview = action.payload;
        },
    },
});

export default movieSlice;

// export const {addMovie, updateMovie, removeMovie} = movieSlice.actions;
// export default movieSlice.reducer;
