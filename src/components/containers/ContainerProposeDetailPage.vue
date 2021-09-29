<template>
 <div class="page-container container-propose-create">
  <div class="page-content">
   <Detail
    :current-data="currentData"
    :list-template="listTemplate"
    :get-current-data="getAllDetail"
   />
  </div>
 </div>
</template>

<script lang="ts">
 import { Detail } from "@/components/containers/propose";
 import { ref, onMounted } from "@vue/composition-api";
 import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
 import api from "@/services";
 export default {
  components: {
   Detail,
  },
  data() {
   return {
    tab: 0,
   };
  },

  setup: () => {
   const { currentParram } = useRouteQuery();
   let currentData = ref<Record<string, any>>({});
   let listTemplate = ref<Record<string, any>>({ value: [] });
   const setCurrentData = (value: Record<string, any>) => {
    currentData.value = value;
   };
   const setListTemplate = (value: Record<string, any>) => {
    listTemplate.value = value;
   };
   const getAllDetail = async () => {
    const _id = currentParram;
    const res = await api.approval.getDetail(_id);
    if (!res) {
     return;
    }
    try {
     setCurrentData(res.data.data.approval);
     getCateTemplate(res.data.data.approval.category.id);
    } catch (error) {
     console.log(error);
    }
   };
   const getCateTemplate = async (_id: number | string) => {
    const res = await api.template.getDetailByTemplate(_id);
    if (!res) {
     return;
    }
    try {
     setListTemplate({ value: res.data.data.templates });
    } catch (error) {
     console.log(error);
    }
   };
   onMounted(getAllDetail);
   return {
    currentData,
    listTemplate,

    getAllDetail,
   };
  },
 };
</script>

<style lang="scss">
 @import "@/assets/style/_variables.scss";
 .bd-bottom {
  border-bottom: 1px solid $borderColor;
 }
 .each-status {
  color: $textColorBlur;
  .v-icon {
   color: $textColorBlur;
  }
  &.status--active {
   color: $primaryText;
   font-weight: bold;
   .v-icon {
    color: $primaryText;
   }
  }
 }
</style>
