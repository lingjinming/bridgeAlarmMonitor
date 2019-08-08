<template>
    <div class="wrapper Home">
      <header class="header">首页</header>
      <div class="container">
        <div class="alarm-num">
          <ul>
            <li v-for="(item,index) in UntreatedAlarm">
              <span :style="{color:item.color}" v-cloak>{{item.alarmNo}}</span>
              <p v-cloak>{{item.state}}</p>
            </li>
          </ul>
          <div class="bj-trend">
            <h3 class="bar-title">报警趋势图</h3>
            <div id="bjTrend"></div>
          </div>
          <div class="alarm-box">
            <div class="alarm-left-box">
              <h3 class="bar-title">报警处置比例</h3>
              <div id="alarm-dispose"></div>
            </div>
            <div class="alarm-right-box">
              <h3 class="bar-title">报警数量排行</h3>
              <ul>
                <li class="clearfix" v-for="(item,index) in alarmTopFive">
                  <div class="left">{{item.bridgeName}}</div>
                  <div class="num-bar" :style="{'background':bgColor[index],'width':Wid[index]}"></div>
                  <div class="right">{{item.alarmSum}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import Bus from '../common/js/bus'
  import echarts from 'echarts'

  export default {
        name: "Home",
        data(){
            return{
              monthAlarm: 0,
              undisposeAlarm: 0,
              inAlarm: 0,
              alarmMonth: [],
              alarmMonthData: [],
              alarmTopFive: [],
              alarmState: [],
              alarmSum: [],
              maxNum: 0,
              Wid: [],
              UntreatedAlarm:[],
              colors:['#00baff', '#ff89b5', '#ffae00', '#00d7b1'],
              bgColor: ["#0eabf6", "#24b8ff", "#3bc0ff", "#5fcbff", "#8ddaff"]
            }
        },
    created: function() {
      let _this = this
      _this.getAlarmNums();
      _this.AlarmTopFive();
      _this.alarmTrendChart();
      _this.alarmDispose();
      Bus.$on('changeCareFromBrother',function () {
        _this.getAlarmNums();
        _this.AlarmTopFive();
        _this.alarmTrendChart();
        _this.alarmDispose();
      })
      window.onresize = function () {
        alarmTrend.resize()
      }
    },
        methods: {
          getAlarmNums(){
            let _this =this
            _this.$axios({
              method: 'post',
              url: 'getUntreatedAlarm.mvc',
              params: {
                'userId': this.$store.getters.getUserId,
                'date': this.common.getLastYear2(0)
              }
            })
              .then((res) => {
              let tempUntreatedAlarm = res.data.data;
              tempUntreatedAlarm.forEach(function (item) {

                if(item.state == "本月报警"){
                  item.level = 1
                  item.color = 'red'
                }else if(item.state == "未处置"){
                  item.level = 3
                  item.color = _this.colors[1]
                }else if(item.state == "待反馈"){
                  item.level = 2
                  item.color = _this.colors[0]
                }else {
                  item.level = 4
                  item.color = _this.colors[2]
                }

              })
              tempUntreatedAlarm.sort(function (a,b) {
                return a.level - b.level
              })

              _this.UntreatedAlarm = tempUntreatedAlarm

              console.log(_this.UntreatedAlarm)

            })
              .catch((err) => {
              console.log('error', err)
            })
          },
          AlarmTopFive: function() {
            this.$axios({
              url: 'getAlarmTopFive.mvc',
              method: 'post',
              params: {
                  date: this.common.getLastYear2(0),
                'unitType':this.common.getUnitType()

              }
            }).then((res)=>{
              this.alarmTopFive = res.data.data;
              this.maxNum = this.alarmTopFive[0].alarmSum;
                let barWid = 90;
                let b = barWid / this.maxNum;
                for (let i = 0; i < res.data.data.length; i++) {
                  this.Wid.push(this.alarmTopFive[i].alarmSum * b / barWid * 100 + '%');
              }
            });
          },
          alarmTrendChart:function() {
            let that = this;
            that.$axios({
                url: 'getAlarmTrendChart.mvc',
                method: 'post',
                params: {
                  'userId': this.$store.getters.getUserId,
                  'date': this.common.getLastYear2(0),
                  'unitType':this.common.getUnitType()

                }
              }).then((res)=>{
                let msg = res.data.data[0];
                // console.log(msg)
                that.alarmMonth = msg.theMonth;
                that.alarmMonthData = msg.alarmNo;
                alarmTrendOption();
              }).catch((err) => {
                console.log(err)
              })

              function alarmTrendOption() {
                let alarmTrend = echarts.init(document.getElementById('bjTrend'));
                alarmTrend.setOption({
                  grid: {
                    bottom: "40",
                    top: "10",
                    left: '10%',
                    right: '8%'

                  },
                  xAxis: [{
                    axisLine: { //x轴的深色轴线，如图2
                      show: true,
                      lineStyle: {
                        color: "#888"
                      }
                    },
                    axisLabel: {
                      interval: 0,
                      rotate: 40,
                      textStyle: {
                        fontSize: '10'
                      }
                    },
                    splitLine: {
                      show: true,
                      lineStyle: {
                        type: 'dashed',
                        color: ['#ccc']
                      }
                    },
                    type: 'category',
                    data: that.alarmMonth
                  }],
                  yAxis: [{
                    axisLine: { //x轴的深色轴线，如图2
                      show: true,
                      lineStyle: {
                        color: "#888"
                      }
                    },
                    axisLabel: {
                      textStyle: {
                        fontSize: '10'
                      }
                    },
                    splitLine: {
                      show: true,
                      lineStyle: {
                        type: 'dashed',
                        color: ['#ccc']
                      }
                    },
                    type: 'value'
                  }],
                  series: [{
                    data: that.alarmMonthData,
                    type: 'line',
                    symbolSize: 6,
                    itemStyle: {
                      normal: {
                        color: '#ff5f6b',
                        lineStyle: {
                          color: '#ff5f6b'
                        }
                      }
                    }
                  }]
                });
              }
            },
          alarmDispose:function() {
              var that = this
              that.$axios({
                url: 'getAlarmRatio.mvc',
                method: 'post',
                params: {
                  'userId': this.$store.getters.getUserId,
                  'date': this.common.getLastYear2(0),
                  'unitType':this.common.getUnitType()
                }
              }).then((res)=>{
                console.log(res)
                that.alarmState = res.data.data[0].alarmState;
                that.alarmSum = res.data.data[0].alarmSum;
                libiAlarmTrend();
              });
            function libiAlarmTrend() {
              // let i = 0;
              // let colors = ['#00baff', '#ff5f6b', '#10bc69', '#ffb32e'];
              let alarmDispose = echarts.init(document.getElementById("alarm-dispose"));
              alarmDispose.setOption({
                color:that.colors,
                legend: {
                  orient: 'horizontal',
                  icon: 'circle',
                  x: 'center',
                  bottom: 10,
                  itemWidth: 6,
                  itemHeight: 6,
                  textStyle: {
                    fontSize: 10
                  },
                  data: that.alarmState
                },
                series: [{
                  name: '访问来源',
                  type: 'pie',
                  radius: ['28%', '45%'],
                  center: ['47%', '40%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                        formatter: '{d}%',
                        fontSize: 10
                    },
                  },
                  labelLine: {
                    normal: {
                      show: false,
                      length: -8,
                    }
                  },
                  data: [{
                    value: that.alarmSum[0],
                    name: that.alarmState[0]
                  }, {
                    value: that.alarmSum[1],
                    name: that.alarmState[1]
                  }, {
                    value: that.alarmSum[2],
                    name: that.alarmState[2]
                  }, {
                    value: that.alarmSum[3],
                    name: that.alarmState[3]
                  }]
                }]
              });
              window.onresize = function () {
                alarmDispose.resize()
              }
            }

            }
        },

    }
