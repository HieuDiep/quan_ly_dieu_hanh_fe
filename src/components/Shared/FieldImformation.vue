<template>
  <div class="field-box">
    <div class="feild-name">
      <div class="d-flex align-items-center">
        <div class="page-create-category__body_pp mb-4 w-75">
          <p
            class="
              each-field-title
              font-size-14 font-weight-bold
              text-darkgrey
              mb-2
            "
          >
            Tên trường thông tin
          </p>
          <input
            v-model="dataField.caption"
            type="text"
            :placeholder="'Tên trường thông tin'"
            class="normal-input-outlined font-size-14 text-darkgrey"
          />
        </div>
        <div>
          <div class="page-create-category__body_pp mb-4 pl-4">
            <p
              class="
                each-field-title
                font-size-14 font-weight-bold
                text-darkgrey
                mb-2
              "
            >
              Loại trường
            </p>
            <p class="mb-0 font-size-14">{{ typeFeild.alias }}</p>
          </div>
        </div>
      </div>

      <template v-if="typeFeild.id === 1">
        <v-text-field
          placeholder="Văn bản câu trả lời ngắn "
          v-model="dataField.text"
          class="v-text-field-border-none"
        ></v-text-field>
      </template>
      <template v-if="typeFeild.id === 2">
        <v-textarea
          auto-grow
          v-model="dataField.text_area"
          placeholder="Văn bản câu trả lời dài"
          class="v-text-field-border-none"
          rows="3"
          row-height="20"
        ></v-textarea>
      </template>
      <template v-if="typeFeild.id === 3">
        <div class="">
          <p
            v-for="(vl, idx) in dataField.sendValue"
            :key="`single-${idx}`"
            class="option-feild d-flex align-items-center"
          >
            <!-- <v-icon class="mr-2 font-size-20">mdi-square-outline</v-icon
      > -->
            <input
              type="text"
              :placeholder="`Tùy chọn ${idx + 1}`"
              v-model="vl.txt"
              name=""
              class="d-block multi-opt"
              @keypress.13="addOptionMulti"
            />
            <img
              src="../../assets/images/ic_delete.png"
              alt=""
              class="pointer"
              @click="handleRemoveMultiOption(idx)"
            />
          </p>
          <p class="pointer" @click="addOptionMulti">
            <img src="../../assets/images/small-add.png" alt="" />
          </p>
        </div>
      </template>
      <template v-if="typeFeild.id === 4">
        <div class="">
          <p
            v-for="(vl, idx) in dataField.sendValue"
            :key="`single-${idx}`"
            class="option-feild d-flex align-items-center"
          >
            <!-- <v-icon class="mr-2 font-size-20">mdi-square-outline</v-icon
      > -->
            <input
              type="text"
              :placeholder="`Tùy chọn ${idx + 1}`"
              v-model="vl.txt"
              name=""
              class="d-block multi-opt"
              @keypress.13="addOptionMulti"
            />
            <img
              src="../../assets/images/ic_delete.png"
              alt=""
              class="pointer"
              @click="handleRemoveMultiOption(idx)"
            />
          </p>
          <p class="pointer" @click="addOptionMulti">
            <img src="../../assets/images/small-add.png" alt="" />
          </p>
        </div>
      </template>
      <template v-if="typeFeild.id === 5">
        <div class="field-picker-date">
          <DateRangeTableHeader
            :singleDatePicker="true"
            :show-ranges="false"
            :picked-date="pickedSingleDate"
            :placeholder-picker="'Chọn ngày'"
            :picker-class="'field-picker-date'"
          />
        </div>
      </template>
      <template v-if="typeFeild.id === 6">
        <div class="time-picker-m">
          <input type="time" class="" v-model="dataField.time" />
        </div>
      </template>
      <template v-if="typeFeild.id === 7">
        <div class="field-picker-date d-flex align-items-center mb-3">
          <p class="mb-0 pr-3 date-time-label">Ngày:</p>
          <DateRangeTableHeader
            :singleDatePicker="false"
            :show-ranges="true"
            :picked-date="pickedSingleDate"
            :placeholder-picker="'Chọn ngày'"
            :picker-class="'field-picker-date'"
          />
        </div>
        <div class="d-flex align-items-center">
          <p class="mb-0 pr-3 date-time-label">Giờ:</p>
          <input type="time" class="" v-model="dataField.time" />
        </div>
      </template>
      <template v-if="typeFeild.id === 8">
        <div class="field-picker-date d-flex align-items-center">
          <p class="mb-0 pr-3 date-time-label">Ngày:</p>
          <DateRangeTableHeader
            :singleDatePicker="false"
            :show-ranges="true"
            :picked-date="pickedDate8"
            :placeholder-picker="'Chọn ngày'"
            :picker-class="'field-picker-date'"
          />
        </div>
      </template>
      <template v-if="typeFeild.id === 9">
        <div class="field-picker-date d-flex align-items-center mb-3">
          <p class="mb-0 pr-3 date-time-label">Từ:</p>
          <input type="time" class="" v-model="dataField.time_start" />
        </div>
        <div class="d-flex align-items-center">
          <p class="mb-0 pr-3 date-time-label">Đến:</p>
          <input type="time" class="" v-model="dataField.time_end" />
        </div>
      </template>
      <template v-if="typeFeild.id === 10">
        <div class="">
          <div class="table-inp">
            <table class="table-field">
              <thead>
                <tr>
                  <th
                    v-for="(col, idx) in typeFeild.tableStatistic"
                    :key="col + idx"
                  >
                    <input type="text" v-model="col.name" class="input-trt" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(col, idx) in typeFeild.tableStatistic"
                    :key="col + idx"
                  >
                    <div class="rough-td"></div>
                  </td>
                </tr>
              </tbody>
            </table>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="handleAddCol(typeFeild, idx)"
                  class="pointer mr-2"
                  src="@/assets/add_circle_outline_black_24dp.svg"
                  alt=""
                />
              </template>
              <span>Thêm cột</span>
            </v-tooltip>
          </div>
        </div>
      </template>
      <template v-if="typeFeild.id === 11">
        <!-- <v-autocomplete
          readonly
          class="block-v-list-item__title"
          v-model="dataField.text"
          :items="listUsersComputed"
          item-text="fieldPickTxt"
          item-value="id"
          placeholder="Nhân viên"
        ></v-autocomplete> -->
      </template>
    </div>
    <div
      class="
        feild-action
        border-top-dee5eb
        display-flex
        justify-content-end
        align-items-center
        pt-3
      "
    >
      <div class="icon-gr-wr">
        <!-- <img @click="handlerCopy" class="mr-1" src="@/assets/coppy.png" /> -->

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              @click="handlerCopy(idx)"
              class="mr-2"
              >mdi-content-copy</v-icon
            >
          </template>
          <span>Copy</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" @click="handlerRemove(idx)"
              >mdi-delete</v-icon
            >
          </template>
          <span>Xóa</span>
        </v-tooltip>
      </div>
      <div class="display-flex align-items-center req-gr-wr">
        <span for="" class="mr-2 font-size-14 d-block mb-0">Bắt buộc</span>
        <v-switch
          color="primary"
          v-model="dataField.required"
          input-value="true"
          class="d-inline-block mt-0 mb-0 pt-0 ctm-switch"
        ></v-switch>
      </div>
    </div>
  </div>
