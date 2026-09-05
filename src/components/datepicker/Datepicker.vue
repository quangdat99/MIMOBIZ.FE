<template>
  <div class="calendar-container" :style="style()">
    <div class="calendar ms-dropdown">
      <div
        :class="[
          'calendar-header flex-row',
          selecting === 'year' ? 'year-select' : 'day-select',
        ]"
      >
        <div class="calender-current-date flex" @click="setSelecting('year')">
          <span v-show="selecting === 'date'">
            Tháng {{ +currentMonth + 1 }}, {{ selectedYear }}
          </span>
          <span v-show="selecting !== 'date'" class="selected-year">
            {{ selectedYear }}
          </span>
          <div class="icon-calendar-down" v-tooltip="'Chọn năm'"></div>
        </div>
        <!-- Khi chọn tháng không cân next back -->
        <div
          v-show="selecting !== 'month'"
          :class="['icon-calendar-header pointer left']"
          v-tooltip="'Trước'"
          @click="previousMonth"
        ></div>
        <div
          v-show="selecting !== 'month'"
          :class="['icon-calendar-header pointer right']"
          v-tooltip="'Sau'"
          @click="nextMonth"
        ></div>
      </div>
      <div class="separate-line-header"></div>
      <div class="calendar-body" v-show="selecting === 'date'">
        <table class="calendar-table">
          <thead>
            <tr>
              <th v-for="(value, key) in dayMap" :key="key">
                {{ dayOfWeek(value) }}
              </th>
            </tr>
          </thead>
          <tbody class="date-in-month">
            <tr v-for="(days, index) in calendar" :key="index">
              <td
                :class="[
                  day.day !== '' ? 'date-in-table' : '',
                  'ms-date item',
                  {
                    selected: day.selected && day.day,
                    'ms-date-current': day.currentDay,
                  },
                  {
                    disabled:
                      day.disabled || checkMinDate(day) || checkMaxDate(day),
                  },
                  { 'diff-month': day.diffMonth },
                ]"
                v-for="(day, index) in days"
                :key="index"
                @keydown.esc="onClose"
                @click.stop.exact="setByDay(day), setSelecting('date')"
              >
                {{ day.day }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="separate-line"></div>
      </div>
      <div class="calendar-year-select" v-show="selecting === 'year'">
        <div class="separate-line"></div>
        <table>
          <transition-group name="slide-fade" tag="tbody">
            <tr v-for="(yearList, index) in years" :key="index + 0">
              <td
                class="year"
                :class="[
                  { selected: year.selected },
                  {
                    disabled: year.disabled,
                  },
                ]"
                :id="`${year.year}-calendar-year`"
                v-for="(year, index) in yearList"
                :key="index"
                @click="setByYear(year.year)"
              >
                <div
                  :class="[
                    'ms-datepicker-year item',
                    { selected: year.selected },
                  ]"
                >
                  {{ year.year }}
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
        <div class="separate-line"></div>
      </div>
      <!-- Chọ năm xong chọ tháng -->
      <div class="calendar-month-select" v-show="selecting === 'month'">
        <div class="separate-line"></div>
        <table class="calendar-table-month">
          <transition-group name="slide-fade" tag="tbody">
            <tr v-for="(monthList, index) in months" :key="index + 0">
              <td
                class="year"
                :class="[
                  { selected: month.isSelected },
                  {
                    disabled: month.isDisabled,
                  },
                ]"
                :id="`${month.month}-calendar-month`"
                v-for="(month, index) in monthList"
                :key="index"
                @click="setByMonth(month.month)"
              >
                <div
                  :class="[
                    'ms-datepicker-month item',
                    { selected: month.isSelected },
                  ]"
                >
                  {{ `Thg ${month.month + 1}` }}
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
        <div class="separate-line"></div>
      </div>
      <div class="time" v-if="hasTime">
        <div bold class="mr-12-px">Thời gian:</div>
        <div class="change-hour">
          <ms-number
            @keydown.enter="updateHour"
            @update:modelValue="onInputHour"
            v-model="hour"
            max="23"
            min="0"
            isTime
            leadingZero="keep"
            class="input-time"
          />
        </div>
        <div class="mr-6-px ml-6-px">:</div>
        <div class="change-minute">
          <ms-number
            ref="min"
            @keydown.enter="updateMin"
            @update:modelValue="onInputMin"
            v-model="minutes"
            max="60"
            min="0"
            isTime
            leadingZero="keep"
            class="input-time"
          />
        </div>
        <div class="mr-6-px ml-6-px">:</div>
        <div class="change-second">
          <ms-number
            ref="second"
            @keydown.enter="updateSecond"
            @update:modelValue="onInputSecond"
            v-model="second"
            max="60"
            min="0"
            isTime
            leadingZero="keep"
            class="input-time"
          />
        </div>
      </div>
      <div class="calendar-footer">
        <button class="pick-today-button" @click.stop.prevent="onNow">
          {{
            selecting === "date"
              ? "Hôm nay"
              : selecting === "year"
              ? "Năm nay"
              : "Tháng này"
          }}
        </button>
      </div>
    </div>
  </div>
