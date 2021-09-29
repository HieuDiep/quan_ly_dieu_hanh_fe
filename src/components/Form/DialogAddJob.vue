<template>
  <v-dialog v-model="isVisible" persistent max-width="622">
    <v-card class="dialog-add-job">
      <div class="close-btn" @click="btnCancelClick">
        <img src="@/assets/images/x-arrow3x.png" width="100%" />
      </div>
      <h3 class="titleHeader">
        {{ !isEdit ? "Tạo công việc mới" : "Sửa công việc" }}
      </h3>
      <div class="type-block">
        <div
          class="subject mb-30 mt-50"
          :class="errors ? { error: errors.title } : ''"
        >
          <input
            v-model="formData.title"
            class="label1"
            type="text"
            placeholder="Tiêu đề"
          />
          <p
            v-if="!formData.title && isActive"
            style="text-align: center"
            class="error-msg"
          >
            {{ errortitle }}
          </p>
        </div>
        <div class="content">
          <p class="label">Nội dung</p>
          <textarea
            id="content"
            v-model="formData.content"
            placeholder="Nhập nội dung"
            :class="
              errors && !formData.content ? { error: errors.content } : ''
            "
            name="content"
          ></textarea>
          <p v-if="!formData.content && isActive" class="error-msg">
            {{ errorDes }}
          </p>
        </div>
        <div class="members--add">
          <p class="label">
            <span>Người nhận</span>
            <i
              v-if="errors && errors.participants"
              class="fas fa-exclamation-circle"
              style="color: red; margin-left: 5px"
              title="Chưa có thành viên nào"
            ></i>
          </p>
          <p
            v-if="participants && participants.length === 0 && isActive"
            class="error-msg"
          >
            {{ errorPar }}
          </p>
          <div class="members-wrapper d-flex">
            <div class="addmember" @click="openAddMember">
              <img src="@/assets/images/Add@3x.png" width="100%" />
            </div>
            <div
              v-for="participant in participants"
              :key="participant.id"
              class="member-item"
            >
              <Avatar>
                <template #avatar>
                  <div class="wrapper-user-selected-avatar">
                    <img
                      class="icon-remove-user-selected"
                      src="@/assets/images/remove_clipboard.svg"
                      @click="handleRemoveUserSelected(participant.id)"
                    />
                    <img
                      :src="
                        `https://id-dev.asgl.net.vn/avatar/` +
                        participant.username
                      "
                      class="rounded-circle user-selected-avatar"
                      height="36px"
                      width="36px"
                      alt=""
                      @error="replaceByDefault"
                    />
                  </div>
                </template>
              </Avatar>
              <span class="user-selected-full-name">
                {{ participant.name || participant.full_name }}
              </span>
            </div>
          </div>
        </div>
        <div class="members--add">
          <p class="label">
            <span>Người theo dõi</span>
            <i
              v-if="errors && errors.followers"
              class="fas fa-exclamation-circle"
              style="color: red; margin-left: 5px"
              title="Chưa có thành viên nào"
            ></i>
          </p>
          <p
            v-if="followers && followers.length === 0 && isActive"
            class="error-msg"
          >
            {{ errorPar }}
          </p>
          <div class="members-wrapper d-flex">
            <div class="addmember" @click="openAddFollower">
              <img src="@/assets/images/Add@3x.png" width="100%" />
            </div>
            <div
              v-for="follower in followers"
              :key="follower.id"
              class="member-item"
            >
              <Avatar>
                <template #avatar>
                  <div class="wrapper-user-selected-avatar">
                    <img
                      class="icon-remove-user-selected"
                      src="@/assets/images/remove_clipboard.svg"
                      @click="handleRemoveFollowerSelected(follower.id)"
                    />
                    <img
                      :src="
                        `https://id-dev.asgl.net.vn/avatar/` + follower.username
                      "
                      class="rounded-circle user-selected-avatar"
                      height="36px"
                      width="36px"
                      alt=""
                      @error="replaceByDefault"
                    />
                  </div>
                </template>
              </Avatar>
              <span class="user-selected-full-name">
                {{ follower.name || follower.full_name }}
              </span>
            </div>
          </div>
        </div>
        <div class="date-time d-flex justify-content-between mb-30">
          <div class="date" :class="errors ? { error: errors.date } : ''">
            <div class="block">
              <p class="label">Thời hạn</p>
              <div class="input_datepicker">
                <DatePicker
                  v-model="formData.due_date"
                  value-type="format"
                  format="DD-MM-YYYY"
                  :disabled-date="notBeforeToday"
                ></DatePicker>
              </div>
            </div>
            <i class="fas fa-calendar-day iconic pointer"></i>
            <p v-if="!formData.due_date && isActive" class="error-msg">
              {{ errorDay }}
            </p>
          </div>
          <div class="estimate-time">
            <label class="switch">
              <input v-model="formData.important" type="checkbox" />
              <span class="checkmark"></span>
            </label>
            <div class="text-label">Công việc quan trọng</div>
          </div>
        </div>
        <div class="guest">
          <p class="label">Thẻ tag</p>
          <div class="guest-content">
            <input
              v-model="formData.guest"
              type="text"
              class="guest-input"
              placeholder="Điền thẻ tag & nhấn Enter"
              @keydown.exact.enter="getEmail"
            />
            <div
              v-if="guestList && guestList.length"
              style="display: flex; margin-left: 12.5px"
            >
              <div
                v-for="(o, idx) in guestList"
                v-show="idx < 2"
                :key="idx"
                class="guest-components"
              >
                {{ returnFileName(o)
                }}<img
                  src="@/assets/images/48px_route-close@3x.png"
                  height="16px"
                  width="16px"
                  @click="removeGuest(idx)"
                />
              </div>
              <div v-if="guestList && guestList.length > 2" class="guest-plus">
                + {{ guestList.length - 2 }}
              </div>
            </div>
          </div>
        </div>
        <div class="report">
          <p class="label">File đính kèm</p>
          <UploadFileApproval
            class="upload-file"
            content="Tài ảnh/file lên"
            @changeFileUpload="changeFileUpload"
            :icon-left="true"
          />
          <div v-if="formData3 && formData3.length" class="d-flex">
            <div
              class="file-components"
              v-for="(file, idx) in formDataComputed3"
              v-show="idx < 2"
              :key="idx"
            >
              {{ returnFileName2(file.name)
              }}<img
                src="@/assets/images/48px_route-close@3x.png"
                height="16px"
                width="16px"
                @click="removeFile(idx)"
              />
            </div>
            <div v-if="formData3 && formData3.length > 2" class="file-plus">
              + {{ formData3.length - 2 }}
            </div>
          </div>
        </div>
        <p class="text-error text-center">{{ errMsg2 }}</p>
      </div>
      <div class="confirm__btn">
        <!-- <div class="confirm-required d-flex">
          <div class="check-box">
            <input id="confirm-required" type="checkbox" />
            <label for="confirm-required" class="pointer">
              <i
                style="transform: translate(1px, -2px)"
                class="far fa-check"
              ></i>
            </label>
          </div>
          <label for="confirm-required" class="pointer">
            <p class="confirm-required-text">Yêu cầu người tham gia xác nhận</p>
          </label>
        </div> -->
        <v-btn
          color="#005a88"
          class="btn-yes popup__btn"
          @click="btnSubmitClick"
          :loading="loadingBtn"
          :disabled="loadingBtn"
        >
          {{ "Giao việc" }}</v-btn
        >
      </div>
      <!-- <DialogAddMember
        :is-visible-member="isVisibleMember"
        v-if="isVisibleMember"
        :participants="participants"
        :handle-change-participants="handleChangeParticipants"
        @handlerCancel="handlerDialogCancel"
      /> -->
      <DialogAddNewMember
        v-if="isVisibleMember"
        :is-visible-member="isVisibleMember"
        :member-usernames="memberUsernames"
        :participants="participants"
        :companies="companies"
        @add-new-members="addNewMembersToMetting"
        @handlerCancel="handlerDialogCancel"
      />
      <DialogAddNewMember
        v-if="isVisibleFollower"
        :is-visible-member="isVisibleFollower"
        :member-usernames="memberUsernames"
        :participants="followers"
        :companies="companies"
        @add-new-members="addNewFollowersToMetting"
        @handlerCancel="handlerDialogCancelFollower"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  computed,
} from "@vue/composition-api";
import UploadFileApproval from "../Layout/page-view/approval/UploadFileApproval.vue";
import DialogAddMember from "../Layout/page-view/approval/DialogAddMember.vue";
import Avatar from "@/components/Layout/Avatar.vue";
import DialogAddNewMember from "../Layout/page-view/approval/DialogAddNewMember.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import defaultAvatar from "@/assets/images/default-avatar2.svg";
import { fileClipboardObj } from "@/InterfaceModel/Files";
import api from "@/services";
import router from "@/router";
import { tDate } from "validation_t/src";

