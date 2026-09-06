<template>
  <div class="mimobiz-logo flex items-center" :style="{ height: `${height}px` }">
    <svg
      :height="height"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-icon"
    >
      <rect width="38" height="38" rx="10" fill="url(#mimo-gradient)" />
      <!-- Stylized M shape -->
      <path
        d="M10 27V12L15.5 20.5L19 15.5L22.5 20.5L28 12V27H24V18.5L20.5 23.5H17.5L14 18.5V27H10Z"
        fill="#FFFFFF"
      />
      <circle cx="28" cy="11" r="3" fill="#38BDF8" />
      <defs>
        <linearGradient id="mimo-gradient" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stop-color="#154EC1" />
          <stop offset="1" stop-color="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
    <div v-if="!iconOnly" class="logo-text ml-2">
      <span class="brand-name" :style="{ color: textColor }">Mimo<span class="brand-accent">biz</span></span>
      <span v-if="showBadge" class="brand-badge">PRO</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  height: {
    type: Number,
    default: 32,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
  textColor: {
    type: String,
    default: '#1E293B',
  },
  showBadge: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.mimobiz-logo {
  display: inline-flex;
  align-items: center;
  user-select: none;

  .logo-icon {
    flex-shrink: 0;
    transition: transform 0.2s ease;
    filter: drop-shadow(0 2px 4px rgba(21, 78, 193, 0.25));
  }

  &:hover .logo-icon {
    transform: scale(1.04);
  }

  .logo-text {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 10px;

    .brand-name {
      font-family: 'Inter', sans-serif;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1;

      .brand-accent {
        color: #154EC1;
      }
    }

    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: rgba(21, 78, 193, 0.1);
      color: #154EC1;
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1.2;
    }
  }
}
</style>
