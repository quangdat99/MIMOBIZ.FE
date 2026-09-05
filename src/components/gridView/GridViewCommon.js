export const checkerGridViewCommon = () => {
    const localizationConfig = {
        "vi": {
            "pagination": {
                "page_size": "Số bản ghi trên 1 trang", //label for the page size select element
                "page_title": "Show Page", //tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
                "first": "Trang đầu", //text for the first page button
                "first_title": "Trang đầu", //tooltip text for the first page button
                "last": "Trang cuối",
                "last_title": "Trang cuối",
                "prev": "Trang trước",
                "prev_title": "Trang trước",
                "next": "Trang sau",
                "next_title": "Trang sau",
                "all": "Tất cả",
                "counter": {
                    "showing": "Bản ghi",
                    "of": "trên",
                    "rows": "dòng",
                    "pages": "trang",
                }
            },
            "data":{
                "loading":"Đang tải...", //data loader text
                "error":"Có lỗi xảy ra", //data error text
            },
        }
    }

    const filterOptions = [
        {
            value : '<',
            text: '<'
        }
    ];

    return {
        localizationConfig
    }
}