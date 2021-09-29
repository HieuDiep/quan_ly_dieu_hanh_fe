<template>
 <DefaultLayout>
  <div class="Rectangle-17643">
   <ContainerCreateCategoryPage />
  </div>
 </DefaultLayout>
</template>

<script lang="ts">
 import { defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerCreateCategoryPage from "@/components/containers/ContainerCreateCategoryPage.vue";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerCreateCategoryPage,
  },
  created() {
   this.$store.commit("SET_BREADCRUMB", {
    viewTxt: "Danh mục",
    ableToBack: false,
    rootRouter: "/",
    hasStatus: false,
    statusTxt: "",
   });
  },

  mounted() {
   this.$store.commit("SET_ADDLIB", false);
  },
 });
</script>
<style lang="scss" scoped>
 @import "@/assets/style/_variables.scss";

 .Rectangle-17643 {
  margin: 22px 15px 0 13px;
  border-radius: 4px;
  /* background-color: $primaryWhite; */
  background-color: transparent;
 }
</style>