</script>

<style scoped lang="scss">
  .alarm-num {
    box-sizing: border-box;
    height: 100%;
    padding-top: .2rem;
    &>ul {
      margin-bottom: .2rem;
      display: flex;
      background: #fff;
      li {
        height: 1.5rem;
        flex: 1;
        text-align: center;
        border-right: #dfdfdf .02rem solid;
        display: flex;
        flex-direction: column;
        &:last-child {
          border: 0
        }
        span {
          font-size: .56rem;
          padding-top: .14rem;
          font-weight: 500;
        }
        p {
          color: #333;
          font-size: .2rem;
        }
      }
    }
  }
  .alarm-box {
    height: 4.7rem;
    box-sizing: border-box;
    background: #fff;
    &>div {
      width: 50%;
      float: left;
      height: 100%;
    }
  }
  .bar-title {
    position: relative;
    font-size: .24rem;
    color: #383838;
    height: .8rem;
    line-height: .8rem;
    text-align: left;
    padding-left: .4rem;
    &:before{
      content: '';
      position: absolute;
      left: .2rem;
      top: .26rem;
      width: .08rem;
      height: .26rem;
      background: #27a1f8;
      border-radius: .03rem;
    }
  }
  .alarm-right-box ul {
    padding-top: .2rem;
    flex-direction: column;
    li {
      clear: both;
      box-sizing: content-box;
      display: flex;
      min-height: .55rem;
    }
    .left {
      width: 1.4rem;
      font-size: .18rem;
      color: #333;
      text-align: right;
    }
    .right {
      float: left;
      font-size: .2rem;
    }
  }
  .num-bar {
    height: .2rem;
    width: calc(100% - 2rem);
    margin: .05rem .1rem;
    max-width: calc(100% - 2rem);
    animation: changeWidth 1s linear;
  }
  @keyframes changeWidth {
    from{
      width: 0;
    }
  }
  .alarm-dispose > div{
    height: 3.4rem;
  }
  .bj-trend{
    background: #fff;
    margin-bottom: .2rem;
  }
  #bjTrend{
    height: 3rem;
  }
  #alarm-dispose{
    height: calc(100% - .8rem);
  }
</style>
