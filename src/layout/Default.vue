<template>
    <div class="page_default">
      <!--<keep-alive>-->
        <!--<router-view></router-view>-->
      <!--</keep-alive>-->
        <router-view></router-view>
      <my-footer/>
    </div>
</template>

<script>
  import myFooter from '@/components/footer/index'

    export default {
      name: "default",
      components:{
        myFooter
      },
      watch: {
        // 监听路由跳转。
        $route(to, from) {
          // console.log('watch', 'to.name'+to.name, "from.name"+from.name)
          if (to.name == 'AlarmMonitor' && from.name == 'AlarmDetail'){
            this.$bus.emit('refresh')
            // console.log('AlarmMonitorrefresh')
          }
        },
      },
    }
</script>

<style scoped>
  .page_default{
    height: 100%;
  }
</style>
