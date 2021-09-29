<template>
  <div
    class="sidebar-container"
    :class="currentTab === 'to-do' ? 'to-do-tab' : ''"
  >
    <v-card
      class="sidebar-card-body bg-white"
      :class="currentTab === 'to-do' ? 'to-do-tab' : ''"
    >
      <!-- <v-btn color="accent" x-small elevation="2" class="btn-toggle-mini" :class="mini ? 'goto-collapse' : 'goto-expand'" @click="toggleMini">
   <v-icon>mdi-chevron-left</v-icon>
  </v-btn> -->
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        width="100%"
      >
        <v-list-item class="px-0">
          <div class="sidebar-logo-link pointer">
            <v-menu transition="slide-y-transition" bottom :offset-y="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="sidebar-header-btn pr-0">
                  <div v-if="user" class="user-info-sb">
                    <img :src="user.user.avatar" alt="" class="avatar-img" />
                    <div class="user-info-sb__side-info pl-2">
                      <p class="mb-0 u-name text-darkgrey">
                        {{ user.user.full_name }}
                      </p>
                      <p class="mb-0 u-pos text-blur pt-1">
                        {{ user.user.asgl_id }}
                      </p>
                    </div>
                  </div>
                </v-btn>
              </template>
              <v-list>
                <v-list-item class="pointer sb-item-menu" @click="handleLogout">
                  <v-list-item-title>Đăng xuất</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <DialogNotification></DialogNotification>
        </v-list-item>

        <!-- <v-divider></v-divider> -->

        <v-list
          v-if="currentTab === 'aprroval'"
          dense
          class="bg-transparent body-sidebar-dense"
          :class="mini ? 'body-sidebar-dense-mini' : ''"
        >
          <div v-for="side in navFieldComputed" :key="side.groupText">
            <v-list-group
              v-if="side.type !== 'divider' && side.isGroup"
              :value="false"
              prepend-icon="mdi-account-circle"
              class="each-items-group"
              :class="
                side.matchToActive.includes(currentRouteName)
                  ? 'onechild-on-active'
                  : ''
              "
            >
              <template v-slot:activator>
                <v-list-item-title>
                  {{ side.groupText }}
                </v-list-item-title>
              </template>

              <v-list-group
                v-for="(child, idx) in side.listChild"
                :key="child + idx"
                :value="false"
                class="each-items"
                no-action
                sub-group
                :class="
                  child.matchToActive.includes(currentRouteName)
                    ? 'sidechick-on-active'
                    : ''
                "
              >
                <template v-slot:activator>
                  <v-list-item-content @click="child.action()">
                    <v-list-item-title>{{ child.itemText }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-group>
            </v-list-group>
            <v-list-item
              v-if="side.type !== 'divider' && side.isBlock"
              class="pointer each-items single-group single-group-block"
            >
              <v-list-item-title>{{ side.groupText }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="side.type !== 'divider' && !side.isGroup && !side.isBlock"
              class="pointer each-items single-group"
              :class="[
                side.matchToActive.includes(currentRouteName)
                  ? 'sidechick-on-active'
                  : '',
                mini ? 'each-items-on-menu' : '',
              ]"
              @click="side.action()"
            >
              <v-list-item-icon v-if="!side.isBlock">
                <v-icon v-if="!mini && !side.icon">mdi-home</v-icon>
                <img
                  v-if="!mini && side.icon"
                  :src="side.icon.active"
                  alt=""
                  class="icon-sidebar-active"
                />
                <img
                  v-if="!mini && side.icon"
                  :src="side.icon.unActive"
                  alt=""
                  class="icon-sidebar-unactive"
                />
                <v-tooltip v-if="mini" right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-if="!side.icon" v-bind="attrs" v-on="on"
                      >mdi-home</v-icon
                    >
                    <img
                      v-if="side.icon"
                      :src="side.icon.active"
                      alt=""
                      v-bind="attrs"
                      v-on="on"
                      class="icon-sidebar-active"
                    />
                    <img
                      v-if="side.icon"
                      :src="side.icon.unActive"
                      alt=""
                      v-bind="attrs"
                      v-on="on"
                      class="icon-sidebar-unactive"
                    />
                  </template>
                  <span>{{ side.groupText }} </span>
                </v-tooltip>
              </v-list-item-icon>

              <v-list-item-title
                >{{ side.groupText }}
                <span
                  v-if="side.groupText === 'Đề xuất' && statistical.i_created"
                  class="badget-statistical-counter"
                >
                  {{ statistical.i_created }}</span
                >
                <span
                  v-if="side.groupText === 'Cần duyệt' && statistical.i_approve"
                  class="badget-statistical-counter"
                >
                  {{ statistical.i_approve }}</span
                >
                <span
                  v-if="
                    side.groupText === 'Theo dõi' && statistical.i_following
                  "
                  class="badget-statistical-counter"
                >
                  {{ statistical.i_following }}</span
                >
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="side.type === 'divider'"></v-divider>
          </div>
        </v-list>
        <v-list
          v-if="currentTab === 'to-do'"
          dense
          class="bg-transparent body-sidebar-dense"
          :class="mini ? 'body-sidebar-dense-mini' : ''"
        >
          <div class="sidebar-announcement">
            <div v-if="currentTab == 'to-do'" class="d-flex align-items-center">
              <div class="d-flex search-block-wrapper align-items-center mt-3">
                <img src="../../assets/images/search-lookup.svg" alt="" />
                <input
                  v-model="textQuery"
                  type="text"
                  placeholder="Tìm kiếm ..."
                  class="w-100 border-0 btn-no-outline pl-2"
                />
              </div>
              <button
                style="height: 36px; margin-top: 12px"
                class="btn btn-no-outline bg-transparent ml-4 p-0"
                @click="openDialogAddJob"
              >
                <img src="../../assets/images/library_add.png" alt="" />
              </button>
            </div>
            <div class="px-0 mt-3">
              <div
                v-if="currentTab == 'to-do'"
                class="filter-by row px-0 mb-0 position-relative"
              >
                <p
                  class="
                    position-relative
                    mb-0
                    col-4
                    px-0
                    text-center
                    pointer
                    font-size-16
                    fw-500
                    filter-items
                  "
                  :class="[filterBy === 'own' ? 'filterActive' : '']"
                  @click="filterBy = 'own'"
                >
                  Tôi giao
                </p>
                <p
                  class="
                    position-relative
                    mb-0
                    col-4
                    px-0
                    text-center
                    pointer
                    font-size-16
                    fw-500
                    filter-items
                  "
                  :class="[filterBy === 'assign' ? 'filterActive' : '']"
                  @click="filterBy = 'assign'"
                >
                  Cần làm
                </p>
                <p
                  class="
                    position-relative
                    mb-0
                    col-4
                    px-0
                    text-center
                    pointer
                    font-size-16
                    fw-500
                    filter-items
                  "
                  :class="[filterBy === 'follow' ? 'filterActive' : '']"
                  @click="filterBy = 'follow'"
                >
                  Theo dõi
                </p>

                <div
                  class="dashline col-4 position-absolute"
                  :class="filterBy !== '' ? [filterBy] : 'd-none'"
                ></div>
              </div>
            </div>
            <div class="state-status">
              <div class="state">
                <div class="header">Tình trạng</div>
                <div
                  class="filter"
                  @click="handleOpenSelectState"
                  v-click-outside="handleCloseSelectState"
                >
                  : Tất cả ({{ listTaskComputed.length }})
                </div>
                <v-list v-if="showOptionState" class="state-menu">
                  <v-list-item @click="handleCloseSelectState">
                    Tất cả ({{ listTaskComputed.length }})
                  </v-list-item>
                  <v-list-item @click="handleCloseSelectState"
                    >Tất cả ({{ listTaskComputed.length }})</v-list-item
                  >
                </v-list>
              </div>
              <div class="status">
                <div class="header">Trạng thái</div>
                <div
                  class="filter"
                  @click="handleOpenSelectStatus"
                  v-click-outside="handleCloseStatusOnly"
                >
                  : {{ statusName }} ({{ listTaskComputed.length }})
                </div>
                <v-list
                  v-if="showOptionStatus"
                  class="status-menu"
                  v-model="status"
                >
                  <v-list-item @click="handleCloseSelectStatus(0)">
                    Tất cả ({{ listTaskComputed.length }})
                  </v-list-item>
                  <v-list-item @click="handleCloseSelectStatus(2)">
                    Đã nhận ({{ listTaskComputed.length }})
                  </v-list-item>
                  <v-list-item @click="handleCloseSelectStatus(1)"
                    >Chưa nhận ({{ listTaskComputed.length }})</v-list-item
                  >
                  <v-list-item @click="handleCloseSelectStatus(5)">
                    Quan trọng ({{ listTaskComputed.length }})
                  </v-list-item>
                  <v-list-item @click="handleCloseSelectStatus(3)"
                    >Hoàn thành ({{ listTaskComputed.length }})</v-list-item
                  >
                  <v-list-item @click="handleCloseSelectStatus(4)"
                    >Đã thu hồi ({{ listTaskComputed.length }})</v-list-item
                  >
                </v-list>
              </div>
            </div>
            <keep-alive>
              <div
                class="father-task-block"
                id="task-wrapper"
                @scroll="taskScroll"
              >
                <div
                  class="task-block"
                  v-for="(task, idx) in listTaskComputed"
                  :key="idx"
                  :class="currentId === task.id ? 'selected-father' : ''"
                >
                  <div @click="handleDetailTodo(task.id)">
                    <div class="d-flex justify-content-between">
                      <p class="task-title">{{ task.title }}</p>
                      <img
                        src="@/assets/images/star.png"
                        width="24px"
                        height="24px"
                        v-if="task.important"
                      />
                    </div>
                    <p class="task-content">{{ task.content }}</p>
                    <div class="task-detail">
                      <div
                        class="task-status"
                        :class="
                          task.status.id === 1
                            ? 'new'
                            : task.status.id === 2
                            ? 'doing'
                            : task.status.id === 3
                            ? 'complete'
                            : ''
                        "
                      >
                        {{ task.status_vietnamese }}
                      </div>
                      <div style="display: flex">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-right: 16px;
                          "
                        >
                          <img
                            src="../../assets/images/has-file.svg"
                            height="14px"
                            width="14px"
                            class="mr-2"
                          />
                          <div class="font-size-12">
                            {{ task.attachments.length }}
                          </div>
                        </div>
                        <div style="display: flex; align-items: center">
                          <img
                            src="../../assets/images/chat-tabs.svg"
                            height="14px"
                            width="14px"
                            class="mr-2"
                          />
                          <div class="font-size-12">0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </keep-alive>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-tabs
        v-model="currentTab"
        class="side-bar-bottom-tabs"
        @change="onChangeTabs"
        :grow="true"
      >
        <v-tab href="#aprroval" @click="redirectApproval">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="currentTab === 'aprroval' ? 'primary' : 'secondary'"
                dark
                v-bind="attrs"
                v-on="on"
              >
                mdi-export-variant
              </v-icon>
            </template>
            <span>Approval</span>
          </v-tooltip>
        </v-tab>
        <v-tab href="#to-do" @click="redirectToDo">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="currentTab === 'to-do' ? 'primary' : 'secondary'"
                dark
                v-bind="attrs"
                v-on="on"
              >
                mdi-briefcase-variant
              </v-icon>
            </template>
            <span>To do</span>
          </v-tooltip>
        </v-tab>
        <v-tab href="#sso" @click="redirectToApps">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="currentTab === 'sso' ? 'primary' : 'secondary'"
                dark
                v-bind="attrs"
                v-on="on"
              >
                mdi-apps
              </v-icon>
            </template>
            <span>Apps</span>
          </v-tooltip>
        </v-tab>
      </v-tabs>
      <ConfirmSignout v-if="logoutIsOpen"></ConfirmSignout>
      <DialogAddJob
        :is-visible="isVisible"
        @handlerCancel="handlerDialogCancel"
        @handlerSubmit="handlerDialogSubmit"
        :err-msg="errMsg"
        :loading-btn="loadingBtn"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
// "
import { ref, defineComponent, watch, computed } from "@vue/composition-api";
import ShippingUnactive from "../../assets/images/sidebar-icon/shipping_u.svg";
import ShippingActive from "../../assets/images/sidebar-icon/shipping.svg";
import CategoryActive from "../../assets/images/sidebar-icon/danh-muc-sidebar-active.png";
import CategoryUnActive from "../../assets/images/sidebar-icon/danh-muc-sidebar-unactive.png";
import SignoutUnactive from "../../assets/images/sidebar-icon/signout_u.svg";
import SignoutActive from "../../assets/images/sidebar-icon/signout.svg";
import ChuKyActive from "../../assets/images/sidebar-icon/chu-ky-sidebar-active.png";
import ChuKyUnActive from "../../assets/images/sidebar-icon/chu-ky-sidebar-unactive.png";
import ProposeActive from "../../assets/images/sidebar-icon/dexuat-sidebar-active.png";
import ProposeUnactive from "../../assets/images/sidebar-icon/dexuat-sidebar-unactive.png";
import ApprovalActive from "../../assets/images/sidebar-icon/canduyet-sidebar-active.svg";
import theodoiActive from "../../assets/images/sidebar-icon/theodoi-sidebar-active.png";
import theodoiUnactive from "../../assets/images/sidebar-icon/theodoi-sidebar-unactive.png";
import ApprovalUnactive from "@/assets/images/sidebar-icon/canduyet-sidebar-unactive.svg";
import ConfirmSignout from "@/components/popup/ConfirmSignout.vue";
import DialogNotification from "@/components/Form/DialogNotification.vue";
import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
import { IdentifyObject } from "@/InterfaceModel/CustomObject";
import DialogAddJob from "@/components/Form/DialogAddJob.vue";
import route from "@/router/index";
import api from "@/services";
import vClickOutside from "v-click-outside";

import { mapGetters, mapState } from "vuex";

export default defineComponent({
  name: "SideBar",
  props: {
    sidebarIsCollapse: Boolean,
    toggleColappse: Function,
    Tab: String,
  },
  components: { ConfirmSignout, DialogNotification, DialogAddJob },
  setup: (ctx) => {
    const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
    let drawer = ref<boolean>(true);
    let mini = ref<boolean>(false);
    let isVisible = ref<boolean>(false);
    const loadingBtn = ref<boolean>(false);
    let showOptionState = ref<boolean>(false);
    let showOptionStatus = ref<boolean>(false);
    let status = ref<number>(-1);
    let important = ref<number>(0);
    let maxSize = ref<number>(15);
    let errMsg = ref<string>("");
    let statusName = ref<string>("Tất cả");
    let currentRouteName = ref<string>("nthing-hp");
    const currentRouteQuery = ref<string>(stringQueryRender);
    let refInterval = ref<number>(0);
    let currentTab = ref<string>("aprroval");
    let filterBy = ref<string>("");
    let textQuery = ref<string>("");
    const setMini = (type: boolean): any => {
      mini.value = type;
    };
    const setDrawer = (type: boolean) => {
      drawer.value = type;
    };
    const setCurrentRouteName = (name: string): any => {
      currentRouteName.value = name;
    };
    const setCurrentRouteQuery = (payload: Record<string, unknown>): any => {
      let pairO = {
        ...payload,
      };
      currentRouteQuery.value = getQueryRoute(pairO);
    };
    const setIsVisible = (value: boolean) => {
      isVisible.value = value;
    };
    const setLoadingBtn = (payload: boolean) => {
      loadingBtn.value = payload;
    };
    const setCurrentTab = (tab: string): any => {
      currentTab.value = tab;
    };
    const setShowOptionState = (type: boolean) => {
      showOptionState.value = type;
    };
    const setShowOptionStatus = (type: boolean) => {
      showOptionStatus.value = type;
    };
    const setErrMsg = (payload: string) => {
      errMsg.value = payload;
    };

    watch(currentRouteQuery, (currentValue) => {
      route.push(`${currentValue}`);
    });
    watch(textQuery, (search) => {
      if (refInterval.value) {
        clearTimeout(refInterval.value);
      }

      refInterval.value = setTimeout(() => {
        setCurrentRouteQuery({
          ...queryRoute,
          search,
        });
      }, 600);
    });
    watch(filterBy, (type) => {
      setCurrentRouteQuery({
        ...queryRoute,
        type,
      });
    });
    watch(status, (status_id) => {
      setCurrentRouteQuery({
        ...queryRoute,
        status_id,
      });
    });
    watch(important, (important) => {
      setCurrentRouteQuery({
        ...queryRoute,
        important,
      });
    });

    return {
      drawer,
      mini,
      textQuery,
      status,
      errMsg,
      important,
      maxSize,
      loadingBtn,
      statusName,
      currentRouteQuery,
      showOptionState,
      showOptionStatus,
      currentRouteName,
      currentTab,
      isVisible,
      queryRoute,
      filterBy,
      setMini,
      setDrawer,
      setCurrentRouteQuery,
      setIsVisible,
      setErrMsg,
      setLoadingBtn,
      setShowOptionState,
      setShowOptionStatus,
      setCurrentRouteName,
      setCurrentTab,
    };
  },

  data() {
    return {
      signOut: false,
      currentId: 0,
      refScroll: 0,
      navField: [
        {
          icon: {
            unActive: ProposeUnactive,
            active: ProposeActive,
          },
          tab: "aprroval",
          groupText: "Đề xuất",
          isGroup: false,
          matchToActive: [
            "de-xuat",
            "index",
            "de xuat tao moi",
            "de xuat chinh sua",
          ],
          action: () => {
            this.$router.push("/");
          },
        },
        {
          icon: {
            unActive: ApprovalUnactive,
            active: ApprovalActive,
          },
          groupText: "Cần duyệt",
          tab: "aprroval",
          isGroup: false,
          matchToActive: ["cần duyệt", "chi tiết cần duyệt"],
          action: () => {
            this.$router.push("/can-duyet");
          },
        },

        {
          icon: {
            unActive: theodoiUnactive,
            active: theodoiActive,
          },
          groupText: "Theo dõi",
          tab: "aprroval",
          isGroup: false,
          matchToActive: ["theo dõi", "chi tiết theo dõi"],
          action: () => {
            this.$router.push("/theo-doi");
          },
        },
        {
          tab: "aprroval",
          icon: {
            unActive: CategoryUnActive,
            active: CategoryActive,
          },
          groupText: "Danh mục",
          isGroup: false,
          matchToActive: ["danh-muc", "danh-muc tao-moi"],
          action: () => {
            this.$router.push("/danh-muc");
          },
        },
        //  {
        //   groupText: "User Guide",
        //   isGroup: false,
        //   matchToActive: ["about"],
        //   action: () => {
        //    this.$router.push("/about");
        //   },
        //  },
        {
          type: "divider",
        },
        {
          groupText: "Admin",
          isGroup: false,
          isBlock: true,
          matchToActive: [],
        },

        {
          icon: {
            unActive: ShippingUnactive,
            active: ShippingActive,
          },
          groupText: "User",
          isGroup: false,
          matchToActive: ["user"],
          action: () => {
            this.$router.push("/user");
          },
        },

        {
          type: "divider",
        },
        {
          icon: {
            unActive: SignoutUnactive,
            active: SignoutActive,
          },
          groupText: "Sign Out",
          isGroup: false,
          matchToActive: ["none"],
          action: () => {
            this.$store.commit("CONFIRM_LOGOUT", true);
          },
        },
        //  {
        //   icon: {
        //    unActive: SignoutUnactive,
        //    active: SignoutActive,
        //   },
        //   tab: "aprroval",
        //   groupText: "Test Comma",
        //   isGroup: false,
        //   matchToActive: ["test-comma"],
        //   action: () => {
        //    this.$router.push("/test-comma");
        //   },
        //  },
        {
          icon: {
            unActive: ChuKyUnActive,
            active: ChuKyActive,
          },
          tab: "aprroval",
          groupText: "Chữ ký",
          isGroup: false,
          matchToActive: ["chu-ky"],
          action: () => {
            this.$router.push("/chu-ky");
          },
        },
        //  {
        //   groupText: "Action",
        //   isGroup: true,
        //   matchToActive: ["table", "report"],
        //   listChild: [
        //    {
        //     itemText: "Report",
        //     matchToActive: ["report"],
        //     action: () => {
        //      this.$router.push("/report");
        //     },
        //    },
        //    {
        //     itemText: "Table",
        //     matchToActive: ["table"],
        //     action: () => {
        //      this.$router.push("/table");
        //     },
        //    },
        //   ],
        //  },
      ],
    };
  },
  created() {
    this.setMini(this.isMini);
  },
  computed: {
    ...mapState({
      logoutIsOpen: (state: any): boolean => state.logoutIsOpen,
      isMini: (state: any): boolean => state.isMini,
      statistical: (state: any): boolean => state.statistical,
      listTask: (state: any) => state.tasks.listTask,
      maxCountCurrentTask: (state: any): number =>
        state.tasks.maxCountCurrentTask,
      currentSizeTask: (state: any): number => state.tasks.currentSizeTask,
      previousOffsetTop: (state: any): number => state.tasks.previousOffsetTop,
      filterTask: (state: any): Record<string, any> => state.tasks.filterTask,
    }),
    ...mapGetters({
      user: "getUser",
    }),
    navFieldComputed() {
      const arr: Array<any> = this.navField.map((o: any) => o);
      const result: Array<any> = arr.filter(
        (o: any) => o.tab === this.currentTab
      );
      return result;
    },
    listTaskComputed() {
      const arr: Array<any> = this.listTask;
      return arr.map((o: any) => {
        return {
          ...o,
          status_vietnamese:
            o.status && o.status.id === 1
              ? "Mới"
              : o.status && o.status.id === 2
              ? "Đang làm"
              : o.status && o.status.id === 3
              ? "Hoàn thành"
              : "",
        };
      });
    },
  },
  mounted() {
    const currentName = this.$route.name;
    if (currentName) {
      this.setCurrentRouteName(String(currentName).toLowerCase());
    }
    if (currentName && currentName === "Giao việc") {
      this.currentTab = "to-do";
    }
    if (currentName && currentName === "Chi tiết giao việc") {
      this.currentTab = "to-do";
    }
    if (this.queryRoute) {
      if (this.queryRoute.search) {
        this.textQuery = this.queryRoute.search;
      }
      let _obj: any = { ...this.queryRoute };
      delete _obj.search;
      // if (this.queryRoute.status_id === "0") {
      //   this.status = 0;
      // delete this.queryRoute.status_id;
      // if (!this.queryRoute.status_id) {
      //   this.status = -1;
      // }
      // }
      // this.setCurrenttypele(_obj)

      // this.setCurrentRouteQuery(this.queryRoute)
      Object.keys(this.queryRoute).forEach(
        (k) => this.queryRoute[k] == null && delete this.queryRoute[k]
      );
    }
    const isSameQuery =
      this.filterTask.type === this.queryRoute.type &&
      this.filterTask.status_id == this.queryRoute.status_id &&
      this.filterTask.important == this.queryRoute.important &&
      this.filterTask.search === this.queryRoute.search;
    if (this.currentTab === "to-do") {
      const currentQuery = this.$route.query;
      this.maxSize = +currentQuery.size || 15;
      this.$nextTick(() => {
        this.scrollToSelected();
      });
    }
    if (this.currentTab === "to-do" && !isSameQuery) {
      const currentQuery = this.$route.query;
      this.$store.commit(
        "tasks/SET_CURRENT_SIZE_TASK",
        +currentQuery.size || 15
      );
      this.$store.commit("tasks/SET_FILTER_TASK", this.queryRoute);
      this.$store.dispatch("tasks/getListTask");
    }
    if (!this.$route.query.type && this.currentTab === "to-do") {
      this.$router.push(`/giao-viec?type=own&size=${this.currentSizeTask}`);
    }
  },
  watch: {
    $route(_newVal) {
      const currentName = _newVal.name;
      if (currentName) {
        this.setCurrentRouteName(String(currentName).toLowerCase());
      }
      if (currentName && currentName === "to-do") {
        this.currentTab = "to-do";
      }
    },
    isMini(newVal) {
      this.setMini(newVal);
    },
    listTask: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollToSelected();
        });
      },
    },
    currentTab() {
      if (this.$router.app.$route.params) {
        this.currentId = Number(this.$router.app.$route.params.id);
      }
      if (this.$router.app.$route.query.type) {
        this.filterBy = String(this.$router.app.$route.query.type);
      }
      // if (
      //   this.$router.app.$route.query.status_id &&
      //   this.$router.app.$route.query.status_id === "0"
      // ) {
      //   this.statusName = "Tất cả";
      //   delete this.queryRoute.status_id;
      //   delete this.$router.app.$route.query.status_id;
      // }
      if (
        this.$router.app.$route.query.status_id &&
        this.$router.app.$route.query.status_id === "1"
      ) {
        this.statusName = "Chưa nhận";
      }
      if (
        this.$router.app.$route.query.status_id &&
        this.$router.app.$route.query.status_id === "2"
      ) {
        this.statusName = "Đã nhận";
      }
      if (
        this.$router.app.$route.query.status_id &&
        this.$router.app.$route.query.status_id === "3"
      ) {
        this.statusName = "Hoàn thành";
      }
      if (
        this.$router.app.$route.query.status_id &&
        this.$router.app.$route.query.status_id === "4"
      ) {
        this.statusName = "Đã thu hồi";
      }
      if (
        this.$router.app.$route.query.important &&
        this.$router.app.$route.query.important === "1"
      ) {
        this.statusName = "Quan trọng";
      }
      if (this.currentTab === "sso") {
        this.$nextTick(() => {
          this.currentTab = "aprroval";
        });
      }
    },
  },

  methods: {
    async handleTakeComments(id: any) {
      const res = await api.task.comment(id, { pagination: false });
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
          return [];
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
    handleOpenSelectState() {
      this.setShowOptionState(true);
    },
    handleCloseSelectState() {
      this.setShowOptionState(false);
    },
    handleOpenSelectStatus() {
      this.setShowOptionStatus(true);
    },
    handleCloseStatusOnly() {
      this.setShowOptionStatus(false);
    },
    handleCloseSelectStatus(id: any) {
      if (id === 5) {
        this.important = 1;
        delete this.queryRoute.status_id;
      } else if (id === 0) {
        this.status = id;
        delete this.queryRoute.important;
        // delete this.$router.app.$route.query.status_id;
      } else {
        this.status = id;
        delete this.queryRoute.important;
      }
      Object.keys(this.queryRoute).forEach(
        (k) => this.queryRoute[k] == null && delete this.queryRoute[k]
      );
      this.setShowOptionStatus(false);
    },
    formatDate(ds: any) {
      let ar1 = ds.split("-");
      return `${ar1[2]}-${ar1[1]}-${ar1[0]}`;
    },
    formatTick(ds: any) {
      if (ds === true) {
        return "1";
      } else {
        return "0";
      }
    },
    async handlerDialogSubmit(
      value: any,
      value2: any,
      value3: any,
      value4: any
    ) {
      this.setErrMsg("");
      this.setLoadingBtn(true);
      let due_date = this.formatDate(value.due_date);
      let important = this.formatTick(value.is_important);
      let arrayId = value2.map((o: any) => o.id);
      let arrayFollowersId = value4.map((o: any) => o.id);
      let arrayFile = value3.map((o: any) => o);
      delete value.due_date;
      delete value.is_important;
      const formData = new FormData();
      arrayFile.forEach((element: any) => {
        formData.append("attachments[]", element.blob);
      });
      arrayFollowersId.forEach((element: any) => {
        formData.append("user_follow_ids[]", element);
      });
      arrayId.forEach((element: any) => {
        formData.append("user_do_ids[]", element);
      });
      formData.append("due_date", due_date);
      formData.append("important", important);
      formData.append("title", value.title);
      formData.append("content", value.content);
      // let body = {
      //   ...value,
      //   due_date,
      //   important,
      //   user_do_ids: arrayId,
      //   user_follow_ids: arrayId,
      //   'attachments[]': value3
      // };
      const res = await api.todo.create(formData);
      this.setLoadingBtn(false);
      if (!res) {
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.$store.commit("SET_SNACKBAR", {
            type: "success",
            title: "",
            content: "Tạo việc thành công",
          });
          this.$store.dispatch("tasks/getListTask");
          this.handlerDialogCancel();
        } else {
          this.setErrMsg(res.data.data.error || res.data.message);
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: res.data.data.error || res.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.commit("SET_SNACKBAR", {
          type: "error",
          title: "",
          content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
        });
      }
    },
    handlerDialogCancel() {
      this.setIsVisible(false);
    },
    openDialogAddJob() {
      this.setIsVisible(true);
    },
    redirectToApps() {
      window.open(`${process.env.VUE_APP_APPS_URL}`);
    },
    handleDetailTodo(id: number) {
      if (this.$router.app.$route.path.includes("/giao-viec/${id}")) {
        return;
      }
      const currentQuery = this.$route.query;
      this.$router.push({ path: `/giao-viec/${id}`, query: currentQuery });
      this.currentTab = "to-do";
    },
    redirectToDo() {
      if (this.$router.app.$route.path.includes("/giao-viec")) {
        return;
      }
      this.$router.push(`/giao-viec?type=own&size=${this.currentSizeTask}`);
      this.currentTab = "to-do";
    },
    redirectApproval() {
      if (
        this.$router.app.$route.path === "/" ||
        this.$router.app.$route.path === "/can-duyet" ||
        this.$router.app.$route.path === "/theo-doi" ||
        this.$router.app.$route.path === "/danh-muc" ||
        this.$router.app.$route.path === "/chu-ky"
      ) {
        return;
      }
      this.$router.push("/");
      this.currentTab = "approval";
    },
    toggleMini() {
      this.setMini(!this.mini);
    },
    onChangeTabs(val: any) {
      console.log(val);
    },
    handleLogout() {
      this.$store.commit("CONFIRM_LOGOUT", true);
    },
    scrollToSelected() {
      const target = document.querySelector(".task-block.selected-father");
      const wr = document.querySelector("#task-wrapper");
      if (target instanceof HTMLElement && wr instanceof HTMLElement) {
        wr.scrollTop = target.offsetTop - wr.offsetTop - 20;
        return;
      }
      if (wr instanceof HTMLElement) {
        wr.scrollTop = this.previousOffsetTop;
        return;
      }
    },
    taskScroll(e: any) {
      if (this.refScroll) {
        clearTimeout(this.refScroll);
      }
      this.refScroll = setTimeout(() => {
        const target = e.target;

        if (target.scrollHeight - target.scrollTop > 700) {
          return;
        }

        const currentSize = this.currentSizeTask;
        if (currentSize < this.maxCountCurrentTask) {
          this.$store.commit("tasks/SET_PREVIOUS_OFFSET_TOP", target.scrollTop);
          this.$store.commit("tasks/SET_CURRENT_SIZE_TASK", +currentSize + 5);
          const currentQuery = this.$route.query;

          this.$router.push(
            {
              query: Object.assign(
                { ...currentQuery },
                { size: currentSize + 5 }
              ),
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            () => {}
          );
          this.$store.dispatch("tasks/getListTask");
        }
      }, 200);
    },
  },
});
</script>
<style lang="scss">
.sidebar-container {
  .v-slide-group__prev,
  .v-slide-group__next {
    display: none !important;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
.sidebar-container {
  height: 100vh;
  position: sticky;
  top: 0;
  width: 250px;
  .v-navigation-drawer {
    height: calc(100% - 80px);
  }
  .v-navigation-drawer__content {
    overflow: hidden;
  }
  .body-sidebar-dense {
    height: calc(100% - 80px);
    overflow-y: hidden;
    &-mini {
      padding-left: 6px !important;
    }
    &::-webkit-scrollbar {
      width: 5px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: none;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0);
    }
    .sidebar-announcement {
      padding: 0px 24px 0 23px;
      .search-block-wrapper {
        border: solid 1px #dee5eb;
        border-radius: 4px;
        height: 36px;
        padding: 0 12px;
        width: calc(100%);
        input {
          font-size: 11px;
          &::placeholder {
            font-family: Roboto;
            font-size: 11px;
            color: #8194a5;
          }
        }
      }
      .filter-by {
        border-bottom: 1px solid #f3f4f5;
        .filter-items {
          color: #8194a5;
          padding-bottom: 14px;
          font-weight: 500;
        }
        .filterActive {
          color: #006a9b;
        }
        .dashline {
          transition: 0.4s ease;
          bottom: 0;
          left: 0;
          height: 2px;
          border-radius: 4px;
          background-color: #006a9b;
          transform: translateX(0);
          padding: 0;
        }
        .dashline.own {
          transform: translateX(0);
        }
        .dashline.follow {
          transform: translateX(199%);
        }
        .dashline.assign {
          transform: translateX(100%);
        }
      }
      .father-task-block {
        :hover {
          background-color: #f2f4f6;
          border-left: 2px solid #006a9b;
        }
        &::-webkit-scrollbar {
          width: 4px;
          height: 6px;
          opacity: 0;
        }

        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
        }
        &:hover {
          &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
          }
        }
        height: calc(100vh - 300px);
        overflow-y: scroll;
      }
      .selected-father {
        background-color: #f2f4f6 !important;
        border-left: 2px solid #006a9b !important;
      }
      .task-block {
        background-color: $backgroundwhite;
        margin: 16px 0;
        border-top: 2px solid $borderTaskBlock;
        border-right: 2px solid $borderTaskBlock;
        border-bottom: 2px solid $borderTaskBlock;
        border-left: 2px solid $borderColor;
        padding: 10px 12px 9px 12px;
        border-radius: 4px;
        cursor: pointer;
        :hover {
          border-left: none;
        }
        .task-title {
          font-size: 18px;
          font-weight: bold;
          color: #223140;
          margin-bottom: 8px;
          width: 100%;
        }
        .task-content {
          font-size: 12px;
          font-weight: 400;
          color: #223140;
          margin-bottom: 5px;
        }
        .task-detail {
          display: flex;
          justify-content: space-between;
          .task-status {
            font-size: 12px;
            font-weight: bold;
            width: fit-content;
            padding: 7px 16px;
          }
          .new {
            color: #e6a326;
            background-color: rgba(244, 190, 94, 0.1);
          }
          .doing {
            color: #006a9b;
            background-color: rgba(0, 106, 155, 0.1);
          }
          .complete {
            color: #57ce8c;
            background-color: rgba(124, 231, 172, 0.1);
          }
        }
      }
      .state-status {
        display: flex;
        margin-top: 15px;
        justify-content: space-between;
        .state {
          display: flex;
        }
        .status {
          display: flex;
        }
        .header {
          font-size: 12px;
          font-weight: 400;
          color: #223140;
        }
        .filter {
          font-size: 12px;
          font-weight: bold;
          color: #006a9b;
          cursor: pointer;
        }
        .state-menu {
          position: absolute;
          margin-top: 20px;
          width: 135px;
          background-color: #ffffff;
          box-shadow: 0px 3px 8px rgb(212, 212, 212),
            0px 3px 8px rgb(212, 212, 212), 0px 3px 8px rgb(212, 212, 212);
          .v-list-item {
            color: #8194a5 !important;
            font-size: 12px;
            font-weight: 400;
            cursor: pointer;
          }
        }
        .status-menu {
          position: absolute;
          margin-top: 20px;
          right: 30px;
          width: 151px;
          background-color: #ffffff;
          box-shadow: 0px 3px 8px rgb(212, 212, 212),
            0px 3px 8px rgb(212, 212, 212), 0px 3px 8px rgb(212, 212, 212);
          .v-list-item {
            color: #8194a5 !important;
            font-size: 12px;
            font-weight: 400;
            cursor: pointer;
          }
        }
      }
    }
  }

  .sidebar-card-body {
    box-shadow: none !important;
    width: 250px;
    height: calc(100vh - 56px);
    .v-navigation-drawer {
      height: calc(100% - 46px);
    }
    .v-navigation-drawer__content {
      background-color: #fff !important;
      height: calc(100% - 46px);
    }
    .v-navigation-drawer__border {
      display: none !important;
    }
    position: relative;
    .btn-toggle-mini {
      height: 40px !important;
      border-radius: 100% !important;
      width: 40px;
      z-index: 2;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
      &.goto-collapse {
        i {
          transform: rotateZ(180deg);
        }
      }
    }
    .each-items {
      width: calc(100% - 24px);
      margin: auto;
      border-radius: 6px;
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.3px;
      color: $GPEdetailData;
      height: 50px;
      margin-bottom: 3px !important;

      .v-list-item__icon {
        margin-right: 19px !important;
        .icon-sidebar-active {
          display: none;
        }
      }
      &-on-menu {
        padding-left: 0 !important;
        padding-right: 0 !important;
        width: 100% !important;
        .v-list-item__icon {
          margin: auto !important;
          margin-right: auto !important;
        }
      }

      &:hover {
        background-color: $primaryColorLighterLv2;
        transform: translate(0, -2px);
        &::before {
          position: absolute;
          content: "";
        }
      }
      &-group {
        .v-list-group__header {
          padding-top: 4px;
          padding-bottom: 4px;
        }
        &:hover {
          .v-list-item.v-list-item--active {
            background-color: $primaryColorLighterLv2;
          }
          .v-list-group__header {
            background-color: transparent !important;
          }
        }
        &.v-list-group.v-list-group--active {
          color: $sidebarText !important;
        }
      }
    }
    .single-group {
      padding-top: 4px;
      padding-bottom: 4px;
      &-block {
        pointer-events: none;
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
        text-transform: uppercase;
        color: $sidebarText !important;
      }
    }
    .sidechick-on-active {
      background-color: $primaryColorLighterLv1;
      position: relative;
      &::before {
        position: absolute;
        top: 0;
        left: -24px;
        content: "";
        width: 6px;
        height: 100%;
        background-color: $primaryColorLighterLv1;
        border-radius: 0 4px 4px 0;
        z-index: 2;
        opacity: 1;
      }
      &.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
        color: $GPEblueText !important;
      }
      .icon-sidebar-active {
        display: block !important;
      }
      .icon-sidebar-unactive {
        display: none;
      }
    }
    .onechild-on-active {
      background-color: $primaryColorLighterLv1;
      color: $GPEblueText !important;
      &.v-list-group--active {
        background-color: transparent !important;
      }
      .v-list-item--active.v-list-group__header {
        background-color: $primaryColorLighterLv1;
      }
    }
    .v-slide-group__content {
      .v-tabs-slider-wrapper {
        top: 0;
        bottom: unset !important;
      }
    }
    .side-bar-bottom-tabs {
      width: 100%;
      .v-slide-group__content {
        justify-content: space-between;
      }
      .v-slide-group__prev,
      .v-slide-group__next {
        display: none !important;
      }
    }
  }
}
.to-do-tab {
  width: 350px !important;
}
.sidebar-logo {
  max-width: 200px;
  display: block;
  margin: auto;
}
.sidebar-logo-link {
  height: 70px;
  display: flex;
  width: 70%;
}
.user-info-sb {
  display: flex;
  align-items: center;
  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 5px;
    object-fit: cover;
    object-position: center;
  }
  .u-name {
    font-size: 14px !important;
    font-weight: bold !important;
    text-decoration: none !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    text-align: left !important;
  }
  .u-pos {
    font-size: 12px;
    text-decoration: none !important;
    letter-spacing: normal !important;
    text-transform: uppercase !important;
    text-align: left !important;
  }
}
.sidebar-header-btn {
  display: block;
  background: transparent !important;
  box-shadow: none !important;
  width: 100%;
  height: unset !important;
  padding-left: 20px;
  border-bottom: 1px solid #f2f4f6;
  .v-ripple__container {
    display: none !important;
  }
  &::before,
  &::after {
    display: none !important;
    background-color: transparent !important;
  }
  &:hover {
    &::before {
      background-color: transparent !important;
    }
  }
  .v-btn__content {
    display: block;
  }
}
.sb-item-menu {
  &:hover {
    &::before {
      background-color: #65c6f388 !important;
      opacity: 0.5 !important;
    }
  }
}
.v-list-item__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.badget-statistical-counter {
  font-size: 10px;
  color: #fff;
  padding: 2px;
  background-color: #ce4b4b;
  border-radius: 2px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
