<template>
 <v-dialog v-model="isVisible" persistent max-width="622" height="450">
  <v-card class="dialog-propose">
   <v-card-title class="text-h5 mb-4">
    <div class="w-100 display-flex align-center justify-space-between">
     <span class="font-size-14 font-weight-bold text-blur-color">
      Tạo mới đề xuất
     </span>
     <v-icon class="btn-close pointer" @click="btnCancelClick"
      >mdi-close</v-icon
     >
    </div>
   </v-card-title>
   <v-card-actions>
    <div class="cpn-text-filter display-flex align-center">
     <img src="@/assets/images/search-icon.png" height="20" alt="" />
     <input class="w-100" type="text" placeholder="Tìm kiếm loại đề xuất" />
    </div>
   </v-card-actions>
   <v-card-text class="p-0" id="scroll-target">
    <div class="mt-6 mx-7 pb-3">
     <v-virtual-scroll
      :items="cards"
      :item-height="50"
      height="300"
      class="mb-16 ov-y"
     >
      <template v-slot:default="{ item }" class="mx-5">
       <v-list-item class="cpn-propose-item w-100 each-cate">
        <div class="d-flex align-center w-100">
         <img :src="item.avatar" height="32" width="32" alt="" />
         <div class="pl-9 w-100">
          <p @click="createPropose(item.id)" class="pointer cards-title m-0">
           {{ item.name }}
          </p>
         </div>
        </div>
       </v-list-item>
      </template>
     </v-virtual-scroll>
    </div>
   </v-card-text>
  </v-card>
 </v-dialog>
</template>

<script>
 import { mapState } from "vuex";
 export default {
  props: {
   isVisible: {
    type: Boolean,
    default: false,
   },
   handlerCancel: {
    type: Function,
   },
   handlerSubmit: {
    type: Function,
   },
  },
  data() {
   return {};
  },
  setup: (props, ctx) => {
   const btnCancelClick = () => {
    ctx.emit("handlerCancel");
   };
   const createPropose = key => {
    console.log(key);
    ctx.root.$router.push(`/de-xuat/tao-moi?cate_id=${key}`);
   };
   return {
    btnCancelClick,
    createPropose,
   };
  },
  computed: {
   ...mapState({
    cards: states => states.categories.listCategories,
   }),
  },
 };
</script>

<style lang="scss" scoped>
 @import "@/assets/style/_variables.scss";
 .dialog-propose {
  .btn-close {
   border: 1px solid $borderColor;
   border-radius: 8px;
   height: 36px;
   width: 36px;
   color: $txtPrimary;
  }
  .cpn-text-filter {
   padding: 0 10px;
   border: 1px solid $borderColor;
   border-radius: 6px;
   width: 564px;
   height: 36px;
   margin: 0 auto;
   img {
    height: 16px;
   }
   input {
    padding: 0 10px;
    outline: none;
    font-size: 12px;
    &::placeholder {
     font-size: 11px;
     color: $textColorBlur !important;
    }
   }
  }
  .cpn-propose-item {
   border: 1px solid $borderColor;
   height: 100%;
   width: 100%;
   .cards-title {
    font-size: 14px;
    font-weight: bold;
    color: #223140;
    font-family: Roboto;
    line-height: 1.29;
   }
   // .cards-btn{
   //     height:40px;
   //     font-size: 14px;
   //     font-weight: bold;
   //     color:$primaryWhite;
   //     background: $mainColor;
   //     border-radius: 8px;
   // }
  }
  .each-cate {
   &:hover {
    background-color: #006a9b27 !important;
   }
  }
  .ov-y {
   &::-webkit-scrollbar {
    width: 4px;
    height: 6px;
    opacity: 0;
   }

   &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    border-radius: 10px;
   }

   &::-webkit-scrollbar-thumb {
    border-radius: 10px;
   }
   &:hover {
    &::-webkit-scrollbar-thumb {
     background: rgba(0, 0, 0, 0.15);
    }
   }
  }
 }
</style>
