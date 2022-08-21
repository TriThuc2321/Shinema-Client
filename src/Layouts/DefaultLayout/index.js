import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <Sidebar />
            <div>{children}</div>
        </div>
    );
}

export default DefaultLayout;
