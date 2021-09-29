<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerFollow />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent  } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerFollow from "@/components/containers/ContainerFollow.vue";
 export default defineComponent({
    components: {
    DefaultLayout,
    ContainerFollow,
    },
    created(){
      this.$store.commit("SET_BREADCRUMB", {
         viewTxt: "Phê duyệt theo dõi",
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