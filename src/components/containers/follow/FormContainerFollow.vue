<template>
  <div class="container-drafts">
    <div class="row m-0">
      <div class="drafts-left col-xxl-7">
        <div class="drafts-top px-5 bd-bottom">
          <p class="font-weight-bold mb-0">Tài liệu yêu cầu mẫu</p>
          <div>
            <p class="text-decoration-underline text-primary-color">
              BM01Phiếu đề nghị cung cấp tài sản, dịch vụ
            </p>
            <!-- <p @click="isVisible = true" class="pointer">Đính kèm tài liệu khác</p>
              <DialogPropose
                :is-visible="isVisible"
                @handlerCancel="handlerDialogCancel"
                @handlerSubmit="handlerDialogSubmit"
                :loading-btn="loadingBtn"
              /> -->
          </div>
        </div>
        <div class="drafts-bottom px-5">
          <table class="w-100">
            <tr>
              <th width="60%" class="text-left">
                <span class="font-weight-bold">Danh mục Phê duyệt</span>
              </th>
              <th width="40%" class="text-left">
                <span class="font-weight-bold">Mã số</span>
              </th>
            </tr>
            <tr>
              <td>
                <span
                  class="
                    text-primary-color
                    font-weight-bold font-size-16
                    text-uppercase
                  "
                  >Đề nghị cung cấp tài sản, dịch vụ</span
                >
              </td>
              <td>
                <input class="style-input w-100 bg-disable" type="text" />
              </td>
            </tr>
            <tr>
              <td class="text-left">
                <span class="font-weight-bold">Người đề xuất</span>
              </td>
              <td class="text-left">
                <span class="font-weight-bold">Ngày</span>
              </td>
            </tr>
            <tr>
              <td>
                <div class="cpn-list-item display-flex align-center">
                  <v-avatar size="30">
                    <img src="@/assets/logo.png" alt="Avatar" />
                  </v-avatar>
                  <div class="pl-3">
                    <p class="font-weight-bold font-size-14 mb-0">
                      Nguyễn Anh Phương
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <input class="style-input w-100" type="date" />
              </td>
            </tr>
          </table>
          <div class="mt-3">
            <p class="mb-1 font-weight-bold">Nội dung</p>
            <input class="style-input w-100" type="text" />
          </div>
          <div class="mt-3">
            <p class="mb-1 font-weight-bold">Mô tả</p>
            <div class="propose-ck-edittor">
              <!-- <ckeditor-nuxt v-model="content" :config="editorConfig" /> -->
              <textarea class="style-input w-100" name="" id="" cols="30" rows="10"></textarea>
            </div>
          </div>
          <div class="mt-3">
            <p class="mb-1 font-weight-bold">File đính kèm</p>
            <div>
              <p class="display-flex align-center pointer">
                <img
                  src="@/assets/images/icon-pdf.svg"
                  class="mr-2"
                  height="20"
                  alt=""
                />
                <span class="text-primary-color"
                  >Thông báo số 52/2021/TB-ASGL… ngày19/04/2021</span
                >
              </p>
            </div>
          </div>
          <p class="font-weight-bold mt-3">Người phê duyệt</p>
          <v-data-table
            :headers="headers"
            :items="desserts"
            :items-per-page="1000"
            class="box-shadow-unset table-approver"
            hide-default-footer
          >
            <template v-slot:item.action="{ item }">
              <v-icon color="#ce4b4b" @click="removeItem(item)">
                mdi-close-circle
              </v-icon>
            </template>
          </v-data-table>
          <v-icon class="text-primary-color pointer"> mdi-plus-circle </v-icon>
        </div>
      </div>
      <div class="drafts-right col-xxl-5">
        <DraftTabApproval />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "@vue/composition-api";
import { useState } from "vuex-composition-helpers/dist";
import {
  DraftTab,
  UploadFile,
  DialogPropose,
} from "@/components/Layout/page-view/propose";
import { DialogApproval, DraftTabApproval } from "@/components/Layout/page-view/approval";
export default defineComponent({
  components: {
    DraftTab,
    DraftTabApproval,
    UploadFile,
    DialogPropose,
    DialogApproval,
    "ckeditor-nuxt": () => {
      return import("@blowstack/ckeditor-nuxt");
    },
  },
  setup: (props, ctx) => {
    const headers = [
      {
        text: "Họ tên",
        align: "start",
        value: "name",
      },
      {
        text: "Chức danh",
        align: "start",
        value: "name",
      },
      {
        text: "Trạng thái",
        align: "start",
        value: "name",
      },
      {
        text: "Ngày phê duyệt",
        align: "start",
        value: "name",
      },
      {
        align: "start",
        value: "action",
      },
    ];
    const isVisible = ref(false);
    const loadingBtn = ref(false);
    const setIsVisible = (value) => {
      isVisible.value = value;
    };
    const { auth } = useState(["auth"]);
    const content = "<p>Content of the editor.</p>";
    const token = auth.value.token;
    const editorConfig = {
      toolbar: {
        items: [
          "Paragraph",
          "bold",
          "italic",
          "|",
          "undo",
          "redo",
          "numberedList",
          "bulletedList",
          "ImageUpload",
        ],

        shouldNotGroupWhenFull: true,
      },
      exportPdf: {},
      pagination: {
        // A4
        pageWidth: "21cm",
        pageHeight: "29.7cm",

        pageMargins: {
          top: "20mm",
          bottom: "20mm",
          left: "12mm",
          right: "12mm",
        },
      },
      removePlugins: ["Title", "CodeBlock", "Code"],
      simpleUpload: {
        uploadUrl:
          process.env.BASE_URL + "/api/user/announcements/upload-image",
        headers: {
          Authorization: token,
        },
      },
    };
    let tab = ref(1);
    let desserts = ref([
      {
        name: 1,
      },
      {
        name: 1,
      },
    ]);
    const changeFileUpload = (file) => {
      console.log(file);
    };
    const removeItem = (items) => {
      console.log(items);
    };
    return {
      headers,
      tab,
      desserts,
      isVisible,
      loadingBtn,
      content,
      editorConfig,
      changeFileUpload,
      setIsVisible,
      removeItem,
    };
  },
  methods: {
    handlerDialogCancel() {
      this.setIsVisible(false);
    },
    handlerDialogSubmit(value) {
      console.log(value);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
.container-drafts {
  .drafts-left {
    border-right: 1px solid $borderColor;
    padding: 0;
    .drafts-top {
      padding-top: 8px;
      padding-bottom: 40px;
    }
    .drafts-bottom {
      padding-top: 8px;
      padding-bottom: 20px;
    }
  }
  .container-drafts-bottom {
    padding: 42px 20px 24px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid $borderColor;
  }
}
.style-input {
  border: 1px solid $borderColor;
  border-radius: 6px;
  height: 36px;
  padding: 0 8px;
  font-size: 14px;
}
</style>
<style lang="scss">
@import "@/assets/style/_variables.scss";
.drafts-bottom {
  .table-approver {
    table tr {
      th > * {
        font-size: 14px !important;
        color: $textColorBlur;
        font-weight: normal;
      }
      td > * {
        font-size: 14px !important;
        color: $primaryBlack;
        font-weight: normal;
      }
      th,
      td {
        height: 36px !important;
      }
    }
  }
}
.propose-ck-edittor {
  .ck-toolbar {
    border-color: $borderColor !important;
    background-color: $borderColor !important;
  }
  .ck-content {
    border-color: $borderColor !important;
    border-top: 0 !important;
  }
}
</style>
