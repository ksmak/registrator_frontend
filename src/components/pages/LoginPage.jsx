import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import api from '../../api/index';
import { login } from '../../slices/userRequestsSlice';
import MyButton from '../UI/button/MyButton';
import MyError from '../UI/error/MyError';
import MyInput from '../UI/input/MyInput';
import MyLabel from '../UI/label/MyLabel';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        api.userRequests.get_token({'username': username, 'password': password})
            .then((resp) => {
                dispatch(login({username: username}));
                sessionStorage.setItem('access_token', resp.data.access);
                sessionStorage.setItem('refresh_token', resp.data.refresh);
                setError('');
                navigate('/');
            })
            .catch(() => {
                setError('Ошибка! Имя пользователя или пароль не верны.');
            })
    }

    return (
        <form className='form__login'>
            <h2>Вход в систему</h2>
            <div>
                <MyLabel htmlFor='username'>Имя пользователя</MyLabel>
                <MyInput 
                    type="text" 
                    id='username' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div>
                <MyLabel htmlFor='password'>Пароль</MyLabel>
                <MyInput 
                    type='password' 
                    id='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='form__login__error'><MyError error={error} /></div>
            <MyButton onClick={onLogin}>Войти</MyButton>
        </form>
    );
};

export default LoginPage;