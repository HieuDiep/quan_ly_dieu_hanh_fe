<template>
  <DefaultLayout>
    <div class="px-3">
      <ContainerTask />
    </div>
  </DefaultLayout>
</template>
<script lang="ts">
  import { defineComponent } from "@vue/composition-api";
  import DefaultLayout from "@/layouts/default.vue";
  import ContainerTask from "@/components/containers/ContainerTask.vue";
  export default defineComponent({
    components: {
      DefaultLayout,
      ContainerTask,
    },
    created() {
      this.$store.commit("SET_BREADCRUMB", {
        viewTxt: "Giao việc",
        ableToBack: false,
        rootRouter: "/",
        hasStatus: false,
        statusTxt: "",
      });
    },
    methods: {},
  });
</script>
