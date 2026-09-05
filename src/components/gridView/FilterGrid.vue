<template>
  <div
    class="filter-grid"
    :style="{ width: `${width}px` }"
    :class="{ 'w-100': !width }"
  >
    <base-combobox
      title="Chọn trường tìm kiếm"
      valueField="field"
      displayField="field_name"
      :chosenValue="dataFilter.field"
      :initText="dataFilter.field_name"
      :data="dataFields"
      :width="widthCombo"
      @update:modelValue="
        (value, displayField) => {
          dataFilter.field = value;
          dataFilter.field_name = displayField;
        }
      "
      :readOnly="true"
    ></base-combobox>
    <base-input
      class="ml-2"
      v-model="dataFilter.text"
      :maxLength="100"
      :width="widthInput"
    ></base-input>
    <button class="ml-2 btn-filter pointer" @click="filter()">Lọc</button>
    <span
      v-if="dataFilter.field != 'All' || dataFilter.text"
      class="txt-link ml-2"
      @click="deleteFilter()"
      >xóa</span
    >
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  nextTick,
  getCurrentInstance,
} from "vue";
import BaseCombobox from "@/components/combobox/BaseCombobox.vue";
import _ from "lodash";

export default defineComponent({
  name: "FilterGrid",
  components: {
    BaseCombobox,
  },
  props: {
    /**
     * modelValue đẩy ra ngoài để binding 2 chiều
     */
    modelValue: {
      type: Object,
      default: {
        text: "",
        field: "All",
        field_name: "Tất cả",
      },
    },
    placeholder: {
      fault: null,
      type: [Number, String],
    },
    width: {
      type: [Number, String],
      default: null,
    },
    widthCombo: {
      type: [Number, String],
      default: 150,
    },
    widthInput: {
      type: [Number, String],
      default: 200,
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "focus", "blur", "change", "baseKeyup", "input"],
  setup(props, { emit }) {
    const dataFilter = ref({});
    const oldDataFilter = ref({});
    const dataFields = ref([]);
    const { proxy } = getCurrentInstance();
    // Hook
    onMounted(() => {
      nextTick(() => {
        dataFilter.value.text = props.modelValue.text;
        dataFilter.value.field = props.modelValue.field;
        dataFilter.value.field_name = props.modelValue.field_name;
        oldDataFilter.value = _.cloneDeep(dataFilter.value);
        dataFields.value = _.cloneDeep(props.fields);
      });
    });
    // watch(
    //   () => dataFilter.value,
    //   (value) => {
    //     if (value !== props.modelValue) {
    //       emit("update:modelValue", value, props.field);
    //     }
    //   }
    // );
    const deleteFilter = () => {
      dataFilter.value.field = "All";
      dataFilter.value.field_name = "Tất cả";
      dataFilter.value.text = "";
      emit("update:modelValue", dataFilter.value);
    };
    var timeout;
    const filter = () => {
      // if (
      //   oldDataFilter.value.text !== dataFilter.value.text ||
      //   oldDataFilter.value.field !== dataFilter.value.field
      // ) {
      //   emit("update:modelValue", dataFilter.value);
      //   oldDataFilter.value = _.cloneDeep(dataFilter.value);
      // }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        emit("update:modelValue", dataFilter.value);
        oldDataFilter.value = _.cloneDeep(dataFilter.value);
      }, 300);
    };

    return {
      dataFilter,
      oldDataFilter,
      dataFields,
      deleteFilter,
      filter,
    };
  },
});
</script>

<style lang="scss" scoped>
.filter-grid {
  display: flex;
  align-items: center;
}
</style>