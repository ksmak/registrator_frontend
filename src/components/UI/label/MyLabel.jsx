import React from 'react';

import classes from './MyLabel.module.css';

const MyLabel = ({children, ...props}) => {
    return (
        <label {...props} className={classes.label}>
            {children}
        </label>
    );
};

export default MyLabel;