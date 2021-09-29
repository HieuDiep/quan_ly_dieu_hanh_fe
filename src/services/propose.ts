const proposeRepo = (axios: any) => {
 return {
  getAll(filterOptions: Record<string, unknown> = {}) {
   const body = {
    ...filterOptions,
   };
   return axios
    .get(`/api/approval-requests`, {
     params: body,
    })
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  getDetail(_id: number) {
   return axios
    .get(`/api/approval-requests/${_id}`)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  create(payload: Record<string, unknown> = {}) {
   return axios
    .post(`/api/approval-requests?include=fields,approvers,followers`, payload)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  send(id: string | number, payload: Record<string, unknown> = {}) {
   return axios
    .post(`/api/approval-requests/${id}/send`, payload)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  delete(_id: number | string) {
   return axios({
    method: "DELETE",
    url: `api/approval-requests/${_id}`,
   })
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },

  update(id: any, payload: any) {
   return axios
    .put(`/api/approval-requests/${id}`, payload)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
 };
};
export default proposeRepo;
