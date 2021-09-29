<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerFollowDetail />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerFollowDetail from "@/components/containers/ContainerFollowDetail.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerFollowDetail
  },
   created(){
      this.$store.commit("SET_BREADCRUMB", {
         viewTxt: "Budget and contract",
         ableToBack: false,
         rootRouter: "/",
         hasStatus: false,
         statusTxt: "",
      });
    },
 });
</script>