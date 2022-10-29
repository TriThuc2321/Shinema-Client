/* eslint-disable operator-linebreak */
import React from 'react';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import reviewSlice from '~/Redux/slices/reviewSlice';

function Filter() {
    const data = ['All', 'Inspected', 'Inspecting', 'Uninspected'];
    const dispatch = useDispatch();

    const status = useSelector((state) => state.review.statusSearch);

    const filterHandle = (text) => {
        dispatch(reviewSlice.actions.updateStatusSearch(text));
    };
    return (
        <div className="listFilter">
            {data &&
                data.map((item) => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <p
                        key={item._id}
                        className={status === item ? 'listFilter__item listFilter__item--selected' : 'listFilter__item'}
                        onClick={() => filterHandle(item)}
                    >
                        {item}
                    </p>
                ))}
        </div>
    );
}

export default Filter;
