import popupUtil from '@/commons/popupUtil';
import { mapGetters } from "vuex";
import {
  showError,
  showConfirm,
  showInfo,
  showConfirmDelete,
  showAlert,
} from '@/commons/globalMessage';
export default {
  name: 'baseList',
  mixins: [],
  props: {},
  data() {
    return {
      idField: '',
      codeField: '',
      nameField: '',
      moduleName: '',
      filterGrid: {
        text: "",
        field: "All",
        field_name: "Tất cả",
      },
      filters: ""
    }
  },
  mounted() {
    window._list = this;
    let me = this
    me.roleAdd = me.RoleDetails.find(x => x.key === me.keyRole)?.add || false;
    me.roleView = me.RoleDetails.find(x => x.key === me.keyRole)?.view || false;
    me.roleEdit = me.RoleDetails.find(x => x.key === me.keyRole)?.edit || false;
    me.roleDelete = me.RoleDetails.find(x => x.key === me.keyRole)?.delete || false;
    me.roleExport = me.RoleDetails.find(x => x.key === me.keyRole)?.export || false;
  },
  methods: {

    /**
     * Gọi lên lớp cha
     */
    super(methodName, target) {
      const me = this;

      let pa = target;

      for (let k = 0; k < 5; k++) {
        let fn = pa.methods[methodName];
        if (typeof fn === 'function') {
          let args = [];
          for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          return fn.apply(me, args);
        }
        if (!pa.extends) {
          break;
        }
        pa = pa.extends;
      }

      return null;
    },
    add() {
      const me = this;
      if (me.roleAdd == false) {
        showAlert(`Bạn không có quyền thêm ${me.moduleName}`);
        return;
      }
      popupUtil.show(me.formNameDetail, {
        mode: me.$ms.constant.FormState.Add,
        options: {
          submit: () => {
            me.$refs.gridView.loadData();
          },
        },
      });
    },
    gridRowActionClick(command, record) {
      const me = this;
      switch (command) {
        case me.$ms.constant.Command.Edit:
          me.edit(record);
          break;
        case me.$ms.constant.Command.Duplicate:
          me.duplicate(record);
          break;
        case me.$ms.constant.Command.View:
          me.view(record);
          break;
        case me.$ms.constant.Command.Delete:
          me.deletes([record]);
          break;
      }
    },
    edit(record) {
      const me = this;
      if (me.roleEdit == false && me.roleView == false) {
        showAlert(`Bạn không có quyền sửa ${me.moduleName}`);
        return;
      } else if (me.roleEdit == false && me.roleView == true) {
        me.view(record);
        return;
      }
      let param = me.getDetailParameter(me.$ms.constant.FormState.Edit, record);
      me.showDetail(param);
    },
    duplicate(record) {
      const me = this;
      if (me.roleAdd == false) {
        showAlert(`Bạn không có quyền nhân bản ${me.moduleName}`);
        return;
      }
      let param = me.getDetailParameter(me.$ms.constant.FormState.Duplicate, record);
      me.showDetail(param);
    },
    view(record) {
      const me = this;
      if (me.roleView == false) {
        showAlert(`Bạn không có quyền xem ${me.moduleName}`);
        return;
      }
      let param = me.getDetailParameter(me.$ms.constant.FormState.View, record);
      me.showDetail(param);
    },
    showDetail(param) {
      const me = this;
      popupUtil.show(me.formNameDetail, param);
    },
    getDetailParameter(mode, defaultData) {
      const me = this;

      let param = {
        data: defaultData || null
      };

      switch (mode) {
        case me.$ms.constant.FormState.Edit:
        case me.$ms.constant.FormState.View:
        case me.$ms.constant.FormState.Duplicate:
          if (me.idField) {
            param.id = defaultData[me.idField];
          }
          break;
      }
      param.mode = mode;

      if (me.$refs.gridView && typeof me.$refs.gridView.loadData === 'function') {
        param.options = {
          submit: () => {
            me.$refs.gridView.loadData();
          },
        }
      }

      return param;
    },
    refresh() {
      this.$refs.gridView.serverOptions.sortBy = [];
      this.$refs.gridView.serverOptions.sortType = [];
    },

    /*
     *  Hàm xóa nhiều bản ghi.
     */
    deletes(records) {
      const me = this;
      if (me.roleDelete == false) {
        showAlert(`Bạn không có quyền xóa ${me.moduleName}`);
        return;
      }
      let fn = function () {
        let param = {
          Models: records,
          Ignores: [],
        };
        me.deleteSubmit(param);
      };

      let bValue = me.validateDelete(records);

      if (bValue) {
        let configMessage = me.getDeleteConfirmMessage(records);
        if (configMessage) {
          showConfirmDelete(configMessage.message, configMessage.title).then(answer => {
            if (answer) {
              fn();
            }
          })
        } else {
          fn();
        }
      }
    },

    /**
     * Thực hiện gọi lên server xóa dữ liệu và xử lý callback
     */
    deleteSubmit(param) {
      const me = this;
      me.$ms.commonFn.mask();
      if (param.Models.length) {
        me.api
          .delete(param)
          .then(result => {

            if (result?.length > 0) {
              let mes = [];
              result.forEach(item => {
                if (item.code == "VALIDATE") {
                  if (item.data.type == me.$ms.constant.ValidateResultType.Generation) {
                    let data = item.data.data;
                    mes.unshift(me.generationMessage(data) || `<span class="color-primary">${data.code
                      }</span> đã phát sinh dữ liệu`);
                  }
                }
              });
              showError(mes.join('<br>'), 'Cảnh báo');
              if (param.Models?.length > result?.length) {
                me.$toast.success(
                  `Xóa ${me.moduleName} thành công`
                );
                me.deleteSuccess(param, result);
              }
            } else {
              me.$toast.success(
                `Xóa ${me.moduleName} thành công`
              );
              me.deleteSuccess(param, result);
            }
          })
          .catch(ex => {
            console.log(ex);
            showError('Đã xảy ra lỗi', 'Cảnh báo');
          })
          .finally(() => {
            me.$ms.commonFn.unmask();
          });
      }
    },
    generationMessage(data) {
      return "";
    },
    deleteSuccess(param, result) {
      const me = this;
      me.refresh();
    },

    /**
     * Lấy câu thông báo khi xóa
     */
    getDeleteConfirmMessage(records) {
      const me = this;
      let mes = '';
      if (records?.length > 1) {
        let targetNames = [];
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (record) {
            let code = record[me.codeField]
              ? record[me.codeField]
              : '';

            let name = record[me.nameField]
              ? record[me.nameField]
              : '';

            targetNames.unshift(code + (code && name ? ' - ' : '') + name)
              ;
          }
        }
        // mes = me.$tm('i18nBaseForm.Message.ConfirmDeleteMutiDictionary').format(moduleName);
        mes = `Bạn có muốn xóa các {0} <span class="color-primary">{1}</span> không?`.format(me.moduleName, targetNames.join(', '));
      } else {
        let record = records;
        if (Array.isArray(records)) {
          record = records[0];
        }
        if (record) {
          let code = record[me.codeField]
            ? record[me.codeField]
            : '';

          let name = record[me.nameField]
            ? record[me.nameField]
            : '';

          let targetName =
            code + (code && name ? ' - ' : '') + name;
          mes = `Bạn có muốn xóa {0} <span class="color-primary">{1}</span> không?`.format(me.moduleName, targetName);
        }
      }

      return {
        title: `Xóa {0}`.format(me.moduleName),
        message: mes,
      };
    },


    /**
     * Hàm xử lý validate trước khi xóa dữ liệu
     */
    validateDelete(records) {
      let me = this;
      return true;
    },
    filterGridView(dataFilter) {
      let me = this;
      if (dataFilter.field == "All") {
        if (!dataFilter.text) {
          me.filters = "";
        } else {
          if (me.filterData) {
            let filter = null;
            let filterData = me.filterData.filter(x => x.field !== 'All');
            for (let i = 0; i < filterData.length; i++) {
              const item = filterData[i];
              if (i == 0) {
                filter = {
                  Field: item.field,
                  Operator: "*",
                  Value: dataFilter.text,
                }
              } else {
                filter = {
                  Field: item.field,
                  Operator: "*",
                  Value: dataFilter.text,
                  Ors: [filter]
                }
              }
            }
            me.filters = JSON.stringify([filter]);
          }
        }
      } else {
        let filter = {
          Field: dataFilter.field,
          Operator: "*",
          Value: dataFilter.text,
        }
        me.filters = JSON.stringify([filter]);
      }
      me.filters = me.customPayload(me.filters);
      setTimeout(() => {
        me.$refs.gridView.loadData();

      }, 100);
    },
    customPayload(filter) { return filter },
    async exportExcel() {
      const me = this;

      if (me.roleExport == false) {
        showAlert(`Bạn không có quyền xuất khẩu ${me.moduleName}`);
        return;
      }
      let param = me.$refs.gridView.lastParam;
      param.page = 1;
      param.size = 10000;
      if (param) {
        let data = await me.api
          .exportExcel(param);
        let downloadLink = document.createElement('a');
        downloadLink.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + data;
        downloadLink.download = `${me.moduleName}.xlsx`;
        downloadLink.click();
        return data;
      }
    },
    deleteMultipe() {
      const me = this;
      let selecteds = this.$refs?.gridView?.itemsSelected;
      selecteds = me.customSelect(selecteds);
      if (selecteds?.length > 0) {
        me.deletes(selecteds);
      } else {
        showAlert('Vui lòng chọn ít nhất 1 bản ghi', 'Xóa');
      }
    },
    customSelect(selecteds) {
      return selecteds;
    }
  },
  // computed: {
  //   showHandleMulti: function () {
  //     this.$nextTick(() => {
  //       return this.$refs?.gridView?.itemsSelected?.length > 0;
  //     });
  //   }
  // }
  computed: {
    ...mapGetters({
      RoleDetails: "moduleContext/RoleDetails",
    }),
  },
}