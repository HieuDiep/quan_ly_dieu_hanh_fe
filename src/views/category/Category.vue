<template>
 <DefaultLayout>
   <div class="px-3">
    <ContainerCategory />
   </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerCategory from "@/components/containers/ContainerCategory.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerCategory,
  },

  mounted() {
   this.$store.commit("SET_ADDLIB", true);
  },
 });
</script>
