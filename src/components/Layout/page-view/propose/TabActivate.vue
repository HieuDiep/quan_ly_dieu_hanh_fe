<template>
    <div class="cpn-draft-tab">
        <ListItem
            name='Nguyễn Văn A'
            content='Trưởng phòng tài chính'
        />
    </div>
</template>

<script>
import { ref,defineComponent } from '@vue/composition-api'
import ListItem from "./ListItem.vue"
export default {
    components:{
        ListItem
    },
    setup(props) {
        const tab = ref(1)

        return {
            tab
        } 
    }
}
</script>

<style lang="scss">
    
</style>