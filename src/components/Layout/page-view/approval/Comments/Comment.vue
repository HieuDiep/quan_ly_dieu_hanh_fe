<template>
 <div class="list-comment">
  <!-- <v-subheader>REPORTS</v-subheader> -->
  <v-list-item v-model="selectedItem" color="primary">
   <v-list-item-content class="d-flex">
    <div class="d-block img-new avata-comment">
     <img :src="dataComment.creator.avatar ? dataComment.creator.avatar : ''" />
    </div>
    <v-card-text class="text-xs-left pt-0 pl-2" style="position: relative">
     <div class="block-comment">
      <h6 class="category fw-500">
       {{
        dataComment.creator && dataComment.creator.full_name
         ? dataComment.creator.full_name
         : "-"
       }}
      </h6>
      <pre class="comment-text fw-400" v-html="dataComment.content"></pre>
      <a :href="dataComment.image" target="_blank">
       <img
        v-if="dataComment.image"
        :src="dataComment.image"
        alt=""
        height="100px"
        style="margin-top: 10px"
       />
      </a>
     </div>
     <!-- <v-menu
            v-if="dataComment.creator.id === this.user.id"
            bottom
            right
            content-class="dropdown-menu"
            offset-y
            transition="slide-y-transition"
            style="
              position: absolute;
              top: 6px;
              margin-left: 15px;
              font-size: 19px;
              font-weight: 700;
              color: #8c8d90;
            "
          >
            <div slot="activator" v-ripple class="toolbar-items">
              <v-badge overlap> ... </v-badge>
            </div>
            <v-card class="">
              <v-list style="width: 200px" dense>
                <v-list-tile
                  style="height: 22px"
                  class="v-listitem"
                  @click="handleOpenEdit(dataComment)"
                >
                  <v-list-tile-title
                    style="height: 22px"
                    v-text="'Chỉnh sửa'"
                  />
                </v-list-tile>
                <v-list-tile
                  style="height: 22px"
                  class="v-listitem"
                  @click="handleRemove(dataComment.id)"
                >
                  <v-list-tile-title style="height: 22px" v-text="'Xóa'" />
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu> -->
     <div class="font-weight-thin action-comment">
      <span
       class="inline-block mb-0 font-size-12 btn-action"
       :class="dataComment.is_like ? 'islike' : ''"
       @click.stop="handleLike(dataComment)"
      >
       Thích
      </span>
      <span class="dotted">.</span>
      <span
       class="inline-block mb-0 font-size-12 btn-action"
       @click.stop="handleReplay(dataComment)"
       >Trả lời</span
      >
      <span class="dotted">.</span>
      <span
       v-if="retry"
       class="inline-block mb-0 font-size-12 btn-action"
       @click.stop="handleComment"
       >Thử lai</span
      >
      <span v-if="retry" class="dotted">.</span>
      <span
       class="inline-block mb-0 fw-400 font-size-12"
       style="color: #808890"
       >{{ dataComment.time_diff ? dataComment.time_diff : "Bây giờ" }}</span
      >
     </div>
    </v-card-text>
   </v-list-item-content>
   <div
    v-if="dataComment.feed_back && dataComment.feed_back.length"
    class="pl-5 pt-0"
   >
    <div v-if="!showAllFb" class="shorted-feed_back" @click="showAllFb = true">
     <img src="/here-cmt.png" alt="" />
     <img
      :src="
       dataComment.feed_back[dataComment.feed_back.length - 1].avatar
        ? dataComment.feed_back[dataComment.feed_back.length - 1].avatar
        : 'http://humg.edu.vn/Publishing_Resources/web/images/noavatar.gif'
      "
      class="img-fb-prv"
     />
     <span class="named-lastest">
      {{
       dataComment.feed_back[dataComment.feed_back.length - 1].creator.full_name
      }}
      đã trả lời
     </span>
     <div class="dotted">.</div>
     {{ dataComment.feed_back.length }} bình luận
     <div class="dotted">.</div>
     <span class="timing-shown">
      {{ dataComment.feed_back[dataComment.feed_back.length - 1].time_diff }}
     </span>
    </div>
    <v-list-item
     v-for="(item, i) in dataComment.feed_back"
     v-else
     :key="i"
     class="d-block"
    >
     <v-list-item-content class="d-flex">
      <div slot="offset" class="mx-auto d-block img-new avata-comment">
       <img :src="item.creator.avatar ? item.creator.avatar : ''" />
      </div>
      <v-card-text class="text-xs-left pt-0 pl-2">
       <div class="block-comment">
        <h6 class="category fw-500 font-16">
         {{
          item.creator && item.creator.full_name ? item.creator.full_name : "-"
         }}
        </h6>
        <h6 class="comment-text fw-400 font-16">
         {{ item.content ? item.content : "" }}
        </h6>
        <a :href="item.image" target="_blank">
         <img
          v-if="item.image"
          :src="item.image"
          alt=""
          height="100px"
          style="margin-top: 10px"
         />
        </a>
       </div>
       <v-menu
        v-if="item.creator.id === user.id"
        bottom
        right
        content-class="dropdown-menu"
        offset-y
        transition="slide-y-transition"
        style="
         position: absolute;
         top: 6px;
         margin-left: 15px;
         font-size: 19px;
         font-weight: 700;
         color: #8c8d90;
        "
       >
        <div slot="activator" v-ripple class="toolbar-items">
         <v-badge overlap> ... </v-badge>
        </div>
        <v-card class="">
         <v-list style="width: 200px" dense>
          <v-list-tile
           style="height: 22px"
           class="v-listitem"
           @click="handleOpenEdit(item, item.parent_id)"
          >
           <v-list-tile-title style="height: 22px" v-text="'Chỉnh sửa'" />
          </v-list-tile>
          <v-list-tile
           style="height: 22px"
           class="v-listitem"
           @click="handleRemove(item.id, item.parent_id)"
          >
           <v-list-tile-title style="height: 22px" v-text="'Xóa'" />
          </v-list-tile>
         </v-list>
        </v-card>
       </v-menu>
       <div class="fw-400 action-comment" style="color: #808890">
        <span
         class="inline-block mb-0 font-12 btn-action"
         :class="item.is_like ? 'islike' : ''"
         @click.stop="handleLike(dataComment, item)"
         >Thích</span
        >
        <span class="dotted">.</span>
        <span
         class="inline-block mb-0 font-12 btn-action"
         @click.stop="handleReplay(dataComment)"
         >Trả lời</span
        >
        <span class="dotted">.</span>
        <span
         v-if="retry"
         class="inline-block mb-0 font-12 btn-action"
         @click.stop="handleComment"
         >Thử lại</span
        >
        <span v-if="retry" class="dotted">.</span>
        <span class="inline-block mb-0 font-12">{{
         item.time_diff ? item.time_diff : "Bây giờ"
        }}</span>
       </div>
      </v-card-text>
     </v-list-item-content>
     <div
      v-if="relayId === item.id"
      style="margin-bottom: 10px"
      class="comment-action pt-2"
     >
      <div v-if="srcImageReply" class="preview-comment row mx-0">
       <div class="box-preview">
        <!-- <v-icon @click="removeImgReply">mdi-close-circle</v-icon> -->
        <img
         v-if="item.image"
         id="img-preview-reply"
         :src="item.image"
         alt=""
         height="50px"
        />
        <img
         v-if="!item.image"
         id="img-preview-reply"
         src
         alt=""
         height="50px"
        />
       </div>
      </div>
      <div v-if="relayId" class="preview-name-reply row mx-0">
       <div class="">
        <p class="mb-0 font-size-12">
         <span class="font-weight-bold">Sửa bình luận</span>
        </p>
        <span class="action-cancel font-size-12 pl-2" @click="handleEsc"
         >Hủy</span
        >
       </div>
      </div>
      <div class="row-comment row mx-0">
       <div slot="offset" class="d-block img-new mr-2 avata-comment">
        <img :src="user.avatar ? user.avatar : ''" />
       </div>
       <v-col
        id="user-text-area-wp-reply"
        cols="12"
        sm="6"
        class="input-comment"
       >
        <v-textarea
         ref="commentsTypingArea"
         v-model="commentMeReply2"
         autofocus
         class="text-comment-reply"
         auto-grow
         :placeholder="
          relayId
           ? `Trả lời ${
              commentsUser && commentsUser.id == user.id
               ? 'bản thân.'
               : ' ' + relayName + '.'
             }`
           : 'Viết bình luận'
         "
         outlined
         rows="1"
         row-height="20"
         style="width: calc(100% - 39px); display: inline-block"
         @keyup.enter.exact="handleEditComment"
         @keydown.enter.exact.prevent
         @keyup.Escape.exact="handleEsc"
         @keydown.Escape.exact.prevent
         @keydown.enter.shift.exact="newlineReply"
        ></v-textarea>
        <label class="smile d-none" for="upfile-reply"
         ><v-icon>mood</v-icon></label
        >
        <label class="up-load mr-2" for="upfile-reply"
         ><img src="/imgs/insert_photo.png"
        /></label>
        <input
         id="upfile-reply"
         accept="image/jpeg,image/png"
         type="file"
         class="d-none"
         name=""
         @change="onChangeFileReply"
        />
        <!-- <p class="send-button" @click="handleEditComment">GỬI</p> -->
       </v-col>
      </div>
     </div>
    </v-list-item>
   </div>
   <div
    v-if="relayId === dataComment.id && toggleNew === true"
    class="pl-5 pt-2 comment-action"
   >
    <v-row v-if="srcImageReply" class="preview-comment">
     <div class="box-preview">
      <v-icon @click="removeImgReply">mdi-close-circle</v-icon>
      <img id="img-preview-reply" src="" alt="" height="50px" />
     </div>
    </v-row>
    <v-row v-if="relayId" class="preview-name-reply">
     <div class="">
      <p class="mb-0 font-size-12">
       Trả lời
       <span class="font-weight-bold pl-1">{{
        commentsUser && commentsUser.id == user.id
         ? " Bản thân."
         : " " + relayName + " ."
       }}</span>
      </p>
      <span class="action-cancel font-size-12 pl-2" @click="handleEsc"
       >Hủy</span
      >
     </div>
    </v-row>
    <v-row class="row-comment">
     <div class="d-block img-new mr-2">
      <img
       :src="
        user.avatar
         ? user.avatar
         : 'http://humg.edu.vn/Publishing_Resources/web/images/noavatar.gif'
       "
      />
     </div>
     <v-col id="user-text-area-wp-reply" cols="12" sm="6" class="input-comment">
      <v-textarea
       ref="commentsTypingArea"
       v-model="commentMeReply2"
       autofocus
       class="text-comment-reply"
       auto-grow
       :placeholder="
        relayId
         ? `Trả lời ${
            commentsUser && commentsUser.id == user.id
             ? 'bản thân.'
             : ' ' + relayName + '.'
           }`
         : 'Viết bình luận'
       "
       outlined
       rows="1"
       row-height="20"
       style="width: calc(100% - 39px); display: inline-block"
       @keyup.enter.exact="handleReply"
       @keydown.enter.exact.prevent
       @keyup.Escape.exact="handleEsc"
       @keydown.Escape.exact.prevent
       @keydown.enter.shift.exact="newlineReply"
      ></v-textarea>
      <label class="smile d-none" for="upfile-reply"
       ><v-icon>mood</v-icon></label
      >
      <label class="up-load mr-2" for="upfile-reply"
       ><img src="/imgs/insert_photo.png"
      /></label>
      <input
       id="upfile-reply"
       accept="image/jpeg,image/png"
       type="file"
       class="d-none"
       name=""
       @change="onChangeFileReply"
      />
      <!-- <p class="send-button" @click="handleReply">GỬI</p> -->
     </v-col>
    </v-row>
   </div>
   <div
    v-if="relayId === dataComment.id && toggleEdit === true"
    style="margin-bottom: 10px"
    class="pl-5 pt-2 comment-action"
   >
    <v-row v-if="srcImageReply" class="preview-comment">
     <div class="box-preview">
      <v-icon @click="removeImgReply">mdi-close-circle</v-icon>
      <img
       v-if="dataComment.image"
       id="img-preview-reply"
       :src="dataComment.image"
       alt=""
       height="50px"
      />
      <img
       v-if="!dataComment.image"
       id="img-preview-reply"
       src
       alt=""
       height="50px"
      />
     </div>
    </v-row>
    <v-row v-if="relayId" class="preview-name-reply">
     <div class="">
      <p class="mb-0 font-size-12">
       <span class="font-weight-bold">Sửa bình luận</span>
      </p>
      <span class="action-cancel font-size-12 pl-2" @click="handleEsc"
       >Hủy</span
      >
     </div>
    </v-row>
    <v-row class="row-comment">
     <div slot="offset" class="d-block img-new mr-2 avata-comment">
      <img :src="user.avatar ? user.avatar : ''" />
     </div>
     <v-col id="user-text-area-wp-reply" cols="12" sm="6" class="input-comment">
      <v-textarea
       ref="commentsTypingArea"
       v-model="commentMeReply2"
       autofocus
       class="text-comment-reply"
       auto-grow
       :placeholder="
        relayId
         ? `Trả lời ${
            commentsUser && commentsUser.id == user.id
             ? 'bản thân.'
             : ' ' + relayName + '.'
           }`
         : 'Viết bình luận'
       "
       outlined
       rows="1"
       row-height="20"
       style="width: calc(100% - 39px); display: inline-block"
       @keyup.enter.exact="handleEditComment"
       @keydown.enter.exact.prevent
       @keyup.Escape.exact="handleEsc"
       @keydown.Escape.exact.prevent
       @keydown.enter.shift.exact="newlineReply"
      ></v-textarea>
      <label class="smile d-none" for="upfile-reply"
       ><v-icon>mood</v-icon></label
      >
      <label class="up-load mr-2" for="upfile-reply"
       ><img src="/imgs/insert_photo.png"
      /></label>
      <input
       id="upfile-reply"
       accept="image/jpeg,image/png"
       type="file"
       class="d-none"
       name=""
       @change="onChangeFileReply"
      />
      <!-- <p class="send-button" @click="handleEditComment">GỬI</p> -->
     </v-col>
    </v-row>
   </div>
  </v-list-item>
 </div>
