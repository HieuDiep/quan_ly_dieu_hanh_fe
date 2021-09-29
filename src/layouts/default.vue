<template>
  <div class="container-fluid-t layout-default">
    <keep-alive>
      <SideBar
        :sidebar-is-collapse="sidebarIsCollapse"
        :toggle-colappse="toggleColappse"
      />
    </keep-alive>
    <div class="rest-container" :class="isMini ? 'rest-container-full' : ''">
      <TopMarker />
      <!-- <BreadCrumb v-if="showBC" /> -->
      <keep-alive>
        <slot></slot>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/Layout/Sidebar.vue";
import TopMarker from "@/components/Layout/TopMarker.vue";
//  import BreadCrumb from "@/components/Layout/BreadCrumb.vue";
import { mapState, mapActions } from "vuex";
import axios from "axios";
export default {
  components: {
    SideBar,
    TopMarker,
    // BreadCrumb
  },
  data() {
    return {
      sidebarIsCollapse: false,
      viewWidth: 1920,
      showBC: true,
    };
  },
  mounted() {
    this.viewWidth = window.outerWidth;

    if (this.$route.fullPath.includes("/login")) {
      this.showBC = false;
    } else {
      this.$store.dispatch("getStatistical");
    }
  },

  computed: {
    ...mapState({
      countryList: (state) => state.others.listCountries,
      roleList: (state) => state.others.listRole,
      isMini: (state) => state.isMini,
    }),
  },
  methods: {
    toggleColappse() {
      this.sidebarIsCollapse = !this.sidebarIsCollapse;
    },
  },
};
</script>

<style lang="scss">
.layout-default {
  display: flex;
}
.rest-container {
  padding: 0;
  width: calc(100% - 250px);
  background-color: #f5f6fa;
}
.rest-container-full {
  width: 100%;
}
</style>
