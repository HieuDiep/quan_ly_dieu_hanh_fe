<template>
 <div class="main-login">
  <ContainerLogin />
 </div>
</template>

<script lang="ts">
 import { reactive, ref, defineComponent } from "@vue/composition-api";
 import DefaultLayout from "@/layouts/default.vue";
 import ContainerLogin from "@/components/containers/ContainerLogin.vue";
 import { mapState } from "vuex";
 export default defineComponent({
  components: {
   DefaultLayout,
   ContainerLogin,
  },
  setup: () => {
   return {};
  },
  computed: {
   ...mapState({
    auth: (state: any) => state.auth,
   }),
  },
  mounted() {
   if (this.auth.user && this.auth.user.id) {
    this.$router.push("/");
   }
  },
  watch: {
   auth: {
    deep: true,
    handler() {
     if (this.auth.user && this.auth.user.id) {
      this.$router.push("/");
     }
    },
   },
  },
  methods: {},
 });
</script>

<style>
 .main-login {
  padding-right: 12px !important;
  padding-left: 12px !important;
  padding-top: 0px;
  /* background-color: #034ea2; */
  height: 100%;
 }
 .col-6 {
  flex: 0 0 50%;
  max-width: 50%;
 }
</style>
