<template>
  <div class="base-list-manage taiLieuGoc-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách TaiLieuGoc</div>
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
          'tai_lieu_goc_id',
          'stt',
          'ngay_nhan',
          'ngay_gui',
          'loai_giay_to',
          'product_name',
          'dossier_code',
          'dossier_id',
          'customer',
          'bookmark_type_code',
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
        <template v-slot:item-dossier_code="{ item }">
        {{ item.dossier_code }}
        </template>
      </grid-view>
    </div>
  </div>
</template>

<script>
import gridView from "@/components/gridView/GridView.vue";
import { useTaiLieuGocManage } from "./TaiLieuGocManage.js";
import taiLieuGocAPI from "@/apis/components/taiLieuGocAPI.js";
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
    const { headers, filterData } = useTaiLieuGocManage();

    return {
      moduleName: "TaiLieuGoc",
      formNameDetail: "TaiLieuGocDetail",
      idField: "tai_lieu_goc_id",
      codeField: "stt",
      keyRole: "tai_lieu_goc",
      headers,
      api: taiLieuGocAPI,
      filterData,
    };
  },
};
</script>

<style lang="scss">
@import "@/views/admin/timesheet/TimeSheetManage.scss";
</style>