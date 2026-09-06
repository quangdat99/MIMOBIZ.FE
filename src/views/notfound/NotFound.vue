<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <div class="error-code">404</div>
      <div class="icon-wrapper">
        <span class="material-symbols-outlined">explore_off</span>
      </div>
      <h1 class="error-title">Không tìm thấy trang</h1>
      <p class="error-desc">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
      </p>
      <router-link to="/thaco/timesheet" class="back-home-btn">
        <span class="material-symbols-outlined">arrow_back</span>
        <span>Quay về trang chủ</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage",
};
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: var(--va-background-primary, #f4f6f8);

  .not-found-card {
    text-align: center;
    max-width: 480px;
    width: 100%;
    background: var(--va-background-secondary, #ffffff);
    border-radius: var(--va-radius-lg, 16px);
    border: 1px solid var(--va-background-border, #e2e8f0);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
    padding: 48px 32px;

    @media (max-width: 640px) {
      padding: 32px 20px;
    }

    .error-code {
      font-size: 80px;
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(135deg, var(--va-primary, #154ec1) 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
      letter-spacing: -2px;

      @media (max-width: 640px) {
        font-size: 64px;
      }
    }

    .icon-wrapper {
      margin-bottom: 16px;
      .material-symbols-outlined {
        font-size: 48px;
        color: #94a3b8;
      }
    }

    .error-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--va-text-primary, #1e293b);
      margin: 0 0 10px;
    }

    .error-desc {
      font-size: 14px;
      color: var(--va-text-secondary, #64748b);
      line-height: 1.6;
      margin: 0 0 28px;
    }

    .back-home-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 42px;
      padding: 0 24px;
      background: var(--va-primary, #154ec1);
      color: #ffffff;
      border-radius: var(--va-radius, 8px);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(21, 78, 193, 0.25);

      &:hover {
        background: #0e3d9e;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(21, 78, 193, 0.35);
      }

      .material-symbols-outlined {
        font-size: 18px;
      }
    }
  }
}
</style>