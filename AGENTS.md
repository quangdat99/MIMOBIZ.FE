# Quy Chuẩn Sub-project: MIMOBIZ.FE (Frontend)

## 1. Công Nghệ & Cấu Trúc Thư Mục

- **Framework**: Vue 3
- **Công cụ xây dựng**: Vite, Rollup / Rolldown, Sass/SCSS
- **Thư viện chính**: Vuex 4 (Quản lý trạng thái), Vue Router 4 (Điều hướng), Axios (HTTP Client), Sass/SCSS, PrimeVue, CKEditor 5, vue-i18n.
- **Cấu trúc source code (`src/`)**:
  - `apis/`: Các module gọi API qua Axios tập trung (`base/`, `components/`, `config/apiconfig.js`).
  - `assets/`: Tài nguyên tĩnh, stylesheets SCSS/CSS dùng chung.
  - `commons/`: Hàm tiện ích dùng chung (format, helper, popup util, auth service).
  - `components/`: Các components UI dùng lại (button, input, gridView, combobox, modal,...).
  - `i18ns/`: Tài nguyên đa ngôn ngữ (`vi/`, `i18n.js`).
  - `routers/`: Cấu hình route điều hướng (`router.js`, `routerAdmin.js`).
  - `store/`: Quản lý Vuex store (`state`, `mutations`, `actions`, `modules`).
  - `views/`: Các màn hình nghiệp vụ (trang quản trị, login, danh mục,...).

---

## 2. Lệnh Thực Thi (CLI Commands)

Thực hiện trong thư mục `MIMOBIZ.FE`:

- **Cài đặt thư viện**:
  ```bash
  npm install
  ```
- **Chạy môi trường phát triển (Dev Server)**:
  ```bash
  npm run dev
  # hoặc: npm run serve
  ```
- **Đóng gói sản phẩm (Production Build)**:
  ```bash
  npm run build
  ```
- **Kiểm tra và sửa lỗi cú pháp (Lint)**:
  ```bash
  npm run lint
  ```

---

## 3. Quy Chuẩn Lập Trình (Vue / Frontend Conventions)

### 3.1. Cấu trúc Single File Component (.vue)
- Tổ chức theo thứ tự chuẩn:
  ```html
  <template>
    <!-- Giao diện HTML -->
  </template>

  <script>
    // Logic Component
  </script>

  <style scoped lang="scss">
    /* CSS/SCSS phạm vi cục bộ */
  </style>
  ```
- Sử dụng thuộc tính `scoped` cho thẻ `<style>` để tránh xung đột CSS toàn cục.

### 3.2. Quản lý trạng thái & Gọi API
- **Gọi API**: Tập trung toàn bộ logic request trong `src/apis/`. Không khởi tạo `axios` trực tiếp trong component.
- **State Management**: Các dữ liệu chia sẻ giữa nhiều component hoặc cần persist phải lưu thông qua Vuex Store (`src/store/`).

### 3.3. Quy ước đặt tên (Naming Conventions)
- **Tên Component**: PascalCase khi import và khai báo (ví dụ: `AppButton`, `GridView`).
- **Tên file Component**: PascalCase (ví dụ: `BaseDetail.vue`, `GridView.vue`).
- **Tên biến & hàm**: camelCase (ví dụ: `fetchDataList`, `isSubmitting`).
- **Hằng số**: UPPER_SNAKE_CASE (ví dụ: `DEFAULT_PAGE_SIZE`).

### 3.4. Đa ngôn ngữ (i18n) & Format
- Tránh hardcode văn bản tiếng Việt trực tiếp trong template nếu component hỗ trợ i18n; khai báo chuỗi trong `src/i18ns/`.
- Sử dụng các tiện ích format ngày tháng, số tiền từ `src/commons/format.js` để đảm bảo định dạng thống nhất.
