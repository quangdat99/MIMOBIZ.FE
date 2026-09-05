<template>
    <div class="base-multi-button ">
        <div class=" flex-row">
            <base-button  v-for="(button, index) in listButtons" :key="index" :text="button.text"
                customClass=" primary" @click="onClickButton(index)" :class="['button-element',index == selectedButtonIndex ? 'selected' : '']">
            </base-button>
        </div>

    </div>
</template>

<script>
import {ref} from 'vue';
import BaseButton from './BaseButton';
export default {
    name: 'BaseMultiButton',
    components: {
        BaseButton
    },
    props: {
        listButtons: {
            type: Object,
            default: null
        }
    },
    emits: ['clickButton'],
    setup(props,{emit}) {
        const selectedButtonIndex = ref(0);
        const onClickButton = (index) =>{
            selectedButtonIndex.value = index;
            emit('clickButton',props.listButtons[index]);
        }
        return{
            selectedButtonIndex,
            onClickButton
        }
    }
}
</script>

<style lang="scss" scoped>
.button-element {
    padding: 5px 15px !important;
    margin-right: 5px;
    &.selected{
        color: #fff !important;
        background-color: #c20000 !important;
    }
}
.button-element:last-child{
    margin-right: 0px;
}

</style>