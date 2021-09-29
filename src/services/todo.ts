const toDo = (axios: any) => {
  return {
   create(filterOptions: any) {
    const body = {
     ...filterOptions,
     // include: filterOptions.include ? `${filterOptions.include},parts,parts.warehouse,parts.warehouse_off_airport_terminal` : "parts",
    };
    return axios
     .post(`/api/staff/tasks`, filterOptions)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
   edit(id: any, filterOptions: any) {
    const body = {
     ...filterOptions,
     // include: filterOptions.include ? `${filterOptions.include},parts,parts.warehouse,parts.warehouse_off_airport_terminal` : "parts",
    };
    return axios
     .post(`/api/staff/tasks/${id}`, filterOptions)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
   reopen(id: any) {
    return axios
     .post(`/api/staff/tasks/${id}/reopen`)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
   unfollow(id: any) {
    return axios
     .post(`/api/staff/tasks/${id}/unfollow`)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
   accept(id: any) {
    return axios
     .post(`/api/staff/tasks/${id}/accept`)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
   delete(id: any) {
    return axios
     .delete(`/api/staff/tasks/${id}`)
     .then((res: any) => {
      return res;
     })
     .catch((err: any) => {
      return err.response;
     });
   },
  };
 };
 export default toDo;