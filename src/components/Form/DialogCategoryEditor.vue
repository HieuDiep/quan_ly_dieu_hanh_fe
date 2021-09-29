<template>
 <v-row justify="center" class="comma">
  <v-dialog v-model="isVisible" persistent max-width="1200">
   <v-card>
    <p class="dialog-title-m">Tài liệu mẫu</p>
    <div class="body-editor-wrapper">
     <div class="selection-config">
      <v-text-field v-model="name" label="Tên tài liệu mẫu"></v-text-field>
      <p class="mb-0">Chèn thông tin khai báo:</p>
      <div class="list-provided-param mb-3">
       <v-autocomplete
        class="pr-3 mt-0"
        :items="listParamComputed"
        item-text="caption"
        item-value="name"
        placeholder="Thông tin khai báo"
        v-model="currentCap"
        solo
       ></v-autocomplete>

       <v-btn color="#006a9b" class="btn-add" @click="handleInsertCap"
        >Thêm</v-btn
       >
      </div>
     </div>
     <div
      class="px-0 test-comma"
      :class="isA4 ? 'a4-page' : ''"
      id="edtor-wrapper_m"
     >
      <ckeditor-nuxt
       ref="myNxtEditor"
       v-model="content"
       :config="editorConfig"
      />
     </div>
    </div>
    <p class="mb-1 text-error text-center px-3">{{ errMsg }}</p>
    <v-card-actions>
     <v-spacer></v-spacer>
     <v-btn color="#fff" class="btn-close" @click="onClose">
      {{ "Đóng" }}</v-btn
     >
     <v-btn
      color="#006a9b"
      class="btn-save"
      @click="onPreview"
      :loading="loadingBtnPreview"
      :disabled="loadingBtnPreview"
     >
      {{ "Xem Trước" }}</v-btn
     >
     <v-btn color="#006a9b" class="btn-save" @click="handleSubmit">
      {{ "Lưu" }}</v-btn
     >
    </v-card-actions>
   </v-card>
  </v-dialog>
 </v-row>
</template>

<script lang="ts">
 import { defineComponent, ref } from "@vue/composition-api";
 import { tStr } from "validation_t/src";
 import api from "@/services";
 import { useState } from "vuex-composition-helpers/dist";
 export default defineComponent({
  components: {
   "ckeditor-nuxt": () => {
    return import("@blowstack/ckeditor-nuxt");
   },
  },
  props: {
   currentCateId: {
    type: Number,
    default: 1,
   },
   isVisible: {
    type: Boolean,
    default: false,
   },
   selectedTemplate: {
    type: Object,
    default() {
     return {};
    },
   },
   onClose: {
    type: Function,
   },
   onSubmit: {
    type: Function,
    default() {
     return {};
    },
   },
   handlePreview: {
    type: Function,
    default() {
     return {};
    },
   },
   listParam: {
    type: Object,
    default() {
     return {};
    },
   },
  },
  setup: (props: any, ctx: any) => {
   const { auth } = useState(["auth"]);
   let content = "<p>Content of the editor.</p>";
   const token = auth.value.token;
   const isA4 = ref<boolean>(true);
   const loadingBtnPreview = ref<boolean>(false);
   const name = ref<string>("");
   const currentCap = ref<string>("");
   const errMsg = ref<string>("");
   const selected = ref<any[]>([]);
   const editorConfig = {
    toolbar: {
     //  items: ["bold", "italic", "|", "undo", "redo", "-", "numberedList", "bulletedList"],

     shouldNotGroupWhenFull: true,
    },
    exportPdf: {},
    // pagination: {
    //  // A4
    //  pageWidth: "21cm",
    //  pageHeight: "29.7cm",

    //  pageMargins: {
    //   top: "20mm",
    //   bottom: "20mm",
    //   left: "12mm",
    //   right: "12mm",
    //  },
    // },
    removePlugins: [
     "Title",
     "CodeBlock",
     "Code",
     "MathType",
     "MediaEmbed",
     "PageBreak",
     "Subscript",
     "Superscript",
     "BlockQuote",
     "Strikethrough",
     "HorizontalLine",
     "Table",
     "FontBackgroundColor",
     "TodoList",
    ],
    simpleUpload: {
     uploadUrl: process.env.BASE_URL + "/api/user/announcements/upload-image",
     headers: {
      Authorization: token,
     },
    },
   };
   const setIsA4 = (val: boolean) => {
    isA4.value = val;
   };
   const setName = (val: string) => {
    name.value = val;
   };

   return {
    auth,
    currentCap,
    name,
    content,
    selected,
    editorConfig,
    loadingBtnPreview,
    isA4,
    setIsA4,
    setName,
    errMsg,
   };
  },
  data() {
   return {};
  },
  watch: {
   isVisible() {
    this.errMsg = "";
   },
   selected: {
    deep: true,
    handler() {
     const str = `<p class="${this.returnName(this.selected[0])}">${
      this.selected[0]
     }:{!${this.returnName(this.selected[0])}!}</p>`;
     this.content += str;
    },
   },
   selectedTemplate: {
    deep: true,
    handler() {
     if (this.selectedTemplate.id) {
      this.setName(this.selectedTemplate.name);
      this.content = this.selectedTemplate.html;
     }
    },
   },
  },
  computed: {
   listParamComputed(): any {
    if (!this.listParam) {
     return [];
    }
    const listCaption = Object.values(this.listParam);
    const listName = Object.keys(this.listParam);
    const arr = listCaption.map((o: any, idx: number) => {
     return {
      caption: o,
      name: listName[idx],
     };
    });
    return arr;
   },
   //  listParamValues(): any {
   //   if (!this.listParam) {
   //    return [];
   //   }
   //   const listCaption = Object.values(this.listParam);

   //   return listCaption || [];
   //  },
   //  listParamKeys(): any {
   //   if (!this.listParam) {
   //    return [];
   //   }
   //   const listName = Object.keys(this.listParam);

   //   return listName || [];
   //  },
  },
  // mounted() {},
  methods: {
   test() {
    console.log(this.$refs.myNxtEditor);
    // console.log(this.$refs.myNxtEditor.editor);
   },
   async onPreview() {
    const body = {
     html: this.content,
    };
    this.loadingBtnPreview = true;
    const res = await api.template.preview(this.currentCateId, body);
    this.loadingBtnPreview = false;
    if (!res) {
     this.$store.commit("SET_SNACKBAR", {
      type: "error",
      title: "",
      content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
     });
     return;
    }
    try {
     if (res.status > 199 && res.status < 400) {
      const pv = res.data.data;
      this.handlePreview(pv);
     } else {
      this.$store.commit("SET_SNACKBAR", {
       type: "error",
       title: "",
       content: res.data.data.error || res.data.message,
      });
     }
    } catch (error) {
     console.log(error);
     this.$store.commit("SET_SNACKBAR", {
      type: "error",
      title: "",
      content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
     });
    }
    console.log(res);
   },
   onEditorInput(e: any) {
    console.log(e);
   },
   onEditorFocus(e: any) {
    console.log(e);
   },
   onEditorReady() {
    const target = document.querySelector("#edtor-wrapper_m");
    if (target) {
     const toolbar = target.querySelector(".ck.ck-toolbar__items");
     console.log(toolbar);
    }
    alert("rd");
   },
   handleInsertCap() {
    if (!this.currentCap) {
     return;
    }
    const objResultCap = this.listParamComputed.filter(
     (o: any) => o.name === this.currentCap,
    );
    if (!objResultCap || !objResultCap.length) {
     return;
    }
    const str = `{!${objResultCap[0].name}!}`;
    this.content += str;
   },
   capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
   },
   returnName(_str: string) {
    if (!_str) {
     return _str;
    }
    const result = tStr.removeAscentNormal(_str);
    const arrResult = result.split(" ");
    arrResult.forEach((o: string) => {
     o = this.capitalizeFirstLetter(o);
    });
    return String(arrResult.join(""))
     .replace(/[^\w\s]/gi, "")
     .replaceAll(" ", "_");
   },
   handleChangeField(e: Event, _val: any) {
    console.log(_val);
    if (e) {
     const str = `<p class="${this.returnName(_val.caption)}">${
      _val.caption
     }:{!${_val.name}!}</p>`;
     this.content += str;
    } else {
     const str = `<p>${_val.caption}:{!${_val.name}!}</p>`;

     this.content = this.content.replaceAll(str, "");
    }
   },
   handleSubmit() {
    this.errMsg = "";
    if (!this.name) {
     this.errMsg = "Không được để trống tên tài liệu mẫu";
     return;
    }
    const obj = {
     name: this.name,
     html: this.content,
     id: 0,
    };
    if (this.selectedTemplate.id) {
     obj.id = this.selectedTemplate.id;
    }
    this.onSubmit(obj);
   },
  },
 });
