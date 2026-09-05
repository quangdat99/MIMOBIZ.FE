<template>
  <div class="base-list-manage manufacturer-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách Manufacturer</div>
        <div class="handle-multi">
          <button class="ml-2 btn-filter pointer" @click="deleteMultipe()">
            Xóa nhiều
          </button>
        </div>
        <div class="toolbar-filter ml-4">
          <filter-grid
            v-model="filterGrid"
            :fields="filterData"
            @update:modelValue="(dataFilter) => filterGridView(dataFilter)"
            :widthCombo="180"
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
          'manufacturer_id',
          'stt',
          'cong_ty',
          'dia_chi',
          'thong_tin_nhan_su',
          'chuyen_phat',
          'ghi_chu',
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
      </grid-view>
    </div>
  </div>
</template>

<script>
import gridView from "@/components/gridView/GridView.vue";
import { useManufacturerManage } from "./ManufacturerManage.js";
import manufacturerAPI from "@/apis/components/manufacturerAPI.js";
import popupUtil from "@/commons/popupUtil";
import {
  ref,
  onMounted,
  getCurrentInstance,
  reactive,
  watch,
  computed,
} from "vue";
import baseList from "@/views/baseList";
export default {
  extends: baseList,
  components: { gridView },
  setup() {
    const { proxy } = getCurrentInstance();
    const { headers, filterData } = useManufacturerManage();

    return {
      moduleName: "Manufacturer",
      formNameDetail: "ManufacturerDetail",
      idField: "manufacturer_id",
      codeField: "stt",
      keyRole: "manufacturer",
      headers,
      api: manufacturerAPI,
      filterData,
    };
  },
};
</script>

<style lang="scss">
@import "@/views/admin/timesheet/TimeSheetManage.scss";
</style>