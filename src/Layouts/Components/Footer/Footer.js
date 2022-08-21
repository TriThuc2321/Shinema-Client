import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('container')}>
            <p>19522321@gm.uit.edu.vn</p>
            <p>Tran Tri Thuc</p>
        </div>
    );
}

export default Footer;
