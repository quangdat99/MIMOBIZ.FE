<template>
  <div class="base-list-manage bookmarkType-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách loại hồ sơ</div>
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
          'bookmark_type_id',
          'bookmark_type_code',
          'description',
          'workload',
          'x3',
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
import { useBookmarkTypeManage } from "../bookmarkType/BookmarkTypeManage.js";
import bookmarkTypeAPI from "@/apis/components/bookmarkTypeAPI.js";
import { getCurrentInstance } from "vue";
import baseList from "@/views/baseList";
export default {
  extends: baseList,
  components: { gridView },
  setup() {
    const { proxy } = getCurrentInstance();
    const { headers, filterData } = useBookmarkTypeManage();
    function generationMessage(data) {
      return `Loại hồ sơ <span class="color-primary">${
        data.code
      }</span> đã phát sinh dữ liệu trên hồ sơ/dossier "${data.data.join(", ")}"`;
    }

    return {
      moduleName: "Loại hồ sơ",
      formNameDetail: "BookmarkTypeDetail",
      idField: "bookmark_type_id",
      codeField: "bookmark_type_code",
      keyRole: "bookmark_type",
      headers,
      api: bookmarkTypeAPI,
      generationMessage,
      filterData,
    };
  },
};
</script>

<style lang="scss">
@import "@/views/admin/timesheet/TimeSheetManage.scss";
</style>