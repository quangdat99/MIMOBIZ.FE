<template>
  <dynamic-popup
    :width="800"
    :height="650"
    class="timesheet-detail"
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
              <label>time_sheet_code <span class="color-red">*</span></label>
            </div>
            <base-input
              ref="refFocus"
              title="Mã hồ sơ"
              class="mt-1"
              v-model="model.time_sheet_code"
              :disabled="viewing"
              :maxLength="50"
              :rules="[{ name: 'required' }]"
            ></base-input>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>checker_code</label>
            </div>
            <base-combobox
              title="checker_code"
              class="flex2 mt-1"
              valueField="checker_id"
              displayField="checker_code"
              :chosenValue="model.checker_id"
              :initText="model.checker_code"
              :disabled="viewing"
              :data="dataChecker"
              @update:modelValue="
                (value, displayField) => {
                  model.checker_id = value;
                  model.checker_code = displayField;
                }
              "
            ></base-combobox>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>bookmark_type_code</label>
            </div>
            <base-combobox
              title="bookmark_type_code"
              class="flex2 mt-1"
              valueField="bookmark_type_id"
              displayField="bookmark_type_code"
              :chosenValue="model.bookmark_type_id"
              :initText="model.bookmark_type_code"
              :disabled="viewing"
              :data="dataBookmarkType"
              @update:modelValue="
                (value, displayField) => {
                  model.bookmark_type_id = value;
                  model.bookmark_type_code = displayField;
                }
              "
            ></base-combobox>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex2">
            <div class="control-title">
              <label>task</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.task"
              :maxLength="255"
              :disabled="viewing"
            ></base-input>
          </div>
          <div class="flex-row flex2">
            <div class="flex4 ml-2">
              <div class="control-title">
                <label>status</label>
              </div>
              <!-- <base-input
              class="mt-1"
              v-model="model.status"
              :disabled="viewing"
              :maxLength="255"
            ></base-input> -->

              <base-combobox
                title="status"
                class="flex2 mt-1"
                valueField="status"
                displayField="status"
                :chosenValue="model.status"
                :initText="model.status"
                :disabled="viewing"
                :data="[
                  { status: 'Todo' },
                  { status: 'Doing' },
                  { status: 'Pending' },
                  { status: 'Hold' },
                  { status: 'Done' },
                  { status: 'Post' },
                  { status: 'Cancel' },
                ]"
                @update:modelValue="
                  (value, displayField) => {
                    model.status = value;
                  }
                "
              ></base-combobox>
            </div>
            <div class="flex4 ml-2">
              <div class="control-title">
                <label>status_date</label>
              </div>
              <ms-datepicker
                class="mt-1"
                v-model="model.status_date"
                :disabled="viewing"
              ></ms-datepicker>
            </div>
            <div class="flex3 flex-row ml-2 mt-6">
              <div class="">
                <base-checkbox
                  v-model="model.complete"
                  :disabled="viewing"
                  label="complete"
                ></base-checkbox>
              </div>
              <div class="ml-2">
                <base-checkbox
                  v-model="model.plan"
                  :disabled="viewing"
                  label="plan"
                ></base-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>start_date</label>
            </div>
            <ms-datepicker
              class="mt-1"
              v-model="model.start_date"
              :disabled="viewing"
            ></ms-datepicker>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>contract</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.contract"
              :disabled="viewing"
              :maxLength="255"
            ></base-input>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>customer</label>
            </div>
            <base-input
              class="mt-1"
              v-model="model.customer"
              :disabled="viewing"
            ></base-input>
          </div>
          <div class="flex1 ml-2">
            <div class="control-title">
              <label>deadline_customer_date</label>
            </div>

            <ms-datepicker
              class="mt-1"
              v-model="model.deadline_customer_date"
              :disabled="viewing"
            ></ms-datepicker>
          </div>
        </div>

        <div class="flex-row mt-2">
          <div class="flex1">
            <div class="control-title">
              <label>detail</label>
            </div>
            <base-textarea
              class="mt-1"
              v-model="model.detail"
              :disabled="viewing"
              :rows="2"
            ></base-textarea>
          </div>

          <base-button
            class="ml-2 mt-6"
            @click="addTarget"
            :disabled="viewing"
            text="Thêm Target"
          ></base-button>
        </div>
        <div class="targets">
          <div
            class="flex-row mt-2"
            v-show="target.state != $ms.constant.ModelState.Delete"
            v-for="(target, i) in model.timeSheetTargets"
            :key="i"
          >
            <div class="flex7">
              <div class="control-title">
                <label>target</label>
              </div>
              <base-textarea
                class="mt-1"
                v-model="target.target"
                :rules="[{ name: 'required' }]"
                :disabled="viewing"
                @update:modelValue="updateState(target)"
                :rows="2"
              ></base-textarea>
            </div>
            <div class="flex2 ml-2">
              <div class="control-title">
                <label>deadline_checker_date</label>
              </div>
              <ms-datepicker
                class="mt-1"
                v-model="target.deadline_checker_date"
                :rules="[{ name: 'required' }]"
                :disabled="viewing"
                @update:modelValue="updateState(target)"
              ></ms-datepicker>
            </div>
            <div class="flex1 ml-1 mt-6">
              <base-checkbox
                v-model="target.urgent"
                :disabled="viewing"
                label="urgent"
              ></base-checkbox>
            </div>
            <div
              class="icon24 delete cursor-pointer mt-5 ml-2"
              :class="[viewing ? 'disabled' : '']"
              title="Xóa"
              @click="deleteTarget(target)"
            ></div>
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
import baseDictionaryDetail from "@/views/baseDictionaryDetail.js";
import timesheetAPI from "@/apis/components/timesheetAPI";
import BaseCombobox from "@/components/combobox/BaseCombobox.vue";
import loadCombobox from "@/commons/combobox/loadCombox.js";

