<template>
 <v-data-table
  :headers="headers"
  :items="listCategories"
  :sort-by="[]"
  :sort-desc="[false, true]"
  :hide-default-header="false"
  :height="tableHeight"
  multi-sort
  ref="tableMod"
  class="
   table-modify-css table-propose-model table-scroll-y
   header-sticky-table header-no-border-table
  "
  hide-default-footer
  :items-per-page="10000"
  :loading="tableLoading"
  loading-text="Dữ liệu đang được tải xuống"
  :class="tableLoading ? 'table-on-loading' : ''"
 >
  <template v-if="tableLoading" v-slot:loading>
   <tr class="d-flex justify-center">
    <td colspan="999">Dữ liệu đang được tải xuống</td>
   </tr>
  </template>
  <template v-if="!tableLoading" v-slot:no-data>
   <tr class="d-flex justify-center">
    <td colspan="999">Không có dữ liệu</td>
   </tr>
  </template>
  <template v-slot:item.avatar="{ item }">
   <div>
    <img class="w-max-content" :src="item.avatar" />
   </div>
  </template>
  <template v-slot:item.status>
   <v-switch v-model="item"></v-switch>
  </template>
  <template v-slot:item.actions="{ item }">
   <div class="w-max-content">
    <v-tooltip bottom>
     <template v-slot:activator="{ on, attrs }">
      <img
       v-bind="attrs"
       v-on="on"
       @click="onUpdate(item)"
       class="pointer mr-2"
       src="@/assets/images/ic_edit.png"
       alt=""
      />
     </template>
     <span>Sửa</span>
    </v-tooltip>
    <v-tooltip bottom>
     <template v-slot:activator="{ on, attrs }">
      <img
       v-bind="attrs"
       v-on="on"
       @click="deleteItem(item)"
       class="pointer mr-2"
       src="@/assets/images/ic_delete.png"
       alt=""
      />
     </template>
     <span>Xóa</span>
    </v-tooltip>
   </div>
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
 import route from "@/router/index";
 export default defineComponent({
  props: {
   listCategories: {
    typeof: Array,
    default: [],
   },
   tableLoading: {
    type: Boolean,
   },
   headers: {
    type: Array,
    default: [],
   },
   handleFilterChange: {
    type: Function,
   },
   currentBindingUrl: {
    type: Object,
   },
   handleSelectedItem: {
    type: Function,
   },
   handleRemoveItem: {
    type: Function,
   },
   handleSelectedItemDetail: {
    type: Function,
   },
  },
  components: { TableFiltersInput, TableFiltersSelect, TableFiltersDateRange },
  setup: (props, ctx) => {
   const endedThead = ref<number>(40);
   const tableHeight = ref<number>(600);
   let filtersTable = ref<Record<string, unknown>>({});
   let selectedData = ref<Record<string, unknown>>({});
   let selectedDataDetail = ref<Record<string, unknown>>({});

   const setEndedThead = (payload: number) => {
    endedThead.value = payload;
   };
   const setSelectedData = (payload: Record<string, unknown>) => {
    selectedData.value = payload;
   };
   const editItem = (item: Record<string, string>) => {
    setSelectedData(item);
    ctx.emit("handleSelectedItem", selectedData.value);
   };
   const detailItem = (item: any) => {
    route.push(`/can-duyet/${item.id}`);
   };
   const deleteItem = (item: Record<string, string>) => {
    setSelectedData(item);
    ctx.emit("handleRemoveItem", selectedData.value);
   };
   const setTableHeight = (payload: number) => {
    tableHeight.value = payload;
   };
   const setFiltersTable = (payload: Record<string, unknown>) => {
    filtersTable.value = payload;
   };
   watch(filtersTable, currentValue => {
    // reactive when filter change here
    ctx.emit("handleFilterChange", currentValue);
   });
   //  watch(selectedData, currentValue => {
   //   // reactive when filter change here
   //  });
   //  watch(selectedDataDetail, currentValue => {
   //  });
   return {
    filtersTable,
    tableHeight,
    endedThead,
    selectedData,
    selectedDataDetail,
    setEndedThead,
    setTableHeight,
    setFiltersTable,
    setSelectedData,
    editItem,
    detailItem,
    deleteItem,
   };
  },
  data() {
   return {
    arraySort: [],
   };
  },
  mounted() {
   try {
    if (this.$refs.tableMod) {
     const myTable = (this.$refs.tableMod as Vue).$el as HTMLElement;
     const myThead = myTable.querySelector("thead");
     //  this.endedThead= myThead?.clientHeight
     if (myThead?.clientHeight) {
      this.setEndedThead(myThead.clientHeight);
     }
     this.setTableHeight(window.innerHeight - myTable.offsetTop - 80);
    }
   } catch (error) {
    console.log(error);
   }
  },

  methods: {
   listenChange(value: NormalFilterObject) {
    const valObject = returnFilterObject(value);
    const body = {
     ...this.filtersTable,
     ...valObject,
    };
    this.setFiltersTable(body);
   },
   listenDateChange(value: NormalFilterObject) {
    const valObject = { ...value };
    const body = {
     ...this.filtersTable,
     ...valObject,
    };
    this.setFiltersTable(body);
   },
  },
 });
</script>
<style lang="scss">
 .table-approved-model {
  table {
   tr {
    th {
     min-width: 100px;
     &.tax_code,
     &.name,
     &.country,
     &.address,
     &.reminiscent_name,
     &.company {
      min-width: 200px;
     }
    }
   }
  }
 }
</style>
<style lang="scss">
 .w-max-content {
  width: 30px;
 }
 .v-data-table.table-approved-model {
  max-width: 100%;
 }
 .v-data-table.table-approved-model
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  font-size: 0.875rem;
  height: 48px;
  padding-left: 50%;
 }
 .v-data-table.table-approved-model table thead tr {
  .noone {
   min-width: 90px;
  }
  .company {
   min-width: 130px;
  }
  .contact-person {
   min-width: 170px;
  }
  .reminiscent {
   min-width: 193px;
  }
  .code {
   min-width: 100px;
  }
  .address {
   min-width: 120px;
  }
  .state {
   min-width: 100px;
  }
  .phone {
   min-width: 170px;
  }
 }
</style>
