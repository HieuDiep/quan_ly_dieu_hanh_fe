<template>
  <div class="page-container page-category">
    <div class="page-content">
      <div class="mb-8 px-5 display-flex">
        <div class="filter-group--mod display-flex align-center">
          <img src="@/assets/images/search-icon.png" height="20" alt="" />
          <input
            class="w-100"
            type="text"
            placeholder="Tìm kiếm đề xuất"
            v-model="pagination.search"
            @keydown.enter="handleSearch(pagination)"
            autofocus
          />
        </div>
        <SharedPagination
          class="mt-0"
          :pagination-sync="pagination"
          @handlePageSizeChange="pagePaginationChange"
          @handlePageChange="pagePaginationChange"
        />
      </div>
      <TableList
        :headers="headers"
        :listCategories="tableData"
        :current-binding-url="queryRoute"
        :table-loading="loadingTable"
        @handleRemoveItem="onRemoveItem"
      />
      <ConfirmRemove
        :is-visible="visibleConfirmRemove"
        :handlerCancel="closeRemoveDialog"
        :messErr="messageErrRemove"
        :handlerConfirm="onRemovePP"
        :title="selectedDataToRemove.name"
        :pre-title="'Xóa danh mục:'"
        :loading-btn="removeBtnLoading"
      >
      </ConfirmRemove>
    </div>
  </div>
</template>

