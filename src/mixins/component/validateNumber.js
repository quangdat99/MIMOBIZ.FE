
export const validateNumber = {
    validateRule(rule, value){
        const me = this;
        let res = true;
        switch(rule){
            case 'differentZero':
                res = me.validatedDifferentZero(value);
                break;
        }
        return res;
    },
    validatedDifferentZero(value){
        const me = this;
        if( value === undefined || value === null  || value === '' || value === 0){
            return false;
        }else{
            return true;
        }
    }
}