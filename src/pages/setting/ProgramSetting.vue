<template>
    <div class="settingMenu ProgramSetting">
      <MyHeader :parentTitle="parentTitle"
                :parentSetting="parentSetting"/>

      <div class="container">
        程序设置
      </div>
    </div>
</template>

<script>
  import MyHeader from '@/components/header'

  export default {
        name: "ProgramSetting",
        components:{MyHeader},
        data(){
          return{
            parentTitle:'程序设置',
            parentSetting:'',
          }
        },
    }
</script>

<style scoped>

</style>
