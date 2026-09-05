<template>
  <dynamic-popup
    :width="600"
    :height="540"
    class="manufacturer-detail"
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
              <label>stt <span class="color-red">*</span></label>
            </div>
            <base-input
              ref="refFocus"
              class="mt-1"
              v-model="model.stt"
              :maxLength="50"
              :rules="[{ name: 'required' }]"
              :disabled="viewing"
            ></base-input>
          </div>
          <div class="flex2"></div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex2">
            <div class="control-title">
              <label>cong_ty <span class="color-red">*</span></label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.cong_ty"
              :rules="[{ name: 'required' }]"
              :maxLength="255"
              :disabled="viewing"
              :rows="2"
            ></base-textarea>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>dia_chi</label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.dia_chi"
              :maxLength="255"
              :disabled="viewing"
            ></base-textarea>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>thong_tin_nhan_su</label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.thong_tin_nhan_su"
              :disabled="viewing"
              :rows="2"
            ></base-textarea>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>chuyen_phat</label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.chuyen_phat"
              :disabled="viewing"
              :rows="2"
            ></base-textarea>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>ghi_chu</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.ghi_chu"
              :disabled="viewing"
            ></base-input>
          </div>
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
import commonFn from "@/commons/commonFunction.js";
import axios from "axios";
import baseDictionaryDetail from "@/views/baseDictionaryDetail.js";
import manufacturerAPI from "@/apis/components/manufacturerAPI";
import popupUtil from "@/commons/popupUtil";
import BaseTextarea from '@/components/textarea/BaseTextarea.vue';

export default {
  name: "ManufacturerDetail",
  extends: baseDictionaryDetail,
  components: {
    DynamicPopup,
    BaseTextarea,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    return {
      api: manufacturerAPI,
      keyRole: "manufacturer",
      formName: "Manufacturer",
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