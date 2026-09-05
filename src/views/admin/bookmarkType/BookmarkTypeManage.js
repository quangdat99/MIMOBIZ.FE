import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useBookmarkTypeManage = () => {
  const { proxy } = getCurrentInstance();

  const headers = reactive([
    {
      text: "bookmark_type_code",
      value: "bookmark_type_code",
      width: 150,
      sortable: true,
    },
    {
      text: "description",
      value: "description",
      sortable: true,
    },
    {
      text: "workload",
      value: "workload",
      width: 80,
      sortable: true,
      direction: 'right',
    },
    {
      text: "x3",
      value: "x3",
      width: 80,
      sortable: true,
      align: 'center',
    },
    {
      text: "Tùy chọn", value: "operation",
      width: 80,
    }
  ]);

  const filterData = reactive([
    {
      field: "All",
      field_name: 'Tất cả',
    },
    {
      field: "bookmark_type_code",
      field_name: 'bookmark_type_code',
    },
    {
      field: "description",
      field_name: 'description',
    },
    {
      field: "workload",
      field_name: 'workload',
    },
    {
      field: "x3",
      field_name: 'x3',
    },
  ]);

  return {
    headers,
    filterData,
  }
}