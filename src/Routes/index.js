import {
    Home,
    Login,
    Register,
    Corner,
    PeopleDetails,
    FilmDetails,
    TransactionHistory,
    Booking,
    Manager,
} from '~/Pages';
import { DetailPageLayout } from '~/Layouts';
import config from '~/Configs';

const getPublicRoutes = (role) => {
    const publicRoutes = [
        { path: config.routes.home, component: role === 'Admin' || role === 'Staff' ? Manager : Home },
        { path: config.routes.login, component: Login, layout: null },
        { path: config.routes.register, component: Register, layout: null },
        { path: config.routes.corner.movies_search, component: Corner, layout: DetailPageLayout },
        { path: config.routes.corner.movies_type, component: Corner, layout: DetailPageLayout },
        { path: config.routes.corner.people, component: Corner, layout: DetailPageLayout },
        { path: config.routes.corner.people_search, component: Corner, layout: DetailPageLayout },
        { path: config.routes.people_details, component: PeopleDetails, layout: DetailPageLayout },
        { path: config.routes.film_details, component: FilmDetails, layout: DetailPageLayout },
        { path: config.routes.people_details_search, component: PeopleDetails, layout: DetailPageLayout },
        { path: config.routes.transactions, component: TransactionHistory, layout: DetailPageLayout },
        { path: config.routes.bookingSlice, component: Booking, layout: DetailPageLayout },
    ];
    return publicRoutes;
};

const privateRoute = [];

export { getPublicRoutes, privateRoute };
