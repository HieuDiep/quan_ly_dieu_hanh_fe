<template>
  <div>
    <div>
      <label
        for="upload_file"
        class="box-uploadFile display-flex align-center pointer"
        :class="{
          'text-decoration-underline': underline,
          'icon-left': iconLeft,
        }"
      >
        <span>{{ content }}</span>
        <img src="@/assets/images/import-image.png" height="16" alt="" />
      </label>
      <input
        type="file"
        id="upload_file"
        class="d-none"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        multiple
        @change="handlerChangeFileUpload"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UploadFile from "@/components/Layout/page-view/propose/UploadFile.vue";
import { fileClipboardObj } from "@/InterfaceModel/Files";
import api from "@/services";
import {
  defineComponent,
  ref,
  reactive,
  toRef,
  onMounted,
} from "@vue/composition-api";
export default defineComponent({
  props: {
    content: {
      type: String,
      default: "",
    },
    underline: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: Boolean,
      default: false,
    },
    changeFileUpload: {
      type: Function,
    },
  },
  data() {
    return {
      limitFiles: {
        amount: 10,
        maxFileSize: 34952533.3333, // 100MB,
      },
    };
  },
  setup(props, ctx) {
    let fileClipboard = ref<fileClipboardObj[]>([]);
    const setfileClipboard = (payload: fileClipboardObj[]) => {
      fileClipboard.value = payload;
    };
    const clearfileClipboard = () => {
      fileClipboard.value = [{ _id: 0, type: "none", blob: "none" }];
    };
    return {
      fileClipboard,
      setfileClipboard,
      clearfileClipboard,
    };
  },
  methods: {
    handlerChangeFileUpload(e: any) {
      // const files = e.target.files || e.dataTransfer.files;
      // if (!files.length) return;
      // files.forEach((file: any) => {
      //   const reader = new FileReader();
      //   reader.onload = async (event: any) => {
      //     const img = document.createElement("img");
      //     img.src = event.target.result;
      //     const currentF = this.fileClipboard.slice();
      //     currentF.push({
      //       _id: `${new Date().getTime()}_${Math.random()}`,
      //       name: file.name,
      //       src: event.target.result,
      //       type: "image",
      //       blob: file,
      //       sizes: file.size,
      //     });
      //     this.setfileClipboard(currentF);
      //     this.$emit("changeFileUpload", this.fileClipboard);
      //   };
      //   reader.readAsDataURL(file);
      // });
      const files = e.target.files || e.dataTransfer.files;
      if (files.length + this.fileClipboard.length > this.limitFiles.amount) {
        alert("Số lượng file quá lớn !");
        return;
      }
      for (let file of files) {
        // console.log(file.name);
        if (file.size > this.limitFiles.maxFileSize) {
          // valid size
          alert("File quá lớn !");

          return;
        }
        if (file.type.includes("image/")) {
          const reader = new FileReader();
          reader.onload = async (event: any) => {
            this.fileClipboard = this.fileClipboard.concat({
              _id: `${new Date().getTime()}_${Math.random()}`,
              name: file.name,
              src: event.target.result,
              type: "image",
              blob: file,
              sizes: file.size,
            });
            this.$emit("changeFileUpload", this.fileClipboard);
          };
          reader.readAsDataURL(file);
        } else {
          this.fileClipboard = this.fileClipboard.concat({
            _id: `${new Date().getTime()}_${Math.random()}`,
            name: file.name,
            type: "file",
            blob: file,
            sizes: file.size,
          });
          this.$emit("changeFileUpload", this.fileClipboard);
        }
      }
    },
    removeGuest(idx: any) {
      this.fileClipboard.splice(idx, 1);
    },
    returnFileName(_name: any) {
      let stringName = String(_name);
      let prevDotName = stringName.slice(0, stringName.lastIndexOf("."));
      let txt = "";
      if (prevDotName.length > 15) {
        txt = prevDotName.slice(0, 12) + "...";
      } else {
        txt = prevDotName + ".";
      }
      return `${txt}${stringName.split(".").pop()}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.box-uploadFile {
  &.icon-left {
    span {
      order: 2;
    }
    img {
      order: 1;
      margin-right: 10px;
    }
  }
  &:not(.icon-left) {
    img {
      margin-left: 10px;
    }
  }
}
</style>
