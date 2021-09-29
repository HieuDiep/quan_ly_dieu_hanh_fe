<template>
  <div class="page-propose page-container">
    <!-- <div class=" mb-4 page-header">
    <span class="title-page font-size-32 font-weight-bold text-uppercase display-flex align-center">
      <span class="align-justify-center mr-4 pointer btn-back-page">
        <img src="@/assets/images/arrow-left.svg" alt="">
      </span>
      Bag List
    </span>
  </div> -->
    <div class="page-content">
      <div class="mb-8 px-5 display-flex">
        <div class="filter-group--mod display-flex align-center">
          <img src="@/assets/images/search-icon.png" height="20" alt="" />
          <input
            class="w-100"
            type="text"
            placeholder="Tìm kiếm đề xuất"
            v-model="pagination.keyword"
          />
        </div>
        <SharedPagination
          class="mt-0"
          :pagination-sync="pagination"
          @handlePageSizeChange="pagePaginationChange"
          @handlePageChange="pagePaginationChange"
        />
      </div>
      <TablePropose
        :table-data="tableDataComputed"
        :table-loading="loadingTable"
        :headers="headers"
        @handleFilterChange="filterTableChange"
        @handleSelectedItem="handlerEdit"
        @handleRemoveItem="onRemoveItem"
        @onSendItem="onSendItem"
        :current-binding-url="queryRoute"
        @handleSelectedItemDetail="handlerViewDetail"
      />
      <DialogPropose
        :is-visible="isVisible"
        v-if="isVisible"
        :selected-data="selectedData"
        @handlerCancel="handlerDialogCancel"
        @handlerSubmit="handlerDialogSubmit"
        :loading-btn="loadingBtn"
        :mess-eror="messageErr"
      />
      <ConfirmRemove
        :is-visible="visibleConfirmRemove"
        :handlerCancel="closeRemoveDialog"
        :handlerConfirm="onRemovePP"
        :loading-btn="removeBtnLoading"
        :messErr="messageErrRemove"
        :title="selectedDataToRemove.name"
      >
      </ConfirmRemove>
      <ConfirmCancel
        :is-visible="isVisible && isVisibleConfirm"
        :handlerCancel="handlerDialogConfirmCancel"
        :handlerConfirm="handleConfirmCancel"
      >
      </ConfirmCancel>
      <ConfirmSendPP
        :is-visible="visibleConfirmSend"
        :handlerCancel="closeSendDialog"
        :handlerConfirm="onSendPP"
        :selected-data="selectedDataToSend"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    reactive,
    ref,
    watch,
  } from "@vue/composition-api";
  import api from "@/services";
  import TablePropose from "@/components/Table/TablePropose.vue";
  import DialogPropose from "@/components/Form/DialogPropose.vue";
  import ConfirmRemove from "@/components/popup/ConfirmRemove.vue";
  import ConfirmCancel from "@/components/popup/ConfirmCancel.vue";
  import ConfirmSendPP from "@/components/popup/ConfirmSendPP.vue";
  import { SharedPagination } from "@/components/Shared";
  import { NormalPagination } from "@/InterfaceModel/Pagination";
  import { NormalHeaderItem } from "@/InterfaceModel/Header";
  import { IdentifyObject } from "@/InterfaceModel/CustomObject";
  import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
  import { TextFilter } from "@/components/Shared";
  import route from "@/router/index";
  import { mapState } from "vuex";
  import { filter } from "vue/types/umd";
  export default defineComponent({
    components: {
      TablePropose,
      SharedPagination,
      DialogPropose,
      ConfirmRemove,
      ConfirmCancel,
      ConfirmSendPP,
      TextFilter,
    },
    setup: (props, ctx) => {
      const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
      const selectedData = ref<Record<string, unknown>>({});
      const selectedDataToSend = ref<Record<string, unknown>>({});
      const selectedDataToRemove = ref<Record<string, unknown>>({});
      const loadingTable = ref<boolean>(false);
      const loadingBtn = ref<boolean>(false);
      const isVisible = ref<boolean>(false);
      const visibleConfirmSend = ref<boolean>(false);
      const visibleConfirmRemove = ref<boolean>(false);
      const isVisibleConfirm = ref<boolean>(false);
      const isVisibleDetail = ref<boolean>(false);
      let refInterval = ref<number>(0);
      const currentRouteQuery = ref<string>(stringQueryRender);
      const messageErr = ref<string>("");
      let messageErrRemove = "";
      let removeBtnLoading = false;
      let tableData = reactive<Record<string, any>>({ value: [] });
      const dataExport = ref<any>("");
      let tableDataComputed = computed(() => {
        const arr: Record<string, any>[] = tableData.value;
        if (!arr.length) return [];
        return arr.map((o: any) => {
          return {
            ...o,
            created_at: formatDate(o.created_at),
            category_name: o.category ? o.category.name : "",
            category_des: o.category ? o.category.description : "",
          };
        });
      });
      const keywordComputed = computed(() => {
        return pagination.value.keyword;
      });
      let formatDate = (ds: any) => {
        let ar1 = ds.split(" ");
        let ar2 = ar1[0].split("-");
        return `${ar2[2]}/${ar2[1]}/${ar2[0]}`;
      };
      let filterTable = ref({});
      let pagination = ref<NormalPagination>({
        total: 1,
        size: 15,
        total_pages: 15,
        page: 1,
        keyword: "",
      });

      const headers: NormalHeaderItem[] = [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "colorbox",
          class: "color-box",
          type: "string",
          filters: {
            // type: "string",
            // key: "id",
            // placeholder: "No.",
            // defaultValue: "",
          },
        },
        {
          text: "Mã số",
          align: "start",
          sortable: false,
          value: "id",
          class: "noone",
          type: "string",
          filters: {
            // type: "string",
            // key: "id",
            // placeholder: "No.",
            // defaultValue: "",
          },
        },
        {
          text: "Trạng thái",
          align: "start",
          sortable: false,
          value: "status",
          class: "address",
          type: "string",
          filters: {
            // type: "string",
            // key: "address",
            // placeholder: "Address",
            // defaultValue: "",
          },
        },
        {
          text: "Tiêu đề",
          align: "start",
          sortable: false,
          value: "name",
          class: "company",
          type: "string",
          filters: {
            // type: "string",
            // key: "company",
            // placeholder: "Company",
            // defaultValue: "",
          },
        },
        {
          text: "Danh mục phê duyệt ",
          align: "start",
          sortable: false,
          value: "category_name",
          class: "name",
          type: "string",
          filters: {
            // type: "string",
            // key: "name",
            // placeholder: "Contact Person",
            // defaultValue: "",
          },
        },
        // {
        //   text: "Người đề xuất",
        //   align: "start",
        //   sortable: false,
        //   value: "creator.full_name",
        //   class: "reminiscent_name",
        //   type: "string",
        //   filters: {
        //     // type: "string",
        //     // key: "reminiscent_name",
        //     // placeholder: "Reminiscent Name",
        //     // defaultValue: "",
        //   },
        // },
        // {
        //  text: "Công việc",
        //  align: "start",
        //  sortable: false,
        //  value: "none",
        //  class: "state",
        //  type: "string",
        //  filters: {
        //   // type: "string",
        //   // key: "state",
        //   // placeholder: "State",
        //   // defaultValue: "",
        //  },
        // },
        {
          text: "Ngày gửi",
          align: "start",
          sortable: false,
          value: "created_at",
          class: "date",
          type: "string",
          filters: {
            // type: "string",
            // key: "country",
            // placeholder: "Country",
            // defaultValue: "",
          },
        },
        {
          text: "",
          class: "action",
          value: "actions",
          sortable: false,
          filters: {},
        },
      ];
      Object.freeze(headers);
      const setTableData = (payload: Record<string, unknown>[]) => {
        tableData.value = payload;
      };
      const setPagination = (payload: NormalPagination) => {
        pagination.value = { ...payload };
      };
      const setCurrentRouteQuery = (payload: Record<string, unknown>): any => {
        let pairO = new IdentifyObject({
          ...payload,
        });
        currentRouteQuery.value = getQueryRoute(pairO.identifySelf());
      };
      const setCurrentFilterTable = (payload: Record<string, unknown>): any => {
        filterTable.value = { ...payload };
      };
      const setLoadingTable = (payload: boolean) => {
        loadingTable.value = payload;
      };
      const setLoadingBtn = (payload: boolean) => {
        loadingBtn.value = payload;
      };
      const setIsVisible = (payload: boolean) => {
        isVisible.value = payload;
      };
      const setIsVisibleDetail = (payload: boolean) => {
        isVisibleDetail.value = payload;
      };
      const setIsVisibleConfirm = (payload: boolean) => {
        isVisibleConfirm.value = payload;
      };
      const setVisibleConfirmSend = (payload: boolean) => {
        visibleConfirmSend.value = payload;
      };
      const setVisibleConfirmRemove = (payload: boolean) => {
        visibleConfirmRemove.value = payload;
      };

      watch(currentRouteQuery, currentValue => {
        route.push(`${currentValue}`);
      });
      watch(pagination, currentValue => {
        const { page, size, keyword } = currentValue;
        setCurrentRouteQuery({
          ...queryRoute,
          keyword,
          page,
          size,
        });
      });
      watch(keywordComputed, keyword => {
        if (refInterval.value) {
          clearTimeout(refInterval.value);
        }

        refInterval.value = setTimeout(() => {
          setCurrentRouteQuery({
            ...queryRoute,
            keyword,
          });
        }, 600);
      });
      watch(filterTable, currentValue => {
        setCurrentRouteQuery({
          ...queryRoute,
          ...currentValue,
          page: 1,
        });
      });
      watch(isVisible, currentValue => {
        if (!currentValue) {
          selectedData.value = {};
          messageErr.value = "";
        }
      });
      watch(isVisibleConfirm, currentValue => {
        if (!currentValue && !isVisible.value) {
          selectedData.value = {};
          messageErr.value = "";
        }
      });
      watch(isVisibleDetail, currentValue => {
        if (!currentValue) {
          selectedData.value = {};
          messageErr.value = "";
        }
      });

      const getAllPropose = async (query: Record<string, unknown>) => {
        setLoadingTable(true);
        if (!Object.keys(query).length) return;
        query.include = "fields,approvers,followers,creator,category";
        query.type = "i_created";
        const res = await api.propose.getAll(query);
        setLoadingTable(false);
        if (!res) {
          ctx.root.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Update error",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            const _pagination = res.data.data.meta.pagination;
            if (pagination.value.page > _pagination.total_pages) {
              setPagination({
                total: _pagination.total,
                total_pages: _pagination.total_pages,
                size: _pagination.per_page,
                page: 1,
                keyword: pagination.value.keyword,
              });
            } else {
              setTableData(res.data.data.approvals);
              setPagination({
                total: _pagination.total,
                total_pages: _pagination.total_pages,
                size: _pagination.per_page,
                page: _pagination.current_page,
                keyword: pagination.value.keyword,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      return {
        headers,
        pagination,
        loadingTable,
        loadingBtn,
        tableDataComputed,
        queryRoute,
        filterTable,
        selectedData,
        messageErrRemove,
        removeBtnLoading,
        // isVisible,
        isVisibleDetail,
        isVisibleConfirm,
        selectedDataToSend,
        selectedDataToRemove,
        visibleConfirmSend,
        visibleConfirmRemove,
        messageErr,
        setTableData,
        setLoadingTable,
        setLoadingBtn,
        setCurrentRouteQuery,
        setPagination,
        setIsVisible,
        setIsVisibleConfirm,
        setIsVisibleDetail,
        getAllPropose,
        setCurrentFilterTable,
        setVisibleConfirmSend,
        setVisibleConfirmRemove,
        currentRouteQuery,
        // handlerExport
      };
    },
    beforeDestroy() {
      this.$store.commit("SET_VISIBLE_DIALOG", false);
    },
    computed: {
      ...mapState({
        previousPagination: (state: any) => state.previousPagination,
        isVisible: (state: any) => state.visibleDialog,
      }),
    },
    created() {
      if (this.previousPagination) {
        const body = {
          ...this.previousPagination,
        };
        this.setPagination(body);
      }
      if (this.queryRoute) {
        if (this.queryRoute.size) {
          const refPagination = { ...this.pagination };
          refPagination.size = +this.queryRoute.size;
          refPagination.page = +this.queryRoute.page;
          refPagination.keyword = this.queryRoute.keyword;
          this.setPagination(refPagination);
        }
        let _obj: any = { ...this.queryRoute };
        delete _obj.size, delete _obj.page;
        // this.setCurrentFilterTable(_obj)

        // this.setCurrentRouteQuery(this.queryRoute)
        this.bindingDefaultFilterHeader(_obj);
      }
      this.getAllPropose({ ...this.queryRoute });
      this.$store.commit("SET_ADDLIBACTION", this.handlerShowDialog);
    },
    mounted() {
      this.$store.commit("SET_ADDLIB", true);
    },
    methods: {
      handlerShowDialog() {
        this.$store.commit("SET_VISIBLE_DIALOG", true);
      },
      handlerDialogCancel() {
        this.$store.commit("SET_VISIBLE_DIALOG", false);
      },
      handlerDialogItemCancel() {
        this.setIsVisibleDetail(false);
      },
      handlerDialogConfirmCancel() {
        this.setIsVisibleConfirm(false);
      },
      handleConfirmCancel() {
        this.setIsVisible(false);
        this.setIsVisibleConfirm(false);
      },
      handlerDialogSubmit(value: any) {
        if (Object.keys(this.selectedData).length) {
          const id = this.selectedData.id;
          console.log(value, id);
        } else {
          console.log(value);
        }
      },
      pagePaginationChange(_val: any) {
        this.$store.commit("CACHED_PAGINATION", {
          total: this.pagination.total,
          total_pages: this.pagination.total_pages,
          size: _val.size,
          page: _val.page,
        });
        this.setPagination({
          total: this.pagination.total,
          total_pages: this.pagination.total_pages,
          size: _val.size,
          page: _val.page,
          keyword: this.pagination.keyword,
        });
      },
      setupData() {
        this.setLoadingTable(true);
      },
      clearSetup() {
        this.setLoadingTable(true);
      },
      filterTableChange(_val: any) {
        this.setCurrentFilterTable(_val);
      },
      onSendItem(item: Record<string, unknown>) {
        this.setVisibleConfirmSend(true);
        this.selectedDataToSend = { ...item };
      },
      onRemoveItem(item: Record<string, unknown>) {
        this.setVisibleConfirmRemove(true);
        this.selectedDataToRemove = { ...item };
      },
      async onSendPP() {
        const id = this.selectedDataToSend ? this.selectedDataToSend.id : 0;
        const payload = {
          inlcude: "fields,approvers,followers",
        };
        const res = await api.propose.send(`${id}`, payload);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 399) {
            this.$store.commit("SET_SNACKBAR", {
              type: "success",
              title: "",
              content: "Gửi đề xuất thành công",
            });
            this.closeSendDialog();
          } else {
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
          }
          this.getAllPropose(this.queryRoute);
        } catch (error) {
          console.log(error);
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      async onRemovePP() {
        this.removeBtnLoading = true;
        this.messageErrRemove = "";
        const id = this.selectedDataToRemove ? this.selectedDataToRemove.id : 0;
        this.removeBtnLoading = false;
        const res = await api.propose.delete(`${id}`);
        if (!res) {
          this.messageErrRemove =
            "Có lỗi xảy ra do đường truyền, vui lòng thử lại.";
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 400) {
            this.$store.commit("SET_SNACKBAR", {
              type: "success",
              title: "",
              content: "Xoá đề xuất thành công",
            });
            await this.getAllPropose({ ...this.queryRoute });
            this.closeRemoveDialog();
            this.getAllPropose(this.queryRoute);
          } else {
            this.$store.commit("SET_SNACKBAR", {
              type: "error",
              title: "",
              content: res.data.data.error || res.data.message,
            });
            this.messageErrRemove = res.data.data.error || res.data.message;
          }
        } catch (error) {
          console.log(error);
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
        }
      },
      closeSendDialog() {
        this.setVisibleConfirmSend(false);
        this.selectedDataToSend = {};
      },
      closeRemoveDialog() {
        this.messageErrRemove = "";
        this.setVisibleConfirmRemove(false);
        this.selectedDataToRemove = {};
      },
      handlerEdit(item: Record<string, unknown>) {
        this.$router.push(`/de-xuat/chinh-sua/${item.id}`);
      },
      handlerViewDetail(item: Record<string, unknown>) {
        this.setIsVisibleDetail(true);
        this.selectedData = { ...item };
      },
      bindingDefaultFilterHeader(_obj: Record<string, unknown>) {
        let _headers = this.headers.slice();
        const currentQuery: Record<string, unknown> = _obj;

        for (const _key in currentQuery) {
          let _keySplit = _key.split(".");

          if (_keySplit.length === 1) {
            let n = _headers.findIndex(o => o.filters.key === _key);
            if (n !== -1) {
              //  const currentQuery = {..._headers[n]}
              //  const currentQueryF = {..._headers[n].filters}
              //  currentQueryF.defaultValue = currentQuery[_key]
              //  currentQuery.filters = {...currentQueryF}
              //  _headers.splice(n,1,currentQuery)
              if (_headers[n].filters.type === "string") {
                _headers[n].filters.defaultValue = `${currentQuery[_key]}`;
              } else if (_headers[n].filters.type === "select") {
                // _headers[n].filters.defaultValue = _headers[n].filters.items.find(o=>o.id === currentQuery[_key]);
                _headers[n].filters.defaultValue = parseInt(
                  `${currentQuery[_key]}`
                );
              }
            }
          } else {
            const _keyNew: string = _keySplit[1];
            let n = _headers.findIndex(o => o.filters.key === _keySplit[0]);
            if (n !== -1) {
              let obj = { ..._headers[n] };
              let objF = { ..._headers[n].filters };
              let defaultValue = typeof objF.defaultValue === "object" && {
                ...objF.defaultValue,
              };
              obj.filters.defaultValue = {
                ...defaultValue,
              };
              obj.filters.defaultValue[`${_keyNew}`] = currentQuery[`${_key}`];
              _headers.splice(n, 1, obj);
            }
          }
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  @import "@/assets/style/_variables.scss";
  .page-propose {
    .page-content {
      padding-top: 38px;
    }
  }
</style>
