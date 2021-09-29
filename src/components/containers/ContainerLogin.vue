<template>
 <div class="row">
  <div class="login-ls col-6">
   <img src="../../assets/login_bg.svg" alt="" />
  </div>
  <div class="form-login mx-auto col-6">
   <img src="../../assets/login-logo.jpg" width="172px" height="115px" />
   <!-- <h3 class="font-utm_nokia text-center text-prim logo-txt font-size-24 txt-lg">S-CONNECT</h3> -->

   <div class="login-field">
    <!-- Tài khoản -->
    <v-text-field v-model="username" label="Tên đăng nhập" outlined :rules="[rules.required]"></v-text-field>
    <small v-if="!username && clickedSubmit" class="error-msg">*Please fulfill username</small>
    <!-- Password -->
    <v-text-field
     v-model="password"
     :rules="[rules.required]"
     type="password"
     label="Mật khẩu"
     outlined
     class="input-password"
     @keyup.exact.enter="submit"
    ></v-text-field>
    <small v-if="!password && clickedSubmit" class="error-msg">*Please fulfill password</small>
    <div class="d-flex justify-content-between align-items-center mt-3">
     <div class="remember-me">
      <input v-model="rememberMe" class="checkbox d-none" type="checkbox" id="checkbox" />
      <label for="checkbox" class="text remember-label text-prim-option pointer">
       <img v-show="rememberMe" src="../../assets/rememberme.png" alt="" class="mr-3" />
       <img v-show="!rememberMe" src="../../assets/rememberme_u.png" alt="" class="mr-3" />
       Ghi nhớ đăng nhập</label
      >
     </div>
     <div class="text text-prim-option pointer">Quên mật khẩu ?</div>
    </div>
    <div v-if="isMessage" style="margin-top: 24px" class="error-msg">
     {{ isMessage }}
    </div>
   </div>
   <div class="sign-in mx-auto" @click="submit" :class="loadingLogin ? 'disable-btn-m' : ''">
    Đăng nhập<img
     v-show="loadingLogin"
     class="ml-1 loading-btn-sc"
     src="../../assets/images/loading.png"
     style="filter: brightness(0) invert(1)"
     alt=""
     height="22px"
    />
   </div>
  </div>
 </div>
</template>

<script lang="ts">
 import store from "@/store/index";
 import route from "@/router/index";
 import { defineComponent, ref } from "@vue/composition-api";
 import api from "@/services";
 import Axios from "axios";
 export default defineComponent({
  components: {},
  setup: () => {
   let username = ref<string>("");
   let password = ref<string>("");
   let isMessage = ref<string>("");
   let loadingLogin = ref<boolean>(false);
   let errorMsg = ref<string>("");
   let clickedSubmit = ref<boolean>(false);
   let rememberMe = ref<boolean>(true);

   const setLoadingLogin = (payload: boolean) => {
    loadingLogin.value = payload;
   };
   const setRememberMe = (payload: boolean) => {
    rememberMe.value = payload;
   };
   const setErrorMsg = (payload: string) => {
    errorMsg.value = payload;
   };
   const setClickedSubmit = (payload: boolean) => {
    clickedSubmit.value = payload;
   };
   const setIsMessage = (payload: string) => {
    isMessage.value = payload;
   };
   const setUsername = (payload: string) => {
    username.value = payload;
   };
   const setPassword = (payload: string) => {
    password.value = payload;
   };
   try {
    const previousLogger = localStorage.getItem("prev_account");
    if (previousLogger) {
     const logger = JSON.parse(previousLogger);
     setUsername(logger.login);
     setPassword(logger.password);
    }
   } catch (error) {
    console.log(error);
   }
   const authenticate = async (query: Record<string, string>) => {
    const res = await api.user.loginUser(query);
    if (!res) {
     setLoadingLogin(false);
     setIsMessage("Có lỗi không thể đăng nhập , vui lòng thử lại sau");
     return;
    }
    if (res.status > 399) {
     setLoadingLogin(false);
     setIsMessage(res.data.message || res.data.meta.message);
     return;
    }
    try {
     if (rememberMe.value) {
      localStorage.setItem("prev_account", JSON.stringify(query));
     } else {
      localStorage.removeItem("prev_account");
     }
     localStorage.setItem("auth._token.local", res.data.data.token);
     Axios.defaults.headers = {
      Authorization: `Bearer ${res.data.data.token}`,
     };
     const current_token = res.data.data.token;
     const resU = await api.user.getUserInfo();
     setLoadingLogin(false);
     route.push("/");
     if (!resU) {
      localStorage.removeItem("auth._token.local");
      setErrorMsg("");
      return;
     }
     try {
      if (resU.status > 399) {
       localStorage.removeItem("auth._token.local");
       setErrorMsg("");
       return;
      }
      if (resU.response && !resU.response.data.success) {
       localStorage.removeItem("auth._token.local");
       setErrorMsg("");
       return;
      }

      const auth_set = {
       isAuth: true,
       user: resU.data.data,
       token: `Bearer ${current_token}`,
      };
      store.commit("SET_USER_LOGGEDIN", auth_set);
     } catch (error) {
      console.log(error);
      setErrorMsg("");
     }
    } catch (error) {
     setLoadingLogin(false);
     console.log(error);
    }
   };
   return {
    username,
    password,
    clickedSubmit,
    loadingLogin,
    errorMsg,
    isMessage,
    rememberMe,
    setRememberMe,
    setLoadingLogin,
    setErrorMsg,
    authenticate,
    setClickedSubmit,
    setIsMessage,
   };
  },
  data() {
   return {
    rules: {
     required: (value: any) => !!value || "Không được để trống trường này.",
    },
   };
  },
  methods: {
   async submit() {
    this.setClickedSubmit(true);
    this.setErrorMsg("");
    this.setLoadingLogin(true);
    if (!this.username || !this.password) {
     this.setLoadingLogin(false);
     return;
    }
    let body = {
     login: this.username,
     password: this.password,
    };
    this.authenticate({ ...body });
   },
   handleFocusPass() {
    console.log(this);
    if (this.$refs.passwordCl) {
     const inputPassword = this.$refs.passwordCl as HTMLElement;

     if (inputPassword) {
      inputPassword.focus();
     }
    }
   },
  },
 });
