const roleRepo = (axios: any) => {
  return {
    getAllTemplate() {
      return axios
        .get(
          `/api/approval-categories?include=fields,department,default_approvers,templates`,
          {}
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    getDetail(id: number | string) {
      return axios
        .get(
          `/api/approval-categories/${id}?include=fields,department,default_approvers,templates`,
          {}
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    getDetailByTemplate(id: number | string) {
      return axios
        .get(
          `/api/approval-categories/${id}/templates?include=fields,department,default_approvers,templates`,
          {}
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    preview(id: number | string, payload: Record<string, any>) {
      return axios
        .post(
          `/api/approval-categories/${id}/preview?include=fields,department,default_approvers,templates`,
          payload
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },

    update(category_id: number, template_id: number, payload: any) {
      return axios
        .put(
          `/api/approval-categories/${category_id}/templates/${template_id}`,
          payload
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    create(id: number, payload: any) {
      return axios
        .post(`/api/approval-categories/${id}/templates`, payload)
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    detail(approval_id: number | string, template_id: number | string) {
      return axios
        .get(
          `/api/approval-requests/${approval_id}/sign-documents/${template_id}`
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    delete(category_id: number | string, template_id: number | string) {
      return axios
        .delete(
          `/api/approval-categories/${category_id}/templates/${template_id}`
        )
        .then((res: any) => {
          return res;
        })
        .catch((err: any) => {
          return err.response;
        });
    },
    sign(id: number | string, requestId: number | string) {
      return axios
        .post(`/api/approval-requests/${requestId}/sign-documents/${id}/sign`)
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
