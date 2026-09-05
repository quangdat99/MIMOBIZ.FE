import {
    validateText
} from '../mixins/component/validateText';
import {
    validateNumber
} from '../mixins/component/validateNumber';
import {
    validateCommon
} from '../mixins/component/validateCommon';
import {
    ref,
    getCurrentInstance,
    computed
} from 'vue';

export const useValidateControl = ({
    props
}) => {
    const errorMessage = ref('');
    const isValidate = computed(() => props.rules.length > 0);
    const {
        proxy
    } = getCurrentInstance();

    const validate = () => {
        let rules = props.rules;
        let message = '';

        if (Array.isArray(rules) && rules.length > 0) {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule) {
                    const {
                        name,
                        compareValue,
                        customValidate
                    } = rule;
                    const controlValue = getValueControl();
                    // Nếu rule này được thiết lập validate riêng
                    if (customValidate && typeof customValidate === 'function') {
                        message = customValidate(controlValue, compareValue);
                        if (message) {
                            break;
                        }
                    } else {
                        message = handlerRule(name, controlValue, compareValue);
                        if (message) {
                            break;
                        }
                    }
                }
            }
        }
        errorMessage.value = message;
        return message;
    }

    const handlerRule = (rule, controlValue, compareValue) => {
        let message = '';

        const titleError = getTileError();

        switch (rule) {
            case 'required':
                if (!validateCommon.validateRule(rule, controlValue)) {
                    message = `${titleError} không được để trống`;
                }
                break;
            case 'differentZero':
                if (!validateNumber.validateRule(rule, controlValue)) {
                    message = `${titleError} không được để trống hoặc phải có giá trị khác 0`
                }
                break;
            case 'email':
            case 'phoneNumber':
            case 'password':
            case 'comparePassword':
                let error = validateText.validateRule(rule, controlValue, compareValue);
                if (error) {
                    message = error;
                }
                break;
            default:
                break;
        }
        return message;
    }

    const getValueControl = () => {
        return proxy.getValue();
    }

    const getTileError = () => {
        return props?.title || getValidateName() || '';
    }

    const getValidateName = () => {
        let fn = function (el, c) {
            if (!el || c > 10) {
                return null;
            }
            let labelElement = el.querySelector('label');
            if (labelElement) {
                return (labelElement.innerText || '').replace('*', '');
            }
            return fn(el.parentNode, c + 1);
        }

        return fn(proxy.$el, 0);
    }

    const clearValidate = () => {
        return errorMessage.value = '';
    }

    return {
        validate,
        errorMessage,
        isValidate,
        clearValidate
    };
}