</script>

<style scoped lang="scss">
 @import "@/assets/style/_variables.scss";
 ::-webkit-input-placeholder {
  /* Edge */
  color: #a6a6a6;
 }

 :-ms-input-placeholder {
  /* Internet Explorer */
  color: #a6a6a6;
 }
 .loading-btn-sc {
  margin-bottom: -5px;
  animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite; /* Safari */
 }
 ::placeholder {
  color: #a6a6a6;
 }
 .error-msg {
  color: #ff0000;
 }
 .form-login {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #ffffff;
  padding: 30px 59px 30px 59px;
  border-radius: 24px;
  height: calc(100vh);
  max-height: 100vh;
  overflow-y: auto;
  .header {
   color: $primaryBlack;
   font-size: 32px;
   font-weight: bold;
   margin-top: 18px;
  }
  .text-prim-option {
   color: #006a9b;
   font-size: 16px;
   font-weight: bold;
  }
  .notice {
   color: $primaryBlack;
   font-size: 18px;
   font-weight: 400;
   margin-top: 14px;
  }
  .login-field {
   margin-top: 20px;
   text-align: left;
   width: 450px;
   .username {
    margin-bottom: 40px;
   }
   .input {
    border: 1px solid #d8d8d8;
    width: 100%;
    outline: none;
    height: 56px;
    padding: 16px 16px 19px 16px;
    background: #f1f4f9;
    border-radius: 8px;
    font-size: 18px;
    margin-top: 15px;
    color: #a6a6a6;
   }
   .error-type {
    background-color: rgba(249, 60, 101, 0.15);
    border: 1px solid #ff0000;
   }

   .error-type-password {
    background-color: rgba(249, 60, 101, 0.15);
    border: 1px solid #ff0000;
   }
   .remember-me {
    display: flex;
    align-items: center;
    .checkbox {
     margin-right: 12px;
     height: 24px;
     width: 24px;
     cursor: pointer;
    }
   }
  }
  .sign-in {
   margin-top: 39px;
   background-color: $backgroundMain;
   padding: 8px;
   border-radius: 2px;
   opacity: 1;
   color: #ffffff;
   font-size: 18px;
   font-weight: 500;
   cursor: pointer;
   width: 450px;
  }
  .normalplaceholder {
   font-size: 18px !important;
   letter-spacing: normal !important;
  }
  .remember-label {
   display: flex;
   align-items: center;
   user-select: none;
  }
  .disable-btn-m {
   pointer-events: none;
   opacity: 0.7;
  }
  .logo-txt {
   font-size: 24px;
   color: #006a9b;
  }
 }

 .login-ls {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
   max-width: 100%;
   max-height: 100%;
  }
 }
 @keyframes spin {
  0% {
   transform: rotateZ(0deg);
  }
  70% {
   transform: rotateZ(285deg);
  }
  100% {
   transform: rotateZ(360deg);
  }
 }
</style>
