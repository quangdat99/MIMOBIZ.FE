<template>
  <easy-data-table
    :alternating="alternating"
    :buttons-pagination="buttonsPagination"
    :headers="headers"
    :items="displayItems"
    @click-row="rowClick"
    v-model:items-selected="itemsSelected"
    :loading="loading"
    v-model:server-options="serverOptions"
    multi-sort
    :theme-color="'#154EC1'"
    table-class-name="customize-table"
    header-text-direction="center"
    body-text-direction="left"
    border-cell
    emptyMessage="Không có dữ liệu"
    :current-pagination-number="25"
    rowsOfPageSeparatorMessage="của"
    rowsPerPageMessage="Số dòng"
    :serverItemsLength="displayTotalRecord"
    :header-item-class-name="headerItemClassNameFunction"
    :body-row-class-name="bodyRowClassNameFunction"
    :body-expand-row-class-name="bodyExpandRowClassNameFunction"
    :body-item-class-name="bodyItemClassNameFunction"
  >
    <template #loading>
      <loading></loading>
    </template>

    <template #item-operation="item">
      <slot name="item-operation" :item="item"> </slot>
    </template>

    <template #item-time_sheet_code="item">
      <slot name="item-time_sheet_code" :item="item"> </slot>
    </template>
    <template #item-dossier_code="item">
      <slot name="item-dossier_code" :item="item"> </slot>
    </template>
    <template #item-x2="item">
      <slot name="item-x2" :item="item"> </slot>
    </template>
<!--     
    <template #item-bookmark_type_code="item">
      <slot name="item-bookmark_type_code" :item="item"> </slot>
    </template> -->
  </easy-data-table>
</template>

<script>
import { ref, getCurrentInstance, computed, onMounted, watch } from "vue";
import Loading from "@/components/loading/Loading.vue";

