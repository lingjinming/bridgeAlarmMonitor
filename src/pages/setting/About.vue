<template>
    <div class="settingMenu about">
      <MyHeader :parentTitle="parentTitle"
                :parentSetting="parentSetting"/>
      <div class="container">
        <p>版本号{{version}}</p>
        <!--<p>加入权限</p>-->
      </div>
    </div>
</template>

<script>
  import MyHeader from '@/components/header'

  export default {
        name: "About",
        components:{MyHeader},
        data(){
          return{
            parentTitle:'关于',
            parentSetting:'',
            version:'V-0.2.3'
          }
        },
        mounted(){
          console.log(process.env)
          this.version = require('../../../package.json').version
        }
    }
</script>

<style scoped>
  .container{
    text-align: center;
    padding: 50px;
  }

</style>
