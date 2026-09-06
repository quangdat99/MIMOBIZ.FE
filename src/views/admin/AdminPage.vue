<template>
  <div class="admin-container" :class="{ 'is-mobile': isMobile, 'is-tablet': isTablet }">
    <!-- Mobile Sidebar Backdrop -->
    <transition name="fade">
      <div
        class="sidebar-backdrop"
        v-if="isMobile && mobileDrawerOpen"
        @click="mobileDrawerOpen = false"
      ></div>
    </transition>

    <!-- Left Sidebar (VaSidebar style) -->
    <aside
      class="nav-bar"
      :class="{
        'toggle-navbar': !isMobile && !toggleNavbarValue,
        'mobile-open': isMobile && mobileDrawerOpen,
        'is-mobile': isMobile,
      }"
    >
      <div class="sidebar-header">
        <router-link to="/admin" class="logo-link" @click="handleMobileNavClick">
          <MimobizLogo :height="32" :iconOnly="!isMobile && !toggleNavbarValue" />
        </router-link>
        <button
          v-if="isMobile"
          class="close-drawer-btn"
          @click="mobileDrawerOpen = false"
          title="Đóng menu"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="sidebar-menu">
        <div class="menu-section-label" v-if="isMobile || toggleNavbarValue">QUẢN TRỊ NGHIỆP VỤ</div>
        <main-menu-item
          v-for="menuItem in menuList"
          :key="menuItem.key"
          :menuItemObject="menuItem"
          :toggleNavbarValue="isMobile || toggleNavbarValue"
          @click="menuItemClick"
          @expandNavbar="toggleNavbarValue = true"
        >
        </main-menu-item>
      </div>

      <div class="sidebar-footer" v-if="isMobile || toggleNavbarValue">
        <div class="system-status">
          <span class="status-dot"></span>
          <span class="status-text">Hệ thống đang chạy</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div
      class="main-content-admin"
      :class="{
        'toggle-navbar': !isMobile && !toggleNavbarValue,
        'is-mobile': isMobile,
      }"
    >
      <!-- Top Header (VaNavbar style) -->
      <header class="header-admin">
        <div class="header-left">
          <button
            class="toggle-btn"
            :title="toggleNavbarValue ? 'Thu nhỏ menu' : 'Mở rộng menu'"
            @click="toggleNavbar"
          >
            <span class="material-symbols-outlined">
              {{ isMobile ? (mobileDrawerOpen ? 'close' : 'menu') : (toggleNavbarValue ? 'menu_open' : 'menu') }}
            </span>
          </button>

          <div class="breadcrumb-container">
            <span class="breadcrumb-parent">Quản trị</span>
            <template v-if="currentParentTitle">
              <span class="material-symbols-outlined breadcrumb-sep">chevron_right</span>
              <span class="breadcrumb-parent">{{ currentParentTitle }}</span>
            </template>
            <span class="material-symbols-outlined breadcrumb-sep">chevron_right</span>
            <span class="breadcrumb-current">{{ currentMenuTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Notification Bell Dropdown -->
          <v-menu :distance="12">
            <button class="nav-action-btn" title="Thông báo">
              <span class="material-symbols-outlined">notifications</span>
              <span class="notification-badge">3</span>
            </button>
            <template #popper>
              <div class="notification-dropdown-panel">
                <div class="dropdown-header">
                  <span class="title">Thông báo</span>
                  <span class="badge-count">3 mới</span>
                </div>
                <div class="dropdown-list">
                  <div class="dropdown-item unread">
                    <span class="material-symbols-outlined notif-icon text-primary">description</span>
                    <div class="notif-content">
                      <div class="notif-title">Hồ sơ mới đã được tạo</div>
                      <div class="notif-time">5 phút trước</div>
                    </div>
                  </div>
                  <div class="dropdown-item unread">
                    <span class="material-symbols-outlined notif-icon text-success">task_alt</span>
                    <div class="notif-content">
                      <div class="notif-title">Hoàn thành công việc tuần 36</div>
                      <div class="notif-time">2 giờ trước</div>
                    </div>
                  </div>
                  <div class="dropdown-item">
                    <span class="material-symbols-outlined notif-icon text-warning">schedule</span>
                    <div class="notif-content">
                      <div class="notif-title">Nhắc nhở cập nhật timeline</div>
                      <div class="notif-time">1 ngày trước</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </v-menu>

          <!-- User Profile Dropdown -->
          <v-menu :distance="12">
            <div class="user-profile-trigger">
              <div class="avatar-wrapper">
                <img src="@/assets/images/profile-checker.png" alt="Avatar" class="avatar-img" />
                <span class="online-indicator"></span>
              </div>
              <div class="user-meta">
                <div class="user-name">
                  {{ context?.full_name || context?.checkerName || "Người dùng" }}
                </div>
                <div class="user-tenant">
                  {{ context?.tenant_name ? `${context?.tenant_name}` : (context?.email || context?.email_login || 'Quản trị viên') }}
                </div>
              </div>
              <span class="material-symbols-outlined chevron-icon">keyboard_arrow_down</span>
            </div>
            <template #popper>
              <div class="profile-dropdown-panel">
                <div class="profile-summary">
                  <div class="summary-name">{{ context?.full_name || context?.checkerName || "Người dùng" }}</div>
                  <div class="summary-email">{{ context?.email || context?.email_login || "admin@mimobiz.com" }}</div>
                  <span class="user-role-badge">{{ context?.role == 1 ? 'Admin Quản trị' : 'Nhân viên' }}</span>
                </div>
                <div class="dropdown-divider"></div>
                <div class="profile-menu-list">
                  <div class="profile-menu-item" @click="menuItemClick('checker')">
                    <span class="material-symbols-outlined">account_circle</span>
                    <span>Hồ sơ của tôi</span>
                  </div>
                  <div class="profile-menu-item" @click="menuItemClick('timesheet')">
                    <span class="material-symbols-outlined">assignment</span>
                    <span>Hồ sơ công việc</span>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="profile-menu-item logout-item" @click="logout()">
                    <span class="material-symbols-outlined">logout</span>
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            </template>
          </v-menu>
        </div>
      </header>

      <!-- Router View Container with Card styling -->
      <main class="container-page">
        <router-view />
      </main>
    </div>

    <confirm-dialog></confirm-dialog>
  </div>
</template>

<script>
import MainMenuItem from "@/components/mainMenuItem/MainMenuItem.vue";
import MimobizLogo from "@/components/common/MimobizLogo.vue";
import { useAdminPage } from "./AdminPage.js";
import { getCurrentInstance, onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { mapGetters } from "vuex";
import ConfirmDialog from "primevue/confirmdialog";
import { usePrimeVue } from "primevue/config";

export default {
  components: {
    MainMenuItem,
    MimobizLogo,
    ConfirmDialog,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { menuList } = useAdminPage();
    const toggleNavbarValue = ref(true);
    const isMobile = ref(false);
    const isTablet = ref(false);
    const mobileDrawerOpen = ref(false);

    const changeToVietnamese = () => {
      const primevue = usePrimeVue();
      primevue.config.locale.accept = "Đồng ý";
      primevue.config.locale.reject = "Không";
    };

    const activeInfo = computed(() => {
      for (const group of menuList) {
        if (group.children) {
          const activeChild = group.children.find((c) => c.isSelected);
          if (activeChild) {
            return {
              parentTitle: group.content,
              childTitle: activeChild.content,
            };
          }
        }
        if (group.isSelected) {
          return {
            parentTitle: "",
            childTitle: group.content,
          };
        }
      }
      return { parentTitle: "Thaco", childTitle: "Hồ sơ" };
    });

    const currentParentTitle = computed(() => activeInfo.value.parentTitle);
    const currentMenuTitle = computed(() => activeInfo.value.childTitle);

    const handleResize = () => {
      const width = window.innerWidth;
      const wasMobile = isMobile.value;
      isMobile.value = width < 768;
      isTablet.value = width >= 768 && width < 1024;

      if (isMobile.value) {
        if (!wasMobile) {
          mobileDrawerOpen.value = false;
        }
        toggleNavbarValue.value = false;
      } else if (isTablet.value) {
        toggleNavbarValue.value = false;
        mobileDrawerOpen.value = false;
      } else {
        toggleNavbarValue.value = true;
        mobileDrawerOpen.value = false;
      }
    };

    const syncActiveMenuWithRoute = (path) => {
      if (!path) return;
      menuList.forEach((group) => {
        if (group.children) {
          group.children.forEach((child) => {
            const isMatch =
              path === child.route ||
              path.toLowerCase().endsWith(`/${child.key.toLowerCase()}`) ||
              path.toLowerCase().includes(`/${child.key.toLowerCase()}`);
            if (isMatch) {
              child.isSelected = true;
              group.expanded = true;
            } else {
              child.isSelected = false;
            }
          });
        }
      });
    };

    watch(
      () => proxy.$route?.path,
      (newPath) => {
        syncActiveMenuWithRoute(newPath);
      },
      { immediate: true }
    );

    onMounted(() => {
      changeToVietnamese();
      handleResize();
      window.addEventListener("resize", handleResize);

      window.admin = proxy;
      syncActiveMenuWithRoute(proxy.$route?.path || history.state?.current);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    const menuItemClick = async (key) => {
      if (isMobile.value) {
        mobileDrawerOpen.value = false;
      }
      let targetRoute = "";
      menuList.forEach((group) => {
        if (group.children) {
          group.children.forEach((child) => {
            if (child.key === key) {
              child.isSelected = true;
              targetRoute = child.route;
              group.expanded = true;
            } else {
              child.isSelected = false;
            }
          });
        } else {
          if (group.key === key) {
            group.isSelected = true;
            targetRoute = group.route;
          } else {
            group.isSelected = false;
          }
        }
      });
      if (targetRoute && proxy.$route?.path !== targetRoute) {
        proxy.$router.push(targetRoute);
      }
    };

    const handleMobileNavClick = () => {
      if (isMobile.value) {
        mobileDrawerOpen.value = false;
      }
    };

    const toggleNavbar = () => {
      if (isMobile.value) {
        mobileDrawerOpen.value = !mobileDrawerOpen.value;
      } else {
        toggleNavbarValue.value = !toggleNavbarValue.value;
      }
    };

    const logout = () => {
      proxy.$store.dispatch("moduleContext/logout");
      proxy.$router.push("/login");
    };

    return {
      menuList,
      menuItemClick,
      handleMobileNavClick,
      toggleNavbar,
      toggleNavbarValue,
      isMobile,
      isTablet,
      mobileDrawerOpen,
      currentParentTitle,
      currentMenuTitle,
      logout,
    };
  },

  computed: {
    ...mapGetters({
      context: "moduleContext/Context",
    }),
  },
};
</script>

<style lang="scss">
@import "./AdminPage.scss";
</style>