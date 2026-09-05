<template>
  <li :class="['menu-wrapper-item', icon ? 'flex menu-wrapper-item-icon' : '',
                {'menu-border' : separatorBottom},
                {'disabled-item' : disabledItem},
  ]"
    role="menuItem"
    tabindex="-1"
    @click="emitClick"
    @keyup.enter="emitClick"
    @keyup.space="emitClick"
  >
    <template v-if="icon">
        <div :class="['menu-item-ic', icon]">

        </div>
        <div class="menu-item-content">
            <slot></slot>
        </div>
    </template>
    <slot v-else></slot>
  </li>
</template>

<script>
export default {
    props: {
        icon:{
            type: [Array, String],
            default: null
        },
        separatorBottom:{
            type: Boolean,
            default:false
        },
        disabledItem:{
            type: Boolean,
            default: null
        }
    },
    emits: [
        'menu-item-click'
    ],
    setup(props, {emit}){
        function emitClick(){
            emit('menu-item-click')
        }
    }
}
</script>

<style lang="scss">
@import './MenuItem.scss';
</style>