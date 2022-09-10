const routes = {
    home: '/',
    login: '/login',
    profile: '/profile',
    corner: {
        movies_search: '/corner/movie/search/:keyword',
        movies_type: '/corner/movie/:type',
        people: '/corner/people',
        people_search: '/corner/people/search/:keyword',
    },
    people_details: '/peopleDetails/:id',
    film_details: '/filmDetails/:id',
    transactions: '/transactions',
    booking: '/booking/:id',
};

export default routes;
