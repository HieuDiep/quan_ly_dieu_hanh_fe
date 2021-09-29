const localToken = localStorage.getItem("auth._token.local");

const roleRepo = (axios: any) => {
 return {
  getSignature() {
   return axios
    .get(`/api/approval-signature-template`, {})
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },

  update(payload: any) {
   return axios
    .post(`/api/approval-signature-template`, payload)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
 };
};
export default roleRepo;
