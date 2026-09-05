import moment from 'moment';
let mo = moment;
mo.locale('vi');
class msDateUtil {
  /**  
      * Convert tư` giá trỉ DateTime sang string  
      * @param {DateTime} value Giá tri datetime cân convert  
      * @param {String} formatString Đinh dang string datetime cän convert  
      */
  parseDateTimeToString(value, formatString) {
    if (value) {
      //Nếu là DateTime mới xư lý parse  
      if (value instanceof Date) {
        let m = mo(value),
          ret = m.format(formatString);
        return ret;
      } else {
        return value;
      }
    }
  }
}
export default new msDateUtil();