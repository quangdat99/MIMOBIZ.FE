<template>
  <dynamic-popup :width="600" :height="600" class="calculator-x2-popup" :title="title"
    @beforeOpen="beforeOpen($event, close)">
    <template v-slot:icon="{ close }">
      <div class="button icon24 close" @click="close()"></div>
    </template>
    <template v-slot:content>
      <div class="h-100 d-flex flex-column popup-container">
        <filter-grid
          v-model="filterGrid"
          :fields="filterData"
          @update:modelValue="(dataFilter) => filterGridView(dataFilter)"
          class="mb-3"
        />
        <grid-view 
        class="flex1"
          ref="gridView" 
          :fields="['time_sheet_code', 'bookmark_type_code', 'workload']" 
          :headers="headers" 
          :multiple="false"
          :data="data"
          :filters="filters" >
            <template v-slot:item-time_sheet_code="{ item }">
              <span class="txt-link" @click="clickTimeSheet($event, item)">{{
                item.time_sheet_code
              }}</span>
            </template>
          </grid-view>
      </div>
    </template>

    <template v-slot:footer="{ close }">
      <div class="h-100 d-flex align-center flex1">
        <div class="flex1 flex-end">
          <base-button class="transparent" type="secondary" text="Đóng" @click="close()"></base-button>
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
import baseDetail from "@/views/baseDetail.js";
import timesheetAPI from "@/apis/components/timesheetAPI";
import popupUtil from "@/commons/popupUtil";
import BaseTextarea from '@/components/textarea/BaseTextarea.vue';
import gridView from "@/components/gridView/GridView.vue";
import FilterGrid from "@/components/gridView/FilterGrid.vue";

export default {
  name: "CalculatorX2Popup",
  extends: baseDetail,
  components: {
    DynamicPopup,
    BaseTextarea,
    gridView,
    FilterGrid,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = ref([]);
    const filters = ref("");
    const filterGrid = ref({
      text: "",
      field: "All",
      field_name: "Tất cả",
    });
    const filterData = reactive([
      {
        field: "All",
        field_name: 'Tất cả',
      },
      {
        field: "time_sheet_code",
        field_name: 'time_sheet_code',
      },
      {
        field: "bookmark_type_code",
        field_name: 'bookmark_type_code',
      },
      {
        field: "workload",
        field_name: 'workload',
      },
    ]);
    const headers = reactive([
      {
        text: 'time_sheet_code', 
        value: 'time_sheet_code',
        sortable: true, width: 150,
      },
      {
        text: 'bookmark_type_code',
        value: 'bookmark_type_code',
        sortable: true,
      },
      {
        text: 'workload',
        value: 'workload',
        sortable: true,
        width: 80,
      },]
    );
    async function beforeOpen(e, close) {
      proxy.super('beforeOpen', baseDetail, e, close);

      let result = await timesheetAPI.getCalculatorX2(
        proxy._formParam.checkerId,
        proxy._formParam.fromDate,
        proxy._formParam.toDate
      );
      data.value = result.data;
    }
    function clickTimeSheet(e, item) {
      const me = proxy;
      let param = {
        data: item,
        id: item.time_sheet_id,
        mode: me.$ms.constant.FormState.View,
      };
      popupUtil.show("TimeSheetDetail", param);
    }
    function getFormTitle(mode) {
      proxy.title = `${proxy._formParam.checkerCode} - ${proxy._formParam.x2}`;
    }
    function filterGridView(dataFilter) {
      if (dataFilter.field == "All") {
        if (!dataFilter.text) {
          filters.value = "";
        } else {
          let filter = null;
          let filterDataList = filterData.filter((x) => x.field !== "All");
          for (let i = 0; i < filterDataList.length; i++) {
            const item = filterDataList[i];
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
      } else {
        let filter = {
          Field: dataFilter.field,
          Operator: "*",
          Value: dataFilter.text,
        };
        filters.value = JSON.stringify([filter]);
      }
    }
    return {
      keyRole: "calculator_x2",
      formName: "calculator_x2",
      headers,
      beforeOpen,
      data,
      clickTimeSheet,
      getFormTitle,
      filterData,
      filters,
      filterGrid,
      filterGridView,
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