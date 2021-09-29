<template>
  <v-dialog v-model="isVisible" persistent max-width="590">
    <v-card class="dialog-bag-detail">
      <v-card-title class="text-h5"> </v-card-title>
      <v-card-text>
        <p>Chọn từ máy tính (.PDF)</p>
        <UploadFile
          content="Tài liệu tải lên"
          @changeFileUpload="changeFileUpload"
          :icon-left="true"
        />
        <p class="mt-4">Người kí duyệt</p>
        <div class="mb-4">
          <ListItem
            name="hahaahashads"
            content="hahaahdhasdsda"
          />
        </div>
        <p class="pointer"><v-icon color="#223140" class="mr-2">mdi-plus-circle</v-icon>Thêm người kí duyệt</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="btnCancelClick"
          class="
            buton-secondary
            button-size
            border-width-2px
            mr-4
            text-transform-unset
          "
        >
          Cancel
        </v-btn>
        <v-btn
          text
          @click="btnSubmitClick"
          class="buton-primary button-size text-transform-unset"
          :loading="loadingBtn"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import UploadFile from "./UploadFile.vue";
import ListItem from "./ListItem.vue";
import api from "@/services";
export default defineComponent({
  components:{
    UploadFile,
    ListItem
  },
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
  },
  setup: (props, ctx) => {
    let formData = ref<Record<string, any>>({});
    let formData2 = ref<Record<string,any>[]>([]);
    const changeFileUpload = (file:any)=>{
      console.log(file);
    }
    const btnCancelClick = () => {
      ctx.emit("handlerCancel");
    };
    const isActive = ref<boolean>(false)
    const btnSubmitClick = () => {
      if(!formData.value.bag_ids){
        isActive.value = true;
        return
      }
      ctx.emit("handlerSubmit", formData.value);
    };
    return {
      btnCancelClick,
      btnSubmitClick,
      changeFileUpload
    };
  },
  methods: {},
  watch: {
    
  }
});
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";
.v-dialog .dialog-bag-detail {
  border-radius: 14px;
  padding: 35px 35px;
  & > .v-card__title {
    padding-top: 0 !important;
    padding-bottom: 30px !important;
    font-size: 32px !important;
    color: $primaryBlack;
    font-weight: 700 !important;
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
      fieldset{
        border: 0.6px solid #a0a0a0;
        box-sizing: border-box;
        border-radius: 6px 6px 0px 0px;
      }
      &.feild-require{
         fieldset{
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
