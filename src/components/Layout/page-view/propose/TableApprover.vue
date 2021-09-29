<template>
 <v-data-table
  :headers="headers"
  :items="tableData"
  :items-per-page="1000"
  class="box-shadow-unset table-approver"
  hide-default-footer
 >
  <template v-if="tableLoading" v-slot:loading class="d-flex justify-center">
   <span>Dữ liệu đang được tải xuống</span>
  </template>
  <template v-if="!tableLoading" v-slot:no-data>
   <span> Không có dữ liệu</span>
  </template>
  <template v-slot:item.full_name="{ item }">
   <span class="text-no-wrap">{{ item.full_name }}</span>
  </template>
  <template v-slot:item.action="{ item }">
   <v-icon color="#ce4b4b" @click="deleteItem(item)"> mdi-close-circle </v-icon>
  </template>
 </v-data-table>
</template>

<script lang="ts">
 import Vue from "vue";
 import {
  ref,
  defineComponent,
  reactive,
  watch,
  toRefs,
 } from "@vue/composition-api";
 import {
  TableFiltersInput,
  TableFiltersSelect,
  TableFiltersDateRange,
 } from "@/components/Shared/index";
 import { NormalFilterObject } from "@/InterfaceModel/Filter";
 import { returnFilterObject } from "@/utils/TableFilters";
 export default defineComponent({
  props: {
   tableData: {
    type: Array,
    default(){
      return [];
    },
   },
   tableLoading: {
    type: Boolean,
   },
   headers: {
    type: Array,
    default: [],
   },
   handleRemoveItem: {
    type: Function,
   },
  },
  components: { TableFiltersInput, TableFiltersSelect, TableFiltersDateRange },
  setup: (props, ctx) => {
   let selectedData = ref<Record<string, unknown>>({});

   const setSelectedData = (payload: Record<string, unknown>) => {
    selectedData.value = payload;
   };
   const deleteItem = (item: Record<string, string>) => {
    setSelectedData(item);
    ctx.emit("handleRemoveItem", selectedData.value);
   };
   //  watch(selectedData, currentValue => {
   //   // reactive when filter change here
   //  });
   //  watch(selectedDataDetail, currentValue => {
   //  });
   return {
    deleteItem,
   };
  },
  data() {
   return {
    arraySort: [],
   };
  },

  methods: {},
 });
</script>
<style lang="scss">
 @import "@/assets/style/_variables.scss";
 .table-approver {
  table tr {
   th > * {
    font-size: 14px !important;
    color: $textColorBlur;
    font-weight: normal;
   }
   td > * {
    font-size: 14px !important;
    color: $primaryBlack;
    font-weight: normal;
   }
   th,
   td {
    height: 36px !important;
   }
  }
 }
</style>
