import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userSlice from '~/Redux/slices/userSlice';

import { checkLogged } from '~/Utils/auth';
import { getPublicRoutes } from '~/Routes';
import { DefaultLayout } from './Layouts';

function App() {
    const dispatch = useDispatch();
    const [publicRoutes, setPublicRoutes] = useState([]);
    const user = useSelector((state) => state.users);
    useEffect(() => {
        const _checkLogged = async () => {
            const result = await checkLogged();
            dispatch(userSlice.actions.update(result.data));

            const routes = getPublicRoutes(result.data.rank);
            setPublicRoutes(routes);
        };
        _checkLogged();
    }, [user]);

    return (
        <Router>
            <Routes>
                {publicRoutes &&
                    publicRoutes.map((route) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
            </Routes>
        </Router>
    );
}

export default App;
