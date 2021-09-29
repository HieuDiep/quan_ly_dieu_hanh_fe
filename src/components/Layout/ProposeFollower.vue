<template>
  <div>
    <div class="list-user-follower">
      <div
        class="each-follower d-flex align-items-center"
        v-for="fl in listFollowerComputed"
        :key="fl.id"
      >
        <img :src="fl.avatar" alt="" class="each-follower__avatar" />
        <div
          class="
            each-follower__info
            d-flex
            align-items-center
            justify-content-between
            w-100
          "
        >
          <div>
            <p class="each-follower__name">{{ fl.full_name }}</p>
            <p class="each-follower__role">{{ fl.roleTxt }}</p>
          </div>
          <img
            src="../../assets/images/red-close.png"
            alt=""
            class="pointer"
            @click="detachFollower(fl)"
          />
        </div>
      </div>
      <img
        src="../../assets/images/small-add.png"
        alt=""
        class="pointer small-add"
        @click="handleOpenAddMember"
      />
    </div>
    <DialogAddNewMember
      :is-visible-member="visibleAddMember"
      :member-usernames="[]"
      :participants="[]"
      :companies="[]"
      :picked-user="listFollower"
      @add-new-members="changeApprovalMember"
      @handlerCancel="handleCloseAddMember"
    />
  </div>
</template>

<script>
  import DialogAddNewMember from "@/components/Layout/page-view/approval/DialogAddNewMember.vue";
  import api from "@/services";
  export default {
    components: { DialogAddNewMember },
    props: {
      setRefGetAct: {
        type: Function,
        default() {
          console.log(0);
        },
      },
    },
    data() {
      return {
        currentId: 0,
        listFollower: [],
        visibleAddMember: false,
      };
    },
    computed: {
      listFollowerComputed() {
        const arr = [...this.listFollower];
        arr.forEach(o => {
          if (o.positions && o.positions.length) {
            o.roleTxt =
              o.positions[0].level.name +
              " - " +
              o.positions[0].department.name;
          }
        });

        return arr;
      },
    },
    mounted() {
      if (this.$route.params) {
        this.currentId = +this.$route.params.id;
      }
    },
    watch: {
      $route: {
        deep: true,
        handler() {
          if (this.$route.params) {
            this.currentId = +this.$route.params.id;
          }
        },
      },
      currentId() {
        if (this.currentId) {
          this.getAllFollowers();
        }
      },
    },
    methods: {
      async getAllFollowers() {
        const res = await api.approval.getDetail(this.currentId);
        if (!res) {
          return;
        }
        try {
          this.listFollower = res.data.data.approval.followers;
        } catch (error) {
          console.log(error);
        }
      },
      handleOpenAddMember() {
        this.visibleAddMember = true;
      },
      handleCloseAddMember() {
        this.visibleAddMember = false;
      },
      async changeApprovalMember(_val) {
        this.handleCloseAddMember();
        const ids = _val.map(o => o.id);
        const formData = new FormData();
        ids.forEach(o => {
          formData.append("user_ids[]", +o);
        });
        const res = await api.approval.addFollower(this.currentId, formData);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống. Liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.listFollower = _val;
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: "Thêm người theo dõi thành công",
            });
            this.setRefGetAct(new Date().getTime());
          } else {
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
          }
        } catch (error) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống. Liên hệ IT để được hỗ trợ.",
          });
          console.log(error);
        }
      },
      async detachFollower(fl) {
        const formData = new FormData();
        formData.append("user_ids[]", +fl.id);
        const res = await api.approval.removeFollower(this.currentId, formData);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống. Liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.listFollower = this.listFollower.filter(o => o.id !== fl.id);
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: "Xóa người theo dõi thành công",
            });
            this.setRefGetAct(new Date().getTime());
          } else {
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
          }
        } catch (error) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống. Liên hệ IT để được hỗ trợ.",
          });
          console.log(error);
        }
      },
    },
  };
</script>

<style lang="scss" scopped>
  .each-follower {
    padding: 2px 0px;
    &__avatar {
      width: 30px;
      height: 30px;
      object-fit: cover;
      object-position: center;
      border-radius: 100%;
    }
    &__info {
      padding-left: 12px;
    }
    &__name {
      font-size: 13px;
      font-weight: 500;
      color: #30373e;
      margin-bottom: 2px !important;
    }
    &__role {
      font-size: 12px;
      font-weight: 500;
      color: #8194a5;
      margin-bottom: 2px !important;
    }
  }
  .small-add {
    margin-top: 8px;
    width: 30px;
    height: 30px;
    object-fit: cover;
    object-position: center;
    border-radius: 100%;
  }
</style>
