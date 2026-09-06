<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Branded Banner (Vuestic AuthLayout style) -->
      <div class="auth-banner">
        <div class="banner-content">
          <div class="banner-brand">
            <MimobizLogo :height="42" textColor="#FFFFFF" :showBadge="true" />
          </div>

          <div class="banner-headline">
            <h1>Giải pháp Quản trị Doanh nghiệp & Hồ sơ Toàn diện</h1>
            <p>Hệ thống hỗ trợ chuẩn hóa quy trình, tự động hóa tiến độ công việc và quản trị dữ liệu tập trung thông minh.</p>
          </div>

          <div class="banner-features">
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">verified</span>
              <div class="feature-text">
                <div class="feature-title">Chuẩn hóa Hồ sơ & Tài liệu</div>
                <div class="feature-desc">Quản lý phiên bản và bảo mật dữ liệu tuyệt đối</div>
              </div>
            </div>
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">monitoring</span>
              <div class="feature-text">
                <div class="feature-title">Theo dõi Timeline Trực quan</div>
                <div class="feature-desc">Kiểm soát tiến độ bàn giao và hạn chót chính xác</div>
              </div>
            </div>
            <div class="feature-item">
              <span class="material-symbols-outlined feature-icon">hub</span>
              <div class="feature-text">
                <div class="feature-title">Cộng tác Nhân viên Tối ưu</div>
                <div class="feature-desc">Phân quyền chi tiết theo từng vai trò nghiệp vụ</div>
              </div>
            </div>
          </div>

          <div class="banner-footer">
            <span>© 2026 Mimobiz. Nền tảng quản trị thế hệ mới.</span>
          </div>
        </div>

        <!-- Abstract visual elements -->
        <div class="banner-shape-1"></div>
        <div class="banner-shape-2"></div>
      </div>

      <!-- Right Form Section -->
      <div class="auth-form-wrapper">
        <div class="auth-card">
          <div class="mobile-brand">
            <MimobizLogo :height="36" />
          </div>

          <div class="auth-header">
            <h2 class="auth-title">Đăng nhập</h2>
            <p class="auth-subtitle">Chào mừng bạn trở lại! Vui lòng nhập thông tin tài khoản.</p>
          </div>

          <div class="form-body">
            <!-- Account Field -->
            <div class="form-group">
              <label class="form-label">Tài khoản / Email</label>
              <div class="input-with-icon">
                <span class="material-symbols-outlined input-prefix-icon">alternate_email</span>
                <base-input
                  ref="account"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  v-model="model.account"
                  :maxLength="100"
                  :rules="[{ name: 'required' }]"
                  @baseKeyup="enterLogin"
                  class="custom-auth-input"
                ></base-input>
              </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <div class="label-row">
                <label class="form-label">Mật khẩu</label>
                <a href="javascript:void(0)" class="forgot-link">Quên mật khẩu?</a>
              </div>
              <div class="input-with-icon password-input-wrap">
                <span class="material-symbols-outlined input-prefix-icon">lock</span>
                <base-input
                  ref="password"
                  placeholder="Nhập mật khẩu của bạn"
                  v-model="model.password"
                  :type="showPassword ? 'text' : 'password'"
                  :maxLength="50"
                  :rules="[{ name: 'required' }]"
                  class="custom-auth-input"
                  @baseKeyup="enterLogin"
                ></base-input>
                <button
                  type="button"
                  class="password-toggle-btn"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                  :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                >
                  <span class="material-symbols-outlined">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="options-row">
              <label class="checkbox-container">
                <input type="checkbox" v-model="keepLoggedIn" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="submit-action">
              <button class="btn-login" @click="login" :disabled="isSubmitting">
                <span v-if="!isSubmitting">ĐĂNG NHẬP</span>
                <span v-else class="loading-state">Đang xác thực...</span>
                <span class="material-symbols-outlined btn-arrow">arrow_forward</span>
              </button>
            </div>
          </div>

          <div class="auth-footer-notes">
            <span>Cần trợ giúp truy cập? </span>
            <a href="mailto:support@mimobiz.com" class="support-link">Liên hệ quản trị viên</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import BaseButton from "@/components/button/BaseButton.vue";
import BaseInput from "@/components/input/BaseInput.vue";
import MimobizLogo from "@/components/common/MimobizLogo.vue";
import { ref, getCurrentInstance, nextTick, reactive } from "vue";
import baseDetail from "../baseDetail";
import commonFn from "@/commons/commonFunction.js";

export default {
  name: "LoginPage",
  extends: baseDetail,
  components: {
    BaseButton,
    BaseInput,
    MimobizLogo,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const model = reactive({
      account: "",
      password: "",
    });
    const showPassword = ref(false);
    const keepLoggedIn = ref(true);
    const isSubmitting = ref(false);

    const login = async () => {
      const me = proxy;
      if (!me.validateComponents()) {
        nextTick(() => {
          me.focusFirstError();
        });
        return;
      }
      isSubmitting.value = true;
      try {
        let res = await proxy.$store.dispatch("moduleContext/login", model);
        if (res && res.statusCode == 200) {
          let data = res.data?.Context;
          let context = proxy.$store.state["moduleContext"];
          if (context.Path && context.To?.meta?.role == data?.role) {
            proxy.$router.push(context.Path);
            proxy.$store.commit("moduleContext/updatePath", "");
          } else {
            proxy.$router.push("admin");
          }
        } else if (res && res.statusCode == 207) {
          proxy.$toast.error(res.userMessage || "Tài khoản không chính xác");
          setTimeout(() => {
            proxy.$refs.account?.$el?.querySelector("input")?.focus();
          }, 100);
        } else if (res && res.statusCode == 208) {
          proxy.$toast.error(res.userMessage || "Mật khẩu không chính xác");
          setTimeout(() => {
            proxy.$refs.password?.$el?.querySelector("input")?.focus();
          }, 100);
        } else if (res && res.statusCode == 209) {
          proxy.$toast.error(res.userMessage || "Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập");
          setTimeout(() => {
            proxy.$refs.password?.$el?.querySelector("input")?.focus();
          }, 100);
        } else {
          proxy.$toast.error(res?.userMessage || "Đã xảy ra lỗi khi đăng nhập");
        }
      } catch (err) {
        proxy.$toast.error("Đã xảy ra lỗi kết nối khi đăng nhập");
      } finally {
        isSubmitting.value = false;
      }
    };

    const enterLogin = (e) => {
      if (e.keyCode == 13) {
        login();
      }
    };

    return {
      model,
      login,
      enterLogin,
      showPassword,
      keepLoggedIn,
      isSubmitting,
    };
  },
};
</script>


<style lang="scss">
@import "./LoginPage.scss";
</style>