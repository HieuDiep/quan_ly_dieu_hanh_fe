const roleRepo = (axios: any) => {
 return {
  getAllCates(filterOptions: Record<string, unknown> = {}) {
   const body = {
    ...filterOptions,
   };
   return axios
    .get(
     `/api/approval-categories?include=fields,department,default_approvers,templates`,
     { params: body },
    )
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  getDetail(id: number) {
   return axios
    .get(
     `/api/approval-categories/${id}?include=fields,department,default_approvers,templates`,
     {},
    )
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },

  update(id: number, payload: any) {
   return axios
    .put(
     `/api/approval-categories/${id}?include=fields,department,default_approvers,templates`,
     payload,
    )
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  delete(id: any) {
   return axios
    .delete(`/api/approval-categories/${id}`)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  updateAvatar(id: number, payload: any) {
   return axios
    .post(
     `/api/approval-categories/${id}?include=fields,department,default_approvers,templates`,
     payload,
    )
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  create(payload: any) {
   return axios
    .post(
     `/api/approval-categories?include=fields,department,default_approvers,templates`,
     payload,
    )
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
