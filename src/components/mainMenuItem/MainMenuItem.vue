<template>
  <div class="menu-item-wrapper" :class="{ 'is-parent': hasChildren }">
    <!-- Parent or Single Item Row -->
    <div
      class="main-menu-item"
      @click="handleItemClick"
      :class="{
        selected: isDirectSelected || (hasChildren && hasActiveChild && !toggleNavbarValue),
        'parent-active': hasChildren && hasActiveChild,
        'parent-expanded': hasChildren && menuItemObject.expanded,
        'toggle-navbar': !toggleNavbarValue,
      }"
      :title="menuItemObject.content"
    >
      <!-- Active indicator bar on the left -->
      <div
        class="active-indicator"
        v-if="isDirectSelected || (hasChildren && hasActiveChild && !toggleNavbarValue)"
      ></div>

      <!-- Icon Container -->
      <div class="menu-icon-container">
        <span
          v-if="menuItemObject.iconName"
          class="material-symbols-outlined menu-icon"
          :class="{ 'icon-active': isDirectSelected || (hasChildren && hasActiveChild) }"
        >
          {{ menuItemObject.iconName }}
        </span>
        <div
          v-else-if="menuItemObject.iconClass"
          class="logo"
          :class="[
            menuItemObject.iconClass,
            isDirectSelected || (hasChildren && hasActiveChild) ? 'selected' : '',
          ]"
        ></div>
      </div>

      <!-- Content Title & Arrow for Parent -->
      <div class="content" v-if="toggleNavbarValue">
        <span class="content-text">{{ menuItemObject.content }}</span>
        
        <!-- Right side badge & arrow for parent menu -->
        <div class="parent-meta" v-if="hasChildren">
          <span class="child-count" v-if="menuItemObject.children.length > 0">
            {{ menuItemObject.children.length }}
          </span>
          <span
            class="material-symbols-outlined arrow-icon"
            :class="{ 'rotate-180': menuItemObject.expanded }"
          >
            expand_more
          </span>
        </div>
      </div>
    </div>

    <!-- Submenu Accordion Container -->
    <transition name="submenu-slide">
      <div
        class="submenu-list"
        v-if="hasChildren && toggleNavbarValue && menuItemObject.expanded"
      >
        <div
          v-for="child in menuItemObject.children"
          :key="child.key"
          class="submenu-item"
          :class="{ selected: child.isSelected }"
          @click.stop="handleChildClick(child.key)"
          :title="child.content"
        >
          <div class="submenu-indicator" v-if="child.isSelected"></div>

          <div class="submenu-icon-box">
            <span
              v-if="child.iconName"
              class="material-symbols-outlined sub-icon"
              :class="{ 'sub-icon-active': child.isSelected }"
            >
              {{ child.iconName }}
            </span>
            <span v-else class="submenu-bullet" :class="{ 'bullet-active': child.isSelected }"></span>
          </div>

          <div class="submenu-content">
            <span class="submenu-title">{{ child.content }}</span>
            <span class="submenu-subtitle" v-if="child.subtitle">{{ child.subtitle }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "MainMenuItem",
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
  emits: ["click", "expandNavbar"],
  setup(props, { emit }) {
    const hasChildren = computed(() => {
      return (
        props.menuItemObject &&
        Array.isArray(props.menuItemObject.children) &&
        props.menuItemObject.children.length > 0
      );
    });

    const isDirectSelected = computed(() => {
      return !!props.menuItemObject.isSelected;
    });

    const hasActiveChild = computed(() => {
      if (!hasChildren.value) return false;
      return props.menuItemObject.children.some((c) => c.isSelected);
    });

    const handleItemClick = () => {
      if (hasChildren.value) {
        if (!props.toggleNavbarValue) {
          // If sidebar is collapsed, clicking expands the sidebar
          emit("expandNavbar");
          props.menuItemObject.expanded = true;
        } else {
          props.menuItemObject.expanded = !props.menuItemObject.expanded;
        }
      } else {
        emit("click", props.menuItemObject.key);
      }
    };

    const handleChildClick = (key) => {
      emit("click", key);
    };

    return {
      hasChildren,
      isDirectSelected,
      hasActiveChild,
      handleItemClick,
      handleChildClick,
    };
  },
};
</script>

<style scoped lang="scss">
.menu-item-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
}

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
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.4;

    .content-text {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      color: var(--va-text-primary, #1E293B);
    }

    .parent-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;

      .child-count {
        font-size: 11px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 10px;
        background: var(--va-background-element, #F1F5F9);
        color: var(--va-text-secondary, #64748B);
      }

      .arrow-icon {
        font-size: 18px;
        color: var(--va-text-secondary, #94A3B8);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

        &.rotate-180 {
          transform: rotate(-180deg);
        }
      }
    }
  }

  &:hover {
    background-color: var(--va-background-element, #F1F5F9);
    color: var(--va-text-primary, #1E293B);

    .menu-icon {
      color: var(--va-primary, #154EC1);
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

  &.parent-active {
    .content-text {
      color: var(--va-primary, #154EC1);
    }

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

/* Submenu Styling */
.submenu-list {
  display: flex;
  flex-direction: column;
  padding: 2px 0 6px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 22px;
    top: 4px;
    bottom: 8px;
    width: 1px;
    background-color: var(--va-background-border, #E2E8F0);
  }

  .submenu-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 36px;
    margin: 1px 10px 1px 14px;
    border-radius: var(--va-radius, 6px);
    font-size: 13px;
    font-weight: 500;
    color: var(--va-text-secondary, #64748B);
    cursor: pointer;
    transition: all 0.18s ease;
    user-select: none;

    .submenu-indicator {
      position: absolute;
      left: -14px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      border-radius: 0 3px 3px 0;
      background-color: var(--va-primary, #154EC1);
    }

    .submenu-icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-right: 10px;
      flex-shrink: 0;

      .sub-icon {
        font-size: 17px;
        color: var(--va-text-secondary, #64748B);
        transition: color 0.18s ease;

        &.sub-icon-active {
          color: var(--va-primary, #154EC1);
        }
      }

      .submenu-bullet {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #94A3B8;
        transition: all 0.18s ease;

        &.bullet-active {
          background-color: var(--va-primary, #154EC1);
          transform: scale(1.3);
        }
      }
    }

    .submenu-content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      line-height: 1.35;

      .submenu-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .submenu-subtitle {
        font-size: 10.5px;
        color: #94A3B8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &:hover {
      background-color: var(--va-background-element, #F1F5F9);
      color: var(--va-text-primary, #1E293B);

      .submenu-icon-box .sub-icon {
        color: var(--va-text-primary, #1E293B);
      }

      .submenu-icon-box .submenu-bullet {
        background-color: var(--va-primary, #154EC1);
      }
    }

    &.selected {
      background-color: rgba(21, 78, 193, 0.08);
      color: var(--va-primary, #154EC1);
      font-weight: 600;

      .submenu-content .submenu-title {
        color: var(--va-primary, #154EC1);
      }

      .submenu-icon-box .sub-icon {
        color: var(--va-primary, #154EC1);
      }

      .submenu-icon-box .submenu-bullet {
        background-color: var(--va-primary, #154EC1);
      }
    }
  }
}

/* Transitions */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
</style>