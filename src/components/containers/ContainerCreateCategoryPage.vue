<template>
	<div class="page-create-category">
		<div
			class="
				page-create-category__title
				d-flex
				align-items-center
				justify-content-between
			"
		>
			<span class="text-blur font-size-14 font-weight-bold">
				{{ isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới' }}
			</span>
			<div class="d-flex justify-end align-center">
				<v-btn
					color="#fff"
					:disabled="loadingSubmit"
					:loading="loadingSubmit"
					class="btn-save-cate"
					@click="onSubmit"
				>
					{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</v-btn
				>
				<v-btn
					color="#fff"
					:disabled="loadingSubmit"
					:loading="loadingSubmit"
					class="btn-cancel"
					@click="handleCancel"
				>
					HỦY</v-btn
				>
			</div>
		</div>
		<div class="page-create-category__body px-4 pt-3">
			<v-row>
				<v-col :cols="isEdit ? 12 : 12">
					<div class="d-flex align-items-center justify-content-between">
						<div
							class="page-create-category__body_pp mb-4"
							style="width: calc(100% - 100px)"
						>
							<p
								class="
									each-field-title
									font-size-16 font-weight-bold
									text-darkgrey
									mb-2
								"
							>
								Tên danh mục
							</p>
							<input
								v-model="cateName"
								type="text"
								:placeholder="'Tên danh mục'"
								class="normal-input-outlined font-size-14 text-darkgrey"
							/>
						</div>
						<div v-if="isEdit">
							<div class="d-flex align-items-end px-0">
								<label
									for="file-sign-cate-s"
									class="
										cate-file-label
										font-size-13
										px-0
										fw-500
										pointer
										flex-column
									"
								>
									<img
										v-if="cateAvatar"
										:src="cateAvatar"
										alt=""
										class="cate-icon-img d-block"
									/>
									{{
										cateAvatar && cateAvatar ? 'Chỉnh sửa' : 'Tải ảnh lên'
									}}</label
								>
							</div>
							<input
								type="file"
								accept="image"
								class="d-none"
								name=""
								id="file-sign-cate-s"
								@change="onFileChangeS"
							/>
						</div>
					</div>
					<div class="page-create-category__body_pp mb-4">
						<p
							class="
								each-field-title
								font-size-16 font-weight-bold
								text-darkgrey
								mb-2
							"
						>
							Mục đích
						</p>
						<input
							v-model="cateDescription"
							type="text"
							placeholder="Mục đích "
							class="normal-input-outlined font-size-14 text-darkgrey"
						/>
					</div>
					<div class="page-create-category__body_pp mb-4">
						<p
							class="
								each-field-title
								font-size-16 font-weight-bold
								text-darkgrey
								mb-2
							"
						>
							Ghi chú
						</p>
						<textarea
							v-model="cateNote"
							type="text"
							placeholder="Ghi chú "
							class="normal-input-outlined font-size-14 text-darkgrey"
							rows="4"
						></textarea>
					</div>
					<v-row class="page-create-category__body_pp mb-4">
						<!-- <v-col cols="6" class="py-0">
       <p
        class="
         each-field-title
         font-size-16 font-weight-bold
         text-darkgrey
         mb-2
        "
       >
        Công ty
       </p>
       <v-autocomplete
        v-model="company"
        :items="listCompanies"
        :item-text="'name'"
        outlined
        dense
        label=""
        class="border-normal"
       ></v-autocomplete>
      </v-col> -->
						<v-col cols="12" class="py-0">
							<p
								class="
									each-field-title
									font-size-16 font-weight-bold
									text-darkgrey
									mb-2
								"
							>
								Phòng ban
							</p>
							<v-autocomplete
								v-model="department"
								:items="listDepartments"
								item-text="name"
								item-value="id"
								outlined
								dense
								label=""
								class="border-normal"
							></v-autocomplete>
						</v-col>
					</v-row>
					<!--  -->
					<v-row class="page-create-category__body_fs mb-4">
						<v-col v-if="isEdit" cols="6" class="py-0">
							<p
								class="
									each-field-title
									font-size-16 font-weight-bold
									text-darkgrey
									mb-2
								"
							>
								Tài liệu yêu cầu mẫu
							</p>
							<div
								v-for="file in listTemplate"
								:key="file._id"
								class="d-flex align-items-center"
							>
								<p
									class="each-file-block pointer mb-0"
									@click="selectTemplateToEdit(file)"
								>
									{{ file.name }}
								</p>
								<!-- <img
         src="../../assets/pageview_black_24dp.svg"
         alt=""
         class="pl-2 pointer"
         @click="setPreviewTemplate(file)"
        /> -->
								<img
									src="../../assets/images/red-close.png"
									alt=""
									style="opacity: 0.7"
									class="pl-2 pointer"
									@click="setRemoveTemplate(file)"
								/>
							</div>
							<label
								for="file-sign-cates"
								class="cate-file-label font-size-14 pt-2 fw-500 pointer"
								@click="
									() => {
										ckKeyRef = true;
										setVisibleEditor(true);
									}
								"
							>
								<img
									src="../../assets/images/file-add.png"
									alt=""
									height="22px"
									class="pr-2"
								/>
								Tạo mới tài liệu yêu cầu mẫu</label
							>
							<input
								type="file"
								accept="image"
								class="d-none"
								name=""
								multiple
								id="file-sign-cate"
								@change="onFileChange"
							/>
						</v-col>
						<v-col cols="6" class="py-0">
							<p
								class="
									each-field-title
									font-size-16 font-weight-bold
									text-darkgrey
									mb-2
								"
							>
								Người phê duyệt
							</p>
							<div class="list-user-selected">
								<div class="add-member-btn">
									<img
										src="../../assets/images/small-add.png"
										alt=""
										class="pointer"
										@click="handleOpenAddMember"
									/>
								</div>
								<div
									v-for="user in listApprovalMember"
									:key="user.id"
									class="each-user-selected"
								>
									<div class="list-user-avatar-v mr-1">
										<img :src="user.avatar" alt="" class="u-avatar" />
										<p
											class="
												mb-0
												u-full-name
												font-size-10
												text-blur text-center
											"
										>
											{{ user.full_name }}
										</p>
										<img
											src="../../assets/images/red-close.png"
											alt=""
											class="close-x pointer"
											@click="removeApprovalDefault(user.id)"
										/>
									</div>
								</div>
							</div>
						</v-col>
						<v-col cols="12">
							<p
								class="
									each-field-title
									font-size-16 font-weight-bold
									text-darkgrey
									mb-2
								"
							>
								Trường thông tin
							</p>
							<div
								class="mb-5 field-info-wrapper"
								v-for="(fd, index) in listFeildSelected"
								:key="index + fd.name + fd.caption + fd.id"
							>
								<FieldImformation
									:type-feild="fd"
									:handler-copy="handlerCopyFeild"
									:handler-remove="handlerRemoveFeild"
									:update-field="updateField"
									:idx="index"
									:handle-add-col="handleAddCol"
									:list-users="listUsers"
								/>
							</div>

							<p class="mt-3 text-primary-color">
								<span class="font-size-14"> Thêm mới: </span>
								<v-select
									:key="setKeyRFM"
									:items="listIFMState"
									item-text="alias"
									return-object
									placeholder="Thêm thông tin"
									outlined
									class="select-add-ifm d-inline-block"
									@change="e => handlerChangeSelect(e)"
								></v-select>
							</p>
						</v-col>
					</v-row>
					<!--  -->
				</v-col>
			</v-row>
		</div>
		<p class="text-error text-center">{{ errMsg }}</p>

		<DialogAddMemberToCate
			:visible-dialog="visibleAddMember"
			:on-close="handleCloseAddMember"
			:on-submit="changeApprovalMember"
			:default-member="listApprovalMember"
		/>
		<DialogCategoryEditorCK4
			v-if="ckKeyRef"
			:is-visible="visibleEditor"
			:on-close="closeEditor"
			:list-param="listParam"
			:on-submit="submitEditor"
			:handle-preview="setPreviewTemplate"
			:selected-template="selectedTemplate"
			:current-cate-id="+currentID"
		/>
		<ConfirmRemoveTemplate
			:is-visible="visibleConfirmRemoveTemplate"
			:handlerCancel="handleCancelRemoveTemplate"
			:handlerConfirm="handleRemoveTemplate"
			:loading-btn="loadingBtnRemoveTemp"
			:messErr="''"
			:selected-data="removeTemplate"
		/>
		<PreviewTemplate
			:is-visible="visiblePreviewTemplate"
			:handlerCancel="handleClosePreviewTemplate"
			:loading-btn="loadingBtnRemoveTemp"
			:messErr="''"
			:selected-data="previewTemplate"
		/>
	</div>
</template>

<script lang="ts">
	import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
	//  import "./placeholder/index";
	import UploadFile from '@/components/Layout/page-view/propose/UploadFile.vue';
	import api from '@/services';
	import {
		defineComponent,
		ref,
		reactive,
		toRef,
		onMounted,
	} from '@vue/composition-api';

	import DialogCategoryEditorCK4 from '@/components/Form/DialogCategoryEditorCK4.vue';
	import DialogAddApprovalPeople from '@/components/Form/DialogAddApprovalPeople.vue';
	import DialogChooseSignature from '@/components/Form/DialogChooseSignature.vue';
	import PreviewTemplate from '@/components/popup/PreviewTemplate.vue';
	import ConfirmRemoveTemplate from '@/components/popup/ConfirmRemoveTemplate.vue';
	import DialogAddMemberToCate from '@/components/Form/DialogAddMemberToCate.vue';
	import { fileClipboardObj } from '@/InterfaceModel/Files';
	import FieldImformation from '@/components/Shared/FieldImformation.vue';
	import useRouteQuery from '@/utils/uses/routerQuery/useRouteQuery';
	import { useState } from 'vuex-composition-helpers/dist';
	import { tStr } from 'validation_t/src';
	import { mapState } from 'vuex';

	export default defineComponent({
		components: {
			DialogAddApprovalPeople,
			DialogChooseSignature,
			UploadFile,
			DialogAddMemberToCate,
			FieldImformation,
			DialogCategoryEditorCK4,
			ConfirmRemoveTemplate,
			PreviewTemplate,
		},
		setup: (props, ctx) => {
			const { queryRoute, currentParram } = useRouteQuery();
			let loadingBtnRemoveTemp = false;
			const currentID: number = currentParram;
			let setKeyRFM = ref<number>(1);
			let fileClipboard = ref<fileClipboardObj[]>([]);
			let isEdit = ref<boolean>(false);
			let visibleConfirmRemoveTemplate = ref<boolean>(false);
			let visibleEditor = ref<boolean>(false);
			let listApprovalMember = ref<any[]>([]);
			let cateName = ref<string>('');
			let cateAvatar = ref<string>('');
			let cateDescription = ref<string>('');
			let cateNote = ref<string>('');
			let errMsg = ref<string>('');
			let loadingSubmit = ref<boolean>(false);
			let fileClipboardS = ref<fileClipboardObj>();
			let visibleAddMember = ref<boolean>(false);
			let visiblePreviewTemplate = ref<boolean>(false);
			let listTemplate = ref<any[]>([]);
			let listParam = ref<Record<string, any>>({});
			let removeTemplate = ref<Record<string, any>>({});
			let previewTemplate = ref<Record<string, any>>({});
			let selectedTemplate = ref<Record<string, unknown>>({});
			const company = ref<Record<string, unknown>>();
			const department = ref<number>();
			const setFileClipboard = (payload: fileClipboardObj[]) => {
				fileClipboard.value = payload;
			};

			const setIsEdit = (payload: boolean) => {
				isEdit.value = payload;
			};
			const setSetKeyRFM = (payload: number) => {
				setKeyRFM.value = payload;
			};
			const setVisibleEditor = (payload: boolean) => {
				visibleEditor.value = payload;
			};
			const setVisibleConfirmRemoveTemplate = (payload: boolean) => {
				visibleConfirmRemoveTemplate.value = payload;
			};
			const setVisiblePreviewTemplate = (payload: boolean) => {
				visiblePreviewTemplate.value = payload;
			};
			const setLoadingSubmit = (payload: boolean) => {
				loadingSubmit.value = payload;
			};
			const setErrMsg = (payload: string) => {
				errMsg.value = payload;
			};
			const setCateAvatar = (payload: string) => {
				cateAvatar.value = payload;
			};
			const setCateName = (payload: string) => {
				cateName.value = payload;
			};
			const setCateNote = (payload: string) => {
				cateNote.value = payload;
			};
			const setDepartment = (payload: number) => {
				department.value = payload;
			};
			const setCateDescription = (payload: string) => {
				cateDescription.value = payload;
			};

			const clearFileClipboard = () => {
				fileClipboard.value = [{ _id: 0, type: 'none', blob: 'none' }];
			};

			const setFileClipboardS = (payload: fileClipboardObj) => {
				fileClipboardS.value = payload;
			};
			const setVisibleAddMember = (payload: boolean) => {
				visibleAddMember.value = payload;
			};
			const setListApprovalMember = (payload: any[]) => {
				listApprovalMember.value = payload;
			};
			const setRemoveTemplate = (payload: Record<string, any>) => {
				if (payload.id) {
					setVisibleConfirmRemoveTemplate(true);
				}
				removeTemplate.value = payload;
			};
			const setPreviewTemplate = (payload: Record<string, any>) => {
				if (payload.html) {
					setVisiblePreviewTemplate(true);
				}
				previewTemplate.value = payload;
			};
			const setListTemplate = (payload: any[]) => {
				listTemplate.value = payload;
			};
			const { others } = useState(['others']);

			const handlerRemoveFeild = (idx: number) => {
				if (idx >= 0) {
					listFeildSelected.value.splice(idx, 1);
				}
			};
			const handlerChangeSelect = (e: any) => {
				if (!e) {
					return;
				}
				const paydload = { ...e };
				if (e.id === 10) {
					paydload.tableStatistic = [{ name: 'Cột 1' }, { name: 'Cột 2' }];
				}
				listFeildSelected.value.push(paydload);
				setSetKeyRFM(Math.round(Math.random() * 1000));
			};
			const handleAddCol = (value: any, idx: number) => {
				const payload = { ...listFeildSelected.value };
				payload[idx].tableStatistic.push({
					name: `Cột ${payload[idx].tableStatistic.length + 1}`,
				});
				// if (payload && payload.tableStatistic) {
				//   payload.tableStatistic
				// }
				// listFeildSelected.value.push(paydload);
				// setSetKeyRFM(Math.round(Math.random() * 1000));
			};
			const updateField = (_val: any, _idx: number) => {
				listFeildSelected.value[_idx] = _val;
			};
			const setListFeildSelected = (_val: Array<any>) => {
				listFeildSelected.value = _val;
			};
			const setListParam = (_val: Record<string, any>) => {
				listParam.value = _val;
			};
			const setSelectedTemplate = (_val: Record<string, any>) => {
				selectedTemplate.value = _val;
			};
			// get current id detail
			const getDetail = async () => {
				if (!currentID) {
					return;
				}
				setIsEdit(true);
				const res = await api.categories.getDetail(currentID);
				if (!res) {
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						const dataObj = res.data.data.category;
						setCateName(dataObj.name);
						setCateNote(dataObj.note);
						setCateAvatar(dataObj.avatar);
						setCateDescription(dataObj.description);
						setDepartment(dataObj.department.id);
						setListApprovalMember(dataObj.default_approvers);
						setListTemplate(dataObj.templates || []);
						setListParam(dataObj.parameters || []);

						const arr = dataObj.fields.map((o: any) => {
							return {
								id: o.type.id,
								alias: o.type.alias,
								name: o.type.name,
								required: o.required,
								caption: o.caption,
								dynamic_attributes: o.dynamic_attributes,
								tableStatistic:
									o.type.id === 10 &&
									o.dynamic_attributes &&
									o.dynamic_attributes.columns
										? o.dynamic_attributes.columns.map((o: any) => {
												return { name: o };
										  })
										: [],
							};
						});
						setListFeildSelected(arr);
						// console.log(arr)
					}
				} catch (error) {
					console.log(error);
				}
			};
			const listIFM = others.value.listFieldAccepted;
			const listFeildSelected = ref<Array<any>>([]);

			onMounted(getDetail);
			return {
				isEdit,
				cateAvatar,
				cateName,
				cateNote,
				cateDescription,
				others,
				listIFM,
				company,
				department,
				visibleEditor,
				visibleConfirmRemoveTemplate,
				loadingBtnRemoveTemp,
				errMsg,
				currentID,
				setKeyRFM,
				listTemplate,
				removeTemplate,
				loadingSubmit,
				fileClipboard,
				fileClipboardS,
				visibleAddMember,
				listApprovalMember,
				listFeildSelected,
				listParam,
				previewTemplate,
				selectedTemplate,
				visiblePreviewTemplate,
				setVisiblePreviewTemplate,
				setPreviewTemplate,
				setFileClipboard,
				clearFileClipboard,
				setFileClipboardS,
				setVisibleAddMember,
				setListApprovalMember,
				handlerRemoveFeild,
				handlerChangeSelect,
				updateField,
				setLoadingSubmit,
				setErrMsg,
				setVisibleEditor,
				setListTemplate,
				setSelectedTemplate,
				getDetail,
				setListParam,
				setCateNote,
				setCateAvatar,
				handleAddCol,
				setVisibleConfirmRemoveTemplate,
				setRemoveTemplate,
			};
		},
		data() {
			return {
				ckKeyRef: false,
			};
		},
		computed: {
			...mapState({
				listDepartments: (state: any) => state.users.listDepartments,
				listCompanies: (state: any) => state.users.listCompanies,
				listUsers: (state: any) => state.users.listUsers,
				listIFMState: (state: any) => state.others.listFieldAccepted,
			}),
		},
		methods: {
			handlerCopyFeild(idx: number) {
				const arr = this.listFeildSelected.slice();
				const obj = { ...arr[idx] };
				obj.caption += ' - Copy';
				this.listFeildSelected.push(obj);
			},
			handleCancel() {
				this.$router.push('/danh-muc');
			},
			getFileName(_name: string) {
				const lastDotIdx = _name.lastIndexOf('.');
				const name = _name.slice(0, lastDotIdx);
				const type = _name.slice(lastDotIdx + 1, _name.length);
				if (name.length < 20) {
					return _name;
				}
				return name.slice(0, 20) + '...' + type;
			},
			onFileChange(e: any) {
				const files = e.target.files || e.dataTransfer.files;
				if (!files.length) return;
				files.forEach((file: any) => {
					const reader = new FileReader();
					reader.onload = async (event: any) => {
						const img = document.createElement('img');
						img.src = event.target.result;
						const currentF = this.fileClipboard.slice();
						currentF.push({
							_id: `${new Date().getTime()}_${Math.random()}`,
							name: file.name,
							src: event.target.result,
							type: 'image',
							blob: file,
							sizes: file.size,
						});
						this.setFileClipboard(currentF);
					};
					reader.readAsDataURL(file);
				});
			},
			onFileChangeS(e: any) {
				const files = e.target.files || e.dataTransfer.files;
				if (!files.length) return;
				const file = files[0];
				const reader = new FileReader();
				reader.onload = async (event: any) => {
					const img = document.createElement('img');
					img.src = event.target.result;
					this.setFileClipboardS({
						_id: `${new Date().getTime()}_${Math.random()}`,
						name: file.name,
						src: event.target.result,
						type: 'image',
						blob: file,
						sizes: file.size,
					});
					const formData = new FormData();
					formData.append('avatar', file);
					//  const body = {
					//   _method: "POST",
					//   avatar: event.target.result,
					//  };
					const res = await api.categories.updateAvatar(
						this.currentID,
						formData
					);
					if (!res) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
						});
					}
					try {
						if (res.status > 199 && res.status < 399) {
							this.$store.commit('SET_SNACKBAR', {
								type: 'success',
								title: '',
								content: 'Cập nhật ảnh đại diện thành công',
							});
							this.setCateAvatar(event.target.result);
							this.$store.dispatch('categories/getListCategories');
						} else {
							this.setErrMsg(res.data.data.error || res.data.message);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: res.data.data.error || res.data.message,
							});
						}
					} catch (error) {
						console.log(error);
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
						});
					}
				};
				reader.readAsDataURL(file);
			},
			handleCancelRemoveTemplate() {
				this.setVisibleConfirmRemoveTemplate(false);
				this.$nextTick(() => {
					this.setRemoveTemplate({});
				});
			},
			handleClosePreviewTemplate() {
				this.setVisiblePreviewTemplate(false);
				this.$nextTick(() => {
					this.setPreviewTemplate({});
				});
			},
			async handleRemoveTemplate() {
				const file = { ...this.removeTemplate };
				this.loadingBtnRemoveTemp = true;
				const res = await api.template.delete(this.currentID, file.id);
				this.loadingBtnRemoveTemp = false;
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
				try {
					if (res.status > 199 && res.status < 399) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Xóa template thành công',
						});
						const arr = this.listTemplate.filter(o => o.id !== file.id);
						this.setListTemplate(arr);
						this.$store.dispatch('categories/getListCategories');
						this.handleCancelRemoveTemplate();
					} else {
						this.setErrMsg(res.data.data.error || res.data.message);
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					console.log(error);
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			},
			handleOpenAddMember() {
				this.setVisibleAddMember(true);
			},
			handleCloseAddMember() {
				this.setVisibleAddMember(false);
			},
			changeApprovalMember(_val: any[]) {
				this.handleCloseAddMember();
				this.setListApprovalMember(_val);
			},
			capitalizeFirstLetter(str: string) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			},
			returnName(_str: string) {
				console.log(_str);
				if (!_str) {
					return _str;
				}
				const result = tStr.removeAscentNormal(_str);
				const arrResult = result.split(' ');
				arrResult.forEach((o: string) => {
					o = this.capitalizeFirstLetter(o);
				});
				return String(arrResult.join(''))
					.replace(/[^\w\s]/gi, '')
					.replaceAll(' ', '_');
			},
			removeApprovalDefault(id: number) {
				this.setListApprovalMember(
					this.listApprovalMember.filter(o => o.id !== id)
				);
			},
			validSubmit() {
				return new Promise(resolve => {
					if (!this.cateName) {
						resolve('Không được để trống tên danh mục');
						return;
					}
					if (!this.cateDescription) {
						resolve('Không được để trống mục đích');
						return;
					}
					if (!this.department) {
						resolve('Không được để trống Phòng ban');
						return;
					}
					//  if (!this.listApprovalMember || !this.listApprovalMember.length) {
					//   resolve("Không được để trống người phê duyệt");
					//   return;
					//  }

					const rsFields = this.listFeildSelected.every(o => {
						return o.id && o.caption;
					});
					if (!rsFields) {
						resolve('Bạn chưa điền đầy đủ tên hoặc thông tin các trường');
						return;
					}
					resolve('');
				});
			},
			closeEditor() {
				this.ckKeyRef = false;
				this.setSelectedTemplate({});
				this.setVisibleEditor(false);
			},
			selectTemplateToEdit(data: Record<string, any>) {
				this.ckKeyRef = true;
				this.setSelectedTemplate(data);
				this.setVisibleEditor(true);
			},
			async onSubmit() {
				this.setErrMsg('');
				const isValid = await this.validSubmit();
				if (!isValid) {
					const fields = this.listFeildSelected.map(o => {
						let obj = {
							type_id: o.id,
							caption: o.caption,
							required: !!o.required,
							dynamic_attributes: {},
						};
						if (o.id === 3) {
							obj.dynamic_attributes = {
								choices: o.sendValue.map((k: any) => k.txt),
							};
						}
						if (o.id === 4) {
							obj.dynamic_attributes = {
								choices: o.sendValue.map((k: any) => k.txt),
							};
						}
						if (o.id === 10) {
							obj.dynamic_attributes = {
								columns: o.tableStatistic.map((k: any) => k.name),
							};
						}
						return obj;
					});
					const body = {
						name: this.cateName,
						note: this.cateNote,
						description: this.cateDescription,
						department_id: this.department,
						default_approver_ids: this.listApprovalMember.map(o => o.id),
						fields,
					};
					if (this.isEdit) {
						this.setLoadingSubmit(true);
						const res = await api.categories.update(this.currentID, body);
						this.setLoadingSubmit(false);
						if (!res) {
							return;
						}
						try {
							if (res.status > 199 && res.status < 399) {
								this.$store.commit('SET_SNACKBAR', {
									type: 'success',
									title: '',
									content: 'Cập nhật danh mục thành công',
								});
								this.$store.dispatch('categories/getListCategories');
							} else {
								this.setErrMsg(res.data.data.error || res.data.message);
								this.$store.commit('SET_SNACKBAR', {
									type: 'error',
									title: '',
									content: res.data.data.error || res.data.message,
								});
							}
						} catch (error) {
							console.log(error);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
							});
						}
					} else {
						this.setLoadingSubmit(true);
						const res = await api.categories.create(body);
						this.setLoadingSubmit(false);
						if (!res) {
							return;
						}
						try {
							if (res.status > 199 && res.status < 399) {
								this.$router.push(
									`/danh-muc/chinh-sua/${res.data.data.category.id}`
								);
								this.$store.commit('SET_SNACKBAR', {
									type: 'success',
									title: '',
									content: 'Tạo mới danh mục thành công.',
								});
								this.$store.dispatch('categories/getListCategories');
							} else {
								this.setErrMsg(res.data.data.error || res.data.message);
								this.$store.commit('SET_SNACKBAR', {
									type: 'error',
									title: '',
									content: res.data.data.error || res.data.message,
								});
							}
						} catch (error) {
							console.log(error);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
							});
						}
					}
				} else {
					this.setErrMsg(String(isValid));
				}
			},
			async submitEditor(_val: any) {
				const body = _val;
				console.log(_val);
				if (_val.id) {
					this.setLoadingSubmit(true);
					const res = await api.template.update(this.currentID, _val.id, body);
					this.setLoadingSubmit(false);
					if (!res) {
						return;
					}
					try {
						if (res.status > 199 && res.status < 399) {
							this.$store.commit('SET_SNACKBAR', {
								type: 'success',
								title: '',
								content: 'Cập nhật danh mục thành công',
							});
							this.getDetail();
							this.closeEditor();
						} else {
							this.setErrMsg(res.data.data.error || res.data.message);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: res.data.data.error || res.data.message,
							});
						}
					} catch (error) {
						console.log(error);
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
						});
					}
				} else {
					this.setLoadingSubmit(true);
					const res = await api.template.create(this.currentID, body);
					this.setLoadingSubmit(false);
					if (!res) {
						return;
					}
					try {
						if (res.status > 199 && res.status < 399) {
							this.$store.commit('SET_SNACKBAR', {
								type: 'success',
								title: '',
								content: 'Cập nhật danh mục thành công',
							});
							this.getDetail();
							this.closeEditor();
						} else {
							this.setErrMsg(res.data.data.error || res.data.message);
							this.$store.commit('SET_SNACKBAR', {
								type: 'error',
								title: '',
								content: res.data.data.error || res.data.message,
							});
						}
					} catch (error) {
						console.log(error);
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
						});
					}
				}
			},
		},
	});
