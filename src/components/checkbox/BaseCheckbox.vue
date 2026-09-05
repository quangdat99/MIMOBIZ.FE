<template>
  <label :class="['ms-checkbox', { 'event-none': readOnly }]">
    <input
      type="checkbox"
      class="ms-checkbox-control"
      :readOnly="readOnly"
      :checked="isChecked"
      :value="isChecked"
      :disabled="disabled"
      v-on="listeners"
    />
    <span
      class="ms-checkbox--text"
      v-if="label && isShowLabel"
      :title="title ? title : ''"
    >
      {{ label }}
    </span>
  </label>
</template>

<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "baseCheckbox",
  props: {
    modelValue: {
      default: false,
      type: [Boolean, Number],
    },
    label: {
      default: null,
      type: String,
    },
    disabled: {
      default: false,
      type: [Boolean, Function],
    },
    readOnly: {
      default: false,
      type: Boolean,
    },
    checked: {
      default: false,
      type: [Boolean, Number],
    },
    isShowLabel: {
      type: Boolean,
      default: true,
    },
    title: {
      default: null,
      type: String,
    },
  },
  setup(props, { emit }) {
    let focused = false;

    const onFocus = () => {
      focused = true;
    };
    const onBlur = () => {
      focused = false;
    };
    const cancelEvent = (e) => {
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
          onBlur(e);
        },
        focus: (e) => {
          onFocus(e);
        },
        change: (e) => {
          cancelEvent(e);
          emit("change", props.modelValue, props.label);
        },
        input: (e) => {
          emit("update:modelValue", !props.modelValue);
        },
      };
    });

    const isChecked = computed(() => props.modelValue || props.checked);
    return {
      focused,
      onFocus,
      onBlur,
      listeners,
      isChecked,
    };
  },
});
</script>

<style lang="scss" scoped>
@import './BaseCheckbox.scss';
</style>