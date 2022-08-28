import { createSlice } from '@reduxjs/toolkit';
import { movieType } from '../../api/tmdbApi';

const movieCornerSlice = createSlice({
    name: 'corner__movie',
    initialState: {
        search: '',
        type: movieType,
        chosenTypeIndex: '0',
        chosenType: 'popular',
        genres: {},
        chooseGenres: [],
    },
    reducers: {
        searchMovie: (state, action) => {
            state.search = action.payload;
        }, /// type:

        chooseType: (state, action) => {
            switch (action.payload) {
                case 'popular':
                    state.chooseTypeIndex = '0';
                    break;
                case 'now_playing':
                    state.chosenTypeIndex = '1';
                    break;
                case 'top_rated':
                    state.chosenTypeIndex = '2';
                    break;
                case 'upcoming':
                    state.chosenTypeIndex = '3';
                    break;
                default:
                    state.chooseTypeIndex = '0';
                    break;
            }

            state.chosenType = action.payload;
        },

        chooseGenres: (state, action) => {
            state.chooseGenres = action.payload;
        },

        setChosenType: (state, action) => {
            state.chosenType = action.payload;
        },
    },
});

// export const {addMovie, updateMovie, removeMovie} = movieSlice.actions;
// export default movieSlice.reducer;
export default movieCornerSlice;
