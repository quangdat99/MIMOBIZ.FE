<template>
  <div
    class="ms-datepicker ms-editor w-100"
    ref="refWrap"
    :class="[{ 'ms-validate': isValidate }]"
  >
    <label class="label" v-if="label">{{ label }}</label>
    <div
      ref="refParent"
      class="ms-container--datepicker flex-row"
      :class="[
        { error: errorMessage, disabled: disabled },
        hasBorder ? 'border' : '',
      ]"
    >
      <input
        ref="input"
        class="ms-input--datepicker flex"
        :value="rawValue"
        :tabindex="0"
        :autofocus="autofocus"
        :disabled="disabled"
        :class="[{ disabled: disabled }, hasBorder ? '2' + '-border' : '2']"
        :readOnly="readOnly"
        v-on="listeners"
      />
      <div
        ref="icon"
        @click="toggleClick"
        :class="[
          heightOption == 2
            ? isFilterGrid == true
              ? 'ms-calendar-filter-grid'
              : 'ms-calendar'
            : isFilterGrid == true
            ? 'ms-calendar-small-filter-grid'
            : 'ms-calendar-small',
          { disabled: disabled },
          { 'event-none': readOnly },
        ]"
        v-if="!onlyDisplayTime"
        :title="tooltipIcon"
      ></div>
    </div>
    <slot :errorMessage="errorMessage" name="error"></slot>
    <div class="error-text mt-1 txt-error" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div class="datepicker-content" ref="datepickerContent">
      <datepicker
        :screenX="0"
        :screenY="0"
        class="datepicker"
        ref="datepicker"
        v-model="valueDatePicker"
        :format="format"
        :min="min"
        :max="max"
        @close.stop="updateDatePicker"
        @hide.stop="isShowDatePicker = false"
        @dateInput="updateTime"
        v-if="isShowDatePicker"
        :hasTime="hasTimeInfo"
      ></datepicker>
    </div>
  </div>
</template>

  <script>
`use strict`;
import Datepicker from "./Datepicker.vue";
import commonFn from "@/commons/commonFunction.js";
import { IMaskDirective } from "vue-imask";
import IMask from "imask";
import msDateUtil from "./msDateUtil";
import moment from "moment";
// import { ModuleContext } from "e/stores/moduleConst";
import { mapGetters } from "vuex";
import { useValidateControl } from "@/setup/validateControl.js";
import EventBusGlobal, { GlobalEventName } from "@/commons/eventBusGlobal";
import msBaseComponent from "@/components/base/mBaseComponent.vue";

