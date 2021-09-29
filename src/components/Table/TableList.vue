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
   table-modify-css table-scroll-y
   header-sticky-table header-no-border-table
   pl-3
  "
  hide-default-footer
  :items-per-page="10000"
  :loading="tableLoading"
  loading-text="Dữ liệu đang được tải xuống"
  :class="tableLoading ? 'table-on-loading' : ''"
 >
  <template v-if="tableLoading" v-slot:loading>
   <span class="d-flex justify-center">Dữ liệu đang được tải xuống</span>
  </template>
  <template v-if="!tableLoading" v-slot:no-data>
   <span class="d-flex justify-center">Không có dữ liệu</span>
  </template>
  <template v-slot:item.avatar="{ item }">
   <div class="table_icon">
    <img class="w-max-content" :src="item.avatar" />
   </div>
  </template>
  <template v-slot:item.name="{ item }">
   <div class="table_icon">
    <span class="i-cng-tc">
     {{ item.name }}
    </span>
   </div>
  </template>
  <template v-slot:item.status="{ item }">
   <div class="ml-3">
    <v-switch v-model="item.status" @change="onChangeActive(item)"></v-switch>
   </div>
  </template>
  <template v-slot:item.actions="{ item }">
   <div class="table_icon d-flex justify-center">
    <v-tooltip bottom>
     <template v-slot:activator="{ on, attrs }">
      <img
       v-bind="attrs"
       v-on="on"
       @click="editItem(item)"
       class="pointer mr-2"
       height="24px"
       src="@/assets/images/ic_edit@2x.png"
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
       height="24px"
       src="@/assets/images/ic_delete@2x.png"
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
    default: [{ avatar: "", name: "", status: "", actions: "" }],
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
   const editItem = (item: any) => {
    route.push(`/danh-muc/chinh-sua/${item.id}`);
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
   onChangeActive(e: any) {
    console.log(e);
   },
  },
 });
</script>
<style lang="scss" scoped>
 .w-max-content {
  width: 32px;
 }
 .i-cng-tc {
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.29;
  letter-spacing: normal;
  text-align: left;
  color: #223140;
 }
</style>
