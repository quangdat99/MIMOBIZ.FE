import authAPI from "@/apis/components/authAPI";
import checkerAPI from "@/apis/components/checkerAPI";
import { BASE_URL } from '@/utils/envConst.js';

export default {
  /**
   * Đăng nhập (sử dụng AuthController tại BE)
   */
  async login(context, payload) {
    context.commit('updateLoading', true);
    try {
      var res = await authAPI.login(payload);

      if (res && res.data && res.data.statusCode == 200) {
        if (res.data.data?.Token) {
          context.commit('updateToken', res.data.data);
        }
      }
      return res.data;
    } finally {
      context.commit('updateLoading', false);
    }
  },

  /**
   * Đăng xuất
   */
  logout(context) {
    context.commit('updateLogout');
    // location.href = "login";
  },

  /**
   * Đăng ký
   */
  async signup(context, payload) {
    context.commit('updateLoading', true);
    context.commit('updateLogout');
    try {
      var res = await checkerAPI.signup(payload);

      if (res && res.data && res.data.statusCode == 200) {
        if (res.data.data?.Token) {
          context.commit('updateToken', res.data.data);
        }
      }
      return res.data;
    } finally {
      context.commit('updateLoading', false);
    }
  },

}