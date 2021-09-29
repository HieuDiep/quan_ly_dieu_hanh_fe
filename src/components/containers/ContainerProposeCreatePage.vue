<template>
 <div class="page-container container-propose-create">
  <div class="page-content">
   <v-tabs-items class="propose-tab-items" v-model="tab">
    <v-tab-item>
     <Drafts />
    </v-tab-item>
    <v-tab-item> </v-tab-item>
   </v-tabs-items>
  </div>
 </div>
</template>

<script>
 import { Drafts } from "@/components/containers/propose";
 export default {
  components: {
   Drafts,
  },
  data() {
   return {
    tab: 0,
   };
  },
  created() {
   this.$store.commit("SET_SHOWFILTER", false);
   this.$store.commit("SET_ADDLIB", false);
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
 .each-status {
  color: $textColorBlur;
  .v-icon {
   color: $textColorBlur;
  }
  &.status--active {
   color: $primaryText;
   font-weight: bold;
   .v-icon {
    color: $primaryText;
   }
  }
 }
</style>
