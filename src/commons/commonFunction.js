import i18nGlocal from '@/i18ns/i18n.js';
const i18n = i18nGlocal.global;
import { MSConstant } from '@/commons/wildcards/index.js';
import moment from 'moment/moment';

class CommonFunction {
  getMainLoading() {
    let el = document.body.querySelector('#mloading');
    return el;
  }
  mask() {
    let el = this.getMainLoading();
    if (el) {
      el.style.display = 'flex';
    }
  }
  unmask() {
    let el = this.getMainLoading();
    if (el) {
      el.style.display = 'none';
    }
  }
  /**
   * Tạo uuid
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let d = new Date().getTime();
      d += performance.now();
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    })
  }
  /**
   * Tự động focus vào control nhập liệu đầu tiên theo scope truyền vào
   * @param {*} scope 
   */
  focusFirstControl(scope) {
    if (scope) {
      const me = this;

      let input;
      if (scope.type === 'text' ||
        (scope.hasAttribute &&
          scope.hasAttribute('type') &&
          scope.getAttribute('type') === 'text')
      ) {
        input = scope;
      } else {
        input = me.findFirstControlFocus(scope);
      }

      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  /**
   * Tìm ra control đầu tiên trong scope truyền vào và cho phép sửa
   * @param {Parent} scope Parent cần tìm input
   */
  findFirstControlFocus(scope) {
    if (scope && scope.querySelector) {
      let input = scope.querySelector(
        'input:not([readonly]):not([disabled]),textarea'
      );
      return input;
    }
    return;
  }

  /**
   * Kiểm tra 2 đối tượng có kahcs nhau không
   */
  checkDiff(newVal, oldVal) {
    let newStr = JSON.stringify(newVal).replace(/:null,/g, ":'',");
    let oldStr = JSON.stringify(oldVal).replace(/:null,/g, ":'',");
    return newStr !== oldStr;
  }

  getEnumValue(enumName, text) {
    let source = this.getEnumText()
  }

  getEnumText(value, enumName) {

  }
  /**
   * Lấy enumresource với tên enum truyền vào
   * @param {*} value 
   * @param {*} enumName 
   */
  getEnumSource(enumName) {
    let e = MSConstant[enumName],
      arr = [];
    if (e) {
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          let v = e[key];
          let enumText = i18n.t('i18nEnum.' + enumName + '.' + key);
          let item = {
            enumValue: v,
            enumKey: key,
            enumText: enumText
          }
          arr.push(item);
        }
      }
    }
    return arr;
  }

  /**
   * Xử lý tham số trước khi gọi lên server load dữ liệu cho combobox
   */
  processComboboxParamRequest(param) {
    const me = this;
    for (let i in param) {
      let value = param[i];
      switch (i) {
        case 'filter':
          // chuẩn hóa tham số filter
          if (Array.isArray(value) && value.length > 0) {
            value = me.buildFilterParam(value);
          } else {
            continue;
          }
          break;
      }
      param[i] = value;
    }
  }

  buildFilterParam(filters) {
    let me = this,
      sFilter = '';

    if (filters && !(filters instanceof Array)) {
      filters = [filters];
    }

    let length = filters.length;

    if (length > 0) {
      let i,
        arrayFitlers = [],
        sJoin = ',';

      for (i = 0; i < length; i++) {
        let filter = filters[i],
          sChildFilter = '',
          operandChild = 'and';

        if (filter.childrens instanceof Array && filter.childrens.length > 0) {
          let childFirst = filter.childrens[0];
          if (childFirst.operand) {
            operandChild = childFirst.operand;
          }

          sChildFilter = me.buildFilterParam(filter.childrens);
        }

        let s = '"' + filter.property + '",' + (filter.operator ? '"' + filter.operator + '",' : ''),
          // Mặc định operand là `and`
          operand = '"and"';

        s += me.nomalizeFitlerValue(filter.operator, filter.value);
        //xử lý tình huống muốn filter = 0/false nhưng muốn lọc ra cả các giá trị null
        if (filter.nullTofail && (filter.value === 0 || filter.value === false)) {
          s += ',true';
        }

        s = '[' + s + ']';

        if (sChildFilter) {
          s = '[' + s + ',"' + operandChild + '",' + sChildFilter + ']';
        }

        if (i !== 0) {
          if (filter.operand) {
            operand = '"' + filter.operand + '"';
          }
          arrayFitlers.add(operand);
        }
        arrayFitlers.add(s);
      }

      sFilter = arrayFitlers.join(sJoin);
      if (length > 1) {
        sFilter = '[' + sFilter + ']';
      }
    }
    return sFilter;
  }

  nomalizeFitlerValue(operator, value) {
    var ret = '';
    switch (operator) {
      case 'in':
      case 'notin':
        ret = JSON.stringify(value);
        break;

      default:
        if (typeof value === 'number') {
          ret = value.toString()
        } else if (typeof value === 'boolean') {
          ret = value;
        } else if (value instanceof Date) {
          if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
            ret = ['"', moment(value).format('YYYY-MM-DD'), 'T00:00:00"'].join('');
          } else {
            ret = ['"', moment(value).format('YYYY-MM-DDThh:mm:ss'), '"'].join('');
          }
        } else {
          ret = ['"', value, '"'].join('');
        }
    }

    return ret;
  }

  /**
   * So sánh ngày
   */
  compareDate(dte, compareDte, format = null) {
    let dte1 = moment(dte).format('YYYY-MM-DD');
    let dte2 = moment(compareDte).format('YYYY-MM-DD');
    if (format) {
      dte1 = moment(dte, format).format('YYYY-MM-DD');
      dte2 = moment(compareDte, format).format('YYYY-MM-DD');
    }
    return dte1 == dte2 ? MSConstant.Compare.Equal
      : dte1 > dte2 ? MSConstant.Compare.Than
        : MSConstant.Compare.Less;
  }

  /**
 * Đăng xuất khỏi ứng dụng
 */
  logoff() {
    this.$store.dispatch('logout');
  }



  /**
   * Xử lý dữ liệu trả về từ server
   */
  processServerResponseData(data) {
    if (data) {
      const rgDate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
      const rgDateTime = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(.)?(\d{0,9})?(Z)?(\+)?(\d{2})?(:)?(\d{2})?$/;
      for (let i in data) {
        if (data[i]) {
          if (
            typeof data[i] === 'string' &&
            // i.indexOf("Date") > -1 &&
            (rgDate.test(data[i]) || rgDateTime.test(data[i]))
          ) {
            const date = new Date(data[i]);
            if (moment(date).isValid()) {
              data[i] = new Date(data[i]);
            }
          } else if (typeof data[i] === 'object' && Object.keys(data[i].length > 0)) {
            this.processServerResponseData(data[i]);
          }
        }
      }
    }
  }

}
export default new CommonFunction();