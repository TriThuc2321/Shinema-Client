import Footer from '../Components/Footer/Footer';
import { HomeHeader } from '../Components';

function DefaultLayout({ children }) {
    return (
        <div>
            <HomeHeader />
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