</script>

<style lang="scss" scopped>
 .body-editor-wrapper {
  padding: 0px 20px 20px 20px;

  .test-comma {
   .ck.ck-editor {
    .ck.ck-toolbar {
     border: unset !important;
     border-bottom: 1px solid rgba(214, 216, 216, 0.385);
     box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
      rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    }
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
     rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    border-radius: 6px;
    overflow: hidden;
    .ck.ck-editor__main {
     background: rgba(214, 216, 216, 0.385);
     padding: 30px 40px;
     height: calc(100vh - 420px);
     overflow-y: scroll;
     .ck.ck-focused {
      border: unset !important;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
       rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
     }
     .ck.ck-content {
      min-height: 800px;
      border: unset !important;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
       rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
      p {
       margin-bottom: 2px !important;
      }
     }
    }
   }
  }

  .a4-page {
   .ck.ck-editor {
    .ck.ck-editor__main {
     .ck.ck-content {
      display: block;
      margin: auto;
      width: 21cm !important;
      min-height: 1000px;
      border: unset !important;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
       rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
     }
    }
   }
  }
 }
 .btn-save {
  box-shadow: none;
  border-radius: 8px;
  color: #fff !important;
  width: 100px;
  font-size: 14px;
  text-transform: none;

  padding: 12px 0 !important;
  height: unset !important;
 }
 .btn-close {
  box-shadow: none;
  border-radius: 8px;
  color: rgb(87, 87, 87) !important;
  width: 100px;
  font-size: 14px;
  text-transform: none;

  padding: 12px 0 !important;
  height: unset !important;
 }
 .btn-add {
  box-shadow: none;
  border-radius: 8px;
  color: #fff !important;
  height: 48px !important;
  width: 100px;
  font-size: 14px;
  text-transform: none;
  padding: 12px 0 !important;
 }
 .list-provided-param {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .v-input__control {
   .v-input__slot {
    margin-bottom: 0 !important;
    box-shadow: unset !important;
    border: 1px solid #dee5eb;
   }
   .v-text-field__details {
    display: none;
   }
  }
 }
 .dialog-title-m {
  padding: 20px 20px 0 20px;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 0 !important;
 }
</style>
