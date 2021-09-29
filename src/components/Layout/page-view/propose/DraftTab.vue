<template>
 <div class="cpn-draft-tab">
  <v-tabs v-model="tab">
   <v-tab>Hoạt động</v-tab>
   <v-tab>Người theo dõi</v-tab>
   <v-tab>Công việc</v-tab>
   <v-tab>Liên quan</v-tab>
  </v-tabs>
  <v-tabs-items v-model="tab">
   <v-tab-item>
    <!-- <TabActivate/> -->
   </v-tab-item>
   <v-tab-item> </v-tab-item>
   <v-tab-item> </v-tab-item>
  </v-tabs-items>
 </div>
</template>

<script>
 import { ref, defineComponent } from "@vue/composition-api";
 //  import TabActivate from "./TabActivate";
 export default {
  components: {
   //    TabActivate,
  },
  setup(props) {
   const tab = ref(1);

   return {
    tab,
   };
  },
 };
</script>

<style lang="scss">
 @import "@/assets/style/_variables.scss";
 .cpn-draft-tab {
  .v-tabs-bar {
   .v-slide-group__content {
    justify-content: space-between;
   }
   .v-tab {
    font-size: 16px;
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
  .v-slide-group__wrapper {
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
 }
</style>
