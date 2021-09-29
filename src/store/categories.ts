const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;

import axios from "axios";
const others = {
 namespaced: true,
 state: {
  listCategories: [],
  pagination: {
   total: 1,
   per_page: 15,
   total_pages: 15,
   page: 1,
  },
 },
 getters: {},
 mutations: {
  SET_LIST_CATEGORIES(state: Record<string, unknown>, payload: any) {
   state.listCategories = payload;
  },
 },
 actions: {
  getListCategories({ commit }: any) {
   axios
    .get(
     `${VUE_APP_BASE_URL}/api/approval-categories?include=fields,department`,
     { params: { size: 9999 } },
    )
    .then(res => {
     commit("SET_LIST_CATEGORIES", res.data.data.categories);
    })
    .catch(err => {
     console.log(err);
    });
  },
 },
};
export default others;
