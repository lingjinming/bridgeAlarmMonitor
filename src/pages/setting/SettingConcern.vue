<template>
    <div class="SettingConcern">
      <MyHeader :parentTitle="parentTitle"
                :parentSetting="parentSetting"/>
      <SearchConcern />
      <ConcernList />
     </div>
</template>

<script>
  import MyHeader from '@/components/header'
  import ConcernList from './concernList'
  import SearchConcern from './SearchConcern'

  export default {
        name: "SettingConcern",
        components:{MyHeader,SearchConcern,ConcernList},
        data(){
          return{
            parentTitle:'设置',
            parentSetting:''
          }
        }
    }
</script>

<style scoped>
.SettingConcern{
  background: #fff;
  height: calc(100vh - 1.14rem);
  text-align: left;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
