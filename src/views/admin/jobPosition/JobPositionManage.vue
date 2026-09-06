<template>
  <div class="base-list-manage job-position-manage">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title-group">
          <div class="toolbar-title">Chức vụ, chức danh</div>
          <span class="table-badge">job_position & job_title</span>
        </div>

        <!-- Tab Toggle Between Job Position and Job Title -->
        <div class="tab-pill-group ml-3">
          <button
            class="tab-pill-btn"
            :class="{ active: currentTab === 'job_position' }"
            @click="currentTab = 'job_position'"
          >
            <span class="material-symbols-outlined tab-icon">military_tech</span>
            <span>Chức vụ (job_position)</span>
            <span class="tab-count">{{ jobPositionList.length }}</span>
          </button>
          <button
            class="tab-pill-btn"
            :class="{ active: currentTab === 'job_title' }"
            @click="currentTab = 'job_title'"
          >
            <span class="material-symbols-outlined tab-icon">badge</span>
            <span>Chức danh (job_title)</span>
            <span class="tab-count">{{ jobTitleList.length }}</span>
          </button>
        </div>

        <div class="toolbar-filter ml-4">
          <div class="search-input-wrapper">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              class="quick-search-input"
              v-model="searchQuery"
              :placeholder="currentTab === 'job_position' ? 'Tìm chức vụ...' : 'Tìm chức danh...'"
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
          <span>{{ currentTab === 'job_position' ? 'Thêm chức vụ' : 'Thêm chức danh' }}</span>
        </button>
      </div>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="category-stat-row">
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <span class="material-symbols-outlined">military_tech</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tổng số Chức vụ</span>
          <span class="stat-value">{{ jobPositionList.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-purple">
          <span class="material-symbols-outlined">badge</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tổng số Chức danh</span>
          <span class="stat-value">{{ jobTitleList.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
        <div class="stat-info">
          <span class="stat-label">Trạng thái áp dụng</span>
          <span class="stat-value">Đang áp dụng</span>
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
                <th style="width: 160px;">Mã {{ currentTab === 'job_position' ? 'Chức vụ' : 'Chức danh' }}</th>
                <th>Tên {{ currentTab === 'job_position' ? 'Chức vụ' : 'Chức danh' }}</th>
                <th style="min-width: 250px;">Mô tả nhiệm vụ / Vai trò</th>
                <th style="width: 140px; text-align: center;">Trạng thái</th>
                <th style="width: 100px; text-align: center;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in currentDisplayItems" :key="item.id || idx">
                <td style="text-align: center; font-weight: 500; color: #64748B;">{{ idx + 1 }}</td>
                <td>
                  <span class="code-badge">{{ item.code }}</span>
                </td>
                <td>
                  <div class="job-name-cell">
                    <span class="material-symbols-outlined cell-icon">
                      {{ currentTab === 'job_position' ? 'military_tech' : 'badge' }}
                    </span>
                    <span class="font-medium text-slate-800">{{ item.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-slate-600">{{ item.description || "—" }}</span>
                </td>
                <td style="text-align: center;">
                  <span class="status-pill status-active">Đang áp dụng</span>
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
              <tr v-if="currentDisplayItems.length === 0">
                <td colspan="6" class="empty-cell">
                  <span class="material-symbols-outlined empty-icon">folder_off</span>
                  <span>Không tìm thấy dữ liệu phù hợp</span>
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
  name: "JobPositionManage",
  setup() {
    const currentTab = ref("job_position");
    const searchQuery = ref("");

    const jobPositionList = ref([
      { id: "1", code: "CV_GD", name: "Giám Đốc", description: "Điều hành toàn bộ hoạt động của công ty" },
      { id: "2", code: "CV_TP", name: "Trưởng phòng", description: "Quản lý và điều hành các hoạt động của bộ phận" },
      { id: "3", code: "CV_PP", name: "Phó phòng", description: "Hỗ trợ Trưởng phòng quản lý chuyên môn" },
      { id: "4", code: "CV_TN", name: "Trưởng nhóm / Team Leader", description: "Phụ trách nhóm dự án và tiến độ" },
      { id: "5", code: "CV_NV", name: "Nhân viên", description: "Thực hiện các công việc chuyên môn" },
    ]);

    const jobTitleList = ref([
      { id: "1", code: "CD_CEO", name: "Chief Executive Officer (CEO)", description: "Tổng giám đốc điều hành" },
      { id: "2", code: "CD_CTO", name: "Chief Technology Officer (CTO)", description: "Giám đốc công nghệ" },
      { id: "3", code: "CD_SR_CHK", name: "Senior Checker", description: "Chuyên viên thẩm định cấp cao" },
      { id: "4", code: "CD_CHK", name: "Checker", description: "Chuyên viên thẩm định hồ sơ, chứng từ" },
      { id: "5", code: "CD_ACC", name: "Kế toán viên tổng hợp", description: "Theo dõi hạch toán và dòng tiền" },
      { id: "6", code: "CD_SALES", name: "Chuyên viên tư vấn kinh doanh", description: "Phát triển khách hàng và đơn hàng" },
    ]);

    const loadData = async () => {
      try {
        const res = await Http.axios().get("api/Employees");
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const posMap = new Map();
          const titleMap = new Map();
          res.data.forEach((e) => {
            if (e.job_position_name && !posMap.has(e.job_position_name)) {
              posMap.set(e.job_position_name, {
                id: e.job_position_id || posMap.size + 1,
                code: `CV_${posMap.size + 1}`,
                name: e.job_position_name,
                description: "Vị trí trong cơ cấu tổ chức",
              });
            }
            if (e.job_title_name && !titleMap.has(e.job_title_name)) {
              titleMap.set(e.job_title_name, {
                id: e.job_title_id || titleMap.size + 1,
                code: `CD_${titleMap.size + 1}`,
                name: e.job_title_name,
                description: "Chức danh chuyên môn",
              });
            }
          });
          if (posMap.size > 0) jobPositionList.value = Array.from(posMap.values());
          if (titleMap.size > 0) jobTitleList.value = Array.from(titleMap.values());
        }
      } catch (err) {
        console.warn("Could not fetch job metadata from API, using default list", err);
      }
    };

    onMounted(() => {
      loadData();
    });

    const currentDisplayItems = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      const list = currentTab.value === "job_position" ? jobPositionList.value : jobTitleList.value;
      if (!q) return list;
      return list.filter(
        (item) =>
          item.code?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    });

    const addNew = () => {
      const type = currentTab.value === "job_position" ? "chức vụ" : "chức danh";
      alert(`Tính năng thêm mới ${type} đang sẵn sàng.`);
    };

    const editItem = (item) => {
      alert(`Chỉnh sửa: ${item.name}`);
    };

    const deleteItem = (item) => {
      if (confirm(`Bạn có chắc chắn muốn xóa ${item.name}?`)) {
        if (currentTab.value === "job_position") {
          jobPositionList.value = jobPositionList.value.filter((x) => x.id !== item.id);
        } else {
          jobTitleList.value = jobTitleList.value.filter((x) => x.id !== item.id);
        }
      }
    };

    return {
      currentTab,
      searchQuery,
      jobPositionList,
      jobTitleList,
      currentDisplayItems,
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

.job-position-manage {
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

  .tab-pill-group {
    display: inline-flex;
    align-items: center;
    padding: 3px;
    background: #F1F5F9;
    border-radius: 8px;
    gap: 3px;

    @media (max-width: 900px) {
      width: 100%;
      margin-left: 0 !important;
      margin-top: 8px;
    }

    .tab-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: #64748B;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      .tab-icon {
        font-size: 16px;
      }

      .tab-count {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 10px;
        background: #E2E8F0;
        font-size: 11px;
        color: #475569;
      }

      &:hover {
        color: #1E293B;
      }

      &.active {
        background: #FFFFFF;
        color: var(--va-primary, #154EC1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

        .tab-count {
          background: rgba(21, 78, 193, 0.12);
          color: var(--va-primary, #154EC1);
        }
      }
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

    .job-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .cell-icon {
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
