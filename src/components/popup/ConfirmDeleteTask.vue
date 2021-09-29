<template>
  <v-dialog v-model="isVisible" persistent max-width="622px">
    <v-card>
      <div class="header py-6 pl-6 pr-6">
        <div class="mb-2">
          <div class="d-flex">
            Bạn có chắc chắn muốn xóa công việc "{{ selectedData.title }}" này không ?
          </div>
        </div>
        <div class="mb-0 text-error text-center font-size-14">{{ errMsg }}</div>
      </div>
      <v-card-actions class="p-4 pt-0 d-flex justify-center">
        <v-btn text @click="cancel" class="cancel white--text"> Không </v-btn>
        <v-btn text @click="confirm" class="yes white--text ml-4">
          Xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  reactive,
  ref,
  defineComponent,
  toRef,
  toRefs,
} from "@vue/composition-api";
import { mapState } from "vuex";
import store from "@/store";
export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    handlerCancel: {
      type: Function,
    },
    handlerConfirm: {
      type: Function,
    },
    selectedData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    errMsg: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    let handlerCancel: Record<string, any> = toRef(props, "handlerCancel");
    let handlerConfirm: Record<string, any> = toRef(props, "handlerConfirm");
    const cancel = () => {
      handlerCancel.value();
    };
    const confirm = () => {
      handlerConfirm.value();
    };
    return {
      cancel,
      confirm,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
.header {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
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
  text-transform: none;
}
</style>
