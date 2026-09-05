<template>
  <div class="base-list-manage checker-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách nhân viên</div>
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
          />
        </div>
      </div>
      <div class="toolbar-right">
        <div
          class="icon24 reload cursor-pointer"
          title="Lấy lại dữ liệu"
          @click="refresh"
        ></div>
        <base-button
          v-if="context.role == 1"
          class="ml-4"
          text="Thêm mới"
          @click="add()"
        >
        </base-button>
      </div>
    </div>
    <div class="container-grid">
      <grid-view
        ref="gridView"
        :api="api"
        :fields="[
          'checker_id',
          'checker_code',
          'checker_name',
          'email',
          'phone_number',
          'ref_x1',
          'ref_x2',
          'ref_x3',
          'role',
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
              v-if="context.role == 1 && item.role != 1"
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
import { useCheckerManage } from "./CheckerManage.js";
import checkerAPI from "@/apis/components/checkerAPI.js";
import { mapGetters } from "vuex";
import {
  ref,
  onMounted,
  getCurrentInstance,
  defineComponent,
  reactive,
  watch,
  computed,
} from "vue";
import baseList from "@/views/baseList";
export default defineComponent({
  extends: baseList,
  components: { gridView },
  setup() {
    const { proxy } = getCurrentInstance();
    const { headers, filterData } = useCheckerManage();

    function generationMessage(data) {
      return `Nhân viên <span class="color-primary">${
        data.code
      }</span> đã phát sinh dữ liệu trên ${data.type == 'temesheet'? 'hồ sơ' : 'dossier'} "${data.data.join(", ")}"`;
    }
    function customSelect(selecteds) {
      return selecteds.filter((x) => x.role != 1);
    }

    return {
      moduleName: "Nhân viên",
      formNameDetail: "CheckerDetail",
      idField: "checker_id",
      codeField: "checker_code",
      nameField: "checker_name",
      keyRole: "checker",
      headers,
      api: checkerAPI,
      filterData,
      generationMessage,
      customSelect,
    };
  },
  computed: {
    ...mapGetters({
      context: "moduleContext/Context",
    }),
  },
});
</script>

<style lang="scss" scoped>
@import "@/views/admin/timesheet/TimeSheetManage.scss";
</style>