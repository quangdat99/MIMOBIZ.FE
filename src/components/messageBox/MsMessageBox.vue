
<template>
  <div class="msg-box" @keydown.esc="escPress($event, $close)">
    <div class="msg-center" ref="msg" :style="{ width: width + 'px' }">
      <div class="msg-title">{{ title }}</div>
      <div
        v-if="!hideClose"
        class="msg-close icon24 close"
        @click="$close(this, type === 2 ? null : false)"
      ></div>
      <div class="msg-message">
        <template v-if="Array.isArray(message)">
          <div
            class="msg-item"
            v-for="(item, i) in message"
            :key="i"
            v-html="item"
          ></div>
        </template>
        <div
          class="msg-item"
          v-else-if="!Array.isArray(message) && type != 12"
          v-html="message"
        ></div>
        <div
          class="msg-item"
          v-else-if="!Array.isArray(message) && type == 12"
          v-text="message"
        ></div>
      </div>
      <div class="msg-buttons flex-center" v-if="type == 0">
        <button
          @click="$close(this, true)"
          class="msg-btn base-button btn primary btn-border-none"
          :class="dbOptionHeight"
        >
          Đồng ý
        </button>
      </div>
      <div class="msg-buttons flex-row revert-button" v-else-if="type == 1">
        <button
          @click="$close(this, true)"
          class="msg-btn base-button btn primary btn-border-none"
          :class="dbOptionHeight"
        >
          Có
        </button>
        <button
          @click="$close(this, false)"
          class="msg-btn base-button btn secondary-outline"
          :class="dbOptionHeight"
        >
          Không
        </button>
      </div>
      <div class="msg-buttons flex-row revert-button" v-else-if="type == 2">
        <button
          @click="$close(this, true)"
          class="msg-btn base-button btn primary btn-border-none"
          :class="dbOptionHeight"
        >
          Có
        </button>
        <button
          @click="$close(this, false)"
          class="msg-btn base-button btn secondary-outline"
          :class="dbOptionHeight"
        >
          Không
        </button>
        <button
          @click="$close(this, null)"
          class="msg-btn base-button btn secondary-outline"
          :class="dbOptionHeight"
        >
          Hủy
        </button>
      </div>
      <div class="msg-buttons flex-row revert-button" v-else-if="type == 3">
        <button
          @click="$close(this, true)"
          class="msg-btn base-button btn primary btn-border-none"
          :class="dbOptionHeight"
        >
          Xóa
        </button>
        <button
          @click="$close(this, false)"
          class="msg-btn base-button btn secondary-outline"
          :class="dbOptionHeight"
        >
          Không
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, ref, watch, computed } from "vue";
import commonFn from "@/commons/commonFunction";

export default {
  props: {
    title: String,
    width: {
      type: Number,
      default: 400,
    },
    message: [String, Array],
    type: {
      type: Number,
      default: 0,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
    textBtn: {
      type: String,
      default: null,
    },
    optionList: {
      type: Array,
      default: null,
    },
    customLabelCheckbox: {
      type: String,
      default: null,
    },
    customButton: {
      type: Object,
      default: () => ({
        Yes: "Có",
        No: "Không",
        Cancel: "Hủy",
      }),
    },
    optionDefault: {
      type: Number,
      default: 1,
    },
    /**
     * Hàm custom callback
     */
    customCallback: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();

    onMounted(() => {
      // Focus button
      commonFn.focusFirstControl(proxy.$refs["msg"]);
    });

    function escPress(e, close) {
      e.preventDefault();
      close(this, null);
    }

    const dbOptionHeight = computed(() => {
      return "heightoptionvalue" + 2;
    });

    return {
      escPress,
      dbOptionHeight,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./MsMessageBox.scss";
@import "@/components/button/BaseButton.scss";

.revert-button {
  flex-direction: row-reverse;
}

</style>