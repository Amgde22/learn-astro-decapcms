<template>
    <div class="container custom-scrollbar">
        <button
         class="item"
         :class="{selected:selectedItem == '' }"
         @click="selectItem('')"
         >
            {{ t(selectAllLabel) }}
        </button>

        <button
        v-for="item in items"
         class="item"
         :class="{selected:selectedItem == item }"

         @click="selectItem(item)"
         >
            {{ t(item) }}
        </button>
    </div>
</template>

<script setup>
import {ref} from "vue"
import useT from "@js/useT"

const {t} = useT("products.tags")
const emit = defineEmits(["select"])
const props = defineProps({
    items:Array,
    selectAllLabel:{
        type:String,
        default:"All"
    }
})

const selectedItem = ref("")
function selectItem(item) {

    selectedItem.value = item
    emit("select",item)
}
</script>

<style lang="less" scoped>
.container{
    width: 100%;
    overflow-x: scroll;
    margin: 0;
    margin-top: 16px;
    padding-bottom: 20px;
    display: flex;
    gap: 8px;

    padding-inline-start: 16px;
    padding-inline-start: min(5vw,32px);

    & .item{
        flex:0 0 auto;
    }
    


}

.item{
    --color : var(--primary) ;
    --border-color:rgb(170, 170, 170);
    box-sizing: border-box;
    border: none;
    font-size: 1.1em;
    text-transform: capitalize;
    padding: 0.2em 1.25em;
    border-radius: 100vw;

    background-color: white;
    color: black;

    &:not(.selected){
        border: 1px solid var(--border-color);

    }

    &.selected{

    background-color: var(--color);
    color: white;
    }
}
/* ==========================================================================
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

   @media only screen and (min-width: 0rem) {
        body.dark-mode {

        .container{
         /* Track styling */

        .item{
            --color : var(--medium) ;
            --border-color:rgb(114, 114, 114);
        }
    }
}}

</style>