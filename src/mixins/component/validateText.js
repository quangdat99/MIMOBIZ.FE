export const validateText = {
    validateRule(rule, value, compareValue) {
        const me = this;
        let res = '';

        switch (rule) {
            case 'phoneNumber':
                res = me.validatePhoneNumber(value);
                break;
            case 'email':
                res = me.validateEmail(value);
                break;
            case 'password':
                res = me.validatePassword(value);
                break;
            case 'comparePassword':
                res = me.validateComparePassword(value, compareValue);
                break;
        }
        return res;
    },
    validatePhoneNumber(value) {
        try {
            let rex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
            let result = value;
            if (!rex.test(result.trim())) {
                return 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại';
            }
        } catch (e) {
            return 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại';
        }
        return '';
    },
    validateEmail(value) {
        try {
            let rex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            let result = value;
            if (!rex.test(result.trim())) {
                return 'Email không hợp lệ, vui lòng kiểm tra lại';
            }
        } catch (e) {
            return 'Email không hợp lệ, vui lòng kiểm tra lại';
        }
        return '';
    },
    validatePassword(value) {
        const me = this;
        if (!value) {
            return 'Mật khẩu không được để trống';
        }
        if (value.length < 8) {
            return 'Mật khẩu phải dài ít nhất 8 kí tự'
        }

        if (!(/[A-Z]/g.test(value))) {
            return 'Mật khẩu phải có ít nhất một chữ cái viết hoa';
        }
        if (!(/[a-z]/g.test(value))) {
            return 'Mật khẩu phải có ít nhất một chữ cái viết thường';
        }

        if (!(/[0-9]/g.test(value))) {
            return 'Mật khẩu phải có ít nhất một chữ số';
        }
        return '';
    },
    validateComparePassword(value, compareValue){
        if (value != compareValue) {
            return 'Nhập lại mật khẩu không khớp với mật khẩu đã nhập'
        }
        return '';
    }
}