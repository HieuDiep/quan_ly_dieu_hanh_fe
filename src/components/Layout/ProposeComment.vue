<template>
  <div class="propose-comment-wr comment-wrapper">
    <div class="cmts-area" id="cmts-area" @scroll="handleScrollCommentWrapper">
      <RowComment v-if="onLoadingMoreComment || isFirstLoading" />
      <RowComment v-if="isFirstLoading" />
      <RowComment v-if="isFirstLoading" />
      <p
        v-if="
          !isFirstLoading &&
          (!listTicketCommentsSort || !listTicketCommentsSort.length)
        "
        class="no-comment"
      >
        Chưa có bình luận.
      </p>
      <div
        v-for="comment in listTicketCommentsSort"
        :key="comment.id"
        class="each-comment mb-1"
      >
        <TicketComment
          :comment="comment"
          :current-id="currentId"
          :after-update="updateComment"
          :after-remove="removeComment"
        />
      </div>
    </div>
    <div class="typing-area">
      <!-- TYPER -->
      <div class="comment-areas mb-3 mt-3">
        <label for="comment-attachment"
          ><img
            src="@/assets/attachment.svg"
            alt=""
            class="comment-attachment pl-2 pointer"
          />
        </label>
        <input
          id="comment-attachment"
          type="file"
          class="d-none"
          multiple
          @change="onChangeFile"
        />
        <textarea
          id="ticket-detail-text-area"
          v-model="message"
          class="w-100 cm-area focus-no-outline active-no-outline font-size-13"
          :rows="lineNumber"
          placeholder="Viết bình luận"
          @keypress.enter.exact.prevent="handleAddComment"
          @keypress.enter.prevent
          @keypress.shift.enter.exact="newline"
        >
        </textarea>
        <!-- <button
                @click="handleAddComment"
                class="btn active-no-outline focus-no-outline background-golden-t font-size-14 px-4 mt-2 d-block ml-auto"
              >
                Bình luận
              </button> -->
      </div>
      <div class="imgs-on-cmt">
        <div
          v-for="(img, idx) in fileClipBoardImgs"
          :key="img._id"
          class="imgs"
        >
          <img
            :src="img.src"
            alt=""
            class="file-clip-board-imgs"
            @click="onViewListImg(fileClipBoardImgs, idx)"
          />
          <img
            src="@/assets/route-close.png"
            width="12px"
            alt=""
            class="remove-img"
            @click="handleRemoveImg(img)"
          />
        </div>
      </div>
      <div class="list-preview-files">
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
            class="remove-img"
            @click="handleRemoveImg(i)"
          />
        </div>
      </div>
      <!-- END -->
    </div>
  </div>
</template>