const now = new Date();
const _date = now.getDate().toString().padStart(2, "0");
const _month = (now.getMonth() + 1).toString().padStart(2, "0");
const _year = now.getFullYear();

const currentDateStr = `${_date}-${_month}-${_year}`;
export default defineComponent({
  components: {
    DatePicker,
    Avatar,
    UploadFileApproval,
    DialogAddMember,
    DialogAddNewMember,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    errMsg: {
      type: String,
      default: "",
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
    selectedData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup: (props, ctx) => {
    let formData = ref<Record<string, any>>({});
    let errors = ref<Record<string, any>>({});
    let formData2 = ref<fileClipboardObj[]>([]);
    let formData3 = ref<fileClipboardObj[]>([]);
    let participants = ref<Record<string, any>[]>([]);
    let followers = ref<Record<string, any>[]>([]);
    let companies = ref<Record<string, any>[]>([]);
    let memberUsernames = ref<Record<string, any>[]>([]);
    let guest = ref<any>("");
    let title = ref<string>("");
    let errortitle = ref<string>("");
    let content = ref<string>("");
    let errorDes = ref<string>("");
    let errorPar = ref<string>("");
    let errorDay = ref<string>("");
    let errMsg2 = props.errMsg;
    let is_important = ref<number>(0);
    let loadingSubmit = ref<boolean>(false);
    let isEdit = ref<boolean>(false);
    let isVisibleMember = ref<boolean>(false);
    let isVisibleFollower = ref<boolean>(false);
    let guestList = ref<Record<string, any>[]>([]);
    const changeFileUpload = (payload: fileClipboardObj[]) => {
      formData2.value = payload;
      formData3.value = payload;
    };
    const btnCancelClick = () => {
      errortitle.value = "";
      errorDes.value = "";
      errorPar.value = "";
      errorDay.value = "";
      formData.value = {};
      participants.value = [];
      followers.value = [];
      formData2.value = [];
      formData3.value = [];
      ctx.emit("handlerCancel");
    };
    const setIsVisibleMember = (payload: boolean) => {
      isVisibleMember.value = payload;
    };
    const setIsVisibleFollower = (payload: boolean) => {
      isVisibleFollower.value = payload;
    };
    const isActive = ref<boolean>(false);
    const btnSubmitClick = () => {
      if (
        !formData.value.title ||
        !formData.value.content ||
        !participants.value.length ||
        !followers.value.length ||
        !formData.value.due_date
      ) {
        isActive.value = true;
        errortitle.value = "Không được để trống tiêu đề";
        errorDes.value = "Không được để trống nội dung";
        errorPar.value = "Thêm người";
        errorDay.value = "Không được để trống ngày hạn";
        return;
      }
      ctx.emit(
        "handlerSubmit",
        formData.value,
        participants.value,
        formDataComputed3.value,
        followers.value
      );
    };
    let formDataComputed2 = computed(() => {
      const arr: Record<string, any>[] = formData2.value;
      return arr.map((o: any) => {
        return {
          ...o,
          name: o.original_name || o.name,
        };
      });
    });
    let formDataComputed3 = computed(() => {
      const arr: Record<string, any>[] = formData3.value;
      return arr.map((o: any) => {
        return {
          ...o,
          name: o.original_name || o.name,
        };
      });
    });
    return {
      errors,
      title,
      isEdit,
      formData,
      formData2,
      formDataComputed2,
      formData3,
      formDataComputed3,
      errortitle,
      content,
      errMsg2,
      isActive,
      errorDes,
      errorPar,
      errorDay,
      participants,
      followers,
      companies,
      memberUsernames,
      guestList,
      guest,
      is_important,
      loadingSubmit,
      isVisibleMember,
      isVisibleFollower,
      btnCancelClick,
      setIsVisibleMember,
      setIsVisibleFollower,
      btnSubmitClick,
      changeFileUpload,
    };
  },
  data: function () {
    let _date = currentDateStr;
    return {
      date: _date,
      loading: false,
      filterByName: "",
      users: [],
      departmentId: null,
      usersSelected: {},
      showUsers: 10,
      departments: [],
      newDepartments: [],
      checkUser: false,
      companyId: "default",
      X_API_KEY: process.env.X_API_KEY,
      BASE_URL: process.env.BASE_URL,
      modalShow: true,
      isContact: false,
      isLately: true,
      listMember: [],
      selectedContactUsername: [],
      count: 0,
      listMemberSelected: {},
      CHAT_URL: process.env.CHAT_URL,
      searchByName: "",
      filtersRecentContact: null,
      filtersContact: null,
      isLoadingUsers: false,
    };
  },
  watch: {
    selectedData: {
      deep: true,
      handler() {
        if (this.selectedData) {
          this.formData = this.selectedData;
          this.participants = this.selectedData.users_do;
          this.followers = this.selectedData.users_follow;
          this.isEdit = true;
          if (this.selectedData.due_date && this.selectedData.due_date.date) {
            this.formData.due_date = this.formatDateTimeout(
              this.selectedData.due_date.date
            );
          }
          this.formData2 = this.selectedData.attachments;
          this.formData3 = this.formData2.slice();
        }
      },
    },
  },
  computed: {},
  methods: {
    addNewMembersToMetting: function (members: any) {
      this.participants = members;
    },
    addNewFollowersToMetting: function (members: any) {
      this.followers = members;
    },
    handleChangeParticipants(_participants: any) {
      this.participants = _participants;
    },
    handleChangeFollowers(_followers: any) {
      this.followers = _followers;
    },
    getEmail() {
      this.guestList.push(this.guest);
      this.guest = "";
    },
    removeGuest(idx: any) {
      this.guestList.splice(idx, 1);
    },
    formatDateTimeout(_date: any) {
      let date = tDate.formatDateCustomize(_date);
      return `${date.dd}-${date.MM}-${date.yyyy}`;
    },
    removeFile(idx: any) {
      this.formData3.splice(idx, 1);
    },
    returnFileName2(_name: any) {
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
    notBeforeToday(date: any) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    openAddMember() {
      this.setIsVisibleMember(true);
    },
    openAddFollower() {
      this.setIsVisibleFollower(true);
    },
    handlerDialogCancel() {
      this.setIsVisibleMember(false);
    },
    handlerDialogCancelFollower() {
      this.setIsVisibleFollower(false);
    },
    returnFileName(_name: any) {
      let stringName = String(_name);
      return `${stringName}`;
    },
    replaceByDefault(e: any) {
      e.target.src = defaultAvatar;
    },
    handleRemoveUserSelected(userId: any) {
      let _usersSelected = this.participants.filter((o) => o.id !== userId);
      this.participants = _usersSelected;
    },
    handleRemoveFollowerSelected(userId: any) {
      let _usersSelected = this.followers.filter((o) => o.id !== userId);
      this.followers = _usersSelected;
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";
.v-dialog .dialog-add-job {
  border-radius: 4px;
  padding: 23px 28px;
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
    top: 35px;
    right: 28px;
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
  .titleHeader {
    height: 55px;
    line-height: 55px;
    font-size: 12px;
    color: #8194a5;
    margin-top: 2px;
  }
  .type-block {
    width: 100%;
    .subject {
      border-bottom: 1px solid #eeeeee;
    }
    .label1 {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #223140;
      margin-bottom: 8px;
    }
    .label1::placeholder {
      color: #8194a5;
      font-size: 18px;
    }
    .label {
      font-size: 14px;
      font-weight: bold;
      text-align: left;
      color: #223140;
      margin-bottom: 8px;
    }
    input {
      text-align: left;
      color: #333333;
      font-family: Roboto;
      font-size: 12px;
      width: 100%;
      border: none;
      background: #fff;
      padding: 5px 5px 5px 12px;
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 10px;
        color: #959ca7;
      }
    }
    .input2 {
      text-align: left;
      color: #333333;
      font-family: Roboto;
      font-size: 12px;
      height: 36px;
      border-radius: 6px;
      width: 100%;
      border: 1px solid #dee5eb;
      background: #fff;
      padding: 5px 5px 5px 12px;
      &.error {
        border-color: red;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 10px;
        color: #959ca7;
      }
    }
    .input3 {
      text-align: left;
      color: #333333;
      font-family: Roboto;
      font-size: 12px;
      height: 47px;
      border-radius: 6px;
      width: 100%;
      border: 1px solid #dee5eb;
      background: #fff;
      padding: 5px 5px 5px 12px;
      &.error {
        border-color: red;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 10px;
        color: #959ca7;
      }
    }
    .input4 {
      text-align: left;
      color: #006a9b;
      font-family: Roboto;
      font-weight: 400;
      font-size: 12px;
      height: 47px;
      border-radius: 6px;
      width: 100%;
      border: 1px solid #dee5eb;
      background: #fff;
      padding: 5px 5px 5px 12px;
      &.error {
        border-color: red;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 10px;
        color: #959ca7;
      }
    }
    .d-flex {
      display: flex;
    }
    .justify-content-between {
      justify-content: space-between;
    }

    .mb-30 {
      margin-bottom: 14px;
    }
    .date-time {
      .date,
      .time {
        width: 48%;
        // display: flex;
        align-items: flex-end;
        .block {
          width: 100%;
          height: 68px;
        }
        .iconic {
          color: #959ca7;
          font-size: 18px;
          margin-bottom: 8px;
        }
      }
      .estimate-time {
        width: 48%;
        display: flex;
        align-items: center;
        .switch {
          position: relative;
          display: block;
          width: 43px;
          height: 34px;
        }
        .switch input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkmark {
          border: 2px solid #dee5eb;
          border-radius: 6px;
          height: 36px;
          width: 36px;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
        }
        .text-label {
          color: #8194a5;
          font-size: 14px;
        }
        .switch input:checked ~ .checkmark {
          background-color: #2196f3;
        }

        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        /* Show the checkmark when checked */
        .switch input:checked ~ .checkmark:after {
          display: block;
        }

        /* Style the checkmark/indicator */
        .switch .checkmark:after {
          left: 12px;
          top: 6px;
          width: 8px;
          height: 16px;
          border: solid white;
          border-width: 0 3px 3px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }

        // .slider {
        //   position: absolute;
        //   cursor: pointer;
        //   top: 0;
        //   left: 0;
        //   right: 0;
        //   bottom: 0;
        //   background-color: rgba(0, 0, 0, 0.38);
        //   -webkit-transition: 0.4s;
        //   transition: 0.4s;
        // }

        // .slider:before {
        //   position: absolute;
        //   content: "";
        //   height: 20px;
        //   width: 20px;
        //   left: -1px;
        //   bottom: -3px;
        //   background-color: white;
        //   box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.12);
        //   -webkit-transition: 0.4s;
        //   transition: 0.4s;
        // }

        // input:checked + .slider {
        //   background-color: rgba(0, 90, 136, 0.38);
        // }

        // input:focus + .slider {
        //   box-shadow: 0 0 1px #2196f3;
        // }

        // input:checked + .slider:before {
        //   -webkit-transform: translateX(17px);
        //   -ms-transform: translateX(17px);
        //   transform: translateX(17px);
        //   background-color: #006a98;
        // }

        // /* Rounded sliders */
        // .slider.round {
        //   border-radius: 34px;
        //   width: 34px;
        //   height: 14px;
        // }

        // .slider.round:before {
        //   border-radius: 10px;
        // }
      }
      .estimate-time {
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
          input[type="number"] {
            -moz-appearance: textfield;
          }
        }
      }
    }
    .time-place {
      .place {
        width: 48%;
        .unchoose {
          height: 36px;
          cursor: pointer;
          line-height: 26px;
          font-size: 12px;
          border: 1px solid #dee5eb;
          border-radius: 6px;
          &.error {
            border-color: red;
          }
        }
      }
    }
    .content {
      width: 100%;
      #content {
        width: 100%;
        resize: none;
        height: 82px;
        border-radius: 6px;
        border: solid 1px #dee5eb;
        background-color: #ffffff;
        padding: 7px 12px;
        font-family: Roboto;
        &.error {
          border-color: red;
        }
        &:focus {
          outline: none;
          font-size: 12px;
          color: #333333;
        }
      }
    }
    .report {
      margin-top: 20px;
      margin-bottom: 16px;
      .upload-file {
        border: 1px solid #dee5eb;
        border-radius: 6px;
        width: fit-content;
        min-width: 160px;
        height: 36px;
        padding: 9px 0 0 11px;
        font-size: 12px;
        color: #8194a5;
        margin-bottom: 12px;
      }
      .file-components {
        border: 1px solid #b2b7bc;
        display: flex;
        width: fit-content;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #006a9b;
        border-radius: 18px;
        height: 27px;
        margin: 0 4px 4px 0px;
        padding: 2px 16px;
        font-size: 12px;
        font-weight: 400;
        img {
          font-size: 14px;
          margin-left: 8px;
          transition: 0.25s;
          cursor: pointer;
        }
      }
      .file-plus {
        font-size: 12px;
        color: rgb(0, 106, 155);
        border: 1px solid rgb(0, 106, 155);
        width: fit-content;
        text-align: center;
        border-radius: 18px;
        height: 27px;
        padding: 2px 16px;
        background-color: #dcf4ff;
      }
    }
    .guest {
      margin-top: 20px;
      .guest-content {
        display: flex;
        flex-flow: column;
        min-height: 47px;
        border-radius: 6px;
        border: 1px solid #dee5eb;
        .guest-input {
          border-radius: 6px;
          padding: 12px 5px 5px 12px;
        }
        .guest-components {
          border: 1px solid #b2b7bc;
          width: fit-content;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #006a9b;
          border-radius: 18px;
          height: 27px;
          margin: 0 4px 4px 0px;
          padding: 2px 16px;
          font-size: 12px;
          font-weight: 400;
          img {
            font-size: 14px;
            margin-left: 8px;
            transition: 0.25s;
            cursor: pointer;
          }
        }
        .guest-plus {
          font-size: 12px;
          color: rgb(0, 106, 155);
          border: 1px solid rgb(0, 106, 155);
          width: 56px;
          text-align: center;
          border-radius: 18px;
          height: 27px;
          padding: 2px 16px;
          background-color: #dcf4ff;
        }
      }
    }
    .members--add {
      margin-top: 10px;
      margin-bottom: 10px;
      .addmember {
        margin-left: 5px;
        cursor: pointer;
        width: 36px;
        height: 36px;
        font-size: 18px;
        display: inline-table;
        justify-content: center;
        align-items: center;
        color: #005a88;
        &:focus {
          outline: none;
        }
      }
      .wrapper-user-selected-avatar {
        position: relative;
        width: 36px;
        height: 36px;
        margin: auto;
        .icon-remove-user-selected {
          position: absolute;
          right: 0;
        }
      }
      .user-selected-full-name {
        font-size: 8px;
        color: #808890;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        width: 100%;
        margin-top: 4px;
      }
      .members-wrapper {
        align-items: center;
        margin-bottom: -12px;
        width: 100%;
        position: relative;
        margin-top: -6px;
        height: 73px;
        overflow-x: auto;
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
        }

        .member-item {
          border-radius: 50%;
          width: 70px;
          height: 40px;
          background-size: cover;
          background-position: center;
          padding: 0 6px;
          margin-bottom: 5px;
        }
        .see-all {
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(100%, -50%);
          font-size: 12px;
          color: #005a88;
        }
      }
    }
    .confirm-required {
      justify-content: center;
      .check-box {
        input {
          display: none;
        }
        label {
          display: block;
          border-radius: 2px;
          border: 1px solid rgba(56, 56, 56, 0.37);
          width: 18px;
          height: 18px;
          margin-right: 5px;
          color: #fff;
          padding-bottom: 2px;
        }
        input[type="checkbox"]:checked + label {
          background-color: #e18c12;
          border: 1px solid #e18c12;
        }
      }
    }
  }
  .confirm__btn {
    display: flex;
    justify-content: flex-end;
    padding: 0px 20px 0px 30px;
    margin: 0 -28px -23px;
    background-color: #f2f4f6;
    .confirm-required {
      margin-top: 26px;
      .confirm-required-text {
        color: #b2b7bc;
        font-size: 14px;
        margin-left: 4px;
      }
      input {
        height: 22px;
        width: 22px;
      }
    }
    .popup__btn {
      cursor: pointer;
      border: 1px solid #005a88;
      outline: unset;
      background-color: transparent;
      font-family: Roboto;
      font-size: 16px;
      margin: 20px 12px;
      &:focus {
        outline: none;
      }
    }
    .btn-cancel {
      color: #ffffff;
    }
    .popup__btn-cancel {
      cursor: pointer;
      border: 1px solid #ce4b4b;
      outline: unset;
      background-color: #ce4b4b;
      font-family: Roboto;
      font-size: 16px;
      margin: 20px 12px;
      padding: 0px 8px;
      &:focus {
        outline: none;
      }
    }
    .btn-yes {
      color: #ffffff;
      background: #005a88;
      font-size: 12px;
      height: 40px;
      border-radius: 8px;
      width: 98px;
      text-transform: none;
    }
    .disabled {
      opacity: 0.5;
    }
  }
  .get-link {
    text-decoration: underline;
    color: cyan;
    cursor: pointer;
    margin-left: 16px;
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
          font-size: 12px;
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
.error-msg {
  color: #ff0000;
  font-size: 12px;
}
</style>
