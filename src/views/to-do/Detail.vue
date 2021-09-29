<template>
	<keep-alive>
		<div class="container-fluid-t layout-default">
			<keep-alive>
				<SideBar />
			</keep-alive>
			<div class="rest-container">
				<!-- <BreadCrumb v-if="showBC" /> -->

				<ContainerTodoDetail />
			</div>
		</div>
	</keep-alive>
</template>
<script lang="ts">
	import { defineComponent } from '@vue/composition-api';
	import ContainerTodoDetail from '@/components/containers/ContainerTodoDetail.vue';
	import SideBar from '@/components/Layout/Sidebar.vue';

	export default defineComponent({
		components: {
			SideBar,
			ContainerTodoDetail,
		},
	});
</script>
