<template>
  <dynamic-popup
    :width="500"
    :height="500"
    class="taiLieuGoc-detail"
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
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>ngay_nhan</label>
            </div>
            <ms-datepicker
              class="mt-1"
              v-model="model.ngay_nhan"
              :disabled="viewing"
            ></ms-datepicker>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>ngay_gui</label>
            </div>
            <ms-datepicker
              class="mt-1"
              v-model="model.ngay_gui"
              :disabled="viewing"
            ></ms-datepicker>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>dossier_code</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.dossier_code"
              :maxLength="255"
              :disabled="viewing"
            ></base-input>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>customer</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.customer"
              :maxLength="255"
              :disabled="viewing"
            ></base-input>
          </div>
        </div>
        <div class="flex-row mt-2">
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>product_name</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.product_name"
              :maxLength="255"
              :disabled="viewing"
            ></base-input>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>bookmark_type_code</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.bookmark_type_code"
              :maxLength="200"
              :disabled="viewing"
            ></base-input>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>loai_giay_to</label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.loai_giay_to"
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
            <base-textarea
              class="mt-1"
              v-model="model.ghi_chu"
              :disabled="viewing"
            ></base-textarea>
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
import taiLieuGocAPI from "@/apis/components/taiLieuGocAPI";
import popupUtil from "@/commons/popupUtil";
import BaseTextarea from '@/components/textarea/BaseTextarea.vue';

export default {
  name: "TaiLieuGocDetail",
  extends: baseDictionaryDetail,
  components: {
    DynamicPopup,
    BaseTextarea,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    function beforeBinding(data, mode, param) {
      if (param?.generate) {
        Object.assign(data, param.data);
      }
    }
    return {
      api: taiLieuGocAPI,
      keyRole: "tai_lieu_goc",
      formName: "TaiLieuGoc",
      beforeBinding,
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