<template>
  <div class="base-list-manage dossier-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Danh sách Dossier</div>
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
          'dossier_id',
          'closed',
          'dossier_code',
          'contract_code',
          'bookmark_type_id',
          'description',
          'customer',
          'dosage_form',
          'product_name',
          'api',
          'manufacturer',
          'applicant',
          'submission_code',
          'submission_date',
          'approved_date',
          'tt1',
          'tt2',
          'tt3',
          'visa_no',
          'note',
        ]"
        :headers="headers"
        :filters="filters"
        :rowClassHandler="rowClassHandler"
      >
        <template v-slot:item-operation="{ item }">
          <div class="d-flex flex-center">
            <div class="option cursor p-2" @click="updateClosed(item)">{{ item.closed ? 'Open' : 'Close' }}</div>
            <div
              class="icon24 edit cursor-pointer ml-1"
              title="Sửa"
              @click="gridRowActionClick('Edit', item)"
            ></div>
            <v-menu>
              <div
                class="icon24 research cursor-pointer ml-1"
              ></div>
              <template #popper>
                <div class="option cursor p-2" @click="gridRowActionClick('Duplicate', item)">Nhân bản</div>
                <div class="option cursor p-2" @click="genTimesheet(item)">Sinh hồ sơ</div>
                <div class="option cursor p-2" @click="genTaiLieuGoc(item)">Sinh TaiLieuGoc</div>
                <div class="option cursor p-2" @click="gridRowActionClick('Delete', item)">Xóa</div>
              </template>
            </v-menu>
          </div>
        </template>

        <template v-slot:item-dossier_code="{ item }">
          <span class="txt-link" @click="clickDossier($event, item)">{{
            item.dossier_code
          }}</span>
        </template>
      </grid-view>
    </div>
  </div>
</template>

