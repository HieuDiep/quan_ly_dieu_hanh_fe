<template>
 <div class="cpn-text-filter display-flex align-center">
  <img src="@/assets/images/search-icon.png" height="20" alt="" />
  <input class="w-100" type="text" :placeholder="placeHolder" />
 </div>
</template>

<script>
 import { mapState } from "vuex";
 export default {
  computed: {
   ...mapState({
    placeHolder: state => state.placeHolder,
   }),
  },
 };
</script>

<style lang="scss" scoped>
 .cpn-text-filter {
  padding: 0 10px;
  border: 1px solid #dee5eb;
  border-radius: 6px;
  height: 36px;
  border: solid 1px #dee5eb;
  min-width: 350px;
  img {
   height: 16px;
  }
  input {
   padding: 0 10px;
   outline: none;
   font-size: 12px;
   &::placeholder {
    font-size: 11px;
    color: #8194a5 !important;
   }
  }
 }
</style>
