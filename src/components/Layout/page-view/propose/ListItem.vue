<template>
    <div class="cpn-list-item display-flex align-center">
        <v-avatar
            size="30"
        >
            <img src="@/assets/logo.png" alt="Avatar">
        </v-avatar>
        <div class="pl-3">
            <p class="name mb-1">{{name}}</p>
            <p class="content mb-0">{{content}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        name:{
            type:String,
            default:""
        },
        content:{
            type:String,
            default:""
        },
        
    },

}
</script>

<style lang="scss" scoped>
    // .cpn-list-item{
    //     border-bottom: 1px solid;
    // }
</style>