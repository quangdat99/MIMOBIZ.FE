import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useTaiLieuGocManage = () => {
  const { proxy } = getCurrentInstance();

  const headers = reactive([
    {
      text: "stt",
      value: "stt",
      width: 100,
      sortable: true,
    },
    {
      text: "dossier_code",
      value: "dossier_code",
      sortable: true,
      width: 150,
    },
    {
      text: "customer",
      value: "customer",
      sortable: true,
      width: 150,
    },
    {
      text: "product_name",
      value: "product_name",
      sortable: true,
      width: 150,
    },
    {
      text: "bookmark_type_code",
      value: "bookmark_type_code",
      sortable: true,
      width: 150,
    },
    {
      text: "ngay_nhan",
      value: "ngay_nhan_string",
      sortable: true,
      width: 150,
    },
    {
      text: "loai_giay_to",
      value: "loai_giay_to",
      sortable: true,
      width: 300,
    },
    {
      text: "ngay_gui",
      value: "ngay_gui_string",
      sortable: true,
      width: 150,
    },
    {
      text: "ghi_chu",
      value: "ghi_chu",
      sortable: true,
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
      field: "dossier_code",
      field_name: 'dossier_code',
    },
    {
      field: "customer",
      field_name: 'customer',
    },
    {
      field: "product_name",
      field_name: 'product_name',
    },
    {
      field: "bookmark_type_code",
      field_name: 'bookmark_type_code',
    },
    {
      field: "ngay_nhan_string",
      field_name: 'ngay_nhan_string',
    },
    {
      field: "loai_giay_to",
      field_name: 'loai_giay_to',
    },
    {
      field: "ngay_gui_string",
      field_name: 'ngay_gui_string',
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