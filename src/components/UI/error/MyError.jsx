import React from 'react';

import classes from './MyError.module.css';

const MyError = ({error}) => {
    return (
        <span className={classes.error}>
            {error}
        </span>
    );
};

export default MyError;