const approvalRepo = (axios: any) => {
	return {
		getStatistical(filterOptions: Record<string, unknown> = {}) {
			const body = {
				...filterOptions,
				// include: filterOptions.include ? `${filterOptions.include},parts,parts.warehouse,parts.warehouse_off_airport_terminal` : "parts",
			};
			return axios
				.get(`api/approval-requests/statistics`, {
					params: body,
				})
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		getAll(filterOptions: Record<string, unknown> = {}) {
			const body = {
				...filterOptions,
				// include: filterOptions.include ? `${filterOptions.include},parts,parts.warehouse,parts.warehouse_off_airport_terminal` : "parts",
			};
			return axios
				.get(`api/approval-requests`, {
					params: body,
				})
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		getDetail(_id: number) {
			return axios
				.get(
					`api/approval-requests/${_id}?include=fields,approvers,followers,category,creator,templates.sign_at`
				)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		getListLogs(_id: number | string, _params: any = {}) {
			return axios
				.get(`/api/approval-requests/${_id}/logs?include=causer`, {
					params: _params,
				})
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		addFollower(_id: number | string, _params: any = {}) {
			return axios
				.post(`/api/approval-requests/${_id}/attach-followers`, _params)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		removeFollower(_id: number | string, _params: any = {}) {
			return axios
				.post(`/api/approval-requests/${_id}/detach-followers`, _params)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		getListComment(_id: number | string, _params: any = {}) {
			return axios
				.get(`/api/approval-requests/${_id}/comments`, { params: _params })
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		comment(_id: number | string, _params: any = {}) {
			return axios
				.post(`/api/approval-requests/${_id}/comments`, _params)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		updateComment(
			approvalId: number | string,
			commentId: number | string,
			_params: any = {}
		) {
			return axios
				.post(
					`api/approval-requests/${approvalId}/comments/${commentId}`,
					_params
				)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		deleteComment(approvalId: number | string, commentId: number | string) {
			return axios
				.delete(`api/approval-requests/${approvalId}/comments/${commentId}`)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},

		approve(_id: string | number) {
			return axios
				.post(`/api/approval-requests/${_id}/approve`)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		decline(_id: string | number, filterOptions: Record<string, unknown> = {}) {
			const body = {
				...filterOptions,
			};
			return axios
				.post(`/api/approval-requests/${_id}/reject`, body)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
	};
};
export default approvalRepo;
