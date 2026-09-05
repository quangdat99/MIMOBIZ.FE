/**
 * Object xử lý event global trên toàn bộ hệ thống
 */

import emitter from 'tiny-emitter/instance';

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
}

/**
 * Đối tượng liệt kê các global event đang có
 * Bắt buộc globalEvent nào đều phải cấu hình vào đây để k bị trùng tên
 */
const GlobalEventName = {
  openWrapper: 'openWrapper'
}

export { GlobalEventName }