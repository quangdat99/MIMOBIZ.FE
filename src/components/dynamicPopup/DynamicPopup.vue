<template>
  <vue-final-modal
    class="modal-container"
    content-class="modal-content"
    v-slot="{ close }"
    :min-width="200"
    :name="name"
    :min-height="200"
    :content-style="styles"
    v-bind="$attrs"
    :drag="!isMobile"
    :click-to-close="false"
    drag-selector=".modal__title"
  >
    <div class="modal__title">
      <div class="title-left">
        <span class="title">{{ title }}</span>
        <slot name="content-title"></slot>
      </div>
      <div class="title-right">
        <slot name="icon" :close="close"></slot>
      </div>
    </div>
    <div class="modal__content flex-column flex1">
      <slot name="content" :close="close"></slot>
    </div>
    <div class="modal__footer" v-if="$slots['footer']">
      <slot name="footer" :close="close"></slot>
    </div>
  </vue-final-modal>
</template>

<script>
export default {
  name: "DynamicPopup",
};
</script>
<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: "",
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: null,
  },
});

const isMobile = ref(typeof window !== "undefined" ? window.innerWidth < 768 : false);

const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth < 768;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const styles = computed(() => {
  let style = {};
  if (isMobile.value) {
    style.width = "calc(100vw - 16px)";
    style.maxHeight = "calc(100vh - 24px)";
    style.height = "auto";
  } else {
    if (props.width) {
      style.width = `${props.width}px`;
      style.maxWidth = "calc(100vw - 32px)";
    }
    if (props.height) {
      style.height = `${props.height}px`;
      style.maxHeight = "calc(100vh - 32px)";
    }
  }
  return style;
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

:deep(.vfm__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--va-radius-lg, 12px);
  background: var(--va-background-secondary, #ffffff);
  border: 1px solid var(--va-background-border, #e2e8f0);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 24px);
  overflow: hidden;
}

.modal__content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal__title {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--va-background-border, #e2e8f0);
  background-color: var(--va-background-secondary, #ffffff);
  flex-shrink: 0;

  &:hover {
    cursor: move;
  }

  .title-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--va-text-primary, #1e293b);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
}

.modal__footer {
  min-height: 52px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  background-color: var(--va-background-element, #f8fafc);
  border-top: 1px solid var(--va-background-border, #e2e8f0);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  :deep(.modal-content) {
    width: calc(100vw - 16px) !important;
    max-height: calc(100vh - 24px) !important;
    border-radius: 10px;
    margin: auto;
  }

  .modal__title {
    padding: 12px 16px;
    &:hover {
      cursor: default;
    }

    .title {
      font-size: 1rem;
    }
  }

  .modal__footer {
    padding: 10px 14px;
    height: auto !important;
  }
}
</style>