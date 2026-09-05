import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useDossierManage = () => {
  const { proxy } = getCurrentInstance();

  const headers = reactive([
    {
      text: "closed_string", value: "closed_string",
      sortable: true, width: 80,
    },
    {
      text: "dossier_code", value: "dossier_code",
      sortable: true, width: 80,
    },
    {
      text: "checker_code", value: "checker_code",
      sortable: true, width: 150,
    },
    {
      text: "contract_code", value: "contract_code",
      sortable: true, width: 100,
    },
    {
      text: "bookmark_type_code", value: "bookmark_type_code",
      sortable: true, width: 100,
    },
    {
      text: "description",
      value: "description", width: 150,
      sortable: true,
    },
    {
      text: "customer",
      value: "customer", width: 100,
      sortable: true,
    },
    {
      text: "product_name",
      value: "product_name",
      sortable: true,
      width: 100,
    },
    {
      text: "api",
      value: "api",
      sortable: true,
      width: 200,
    },
    {
      text: "dosage_form",
      value: "dosage_form", width: 100,
      sortable: true,
    },
    {
      text: "manufacturer",
      value: "manufacturer",
      sortable: true,
      width: 150,
    },
    {
      text: "applicant",
      value: "applicant",
      sortable: true,
      width: 150,
    },
    {
      text: "visa_no",
      value: "visa_no",
      sortable: true,
      width: 100,
    },
    {
      text: "note",
      value: "note",
      sortable: true,
      width: 150,
    },
    {
      text: "submission_code",
      value: "submission_code",
      sortable: true,
      width: 100,
    },
    {
      text: "submission_date",
      value: "submission_date_string",
      sortable: true,
      width: 100,
    },
    {
      text: "approved_date",
      value: "approved_date_string",
      sortable: true,
      width: 100,
    },
    {
      text: "tt1",
      value: "tt1",
      sortable: true,
      width: 100,
    },
    {
      text: "tt2",
      value: "tt2",
      sortable: true,
      width: 100,
    },
    {
      text: "tt3",
      value: "tt3",
      sortable: true,
      width: 100,
    },
    {
      text: "Tùy chọn",
      value: "operation",
      class: "operation",
      width: 80
    }
  ]);

  const filterData = reactive([
    {
      field: "All",
      field_name: 'Tất cả',
    },
    {
      field: "closed_string",
      field_name: 'closed_string',
    },
    {
      field: "dossier_code",
      field_name: 'dossier_code',
    },
    {
      field: "checker_code",
      field_name: 'checker_code',
    },
    {
      field: "contract_code",
      field_name: 'contract_code',
    },
    {
      field: "bookmark_type_code",
      field_name: 'bookmark_type_code',
    },
    {
      field: "description",
      field_name: "description",
    },
    {
      field: "customer",
      field_name: 'customer',
    },
    {
      field: "dosage_form",
      field_name: 'dosage_form',
    },
    {
      field: "product_name",
      field_name: 'product_name',
    },
    {
      field: "api",
      field_name: 'api',
    },
    {
      field: "manufacturer",
      field_name: 'manufacturer',
    },
    {
      field: "applicant",
      field_name: 'applicant',
    },
    {
      field: "submission_code",
      field_name: 'submission_code',
    },
    {
      field: "submission_date_string",
      field_name: 'submission_date_string',
    },
    {
      field: "approved_date_string",
      field_name: 'approved_date_string',
    },
    {
      field: "tt1",
      field_name: 'tt1',
    },
    {
      field: "tt2",
      field_name: 'tt2',
    },
    {
      field: "tt3",
      field_name: 'tt3',
    },
    {
      field: "visa_no",
      field_name: 'visa_no',
    },
    {
      field: "note",
      field_name: 'note',
    },
  ]);

  return {
    headers,
    filterData,
  }
}