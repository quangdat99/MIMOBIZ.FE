<template>
  <div class="base-list-manage department-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title-group">
          <div class="toolbar-title">Cơ cấu tổ chức</div>
          <span class="table-badge">department</span>
        </div>
        <div class="toolbar-filter ml-4">
          <div class="search-input-wrapper">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              class="quick-search-input"
              v-model="searchQuery"
              placeholder="Tìm theo mã, tên phòng ban..."
            />
            <span
              v-if="searchQuery"
              class="material-symbols-outlined clear-icon"
              @click="searchQuery = ''"
            >close</span>
          </div>
        </div>
      </div>
      <div class="toolbar-right">
        <div
          class="icon24 reload cursor-pointer mr-3"
          title="Tải lại dữ liệu"
          @click="loadData"
        >
          <span class="material-symbols-outlined">refresh</span>
        </div>
        <button class="btn-primary" @click="addNew">
          <span class="material-symbols-outlined">add</span>
          <span>Thêm phòng ban</span>
        </button>
      </div>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="category-stat-row">
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tổng số phòng ban</span>
          <span class="stat-value">{{ filteredDepartments.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Đang hoạt động</span>
          <span class="stat-value">{{ filteredDepartments.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-orange">
          <span class="material-symbols-outlined">account_tree</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Cấp quản lý</span>
          <span class="stat-value">Đa tầng</span>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="container-grid">
      <div class="custom-table-card">
        <div class="table-responsive">
          <table class="modern-data-table">
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">STT</th>
                <th style="width: 160px;">Mã phòng ban</th>
                <th>Tên phòng ban / Cơ cấu</th>
                <th style="width: 220px;">Đơn vị trực thuộc / Cấp cha</th>
                <th style="width: 140px; text-align: center;">Trạng thái</th>
                <th style="width: 100px; text-align: center;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredDepartments" :key="item.department_id || idx">
                <td style="text-align: center; font-weight: 500; color: #64748B;">{{ idx + 1 }}</td>
                <td>
                  <span class="code-badge">{{ item.department_code }}</span>
                </td>
                <td>
                  <div class="department-name-cell">
                    <span class="material-symbols-outlined tree-icon">corporate_fare</span>
                    <span class="font-medium text-slate-800">{{ item.department_name }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-slate-600">{{ item.parent_name || "—" }}</span>
                </td>
                <td style="text-align: center;">
                  <span class="status-pill status-active">Đang sử dụng</span>
                </td>
                <td style="text-align: center;">
                  <div class="row-actions">
                    <button class="action-icon-btn" title="Chỉnh sửa" @click="editItem(item)">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="action-icon-btn danger" title="Xóa" @click="deleteItem(item)">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredDepartments.length === 0">
                <td colspan="6" class="empty-cell">
                  <span class="material-symbols-outlined empty-icon">folder_off</span>
                  <span>Không tìm thấy cơ cấu tổ chức phù hợp</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Http from "@/apis/base/httpConfig.js";

export default {
  name: "DepartmentManage",
  setup() {
    const searchQuery = ref("");
    const departmentList = ref([
      { department_id: "1", department_code: "BGD", department_name: "Ban Giám Đốc", parent_name: "" },
      { department_id: "2", department_code: "P-HR", department_name: "Phòng Nhân sự & Hành chính", parent_name: "Ban Giám Đốc" },
      { department_id: "3", department_code: "P-KT", department_name: "Phòng Kế toán - Tài chính", parent_name: "Ban Giám Đốc" },
      { department_id: "4", department_code: "P-KD", department_name: "Phòng Kinh doanh & Marketing", parent_name: "Ban Giám Đốc" },
      { department_id: "5", department_code: "P-TECH", department_name: "Phòng Kỹ thuật & Công nghệ", parent_name: "Ban Giám Đốc" },
      { department_id: "6", department_code: "P-QC", department_name: "Phòng Quản lý chất lượng (Checker)", parent_name: "Phòng Kỹ thuật & Công nghệ" },
    ]);

    const loadData = async () => {
      try {
        const res = await Http.axios().get("api/Employees");
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const deptMap = new Map();
          res.data.forEach((e) => {
            if (e.department_code && !deptMap.has(e.department_code)) {
              deptMap.set(e.department_code, {
                department_id: e.department_id,
                department_code: e.department_code,
                department_name: e.department_name,
                parent_name: "Công ty",
              });
            }
          });
          if (deptMap.size > 0) {
            departmentList.value = Array.from(deptMap.values());
          }
        }
      } catch (err) {
        console.warn("Could not fetch departments from API, using fallback data", err);
      }
    };

    onMounted(() => {
      loadData();
    });

    const filteredDepartments = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return departmentList.value;
      return departmentList.value.filter(
        (d) =>
          d.department_code?.toLowerCase().includes(q) ||
          d.department_name?.toLowerCase().includes(q) ||
          d.parent_name?.toLowerCase().includes(q)
      );
    });

    const addNew = () => {
      alert("Tính năng thêm phòng ban mới đang sẵn sàng.");
    };

    const editItem = (item) => {
      alert(`Chỉnh sửa phòng ban: ${item.department_name}`);
    };

    const deleteItem = (item) => {
      if (confirm(`Bạn có chắc chắn muốn xóa phòng ban ${item.department_name}?`)) {
        departmentList.value = departmentList.value.filter((d) => d.department_code !== item.department_code);
      }
    };

    return {
      searchQuery,
      departmentList,
      filteredDepartments,
      loadData,
      addNew,
      editItem,
      deleteItem,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/views/admin/timesheet/TimeSheetManage.scss";

.department-manage {
  .toolbar-title-group {
    display: flex;
    align-items: center;
    gap: 10px;

    .table-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(21, 78, 193, 0.1);
      color: var(--va-primary, #154EC1);
      font-family: monospace;
    }
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 260px;

    @media (max-width: 640px) {
      min-width: 100%;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      font-size: 18px;
      color: #94A3B8;
      pointer-events: none;
    }

    .clear-icon {
      position: absolute;
      right: 10px;
      font-size: 16px;
      color: #94A3B8;
      cursor: pointer;

      &:hover {
        color: #EF4444;
      }
    }

    .quick-search-input {
      width: 100%;
      height: 36px;
      padding: 0 32px 0 34px;
      font-size: 13px;
      border-radius: 8px;
      border: 1px solid var(--va-background-border, #E2E8F0);
      background-color: var(--va-background-secondary, #FFFFFF);
      color: var(--va-text-primary, #1E293B);
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: var(--va-primary, #154EC1);
        box-shadow: 0 0 0 3px rgba(21, 78, 193, 0.12);
      }
    }
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px;
    border-radius: 8px;
    border: none;
    background: var(--va-primary, #154EC1);
    color: #FFFFFF;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    .material-symbols-outlined {
      font-size: 18px;
    }

    &:hover {
      background: #113ea0;
      box-shadow: 0 4px 8px rgba(21, 78, 193, 0.25);
    }
  }

  .category-stat-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
    margin-bottom: 16px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      background: var(--va-background-element, #F8FAFC);
      border: 1px solid var(--va-background-border, #E2E8F0);

      .stat-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;

        &.bg-blue {
          background: rgba(21, 78, 193, 0.12);
          color: var(--va-primary, #154EC1);
        }

        &.bg-green {
          background: rgba(22, 163, 74, 0.12);
          color: #16A34A;
        }

        &.bg-orange {
          background: rgba(234, 88, 12, 0.12);
          color: #EA580C;
        }

        .material-symbols-outlined {
          font-size: 22px;
        }
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-label {
          font-size: 12px;
          color: var(--va-text-secondary, #64748B);
          font-weight: 500;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--va-text-primary, #1E293B);
          line-height: 1.2;
        }
      }
    }
  }

  .custom-table-card {
    border: 1px solid var(--va-background-border, #E2E8F0);
    border-radius: 8px;
    overflow: hidden;
    background: #FFFFFF;
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .modern-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead th {
      background: #F8FAFC;
      color: #475569;
      font-weight: 600;
      font-size: 12.5px;
      padding: 10px 14px;
      border-bottom: 1px solid #E2E8F0;
      white-space: nowrap;
    }

    tbody td {
      padding: 12px 14px;
      border-bottom: 1px solid #F1F5F9;
      color: #1E293B;
      vertical-align: middle;
    }

    tbody tr:hover {
      background-color: #F8FAFC;
    }

    .code-badge {
      display: inline-block;
      font-weight: 600;
      font-family: monospace;
      padding: 3px 8px;
      background: #F1F5F9;
      color: #334155;
      border-radius: 4px;
      font-size: 12px;
    }

    .department-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .tree-icon {
        font-size: 18px;
        color: #64748B;
      }
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;

      &.status-active {
        background: rgba(22, 163, 74, 0.12);
        color: #16A34A;
      }
    }

    .row-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      .action-icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 6px;
        border: 1px solid #E2E8F0;
        background: #FFFFFF;
        color: #64748B;
        cursor: pointer;
        transition: all 0.15s ease;

        .material-symbols-outlined {
          font-size: 16px;
        }

        &:hover {
          border-color: #154EC1;
          color: #154EC1;
          background: #F1F5F9;
        }

        &.danger:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEF2F2;
        }
      }
    }

    .empty-cell {
      text-align: center;
      padding: 40px !important;
      color: #94A3B8;

      .empty-icon {
        display: block;
        font-size: 32px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
