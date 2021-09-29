<template>
 <v-dialog
  v-model="isVisible"
  persistent
  max-width="80vw"
  class="dialog-scroll-y"
 >
  <v-card class="dialog-approval-detail">
   <v-card-title class="header py-5">
    <div class="d-flex justify-content-between">
     <div class="close-btn" @click="handlerCancel">
      <img src="@/assets/images/x-arrow3x.png" width="100%" />
     </div>
     <h3 class="dialog-hd">
      Xem trước tài liệu liệu mẫu
      <b v-if="selectedData.name">"{{ selectedData.name }}"</b>
     </h3>
    </div>
   </v-card-title>
   <div class="d-flex align-items-start">
    <div v-html="innerContent" class="inner-title-content"></div>
   </div>
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
 import api from "@/services";
 export default defineComponent({
  props: {
   isVisible: {
    type: Boolean,
    default: false,
   },
   handlerCancel: {
    type: Function,
   },

   selectedData: {
    type: Object,
   },
   //  innerContent: {
   //   type: String,
   //   default: "",
   //  },
  },
  data() {
   return {
    innerContent: "",
   };
  },
  watch: {
   selectedData: {
    deep: true,
    handler() {
     if (this.selectedData && this.selectedData.html) {
      this.innerContent = this.selectedData.html;
     }
    },
   },
  },
  methods: {
   //  async getTemplatePreview() {
   //   console.log(this.selectedData);
   //   if (this.selectedData) {
   //    const id = this.selectedData.id;
   //    const res = await api.template.preview(id);
   //    if (!res) {
   //     this.$store.commit("SET_SNACKBAR", {
   //      type: "error",
   //      title: "",
   //      content: "Có lỗi hệ thống khi lấy dữ liệu. Liên hệ IT để được trợ giúp.",
   //     });
   //     return;
   //    }
   //    try {
   //     if (res.status > 199 && res.status < 399) {
   //      this.innerContent = res.data.data.html;
   //     } else {
   //      this.$store.commit("SET_SNACKBAR", {
   //       type: "error",
   //       title: "",
   //       content:
   //        res.data.data.error ||
   //        res.data.message ||
   //        "Có lỗi hệ thống khi lấy dữ liệu.",
   //      });
   //     }
   //    } catch (error) {
   //     console.log(error);
   //    }
   //   }
   //  },
  },
 });
</script>
<style lang="scss" scoped>
 @import "@/assets/style/_variables.scss";
 .v-dialog .dialog-approval-detail {
  border-radius: 14px;
  padding: 35px 35px;
  & > .v-card__title {
   padding-top: 0 !important;
   padding-bottom: 30px !important;
   font-size: 32px !important;
   color: $primaryBlack;
   font-weight: 700 !important;
  }
  .close-btn {
   cursor: pointer;
   position: absolute;
   top: 24px;
   right: 21px;
   font-size: 22px;
   text-align: center;
   color: #959ca7;
   width: 36px;
   height: 36px;
   span {
    font-size: 17px;
    color: #8194a5;
   }
  }
  .dialog-hd {
   height: 55px;
   line-height: 55px;
   font-size: 14px;
   color: #8194a5;
   /* transform: translateY(-15px); */
  }
  .get-title {
   font-size: 16px;
   color: $primaryBlack;
   font-weight: bold;
   line-height: 32px;
  }
  .get-link {
   text-decoration: underline;
   color: $GPEblueText;
   cursor: pointer;
   font-size: 16px;
   line-height: 21px;
  }
  .form-item {
   .v-select {
    padding-top: 0;
    .v-select__slot {
     .v-label {
      margin-left: 15px;
     }
     .v-select__selections input {
      padding-left: 15px;
      &::placeholder {
       color: $GPEdetailData;
      }
     }
    }
    fieldset {
     border: 0.6px solid #a0a0a0;
     box-sizing: border-box;
     border-radius: 6px 6px 0px 0px;
    }
    &.feild-require {
     fieldset {
      border-color: $dangerColor;
     }
    }
   }
   .v-input--radio-group__input {
    .v-radio {
     label {
      font-weight: 400;
      font-size: 14px;
      color: $GPEdetailData;
     }
    }
   }
  }
  .border-width-2px {
   border-width: 2px !important;
  }
 }
 .button-size {
  height: 56px !important;
  padding: 0 60px !important;
  border-radius: 12px;
 }
 .inner-title-content {
  display: block;
  margin: auto;
  min-width: 21cm !important;
  max-height: calc(100vh - 250px);
  overflow-y: scroll;
  background: #fff !important;
  border: unset !important;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  min-height: 600px;
 }
 .dialog-scroll-y {
  &::-webkit-scrollbar {
   width: 4px;
   height: 6px;
   opacity: 0;
  }

  &::-webkit-scrollbar-track {
   -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
   border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
   border-radius: 10px;
  }
  &:hover {
   &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
   }
  }
 }
</style>
