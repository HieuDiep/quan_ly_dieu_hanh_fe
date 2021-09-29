const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const VUE_APP_X_API_KEY = process.env.VUE_APP_X_API_KEY;

import axios from "axios";
const users = {
 namespaced: true,
 state: {
  users: {},
  usersByDep: {},
  listDepartments: [],
  listCompanies: [],
  listUsers: [],
 },
 mutations: {
  setAllUsers(state: any, _usersList: any) {
   // _usersList array
   _usersList.forEach((o: any) => {
    state.users[o.username] = { ...o };
   });
  },
  setUserDep(state: any, _userDep: any) {
   const { depId, users } = _userDep;
   state.usersByDep[depId] = { ...users };
  },
  addUsers(state: any, _users: any) {
   // _usersList array
   state.users[_users.username] = { ..._users };
  },
  SET_DEPARTMENTS(state: any, payload: any) {
   state.listDepartments = payload;
  },
  SET_COMPANIES(state: any, payload: any) {
   state.listCompanies = payload;
  },
  SET_USERS(state: any, payload: any) {
   state.listUsers = payload;
  },
 },
 actions: {
  getDepartments({ commit }: any) {
   const headers = { "x-api-key": VUE_APP_X_API_KEY };
   axios
    .get(`${VUE_APP_BASE_URL}/api/internal/departments?pagination=false`, { headers })
    .then(res => {
     commit("SET_DEPARTMENTS", res.data.data.departments);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getCompanies({ commit }: any) {
   const headers = { "x-api-key": VUE_APP_X_API_KEY };
   axios
    .get(`${VUE_APP_BASE_URL}/api/internal/tenancy`, { headers })
    .then(res => {
     commit("SET_COMPANIES", res.data.data.tenancy);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getUsers({ commit }: any) {
   const headers = { "x-api-key": VUE_APP_X_API_KEY };
   axios
    .get(`${VUE_APP_BASE_URL}/api/internal/users?pagination=false`, { headers })
    .then(res => {
     commit("SET_USERS", res.data.data.users);
    })
    .catch(err => {
     console.log(err);
    });
  },
 },
};
export default users;
