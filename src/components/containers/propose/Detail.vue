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
						Mã số
						{{ currentData.code || currentData.id }}
					</p>
					<div class="d-flex align-items-center propose-tab py-2">
						<div
							class="trash"
							v-if="currentData.status && currentData.status.id === 1"
						>
							Nháp
						</div>
						<div
							class="sent"
							v-if="currentData.status && currentData.status.id === 2"
						>
							Đã gửi
						</div>
						<div
							class="approved"
							v-if="currentData.status && currentData.status.id === 3"
						>
							Đã phê duyệt
						</div>
						<div
							class="no-approve"
							v-if="currentData.status && currentData.status.id === 4"
						>
							Không phê duyệt
						</div>
						<div
							class="cancel"
							v-if="currentData.status && currentData.status.id === 5"
						>
							Hủy
						</div>
					</div>
				</div>
				<div>
					<v-btn
						v-if="currentDataComputed && currentDataComputed.id"
						color="#fff"
						class="
							btn-approve
							text-uppercase
							font-size-14
							text-primary-color
							px-3
							mr-4
							font-weight-bold
						"
						@click="handleCopy(currentDataComputed)"
					>
						{{ 'Sao chép' }}</v-btn
					>
					<v-btn
						v-if="
							currentDataComputed.status && currentDataComputed.status.id === 1
						"
						color="#fff"
						class="
							btn-approve
							text-uppercase
							font-size-14
							text-primary-color
							px-3
							mr-4
							font-weight-bold
						"
						:loading="loadingBtn || loadingBtnDecline"
						:disabled="loadingBtn"
						@click="onSendItem(currentDataComputed)"
					>
						{{ 'Gửi' }}</v-btn
					>
					<!-- <v-btn
      v-if="currentDataComputed.status && currentDataComputed.status.id === 2"
      color="#fff"
      class="
       btn-approve
       text-uppercase
       font-size-14
       text-primary-color
       px-3
       mr-4
       font-weight-bold
      "
      :loading="loadingBtn || loadingBtnDecline"
      :disabled="loadingBtn"
     >
      {{ "Đã Gửi" }}</v-btn
     >
     <v-btn
      v-if="currentDataComputed.status && currentDataComputed.status.id === 3"
      color="#fff"
      class="
       btn-approve
       pointer
       text-uppercase
       font-size-14
       text-primary-color
       px-3
       mr-4
       font-weight-bold
      "
     >
      {{ "Đã Duyệt" }}</v-btn
     >
     <v-btn
      v-if="currentDataComputed.status && currentDataComputed.status.id === 4"
      color="#fff"
      class="
       btn-decline
       pointer
       text-uppercase
       font-size-14
       text-primary-color
       px-3
       font-weight-bold
      "
      :disabled="loadingBtn"
     >
      {{ "Đã từ chối" }}</v-btn
     > -->
				</div>
			</div>
			<div class="drafts-left col-xxl-7">
				<div class="drafts-top px-5 bd-bottom">
					<p class="font-weight-bold mb-0">Tài liệu cần ký</p>
					<div>
						<p
							v-for="ibm in currentDataComputed.templates"
							:key="ibm.id"
							class="
								text-primary-color
								mb-1
								pointer
								d-flex
								align-items-center
								justify-content-between
							"
							@click="handleOpenSignTemplate(ibm)"
						>
							<span class="text-decoration-underline">{{ ibm.name }}</span>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon
										color="primary"
										dark
										v-bind="attrs"
										v-on="on"
										@click.stop="onPrint(ibm)"
									>
										mdi-printer-outline
									</v-icon>
								</template>
								<span>In tài liệu</span>
							</v-tooltip>
						</p>
						<p
							v-if="
								!currentDataComputed.templates ||
								!currentDataComputed.templates.length
							"
							class="mb-0"
						>
							Không có
						</p>
					</div>
				</div>
				<div class="drafts-bottom px-5">
					<table class="w-100">
						<tr>
							<th width="60%" class="text-left">
								<span class="field-caption font-weight-bold"
									>Danh mục Phê duyệt</span
								>
							</th>
							<th width="40%" class="text-left">
								<span class="field-caption font-weight-bold">Mã số</span>
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
									>{{
										currentDataComputed.category
											? currentDataComputed.category.name
											: '-'
									}}</span
								>
							</td>
							<td>
								<input
									class="style-input input-f w-100 bg-disable"
									type="text"
									:value="currentDataComputed.code || currentDataComputed.id"
									readonly
								/>
							</td>
						</tr>
						<tr>
							<td class="text-left">
								<span class="field-caption font-weight-bold"
									>Người đề xuất</span
								>
							</td>
							<td class="text-left">
								<!-- <span class="field-caption font-weight-bold">Ngày</span> -->
							</td>
						</tr>
						<tr>
							<td>
								<div class="cpn-list-item display-flex align-center">
									<v-avatar size="30">
										<img
											:src="
												currentDataComputed.creator
													? currentDataComputed.creator.avatar
													: '@/assets/logo.png'
											"
											alt="Avatar"
											class="avatar-create-user"
										/>
									</v-avatar>
									<div class="pl-3">
										<p class="font-weight-bold font-size-14 mb-0">
											{{
												currentDataComputed.creator
													? currentDataComputed.creator.full_name
													: '-'
											}}
										</p>
									</div>
								</div>
							</td>
							<td>
								<!-- <input class="style-input w-100" type="date" /> -->
							</td>
						</tr>
					</table>
					<div
						v-if="
							currentDataComputed.category && currentDataComputed.category.note
						"
						class="mt-4"
					>
						<p class="field-caption mb-1 font-weight-bold">Ghi chú</p>
						<p
							class="field-values"
							v-html="currentDataComputed.category.note"
						></p>
					</div>
					<div class="mt-4">
						<p class="field-caption mb-1 font-weight-bold">Nội dung</p>
						<input
							class="style-input w-100 dsb-btn"
							type="text"
							readonly
							:value="currentDataComputed.name"
						/>
					</div>
					<!-- <div class="mt-3">
      <p class="mb-1 font-weight-bold">Mô tả</p>
      <div class="propose-ck-edittor">
       <textarea
        class="style-input w-100 py-3"
        name=""
        id=""
        rows="4"
        readonly
        :value="currentDataComputed.description"
       ></textarea>
      </div>
     </div> -->
					<div class="mt-4">
						<!-- <p class="mb-1 font-weight-bold">Các trường thông tin</p> -->
						<div class="group-field">
							<div
								v-for="field in currentDataComputed.fields"
								:key="field.id"
								class="each-field-in-gr--detail"
							>
								<p class="field-caption font-weight-bold">
									{{ field.caption }}
								</p>

								<!-- TEXT NGẮN -->
								<template v-if="field.type && field.type.id === 1">
									<!-- <v-text-field
          readonly
          placeholder="Văn bản câu trả lời ngắn "
          v-model="field.values"
         ></v-text-field> -->
									<p class="field-values" v-html="field.values"></p>
								</template>

								<!-- TEXT DÀI -->
								<template v-if="field.type && field.type.id === 2">
									<!-- <v-textarea
          readonly
          auto-grow
          v-model="field.values"
          placeholder="Văn bản câu trả lời dài"
          rows="3"
          row-height="20"
         ></v-textarea> -->
									<p class="field-values" v-html="field.values"></p>
								</template>
								<!-- TRẮC NGHIỆM 1 -->
								<template v-if="field.type && field.type.id === 3">
									<div class="">
										<!-- <v-radio-group v-model="field.values">
                      <v-radio
                        readonly
                        v-for="vl in field.dynamic_attributes.choices"
                        :key="vl"
                        :label="vl"
                        :value="vl"
                      ></v-radio>
                    </v-radio-group> -->
										<p class="field-values" v-html="field.values"></p>
									</div>
								</template>
								<!-- TRẮC NGHIỆM NHIỀU -->
								<template v-if="field.type && field.type.id === 4">
									<div class="">
										<!-- <p
                      v-for="vl in field.dynamic_attributes.choices"
                      :key="`single-${vl}`"
                      class="
                        option-feild
                        d-flex
                        align-items-center
                        multi-checkbox
                      "
                    >
                      <v-icon class="mr-2 font-size-20 pointer"
                        >mdi-square-outline</v-icon
                      >
                      <input
                        type="text"
                        :placeholder="`Tùy chọn ${idx + 1}`"
                        :value="vl"
                        readonly
                        name=""
                        class="d-block multi-opt"
                      />
                      <v-checkbox
                        v-model="field.values"
                        :key="vl"
                        :label="vl"
                        :value="vl"
                      ></v-checkbox>
                    </p> -->
										<p class="field-values" v-html="field.values[0]"></p>
									</div>
								</template>
								<!-- NGÀY -->
								<template v-if="field.type && field.type.id === 5">
									<!-- <v-text-field
          readonly
          placeholder="Văn bản câu trả lời ngắn "
          v-model="field.values"
          class="v-text-field-font-size-14"
         ></v-text-field> -->
									<p class="field-values" v-html="field.values"></p>
								</template>
								<!-- GIỜ -->
								<template v-if="field.type && field.type.id === 6">
									<!-- <div class="field-picker-date">
          <v-text-field
           readonly
           placeholder="-- : --"
           v-model="field.values"
           class="v-text-field-font-size-14"
          ></v-text-field>
         </div> -->
									<p class="field-values" v-html="field.values || '---'"></p>
								</template>
								<!-- NGÀY VÀ GIỜ -->
								<template v-if="field.type && field.type.id === 7">
									<p class="field-values" v-html="field.values || '---'"></p>
								</template>
								<!-- NGÀY ĐẾN NGÀY -->
								<template v-if="field.type && field.type.id === 8">
									<div class="field-picker-date d-flex align-items-center mb-2">
										<p class="mb-0 pr-3 date-time-label font-size-14 wf-60">
											Từ:
										</p>

										<p
											class="field-values mb-0"
											v-html="field.values ? field.values[0] : ''"
										></p>
									</div>
									<div class="field-picker-date">
										<div class="field-picker-date d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label font-size-14 wf-60">
												Đến:
											</p>
											<p
												class="field-values mb-0"
												v-html="field.values ? field.values[1] : ''"
											></p>
										</div>
									</div>
								</template>
								<!-- GIỜ ĐẾN GIỜ -->
								<template v-if="field.type && field.type.id === 9">
									<div class="field-picker-date">
										<div class="d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label font-size-14 wf-60">
												Từ:
											</p>
											<div class="time-picker-m">
												<input
													type="text"
													class="font-size-14"
													:value="field.values ? field.values[0] : ''"
													readonly
												/>
											</div>
										</div>
									</div>
									<div class="field-picker-date">
										<div class="d-flex align-items-center">
											<p class="mb-0 pr-3 date-time-label font-size-14 wf-60">
												Đến:
											</p>
											<div class="time-picker-m">
												<input
													type="text"
													class="font-size-14"
													:value="field.values ? field.values[1] : ''"
													readonly
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
													v-for="(col, idx) in field.dynamic_attributes.columns"
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
											<tr v-for="(col, idx) in field.values" :key="col + idx">
												<td v-for="(row, idxe) in col" :key="row + idxe">
													<input
														type="text"
														:value="row"
														class="input-trt"
														placeholder="Giá trị"
														readonly
													/>
												</td>
											</tr>
										</tbody>
									</table>
									<div></div>
								</template>

								<template v-if="field.type && field.type.id === 11">
									<p
										class="field-values"
										v-html="
											field.values
												? `${field.values.full_name} - ${field.values.asgl_id} - ${field.values.department} - ${field.values.position}`
												: ``
										"
									></p>
								</template>
								<!-- FT -->
								<!-- <div
         class="display-flex align-items-center req-gr-wr justify-content-end"
        >
         <span for="" class="mr-2 font-size-14 d-block mb-0">Bắt buộc</span>
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
					<div class="mt-4">
						<p class="mb-0 font-weight-bold">File đính kèm</p>
						<!-- <div>
       <p class="display-flex align-center pointer">
        <img
         src="@/assets/images/icon-pdf.svg"
         class="mr-2"
         height="20"
         alt=""
        />
        <span class="text-primary-color"
         >Thông báo số 52/2021/TB-ASGL… ngày19/04/2021</span
        >
       </p>
      </div> -->
						<p class="mb-0">Không có</p>
					</div>
					<p class="mb-0 font-weight-bold mt-4">Người phê duyệt</p>
					<v-data-table
						v-if="currentData.status && currentData.status.id === 1"
						:headers="headersBeforeApprove"
						:items="currentDataComputed.approvers"
						:items-per-page="1000"
						class="box-shadow-unset table-approver"
						hide-default-footer
					>
						<template v-slot:item.full_name="{ item }">
							<span class="text-no-wrap">{{ item.full_name }}</span>
						</template>
					</v-data-table>
					<v-data-table
						v-if="currentData.status && currentData.status.id !== 1"
						:headers="headers"
						:items="currentDataComputed.approvers"
						:items-per-page="1000"
						class="box-shadow-unset table-approver"
						hide-default-footer
					>
						<template v-slot:item.full_name="{ item }">
							<span class="text-no-wrap">{{ item.full_name }}</span>
						</template>
					</v-data-table>
					<!-- <v-icon class="text-primary-color pointer"> mdi-plus-circle </v-icon> -->
				</div>
			</div>
			<div class="drafts-right col-xxl-5 px-0">
				<DraftTabApproval
					v-if="
						currentDataComputed &&
						currentDataComputed.status &&
						currentDataComputed.status.id !== 1
					"
				/>
			</div>
		</div>

		<DialogApproval
			:is-visible="isVisible"
			:left-doc="leftDoc"
			:click-on-doc="clickOnDoc"
			@handlerCancel="handlerDialogCancel"
			@handlerSubmit="handlerDialogSubmit"
		/>
		<DialogShowTemplate
			:is-visible="isVisibleTemplate"
			:inner-content="innerContentTemplate"
			:handler-sign="handlerSign"
			:loading-btn="loadingBtnSign"
			:read-only="true"
			:on-print="onPrint"
			@handlerCancel="handlerDialogTemplateCancel"
			@handlerSubmit="handlerDialogSubmit"
		/>

		<ConfirmSendPP
			:is-visible="visibleConfirmSend"
			:handlerCancel="closeSendDialog"
			:handlerConfirm="onSendPP"
			:selected-data="selectedDataToSend"
		/>
	</div>
