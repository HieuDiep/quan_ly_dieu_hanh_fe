<template>
  <div>
    <div
      v-if="templateDetail"
      v-html="templateDetail.filled_html"
      class="inner-title-content"
    ></div>
    <img
      src="@/assets/images/print-img.png"
      class="btn-print"
      alt=""
      @click="onPrint"
    />
  </div>
</template>

<script>
  import api from "@/services";
  export default {
    data() {
      return {
        cateId: 0,
        currentId: 0,
        templateDetail: null,
      };
    },
    watch: {
      $route() {
        if (this.$route.params) {
          this.currentId = this.$route.params.id;
        }
        if (this.$route.query) {
          this.cateId = this.$route.query.c;
        }
        this.getDetailTemplate();
      },
    },
    mounted() {
      if (this.$route.params) {
        this.currentId = this.$route.params.id;
      }
      if (this.$route.query) {
        this.cateId = this.$route.query.c;
      }
      this.getDetailTemplate();
    },
    methods: {
      async getDetailTemplate() {
        const res = await api.template.detail(this.cateId, this.currentId);
        if (!res) {
          this.$store.commit("SET_SNACKBAR", {
            type: "error",
            title: "",
            content: "Lỗi hệ thống, liên hệ IT để được hỗ trợ.",
          });
          return;
        }
        try {
          if (res.status > 199 && res.status < 400) {
            this.templateDetail = res.data.data.sign_document;
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
      onPrint() {
        window.print();
      },
    },
  };
</script>

<style lang="scss" scopped>
  .inner-title-content {
    display: block;
    margin: auto;
    min-width: 21cm !important;
    width: 21cm;
    /* max-height: calc(100vh - 250px); */
    /* overflow-x: scroll; */
    background: #fff !important;
    border: unset !important;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  .btn-print {
    position: fixed;
    cursor: pointer;
    right: 20px;
    bottom: 30px;
    width: 60px;
    height: 60px;
  }
  @media print {
    .btn-print {
      display: none;
    }
    .inner-title-content {
      box-shadow: none !important;
    }
  }
</style>
