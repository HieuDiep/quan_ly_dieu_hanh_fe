<template>
  <div class="content">
    <div class="d-flex w-100 top-marker">
      <div class="col-7 d-flex justify-space-between">
        <div>
          <h4>
            {{ currentTaskDetail.title }}
          </h4>
          <div style="color: #8194a5; font-size: 12px">
            Giao ngày:{{
              currentTaskDetail.created_at
                ? currentTaskDetail.created_at.date
                : "-"
            }}
          </div>
        </div>
        <div class="d-flex align-center mr-3">
          <img
            src="@/assets/images/star.png"
            alt=""
            height="24px"
            class="pr-3"
            v-if="currentTaskDetail.important"
          />
          <v-menu offset-y left content-class="elevation-0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                outlined
                class="btn-menu"
                height="36"
              >
                <img src="@/assets/more.png" alt="" />
              </v-btn>
            </template>
            <v-list
              dense
              class="menu-detail"
              v-if="
                currentTaskDetail.creator &&
                currentTaskDetail.creator.id === auth.user.user.id
              "
            >
              <v-list-item class="item"> Nhắc cập nhật </v-list-item>
              <v-list-item
                class="item"
                @click="openDialogAddJob(currentTaskDetail)"
              >
                Chỉnh sửa
              </v-list-item>
              <v-list-item
                class="item"
                @click="openDialogLeave(currentTaskDetail)"
              >
                Rời khỏi công việc
              </v-list-item>
              <v-list-item
                class="item"
                @click="openDialogReopen(currentTaskDetail)"
              >
                Mở lại công việc
              </v-list-item>
              <v-list-item
                class="item"
                @click="openDialogDelete(currentTaskDetail)"
              >
                Xóa công việc
              </v-list-item>
            </v-list>
            <v-list
              dense
              class="menu-detail"
              v-if="
                currentTaskDetail.creator &&
                currentTaskDetail.creator.id !== auth.user.user.id &&
                getFilterBy(currentTaskDetail.users_do)
              "
            >
              <v-list-item class="item"> Báo cáo tiến độ </v-list-item>
              <v-list-item class="item"> Mời thêm người </v-list-item>
              <v-list-item class="item"> Hoàn thành công việc </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <div class="col-5 text-center">
        <b>Hoạt động / Nhận xét</b>
      </div>
    </div>
    <div class="d-flex page-todo-detail">
      <div v-if="checkId" class="col-7 detail-left table-scroll-y">
        <div class="d-flex align-center">
          <img src="../../assets/list.png" alt="" class="ml-2 mr-1" />
          <div class="my-2 ml-1 text-title">Nội dung</div>
        </div>
        <div class="mx-8">
          <p class="text-color m-0">{{ currentTaskDetail.content }}</p>
        </div>
        <div class="d-flex align-center">
          <img src="../../assets/info.png" alt="" class="ml-2 mr-1" />
          <div class="my-2 ml-1 text-title">Chi tiết công việc</div>
        </div>
        <div class="mx-8">
          <div class="text-des">Người tạo</div>
          <div class="d-flex align-center mt-2 mb-4">
            <v-avatar size="32" color="">
              <img
                :src="
                  currentTaskDetail.creator
                    ? currentTaskDetail.creator.avatar
                    : ''
                "
                alt="alt"
              />
            </v-avatar>
            <div class="ml-2 text-color">
              {{
                currentTaskDetail.creator
                  ? currentTaskDetail.creator.full_name
                  : "-"
              }}
            </div>
          </div>
          <div class="text-des mt-2">Người nhận</div>
          <div class="d-flex align-center scroll-ngang">
            <div
              class="d-flex align-center my-2"
              v-for="i in currentTaskDetail.users_do"
              :key="i.id"
            >
              <v-avatar size="32">
                <img :src="i.avatar" alt="alt" />
              </v-avatar>
              <div class="ml-2 text-color" style="width: 130px">
                {{ i.full_name }}
              </div>
            </div>
          </div>
          <div class="text-des">Người theo dõi</div>
          <div class="d-flex align-center mt-2 scroll-ngang">
            <div
              class="d-flex align-center mb-2"
              v-for="i in currentTaskDetail.users_follow"
              :key="i.id"
            >
              <v-avatar size="32">
                <img :src="i.avatar" alt="alt" />
              </v-avatar>
              <div class="ml-2 text-color" style="width: 130px">
                {{ i.full_name }}
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="col-3 p-0" style="font-size: 12px">
              <div class="text-des">Trạng thái</div>
              <v-chip
                class="chip"
                label
                color="rgba(244, 190, 94, 0.1)"
                text-color="#e6a326"
              >
                <p class="status">
                  {{
                    currentTaskDetail.status
                      ? currentTaskDetail.status.name
                      : "-"
                  }}
                </p>
              </v-chip>
            </div>
            <div class="col-3 p-0">
              <div class="text-des">Thời hạn</div>
              <p class="status py-2" style="width: 130px">
                {{
                  currentTaskDetail.due_date
                    ? formatDateTimeout(currentTaskDetail.due_date.date)
                    : "-"
                }}
              </p>
            </div>
            <div class="col-6 px-0"></div>
          </div>
          <!-- <div class="text-des">Thẻ tag</div> -->
          <div class="text-des">Tài liệu đính kèm</div>
          <div
            v-if="
              currentTaskDetail.attachments &&
              !currentTaskDetail.attachments.length
            "
            class="text-color mt-2"
          >
            Không có tài liệu đính kèm
          </div>
          <!-- <div
            class="blockimage-ticket1 row"
            v-if="
              currentTaskDetail.attachments
            "
          >
            <div
              v-for="(o, index) in currentTaskDetail.attachments"
              :key="index"
              class="block-images"
              :class="{ 'first-image': index === 0 }"
            >
              <img
                v-if="
                  currentTaskDetail.attachments[index].mime_type.includes(
                    'image/'
                  )
                "
                :src="currentTaskDetail.attachments[index].url"
                alt=""
                class="block-image"
              />
              <img
                v-if="
                  !currentTaskDetail.attachments[index].mime_type.includes(
                    'image/'
                  )
                "
                src="@/assets/images/pdf-icon.png"
                alt=""
                class="block-image"
              />
              <div
                v-if="
                  currentTaskDetail.attachments[index].mime_type.includes(
                    'image/'
                  )
                "
                class="block-text"
              >
                {{
                  returnFileName(
                    currentTaskDetail.attachments[index].original_name
                  )
                }}
              </div>
              <a
                v-if="
                  !currentTaskDetail.attachments[index].mime_type.includes(
                    'image/'
                  )
                "
                :href="currentTaskDetail.attachments[index].url"
                target="_blank"
                class="block-text"
              >
                {{
                  returnFileName(
                    currentTaskDetail.attachments[index].original_name
                  )
                }}
              </a>
            </div>
          </div> -->
          <div
            class="blockimage-ticket4 row"
            v-if="filesClipboardImage"
          >
            <div
              v-for="(o, index) in filesClipboardImage"
              :key="index"
              v-show="index < 5"
              class="block-images"
              :class="
                filesClipboardImage[index].mime_type.includes(
                  'image/'
                )
                  ? ''
                  : '-file'
              "
            >
              <img
                v-if="
                  filesClipboardImage[index].mime_type.includes(
                    'image/'
                  )
                "
                :src="filesClipboardImage[index].url"
                alt=""
                class="block-image"
                @click="onViewListImg(filesClipboardImage, index)"
              />
              <img
                v-if="
                  !filesClipboardImage[index].mime_type.includes(
                    'image/'
                  )
                "
                @click="openFile(filesClipboardImage[index].url)"
                src="@/assets/images/pdf-icon.png"
                alt=""
                class="block-image-file"
              />
              <div
                v-if="
                  filesClipboardImage[index].mime_type.includes(
                    'image/'
                  )
                "
                class="block-text"
              >
                {{
                  returnFileName(
                    filesClipboardImage[index].original_name
                  )
                }}
              </div>
              <a
                v-if="
                  !filesClipboardImage[index].mime_type.includes(
                    'image/'
                  )
                "
                :href="filesClipboardImage[index].url"
                target="_blank"
                class="block-text-file"
              >
                {{
                  returnFileName(
                    filesClipboardImage[index].original_name
                  )
                }}
              </a>
              <div
                @click="onViewListImg(filesClipboardImage, index)"
                v-if="filesClipboardImage.length > 5 && index === 4"
                class="block-blackscreen"
              ></div>
              <div
                @click="onViewListImg(filesClipboardImage, index)"
                v-if="filesClipboardImage.length > 5 && index === 4"
                class="block-blackscreen-number"
              >
                +{{ filesClipboardImage.length - 4 }}
              </div>
            </div>
          </div>
          <div
            class="blockimage-ticket4 row"
            v-if="filesClipboardFile"
          >
            <div
              v-for="(o, index) in filesClipboardFile"
              :key="index"
              class="block-images"
              :class="
                filesClipboardFile[index].mime_type.includes(
                  'image/'
                )
                  ? ''
                  : '-file'
              "
            >
              <img
                v-if="
                  filesClipboardFile[index].mime_type.includes(
                    'image/'
                  )
                "
                :src="filesClipboardFile[index].url"
                alt=""
                class="block-image"
                @click="onViewListImg(filesClipboardFile, index)"
              />
              <img
                v-if="
                  !filesClipboardFile[index].mime_type.includes(
                    'image/'
                  )
                "
                @click="openFile(filesClipboardFile[index].url)"
                src="@/assets/images/file.png"
                alt=""
                class="block-image-file"
              />
              <div
                v-if="
                  filesClipboardFile[index].mime_type.includes(
                    'image/'
                  )
                "
                class="block-text"
              >
                {{
                  returnFileName(
                    filesClipboardFile[index].original_name
                  )
                }}
              </div>
              <a
                v-if="
                  !filesClipboardFile[index].mime_type.includes(
                    'image/'
                  )
                "
                :href="filesClipboardFile[index].url"
                target="_blank"
                class="block-text-file"
              >
                {{
                  returnFileName(
                    filesClipboardFile[index].original_name
                  )
                }}
              </a>
              <!-- <div
                @click="onViewListImg(filesClipboardFile, index)"
                v-if="filesClipboardFile.length > 5 && index === 4"
                class="block-blackscreen"
              ></div>
              <div
                @click="onViewListImg(filesClipboardFile, index)"
                v-if="filesClipboardFile.length > 5 && index === 4"
                class="block-blackscreen-number"
              >
                +{{ filesClipboardFile.length - 4 }}
              </div> -->
            </div>
          </div>
          <v-btn
            @click="openDialogAccept(currentTaskDetail)"
            class="btnadd mt-3"
            color="#006a9b"
            elevation="0"
            >Nhận việc</v-btn
          >
        </div>
      </div>
      <div
        class="col-7 detail-left d-flex justify-content-center align-center"
        v-else
      >
        <div class="text-center">
          <div class="mb-3"><h2>Không có công việc này</h2></div>
          <v-btn color="primary" elevation="0" @click="handleRefresh"
            >Refresh</v-btn
          >
        </div>
      </div>
      <div
        class="
          col-5
          detail-right
          d-flex
          flex-column
          justify-content-between
          activity-wr--m
        "
      >
        <TodoActivity />
        <hr />
        <keep-alive>
          <TaskComment />
        </keep-alive>
      </div>
    </div>

    <DialogAddJob
      :is-visible="isVisible"
      @handlerCancel="handlerDialogCancel"
      @handlerSubmit="handlerDialogSubmit"
      :err-msg="errMsg"
      :selected-data="selectedData"
      :loading-btn="loadingBtn"
    />
    <ConfirmReopen
      :is-visible="isVisibleReopen"
      :handlerCancel="handlerDialogReopenCancel"
      :handlerConfirm="reopenTask"
      :selected-data="selectedData"
      :err-msg="errMsg"
    >
    </ConfirmReopen>
    <ConfirmDeleteTask
      :is-visible="isVisibleDelete"
      :handlerCancel="handlerDialogDeleteCancel"
      :handlerConfirm="deleteTask"
      :selected-data="selectedData"
      :err-msg="errMsg"
    >
    </ConfirmDeleteTask>
    <ConfirmLeave
      :is-visible="isVisibleLeave"
      :handlerCancel="handlerDialogLeaveCancel"
      :handlerConfirm="leaveTask"
      :selected-data="selectedData"
      :err-msg="errMsg"
    >
    </ConfirmLeave>
    <ConfirmAccept
      :is-visible="isVisibleAccept"
      :handlerCancel="handlerDialogAcceptCancel"
      :handlerConfirm="acceptTask"
      :selected-data="selectedData"
      :err-msg="errMsg"
    >
    </ConfirmAccept>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, defineComponent, watch, computed } from "@vue/composition-api";
