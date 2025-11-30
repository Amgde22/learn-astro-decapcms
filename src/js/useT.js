import  { computed , ref } from "vue"
import frenchLocales from "@locales/fr/common.json"
import arabicLocales from "@locales/ar/common.json"

export default function useT(defaultKey,lang){
    const currentLang = ref(
        lang ??
        document.documentElement.getAttribute("dir") == "rtl"?"ar":"fr"
        )
    const currentLocale = computed(()=>{
        switch (currentLang.value) {
            case "ar":
                return arabicLocales
                break;
            case "fr":
                return frenchLocales
                break;
            default: 
                return arabicLocales
                break;
        }
    })

    function t(key) {
        const locale = currentLocale.value
        const defaultPath = !!defaultKey?defaultKey.split(".") : ""
        const keyPaths =  key.split(".")
        const paths =  [
            ...defaultPath,
            ...keyPaths
        ]

        const prop = paths.reduce((acc,currentValue)=>{
        if (currentValue == false) return acc 
        if(acc[currentValue] == undefined ){
            console.warn("value in get T is undefined " , {path:paths , value:acc[currentValue] })
        }
        return  acc[currentValue] 

        },locale)

        return prop
    }

    function changeLang(lang) {
        currentLang.value = lang
    }

    return {t,changeLang,currentLang}

}