<template>
  <div class="todo-activity-wr comment-wrapper">
    <div class="logs-area" id="logs-area">
      <RowLogs v-if="onLoadingMoreComment || isFirstLoading" />
      <!-- <RowLogs v-if="isFirstLoading" /> -->
      <div class="no-task" v-if="!listLogsComputed.length">
        Không có hoạt động
      </div>
      <div
        v-for="td in listLogsComputed"
        :key="td.groupDate"
        class="each-log mb-2"
      >
        <div class="activity-calendar d-flex align-items-center mb-2">
          <img src="@/assets/images/act-calendar.svg" alt="" />
          <span class="each-log__date pl-2">Ngày {{ td.groupDate }}</span>
        </div>
        <div
          v-for="log in td.groupData"
          :key="log.id"
          class="d-flex align-items-center mb-2 each-log__block"
        >
          <div class="each-log__avatar">
            <img
              :src="
                log.causer ? log.causer.avatar : '@/assets/images/user-icon.png'
              "
              alt=""
            />
          </div>
          <div
            class="
              each-log__content
              d-flex
              align-items-center
              w-100
              justify-content-between
            "
          >
            <div>
              <p class="log__causer-name mb-0">
                {{ log.causer ? log.causer.full_name : "-" }}
              </p>
              <p class="log__desc mb-0">
                {{ log.description }}
              </p>
            </div>
            <div class="log__timer">
              {{ log.timeStr }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tDate } from "validation_t/src";
import api from "@/services";
import { mapState } from "vuex";
import { RowLogs } from "@/components/Loaders";

export default {
  components: {
    RowLogs,
  },
  props: {
    // refGetAct: {
    //   type: Number,
    //   default: 0,
    // },
  },
  data() {
    return {
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
      totalLog: 999999,
      refScroll: null,
      onLoadingMoreComment: false,
      isFirstLoading: true,
      onLoadingComments: false,
    };
  },
  computed: {
    ...mapState({
      userObj: (state) => state.auth.user,
      currentTaskDetail: (state) => state.tasks.currentTaskDetail,
      listLogs: (state) => state.tasks.listLogs,
    }),
    listLogsComputed() {
      const arr = [...this.listLogs];
      arr.forEach((o) => {
        o.dateStr = this.cutString(o.created_at);
        o.timeStr = this.cutTimeString(o.created_at);
      });
      const dateSet = [...new Set(arr.map((o) => o.dateStr))];
      const result = dateSet.map((o) => {
        return { groupDate: o };
      });
      result.forEach((o) => {
        o.groupData = arr.filter((k) => k.dateStr === o.groupDate);
        o.groupData.sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      });
      return result;
    },
    user() {
      return this.userObj.user;
    },
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.currentId = this.$route.params.id;
      if (+this.currentId !== +this.currentTaskDetail.id) {
        this.$store.dispatch("tasks/getTaskActivities", {
          id: this.currentId,
          scrollAble: true,
        });
      }
      this.$nextTick(() => {
        this.isFirstLoading = false;
        if (this.scrollAble) {
          this.scrollToBtm();
        }
      });
    }
  },
  watch: {
    // refGetAct() {
    //   if (this.$route.params && this.$route.params.id) {
    //     this.currentId = this.$route.params.id;
    //     this.getAllListLogs(this.currentId);
    //   }
    // },
  },
  methods: {
    cutString(str) {
      if (!str) {
        return "";
      }
      try {
        const arrD = str.split(" ")[0].split("-");
        return `${arrD[2]}-${arrD[1]}-${arrD[0]}`;
      } catch (error) {
        return str;
      }
    },
    cutTimeString(str) {
      if (!str) {
        return "";
      }
      try {
        const arrD = str.split(" ")[1];
        return `${String(arrD).slice(0, 5)}`;
      } catch (error) {
        return str;
      }
    },

    parseStringTime(_date) {
      if (!_date) {
        return "";
      }
      const dmy = _date.split(" ")[0];
      const time = _date.split(" ").pop();
      const dmyParse = `${dmy.slice(-2)}/${dmy.slice(5, 7)}/${dmy.slice(0, 4)}`;
      return `${dmyParse} lúc ${time.slice(0, time.length - 3)}`;
    },
    handleLoadmoreComment() {
      if (this.currentCounter >= this.totalLog) {
        return;
      }
      this.onLoadingMoreComment = true;
      this.currentCounter += 8;
      this.$store.dispatch("tasks/getTaskActivities", {
        id: this.currentId,
        scrollAble: false,
      });
    },

    async getAllListLogs(id, scrollAble = true) {
      const params = {
        size: this.currentCounter,
      };
      const res = await api.task.getListLogs(id, params);
      this.onLoadingMoreComment = false;
      this.isFirstLoading = false;
      this.onLoadingComments = false;
      if (!res) {
        this.$store.commit("SET_SNACKBAR", {
          type: "error",
          title: "",
          content: "Không lấy được thông tin hoạt động",
        });
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.listLogs = res.data.data.activities;
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
            content:
              "Không lấy được thông tin hoạt động. Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      } catch (error) {
        //  messageErr.value = error;
        console.log(error);
        this.$store.commit("SET_SNACKBAR", {
          type: "error",
          title: "",
          content:
            "Không lấy được thông tin hoạt động. Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
        });
      }
    },

    scrollToBtm() {
      const area = document.querySelector("#logs-area");
      if (area) {
        area.scrollTop = area.scrollHeight + 200;
      }
    },
  },
};
</script>

<style lang="scss">
.todo-activity-wr {
  height: 50%;
  display: flex;
  flex-flow: column;
  /* height: calc(100vh - 240px); */
  padding: 6px 6px 12px 6px;
  .logs-area {
    /* max-height: (300px); */
    height: 100%;
    /* max-height: calc(100vh - 240px); */
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
    .no-task {
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
  }
  .each-log {
    &__date {
      font-size: 12px;
      font-weight: 500;
      color: #8194a5;
    }
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
    &__block {
      &:hover {
        background: #c7d6e236;
      }
    }
  }
  .log {
    &__desc {
      font-size: 12px;
      font-weight: 400;
      color: #223140;
    }
    &__timer {
      font-size: 10px;
      font-weight: 400;
      color: #223140;
    }
    &__causer-name {
      font-size: 13px;
      font-weight: 500;
      color: #223140;
    }
  }
}
</style>
