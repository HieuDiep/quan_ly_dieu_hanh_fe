<template>
  <v-dialog v-model="logoutIsOpen" persistent max-width="500px">
    <v-card>
      <v-card-title class="header py-5">
        <p class="mb-0 py-5">Do you really want to delete?</p>
      </v-card-title>
      <v-card-actions class="p-4 pt-0 d-flex justify-center">
        <v-btn text @click="cancel" class="cancel white--text"> Cancel </v-btn>
        <v-btn :loading="loadingBtn" text @click="deleteItem" class="yes white--text">
          Delete
        </v-btn>
      </v-card-actions>
      <!-- <div class="sign-out">
        <div class="header">Do you really want to Sign out?</div>
        <div class="buttons">
          <div class="cancel" @click="cancel">Cancel</div>
          <div class="yes" @click="signOut">Yes</div>
        </div>
      </div> -->
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { reactive, ref, defineComponent } from "@vue/composition-api";
import store from "@/store";
export default defineComponent({
  setup: () => {
    return {};
  },
  watch: {},
  props: {
    logoutIsOpen: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Function,
    },
    deleteItem: {
      type: Function,
    },
    loadingBtn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {},
});
</script>
<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
.header {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 37px;
  letter-spacing: -0.114286px;
  color: $primaryBlack;
}
 .cancel {
  background-color: $txtPrimary;
  color: $primaryWhite;
  border-radius: 8px;
  padding: 0 8px;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  height: 40px;
  width: 98px;
  text-align: center;
  letter-spacing: -0.0642857px;
  padding-top: 6px;
  color: $primaryText;
  cursor: pointer;
  text-transform: capitalize;
 }
 .yes {
  padding: 0 8px;
  height: 40px;
  width: 98px;
  cursor: pointer;
  background: $dangerColor;
  mix-blend-mode: normal;
  opacity: 0.9;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  line-height: 30px;
  padding-top: 6px;
  text-align: center;
  letter-spacing: -0.0642857px;
  color: $primaryWhite;
  text-transform: capitalize;
 }
</style>
