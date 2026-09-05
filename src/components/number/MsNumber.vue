<template>
  <div
    class="base-input ms-editor"
    :style="{ width: `${width}px` }"
    :class="{ 'ms-validate': isValidate, 'w-100': !width }"
  >
    <label class="label" v-if="label">{{ label }}</label>
    <div class="flex-row">
      <input
        class="base-input-item flex"
        :placeholder="placeholder"
        :disabled="disabled"
        ref="input"
        :class="{
          disabled: disabled,
          'has-border': hasBorder,
          'w-100': !width,
          error: errorMessage,
          border: hasBorder,
        }"
        v-on="listeners"
        :tabindex="0"
        @keydown="upDownValue"
        @blur="onActionBlur"
      />
      <div class="ms-number-spin flex-column" v-if="spin">
        <div class="flex spin up" @click="plus()"></div>
        <div class="flex spin down" @click="less()"></div>
      </div>
    </div>
    <div class="error-text mt-1 txt-error" v-if="errorMessage && !hideError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  watch,
  getCurrentInstance,
  computed,
} from "vue";
import AutoNumeric from "autonumeric";
import { useValidateControl } from "@/setup/validateControl.js";
import msBaseComponent from "@/components/base/mBaseComponent.vue";

export default defineComponent({
  name: "MsNumber",
  extends: msBaseComponent,

  props: {
    /**
     * modelValue đẩy ra ngoài để binding 2 chiều
     */
    modelValue: {
      default: null,
    },
    hideError: {
      default: false,
      type: Boolean,
    },
    placeholder: {
      fault: null,
      type: [Number, String],
    },
    width: {
      type: [Number, String],
      default: null,
    },
    hasBorder: {
      default: true,
      type: Boolean,
    },
    label: {
      type: String,
      default: null,
    },
    min: {
      type: [Number, String],
      default: -99999999999999,
    },
    max: {
      type: [Number, String],
      default: 99999999999999,
    },
    autofocus: {
      default: false,
      type: [Boolean, String],
    },
    /**
     * Bước nhảy giá trị
     */
    step: {
      type: [Number, String],
      default: 1,
    },
    /**
     * Cho phép hiển thị số 0 ở đầu
     * ['allow', 'deny', 'keep']
     * MẶc định là allow: Cho phép nhập nhưng sẽ mất khi focus ra bên ngoài
     */
    leadingZero: {
      type: String,
      default: "allow",
    },
    /**
     * Hiển thị = khi dữ liệu = 0
     */
    keepZero: {
      type: Boolean,
      default: false,
    },
    /**
     * Cờ bật tắt icon khi tăng giảm giá trị của number
     */
    spin: {
      type: Boolean,
      default: false,
    },
    /**
     * Cho phép hiển thị đầy đủ phần thập phân
     */
    allowDecimalPadding: {
      type: Boolean,
      default: false,
    },
    /**
     * Cho phép phân tách các giá trị nguyên với nhau
     */
    allowDigitGroupSeparator: {
      type: Boolean,
      default: true,
    },
    /**
     * Cho phép giá trị là null/undefined mà không phải set mặc đinh là 0
     */
    isNullable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    decimalPlaces: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue", "baseKeyDown", "onActionBlur", "focus"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const focused = ref(false);
    const me = proxy;
    me.typing = false;
    me.valid = false;
    me.autoNumneric = null;

    const { errorMessage, validate, isValidate, clearValidate } =
      useValidateControl({
        props,
      });
    const listeners = computed(() => {
      return {
        input: (e) => {
          updateVModel(e);
          onInput();
        },
        keydown: (e) => {
          emit("baseKeyDown", e);
        },
        focus: (e) => {
          proxy.selectOnClick = true;
          e.target.select();
          focused.value = true;
          emit("focus", e);
        },
        blur: (e) => {
          onBlur(e);
        },
      };
    });

    watch(
      () => proxy.modelValue,
      (newValue, oldValue) => {
        let me = proxy;
        if (getValue() !== newValue && newValue !== oldValue) {
          if ((!newValue || newValue === 0) && !me.keepZero) {
            me.autoNumneric.clear();
          } else {
            me.autoNumneric.set(newValue);
          }
        }
      }
    );

    onMounted(() => {
      let me = proxy,
        options = initOptions();

      options.selectOnClick = false;
      me.autoNumneric = new AutoNumeric(me.$refs.input, options);
      if (
        proxy.modelValue !== null &&
        proxy.modelValue !== "" &&
        typeof proxy.modelValue !== "undefined"
      ) {
        if (proxy.modelValue > me.max || proxy.modelValue < me.min) {
          me.autoNumneric.set(me.max);
        } else {
          me.autoNumneric.set(proxy.modelValue);
        }
        updateVModel();
      }
    });

    /**
     * Sự kiện Blur
     */
    function onActionBlur() {
      if (!me.keepZero && proxy.modelValue == 0) {
        me.autoNumneric.clear();
      }
      emit("onActionBlur", proxy.modelValue);
    }
    /**
     * thay đổi trạng thái focus
     */
    function changeFocus(booleanx) {
      focused.value = booleanx;
    }

    function initOptions() {
      let me = proxy;
      let options = {
        // allowDecimalPadding: props.allowDecimalPadding, // Cho phép hiển thi đầy đủ phần thập phân
        decimalCharacter: ",",
        decimalPlaces: props.decimalPlaces,
        digitGroupSeparator: props.allowDigitGroupSeparator ? "." : "",
        decimalCharaterAlternative: ".",
        negativePositiveSignPlacement: "p",
        modifyValueOnWheel: "false", // hỗ trợ có lăn chuột thay đổi giá trị
        currencySymbolPlacement: "s",
        maximumValue: props.max,
        minimumValue: props.min,
        leadingZero: props.leadingZero, // cho phép giữ số 0 ở đầu
      };
      return options;
    }

    function updateVModel(event) {
      let me = proxy;
      if (me.autoNumneric != null) {
        let value = getValue();
        // Nhập mỗi dấu âm mà chưa nhập value thì force luôn
        if (me.autoNumneric.eventKey === "-" && !value) {
          return;
        }
        emit("update:modelValue", value, event);
      }
    }

    function upDownValue(e) {
      let me = proxy;
      if (me.spin) {
        if (e.keyCode === 38) {
          e.preventDefault();
          plus();
        }
        if (e.keyCode === 40) {
          e.preventDefault();
          less();
        }
      }
    }

    function plus() {
      // disable thì không làm gì
      if (disabled) {
        return;
      }

      changeFocus(true);
      let me = proxy;
      let value = getValue();
      if (!value) {
        value = 0;
      }

      value = parseInt(value);
      if (value < me.max) {
        value += me.step;
        me.autoNumneric.set(value);
        updateVModel();
        nextTick(() => {
          emit("change", value);
        });
      }
    }
    function less() {
      // disable thì không làm gì
      if (disabled) {
        return;
      }

      changeFocus(true);
      let me = proxy;
      let value = getValue();
      if (!value) {
        value = 0;
      }

      value = parseInt(value);
      if (value > me.min) {
        value -= me.step;
        me.autoNumneric.set(value);
        updateVModel();
        nextTick(() => {
          emit("change", value);
        });
      }
    }

    /**
     * Lấy giá trị của control
     */
    function getValue() {
      const me = proxy;
      if (!me.isNullable || me.autoNumneric.rawValue) {
        return me.autoNumneric.getNumber();
      }
    }

    /**
     * Sự kiện người dùng gõ vào ô input
     */
    function onInput() {
      proxy.type = false;
    }

    function onBlur() {
      const me = proxy;
      proxy.type = false;
      proxy.validate();
    }

    // function setValue(value) {
    //   const me = proxy;
    //   if (me.$refs.input) {
    //     me.$refs.input.value = null;
    //   }

    //   if (me.autoNumneric && typeof value != "undefined" && value != null) {
    //     setInternalValue(value);
    //   } else {
    //     emit("update:modelValue", value);
    //     me.autoNumneric.rawValue = value || null;
    //   }
    // }

    return {
      listeners,
      errorMessage,
      getValue,
      validate,
      isValidate,
      clearValidate,
      onActionBlur,
      upDownValue,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "./BaseNumber.scss";
</style>