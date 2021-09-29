<template>
  <div class="text-center">
    <v-dialog
      v-model="isVisibleApproval"
      width="600"
    >
      <v-card>
        <v-card-title class="p-4">
          Thêm người phê duyệt mặc định
        </v-card-title>
        <v-card-text class="pb-0">
                <v-text-field
                  required
                  label="Tìm kiếm"
                  outlined
                ></v-text-field>
        </v-card-text>
        <v-container>
             <label class="font-weight-bold mb-2" for="">Công ty</label>
            <v-select
                  :items="['Samsung','Apple']"
                  required
                  outlined
            ></v-select>
             <label class="font-weight-bold mb-2" for="">Phòng ban</label>
            <v-select
                  :items="['IT', 'Marketing']"
                  required
                  outlined
            ></v-select>
             <label class="font-weight-bold mb-2" for="">Danh bạ</label>
                <v-list
                    subheader
                    two-line
                    flat
                >
                <v-list-item-group
                    multiple
                >
                    <v-list-item v-for="item in settings" :key="item.title">
                        <template v-slot:default="{ active}">
                            <v-list-item-content>
                            <v-list-item-title>{{item.title}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.subtitle}}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-checkbox
                                    :input-value="active"
                                    color="primary"
                                ></v-checkbox>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </v-list-item-group>
                </v-list>
        </v-container>

        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="primary"
            text
            @click="btnCancelClick()"
          >
            Thêm
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
import TextFilter from "@/components/Shared/TextFilter.vue"
import TableFiltersSelect from "@/components/Shared/TableFiltersSelect.vue"

export default defineComponent({
  components:{
    TextFilter,
    TableFiltersSelect
  },
  props: {
    isVisibleApproval: {
      type: Boolean,
      default: false,
    },
    handleDialogCancel:{
        type:Function
    },
    header:{
        type:[]
    },
    settings:{
        type:[]
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