<script>
import gridView from "@/components/gridView/GridView.vue";
import { useDossierManage } from "./DossierManage.js";
import dossierAPI from "@/apis/components/dossierAPI.js";
import popupUtil from "@/commons/popupUtil";
import loadCombobox from "@/commons/combobox/loadCombox.js";
import { showConfirm, showAlert } from "@/commons/globalMessage";
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
    const { headers, filterData } = useDossierManage();
    const dataBookmarkType = ref([]);
    onMounted(async () => {
      dataBookmarkType.value = await loadCombobox.getBookmarkType();
    });

    function clickDossier(e, item) {
      const me = proxy;
      let param = {
        data: item,
        id: item.dossier_id,
        mode: me.$ms.constant.FormState.Edit,
      };
      if (
        me.$refs.gridView &&
        typeof me.$refs.gridView.loadData === "function"
      ) {
        param.options = {
          submit: () => {
            me.$refs.gridView.loadData();
          },
        };
      }
      popupUtil.show("DossierDetail", param);
    }
    async function genTimesheet(item) {
      const me = proxy;
      let timeSheet = await dossierAPI.getTimesheetByDossierID(item.dossier_id);
      let newTimesheet = {
        contract: item.contract_code,
        bookmark_type_id: item.bookmark_type_id,
        checker_id: item.checker_id,
        customer: item.customer,
        task: item.product_name,
        detail: item.description,
        dossier_id: item.dossier_id,
      };
      let param = {};
      if (
        me.$refs.gridView &&
        typeof me.$refs.gridView.loadData === "function"
      ) {
        param.options = {
          submit: () => {
            me.$refs.gridView.loadData();
          },
        };
      }

      if (timeSheet) {
        param = {
          data: newTimesheet,
          id: timeSheet.time_sheet_id,
          mode: me.$ms.constant.FormState.Edit,
          generate: true,
        };
        showConfirm(
          `Dossier <span class="color-primary">${item.dossier_code}</span> đã được sinh hồ sơ <span class="color-primary">${timeSheet.time_sheet_code}</span>. <br>Bạn có muốn đồng bộ sang Hồ sơ <span class="color-primary">${timeSheet.time_sheet_code}</span> không?`,
          `Sinh hồ sơ`
        ).then((answer) => {
          if (answer) {
            if (
              me.RoleDetails.find((x) => x.key === "time_sheet")?.edit == false
            ) {
              showAlert(`Bạn không có quyền sửa Hồ sơ`);
              return;
            }
            popupUtil.show("TimeSheetDetail", param);
          }
        });
      } else {
        newTimesheet.time_sheet_code = item.dossier_code;
        param = {
          data: newTimesheet,
          mode: me.$ms.constant.FormState.Add,
          generate: true,
        };
        if (me.RoleDetails.find((x) => x.key === "time_sheet")?.add == false) {
          showAlert(`Bạn không có quyền thêm Hồ sơ`);
          return;
        }
        popupUtil.show("TimeSheetDetail", param);
      }
    }
    async function genTaiLieuGoc(item) {
      const me = proxy;
      let taiLieuGoc = await dossierAPI.getTaiLieuGocByDossierID(item.dossier_id);
      let newTaiLieuGoc = {
        dossier_id: item.dossier_id,
        dossier_code: item.dossier_code,
        product_name: item.product_name,
        customer: item.customer,
        bookmark_type_code: item.bookmark_type_code,
      };
      let param = {};
      if (
        me.$refs.gridView &&
        typeof me.$refs.gridView.loadData === "function"
      ) {
        param.options = {
          submit: () => {
            me.$refs.gridView.loadData();
          },
        };
      }

      if (taiLieuGoc) {
        param = {
          data: newTaiLieuGoc,
          id: taiLieuGoc.tai_lieu_goc_id,
          mode: me.$ms.constant.FormState.Edit,
          generate: true,
        };
        showConfirm(
          `Dossier <span class="color-primary">${item.dossier_code}</span> đã được sinh tài liệu gốc <span class="color-primary">${taiLieuGoc.stt}</span>. <br>Bạn có muốn đồng bộ sang Tài liệu gốc <span class="color-primary">${taiLieuGoc.stt}</span> không?`,
          `Sinh TaiLieuGoc`
        ).then((answer) => {
          if (answer) {
            if (
              me.RoleDetails.find((x) => x.key === "tai_lieu_goc")?.edit == false
            ) {
              showAlert(`Bạn không có quyền sửa Tài liệu gốc`);
              return;
            }
            popupUtil.show("TaiLieuGocDetail", param);
          }
        });
      } else {
        param = {
          data: newTaiLieuGoc,
          mode: me.$ms.constant.FormState.Add,
          generate: true,
        };
        if (me.RoleDetails.find((x) => x.key === "tai_lieu_goc")?.add == false) {
          showAlert(`Bạn không có quyền thêm Tài liệu gốc`);
          return;
        }
        popupUtil.show("TaiLieuGocDetail", param);
      }
    }
    async function updateClosed(item) {
      const me = proxy;
      let result = await dossierAPI.updateClosed(item.dossier_id, !item.closed);
      if (result) {
        showAlert(`Cập nhật trạng thái closed <span class="color-primary">${item.closed ? 'Open' : 'Close'}</span> cho Dossier <span class="color-primary">${item.dossier_code}</span> thành công`);
      } else {
        showAlert(`Cập nhật trạng thái closed <span class="color-primary">${item.closed ? 'Open' : 'Close'}</span> cho Dossier <span class="color-primary">${item.dossier_code}</span> thất bại`);
      }
      me.$refs.gridView.loadData();
    }
    function rowClassHandler(item, rowNumber) {
      if (item.closed) {
        return "row-closed";
      }
      return "";
    }
    return {
      moduleName: "Dossier",
      formNameDetail: "DossierDetail",
      idField: "dossier_id",
      codeField: "dossier_code",
      keyRole: "dossier",
      headers,
      api: dossierAPI,
      filterData,
      clickDossier,
      genTimesheet,
      genTaiLieuGoc,
      updateClosed,
      rowClassHandler,
    };
  },
};
</script>

<style lang="scss">
@import "@/views/admin/timesheet/TimeSheetManage.scss";
.row-closed,
.row-closed td {
  color: #139c04 !important;

  .txt-link {
    color: #139c04 !important;
  }
}
</style>