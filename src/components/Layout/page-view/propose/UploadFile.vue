<template>
  <div>
        <label
            for="upload_file" 
            class="box-uploadFile display-flex align-center pointer"
            :class="{
                'text-decoration-underline':underline,
                'icon-left':iconLeft
            }"

        >
            <span v-if="content">{{content}}</span>
            <img src="@/assets/images/upload-file.svg"  height="20" alt="">
        </label>
        <input type="file" multiple id="upload_file" class="d-none" @change="handlerChangeFileUpload">
  </div>
</template>

<script lang="ts">
import { ref,defineComponent, computed } from '@vue/composition-api'
import { getImageDimensions } from '@/utils';
import useUploadFile from '@/utils/uses/uploadFile/useUploadFile';
export default {
    props:{
        content:{
            type:String,
            default:""
        },
        underline:{
            type:Boolean,
            default:false
        },
        iconLeft:{
            type:Boolean,
            default:false
        },
        changeFileUpload:{
            type:Function,
        },
        
    },
    setup(props:any,ctx:any){
        const handlerChangeFileUpload = (event:any)=>{
            const files = event.target.files;
            useUploadFile(files).then(response => {
                ctx.emit('changeFileUpload',response)
            });


            
        };
        return{
            handlerChangeFileUpload
        }
    }

}
</script>

<style lang="scss" scoped>
    .box-uploadFile{
        &.icon-left{
            span{
                order: 2;
            }
            img{
                order: 1;
                margin-right: 10px;
            }
        }
        &:not(.icon-left){
            img{
                margin-left: 10px;
            }
        }
    }
</style>