<script lang="ts">
  import api from "@/services";
  import ConfirmRemove from "@/components/popup/ConfirmRemove.vue";
  import { SharedPagination } from "@/components/Shared";
  import {
    defineComponent,
    reactive,
    ref,
    watch,
    computed,
  } from "@vue/composition-api";
  import TextFilter from "@/components/Shared/TextFilter.vue";
  import TableList from "@/components/Table/TableList.vue";
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
  import { NormalHeaderItem } from "@/InterfaceModel/Header";
  import { NormalPagination } from "@/InterfaceModel/Pagination";
  import { IdentifyObject } from "@/InterfaceModel/CustomObject";
  import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
  import route from "@/router/index";

  export default defineComponent({
    components: {
      TextFilter,
      TableList,
      SharedPagination,
      ConfirmRemove,
    },
    setup: (props, ctx) => {
      const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
      const selectedData = ref<Record<string, unknown>>({});
      const loadingTable = ref<boolean>(false);
      const loadingBtn = ref<boolean>(false);
      const visibleConfirmRemove = ref<boolean>(false);
      const isVisible = ref<boolean>(false);
      const isVisibleConfirm = ref<boolean>(false);
      const isVisibleDetail = ref<boolean>(false);
      const currentRouteQuery = ref<string>(stringQueryRender);
      const messageErr = ref<string>("");
      let filterTable = ref({});
      const tableData = ref<Record<string, any>>([]);
      const dataExport = ref<any>("");
      let refInterval = ref<number>(0);
      const selectedDataToRemove = ref<Record<string, unknown>>({});
      let messageErrRemove = ref<string>("");
      let removeBtnLoading = ref<boolean>(false);
      let pagination = ref<NormalPagination>({
        total: 1,
        size: 15,
        total_pages: 15,
        page: 1,
        search: "",
      });
      const keywordComputed = computed(() => {
        return pagination.value.search;
      });
      const headers: NormalHeaderItem[] = [
        {
          text: "Icon",
          align: "start",
          sortable: false,
          value: "avatar",
          class: "no-1",
          width: "60px",
          type: "img",
          filters: {},
        },
        {
          text: "Tên danh mục",
          align: "start",
          sortable: false,
          value: "name",
          class: "no-1",
          type: "string",
          width: "300px",
          filters: {},
        },
        // {
        //  text: "Trạng thái",
        //  align: "start",
        //  sortable: false,
        //  value: "status",
        //  class: "no-1",
        //  type: "number",
        //  width: "120px",
        //  filters: {},
        // },
        {
          text: "Actions",
          align: "center",
          sortable: false,
          value: "actions",
          class: "no-1",
          type: "string",
          width: "60px",
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
      const setVisibleConfirmRemove = (payload: boolean) => {
        visibleConfirmRemove.value = payload;
      };
      watch(currentRouteQuery, currentValue => {
        route.push(`${currentValue}`);
      });
      watch(pagination, currentValue => {
        const { page, size, search } = currentValue;
        setCurrentRouteQuery({
          ...queryRoute,
          search,
          page,
          size,
        });
      });
      watch(keywordComputed, search => {
        if (refInterval.value) {
          clearTimeout(refInterval.value);
        }
        refInterval.value = setTimeout(() => {
          setCurrentRouteQuery({
            ...queryRoute,
            search,
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
      const getAllCategory = async (query: Record<string, unknown>) => {
        setLoadingTable(true);
        if (!Object.keys(query).length) return;
        query.include = "fields,department";
        const res = await api.categories.getAllCates(query);
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
                search: pagination.value.search,
              });
            } else {
              setTableData(res.data.data.categories);
              setPagination({
                total: _pagination.total,
                total_pages: _pagination.total_pages,
                size: _pagination.per_page,
                page: _pagination.current_page,
                search: pagination.value.search,
              });
              //  console.log("==========",pagination);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      return {
        messageErr,
        queryRoute,
        visibleConfirmRemove,
        headers,
        pagination,
        keywordComputed,
        dataExport,
        tableData,
        loadingTable,
        selectedData,
        loadingBtn,
        currentRouteQuery,
        selectedDataToRemove,
        messageErrRemove,
        removeBtnLoading,
        setTableData,
        setLoadingTable,
        setLoadingBtn,
        setCurrentRouteQuery,
        setPagination,
        setIsVisible,
        setIsVisibleConfirm,
        setIsVisibleDetail,
        setCurrentFilterTable,
        setVisibleConfirmRemove,
        getAllCategory,
      };
    },
    data() {
      return {
        isVisible: false,
      };
    },
    computed: {
      ...mapState({
        listCategories: (state: any) => state.categories.listCategories,
        previousPagination: (state: any) => state.previousPagination,
      }),
      ...mapGetters("categories", ["getListcategoryByName"]),
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
          refPagination.search = this.queryRoute.search;
          this.setPagination(refPagination);
        }
        let _obj: any = { ...this.queryRoute };
        delete _obj.size, delete _obj.page;
        this.bindingDefaultFilterHeader(_obj);
      }
      this.getAllCategory({ ...this.queryRoute });
    },
    mounted() {
      this.$store.commit("SET_ADDLIBACTION", () => {
        this.handlerCreateCategory();
      });
    },
    methods: {
      ...mapActions("categories", ["getListCategories"]),
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
          search: this.pagination.search,
        });
      },
      closeRemoveDialog() {
        this.setVisibleConfirmRemove(false);
      },
      handlerCreateCategory() {
        this.$router.push({ path: `/danh-muc/tao-moi` });
      },
      bindingDefaultFilterHeader(_obj: Record<string, unknown>) {
        let _headers = this.headers.slice();
        const currentQuery: Record<string, unknown> = _obj;

        for (const _key in currentQuery) {
          let _keySplit = _key.split(".");

          if (_keySplit.length === 1) {
            let n = _headers.findIndex(o => o.filters.key === _key);
            if (n !== -1) {
              if (_headers[n].filters.type === "string") {
                _headers[n].filters.defaultValue = `${currentQuery[_key]}`;
              } else if (_headers[n].filters.type === "select") {
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
      onRemoveItem(item: Record<string, unknown>) {
        this.setVisibleConfirmRemove(true);
        this.selectedDataToRemove = { ...item };
      },
      async onRemovePP() {
        this.messageErrRemove = "";
        const id = this.selectedDataToRemove ? this.selectedDataToRemove.id : 0;
        this.removeBtnLoading = true;
        const res = await api.categories.delete(id);

        this.removeBtnLoading = false;
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
              content: "Xoá danh mục thành công",
            });
            await this.getAllCategory({ ...this.queryRoute });
            this.closeRemoveDialog();
            this.getAllCategory(this.queryRoute);
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
      handleSearch(e: any) {
        setTimeout(() => {
          this.getAllCategory(e);
        }, 2000);
      },
    },
  });
</script>

<style lang="scss" scoped>
  @import "@/assets/style/_variables.scss";
  .page-category {
    .page-content {
      padding-top: 38px;
    }
  }
</style>
