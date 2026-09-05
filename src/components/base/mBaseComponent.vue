<script>
export default {
  name: "MsBaseComponent",
  props: {
    /**
     * rule dùng để validate control
     */
    rules: {
      type: Array,
      default: () => [],
    },
    /**
     * Tên của control phục vụ việc hiện thị message cho validate
     * Created by LTDAT (22.06.2020)
     */
    name: {
      default: null,
      type: String,
    },
    /**
     *NNLAM 22/03/2021
     * prop kiểu hàm cho phép custom validate trên cell grid
     */
    customValidateRules: {
      type: Function,
      default: null,
    },

    /**
     * thuộc tỉnh readOnly cho các form sử dụng có thể khai báo trực tiếp
     */
    readOnly: {
      type: Boolean,
      default: false,
    },
    /**
    * Thuộc tính disable control (bổ sung lên đây để dùng chung cho toàn bộ
    các component)
    */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     *
     * label control - có thể k gán mà chỉnh ở ngoài cho link động
     */
    label: {
      default: null,
      type: String,
    },
    isGridEditor: {
      default: false,
      type: Boolean,
    },
    errorProvider: {
      default: {},
    },
  },
};
</script>
<style lang="scss" scoped>
</style>