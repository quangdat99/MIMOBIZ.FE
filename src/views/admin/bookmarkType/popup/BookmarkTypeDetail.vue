<template>
  <dynamic-popup
    :width="500"
    :height="400"
    class="bookmarkType-detail"
    :title="title"
    @beforeOpen="beforeOpen($event, close)"
  >
    <template v-slot:icon="{ close }">
      <div class="button icon24 close" @click="close()"></div>
    </template>
    <template v-slot:content>
      <div class="flex-column h-100 popup-container">
        <div class="flex-row">
          <div class="flex1">
            <div class="control-title">
              <label>bookmark_type_code <span class="color-red">*</span></label>
            </div>
            <base-input
              ref="refFocus"
              title="Mã loại hồ sơ"
              class="mt-1"
              v-model="model.bookmark_type_code"
              :maxLength="200"
              :width="150"
              :rules="[{ name: 'required' }]"
              :disabled="viewing"
            ></base-input>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>description</label>
            </div>
            <base-textarea
              title="Mô tả"
              v-model="model.description"
              :maxLength="255"
              class="mt-1"
              :disabled="viewing"
            ></base-textarea>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>workload</label>
            </div>
            <base-number
              v-model="model.workload"
              class="mt-1"
              :width="150"
              :rules="[{ name: 'required' }]"
              :disabled="viewing"
              allowDecimalPadding
              :decimalPlaces="4"
            ></base-number>
          </div>
        </div>
        <div class="flex-row mt-2">
          <base-checkbox
            v-model="model.x3"
            :disabled="viewing"
            label="x3"
          ></base-checkbox>
        </div>
      </div>
    </template>
    <template v-slot:footer="{ close }">
      <div class="h-100 d-flex align-center flex1">
        <div class="flex1 flex-end">
          <base-button
            class="transparent"
            type="secondary"
            text="Hoãn"
            v-if="!viewing && this.editMode != this.$ms.constant.FormState.Add"
            @click="commandClick($ms.constant.Command.PostPone)"
          ></base-button>
          <base-button
            class="ml-4"
            @click="commandClick($ms.constant.Command.SaveView)"
            text="Cất"
            v-if="!viewing"
          ></base-button>
          <base-button
            class="ml-4"
            @click="commandClick($ms.constant.Command.Edit)"
            text="Sửa"
            v-if="viewing && roleEdit"
          ></base-button>
          <base-button
            class="transparent"
            type="secondary"
            text="Đóng"
            @click="close()"
            v-if="viewing"
          ></base-button>
        </div>
      </div>
    </template>
  </dynamic-popup>
</template>
<script>
import {
  ref,
  onMounted,
  watch,
  defineComponent,
  getCurrentInstance,
  reactive,
  nextTick,
  computed,
} from "vue";
import DynamicPopup from "@/components/dynamicPopup/DynamicPopup.vue";
import baseDictionaryDetail from "@/views/baseDictionaryDetail.js";
import bookmarkTypeAPI from "@/apis/components/bookmarkTypeAPI";

export default {
  name: "BookmarkTypeDetail",
  extends: baseDictionaryDetail,
  components: {
    DynamicPopup,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    return {
      api: bookmarkTypeAPI,
      keyRole: "bookmark_type",
      formName: "Loại hồ sơ",
    };
  },
};
</script>
<style lang="scss" scoped>
.popup-container {
  padding: 16px;
  overflow: auto;
}
</style>