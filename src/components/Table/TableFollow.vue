<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
    :sort-by="[]"
    :sort-desc="[false, true]"
    :hide-default-header="false"
    :height="tableHeight"
    multi-sort
    ref="tableMod"
    class="
      table-modify-css table-follow-model table-scroll-y
      header-sticky-table header-no-border-table
    "
    hide-default-footer
    :items-per-page="10000"
    :loading="tableLoading"
    loading-text="Dữ liệu đang được tải xuống"
    :class="tableLoading ? 'table-on-loading' : ''"
  >
    <!-- <template v-slot:body.prepend="{ headers }">
      <tr
        class="filter-prepend-body"
        :style="`top:${endedThead}px;position:sticky;z-index:3`"
      >
        <td
          v-for="header in headers"
          :key="header.text"
          class="pointer"
          :class="header.type === 'date' ? 'date-header' : ''"
        >
          <div>
            <TableFiltersInput
              v-if="header.filters && header.filters.type === 'string'"
              :own-header="header"
              :listen-change="listenChange"
              :default-value="header.filters.defaultValue"
            />
            <TableFiltersSelect
              v-if="header.filters && header.filters.type === 'select'"
              :own-header="header"
              :listen-change="listenChange"
              :default-value="header.filters.defaultValue"
            />
            <TableFiltersDateRange
              v-if="header.filters && header.filters.type === 'daterange'"
              :own-header="header"
              :listen-change="listenDateChange"
              :default-value="header.filters.defaultValue"
            />
          </div>
        </td>
      </tr>
    </template> -->
    <template v-if="tableLoading" v-slot:loading>
      <span class="d-flex justify-center">Dữ liệu đang được tải xuống</span>
    </template>
    <template v-if="!tableLoading" v-slot:no-data>
      <span class="d-flex justify-center">Không có dữ liệu</span>
    </template>
    <template v-slot:item.colorbox="{ item }">
      <div
        :class="
          item.status.id === 1
            ? 'trash-background'
            : item.status.id === 2
            ? 'sent-background'
            : item.status.id === 3
            ? 'approved-background'
            : item.status.id === 4
            ? 'no-approve-background'
            : item.status.id === 5
            ? 'cancel-background'
            : ''
        "
        class="d-flex justify-center"
      ></div>
    </template>
    <template v-slot:item.id="{ item }">
      <span class="id-noone">{{ item.id }}</span>
    </template>
    <template v-slot:item.status="{ item }">
      <div
        :class="
          item.status.id === 1
            ? 'trash'
            : item.status.id === 2
            ? 'sent'
            : item.status.id === 3
            ? 'approved'
            : item.status.id === 4
            ? 'no-approve'
            : item.status.id === 5
            ? 'cancel'
            : ''
        "
      >
        {{ item.status.name }}
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="w-max-content">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <img
              v-bind="attrs"
              v-on="on"
              @click="viewDetail(item)"
              class="pointer mr-2"
              src="@/assets/images/icon-edit.svg"
              alt=""
            />
          </template>
          <span>Chi tiết</span>
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
    tableData: {
      type: Array,
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
      route.push(`/approval/${item.id}`);
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
    watch(filtersTable, (currentValue) => {
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
    viewDetail(data: Record<string, any>) {
      this.$router.push(`/theo-doi/chi-tiet/${data.id}`);
    },
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
@import "@/assets/style/_variables.scss";
.table-follow-model {
  .id-noone {
    text-decoration: underline;
    color: $GPEblueText;
    font-size: 14px;
  }
  .trash {
    color: $txtPrimaryBlack;
    background-color: $backgroundCategory;
    height: 32px;
    font-weight: 400;
    padding-top: 7px;
    padding-left: 8px;
    font-size: 14px;
    border-radius: 4px;
    max-width: 100%;
  }
  .sent {
    color: $GPEblueText;
    background-color: $backgroundstronggreen;
    height: 32px;
    font-weight: 400;
    padding-top: 7px;
    padding-left: 8px;
    font-size: 14px;
    border-radius: 4px;
    max-width: 100%;
  }
  .approved {
    color: $GPEstronggreen;
    background-color: $backgroundlightgreen;
    height: 32px;
    font-weight: 400;
    padding-top: 7px;
    padding-left: 8px;
    font-size: 14px;
    border-radius: 4px;
    max-width: 100%;
  }
  .no-approve {
    color: $dangerColor;
    background-color: $backgroundlightdanger;
    height: 32px;
    font-weight: 400;
    padding-top: 7px;
    padding-left: 8px;
    font-size: 14px;
    border-radius: 4px;
    max-width: 100%;
  }
  .cancel {
    color: $GPEcancel;
    background-color: $backgroundcancel;
    height: 32px;
    font-weight: 400;
    padding-top: 7px;
    padding-left: 8px;
    font-size: 14px;
    border-radius: 4px;
    max-width: 100%;
  }
  .trash-background {
    background-color: $borderColor;
    height: 57px !important;
  }
  .sent-background {
    background-color: $backgroundcolorblue;
    height: 57px !important;
  }
  .approved-background {
    background-color: $backgroundapproved;
    height: 57px !important;
  }
  .no-approve-background {
    background-color: $backgroundnoapprove;
    height: 57px !important;
  }
  .cancel-background {
    background-color: $GPEcancel;
    height: 57px !important;
  }
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
.v-data-table.table-follow-model {
  max-width: 100%;
}
.v-data-table.table-follow-model
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  font-size: 0.875rem;
  height: 48px;
}
.v-data-table.table-follow-model table thead tr {
  .color-box {
    min-width: 23px;
    padding-left: 0px;
  }
  .noone {
    min-width: 90px;
    padding-left: 0px;
  }
  .company {
    min-width: 130px;
    padding-left: 0px;
  }
  .contact-person {
    min-width: 170px;
    padding-left: 0px;
  }
  .name {
    min-width: 240px;
    padding-left: 0px;
  }
  .date {
    min-width: 240px;
    padding-left: 0px;
  }
  .action {
    min-width: 48px;
    padding-left: 0px;
  }
  .reminiscent_name {
    min-width: 193px;
    padding-left: 0px;
  }
  .code {
    min-width: 100px;
    padding-left: 0px;
  }
  .address {
    min-width: 120px;
    padding-left: 0px;
  }
  .state {
    min-width: 100px;
    padding-left: 0px;
  }
  .phone {
    min-width: 170px;
    padding-left: 0px;
  }
}
.v-data-table.table-follow-model table tbody tr td {
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-bottom: 0 !important;
}
</style>
