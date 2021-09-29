const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;

import axios from "axios";
const tasks = {
  namespaced: true,
  state: {
    listTask: [],
    listLogs: [],
    Task: [],
    filterTask: {},
    maxCountCurrentTask: 0,
    currentSizeTask: 15,
    previousOffsetTop: 0,
    currentTaskDetail: {},
    currentTaskComments: {},
    currentTaskCommentsTotal: 0,
  },
  getters: {},
  mutations: {
    SET_LIST_TASK(state: Record<string, unknown>, tasks: any) {
      state.listTask = tasks;
    },
    SET_TASK_ACTIVITIES(state: Record<string, unknown>, logs: any) {
      state.listLogs = logs;
    },
    SET_CURRENT_TASK_DETAIL(
      state: Record<string, unknown>,
      task: Record<string, unknown>
    ) {
      state.currentTaskDetail = task;
    },
    SET_CURRENT_TASK_COMMENTS(
      state: Record<string, unknown>,
      comments: Record<string, unknown>[]
    ) {
      state.currentTaskComments = comments;
    },
    SET_CURRENT_SIZE_TASK(state: Record<string, unknown>, numb: number) {
      state.currentSizeTask = numb;
    },
    SET_PREVIOUS_OFFSET_TOP(state: Record<string, unknown>, numb: number) {
      state.previousOffsetTop = numb;
    },
    SET_MAX_COUNT_CURRENT_TASK(state: Record<string, unknown>, count: number) {
      state.maxCountCurrentTask = count;
    },
    SET_CURRENT_TASK_COMMENTS_COUNTER(
      state: Record<string, unknown>,
      num: number
    ) {
      state.currentTaskCommentsTotal = num;
    },
    SET_TASK_BY_ID(state: Record<string, unknown>, tasks: any) {
      state.listTask = tasks;
    },
    SET_FILTER_TASK(state: Record<string, unknown>, filters: any) {
      state.filterTask = filters;
    },
  },
  actions: {
    getTaskById({ commit, state }: any, id: number | string) {
      if (state.currentTaskDetail && state.currentTaskDetail.id === id) {
        return;
      }
      axios
        .get(`${VUE_APP_BASE_URL}/api/staff/tasks/${id}`)
        .then((res) => {
          commit("SET_CURRENT_TASK_DETAIL", res.data.data.task);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTaskCommentsById({ commit, state }: any, id: number | string) {
      // if (state.currentTaskDetail && state.currentTaskDetail.id === +id) {
      // 	return;
      // }
      axios
        .get(`${VUE_APP_BASE_URL}/api/staff/tasks/${id}/comments`)
        .then((res) => {
          const obj = {
            comments: res.data.data.task_comments,
            total: res.data.data.meta.pagination.total,
          };
          commit("SET_CURRENT_TASK_COMMENTS", obj);
          commit(
            "SET_CURRENT_TASK_COMMENTS_COUNTER",
            res.data.data.meta.pagination.total
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTaskActivities(
      { commit, state }: any,
     {
			 id, 
			 scrollAble
		 }:Record<string, any>
    ) {
      const body = {
        scrollAble: scrollAble,
      };
      axios
        .get(
          `${VUE_APP_BASE_URL}/api/staff/tasks/${id}/list-logs?include=causer`,
          {
            params: body,
          }
        )
        .then((res) => {
          commit("SET_TASK_ACTIVITIES", res.data.data.activities);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadMoreTaskCommentsById(
      { commit, state }: any,
      { id, per_page }: Record<string, any>
    ) {
      axios
        .get(`${VUE_APP_BASE_URL}/api/staff/tasks/${id}/comments`, {
          params: {
            size: per_page,
          },
        })
        .then((res) => {
          const obj = {
            comments: res.data.data.task_comments,
            total: res.data.data.meta.pagination.total,
          };
          commit("SET_CURRENT_TASK_COMMENTS", obj);
          commit(
            "SET_CURRENT_TASK_COMMENTS_COUNTER",
            res.data.data.meta.pagination.total
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getListTask({ commit, state }: any) {
      const body = state.filterTask;
      axios
        .get(`${VUE_APP_BASE_URL}/api/staff/tasks`, {
          params: { ...body, size: state.currentSizeTask },
        })
        .then((res) => {
          commit("SET_LIST_TASK", res.data.data.tasks);
          commit(
            "SET_MAX_COUNT_CURRENT_TASK",
            res.data.data.meta.pagination.total
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getListTaskById({ commit }: any, id: any) {
      axios
        .get(`${VUE_APP_BASE_URL}/api/staff/tasks/${id}`)
        .then((res) => {
          commit("SET_TASK_BY_ID", res.data.data.tasks);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
export default tasks;
