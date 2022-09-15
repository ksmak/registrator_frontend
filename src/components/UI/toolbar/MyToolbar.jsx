import React from 'react';

import MyButton from '../button/MyButton';
import classes from './MyToolbar.module.css';

const MyToolbar = ({buttons}) => {
    return (
        <div className={classes.toolbar}>
            {buttons.map(item => 
                <MyButton key={item.title} onClick={item.onClick} hidden={item.hidden}>{item.title}</MyButton>
            )}
        </div>
    );
};

export default MyToolbar;