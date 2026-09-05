<template>
  <div
    class="main-menu-item"
    @click="mainMenuItemClick"
    :class="{
      selected: menuItemObject.isSelected,
      'toggle-navbar': !toggleNavbarValue,
    }"
    :title="menuItemObject.content"
  >
    <div
      class="logo"
      :class="[
        menuItemObject.iconClass,
        menuItemObject.isSelected ? 'selected' : '',
      ]"
      v-if="menuItemObject.iconClass"
    ></div>
    <div class="content" v-if="toggleNavbarValue">
      {{ menuItemObject.content }}
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: {
    menuItemObject: {
      type: Object,
      default: {},
    },
    toggleNavbarValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const mainMenuItemClick = () => {
      emit("click", props.menuItemObject.key);
    };
    return {
      mainMenuItemClick,
    };
  },
};
</script>

<style scoped lang="scss">


.main-menu-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  padding: 12px 24px;
  border-radius: 4px;
  opacity: 0.8;
  &.toggle-navbar {
    .logo {
      margin-right: 0px !important;
    }
  }
  cursor: pointer;
  transition: background-color 0.2s ease;
  &.selected {
    background-color: $black-3;
    opacity: 1;
    .content {
      font-weight: bold;
    }
  }
  .logo {
    margin-right: 26px;
  }
}
</style>