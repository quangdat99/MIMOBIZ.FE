<template>
  <div class="base-list-manage calculator-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">Calculator</div>
        <div class="toolbar-filter ml-4">
          <filter-grid
            v-model="filterGrid"
            :fields="filterData"
            @update:modelValue="(dataFilter) => filterGridView(dataFilter)"
          />
        </div>
      </div>
      <div class="toolbar-right">
        <div class="labe-range mr-2">{{ labelRangeDate }}</div>
        <Datepicker
          v-model="dateRange"
          range
          :preset-ranges="presetRanges"
          cancelText="Hủy bỏ"
          selectText="Xác nhận"
          :format="format"
          style="width: 260px"
          @cleared="clearedDate"
          @update:model-value="updateDateRange"
          ><template #yearly="{ label, range, presetDateRange }">
            <span @click="presetDateRange(range)">{{ label }}</span>
          </template></Datepicker
        >
        <div
          class="icon24 export-excel cursor-pointer mr-4 ml-2"
          title="Xuất khẩu"
          @click="exportExcel"
        ></div>
        <div
          class="icon24 reload cursor-pointer mr-4"
          title="Lấy lại dữ liệu"
          @click="refresh"
        ></div>
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
          'workload',
          'x1',
          'x2',
          'x3',
        ]"
        :headers="headers"
        funcData="getCalculator"
        :filters="filters"
      >
        <template v-slot:item-x2="{ item }">
          <span class="txt-link" @click="clickX2($event, item)">{{
            item.x2
          }}</span>
        </template>
      </grid-view>
    </div>
  </div>
</template>

<script>
import gridView from "@/components/gridView/GridView.vue";
import { useCalculatorManage } from "../calculator/CalculatorManage.js";
import timesheetAPI from "@/apis/components/timesheetAPI.js";
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
import baseList from "@/views/baseList";
import { endOfYear, startOfYear } from "date-fns";
import moment from "moment";
import popupUtil from "@/commons/popupUtil";

export default {
  extends: baseList,
  components: { gridView },
  setup() {
    const { proxy } = getCurrentInstance();
    const { headers, filterData, presetRanges, format } = useCalculatorManage();
    const dateRange = ref();
    const labelRangeDate = ref("");
    const filterStatus = ref([]);
    const filters = ref("");
    // '[{"Field":"status_date","Operator":">=","Value":"2024-06-01T00:00:00"},{"Field":"status_date","Operator":"<=","Value":"2024-06-30T23:59:59"}]'

    function refresh() {
      proxy.$refs.gridView.serverOptions.sortBy = [];
      proxy.$refs.gridView.serverOptions.sortType = [];
    }
    async function exportExcel() {
      const me = proxy;
      let param = me.$refs.gridView.lastParam;
      param.page = 1;
      param.size = 10000;
      if (param) {
        let data = await timesheetAPI.exportExcelCalculator(param);
        let downloadLink = document.createElement("a");
        downloadLink.href =
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
          data;
        downloadLink.download = `Calculator.xlsx`;
        downloadLink.click();
        return data;
      }
    }
    onMounted(() => {
      dateRange.value = [startOfYear(new Date()), endOfYear(new Date())];
      handleDateRange(dateRange.value);
    });
    const clearedDate = () => {
      dateRange.value = [startOfYear(new Date()), endOfYear(new Date())];
      // updateDateRange(dateRange.value);
    };

    const handleDateRange = (dataRange) => {
      if (!dataRange) {
        dataRange = [startOfYear(new Date()), endOfYear(new Date())];
      }
      let existOption = presetRanges.value.find(
        (x) => x.range.toString() == dataRange.toString()
      );
      if (existOption) {
        labelRangeDate.value = existOption.label;
      } else {
        labelRangeDate.value = "Tùy chọn";
      }

      let fromDate = dataRange[0];
      let toDate = dataRange[1];
      if (fromDate && toDate) {
        filterStatus.value = [
          {
            Field: "status_date",
            Operator: ">=",
            Value: moment(fromDate).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            Field: "status_date",
            Operator: "<=",
            Value: moment(toDate).format("YYYY-MM-DD HH:mm:ss"),
          },
        ];
      } else {
        filterStatus.value = [];
      }
      filters.value = customPayload(filters.value);
    };

    /**
     * Thay đổi Thời gian
     */
    const updateDateRange = (dataRange) => {
      handleDateRange(dataRange);
      setTimeout(() => {
        proxy.$refs.gridView.loadData();
      }, 50);
    };
    function filterGridView(dataFilter) {
      let me = proxy;
      if (dataFilter.field == "All") {
        if (!dataFilter.text) {
          filters.value = "";
        } else {
          if (me.filterData) {
            let filter = null;
            let filterData = me.filterData.filter((x) => x.field !== "All");
            for (let i = 0; i < filterData.length; i++) {
              const item = filterData[i];
              if (i == 0) {
                filter = {
                  Field: item.field,
                  Operator: "*",
                  Value: dataFilter.text,
                };
              } else {
                filter = {
                  Field: item.field,
                  Operator: "*",
                  Value: dataFilter.text,
                  Ors: [filter],
                };
              }
            }
            filters.value = JSON.stringify([filter]);
          }
        }
      } else {
        let filter = {
          Field: dataFilter.field,
          Operator: "*",
          Value: dataFilter.text,
        };
        filters.value = JSON.stringify([filter]);
      }
      filters.value = customPayload(filters.value);
      setTimeout(() => {
        me.$refs.gridView.loadData();
      }, 100);
    }
    function customPayload(filter) {
      if (filterStatus.value.length > 0) {
        let fil = JSON.parse(filter || "[]");
        fil = fil
          .filter((x) => x.Field != "status_date")
          .concat(filterStatus.value);
        return JSON.stringify(fil);
      }
      return filter;
    }

    const clickX2 = async (event, item) => {
      event.preventDefault();
      event.stopPropagation();
      let fromDate = null;
      let toDate = null;
      if (dateRange.value && dateRange.value.length === 2) {
        fromDate = moment(dateRange.value[0]).format("YYYY-MM-DD HH:mm:ss");
        toDate = moment(dateRange.value[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      popupUtil.show('CalculatorX2Popup', {
        checkerId: item.checker_id,
        checkerCode: item.checker_code,
        x2: item.x2,
        fromDate: fromDate,
        toDate: toDate,
      });
    };

    return {
      headers,
      api: timesheetAPI,
      refresh,
      filterData,
      exportExcel,
      dateRange,
      presetRanges,
      format,
      labelRangeDate,
      clearedDate,
      updateDateRange,
      customPayload,
      filters,
      filterGridView,
      clickX2,
    };
  },
};
</script>

<style lang="scss">
@import "@/views/admin/timesheet/TimeSheetManage.scss";
</style>