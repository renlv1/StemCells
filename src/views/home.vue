<template>
  <div class="c-page min">
    <div class="voice" v-if="message">
      <img src="@img/voice.png" alt="">
      <span class="ell pointer" @click="$router.push(`/notice/noticeDetail?item=${JSON.stringify(message)}`)">{{message.content.title}}</span>
      <span class="time cgray">{{message.updateAt | time}}</span>
      <span class="pointer cblue" @click="$router.push('/notice/notice')">{{$t('common.more')}}</span>
    </div>


    <div class="total-wrap">
      <h3>账号预览 <span class="red" v-if="detail.upToTime">{{$t('home.t8')}}{{detail.upToTime}}</span></h3>
      <div class="total">
        <div class="item">
          <h4>{{detail.totalNumber}}</h4>
          <p>粉丝数</p>
        </div>
        <div class="item">
          <h4>{{detail.totalNewNumber || 0}}</h4>
          <p>资讯数</p>
        </div>
        <div class="item">
          <h4>{{detail.totalReadNumber}}</h4>
          <p>阅读数</p>
        </div>
      </div>
    </div>

    <div class="filter hCenter">
      <tab class="big" :activeIndex.sync="activeIndex" :arr="$t('home.arr1')"></tab>
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        :default-value="defaultValue"
        start-placeholder="开始日期"
        :picker-options="pickerOptions"
        @change="getData"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="chart">
      <v-chart style="width: 100%;" v-if="chartData" :options="chartData"></v-chart>
    </div>

    <div v-if="empty" class="empty">
      <img src="@img/empty.png" alt>
      <p>{{$t('common.empty')}}</p>
    </div>

    <div class="detail">
      <div class="label">{{label}}明细(近30日)</div>
      <div class="list">
        <table>
          <thead>
            <tr>
              <td>序号</td>
              <td @click="reverseList = !reverseList">时间
                <span v-if="!reverseList" class="el-icon-top"></span>
                <span v-else class="el-icon-bottom"></span>
              </td>
              <td>新增{{label}}</td>
              <td>累计{{label}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in (reverseList ? [...totalData].reverse() : [...totalData])" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.createAt | time('/', false)}}</td>
              <td>
                <span v-if="activeIndex === 2">{{item.attenCount}}</span>
                <span v-else-if="activeIndex === 1">{{item.collectCount}}</span>
                <span v-else-if="activeIndex === 0">{{item.readCount}}</span>
              </td>
              <td>
                <span v-if="activeIndex === 2">{{item.attenTotal}}</span>
                <span v-else-if="activeIndex === 1">{{item.collectTotal}}</span>
                <span v-else-if="activeIndex === 0">{{item.readTotal}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <el-dialog class="dialog" :visible.sync="showTips">
      <div class="tit"><i class="el-icon-warning"></i>{{$t('home.t9')}}</div>
      <div class="desc">{{$t('home.t10')}}<span class="cred">{{$store.state.user.auditDesc}}</span></div>
      <router-link to="/auth" class="cblue">{{$t('home.t11')}}</router-link>
    </el-dialog>

  </div>
</template>

<script>

import ECharts from 'vue-echarts'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
export default {
  data() {
    let defaultValue = ''
    let d = new Date()
    defaultValue = `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`
    return {
      chartData: null,
      totalData: [],
      detail: {},
      activeIndex: 0,
      dateIndex: 0,
      message: null,
      showTips: false,
      yesterdayCount: 0,
      totalDayCount: 0,
      label: '',
      empty: false,
      value1: '',
      time: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      defaultValue,
      list: [],
      reverseList: false
    }
  },
  components: {
    'v-chart': ECharts
  },
  watch: {
    activeIndex () {
      this.setIndex()
    },
    dateIndex () {
      this.getData()
    }
  },
  mounted () {
    this.getData()
    this.getMessage()
    this.showTips = this.$store.state.user.newsStatus === 4
  },
  methods: {
    getData () {
      this.$fetch.post('/back/queryTrend', {
        operateType: 1,
        timeType: this.time ? 3 : 2,
        startTime: this.time[0],
        endTime: this.time[1]
      }).then(res => {
        if (res.success) {
          this.detail = res.data
          this.totalData = res.data.data || []
          this.setChartData()
        }
      })
    },
    getMessage () {
      this.$fetch.post('/back/queryMessageList', {
        pageIndex: 1,
        pageSize: 1
      }).then(res => {
        let list = res.data.data || []
        let message = null
        if (list.length) {
          list.forEach(item => {
            if (item.content) {
              item.content = JSON.parse(item.content)
            }
          })
          message = list[0]
        }
        this.message = message
      })
    },
    setIndex () {
      this.setChartData()
    },
    setChartData () {
      if (!this.totalData.length) {
        this.empty = true
        return
      } else {
        this.empty = false
      }
      let types = this.$t('home.arr2')
      let index = this.activeIndex
      let name = types[index]
      let list = [...this.totalData].reverse()
      let xData = []
      let yData = []
      this.label = name

      if (index === 2) {
        this.yesterdayCount = this.detail.addNumber
        this.totalDayCount = this.detail.totalNumber
      } else if (index === 1) {
        this.yesterdayCount = this.detail.addCollectNumber
        this.totalDayCount = this.detail.totalCollectNumber
      } else if (index === 0) {
        this.yesterdayCount = this.detail.addReadNumber
        this.totalDayCount = this.detail.totalReadNumber
      }

      list.forEach(item => {
        let d = new Date(item.uptime)
        xData.push(`${d.getMonth() + 1}-${d.getDate()}`)
        let val = ''
        if (this.activeIndex === 1) {
          val = item.collectCount
        } else if (this.activeIndex === 0) {
          val = item.readCount
        } else {
          val = item.attenCount
        }
        yData.push(parseInt(val))
      })

      this.chartData = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: yData,
          name,
          type: 'line',
          symbolSize: 0,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#508cff'
              }
            }
          }
        }]

      }

    }
  }
};
</script>

