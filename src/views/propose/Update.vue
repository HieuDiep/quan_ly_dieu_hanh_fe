<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerProposeUpdatePage />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerProposeUpdatePage from "@/components/containers/ContainerProposeUpdatePage.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerProposeUpdatePage,
  },
  mounted() {
   this.$store.commit("SET_SHOWFILTER", false);
   this.$store.commit("SET_ADDLIB", false);
  },
  methods: {},
 });
</script>
