import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useCustomerManage = () => {
  const { proxy } = getCurrentInstance();


  const headers = reactive([
    {
      text: "stt",
      value: "stt",
      width: 100,
      sortable: true,
    },
    {
      text: "cong_ty",
      value: "cong_ty",
      sortable: true,
      width: 150,
    },
    {
      text: "ten_viet_tat",
      value: "ten_viet_tat",
      sortable: true,
    },
    {
      text: "dia_chi",
      value: "dia_chi",
      sortable: true,
      width: 250,
    },
    {
      text: "thong_tin_nhan_su",
      value: "thong_tin_nhan_su",
      sortable: true,
    },
    {
      text: "chuyen_phat",
      value: "chuyen_phat",
      sortable: true,
      width: 150,
    },
    {
      text: "ghi_chu",
      value: "ghi_chu",
      sortable: true,
      width: 150,
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
      field: "stt",
      field_name: 'stt',
    },
    {
      field: "cong_ty",
      field_name: 'cong_ty',
    },
    {
      field: "ten_viet_tat",
      field_name: "ten_viet_tat",
    },
    {
      field: "dia_chi",
      field_name: 'dia_chi',
    },
    {
      field: "thong_tin_nhan_su",
      field_name: 'thong_tin_nhan_su',
    },
    {
      field: "chuyen_phat",
      field_name: 'chuyen_phat',
    },
    {
      field: "ghi_chu",
      field_name: 'ghi_chu',
    },
  ]);

  return {
    headers,
    filterData,
  }
}