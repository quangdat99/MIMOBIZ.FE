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
    :drag="true"
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
        <!-- <div class="button icon24 close" @click="close"></div> -->
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
  watch,
  defineComponent,
  getCurrentInstance,
  reactive,
  defineProps,
  computed,
} from "vue";
const { proxy } = getCurrentInstance();
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
    default: () => {},
  },
  name: {
    type: String,
    default: null,
  },
  // show: {
  //   type: Boolean,
  //   default: false,
  // },
});
const styles = computed(() => {
  let style = {};
  if (props.width) {
    style.width = `${props.width}px`;
  }
  if (props.height) {
    style.height = `${props.height}px`;
  }
  // style.top = `calc(50vh-${props.height}px)`;
  // style.left = `calc(50vw-${props.width}px)`;
  return style;
});
</script>

<style scoped lang="scss" >
@import "@/assets/scss/variables.scss";

:deep(.vfm__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.modal-content) {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__content {
  flex: 1;
}
.modal__title {
  padding: 13px 16px 10px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  &:hover {
    cursor: move;
  }
  .title {
    font-size: 22px;
    font-weight: 600;
    color: #262807;
  }
  .button {
    cursor: pointer;
    display: inline-block;
    padding: 10px 8px;
  }
  .title-right {
    display: flex;
    align-items: center;
  }
}
.modal__footer {
  height: 44px;
  padding: 0 20px;
  display: flex;
  background-color: #f5f5f5;
}
</style>