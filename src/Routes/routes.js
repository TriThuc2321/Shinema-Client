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
    Review,
} from '~/Pages';
import { DetailPageLayout, ManagerLayout } from '~/Layouts';
import routes from '~/Configs/routes';

export const guest = [
    { path: routes.home, component: Home },
    { path: routes.login, component: Login, layout: null },
    { path: routes.register, component: Register, layout: null },
    { path: routes.corner.movies_search, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.movies_type, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.people, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.people_search, component: Corner, layout: DetailPageLayout },
    { path: routes.people_details, component: PeopleDetails, layout: DetailPageLayout },
    { path: routes.film_details, component: FilmDetails, layout: DetailPageLayout },
    { path: routes.people_details_search, component: PeopleDetails, layout: DetailPageLayout },
];

export const admin = [
    { path: routes.home, component: Manager, layout: ManagerLayout },
    { path: routes.login, component: Login, layout: null },
    { path: routes.register, component: Register, layout: null },
];

export const staff = [
    { path: routes.home, component: Manager, layout: ManagerLayout },
    { path: routes.login, component: Login, layout: null },
    { path: routes.register, component: Register, layout: null },
];

export const censor = [
    { path: routes.home, component: Review, layout: null },
    { path: routes.login, component: Login, layout: null },
    { path: routes.register, component: Register, layout: null },
];

export const customer = [
    { path: routes.home, component: Home },
    { path: routes.login, component: Login, layout: null },
    { path: routes.register, component: Register, layout: null },
    { path: routes.corner.movies_search, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.movies_type, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.people, component: Corner, layout: DetailPageLayout },
    { path: routes.corner.people_search, component: Corner, layout: DetailPageLayout },
    { path: routes.people_details, component: PeopleDetails, layout: DetailPageLayout },
    { path: routes.film_details, component: FilmDetails, layout: DetailPageLayout },
    { path: routes.people_details_search, component: PeopleDetails, layout: DetailPageLayout },
    { path: routes.transactions, component: TransactionHistory, layout: DetailPageLayout },
    { path: routes.bookingSlice, component: Booking, layout: DetailPageLayout },
];
