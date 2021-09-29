<template>
	<v-dialog v-model="isVisible" persistent max-width="684">
		<v-card class="dialog-decline-detail">
			<div class="close-btn" @click="btnCancelClick">
				<img src="@/assets/images/x-arrow3x.png" width="100%" />
			</div>
			<h3 class="titleHeader">Không phê duyệt</h3>
			<v-card-text>
				<div class="content-title">
					Bạn không phê duyệt
					<div class="content-title-highlight">đề xuất số {{ currentId }}</div>
					. Vui lòng điền lý do không phê duyệt
				</div>
				<br />
				<p class="reason">Lý do:</p>
				<textarea
					class="input-box px-3 py-2"
					:class="isActive ? 'border-red' : ''"
					v-model="formData.reason"
				></textarea>
				<div v-if="isActive" class="error-msg">Không được để trống lý do</div>
			</v-card-text>
			<div class="footer">
				<button
					class="button button-primary button-submit"
					@click="btnSubmitClick"
					:disabled="loadingBtn"
					:loading="loadingBtn"
				>
					Xác nhận
				</button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
	import api from '@/services';
	export default defineComponent({
		components: {},
		props: {
			isVisible: {
				type: Boolean,
				default: false,
			},
			currentId: {
				type: Number,
				default: 0,
			},
			loadingBtn: {
				type: Boolean,
				default: false,
			},
			handlerCancel: {
				type: Function,
			},
			handlerSubmit: {
				type: Function,
			},
			leftDoc: {
				type: Array,
				default() {
					return [];
				},
			},
			clickOnDoc: {
				type: Function,
			},
		},
		setup: (props, ctx) => {
			let formData = ref<Record<string, any>>({});
			const isActive = ref<boolean>(false);
			const changeFileUpload = (file: any) => {
				console.log(file);
			};
			const btnCancelClick = () => {
				isActive.value = false;
				ctx.emit('handlerCancel');
			};
			const btnSubmitClick = () => {
				if (!formData.value.reason) {
					isActive.value = true;
					return;
				}
				ctx.emit('handlerSubmit', formData.value);
				isActive.value = false;
				ctx.emit('handlerCancel');
			};
			return {
				btnCancelClick,
				btnSubmitClick,
				isActive,
				changeFileUpload,
				formData,
			};
		},
		methods: {},
		watch: {},
	});
</script>

<style lang="scss">
	@import '@/assets/style/_variables.scss';
	.v-dialog .dialog-decline-detail {
		border-radius: 14px;
		padding: 35px 0 0 0px;
		& > .v-card__title {
			padding-top: 0 !important;
			padding-bottom: 30px !important;
			font-size: 32px !important;
			color: $primaryBlack;
			font-weight: 700 !important;
		}
		& > .v-card__text {
			padding: 0 28px 20px !important;
		}
		.close-btn {
			cursor: pointer;
			position: absolute;
			top: 16px;
			right: 28px;
			font-size: 22px;
			text-align: center;
			color: #959ca7;
			width: 36px;
			height: 36px;
			span {
				font-size: 17px;
				color: #8194a5;
			}
		}
		.titleHeader {
			height: 55px;
			line-height: 55px;
			font-size: 14px;
			margin-left: 28px;
			color: #8194a5;
			margin-top: -32px;
			font-weight: bold;
			margin-bottom: 29px;
		}
		.content-title {
			display: flex;
			color: #223140;
			font-size: 14px;
			font-weight: 400;
			.content-title-highlight {
				margin-left: 4px;
				color: #223140;
				font-size: 14px;
				font-weight: 500;
			}
		}
		.reason {
			color: #223140;
			font-size: 16px;
			font-weight: bold;
		}
		.error-msg {
			color: #ff0000;
		}
		.input-box {
			border: 1px solid #dee5eb;
			border-radius: 4px;
			width: 100%;
			height: 199px;
		}
		.border-red {
			border: 1px solid #ff0000;
		}
		.footer {
			background-color: #f2f4f6;
			width: 100%;
			padding: 1rem 0;
			display: flex;
			justify-content: flex-end;
			.button-submit {
				margin-right: 24px;
				width: 144px;
				text-transform: uppercase;
				font-size: 14px;
				font-weight: bold;
			}
		}
		.get-title {
			font-size: 16px;
			color: $primaryBlack;
			font-weight: bold;
			line-height: 32px;
		}
		.get-link {
			text-decoration: underline;
			color: $GPEblueText;
			cursor: pointer;
			font-size: 16px;
			line-height: 21px;
		}
		.form-item {
			.v-select {
				padding-top: 0;
				.v-select__slot {
					.v-label {
						margin-left: 15px;
					}
					.v-select__selections input {
						padding-left: 15px;
						&::placeholder {
							color: $GPEdetailData;
						}
					}
				}
				fieldset {
					border: 0.6px solid #a0a0a0;
					box-sizing: border-box;
					border-radius: 6px 6px 0px 0px;
				}
				&.feild-require {
					fieldset {
						border-color: $dangerColor;
					}
				}
			}
			.v-input--radio-group__input {
				.v-radio {
					label {
						font-weight: 400;
						font-size: 14px;
						color: $GPEdetailData;
					}
				}
			}
		}
		.border-width-2px {
			border-width: 2px !important;
		}
	}
	.button-size {
		height: 56px !important;
		padding: 0 60px !important;
		border-radius: 12px;
	}
</style>
