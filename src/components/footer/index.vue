<template>
  <footer class="my-footer">
    <router-link to="/home">
      <i class="icon iconfont icon-shouye"></i>首页
    </router-link>
    <router-link to="/alarmMonitor">
      <i class="icon iconfont icon-baojing1"></i>监测报警</router-link>
    <router-link to="/report">
      <i class="icon iconfont icon-baogao"></i>评估报告</router-link>
    <router-link to="/setting">
      <i class="icon iconfont icon-shezhi1"></i>系统设置</router-link>
    <!--<router-link :to="{name:'Setting'}">系统设置</router-link>-->
  </footer>
</template>

<script>
    export default {
      name: "my-footer"
    }
</script>

<style scoped lang="less" rel="stylesheet/scss">
  .my-footer{
    position: absolute;
    bottom: 0;
    height: 1.14rem;
    width: 100vw;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #e8e8e8;
    background: #fff;
    a{
      font-size: .22rem;
      flex: 1;
      color: #333;
      text-align: center;
    }
    a.router-link-active{
      i{
        color: #27a1f8;
      }
    }
    i{
      display: block;
      height: .65rem;
      line-height: .65rem;
      color: #666;
    }
  }
</style>
