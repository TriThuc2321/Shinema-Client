/* eslint-disable no-unused-vars */
// import React, { Component } from 'react'

// export class ChatBot extends Component {
//     componentDidMount() {
//         (function (d, m) {
//             var kommunicateSettings = { "appId": "129a5f06a946fb34d15e7522827422e5", "popupWidget": true, "automaticChatOpenOnNavigation": true };
//             var s = document.createElement("script");
//             s.type = "text/javascript";
//             s.async = true;
//             s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
//             var h = document.getElementsByTagName("head")[0];
//             h.appendChild(s);
//             window.kommunicate = m;
//             m._globals = kommunicateSettings;
//         })(document, window.kommunicate || {});
//     }

//     render() {
//         return (
//             <div></div>
//         )
//     }
// }

// export default ChatBot

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './styles.css';

import Fab from '@mui/material/Fab';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';

import ChatIcon from '@mui/icons-material/Chat';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import TypingAnim from '~/Components/TypingAnim';
import botAvatar from '~/Assets/logo_png.png';
import ChatbotApi from '~/Api/chatbotApi';
import Loading from '~/Components/Loading';
import { FakeApi } from '~/Utils/mock';

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const openFormHandle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="chatbot__container">
            {isOpen ? (
                <FormChat openFormHandle={openFormHandle} />
            ) : (
                <Fab sx={{ color: '#ff4f28' }} aria-label="add" onClick={openFormHandle}>
                    <ChatIcon />
                </Fab>
            )}
        </div>
    );
}

function FormChat({ openFormHandle }) {
    const TYPE_PARAM_KEY = {
        FILM_NAME: 'film_name',
        PERSON_NAME: 'person_name',
        MESSAGE: 'msg',
    };

    let userName = useSelector((state) => state.users.instance.name);
    if (userName == null) {
        userName = ' ';
    } else {
        userName += ' ';
    }

    const today = format(new Date(), 'PP p');
    const initMessage = {
        type: 'bot',
        message: `Hi, ${userName}nice to meet you. I am Alex and I am a virtual assistant of Shenima to help you with your support needs. What are your looking for?`,
        listBtn: [],
        dateTime: today,
    };

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [paramKey, setParamKey] = useState(TYPE_PARAM_KEY.MESSAGE);

    useEffect(async () => {
        await FakeApi();
        setMessages([initMessage]);
        setLoading(false);
    }, []);

    const navigate = useNavigate();
    const sendMessageHandle = (text) => {
        if (text === '') return;
        const currentTime = new Date();
        const dateFormat = format(currentTime, 'PP p');
        const messageObj = {
            type: 'user',
            message: text,
            listBtn: [],
            dateTime: dateFormat,
        };
        setMessages([...messages, messageObj]);
        const messageTemp = [...messages, messageObj];

        setLoading(true);
        ChatbotApi.send(paramKey, text)
            .then((res) => {
                if (res.status === 200) {
                    let botMessageObj = {};
                    const { tag, message } = res.data;
                    let sendMessage = '';
                    if (paramKey === TYPE_PARAM_KEY.FILM_NAME) {
                        navigate(`/corner/movie/search/${message}`);
                        sendMessage = `You will be automatically redirected to the search page for the movie name contains keyword ${message}.`;
                        setParamKey(TYPE_PARAM_KEY.MESSAGE);
                    } else if (paramKey === TYPE_PARAM_KEY.PERSON_NAME) {
                        navigate(`/corner/people/search/${message}`);
                        sendMessage = `You will be automatically redirected to the search page for the person whose name contains keword ${message}.`;
                        setParamKey(TYPE_PARAM_KEY.MESSAGE);
                    } else if (tag === 'detail_film') {
                        setParamKey(TYPE_PARAM_KEY.FILM_NAME);
                        sendMessage = message;
                    } else if (tag === 'detail_actor') {
                        setParamKey(TYPE_PARAM_KEY.PERSON_NAME);
                        sendMessage = message;
                    } else if (tag === 'popular' || tag === 'upcoming' || tag === 'top_rated') {
                        navigate(`/corner/movie/${tag}`);
                        sendMessage = message;
                    } else {
                        sendMessage = message;
                    }

                    const curTime = new Date();
                    const daFormat = format(curTime, 'PP p');
                    botMessageObj = {
                        type: 'bot',
                        message: sendMessage,
                        listBtn: [],
                        dateTime: daFormat,
                    };
                    setMessages([...messageTemp, botMessageObj]);
                    setLoading(false);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="form__container">
            <Header openFormHandle={openFormHandle} />
            <MessList messages={messages} loading={loading} />
            <SendBox sendMessageHandle={sendMessageHandle} />
        </div>
    );
}

function Header({ openFormHandle }) {
    return (
        <div className="form__header">
            <div className="form__header__bot">
                <Avatar alt="Remy Sharp" src={botAvatar} />
                <div>
                    <p>Alex bot</p>
                    <p style={{ fontSize: 13, marginTop: 2 }}>Online</p>
                </div>
            </div>

            <IconButton onClick={openFormHandle} sx={{ color: '#fff' }}>
                <CloseRoundedIcon />
            </IconButton>
        </div>
    );
}

function MessList({ messages, loading }) {
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    return (
        <div className="form__messList">
            {messages ? (
                <div>
                    {messages.map((item, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <MessageItem key={i} item={item} />
                    ))}

                    {loading && <TypingAnim style={{ height: 100 }} />}
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

function MessageItem({ item }) {
    return (
        <div>
            {item.type === 'bot' ? (
                <div className="form__messList__item">
                    <Avatar alt="Remy Sharp" src={botAvatar} />
                    <div className="form__messList__item__text">
                        <p>Alex</p>
                        <p className="form__messList__item__message">{item.message}</p>
                        <p>{item.dateTime}</p>
                    </div>
                </div>
            ) : (
                <div className="form__messList__item">
                    <div className="form__messList__item__text form__messList__item__text--right">
                        <p className="form__messList__item__message form__messList__item__message--right">
                            {item.message}
                        </p>
                        <p>{item.dateTime}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function SendBox({ sendMessageHandle }) {
    const [message, setMessage] = useState('');

    return (
        <div className="form__sendBox">
            <OutlinedInput
                placeholder="Type your message..."
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        sendMessageHandle(message);
                        setMessage('');
                    }
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ fontSize: 15, width: 'stretch', height: 45, borderRadius: 6, margin: 1 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => {
                                sendMessageHandle(message);
                                setMessage('');
                            }}
                            edge="end"
                            sx={{ color: '#ff4f28', marginRight: 0.3 }}
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </div>
    );
}

export default ChatBot;
