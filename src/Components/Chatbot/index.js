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
import botAvatar from '~/Assets/bot_avatar.png';
import ChatbotApi from '~/Api/chatbotApi';
import Loading from '~/Components/Loading';

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
                <Fab color="primary" aria-label="add" onClick={openFormHandle}>
                    <ChatIcon />
                </Fab>
            )}
        </div>
    );
}

function FormChat({ openFormHandle }) {
    let userName = useSelector((state) => state.users.instance.name);
    if (userName == null) {
        userName = ' ';
    } else {
        userName += ' ';
    }

    const [loading, setLoading] = useState(false);
    const today = format(new Date(), 'PP p');
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            message: `Hi, ${userName}nice to meet you. I am Alex and I am a virtual assistant of Shenima to help you with your support needs. What are your looking for?`,
            listBtn: [],
            dateTime: today,
        },
    ]);

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

        const sendObj = {
            text,
        };
        setLoading(true);
        ChatbotApi.send(sendObj)
            .then((res) => {
                if (res.status === 200) {
                    let botMessageObj = {};
                    const respondMessage = res.data.fulfillmentText;
                    let sendMessage = '';

                    if (respondMessage === 'Search movie') {
                        const movieName = res.data.parameters.fields.movieName.stringValue;
                        navigate(`/corner/movie/search/${movieName}`);
                        sendMessage = `You will be automatically redirected to the search page for ${movieName} movie`;
                    } else if (respondMessage === 'Search actor') {
                        const actorName = res.data.parameters.fields.actorName.stringValue;
                        navigate(`/corner/people/search/${actorName}`);
                        sendMessage = `You will be automatically redirected to the search page for ${actorName}`;
                    } else if (
                        respondMessage === 'popular' ||
                        respondMessage === 'upcoming' ||
                        respondMessage === 'top_rated'
                    ) {
                        sendMessage = 'We are navigating to ';
                        switch (respondMessage) {
                            case 'popular':
                                sendMessage += 'Popular movies page.';
                                break;
                            case 'upcoming':
                                sendMessage += 'Upcoming movies page.';
                                break;
                            case 'top_rated':
                                sendMessage += 'Top-rated movies page.';
                                break;
                            default:
                                sendMessage += 'Popular movies page.';
                        }

                        navigate(`/corner/movie/${respondMessage}`);
                    } else {
                        sendMessage = respondMessage;
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
                    <p style={{ fontSize: 13 }}>Online</p>
                </div>
            </div>

            <IconButton onClick={openFormHandle}>
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
                            sx={{ color: '#42a5f5', marginRight: 0.3 }}
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
