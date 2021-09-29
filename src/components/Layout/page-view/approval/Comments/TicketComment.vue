<template>
  <div class="d-flex-mod justify-content-between">
    <div class="each-comment__avatar">
      <img
        :src="comment.creator ? comment.creator.avatar : '/user-icon.png'"
        alt=""
      />
    </div>
    <div class="each-comment">
      <div class="each-comment__content">
        <div class="dropdown more-expand">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <img
                v-bind="attrs"
                v-on="on"
                src="@/assets/images/more_horiz_black_24dp.svg"
                width="18px"
                alt=""
              />
            </template>
            <v-list>
              <v-list-item>
                <div
                  class="dropdown-menu comments-actions"
                  :aria-labelledby="`dropdownMenuLink${comment.id}`"
                >
                  <p
                    class="dropdown-item mb-0 dd-change-comments pointer"
                    @click="onEditComment"
                  >
                    Sửa bình luận
                  </p>
                  <p
                    class="dropdown-item mb-0 dd-remove-comments pointer"
                    @click="handleRemoveComment()"
                  >
                    Xóa bình luận
                  </p>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="content-block-top">
          <p class="content-block-top__username">
            {{ comment.creator ? comment.creator.full_name : "Unknow" }}
          </p>
          <pre
            class="content-block-top__content"
            v-html="comment.content"
          ></pre>
          <div class="list-preview-files">
            <div
              v-for="i in filesClipboardOther"
              :key="i.name"
              class="block-files my-2"
            >
              <img
                :src="i.iconic"
                alt="file-ne"
                :name="i.iconic"
                class="iconic-img"
              />
              <a class="block-file pl-2" :href="i.url" target="_blank">{{
                i.name
              }}</a>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="filesClipboardImage && filesClipboardImage.length"
        class="each-comment__file mt-2"
      >
        <div class="imgs-on-cmt">
          <div class="d-flex align-items-center">
            <div
              v-for="(img, idx) in filesClipboardImage.slice(0, 4)"
              :key="img._id"
              class="imgs"
              :class="
                idx === 3 && filesClipboardImage.length > 4 ? 'last-img' : ''
              "
            >
              <img
                :src="img.url"
                alt=""
                class="file-clip-board-imgs pointer"
                @click="onViewListImg(filesClipboardImage, idx)"
              />
              <span
                @click="onViewListImg(filesClipboardImage, idx)"
                v-if="idx === 3 && filesClipboardImage.length > 4"
                class="rest-img-coutner pointer"
                >+{{ filesClipboardImage.length - 4 }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div v-if="isOnEdit" class="comment-areas mb-3 mt-3">
        <label for="comment-attachment-edit"
          ><img
            src="@/assets/attachment.svg"
            alt=""
            class="comment-attachment pl-2 pointer"
          />
        </label>
        <input
          id="comment-attachment-edit"
          type="file"
          class="d-none"
          multiple
          @change="onChangeFile"
        />
        <textarea
          :id="`ticket-detail-text-area-${comment.id}`"
          v-model="message"
          class="w-100 cm-area focus-no-outline active-no-outline font-size-12"
          :rows="lineNumber"
          placeholder="Viết bình luận"
          @keypress.enter.exact.prevent="handleEditComment"
          @keypress.enter.prevent
          @keypress.shift.enter.exact="newline"
          @keyup.esc.exact="endEdit"
        >
        </textarea>
        <button
          class="
            btn
            active-no-outline
            focus-no-outline
            btn-close-edit
            font-size-14
            px-4
            mt-2
            d-block
            ml-auto
          "
          @click="endEdit"
        >
          Đóng
        </button>
      </div>
      <div v-if="isOnEdit" class="imgs-on-cmt">
        <div
          v-for="(img, idxe) in fileClipBoardImgs"
          :key="img._id"
          class="imgs"
        >
          <img
            :src="img.src"
            alt=""
            class="file-clip-board-imgs pointer"
            @click="onViewListImg(fileClipBoardImgs, idxe)"
          />
          <img
            src="@/assets/route-close.png"
            width="12px"
            alt=""
            class="remove-img pointer pl-1"
            @click="handleRemoveImg(img)"
          />
        </div>
      </div>
      <div v-if="isOnEdit" class="list-preview-files">
        <div
          v-for="i in filesClipboardOthers"
          :key="i.name"
          class="block-files mb-3"
        >
          <img
            :src="i.iconic"
            alt="file-ne"
            :name="i.iconic"
            class="iconic-img"
          />
          <a class="block-file" :href="i.file" target="_blank">{{ i.name }}</a>
          <img
            src="@/assets/route-close.png"
            width="12px"
            alt=""
            class="remove-img pointer pl-1"
            @click="handleRemoveImg(i)"
          />
        </div>
      </div>
      <div class="each-comment__other d-flex-mod align-items-center">
        <p class="each-comment__rep mb-0 pointer" @click="focusOnArea">
          Trả lời
        </p>
        <p class="each-comment__dotted mb-0"></p>
        <p class="each-comment__time mb-0">
          {{ parseTimeToText(comment.created_at) }}
        </p>
      </div>
    </div>
    <!-- <PreviewImage
   v-if="showPopup"
   :items="listImgPreview"
   :handler-close-popup="handlerClosePopup"
   :item-idx="itemIdx"
  /> -->
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import image1 from "@/assets/allFiles.svg";
  import image2 from "@/assets/changeAvatar.svg";
  import otherFilePdf from "@/assets/pdf-icon.png";
  import otherFileXls from "@/assets/xls-icon.png";
  import otherFileDoc from "@/assets/doc-icon.png";
  import api from "@/services";
  export default {
    props: {
      comment: {
        type: Object,
        default() {
          return {};
        },
      },
      afterUpdate: {
        type: Function,
        default() {
          return {};
        },
      },
      afterRemove: {
        type: Function,
        default() {
          return {};
        },
      },
      currentId: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        showPopup: false,
        itemIdx: 0,
        filesClipboard: [],
        onLoadingData: false,
        tempMsg: [],
        limitFiles: {
          amount: 30,
          maxFileSize: 104857600, // 100MB,
        },
        message: "",
        lineNumber: 1,
        isOnEdit: false,
      };
    },
    watch: {
      message(_newVal) {
        if (!_newVal) {
          this.lineNumber = 1;
        }
      },
      isOnEdit(_newVal) {
        if (_newVal) {
          this.$nextTick(() => {
            try {
              let numb = 1;
              let numb2 = this.message.split("\n").length;
              this.lineNumber = Math.max(numb, numb2);
            } catch (error) {
              console.log(error);
            }
          });
        }
      },
    },
    computed: {
      ...mapState({
        imageType: state => state.fileType.image,
        filesType: state => state.fileType.files,
        videoPath: state => state.fileType.video,
        excelPath: state => state.fileType.xls,
        pdfType: state => state.fileType.pdf,
        docType: state => state.fileType.doc,
      }),
      fileClipBoardImgs() {
        const arr = [...this.filesClipboard];

        arr.forEach(o => {
          o.path = this.getPathFromName(o.name);
          o.type = this.getTypeFromPath(o.path);
          o.iconic = this.getIconicFromFile(o.type);
        });
        return arr.filter(o => o.type === "image");
      },
      filesClipboardOthers() {
        const arr = [...this.filesClipboard];

        arr.forEach(o => {
          o.path = this.getPathFromName(o.name);
          o.type = this.getTypeFromPath(o.path);
          o.iconic = this.getIconicFromFile(o.type);
        });
        return arr.filter(o => o.type !== "image");
      },
      listFiles() {
        if (!this.comment.files) {
          return [];
        }
        const arr = [...this.comment.files];
        return arr || [];
      },
      filesClipboardImage() {
        const arr = [...this.listFiles];
        arr.forEach(o => {
          o.name = o.original_name;
          o.path = this.getPathFromName(o.name);
          o.type = this.getTypeFromPath(o.path);
          o.iconic = this.getIconicFromFile(o.type);
        });
        return arr.filter(o => o.type === "image");
      },
      listImgPreview() {
        const arr = [...this.filesClipboardImage];
        const ar2 = arr.map(o => {
          return {
            path: o.url,
          };
        });
        return ar2;
      },
      filesClipboardOther() {
        const arr = [...this.listFiles];
        arr.forEach(o => {
          o.name = o.original_name;
          o.path = this.getPathFromName(o.name);
          o.type = this.getTypeFromPath(o.path);
          o.iconic = this.getIconicFromFile(o.type);
        });
        return arr.filter(o => o.type !== "image");
      },
      isMe() {
        if (!this.comment.creator) {
          return false;
        }
        const sender_asgl_id = String(
          this.comment.creator.asgl_id
        ).toLowerCase();
        const user_asgl_id = String(this.$auth.user.asgl_id).toLowerCase();

        return sender_asgl_id === user_asgl_id;
      },
    },
    methods: {
      // File handle
      getPathFromName(_str) {
        try {
          if (!_str || !_str.includes(".")) {
            return "unknow";
          }
          return _str.split(".").pop();
        } catch (error) {
          console.log(error);
          return "unknow";
        }
      },
      getTypeFromPath(_str) {
        if (!_str || _str === "unknow") {
          return "unknow";
        }
        if (this.imageType.includes(_str)) {
          return "image";
        }
        if (this.videoPath.includes(_str)) {
          return "video";
        }
        if (this.pdfType.includes(_str)) {
          return "otherFilePdf";
        }
        if (this.docType.includes(_str)) {
          return "otherFileDoc";
        }
        if (this.excelPath.includes(_str)) {
          return "otherFileXls";
        }
        return "otherFile";
      },
      getIconicFromFile(_str) {
        switch (_str) {
          case "image":
            return image1;
          case "video":
            return image2;
          case "otherFilePdf":
            return otherFilePdf;
          case "otherFileXls":
            return otherFileXls;
          case "otherFileDoc":
            return otherFileDoc;
          default:
            return otherFileDoc;
        }
        // return _str;
      },
      getEndpoint(body) {
        let ar = body.split("/").pop();
        let stringName = String(ar);
        let prevDotName = stringName.slice(0, stringName.lastIndexOf("."));
        let txt = "";
        if (prevDotName.length > 15) {
          txt = prevDotName.slice(0, 12) + "...";
        } else {
          if (this.nameImg || this.nameFile) {
            txt = prevDotName + ".";
          } else {
            txt = prevDotName;
          }
        }
        return `${txt}${stringName.split(".").pop()}`;
      },
      // end
      parseTimeToText(date) {
        if (!date) {
          return "";
        }
        let timeFomart = "";
        let now = new Date();
        let _date = new Date(date);
        let militiSecond = now.getTime() - _date.getTime();
        let dayTime = 1000 * 3600 * 24;
        let hourTime = 1000 * 3600;
        militiSecond <= hourTime
          ? (() => {
              let time = Math.round(Math.abs(militiSecond / (1000 * 60)));
              if (!time) {
                timeFomart = "Vừa xong";
              } else {
                timeFomart = time + " phút trước";
              }
            })()
          : (() => {
              militiSecond > hourTime && militiSecond <= dayTime
                ? (() => {
                    let time = Math.round(Math.abs(militiSecond / hourTime));
                    timeFomart = time + " giờ trước";
                  })()
                : (() => {
                    let time = Math.round(Math.abs(militiSecond / dayTime));
                    timeFomart = time + " ngày trước";
                  })();
            })();

        return timeFomart;
      },
      focusOnArea() {
        this.$nextTick(() => {
          const area = document.querySelector("#ticket-detail-text-area");
          if (area) {
            area.focus();
          }
        });
      },
      handlerClosePopup() {
        this.showPopup = false;
        this.itemIdx = -1;
      },
      handlePreviewImg(idx) {
        this.itemIdx = idx;
        this.showPopup = true;
      },
      async handleRemoveComment() {
        const res = await api.approval.deleteComment(
          this.currentId,
          this.comment.id
        );
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
            this.afterRemove(this.comment.id);
          } else {
            // messageErr.value = res.data.data.error || res.data.message;
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
          }
        } catch (error) {
          //  messageErr.value = error;
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      handleRemoveImg(img) {
        this.filesClipboard = this.filesClipboard.filter(
          o => o._id !== img._id
        );
      },
      newline() {
        this.message = `${this.message}\n`;
        this.lineNumber += 1;
      },
      async handleEditComment() {
        const oldFile = this.filesClipboard.filter(o => o.id);
        const newFile = this.filesClipboard.filter(o => !o.id);
        const files = newFile.map(o => {
          return o.blob;
        });
        const formData = new FormData();
        formData.append("content", this.message);
        files.forEach((o, idx) => {
          formData.append(`files[${idx}]`, o);
        });
        oldFile.forEach((o, idx) => {
          formData.append(`file_ids[${idx}]`, o.id);
        });

        this.message = "";
        this.filesClipboard = [];

        const res = await api.approval.updateComment(
          this.currentId,
          this.comment.id,
          formData
        );
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
            this.endEdit();
            this.afterUpdate(res.data.data.comment);
          } else {
            // messageErr.value = res.data.data.error || res.data.message;
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
          }
        } catch (error) {
          //  messageErr.value = error;
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      onEditComment() {
        this.isOnEdit = true;
        this.message = this.comment.content;
        this.filesClipboard = this.comment.files.map(o => {
          return {
            id: o.id,
            _id: `${new Date().getTime()}_${Math.random()}`,
            name: o.original_name,
            blob: o.url,
            src: o.url,
          };
        });
        this.$nextTick(() => {
          try {
            const area = document.querySelector(
              `#ticket-detail-text-area-${this.comment.id}`
            );
            if (area) {
              area.focus();
            }
          } catch (error) {
            console.log(error);
          }
        });
      },
      endEdit() {
        this.isOnEdit = false;
        this.message = "";
        this.filesClipboard = [];
      },
      onChangeFile(event) {
        const files = event.target.files;
        if (
          files.length + this.filesClipboard.length >
          this.limitFiles.amount
        ) {
          alert("Số lượng file quá lớn !");
          return;
        }
        for (const file of files) {
          // console.log(file.name);
          if (file.size > this.limitFiles.maxFileSize) {
            // valid size
            this.confirm.showConfirm = true;
            alert("File quá lớn !");

            return;
          }
          if (file.type.includes("image")) {
            const reader = new FileReader();
            reader.onload = async event => {
              const img = document.createElement("img");
              img.src = event.target.result;
              this.filesClipboard = [
                ...this.filesClipboard,
                {
                  _id: `${new Date().getTime()}_${Math.random()}`,
                  name: file.name,
                  src: event.target.result,
                  type: "image",
                  blob: file,
                  sizes: file.size,
                },
              ];
            };
            reader.readAsDataURL(file);
          } else {
            this.filesClipboard = [
              ...this.filesClipboard,
              {
                _id: `${new Date().getTime()}_${Math.random()}`,
                name: file.name,
                type: "file",
                blob: file,
                sizes: file.size,
              },
            ];
          }
        }
      },
      onViewListImg(listImg, idx = 0) {
        this.$store.commit("SET_LIST_IMAGE_PREVIEW", listImg);
        this.$store.commit("SET_INDEX_IMAGE_PREVIEW", idx);
      },
    },
  };
