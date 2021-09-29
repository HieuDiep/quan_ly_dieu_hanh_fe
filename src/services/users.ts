const usersRepo = (axios: any) => {
 return {
  getAll(filterOptions: Record<string, unknown> = {}) {
   const body = {
    ...filterOptions,
    // include: filterOptions.include ? `${filterOptions.include},parts,parts.warehouse,parts.warehouse_off_airport_terminal` : "parts",
   };
   return axios
    .get(`/api/users`, {
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
    .get(`/api/users/${_id}`)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
 };
};
export default usersRepo;
