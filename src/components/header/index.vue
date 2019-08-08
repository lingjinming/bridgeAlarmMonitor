<template>
    <div class="header">
      <div class="back" @click="goBack">
        <x-icon type="ios-arrow-left" class="icon-white"></x-icon>
      </div>
      <h1 class="title">{{parentTitle}}</h1>
      <span v-if="parentSetting" class="setting" @click="goToSettingConcern">{{parentSetting}}</span>
    </div>
</template>

<script>
    export default {
      name: "MyHeader",
      props:{
        parentTitle:String,
        parentSetting:{
          type:String,
          default:''
        },
      },
      methods:{
        goBack(){
          this.$router.go(-1)
        },
        goToSettingConcern(){
          this.$router.push({
            name:'SettingConcern'
          })

        }
      }
    }
</script>

<style lang="scss">
  .header {
    width: 100%;
    .back{
      position: absolute;
      width: .86rem;
      height: .86rem;
      line-height: .86rem;
      left: 0;
      z-index: 222;
      background: none;
      padding-left: 0;
      .icon-white{
        fill: #fff;
        width: 100%;
        height: .6rem;
        top: .15rem;
        position: relative;
      }
    }
    .title {
      text-align: center;
      font-size: .32rem;
      color: #fff;
      height: .86rem;
      line-height: .86rem;
      z-index: 111;
    }
    .setting {
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      z-index: 2222222;
      font-size: .32rem;
      width: 1rem;
      height: 1rem;
    }
  }




</style>
