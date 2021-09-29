<template>
  <div class="bg-white">
    <div class="px-3">
      <div class="row sign-page-wr py-4">
        <div class="col-12 d-flex sign__row">
          <p
            class="
              mb-0
              sign__row__title
              text-primary-m
              pr-2
              font-weight-bold font-size-16
            "
          >
            Họ và tên:
          </p>
          <p
            class="
              mb-0
              sign__row__content
              text-primary-black-m
              font-weight-bold font-size-16
            "
          >
            {{ user ? user.full_name : "" }}
          </p>
        </div>
        <div class="col-12 d-flex sign__row">
          <p
            class="
              mb-0
              sign__row__title
              text-primary-m
              pr-2
              font-weight-bold font-size-16
            "
          >
            Chức danh:
          </p>
          <p
            class="
              mb-0
              sign__row__content
              d-flex
              flex-column
              text-primary-black-m
              font-weight-bold font-size-16
            "
          >
            <span class="font-weight-bold font-size-16">{{
              user && user.positions && user.positions.length
                ? user.positions[0].name
                : ""
            }}</span>
            <span class="font-weight-bold font-size-16">{{
              user &&
              user.positions &&
              user.positions.length &&
              user.positions[0].department
                ? user.positions[0].department.name
                : ""
            }}</span>
          </p>
        </div>
        <div class="col-12 d-flex sign__row">
          <p
            class="
              mb-0
              sign__row__title
              text-primary-m
              pr-2
              font-weight-bold font-size-16
            "
          >
            Chữ ký hiện tại:
          </p>
          <p
            class="
              mb-0
              sign__row__content
              text-primary-black-m
              font-weight-bold font-size-16
            "
          >
            <img
              v-if="currentSignature && currentSignature.signature_template"
              :src="
                currentSignature ? currentSignature.signature_template.url : ''
              "
              alt=""
              class="img-signnature"
            />
            <span v-else> Bạn hiện chưa có chữ ký được lưu </span>
          </p>
        </div>
        <div class="col-12 d-flex sign__row">
          <p
            class="
              mb-0
              sign__row__title
              text-primary-m
              pr-2
              font-weight-bold font-size-16
            "
          >
            Chữ ký:
          </p>
          <p
            class="
              mb-0
              sign__row__content
              text-primary-black-m
              font-weight-bold font-size-16
            "
          ></p>
        </div>
        <div class="col-12 sign__row sign__row--last">
          <div class="sign-pad-ele px-0">
            <div class="sign-pad-ele__header-btn py-3">
              <v-btn
                :color="currentTab === 'drawSign' ? 'blue' : 'secondary'"
                text
                class="snackbar-btn-close"
                @click="setCurrentTab('drawSign')"
              >
                Vẽ
              </v-btn>
              <v-btn
                :color="currentTab === 'fileSign' ? 'blue' : 'secondary'"
                text
                class="snackbar-btn-close"
                @click="setCurrentTab('fileSign')"
              >
                Tải lên
              </v-btn>
            </div>
            <div
              class="w-100 sign-area sign-file"
              v-show="currentTab === 'fileSign'"
            >
              <input
                type="file"
                accept="image"
                class="d-none"
                name=""
                id="file-sign-pad"
                @change="onFileChange"
              />
              <label
                for="file-sign-pad"
                class="pointer"
                @dragstart.prevent="dragstart"
                @dragover.prevent="dragover"
                @drop.prevent="dropHandler"
              >
                <img
                  v-if="!fileClipboard || !fileClipboard.src"
                  src="../../assets/upload-image-iconic.png"
                  alt=""
                  width="120px"
                  style="opacity: 0.6"
                />
                <img
                  v-if="fileClipboard && fileClipboard.src"
                  :src="fileClipboard.src"
                  alt=""
                  class="sign-img"
                />
                <p
                  v-if="!fileClipboard || !fileClipboard.src"
                  class="mb-0 desc"
                >
                  Tải lên file chữ ký của bạn
                </p>
              </label>
            </div>
            <div
              class="w-100 sign-area sign-draw"
              v-show="currentTab === 'drawSign'"
            >
              <VueSignaturePad width="100%" height="100%" ref="signaturePad" />
            </div>
          </div>
          <div class="sign-pad-ele__footer-btn pt-3">
            <v-btn
              text
              :disabled="loadingSave"
              @click="onClear"
              class="btn-undo mr-2 text-primary-m"
            >
              Hủy
            </v-btn>

            <v-btn
              color="#006a9b"
              :disabled="loadingSave"
              :loading="loadingSave"
              @click="onSave"
              class="btn-save"
            >
              Lưu
            </v-btn>
            <!-- <v-btn color="blue" text @click="undo"> Undo </v-btn> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, watch } from "@vue/composition-api";
  import api from "@/services";
  import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
  import { useState } from "vuex-composition-helpers/dist";

  import { fileClipboardObj } from "@/InterfaceModel/Files";
  import { mapState } from "vuex";
  //  import { VueSignaturePad } from "vue-signature-pad";
  export default defineComponent({
    // components: { VueSignaturePad },
    setup: props => {
      const { auth } = useState(["auth"]);
      const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
      const currentRouteQuery = ref<string>(stringQueryRender);
      const currentTab = ref<string>("drawSign");
      let fileClipboard = ref<fileClipboardObj>();
      const authVal = auth.value;
      const user = authVal.user ? authVal.user.user : null;
      const messageErr = ref<string>("");
      const loadingSave = ref<boolean>(false);
      const acceptedFiles = ["png", "jpg", "webp", "jpeg", "svg"];
      const limitFiles = {
        amount: 1,
        maxFileSize: 104857600, // 100MB,
      };
      const setFileClipboard = (payload: fileClipboardObj) => {
        fileClipboard.value = payload;
      };
      const clearFileClipboard = () => {
        fileClipboard.value = { _id: 0, type: "none", blob: "none" };
      };
      const setCurrentTab = (tab: string) => {
        currentTab.value = tab;
      };
      const setMessageErr = (str: string) => {
        messageErr.value = str;
      };
      const setLoadingSave = (flag: boolean) => {
        loadingSave.value = flag;
      };
      return {
        queryRoute,
        auth,
        user,
        currentRouteQuery,
        fileClipboard,
        currentTab,
        loadingSave,
        acceptedFiles,
        limitFiles,
        setFileClipboard,
        clearFileClipboard,
        setCurrentTab,
        messageErr,
        setMessageErr,
        setLoadingSave,
      };
    },
    computed: {
      ...mapState({
        currentSignature: (state: any) => state.signature.currentSignature,
      }),
    },
    watch: {},
    mounted() {
      //  this.$store.commit("SET_SHOWFILTER", false);
      this.$store.commit("SET_ADDLIB", false);
      this.$store.commit("SET_ADDLIBACTION", () => {
        console.log("nth");
      });
    },
    methods: {
      undo() {
        if (!this.$refs.signaturePad) {
          return;
        }
        const ele: any = this.$refs.signaturePad;
        ele.undoSignature();
      },
      save() {
        if (!this.$refs.signaturePad) {
          return;
        }
        const ele: any = this.$refs.signaturePad;
        const { isEmpty, data } = ele.saveSignature();
        if (!isEmpty) {
          this.onSubmitSign({
            signature: data,
          });
        }
      },
      clear() {
        if (!this.$refs.signaturePad) {
          return;
        }
        const ele: any = this.$refs.signaturePad;
        ele.clearSignature();
      },
      onSaveFile() {
        if (this.currentTab === "drawSign") {
          this.save();
        } else {
          const formData = new FormData();
          if (this.fileClipboard && this.fileClipboard.blob) {
            formData.append("signature", this.fileClipboard.blob);
            this.onSubmitSign(formData);
          }
        }
      },
      async onSubmitSign(payload: Record<string, any>) {
        this.setLoadingSave(true);
        const res = await api.signature.update(payload);
        this.setLoadingSave(false);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.$store.commit("SET_SNACKBAR", {
              type: "success",
              title: "",
              content: "Tạo mới chữ ký thành công.",
            });
            this.$store.dispatch("signature/getCurrentSignature");
          } else {
            this.setMessageErr(res.data.data.error || res.data.message);
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
      },
      onFileChange(e: any) {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async (event: any) => {
          const img = document.createElement("img");
          img.src = event.target.result;
          this.setFileClipboard({
            _id: `${new Date().getTime()}_${Math.random()}`,
            name: file.name,
            src: event.target.result,
            type: "image",
            blob: file,
            sizes: file.size,
          });
        };
        reader.readAsDataURL(file);
      },
      onClear() {
        if (this.currentTab === "drawSign") {
          this.clear();
        } else {
          this.clearFileClipboard();
        }
      },
      onSave() {
        if (this.currentTab === "drawSign") {
          this.save();
        } else {
          this.onSaveFile();
        }
      },
      addImages(_url = "") {
        if (!this.$refs.signaturePad) {
          return;
        }
        const ele: any = this.$refs.signaturePad;
        const imgArr = [
          {
            src: _url,
            x: 0,
            y: 0,
          },
        ];
        ele.addImages(imgArr);
      },
      dragover(e: any) {
        if (!this.ableDrag) {
          e.preventDefault();
          return;
        }
        console.log("dragover");
      },
      dragend(e: any) {
        if (!this.ableDrag) {
          e.preventDefault();
          return;
        }
        console.log("dragend");
      },
      dragstart(e: any) {
        if (!this.ableDrag) {
          e.preventDefault();
          return;
        }
        console.log("dragover");
        // console.log(e.clientY);
      },
      dropHandler(ev: any) {
        // const _this = this;
        console.log("dragged");
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        console.log(ev.dataTransfer.items);
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          if (ev.dataTransfer.items.length > this.limitFiles.amount) {
            alert("Chỉ có thể kéo thả 1 file/lần !");
          } else {
            let listFileBlob = [];
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
              let file = ev.dataTransfer.items[i].getAsFile();
              // console.log(file, 'file test');
              if (!file) {
                return;
              }
              if (!file.type.includes("image")) {
                listFileBlob.push({
                  blob: file,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                });
              }
            }
            if (
              listFileBlob.filter(o => {
                return o.size == 0;
              }).length
            ) {
              alert("File không hợp lệ !");
              return;
            }
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
              // If dropped items aren't files, reject them
              let entry = ev.dataTransfer.items[i].webkitGetAsEntry();
              if (entry.isDirectory) {
                alert("File không hợp lệ !");
                return;
              }
              if (ev.dataTransfer.items[i].kind === "file") {
                let file = ev.dataTransfer.items[i].getAsFile();
                // console.log(file);
                file.namedDot = String(
                  String(file.name).split(".").pop()
                ).toLowerCase();
                if (!this.acceptedFiles.includes(file.namedDot)) {
                  alert("File không hợp lệ !");
                  return;
                }
                if (file.size > this.limitFiles.maxFileSize) {
                  alert("File quá lớn !");
                } else {
                  if (this.acceptedFiles.includes(file.namedDot)) {
                    if (file.type.includes("image")) {
                      // console.log('img drag c2');
                      const reader = new FileReader();
                      reader.onload = async (ev: any) => {
                        const img = document.createElement("img");
                        img.src = ev.target.result;
                        this.setFileClipboard({
                          _id: `${new Date().getTime()}_${Math.random()}`,
                          name: file.name,
                          src: ev.target.result,
                          type: "image",
                          blob: file,
                          sizes: file.size,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }
              }
            }
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            // console.log(
            //   '... file[' + i + '].name = ' + ev.dataTransfer.files[i].name
            // );
          }
        }
      },
    },
  });
</script>

<style lang="scss" scopped>
  .sign-page-wr {
    width: 85%;
    max-width: 900px;
    margin: auto;
    .sign__row {
      &__title {
        width: 140px;
      }
      &--last {
        width: calc(100% - 140px);
        margin-left: auto;
        flex: unset;
      }
    }
    .sign-pad-ele {
      border-radius: 4px;
      border: solid 1px #8494a383;
      &__header-btn {
        border-bottom: solid 1px #dfe5ea;
      }
      &__footer-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .btn-save {
          box-shadow: none;
          border-radius: 8px;
          color: #fff;
          width: 100px;
          font-size: 14px;
          text-transform: none;
          padding: 12px 0 !important;
          height: unset !important;
        }
        .btn-undo {
          box-shadow: none;
          border-radius: 8px;
          width: 100px;
          font-size: 14px;
          text-transform: none;
          padding: 12px 0 !important;
          height: unset !important;
        }
      }
    }
    .sign-area {
      width: 100%;
      height: 300px;
      &.sign-file {
        label {
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          .desc {
            font-weight: 500;
            margin-top: 10px;
            font-size: 16px;
          }
          .sign-img {
            width: auto;
            max-width: 80%;
            height: auto;
            max-height: 80%;
          }
        }
      }
    }
  }
  .img-signnature {
    max-width: 300px;
    max-height: 100px;
  }
</style>
