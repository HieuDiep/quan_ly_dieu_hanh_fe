<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerProposeCreatePage />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent  } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue"; 
 import ContainerProposeCreatePage from "@/components/containers/ContainerProposeCreatePage.vue";
 export default defineComponent({
    components: {
      DefaultLayout,
      ContainerProposeCreatePage,
    },
    
    methods:{
       
    }
 });
</script>