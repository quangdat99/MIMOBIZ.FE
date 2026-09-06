<template>
  <div class="base-list-manage employee-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title-group">
          <div class="toolbar-title">Nhân viên / Người dùng</div>
          <span class="table-badge">sys_user & employee</span>
        </div>
        <div class="toolbar-filter ml-4">
          <div class="search-input-wrapper">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              class="quick-search-input"
              v-model="searchQuery"
              placeholder="Tìm theo mã, tên, email, phòng ban..."
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
          <span class="material-symbols-outlined">person_add</span>
          <span>Thêm nhân viên</span>
        </button>
      </div>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="category-stat-row">
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <span class="material-symbols-outlined">badge</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tổng nhân viên</span>
          <span class="stat-value">{{ employeeList.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <span class="material-symbols-outlined">account_circle</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tài khoản User active</span>
          <span class="stat-value">{{ activeUserCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-purple">
          <span class="material-symbols-outlined">work</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Chức danh phân công</span>
          <span class="stat-value">{{ assignedTitleCount }}</span>
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
                <th style="width: 50px; text-align: center;">STT</th>
                <th style="width: 120px;">Mã NV</th>
                <th style="min-width: 200px;">Họ và tên</th>
                <th style="min-width: 180px;">Tài khoản (sys_user)</th>
                <th style="min-width: 160px;">Phòng ban</th>
                <th style="min-width: 140px;">Chức danh / Vị trí</th>
                <th style="width: 130px; text-align: center;">Trạng thái</th>
                <th style="width: 100px; text-align: center;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredEmployees" :key="item.employee_id || idx">
                <td style="text-align: center; font-weight: 500; color: #64748B;">{{ idx + 1 }}</td>
                <td>
                  <span class="code-badge">{{ item.employee_code }}</span>
                </td>
                <td>
                  <div class="user-profile-cell">
                    <div class="avatar-circle">
                      {{ (item.full_name || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div class="user-details">
                      <span class="font-semibold text-slate-800">{{ item.full_name }}</span>
                      <span class="text-xs text-slate-500">{{ item.email_personal || "Chưa có email cá nhân" }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="account-cell" v-if="item.email_login || item.phone_login">
                    <span class="material-symbols-outlined account-icon">verified_user</span>
                    <span class="text-sm font-medium text-blue-600">{{ item.email_login || item.phone_login }}</span>
                  </div>
                  <span v-else class="text-xs text-slate-400 italic">Chưa cấp tài khoản</span>
                </td>
                <td>
                  <span class="department-tag">{{ item.department_name || "—" }}</span>
                </td>
                <td>
                  <div class="role-group">
                    <span class="job-title">{{ item.job_title_name || item.job_position_name || "Nhân viên" }}</span>
                  </div>
                </td>
                <td style="text-align: center;">
                  <span class="status-pill" :class="item.status === 0 ? 'status-inactive' : 'status-active'">
                    {{ item.status === 0 ? 'Đã nghỉ' : 'Đang làm việc' }}
                  </span>
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
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="8" class="empty-cell">
                  <span class="material-symbols-outlined empty-icon">person_off</span>
                  <span>Không tìm thấy nhân viên / người dùng phù hợp</span>
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
  name: "EmployeeManage",
  setup() {
    const searchQuery = ref("");
    const employeeList = ref([
      {
        employee_id: "1",
        employee_code: "NV001",
        full_name: "Đinh Quang Đạt",
        email_personal: "quangdat@mimobiz.com",
        email_login: "admin@mimobiz.com",
        department_name: "Ban Giám Đốc",
        job_title_name: "Giám Đốc Kỹ Thuật",
        job_position_name: "Ban Lãnh Đạo",
        status: 1,
      },
      {
        employee_id: "2",
        employee_code: "NV002",
        full_name: "Nguyễn Văn An",
        email_personal: "an.nguyen@mimobiz.com",
        email_login: "an.nguyen",
        department_name: "Phòng Quản lý chất lượng (Checker)",
        job_title_name: "Senior Checker",
        job_position_name: "Nhân viên thẩm định",
        status: 1,
      },
      {
        employee_id: "3",
        employee_code: "NV003",
        full_name: "Trần Thị Bích",
        email_personal: "bich.tran@mimobiz.com",
        email_login: "bich.tran",
        department_name: "Phòng Kế toán - Tài chính",
        job_title_name: "Kế toán trưởng",
        job_position_name: "Trưởng nhóm",
        status: 1,
      },
    ]);

    const loadData = async () => {
      try {
        const res = await Http.axios().get("api/Employees");
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          employeeList.value = res.data;
        }
      } catch (err) {
        console.warn("Could not load employees from API, keeping initial data", err);
      }
    };

    onMounted(() => {
      loadData();
    });

    const filteredEmployees = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return employeeList.value;
      return employeeList.value.filter(
        (e) =>
          e.employee_code?.toLowerCase().includes(q) ||
          e.full_name?.toLowerCase().includes(q) ||
          e.email_personal?.toLowerCase().includes(q) ||
          e.email_login?.toLowerCase().includes(q) ||
          e.department_name?.toLowerCase().includes(q) ||
          e.job_title_name?.toLowerCase().includes(q)
      );
    });

    const activeUserCount = computed(() => {
      return employeeList.value.filter((e) => e.email_login || e.phone_login).length;
    });

    const assignedTitleCount = computed(() => {
      return employeeList.value.filter((e) => e.job_title_name || e.job_position_name).length;
    });

    const addNew = () => {
      alert("Tính năng thêm mới nhân viên đang sẵn sàng.");
    };

    const editItem = (item) => {
      alert(`Chỉnh sửa nhân viên: ${item.full_name}`);
    };

    const deleteItem = (item) => {
      if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${item.full_name}?`)) {
        employeeList.value = employeeList.value.filter((e) => e.employee_id !== item.employee_id);
      }
    };

    return {
      searchQuery,
      employeeList,
      filteredEmployees,
      activeUserCount,
      assignedTitleCount,
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

.employee-manage {
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
    min-width: 280px;

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

        &.bg-purple {
          background: rgba(147, 51, 234, 0.12);
          color: #9333EA;
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

    .user-profile-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .avatar-circle {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: linear-gradient(135deg, #154EC1, #3B82F6);
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
      }
    }

    .account-cell {
      display: flex;
      align-items: center;
      gap: 6px;

      .account-icon {
        font-size: 16px;
        color: var(--va-primary, #154EC1);
      }
    }

    .department-tag {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      background: #F1F5F9;
      color: #475569;
      font-size: 12px;
      font-weight: 500;
    }

    .job-title {
      font-weight: 500;
      color: #1E293B;
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

      &.status-inactive {
        background: rgba(239, 68, 68, 0.12);
        color: #EF4444;
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
