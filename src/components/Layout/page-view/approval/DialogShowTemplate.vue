<template>
  <v-dialog v-model="isVisible" persistent max-width="80vw">
    <v-card class="dialog-approval-detail">
      <div class="d-flex justify-content-between">
        <div class="close-btn" @click="btnCancelClick">
          <img src="@/assets/images/x-arrow3x.png" width="100%" />
        </div>
        <h3 class="dialog-hd">
          {{ readOnly ? "Tài liệu mẫu" : "Ký tài liệu mẫu" }}
        </h3>
      </div>
      <div class="d-flex align-items-start">
        <div v-if="!readOnly" class="btn-sign-wr pr-3">
          <v-btn
            v-if="!innerContent.sign_at"
            color="#006a9b"
            class="btn-sign"
            @click="handlerSign"
            :loading="loadingBtn"
            :disabled="loadingBtn"
          >
            {{ "Ký" }}</v-btn
          >
          <p v-else class="font-size-15 font-weight-bold">
            Bạn đã ký tài liệu này
          </p>
          <v-btn color="#006a9b" class="btn-sign d-block mt-3" @click="onPrint">
            {{ "In" }}</v-btn
          >
        </div>
        <div v-if="readOnly" class="btn-sign-wr pr-3">
          <v-btn color="#006a9b" class="btn-sign d-block mt-3" @click="onPrint">
            {{ "In" }}</v-btn
          >
        </div>
        <div
          v-html="innerContent.filled_html"
          class="inner-title-content"
        ></div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from "@vue/composition-api";
  export default defineComponent({
    components: {},
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
      innerContent: {
        type: Object,
        default() {
          return {};
        },
      },

      loadingBtn: {
        type: Boolean,
        default: false,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      handlerCancel: {
        type: Function,
      },
      handlerSign: {
        type: Function,
      },
      handlerSubmit: {
        type: Function,
      },
    },
    setup: (props: any, ctx: any) => {
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
    methods: {
      onPrint() {
        const currentId = this.$route.params.id;
        window.open(`/tai-lieu/in/${this.innerContent.id}?c=${currentId}`);
      },
    },
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
  }

  .btn-sign {
    box-shadow: none;
    border-radius: 8px;
    color: #fff !important;
    width: 100px;
    font-size: 14px;
    text-transform: none;

    padding: 12px 0 !important;
    height: unset !important;
  }
</style>
