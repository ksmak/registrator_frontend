import React from 'react';
import InputMask from 'react-input-mask';

import classes from './MyInputMask.module.css'

const MyInputmask = ({children, ...props}) => {
    return (
        <InputMask {...props} className={classes.inputmask}>
            {children}
        </InputMask>
    );
};

export default MyInputmask;