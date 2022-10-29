import React, { useState, useEffect } from 'react';
import tmdbApi from '~/Api/tmdbApi';
import apiConfig from '~/Api/apiConfig';

import './castList.css';
// eslint-disable-next-line import/order
import { useNavigate } from 'react-router';

function CastList({ id, category }) {
    const [casts, setCasts] = useState([]);

    useEffect(() => {
        const getCredits = async () => {
            try {
                const res = await tmdbApi.credits(category, id);
                setCasts(res.cast.filter((item) => item.profile_path != null));
                setCasts(res.cast.slice(0, 5));
            } catch (e) {
                console.log(e);
            }
        };

        getCredits();
    }, [category, id]);

    const GoToPeopleDetails = (item) => {
        const navigate = useNavigate();
        navigate(`/peopleDetails/${item.id}`);
    };

    return (
        <div className="casts">
            {casts.map((item) => (
                <div className="casts__item" key={item.id}>
                    <div
                        className="casts__item__img"
                        style={{ backgroundImage: `url(${apiConfig.w500Image(item.profile_path)})` }}
                        onClick={() => GoToPeopleDetails(item)}
                    />
                    <p className="casts__item__name">{item.name}</p>
                </div>
            ))}
        </div>
    );
}

export default CastList;
