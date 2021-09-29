const localToken = localStorage.getItem("auth._token.local");
import store from "@/store";
const roleRepo = (axios: any) => {
 return {
  async redirectToSSO() {
   const currentCookies = document.cookie;
   const cookiesArray = currentCookies.split(";").map(o => {
    const ar = o.split("=");
    return {
     key: ar[0],
     val: ar[1],
    };
   });
   const f = cookiesArray.filter(o => {
    return o.key == "token" || o.key == " token";
   });

   if (
    cookiesArray.some(o => {
     return o.key === "token" || o.key === " token";
    })
   ) {
    if (
     f.every(o => {
      return o.val == "removed";
     })
    ) {
     console.log(f);
     document.cookie = "token=removed";
     const currentUrl = window.location.origin;
     if (process.env.VUE_APP_ENV !== "DEV") {
      window.location.href =
       process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
     } else {
      console.log(
       `Không có token được lưu tại cookie, môi trường hiện tại là DEV`,
      );
      console.log(
       `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`,
      );
     }
     return;
    }

    const token = cookiesArray.filter(o => {
     return (o.key == "token" || o.key == " token") && o.val !== "removed";
    })[0];
    localStorage.setItem("auth._token.local", token.val);
    const res = await this.getUserInfo(token.val);
    console.log(token);
    if (res && res.data && res.data.data.user) {
     const localToken = localStorage.getItem("auth._token.local");
     const auth_set = {
      isAuth: true,
      user: res.data.data,
      token: `Bearer ${localToken}`,
     };
     store.commit("SET_USER_LOGGEDIN", auth_set);
     window.location.reload();
    } else {
     console.log(res);
     const currentUrl = window.location.origin;
     if (process.env.VUE_APP_ENV !== "DEV") {
      window.location.href =
       process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
     } else {
      console.log(`Có token được lưu nhưng không thể sử dụng`);
      console.log(
       `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`,
      );
     }
    }
   } else {
    const currentUrl = window.location.origin;
    if (process.env.VUE_APP_ENV !== "DEV") {
     window.location.href =
      process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
    } else {
     console.log(
      `Không có token được lưu tại cookie, môi trường hiện tại là DEV`,
     );
     console.log(
      `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`,
     );
    }
   }
  },
  loginUser(payload: Record<string, string>) {
   return axios
    .post(`/api/auth/login`, payload, {
     headers: {
      Authorization: "",
     },
    })
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },
  getUserInfo(_token = "") {
   return _token
    ? axios
       .get(`/api/me?include=roles,permissions`, {
        headers: {
         Authorization: `Bearer ${_token}`,
        },
       })
       .then((res: any) => {
        return res;
       })
       .catch((err: any) => {
        return err.response;
       })
    : axios
       .get(`/api/me?include=roles,permissions`, {})
       .then((res: any) => {
        return res;
       })
       .catch((err: any) => {
        return err.response;
       });
  },

  create(payload: Record<string, unknown> = {}) {
   return axios
    .post(`/api/roles?include=permissions`, payload)
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },

  delete(_id: number) {
   return axios({
    method: "DELETE",
    url: `api/roles/${_id}`,
   })
    .then((res: any) => {
     return res;
    })
    .catch((err: any) => {
     return err.response;
    });
  },

  update(payload: any, id: number) {
   return axios
    .put(`api/roles/${id}?include=permissions`, payload)
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
