<template>
  <div
    class="base-dropdown"
    :class="{ 'w-100': !width }"
    :style="[{ width: width + 'px' }]"
  >
    <div class="dropdown-container" @click="toggleDropdown">
      <base-input
        ref="inputdropdown"
        :placeholder="placeholder"
        :modelValue="internalText"
        readOnly
      >
      </base-input>
      <div
        ref="select"
        style="z-index: 4"
        v-show="isShow && listData.length > 0"
        class="select-custom"
        :class="directionDrop"
        :style="[{ width: width + 'px' }]"
      >
        <div
          v-for="(option, index) in listData"
          :key="index"
          @click="evtMouseChoosingOption(option)"
          class="option"
          :class="[
            option.isPointed ? 'point-option' : '',
            option.isChosen ? 'show-select' : '',
          ]"
          :ref="'option' + index"
        >
          <div
            class="option-content none-pointer"
            :style="{ textAlign: textAlign }"
          >
            {{ option[displayField] }}
          </div>
        </div>
      </div>
      <div class="dropdown-icon icon24 arrow-down" ref="dropdownIcon"></div>
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
import baseInput from "@/components/input/BaseInput.vue";
export default defineComponent({
  name: "BaseDropdown",
  components: {
    baseInput,
  },
  props: {
    placeholder: {
      default: null,
      type: [Number, String],
    },
    listDropdownData: {
      default: [],
      type: Array,
    },
    directionDrop: {
      default: null,
      type: String,
    },
    width: {
      default: null,
      type: Number,
    },
    textAlign: {
      default: null,
      type: String,
    },
    chosenValue: {
      default: null,
    },
    displayField: {
      default: null,
      type: String,
    },
    valueField: {
      default: null,
      type: String,
    },
    // Giá trị hiển thị ban đầu của combo
    initText: {
      default: null,
      type: String,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const modelValue = ref(null);
    const isShow = ref(false);
    const listData = ref([]);
    const indexPointedOption = ref(0);
    const internalText = ref();
    function toggleDropdown() {
      this.isShow = !this.isShow;
    }
    /**
     * Sự kiện click chuột vào option
     */
    function evtMouseChoosingOption(obj) {
      internalText.value = obj[props.displayField];
      modelValue.value = obj[props.valueField];
      listData.value.forEach((item) => {
        if (item[props.valueField] == obj[props.valueField]) {
          item.isChosen = true;
        } else {
          item.isChosen = false;
        }
      });
      isShow.value = false;
      emit("update:chosenObj", obj[props.valueField], props.displayField);
    }
    onMounted(() => {
      listData.value = props.listDropdownData;
      modelValue.value = props.chosenValue;
      let firstModel = listData.value.find(
        (x) => x[props.valueField] == props.chosenValue
      );
      if (firstModel) {
        internalText.value = firstModel[props.displayField];
      } else {
        internalText.value = props.initText || null;
      }
    });

    watch(
      () => isShow.value,
      (newVal, oldVal) => {
        if (newVal) {
          proxy.$refs.inputdropdown.$refs.input.focus();
          document.addEventListener("click", documentClick);
        } else {
          document.removeEventListener("click", documentClick);
        }
      }
    );

    watch(
      () => modelValue.value,
      (newVal) => {
        emit("update:modelValue", newVal, props.displayField);
      }
    );

    watch(
      () => props.chosenValue,
      (value) => {
        selectOption(value);
      }
    );

    const selectOption = (value) => {
      let obj = props.listDropdownData.find(
        (x) => x[props.valueField] == value
      );
      if (obj) {
        internalText.value = obj[props.displayField];
        modelValue.value = obj[props.valueField];
        listData.value.forEach((item) => {
          if (item[props.valueField] == obj[props.valueField]) {
            item.isChosen = true;
          } else {
            item.isChosen = false;
          }
        });
        isShow.value = false;
      } else {
        internalText.value = null;
        listData.value.forEach((item) => {
          item.isChosen = false;
        });
      }
    };

    function documentClick(e) {
      let dropdownInput = proxy.$refs.inputdropdown,
        dropdownIcon = proxy.$refs.dropdownIcon;
      let target = e.target;

      if (
        dropdownInput &&
        target != dropdownIcon &&
        !dropdownInput.$el.contains(target)
      ) {
        isShow.value = false;
      }
    }
    function evtKeyboardChoosingOption(keyCode, event) {
      let initialValue = isShow.value;
      // Sự kiên ẩn hiện dropdown của combobox
      if (keyCode != 13) {
        // Nếu là nút lên, xuống thì hiện dropdown và thiết lập ô được chỉ đến
        if (isShow.value == false) {
          // Nếu trước đó dropdown đang đóng
          indexPointedOption.value = 0; // Set option đầu tiên được trỏ đến
          setPointedOption(
            listData.value[indexPointedOption.value][props.valueField]
          );
        }
        isShow.value = true;
      } else {
        // Sự kiên Enter
        // Toggle dropdown
        isShow.value = !isShow.value;
        if (listData.value.length == 0) return;
        // Chờ một khoảng thời gian
        if (isShow.value == false) {
          // Nếu trước đó dropdown đang hiện
          if (indexPointedOption.value >= 0) {
            // Mượn sự kiện click chuột vào option
            evtMouseChoosingOption(listData.value[indexPointedOption.value]);
          }
        } else {
          // Nếu trước đó dropdown đang đóng
          indexPointedOption.value = 0; // Set option đầu tiên được trỏ đến
          setPointedOption(
            listData.value[indexPointedOption.value][props.valueField]
          );
        }
        return;
      }
      if (initialValue) {
        // Sự kiện mũi tên lên,xuống sau khi đã hiện dropdown
        setTimeout(() => {
          let maxIndex = listData.value.length - 1;
          if (keyCode == 38) {
            // Nút lên kiểm tra xem có đang ở option đầu tiên
            indexPointedOption.value =
              indexPointedOption.value <= 0
                ? maxIndex
                : indexPointedOption.value - 1;
          } else if (keyCode == 40) {
            // Nút xuống kiểm tra xem có đang ở option cuối cùng k
            indexPointedOption.value =
              indexPointedOption.value == maxIndex
                ? 0
                : indexPointedOption.value + 1;
          }
          // Chuyển pointed option sang option mới
          setPointedOption(
            listData.value[indexPointedOption.value][props.valueField]
          );
          // Scroll nội dung xuống option hiện tại
          let option =
            proxy.$refs[
              "option" +
                (indexPointedOption.value >= 0 ? indexPointedOption.value : 0)
            ][0];
          let topOps = option.offsetTop;
          proxy.$refs.select.scrollTop = topOps;
        }, 20);
      }
    }
    function setPointedOption(id) {
      listData.value.forEach((element) => {
        if (element[props.valueField] == id) {
          element.isPointed = true;
        } else {
          element.isPointed = false;
        }
      });
    }
    return {
      modelValue,
      isShow,
      listData,
      toggleDropdown,
      evtMouseChoosingOption,
      evtKeyboardChoosingOption,
      internalText,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./BaseDropdown.scss";
</style>