</template>

<script>
	import { ref, defineComponent } from '@vue/composition-api';
	import { useState } from 'vuex-composition-helpers/dist';
	import api from '@/services';
	import {
		DraftTab,
		UploadFile,
		DialogPropose,
	} from '@/components/Layout/page-view/propose';
	import {
		DialogApproval,
		DraftTabApproval,
		DialogShowTemplate,
	} from '@/components/Layout/page-view/approval';
	import ConfirmSendPP from '@/components/popup/ConfirmSendPP.vue';
	export default defineComponent({
		components: {
			DraftTab,
			DraftTabApproval,
			UploadFile,
			DialogPropose,
			DialogApproval,
			DialogShowTemplate,
			ConfirmSendPP,
			'ckeditor-nuxt': () => {
				return import('@blowstack/ckeditor-nuxt');
			},
		},
		props: {
			currentData: {
				type: Object,
			},
			listTemplate: {
				type: Object,
			},
			getCurrentData: {
				type: Function,
			},
		},
		setup: (props, ctx) => {
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
					text: '',
					align: 'start',
					value: 'action',
				},
			];
			const headersBeforeApprove = [
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
					text: '',
					align: 'start',
					value: 'action',
				},
			];
			const isVisible = ref(false);
			const isVisibleTemplate = ref(false);
			const loadingBtn = ref(false);
			const loadingBtnDecline = ref(false);
			const loadingBtnSign = ref(false);
			const visibleConfirmSend = ref(false);

			const selectedDataToSend = ref({});
			const innerContentTemplate = ref({});
			const setIsVisible = value => {
				isVisible.value = value;
			};
			const setLoadingBtnSign = value => {
				loadingBtnSign.value = value;
			};

			const setVisibleConfirmSend = payload => {
				visibleConfirmSend.value = payload;
			};
			const setLoadingBtnDecline = value => {
				loadingBtnDecline.value = value;
			};
			const setLoadingBtn = value => {
				loadingBtn.value = value;
			};
			const setInnerContentTemplate = value => {
				innerContentTemplate.value = value;
			};
			const setIsVisibleTemplate = value => {
				isVisibleTemplate.value = value;
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
			let desserts = ref([
				{
					name: 1,
				},
				{
					name: 1,
				},
			]);
			const changeFileUpload = file => {
				console.log(file);
			};
			const removeItem = items => {
				console.log(items);
			};
			return {
				headers,
				headersBeforeApprove,
				tab,
				desserts,
				isVisible,
				loadingBtn,
				content,
				isVisibleTemplate,
				visibleConfirmSend,
				innerContentTemplate,
				selectedDataToSend,
				loadingBtnDecline,
				loadingBtnSign,
				editorConfig,
				changeFileUpload,
				setIsVisible,
				removeItem,
				setIsVisibleTemplate,
				setInnerContentTemplate,
				setLoadingBtnSign,
				setLoadingBtn,
				setLoadingBtnDecline,
				setVisibleConfirmSend,
			};
		},
		computed: {
			currentDataComputed() {
				const obj = { ...this.currentData };
				if (obj.approvers) {
					obj.approvers.forEach(o => {
						let str = '';
						o.positions.forEach(k => {
							str += k.name + '. ';
						});

						o.roleTxt = str;
						o.status = '-';
					});
				}

				return { ...obj };
			},
			leftDoc() {
				if (this.currentDataComputed) {
					return [];
				}
				return this.currentDataComputed.templates
					? this.currentDataComputed.templates.filter(o => !o.sign_at)
					: [];
			},
		},
		methods: {
			handlerDialogCancel() {
				this.setIsVisible(false);
			},
			handlerDialogSubmit(value) {
				console.log(value);
			},
			handlerDialogTemplateCancel() {
				this.setIsVisibleTemplate(false);
			},
			handleOpenSignTemplate(ibm) {
				this.setIsVisibleTemplate(true);
				this.setInnerContentTemplate(ibm);
			},
			clickOnDoc(ibm) {
				this.isVisible = false;
				this.setIsVisibleTemplate(true);
				this.setInnerContentTemplate(ibm);
			},
			async handlerSign() {
				this.setLoadingBtnSign(true);
				const _id = this.innerContentTemplate.id;
				const requestId = this.$route.params.id;
				const res = await api.template.sign(_id, requestId);
				this.setLoadingBtnSign(false);
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Ký tài liệu mẫu thành công',
						});
						await this.getCurrentData();
						this.handlerDialogTemplateCancel();
					} else {
						// messageErr.value = res.data.data.error || res.data.message;
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					//  messageErr.value = error;
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			},
			async handleApprove() {
				if (!this.currentDataComputed) {
					return;
				}

				if (this.leftDoc.length) {
					this.isVisible = true;
					return;
				}
				this.setLoadingBtn(true);
				const id = this.currentDataComputed.id;
				this.setLoadingBtn(false);
				const res = await api.approval.approve(id);
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Phê duyệt thành công',
						});
						await this.getCurrentData();
					} else {
						// messageErr.value = res.data.data.error || res.data.message;
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					//  messageErr.value = error;
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			},
			async handleDecline() {
				this.setLoadingBtnDecline(true);
				const id = this.currentDataComputed.id;
				this.setLoadingBtnDecline(false);
				const res = await api.approval.decline(id);
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Từ chối thành công',
						});
						await this.getCurrentData();
					} else {
						// messageErr.value = res.data.data.error || res.data.message;
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
				} catch (error) {
					//  messageErr.value = error;
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			},
			onSendItem(item) {
				this.setVisibleConfirmSend(true);
				this.selectedDataToSend = { ...item };
			},
			closeSendDialog() {
				this.setVisibleConfirmSend(false);
				this.selectedDataToSend = {};
			},
			async onSendPP() {
				const id = this.selectedDataToSend ? this.selectedDataToSend.id : 0;
				const payload = {
					inlcude: 'fields,approvers,followers',
				};
				const res = await api.propose.send(`${id}`, payload);
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Gửi đề xuất thất bại',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 399) {
						this.$store.commit('SET_SNACKBAR', {
							type: 'success',
							title: '',
							content: 'Gửi đề xuất thành công',
						});
						this.closeSendDialog();
					} else {
						this.$store.commit('SET_SNACKBAR', {
							type: 'error',
							title: '',
							content: res.data.data.error || res.data.message,
						});
					}
					this.getCurrentData();
				} catch (error) {
					console.log(error);
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
				}
			},
			handleCopy(item) {
				this.$router.push(`/de-xuat/sao-chep/${item.id}`);
			},
			getPosTxt(user) {
				let str = '';
				console.log(user);
				user.positions.forEach(k => {
					str += k.name + '. ';
				});

				return str;
			},
			onPrint(data) {
				const currentId = this.$route.params.id;
				window.open(`/tai-lieu/in/${data.id}?c=${currentId}`);
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
			border-top: 1px solid $borderColor;
		}
		.trash {
			color: $txtPrimaryBlack;
			background-color: $backgroundCategory;
			height: 32px;
			font-weight: 400;
			padding-top: 7px;
			padding-left: 8px;
			padding-right: 8px;
			font-size: 14px;
			border-radius: 4px;
			max-width: 100%;
		}
		.sent {
			color: $GPEblueText;
			background-color: $backgroundstronggreen;
			height: 32px;
			font-weight: 400;
			padding-top: 7px;
			padding-left: 8px;
			padding-right: 8px;
			font-size: 14px;
			border-radius: 4px;
			max-width: 100%;
		}
		.approved {
			color: $GPEstronggreen;
			background-color: $backgroundlightgreen;
			height: 32px;
			font-weight: 400;
			padding-top: 7px;
			padding-left: 8px;
			padding-right: 8px;
			font-size: 14px;
			border-radius: 4px;
			max-width: 100%;
		}
		.no-approve {
			color: $dangerColor;
			background-color: $backgroundlightdanger;
			height: 32px;
			font-weight: 400;
			padding-top: 7px;
			padding-left: 8px;
			padding-right: 8px;
			font-size: 14px;
			border-radius: 4px;
			max-width: 100%;
		}
		.cancel {
			color: $GPEcancel;
			background-color: $backgroundcancel;
			height: 32px;
			font-weight: 400;
			padding-top: 7px;
			padding-left: 8px;
			padding-right: 8px;
			font-size: 14px;
			border-radius: 4px;
			max-width: 100%;
		}
	}
	.style-input {
		border: 1px solid $borderColor;
		border-radius: 6px;
		height: 36px;
		padding: 0 8px;
		font-size: 14px;
	}
	textarea.style-input {
		height: auto !important;
	}
