<template>
 <div
  class="cpn-propose-item d-flex align-center mx-3 pointer w-100"
  @click="handlerCreate(item.id)"
 >
  <img :src="item.avatar" height="32" width="32" alt="" />
  <div class="pl-9 w-100">
   <p class="cards-title m-0 w-100">{{ item.name }}</p>
   <!-- <v-btn @click="handlerCreate(item.id)" class="cards-btn text-transform-unset">
                Tạo mới
            </v-btn> -->
  </div>
 </div>
</template>

<script>
 export default {
  props: {
   item: {
    type: Object,
    default: () => {
     return {};
    },
   },
   createPropose: {
    type: Function,
   },
  },
  methods: {
   handlerCreate(id) {
    this.$router.push(`/de-xuat/tao-moi?cate_id=${id}`);
   },
  },
 };
</script>

<style lang="scss" scoped>
 @import "@/assets/style/_variables.scss";
 .cpn-propose-item {
  border: 1px solid $borderColor;
  padding: 15px;
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
</style>