</template>

<script>
  import DateRangeTableHeader from "@/components/Shared/DateRangeTableHeader.vue";
  export default {
    components: {
      DateRangeTableHeader,
    },
    data() {
      return {
        dataField: {
          sendValue: [{ txt: "" }],
          single_choice_value: "",
        },
        listOption: [],
        addOptionVal: "",
      };
    },
    computed: {
      listUsersComputed() {
        const arr = [...this.listUsers];

        arr.forEach(o => {
          o.fieldPickTxt = `${o.full_name} - ${o.asgl_id}`;
        });
        return arr;
      },
    },
    props: {
      typeFeild: {
        type: Object,
        default: () => {
          return {};
        },
      },
      handlerRemove: {
        type: Function,
      },
      handleAddCol: {
        type: Function,
        default() {
          console.log("nth");
        },
      },
      handlerCopy: {
        type: Function,
      },
      updateField: {
        type: Function,
      },
      listUsers: {
        type: Array,
        default() {
          return [];
        },
      },
      idx: {
        type: Number,
        default: -1,
      },
    },
    watch: {
      dataField: {
        deep: true,
        handler() {
          const body = {
            ...this.typeFeild,
            ...this.dataField,
          };
          this.updateField(body, this.idx);
        },
      },
    },
    mounted() {
      if (this.typeFeild.id) {
        const obj = { ...this.dataField };
        obj.caption = this.typeFeild.caption;
        obj.required = this.typeFeild.required;

        if ([3, 4].includes(this.typeFeild.id)) {
          if (
            this.typeFeild.dynamic_attributes &&
            this.typeFeild.dynamic_attributes.choices
          ) {
            const sendValue = this.typeFeild.dynamic_attributes.choices.map(
              o => {
                return {
                  txt: o,
                };
              }
            );
            obj.sendValue = sendValue;
          }
        }

        this.$nextTick(() => {
          this.dataField = { ...obj };
        });
      }
    },
    methods: {
      removeOption() {
        console.log("removeOption");
      },
      addOption(e) {
        this.listOption.push(this.addOptionVal);
        this.addOptionVal = "";
      },
      handleRemoveMultiOption(idx) {
        this.dataField.sendValue.splice(idx, 1);
      },
      addOptionMulti() {
        this.dataField.sendValue.push({
          txt: "",
        });
      },
      pickedSingleDate(_val) {
        const obj = { ...this.dataField };
        obj.single_date = _val.value.startDate ? _val.value.startDate : "";
        this.dataField = { ...obj };
      },
      pickedDate8(_val) {
        const obj = { ...this.dataField };
        obj.date_range = _val.value;
        this.dataField = { ...obj };
      },
    },
  };
