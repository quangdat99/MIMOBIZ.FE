<template>
  <button
    class="base-button btn"
    :class="[
      type,
      text ? '' : 'only-icon',
      radius ? 'btn-radius' : '',
      hasBorder ? '' : 'btn-border-none',
      disabled ? 'disabled-icon' : '',
      text ? '': 'pl-0',
      text ? '': 'pr-0',
    ]"
    :disabled="disabled || processing"
    v-tooltip="title"
  >
    <div
      :class="['icon24 icon left', leftIcon, disabled ? 'disabled-icon' : '']"
      v-if="leftIcon"
    >
      &nbsp;
    </div>
    <div
      class="text"
      :class="[{ 'pl-0': leftIcon, 'pr-0': rightIcon }]"
      v-if="text"
    >
      {{ text }}
    </div>
    <div
      :class="['icon24 icon right', leftIcon, disabled ? 'disabled-icon' : '']"
      v-if="rightIcon"
    >
      &nbsp;
    </div>
    <!-- <div v-if="$slot.default" class="base-button-text flex align-center">

    </div> -->
  </button>
</template>

<script>
import { defineComponent, computed } from "vue";
import baseComponent from "@/components/base/BaseComponent.vue";
export default {
  name: "baseButton",
  extends: baseComponent,
  props: {
    title: {
      default: null,
      type: String,
    },
    text: {
      default: null,
    },
    leftIcon: {
      default: null,
      type: String,
    },
    rightIcon: {
      default: null,
      type: String,
    },
    // primary/secondary/transparent
    type: {
      default: "primary",
      type: String,
    },
    processing: {
      default: false,
      type: Boolean,
    },
    radius: {
      default: false,
      type: Boolean,
    },
    hasBorder: {
      default: false,
      type: Boolean,
    },
    leftIconFocus: {
      default: null,
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  setup(props, { emit }) {
    /**
     * Hủy lan truyền sự kiện
     * @param {*} e
     */
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
    /**
     * Xử lý emit sự kiện
     * @param {*} e
     */
    const listeners = (e) => {
      const me = this;
      return {
        click: (event) => {
          cancelEvent(event);
          let delay = window._appConfig.buttonClickDelayMiliseconds;
          if (delay && delay > 0) {
            if (me._clicking) {
              return;
            }
          }

          me._clicking = true;
          setTimeout(() => {
            delete me._clicking;
          }, delay);
        },
        mousedown: (event) => {
          cancelEvent(event);
        },
        keydown: (event) => {
          cancelEvent(event);

          emit("keydown", event);
        },
        focus: (event) => {
          cancelEvent(event);

          emit("focus", event);
        },
      };
    };
    return {
      listeners,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./BaseButton.scss";
</style>