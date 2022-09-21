import { ManagerHeader } from '../Components';

function ManagerLayout({ children }) {
    return (
        <div>
            <ManagerHeader />
            <div>{children}</div>
        </div>
    );
}

export default ManagerLayout;
