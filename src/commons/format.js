export const useFormat = () =>{
    const formatVND = (input) =>{
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9}
        const formated = new Intl.NumberFormat('vi-VN', config).format(input);
        return formated;
    }

    return {
        formatVND
    }
}