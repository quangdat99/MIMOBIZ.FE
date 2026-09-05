import moment from "moment";

String.prototype.getDateOnly =
  function () {
    let dt = moment(this);
    return dt.isValid() ? dt.toDate() : null;
  }

Date.prototype.getDateOnly = Date.prototype.getDateOnly ||
  function () {
    let d = new Date(this);
    d.setHours(0, 0, 0, 0);

    return d;
  }

/**
 * Cộng giá trị giờ vào Date
 */
Date.prototype.addHours = Date.prototype.addHours ||
  function (h) {
    let d = new Date(this);
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  }
/**
 * Cộng giá trị phút vào Date
 */
Date.prototype.addMinutes = Date.prototype.addMinutes ||
  function (m) {
    let d = new Date(this);
    this.setTime(this.getTime() + m * 60 * 1000);
    return this;
  }
/**
 * Cộng giá trị giây vào Date
 */
Date.prototype.addSeconds = Date.prototype.addSeconds ||
  function (m) {
    let d = new Date(this);
    this.setTime(this.getTime() + m * 1000);
    return this;
  }
/**
 * Cộng giá trị ngày vào Date
 */
Date.prototype.addDays = Date.prototype.addDays ||
  function (day) {
    let d = new Date(this);
    this.setDate(this.getDate() + day);
    return this;
  }
/**
 * Cộng giá trị tháng vào Date
 */
Date.prototype.addMonths = Date.prototype.addMonths ||
  function (month) {
    let d = new Date(this);
    this.setMonth(this.getMonth() + month);
    return this;
  }
/**
 * Cộng giá trị năm vào Date
 */
Date.prototype.addYears = Date.prototype.addYears ||
  function (year) {
    let d = new Date(this);
    this.setYear(this.getFullYear() + year);
    return this;
  }

String.prototype.format = String.prototype.format || function () {
  let args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] < 'undefined' ? args[number] : match
  })
}