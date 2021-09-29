<template>
  <div class="text-center">
    <v-dialog
      v-model="isVisible"
      width="500"
    >
      <v-card>
        <v-card-title class="p-4">
          Chọn từ máy tính
        </v-card-title>

        <v-card-text class="pb-0">
            <v-file-input
            placeholder="Tài liệu biểu mẫu"
            multiple
            ></v-file-input>
        </v-card-text>

            <v-checkbox
            label="Yêu cầu ký duyệt"
            class="ml-4"
            ></v-checkbox>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="primary"
            text
            @click="btnCancelClick()"
          >
            Lưu
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="btnCancelClick()"
          >
            Hủy
          </v-btn>
        </v-card-actions>
        <v-spacer></v-spacer>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import {defineComponent,ref,watch} from "@vue/composition-api"
export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    handleDialogCancel:{
        type:Function
    }
    
  },
  setup: (props, ctx) => {
    const btnCancelClick= ()=>{
        ctx.emit("handleDialogCancel")
    }
    return {
        btnCancelClick
    };
  },


})
</script>