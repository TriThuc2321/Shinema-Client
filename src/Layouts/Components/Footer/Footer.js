/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './footer.css';

import { Link } from 'react-router-dom';

import { FaTelegramPlane } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { BsTelephoneFill } from 'react-icons/bs';
import Logo from '~/Assets/logo.png';

function Footer() {
    const defaultColor = '#fff';
    return (
        <div className="footer-container">
            <div className="footer-container__introduce">
                <img src={Logo} alt="Shinema" className="footer-container__introduce__logo" />
                <div className="footer-container__introduce__name">Shinema</div>
                <div className="clear" />
                <div className="footer-container__introduce__content">
                    In the past 20 years, film production has been profoundly altered by the impact of rapidly improving
                    digital technology. Most mainstream productions are now shot on digital formats with subsequent
                    processes, such as editing and special effects, undertaken on computers.
                </div>
                <p className="footer-container__introduce__more">
                    <Link to="">More about us</Link>
                </p>
            </div>

            <div className="footer-container__categories">
                <div className="title">CATEGORIES</div>
                <p className="footer-container__categories__item">
                    <Link to="/">Home Page</Link>
                </p>
                <p className="footer-container__categories__item">
                    <Link to="">Services</Link>
                </p>
                <div className="footer-container__categories__item">
                    <Link to="">Privacy</Link>
                </div>
            </div>

            <div className="footer-container__contact">
                <div className="title">CONTACT</div>
                <div className="contact-item">
                    <FaTelegramPlane className="contact-item__icon" size={18} color={defaultColor} />
                    <div className="contact-item__content">University of Information Technology, HCMC</div>
                </div>

                <div className="contact-item">
                    <AiOutlineMail className="contact-item__icon" size={18} color={defaultColor} />
                    <div className="contact-item__content">shinemaapplication@gmail.com</div>
                </div>

                <div className="contact-item">
                    <BsTelephoneFill className="contact-item__icon" size={18} color={defaultColor} />
                    <div className="contact-item__content">038.3303.061</div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
