<template>
  <v-menu
    id="menu-notifi"
    bottom
    right
    content-class="dropdown-menu menu-notifi"
    offset-y
    class="notifi-menu"
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        color="#f55a4e"
        overlap
        tile
        content="6"
        style="border-radius: 100%"
      >
        <v-icon color="primary" dark v-bind="attrs" v-on="on">
          mdi-bell
        </v-icon>
      </v-badge>
    </template>
    <v-card
      class="notifi-card"
      id="card-noti"
      v-scroll:#card-noti="logScroll"
      :height="
        notifications.length > 1 ? (notifications.length + 1) * 100 : 200
      "
      max-height="600"
    >
      <p class="noti-header px-4 pt-2 font-weight-bold pb-0">Thông báo</p>
      <v-list v-if="notifications.length" class="list-item p-0">
        <v-list-item
          v-for="(notification, id) in notifications"
          :key="id"
          class="v-listitem d-flex"
          :class="notification.read_at ? '' : 'no-active'"
          @click="notification.status = false"
        >
          <v-list-item class="p-0">
            <v-avatar color="#006a9b" size="37"
              ><v-icon class="white--text">
                {{ notification.icon }}
              </v-icon></v-avatar
            >
            <v-list-item-content class="ml-2 p-0">
              <b class="title-noti">{{ notification.title }}</b>
              <p class="text-noti">{{ notification.text }}</p>
              <p class="p-0 m-0 descript-noti">
                {{ notification.date }} Lúc {{ notification.time }}
              </p>
            </v-list-item-content>
            <div v-if="notification.status" class="new-noti"></div>
          </v-list-item>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item class="no-noti d-flex justify-center">
          <p class="pb-5">Không có thông báo</p>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  props: {},
  setup: () => {
    let notifications = ref<any[]>([
      {
        title: "Thông báo mới ne",
        text: "bạn đã nhận được thông báo mới bạn đã nhận được thông báo mới bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
      {
        title: "Thông báo mới",
        text: "bạn đã nhận được thông báo mới",
        icon: "mdi-clock",
        date: "30/08/2021",
        time: "15:49",
        status: true,
      },
    ]);
    //  let notifications = ref<any[]>([]);
    let per_page = ref<number>(10);
    let totalListNotifi = ref<number>(0);
    return {
      notifications,
      per_page,
      totalListNotifi,
    };
  },
  created() {
    // this.getTotalNotifi();
    // this.getNotifi(this.per_page);
  },
  methods: {
    logScroll(e: any) {
      console.log(
        e.target.scrollHeight,
        e.target.clientHeight,
        e.target.scrollTop
      );
      // if (e.target.clientHeight + e.target.scrollTop + 10 >= e.target.scrollHeight) {
      //   if (this.per_page <= this.totalListNotifi) {
      //     this.getNotifi(this.per_page + 1);
      //   }
      // }
    },
    // async getNotifi(_perpage:number) {
    //   const _data = await this.$api.notifications.getNotifi(_perpage);
    //   _data.data.meta.code >= 200 && _data.data.meta.code < 400
    //     ? (() => {
    //         this.notifications = _data.data.data;
    //         this.per_page = _data.data.meta.pagination.per_page;
    //         this.totalListNotifi = _data.data.meta.pagination.total;
    //       })()
    //     : (() => {
    //         this.color = 'error';
    //         this.message = 'Có lỗi xảy ra.Vui lòng thử lại sau';
    //         this.snackbar = true;
    //       })();
    // },
    // handleRead(notifi:any) {
    // notifi.read_at
    // ? (() => {})()
    // : (() => {
    //     this.postRead(notifi.id);
    //   })();
    // },
    // async postRead(_id:any) {
    //   const _data = await this.$api.notifications.postRead(_id);
    //   _data.data.meta.code >= 200 && _data.data.meta.code < 400
    //     ? (() => {
    //         this.notifications = this.notifications.map((item) => {
    //           return item.id === _id
    //             ? {
    //                 ...item,
    //                 read_at: new Date()
    //               }
    //             : item;
    //         });
    //       })()
    //     : (() => {
    //         this.color = 'error';
    //         this.message = 'Có lỗi xảy ra.Vui lòng thử lại sau';
    //         this.snackbar = true;
    //       })();
    // }
  },
});
</script>
<style lang="scss" scoped>
.noti-header {
  font-size: 16px;
  color: #666666;
}
.notifi-card {
  width: 330px !important;
  border-radius: 8px;
  padding-top: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: white;
  &:hover::-webkit-scrollbar {
    width: 5px;
  }
  &:hover::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #cccccc;
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #3d3c3d;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #cccccc00;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #3d3c3d;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
  .list-item {
    background-color: #f3f7f9;
  }
  .v-listitem {
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 1px;
    overflow: hidden;
    .title-noti {
      font-size: 14px;
      color: #30373e;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      -webkit-box-orient: vertical;
      line-height: initial;
    }
    .text-noti {
      font-size: 13px;
      color: #30373e;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
    .descript-noti {
      font-size: 12px;
      color: #8295a6;
    }
    .new-noti {
      border: 1px solid #89c3ef;
      height: 10px;
      width: 10px;
      border-radius: 20px;
      background-color: #89c3ef;
    }
    .notifi-title {
      width: calc(100% - 47px);
      .v-list__tile__title {
        word-break: normal;
        height: unset !important;
        white-space: unset !important;
        overflow: unset !important;
        line-height: unset !important;
        text-overflow: unset !important;
      }
    }
    &:hover {
      background-color: #a1c7ee3c;
    }
  }
}
.menu-notifi {
  border-radius: 8px !important;
  z-index: 99 !important;
}
</style>
<style lang="scss">
.v-badge--tile .v-badge__badge {
  border-radius: 50% !important;
}
</style>
