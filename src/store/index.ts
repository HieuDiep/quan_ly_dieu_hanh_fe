const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import others from './others';
import users from './users';
import departments from './departments';
import signature from './signature';
import tasks from './tasks';
import categories from './categories';
import fileType from './fileType';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		auth: {
			isAuth: false,
			user: null,
			token: null,
		},
		currentBreadcrumb: [
			{
				text: 'Dashboard',
				disabled: false,
				href: 'breadcrumbs_dashboard',
			},
			{
				text: 'Link 1',
				disabled: false,
				href: 'breadcrumbs_link_1',
			},
			{
				text: 'Link 2',
				disabled: true,
				href: 'breadcrumbs_link_2',
			},
		],
		snackbar: {
			type: '', // success, error, warning
			title: '',
			content: '',
		},
		previousPagination: {
			total: 1,
			size: 15,
			total_pages: 15,
			page: 1,
		},
		logoutIsOpen: false,
		isMini: false,
		visibleDialog: false,
		breadCrumb: {
			viewTxt: 'ASGL',
			ableToBack: false,
			rootRouter: '/',
			hasStatus: false,
			statusTxt: 'Status',
		},
		approvalRequestStatus: [
			{
				id: 1,
				name: 'Nháp',
			},
			{
				id: 2,
				name: 'Đã gửi',
			},
			{
				id: 3,
				name: 'Đã phê duyệt',
			},
			{
				id: 4,
				name: 'Không phê duyệt',
			},
			{
				id: 5,
				name: 'Hủy',
			},
		],
		listImgPreview: [],
		imageIdx: 0,
		showFilter: true,
		addLib: true,
		placeHolder: 'Tìm kiếm đề xuất',
		addLibAction: () => {
			console.log('Emit fnc');
		},
		statistical: {},
		currentCK4: null,
	},
	mutations: {
		SET_SNACKBAR(state, payload) {
			state.snackbar = payload;
			setTimeout(() => {
				state.snackbar = {
					type: '',
					title: '',
					content: '',
				};
			}, 6000);
		},
		CACHED_PAGINATION(state, payload) {
			state.previousPagination = payload;
		},
		SET_LIST_IMAGE_PREVIEW(state, payload) {
			state.listImgPreview = payload;
		},
		SET_CURRENT_CK4(state, payload) {
			state.currentCK4 = payload;
		},
		SET_INDEX_IMAGE_PREVIEW(state, payload) {
			state.imageIdx = payload;
		},
		SET_USER_LOGGEDIN(state, payload) {
			state.auth = { ...payload };
		},
		SET_LOGOUT_USER(state) {
			state.auth = { isAuth: false, user: null, token: null };
		},
		CONFIRM_LOGOUT(state, payload) {
			state.logoutIsOpen = payload;
		},
		SET_MINI(state, payload) {
			state.isMini = payload;
		},
		SET_VISIBLE_DIALOG(state, payload) {
			state.visibleDialog = payload;
		},
		SET_BREADCRUMB(state, payload) {
			state.breadCrumb = payload;
		},
		SET_SHOWFILTER(state, _boolean) {
			state.showFilter = _boolean;
		},
		SET_ADDLIB(state, _boolean) {
			state.addLib = _boolean;
		},
		SET_PLACEHOLDER(state, _STRING) {
			state.placeHolder = _STRING;
		},
		SET_ADDLIBACTION(state, _FUNCTION) {
			state.addLibAction = _FUNCTION;
		},
		SET_STATISTICAL(state, payload) {
			state.statistical = payload;
		},
	},
	actions: {
		getStatistical({ commit }: any) {
			axios
				.get(`${VUE_APP_BASE_URL}/api/approval-requests/statistics`)
				.then(res => {
					commit('SET_STATISTICAL', res.data.data);
				})
				.catch(err => {
					console.log(err);
				});
		},
	},
	getters: {
		getUser(state) {
			return state.auth.user;
		},
	},
	modules: {
		others,
		users,
		departments,
		signature,
		tasks,
		categories,
		fileType,
	},
});
