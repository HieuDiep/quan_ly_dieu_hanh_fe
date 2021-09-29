<template>
  <div class="cpn-draft-tab--m custom-model-tab">
    <v-tabs v-model="tab" grow>
      <v-tab>Hoạt động</v-tab>
      <v-tab>Người theo dõi</v-tab>
      <v-tab>Công việc</v-tab>
      <v-tab>Liên quan</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="px-3">
      <v-tab-item>
        <div class="d-flex flex-column justify-content-between activity-wr--m">
          <ProposeActivity :ref-get-act="refGetAct" />
          <v-divider></v-divider>
          <ProposeComment />
        </div>
      </v-tab-item>
      <v-tab-item>
        <ProposeFollower :set-ref-get-act="setRefGetAct" />
      </v-tab-item>
      <v-tab-item> </v-tab-item>
    </v-tabs-items>
    <DialogAddJob
      :is-visible="isVisible"
      @handlerCancel="handlerDialogCancel"
      @handlerSubmit="handlerDialogSubmit"
    />
  </div>
</template>

<script>
  import { ref, defineComponent } from "@vue/composition-api";
  import DialogAddJob from "@/components/Form/DialogAddJob.vue";
  import ProposeActivity from "../../ProposeActivity.vue";
  import ProposeFollower from "../../ProposeFollower.vue";
  import ProposeComment from "../../ProposeComment.vue";
  // import TabActivate from "./TabActivate";
  export default {
    components: {
      DialogAddJob,
      ProposeActivity,
      ProposeComment,
      ProposeFollower,
      // TabActivate,
    },
    setup(props) {
      const tab = ref(0);
      const isVisible = ref(false);
      const refGetAct = ref(1);
      const setIsVisible = value => {
        isVisible.value = value;
      };
      const setRefGetAct = value => {
        refGetAct.value = value;
      };
      return {
        tab,
        isVisible,
        refGetAct,
        setIsVisible,
        setRefGetAct,
      };
    },
    methods: {
      openDialogAdd() {
        this.setIsVisible(true);
      },
      handlerDialogCancel() {
        this.setIsVisible(false);
      },
      handlerDialogSubmit(value) {
        console.log(value);
      },
    },
  };
</script>

<style lang="scss">
  @import "@/assets/style/_variables.scss";
  .cpn-draft-tab--m {
    .v-tabs-bar__content {
      border-bottom: 1px solid #dee5eb;
    }
    .v-tabs-bar {
      .v-tab {
        font-size: 14px;
        text-transform: unset;
        color: $textColorBlur;
        font-weight: 600;
        &.v-tab--active {
          color: $primaryText;
        }
      }
      .v-tabs-slider-wrapper {
        color: $primaryText;
      }
    }
    .btn-open-add {
      color: #ffffff;
      background: $GPEblueText;
      font-size: 14px;
      height: 40px !important;
      width: 188px;
      text-transform: none;
    }
  }
  .custom-model-tab {
    .v-slide-group__wrapper {
      height: 46px;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        width: 5px;
        height: 7px;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        background-color: transparent;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 0, 0, 0);
        border-radius: 3px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
      }
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: #c3c5c7;
          border-radius: 3px;
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
        }
      }
    }
    .v-slide-group__next {
      display: none !important;
    }
    .v-slide-group__prev {
      display: none !important;
    }
    .v-tabs-bar {
      .v-tab {
        margin-top: auto;
        height: 32px;
      }
    }
  }
  .activity-wr--m {
    height: calc(100vh - 240px);
  }
</style>
