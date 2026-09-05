<template>
  <label
    class="ms-radio"
    @keypress="keyDownActive"
    @focus="onFocus"
    @blur="onBlur"
  >
    <input
      type="radio"
      :name="name"
      :value="keyValue"
      :checked="modelValue === keyValue"
      @input="$emit('update:modelValue', keyValue)"
      @change="$emit('msChange', $event)"
      :disabled="disabled"
      :tabindex="0"
    />
    <span class="checkmark"></span>
    <span v-if="label" class="ms-radio--text">{{ label }}</span>
  </label>
</template>
<script>
export default {
  name: "baseRadio",
  props: {
    modelValue: {},
    label: {
      default: null,
      type: String,
    },
    keyValue: {
      default: null,
    },
    name: {
      default: null,
      type: String,
    },
    type: {
      default: "radio",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  method: {
    keyDownActive(e) {
      e.preventDefault();
      switch (e.which) {
        case 32:
        case 13:
          this.$emit("update:modelValue", this.keyValue);
          this.$el.querySelector('input[type="radio"]').focus();
          break;
      }
    },
    onFocus(e) {
      const me = this;
      me.focused = true;
    },
    onBlur(e) {
      const me = this;
      me.focused = false;
    },
    // computed: {
    //   listeners() {
    //     return {
    //       ...this.$listeners,
    //     };
    //   },
    //   checkHasEvent() {
    //     let me = this;
    //     if (me.checked) {
    //       return true;
    //     }
    //   },
    // },
  },
};
</script>
<style lang="scss" scoped>
@import "./BaseRadio.scss";
</style>