const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
console.log("BASE_URL", VUE_APP_BASE_URL);

import axios from "axios";
const others = {
 namespaced: true,
 state: {
  listCountries: [],
  listPackageDetails: [],
  listPackageType: [],
  listRole: [],
  listStatusOrder: [
   {
    status: "status.....",
    status_id: 1,
   },
   {
    status: "Packing",
    status_id: 2,
   },
   {
    status: "Manifesting",
    status_id: 3,
   },
  ],
  listFieldAccepted: [],
 },
 getters: {
  getCountryList(state: Record<string, unknown>) {
   return state.listCountries;
  },
 },
 mutations: {
  SET_COUNTRY_LIST(state: Record<string, unknown>, countries: any) {
   state.listCountries = countries;
  },
  SET_PACKAGE_DETAIL(state: Record<string, unknown>, packageDetail: any) {
   state.listPackageDetails = packageDetail;
  },
  SET_PACKAGE_TYPE(state: Record<string, unknown>, packageType: any) {
   state.listPackageType = packageType;
  },
  SET_ROLE_LIST(state: Record<string, unknown>, role: any) {
   state.listRole = role;
  },
  SET_LIST_FIELD_ACCEPTED(state: Record<string, unknown>, payload: Array<any>) {
   state.listFieldAccepted = payload;
  },
 },
 actions: {
  getAllCountry({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/countries`)
    .then(res => {
     commit("SET_COUNTRY_LIST", res.data.data.countries);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getAllPackageType({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/package-details`)
    .then(res => {
     commit("SET_PACKAGE_DETAIL", res.data.data.packageDetails);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getAllPackageDetail({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/package-types`)
    .then(res => {
     commit("SET_PACKAGE_TYPE", res.data.data.packageTypes);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getAllRole({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/roles`)
    .then(res => {
     commit("SET_ROLE_LIST", res.data.data.roles);
    })
    .catch(err => {
     console.log(err);
    });
  },
  getAllFields({ commit }: any) {
   axios
    .get(`${VUE_APP_BASE_URL}/api/approval-field-types`)
    .then(res => {
     commit("SET_LIST_FIELD_ACCEPTED", res.data.data.filed_types);
    })
    .catch(err => {
     console.log(err);
    });
  },
 },
};
export default others;
