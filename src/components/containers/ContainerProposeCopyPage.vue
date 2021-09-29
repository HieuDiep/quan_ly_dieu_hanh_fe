<template>
  <div class="page-container container-propose-create">
    <div class="page-content">
      <v-tabs-items class="propose-tab-items" v-model="tab">
        <v-tab-item>
          <DraftCopy
            :current-data="currentData"
            :get-current-data="getAllDetail"
          />
        </v-tab-item>
        <v-tab-item> </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script lang="ts">
  import { DraftCopy } from "@/components/containers/propose";
  import useRouteQuery from "@/utils/uses/routerQuery/useRouteQuery";
  import api from "@/services";
  import { ref, onMounted } from "@vue/composition-api";
  export default {
    components: {
      DraftCopy,
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
  .container-propose-create {
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
