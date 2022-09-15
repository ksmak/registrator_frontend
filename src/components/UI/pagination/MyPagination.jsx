import React from 'react';
import clasess from './MyPagination.module.css';

import MySelect from '../select/MySelect';

const MyPagination = ({pages, currentPage, setPage, limit, setLimit}) => {
    const options = [
        [100, '100'],
        [200, '200'],
        [300, '300'],
        [500, '500'],
        [1000, '1000'],
        [5000, '5000'],
        [10000, '10000']
    ]
    return (
        <div className={clasess.pagination}>
            { pages.map((p) => 
            <span 
              key={p}
              className={p === currentPage ? clasess.page__current : clasess.page }
              onClick={() => setPage(p)}
            >{p}</span>)
            }
            <MySelect 
                id='limit' 
                options={options} 
                defaultValue="-"
                firstOptionDisabled={true}
                value={limit}
                onChange={e => setLimit(e.target.value)}
                disabled={false}
            />
        </div>
    );
};

export default MyPagination;