</style>
<style lang="scss">
	@import '@/assets/style/_variables.scss';
	.drafts-bottom {
		.table-approver {
			table tr {
				th > * {
					font-size: 14px !important;
					color: $textColorBlur;
					font-weight: normal;
				}
				td > * {
					font-size: 14px !important;
					color: $primaryBlack;
					font-weight: normal;
				}
				th,
				td {
					height: 36px !important;
				}
			}
		}
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
	.btn-approve {
		box-shadow: none;
		border-radius: 8px;
		color: #006a9b !important;
		min-width: 100px;
		font-size: 14px;
		text-transform: none;

		padding: 12px 0 !important;
		height: unset !important;
	}
	.btn-decline {
		box-shadow: none;
		border-radius: 8px;
		color: #8194a5 !important;
		min-width: 100px;
		font-size: 14px;
		text-transform: none;
		padding: 12px 0 !important;
		height: unset !important;
	}
	.v-text-field-font-size-14 {
		input {
			font-size: 14px !important;
		}
	}
	.field-caption {
		margin-bottom: 0px !important;
	}
	.each-field-in-gr--detail {
		margin-bottom: 16px;
		.field-values {
			font-size: 14px !important;
		}
		.wf-60 {
			width: 40px;
		}
	}
	.dsb-btn {
		background-color: #f6f6f6;
	}
</style>
