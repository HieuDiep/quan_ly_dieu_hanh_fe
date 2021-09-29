<template>
 <div>
  <v-row justify="center">
   <v-dialog v-model="visibleDialog" persistent max-width="650">
    <v-card class="">
     <div class="p-4 pb-0">
      <div class="d-flex align-items-center justify-content-between">
       <span class="text-blur font-size-14 font-weight-bold">
        Thêm người phê duyệt
       </span>
       <img
        src="../../assets/images/small-close.png"
        alt=""
        class="pointer"
        @click="onClose"
       />
      </div>
      <div class="search-text-filter display-flex align-center my-3">
       <img src="@/assets/images/search-icon.png" height="20" alt="" />
       <input
        v-model="textQuery"
        class="w-100"
        type="text"
        placeholder="Tìm kiếm ..."
       />
      </div>
      <div class="list-user-selected py-2">
       <div
        v-for="user in listUserSelectedComputed"
        :key="user.id"
        class="each-user-selected"
       >
        <div class="list-user-avatar-v mr-1">
         <img :src="user.avatar" alt="" class="u-avatar" />
         <p class="mb-0 u-full-name font-size-10 text-blur text-center">
          {{ user.full_name }}
         </p>
         <img
          src="../../assets/images/red-close.png"
          alt=""
          class="close-x pointer"
          @click="selectUser(user.id)"
         />
        </div>
       </div>
      </div>
      <div class="dep-list">
       <p
        class="
         each-field-title
         font-size-14 font-weight-bold
         text-darkgrey
         mb-2
        "
       >
        Phòng ban
       </p>
       <v-autocomplete
        v-model="selectedDepartment"
        :items="listDepartments"
        :item-text="'name'"
        :item-value="'id'"
        outlined
        dense
        label=""
        class="border-normal"
       ></v-autocomplete>
      </div>

      <div class="list-all-users">
       <div class="mb-2">
        <label
         for=""
         class="font-size-14 text-blur pointer pick-all-label"
         @click="handleToggleAll"
         >Chọn tất cả
         <div v-show="!isCheckAll" class="uncheck-f ml-1"></div>
         <img
          v-show="isCheckAll"
          src="@/assets/images/checked.svg"
          alt=""
          width="15px"
          class="pl-1"
         />
        </label>
       </div>
       <div
        v-for="user in listUserComputedQuery"
        :key="user.id"
        class="pointer d-flex align-items-center mb-1 user-row"
        @click="selectUser(user.id)"
       >
        <div class="list-user-avatar mr-1">
         <img :src="user.avatar" alt="" />
        </div>
        <div class="each-user-in-list w-100">
         <div>
          <p
           class="
            mb-0
            user-full-name
            font-weight-bold font-size-16
            text-darkgrey
           "
          >
           {{ user.full_name }}
          </p>
          <p class="mb-0 user-pos font-size-12 text-gray">
           {{ user.positionComputed }}
          </p>
         </div>
         <div
          v-show="!listUserSelected.includes(user.id)"
          class="uncheck-f ml-1"
         ></div>
         <img
          v-show="listUserSelected.includes(user.id)"
          src="@/assets/images/checked.svg"
          alt=""
          width="15px"
          class="pl-1"
         />
        </div>
       </div>
      </div>
     </div>
     <div class="add-btn-gr px-4 py-3">
      <v-btn color="#006a9b" class="btn-save font-size-14" @click="submit">
       Thêm mới
      </v-btn>
     </div>
    </v-card>
   </v-dialog>
  </v-row>
 </div>
</template>

