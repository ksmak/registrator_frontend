import React from 'react';
import classes from './MySelect.module.css'

const MySelect = ({options, defaultValue, firstOptionDisabled, ...props}) => {
    return (
        <select {...props} className={classes.select}>
            <option disabled={firstOptionDisabled} value='' key='0'>{defaultValue}</option>
            { options.map(item => 
                <option value={item[0]} key={item[0]}>{item[1]}</option>
            )}
        </select>
    );
};

export default MySelect;