</script>

<style lang="scss" scopped>
  @import "@/assets/style/_variables.scss";
  .field-box {
    border: 1px solid $borderColor;
    padding: 15px 25px;
    border-radius: 6px;
    .icon-gr-wr {
      padding: 0px 12px;
      border-right: 1px solid #707070;
    }
    .req-gr-wr {
      padding: 0px 12px;
    }
    .field-picker-date {
      .vue-daterange-picker {
        width: 100%;
        .date-range-slot-wrapper-tb {
          padding: 10px 6px;
          height: 40px;
          border: none !important;
          border-bottom: 1px solid $borderColor !important;
          margin-bottom: 0 !important;
        }
      }
    }
    .date-time-label {
      width: 60px;
      font-size: 14px;
      font-weight: 500;
    }
    .table-field {
      margin-right: 4px;
      border: 1px solid #dddcdc;
      border-radius: 4px;
      width: 100%;
      border-collapse: collapse;
      tr {
        th,
        td {
          border: 1px solid #dddcdc;
        }
        .input-trt {
          width: 100%;
          text-align: center;
        }
        .rough-td {
          height: 30px;
          background: #edeef07e;
        }
      }
    }
    .table-inp {
      display: flex;
      align-items: flex-start;
    }
    .table-time-label {
      width: 120px;
      font-size: 14px;
      font-weight: 500;
    }
    .d-block {
      display: block;
    }
    .multi-opt {
      padding: 6px 0;
      border-bottom: 1px solid $borderColor;
      width: 100%;
    }
    .caption {
      input {
        color: $primaryBlack;
        font-weight: 500;
        font-size: 16px;
        &::placeholder {
          color: $textColorBlur;
          font-weight: 500;
          font-size: 16px;
        }
      }
    }
    .option-feild {
      margin-bottom: 0px;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      & > p {
        margin-bottom: 0;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
    .v-input__slot::before {
      border-color: #81888f !important;
    }
    input,
    textarea {
      color: $primaryBlack !important;
      font-size: 14px;
      font-weight: normal;
      &::placeholder {
        font-size: 14px;
        color: $textColorBlur !important;
      }
    }
    .ctm-switch {
      .v-input__slot {
        margin-bottom: 0;
      }
      .v-messages {
        display: none;
      }
    }
    .time-picker-m {
      width: 100%;
      border-bottom: 1px solid $borderColor;
    }
  }
</style>
