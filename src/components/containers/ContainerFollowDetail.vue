<template>
 <div class="page-container container-follow-create">
  <div class="page-content">
   <div class="display-flex bd-bottom justify-content-between align-center px-5">
    <!-- <div> -->
    <p class="font-weight-bold mb-0 font-size-14 text-blur-color">Mã số 1234</p>
    <!-- <div>
                    <v-btn class="mr-2 text-transform-unset">
                        Tạo mới
                    </v-btn>
                    <v-btn class="mr-2 text-transform-unset">
                        Hủy bỏ
                    </v-btn>
                    <v-btn class="mr-2 text-transform-unset">
                        Gửi yêu cầu
                    </v-btn>
                </div> -->
    <!-- </div> -->
    <v-tabs v-model="tab" class="w-auto propose-tab">
     <v-tab>
      Nháp
      <v-icon> mdi-chevron-right </v-icon>
     </v-tab>
     <v-tab>
      Đã gửi
      <v-icon> mdi-chevron-right </v-icon>
     </v-tab>
     <v-tab>
      Đã phê duyệt
      <v-icon> mdi-chevron-right </v-icon>
     </v-tab>
     <v-tab>
      Không phê duyệt
      <v-icon> mdi-chevron-right </v-icon>
     </v-tab>
     <v-tab> Hủy </v-tab>
    </v-tabs>
   </div>
   <v-tabs-items class="propose-tab-items" v-model="tab">
    <v-tab-item>
     <Form />
    </v-tab-item>
    <v-tab-item> aaaaaaaa </v-tab-item>
    <v-tab-item>
     <FormFollow />
    </v-tab-item>
   </v-tabs-items>
  </div>
 </div>
</template>

<script lang="ts">
 import { Form, FormFollow } from "@/components/containers/follow";
 import { defineComponent, reactive, ref, watch, onMounted, computed } from "@vue/composition-api";
 import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
 import api from "@/services";
 export default {
  components: {
   Form,
   FormFollow,
  },
  data() {
   return {
    tab: 0,
   };
  },
  setup: () => {
   const { queryRoute, stringQueryRender, getQueryRoute, currentParram } = useRouteQuery();
   let checkData = ref<Record<string, any>>({});
   const getAllDetail = async () => {
    const _id = currentParram;
    const res = await api.approval.getDetail(_id);
    if (!res) {
     return;
    }
    try {
     // setDetailData(res.data.data.manifest);
     // setDetailData2(formData.value.flighted_at.split(" "));
     //  setPagination({
     //   total: pagination.total,
     //   total_pages: pagination.total_pages,
     //   per_page: pagination.per_page,
     //   page: pagination.page,
     //  });
    } catch (error) {
     console.log(error);
    }
   };
   onMounted(getAllDetail);
   return {
    checkData,
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
 .container-follow-create {
  .propose-tab {
   .v-item-group {
    background-color: unset;
    .v-tabs-slider-wrapper {
     display: none;
    }
    .v-slide-group__content {
     justify-content: flex-end;
     .v-tab {
      text-transform: unset;
      padding: 0;
      min-width: unset;
      color: $textColorBlur;
      .v-icon {
       color: $textColorBlur;
      }
      font-weight: normal;
      &.v-tab--active {
       color: $primaryText;
       font-weight: bold;
       .v-icon {
        color: $primaryText;
       }
      }
     }
    }
   }
  }
 }
</style>
