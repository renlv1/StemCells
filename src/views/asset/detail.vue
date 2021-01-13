<template>
  <div class="c-page">
    <div class="el-icon-back pointer" @click="$router.back()">返回</div>
    <div v-if="type == 1">
      <div class="total-wrap">
        <h3>收入金额</h3>
        <div class="row">
          <h4>{{item.receiveAmount | f}}元</h4>
        </div>
      </div>
      <div class="detail">
        <div class="item">
          <span class="label">订单号</span>
          <span>{{item.id}}</span>
        </div>
        <div class="item">
          <span class="label">入账时间</span>
          <span>{{item.incomeTime | time}}</span>
        </div>
        <div class="item">
          <span class="label">类型</span>
          <span>{{item.newsInType}}</span>
        </div>
        <div class="item">
          <span class="label">状态</span>
          <span v-if="item.incomeStatus === 0">新创建</span>
          <span v-else-if="item.incomeStatus === 1">待打款</span>
          <span v-else-if="item.incomeStatus === 2">已打款</span>
          <span v-else-if="item.incomeStatus === 3">扣款失败</span>
          <span v-else-if="item.incomeStatus === 4">打款失败</span>
          <span v-else-if="item.incomeStatus === 5">退款成功</span>
          <span v-else-if="item.incomeStatus === 6">退款失败</span>
        </div>
      </div>
    </div>
    <div v-if="type == 2">
      <div class="total-wrap">
        <h3>提现金额</h3>
        <div class="row">
          <h4>{{item.drawAmount | f}}元</h4>
        </div>
      </div>
      <div class="detail">
        <div class="item">
          <span class="label">订单号</span>
          <span>{{item.id}}</span>
        </div>
        <div class="item">
          <span class="label">创建时间</span>
          <span>{{item.createTime | time}}</span>
        </div>
        <div class="item">
          <span class="label">类型</span>
          <span v-if="item.type === 1">提现支出</span>
        </div>
        <div class="item">
          <span class="label">状态</span>
          <span v-if="item.status === 1">审核中</span>
          <span v-else-if="item.status === 2">提现中</span>
          <span v-else-if="item.status === 3">提现取消中</span>
          <span v-else-if="item.status === 4">提现成功</span>
          <span v-else-if="item.status === 5">提现失败</span>
          <span v-else-if="item.status === 6">已取消</span>
          <span v-else-if="item.status === 7">审核失败</span>
        </div>
        <div class="item">
          <span class="label">银行卡</span>
          <span>
            <i>{{bank.realName}}</i>
            <i>{{bank.bankName}}</i>
            <i>{{bank.bankNumber}}</i>
          </span>
        </div>
        <div class="item" v-if="item.status === 1 ||item.status === 2">
          <span class="label">预计到账</span>
          <span>
            3-5个工作日
            <div class="btn small" v-if="item.status === 1" @click="cancelDarw">申请取消提现</div>
          </span>
        </div>
        <div class="item" v-if="item.status === 7">
          <span class="label">失败原因</span>
          <span>{{item.auditDesc}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: JSON.parse(decodeURIComponent(this.$route.query.item)),
      type: this.$route.query.type,
      bank: {}
    }
  },
  mounted () {
    let bank = this.item.drawBankAccount
    if (bank) {
      bank = JSON.parse(bank)
      this.bank = bank
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/back/queryTrend', {
        operateType: 1,
        timeType: this.dateIndex + 1
      }).then(res => {
        if (res.success) {
          this.detail = res.data
          this.totalData = res.data.data || []
        }
      })
    },
    cancelDarw () {
      this.$fetch.post('/draw/cancelDraw', {
        drawId: this.item.id,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$message.success('取消成功')
          this.item.status = 3
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
    margin-bottom: 40px;
    line-height: 1.6;
    font-size: 14px;
    border-bottom: 1px dashed #e9e9e9;
    padding-bottom: 20px;
    h3{
      margin-bottom: 15px;
    }
    h4{
      font-size: 30px;
      line-height: 1.1;
      margin-bottom: 2px;
    }
  }
  .item{
    display: flex;
    margin-bottom: 20px;
    line-height: 26px;
    .label{
      min-width: 150px;
    }
    .btn{
      margin-top: 20px;
    }
  }
</style>
