<template>
  <div class="text-center">
    <v-dialog
      v-model="isVisible"
      width="622"
    >
      <v-card>
        <v-card-title class="Create-New-Project d-flex justify-space-between font-weight-regular">
          <div class="text-title">Chọn chữ ký mẫu</div> 
          <v-icon class="cursor: pointer" style="border: solid 1px #dee5eb;" @click="btnCancelClick()">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pb-0">
          <div class="d-flex align-center blue--text">
            <v-checkbox
            v-model="checkbox1"
            ></v-checkbox>
            <img class="pointer mr-2" src="@/assets/images/car.png" alt=""> 
            <div class="">chữ ký hiện tại</div>
          </div>
          <div class="d-flex align-center">
             <v-checkbox
              v-model="checkbox2"
              ></v-checkbox>
              <div class="text-decoration-underline red--text cursor: pointer">tải lên chữ ký mới</div>
          </div>
         
        </v-card-text>
        <v-container>
        </v-container>

        <v-card-actions class="d-flex justify-end Rectangle-3">
        <v-btn
        color="#2F6BFF"
        class="create-button"
        @click="btnCancelClick()"
        >
        Lưu
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
<style scoped>
.text-title{
  color: #8194a5;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
}
.Rectangle-3 {
  width: 622px;
  height: 72px;
  background-color: #f2f4f6;
}

.create-button {
  width: 98px;
  height: 40px;
  mix-blend-mode: normal;
  opacity: 0.9;
  height: 40px !important;
  font-weight: 700;
  border-radius: 8px;
  color: #ffff;
  font-size: 14px !important;
  text-transform: none;
  box-shadow: none;
}
</style>
