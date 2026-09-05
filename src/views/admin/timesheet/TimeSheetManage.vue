<template>
  <div class="base-list-manage timesheet-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách hồ sơ</div>
        <div class="handle-multi">
          <button class="ml-2 btn-filter pointer" @click="deleteMultipe()">
            Xóa nhiều
          </button>
        </div>
        <div class="toolbar-filter ml-4">
          <div class="mr-1 color-primary" style="white-space: nowrap">
            Nhân viên:
          </div>
          <base-combobox
            class="mr-2"
            valueField="checker_code"
            displayField="checker_name"
            :chosenValue="checker.checker_code"
            :initText="checker.checker_name"
            :data="dataChecker"
            :width="200"
            @update:modelValue="
              (value, displayField) => {
                checker.checker_code = value;
                checker.checker_name = displayField;
              }
            "
            :readOnly="true"
          ></base-combobox>
          <div class="mr-1 color-primary" style="white-space: nowrap">Cột:</div>
          <filter-grid
            v-model="filterGrid"
            :fields="filterData"
            @update:modelValue="(dataFilter) => filterGridView(dataFilter)"
          />
        </div>
      </div>
      <div class="toolbar-right">
        <div
          class="icon24 export-excel cursor-pointer mr-4"
          title="Xuất khẩu"
          @click="exportExcel"
        ></div>
        <div
          class="icon24 reload cursor-pointer mr-4"
          title="Lấy lại dữ liệu"
          @click="refresh"
        ></div>
        <base-button text="Thêm mới" @click="add()"> </base-button>
      </div>
    </div>
    <div class="container-grid">
      <grid-view
        ref="gridView"
        :api="api"
        :fields="[
          'time_sheet_id',
          'time_sheet_code',
          'task',
          'start_date',
          'contract',
          'customer',
          'status',
          'status_date',
          'complete',
          'plan',
          'deadline_customer_date',
          'detail',
        ]"
        :headers="headers"
        :filters="filters"
      >
        <template v-slot:item-operation="{ item }">
          <div class="d-flex flex-center">
            <div
              class="icon24 edit cursor-pointer"
              title="Sửa"
              @click="gridRowActionClick('Edit', item)"
            ></div>
            <div
              class="icon24 delete cursor-pointer ml-1"
              title="Xóa"
              @click="gridRowActionClick('Delete', item)"
            ></div>
          </div>
        </template>

        <template v-slot:item-time_sheet_code="{ item }">
          <span class="txt-link" @click="gridRowActionClick('Edit', item)">{{
            item.time_sheet_code
          }}</span>
        </template>
<!-- 
        <template v-slot:item-bookmark_type_code="{ item }">
          <span class="txt-link" @click="clickBookmarkType($event, item)">{{
            item.bookmark_type_code
          }}</span>
        </template> -->
      </grid-view>
    </div>
  </div>
</template>

<script>
import gridView from "@/components/gridView/GridView.vue";
import { useTimeSheetManage } from "./TimeSheetManage.js";
import timesheetAPI from "@/apis/components/timesheetAPI.js";
import popupUtil from "@/commons/popupUtil";
import BaseCombobox from "@/components/combobox/BaseCombobox.vue";
import {
  ref,
  onMounted,
  getCurrentInstance,
  reactive,
  watch,
  computed,
} from "vue";
import loadCombobox from "@/commons/combobox/loadCombox.js";
import baseList from "@/views/baseList";

export default {
  extends: baseList,
  components: { gridView, BaseCombobox },
  setup() {
    const { proxy } = getCurrentInstance();
    const { headers, filterData } = useTimeSheetManage();
    const checker = ref({ checker_code: "All", checker_name: "Tất cả" });
    const dataChecker = ref([]);
    onMounted(async () => {
      dataChecker.value = await loadCombobox.getChecker();
      dataChecker.value.unshift({ checker_code: "All", checker_name: "Tất cả" });
    });
    function customPayload(filter) {
      if (checker.value.checker_code != "All") {
        let fil = JSON.parse(filter || "[]");
        fil.push({
          Field: "checker_code",
          Value: checker.value.checker_code,
        });
        return JSON.stringify(fil);
      }
      return filter;
    }

    return {
      moduleName: "Hồ sơ",
      formNameDetail: "TimeSheetDetail",
      idField: "time_sheet_id",
      codeField: "time_sheet_code",
      nameField: "time_sheet_name",
      keyRole: "time_sheet",
      headers,
      api: timesheetAPI,
      filterData,
      dataChecker,
      checker,
      customPayload,
    };
  },
};
</script>

<style lang="scss">
@import "./TimeSheetManage.scss";
</style>