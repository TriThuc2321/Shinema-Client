import React from 'react';
import { BiError } from 'react-icons/bi';

function Message(props) {
    const { message } = props;
    const { type } = props;

    return (
        <div className="login__form__message" style={{ color: type === 'err' ? 'rgb(192, 7, 7)' : '#e9be00' }}>
            <BiError size={15} />
            <p>{message}</p>
        </div>
    );
}

export default Message;
