<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerProposePage />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent  } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerProposePage from "@/components/containers/ContainerProposePage.vue";
 export default defineComponent({
    components: {
    DefaultLayout,
    ContainerProposePage,
    },
    created(){
      this.$store.commit("SET_BREADCRUMB", {
         viewTxt: "Đề xuất",
         ableToBack: false,
         rootRouter: "/",
         hasStatus: false,
         statusTxt: "",
      });
    },
    methods:{
       
    }
 });
</script>