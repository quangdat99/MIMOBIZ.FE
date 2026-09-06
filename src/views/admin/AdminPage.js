import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

export const useAdminPage = () => {
  const { proxy } = getCurrentInstance();

  const menuList = reactive([{
    iconClass: 'icon24 checker-white',
    iconName: 'badge',
    content: 'Nhân viên',
    route: '/admin/checker',
    key: 'checker',
    isSelected: false
  }, {
    iconClass: 'icon24 bookmarkType',
    iconName: 'category',
    content: 'Loại hồ sơ',
    route: '/admin/bookmarkType',
    key: 'bookmarkType',
    isSelected: false
  }, {
    iconClass: 'icon24 timesheet',
    iconName: 'description',
    content: 'Hồ sơ',
    route: '/admin/timesheet',
    key: 'timesheet',
    isSelected: false
  },
  {
    iconClass: 'icon24 order-white',
    iconName: 'timeline',
    content: 'Timeline',
    route: '/admin/timeline',
    key: 'timeline',
    isSelected: false
  },
  {
    iconClass: 'icon24 dashboard',
    iconName: 'calculate',
    content: 'Calculator',
    route: '/admin/calculator',
    key: 'calculator',
    isSelected: false
  }, {
    iconClass: 'icon24 size',
    iconName: 'folder_shared',
    content: 'Dossier',
    route: '/admin/dossier',
    key: 'dossier',
    isSelected: false
  }, {
    iconClass: 'icon24 color',
    iconName: 'group',
    content: 'Customer',
    route: '/admin/customer',
    key: 'customer',
    isSelected: false
  }, {
    iconClass: 'icon24 timesheet',
    iconName: 'precision_manufacturing',
    content: 'Manufacturer',
    route: '/admin/manufacturer',
    key: 'manufacturer',
    isSelected: false
  }, {
    iconClass: 'icon24 dashboard',
    iconName: 'source',
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