export default {
  name: "MsDatepicker",
  extends: msBaseComponent,
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      required: false,
    },
    format: {
      type: String,
      default: "DD/MM/YYYY",
    },
    type: {
      type: String,
      default: "",
    },
    defaultTime: {
      type: String,
      default: null,
    },
    min: {},
    max: {},
    /*
     * Hàm show ra câu thông báo riêng theo từng trường hơp
     * ví dụ: customWarring {rules:'required', mes: 'Tài sán này là của pvduy'}
     */
    customWarring: {
      type: Object,
      default: null,
    },
    // Xác định xem input có border hay không?
    hasBorder: {
      default: true,
      type: Boolean,
    },
    // Xác đinh là dùng ở filer header grid
    isFilterGrid: {
      type: Boolean,
      default: false,
    },
    hasTimeInfo: {
      type: Boolean,
      default: false,
    },
    onlyDisplayTime: {
      type: Boolean,
      default: false,
    },
    setToCurrentDateTime: {
      type: Boolean,
      default: false,
    },
    /**
     * Có hiên thi icon chon ngày không
     */
    showIconDate: {
      type: Boolean,
      default: true,
    },
    tooltipIcon: {
      type: String,
      default: null,
    },
  },
  computed: {
    // ...mapGetters(ModuleContext, ["ConfigInfo"]),
    listeners() {
      return {
        input: (e) => {
          if (
            e.target.value == "_/_/____" ||
            e.target.value == "__/_/____" ||
            !e.target.value
          ) {
            this.$nextTick(() => {
              this.updateVModel(null);
            });
          }
        },
        change: (e) => {
          this.onChange(e);
        },
        focus: (e) => {
          this.onFocus(e);
        },
        blur: (e) => {
          this.onBlur(e);
        },
        keydown: (e) => {
          this.$emit("msKeydown", e);
        },
        focus: (e) => {
          this.momentMask.updateOptions({ lazy: false });
          this.isShowDatePicker = false;
        },
        focusout: (e) => {
          this.momentMask.updateOptions({ lazy: true });
        },
      };
    },
    /**
     * Đọ rộng cua input
     */
    db0ptionHeight() {
      return (
        "heightoptionvalue" +
        parseInt(this.$store?.state?.dbOption?.dbOptions.HeightOption || 2)
      );
    },
    heightOption() {
      return this.$store?.state?.dbOption?.dbOptions.HeightOption || 2;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal, oldVal) {
        const me = this;
        if (typeof newVal == "string") {
          let newValDate = newVal?.getDateOnly();
          me.updateVModel(newValDate, oldVal, undefined, 1);
        } else {
          me.setRawValue(newVal);
          me.$emit("update:modelValue", newVal);
        }
      },
    },
    min: {
      immediate: true,
      handler(newVal, oldVal) {
        const me = this;
        if (newVal) {
          me.updateMomentMask();
        }
      },
    },
    isShowDatePicker: {
      handler(newVal, oldVal) {
        const me = this;
        me.handleToggle(newVal);
      },
    },
  },
  data() {
    return {
      topx: 0,
      leftx: 0,
      focused: false,
      rawValue: "",
      valueDatePicker: this.modelValue ? this.modelValue : new Date(), // ngày thao tác với datepicker popup, định dạng date
      isShowDatePicker: false,
    };
  },
  components: {
    Datepicker,
  },
  methods: {
    getValue() {
      return this.modelValue;
    },
    /**
     * Thiết lập message cho dl rỗng
     */
    setError(message) {
      const me = this;
      setTimeout(() => {
        if (message) {
          me.errorProvider["isValid"] = true;
          me.errorProvider["message"] = message;
          me.errorProvider["element"] = this;
        } else {
          me.errorProvider["isValid"] = false;
        }
      });
    },
    setDefaultTime(value) {
      const me = this;
      if (me.defaultTime && value) {
        let splitTime = me.defaultTime.split(":");
        if (splitTime && splitTime.length == 3) {
          value.setHours(splitTime[0]);
          value.setMinutes(splitTime[1]);
          value.setSeconds(splitTime[2]);
        }
      }
    },
    /***
     * Tư đọng cạpp nhật ngày khi control đang nhập dở ngày
     */
    autoNomalizeValue(value, masked) {
      const me = this;
      if (!masked.unmaskedValue) {
        me.updateVModel(
          me.setToCurrentDateTime ? new Date() : null,
          me.modelValue,
          false
        );
      } else if (value && typeof value == "string" && masked) {
        if (!masked.isComplete && !masked.date) {
          let dte = me.nomalizeDateTime(value, masked);
          if (dte) {
            me.momentMask.value = msDateUtil.parseDateTimeToString(
              dte,
              me.format
            );
          }
          return dte;
        } else {
          return me.nomalizeDateTime(value, masked);
        }
      }
      return null;
    },

    /**
     * Cạp nhạt string vào control input phuc vụ hiên thị
     */
    setRawValue(valueDte, force) {
      const me = this;
      // if (!me.typing || force) {
      // if (!valueDte) valueDte = me.innerValue;
      if (valueDte) {
        let ret = msDateUtil.parseDateTimeToString(
          this.hasTimeInfo ? valueDte : valueDte?.getDateOnly(),
          me.format
        );
        if (me.rawValue !== ret) {
          me.rawValue = ret;
        }
      } else {
        me.rawValue = null;
      }
      // bnduc: Nễu me.rawValue giá trî thì mới update
      //NCPHUOC: Thưc hiẹn update vê giá trị rỡng cho rawNalue đê hiên thị
      if (me.momentMask && me.momentMask.value != me.rawValue) {
        if (!me.rawValue) {
          me.momentMask.value = "";
        } else {
          me.momentMask.value != me.rawValue &&
            (me.momentMask.value = me.rawValue);
        }
      }
      // }
    },
    onFocus(e) {
      this.focused = true;
    },
    onBlur(e) {
      this.focused = false;
      this.$nextTick(() => {
        this.validate();
        // DMNGOC 26/09/2022: sửa lỡi blur khi nhập ngày không hơp lệ
        this.setRawValue(this.modelValue, null);
        this.$emit("onBlurActionDatePicker", e);
      });
    },

    /**
     * Thưc hiện chuân hóa DateTime từ string
     * Eparam {String/DateTime} str Chuỡi DateTime cân chuân hóa
     * Eparam {MaskedDate} masked Chuỗi DateTime cân chuẩn hóa
     */
    nomalizeDateTime(str, masked) {
      const me = this;
      try {
        if (str) {
          if (str instanceof Date) {
            return str;
          } else {
            if (masked && masked.rawInputValue) {
              let mo = masked.parse(masked.rawInputValue);
              if (mo && mo.isValid()) {
                let dte = mo.toDate(),
                  now = new Date();
                if (me.hasTimeInfo) {
                  const splitDateTime = str.split(" ");
                  if (
                    splitDateTime &&
                    Array.isArray(splitDateTime) &&
                    splitDateTime.length > 0
                  ) {
                    const time = splitDateTime[1] || splitDateTime[0];
                    if (time.includes("__") || time.includes("_")) {
                      if (me.defaultTime) {
                        let splitTime = me.defaultTime.split(":");
                        if (splitTime && splitTime.length == 3) {
                          dte.setHours(splitTime[0]);
                          dte.setMinutes(splitTime[1]);
                          dte.setSeconds(splitTime[2]);
                        }
                      } else {
                        dte.setHours(now.getHours());
                        dte.setMinutes(now.getMinutes());
                        dte.setSeconds(now.getSeconds());
                        dte.setMilliseconds(now.getMilliseconds());
                      }
                    }
                  }
                }
                if (dte < masked.min || dte > masked.max) {
                  dte.setFullYear(now.getFullYear());
                }
                return dte;
              }
            }
          }
        }
      } catch (ex) {
        me.$ms.log.handleException(ex);
      }
    },

    toggleClick(e) {
      const me = this;
      //disable thì không làm gì
      if (me.disabled) {
        return;
      }
      me.isShowDatePicker = !me.isShowDatePicker;
      me.setPickerDisplay(".datepicker-content", true);
      me.updatePositionDropdownMenu();
    },
    /**
     * ân picker đi
     */
    setPickerDisplay(selector, value) {
      let pickers = document.querySelectorAll(selector);
      if (pickers && pickers.length > 0) {
        for (let i = 0; i < pickers.length; i++) {
          pickers[i].hidden = !value;
        }
      }
    },
    //Cạpp nhật lại tọa độ của dropdown menu
    updatePositionDropdownMenu() {
      const me = this;
      let rectDropdownMenu = me.$refs.datepickerContent.getBoundingClientRect(),
        rectIcon = me.$refs.icon.getBoundingClientRect(),
        windowWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
      let widthDropdown = rectDropdownMenu.width ? rectDropdownMenu.width : 300;
      let heightDropdown = rectDropdownMenu.height
        ? rectDropdownMenu.height
        : 300;
      if (rectIcon.left + widthDropdown > windowWidth) {
        me.$refs.datepickerContent.style.left =
          rectIcon.right - widthDropdown + 10 + "px";
      } else {
        me.$refs.datepickerContent.style.left = rectIcon.left + 10 + "px";
      }
      if (rectIcon.bottom + heightDropdown > windowHeight) {
        me.$refs.datepickerContent.style.top =
          rectIcon.top - heightDropdown + "px";
      } else {
        me.$refs.datepickerContent.style.top = rectIcon.top + 5 + 26 + "px";
      }
    },

    onChange(e) {
      const me = this,
        momentMask = me.momentMask,
        masked = momentMask ? momentMask.masked : null,
        value = e.currentTarget.value;
      /**
       * Chơt chăgn xư` lý auto Gen ngày tháng theo text đang nhạpp dơ`
       */
      let newVal = me.autoNomalizeValue(value, masked);
      me.$nextTick(() => {
        if (newVal) {
          if (me.min && newVal.getTime() < me.min.getTime()) {
            newVal = me.min?.getDateOnly();
          } else {
            me.updateVModel(newVal);
          }
          me.$emit("updateDatePicker", newVal);
        }
      });
      if (me.rules) {
        me.validate(me);
      }
    },
    /**
     * Sư kiện chon từ popup DatePicker
     */
    updateDatePicker(e) {
      const me = this;
      //esc
      if (e && e.which == 27) {
        e.cancel = true;
      }
      me.isShowDatePicker = false;
      let value = me.valueDatePicker;
      if (me.format == "DD/MM/YYYY") {
        if (value instanceof Date) {
          value.setHours(0);
          value.setMinutes(0);
          value.setSeconds(0);
        }
      }
      me.updateVModel(value);
      me.$emit("updateDatePicker", value);
      me.$refs.input.focus();
    },
    /**
     * Xử lý cạp nhạt vào v-model nễu đä hoàn thành viẹc nhạpp liẹu
     */
    maskInputComplete() {
      const me = this,
        momentMask = me.momentMask,
        masked = momentMask ? momentMask.masked : null;
      if (masked && masked.isComplete && masked.date) {
        let ret = masked.date.toDate(),
          retText = msDateUtil.parseDateTimeToString(ret, me.format),
          currentValue = msDateUtil.parseDateTimeToString(
            me.modelValue,
            me.format
          );
        me.updateVModel(ret, me.modelValue, true);
      }
    },
    updateTime(newVal) {
      this.$emit("update:modelValue", newVal);
    },
    /**
     * Thưc hiẹn gán value vào MsDatePicker
     */
    updateVModel(newVal, oldVal, changeBinding = true, callbackType) {
      const me = this;
      if (newVal) {
        me.valueDatePicker = newVal;
      } else {
        me.valueDatePicker = new Date();
      }
      me.setRawValue(newVal);
      if (changeBinding) {
        me.$emit("msChange", newVal, me.oldDate, callbackType);
      }
      me.$emit("update:modelValue", newVal);
      /** Xử lý sau khi cạp nhạtt model */
      if (changeBinding && commonFn.compareDate(newVal, oldVal)) {
        me.$emit("afterChange", newVal, me.oldDate, callbackType);
      }
      me.$nextTick(() => {
        if (me.rules) {
          me.validate(me);
        }
        this.$emit("msChangeData", newVal);
      });
    },

    setValue(value) {
      const me = this;
      if (value) {
        me.valueDatePicker = value;
        me.oldDate = me.valueDatePicker?.getDateOnly();
      } else {
        me.valueDatePicker = new Date();
        me.oldDate = null;
      }
      if (typeof value == "string") {
        let newValDate = value?.getDateOnly();
        me.updateVModel(newValDate, me.modelValue, false);
      } else {
        me.updateVModel(value, me.modelValue, false);
      }
    },
    /**
     * Cạp nhạt lại option min,max của momentMask
     */
    updateMomentMask() {
      let me = this;
      let option = {
        min: me.min || new Date(1970, 0, 1), // Sứa lại giơi han ngày theo tài liêu
        max: me.max || new Date(9999, 12, 31),
      };
      if (me.momentMask) {
        me.momentMask.updateOptions(option);
      }
    },
    handleToggle(show) {
      let me = this;
      if (show) {
        me.$nextTick(() => {
          EventBusGlobal.$emit(GlobalEventName.openWrapper, {
            container: [me.$refs.datepicker?.$el],
            element: me.$el,
            button: me.$refs.icon,
          });
        });
        setTimeout(() => {
          EventBusGlobal.$on(GlobalEventName.openWrapper, me.openWrapperOther);
        }, 0);
      } else {
        EventBusGlobal.$off(GlobalEventName.openWrapper, me.openWrapperOther);
      }
    },
    initPicker() {
      const me = this;
      document.body.appendChild(me.$refs.datepickerContent);
      let element = me.$refs.input,
        momentFormat = me.format,
        momentMask = IMask(element, {
          mask: Date,
          pattern: momentFormat,
          lazy: true,
          min: this.min || new Date(1970, 0, 1),
          max: this.max || new Date(9998, 12, 31),
          format: function (date) {
            let ret = moment(date).format(momentFormat);
            return ret;
          },
          parse: function (str) {
            let ret = moment(str, momentFormat);
            return ret;
          },
          commit: me.momentMaskCommit,
          blocks: {
            YYYY: { mask: IMask.MaskedRange, from: 1, to: 9999 },
            MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
            DD: { mask: IMask.MaskedRange, from: 1, to: 31 },
            HH: { mask: IMask.MaskedRange, from: 0, to: 23 },
            kk: { mask: IMask.MaskedRange, from: 0, to: 23 },
            mm: { mask: IMask.MaskedRange, from: 0, to: 59 },
            ss: { mask: IMask.MaskedRange, from: 0, to: 59 },
            A: { mask: IMask.MaskedEnum, enum: ["AM", "PM", "SA", "CH"] },
            a: { mask: IMask.MaskedEnum, enum: ["am", "pm", "sa", "ch"] },
          },
        });
      momentMask.on("complete", me.maskInputComplete);
      me.momentMask = momentMask;
    },
    openWrapperOther({ container, element, button }) {
      let cont = container || [];
      if (element == this.$el) {
        return;
      }
      this.$nextTick(() => {
        this.isShowDatePicker = false;
      });
    },
  },
  setup(props) {
    const { errorMessage, validate, isValidate } = useValidateControl({
      props,
    });
    return { errorMessage, validate, isValidate };
  },
  mounted() {
    const me = this;
    me.initPicker();
  },
  created() {
    const me = this;
  },
  beforeUnmount() {
    const me = this;
    me.isShowDatePicker = false;
    if (me.$refs.datepicker) {
      me.$refs.datepicker.$el.remove();
    }
  },
};
</script>  
<style lang="scss" scoped>
@import "@/assets/scss/components/MsDatepicker.scss";
</style>