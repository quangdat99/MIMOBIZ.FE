<template>
  <div class="menu-wrapper" ref="menu">
    <div
      @click="triggerClick"
      class="menu-button-container"
      ref="buttonContainer"
    >
      <slot
        name="menu-button"
        v-if="$slots['menu-button']"
        :toggleMenu="(e) => toggleMenu(e)"
      >
      </slot>
      <button
        v-else
        class="menu-wrapper-button"
        ref="button"
        :aria-expanded="isOpen.toString()"
        aria-haspopup="true"
        :aria-controls="id"
        @click="toggleMenu"
      >
        <slot name="menu-button-text"></slot>
      </button>
    </div>
    <teleport to="body">
      <ul
        class="menu-wrapper-menu"
        :class="classRoot"
        v-if="isOpen"
        ref="list"
        role="menu"
        :id="id"
        @close_menu="closeHandler()"
        :style="{
          left,
          right,
          top,
          bottom,
          maxHeight: maxHeight + 'px',
          overflow: 'auto',
        }"
      >
        <slot name="menu-content" :closeHandler="closeHandler"></slot>
      </ul>
    </teleport>
  </div>
</template>

<script>
import {
  nextTick,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  watch,
  getCurrentInstance,
} from "vue";
import componentUtil from "@/commons/componentUtils.js";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    hideInContent: {
      type: Boolean,
      default: true,
    },
    maxHeight: {
      type: Number,
      default: null,
    },
    classRoot: {
      default: "",
      type: String,
    },
    position: {
      type: Object,
      default: null,
    },
  },
  emits: ["closeMenuWrapper", "click"],
  setup(props, { emit }) {
    // Define
    const isOpen = ref(false);
    const id = ref(null);
    const left = ref("unset");
    const right = ref("unset");
    const top = ref(0);
    const bottom = ref("unset");

    const { proxy } = getCurrentInstance();

    onBeforeUnmount(() => {
      let el = proxy.$refs.list;
      if (el) {
        el.remove();
      }
    });

    function isDispose(target) {
      let el = proxy.$refs.list;
      const classes = [];
      const dispose =
        classes.findIndex((className) => {
          if (
            target.closet &&
            (target.closet(className) || target.className.contains(className))
          ) {
            return true;
          }
          return false;
        }) === -1;

      if (dispose) {
        if (el !== target && !el.contains(target)) {
          return true;
        }
      }
    }

    function closeHandler() {
      isOpen.value = false;

      proxy.$el.classList.remove("active");
    }

    function toggleMenu(e) {
      e.stopPropagation();

      if (!props.disabled) {
        emit("click", !isOpen.value);
        isOpen.value = !isOpen.value;

        if (isOpen.value) {
          proxy.$el.classList.add("active");
        } else {
          proxy.$el.classList.remove("active");
        }
      }
    }

    function documentClick(e) {
      let el = proxy.$refs.list;
      let target = e.target;

      if (props.hideInContent) {
        closeHandler(el);
        return;
      }

      if (isDispose(target)) {
        closeHandler();
      }
    }

    function documentKeydown(e) {
      if (e.key === "Escape" && isOpen.value) {
        closeHandler();
      }
    }

    function triggerClick() {
      let buttons = proxy.$refs.buttonContainer.querySelectorAll("button");
      if (buttons.length == 1) {
        buttons[0].click();
      }
    }
    watch(isOpen, (newVal) => {
      if (newVal) {
        // Gán sự kiện click outside
        document.querySelector("body").click();
        setTimeout(() => {
          document.addEventListener("keydown", documentKeydown);
          document.addEventListener("click", documentClick);
        }, 0);

        top.value = "0px";
        left.value = "0px";

        nextTick(() => {
          let position = componentUtil.getPosition(
            proxy.$refs["buttonContainer"],
            proxy.$refs["list"],
            props.position
          );
          top.value = position.top + "px";
          left.value = position.left + "px";
        });
      } else {
        emit("closeMenuWrapper");
        document.removeEventListener("keydown", documentKeydown);
        document.removeEventListener("click", documentClick);
      }
    });
    // watch(() => isOpen.value, () => (newVal) => {
    //     if (newVal) {
    //         // Gán sự kiện click outside
    //         document.querySelector('body').click();
    //         setTimeout(() => {
    //             document.addEventListener('keydown', documentKeydown);
    //             document.addEventListener('click', documentClick);
    //         }, 0);

    //         top.value = '0px';
    //         left.value = '0px';

    //         nextTick(() => {
    //             let position = componentUtil.getPosition(proxy.refs['buttonContainer'], proxy.refs['list'], props.position);
    //             top.value = position.top + 'px';
    //             left.value = position.left + 'px';
    //         })
    //     } else {
    //         emit('closeMenuWrapper');
    //         document.removeEventListener('keydown', documentKeydown);
    //         document.removeEventListener('click', documentClick);
    //     }
    // })
    // Hook
    onMounted(() => {
      id.value = Math.random().toString(36).substring(2, 15);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", documentKeydown);
      document.removeEventListener("click", documentClick);
    });
    return {
      isOpen,
      isDispose,
      closeHandler,
      toggleMenu,
      documentClick,
      documentKeydown,
      triggerClick,
      id,
      left,
      right,
      bottom,
      top,
    };
  },
};
</script>

<style lang="scss">
@import "./MenuWrapper.scss";
</style>