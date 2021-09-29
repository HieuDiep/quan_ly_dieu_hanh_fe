<template>
 <DefaultLayout>
  <div class="p-3">
   <ContainerChuKy />
  </div>
 </DefaultLayout>
</template>
<script lang="ts">
 import { defineComponent, ref } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerChuKy from "@/components/containers/ContainerChuKy.vue";
 import { useState } from "vuex-composition-helpers/dist";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerChuKy,
  },
  setup: (props, ctx) => {
   const { auth } = useState(["auth"]);

   return {
    auth,
   };
  },
  data() {
   return {};
  },
  created() {
   this.$store.commit("SET_BREADCRUMB", {
    viewTxt: "Chữ ký ",
    ableToBack: false,
    rootRouter: "/",
    hasStatus: false,
    statusTxt: "",
   });
  },
  methods: {},
 });
</script>
<style lang="scss"></style>
