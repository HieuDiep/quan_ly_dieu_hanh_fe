<template>
 <div class="w-100 top-marker">
  <h4>
   {{ breadCrumb.hasStatus ? breadCrumb.viewTxt + ":" : breadCrumb.viewTxt }}
  </h4>
  <div class="header-user-btn display-flex">
   <TextFilter v-if="showFilter && false" />
   <img
    v-if="addLib"
    src="../../assets/images/library_add.png"
    alt=""
    @click="addLibAction"
    class="ml-3 pointer"
   />
  </div>
 </div>
</template>

<script lang="ts">
 import Vue from "vue";
 import { mapState } from "vuex";
 import TextFilter from "@/components/Shared/TextFilter.vue";
 export default Vue.extend({
  components: { TextFilter },
  props: {},
  data() {
   return {
    items: [
     {
      text: "Sign Out",
      action: () => {
       this.$store.commit("CONFIRM_LOGOUT", true);
      },
     },
    ],
   };
  },
  computed: {
   ...mapState({
    user: (state: any) => state.auth.user.user,
    logoutIsOpen: (state: any): boolean => state.logoutIsOpen,
    isMini: (state: any): boolean => state.isMini,
    currentBreadcrumb: (state: any): any => state.currentBreadcrumb,
    breadCrumb: (state: any): any => state.breadCrumb,
    showFilter: (state: any): any => state.showFilter,
    addLib: (state: any): any => state.addLib,
    placeHolder: (state: any): any => state.placeHolder,
    addLibAction: (state: any): any => state.addLibAction,
   }),
  },
  mounted() {
   //  this.$store.commit("SET_ADDLIBACTION", this.showDialog);
  },
  methods: {
   toggleMini() {
    this.$store.commit("SET_MINI", !this.isMini);
   },
   showDialog() {
    this.$store.commit("SET_VISIBLE_DIALOG", true);
   },
  },
 });
</script>

<style lang="scss" scopped>
 @import "@/assets/style/_variables.scss";
 .top-marker {
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.16);
  height: 70px;
  background-color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;

  .bread-header {
   /* color: #fff; */
   font-weight: 400;
  }
  h4 {
   font-size: 20px;
   font-weight: 700;
  }
 }
 .header-user-btn {
  .btn-user-m {
   height: unset !important;
   color: $GPEdarkText;
   box-shadow: none !important;
   border: none !important;
   background-color: transparent !important;
   &:hover,
   &:focus,
   &:active,
   &:focus-within {
    &::before {
     display: none;
    }
   }
   .user-avatar-m {
    width: 44px;
    height: 44px;
    border-radius: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
   }
   .user-info {
    text-transform: capitalize;
    width: fit-content;
    margin-bottom: 0;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    padding: 0px 16px;
    &-name {
     text-transform: capitalize;
     white-space: nowrap;
     font-style: normal;
     font-weight: bold;
     font-size: 14px;
     line-height: 16px;
     color: $GPEdarkText;
    }
    &-pos {
     text-transform: capitalize;
     white-space: nowrap;
     font-style: normal;
     font-weight: normal;
     margin-top: 4px;
     font-size: 12px;
     line-height: 14px;
     color: $GPEgrayText;
    }
   }
  }
 }
</style>
