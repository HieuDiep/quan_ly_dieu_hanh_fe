<template>
	<v-row justify="center" class="comma">
		<v-dialog v-model="isVisible" persistent max-width="1400">
			<v-card>
				<v-row class="m-0" style="flex-flow: row-reverse">
					<v-col cols="8">
						<div class="body-editor-wrapper">
							<div
								class="px-0 test-comma"
								:class="isA4 ? 'a4-page' : ''"
								id="edtor-wrapper_m"
							>
								<!-- <ckeditor-nuxt
       ref="myNxtEditor"
       v-model="content"
       :config="editorConfig"
      /> -->
								<ckeditor
									ref="myck4"
									id="myck4"
									v-model="editorData"
									:config="editorConfig"
									@namespaceloaded="onNamespaceLoaded"
								></ckeditor>
							</div>
						</div>
					</v-col>
					<v-col cols="4" class="d-flex flex-column justify-content-between">
						<div>
							<p class="dialog-title-m">Tài liệu mẫu</p>
							<div class="body-editor-wrapper">
								<div class="selection-config">
									<v-text-field
										v-model="name"
										label="Tên tài liệu mẫu"
									></v-text-field>
								</div>
							</div>
						</div>
						<div>
							<p class="mb-1 text-error text-center px-3">{{ errMsg }}</p>
							<v-card-actions class="justify-content-between">
								<v-btn color="#fff" class="btn-close" @click="handleClose">
									{{ 'Đóng' }}</v-btn
								>
								<v-btn
									color="#006a9b"
									class="btn-save"
									@click="onPreview"
									:loading="loadingBtnPreview"
									:disabled="loadingBtnPreview"
								>
									{{ 'Xem Trước' }}</v-btn
								>
								<v-btn color="#006a9b" class="btn-save" @click="handleSubmit">
									{{ 'Lưu' }}</v-btn
								>
							</v-card-actions>
						</div>
					</v-col>
				</v-row>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script lang="ts">
	import { defineComponent, ref } from '@vue/composition-api';
	import { tStr } from 'validation_t/src';
	import api from '@/services';
	import { useState } from 'vuex-composition-helpers/dist';
	import indenticon from '@/plugins/textindent/icons/textindent.png';
	import Vue from 'vue';
	import { mapState } from 'vuex';
	// import "@/plugins/textindent/plugin";
	export default defineComponent({
		components: {
			'ckeditor-nuxt': () => {
				return import('@blowstack/ckeditor-nuxt');
			},
		},
		props: {
			currentCateId: {
				type: Number,
				default: 1,
			},
			isVisible: {
				type: Boolean,
				default: false,
			},
			selectedTemplate: {
				type: Object,
				default() {
					return {};
				},
			},
			onClose: {
				type: Function,
			},
			onSubmit: {
				type: Function,
				default() {
					return {};
				},
			},
			handlePreview: {
				type: Function,
				default() {
					return {};
				},
			},
			listParam: {
				type: Object,
				default() {
					return {};
				},
			},
		},
		setup: (props: any, ctx: any) => {
			const { auth } = useState(['auth']);
			let content = '';
			const token = auth.value.token;
			const isA4 = ref<boolean>(true);
			const loadingBtnPreview = ref<boolean>(false);
			const name = ref<string>('');
			const currentCap = ref<string>('');
			const errMsg = ref<string>('');
			const selected = ref<any[]>([]);
			const editorConfig = {
				toolbar: {
					//  items: ["bold", "italic", "|", "undo", "redo", "-", "numberedList", "bulletedList"],

					shouldNotGroupWhenFull: true,
				},
				exportPdf: {},
				// pagination: {
				//  // A4
				//  pageWidth: "21cm",
				//  pageHeight: "29.7cm",

				//  pageMargins: {
				//   top: "20mm",
				//   bottom: "20mm",
				//   left: "12mm",
				//   right: "12mm",
				//  },
				// },
				removePlugins: [
					'Title',
					'CodeBlock',
					'Code',
					'MathType',
					'MediaEmbed',
					'PageBreak',
					'Subscript',
					'Superscript',
					'BlockQuote',
					'Strikethrough',
					'HorizontalLine',
					'Table',
					'FontBackgroundColor',
					'TodoList',
				],
				simpleUpload: {
					uploadUrl:
						process.env.BASE_URL + '/api/user/announcements/upload-image',
					headers: {
						Authorization: token,
					},
				},
			};
			const setIsA4 = (val: boolean) => {
				isA4.value = val;
			};
			const setName = (val: string) => {
				name.value = val;
			};

			return {
				auth,
				currentCap,
				name,
				content,
				selected,
				editorConfig,
				loadingBtnPreview,
				isA4,
				setIsA4,
				setName,
				errMsg,
			};
		},
		data() {
			return {
				editorData: '',
				editorConfig: {
					removePlugins: 'iframe,image',
					toolbarGroups: [
						{ name: 'styles' },
						{ name: 'colors' },
						{ name: 'basicstyles' },
						// { name: "document", groups: ["document", "doctools"] },

						// { name: "clipboard", groups: ["clipboard", "undo"] },
						{ name: 'forms' },

						{
							name: 'paragraph',
							groups: ['list', 'blocks', 'align', 'TextIndent', 'indent'],
						},
						{ name: 'tools', groups: ['table'] },
						{ name: 'insert', groups: ['PageBreak'] },
					],
					extraPlugins: [
						'pagebreak',
						'justify',
						'textindent',
						'indentblock',
						'timestamp',
					],
					indentation: '20px',
					indentationKey: 'tab',
				},
			};
		},
		watch: {
			isVisible() {
				this.errMsg = '';
				if (this.isVisible && this.currentCK4) {
					console.log('sz');
					this.onNamespaceLoaded(this.currentCK4);
				}
			},
			selected: {
				deep: true,
				handler() {
					const str = `<p class="${this.returnName(this.selected[0])}">${
						this.selected[0]
					}:{!${this.returnName(this.selected[0])}!}</p>`;
					this.content += str;
				},
			},
			selectedTemplate: {
				deep: true,
				handler() {
					if (this.selectedTemplate.id) {
						this.setName(this.selectedTemplate.name);
						this.editorData = this.selectedTemplate.html;
						// this.onNamespaceLoaded(Vue.CKEDITOR);
					}
				},
			},
		},
		mounted() {
			localStorage.setItem(
				'listParamComputed',
				JSON.stringify(this.listParamComputed)
			);

			if (this.isVisible && this.currentCK4) {
				// this.currentCK4.plugins.load('timestamp', function (plugins: any) {
				// 	alert(plugins['myplugin']); // object
				// });
				// this.currentCK4.replace('myck4');
				// this.onNamespaceLoaded(this.currentCK4);
				// this.currentCK4.replace('timestamp', {
				// 	icons: 'timestamp',
				// 	init: function (editor: any) {
				// 		editor.addCommand('insertTimestamp', {
				// 			exec: function (editor: any) {
				// 				var now = new Date();
				// 				editor.insertHtml(
				// 					'The current date and time is: <em>' +
				// 						now.toString() +
				// 						'</em>'
				// 				);
				// 			},
				// 		});
				// 		// editor.ui.addButton("Timestamp", {
				// 		//  label: "Insert Timestamp",
				// 		//  command: "insertTimestamp",
				// 		//  toolbar: "insert",
				// 		// });
				// 		let config = editor.config;
				// 		editor.ui.addRichCombo('my-combo', {
				// 			label: 'Danh sách trường',
				// 			title: 'Danh sách trường',
				// 			toolbar: 'insert',
				// 			panel: {
				// 				css: [this.currentCK4.skin.getPath('editor')].concat(
				// 					config.contentsCss
				// 				),
				// 				multiSelect: false,
				// 				attributes: { 'aria-label': 'Danh sách trường' },
				// 			},
				// 			init: function () {
				// 				this.startGroup('Danh sách các trường');
				// 				this.listParamComputed.forEach((o: any, idx: number) => {
				// 					this.add(`{!${o.name}!}`, `${o.caption}`);
				// 				});
				// 			},
				// 			onClick: function (value: any) {
				// 				editor.focus();
				// 				editor.fire('saveSnapshot');
				// 				editor.insertHtml(value);
				// 				editor.fire('saveSnapshot');
				// 			},
				// 		});
				// 	},
				// });
			}
		},
		computed: {
			...mapState({
				currentCK4: (state: any) => state.currentCK4,
			}),
			listParamComputed(): any {
				if (!this.listParam) {
					return [];
				}
				const listCaption = Object.values(this.listParam);
				const listName = Object.keys(this.listParam);
				const arr = listCaption.map((o: any, idx: number) => {
					return {
						caption: o,
						name: listName[idx],
					};
				});
				return arr;
			},
		},
		// mounted() {},
		methods: {
			test() {
				console.log(this.$refs.myNxtEditor);
				// console.log(this.$refs.myNxtEditor.editor);
			},
			async onPreview() {
				const body = {
					html: this.editorData,
				};
				this.loadingBtnPreview = true;
				const res = await api.template.preview(this.currentCateId, body);
				this.loadingBtnPreview = false;
				if (!res) {
					this.$store.commit('SET_SNACKBAR', {
						type: 'error',
						title: '',
						content: 'Lỗi hệ thống, liên hệ IT để được hỗ trợ.',
					});
					return;
				}
				try {
					if (res.status > 199 && res.status < 400) {
						const pv = res.data.data;
						this.handlePreview(pv);
					} else {
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
				console.log(res);
			},
			onEditorInput(e: any) {
				console.log(e);
			},
			onEditorFocus(e: any) {
				console.log(e);
			},
			onEditorReady() {
				const target = document.querySelector('#edtor-wrapper_m');
				if (target) {
					const toolbar = target.querySelector('.ck.ck-toolbar__items');
					console.log(toolbar);
				}
				alert('rd');
			},
			handleInsertCap() {
				if (!this.currentCap) {
					return;
				}
				const objResultCap = this.listParamComputed.filter(
					(o: any) => o.name === this.currentCap
				);
				if (!objResultCap || !objResultCap.length) {
					return;
				}
				const str = `{!${objResultCap[0].name}!}`;
				this.content += str;
			},
			capitalizeFirstLetter(str: string) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			},
			returnName(_str: string) {
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
			handleChangeField(e: Event, _val: any) {
				console.log(_val);
				if (e) {
					const str = `<p class="${this.returnName(_val.caption)}">${
						_val.caption
					}:{!${_val.name}!}</p>`;
					this.content += str;
				} else {
					const str = `<p>${_val.caption}:{!${_val.name}!}</p>`;

					this.content = this.content.replaceAll(str, '');
				}
			},
			handleSubmit() {
				this.errMsg = '';
				if (!this.name) {
					this.errMsg = 'Không được để trống tên tài liệu mẫu';
					return;
				}
				const obj = {
					name: this.name,
					html: this.editorData,
					id: 0,
				};
				if (this.selectedTemplate.id) {
					obj.id = this.selectedTemplate.id;
				}
				this.onSubmit(obj);
			},
			handleClose() {
				this.onClose();
			},
			onNamespaceLoaded(CKEDITOR: any) {
				// Add external `placeholder` plugin which will be available for each
				// editor instance on the page.
				this.$store.commit('SET_CURRENT_CK4', CKEDITOR);
				// const listParamComputed = this.listParamComputed;
				CKEDITOR.plugins.add('textindent', {
					icons: 'textindent',
					// availableLangs: { vi: 1 },
					// lang: "vi",
					init: function (editor: any) {
						var indentation = editor.config.indentation;
						var indentationKey = editor.config.indentationKey;

						if (typeof indentation == 'undefined') indentation = '20px';
						if (typeof indentationKey == 'undefined') indentationKey = 'tab';

						// if (editor.ui.addButton) {
						//   editor.ui.addButton("textindent", {
						//     label: "Ds",
						//     title: "Ds",
						//     icons: "textindent",
						//     command: "ident-paragraph",
						//     toolbar: "paragraph",
						//   });
						// }

						if (indentationKey !== false) {
							editor.on('key', function (ev: any) {
								if (
									ev.data.domEvent.$.key.toLowerCase() ===
										indentationKey.toLowerCase().trim() ||
									ev.data.keyCode === indentationKey
								) {
									editor.execCommand('ident-paragraph');
									ev.cancel();
								}
							});
						}

						editor.on('selectionChange', function () {
							var style_textindente = new CKEDITOR.style({
								element: 'p',
								styles: { 'text-indent': indentation },
								overrides: [
									{
										element: 'text-indent',
										attributes: { size: '0' },
									},
								],
							});

							if (style_textindente.checkActive(editor.elementPath(), editor))
								editor
									.getCommand('ident-paragraph')
									.setState(CKEDITOR.TRISTATE_ON);
							else
								editor
									.getCommand('ident-paragraph')
									.setState(CKEDITOR.TRISTATE_OFF);
						});

						editor.addCommand('ident-paragraph', {
							allowedContent: 'p{text-indent}',
							requiredContent: 'p',
							exec: function (evt: any) {
								var range = editor.getSelection().getRanges()[0];

								var walker = new CKEDITOR.dom.walker(range),
									node;

								var state = editor.getCommand('ident-paragraph').state;

								while ((node = walker.next())) {
									if (node.type == CKEDITOR.NODE_ELEMENT) {
										if (node.getName() === 'p') {
											editor.fire('saveSnapshot');
											if (state == CKEDITOR.TRISTATE_ON) {
												node.removeStyle('text-indent');
												editor
													.getCommand('ident-paragraph')
													.setState(CKEDITOR.TRISTATE_OFF);
											} else {
												node.setStyle('text-indent', indentation);
												editor
													.getCommand('ident-paragraph')
													.setState(CKEDITOR.TRISTATE_ON);
											}
										}
									}
								}

								if (node === null) {
									node = editor
										.getSelection()
										.getStartElement()
										.getAscendant('p', true);

									editor.fire('saveSnapshot');

									if (state == CKEDITOR.TRISTATE_ON) {
										node.removeStyle('text-indent');
										editor
											.getCommand('ident-paragraph')
											.setState(CKEDITOR.TRISTATE_OFF);
									} else {
										node.setStyle('text-indent', indentation);
										editor
											.getCommand('ident-paragraph')
											.setState(CKEDITOR.TRISTATE_ON);
									}
								}
							},
						});
					},
				});

				CKEDITOR.plugins.add('timestamp', {
					icons: 'timestamp',
					init: function (editor: any) {
						editor.addCommand('insertTimestamp', {
							exec: function (editor: any) {
								var now = new Date();
								editor.insertHtml(
									'The current date and time is: <em>' +
										now.toString() +
										'</em>'
								);
							},
						});
						// editor.ui.addButton("Timestamp", {
						//  label: "Insert Timestamp",
						//  command: "insertTimestamp",
						//  toolbar: "insert",
						// });
						let config = editor.config;
						editor.ui.addRichCombo('my-combo', {
							label: 'Danh sách trường',
							title: 'Danh sách trường',
							className: 'list-params',
							toolbar: 'insert',
							panel: {
								css: [CKEDITOR.skin.getPath('editor')].concat(
									config.contentsCss
								),
								multiSelect: false,
								attributes: { 'aria-label': 'Danh sách trường' },
							},

							init: function () {
								const localListParamComputed =
									localStorage.getItem('listParamComputed');
								if (localListParamComputed) {
									const newList = JSON.parse(localListParamComputed);
									this.startGroup('Danh sách các trường');
									newList.forEach((o: any, idx: number) => {
										this.add(`{!${o.name}!}`, `${o.caption}`);
									});
								}
							},

							onClick: function (value: any) {
								editor.focus();
								editor.fire('saveSnapshot');

								editor.insertHtml(value);

								editor.fire('saveSnapshot');
							},
						});
					},
				});
			},
		},
	});
</script>

<style lang="scss" scopped>
	.body-editor-wrapper {
		padding: 0px 20px 20px 20px;

		.test-comma {
			.ck.ck-editor {
				.ck.ck-toolbar {
					border: unset !important;
					border-bottom: 1px solid rgba(214, 216, 216, 0.385);
					box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
						rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
				}
				box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
					rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
				border-radius: 6px;
				overflow: hidden;
				.ck.ck-editor__main {
					background: rgba(214, 216, 216, 0.385);
					padding: 30px 40px;
					height: calc(100vh - 420px);
					overflow-y: scroll;
					.ck.ck-focused {
						border: unset !important;
						box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
							rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
					}
					.ck.ck-content {
						min-height: 800px;
						border: unset !important;
						box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
							rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
						p {
							margin-bottom: 2px !important;
						}
					}
				}
			}
		}

		.a4-page {
			.cke_chrome.cke_browser_webkit {
				display: block;
				margin: auto;
				width: 21cm !important;
				/* height: 600px; */
				border: unset !important;
				box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
					rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
				.cke_contents {
					height: 600px !important;

					/* overflow-y: scroll; */
				}
			}
		}
	}
	.btn-save {
		box-shadow: none;
		border-radius: 8px;
		color: #fff !important;
		min-width: 100px;
		font-size: 14px;
		text-transform: none;

		padding: 12px 16px !important;
		height: unset !important;
	}
	.btn-close {
		box-shadow: none;
		border-radius: 8px;
		color: rgb(87, 87, 87) !important;
		width: 100px;
		font-size: 14px;
		text-transform: none;

		padding: 12px 0 !important;
		height: unset !important;
	}
	.btn-add {
		box-shadow: none;
		border-radius: 8px;
		color: #fff !important;
		height: 48px !important;
		width: 100px;
		font-size: 14px;
		text-transform: none;
		padding: 12px 0 !important;
	}
	.list-provided-param {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		.v-input__control {
			.v-input__slot {
				margin-bottom: 0 !important;
				box-shadow: unset !important;
				border: 1px solid #dee5eb;
			}
			.v-text-field__details {
				display: none;
			}
		}
	}
	.dialog-title-m {
		padding: 20px 20px 0 20px;
		font-weight: bold;
		font-size: 20px;
		margin-bottom: 0 !important;
	}
	.cke_combopanel.cke_combopanel__my-combo {
		width: 250px !important;
	}
</style>
