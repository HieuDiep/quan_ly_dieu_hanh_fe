<template>
  <DefaultLayout>
    <div class="px-3">
      <ContainerProposeCopyPage />
    </div>
  </DefaultLayout>
</template>
<script lang="ts">
  import { defineComponent } from "@vue/composition-api";
  import DefaultLayout from "@/layouts/default.vue";
  import ContainerProposeCopyPage from "@/components/containers/ContainerProposeCopyPage.vue";
  export default defineComponent({
    components: {
      DefaultLayout,
      ContainerProposeCopyPage,
    },
    mounted() {
      this.$store.commit("SET_SHOWFILTER", false);
      this.$store.commit("SET_ADDLIB", false);
    },
    methods: {},
  });
</script>
