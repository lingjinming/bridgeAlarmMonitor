<template>
    <div class="absolute_wrapper alarmData">
      <MyHeader :parentTitle="parentTitle"/>
      <div>
        <tab :line-width=2 active-color='rgb(0, 162, 255)' v-model="index"
        >
          <tab-item class="vux-center"
                    @touchstart.native="alarmData(index)"
                    :selected="demo2 === item"
                    v-for="(item, index) in list"
                    :key="index">{{item}}</tab-item>
        </tab>
        <swiper v-model="index" height="7rem" :show-dots="false" :threshold=10000 :min-moving-distance=10000>
          <swiper-item v-for="(item, index) in list" :key="index">
            <div class="tab-swiper vux-center" v-if="index == 0">
              <div  id="alarm-data" style="height: 6rem;">
                <p class="nodata" v-show="haveData">暂无数据</p>
              </div>
            </div>
            <div class="tab-swiper vux-center" v-else-if="index == 1">
              <div class="alarm-data" id="cur-data" style="height: 6rem;">
                <p class="nodata" v-show="haveData">暂无数据</p>
              </div>
            </div>
            <div class="tab-swiper vux-center" v-else>
              <div style="text-align: right;margin-top: 5px;">
                <button :class="{'on':tBut==0}" @click="hoursChange(0)">1个小时</button>
                <button :class="{'on':tBut==1}" @click="hoursChange(1)">24个小时</button>
              </div>
              <p class="nodata" v-show="haveData">暂无数据</p>
              <div v-show="tBut==0">
                <div id="history-data0" style="height: 4.5rem;"></div>
              </div>
              <div v-show="tBut==1">
                <div id="history-data1" style="height: 4.5rem;"></div>
              </div>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
</template>

