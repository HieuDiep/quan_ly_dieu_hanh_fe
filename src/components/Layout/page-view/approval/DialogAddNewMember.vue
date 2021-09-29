<template>
  <v-dialog v-model="isVisibleMember" persistent max-width="620">
    <v-card
      class="dialog-add-new-member"
      :class="listUsersSelected.length ? 'has-list' : 'no-list'"
    >
      <div class="close-btn" @click="btnCancelClick">
        <img src="@/assets/images/x-arrow3x.png" width="100%" />
      </div>
      <span>Thêm thành viên</span>
      <div class="d-flex search-block-wrapper align-items-center">
        <img src="@/assets/images/search-lookup.svg" alt="" />
        <input
          v-model="filterByName"
          type="text"
          placeholder="Tìm kiếm ..."
          class="w-100 border-0 btn-no-outline pl-2"
        />
      </div>
      <div class="wrapper-users-selected mt-3 mb-1">
        <div class="users-selected-inner d-flex">
          <div
            v-for="userSelected in listUsersSelected"
            :key="userSelected.id"
            class="user-selected"
          >
            <Avatar>
              <template #avatar>
                <div class="wrapper-user-selected-avatar">
                  <img
                    class="icon-remove-user-selected pointer"
                    src="@/assets/images/remove_clipboard.svg"
                    @click="handleRemoveUserSelected(userSelected.id)"
                  />
                  <img
                    :src="userSelected.avatar"
                    class="rounded-circle user-selected-avatar"
                    height="36px"
                    width="36px"
                    style="object-fit: cover; object-position: center"
                    alt=""
                    @error="replaceByDefault"
                  />
                </div>
              </template>
            </Avatar>
            <span class="user-selected-full-name">
              {{ userSelected.full_name }}
            </span>
          </div>
        </div>
      </div>
      <div class="wrapper-select-department">
        <!-- <b>Công ty</b>
    <select
     class="form-select"
     :value="companyId"
     @change="handleChangeCompanyId"
    >
     <option disabled value="default" selected>-Chọn công ty</option>
     <option
      v-for="company in listCompanies"
      :key="company.id"
      :value="company.id"
     >
      {{ company.name }}
     </option>
    </select> -->
        <!-- <div v-if="companyId === 'default'" style="margin-top: 24px">
     <b>Phòng ban</b>
     <select class="form-select">
      <option disabled selected value="df" class="d-none">
       -Chọn phòng ban
       <div class="spin"></div>
      </option>
      <option disabled value="nc">
       Vui lòng chọn công ty
       <div class="spin"></div>
      </option>
     </select>
    </div> -->
        <div style="margin-top: 24px">
          <b>Phòng ban</b>
          <select
            class="form-select"
            :value="departmentId"
            @change="handleChangeDepartmentId"
          >
            <option disabled :selected="departmentId === 'df'" value="df">
              -Chọn phòng ban
              <div class="spin"></div>
            </option>
            <option
              v-for="department in listDepartments"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </div>

        <div class="select-all-users">
          <div
            v-if="listUsers.length !== 0"
            class="d-flex align-items-center"
            :style="isLoadingUsers ? 'opacity : 0.6; pointer-events: none' : ''"
            @click="toogleSelectAll"
          >
            <span>Chọn tất cả</span>
            <img v-if="isSelectedAll" src="@/assets/images/checked.svg" />
            <img v-else src="@/assets/images/unchecked.svg" />
          </div>
        </div>
        <div
          class="wrapper-users"
          :class="[
            ({ 'has-scroll': listUsers.length > 5 },
            !checkUser ? 'get-height' : ''),
            isLoadingUsers ? 'pick-users-loading' : '',
          ]"
          @scroll="onScrollUser"
        >
          <div v-if="!listUsers.length && !isLoadingUsers">
            <p>Không có kết quả</p>
          </div>
          <div
            v-for="user in listUsers.slice(0, showUsers)"
            v-else
            :key="user.id"
            class="user d-flex justify-content-between align-items-center"
            @click.stop="toogleClickUser(user)"
          >
            <div class="d-flex">
              <Avatar>
                <template #avatar>
                  <div class="wrapper-user-avatar">
                    <img
                      :src="user.avatar"
                      width="36px"
                      height="36px"
                      class="rounded-circle user-avatar"
                      alt=""
                      @error="replaceByDefault"
                    />
                  </div>
                </template>
              </Avatar>
              <div>
                <div class="user-full-name">{{ user.full_name }}</div>
                <div class="user-position">
                  {{ getUserPosition(user.positions) }}
                </div>
              </div>
            </div>
            <div>
              <img
                v-if="usersSelected[user.id]"
                src="@/assets/images/checked.svg"
              />
              <img v-else src="@/assets/images/unchecked.svg" />
            </div>
            <!-- <Checkbox :checked="usersSelected[user.id]" /> -->
          </div>
        </div>
      </div>
      <div class="footer">
        <button
          class="button button-primary"
          :disabled="!isValidData || loading"
          @click="addNewMembersToMetting"
        >
          Thêm
          <img
            v-show="loading"
            class="ml-1 loading-btn-sc"
            src="@/assets/images/loading.png"
            alt=""
            height="22px"
          />
        </button>
      </div>
      <!-- <div
        :class="errorResponse ? '' : 'status-msg-hide'"
        class="status-msg status-msg-center"
      >
        {{ errorResponse }}
      </div> -->
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import { splitContactList } from "@/utils";
  import axios from "axios";
  import defaultAvatar from "@/assets/images/default-avatar2.svg";
  import Avatar from "@/components/Layout/Avatar";
  export default {
    props: {
      isVisibleMember: {
        type: Boolean,
        default: false,
      },
      memberUsernames: {
        type: Array,
        default: () => {
          return [];
        },
      },
      pickedUser: {
        type: Array,
        default: () => {
          return [];
        },
      },
      participants: {
        type: Array,
        default: () => {
          return [];
        },
      },
      companies: {
        type: Array,
        default: () => {
          return [];
        },
      },
      handlerCancel: {
        type: Function,
      },
    },
    components: {
      Avatar,
    },
    computed: {
      ...mapState({
        userByContacts: state => state.users.users,
        modalsShowing: state => state.modalsShowing,
        loggedInUser: state => state.auth.user,
        listDepartments: state => state.users.listDepartments,
        listCompanies: state => state.users.listCompanies,
        listUsers: state => state.users.listUsers,
        usersByDep: state => state.users.usersByDep,
        contactRecent: function () {
          const _contactRecent = this.$store.state.contactRecent;
          const _filters = _contactRecent.filters["?"];
          const ids = _filters ? _filters.ids : [];
          return ids
            .map(id => {
              let contact = _contactRecent.byId[id];
              const username = contact.usernames.find(
                u => u !== this.loggedInUser.username
              );
              contact.username = username;
              contact.user = this.getUserByUsername(username);
              return contact;
            })
            .filter(c => this.memberUsernames.indexOf(c.user.username) === -1);
        },
        listContact: function () {
          const _listContact = this.$store.state.listContact;
          const _filters = _listContact.filters["?"];
          const ids = _filters ? _filters.ids : [];

          return splitContactList(
            ids
              .map(id => _listContact.byId[id])
              .filter(c => this.memberUsernames.indexOf(c.username) === -1)
          );
        },
      }),
      listUsers() {
        let _listUsers = this.users;

        if (this.filterByName) {
          const _filterByName = this.filterByName.toLowerCase();
          _listUsers = this.users.filter(u =>
            (u.full_name || "").toLowerCase().includes(_filterByName)
          );
        }

        let memberIds = [];

        if (this.isAddMember) {
          const groupId = this.group._id;
          if (groupId) {
            memberIds = (this.membersByGroupId[this.group._id] || []).map(
              m => m._id
            );
          }
        }

        return _listUsers
          ? _listUsers.filter(u => !memberIds.includes(u.chat_id))
          : [];
      },
      listUsersSelected() {
        let _listUsersSelected = [];

        for (let userId in this.usersSelected) {
          if (this.usersSelected[userId]) {
            _listUsersSelected.push(this.usersSelected[userId]);
          }
        }

        return _listUsersSelected;
      },
      isSelectedAll() {
        for (const user of this.listUsers) {
          if (!this.usersSelected[user.id]) {
            return false;
          }
        }

        return true;
      },
      isValidData() {
        if (this.listUsersSelected.length !== 0) {
          return true;
        }
        return false;
      },
      ...mapGetters(["getUserByUsername"]),
    },
    data: function () {
      return {
        groupName: (this.group || {}).name || "",
        loading: false,
        filterByName: "",
        X_API_KEY: process.env.VUE_APP_X_API_KEY,
        users: [],
        departmentId: "df",
        usersSelected: {},
        showUsers: 10,
        departments: [],
        newDepartments: [],
        checkUser: false,
        companyId: "default",
        BASE_URL: process.env.VUE_APP_BASE_URL,
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
    setup: (props, ctx) => {
      const btnCancelClick = () => {
        ctx.emit("handlerCancel");
      };
      return {
        btnCancelClick,
      };
    },
    created() {
      const { byId, ids } = this.$store.state.departments;

      const _departments = ids.filter(id => byId[id]).map(id => byId[id]);

      this.departments = _departments;

      // if (_departments[0]) {
      //   this.departmentId = _departments[0].id;
      // }
    },

    watch: {
      departmentId(_departmentId) {
        if (_departmentId) {
          this.getUsers(_departmentId);
          if (this.fTimeOut) {
            clearTimeout(this.fTimeOut);
          }
          this.showUsers = 10;
        }
      },
      pickedUser: {
        deep: true,
        handler() {
          if (this.pickedUser) {
            const obj = { ...this.usersSelected };
            this.pickedUser.forEach(o => {
              if (!obj[o.id]) {
                obj[o.id] = o;
              }
            });
            this.usersSelected = { ...obj };
          }
        },
      },

      // companyId(_companyId) {
      //   if (_companyId) {
      //     this.getNewDepartments(_companyId);
      //     if (this.fTimeOut) {
      //       clearTimeout(this.fTimeOut);
      //     }
      //   }
      // },
      filterByName() {
        this.showUsers = 10;
      },
      usersByDep() {
        this.users = this.usersByDep[this.departmentId];
      },
      memberUsernames: function () {
        this.selectedContactUsername = [];
      },
      searchByName(_searchByName) {
        if (!_searchByName) {
          this.filtersContact = null;
          this.filtersRecentContact = null;
        } else {
          const _listContact = this.$store.state.listContact;
          const _filters = _listContact.filters["?"];
          const ids = _filters ? _filters.ids : [];

          this.filtersContact = splitContactList(
            ids
              .filter(id => {
                return (
                  _listContact.byId[id] &&
                  _listContact.byId[id].full_name &&
                  _listContact.byId[id].full_name
                    .toLowerCase()
                    .includes(_searchByName.toLowerCase())
                );
              })
              .map(id => _listContact.byId[id])
              .filter(c => this.memberUsernames.indexOf(c.username) === -1)
          );

          this.filtersRecentContact = this.contactRecent.filter(c => {
            return (
              c.full_name &&
              c.full_name.toLowerCase().includes(_searchByName.toLowerCase())
            );
          });
        }
      },
    },
    beforeDestroy() {
      this.departments = [];
    },
    mounted() {
      if (this.pickedUser) {
        const obj = { ...this.usersSelected };
        this.pickedUser.forEach(o => {
          if (!obj[o.id]) {
            obj[o.id] = o;
          }
        });
        this.usersSelected = { ...obj };
      }
      if (this.participants) {
        this.participants.forEach(element => {
          this.toogleClickUser(element);
        });
      }
      if (!this.users || !this.users.length) {
        console.log("warning! no user found.");
        try {
          this.users = Object.values(this.userByContacts);
        } catch (error) {
          console.log("error when fetch users.");
          console.log(error);
        }
      }
      this.getNewDepartments();
    },
    methods: {
      async getUsers(_departmentId) {
        try {
          this.isLoadingUsers = true;
          const url = `${
            this.BASE_URL
          }/api/internal/departments/${_departmentId}/users?recursive=${true}&pagination=false`;
          const headers = { "x-api-key": this.X_API_KEY };

          const response = await axios.get(url, { headers });
          this.isLoadingUsers = false;
          const _users = (response.data.data || {}).users || [];
          this.users = _users;
          let obj = { depId: _departmentId, users: _users };
          this.$store.commit("users/setUserDep", obj);
        } catch (error) {
          console.error(error);
        }
      },
      async getNewDepartments() {
        try {
          this.departments = [];
          const url = `${this.BASE_URL}/api/internal/tenancy/departments`;
          const headers = { "x-api-key": this.X_API_KEY };

          const response = await axios.get(url, { headers });
          const _newDepartments =
            response.data.data.departments || {}.departments || [];
          this.departments = _newDepartments;
          this.departmentId = _newDepartments
            ? _newDepartments[0].id
            : "default";
        } catch (error) {
          console.error(error);
        }
      },
      getUserPosition(_positions = []) {
        if (!_positions.length) return "";
        const position = _positions[0];
        const { level, department } = position;

        return `${level.name} - ${department.name}`;
      },
      handleChangeDepartmentId(event) {
        this.departmentId = event.target.value;
      },
      // handleChangeCompanyId(event) {
      //   this.companyId = event.target.value;
      //   this.checkUser = true;
      // },
      toogleClickUser(user) {
        let _usersSelected = { ...this.usersSelected };

        if (!user.id) return;

        if (_usersSelected[user.id]) {
          delete _usersSelected[user.id];
        } else {
          _usersSelected = {
            [user.id]: user,
            ..._usersSelected,
          };
        }
        this.usersSelected = _usersSelected;
      },
      toogleSelectAll() {
        let _usersSelected = { ...this.usersSelected };

        if (this.isSelectedAll) {
          for (let user of this.listUsers) {
            if (_usersSelected[user.id]) {
              delete _usersSelected[user.id];
            }
          }
        } else {
          for (let user of this.listUsers) {
            if (!_usersSelected[user.id]) {
              _usersSelected[user.id] = user;
            }
          }
        }

        this.usersSelected = _usersSelected;
      },
      replaceByDefault(e) {
        e.target.src = defaultAvatar;
      },
      handleRemoveUserSelected(userId) {
        let _usersSelected = { ...this.usersSelected };
        delete _usersSelected[userId];

        this.usersSelected = _usersSelected;
      },
      addNewMembersToMetting() {
        this.$emit("add-new-members", this.listUsersSelected);
        this.btnCancelClick();
      },
      onScrollUser(e) {
        if (
          e.target.scrollTop + e.target.clientHeight + 80 >
          e.target.scrollHeight
        ) {
          if (this.fTimeOut) {
            clearTimeout(this.fTimeOut);
          }
          this.fTimeOut = setTimeout(() => {
            clearTimeout(this.fTimeOut);
            this.showUsers += 10;
          }, 200);
        }
      },
      handleCloseModal() {
        this.$store.dispatch("hideModal", this.modalId);
      },
      isLatelyM() {
        this.isContact = false;
        this.isLately = true;
      },
      isContactM() {
        this.isContact = true;
        this.isLately = false;
      },
      toggleChecked() {
        let e = window.event;
        let newarr = [];
        let boundEle = e.target;
        let inputEle = boundEle.closest(".members").querySelector("input");
        if (inputEle.checked) {
          newarr = this.selectedContactUsername.filter(
            item => item !== inputEle.value
          );
          this.selectedContactUsername = [...newarr];
          inputEle.checked = false;
        } else {
          this.selectedContactUsername.push(inputEle.value);
          inputEle.checked = true;
        }
        if (this.selectedContactUsername.length < 5) {
          if (
            inputEle.parentElement.parentElement.parentElement.parentElement.querySelector(
              ".member-wrapper"
            )
          ) {
            inputEle.parentElement.parentElement.parentElement.parentElement
              .querySelector(".member-wrapper")
              .querySelector(".current-members").style.marginLeft = `${0}px`;
          } else {
            inputEle.parentElement.parentElement.parentElement.parentElement.parentElement
              .querySelector(".member-wrapper")
              .querySelector(".current-members").style.marginLeft = `${0}px`;
          }
        }
      },
      removeMember() {
        let e = window.event;
        let newarr = [];
        let boundEle = e.target;
        newarr = this.selectedContactUsername.filter(
          item => item !== boundEle.getAttribute("name")
        );
        this.selectedContactUsername = [...newarr];
        if (this.selectedContactUsername.length < 5) {
          boundEle.parentElement.parentElement.parentElement.parentElement.style.marginLeft = `${0}px`;
        } else {
          if (this.count !== 0) {
            this.count = this.count - 1;
            boundEle.parentElement.parentElement.parentElement.parentElement.style.marginLeft = `${
              (0 - this.count) * 90
            }px`;
          }
        }
      },
      moveToNextMember() {
        let e = window.event;
        let arrlth = this.selectedContactUsername.length;
        let thisEle =
          e.target.parentElement.parentElement.querySelector(
            ".current-members"
          );
        if (arrlth > 4) {
          if (this.count < arrlth - 4) {
            this.count = this.count + 1;
            thisEle.style.marginLeft = `${(0 - this.count) * 90}px`;
          }
        } else {
          thisEle.style.marginLeft = `${0}px`;
        }
      },
      moveToPrevMember() {
        let e = window.event;
        let arrlth = this.selectedContactUsername.length;
        let thisEle =
          e.target.parentElement.parentElement.querySelector(
            ".current-members"
          );
        if (arrlth > 4) {
          if (this.count > 0) {
            this.count = this.count - 1;
            thisEle.style.marginLeft = `${(0 - this.count) * 90}px`;
          } else {
            this.count = 0;
            thisEle.style.marginLeft = `${(0 - this.count) * 90}px`;
          }
        } else {
          thisEle.style.marginLeft = `${0}px`;
        }
      },
      setSelectedMember(member) {
        let _listMemberSelected = this.listMemberSelected;
        let _member = member.user || member;

        if (_listMemberSelected[_member.id]) {
          delete _listMemberSelected[_member.id];
        } else {
          _listMemberSelected[_member.id] = _member;
        }
        this.listMemberSelected = _listMemberSelected;
      },
      isChecked(memberId) {
        return !!this.listMemberSelected[memberId];
      },
    },
  };
</script>
<style lang="scss" scoped>
  /* ::-webkit-scrollbar-track {
   box-shadow: inset 0 0 5px transparent;
   border-radius: 10px;
 } */
  * {
    transition: 0.4s ease-in-out;
  }
  .new-member__wrapper {
    z-index: 6;
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
  .dialog-add-new-member {
    max-height: 90vh !important;
    .search-block-wrapper {
      border: solid 1px #dee5eb;
      border-radius: 4px;
      height: 40px;
      padding: 0 12px;
      position: relative;
      input {
        &::placeholder {
          font-family: Roboto;
          font-size: 14px;
          color: #8194a5;
        }
      }
      &.group-name {
        margin-bottom: 1em;
      }
      &.has-error {
        border-color: red;
      }
      .error-group-name {
        position: absolute;
        bottom: 0;
        transform: translateY(100%);
        font-size: 13px;
        left: 0;
        color: red;
      }
    }
    .wrapper-select-department {
      b {
        color: #223140;
        font-size: 16px;
        margin-bottom: 5px;
        display: block;
      }
      .select-all-users {
        margin-top: 0.5em;
        display: flex;
        justify-content: flex-end;
        min-height: 24px;
        span {
          color: #8194a5;
          font-size: 14px;
          margin-right: 10px;
          transform: translateY(1px);
        }
      }
      .form-select {
        width: 100%;
        border: solid 1px #dee5eb;
        outline: none;
        height: 40px;
        background: transparent;
        border-radius: 3px;
        padding: 0 12px;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
      }
      .contacts {
        color: #223140 !important;
        font-size: 16px;
        font-weight: bolder;
      }
    }

    .wrapper-users-selected {
      .users-selected-inner {
        max-width: 100%;
        overflow-x: auto;
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
        }

        .user-selected {
          text-align: center;
          min-width: calc(100% / 7);
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
            font-size: 10px;
            color: #808890;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            width: 95%;
            margin-top: 4px;
          }
        }
      }
    }
    .wrapper-users {
      max-height: 300px;
      overflow-y: auto;
      width: 100%;
      &::-webkit-scrollbar {
        width: 0px;
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
      &.has-scroll {
        padding-right: 11px;
      }

      .user {
        height: 40px;
        margin: 5px 0;
        &:hover {
          background-color: #f2f4f6;
        }
        .wrapper-user-avatar {
          /* border: 1px solid #b9bfc3; */
          /* border-radius: 50%; */
          margin-right: 10px;
          .user-avatar {
            border: 1px solid #fff;
          }
        }
        .user-full-name {
          font-size: 16px;
          color: #223140;
          font-weight: bold;
        }
        .user-position {
          color: #808890;
          font-size: 12px;
          transform: translateY(-3px);
        }
      }
    }
    .footer {
      background-color: #f2f4f6;
      width: 100%;
      padding: 1rem 0;
      display: flex;
      justify-content: flex-end;
    }
    background: #fff;
    position: relative;
    margin-left: auto;
    // top: 50%;
    // right: 50%;
    // transform: translate(50%, -50%);
    width: 620px;
    /* max-height: 76vh !important; */
    border-radius: 5px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    padding: 1rem 1rem 0px 1rem;
    max-height: 90vh;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(255, 255, 255, 0);
      border-radius: 10px;
    }
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
      padding: 12px 20px;
      .label {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        border-radius: 57px;
        border: solid 0.5px #959ca760;
        background: #fff;
        padding: 5px 10px;
        &:focus {
          outline: none;
        }
        &::placeholder {
          font-size: 12px;
          color: #959ca7;
        }
      }
    }
    .member-wrapper {
      position: relative;
      height: 90px;
      transition: 0.4s ease-in-out;
      .next__btn,
      .prev__btn {
        z-index: 2;
        cursor: pointer;
        height: 100%;
        position: absolute;
        top: 50%;
        border: none;
        background-color: #fff;
        color: #005a88;
        font-size: 20px;
        transition: 0.2s ease-in-out;
        &:focus {
          outline: none;
        }
        i {
          display: block;
          height: 100%;
          width: 100%;
          line-height: 42px;
        }
      }
      .next__btn {
        right: 0px;
        padding: 0;
        transform: translate(0, -50%);
        i {
          padding-right: 12px;
        }
      }
      .prev__btn {
        left: 0px;
        padding-left: 0;
        transform: translate(0, -50%);
        i {
          padding-left: 12px;
        }
      }
    }
    .current-members {
      display: flex;
      max-width: 2000px;
      margin-top: 30px;
      padding: 0px 40px;
      overflow-x: hidden;
      overflow-y: hidden;
      .member {
        position: relative;
        text-align: center;
        padding: 0;
        img {
          border-radius: 100%;
          width: 52px;
          height: 52px;
        }
        .member--name {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          width: 90px;
        }
        .remove {
          cursor: pointer;
          position: absolute;
          height: 12px;
          width: 12px;
          line-height: 12px;
          top: 0px;
          left: 50%;
          transform: translateX(10px);
          padding: 0;
          background: #333;
          border: none;
          border-radius: 100%;
          font-size: 9px;
          color: #fff;
          opacity: 0.8;
          &:focus {
            outline: none;
          }
          i {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .search-block {
      margin: 20px 20px;
      padding: 7px 10px;
      border: solid 0.5px #959ca760;
      background-color: #ffffff;
      border-radius: 57px;
      i {
        color: #959ca7;
        font-size: 12px;
      }
      input {
        border: none;
        width: 90%;
        padding: 0px 0px 0px 3px;
        &:focus {
          outline: none;
        }
        &::placeholder {
          font-size: 12px;
          color: #959ca7;
        }
      }
    }
    .search--result {
      .field {
        display: flex;
        p {
          cursor: pointer;
          width: 50%;
          padding-bottom: 5px;
          text-align: center;
          font-size: 12px;
          font-weight: normal;
          border-bottom: 0.2px solid #e8e8e8;
          transition: 0.1s linear;
        }
        p.fieldactive {
          font-weight: bold;
          color: #e18c12;
          border-color: #e18c12;
        }
      }
      .capital {
        background-color: #e8e8e8;
        padding: 6px 30px;
        margin-bottom: 15px;
        font-size: 16px;
        line-height: 0.75;
        color: #959ca7;
      }
      .result-panel {
        height: 450px;
        overflow-y: hidden;

        .members {
          display: flex;
          align-items: center;
          padding: 2px 20px;
          margin-top: 3px;
          cursor: pointer;
          &:hover {
            background-color: #dbe8ee;
          }
          label {
            cursor: pointer;
            width: 18px;
            height: 18px;
            border-radius: 100%;
            background-color: transparent;
            border: 1px solid #ddd;
          }
          input {
            width: 14px;
            height: 14px;
            display: none;
          }
          input[type="checkbox"]:checked + label {
            border-color: transparent;
            background: url("/assets/images/checked.svg") center/cover no-repeat;
          }
          .avatar {
            display: flex;
            align-items: center;
            margin-left: 8px;
            margin-right: 5px;
            position: relative;
          }
          .avatar img {
            width: 32px;
            height: 32px;
            border-radius: 100%;
            position: relative;
          }

          .info {
            .name {
              font-size: 14px;
              color: #333333;
              font-weight: 400;
            }
            .position {
              font-size: 12px;
              color: #959ca7;
            }
          }
        }
        .members.isonline {
          .avatar {
            position: relative;
            &::before {
              position: absolute;
              z-index: 6;
              content: "";
              width: 8px;
              height: 8px;
              bottom: 2px;
              right: 2px;
              background-color: #e18c12;
              border: solid 1px #ffffff;
              border-radius: 100%;
            }
          }
        }
        .members:nth-child(1) {
          margin-top: 6px;
        }
      }
    }
    .confirm__btn {
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
      .btn-yes {
        color: #005a88;
      }
    }
  }
  .online {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      right: 0px;
      bottom: 0px;
      width: 7px;
      height: 7px;
      border: 1px solid #fff;
      border-radius: 100%;
      background: #e18c12;
    }
  }

  .modalActive {
    display: block;
    overflow-x: hidden;
  }
  .btnhide {
    visibility: hidden;
  }
  .avatar {
    cursor: pointer;
  }
  .info {
    p.name {
      cursor: pointer;
    }
    p.position {
      cursor: pointer;
    }
  }
  .btndisabled {
    i {
      color: #bfbfbfeb;
    }
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
  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }
  @keyframes spinner2 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .pick-users-loading {
    opacity: 0.7;
    background-color: rgba(84, 85, 85, 0.097);
    pointer-events: none;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 60px;
      left: 50%;
      background-color: transparent;
      border-top: 2px solid #000;
      border-left: 2px solid #000;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      animation: spinner2 1.2s linear infinite;
    }
  }
</style>
