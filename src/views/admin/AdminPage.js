import { reactive } from 'vue';
import { getCurrentInstance } from 'vue';

export const useAdminPage = () => {
  const { proxy } = getCurrentInstance();

  const menuList = reactive([
    {
      key: 'thaco',
      content: 'Thaco',
      iconName: 'corporate_fare',
      expanded: true,
      children: [
        {
          iconClass: 'icon24 checker-white',
          iconName: 'badge',
          content: 'Nhân viên',
          route: '/admin/checker',
          key: 'checker',
          isSelected: false,
        },
        {
          iconClass: 'icon24 bookmarkType',
          iconName: 'category',
          content: 'Loại hồ sơ',
          route: '/admin/bookmarkType',
          key: 'bookmarkType',
          isSelected: false,
        },
        {
          iconClass: 'icon24 timesheet',
          iconName: 'description',
          content: 'Hồ sơ',
          route: '/admin/timesheet',
          key: 'timesheet',
          isSelected: false,
        },
        {
          iconClass: 'icon24 order-white',
          iconName: 'timeline',
          content: 'Timeline',
          route: '/admin/timeline',
          key: 'timeline',
          isSelected: false,
        },
        {
          iconClass: 'icon24 dashboard',
          iconName: 'calculate',
          content: 'Calculator',
          route: '/admin/calculator',
          key: 'calculator',
          isSelected: false,
        },
        {
          iconClass: 'icon24 size',
          iconName: 'folder_shared',
          content: 'Dossier',
          route: '/admin/dossier',
          key: 'dossier',
          isSelected: false,
        },
        {
          iconClass: 'icon24 color',
          iconName: 'group',
          content: 'Customer',
          route: '/admin/customer',
          key: 'customer',
          isSelected: false,
        },
        {
          iconClass: 'icon24 timesheet',
          iconName: 'precision_manufacturing',
          content: 'Manufacturer',
          route: '/admin/manufacturer',
          key: 'manufacturer',
          isSelected: false,
        },
        {
          iconClass: 'icon24 dashboard',
          iconName: 'source',
          content: 'TaiLieuGoc',
          route: '/admin/taiLieuGoc',
          key: 'taiLieuGoc',
          isSelected: false,
        },
      ],
    },
    {
      key: 'category',
      content: 'Danh mục',
      iconName: 'folder_open',
      expanded: true,
      children: [
        {
          iconName: 'account_tree',
          content: 'Cơ cấu tổ chức',
          subtitle: 'department - Phòng ban',
          route: '/admin/department',
          key: 'department',
          isSelected: false,
        },
        {
          iconName: 'manage_accounts',
          content: 'Nhân viên/ Người dùng',
          subtitle: 'sys_user, employee',
          route: '/admin/employee',
          key: 'employee',
          isSelected: false,
        },
        {
          iconName: 'assignment_ind',
          content: 'Chức vụ, chức danh',
          subtitle: 'job_position, job_title',
          route: '/admin/jobPosition',
          key: 'jobPosition',
          isSelected: false,
        },
      ],
    },
  ]);

  const changeChosenTabMenuItem = async (key) => {
    menuList.forEach(group => {
      if (group.children) {
        group.children.forEach(child => {
          child.isSelected = child.key === key;
          if (child.isSelected) group.expanded = true;
        });
      } else {
        group.isSelected = group.key === key;
      }
    });
    if (proxy && proxy.$store) {
      await proxy.$store.dispatch('updateMenuItems', menuList);
    }
  };

  return {
    menuList,
    changeChosenTabMenuItem,
  };
};