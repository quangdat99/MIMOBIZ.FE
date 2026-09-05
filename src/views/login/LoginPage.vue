<template>
  <div class="login-page">
    <div class="login-container flex flex-row">
      <div class="login-content-left w-100">
        <div class="login-content-left-title">Đăng nhập</div>
        <div class="login-field-container flex flex-column">
          <div class="login-field-label">Tài khoản</div>
          <div class="login-field-input">
            <base-input
              ref="account"
              placeholder="Nhập email hoặc số điện thoại"
              v-model="model.account"
              :maxLength="100"
              :rules="[{ name: 'required' }]"
            ></base-input>
          </div>
        </div>
        <div class="login-field-container flex flex-column">
          <div class="login-field-label">Mật khẩu</div>
          <div class="login-field-input flex-row">
            <base-input
              ref="password"
              placeholder="Mật khẩu"
              v-model="model.password"
              :type="showPassword ? 'text' : 'password'"
              :maxLength="50"
              :rules="[{ name: 'required' }]"
              class="flex"
              @baseKeyup="enterLogin"
            ></base-input>
            <base-checkbox
              v-model="showPassword"
              label="Hiển thị"
              class="ml-2"
            ></base-checkbox>
          </div>
        </div>
        <div class="login-button d-flex align-center">
          <base-button
            text="ĐĂNG NHẬP"
            customClass="white btn-padding w-100"
            @click="login"
          >
          </base-button>
          <div class="forgot-password flex flex-end color-red">
            Quên mật khẩu?
          </div>
        </div>
      </div>
      <!-- <div class="login-content-right w-40 flex flex-center flex-column">
        <div class="logo-container flex-column flex-center">
          <a href="/">
            <div class="logo"></div>
          </a>
          <div class="welcome-text">Chào mừng bạn đến với Mimobiz</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/button/BaseButton.vue";
import BaseInput from "@/components/input/BaseInput.vue";
import { ref, getCurrentInstance, nextTick, reactive } from "vue";
import baseDetail from "../baseDetail";
import commonFn from "@/commons/commonFunction.js";
export default {
  name: "LoginPage",
  extends: baseDetail,
  components: {
    BaseButton,
    BaseInput,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const model = reactive({});
    const showPassword = ref(false);

    const login = async () => {
      const me = proxy;
      if (!me.validateComponents()) {
        nextTick(() => {
          me.focusFirstError();
        });
        return;
      }
      // commonFn.mask();
      if (proxy.model) {
        let res = await proxy.$store.dispatch("moduleContext/login", model);
        if (res.statusCode == 200) {
          let data = res.data.Context;
          let context = proxy.$store.state["moduleContext"];
          if (context.Path && context.To?.meta?.role == data.role) {
            proxy.$router.push(context.Path);
            proxy.$store.commit("moduleContext/updatePath", "");
          } else {
            proxy.$router.push("admin");
          }
        } else if (res.statusCode == 207) {
          proxy.$toast.error(res.userMessage);
          setTimeout(() => {
            proxy.$refs.account.$el.querySelector("input").focus();
          }, 100);
        } else if (res.statusCode == 208) {
          proxy.$toast.error(res.userMessage);
          setTimeout(() => {
            proxy.$refs.password.$el.querySelector("input").focus();
          }, 100);
        } else if (res.statusCode == 209) {
          proxy.$toast.error(res.userMessage);
          setTimeout(() => {
            proxy.$refs.password.$el.querySelector("input").focus();
          }, 100);
        } else {
          proxy.$toast.error(`Đã xảy ra lỗi`);
        }
      }
      // commonFn.unmask();
    };

    const enterLogin = (e, value) => {
      {
        if (e.keyCode == 13) {
          login();
        }
      }
    };
    return {
      model,
      login,
      enterLogin,
      showPassword,
    };
  },
};
</script>

<style lang="scss">
@import "./LoginPage.scss";
</style>