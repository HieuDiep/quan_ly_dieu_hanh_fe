<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerApprovalDetail />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerApprovalDetail from "@/components/containers/ContainerApprovalDetail.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerApprovalDetail
  },

 });
</script>