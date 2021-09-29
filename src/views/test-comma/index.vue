<template>
 <DefaultLayout>
  <div class="px-3 test-comma" :class="isA4 ? 'a4-page' : ''">
   <ckeditor-nuxt v-model="content" :config="editorConfig" />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import Pagination from "@ckeditor/ckeditor5-pagination/src/pagination";
 import { defineComponent, ref } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import { useState } from "vuex-composition-helpers/dist";
 export default defineComponent({
  components: {
   DefaultLayout,
   "ckeditor-nuxt": () => {
    return import("@blowstack/ckeditor-nuxt");
   },
  },
  setup: (props, ctx) => {
   const { auth } = useState(["auth"]);
   const content = "<p>Content of the editor.</p>";
   const token = auth.value.token;
   const isA4 = ref<boolean>(true);
   const editorConfig = {
    toolbar: {
     //  items: ["bold", "italic", "|", "undo", "redo", "-", "numberedList", "bulletedList"],

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
     uploadUrl: process.env.BASE_URL + "/api/user/announcements/upload-image",
     headers: {
      Authorization: token,
     },
    },
   };
   const setIsA4 = (val: boolean) => {
    isA4.value = val;
   };
   return {
    auth,
    content,
    editorConfig,
    isA4,
    setIsA4,
   };
  },
  data() {
   return {};
  },
  created() {
   this.$store.commit("SET_BREADCRUMB", {
    viewTxt: "TEST COMMA ",
    ableToBack: false,
    rootRouter: "/",
    hasStatus: false,
    statusTxt: "",
   });
  },
  methods: {},
 });
</script>
<style lang="scss">
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
    height: calc(100vh - 212px);
    overflow-y: scroll;
    .ck.ck-focused {
     border: unset !important;
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    }
    .ck.ck-content {
     min-height: 1000px;
     border: unset !important;
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
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
</style>