import DialogAddJob from "@/components/Form/DialogAddJob.vue";
import ConfirmReopen from "@/components/popup/ConfirmReopen.vue";
import ConfirmDeleteTask from "@/components/popup/ConfirmDeleteTask.vue";
import ConfirmLeave from "@/components/popup/ConfirmLeave.vue";
import ConfirmAccept from "@/components/popup/ConfirmAccept.vue";
import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
import { mapGetters, mapState } from "vuex";
import axios from "axios";
import TaskComment from "@/components/Layout/TaskComment.vue";
import TodoActivity from "@/components/Layout/TodoActivity.vue";
import api from "@/services";
import route from "@/router/index";
import { tDate } from "validation_t/src";
import router from "@/router/index";

export default defineComponent({
  name: "",
  components: {
    DialogAddJob,
    TaskComment,
    TodoActivity,
    ConfirmReopen,
    ConfirmDeleteTask,
    ConfirmLeave,
    ConfirmAccept,
  },
  setup: () => {
    const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
    const currentRouteQuery = ref<string>(stringQueryRender);
    let isVisible = ref<boolean>(false);
    const selectedData = ref<Record<string, any>>({});
    const loadingBtn = ref<boolean>(false);
    let errMsg = ref<string>("");
    const setIsVisible = (value: boolean) => {
      isVisible.value = value;
    };
    let isVisibleReopen = ref<boolean>(false);
    const setIsVisibleReopen = (value: boolean) => {
      isVisibleReopen.value = value;
    };
    watch(isVisibleReopen, (currentValue) => {
      if (!currentValue) {
        selectedData.value = {};
      }
    });
    let isVisibleDelete = ref<boolean>(false);
    const setIsVisibleDelete = (value: boolean) => {
      isVisibleDelete.value = value;
    };
    watch(isVisibleDelete, (currentValue) => {
      if (!currentValue) {
        selectedData.value = {};
      }
    });
    let isVisibleLeave = ref<boolean>(false);
    const setIsVisibleLeave = (value: boolean) => {
      isVisibleLeave.value = value;
    };
    watch(isVisibleLeave, (currentValue) => {
      if (!currentValue) {
        selectedData.value = {};
      }
    });
    let isVisibleAccept = ref<boolean>(false);
    const setIsVisibleAccept = (value: boolean) => {
      isVisibleAccept.value = value;
    };
    watch(isVisibleAccept, (currentValue) => {
      if (!currentValue) {
        selectedData.value = {};
      }
    });
    const setErrMsg = (payload: string) => {
      errMsg.value = payload;
    };
    const setLoadingBtn = (payload: boolean) => {
      loadingBtn.value = payload;
    };
    watch(isVisible, (currentValue) => {
      if (!currentValue) {
        selectedData.value = {};
        errMsg.value = "";
      }
    });
    return {
      isVisible,
      loadingBtn,
      queryRoute,
      isVisibleReopen,
      setIsVisibleReopen,
      isVisibleDelete,
      setIsVisibleDelete,
      currentRouteQuery,
      isVisibleLeave,
      setIsVisibleLeave,
      isVisibleAccept,
      setIsVisibleAccept,
      setLoadingBtn,
      errMsg,
      selectedData,
      setIsVisible,
      setErrMsg,
    };
  },
  data() {
    return {
      currentId: 0,
      checkId: false,
      item: {
        id: 1,
        title: "Test create task",
        content: "Test create task",
        important: true,
        due_date: null,
        status: {
          id: 1,
          name: "New",
        },
        created_at: {
          date: "2021-09-14 16:21:49",
          timezone_type: 3,
          timezone: "Asia/Ho_Chi_Minh",
        },
        creator: {
          id: 285,
          username: "asgl-0228",
          email: "binh.nh@asgl.net.vn",
          full_name: "Nguyễn Hữu Bình",
          asgl_id: "ASGL-0228",
          is_active: 1,
          mobile_phone: "0984684851",
          chat_id: "36A33CgnCPDYoraKo",
          avatar: "http://localhost:8000/avatar/asgl-0228",
          portrait: "http://localhost:8000/portrait/asgl-0228",
        },
        users_do: [
          {
            id: 1,
            username: "admin",
            email: "",
            full_name: "Nguyễn Anh Phương",
            asgl_id: "0001",
            mobile_phone: "0904118892",
            accept_at: null,
            finish_at: null,
          },
        ],
        users_follow: [
          {
            id: 1,
            username: "admin",
            email: "",
            full_name: "Nguyễn Anh Phương",
            asgl_id: "0001",
            is_active: 1,
            mobile_phone: "0904118892",
            chat_id: "TmijRKR9ZYXYyJ2ra",
            avatar: "http://localhost:8000/avatar/admin",
            portrait: "http://localhost:8000/portrait/admin",
          },
        ],
        attachments: [],
      },
    };
  },
  mounted() {
    this.currentId = +this.$route.params.id;
    this.$store.dispatch("tasks/getTaskById", this.currentId);
  },
  computed: {
    ...mapState({
      listTask: (state: any) => state.tasks.listTask,
      currentTaskDetail(state: any) {
        if (state.tasks.currentTaskDetail.id) {
          this.checkId = true;
        }
        return state.tasks.currentTaskDetail;
      },
      auth: (state: any) => state.auth,
    }),
    filesClipboardImage() {
      if (this.currentTaskDetail.attachments) {
        let arr: any = this.currentTaskDetail.attachments.filter((o: any) => {
          const _type = o.mime_type;
          return _type.includes("image/");
        });
        return arr;
      } else {
        return [];
      }
    },
    filesClipboardFile() {
      if (this.currentTaskDetail.attachments) {
        let arr: any = this.currentTaskDetail.attachments.filter((o: any) => {
          const _type = o.mime_type;
          return !_type.includes("image/");
        });
        return arr;
      } else {
        return [];
      }
    },
  },
  methods: {
    handleRefresh() {
      this.$router.push("/giao-viec");
    },
    openFile(link: any) {
      window.open(link);
    },
    formatDate(ds: any) {
      let ar1 = ds.split("-");
      return `${ar1[2]}-${ar1[1]}-${ar1[0]}`;
    },
    formatDateTimeout(_date: any) {
      let date = tDate.formatDateCustomize(_date);
      return ` ${date.hh}:${date.mm} ${date.dd}/${date.MM}/${date.yyyy}`;
    },
    formatTick(ds: any) {
      if (ds === true) {
        return "1";
      } else {
        return "0";
      }
    },
    onViewListImg(listImg: any, idx = 0) {
      this.$store.commit("SET_LIST_IMAGE_PREVIEW", listImg);
      this.$store.commit("SET_INDEX_IMAGE_PREVIEW", idx);
    },
    returnFileName(_name: any) {
      let stringName = String(_name);
      let prevDotName = stringName.slice(0, stringName.lastIndexOf("."));
      let txt = "";
      if (prevDotName.length > 15) {
        txt = prevDotName.slice(0, 12) + "..";
      } else {
        txt = prevDotName;
      }
      return `${txt}.${stringName.split(".").pop()}`;
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
      let important = this.formatTick(value.important);
      let arrayId = value2.map((o: any) => o.id);
      let arrayFollowersId = value4.map((o: any) => o.id);
      let arrayFile = value3.map((o: any) => o);
      const formData = new FormData();
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
      if (!this.selectedData.id) {
        arrayFile.forEach((element: any) => {
          formData.append("attachments[]", element.blob);
        });
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
            this.setIsVisible(false);
            this.$store.dispatch("tasks/getListTask");
            this.$store.dispatch("tasks/getTaskActivities", {
              id: this.currentId,
              scrollAble: true,
            });
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
      } else {
        let getFileWithId = computed(() => {
          const arr: Record<string, any>[] = arrayFile;
          if (!arr.length) return [];
          return arr.filter((o: any) => o.id);
        });
        if (!getFileWithId.value.length) {
          arrayFile.forEach((o: any) => {
            formData.append(`attachments[]`, o.blob);
          });
        } else {
          getFileWithId.value.forEach((o) => {
            formData.append(`attachment_ids[]`, o.id);
          });
        }
        if (arrayFile.length) {
          formData;
        } else {
          arrayFile.forEach((o: any) => {
            formData.append(`attachments[]`, o.blob);
          });
        }
        const res = await api.todo.edit(this.currentId, formData);
        this.setLoadingBtn(false);
        if (!res) {
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.$store.commit("SET_SNACKBAR", {
              type: "success",
              title: "",
              content: "Cập nhật công việc thành công",
            });
            this.setIsVisible(false);
            this.$store.dispatch("tasks/getListTask");
            this.$store.dispatch("tasks/getTaskActivities", {
              id: this.currentId,
              scrollAble: true,
            });
            this.$store.commit(
              "tasks/SET_CURRENT_TASK_DETAIL",
              res.data.data.task
            );
            this.$store.dispatch("tasks/getTaskById", this.currentId);
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
      }
    },
    handlerDialogCancel() {
      this.setIsVisible(false);
    },
    openDialogAddJob(item: Record<string, unknown>) {
      this.setIsVisible(true);
      this.selectedData = { ...item };
    },
    async reopenTask() {
      this.setErrMsg("");
      const res = await api.todo.reopen(this.currentId);
      if (!res) {
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.$store.commit("SET_SNACKBAR", {
            type: "success",
            title: "",
            content: "Mở lại thành công",
          });
          this.setIsVisibleReopen(false);
          this.$store.dispatch("tasks/getListTask");
        } else {
          this.setErrMsg(res.data.data.error || res.data.message);
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
    openDialogReopen(item: Record<string, unknown>) {
      this.setIsVisibleReopen(true);
      this.selectedData = { ...item };
      this.setErrMsg("");
    },
    handlerDialogReopenCancel() {
      this.setIsVisibleReopen(false);
      this.setErrMsg("");
    },
    async deleteTask() {
      this.setErrMsg("");
      const res = await api.todo.delete(this.currentId);
      if (!res) {
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.$store.commit("SET_SNACKBAR", {
            type: "success",
            title: "",
            content: "Xóa thành công",
          });
          delete this.$route.params.id;
          this.$router.push(`/giao-viec${this.currentRouteQuery}`);
          this.setIsVisibleDelete(false);
          this.$store.dispatch("tasks/getListTask");
        } else {
          this.setErrMsg(res.data.data.error || res.data.message);
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
    openDialogDelete(item: Record<string, unknown>) {
      this.setIsVisibleDelete(true);
      this.selectedData = { ...item };
      this.setErrMsg("");
    },
    handlerDialogDeleteCancel() {
      this.setIsVisibleDelete(false);
      this.setErrMsg("");
    },
    async leaveTask() {
      this.setErrMsg("");
      const res = await api.todo.unfollow(this.currentId);
      if (!res) {
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.$store.commit("SET_SNACKBAR", {
            type: "success",
            title: "",
            content: "Rời việc thành công",
          });
          this.setIsVisibleLeave(false);
          this.$store.dispatch("tasks/getListTask");
          this.$store.dispatch("tasks/getTaskActivities", {
            id: this.currentId,
            scrollAble: true,
          });
        } else {
          this.setErrMsg(res.data.data.error || res.data.message);
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
    openDialogLeave(item: Record<string, unknown>) {
      this.setIsVisibleLeave(true);
      this.selectedData = { ...item };
      this.setErrMsg("");
    },
    handlerDialogLeaveCancel() {
      this.setIsVisibleLeave(false);
      this.setErrMsg("");
    },
    async acceptTask() {
      this.setErrMsg("");
      const res = await api.todo.accept(this.currentId);
      if (!res) {
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.$store.commit("SET_SNACKBAR", {
            type: "success",
            title: "",
            content: "Nhận việc thành công",
          });
          this.setIsVisibleAccept(false);
          this.$store.dispatch("tasks/getListTask");
          this.$store.dispatch("tasks/getTaskActivities", {
            id: this.currentId,
            scrollAble: true,
          });
        } else {
          this.setErrMsg(res.data.data.error || res.data.message);
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
    openDialogAccept(item: Record<string, unknown>) {
      this.setIsVisibleAccept(true);
      this.selectedData = { ...item };
      this.setErrMsg("");
    },
    handlerDialogAcceptCancel() {
      this.setIsVisibleAccept(false);
      this.setErrMsg("");
    },
    async getTaskById(id: any) {
      const res = await api.task.getTaskById(id);
      try {
        this.currentTaskDetail = res.data.data.task;
        this.getFilterBy(this.currentTaskDetail.users_do);
      } catch (error) {
        console.log(error);
      }
    },
    getFilterBy(id: any) {
      let getId = id.filter((o: any) => o.id === this.auth.user.user.id);
      return getId[0] && getId[0].id === this.auth.user.user.id;
    },
  },
});
</script>
<style scoped lang="scss">
.content {
  overflow: hidden;
  height: 100vh;
}
.top-marker {
  position: relative;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.16);
  height: 70px;
  background-color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  /* color: #fff; */
  font-weight: 400;
}
h4 {
  font-size: 18px;
  font-weight: bold;
}
.page-todo-detail {
  height: 100vh;
}
.detail-left {
  background-color: #f2f4f6;
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
    background: rgba(0, 0, 0, 0.48);
  }
}
.scroll-ngang {
  overflow-x: scroll;
  margin: 4px 0;
  max-width: 850px;
  width: 100%;
  &::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }
}
.scroll-ngang:hover {
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.48);
  }
}
.detail-right {
  background-color: white;
  height: calc(100% - 50px);
}
.text-title {
  font-weight: bold;
  font-size: 13px;
}
.text-des {
  color: #8194a5;
  font-size: 12px;
}
.text-color {
  font-size: 12px;
  color: #223140;
}
.blockimage-ticket1 {
  margin-top: 8px;
  margin-bottom: 6px;
  cursor: pointer;
  .block-images {
    padding: 0 6px;
    height: 160px;
    width: 160px !important;
    position: relative;
    .block-image {
      box-shadow: none;
      height: 160px;
      width: 160px;
      object-fit: cover;
    }
    .block-text {
      position: absolute;
      bottom: 0px;
      background-color: #223140;
      opacity: 0.5;
      color: #ffffff;
      font-size: 14px;
      width: 100%;
      text-align: center;
    }
  }
  .first-image {
    width: 100%;
  }
}
.blockimage-ticket4 {
  margin-top: 8px;
  margin-bottom: 6px;
  cursor: pointer;
  .block-images {
    padding: 0 6px;
    height: 115px;
    width: 100px;
    position: relative;
    margin-right: 12px;
    margin-bottom: 8px;
    &-file {
      height: 115px;
      width: 100px;
    }
    .block-image {
      box-shadow: none;
      height: 115px;
      width: 100px;
      object-fit: cover;
    }
    .block-image-file {
      box-shadow: none;
      height: 115px;
      width: 100px;
      object-fit: cover;
    }
    .block-text {
      position: absolute;
      bottom: 0px;
      left: 6px;
      background-color: #223140;
      opacity: 0.5;
      color: #ffffff;
      font-size: 12px;
      width: 100%;
      text-align: center;
    }
    .block-text-file {
      position: absolute;
      bottom: 0px;
      left: 6px;
      background-color: #223140;
      opacity: 0.5;
      color: #ffffff;
      font-size: 12px;
      width: 100px;
      text-align: center;
    }
    .block-blackscreen {
      margin-left: 6px;
      height: 115px;
      width: 100px !important;
      position: absolute;
      top: 0px;
      left: 0px;
      background-color: black;
      opacity: 0.5;
      text-align: center;
      cursor: pointer;
    }
    .block-blackscreen-number {
      z-index: 10;
      font-size: 24px;
      font-weight: 600;
      position: absolute;
      top: 50%;
      color: #ffffff;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      cursor: pointer;
    }
  }
  .first-image {
    width: 100%;
  }
}
.chip {
  font-size: 12px !important;
}
.menu-detail {
  /* position: absolute; */
  /* right: 43%; */
  font-size: 12px !important;
  line-height: 12px !important;
  width: 156px;
  padding: 0;
  min-height: 30px !important;
}
.btn-menu {
  min-width: 36px !important;
  border: 1px solid #dee5eb;
  border-radius: 8px;
  cursor: pointer;
  padding: 0 !important;
}
.status {
  font-size: 12px;
  margin: 0 !important;
}
.font {
  font-size: 12px !important;
}
.item {
  min-height: 30px;
  cursor: pointer;
}
.item:hover {
  background-color: #dee5eb;
}
.btnadd {
  font-size: 12px !important;
  color: #fff;
  text-transform: initial;
  height: 40px !important;
}
.time {
  width: 140px;
}
</style>
