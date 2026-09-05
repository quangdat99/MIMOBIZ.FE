<template>
  <div
    class="base-textarea ms-editor"
    :style="{ width: `${width}px` }"
    :class="{ 'ms-validate': isValidate, 'w-100': !width }"
  >
    <label class="label" v-if="label">{{ label }}</label>
    <div class="flex-row" :class="{ error: errorMessage, disabled: disabled }">
      <textarea
        :title="title"
        :placeholder="placeholder"
        :disabled="disabled"
        :readOnly="readOnly"
        :maxlength="maxLength"
        ref="input"
        :class="{
          'base-textarea-item': true,
          flex: true,
          disabled: disabled,
          'has-border': hasBorder,
          'w-100': !width,
          error: errorMessage,
          border: hasBorder,
        }"
        v-model="internalText"
        :rows="rows"
        v-on="listeners"
      ></textarea>
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
  name: "baseTextarea",
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
    maxLength: {
      default: null,
      type: Number,
    },
    hasBorder: {
      default: true,
      type: Boolean,
    },
    width: {
      type: [Number, String],
      default: null,
    },
    field: {
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
    rows: {
      default: 3,
      type: Number,
    },
  },
  emits: ["focus", "blur", "change"],
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

    const setValue = (value) => {
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
      };
    });

    watch(
      () => internalText.value,
      (value) => {
        if (value !== props.modelValue) {
          emit("update:modelValue", value, props.field);
          //scrollWidth = input.value.scrollWidth;
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
      displayValue,
      getValue,
      errorMessage,
      validate,
      isValidate,
      clearValidate,
    };
  },
});
</script>

<style lang="scss" scoped>

textarea:read-only {
  color: $black;
  cursor: default;
}

.base-textarea {
  align-items: center;

  textarea {
    background-color: $white;
    &.has-border {
      border: 1px solid #c9c9c9;
      border-radius: 3px;
    }
    &.disabled {
      background-color: $input-disabled-bg;
    }
  }
  .base-textarea-item {
    overflow: auto;
    border-radius: $input-border-radius;
    border: none;
    padding: 6px;
    resize: none;
    background: transparent;
    &:focus {
      outline: none;
    }
  }
}
</style>