</script>

<style lang="scss">
  .each-comment {
    width: 100%;
    display: flex;
    flex-flow: column;
    /* width: calc(100% - 48px); */
    /* justify-content: space-between; */
    &__avatar {
      width: 30px;
      height: 30px;
      margin-right: 8px;
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 100%;
      }
    }
    &__content {
      position: relative;
      .more-expand {
        position: absolute;
        top: 12px;
        right: 12px;
        display: none;
      }
      &:hover {
        .more-expand {
          display: block;
        }
      }
    }
    .content-block-top {
      width: 100%;
      border-radius: 8px;
      background-color: #f6f6f6;
      padding: 8px;
      &__username {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.36;
        text-align: left;
        color: #30373e;
        margin-bottom: 2px;
      }
      &__content {
        white-space: pre-wrap;
        font-family: "Roboto";
        margin-bottom: 0;
      }
    }
    &__rep {
      font-family: Roboto;
      font-size: 10px;
      font-weight: 500;
      line-height: 1.33;
      color: #30373e;
    }
    &__dotted {
      width: 12px;
      height: 15px;
      position: relative;
      &::before {
        position: absolute;
        content: "";
        width: 2px;
        height: 2px;
        border-radius: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #000;
      }
    }
    &__time {
      font-size: 10px;
      line-height: 1.33;
      color: #808890;
    }

    .comments-actions {
      border: unset !important;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      padding: 10px 12px;
    }
    .comment-areas {
      display: flex;
      border-radius: 20px;
      background-color: #f6f6f6;
      align-items: flex-start;
      img.comment-attachment {
        padding: 6px;
      }
      .cm-area {
        padding: 8px 12px;
        border: unset !important;
        background-color: transparent;
        resize: none;
      }
    }
    .file-clip-board-imgs {
      height: 120px;
      width: 120px;

      object-fit: cover;
      border-radius: 4px;
    }
    .imgs-on-cmt {
      display: flex;
      flex-wrap: wrap;
      .imgs {
        margin-right: 6px;
        /* padding-right: 6px; */
        margin-bottom: 6px;
        position: relative;
        position: relative;
        overflow: hidden;
        .rest-img-coutner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          border-radius: 4px;
          height: calc(100% - 6px);
          background: #66666648;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }
        .remove-img {
          position: absolute;
          top: 1px;
          right: 1px;
          cursor: pointer;
        }
        &:hover {
          .remove-img {
            width: 14px;
          }
        }
      }
    }
    .list-preview-files {
      .block-files {
        .iconic-img {
          height: 24px;
        }
        .block-file {
          font-size: 16px;
          color: #006a9b;
        }
      }
    }
    .btn-close-edit {
      color: rgb(184, 46, 46);
      font-weight: 500;
    }
  }
  .dd-change-comments {
    font-family: Roboto;
    font-size: 14px;
    line-height: 1.36;
    color: #30373e;
    &:hover {
      background-color: rgba(136, 136, 136, 0.083) !important;
      color: #30373e !important;
    }
  }
  .dd-remove-comments {
    font-family: Roboto;
    font-size: 14px;
    line-height: 1.36;
    color: #ec3f5d;
    &:hover {
      background-color: rgba(136, 136, 136, 0.083) !important;
      color: #ec3f5d !important;
    }
  }
  .content-block-top__content {
    font-size: 12px !important;
  }
</style>
