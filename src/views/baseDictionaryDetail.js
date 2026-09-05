import { defineComponent } from 'vue';
import baseDetail from './baseDetail.js';
import _ from "lodash";
import {
  showError,
  showConfirm,
  showInfo,
  showConfirmDelete,
} from '@/commons/globalMessage';


export default defineComponent({
  extends: baseDetail,
  name: 'baseDictionaryDetail',
  data: function () {
    const me = this;
    return {
      refDetail: 'refDetail',
      key: null,
      /**
       * Đang xử lý với server
       */
      loading: false,
      /**
       * dữ liệu cũ
       */
      oldDataItem: {}
    }
  },
  mounted() {
    const me = this;
    window._listDictionaryDetail = me;
    me.show(me._formParam, me._formParam?.options);
  },
  watch: {
    loading: function (newVal) {
      if (newVal) {
        this.$ms.commonFn.mask();
      } else {
        this.$ms.commonFn.unmask();
      }
    }
  },
  computed: {
    viewing: function () {
      return this.editMode === this.$ms.constant.FormState.View;
    }
  },
  methods: {
    show(param, options) {
      let me = this;
      me.options = options;
      me.param = {};
      if (param) {
        Object.assign(me.param, param);
      }
      me.editMode = typeof param.mode === 'number' ? param.mode : me.$ms.constant.FormState.Add;
      switch (me.editMode) {
        case me.$ms.constant.FormState.Add:
          me.add(param);
          break;
        case me.$ms.constant.FormState.Edit:
          me.edit(param);
          break;
        case me.$ms.constant.FormState.View:
          me.view(param);
          break;
        case me.$ms.constant.FormState.Duplicate:
          me.duplicate(param);
          break;
        default:
          throw 'Not Implement exception with mode ' + mode;
      }
    },

    async add(param) {
      const me = this;
      const mode = me.$ms.constant.FormState.Add;

      let data = await me.loadData('New', param);

      me.beforeBinding(data, mode, param);
      me.bindData(data);

      me.$nextTick(() => {
        me.resetValdiate();

        setTimeout(function () {
          me.focusFirstControl();
        }, 300)
        me.setOldDataItem();
      });

    },

    async edit(param) {
      const me = this;
      const mode = me.$ms.constant.FormState.Edit;

      let data = await me.loadData('Edit', param);

      me.beforeBinding(data, mode, param);
      me.bindData(data);

      me.$nextTick(() => {
        me.resetValdiate();

        setTimeout(function () {
          me.focusFirstControl();
        }, 300);

        me.setOldDataItem();
      });

    },

    async duplicate(param) {
      const me = this;
      const mode = me.$ms.constant.FormState.Duplicate;

      let data = await me.loadData('Duplicate', param);

      me.beforeBinding(data, mode, param);
      me.bindData(data);

      me.$nextTick(() => {
        me.resetValdiate();

        setTimeout(function () {
          me.focusFirstControl();
        }, 300);

        me.setOldDataItem();
      });

    },

    setOldDataItem(model = this.model) {
      const me = this;
      me.$nextTick(() => {
        me.oldDataItem = _.cloneDeep(model);
      })
    },

    async view(param) {
      const me = this;
      const mode = me.$ms.constant.FormState.View;

      let data = await me.loadData('Edit', param);

      me.beforeBinding(data, mode, param);
      me.bindData(data);

      me.$nextTick(() => {
        me.resetValdiate();

        setTimeout(function () {
          me.focusFirstControl();
        }, 300)
        me.setOldDataItem();
      });

    },
    focusFirstControl() {
      this.$ms.commonFn.focusFirstControl(this.$el);
    },
    beforeBinding(data, mode, param) { },
    bindData(data) {
      const me = this;
      me.model = data;
    },

    async loadData(action, param) {
      const me = this;
      let result = {};

      me.loading = true;
      try {
        if (me.api) {
          let paramRequest = Object.assign({}, param);
          delete paramRequest.data;

          let loadParam = me.getLoadDataParameter(action, paramRequest);
          switch (action) {
            case 'New':
              result = await me.api.getNew();
              break;
            case 'Edit':
            case 'View':
              result = await me.api.getEdit(loadParam);
              break;
            case 'Duplicate':
              result = await me.api.getDuplicate(loadParam);
              break;
          }

        }
      } catch (err) {
        console.error(err);
      } finally {
        me.loading = false;
      }
      return result;
    },

    getLoadDataParameter(action, param) {
      let result = {
        action: action
      }
      switch (action) {
        case 'Edit':
        case 'View':
        case 'Duplicate':
          result.id = param.id;
          break;
      }

      return result;
    },
    /**
     * Lock command thực hiện để tránh duplicate xử lý
     */
    lockCommand(lockFromBase = false) {
      const me = this;
      if (me._commandLock?.lockFromBase === false && lockFromBase) {
        return
      }
      if (me._commandLock) {
        throw 'Locking'
      }
      me._commandLock = {
        lockFromBase: lockFromBase
      }

      //mở khóa lock
      me.$nextTick(() => {
        setTimeout(() => {
          delete me._commandLock;
        }, 500);
      })
    },
    commandClick(command) {
      const me = this;
      me.lockCommand(true);
      switch (command) {
        case this.$ms.constant.Command.Edit:
          me.setFormMode(this.$ms.constant.FormState.Edit);
          setTimeout(function () {
            me.focusFirstControl();
          }, 300)
          break;
        case this.$ms.constant.Command.SaveView:
          me.save(this.$ms.constant.SaveMode.SaveView);
          break;
        case this.$ms.constant.Command.PostPone:
          // me.setFormMode(this.$ms.constant.FormState.View);
          // this.resetData();
          me.hide();
          break;
      }
    },
    resetData() {
      const me = this;
      me.model = _.cloneDeep(me.oldDataItem);
      me.resetValdiate();
    },
    save(mode) {
      const me = this;
      me.beforeSave();
      if (!me.validateComponents()) {
        me.$nextTick(() => {
          me.focusFirstError();
        });
        return;
      }
      try {
        let action = me.createAction();
        let saveParam = me.getSubmitParam(mode);
        me.submitAction(saveParam, action);
      } catch (err) {
        console.error(err);
        me.loading = false;
      }
    },
    createAction() {
      const me = this;
      return me.editMode === me.$ms.constant.FormState.Edit || me.editMode === me.$ms.constant.FormState.View ? 'update' : 'insert'
    },
    beforeSave() {

    },
    validateBeforeSave(mode) {
      const me = this;

    },
    getSubmitParam(mode) {
      const me = this;
      let entity = me.getSaveData(mode);
      let saveParam = {
        Mode: mode,
        Model: entity,
        ReturnRecord: true,
        Ignores: [],
      }
      return saveParam;
    },
    getSaveData(mode) {
      const me = this;
      let data = null;
      if (typeof me.model.getData === 'function') {
        data = { ...me.model.getData() };
      } else {
        data = { ...me.model };
      }

      if (mode === me.$ms.constant.FormState.Edit) {
        data.OldData = me.oldDataItem;
      }
      return data;
    },
    submitAction(saveParam, action) {
      const me = this;
      let validateResult = me.validateBusiness(saveParam, action);

      if (!validateResult) {
        me.loading = false;
        return;
      }
      if (Object.keys(validateResult) && Object.keys(validateResult).length > 0) {
        me.loading = false;
        me.$confirm.require({
          message: validateResult.message,
          header: validateResult.title,
          accept: () => {
          },
        });
        return;
      }
      me.submit(saveParam, action);
    },
    validateBusiness(saveParam, action) {
      return {};
    },
    saveError(error, param, action) {
      const me = this,
        errorData = error?.response?.data;
      if (errorData) {
        switch (errorData.Error) {
          case 'VALIDATE':
            me.submitErrorValidate(errorData.Data, param, action);
            break;
        }
      } else {
        me.$confirm.require({
          message: error?.message,
          header: '',
          accept: () => {
          },
        });
      }
    },
    submit(param, action) {
      const me = this;
      me.loading = true;
      if (action === 'insert') {
        me.api.insert(param).then(result => {
          me.$toast.success(`Thêm ${me.formName.toLowerCase()} thành công`);
          me.saveSuccess(result, param, action);
        }).catch(ex => {
          me.saveError(ex, param, action);
        }).finally(() => {
          me.loading = false;
        })
      } else if (action === 'update') {

        me.api.update(param).then(result => {
          me.$toast.success(`Sửa ${me.formName.toLowerCase()} thành công`);
          me.saveSuccess(result, param, action);
        }).catch(ex => {
          me.saveError(ex, param, action);
        }).finally(() => {
          me.loading = false;
        })
      }
    },
    submitErrorValidate(err, param, action) {
      const me = this;

      if (!err.Message && err.Code) {
        err.Message = me.getSubmitValidateError(err.Code, err.Data);
      }

      switch (err.Type) {
        case me.$ms.constant.ValidateResultType.Warning:
          break;
        case me.$ms.constant.ValidateResultType.Generation:
          break;

        default:
          me.showSubmitErrorValidate(err, param, action);
          break;
      }
    },
    getSubmitValidateError(code, data) {
      switch (code) {
        case 'Duplicate':
          return data.map(x => `${x.FieldName}: <span class="color-primary">${x.FieldValue}</span> đã tồn tài trong hệ thống.`).join(' ');

        default:
          return '';
      }
    },
    showSubmitErrorValidate(er, param, action) {
      const me = this;
      switch (er.Code) {
        case 'Duplicate':
          showError(er.Message, 'Không hợp lệ');
          break;

        default:
          showError(er.Message, 'Không hợp lệ');
          break;
      }
    },
    saveSuccess(result, param, action) {
      const me = this;
      if (me.options && typeof me.options.submit === 'function') {
        me.options.submit(result, param, action);
      }

      switch (param.Mode) {
        case me.$ms.constant.SaveMode.SaveView:
          me.afterSubmitModeView(result, param);
          break;
        default:
          me.hide();
          break;
      }
    },
    afterSubmitModeView(result, param) {
      const me = this;
      me.model = _.cloneDeep(result);
      // me.setFormMode(me.$ms.constant.FormState.View);
      me.hide();
    },
    setFormMode(mode) {
      this.editMode = mode;
      this.getFormTitle(mode);
    },
    // beforeOpen(e, close) {
    //   const me = this;
    //   me.super('beforeOpen', baseDetail, e, close);

    //   if (!me._gridDetails) {
    //     me._gridDetails = {};
    //   }
    // },
  }
})