</template>
<script>
 export default {
  props: {
   dataComment: {
    type: Object,
    default() {
     return {};
    },
   },
   handleIdReplay: {
    type: Function,
    default() {},
   },
   handleLikeComment: {
    type: Function,
    default() {},
   },
   handleEditComment: {
    type: Function,
    default() {},
   },
   handleRemoveComment: {
    type: Function,
    default() {},
   },
   handleIdEdit: {
    type: Function,
    default() {},
   },
   handleComment: {
    type: Function,
    default() {},
   },
   handleReply: {
    type: Function,
    default() {},
   },
   retry: {
    type: Boolean,
    default: false,
   },
   user: {
    type: Object,
    default() {},
   },
   relayId: {
    type: Number,
    default: null,
   },
   relayName: {
    type: String,
    default: "",
   },
   commentsUser: {
    type: Array,
    default() {},
   },
   handleEsc: {
    type: Function,
    default() {},
   },
   commentMeReply: {
    type: String,
    default: "",
   },
   srcImageReply: {
    type: Boolean,
    default: false,
   },
   removeImgReply: {
    type: Function,
    default() {},
   },
   onChangeFileReply: {
    type: Function,
    default() {},
   },
   newlineReply: {
    type: Function,
    default() {},
   },
   toggleNew: {
    type: Boolean,
    default: false,
   },
   toggleEdit: {
    type: Boolean,
    default: false,
   },
  },
  watch: {
   commentMeReply2() {
    this.$emit("commentMeReplyUpdated", this.commentMeReply2);
   },
   commentMeReply() {
    this.commentMeReply2 = this.commentMeReply;
   },
  },
  data: () => ({
   selectedItem: 1,
   commentMeReply2: "",
   isHover: false,
   hoverId: null,
   items: [
    { text: "Real-Time", icon: "mdi-clock" },
    { text: "Audience", icon: "mdi-account" },
    { text: "Conversions", icon: "mdi-flag" },
   ],
   showAllFb: false,
  }),
  methods: {
   // activeHover(id) {
   //   this.hoverId = id;
   //   if (this.hoverId === id) {
   //     this.isHover = true;
   //   }
   // },
   // unactiveHover(id) {
   //   this.hoverId = id;
   //   if (this.hoverId === id) {
   //     this.isHover = false;
   //   }
   // },
   handleReplay(item) {
    this.handleIdReplay(item);
    if (document.querySelector("#user-text-area-wp textarea")) {
     document.querySelector("#user-text-area-wp textarea").focus();
    }
   },
   handleLike(comment, feeback) {
    this.handleLikeComment(comment, feeback);
   },
   handleRemove(id, index) {
    this.handleRemoveComment(id, index);
   },
   handleOpenEdit(id, index) {
    this.handleIdEdit(id, index);
    this.commentMeReply2 = id.content;
   },
  },
 };
