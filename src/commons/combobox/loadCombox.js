import { reactive } from 'vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import checkerAPI from "@/apis/components/checkerAPI";
import bookmarkTypeAPI from "@/apis/components/bookmarkTypeAPI";


class LoadCombobox {

  getBookmarkType = async (payload) => {
    let param = {
      columns: "bookmark_type_id,bookmark_type_code",
      sort: "bookmark_type_code",
    };
    if (payload) {
      param = payload;
    }
    let data = await bookmarkTypeAPI.getComboboxPaging(param);
    return data;
  };


  getChecker = async (payload) => {
    let param = {
      columns: "checker_id,checker_code,checker_name",
      sort: "checker_code",
    };
    if (payload) {
      param = payload;
    }
    let data = await checkerAPI.getComboboxPaging(param);
    return data;
  };
}
export default new LoadCombobox();