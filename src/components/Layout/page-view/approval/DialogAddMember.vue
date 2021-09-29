<template>
  <v-dialog v-model="isVisibleMember" persistent max-width="620">
    <v-card class="dialog-add-member">
      <div class="close-btn" @click="btnCancelClick">
        <i class="fal fa-times"></i>
      </div>
      <h3 class="title">Thành viên cuộc họp</h3>
      <div class="type-block">
        <div v-if="!isOnlyView" class="addnew">
          <button class="addmember" @click="openAddMember">
            <i class="far fa-plus"></i>
          </button>
          <span class="addnew__label">Thêm thành viên mới</span>
        </div>
        <div class="list-member-wrapper">
          <ul class="list-member">
            <li v-for="(member, idx) in participantsTemp" :key="idx">
              <div class="member-info">
                <img :src="`${CHAT_URL}/avatar/${member.username}`" alt="" />
                <span class="name">{{ member.name || member.full_name }}</span>
              </div>
              <i
                v-if="!isOnlyView"
                class="far fa-times remove-member-icon"
                @click="handleRemoveMember(member.id)"
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!isOnlyView" class="confirm__btn">
        <button class="btn-yes popup__btn" @click="changeParticipants">
          CẬP NHẬT
        </button>
      </div>
      <DialogAddNewMember
        v-if="isVisible"
        :member-usernames="memberUsernames"
        @add-new-members="addNewMembersToMetting"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import DialogAddNewMember from "./DialogAddNewMember";

export default {
  props: {
    isVisibleMember: {
      type: Boolean,
      default: false,
    },
    handleChangeParticipants: {
      type: Function,
    },
    participants: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isOnlyView: {
      type: Boolean,
      default: false,
    },
    handlerCancel: {
      type: Function,
    },
  },
  setup: (props, ctx) => {
    const btnCancelClick = () => {
      ctx.emit("handlerCancel");
    };
    return {
      btnCancelClick,
    };
  },
  components: { DialogAddNewMember },
  data() {
    return {
      isVisible: false,
      CHAT_URL: process.env.CHAT_URL,
      participantsTemp: this.participants,
    };
  },
  computed: {
    memberUsernames() {
      let _usernames = [];
      for (let p of this.participantsTemp) {
        _usernames.push(p.username);
      }
      return _usernames;
    },
  },
  methods: {
    openAddMember() {
      this.isVisible = true;
    },
    handleRemoveMember(mId) {
      const _participants = [...this.participantsTemp];

      this.participantsTemp = _participants.filter((p) => p.id !== mId);
    },
    addNewMembersToMetting(member) {
      this.participantsTemp = this.participantsTemp.concat(member);
    },
    changeParticipants() {
      this.handleChangeParticipants(this.participantsTemp);
      this.btnCancelClick();
    },
  },
};
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
.new-metting__wrapper {
  z-index: 5;
  display: none;
  width: calc(100vw);
  margin-left: auto;
  height: 100vh;
  background-color: #e8e8e86b;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  box-shadow: 0px 0px 0px 600px rgba(232, 232, 232, 0.41961);
}
.dialog-add-member {
  // display: none;
  // background: #fff;
  // position: relative;
  // margin-left: auto;
  // top: 50%;
  // right: 50%;
  // transform: translate(50%, -50%);
  // width: 620px;
  // border-radius: 5px;
  // box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  // padding: 0;
  // height: 780px;
  .close-btn {
    cursor: pointer;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 12px;
    right: 12px;
    font-size: 22px;
    text-align: center;
    color: #959ca7;
  }
  .title {
    height: 64px;
    line-height: 64px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333333;
    border-bottom: 1px solid #e8e8e8;
  }
  .type-block {
    width: 620px;
    padding: 12px 30px 12px 38px;
    .label {
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: #333333;
    }
    input {
      text-align: left;
      color: #333333;
      font-family: Roboto;
      font-size: 14px;
      width: 100%;
      border: none;
      background: #fff;
      padding: 5px;
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 12px;
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
      margin-bottom: 30px;
    }
    .members--add {
      margin-top: 30px;
      .members-wrapper {
        align-items: center;
        margin-bottom: 12px;
        width: 90%;
        position: relative;
        .see-all {
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(100%, -50%);
          font-size: 14px;
          color: #005a88;
        }
      }
    }
  }
  .addnew {
    display: flex;
    align-items: center;
    margin: 7px 0px 30px 0px;
    &__label {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      padding-left: 10px;
    }
    .addmember {
      cursor: pointer;
      border: none;
      width: 40px;
      height: 40px;
      background-color: #e8e8e8;
      border-radius: 100%;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #005a88;
      &:focus {
        outline: none;
      }
    }
  }

  .confirm__btn {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 0px 20px;
    .popup__btn {
      cursor: pointer;
      border: unset;
      outline: unset;
      background-color: transparent;
      font-family: Roboto;
      font-size: 18px;
      margin: 20px 12px;
      &:focus {
        outline: none;
      }
    }
    .btn-cancel {
      color: #b1afaf;
    }
    .btn-yes {
      color: #005a88;
    }
  }
}

.modalActive {
  display: block;
}
.scroll {
  overflow-y: scroll !important;
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 3px rgb(160, 160, 160);
    border-radius: 8px;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
}
.btnhide {
  visibility: hidden;
}
.btndisabled {
  i {
    color: #bfbfbfeb;
  }
}
.border-btm {
  border-bottom: solid 0.5px #959ca760;
}
.list-member {
  list-style-type: none;
  padding: 0 10px 0 0;
  height: 575px;
  overflow-x: hidden;
  overflow-y: scroll;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 13px;
    .member-info {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
      }
      .name {
        padding-left: 10px;
        font-size: 19px;
        font-size: 500;
        color: #333333;
      }
    }
  }
  .remove-member-icon {
    cursor: pointer;
    color: #e10606;
    font-size: 20px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px rgba(255, 255, 255, 0) !important;
    border-radius: 10px;
  }
}

@media only screen and(max-width: 1024px) {
  .more-info {
    right: calc(50% - 40px - 15vw);
  }
}
</style>
