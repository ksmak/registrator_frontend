import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from "react-router-dom";

import "../../styles/App.css";
import { 
  setOrder,
  setLimit,
  setPageCount,
  setSort,
  setPage,
  setUserRequests,
  defaultQuery, 
  selectAll, 
  unSelectAll, 
  selectOne, 
  setDictionaries,
  postUserRequest,
  setAddrList
} from "../../slices/userRequestsSlice";
import { useUserRequests } from '../hooks/useUserRequests';
import MyToolbar from "../UI/toolbar/MyToolbar";
import MyTable from "../UI/table/MyTable";
import api from '../../api/index';
import { getPageCount } from "../../utils/pages";
import { usePagination } from "../hooks/usePagination";
import MyPagination from "../UI/pagination/MyPagination";
import MyModal from "../UI/modal/MyModal";
import MyButton from "../UI/button/MyButton";
import MyLabel from "../UI/label/MyLabel";
import MySelect from "../UI/select/MySelect";
import MyInput from "../UI/input/MyInput";
import { generateLightPassword } from "../../utils/genPassword";


const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const dictionaries = useSelector((state) => state.userRequests.dictionaries);
  const user = useSelector((state) => state.userRequests.user);
  const userRequests = useSelector((state) => state.userRequests.items);
  const addrList = useSelector((state) => state.userRequests.addrList);
  const [queries, setQueries] = useState(defaultQuery);
  const sort = useSelector((state) => state.userRequests.sort);
  const order = useSelector((state) => state.userRequests.order);
  const pageCount = useSelector((state) => state.userRequests.pageCount);
  const page = useSelector((state) => state.userRequests.page);
  const limit = useSelector((state) => state.userRequests.limit);
  const [status, setStatus] = useState(1);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalSend, setModalSend] = useState(false);
  const [message, setMessage] = useState('');
  const [send, setSend] = useState({addrList: [], toAddr: '', zipPas: ''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {  
    api.userRequests.get_dicts()
    .then((resp) => {
      dispatch(setDictionaries(resp.data));        
    });
    api.userRequests.get_addr_list()
    .then((resp) => {
      dispatch(setAddrList(resp.data.addrList));
    })
  }, []);
  useEffect(() => {
    if (user.isAuthenticate) {
      api.userRequests.get_list(limit, page)
      .then((resp) => {
        const count = resp.data.count; 
        let items = resp.data.results;
        items.map(item => item.checked = false);
        dispatch(setPageCount(getPageCount(count, limit)));
        dispatch(setUserRequests(items));
      });
    }
  }, [user.isAuthenticate, page, limit]);
  const changeQueries = (query) => {
    const i = queries.findIndex(item => item.name === query.name);
    queries.splice(i, 1, query);
    setQueries([...queries]);
  };
  
  const pages = usePagination(pageCount);

  const sortedAndSearchUserRequests = useUserRequests(userRequests, sort, queries, order, dictionaries);

  const buttons = [
    {title: '????????????????', onClick: () => navigate("/item") },
    {title: '???????????????? ??????', onClick: () => dispatch(selectAll())},
    {title: '?????????? ??????????????????', onClick: () => dispatch(unSelectAll())},
    {title: '????????????', onClick: () => onPrintPassword()},
    {title: '???????????????? ????????????', onClick: () => onChangeStatus()},
    {title: '?????????????????? ???? ??????????', onClick: () => onSendEmail()},
  ]

  const setSortAndOrder = (field) => {
    if (sort === field) {
      dispatch(setOrder(!order));
    } else {
      dispatch(setOrder(true));
      dispatch(setSort(field));
    }
  }

  const onChangeStatus = () => {
    let isChecked = false;
    sortedAndSearchUserRequests.forEach((item) => {
      if (item.checked) {
        isChecked = true;
        return;
      }
    });
    if (isChecked) {
      setModalStatus(true);
    } else {
      setMessage('???????????? ???? ??????????????!')
      setModalConfirm(true);
    }
  }

  async function changeStatus() {
    for(let i = 0; i < sortedAndSearchUserRequests.length; i++) {
        let item = {...sortedAndSearchUserRequests[i]};
        if (item.checked) {
          item.status = status;
          const postItem = await api.userRequests.update(item);
          dispatch(unSelectAll());
          dispatch(postUserRequest(postItem.data));
        }
    }
    setModalStatus(false);
  }

  const onPrintPassword = async () => {
    let check_list = [];
    sortedAndSearchUserRequests.forEach((item) => {
      if (item.checked) {
        check_list.push(item.id);
      }
    });
    if (check_list.length) {
      const ids = check_list.map((n) => `ids=${n}`).join('&');
      try {
        const res = await api.userRequests.print_password(ids);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.docx");
        document.body.appendChild(link);
        link.click();
      } catch(e) {
        setMessage(`????????????! ${e}`)
        setModalConfirm(true);
      }  
    } else {
      setMessage('???????????? ???? ??????????????!')
      setModalConfirm(true);
    }
  }

  const onSendEmail = () => {
    let check_list = [];
    sortedAndSearchUserRequests.forEach((item) => {
      if (item.checked) {
        check_list.push(item.id);
      }
    });
    if (check_list.length) {
      const ids = check_list.map((n) => `ids=${n}`).join('&');
      setSend({...send, toAddr: '', zipPas: '', ids: ids});
      setModalSend(true);
    } else {
      setMessage('???????????? ???? ??????????????!');
      setModalConfirm(true);
    }
  }

  const sendEmail = async () => {
    try {
      setLoading(true);
      await api.userRequests.send_email(send.ids, send.toAddr, send.zipPas);
      setLoading(false);
      setModalSend(false);
      setMessage(`?????????? ?????????????? ??????????????????!`);
      setModalConfirm(true);
    } catch(e) {
      setMessage(`????????????! ???? ?????????????? ?????????????????? ?????????????????? ???? ?????????? ${e}`);
      setModalConfirm(true);
    }
  }


  const headers = [
    {title: '', name: 'index', type: '', class: 'table__coln'},
    {title: '', name: 'check', type: '', class: 'table__coln'},
    {title: '????????????', name: 'status', type: 'select', dict: dictionaries.statuses,
        onClick: () => setSortAndOrder('status'), class: 'table__col__status'},
    {title: '???????? ????????????', name: 'db', type: 'select', dict: dictionaries.dbs,
        onClick: () => setSortAndOrder('db'), class: 'table__col__db'},
    {title: '??????', name: 'iin', type: 'text', 
        onClick: () => setSortAndOrder('iin'), class: 'table__col__iin', size: 12},
    {title: '??????????????', name: 'first_name', type: 'text', 
        onClick: () => setSortAndOrder('first_name'), class: 'table__col__name', size: 20},
    {title: '??????', name: 'middle_name', type: 'text', 
        onClick: () => setSortAndOrder('middle_name'), class: 'table__col__name', size: 20},
    {title: '????????????????', name: 'last_name', type: 'text',
        onClick: () => setSortAndOrder('last_name'), class: 'table__col__name', size: 20},
    {title: '??????????????????????????', name: 'department', type: 'select', dict: dictionaries.departments,
        onClick: () => setSortAndOrder('department'), class: 'table__col__department'},
    {title: '????????????', name: 'management', type: 'select', dict: dictionaries.managements,
        onClick: () => setSortAndOrder('management'), class: 'table__col__management'},
    {title: '??????????????????', name: 'job', type: 'text',
        onClick: () => setSortAndOrder('job'), class: 'table__col__job', size: 50},
    {title: '??????????????', name: 'phone', type: 'text',
        onClick: () => setSortAndOrder('phone'), class: 'table__col__phone', size: 12},
  ]
  
  if (!user.isAuthenticate) {
    return <Navigate to="/login" />
  }

  return (
    <div className="main__content">
      <MyModal visible={modalConfirm} setVisible={setModalConfirm}>
        <div className="modal">
          <strong>{message}</strong>
          <MyButton onClick={(e) => {e.preventDefault(); setModalConfirm(false)}}>??????????????</MyButton>
        </div>
      </MyModal>
      <MyModal visible={modalStatus} setVisible={setModalStatus}>
        <form className="modal__change__status">
        <MyLabel htmlFor='status'>????????????</MyLabel>
          <MySelect 
            id='status' 
            name='status'
            options={dictionaries.statuses} 
            defaultValue="-"
            value={status ? status : ''}
            onChange={e => setStatus(e.target.value)}
            disabled={false}
            firstOptionDisabled={true}
          />
          <MyButton onClick={(e) => {e.preventDefault(); changeStatus()}}>
            ????
          </MyButton>
          <MyButton onClick={(e) => {e.preventDefault(); setModalStatus(false)}}>
            ????????????
          </MyButton>
        </form>
      </MyModal>
      <MyModal visible={modalSend} setVisible={setModalSend}>
        <form className="modal__send">
          <div>
            <MyLabel htmlFor='to_addr'>????????</MyLabel>
            <MySelect 
              id='to_addr' 
              name='to_addr'
              options={addrList} 
              defaultValue="-"
              value={send.toAddr}
              onChange={e => setSend({...send, toAddr: e.target.value})}
              disabled={loading}
              firstOptionDisabled={true}
            />
          </div>
          <div>
            <MyLabel htmlFor='zip_pas'>???????????? ???? ??????????</MyLabel>
            <MyInput
              id='zip_pas' 
              name='zip_pas' 
              value={send.zipPas}
              onChange={e => setSend({...send, zipPas: e.target.value})}
              disabled={loading}
              size='15'
            />
            <MyButton
              onClick={(e) => {e.preventDefault(); setSend({...send, zipPas: generateLightPassword()})}}
              disabled={loading}
            >
              ?????????????????????????? ????????????
          </MyButton>
          </div>
          <div className="modal__send__button">
            <MyButton onClick={(e) => {e.preventDefault(); sendEmail()}} disabled={loading}>
              ????
            </MyButton>
            <MyButton onClick={(e) => {e.preventDefault(); setModalSend(false)}} disabled={loading}>
              ????????????
            </MyButton>
          </div>
          <div className="loading" hidden={!loading}></div>
        </form>
      </MyModal>
      <p onClick={() => window.location.reload(false)}>??????????</p>
      <h1>???????????? ???????????? ??????????????????????????</h1>
      <MyToolbar buttons = {buttons} />
      <MyPagination 
        pages={pages}
        currentPage={page}
        setPage={(p) => dispatch(setPage(p))}
        limit={limit}
        setLimit={(n) => dispatch(setLimit(n))}
      />
      <MyTable 
        headers={headers}
        body={sortedAndSearchUserRequests} 
        selectOne={id => dispatch(selectOne(id))}
        onOpen={id => navigate("/item/" + id)}
        queries={queries}
        changeQueries={changeQueries}
        sort={sort}
        order={order}
      />
    </div>
  );
}

export default MainPage;
