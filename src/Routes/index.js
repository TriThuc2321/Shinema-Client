import { DetailPageLayout } from '~/Layouts';
import { Home, Login, Corner, PeopleDetails, FilmDetails, TransactionHistory, Booking } from '../Pages';
import config from '~/Configs';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: DetailPageLayout },
    { path: config.routes.corner.movies_search, component: Corner },
    { path: config.routes.corner.movies_type, component: Corner },
    { path: config.routes.corner.people, component: Corner },
    { path: config.routes.corner.people_search, component: Corner },
    { path: config.routes.people_details, component: PeopleDetails },
    { path: config.routes.film_details, component: FilmDetails },
    { path: config.routes.people_details_search, component: PeopleDetails },
    { path: config.routes.transactions, component: TransactionHistory },
    { path: config.routes.bookingSlice, component: Booking },
];

const privateRoute = [];

export { publicRoutes, privateRoute };