export default {
  components: {
    Loading,
  },
  props: {
    borderCell: {
      type: Boolean,
      default: true,
    },
    alternating: {
      type: Boolean,
      default: false,
    },
    buttonsPagination: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    api: {
      type: Object,
      default: null,
    },
    headers: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: null,
    },
    filters: {
      type: String,
      default: "",
    },
    funcData: {
      type: String,
      default: "getDataTable",
    },
    data: {
      type: Array,
      default: null,
    },
  rowClassHandler: {
    type: Function,
    default: () => ''
  }
  },
  emits: ["rowClick", "hasSort"],

  setup(props, { emit, expose }) {
    const { proxy } = getCurrentInstance();
    const itemsSelected = ref(props.multiple ? [] : null);
    const loading = ref(true);
    const totalRecord = ref(0);
    const serverOptions = ref({
      page: 1,
      rowsPerPage: 25,
      sortBy: [],
      sortType: [],
    });
    const lastParam = ref(null);
    const items = ref([]);

    const isClientMode = computed(() => {
      return props.data !== null && Array.isArray(props.data);
    });

    const applyFilter = (data, filterString) => {
      if (!filterString || filterString.trim() === "") {
        return data;
      }

      try {
        const filters = JSON.parse(filterString);
        if (!Array.isArray(filters) || filters.length === 0) {
          return data;
        }

        return data.filter((item) => {
          return filters.some((filter) => {
            return evaluateFilter(item, filter);
          });
        });
      } catch (e) {
        console.warn("Invalid filter format:", filterString);
        return data;
      }
    };

    const evaluateFilter = (item, filter) => {
      if (!filter.Field || filter.Value === undefined) {
        return true;
      }

      const fieldValue = getNestedValue(item, filter.Field);
      const filterValue = filter.Value;
      const operator = filter.Operator || "=";

      // Kiểm tra filter hiện tại (không bao gồm Ors)
      let currentFilterResult = false;
      switch (operator) {
        case "*":
          currentFilterResult = String(fieldValue || "")
            .toLowerCase()
            .includes(String(filterValue || "").toLowerCase());
          break;
        case "=":
          currentFilterResult = String(fieldValue) === String(filterValue);
          break;
        case "!=":
          currentFilterResult = String(fieldValue) !== String(filterValue);
          break;
        case ">":
          currentFilterResult = Number(fieldValue) > Number(filterValue);
          break;
        case ">=":
          currentFilterResult = Number(fieldValue) >= Number(filterValue);
          break;
        case "<":
          currentFilterResult = Number(fieldValue) < Number(filterValue);
          break;
        case "<=":
          currentFilterResult = Number(fieldValue) <= Number(filterValue);
          break;
        default:
          currentFilterResult = true;
      }

      // Nếu có Ors, kiểm tra các filter trong Ors
      if (filter.Ors && Array.isArray(filter.Ors) && filter.Ors.length > 0) {
        return (
          currentFilterResult ||
          filter.Ors.some((orFilter) => evaluateFilter(item, orFilter))
        );
      }

      return currentFilterResult;
    };

    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((current, prop) => {
        return current && current[prop] !== undefined ? current[prop] : null;
      }, obj);
    };

    const applySort = (data) => {
      if (
        !serverOptions.value.sortBy ||
        serverOptions.value.sortBy.length === 0
      ) {
        return data;
      }

      const sortedData = [...data];
      const sortBy = serverOptions.value.sortBy;
      const sortType = serverOptions.value.sortType || [];

      sortedData.sort((a, b) => {
        for (let i = 0; i < sortBy.length; i++) {
          const field = sortBy[i];
          const type = sortType[i] || "asc";
          const aValue = getNestedValue(a, field);
          const bValue = getNestedValue(b, field);

          let comparison = 0;
          if (aValue === null || aValue === undefined) {
            comparison = 1;
          } else if (bValue === null || bValue === undefined) {
            comparison = -1;
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue;
          } else {
            comparison = String(aValue).localeCompare(String(bValue));
          }

          if (comparison !== 0) {
            return type === "desc" ? -comparison : comparison;
          }
        }
        return 0;
      });

      return sortedData;
    };

    const applyPagination = (data) => {
      const page = serverOptions.value.page || 1;
      const rowsPerPage = serverOptions.value.rowsPerPage || 25;
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return data.slice(start, end);
    };

    const processedItems = computed(() => {
      if (!isClientMode.value) {
        return items.value;
      }

      let result = [...(props.data || [])];

      result = applyFilter(result, props.filters);
      result = applySort(result);
      result = applyPagination(result);

      return result;
    });

    const clientTotalRecord = computed(() => {
      if (!isClientMode.value) {
        return totalRecord.value;
      }

      let result = [...(props.data || [])];
      result = applyFilter(result, props.filters);
      return result.length;
    });

    const displayItems = computed(() => {
      return isClientMode.value ? processedItems.value : items.value;
    });

    const displayTotalRecord = computed(() => {
      return isClientMode.value ? clientTotalRecord.value : totalRecord.value;
    });

    const bodyRowClassNameFunction = (item, rowNumber) => {
      if (props.rowClassHandler) {
        return props.rowClassHandler(item, rowNumber);
      }
      return "row";
    };

    const bodyExpandRowClassNameFunction = (item, rowNumber) => {
      return "expand-row";
    };

    const bodyItemClassNameFunction = (column, rowNumber) => {
      if (column) return column;
      return "";
    };

    const headerItemClassNameFunction = (header, columnNumber) => {
      if (header.value) return header.value;
      return "";
    };
    /**
     * Sự kiện click row
     */
    const rowClick = (item) => {
      emit("rowClick", item);
    };

    const getPayload = () => {
      let payload = serverOptions.value;
      return cloneDeep(payload);
    };

    onMounted(async () => {
      serverOptions.value.fields = props.fields;
      window.grid = proxy;
      if (!isClientMode.value) {
        await loadData();
      } else {
        loading.value = false;
      }
    });
    function cloneDeep(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    const loadData = async () => {
      if (isClientMode.value) {
        return;
      }

      loading.value = true;
      let api = props.api;
      if (api) {
        let payload = getPayload();
        payload.size = payload.rowsPerPage;
        payload.fields = props.fields;
        payload.filter = props.filters;
        try {
          let res = await api[props.funcData](payload);
          if (res && res.statusCode == 200) {
            items.value = res.data;
            totalRecord.value = res.totalRecord;
            lastParam.value = payload;
          }
        } catch (e) {
          console.log(e);
        } finally {
          loading.value = false;
        }
      } else {
        loading.value = false;
      }
    };
    expose({ loadData, serverOptions, lastParam, itemsSelected });

    watch(
      serverOptions,
      async () => {
        if (!isClientMode.value) {
          await loadData();
        }
      },
      { deep: true }
    );

    watch(
      () => props.data,
      () => {
        if (isClientMode.value) {
          loading.value = false;
        }
      },
      { deep: true }
    );

    watch(
      () => props.filters,
      () => {
        if (isClientMode.value) {
          serverOptions.value.page = 1;
        }
      }
    );

    watch(
      serverOptions.value.sortBy,
      (value) => {
        if (value.length > 0) {
          emit("hasSort", true);
        } else {
          emit("hasSort", false);
        }
      },
      { deep: true }
    );

    return {
      items,
      displayItems,
      displayTotalRecord,
      rowClick,
      itemsSelected,
      loading,
      serverOptions,
      totalRecord,
      bodyRowClassNameFunction,
      bodyExpandRowClassNameFunction,
      bodyItemClassNameFunction,
      headerItemClassNameFunction,
    };
  },
};
</script>
<style lang="scss">
@import "./GridView.scss";
</style>