</template>         

<script>
/* ----------------------------------------------------
 * Hàm tách mảng
 */
const slice = (array, start, end) => {
  let length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start == null ? 0 : start;
  end = end === undefined ? length : end;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : (end - start) >>> 0;
  start >>>= 0;
  let index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
};
/***--------------------------------------------
 * Hàm tách mảng thành nhiêu mảng nhỏ có đọ dài cho trước
 * @param {arrays, size}
 *----------------------------------------------
 */
const chunk = (array, size) => {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size));
  }
  return result;
};
//@ is an alias to /src
// import { ModuleContext } from "e/stores/moduleConst";
import { mapGetters } from "vuex";
import _ from "lodash";
import moment from "moment";
export default {
  name: "datepicker",
  data() {
    let dteNow = new Date();
    return {
      hour: 0,
      second: 0,
      dayMap: [0, 1, 2, 3, 4, 5, 6],
      currentMonth: `${dteNow.getMonth()}`, // tháng 6
      currentYear: "${dteNow.getFullYear()}",
      selecting: this.format == "MM/YYYY" ? "month" : "date",
      selectedDayRange: [],
      selectedDayOfWeek: "",
      selectedDay: dteNow.getDate(),
      selectedMonth: `${dteNow.getMonth()}`,
      selectedYear: `${dteNow.getFullYear()}`,
      rangeDayMode: false, // chế độ khoảng thời gian, măc định là không bạt
      height: "",
      width: "",
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal, oldVal) {
        const me = this;
        if (newVal && newVal instanceof Date && newVal != oldVal) {
          me.hour = newVal.getHours();
          me.minutes = newVal.getMinutes();
          me.second = newVal.getSeconds();
          this.updateTime(me.hour, me.minutes, me.second);
        }
        // if (newVal && newVal instanceof Date) {
        // me.hour = newVal.getHours();
        // me.minutes = newVal.getMinutes();
        // me.second = newVal.getSeconds();
        // }
      },
    },
  },
  props: {
    hasTime: {
      type: Boolean,
      default: false,
    },
    colorSelected: {
      type: String,
      required: false,
      default: "#08BF1E",
    },
    backgroundSelected: {
      type: String,
      required: false,
      default: "rgba(44, 160, 28, 0.2)",
    },
    yearSelected: {
      type: String,
      required: false,
      default: "#fff",
    },
    modelValue: {},
    screenX: {
      type: Number,
      required: true,
    },
    screenY: {
      type: Number,
      required: true,
    },
    min: {
      type: Date,
    },
    max: {
      type: Date,
    },
    format: {
      type: String,
      default: "DD/MM/YYYY",
    },
  },
  methods: {
    isDate(value) {
      return (
        value &&
        typeof value.getFullYear === "function" &&
        typeof value.getMonth === "function" &&
        typeof value.getDay === "function"
      );
    },
    checkMinDate(day) {
      if (this.isDate(this.min)) {
        if (this.selectedYear < this.min.getFullYear()) {
          return true;
        }
        if (this.selectedYear > this.min.getFullYear()) {
          return false;
        }
        if (this.currentMonth < this.min.getMonth()) {
          return true;
        }
        if (
          this.currentYear == this.min.getFullYear() &&
          this.currentMonth == this.min.getMonth() &&
          day.day < this.min.getDate() &&
          !day.isAdded
        ) {
          return true;
        }
      }
      return false;
    },
    checkMaxDate(day) {
      if (this.isDate(this.max)) {
        if (this.selectedYear > this.max.getFullYear()) {
          return true;
        }
        if (this.currentMonth > this.max.getMonth()) {
          return true;
        }
        if (
          this.currentYear == this.max.getFullYear() &&
          this.currentMonth == this.max.getMonth() &&
          day.day > this.max.getDate()
        ) {
          return true;
        }
      }
      return false;
    },
    onInputHour(hour) {
      // hàm này kiêm tra focus sang input min
      const me = this;
      if (
        (hour.toString().length === 1 && hour >= 0) ||
        hour.toString().length === 2
      ) {
        me.updateTime(hour, null, null);
      }
    },
    onInputMin(min) {
      const me = this;
      if (
        (min.toString().length === 1 && min >= 0) ||
        min.toString().length === 2
      ) {
        me.updateTime(null, min, null);
      }
    },
    onInputSecond(second) {
      const me = this;
      if (
        (second.toString().length === 1 && second >= 0) ||
        second.toString().length === 2
      ) {
        //update ra ngoai
        me.updateTime(null, null, second);
      }
    },

    updateHour() {
      this.updateTime(this.hour, null, null);
    },
    updateMin() {
      this.updateTime(null, this.minutes, null);
    },
    updateSecond() {
      this.updateTime(null, null, this.second);
    },
    /**
     * Thưc hiện cạpp nhạt Giơ/Phút/Giây
     */
    updateTime(hour, min, second) {
      const me = this;
      let valueDateTime = _.cloneDeep(me.modelValue);
      if (valueDateTime && valueDateTime instanceof Date) {
        if (hour != null) {
          valueDateTime.setHours(hour);
        }
        if (min != null) {
          valueDateTime.setMinutes(min);
        }
        if (second != null) {
          valueDateTime.setSeconds(second);
        }
        // this.$emit('update:modelValue', valueDateTime);
        this.$emit("dateInput", valueDateTime);
        // this.$emit('valueDatePicker', valueDateTime);
      }
    },
    style() {
      // //Chieu cao cua cua so
      // let height =
      //   window.innerHeight ||
      //   document.documentElement.clientHeight ||
      //   document.body.clientHeight;
      // let width =
      //   window.innerWidth ||
      //   document.documentElement.clientWidth ||
      //   document.body.clientWidth;
      // let top = 36 + "px";
      // //this.screenY laf vi tri cua
      // if (this.screenY + this.height + 100 > height) {
      //   top = -this.height - 36 + "px";
      // }
      // if (this.screenX - this.width < 200) {
      //   return {
      //     left: 0 + "px",
      //     top: top,
      //   };
      // } else
      //   return {
      //     right: 0 + "px",
      //     top: top,
      //   };
    },
    /**  
    * Hàm trà vê tháng tiêp theo (hoăc 12 năm tiêp theo) khi bấm mũi tên sang  
    phài (hoă`c lên trên)  
    */
    nextMonth() {
      if (this.selecting === "date") {
        if (this.currentMonth < 11) this.currentMonth = +this.currentMonth + 1;
        else {
          this.currentMonth = 0;
          this.selectedYear = +this.selectedYear + 1;
        }
        return this.currentMonth;
      } else if (this.selecting === "year") {
        this.currentYear = +this.currentYear + 12;
      }
    },
    /**
    * Hàm trà vê tháng trước (hoăc 12 năm vê trước) khi bäm mũi tên sang phải  
    (hoăc xuông dươi)| PHUOC NGUVEN CONG, 2 years ago o Change new repo  
    */
    previousMonth() {
      if (this.selecting === "date") {
        if (this.currentMonth > 0) this.currentMonth = this.currentMonth - 1;
        else {
          this.currentMonth = 11;
          this.selectedYear = this.selectedYear - 1;
        }
        return this.currentMonth;
      } else if (this.selecting === "year") {
        let yearMin;
        if (this.min) {
          yearMin = this.min.getFullYear();
          if (this.currentYear - 12 < yearMin) {
            return;
          }
        }
        this.currentYear -= 12;
      }
    },
    /*-----------------------------------------------------
     * Đóng liich khi các nút Esc hay Tab auoơc nhấn
     * Created by: nv1am (22/06/2019)
     */
    setEscapeEvent() {
      const me = this;
      document.addEventListener("keydown", me.eventEscape);
    },
    eventEscape(event) {
      const me = this;
      if (event.keyCode == 27 || event.key == "Escape" || event.key == "Tab") {
        event.cancel = true;
        me.onClose(event);
      }
    },
    setByYear(year) {
      this.selectedDay = "";
      this.selectedYear = year;
      this.currentYear = year;
      this.selecting = "month";
    },
    setByMonth(month) {
      this.selectedDay = "";
      this.selectedMonth = month;
      this.currentMonth = month;
      if (this.format == "NMM/YYYY") {
        // măc định lâyy ngày là 1
        this.setByDay({
          day: 1,
          month: month,
        });
      } else {
        this.selecting = "date";
      }
    },
    onBlur(e) {
      this.onHide(e);
    },
    /*
     * Chọ ngày hiện tại khi bâm vào nút Hôm nay
     */
    onNow() {
      const me = this,
        date = new Date();
      if (this.selecting === "date") {
        me.selectedDay = date.getDate();
        me.selectedMonth = date.getMonth();
        me.currentMonth = date.getMonth();
        me.currentYear = date.getFullYear();
        me.selectedYear = date.getFullYear();
        me.selectedDayOfWeek = date.getDay();
        me.setByDay({
          currentDay: true,
          day: me.selectedDay,
          selected: true,
        });
        if (me.hasTime) {
          me.minutes = date.getMinutes();
          me.hour = date.getHours();
          me.second = date.getSeconds();
          me.updateTime(me.hour, me.minutes, me.second);
        }
        me.onClose(event);
      } else if (me.selecting === "year") {
        me.selectedYear = date.getFullYear();
        me.selecting = "month";
      } else if (me.selecting === "month") {
        me.selectedMonth = date.getMonth();
        me.currentMonth = date.getMonth();
        me.selecting = "date";
      }
    },
    onClose(e) {
      const me = this;
      this.$emit("close", e);
    },
    onHide(e) {
      const me = this;
      this.$emit("hide", e);
    },
    setByDay(day) {
      const me = this;
      if (me.rangeDayMode == false) {
        me.currentYear = me.selectedYear;
        me.selectedDay = day.day;
        me.selectedMonth = isNaN(day.month) ? me.currentMonth : day.month;
        me.selectedDayOfWeek = new Date(
          me.currentYear,
          me.selectedMonth,
          day.day
        ).getDay();
      }
      let valueDateTime = me.modelValue;
      if (valueDateTime && valueDateTime instanceof Date) {
        let month = me.selectedMonth + 1;
        //Check trường hơp chọn ngày của năm trước khi ở tháng 1
        if (month <= 0) {
          me.selectedYear = me.selectedYear - 1;
          month = 12;
        }
        //Check trương hơp chọn ngày của năm sau khi ơ tháng 12
        if (month >= 13) {
          me.selectedYear = me.selectedYear + 1;
          month = 1;
        }
        const newVal = moment(
          `${me.selectedYear}-${month}-${day.day}`,
          "YYYY-MM-DD"
        ).toDate();
        if (this.hasTime) {
          newVal.setHours(
            valueDateTime.getHours(),
            valueDateTime.getMinutes(),
            valueDateTime.getSeconds()
          );
        }
        //emit update v-model theo đúng data flow ơ` đây
        if (newVal) me.$emit("update:modelValue", newVal);
      }
      me.onClose(event);
    },
    closeOut(e) {
      const me = this;
      if (
        !e.target.closest(".calendar") &&
        (!e.target.closest(".ms-datepicker") ||
          e.target.closest(".ms-datepicker") != me.$parent.$el)
      ) {
        me.onHide(e);
      }
    },
    /*
     * Bạt chễ độ chọn khoảng ngày
     */
    onRangeDayMode() {
      this.rangeDayMode = true;
      return this.rangeDayMode;
    },
    /*
     * Tăt chễ đọ chon khoảng ngày
     */
    offRangeDayMode() {
      this.rangeDayMode = false;
      return this.rangeDayMode;
    },
    /*
     * Hàm thay đơi chế độ chọn năm hoălc chọn ngày
     */
    setSelecting(value) {
      this.selecting = value;
      this.currentYear = this.selectedYear;
    },
    /**  
        " Lãy ngày cho datepicker khi nhạpp tư` ô input.  
        */
    setDate() {
      // Nêu ngày đươc truyên tơi component datepicker, nó sẽ aượ dưng
      // thay cho ngày hiẹn tai.
      let date;
      if (this.min && this.min && !this.modelValue) {
        date = new Date();
      } else if (this.modelValue && this.modelValue) {
        date = new Date(this.modelValue);
      } else {
        date = new Date();
      }
      this.selectedDay = date.getDate();
      this.selectedDayOfWeek = date.getDay();
      this.selectedMonth = date.getMonth();
      this.currentMonth = date.getMonth();
      this.selectedYear = date.getFullYear();
      this.currentYear = date.getFullYear();
    },
    dayOfWeek(value) {
      switch (value) {
        case 0:
          return "T2";
        case 1:
          return "T3";
        case 2:
          return "T4";
        case 3:
          return "T5";
        case 4:
          return "T6";
        case 5:
          return "T7";
        case 6:
          return "CN";
      }
      return "";
    },
  },
  computed: {
    // ...mapGetters(ModuleContext, ["ConfigInfo"]),
    /* Hàm trả vê mọt mảng gôm ngày của tuân đâu tiên trong tháng của năm
     * VD: Nêu ngày 1 trong tháng båt đâu từ thứ 6
     * thì mảng sẽ là [',, ',, ',, ',, ',, '1', '2']
     */
    calendar() {
      const days = [];
      const me = this;
      //Lây ra thư của ngày đâu tiên trong tháng
      let now = new Date(this.selectedYear, this.currentMonth, 1);
      const startDayOfMonth = now.getDay();
      let startDay = startDayOfMonth;
      const sundayIndex = 0;
      if (startDayOfMonth != sundayIndex) {
        let pre = now.addDays(-1).getDate();
        for (let i = startDay - 2; i >= 0; i--) {
          days.push(pre - i);
        }
      } else {
        let pre = now.addDays(-1).getDate();
        for (let i = 0; i < 6; i++) {
          days.push(pre--);
        }
        //Reverse lại do såp xêp ngươ` ở TH này
        days.reverse();
      }
      //Tạo mảng gôm các ngày còn lại trong tháng
      const daysInMonth =
        32 - new Date(this.selectedYear, this.currentMonth, 32).getDate();
      for (let i = 0; i < daysInMonth; i++) {
        days.push(i + 1);
      }
      const today = new Date(this?.modelValue);
      const sundayNumberic = 7;
      //Kiêm tra nễu start day = 0 thì tăng start day = 7 do hàm getDay trả vê  ngày chủ nhạt là 0
      let dis = startDay !== sundayIndex ? startDay : sundayNumberic;
      const dayObjects = days.map((day) => {
        const currentDay =
          day === today.getDate() &&
          me.currentMonth == today.getMonth() &&
          me.selectedYear == today.getFullYear();
        let disabled = false;
        const diffMonth = --dis > 0;
        // Kiêm tra xem có phải tháng của ngày båt đâu dữ liệu, đúng thì sẽ  disable nhưng ngày bô sung ơ đâu lịch
        if (
          diffMonth &&
          me.min &&
          me.currentMonth == me.min.getMonth() &&
          me.currentYear == me.min.getFullYear()
        ) {
          disabled = true;
        }
        const month = diffMonth ? me.currentMonth - 1 : me.currentMonth;
        const selected =
          me.selectedDay === day &&
          month === me.selectedMonth &&
          me.selectedYear == today.getFullYear(); // Hiên thị.  selected date đúng năm
        return { day, currentDay, selected, diffMonth, month, disabled };
      });
      //add thêm ngày tháng sau cho kín lich
      var ofs = dayObjects.length % 7;
      if (ofs > 0) {
        for (let i = 1; i <= 7 - ofs; i++) {
          dayObjects.push({
            day: i,
            currentDay: false,
            selected: false,
            disabled:
              me.max && me.max.getMonth() == me.currentMonth ? true : false, // Kiêm tra có phải tháng cưa ngày max không nếu phải thì sẽ             disable
            diffMonth: true,
            month: this.currentMonth + 1,
            isAdded: true,
          });
        }
      }
      // Chunk all of the days into an array of arrays, by seven.
      return chunk(dayObjects, 7);
    },
    /**
     * Trà vê dü liẹu các tháng
     * TVDAT 21/11/2022
     */
    months() {
      const me = this;
      const today = new Date();
      let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // mảng chứa các      tháng, fix luôn vì kiêu gì cũng chỉ có 12 tháng
      const monthObjects = months.map((month) => {
        const isCurrentMonth = me.selectedMonth === today.getMonth();
        const isSelected = me.currentMonth === month;
        let isDisabled = false;
        return { month, isCurrentMonth, isSelected, isDisabled };
      });
      return chunk(monthObjects, 3);
    },
    years() {
      //Đăt năm đâu tiên của däy
      const me = this;
      const today = new Date();
      let lastYear;
      if (this.selectedYear === "") {
        lastYear = today.getFullYear();
      } else lastYear = this.currentYear;
      let through = 12; // sô năm hiefn thị trên 1 trang
      let years = []; // mảng chưa các năm
      let yearMin = null;
      if (me.min) {
        yearMin = me.min.getFullYear();
      }
      if (yearMin != null && lastYear - through < yearMin) {
        // Bổ sung năm để lâp đây licch
        let upperRange = through + yearMin - 1;
        for (let i = upperRange; i >= yearMin; i--) {
          years.push(i);
        }
      } else {
        for (let i = lastYear; i > lastYear - through; i--) {
          if (yearMin != null) {
            if (i >= yearMin) {
              years.push(i);
            }
          } else {
            years.push(i);
          }
        }
      }
      const yearObjects = years.map((year) => {
        const currentYear = this.selectedYear === today.getFullYear();
        const selected =
          this.selectedYear === year &&
          this.currentMonth === this.selectedMonth;
        let disabled = false;
        if (yearMin) {
          disabled = year < yearMin;
        }
        return { year, currentYear, selected, disabled };
      });
      // Chunk all of the days into an array of arrays, by seven.
      return chunk(yearObjects, 3);
    },
    /***
     * Traza vê tháng được chọ thành mọt từ.
     * VD: 6 -> Tháng 6
     *
     * Ereturn {String}
     */
    selectedMonthWord() {
      return `Tháng ${this.selectedMonth + 1}`;
    },
    selectedDateRange() {
      let beginDay = this.selectedDay;
      return beginDay;
    },
    /***
     * Thông tin tháng/năm hiể thị
     */
    monthYearTitle() {
      //Tháng {{ +currentMonth + 1 }} năm {{ selectedYear }}
      return `Tháng {0} năm {1}`.format(
        this.currentMonth + 1,
        this.selectedYear
      );
    },
  },
  getValueFromInput() {
    return (this.currentMonth = this.specifiedDate.getMonth());
  },
  created() {
    this.setEscapeEvent();
    this.setDate();
    document.addEventListener("click", this.closeOut);
  },
  beforeUnmount() {
    const me = this;
    document.removeEventListener("click", me.closeOut);
    document.removeEventListener("keydown", me.eventEscape);
  },
  mounted() {
    this.height = this.$el.offsetHeight;
    this.width = this.$el.offsetWidth;
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/components/Datepicker.scss";
</style>