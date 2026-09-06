<template>
  <div
    class="filter-grid"
    :style="{ width: width ? `${width}px` : undefined }"
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
      class="filter-combobox"
      @update:modelValue="
        (value, displayField) => {
          dataFilter.field = value;
          dataFilter.field_name = displayField;
        }
      "
      :readOnly="true"
    ></base-combobox>
    <base-input
      class="filter-input"
      placeholder="Từ khóa tìm kiếm..."
      v-model="dataFilter.text"
      :maxLength="100"
      :width="widthInput"
      @baseKeyup.enter="filter"
    ></base-input>
    <div class="filter-actions">
      <button class="btn-filter pointer" @click="filter()">Lọc</button>
      <span
        v-if="dataFilter.field != 'All' || dataFilter.text"
        class="txt-link delete-filter-btn"
        @click="deleteFilter()"
        title="Xóa bộ lọc"
        >Xóa lọc</span
      >
    </div>
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
  flex-wrap: wrap;
  gap: 8px;

  .filter-input {
    min-width: 140px;
  }

  .filter-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .delete-filter-btn {
    font-size: 12px;
    font-weight: 500;
    color: var(--va-text-secondary, #64748B);
    white-space: nowrap;

    &:hover {
      color: var(--va-danger, #EF4444);
    }
  }

  @media (max-width: 640px) {
    width: 100% !important;
    gap: 8px;

    .filter-combobox {
      width: 100% !important;
      max-width: 100% !important;

      :deep(.base-combobox) {
        width: 100% !important;
      }
    }

    .filter-input {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;

      :deep(.base-input) {
        width: 100% !important;
      }
    }

    .filter-actions {
      width: 100%;
      justify-content: space-between;

      .btn-filter {
        flex: 1;
      }
    }
  }
}
</style>