<script>
  import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import MyHeader from '@/components/header'
  import Storage from '../common/js/storage'
  import echarts from 'echarts'

  export default {
    name: "AlarmData",
    components:{
      Tab,
      MyHeader,
      TabItem,
      Swiper,
      SwiperItem
    },
    data(){
        return{
          parentTitle:'数据查看',
          parentSetting:'',
          list:['报警数据', '当前数据', '历史数据'],
          index:0,
          demo2:'报警数据',
          crurenTime:new Date(),
          startTime:'',
          endTime:'',
          curID:0,
          tBut:0,
          haveData:false,
          curDataTime:[],
          curDataVal:[],
          historyStartTime:'',
          xhistoryTime:[],
          yhistoryData:[],
          monitorTime:Storage.get('monitorTime'),
        }
    },
    created(){
      this.alarmData(0)
    },
    methods:{
      alarmDataTrend(obj,yarr,thdata,thrCode, maxVal, minVal) {

        console.log(obj)
        console.log(yarr)
        console.log(thdata)
        //用于保存历史数据和动态阈值的数据信息
        var monitor_echart = echarts.init(document.getElementById(obj));
        // var option = {
        //   tooltip: {
        //     trigger: 'axis',
        //     // 设置字体的样式，显 示点击点位的信息
        //     textStyle: {
        //       fontFamily: 'Microsoft YaHei',
        //       fontSize: 12
        //     },
        //     position (point, params, dom, rect, size) {
        //       // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
        //       // 提示框位置
        //       var x = 0; // x坐标位置
        //       var y = 0; // y坐标位置

        //       // 当前鼠标位置
        //       var pointX = point[0];
        //       var pointY = point[1];

        //       // 提示框大小
        //       var boxWidth = size.contentSize[0];
        //       var boxHeight = size.contentSize[1];

        //       // boxWidth > pointX 说明鼠标左边放不下提示框
        //       if (boxWidth > pointX) {
        //         x = 5;
        //       } else { // 左边放的下
        //         x = pointX - boxWidth;
        //       }

        //       // boxHeight > pointY 说明鼠标上边放不下提示框
        //       if (boxHeight > pointY) {
        //         y = 5;
        //       } else { // 上边放得下
        //         y = pointY - boxHeight;
        //       }

        //       return [x, y];
        //     },
        //   },
        //   calculable: true,
        //   xAxis: [
        //     {
        //       type: 'time',
        //       splitLine:{show:false},
        //       axisLabel: {
        //         textStyle: {
        //           fontFamily: 'Microsoft YaHei',
        //           fontSize: 12
        //         },
        //         formatter: function (value) {
        //           var time = new Date(value);
        //           var dateStr = formatByLong(time, 1);
        //           return dateStr.toString().substring(11, 23);
        //         }
        //       }
        //     }
        //   ],
        //   yAxis: [
        //     {
        //       type: 'value',
        //       // name: monitor_unit,
        //       scale: true,  // 放大聚焦到最终最大、最小值区间
        //       axisLabel: { // 坐标轴刻度字体样式
        //         textStyle: {
        //           fontFamily: 'Microsoft YaHei',
        //           fontSize: 12
        //         }
        //       }
        //     }
        //   ],
        //   //调整显示区域大小
        //   grid: {
        //     top:'8%',
        //     left: '3%',
        //     right: '4%',
        //     bottom: '10%',
        //     containLabel: true
        //   },
        //   series: [
        //     {
        //       // name: monitor_name,
        //       name: '监测值',
        //       type: 'line',
        //       smooth: true,  // 曲线平滑显示
        //       showSymbol: false,
        //       data: yarr
        //     }, {
        //       name: '一级正向',
        //       type: 'line',
        //       step: 'end',
        //       showSymbol: false,
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#FF3B30'
        //           }
        //         }
        //       },
        //       data: thdata.onemax
        //     },
        //     {
        //       name: '一级反向',
        //       type: 'line',
        //       step: 'end',
        //       showSymbol: false,
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#FF3B30'
        //           }
        //         }
        //       },
        //       data: thdata.onemin
        //     },
        //     {
        //       name: '二级正向',
        //       type: 'line',
        //       step: 'end',
        //       showSymbol: false,
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#FF9C00'
        //           }
        //         }
        //       },
        //       data:thdata.twomax
        //     },
        //     {
        //       name: '二级反向',
        //       type: 'line',
        //       step: 'end',
        //       showSymbol: false,
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#FF9C00'
        //           }
        //         }
        //       },
        //       data:thdata.twomin
        //     },
        //     {
        //       name: '三级正向',
        //       type: 'line',
        //       step: 'end',
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#00ADFF'
        //           }
        //         }
        //       },
        //       showSymbol: false,
        //       data:thdata.thrmax
        //     },
        //     {
        //       name: '三级反向',
        //       type: 'line',
        //       step: 'end',
        //       itemStyle : {
        //         normal:{
        //           lineStyle:{
        //             color:'#00ADFF'
        //           }
        //         }
        //       },
        //       showSymbol: false,
        //       data:thdata.thrmin
        //     }
        //   ]
        // };



                // 阈值线展示颜色
        var itemColor = ['#FF3B30', '#FF9C00', '#00ADFF'];
        var series = [];
        var yAxis = [];
        if (thrCode === 0) {
            series = [{
                    name: '监测值',
                    type: 'line',
                    smooth: true, // 曲线平滑显示
                    showSymbol: false,
                    data: yarr

                }, {
                    name: '一级正向',
                    type: 'line',
                    step: 'end',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[0]
                            }
                        }
                    },
                    data: thdata.onemax
                },
                {
                    name: '一级反向',
                    type: 'line',
                    step: 'end',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[0]
                            }
                        }
                    },
                    data: thdata.onemin
                },
                {
                    name: '二级正向',
                    type: 'line',
                    step: 'end',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[1]
                            }
                        }
                    },
                    data: thdata.twomax
                },
                {
                    name: '二级反向',
                    type: 'line',
                    step: 'end',
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[1]
                            }
                        }
                    },
                    data: thdata.twomin
                },
                {
                    name: '三级正向',
                    type: 'line',
                    step: 'end',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[2]
                            }
                        }
                    },
                    showSymbol: false,
                    data: thdata.thrmax
                },
                {
                    name: '三级反向',
                    type: 'line',
                    step: 'end',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: itemColor[2]
                            }
                        }
                    },
                    showSymbol: false,
                    data: thdata.thrmin
                }
            ];

            yAxis = [{
                type: 'value',
                // name: monitor_unit,
                scale: true, // 放大聚焦到最终最大、最小值区间

                axisLabel: { // 坐标轴刻度字体样式
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12
                    }
                }
            }];
        } else {
            series = [{
                name: '监测值',
                type: 'line',
                smooth: true, // 曲线平滑显示
                showSymbol: false,
                data: yarr,
                markLine: {
                    label: {
                        normal: { show: false } // 去掉标线显示的数值
                    },
                    symbol: 'none', // 去掉箭头
                    lineStyle: {
                        normal: {
                            type: 'solid'
                        }
                    },
                    data: [{
                        yAxis: thdata.onemax,
                        scale: true, // 放大聚焦到最终最大、最小值区间
                        itemStyle: {
                            normal: {
                                color: itemColor[0]
                            }
                        }
                    }, {
                        yAxis: thdata.twomax,
                        scale: true, 
                        itemStyle: {
                            normal: {
                                color: itemColor[1]
                            }
                        }
                    }, {
                        yAxis: thdata.thrmax,
                        scale: true, 
                        itemStyle: {
                            normal: {
                                color: itemColor[2]
                            }
                        }
                    }, {
                        yAxis: thdata.thrmin,
                        scale: true, 
                        itemStyle: {
                            normal: {
                                color: itemColor[2]
                            }
                        }
                    }, {
                        yAxis: thdata.twomin,
                        scale: true, 
                        itemStyle: {
                            normal: {
                                color: itemColor[1]
                            }
                        }
                    }, {
                        yAxis: thdata.onemin,
                        scale: true, 
                        itemStyle: {
                            normal: {
                                color: itemColor[0]
                            }
                        }
                    }]
                }

            }];
            if (thdata.onemax > maxVal) {
                maxVal = thdata.onemax;
            }
            if (thdata.onemin < minVal) {
                minVal = thdata.onemin;
            }
            yAxis = {
                type: 'value',
                scale: true,
                min: minVal - 0.1,
                max: maxVal + 0.1,
                axisLabel: {
                    formatter: function(value) {
                        return value.toFixed(2);
                    }
                }

            };
        }
        var option = {
            // tooltip: {
            //     trigger: 'axis',
            //     // 设置字体的样式，显 示点击点位的信息
            //     textStyle: {
            //         fontFamily: 'Microsoft YaHei',
            //         fontSize: 12
            //     },
            //     extraCssText: 'align: left;',
            //     formatter: function(params) {
            //         if (params.length > 1) {
            //             if (params[1].value == undefined) {
            //                 return "监测时间：" + formatByLong(params[0].name, 0) + '<br />' + params[0].seriesName + '：' + params[0].value[1] + '<br />';
            //             } else {
            //                 return "监测时间：" + formatByLong(params[0].name, 0) + '<br />' + params[0].seriesName + '：' + params[0].value[1] + '<br />'
            //                     /*+ params[1].seriesName + '：' + params[1].value + '<br />' + params[2].seriesName + '：' + params[2].value + '<br />'
            //                     + params[3].seriesName + '：' + params[3].value + '<br />' + params[4].seriesName + '：' + params[4].value + '<br />'
            //                     + params[5].seriesName + '：' + params[5].value + '<br />' + params[6].seriesName + '：' + params[6].value + '<br />';*/
            //                     +
            //                     params[1].seriesName + '：' + params[1].value + '<br />' +
            //                     params[3].seriesName + '：' + params[3].value + '<br />' +
            //                     params[5].seriesName + '：' + params[5].value + '<br />' +
            //                     params[6].seriesName + '：' + params[6].value + '<br />' +
            //                     params[4].seriesName + '：' + params[4].value + '<br />' +
            //                     params[2].seriesName + '：' + params[2].value + '<br />';
            //             }
            //         } else {
            //             if (params[0] != undefined) {
            //                 return "监测时间：" + formatByLong(params[0].name, 0) + '<br />' + params[0].seriesName + '：' + params[0].value[1] + '<br />'
            //                     /*+ '一级正向：' + thdata.onemax + '<br />' + '一级反向：'  + thdata.onemin + '<br />'
            //                     + '二级正向：' + thdata.twomax + '<br />' + '二级反向：'  + thdata.twomin + '<br />'
            //                     + '三级正向：' + thdata.thrmax + '<br />' + '三级反向：'  + thdata.thrmin + '<br />';*/
            //                     +
            //                     '一级正向：' + thdata.onemax + '<br />' +
            //                     '二级正向：' + thdata.twomax + '<br />' +
            //                     '三级正向：' + thdata.thrmax + '<br />' +
            //                     '三级反向：' + thdata.thrmin + '<br />' +
            //                     '二级反向：' + thdata.twomin + '<br />' +
            //                     '一级反向：' + thdata.onemin + '<br />';
            //             }
            //         }
            //     },
            //     axisPointer: {
            //         animation: false
            //     }
            // },
            calculable: true,
            xAxis: [{
                type: 'time',
                splitLine: { show: false },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12
                    },
                    formatter: function(value) {
                        var time = new Date(value);
                        var dateStr = formatByLong(time, 1);
                        return dateStr.toString().substring(11, 23);
                    }
                }
            }],
            yAxis: yAxis,
            //调整显示区域大小
          grid: {
            top:'8%',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
            // dataZoom: [{
            //     type: 'slider',
            //     show: true,
            //     xAxisIndex: [0],
            //     start: 0,
            //     end: 100
            // }, {
            //     type: 'inside',
            //     xAxisIndex: [0],
            //     start: 0,
            //     end: 100
            // }],
            series: series
        };
        // var option = {
        //     tooltip: {
        //       trigger: 'axis',
        //       // 设置字体的样式，显 示点击点位的信息
        //       textStyle: {
        //         fontFamily: 'Microsoft YaHei',
        //         fontSize: 12
        //       },
        //       position (point, params, dom, rect, size) {
        //         // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
        //         // 提示框位置
        //         var x = 0; // x坐标位置
        //         var y = 0; // y坐标位置

        //         // 当前鼠标位置
        //         var pointX = point[0];
        //         var pointY = point[1];

        //         // 提示框大小
        //         var boxWidth = size.contentSize[0];
        //         var boxHeight = size.contentSize[1];

        //         // boxWidth > pointX 说明鼠标左边放不下提示框
        //         if (boxWidth > pointX) {
        //           x = 5;
        //         } else { // 左边放的下
        //           x = pointX - boxWidth;
        //         }

        //         // boxHeight > pointY 说明鼠标上边放不下提示框
        //         if (boxHeight > pointY) {
        //           y = 5;
        //         } else { // 上边放得下
        //           y = pointY - boxHeight;
        //         }

        //         return [x, y];
        //       },
        //     },
        //     calculable: true,
        //     xAxis: [
        //       {
        //         type: 'time',
        //         splitLine:{show:false},
        //         axisLabel: {
        //           textStyle: {
        //             fontFamily: 'Microsoft YaHei',
        //             fontSize: 12
        //           },
        //           formatter: function (value) {
        //             var time = new Date(value);
        //             var dateStr = formatByLong(time, 1);
        //             return dateStr.toString().substring(11, 23);
        //           }
        //         }
        //       }
        //     ],
        //     yAxis: [
        //       {
        //         type: 'value',
        //         // name: monitor_unit,
        //         scale: true,  // 放大聚焦到最终最大、最小值区间
        //         axisLabel: { // 坐标轴刻度字体样式
        //           textStyle: {
        //             fontFamily: 'Microsoft YaHei',
        //             fontSize: 12
        //           }
        //         }
        //       }
        //     ],
        //     //调整显示区域大小
        //     grid: {
        //       top:'8%',
        //       left: '3%',
        //       right: '4%',
        //       bottom: '10%',
        //       containLabel: true
        //     },
        //     series: series
        //   };

        
        
        function formatByLong(time, flag) {
              var dateStr;
              var date = new Date(time);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              if (month < 10) {
                month = "0" + month;
              }
              var day = date.getDate();
              if (day < 10) {
                day = "0" + day;
              }
              var hour = date.getHours();
              if (hour < 10) {
                hour = "0" + hour;
              }
              var minutes = date.getMinutes();
              if (minutes < 10) {
                minutes = "0" + minutes;
              }
              var seconds = date.getSeconds();
              if (seconds < 10) {
                seconds = "0" + seconds;
              }

              var mill = date.getMilliseconds();
              if (mill < 10) {
                mill = "00" + mill;
              } else if (mill < 100) {
                mill = "0" + mill;
              }

              if(flag === 0){
                dateStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + '.' + mill;
              } else if(flag ===1){
                dateStr = year+'-'+ month +'-'+day+','+hour+':'+minutes+':'+seconds;
              }
              return dateStr;
            }
        
        
        
        
        // debugger
        monitor_echart.setOption(option);
      },
      curAlarmDataTrend(time,ydata){
        // debugger
        let alarmLine = echarts.init(document.getElementById("cur-data"));
        alarmLine.clear()
        alarmLine.setOption({
          // tooltip: {
          //   trigger: 'axis'
          // },
          grid: {
            top:'8%',
            left: '3%',
            right: '4%',
            bottom: '25%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: '10'
              },
    		      interval: 'auto'
            },
            data: time
          },
          yAxis: {
            type: 'value',
            scale : true,
          },
          series: [
            {
              type:'line',
              showSymbol:false,
              lineStyle:{
                width:1,
                color:"#e5213d",
              },
              data:ydata
            }
          ]
        });
        this.$vux.loading.hide();
      },
      alarmData(num){
        let _this = this;
        this.curID = num;
        this.index = num;
        // console.log(num)
        this.$vux.loading.show({
          text: 'loading'
        })

        this.startTimeCount();
        this.endTimeCount();

        if (num == 0){//报警数据
          _this.$axios({
            url: 'getHistoryData.mvc',
            method: 'post',
            params : {
              equipId:Storage.get('equipId'),
              monitorId:Storage.get('monprojectId'),
              startTime:_this.startTime,
              endTime:_this.endTime
            }
          })
            .then((res)=>{
              let ret = res.data.data[0];
              if (ret.monitorvalue.length > 0){
                _this.alarmDataTrend("alarm-data",ret.monitorvalue,ret.thresholdData,ret.thrCode,ret.maxVal,ret.minVal);
                this.$vux.loading.hide();

              }else {
                _this.haveData = true;
                this.$vux.loading.hide();

              }
            })
            .catch((err)=>{
              this.$vux.loading.hide();
            })

        }
        else if (num == 1){//当前数据
          _this.$axios({
            url: 'getRealTimeData.mvc',
            method: 'post',
            params : {
              equipId:Storage.get('equipId'),
              monitorId:Storage.get('monprojectId'),
            }
          }).then((res)=>{
            let ret = res.data
            _this.curDataTime = []
            _this.curDataVal = [] //清空上一次的数据
            for (let i in ret.data) {
              _this.curDataTime.push(ret.data[i].time);
              _this.curDataVal.push(ret.data[i].value);
            }
            _this.curAlarmDataTrend(_this.curDataTime, _this.curDataVal);
          })
        }
        else {//历史数据
          this.historyData(2,0)
        }
      },
      hoursChange: function(num) {
        this.$vux.loading.show({
          text: 'loading'
        })
        this.tBut = num;
        this.historyDataTrend(num)
      },
      historyData: function(num, index) {
        this.curID = num;
        this.tBut = index;
        this.historyDataTrend(index);
      },
      historyDataTrend(index) {
        let _this = this;
        let date = new Date();
        let hours = date.getHours();
        if (index == 0) {
          date.setHours(hours - 1);
        } else {
          date.setHours(hours - 24);
        }
        _this.historyStartTime = date.toString();
        _this.formatTime(_this.historyStartTime);
        _this.formatTime(_this.crurenTime);

        _this.$axios({
          url:'getHistoryData.mvc',
          method: 'post',
          params:{
            equipId:Storage.get('equipId'),
            monitorId:Storage.get('monprojectId'),
            startTime: _this.historyStartTime,
            endTime: _this.crurenTime
          }
        })
          .then((res)=>{
            if (res.data) {
              let ret = res.data.data[0];
              if (ret.monitorvalue.length > 0){
                _this.alarmDataTrend("history-data" + index,ret.monitorvalue,ret.thresholdData,ret.thrCode,ret.maxVal,ret.minVal);
                this.$vux.loading.hide();

              }else {
                _this.haveData = true;
                this.$vux.loading.hide();

              }
            }
          })
          .catch((err)=>{
            _this.$vux.loading.hide();
            _this.haveData = true;
            console.log(err)
          })
      },
      startTimeCount(){
        let date = new Date(this.monitorTime);
        let min=date.getMinutes();
        let hours = date.getHours();
        if(this.monprojectId === "402884405026354d6005" || this.monprojectId === "402884405026354d6010" || this.monprojectId === "402884405026354d6000"){
          date.setHours(hours-1);
        }else{
          date.setMinutes(min-5);
        }
        this.startTime=date.toString();
        this.formatTime(this.startTime);
      },
      endTimeCount:function(){
        let date=new Date(this.monitorTime);
        let min=date.getMinutes();
        let hours = date.getHours();
        if(this.monprojectId === "402884405026354d6005" || this.monprojectId === "402884405026354d6010" || this.monprojectId === "402884405026354d6000"){
          date.setHours(hours+1);
        }else{
          date.setMinutes(min+5);
        }
        this.endTime=date.toString();
        this.formatTime(this.endTime);

      },
      formatTime:function(time){
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        if(time== this.startTime){
          return this.startTime=Y+M+D+h+m+s;
        }else if(time== this.endTime){
          return this.endTime=Y+M+D+h+m+s;
        }else if(time== this.historyStartTime){
          return this.historyStartTime=Y+M+D+h+m+s;
        }else{
          return this.crurenTime=Y+M+D+h+m+s;
        }
      },
    }
    }
</script>

<style scoped>
</style>
