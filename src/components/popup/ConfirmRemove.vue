<template>
 <v-dialog v-model="isVisible" persistent max-width="520px">
  <v-card>
   <v-card-title class="header" :class="messErr ? 'pt-5 pb-3' : 'py-5'">
    <p class="mb-0 break-Word">
     {{ preTitle ? preTitle : "Xóa đề xuất:" }} <b class="">"{{ title }}"</b>?
    </p>
   </v-card-title>
   <v-card-text class="pb-0">
    <p class="mb-3 text-error">{{ messErr }}</p>
   </v-card-text>
   <v-card-actions class="p-4 pt-0 d-flex justify-center">
    <v-btn text @click="cancel" class="cancel white--text"> Không </v-btn>
    <v-btn
     text
     @click="confirm"
     class="yes white--text ml-4"
     :loading="loadingBtn"
    >
     Xóa
    </v-btn>
   </v-card-actions>
  </v-card>
 </v-dialog>
</template>

<script lang="ts">
 import {
  reactive,
  ref,
  defineComponent,
  toRef,
  toRefs,
 } from "@vue/composition-api";
 import { mapState } from "vuex";
 import store from "@/store";
 export default defineComponent({
  props: {
   isVisible: {
    type: Boolean,
    default: false,
   },
   handlerCancel: {
    type: Function,
   },
   handlerConfirm: {
    type: Function,
   },
   loadingBtn: {
    type: Boolean,
    default: false,
   },
   title: {
    type: String,
   },
   preTitle: {
    type: String,
   },
   messErr: {
    type: String,
   },
  },
  setup(props) {
   let handlerCancel: Record<string, any> = toRef(props, "handlerCancel");
   let handlerConfirm: Record<string, any> = toRef(props, "handlerConfirm");
   const cancel = () => {
    handlerCancel.value();
   };
   const confirm = () => {
    handlerConfirm.value();
   };
   return {
    cancel,
    confirm,
   };
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
  background-color: $txtPrimary;
  color: $primaryWhite;
  border-radius: 8px;
  padding: 0 8px;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  height: 40px;
  width: 98px;
  text-align: center;
  letter-spacing: -0.0642857px;
  padding-top: 6px;
  color: $primaryText;
  cursor: pointer;
  text-transform: capitalize;
 }
 .yes {
  padding: 0 8px;
  height: 40px;
  width: 98px;
  cursor: pointer;
  background: $dangerColor;
  mix-blend-mode: normal;
  opacity: 0.9;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  padding-top: 6px;
  text-align: center;
  letter-spacing: -0.0642857px;
  color: $primaryWhite;
  text-transform: capitalize;
 }
</style>
