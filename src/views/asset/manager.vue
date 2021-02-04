<template>
  <div class="c-page">
    <div class="total-wrap">
      <h3>账号余额</h3>
      <div class="row">
        <h4>{{$store.state.user.balance}}元</h4>
        <div class="btns small">
          <div class="btn" @click="$router.push('/asset/withdraw')">提现</div>
          <div class="btn" @click="$router.push('/asset/myBank')">我的银行卡</div>
        </div>
      </div>
    </div>
    <div class="filter hCenter">
      <tab class="big" :activeIndex.sync="activeIndex" :arr="['收入记录', '支出记录']"></tab>
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        @change="getData"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>

    <div class="detail">
      <load-more v-if="activeIndex === 0" :list="incomeList" :total="incomeTotal" @change="getData">
        <div class="list">
          <table>
            <thead>
              <tr>
                <td>交易时间</td>
                <td>类型</td>
                <td>金额</td>
                <td>状态</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody v-if="activeIndex === 0">
              <tr @click="$router.push(`/asset/detail?type=1&item=${encodeURIComponent(JSON.stringify(item))}`)" v-for="(item, index) in incomeList" :key="index">
                <td>{{item.incomeTime | time}}</td>
                <td>{{item.newsInType}}</td>
                <td>{{item.receiveAmount | f}}元</td>
                <td>
                  <span v-if="item.incomeStatus === 0">新创建</span>
                  <span v-else-if="item.incomeStatus === 1">待打款</span>
                  <span v-else-if="item.incomeStatus === 2">已打款</span>
                  <span v-else-if="item.incomeStatus === 3">扣款失败</span>
                  <span v-else-if="item.incomeStatus === 4">打款失败</span>
                  <span v-else-if="item.incomeStatus === 5">退款成功</span>
                  <span v-else-if="item.incomeStatus === 6">退款失败</span>
                </td>
                <td><router-link to="/">详情</router-link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </load-more>

      <load-more v-else :list="drawList" :total="drawTotal" @change="getData">
        <div class="list">
          <table>
            <thead>
              <tr>
                <td>交易时间</td>
                <td>类型</td>
                <td>金额</td>
                <td>状态</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody>
              <tr @click="$router.push(`/asset/detail?type=2&item=${encodeURIComponent(JSON.stringify(item))}`)" v-for="(item, index) in drawList" :key="index">
                <td>{{item.createTime | time}}</td>
                <td><span v-if="item.type === 1">提现</span></td>
                <td>{{item.drawAmount | f}}元</td>
                <td>
                  <span v-if="item.status === 1">审核中</span>
                  <span v-else-if="item.status === 2">提现中</span>
                  <span v-else-if="item.status === 3">提现取消中</span>
                  <span v-else-if="item.status === 4">提现成功</span>
                  <span v-else-if="item.status === 5">提现失败</span>
                  <span v-else-if="item.status === 6">已取消</span>
                  <span v-else-if="item.status === 7">审核失败</span>
                </td>
                <td><router-link to="/">详情</router-link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </load-more>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      message: null,
      time: '',
      incomeList: [],
      drawList: [],
      incomeTotal: -1,
      drawTotal: -1,
      loading: false
    }
  },
  watch: {
    activeIndex () {
      this.getData()
    }
  },
  activated () {
    this.$store.dispatch('getBalance')
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      if (this.activeIndex === 1) {
        this.getWithdraw()
        } else {
        this.getIncome()
      }
    },
    getIncome (pageIndex) {
      this.$fetch.post('/income/queryIncomeList', {
        pageIndex: pageIndex || 1,
        pageSize: 20,
        startTime: this.time[0],
        endTime: this.time[1],
      }).then(res => {
        this.loading = false
        if (res.success && res.data) {
          this.incomeList = res.data.list
          this.incomeTotal = res.data.count
        } else {
          this.incomeList = []
          this.incomeTotal = 0
        }
      })
    },
    getWithdraw (pageIndex) {
      this.$fetch.post('/draw/queryDrawList', {
        pageIndex: pageIndex || 1,
        pageSize: 20,
        startTime: this.time[0],
        endTime: this.time[1],
      }).then(res => {
        this.loading = false
        if (res.data) {
          this.drawList = res.data.list
          this.drawTotal = res.data.count
        } else {
          this.drawList = []
          this.drawTotal = 0
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .empty{
    position: relative;
    padding-top: 100px;
  }
  .total-wrap{
    background: #fff;
    margin-bottom: 40px;
    line-height: 1.6;
    font-size: 14px;
    padding: 30px 40px;
    border-radius: 4px;
    h3{
      margin-bottom: 20px;
    }
    h4{
      font-size: 40px;
      color: @blue;
      line-height: 1.1;
      margin-bottom: 2px;
    }
  }
  .detail{
    padding: 30px 0 50px;
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
      td{
        height: 50px;
        padding-left: 30px;
        padding-top: 20px;
        padding-bottom: 0;
      }
      tr{
        border-bottom: 1px solid #e9e9e9;

      }
      tbody tr:hover{
        background: #f2f3f5;
      }
    }
  }
</style>
