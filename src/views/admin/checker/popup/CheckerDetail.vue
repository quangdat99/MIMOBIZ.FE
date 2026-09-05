<template>
  <dynamic-popup
    :width="700"
    :height="
      context.role == $ms.constant.Role.Admin &&
      model.role != $ms.constant.Role.Admin
        ? 650
        : 400
    "
    class="checker-detail"
    title="Thông tin nhân viên"
    @beforeOpen="beforeOpen($event, close)"
  >
    <template v-slot:icon="{ close }">
      <div class="button icon24 close" @click="close()"></div>
    </template>
    <template v-slot:content>
      <div class="flex-column h-100 popup-container">
        <div class="flex-row">
          <div class="flex1">
            <div class="profile-img">
              <img src="@/assets/images/profile-checker.png" alt="" />
            </div>
          </div>
          <div class="flex4 ml-2">
            <div class="flex-row">
              <div class="flex1">
                <div class="control-title">
                  <label>checker_code:</label>
                </div>
                <base-input
                  ref="refFocus"
                  title="checker_code"
                  class="mt-1"
                  v-model="model.checker_code"
                  :maxLength="255"
                  :rules="[{ name: 'required' }]"
                  :disabled="viewing"
                ></base-input>
              </div>
              <div class="flex2 ml-2">
                <div class="control-title">
                  <label>checker_name:</label>
                </div>
                <base-input
                  title="checker_name"
                  class="mt-1"
                  v-model="model.checker_name"
                  :maxLength="255"
                  :rules="[{ name: 'required' }]"
                  :disabled="viewing"
                ></base-input>
              </div>
            </div>
            <div class="flex-row mt-2">
              <div class="flex2">
                <div class="control-title">
                  <label>email:</label>
                </div>
                <base-input
                  title="email"
                  class="mt-1"
                  v-model="model.email"
                  :maxLength="255"
                  :rules="[{ name: 'required' }]"
                  :disabled="viewing"
                ></base-input>
              </div>
              <div class="flex1 ml-2">
                <div class="control-title">
                  <label>phone_number:</label>
                </div>
                <base-input
                  title="phone_number"
                  class="mt-1"
                  v-model="model.phone_number"
                  :maxLength="255"
                  :rules="[{ name: 'required' }]"
                  :disabled="viewing"
                ></base-input>
              </div>
            </div>
            <div class="flex-row mt-2">
              <div class="flex-row flex2">
                <div class="flex1">
                  <div class="control-title">
                    <label>Ref_x1:</label>
                  </div>
                  <base-number
                    :min="0"
                    title="ref_x1"
                    :rules="[{ name: 'required' }]"
                    :disabled="viewing"
                    v-model="model.ref_x1"
                    keepZero
                  ></base-number>
                </div>
                <div class="flex1 ml-2">
                  <div class="control-title">
                    <label>Ref_x2:</label>
                  </div>
                  <base-number
                    :min="0"
                    title="ref_x2"
                    :rules="[{ name: 'required' }]"
                    :disabled="viewing"
                    v-model="model.ref_x2"
                    keepZero
                  ></base-number>
                </div>
              </div>
              <div class="flex1 ml-2">
                <div class="control-title">
                  <label>Ref_x3:</label>
                </div>
                <base-number
                  :min="0"
                  title="ref_x3"
                  :rules="[{ name: 'required' }]"
                  :disabled="viewing"
                  v-model="model.ref_x3"
                  keepZero
                ></base-number>
              </div>
            </div>
            <div
              class="flex-row mt-2"
              v-if="context.role == $ms.constant.Role.Admin"
            >
              <div class="flex2">
                <div class="control-title">
                  <label>password:</label>
                </div>
                <base-input
                  title="password"
                  class="mt-1"
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="viewing"
                  v-model="model.password"
                  :maxLength="255"
                  :rules="[{ name: 'required' }]"
                ></base-input>
              </div>
              <div>
                <base-checkbox
                  v-model="showPassword"
                  :disabled="viewing"
                  label="Hiển thị"
                  class="ml-2 mt-7"
                ></base-checkbox>
              </div>
              <div class="flex3 ml-2">
                <div
                  class="flex-row mt-7"
                  v-if="
                    context.role == $ms.constant.Role.Admin &&
                    model.role != $ms.constant.Role.Admin
                  "
                >
                  <base-checkbox
                    v-model="model.is_block"
                    :disabled="viewing"
                    label="Chặn"
                  ></base-checkbox>
                </div>
              </div>
            </div>
            <div
              class="flex-colum mt-4"
              v-if="
                context.role == $ms.constant.Role.Admin &&
                model.role != $ms.constant.Role.Admin
              "
            >
              <h3 class="mt-3 bold">Phân quyền</h3>

              <div class="flex-row mt-4 mb-4 align-center seleted-all">
                <div class="role-name bold">Chọn tất cả</div>
                <base-checkbox
                  class="ml-5"
                  v-model="roleAll.view"
                  :disabled="viewing"
                  label="Xem"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="roleAll.add"
                  :disabled="viewing"
                  label="Thêm"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="roleAll.edit"
                  :disabled="viewing"
                  label="Sửa"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="roleAll.delete"
                  :disabled="viewing"
                  label="Xóa"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="roleAll.export"
                  :disabled="viewing"
                  label="Xuất khẩu"
                ></base-checkbox>
              </div>
              <div
                class="flex-row mt-3 align-center"
                v-for="(role, i) in roleDetail"
                :key="i"
              >
                <div class="role-name">{{ role.name }}:</div>
                <base-checkbox
                  class="ml-5"
                  v-model="role.view"
                  :disabled="viewing"
                  label="Xem"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="role.add"
                  :disabled="viewing"
                  label="Thêm"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="role.edit"
                  :disabled="viewing"
                  label="Sửa"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="role.delete"
                  :disabled="viewing"
                  label="Xóa"
                ></base-checkbox>
                <base-checkbox
                  class="ml-5"
                  v-model="role.export"
                  :disabled="viewing"
                  label="Xuất khẩu"
                ></base-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer="{ close }">
      <div class="h-100 d-flex align-center flex1">
        <div class="flex1 flex-end">
          <base-button
            class="transparent"
            type="secondary"
            text="Hoãn"
            v-if="!viewing && this.editMode != this.$ms.constant.FormState.Add"
            @click="commandClick($ms.constant.Command.PostPone)"
          ></base-button>
          <base-button
            class="ml-4"
            @click="commandClick($ms.constant.Command.SaveView)"
            text="Cất"
            v-if="!viewing"
          ></base-button>
          <base-button
            class="ml-4"
            @click="commandClick($ms.constant.Command.Edit)"
            text="Sửa"
            v-if="viewing && roleEdit"
          ></base-button>
          <base-button
            class="transparent"
            type="secondary"
            text="Đóng"
            @click="close()"
            v-if="viewing"
          ></base-button>
        </div>
      </div>
    </template>
  </dynamic-popup>
