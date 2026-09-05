<template>
  <div class="admin-container">
    <div class="nav-bar" :class="{ 'toggle-navbar': !toggleNavbarValue }">
      <div class="information">
        <div class="avatar">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <div class="main-information" v-if="toggleNavbarValue">
          <div class="name">Mimobiz</div>
          <div class="email">We bring you all</div>
        </div>
      </div>
      <div class="main-menu">
        <main-menu-item
          v-for="menuItem in menuList"
          :key="menuItem.key"
          :menuItemObject="menuItem"
          :toggleNavbarValue="toggleNavbarValue"
          @click="menuItemClick"
        >
        </main-menu-item>
      </div>
    </div>
    <div
      class="main-content-admin"
      :class="{ 'toggle-navbar': !toggleNavbarValue }"
    >
      <div class="header-admin">
        <div class="header-left">
          <div
            class="icon24 menu-black cursor-pointer"
            @click="toggleNavbar"
          ></div>
          <div class="title-admin">Quản lý công việc Mimobiz</div>
        </div>
        <div class="header-right">
          <v-menu>
            <div class="information-admin">
              <div class="avatar">
                <img src="@/assets/images/profile-checker.png" alt="" />
              </div>
              <div class="main-information">
                <div class="name">
                  {{ context.checkerName }}
                </div>
                <div class="email">
                  {{ context.email }}
                </div>
              </div>
            </div>
            <template #popper>
              <div class="option cursor p-2" @click="logout()">Đăng Xuất</div>
            </template>
          </v-menu>
        </div>
      </div>
      <div class="container-page">
        <router-view />
      </div>
    </div>

    <confirm-dialog></confirm-dialog>
  </div>
</template>

<script>
import MainMenuItem from "@/components/mainMenuItem/MainMenuItem.vue";
import { useAdminPage } from "./AdminPage.js";
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import { mapGetters } from "vuex";
import { useRoute } from "vue-router";
import ConfirmDialog from "primevue/confirmdialog";
import { usePrimeVue } from "primevue/config";
import popupUtil from "@/commons/popupUtil";
export default {
  components: {
    MainMenuItem,
    ConfirmDialog,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { menuList } = useAdminPage();
    const changeToVietnamese = () => {
      const primevue = usePrimeVue();
      primevue.config.locale.accept = "Đồng ý";
      primevue.config.locale.reject = "Không";
    };
    const toggleNavbarValue = ref(true);
    onMounted(() => {
      changeToVietnamese();
      window.admin = proxy;
      let path = history.state.current;
      if (path.includes("timesheet")) {
        menuItemClick("timesheet");
      } else if (path.includes("order")) {
        menuItemClick("order");
      } else if (path.includes("bookmarkType")) {
        menuItemClick("bookmarkType");
      } else if (path.includes("dossier")) {
        menuItemClick("dossier");
      } else if (path.includes("customer")) {
        menuItemClick("customer");
      } else if (path.includes("manufacturer")) {
        menuItemClick("manufacturer");
      } else if (path.includes("checker")) {
        menuItemClick("checker");
      } else if (path.includes("calculator")) {
        menuItemClick("calculator");
      } else {
        menuItemClick("taiLieuGoc");
      }
    });

    const menuItemClick = async (key) => {
      let url = "";
      menuList.forEach((item) => {
        if (item.key == key) {
          item.isSelected = true;
          url = item.route;
        } else {
          item.isSelected = false;
        }
      });
      // await proxy.$store.dispatch("updateMenuItems", menuList);
      proxy.$router.push(url);
    };

    const toggleNavbar = () => {
      proxy.toggleNavbarValue = !proxy.toggleNavbarValue;
    };

    const logout = () => {
      proxy.$store.dispatch("moduleContext/logout");
      proxy.$router.push("/login");
    };


    return {
      menuList,
      menuItemClick,
      toggleNavbar,
      toggleNavbarValue,
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