import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useCheckerManage = () => {
  const { proxy } = getCurrentInstance();

  const headers = reactive([
    {
      text: "checker_code",
      value: "checker_code",
      width: 120,
      sortable: true,
    },
    {
      text: "checker_name",
      value: "checker_name",
      sortable: true,
    },
    {
      text: "email",
      value: "email",
      sortable: true,
      width: 180,
    },
    {
      text: "phone_number",
      value: "phone_number",
      sortable: true,
      width: 120,
    },
    {
      text: "ref_x1",
      value: "ref_x1",
      sortable: true,
      width: 80,
    },
    {
      text: "ref_x2",
      value: "ref_x2",
      sortable: true,
      width: 80,
    },
    {
      text: "ref_x3",
      value: "ref_x3",
      sortable: true,
      width: 80,
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
      field: "checker_code",
      field_name: 'checker_code',
    },
    {
      field: "checker_name",
      field_name: 'checker_name',
    },
    {
      field: "email",
      field_name: 'email',
    },
    {
      field: "phone_number",
      field_name: 'phone_number',
    },
    {
      field: "ref_x1",
      field_name: 'ref_x1',
    },
    {
      field: "ref_x2",
      field_name: 'ref_x2',
    },
    {
      field: "ref_x3",
      field_name: 'ref_x3',
    },
  ]);

  return {
    headers,
    filterData,
  }
}