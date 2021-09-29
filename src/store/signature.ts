const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;

import axios from "axios";
const others = {
 namespaced: true,
 state: {
  currentSignature: null,
 },
 getters: {
  getCountryList(state: Record<string, unknown>) {
   return state.listCountries;
  },
 },
 mutations: {
  SET_CURRENT_SIGNATURE(state: Record<string, unknown>, signature: any) {
   state.currentSignature = signature;
  },
 },
 actions: {
  getCurrentSignature({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/approval-signature-template`)
    .then(res => {
     commit("SET_CURRENT_SIGNATURE", res.data.data);
    })
    .catch(err => {
     console.log(err);
    });
  },
 },
};
export default others;
