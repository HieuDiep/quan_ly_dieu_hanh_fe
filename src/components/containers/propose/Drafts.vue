<template>
	<div class="container-drafts">
		<div class="row m-0">
			<div
				class="
					col-xxl-12
					px-0
					bd-bottom
					d-flex
					align-items-center
					justify-content-between
				"
			>
				<div class="display-flex flex-column px-5 py-2">
					<p class="font-weight-bold mb-0 font-size-14 text-blur-color">
						Tạo phê duyệt mới
					</p>
					<div class="d-flex align-items-center propose-tab py-2">
						<div class="each-status status--active">
							Nháp
							<v-icon> mdi-chevron-right </v-icon>
						</div>
						<div class="each-status">
							Đã gửi
							<v-icon> mdi-chevron-right </v-icon>
						</div>
						<div class="each-status">
							Đã phê duyệt
							<v-icon> mdi-chevron-right </v-icon>
						</div>
						<div class="each-status">
							Không phê duyệt
							<v-icon> mdi-chevron-right </v-icon>
						</div>
						<div class="each-status">Hủy</div>
					</div>
				</div>
				<div class="container-drafts-bottom">
					<span
						class="
							pointer
							text-uppercase text-primary-color
							mr-9
							font-weight-bold
						"
						@click="handlerCreatePropose"
					>
						Tạo mới
					</span>
					<span
						class="pointer text-uppercase text-blur-color font-weight-bold"
						@click="handlerCancelPropose"
					>
						Hủy
					</span>
				</div>
			</div>

			<div class="drafts-left col-xxl-7">
				<div class="drafts-bottom px-5">
					<table class="w-100">
						<tr>
							<th width="60%" class="text-left">
								<span class="font-weight-bold">Danh mục Phê duyệt</span>
							</th>
							<th width="40%" class="text-left">
								<span class="font-weight-bold">Mã số</span>
							</th>
						</tr>
						<tr>
							<td>
								<span
									class="
										text-primary-color
										font-weight-bold font-size-16
										text-uppercase
									"
								>
									{{ cateObj.name }}
								</span>
							</td>
							<td>
								<input
									class="style-input w-100 bg-disable"
									type="text"
									readonly
								/>
							</td>
						</tr>
						<tr>
							<td class="text-left">
								<span class="font-weight-bold">Người đề xuất</span>
							</td>
							<td class="text-left">
								<span class="font-weight-bold">Ngày</span>
							</td>
						</tr>
						<tr>
							<td>
								<div class="cpn-list-item display-flex align-center">
									<v-avatar size="30">
										<img
											:src="user.avatar"
											alt="Avatar"
											class="avatar-create-user"
										/>
									</v-avatar>
									<div class="pl-3">
										<p class="font-weight-bold font-size-14 mb-0">
											{{ user.full_name }}
										</p>
									</div>
								</div>
							</td>
							<td>
								<!-- <input class="style-input w-100" type="date" :value="toDayFormated" /> -->
								<input
									class="style-input w-100"
									type="text"
									:value="toDayFormated"
									readonly
								/>
							</td>
						</tr>
					</table>
					<div class="mt-3">
						<p class="mb-1 font-weight-bold">Nội dung</p>
						<input
							class="style-input w-100"
							type="text"
							v-model="name"
							placeholder="Nội dung phê duyệt"
						/>
					</div>
					<div v-if="cateObj.note" class="mt-3">
						<p class="mb-1 font-weight-bold">Ghi chú</p>
						<p class="field-values" v-html="cateObj.note"></p>
					</div>
					<!-- <div class="mt-3">
      <p class="mb-1 font-weight-bold">Mô tả</p>
      <div class="propose-ck-edittor">
      
       <textarea
        class="style-input w-100 py-3"
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="Mô tả"
        v-model="description"
       ></textarea>
      </div>
     </div> -->
					<div class="mt-3">
						<p class="mb-1 font-weight-bold">Các trường thông tin</p>
						<div class="group-field">
							<div
								v-for="field in cateObj.fields"
								:key="field.name"
								class="each-field-in-gr"
							>
								<p class="field-caption font-weight-bold">
									{{ field.caption }}
									<v-tooltip bottom>
										<template
											v-if="field.required"
											v-slot:activator="{ on, attrs }"
										>
											<span v-bind="attrs" v-on="on" class="required-p-tag"
												>*</span
											>
										</template>
										<span>Trường yêu cầu bắt buộc</span>
									</v-tooltip>
								</p>
								<!-- TEXT NGẮN -->
								<template v-if="field.type && field.type.id === 1">
									<v-text-field
										placeholder="Văn bản câu trả lời ngắn "
										v-model="field.field_values"
									></v-text-field>
								</template>
								<!-- TEXT DÀI -->
								<template v-if="field.type && field.type.id === 2">
									<v-textarea
										auto-grow
										v-model="field.field_values"
										placeholder="Văn bản câu trả lời dài"
										rows="3"
										row-height="20"
									></v-textarea>
								</template>
								<!-- TRẮC NGHIỆM 1 -->
								<template v-if="field.type && field.type.id === 3">
									<div class="">
										<v-radio-group v-model="field.field_values_single_check">
											<v-radio
												v-for="vl in field.field_values_computed"
												:key="vl"
												:label="vl"
												:value="vl"
											></v-radio>
										</v-radio-group>
									</div>
								</template>
								<!-- TRẮC NGHIỆM NHIỀU -->
								<template v-if="field.type && field.type.id === 4">
									<div class="">
										<p
											v-for="(vl, idx) in field.field_values_computed"
											:key="`single-${idx}`"
											class="
												option-feild
												d-flex
												align-items-center
												multi-checkbox
											"
										>
											<!-- <v-icon class="mr-2 font-size-20 pointer">mdi-square-outline</v-icon>
           <input
            type="text"
            :placeholder="`Tùy chọn ${idx + 1}`"
            :value="vl"
            readonly
            name=""
            class="d-block multi-opt"
           /> -->
											<v-checkbox
												v-model="field.field_values_multi_check"
												:label="vl"
												:value="vl"
											></v-checkbox>
										</p>
									</div>
								</template>
								<!-- NGÀY -->
								<template v-if="field.type && field.type.id === 5">
									<div class="field-picker-date">
										<div class="field-picker-date d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Ngày:</p>
											<DateRangeTableHeader
												:singleDatePicker="true"
												:show-ranges="false"
												:picked-date="
													_val => {
														pickedSingleDate(_val, field);
													}
												"
												:placeholder-picker="'Chọn ngày'"
												:picker-class="'field-picker-date'"
											/>
										</div>
									</div>
								</template>
								<!-- GIỜ -->
								<template v-if="field.type && field.type.id === 6">
									<div class="field-picker-date">
										<div class="d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Giờ:</p>
											<div class="time-picker-m">
												<input
													type="time"
													class=""
													v-model="field.field_values"
												/>
											</div>
										</div>
									</div>
								</template>
								<!-- NGÀY VÀ GIỜ -->
								<template v-if="field.type && field.type.id === 7">
									<div class="field-picker-date d-flex align-items-center mb-3">
										<p class="mb-0 pr-3 date-time-label">Ngày:</p>
										<DateRangeTableHeader
											:singleDatePicker="true"
											:show-ranges="false"
											:picked-date="
												_val => {
													pickedSingleDateWithTime(_val, field);
												}
											"
											:placeholder-picker="'Chọn ngày'"
											:picker-class="'field-picker-date'"
										/>
									</div>
									<div class="d-flex align-items-center">
										<p class="mb-0 pr-3 date-time-label">Giờ:</p>
										<div class="time-picker-m">
											<input
												type="time"
												class=""
												v-model="field.field_values_time"
											/>
										</div>
									</div>
								</template>
								<!-- NGÀY ĐẾN NGÀY -->
								<template v-if="field.type && field.type.id === 8">
									<div class="field-picker-date">
										<div class="field-picker-date d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Từ ngày:</p>
											<DateRangeTableHeader
												:singleDatePicker="true"
												:show-ranges="false"
												:picked-date="
													_val => {
														pickedSingleDateFrom(_val, field);
													}
												"
												:placeholder-picker="'Chọn ngày'"
												:picker-class="'field-picker-date'"
											/>
										</div>
									</div>
									<div class="field-picker-date">
										<div class="field-picker-date d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Đến ngày:</p>
											<DateRangeTableHeader
												:singleDatePicker="true"
												:show-ranges="false"
												:picked-date="
													_val => {
														pickedSingleDateTo(_val, field);
													}
												"
												:placeholder-picker="'Chọn ngày'"
												:picker-class="'field-picker-date'"
											/>
										</div>
									</div>
								</template>
								<!-- GIỜ ĐẾN GIỜ -->
								<template v-if="field.type && field.type.id === 9">
									<div class="field-picker-date">
										<div class="d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Từ:</p>
											<div class="time-picker-m">
												<div class="wf-200">
													<DateRangeTableHeader
														:singleDatePicker="true"
														:show-ranges="false"
														:picked-date="
															_val => {
																pickedSingleDateFrom9(_val, field);
															}
														"
														:placeholder-picker="'Chọn ngày'"
														:picker-class="'field-picker-date'"
													/>
												</div>

												<input
													type="time"
													class=""
													v-model="field.field_values_time[0]"
												/>
											</div>
										</div>
									</div>
									<div class="field-picker-date">
										<div class="d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label">Đến:</p>
											<div class="time-picker-m">
												<div class="wf-200">
													<DateRangeTableHeader
														:singleDatePicker="true"
														:show-ranges="false"
														:picked-date="
															_val => {
																pickedSingleDateTo9(_val, field);
															}
														"
														:placeholder-picker="'Chọn ngày'"
														:picker-class="'field-picker-date date-no-boder'"
													/>
												</div>
												<input
													type="time"
													class=""
													v-model="field.field_values_time[1]"
												/>
											</div>
										</div>
									</div>
								</template>
								<!-- BẢNG  -->
								<template v-if="field.type && field.type.id === 10">
									<table class="table-field mb-2">
										<thead>
											<tr>
												<th
													v-for="(col, idx) in field.field_values_columns_head"
													:key="col + idx"
												>
													<input
														type="text"
														:value="col"
														readonly
														class="input-trt"
													/>
												</th>
											</tr>
										</thead>
										<tbody>
											<tr
												v-for="(col, idx) in field.field_values_columns_body"
												:key="col + idx"
											>
												<td v-for="(row, idxe) in col" :key="row + idxe">
													<input
														type="text"
														v-model="row.txt"
														class="input-trt"
														placeholder="Giá trị"
													/>
												</td>
												<td
													v-if="
														field.field_values_columns_body &&
														field.field_values_columns_body.length > 1
													"
													style="width: 30px"
												>
													<div class="d-flex justify-content-center w-100">
														<v-tooltip bottom>
															<template v-slot:activator="{ on, attrs }">
																<img
																	v-bind="attrs"
																	v-on="on"
																	class="pointer"
																	@click="handleRemoveRow(field, idx)"
																	src="@/assets/remove_circle_outline_black_24dp.svg"
																	alt=""
																/>
															</template>
															<span>Xóa hàng</span>
														</v-tooltip>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
									<v-tooltip bottom>
										<template v-slot:activator="{ on, attrs }">
											<img
												v-bind="attrs"
												v-on="on"
												@click="handleAddRow(field)"
												class="pointer mr-2"
												src="@/assets/add_circle_outline_black_24dp.svg"
												alt=""
											/>
										</template>
										<span>Thêm hàng</span>
									</v-tooltip>
								</template>

								<!-- NHÂN VIÊN -->
								<template v-if="field.type && field.type.id === 11">
									<v-autocomplete
										class="block-v-list-item__title"
										v-model="field.field_values"
										:items="listUsersComputed"
										item-text="fieldPickTxt"
										item-value="id"
										placeholder="Nhân viên"
									></v-autocomplete>
								</template>
								<!-- FT -->
								<!-- <div
                  class="
                    display-flex
                    align-items-center
                    req-gr-wr
                    justify-content-end
                  "
                >
                  <span for="" class="mr-2 font-size-14 d-block mb-0"
                    >Bắt buộc</span
                  >
                  <v-switch
                    color="primary"
                    v-model="field.required"
                    readonly
                    input-value="true"
                    class="d-inline-block mt-0 mb-0 pt-0 ctm-switch"
                  ></v-switch>
                </div> -->
							</div>
						</div>
					</div>
					<div class="mt-3">
						<p class="display-flex align-center mb-1 font-weight-bold">
							File đính kèm
							<UploadFile @changeFileUpload="changeFileUpload" />
						</p>
						<div>
							<p
								v-for="(file, idx) in fileClipboard"
								:key="idx"
								class="display-flex align-center pointer"
							>
								<img
									src="@/assets/images/icon-pdf.svg"
									class="mr-2"
									height="20"
									alt=""
								/>
								<span class="text-primary-color">{{ file.name }}</span>
								<v-icon
									color="#ce4b4b"
									class="font-size-16 ml-4"
									@click="removeFileUpload(file._id)"
								>
									mdi-close-circle
								</v-icon>
							</p>
						</div>
					</div>
					<p class="font-weight-bold mt-3">Người phê duyệt</p>
					<TableApprover
						:headers="headers"
						:tableData="cateObj.default_approvers"
						@handleRemoveItem="handlerDeleteApprover"
					/>
					<v-icon class="text-primary-color pointer" @click="addMember">
						mdi-plus-circle
					</v-icon>
				</div>
			</div>
			<div class="drafts-right col-xxl-5">
				<DraftTab v-if="false" />
			</div>
		</div>
		<p v-show="messageErr" class="text-center text-error px-3">
			{{ messageErr }}
		</p>

		<div v-if="isVisible">
			<DialogAddNewMember
				:is-visible-member="isVisible"
				:member-usernames="memberUsernames"
				:participants="participants"
				:companies="companies"
				:picked-user="cateObj.default_approvers"
				@add-new-members="addNewMembersToMetting"
				@handlerCancel="handlerDialogCancel"
			/>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		ref,
		defineComponent,
		computed,
		onMounted,
	} from '@vue/composition-api';
	import { useState } from 'vuex-composition-helpers/dist';
	import {
		DraftTab,
		UploadFile,
		TableApprover,
	} from '@/components/Layout/page-view/propose';
	import { DialogAddNewMember } from '@/components/Layout/page-view/approval';
	import { mapState } from 'vuex';
	import DateRangeTableHeader from '@/components/Shared/DateRangeTableHeader.vue';
	import useRouteQuery from '@/utils/uses/routerQuery/useRouteQuery';
	import api from '@/services';
	import store from '@/store';
	export default defineComponent({
		components: {
			DraftTab,
			UploadFile,
			TableApprover,
			DialogAddNewMember,
			DateRangeTableHeader,
			'ckeditor-nuxt': () => {
				return import('@blowstack/ckeditor-nuxt');
			},
		},
		setup: (props, ctx) => {
			const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
			const headers = [
				{
					text: 'Họ tên',
					align: 'start',
					value: 'full_name',
				},
				{
					text: 'Chức danh',
					align: 'start',
					value: 'roleTxt',
				},
				{
					text: 'Trạng thái',
					align: 'start',
					value: 'status',
				},
				{
					text: 'Ngày phê duyệt',
					align: 'start',
					value: 'status',
				},
				{
					align: 'start',
					value: 'action',
				},
			];
			const cate_id: number = queryRoute.cate_id;
			let cateObj = ref<Record<string, any>>({});
			const isVisible = ref(false);
			const loadingBtn = ref(false);
			const setIsVisible = (value: boolean) => {
				isVisible.value = value;
			};
			const setCateObj = (value: Record<string, any>) => {
				cateObj.value = value;
			};
			const { auth } = useState(['auth']);
			const content = '<p>Content of the editor.</p>';
			const token = auth.value.token;
			const editorConfig = {
				toolbar: {
					items: [
						'Paragraph',
						'bold',
						'italic',
						'|',
						'undo',
						'redo',
						'numberedList',
						'bulletedList',
						'ImageUpload',
					],

					shouldNotGroupWhenFull: true,
				},
				exportPdf: {},
				pagination: {
					// A4
					pageWidth: '21cm',
					pageHeight: '29.7cm',

					pageMargins: {
						top: '20mm',
						bottom: '20mm',
						left: '12mm',
						right: '12mm',
					},
				},
				removePlugins: ['Title', 'CodeBlock', 'Code'],
				simpleUpload: {
					uploadUrl:
						process.env.BASE_URL + '/api/user/announcements/upload-image',
					headers: {
						Authorization: token,
					},
				},
			};
			let tab = ref(1);
			let approverList = ref<Record<string, any>>({ value: [] });
			let followerList: any[] = [];
			const name = ref<string>('');
			const description = ref<string>('');
			const fileClipboard = ref<Array<any>>([]);
			const messageErr = ref<string>('');
			// const fileClipboard = ref<Record<string,any>[]>([{a:1}])
			const changeFileUpload = (file: Array<any>) => {
				fileClipboard.value = fileClipboard.value.concat(file);
			};
			const setMessageErr = (payload: string) => {
				messageErr.value = payload;
			};
			const removeFileUpload = (id: number) => {
				fileClipboard.value.splice(
					fileClipboard.value.findIndex(o => o._id == id),
					1
				);
			};
			const removeItem = (items: any) => {
				console.log(items);
			};
			let participants = ref<Record<string, any>[]>([]);
			let companies = ref<Record<string, any>[]>([]);
			const addNewMembersToMetting = (member: Array<any>) => {
				cateObj.value.default_approvers = member;
			};
			const addFollwers = () => {
				followerList.push(auth.value.user.user.id);
			};

			const setLoadingBtn = (payload: boolean) => {
				loadingBtn.value = payload;
			};
			const getDetailCate = async () => {
				const res = await api.categories.getDetail(cate_id);
				if (!res) {
					ctx.root.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Không lấy được thông tin danh mục',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						const result = res.data.data.category;
						result.default_approvers.forEach((o: Record<string, any>) => {
							let str = '';
							o.positions.forEach((k: any) => {
								str += k.name + '. ';
							});

							o.roleTxt = str;
							o.status = '-';
						});
						result.fields.forEach((k: any) => {
							if (k.type && k.type.id === 3) {
								k.field_values_computed = k.dynamic_attributes.choices.slice();
								k.field_values_single_check = '';
							}
							if (k.type && k.type.id === 4) {
								k.field_values_computed = k.dynamic_attributes.choices.slice();
								k.field_values_multi_check = [];
							}
							if (k.type && k.type.id === 8) {
								k.field_values = ['', ''];
							}
							if (k.type && k.type.id === 9) {
								k.field_values_time = ['', ''];
								k.field_values_date = ['', ''];
							}
							if (k.type && k.type.id === 10) {
								k.field_values_columns_head =
									k.dynamic_attributes.columns.slice();
								k.field_values_columns_body = [
									k.dynamic_attributes.columns.map((o: any) => {
										return { txt: '' };
									}),
								];
							}
						});
						setCateObj(result);

						// cateObj = res.data.data.category;
					} else {
						ctx.root.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					console.log(error);
					ctx.root.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content:
							'Không lấy được thông tin danh mục. Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			};
			const handlerSendPropose = async () => {
				messageErr.value = '';
				setLoadingBtn(true);
				const res = await api.propose.send(cate_id);
				setLoadingBtn(false);
				if (!res) {
					ctx.root.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						let _data = res.data.data.sender;
						ctx.root.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Gửi danh mục thành công ',
						});
					} else {
						messageErr.value = res.data.data.error || res.data.message;
						ctx.root.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					ctx.root.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			};

			const toDayFormated = `${String(new Date().getDate()).padStart(
				2,
				'0'
			)}-${String(new Date().getMonth() + 1).padStart(
				2,
				'0'
			)}-${new Date().getFullYear()}`;
			const handlerDeleteApprover = (id: Record<string, any>) => {
				let obj = { ...cateObj.value };
				obj.default_approvers = obj.default_approvers.filter((o: any) => {
					return o.id !== id.id;
				});
				setCateObj(obj);
			};
			onMounted(getDetailCate);
			return {
				toDayFormated,
				auth,
				name,
				description,
				headers,
				tab,
				approverList,
				followerList,
				isVisible,
				loadingBtn,
				content,
				participants,
				fileClipboard,
				cateObj,
				messageErr,
				companies,
				editorConfig,
				changeFileUpload,
				removeFileUpload,
				setIsVisible,
				removeItem,
				addNewMembersToMetting,
				cate_id,
				handlerSendPropose,
				handlerDeleteApprover,
				addFollwers,
				setLoadingBtn,
				setMessageErr,
			};
		},
		beforeDestroy() {
			this.$store.dispatch('SET_ADDLIBACTION', () => {
				console.log('changedroute');
			});
		},
		methods: {
			handlerDialogCancel() {
				this.setIsVisible(false);
			},
			handlerDialogSubmit(value: any) {
				console.log(value);
			},
			addMember() {
				this.setIsVisible(true);
			},
			addOptToField(arr: Array<any>) {
				arr.push({ txt: '' });
			},
			removeOptToField(arr: Array<any>, idx: number) {
				arr.splice(idx, 1);
			},
			pickedSingleDate(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values = '';
			},
			pickedSingleDateFrom(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values[0] = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values[0] = '';
			},
			pickedSingleDateFrom9(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values_date[0] = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values_date[0] = '';
			},
			pickedSingleDateTo(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values[1] = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values[1] = '';
			},
			pickedSingleDateTo9(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values_date[1] = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values_date[1] = '';
			},
			pickedSingleDateWithTime(_val: any, field: any) {
				if (_val.value && _val.value.startDate) {
					const arr = _val.value.startDate.split('-');
					field.field_values_date = `${arr[0]}/${arr[1]}/${arr[2]}`;
					return;
				}
				field.field_values = '';
			},
			handlerCancelPropose() {
				this.$router.push('/');
			},
			handleAddRow(field: any) {
				if (field.field_values_columns_body) {
					const newArr = field.field_values_columns_body[
						field.field_values_columns_body.length - 1
					].map((o: any) => {
						return { txt: '' };
					});
					field.field_values_columns_body.push(newArr);
				}
			},
			validSubmit(fields: Array<any>) {
				return new Promise(resolve => {
					if (!this.name) {
						resolve('Không được để trống nội dung phê duyệt.');
						return;
					}
					// const rsFields = fields.every((o: any) => {
					//   if (o.required && (!o.field_values || !o.field_values.length)) {
					//     return false;
					//   }
					//   return true;
					// });
					// if (!rsFields) {
					//   resolve("Bạn chưa điền đầy đủ thông tin các trường yêu cầu.");
					//   return;
					// }
					resolve('');
				});
			},
			async handlerCreatePropose() {
				this.setMessageErr('');
				this.addFollwers();
				const fields = this.cateObj.fields.map((o: any) => {
					let obj = {
						...o,
					};

					if (o.type && o.type.id === 4) {
						obj.field_values = obj.field_values_multi_check.slice();
					}
					if (o.type && o.type.id === 3) {
						obj.field_values = obj.field_values_single_check;
					}
					if (o.type && o.type.id === 7) {
						if (o.field_values_date && o.field_values_time) {
							obj.field_values = `${o.field_values_date} ${o.field_values_time}`;
						} else {
							obj.field_values = '';
						}
					}
					if (o.type && o.type.id === 9) {
						let arr = ['', ''];
						arr.forEach((j, idx) => {
							console.log(
								`${o.field_values_date[idx]} ${o.field_values_time[idx]}`
							);
							j = `${o.field_values_date[idx]} ${o.field_values_time[idx]}`;
						});
						obj.field_values = arr.map((j, idx) => {
							return `${o.field_values_date[idx]} ${o.field_values_time[idx]}`;
						});
					}
					if (o.type && o.type.id === 10) {
						obj.field_values = o.field_values_columns_body.map((i: any) => {
							return i.map((j: any) => {
								return j.txt;
							});
						});
					}

					return obj;
				});
				fields.forEach((k: any) => {
					if (k.type && k.type.id === 9) {
						if (!k.field_values.join('').replaceAll(' ', '')) {
							k.field_values = null;
						}
					}
					if (k.type && k.type.id === 10) {
						if (
							k.field_values.every((j: any) => !j.join('').replaceAll(' ', ''))
						) {
							k.field_values = null;
						}
					}
				});
				console.log(fields);
				const inValid = await this.validSubmit(fields);
				if (!inValid) {
					const xp = fields.map((o: Record<string, unknown>) => {
						const arr: any[] = [o.name, o.field_values];
						return arr;
					});

					const params = {
						name: this.name,
						description: this.description,
						category_id: this.cateObj.id,
						field_values: Object.fromEntries(xp),
						approver_ids: this.cateObj.default_approvers.length
							? this.cateObj.default_approvers.map((o: any) => o.id)
							: [],
						follower_ids: [this.auth.user.user.id],
					};
					this.setMessageErr('');
					this.setLoadingBtn(true);
					const res = await api.propose.create(params);
					this.setLoadingBtn(false);
					if (!res) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content:
								'Tạo đề xuất thất bại. Lỗi máy chủ, vui lòng liên hệ IT để hỗ trợ.',
						});
						return;
					}
					try {
						if (res.status > 199 && res.status < 399) {
							this.$store.commit('SET_SNACKBAR', {
								type: 'success',
								title: '',
								content: 'Tạo đề xuất thành công',
							});
							this.$router.push(
								`/de-xuat/chi-tiet/${res.data.data.approval.id}`
							);

							this.$store.dispatch('getStatistical');
						} else {
							//  this.setMessageErr(res.data.data.error || res.data.message);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: res.data.data.error || res.data.message,
							});
						}
					} catch (error) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
						});
					}
				} else {
					this.setMessageErr(`${inValid}`);
				}
			},
			handleRemoveRow(field: any, idx: any) {
				if (field.field_values_columns_body) {
					field.field_values_columns_body.splice(idx, 1);
				}
			},
		},
		computed: {
			...mapState({
				user: (state: any) => state.auth.user.user,
				listUsers: (state: any) => state.users.listUsers,
				cards: (states: any) => states.categories.listCategories,
				cate() {
					return this.cards.find((o: any) => o.id == this.cate_id) || {};
				},
				listUsersComputed() {
					const arr = this.listUsers.slice();

					arr.forEach((o: any) => {
						o.fieldPickTxt = `${o.full_name} - ${o.asgl_id}`;
					});
					return arr;
				},
			}),

			memberUsernames() {
				let _usernames: any[] = [];
				// for (let p of this.participantsTemp) {
				//   _usernames.push(p.username);
				// }
				return _usernames;
			},
		},
	});
