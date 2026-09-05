<template>
  <div class="flex flex-column">
    <div class="chosen-image">
      <img
        v-for="(slide, index) in listSlider"
        :src="slide.src"
        :key="index"
        alt=""
        v-show="chosenImageIndex == index"
      />
    </div>
    <div class="slider-chosen flex flex-row">
      <img
        v-for="(slide, index) in listSlider"
        :src="slide.src"
        :class="[index == chosenImageIndex ? 'selected' : '']"
        :key="index"
        alt=""
        @click="chosenImageHandler(index)"
        v-show="calculateDisplayImage.indexOf(index) >= 0"
      />
    </div>
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  getCurrentInstance,
  computed,
  watch,
  reactive,
} from "vue";
export default {
  name: "BaseThumbnailSlider",
  components: {},
  props: {
    listSlider: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const chosenImageIndex = ref(0);
    onMounted(() => {});

    const chosenImageHandler = (index) => {
      chosenImageIndex.value = index;
    };

    const calculateDisplayImage = ref([
      chosenImageIndex.value - 2 >= 0
        ? chosenImageIndex.value - 2
        : props.listSlider.length + chosenImageIndex.value - 2,
      chosenImageIndex.value - 1 >= 0
        ? chosenImageIndex.value - 1
        : props.listSlider.length + chosenImageIndex.value - 1,
      chosenImageIndex.value,
      chosenImageIndex.value + 1 >= props.listSlider.length
        ? chosenImageIndex.value + 1 - props.listSlider.length
        : chosenImageIndex.value + 1,
      chosenImageIndex.value + 2 >= props.listSlider.length
        ? chosenImageIndex.value + 2 - props.listSlider.length
        : chosenImageIndex.value + 2,
    ]);

    watch(
      () => chosenImageIndex.value,
      () => {
        calculateDisplayImage.value = [
          chosenImageIndex.value - 2 >= 0
            ? chosenImageIndex.value - 2
            : props.listSlider.length + chosenImageIndex.value - 2,
          chosenImageIndex.value - 1 >= 0
            ? chosenImageIndex.value - 1
            : props.listSlider.length + chosenImageIndex.value - 1,
          chosenImageIndex.value,
          chosenImageIndex.value + 1 >= props.listSlider.length
            ? chosenImageIndex.value + 1 - props.listSlider.length
            : chosenImageIndex.value + 1,
          chosenImageIndex.value + 2 >= props.listSlider.length
            ? chosenImageIndex.value + 2 - props.listSlider.length
            : chosenImageIndex.value + 2,
        ];
      }
    );
    return {
      chosenImageIndex,
      chosenImageHandler,
      calculateDisplayImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.chosen-image {
  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  margin-bottom: 8px;
}
.slider-chosen {
  padding: 0px 20px;
  img {
    width: 80px;
    height: 70px !important;
    margin-right: 3px;
    border-radius: 5px;
    &.selected {
      border: 2px solid #c20000;
    }
  }
  justify-content: center;
  align-items: center;
}
</style>