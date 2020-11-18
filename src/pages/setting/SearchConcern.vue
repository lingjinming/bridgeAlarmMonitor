<template>
    <div class="SearchConcern">
      <search
        @on-change="getResult"
        v-model="value"
        top=".86rem"
      />
    </div>
</template>

<script>
  import Bus from  '../common/js/bus'

  export default {
        name: "SearchConcern",
        data(){
          return{
            value:null
          }
        },
      methods:{
        getResult(val){
          Bus.$emit('searchConcern',val)
        }
      }
    }
</script>

<style lang="less">
</style>
