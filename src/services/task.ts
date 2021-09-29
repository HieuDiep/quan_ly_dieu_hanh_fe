const taskRepo = (axios: any) => {
	return {
		getTaskById(id: any) {
			return axios
				.get(`/api/staff/tasks/${id}`)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		comment(_id: number | string, _params: any = {}) {
			return axios
				.post(`/api/staff/tasks/${_id}/comments`, _params)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		updateComment(
			taskId: number | string,
			commentId: number | string,
			_params: any = {}
		) {
			return axios
				.post(`api/staff/tasks/${taskId}/comments/${commentId}`, _params)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		getListLogs(_id: number | string, _params: any = {}) {
			return axios
				.get(`api/staff/tasks/${_id}/list-logs?include=causer`, {
					params: _params,
				})
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
		deleteComment(taskId: number | string, commentId: number | string) {
			return axios
				.delete(`api/staff/tasks/${taskId}/comments/${commentId}`)
				.then((res: any) => {
					return res;
				})
				.catch((err: any) => {
					return err.response;
				});
		},
	};
};
export default taskRepo;