<script>
  import TicketComment from "./page-view/approval/Comments/TicketComment.vue";
  import { tDate } from "validation_t/src";
  import api from "@/services";
  import { mapState } from "vuex";
  import { RowComment } from "@/components/Loaders";

  import image1 from "@/assets/allFiles.svg";
  import image2 from "@/assets/changeAvatar.svg";
  import otherFilePdf from "@/assets/pdf-icon.png";
  import otherFileXls from "@/assets/xls-icon.png";
  import otherFileDoc from "@/assets/doc-icon.png";
  export default {
    components: {
      TicketComment,
      RowComment,
    },
    data() {
      return {
        listTicketComments: [],
        currentId: 0,
        message: "",
        lineNumber: 1,
        id: 0,
        currentTicketDetail: {},
        ticketComments: [],
        filesClipboard: [],
        onLoadingData: false,
        onCloseTicket: false,
        tempMsg: [],
        limitFiles: {
          amount: 30,
          maxFileSize: 104857600, // 100MB,
        },
        currentCounter: 5,
        totalComment: 1,
        refScroll: null,
        onLoadingMoreComment: false,
        isFirstLoading: true,
        onLoadingComments: false,
      };
    },
    computed: {
      ...mapState({
        userObj: state => state.auth.user,
        imageType: state => state.fileType.image,
        filesType: state => state.fileType.files,
        videoPath: state => state.fileType.video,
        excelPath: state => state.fileType.xls,
        pdfType: state => state.fileType.pdf,
        docType: state => state.fileType.doc,
      }),
      listTicketCommentsSort() {
        const arr = [...this.listTicketComments];
        arr.sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        return arr;
      },
      user() {
        return this.userObj.user;
      },
      fileClipBoardImgs() {
        const arr = [...this.filesClipboard];
        return arr.filter(o => o.type === "image");
      },
      filesClipboardOthers() {
        const arr = [...this.filesClipboard];

        arr.forEach(o => {
          console.log(o.name);
          o.path = this.getPathFromName(o.name);
          o.type = this.getTypeFromPath(o.path);
          o.iconic = this.getIconicFromFile(o.type);
        });
        return arr.filter(o => o.type !== "image");
      },
    },
    mounted() {
      if (this.$route.params && this.$route.params.id) {
        this.currentId = this.$route.params.id;
        this.getAllListComments(this.currentId);
      }
    },
    watch: {
      message() {
        if (!this.message) {
          this.$nextTick(() => {
            this.lineNumber = 1;
          });
        }
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
      parseStringTime(_date) {
        if (!_date) {
          return "";
        }
        const dmy = _date.split(" ")[0];
        const time = _date.split(" ").pop();
        const dmyParse = `${dmy.slice(-2)}/${dmy.slice(5, 7)}/${dmy.slice(
          0,
          4
        )}`;
        return `${dmyParse} lúc ${time.slice(0, time.length - 3)}`;
      },
      handleLoadmoreComment() {
        if (this.currentCounter >= this.totalComment) {
          return;
        }
        this.onLoadingMoreComment = true;
        this.currentCounter += 8;
        this.getAllListComments(this.currentId, false);
      },

      async getAllListComments(id, scrollAble = true) {
        const params = {
          size: this.currentCounter,
        };
        const res = await api.approval.getListComment(id, params);
        this.onLoadingMoreComment = false;
        this.isFirstLoading = false;
        this.onLoadingComments = false;
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content:
              "Không lấy được thông tin bình luận. Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.listTicketComments = res.data.data.comments;
            this.totalComment = res.data.data.meta.pagination.total;
            this.$nextTick(() => {
              if (scrollAble) {
                this.scrollToBtm();
              }
            });
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
          console.log(error);
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      newline() {
        this.message = `${this.message}\n`;
        this.lineNumber += 1;
      },
      async handleAddComment() {
        this.lineNumber = 1;
        const files = this.filesClipboard.map(o => {
          return o.blob;
        });
        const formData = new FormData();
        formData.append("content", this.message);
        files.forEach((o, idx) => {
          formData.append(`files[${idx}]`, o);
        });
        let objst = tDate.formatDateCustomize(new Date());
        const tempId = `tempId${Math.round(Math.random() * 1000)}`;
        const objComments = {
          content: this.message,
          creatable_id: Math.round(Math.random() * 1000),
          creatable_type: "App\\User",
          created_at: `${objst.yyyy}-${objst.MM}-${objst.dd} ${objst.hh}:${objst.mm}:00`,
          id: tempId,
          _tempid: tempId,
          updated_at: `${objst.yyyy}-${objst.MM}-${objst.dd} ${objst.hh}:${objst.mm}:00`,
          creatable: {
            ...this.user,
          },
        };
        this.message = "";
        this.filesClipboard = [];
        this.tempMsg.splice(0, 0, objComments);
        const res = await api.approval.comment(this.currentId, formData);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content:
              "Không lấy được thông tin bình luận. Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.tempMsg = this.tempMsg.filter(o => o.id !== tempId);
            this.listTicketComments.push(res.data.data.comment);
            this.currentCounter += 1;
            this.$nextTick(() => {
              this.scrollToBtm();
            });
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
            content:
              "Không lấy được thông tin bình luận. Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      onChangeFile(event) {
        console.log(event.target.files);
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
      handleRemoveImg(img) {
        this.filesClipboard = this.filesClipboard.filter(
          o => o._id !== img._id
        );
      },
      scrollToBtm() {
        const area = document.querySelector("#cmts-area");
        if (area) {
          area.scrollTop = area.scrollHeight + 200;
        }
      },
      handleScrollCommentWrapper() {
        if (
          this.currentCounter >= this.totalComment ||
          this.onLoadingComments
        ) {
          return;
        }
        if (this.refScroll) {
          clearTimeout(this.refScroll);
        }
        this.refScroll = setTimeout(() => {
          const area = document.querySelector("#cmts-area");
          if (area.scrollTop < 50) {
            this.onLoadingComments = true;
            this.handleLoadmoreComment();
          }
          this.refScroll = null;
        }, 200);
      },
      updateComment(_comment) {
        const idx = this.listTicketComments.findIndex(
          o => o.id === _comment.id
        );
        if (idx !== -1) {
          this.listTicketComments.splice(idx, 1, _comment);
        }
      },
      removeComment(_id) {
        this.listTicketComments = this.listTicketComments.filter(
          o => o.id !== _id
        );
      },
      onViewListImg(listImg, idx = 0) {
        this.$store.commit("SET_LIST_IMAGE_PREVIEW", listImg);
        this.$store.commit("SET_INDEX_IMAGE_PREVIEW", idx);
      },
    },
  };
</script>

<style lang="scss">
  .typing-area {
    .comment-areas {
      display: flex;
      border-radius: 20px;
      background-color: #f6f6f6;
      align-items: flex-start;
      .cm-area {
        padding: 6px 12px;
        border: unset !important;
        background-color: transparent;
        resize: none;
      }
    }
    img.comment-attachment {
      padding: 6px;
    }
    .file-clip-board-imgs {
      height: 120px;
      max-width: 150px;
      border-radius: 4px;
      object-fit: cover;
    }
    .imgs-on-cmt {
      display: flex;
      flex-wrap: wrap;
      .imgs {
        margin-right: 6px;
        padding-right: 6px;
        margin-bottom: 6px;
        position: relative;
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
    .view-more-cm {
      font-size: 14px;
      font-weight: 600;
      &:hover {
        text-decoration: underline !important;
      }
    }
  }
  .propose-comment-wr {
    display: flex;
    flex-flow: column;
    /* height: calc(100vh - 550px); */
    height: 49%;
    padding: 12px 6px 0px 6px;
    .no-comment {
      margin: auto;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      color: #999;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cmts-area {
      height: 100%;

      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        background-color: transparent;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 0, 0, 0);
        border-radius: 3px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
      }
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: #c3c5c7;
          border-radius: 3px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        }
      }
    }
    #ticket-detail-text-area {
      &::placeholder {
        font-size: 13px;
      }
    }
  }
</style>
