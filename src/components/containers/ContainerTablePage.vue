<template>
 <div>
  <v-btn @click="setupData" class="mb-3 mx-3">Setup Data</v-btn>
  <div class="px-3">
   <TableMultiSort :table-data="tableData" :table-loading="loadingTable" :headers="headers" @handleFilterChange="filterTableChange" :current-binding-url="queryRoute" />
   <div class="pt-1">
    <SharedPagination :pagination-sync="pagination" @handlePageSizeChange="pagePaginationChange" @handlePageChange="pagePaginationChange" />
   </div>
  </div>
 </div>
</template>

<script lang="ts">
 import { defineComponent, reactive, ref, watch } from "@vue/composition-api";
 import api from "@/services";
 import TableMultiSort from "@/components/Table/TableMultiSort.vue";
 import { SharedPagination } from "@/components/Shared";
 import { NormalPagination } from "@/InterfaceModel/Pagination";
 import { NormalHeaderItem } from "@/InterfaceModel/Header";
 import { IdentifyObject } from "@/InterfaceModel/CustomObject";
 import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
 import route from "@/router/index";
 import { mapState } from "vuex";
import { filter } from "vue/types/umd";
 export default defineComponent({
  components: {
   TableMultiSort,
   SharedPagination,
  },
  setup: props => {
   const { queryRoute, stringQueryRender, getQueryRoute } = useRouteQuery();
   const loadingTable = ref<boolean>(true);
   const currentRouteQuery = ref<string>(stringQueryRender);
   let tableData = reactive<Record<string, unknown>>({ value: [] });
   let filterTable = ref({})
   let pagination = ref<NormalPagination>({
    total: 1,
    size: 15,
    total_pages: 15,
    page: 1,
   });

   const headers:NormalHeaderItem[] = [
    {
     text: "Dessert (100g serving)",
     align: "start",
     sortable: false,
     value: "mawb",
     type: "string",
     filters: {
      type: "string",
      key: "mawb",
      placeholder: "Tên bộ lọc",
      defaultValue: "",
     },
    },
    {
     text: "Calories",
     value: "calories",
     type: "string",
     filters: {
      type: "select",
      key: "calories",
      placeholder: "Lọc select",
      items: [
       {
        id: 1,
        name: "Lựa chọn 1",
       },
       {
        id: 2,
        name: "Lựa chọn 2",
       },
       {
        id: 3,
        name: "Lựa chọn 3",
       },
      ],
      defaultValue: "",
     },
    },
    {
     text: "Fat (g)",
     value: "fat",
     type: "date",
     filters: {
      type: "daterange",
      key: "fat",
      placeholder: "Tên bộ lọc",
      defaultValue: {},
      hasKey:true,
     },
    },
    {
     text: "Carbs (g)",
     value: "carbs",
     type: "string",
     filters: {
      type: "string",
      key: "carbs",
      placeholder: "Tên bộ lọc",
      defaultValue: "",
     },
    },
    {
     text: "Protein (g)",
     value: "protein",
     type: "string",
     filters: {
      type: "string",
      key: "protein",
      placeholder: "Tên bộ lọc",
      defaultValue: "",
     },
    },
    {
     text: "Iron (%)",
     value: "iron",
     type: "string",
     filters: {
      type: "string",
      key: "iron",
      placeholder: "Tên bộ lọc",
      defaultValue: "",
     },
    },
    { text: "Actions", value: "actions", sortable: false,filters:{} },
   ];
   Object.freeze(headers)
   const setTableData = (payload: Record<string, unknown>[]) => {
    tableData.value = payload;
   };
   const setPagination = (payload: NormalPagination) => {
    pagination.value = { ...payload };
   };
   const setCurrentRouteQuery = (payload: Record<string, unknown>): any => {
    let pairO = new IdentifyObject({
      ...payload
    });
    currentRouteQuery.value = getQueryRoute(pairO.identifySelf());
   };
    const setCurrentFilterTable = (payload: Record<string, unknown>): any => {
      filterTable.value = {...payload}
    };
   const setLoadingTable = (payload: boolean) => {

    loadingTable.value = payload;
   };

   watch(currentRouteQuery, currentValue => {
    route.push(`${currentValue}`);
   });
   watch(pagination, currentValue => {
    const { page, size } = currentValue;
    setCurrentRouteQuery({ 
      ...queryRoute,
      page, 
      size 
      });
   });
   
   watch(filterTable,currentValue=>{
     
     setCurrentRouteQuery({
        ...queryRoute,
        ...currentValue
      });
   })

   const getAllRoles = async (query: Record<string, unknown>) => {
    const res = await api.roles.getAll(query);
    setLoadingTable(false);
    if (!res) {
     return;
    }
    try {
     const pagination = res.data.meta.pagination;
     setTableData(res.data.data);
    //  setPagination({
    //   total: pagination.total,
    //   total_pages: pagination.total_pages,
    //   size: pagination.per_page,
    //   page: pagination.current_page,
    //  });
    } catch (error) {
     console.log(error);
    }
   };
   return {
    headers,
    pagination,
    loadingTable,
    tableData,
    queryRoute,
    filterTable,
    setTableData,
    setLoadingTable,
    setCurrentRouteQuery,
    setPagination,
    getAllRoles,
    setCurrentFilterTable,
    currentRouteQuery
   };
  },
  watch: {},
  computed: {
   ...mapState({
    previousPagination: (state: any) => state.previousPagination,
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
      this.setPagination(refPagination);
   }
    let _obj:any =  {...this.queryRoute}
    delete _obj.size,
    delete _obj.page
    // this.setCurrentFilterTable(_obj)

    // this.setCurrentRouteQuery(this.queryRoute)
    this.bindingDefaultFilterHeader(_obj)
   }
   this.getAllRoles({ ...this.queryRoute });
  },
  methods: {
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
    });
   },
   setupData() {
    this.setLoadingTable(true);
   },
   clearSetup() {
    this.setLoadingTable(true);
   },
   filterTableChange(_val:any){
     
    this.setCurrentFilterTable(_val) 
   },
   bindingDefaultFilterHeader(_obj: Record<string, unknown>){
     let _headers = this.headers.slice();
     const currentQuery:Record<string, unknown> = _obj
     
     for(const _key in currentQuery){
        let _keySplit = _key.split('.')
       
        if(_keySplit.length===1){
          let n = _headers.findIndex(o => o.filters.key === _key )
          if(n !== -1){
          
          //  const currentQuery = {..._headers[n]}
          //  const currentQueryF = {..._headers[n].filters}
          //  currentQueryF.defaultValue = currentQuery[_key]
          //  currentQuery.filters = {...currentQueryF}
          //  _headers.splice(n,1,currentQuery)
            if(_headers[n].filters.type === 'string'){
              _headers[n].filters.defaultValue = `${currentQuery[_key]}`
            }else if(_headers[n].filters.type === 'select'){
              // _headers[n].filters.defaultValue = _headers[n].filters.items.find(o=>o.id === currentQuery[_key]);
              _headers[n].filters.defaultValue =  parseInt(`${currentQuery[_key]}`);
              
            }
          }
        }
        else{
          const _keyNew:string = _keySplit[1]
          let n = _headers.findIndex(o => o.filters.key === _keySplit[0])
          if(n !== -1){
          
           let obj = {..._headers[n]}
           let objF = {..._headers[n].filters}
           let defaultValue = typeof(objF.defaultValue)==="object"&&{...objF.defaultValue}
            obj.filters.defaultValue = {
              ...defaultValue,
            }
            obj.filters.defaultValue[`${_keyNew}`] = currentQuery[`${_key}`]
           _headers.splice(n,1,obj)
           
          }
        }
       
      }
       
     }
  },
 });
</script>

<style></style>
