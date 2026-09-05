<template>
  <div
    class="base-combobox ms-editor"
    :class="{ 'w-100': !width, 'ms-validate': isValidate }"
    :style="[{ width: width + 'px' }]"
  >
    <div class="dropdown-container">
      <div
        class="flex-row"
        :class="[{ error: errorMessage, disabled: disabled }]"
      >
        <base-input
          ref="inputdropdown"
          :placeholder="placeholder"
          @update:modelValue="updateValue"
          @input="filterOption"
          @baseKeydown="tabPress"
          :modelValue="internalText"
          :disabled="disabled"
          @blur="onBlur"
          :readOnly="readOnly"
          :class="{'error': errorMessage}"
        >
        </base-input>
      </div>

      <div
        ref="select"
        style="z-index: 10000"
        v-show="isShow && listData.length > 0"
        class="select-custom"
        :class="directionDrop"
        :style="[
          { width: widthDropdown ? widthDropdown + 'px' : width + 'px' },
          { maxWidth: widthDropdown ? widthDropdown + 'px' : width + 'px' },
        ]"
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
            :title="option[displayField]"
          >
            {{ option[displayField] }}
          </div>
        </div>
      </div>
      <div
        class="dropdown-icon icon24 arrow-down"
        :class="[disabled ? 'disabled' : '']"
        @click="toggleDropdown"
        ref="dropdownIcon"
      ></div>
    </div>

    <div class="error-text mt-1 txt-error" v-if="errorMessage">
      {{ errorMessage }}
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
import baseComponent from "@/components/base/BaseComponent.vue";
import { useValidateControl } from "@/setup/validateControl.js";
export default defineComponent({
  extends: baseComponent,
  name: "BaseCombobox",
  components: {
    baseInput,
  },
  props: {
    placeholder: {
      default: null,
      type: [Number, String],
    },
    data: {
      default: [],
      type: Array,
    },
    directionDrop: {
      default: null,
      type: String,
    },
    hasBorder: {
      default: true,
      type: Boolean,
    },
    width: {
      default: null,
      type: Number,
    },
    widthDropdown: {
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
    },
    // Giá trị hiển thị ban đầu của combo
    initText: {
      default: null,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    title: {
      default: null,
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const modelValue = ref();
    const isShow = ref(false);
    const listData = ref([]);
    const indexPointedOption = ref(0);
    const internalText = ref();
    const { errorMessage, validate, isValidate, clearValidate } =
      useValidateControl({
        props,
      });
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
      emit("change", obj);
      onBlur();
    }
    onMounted(() => {
      listData.value = props.data;
      modelValue.value = props.chosenValue;
      bindInternalText();
    });

    function bindInternalText() {
      let firstModel = listData.value.find(
        (x) => x[props.valueField] == props.chosenValue
      );
      if (firstModel) {
        internalText.value = firstModel[props.displayField];
      } else {
        internalText.value = props.initText || null;
      }
      selectOption(props.chosenValue);
    }

    watch(
      () => props.initText,
      (newVal, oldVal) => {
        if (newVal) {
          internalText.value = newVal;
        }
      }
    );

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
        let obj = listData.value.find((x) => x[props.valueField] == newVal);
        if (obj) {
          emit("update:modelValue", newVal, obj[props.displayField]);
        } else {
          emit("update:modelValue", newVal, props.initText);
        }
      }
    );

    watch(
      () => props.chosenValue,
      (value) => {
        selectOption(value);
      },
      { deep: true }
    );

    const selectOption = (value) => {
      let obj = props.data.find((x) => x[props.valueField] == value);
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
        onBlur();
      } else {
        internalText.value = props.initText;
        modelValue.value = props.chosenValue;
        listData.value.forEach((item) => {
          item.isChosen = false;
        });
      }
    };

    watch(
      () => props.data,
      (newVal) => {
        listData.value = newVal;
        bindInternalText();
      }
    );

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
    function tabPress(e) {
      if (e.code == "Tab") {
        isShow.value = false; // Ẩn combobox
      } else {
        if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
          evtKeyboardChoosingOption(e.keyCode);
        }
      }
    }
    function filterOption(content) {
      internalText.value = content;
      isShow.value = true;
      let check = content.replace(/\\$/, "");
      let initialContent = content;
      content = content.toString().replace("\\", "");
      listData.value = props.data.filter(
        (element) =>
          element[props.displayField]
            .toString()
            .toLowerCase()
            .search(content.toLowerCase()) != -1 || content == ""
      );
      // Chuyển tất cả trạng thái được chọn và được trỏ về false
      listData.value.forEach((element) => {
        element["isChosen"] = false;
      });
      listData.value.forEach((element) => {
        element["isPointed"] = false;
      });
    }
    function updateValue(value) {
      internalText.value = value;
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
          // Chuyển trạng thái được trỏ tới của option về false
          //this.resetPointedOption();
        } else {
          // Nếu trước đó dropdown đang đóng
          indexPointedOption.value = 0; // Set option đầu tiên được trỏ đến
          setPointedOption(
            listData.value[indexPointedOption.value][props.valueField]
          );
        }
        // this.$nextTick(() => {
        //     if (!initialvalue) {
        //         this.focusChosenOption(event, amountScroll);
        //     }
        // })
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
          if (listData.value?.length > 0) {
            // Chuyển pointed option sang option mới
            setPointedOption(
              listData.value[indexPointedOption.value][props.valueField]
            );
          }
          // Scroll nội dung xuống option hiện tại
          let option =
            proxy.$refs[
              "option" +
                (indexPointedOption.value >= 0 ? indexPointedOption.value : 0)
            ][0];
          if (option) {
            let topOps = option.offsetTop;
            proxy.$refs.select.scrollTop = topOps;
          }
          // Chỉnh scroll cho vừa tầm nhìn
          // if (indexPointedOption.value != maxIndex) {
          //     proxy.$refs.select.scrollBy({
          //         top: -(amountScroll)
          //     });
          // } else {
          //     proxy.$refs.select.scrollBy({
          //         top: -(amountScroll)
          //     });
          // }
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

    const onBlur = (e) => {
      if (!internalText.value) {
        emit("update:modelValue", null, null);
      } else {
        let obj = listData.value.find(
          (x) => x[props.valueField] == modelValue.value
        );
        if (obj) {
          internalText.value = obj[props.displayField];
        } else {
          internalText.value = props.initText;
        }
      }
      validate();
      emit("blur", modelValue.value);
    };

    const getValue = () => {
      return modelValue.value;
    };

    return {
      modelValue,
      isShow,
      listData,
      toggleDropdown,
      evtMouseChoosingOption,
      tabPress,
      filterOption,
      updateValue,
      evtKeyboardChoosingOption,
      internalText,
      isValidate,
      errorMessage,
      validate,
      getValue,
      clearValidate,
      onBlur,
    };
  },
});
</script>

<style lang="scss">
@import "./BaseCombobox.scss";
</style>