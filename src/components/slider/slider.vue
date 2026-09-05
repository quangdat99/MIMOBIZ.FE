<template>
    <div class="slider-container">
        <agile :autoplay="autoplay">
            <slot name="slider-content">
                
            </slot>
            <template #prevButton>
                <div class="icon24 previous">

                </div>
            </template>
            <template #nextButton>
                <div class="icon24 next">

                </div>
            </template>
        </agile>
    </div>
</template>

<script>
export default {
    name: "BaseSlider",
    components: {
    },
    props: {
        autoplay:{
            type: Boolean,
            default: false,
        }
    },
    setup(props) {
        const plugins = [];
        return {
            plugins
        }
    }
}
</script>

<style>
</style>