export default {
  name: "TimeSheetDetail",
  extends: baseDictionaryDetail,
  components: {
    DynamicPopup,
    BaseCombobox,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    proxy._gridDetails = { timeSheetTargets: "refDatail" };
    const dataChecker = ref([]);
    const dataBookmarkType = ref([]);

    onMounted(async () => {
      dataChecker.value = await loadCombobox.getChecker();
      dataBookmarkType.value = await loadCombobox.getBookmarkType();
      setTimeout(() => {
        proxy.super("addObserveControl", baseDictionaryDetail);
      }, 500);
    });

    const addTarget = () => {
      proxy.model.timeSheetTargets.push({
        time_sheet_target_id: commonFn.generateUUID(),
        time_sheet_id: proxy.model.time_sheet_id,
        target: null,
        deadline_checker_date: null,
        urgent: false,
        state: proxy.$ms.constant.ModelState.Insert, // Thêm
      });

      nextTick(() => {
        proxy.super("addObserveControl", baseDictionaryDetail);
      });
    };

    const deleteTarget = (target) => {
      if (target.state == proxy.$ms.constant.ModelState.Insert) {
        proxy.model.timeSheetTargets = proxy.model.timeSheetTargets.filter(
          (x) => x.time_sheet_target_id != target.time_sheet_target_id
        );
      } else {
        target.state = proxy.$ms.constant.ModelState.Delete; // xóa
      }

      nextTick(() => {
        proxy.super("addObserveControl", baseDictionaryDetail);
      });
    };
    const updateState = (target) => {
      if (target.state == proxy.$ms.constant.ModelState.None) {
        target.state = proxy.$ms.constant.ModelState.Update;
      }
    };

    function beforeSave() {
      if (proxy.model.timeSheetTargets?.length > 0) {
        proxy.model.timeSheetTargets.forEach((item, index) => {
          item.sort_order = index;
        });
      }
    }
    function beforeBinding(data, mode, param) {
      if (mode == proxy.$ms.constant.FormState.Add) {
        data.status = "Todo";
        data.plan = true;
      }
      if (param?.generate) {
        Object.assign(data, param.data);
      }
    }

    return {
      api: timesheetAPI,
      dataBookmarkType,
      dataChecker,
      addTarget,
      deleteTarget,
      formName: "Hồ sơ",
      updateState,
      beforeSave,
      beforeBinding,
      keyRole: "time_sheet",
    };
  },
};
</script>
<style lang="scss" scoped>
.popup-container {
  padding: 16px;
  .targets {
    height: 300px;
    overflow-y: auto;
    margin-top: 10px;
  }
}
</style>
