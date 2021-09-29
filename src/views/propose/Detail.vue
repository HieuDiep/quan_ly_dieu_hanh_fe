<template>
 <DefaultLayout>
  <div class="px-3">
   <ContainerProposeDetailPage />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerProposeDetailPage from "@/components/containers/ContainerProposeDetailPage.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerProposeDetailPage,
  },

  methods: {},
  mounted() {
   this.$store.commit("SET_ADDLIB", false);
   this.$store.commit("SET_ADDLIBACTION", () => {
    console.log("nth");
   });
  },
 });
</script>
