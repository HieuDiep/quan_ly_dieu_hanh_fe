<template>
 <v-dialog v-model="isVisible" persistent max-width="684">
  <v-card class="dialog-approval-detail">
   <div class="close-btn" @click="btnCancelClick">
    <img src="@/assets/images/x-arrow3x.png" width="100%" />
   </div>
   <h3 class="titleHeader">Phê duyệt</h3>
   <v-card-text>
    <p class="get-title">
     Để hoàn thiện phê duyệt, vui lòng ký duyệt các Tài liệu sau:
    </p>

    <p
     v-for="doc in leftDoc"
     :key="doc.id"
     @click="clickOnDoc(doc)"
     class="get-link"
    >
     {{ doc.name }}
    </p>
   </v-card-text>
  </v-card>
 </v-dialog>
</template>

<script lang="ts">
 import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
 import api from "@/services";
 export default defineComponent({
  components: {},
  props: {
   isVisible: {
    type: Boolean,
    default: false,
   },
   loadingBtn: {
    type: Boolean,
    default: false,
   },
   handlerCancel: {
    type: Function,
   },
   handlerSubmit: {
    type: Function,
   },
   leftDoc: {
    type: Array,
    default() {
     return [];
    },
   },
   clickOnDoc: {
    type: Function,
   },
  },
  setup: (props, ctx) => {
   let formData = ref<Record<string, any>>({});
   let formData2 = ref<Record<string, any>[]>([]);
   const changeFileUpload = (file: any) => {
    console.log(file);
   };
   const btnCancelClick = () => {
    ctx.emit("handlerCancel");
   };
   const isActive = ref<boolean>(false);
   const btnSubmitClick = () => {
    if (!formData.value.bag_ids) {
     isActive.value = true;
     return;
    }
    ctx.emit("handlerSubmit", formData.value);
   };
   return {
    btnCancelClick,
    btnSubmitClick,
    changeFileUpload,
   };
  },
  methods: {},
  watch: {},
 });
</script>

<style lang="scss">
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
  .titleHeader {
   height: 55px;
   line-height: 55px;
   font-size: 14px;
   margin-left: 24px;
   color: #8194a5;
   margin-top: -31px;
   margin-bottom: 29px;
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
</style>