</script>
<style lang="scss">
 .v-listitem {
  height: 22px;
  cursor: pointer;
  .v-list__tile {
   height: 22px !important;
  }
 }
 .dropdown-menu .v-list__tile:hover {
  background-color: #a9a9a9 !important;
 }
 .isnot-hover {
  display: none;
 }
 .is-hover {
  display: inline-block;
 }
 .list-comment {
  .img-new {
   width: 42px !important;
   height: 42px !important;
   img {
    width: 100%;
    height: 100%;
    box-shadow: unset !important;
   }
  }
  .btn-action {
   font-weight: 500;
   color: #30373e;
  }
  .block-comment {
   border-radius: 10px;
   padding: 8px 10px;
   display: inline-block;
   background-color: #f6f6f6;
   .category {
    font-size: 14px !important;
    text-transform: capitalize;
    font-weight: 500 !important;
    color: #30373e;
   }
   .comment-text {
    margin: 0px;
    text-transform: none;
    font-size: 14px !important;
    color: #30373e;
    font-family: "Roboto";
    white-space: break-spaces !important;
   }
   img {
    box-shadow: unset !important;
   }
  }

  .action-comment {
   padding: 5px 0 5px 5px;
   span {
    font-size: 12px !important;
    cursor: pointer;
   }
  }
  .dot {
   font-size: 20px !important;
   font-weight: 500;
   color: #30373e;
   position: relative;
   top: -2px;
  }
  .btn-action.islike {
   color: #f58b3c;
  }
 }
 .comment-action {
  .row-comment {
   display: flex;

   .input-comment {
    width: calc(100% - 50px);
    position: relative;
    display: flex;
    background-color: #f6f6f6;
    border-radius: 12px;
    .text-comment-reply {
     margin-top: 0px;
     padding-top: 0px;
     .v-input__control {
      .v-input__slot {
       margin-bottom: 0px;
       .v-text-field__slot {
        textarea {
         min-height: 42px !important;
         padding: 12px 0px 12px 10px !important;
        }
       }
       &::before,
       &::after {
        display: none;
       }
      }
      .v-text-field__details {
       display: none;
      }
     }
    }
    .smile,
    .up-load {
     cursor: pointer;
     padding-top: 8px;
    }
   }
   .send-button {
    color: #0052a2;
    padding-top: 8px;
    margin-right: 16px;
    font-weight: 600;
    cursor: pointer;
   }
  }
 }
 .preview-name-reply {
  font-weight: 400;
  font-size: 12px !important;
  & > div {
   display: flex;
   align-items: center;
   margin-left: 53px;
  }
  .dot {
   position: relative;
   top: -4px;
  }
  .action-cancel {
   cursor: pointer;
  }
 }
 .preview-comment {
  .box-preview {
   padding-left: 42px;
   display: inline-block;
   position: relative;
   &:hover {
    i {
     font-size: 16px;
    }
   }
  }
  i {
   position: absolute;
   font-size: 10px;
   right: 3px;
   top: 3px;
   color: red !important;
   transition: 0.25s;
  }
  #img-preview-reply {
   border-radius: 4px;
   box-shadow: unset !important;
  }
 }
 .shorted-feed_back {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  .dotted {
   display: block;
   width: 3px;
   height: 3px;
   border-radius: 100%;
   background-color: #000;
   margin: 0 5px;
  }
  .img-fb-prv {
   width: 24px;
   height: 24px;
   border-radius: 100%;
   object-fit: cover;
  }
  .named-lastest {
   padding: 0 4px;
  }
  .timing-shown {
   color: rgb(128, 136, 144);
  }
 }
 figure {
  img {
   max-width: 100% !important;
  }
 }
 .list-comment {
  .avata-comment {
   width: 42px;
   height: 42px;
   border-radius: 100%;
   overflow: hidden;
  }
 }
</style>
