<template>
  <div class="page-task page-container">
    <!-- <div class=" mb-4 page-header">
    <span class="title-page font-size-32 font-weight-bold text-uppercase display-flex align-center">
      <span class="align-justify-center mr-4 pointer btn-back-page">
        <img src="@/assets/images/arrow-left.svg" alt="">
      </span>
      Bag List
    </span>
  </div> -->
    <div class="page-content"></div>
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
import TableApproval from "@/components/Table/TableApproval.vue";
import ConfirmRemove from "@/components/popup/ConfirmRemove.vue";
import ConfirmCancel from "@/components/popup/ConfirmCancel.vue";
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
  components: {},

  computed: {
    ...mapState({
      previousPagination: (state: any) => state.previousPagination,
    }),
  },
  methods: {},
});
</script>

<style lang="scss">
@import "@/assets/style/_variables.scss";
.page-task {
  .page-content {
    padding-top: 38px;
  }
}
</style>