<script>
 import { tStr } from "validation_t/src";
 import { mapState } from "vuex";
 export default {
  props: {
   visibleDialog: {
    type: Boolean,
    default: false,
   },
   defaultMember: {
    type: Array,
    default() {
     return [];
    },
   },
   onClose: {
    type: Function,
   },
   onSubmit: {
    type: Function,
   },
  },
  data() {
   return {
    listUserSelected: [],
    selectedDepartment: null,
    textQuery: "",
   };
  },
  computed: {
   ...mapState({
    listDepartments: state => state.users.listDepartments,
    listCompanies: state => state.users.listCompanies,
    listUsers: state => state.users.listUsers,
   }),
   listUserComputed() {
    if (!this.listUsers || !this.listUsers.length) {
     return [];
    }
    const arr = this.listUsers.map(o => {
     return {
      ...o,
      department_ids: o.positions.map(k => {
       return k.department ? k.department.id : 0;
      }),
     };
    });

    const result = arr.filter(o => {
     if (this.selectedDepartment) {
      return o.department_ids.includes(this.selectedDepartment);
     }
     return false;
    });
    result.forEach(o => {
     let str = "";
     if (o.positions && o.positions.length) {
      str += o.positions[0].name;
      if (o.positions[0].department) {
       str += ` - ${o.positions[0].department.name}`;
      }
     }
     o.positionComputed = str;
    });
    return result;
   },
   listUserComputedQuery() {
    return this.listUserComputed.filter(o => {
     const fullName = tStr.removeAscent(o.full_name).replaceAll(" ", "");
     const query = tStr.removeAscent(this.textQuery).replaceAll(" ", "");
     return fullName.includes(query);
    });
   },
   listUserSelectedComputed() {
    if (!this.listUsers || !this.listUsers.length) {
     return [];
    }
    const arr = this.listUsers.map(o => {
     return {
      ...o,
      department_ids: o.positions.map(k => {
       return k.department ? k.department.id : 0;
      }),
     };
    });
    return arr.filter(o => this.listUserSelected.includes(o.id));
   },
   isCheckAll() {
    if (!this.listUserComputedQuery || !this.listUserComputedQuery.length) {
     return false;
    }
    return this.listUserComputedQuery.every(o =>
     this.listUserSelected.includes(o.id),
    );
   },
  },
  mounted() {
   if (this.listDepartments && this.listDepartments.length) {
    this.selectedDepartment = this.listDepartments[0].id;
   }
  },
  watch: {
   listDepartments: {
    deep: true,
    handler() {
     if (this.listDepartments && this.listDepartments.length) {
      this.selectedDepartment = this.listDepartments[0].id;
     }
    },
   },
   visibleDialog() {
    this.handleClearForm();
    if (this.visibleDialog) {
     this.listUserSelected = this.defaultMember.map(o => o.id);
    }
   },
  },
  methods: {
   handleClearForm() {
    this.listUserSelected = [];
    this.selectedDepartment = null;
    this.textQuery = "";
    if (this.listDepartments && this.listDepartments.length) {
     this.selectedDepartment = this.listDepartments[0].id;
    }
   },
   selectUser(userId) {
    this.listUserSelected.includes(userId)
     ? (() => {
        this.listUserSelected = this.listUserSelected.filter(o => o !== userId);
       })()
     : this.listUserSelected.push(userId);
   },
   handleToggleAll() {
    let rslt = this.listUserSelected.slice();
    if (this.isCheckAll) {
     this.listUserComputed.forEach(o => {
      rslt = rslt.filter(k => k !== o.id);
     });
    } else {
     this.listUserComputed.forEach(o => {
      if (!rslt.includes(o.id)) {
       rslt.push(o.id);
      }
     });
    }
    this.listUserSelected = rslt.slice();
   },
   submit() {
    this.onSubmit(this.listUserSelectedComputed);
   },
  },
 };
</script>

<style lang="scss" scopped>
 .feild-box {
  .feild-action {
   padding: 15px 0;
   & > div {
    &:first-child {
     padding-right: 15px;
    }
    &:last-child {
     padding-left: 15px;
    }
   }
   .v-input--switch {
    padding-top: 0;
    .v-input__slot {
     margin-bottom: 0;
    }
    .v-messages {
     display: none;
    }
   }
  }
 }
 .border-right {
  border-right: 1px solid #707070;
 }
 .border-top {
  border-top: 1px solid #707070;
 }
 .border-top-dee5eb {
  border-top: 1px solid #dee5eb;
 }
 .search-text-filter {
  padding: 0 10px;
  border: 1px solid #dee5eb;
  border-radius: 6px;
  height: 36px;
  border: solid 1px #dee5eb;
  min-width: 350px;
  img {
   height: 16px;
  }
  input {
   padding: 0 10px;
   outline: none;
   font-size: 12px;
   &::placeholder {
    font-size: 11px;
    color: #8194a5 !important;
   }
  }
 }
 .border-normal {
  .v-input__slot {
   border: solid 1px #dee5eb !important;
   border-color: #dee5eb !important;
   &::before {
    display: none !important;
   }
   fieldset {
    border: solid 1px #dee5eb00 !important;
    border-color: #dee5eb00 !important;
   }
  }
 }
 .pick-all-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
 }

 .user-row {
  &:hover {
   background-color: #e8e9e946;
   border-radius: 4px;
  }
  .each-user-in-list {
   display: flex;
   align-items: center;
   justify-content: space-between;
  }
  .list-user-avatar {
   border-radius: 100%;
   border: 1px solid #dee5eb;
   display: flex;
   align-items: center;
   justify-content: center;
   img {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    object-fit: cover;
    object-position: center;
    position: relative;
    margin: 2px;
   }
  }
 }

 .uncheck-f {
  width: 12px;
  height: 12px;
  border: 1px solid #dee5eb;
  border-radius: 12px;
 }
 .add-btn-gr {
  background-color: #f2f4f6;

  .btn-save {
   display: block;
   margin-left: auto;
   box-shadow: none;
   border-radius: 8px;
   color: #fff !important;
   letter-spacing: normal !important;
   width: 100px;
   font-weight: normal !important;
   text-transform: none;
   padding: 12px 0 !important;
   height: unset !important;
  }
 }
 .list-user-selected {
  display: flex;
  align-items: center;
  width: 100%;
  overflow-x: scroll;
  &::-webkit-scrollbar {
   width: 5px;
   height: 10px;
  }

  &::-webkit-scrollbar-track {
   -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
   border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
   border-radius: 2px;
   background: rgba(0, 0, 0, 0);
  }
  &:hover {
   &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(162, 161, 161, 0.604);
   }
  }
  .list-user-avatar-v {
   position: relative;
   display: flex;
   flex-flow: column;
   align-items: center;
   justify-content: center;
   width: 74px;
   .u-avatar {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    object-fit: cover;
    object-position: center;
   }
   .u-full-name {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
   }
   .close-x {
    position: absolute;
    top: 0;
    right: 10px;
   }
  }
 }
 .list-all-users {
  max-height: 300px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
   width: 5px;
   height: 6px;
  }

  &::-webkit-scrollbar-track {
   -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
   border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
   border-radius: 10px;
   background: rgba(0, 0, 0, 0);
  }
  &:hover {
   &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(162, 161, 161, 0.405);
   }
  }
 }
</style>
