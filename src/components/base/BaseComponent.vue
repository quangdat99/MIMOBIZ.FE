<script>
    export default {
        name: 'baseComponent',
        props: {
            /**
             * Rules phục vụ các phần validate
             */
            rules:{
                type: Array,
                default: () => []
            },
            /**
             * Tên của component
             */
            name:{
                type: String,
                default: null
            },
            /**
             * Dùng để thực hiện việc readOnly
             */
            readOnly:{
                type: Boolean,
                default: false
            },
            /**
             * Dùng để thực hiện việc disable
             */
            disabled:{
                type: Boolean,
                default: false
            },
            errorProvider:{
                default: {}
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>