
<template>
  <button
    class="ms-button btn"
    :class="[
      type,
      text ? '' : 'only-icon',
      radius ? 'btn-radius' : ',',
      hasBorder ? dbOptionHeight : dbOptionHeight + 'btn-border-none',
      disabled ? 'disabled-icon' : '',
    ]"
    :disabled="disabled || processing"
    v-tooltip="title"
  >
    <div
      :class="['icon24 icon left', leftIcon, disabled ? 'disabled-icon' : '']"
      v-if="leftIcon"
      v-tooltip="tooltipIconLeft"
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
      class="['icon24 icon right', rightIcon, disabled? 'disabled-icon' '']"
      v-if="rightIcon"
      v-tooltip="tooltipIconRight"
    ></div>
    <div
      v-if="$slots.default"
      class="ms-button-text ms-button--text flex align-center"
    >
      <slot />
    </div>
  </button>
</template>
  <script>
import { defineAsyncComponent, computed, getCurrentInstance } from "vue";
export default defineAsyncComponent({
  name: "msButton",
  props: {
    //Text hiển thị
    title: {
      defualt: null,
      type: String,
    },
    //Text hiển thị
    text: {
      defualt: null,
      type: String,
    },
    //Icon trái
    leftIcon: {
      default: null,
      type: String,
    },
    //Icon phải
    rightIcon: {
      default: null,
      type: String,
    },
    //Loại button gồm 3 loại primary/secondary/third/four để hiện thị style tương ứng
    type: {
      default: "primary",
      type: String,
    },
    /*
     * Trạng thái button disabled
     */
    disabled: {
      default: false,
      type: [Boolean, Number],
    },

    /*
     * Cờ đánh dấu đang xử lý
     */
    processing: {
      default: false,
      type: Boolean,
    },
    radius: {
      default: false,
      type: Boolean,
    },
    //border hiển thị
    hasBorder: {
      default: false,
      type: Boolean,
    },
    tooltipIconRight: {
      default: null,
      type: String,
    },
    tooltipIconLeft: {
      default: null,
      type: String,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    /*
     * Hủy lan rộng event
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

    /**Xử lý thì các event ra ngoài component */

    const listeners = computed(() => {
      const me = this;
      return {
        click: (event) => {
          //hủy lan rộng event
          cancelEvent(event);
          let deplay = window._appConfig.buttonClickDeplayMilliseconds;
          if (deplay && deplay > 0) {
            if (me._clicking) {
              return;
            }
            me._clicking = true;
            setTimeout(() => {
              delete me._clicking;
            }, deplay);
          }
        },

        mousedown: (event) => {
          //hủy lan rộng event
          cancelEvent(event);
        },
        //hủy lan rộng event cancelEvent(event);
        keydown: (event) => {
          //hủy lan rộng event
          cancelEvent(event);
          //trigger ra ngoài component
          emit("keydown", event);
        },
        focus: (event) => {
          //hủy lan rộng event
          cancelEvent(event);
          //trigger ra ngoài component
          emit("focus", event);
        },
      };
    });

    const dbOptionHeight = computed(() => {
      return "heightoptionvalue2";
    });
    return { listeners, dbOptionHeight };
  },
});
</script>

<style scope lang="scss">
@import "./MsButton.scss";
</style>