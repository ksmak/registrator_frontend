import { createSlice } from "@reduxjs/toolkit";

export const defaultQuery =[
    { name: '#', value: ''},
    { name: '#', value: ''},
    { name: 'status', value: ''},
    { name: 'db', value: ''},
    { name: 'iin', value: ''},
    { name: 'first_name', value: ''},
    { name: 'middle_name', value: ''},
    { name: 'last_name', value: ''},
    { name: 'department', value: ''},
    { name: 'management', value: ''},
    { name: 'job', value: ''},
    { name: 'phone', value: ''},
];

export const userRequestsSlice = createSlice({
    name: 'userRequests',
    initialState: {
        dictionaries: {
          statuses:[],
          departments:[],
          managements:[],
          dbs:[]
        },
        items: [],
        user: {
          username: '',
          isAuthenticate: false,
        },
        addrList: [],
        order: true,
        page: 1,
        sort: '',
        pageCount: 0,
        limit: 100
    },
    reducers: {
        setPage: (state, payload) => {
          state.page = payload.payload;
        },
        setLimit: (state, payload) => {
          state.page = 1;
          state.limit = payload.payload;
        },
        setPageCount: (state, payload) => {
          state.pageCount = payload.payload;
        },
        setSort: (state, payload) => {
          state.sort = payload.payload;
        },
        setOrder: (state, payload) => {
          state.order = payload.payload;
        },
        setDictionaries: (state, payload) => {
          state.dictionaries = payload.payload;
        },
        login: (state, username) => {
          state.user.username = username;
          state.user.isAuthenticate = true;
        },
        logout: (state) => {
          state.user.username = '';
          state.user.isAuthenticate = false;
        },
        setUserRequests: (state, payload) => {
          state.items = payload.payload;
        },
        selectAll: (state) => {
            state.items.map(item => item.checked = true)
        },
        unSelectAll: (state) => {
            state.items.map(item => item.checked = false)
        },
        selectOne: (state, payload) => {
            let item = state.items.find(item => item.id === payload.payload);
            item.checked = !item.checked;
        },
        postUserRequest: (state, payload) => {
            const i = state.items.findIndex(item => item.id === payload.payload.id);
            state.items.splice(i, 1, payload.payload);
        },
        setAddrList: (state, payload) => {
          state.addrList = payload.payload;
        },
    },
})

export const { 
  setOrder,
  setLimit,
  setPageCount,
  setSort,
  setPage,
  setDictionaries,
  login, 
  logout, 
  setUserRequests, 
  selectAll, 
  unSelectAll, 
  selectOne, 
  postUserRequest,
  setAddrList,
} = userRequestsSlice.actions;

export default userRequestsSlice.reducer;