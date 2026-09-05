<template>
  <div
    class="base-input ms-editor"
    :style="{ width: `${width}px` }"
    :class="{ 'ms-validate': isValidate, 'w-100': !width }"
  >
    <label class="label" v-if="label">{{ label }}</label>
    <div class="flex-row align-center">
      <div
        :class="['icon24 icon left', leftIcon]"
        v-if="leftIcon"
        :title="errorProvider.errorMessage"
        @click="onClickLeftIcon"
      ></div>
      <input
        :title="title"
        class="base-input-item flex"
        :placeholder="placeholder"
        :disabled="disabled"
        :readOnly="readOnly"
        :maxlength="maxLength"
        ref="input"
        :class="{
          disabled: disabled,
          'has-right-icon': rightIcon,
          'has-left-icon': leftIcon,
          'has-border': hasBorder,
          'w-100': !width,
          error: errorMessage,
          border: hasBorder,
        }"
        v-on="listeners"
        :type="type"
        v-model="internalText"
      />
      <div
        :class="['icon24 icon right icon-input', rightIcon]"
        v-if="rightIcon"
        :title="errorProvider.errorMessage"
        @click="onClickRightIcon"
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

import baseComponent from "@/components/base/BaseComponent.vue";
import { useValidateControl } from "@/setup/validateControl.js";

export default defineComponent({
  extends: baseComponent,
  name: "baseInput",
  props: {
    /**
     * modelValue đẩy ra ngoài để binding 2 chiều
     */
    modelValue: {
      default: null,
    },
    placeholder: {
      fault: null,
      type: [Number, String],
    },
    leftIcon: {
      default: null,
      type: String,
    },
    rightIcon: {
      default: null,
      type: String,
    },
    maxLength: {
      default: null,
      type: Number,
    },
    hasBorder: {
      default: true,
      type: Boolean,
    },
    isClickLeftIcon: {
      type: Boolean,
      default: true,
    },
    isClickRightIcon: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
      default: null,
    },
    field: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "baseKeydown",
    "update:modelValue",
    "focus",
    "blur",
    "change",
    "baseKeyup",
    "onClickLeftIcon",
    "onClickRightIcon",
    "input",
  ],
  setup(props, { emit }) {
    const internalText = ref();
    const focused = ref(false);
    const displayValue = ref(null);
    const input = ref(null);
    let scrollWidth = 0;

    const { proxy } = getCurrentInstance();

    const { errorMessage, validate, isValidate, clearValidate } =
      useValidateControl({
        props,
      });

    // Hook
    onMounted(() => {
      internalText.value = props.modelValue;
    });

    // Method
    const hasToolTip = () => {
      if (scrollWidth > input?.value?.offsetWidth) {
        return true;
      } else {
        return false;
      }
    };

    const onFocus = (e) => {
      focused.value = true;
      emit("focus", internalText.value, e);
    };

    const onBlur = (e) => {
      focused.value = false;
      validate();
      emit("blur", internalText.value, e);
    };

    const getValue = () => {
      return internalText.value;
    };

    const onClickLeftIcon = () => {
      if (props.isClickLeftIcon) {
        emit("onClickLeftIcon");
      }
    };

    const onClickRightIcon = () => {
      if (props.isClickLeftIcon) {
        emit("onClickRightIcon");
      }
    };

    const reset = () => {
      internalText.value = "";
      displayValue.value = null;
    };

    const setValue = (value) => {
      if (proxy.rules) {
        const rule = proxy.rules.find(
          (x) => x.name === "pattern" && x.compareValue === "phone"
        );
        if (rule && value) {
          value = value.replace(/ /g, "").replace(/\./g, "");
        }
      }
      internalText.value = value;
    };

    const cancelBubbleEvent = (e) => {
      if (e) {
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }
        if (typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
      }
    };

    const listeners = computed(() => {
      return {
        blur: (e) => {
          cancelBubbleEvent(e);
          onBlur(e);
        },
        focus: (e) => {
          cancelBubbleEvent(e);
          onFocus(e);
        },
        change: (e) => {
          cancelBubbleEvent(e);
          emit("change", e, internalText.value);
        },
        keydown: (e) => {
          e.stopPropagation();
          emit("baseKeydown", e, internalText.value);
        },
        keyup: (e) => {
          emit("baseKeyup", e, internalText.value);
        },
        input: (e) => {
          cancelBubbleEvent(e);
          emit("input", internalText.value);
        },
      };
    });

    watch(
      () => internalText.value,
      (value) => {
        if (value !== props.modelValue) {
          emit("update:modelValue", value, props.field);
        }
      }
    );

    watch(
      () => props.modelValue,
      (value) => {
        setValue(value);
      }
    );

    return {
      internalText,
      focused,
      listeners,
      reset,
      hasToolTip,
      displayValue,
      getValue,
      errorMessage,
      validate,
      isValidate,
      clearValidate,
      onClickLeftIcon,
      onClickRightIcon,
    };
  },
});
</script>

<style lang="scss" scoped>

input:read-only {
  color: $black;
  cursor: default;
}
</style>