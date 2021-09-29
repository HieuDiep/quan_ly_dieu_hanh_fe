<template>
 <v-dialog v-model="logoutIsOpen" persistent max-width="500px">
  <v-card>
   <v-card-title class="header py-5">
    <p class="mb-0 py-5 text-center">Bạn có chắc muốn đăng xuất không?</p>
   </v-card-title>
   <v-card-actions>
    <v-spacer></v-spacer>
    <div class="d-flex align-items-center justify-content-center w-100">
     <v-btn text @click="cancel" class="cancel mx-2"> Không </v-btn>
     <v-btn text @click="signOut" class="yes bg-main mx-2"> Xác nhận </v-btn>
    </div>
   </v-card-actions>
  </v-card>
 </v-dialog>
</template>

<script lang="ts">
 import { reactive, ref, defineComponent } from "@vue/composition-api";
 import { mapState } from "vuex";
 import store from "@/store";
 export default defineComponent({
  setup: () => {
   return {};
  },
  watch: {},
  computed: {
   ...mapState({
    logoutIsOpen: (state: any): boolean => state.logoutIsOpen,
   }),
  },
  methods: {
   signOut() {
    localStorage.removeItem("auth._token.local");
    store.commit("SET_LOGOUT_USER");
    this.$store.commit("CONFIRM_LOGOUT", false);

    document.cookie = "token=removed";
    document.cookie =
     "token=removed; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.asgl.net.vn";
    document.cookie =
     "token=removed; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login; domain=.asgl.net.vn";
    let currentUrl = window.location.origin;
    if (process.env.VUE_APP_ENV !== "DEV") {
     window.location.href =
      process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
    } else {
     this.$router.push("/login");
    }
   },
   cancel() {
    this.$store.commit("CONFIRM_LOGOUT", false);
   },
  },
 });
</script>
<style lang="scss" scoped>
 @import "@/assets/style/_variables.scss";
 .header {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 37px;
  letter-spacing: -0.114286px;
  color: $primaryBlack;
 }
 .cancel {
  background-color: #8194a5;
  height: 46px !important;
  color: #fff;
  font-weight: 700;
  min-width: 98px;
  width: 98px;
  border-radius: 8px;
  text-transform: none !important;
  letter-spacing: unset !important;
 }
 .yes {
  height: 46px !important;
  color: #fff;
  font-weight: 700;
  min-width: 98px;
  width: 98px;
  border-radius: 8px;
  text-transform: none !important;
  letter-spacing: unset !important;
 }
</style>
