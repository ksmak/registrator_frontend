import React from 'react';
import classes from './MyTable.module.css';

import MyInput from '../input/MyInput';
import MySelect from '../select/MySelect';


const MyTable = ({headers, body, selectOne, onOpen, queries, changeQueries, sort, order}) => {
    return (
        <div className={classes.content}>
            <table className={classes.table}>
            <thead>
                <tr>
                    {headers.map( (item, index) =>                             
                        <td key={index} onClick={item.onClick} className={classes[item.class]}>
                            {item.name === sort 
                                ? order ? item.title + ' ↑ ': item.title + '↓' 
                                : item.title}
                        </td>
                    )}                       
                </tr>
                <tr>
                    {headers.map( (item, index) => {
                        if (item.type === 'text') {
                            return <td key={index}>
                                        <MyInput 
                                            type='text' 
                                            value={queries[index].value}
                                            onChange={e => changeQueries(
                                                {...queries[index], value: e.target.value}
                                            )}
                                            placeholder="Поиск..."
                                            size={item.size}
                                        />
                                    </td>
                        } else if (item.type === 'select') {
                            return <td key={index}>
                                        <MySelect 
                                            options={item.dict} 
                                            defaultValue="Поиск..."
                                            value={queries[index].value}
                                            onChange={e => changeQueries(
                                                {...queries[index], value: e.target.value}
                                            )}
                                        />
                                    </td>
                        }
                        return <td key={index}></td>
                    })}  
                </tr>
                </thead>     
                    <tbody>
                    { body.length 
                        ? body.map((item, index) => 
                            <tr key={item.id} className={classes.table__row} >
                                <td>{index + 1}</td>
                                <td><MyInput
                                        type="checkbox" 
                                        name="check" 
                                        checked={item.checked} 
                                        onChange={() => selectOne(item.id)} />
                                </td>
                                <td onClick={() => onOpen(item.id)}>{item.status_display}</td>
                                <td onClick={() => onOpen(item.id)}>{item.db_display}</td>
                                <td onClick={() => onOpen(item.id)}>{item.iin}</td>
                                <td onClick={() => onOpen(item.id)}>{item.first_name}</td>
                                <td onClick={() => onOpen(item.id)}>{item.middle_name}</td>
                                <td onClick={() => onOpen(item.id)}>{item.last_name}</td>
                                <td onClick={() => onOpen(item.id)}>{item.department_display}</td>
                                <td onClick={() => onOpen(item.id)}>{item.management_display}</td>
                                <td onClick={() => onOpen(item.id)}>{item.job}</td>
                                <td onClick={() => onOpen(item.id)}>{item.phone}</td>
                            </tr>
                        )
                        : <tr><td colSpan='11'><div className={classes.table__nothing}>Нет данных</div></td></tr>
                    }   
                </tbody> 
            </table>
        </div>    
    );
};

export default MyTable;