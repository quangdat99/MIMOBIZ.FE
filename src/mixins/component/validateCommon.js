export const validateCommon = {
    validateRule(rule,value){
        const me = this;
        let res = true;
        
        switch(rule){
            case 'required':
                res = me.validateRequired(value);
                break;
        }
        return res;
    },
    validateRequired(value){
        if(value === undefined || value === null || (isNaN(value) && typeof value == 'number') || value === ''){
            return false;
        }
        return true;
    }
}