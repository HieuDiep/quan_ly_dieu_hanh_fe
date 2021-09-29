<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerApproval />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent  } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerApproval from "@/components/containers/ContainerApproval.vue";
 export default defineComponent({
    components: {
    DefaultLayout,
    ContainerApproval,
    },
    created(){
      this.$store.commit("SET_BREADCRUMB", {
         viewTxt: "Cần duyệt",
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