import React, { useState, useEffect, useRef } from 'react';
import tmdbApi from '../../../../Api/tmdbApi';

import './videoList.css';

function VideoList({ category, id }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const res = await tmdbApi.getVideos(category, id);
                setVideos(res.results.slice(0, 5));
            } catch (e) {
                console.log(e);
            }
        };

        getVideos();
    }, [category, id]);

    return (
        <div className="container">
            {videos.map((item) => (
                <Video key={item.id} item={item} />
            ))}
        </div>
    );
}

function Video(props) {
    const { item } = props;
    const iframeRef = useRef(null);

    useEffect(() => {
        const height = `${(iframeRef.current.offsetWidth * 9) / 16}px`;
        iframeRef.current.setAttribute('height', height);
    }, []);

    return (
        <div className="video">
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>

            <iframe
                className="frame"
                src={`https://www.youtube.com/embed/${item.key}`}
                ref={iframeRef}
                width="90%"
                title="video"
            />
        </div>
    );
}
export default VideoList;
