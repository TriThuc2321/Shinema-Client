import React from 'react';
import { Routes, Route } from 'react-router-dom';

import DisplayReview from './display';
import EditReview from './editReview';
import NewReview from './newReview';
import ReviewDetail from './reviewDetail';

function Review() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<DisplayReview />} />
                <Route path="/new-post" element={<NewReview />} />
                <Route path="/detail/:reviewId" element={<ReviewDetail />} />
                <Route path="/edit/:reviewId" element={<EditReview />} />
            </Routes>
        </div>
    );
}

export default Review;
