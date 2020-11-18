<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { close } from 'fs';
export default {
  name: 'App',
  mounted(){
        this.$axios({
          url:'getUserInfo.mvc',
          method:'post',
          params:{
            // loginName: window.localStorage.loginId ,
            loginName: 'szyw'
            // loginName: 'szld'
          }
        })
        .then((res)=>{
          if(res.data.data){
            let {role,roleId,userId,userName} = {...res.data.data}
            this.$store.commit('changeRole',role)
            this.$store.commit('changeRoleId',userId)
            this.$store.commit('changeRoleName',userName)
          }
          // else{
          //   // debugger
          //   // console.log(location.protocol + '// '+location.host + '/#/home')
          //   location.href ='file:///android_asset/www/index.html#/login'
            
          // }
        })
        .catch((err)=>{
          console.log(err)
        })
    }
}
</script>
<style lang="less">
  @import 'assets/css/style.css';
</style>
<style lang="less">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html{
    /*font-size: 13.333333vw;*/
    font-size: 13.89vw;
  }
  @media screen and (min-width:560px){
    html{
      font-size: 54px;
    }
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    width: 100vw;
    background: #f1efef;
  }
  a{
    text-decoration: none;
  }
  li{
    list-style: none;
  }
  .router-link-exact-active{

  }
  .router-link-active{
    color: #27a1f8 !important;
  }
  .header{
    height: .86rem;
    line-height: .86rem;
    width: 100vw;
    text-align: center;
    font-size: .34rem;
    background: #27a1f8;
    color: #ffffff;
  }
  .wrapper{
    height: calc(100% - 1.14rem);
    position: relative;
  }
  .container{
    height: calc(100% - .86rem);
    overflow-y: auto;
    background: #efefef;
  }
  body{
    font-size: .32rem;
  }
  /* 开始过渡阶段,动画出去阶段 */
  .moveToLeft-enter-active,.moveToLeft-leave-active{
    transition: all .5s ease-out;
  }
  /* 进入开始 */
  .moveToLeft-enter{
    transform: translateX(100%);
  }
  /* 出去终点 */
  .moveToLeft-leave-active{
    transform: translateX(100%);
  }
.absolute_wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100%);
  overflow: hidden;
  background: #ffffff;
}
  .weui-toast{
    z-index: 99999999999 !important;
  }
  .weui-cells{
    font-size: .32rem !important;
    margin-top: 0 !important;
  }
  .weui-label{
    width: 1.5rem !important;
  }
  .dp-header{
    border-top: .01rem solid whitesmoke;
  }
  .defaultType{
    background: #fff;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    border-bottom: 1px solid #efefef;
    :last-child{
      border: none;
    }
  }
  .fileUploadDiv{
    position: relative;
    min-height: .8rem;
    padding-top: .25rem;
    &:before{
      content: " ";
      position: absolute;
      top: 0;
      right: 15px;
      height: 1px;
      border-top: 1px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      left: 15px;
    }
    label{
      position: absolute;
      width: 100%;
      height: .8rem;
      line-height: .8rem;
      padding-left: 15px;
      z-index: 222;
    }
    a{
    position: relative;
    max-width: 3.5rem;
    left: 2rem;
    height: .4rem;
    line-height: .4rem;
    font-size: .2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-indent: .5rem;
    border: 1px solid #00a2ff;
    border-radius: .1rem;
    color: #333;
    display: block;
    margin-bottom: .25rem;
      &:before{
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        height: .4rem;
        width: .4rem;
        float: left;
        background:#27a1f8 url(./assets/image/fujian.png) center no-repeat;
        background-size: .24rem;
      }
    }
    p{
      position: absolute;
      max-width: 3.5rem;
      top: 50%;
      transform: translateY(-50%);
      left: 2rem;
      height: .4rem;
      line-height: .4rem;
    }
    i{
      font-size: .4rem;
      color: #00a2ff;
    }
  }
  #fileUpload{
    display: none;
  }
  .weui-textarea {
    border: 1px solid rgba(200,200,200,.2) !important;
    border-radius: .1rem !important;
    color: #333 !important;
  }
  .weui-cell{
    padding: 20px 15px!important;
  }
  .weui-cell:before{
    right: 15px !important;
  }
  .weui-cells:after{
    left: 15px !important;
    right: 15px !important;
  }
  .normalFs,.weui-label,.parentResultTit,.fileUploadDiv label,.vux-datetime>div>p{
    font-size: .3rem !important;
    font-weight: 300 !important;
    color: #333 !important;
  }
  .vux-cell-value {
    font-size: .28rem !important;
  }
  .showImgBox .weui-dialog{
    width: 80% !important;
    max-width: 80% !important;
  }
  .img-box{
    height: 0;
  }

  .labelForCamera,.labelForFile{
    position: relative !important;
    width: 1.5rem !important;
    left: 20%;
    text-align: center;
    display: inline-block;
}
.labelForFile{
  left: calc(.5rem + 20%);
}
</style>
