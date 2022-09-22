import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import { postUserRequest } from '../../slices/userRequestsSlice';
import MyToolbar from '../UI/toolbar/MyToolbar';
import MyLabel from '../UI/label/MyLabel';
import MySelect from '../UI/select/MySelect';
import MyInput from '../UI/input/MyInput';
import MyError from '../UI/error/MyError';
import MyInputMask from '../UI/inputmask/MyInputMask';
import api from '../../api/index';
import MyModal from '../UI/modal/MyModal';
import MyButton from '../UI/button/MyButton';
import { replaceStr } from '../../utils/formatString';
import { generatePassword } from '../../utils/genPassword';

const ItemPage = () => {
    const params = useParams();
    
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (params.id) {
            onOpen(+params.id);
        } else {
            onEdit();
        }
    }, []);
    
    const dictionaries = useSelector((state) => state.userRequests.dictionaries);
    const user = useSelector((state) => state.userRequests.user);
    const userRequests = useSelector((state) => state.userRequests.items);
    
    const [modalError, setModalError] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalCopy, setModalCopy] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [userRequest, setUserRequest] = useState({
        checked: false, 
        id: null, 
        status: 1, 
        first_name: null, 
        middle_name: null, 
        last_name: null, 
        iin: null, 
        db: null, 
        login: null, 
        password: null, 
        job: null, 
        phone: null,
        request_date: null,
        create_date: null,
        change_date: null,
    })
    const [edit, setEdit] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    const validate = (name, value) => {
        let validationError = '';
        let isValid = true;
        switch(name) {
            case 'status':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;
            case 'iin':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                value = replaceStr(value.toString());
                if (value.toString().length < 12) {
                    validationError = 'Длина поля не должно быть меньше 12 символов';
                    isValid = false;
                    break;
                }
                if (value.toString().length > 12) {
                    validationError = 'Длина поля не должно быть больше 12 символов';
                    isValid = false;
                    break;
                }
                break;
            case 'first_name':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;
            case 'middle_name':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;
            case 'department':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;    
            case 'management':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;    
            case 'job':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;
            case 'db':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                break;            
            case 'phone':
                if (!value) {
                    validationError = 'Поле обязательно для ввода';
                    isValid = false;
                    break;
                }
                
                value = replaceStr(value.toString())
                    
                if (value.length !== 12) {
                    validationError = 'Неверный формат данных';
                    isValid = false;
                    break;
                }
                break;
            case 'login':
                if (!value) {
                    value = userRequest.iin;
                }    
                break;
        }
        setFormErrors({...formErrors, [name]: validationError});
        return {isValid, value};
    }

    const validateField = (name, value) => {
        const obj = validate(name, value);
        setUserRequest({...userRequest, [name]: obj.value});
    };

    const validateForm = () => {
        for (let key in userRequest) {
            const obj = validate(key, userRequest[key]);
            if (obj.isValid === false) {
                return false;
            }
        }
        return true;
    };
    
    const onOpen = (id) => {
        setEdit(false);
        const i = userRequests.find(item => item.id === id);
        setUserRequest(i);
    };

    const onEdit = () => {
        setEdit(true);
    }

    async function onSave() {
        if (validateForm()) {
            try {
                const isDuplicateIIN = await api.userRequests.check_iin(
                    userRequest.id ? userRequest.id : 0, userRequest.status, userRequest.db, userRequest.iin
                );
                if (isDuplicateIIN.data.result > 0) {
                    setFormErrors({...formErrors, iin: 'Ошибка! Такой ИИН уже существует в базе.'});
                    return;
                }
    
                const isDuplicatePhone = await api.userRequests.check_phone(
                    userRequest.id ? userRequest.id : 0, userRequest.status, userRequest.db, userRequest.phone
                );
                if (isDuplicatePhone.data.result > 0) {
                    setFormErrors({...formErrors, phone: 'Ошибка! Такой номер телефона уже существует в базе.'});
                    return;
                }
                
                const response = await api.userRequests.update(userRequest);
                let postItem = response.data;
                postItem.checked = false;
                dispatch(postUserRequest(postItem));
                setEdit(false);
            }
            catch(e) {
                setErrorMsg('Ошибка при сохранении данных! ' + e);
                setModalError(true);
            };
        }    
    }

    const onDelete = () => {
        setModalDelete(true);
    }

    const deleteDocument = async () => {
        setModalDelete(false);
        try {
            await api.userRequests.delete(userRequest.id);
            navigate("/");
        } catch(e) {
            setErrorMsg(`Ошибка! Не удалость удалить документ! ${e}`);
            setModalError(true);
        }
    }

    const onCopy = () => {
        setModalCopy(true);
    }

    const copyDocument = () => {
        setModalCopy(false);
        let obj = {...userRequest};
        obj.id = null;
        obj.status = 1;
        obj.db = null;
        obj.login = null;
        obj.password = null;
        obj.request_date = null;
        setUserRequest(obj);
    }

    const buttons = [
        {title: 'Копировать', onClick: onCopy, hidden: edit},
        {title: 'Редактировать', onClick: onEdit, hidden: edit},
        {title: 'Сохранить', onClick: onSave, hidden: !edit},
        {title: 'Удалить', onClick: onDelete, hidden: params.id ? edit : true},
        {title: 'Закрыть', onClick: () => navigate("/"), hidden: edit},
        {title: 'Отмена', onClick: () => params.id ? onOpen(+params.id) : navigate("/"), hidden: !edit}
    ]; 
   
    if (!user.isAuthenticate) {
        return <Navigate to="/login" />
    }

    const cirillicFormat = {
        'k': '[А-Яа-яқәіңғүұөҚӘІҢҒҮҰӨ-]'
    }

    const toUpper = (newState) => {
        newState.value = newState.value.toUpperCase();
        return newState;
    }

    return (
        <div>
            <MyModal visible={modalError} setVisible={setModalError}>
                <div>{errorMsg}</div>
            </MyModal>
            <MyModal visible={modalDelete} setVisible={setModalDelete}>
                <form className='modal'>
                    <h1>Удалить текущий документ?</h1>
                    <div>
                        <MyButton onClick={(e) => {e.preventDefault(); deleteDocument(userRequest.id)}}>Да</MyButton>
                        <MyButton onClick={(e) => {e.preventDefault(); setModalDelete(false)}}>Нет</MyButton>
                    </div>
                </form>
            </MyModal>
            <MyModal visible={modalCopy} setVisible={setModalCopy}>
                <form className='modal'>
                    <h1>Копировать документ?</h1>
                    <div>
                        <MyButton onClick={(e) => {e.preventDefault(); copyDocument(userRequest.id)}}>Да</MyButton>
                        <MyButton onClick={(e) => {e.preventDefault(); setModalCopy(false)}}>Нет</MyButton>
                    </div>
                </form>
            </MyModal>
            <MyToolbar 
                buttons={buttons}
            />
            <div className='form__edit__label'>{userRequest.create_date? 'Создан: ' + new Date(userRequest.create_date).toLocaleString(): ''} {userRequest.create_author? userRequest.create_author: ''}</div>
            <div className='form__edit__label'>{userRequest.change_date? 'Изменен: ' + new Date(userRequest.change_date).toLocaleString(): ''} {userRequest.change_author? userRequest.change_author: ''}</div>
            <form className='form__edit'>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='status'>Статус</MyLabel>
                        <MySelect 
                            id='status' 
                            name='status'
                            options={dictionaries.statuses} 
                            defaultValue="-"
                            value={userRequest.status ? userRequest.status : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                            firstOptionDisabled={false}
                        />
                        <MyError error={formErrors.status}/> 
                    </div>
                </div>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='iin'>ИИН</MyLabel>
                        <MyInputMask
                            id='iin' 
                            name='iin' 
                            mask='999999999999'
                            maskChar={null}
                            value={userRequest.iin ? userRequest.iin : ''} 
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                            size='12'
                        /> 
                        <MyError error={formErrors.iin}/>  
                        <button className='button__genpassword'
                            onClick={(e) => {
                                e.preventDefault(); 
                            }}
                            hidden={!edit}
                        >
                            Проверика ИИН
                        </button>
                    </div>
                </div>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='first_name'>Фамилия</MyLabel>
                        <MyInputMask 
                            id='first_name' 
                            name='first_name' 
                            maskChar={null}
                            formatChars = {cirillicFormat}
                            mask='kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
                            beforeMaskedValueChange={toUpper}
                            value={userRequest.first_name ? userRequest.first_name : ''} 
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                            size='30'
                        />
                        <MyError error={formErrors.first_name}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='middle_name'>Имя</MyLabel>
                        <MyInputMask 
                            id='middle_name' 
                            name='middle_name' 
                            maskChar={null}
                            formatChars = {cirillicFormat}
                            mask='kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
                            beforeMaskedValueChange={toUpper}
                            value={userRequest.middle_name ? userRequest.middle_name : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                            size='30'
                        />
                        <MyError error={formErrors.middle_name}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='last_name'>Отчество</MyLabel>
                        <MyInputMask 
                            id='last_name' 
                            name='last_name' 
                            maskChar={null}
                            formatChars = {cirillicFormat}
                            mask='kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'
                            beforeMaskedValueChange={toUpper}
                            value={userRequest.last_name ? userRequest.last_name : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                            size='30'
                        />
                        <MyError error={formErrors.last_name}/> 
                    </div>    
                </div> 
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='department'>Подразделение</MyLabel>
                        <MySelect 
                            id='department' 
                            name='department'
                            options={dictionaries.departments} 
                            defaultValue="-"
                            value={userRequest.department ? userRequest.department : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        />
                        <MyError error={formErrors.department}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='management'>Служба</MyLabel>
                        <MySelect 
                            id='management' 
                            name='management'
                            options={dictionaries.managements} 
                            defaultValue="-"
                            value={userRequest.management ? userRequest.management : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        />
                        <MyError error={formErrors.management}/> 
                    </div>    
                </div>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='job'>Должность</MyLabel>
                        <MyInput
                            id='job' 
                            name='job' 
                            value={userRequest.job ? userRequest.job : ''}
                            onChange={e => validateField(e.target.name, e.target.value.toUpperCase())}
                            disabled={!edit}
                            size='70'
                        />
                        <MyError error={formErrors.job}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='phone'>Сотовый телефон</MyLabel>
                        <MyInputMask
                            id='phone' 
                            name='phone' 
                            mask='+7(999)-999-99-99'
                            value={userRequest.phone ? userRequest.phone : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}  
                            size='15'  
                        />    
                        <MyError error={formErrors.phone}/> 
                    </div>    
                </div>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='db'>База данных</MyLabel>    
                        <MySelect 
                            id='db' 
                            name='db'
                            options={dictionaries.dbs} 
                            defaultValue="-"
                            value={userRequest.db ? userRequest.db : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        />
                        <MyError error={formErrors.db}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='login'>Логин</MyLabel>
                        <MyInput 
                            id='login' 
                            name='login' 
                            value={userRequest.login ? userRequest.login : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        />   
                        <MyError error={formErrors.login}/> 
                    </div>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='password'>Пароль</MyLabel>
                        <MyInput 
                            id='password' 
                            name='password' 
                            value={userRequest.password ? userRequest.password : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        /> 
                        <MyError error={formErrors.password}/> 
                    </div> 
                    <div className='form__edit__field'>
                        <button className='button__genpassword'
                            onClick={(e) => {
                                e.preventDefault(); 
                                setUserRequest({...userRequest, password: generatePassword()})
                            }}
                            hidden={!edit}
                        >
                            Сгенерировать пароль
                        </button>
                    </div>
                </div>
                <div className='form__edit__row'>
                    <div className='form__edit__field'>
                        <MyLabel htmlFor='request_date'>Дата подачи заявки</MyLabel>
                        <MyInput 
                            id='request_date' 
                            name='request_date' 
                            type='date'
                            value={userRequest.request_date ? userRequest.request_date : ''}
                            onChange={e => validateField(e.target.name, e.target.value)}
                            disabled={!edit}
                        /> 
                        <MyError error={formErrors.request_date}/> 
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ItemPage;