</script>

<style lang="scss" scoped>
	@import '@/assets/style/_variables.scss';
	.container-drafts {
		.drafts-left {
			border-right: 1px solid $borderColor;
			padding: 0;
			height: calc(100vh - 190px);
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
			.drafts-top {
				padding-top: 8px;
				padding-bottom: 40px;
			}
			.drafts-bottom {
				padding-top: 8px;
				padding-bottom: 20px;
			}
		}
		.container-drafts-bottom {
			padding: 25px 20px;
			display: flex;
			justify-content: flex-end;
		}
	}
	.style-input {
		border: 1px solid $borderColor;
		border-radius: 6px;
		padding: 0 8px;
		font-size: 14px;
		&:not(textarea) {
			height: 36px;
		}
	}
</style>
<style lang="scss">
	@import '@/assets/style/_variables.scss';
	.drafts-bottom {
	}
	.propose-ck-edittor {
		.ck-toolbar {
			border-color: $borderColor !important;
			background-color: $borderColor !important;
		}
		.ck-content {
			border-color: $borderColor !important;
			border-top: 0 !important;
		}
	}
	.avatar-create-user {
		object-fit: cover;
		object-position: center;
	}
	.each-field-in-gr {
		border: 1px solid #dee5eb;
		border-radius: 6px;
		padding: 8px;
		margin-bottom: 12px;
		.ctm-switch {
			.v-input__slot {
				margin-bottom: 0;
			}
			.v-messages {
				display: none;
			}
		}
		.multi-opt {
			width: 100%;
			border-bottom: 1px solid #dee5eb;
		}
		.field-picker-date {
			.vue-daterange-picker {
				width: 100%;
				.date-range-slot-wrapper-tb {
					padding: 10px 6px;
					height: 40px;
					border: none !important;
					border-bottom: 1px solid $borderColor !important;
					margin-bottom: 0 !important;
				}
				.range-date-picker {
					.field-picker-date {
						justify-content: flex-start !important;
						font-size: 15px !important;
						span {
							font-size: 15px !important;
						}
					}
				}
			}
		}
		.time-picker-m {
			width: 100%;
			border-bottom: 1px solid $borderColor;
			input {
				padding: 10px 6px;
				font-size: 14px;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.87);
			}
		}
		.date-time-label {
			width: 85px;
			font-size: 14px;
			font-weight: 500;
		}
	}
	.multi-checkbox {
		margin-bottom: 8px !important;
		.v-input--checkbox {
			margin-top: 0 !important;
			.v-input__control {
				.v-input__slot {
					margin-bottom: 0 !important;
				}
				.v-messages {
					display: none !important;
				}
			}
		}
	}
	.table-field {
		margin-right: 4px;
		border: 1px solid #dddcdc;
		border-radius: 4px;
		width: 100%;
		border-collapse: collapse;
		tr {
			th,
			td {
				border: 1px solid #dddcdc;
			}
			.input-trt {
				width: 100%;
				text-align: center;
			}
			.rough-td {
				height: 30px;
				background: #edeef07e;
			}
		}
	}
	.wf-200 {
		width: 200px;
	}
</style>
