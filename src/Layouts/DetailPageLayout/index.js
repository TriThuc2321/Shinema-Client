import Footer from '../Components/Footer/Footer';
import { DetailHeader } from '../Components';
// import Chatbot from '~/Components/Chatbot';

function DetailPageLayout({ children }) {
    return (
        <div>
            <DetailHeader />
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default DetailPageLayout;
