<template>
        <h1 class="title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 6H4V4h16zm-4.31 8H14v1.69c-.63.95-1 2.08-1 3.31c0 .34.04.67.09 1H4v-6H3v-2l1-5h16l1 5v1.35c-.63-.22-1.3-.35-2-.35c-1.23 0-2.36.37-3.31 1M12 14H6v4h6zm9.34 1.84l-3.59 3.59l-1.59-1.59L15 19l2.75 3l4.75-4.75z" />
            </svg>
            Nos Produits :</h1>

        <SelectNav :items="tags" select-all-label="tout"
        @select="e => {selectedTag = e}" />

    <section :class="[
        'product-section',
        {
            isSection:isSection == true
        }
        ]">
        

        

        <ProductCard v-for="product in displayedProduct"
            :key="product.id"
            :product="product"
            :product-images="productImages[product.id]"
        />


    </section>
</template>

<script setup>
    import ProductCard from "@components/ProductCard.vue"
    import {computed,ref,toValue} from "vue"
    import SelectNav from "./SelectNav.vue";


    const props = defineProps({
        isSection:{
            type:Boolean,
            default:false
        },
        products:{
            type:Array,
            required:true
        },
        productImages:{
            type:Object
        }
    })

    const tags = getAllTags()
    const selectedTag = ref("")

    // computed
    const filteredProducts = computed(()=>{
        const Tag = toValue(selectedTag)
        // get all products if not tag is selected
        if ( Tag == "")  return props.products
        // else filter by taf
        const filtered = props.products.filter(entry => entry.data.tags && entry.data.tags.includes(Tag))
        console.log(filtered);
        return filtered
    })

    const displayedProduct = computed(()=>{
        // if not a section then display ALL products
        const products = toValue(filteredProducts) ?? []

        if (props.isSection == false) return products

        const breakPoint1 = 550
        const breakPoint2 = 800
        const screenWidth = window.innerWidth


        // less than 550px
        if (screenWidth <= breakPoint1) {
            return products.slice(0, 6);
        }
        // less than 800px
        else if(screenWidth <= breakPoint2){
            // display the first r on pc
            return products.slice(0, 8);
        }
        // more than 800px
        else{
            return products.slice(0, 12);

        }
    })



function getAllTags() {
const products = props.products
  const tagSet = new Set()

  products.forEach((product) => {
    const productTags = product.data.tags 
    if (productTags && Array.isArray(productTags)) {
      productTags.forEach((tag) => tagSet.add(tag))
    }
  })

  return Array.from(tagSet)
}
</script>

<style lang="less" scoped>
.title {
    font-size: 28px;
    margin-left: min(5vw,32px);
    margin-top: 2em;

    display: flex;
    align-items: center;
    gap: 8px;
}
.product-section{
    padding: 16px 20px;
    min-height:500px;

    display: grid;
    gap: 16px;
    justify-content: center;
    align-items: start;
    grid-template-columns: repeat( auto-fit, minmax(250px, 350px));

    
    
}
</style>