<style lang="less" scoped>

  .empty{
    position: relative;
    padding-top: 100px;
  }
  .voice{
    .vCenter;
    height: 60px;
    margin-bottom: 40px;
    background: #fff;
    padding: 5px 30px;
    .ell{
      margin: 0 100px 0 10px;
      flex: 1;
    }
    .time{
      margin-right: 40px;
    }
  }
  .dialog{
    /deep/ .el-dialog{
      width: 450px;
      margin: 0 auto;
      min-height: 30vh;
    }
    .tit{
      font-size: 17px;
      margin-bottom: 20px;
      .vCenter;
      i{
        font-size: 30px;
        margin-right: 10px;
        color: @warn;
      }
    }
    .desc{
      margin-bottom: 20px;
    }
    a{
      margin: 50px auto;
      display: inline-block;
    }
  }
  .total-wrap{
    background: #fff;
    margin-bottom: 40px;
    line-height: 1.6;
    font-size: 14px;
    padding: 30px 40px;
    border-radius: 4px;
    .red{
      color: #ff2769;
    }
    h3{
      margin-bottom: 20px;
      span{
        margin-left: 20px;
      }
    }
    .total{
      display: flex;
      .item{
        margin-right: 80px;
        color: #a4a8b5;
        font-size: 16px;
        &:last-child h4{
          color: inherit;
        }
        min-width: 160px;
      }
      h4{
        font-size: 50px;
        color: @blue;
        line-height: 1.1;
        margin-bottom: 2px;
      }
    }
  }
  .detail{
    padding: 30px 0 50px;
    .tbody{
      max-height: 300px;
      overflow-y: auto;
    }
    .label{
      margin-bottom: 20px;
      span{
        margin-left: 20px;
      }
    }
    table{
      width: 100%;
      table-layout: fixed;
      font-size: 16px;
      text-align: center;
      td{
        height: 60px;
        line-height: 60px;
      }
      tr{
        border-bottom: 1px solid #e9e9e9;
      }
    }
  }
</style>
