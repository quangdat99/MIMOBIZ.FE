import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useAdminPage = () => {
  const { proxy } = getCurrentInstance();

  const menuList = reactive([{
    iconClass: 'icon24 checker-white',
    content: 'Nhân viên',
    route: '/admin/checker',
    key: 'checker',
    isSelected: false
  }, {
    iconClass: 'icon24 bookmarkType',
    content: 'Loại hồ sơ',
    route: '/admin/bookmarkType',
    key: 'bookmarkType',
    isSelected: false
  }, {
    iconClass: 'icon24 timesheet',
    content: 'Hồ sơ',
    route: '/admin/timesheet',
    key: 'timesheet',
    isSelected: false
  },
  {
    iconClass: 'icon24 order-white',
    content: 'Timeline',
    route: '/admin/timeline',
    key: 'timeline',
    isSelected: false
  },
  {
    iconClass: 'icon24 dashboard',
    content: 'Calculator',
    route: '/admin/calculator',
    key: 'calculator',
    isSelected: false
  }, {
    iconClass: 'icon24 size',
    content: 'Dossier',
    route: '/admin/dossier',
    key: 'dossier',
    isSelected: false
  }, {
    iconClass: 'icon24 color',
    content: 'Customer',
    route: '/admin/customer',
    key: 'customer',
    isSelected: false
  }, {
    iconClass: 'icon24 timesheet',
    content: 'Manufacturer',
    route: '/admin/manufacturer',
    key: 'manufacturer',
    isSelected: false
  }, {
    iconClass: 'icon24 dashboard',
    content: 'TaiLieuGoc',
    route: '/admin/taiLieuGoc',
    key: 'taiLieuGoc',
    isSelected: false
  },
  ]);

  const changeChosenTabMenuItem = async (key) => {
    menuList.forEach(item => {
      if (item.key == key) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    await proxy.$store.dispatch('updateMenuItems', menuList);
  }

  return {
    menuList,
    changeChosenTabMenuItem
  }
}