</template>
<script>
import {
  ref,
  onMounted,
  watch,
  defineComponent,
  getCurrentInstance,
  reactive,
  nextTick,
  computed,
} from "vue";
import DynamicPopup from "@/components/dynamicPopup/DynamicPopup.vue";
import baseDictionaryDetail from "@/views/baseDictionaryDetail.js";
import checkerAPI from "@/apis/components/checkerAPI";
import { mapGetters } from "vuex";

export default {
  name: "CheckerDetail",
  extends: baseDictionaryDetail,
  components: {
    DynamicPopup,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const showPassword = ref(false);
    const roleDetail = ref([]);
    const roleAll = ref({
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
    });

    const beforeBinding = (data, mode, param) => {
      if (data.role_detail) {
        roleDetail.value = JSON.parse(data.role_detail);
      }
      if (mode == proxy.$ms.constant.FormState.Add) {
        roleDetail.value = [
          {
            key: "checker",
            name: "Nhân viên",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "bookmark_type",
            name: "Loại hồ sơ",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "time_sheet",
            name: "Hồ sơ",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "dossier",
            name: "Dossier",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "customer",
            name: "Customer",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "manufacturer",
            name: "Manufacturer",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
          {
            key: "tai_lieu_goc",
            name: "TaiLieuGoc",
            add: false,
            edit: false,
            delete: false,
            view: true,
            export: true,
          },
        ];
      }
    };

    const beforeSave = () => {
      proxy.model.role_detail = JSON.stringify(roleDetail.value);
    };
    watch(
      () => roleAll.value.add,
      (newVal, oldVal) => {
        roleDetail.value.forEach((x) => (x.add = newVal));
      }
    );
    watch(
      () => roleAll.value.edit,
      (newVal, oldVal) => {
        roleDetail.value.forEach((x) => (x.edit = newVal));
      }
    );
    watch(
      () => roleAll.value.view,
      (newVal, oldVal) => {
        roleDetail.value.forEach((x) => (x.view = newVal));
      }
    );
    watch(
      () => roleAll.value.delete,
      (newVal, oldVal) => {
        roleDetail.value.forEach((x) => (x.delete = newVal));
      }
    );
    watch(
      () => roleAll.value.export,
      (newVal, oldVal) => {
        roleDetail.value.forEach((x) => (x.export = newVal));
      }
    );

    return {
      api: checkerAPI,
      formName: "Nhân viên",
      keyRole: "checker",
      showPassword,
      beforeBinding,
      beforeSave,
      roleDetail,
      roleAll,
    };
  },
  computed: {
    ...mapGetters({
      context: "moduleContext/Context",
    }),
  },
};
</script>
<style lang="scss">
.checker-detail {
  .popup-container {
    padding: 16px;
    overflow: auto;

    .profile-img {
      background-size: contain;
      background-repeat: no-repeat;
      align-items: center;
      display: flex;
      justify-content: center;
      height: 100%;

      img {
        width: 64px;
        height: 64px;

        &.avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px,
            rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px,
            rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px,
            rgba(0, 0, 0, 0.07) 0px 32px 64px;
        }
      }
    }
    .role-name {
      width: 80px;
    }
    .seleted-all span{
      // font-weight: 600 !important;
      color: $primary;
    }
  }
}
</style>