</script>

<style lang="scss" scopped>
	@import '@/assets/style/_variables.scss';
	.select-add-ifm {
		.v-input__slot {
			margin-bottom: 0;
			height: 36px;
			fieldset {
				color: $borderColor !important;
				height: 36px;
				display: none;
			}
			.v-select__slot {
				height: 36px;
				border: 1px solid $borderColor;
				border-radius: 6px;
				padding-left: 10px;
				.v-select__selections {
					padding-top: 0;
					padding-bottom: 0;
					input {
						padding: unset;
					}
				}
			}
			.v-input__append-inner {
				margin-top: 4px;
			}
		}
		.v-text-field__details {
			display: none;
		}
	}
	.page-create-category {
		padding: 12px 0;
		background-color: $primaryWhite;
		max-width: 960px;

		border-radius: 6px;
		margin: auto;
		&__title {
			padding: 22px;
			border-bottom: 1px solid #dfe5ea;
		}
		&__body {
			max-height: calc(100vh - 200px);
			overflow-y: scroll;
			.field-info-wrapper {
				max-width: calc(100% - 60px);
				margin: auto;
			}
			&::-webkit-scrollbar {
				width: 5px;
				height: 10px;
			}

			&::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
				border-radius: 2px;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 2px;
				background: rgba(0, 0, 0, 0);
			}
			&:hover {
				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background: rgba(162, 161, 161, 0.604);
				}
			}
			&_name {
				.txt-field-name {
					.v-input__control .v-input__slot {
						&::before {
							border-color: $borderColor !important;
						}
					}
				}
				.v-label {
					font-size: 20px !important;
				}
				.theme--light.v-label {
					color: unset !important;
				}
			}
			&_pp {
				.v-text-field__details {
					display: none !important;
				}
			}
			.cate-file-label {
				color: $GPEblueText;
				display: flex;
				align-items: center;
				&:hover {
					text-decoration: underline;
				}
			}
		}
		.normal-input-outlined {
			border: solid 1px $borderColor;
			background-color: #fff;
			border-radius: 6px;
			display: block;
			width: 100%;
			padding: 9px 12px;
		}
		.border-normal {
			.v-input__slot {
				border: solid 1px $borderColor !important;
				border-color: $borderColor !important;
				&::before {
					display: none !important;
				}
				fieldset {
					border: solid 1px #dee5eb00 !important;
					border-color: #dee5eb00 !important;
				}
			}
		}
		.each-file-block {
			color: $GPEblueText;
			text-decoration: none;
			display: flex;
			align-items: center;
			&:hover {
				text-decoration: underline;
			}
		}
		.cate-icon-img {
			width: 50px;
			height: 50px;
			border-radius: 6px;
			object-position: center;
			object-fit: cover;
		}
		.list-user-selected {
			display: flex;
			align-items: flex-start;
			width: 100%;
			overflow-x: scroll;
			&::-webkit-scrollbar {
				width: 5px;
				height: 10px;
			}

			&::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
				border-radius: 2px;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 2px;
				background: rgba(0, 0, 0, 0);
			}
			&:hover {
				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background: rgba(162, 161, 161, 0.604);
				}
			}
			.add-member-btn {
				background: #fff;
				position: sticky;
				left: 0;
				z-index: 2;
				padding-right: 12px;
				height: 60px;
			}
			.list-user-avatar-v {
				position: relative;
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;
				width: 74px;
				.u-avatar {
					width: 36px;
					height: 36px;
					border-radius: 100%;
					object-fit: cover;
					object-position: center;
				}
				.u-full-name {
					white-space: nowrap;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.close-x {
					position: absolute;
					top: 0;
					right: 10px;
				}
			}
		}
		.btn-save-cate {
			box-shadow: none;
			border-radius: 8px;
			color: #006a9b !important;
			width: 100px;
			font-size: 14px;
			text-transform: uppercase;
			font-weight: bold;
			padding: 12px 0 !important;
			height: unset !important;
		}
		.btn-cancel {
			box-shadow: none;
			border-radius: 8px;
			color: #8194a5;
			width: 100px;
			font-size: 14px;
			text-transform: none;
			padding: 12px 0 !important;
			height: unset !important;
		}
	}
</style>
