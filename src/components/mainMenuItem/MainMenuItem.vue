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
    <div class="active-indicator" v-if="menuItemObject.isSelected"></div>
    <div class="menu-icon-container">
      <span
        v-if="menuItemObject.iconName"
        class="material-symbols-outlined menu-icon"
        :class="{ 'icon-active': menuItemObject.isSelected }"
      >
        {{ menuItemObject.iconName }}
      </span>
      <div
        v-else-if="menuItemObject.iconClass"
        class="logo"
        :class="[
          menuItemObject.iconClass,
          menuItemObject.isSelected ? 'selected' : '',
        ]"
      ></div>
    </div>
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
      default: () => ({}),
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
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13.5px;
  font-weight: 500;
  padding: 10px 14px;
  margin: 2px 10px;
  border-radius: var(--va-radius, 8px);
  color: var(--va-text-secondary, #64748B);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  .active-indicator {
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    border-radius: 0 4px 4px 0;
    background-color: var(--va-primary, #154EC1);
  }

  .menu-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    .menu-icon {
      font-size: 20px;
      color: var(--va-text-secondary, #64748B);
      transition: color 0.2s ease, transform 0.2s ease;

      &.icon-active {
        color: var(--va-primary, #154EC1);
      }
    }
  }

  .content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  &:hover {
    background-color: var(--va-background-element, #F1F5F9);
    color: var(--va-text-primary, #1E293B);

    .menu-icon {
      color: var(--va-text-primary, #1E293B);
      transform: scale(1.05);
    }
  }

  &.selected {
    background-color: rgba(21, 78, 193, 0.08);
    color: var(--va-primary, #154EC1);
    font-weight: 600;

    .menu-icon {
      color: var(--va-primary, #154EC1);
    }
  }

  &.toggle-navbar {
    justify-content: center;
    padding: 10px 0;
    margin: 2px 6px;

    .active-indicator {
      left: -6px;
    }

    .menu-icon-container {
      margin-right: 0 !important;
    }
  }
}
</style>