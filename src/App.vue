<template>
	<v-app>
		<v-main>
			<router-view :key="this.$route.fullPath" />
		</v-main>
		<v-snackbar
			v-model="snackbarEnable"
			v-show="snackbarState.content"
			:class="snackBarClasViaType"
		>
			<!-- <p class="snack-title font-size-16 mb-1">
				{{ snackbarState.title }}
			</p> -->
			<p class="font-size-16 mb-0">
				{{ snackbarState.content }}
			</p>

			<template v-slot:action="{ attrs }">
				<v-btn
					color="blue"
					text
					v-bind="attrs"
					@click="snackbarEnable = false"
					class="snackbar-btn-close"
				>
					Đóng
				</v-btn>
			</template>
		</v-snackbar>

		<PreviewImage
			v-if="onViewDetailImg"
			:items="listImgPreview"
			:handler-close-popup="handlerClosePopup"
			:item-idx="itemIdx"
		/>
	</v-app>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { mapState } from 'vuex';
	import PreviewImage from '@/components/Layout/PreviewImage.vue';

	export default Vue.extend({
		name: 'App',
		components: {
			PreviewImage,
		},
		// beforeMount(){}
		data: () => ({
			snackbarEnable: true,
			firstloadingp: true,
		}),
		computed: {
			...mapState({
				snackbarState: (state: any) => state.snackbar,
				listImgPreview: (state: any) => state.listImgPreview,
				itemIdx: (state: any) => state.imageIdx,
				auth: (state: any) => state.auth,
			}),
			onViewDetailImg() {
				return !!this.listImgPreview && this.listImgPreview.length;
			},
			snackBarClasViaType() {
				if (!this.snackbarState || !this.snackbarState.type) {
					return '';
				}
				return `snackbar-on-${this.snackbarState.type}`;
			},
		},
		mounted() {
			// this.firstloadingp = false;
			if (this.auth && this.auth.isAuth) {
				this.$store.dispatch('signature/getCurrentSignature');
				this.$store.dispatch('categories/getListCategories');
				this.$store.dispatch('users/getDepartments');
				this.$store.dispatch('users/getCompanies');
				this.$store.dispatch('users/getUsers');
				this.$store.dispatch('others/getAllFields');
			}
		},
		watch: {
			snackbarState: {
				deep: true,
				handler() {
					this.snackbarEnable = true;
				},
			},
			auth: {
				deep: true,
				handler() {
					if (this.auth && this.auth.isAuth) {
						this.$store.dispatch('signature/getCurrentSignature');
						this.$store.dispatch('categories/getListCategories');
						this.$store.dispatch('users/getDepartments');
						this.$store.dispatch('users/getCompanies');
						this.$store.dispatch('users/getUsers');
						this.$store.dispatch('others/getAllFields');
					}
				},
			},
		},
		methods: {
			handlerClosePopup() {
				this.$store.commit('SET_LIST_IMAGE_PREVIEW', []);
				this.$store.commit('SET_INDEX_IMAGE_PREVIEW', 0);
			},
		},
	});
</script>
<style lang="scss">
	@import '@/assets/style/main.scss';
	.loader-full-page {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		img {
			animation: swipealways 2.5s linear infinite;
		}
		&.loader-hiding {
			animation: hiding 0.5s linear forwards;
		}
	}
	.v-snack__wrapper {
		min-width: 800px !important;
		min-height: 60px !important;
	}
	.snack-title {
		font-size: 18px;
	}
	@keyframes swipealways {
		0% {
			transform: rotateY(0);
		}
		100% {
			transform: rotateY(360deg);
		}
	}
	@keyframes hiding {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
