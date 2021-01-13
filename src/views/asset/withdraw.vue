<template>
  <div class="c-page">
    <div class="sep allCenter">
      <div class="tit">提现</div>
    </div>
    <div class="form">
      <div class="input-wrap">
        <div class="label">可提现金额</div>
        <div class="input-content" style="line-height: 48px">
          {{$store.state.user.balance}}元
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">输入提现金额</div>
        <div class="input-content">
          <input type="text" v-model="drawAmount" @input="checkAmount" :placeholder="`提现金额不可低于${minAmount}元`">
          <i @click="drawAmount = $store.state.user.balance">提现全部金额</i>
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">手机号码</div>
        <div class="input-content">
          <input type="text" disabled :value="$store.state.user.mobile">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">验证码</div>
        <div class="input-content">
          <captcha class="send"></captcha>
          <input type="text" v-model="verifyCode" placeholder="输入验证码">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">银行卡</div>
        <div class="input-content">
          <i @click="showChoose = true">更换银行卡</i>
          <div class="bank-list">
            <div class="item" v-for="(item, index) in bankList" v-if="item.checked" :key="index">
              <div class="name">
                {{item.realName}}
                <span>{{item.bankName}}</span>
              </div>
              <div class="num">{{item.bankNumber}}</div>
            </div>
          </div>
          <button class="btn" @click="submit" :disabled="!drawAmount || !verifyCode">确定</button>
        </div>
      </div>
      <el-dialog class="bank-dialog" title="选择银行卡" :visible.sync="showChoose">
        <div class="bank-list">
          <div class="item" @click="choose(index)" :class="{active: item.checked}" v-for="(item, index) in bankList" :key="index">
            <div class="name">
              {{item.realName}}
              <span>{{item.bankName}}</span>
            </div>
            <div class="num">{{item.bankNumber}}</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawAmount: '',
      verifyCode: '',
      showChoose: false,
      bankList: [],
      bankId: ''
    }
  },
  computed: {
    minAmount () {
      return this.$store.state.user.minAmount
    }
  },
  components: {
    captcha: require('@/components/captcha').default
  },
  mounted () {
    let list = JSON.parse(JSON.stringify(this.$store.state.bankList))
    if (!list.length) {
      this.$message.error('您还没有绑定银行卡，请先绑定银行卡')
      this.$router.back()
    }
    list.forEach((item, index) => {
      if (index === 0) {
        item.checked = true
        this.bankId = item.id
      } else {
        item.checked = false
      }
    })
    this.bankList = list
  },
  methods: {
    checkAmount () {
      let reg = /^\d+(\.\d{0,2})?$/
      if (!reg.test(this.drawAmount)) {
        this.drawAmount = this.drawAmount.slice(0, -1);
      }
    },
    choose (chooseIndex) {
      this.bankList.forEach((item, index) => {
        if (chooseIndex === index) {
          item.checked = true
          this.bankId = item.id
        } else {
          item.checked = false
        }
        this.showChoose = false
      })
    },
    submit () {
      if (this.drawAmount < this.minAmount) {
        this.$message.error(`最低提现金额${this.minAmount}元`)
      } else {
        this.$fetch.post('/draw/createDrawRecord', {
          drawAmount: this.drawAmount,
          bankId: this.bankId,
          verifyCode: this.verifyCode,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success('提交成功， 请等待审核')
          }
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .tit{
    font-size: 30px;
    span{
      font-size: 16px;
      margin-left: 20px;
      color: #aaa;
    }
  }
  .input-wrap{
    display: flex;
    .label{
      line-height: 48px;
      margin-bottom: 0;
      width: 120px;
    }
    .input-content{
      width: 350px;
      position: relative;
      input{
        border: 1px solid #333;
        border-radius: 4px;
        padding: 0 15px;
        &:disabled{
          background: #f4f4f4;
          border: none;
        }
      }
    }
    i{
      color: @blue;
      padding: 10px 0;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>

<style lang="less">
.bank-dialog{
  .el-dialog{
    width: 760px !important;
  }
  .el-dialog__header{
    padding-bottom: 20px;
  }
  .el-dialog__headerbtn{
    top: 20px !important;
  }
  .bank-list{
    .item{
      background: #f2f2f2;
      cursor: pointer;
      &.active{
        background: #e0f1ff;
      }
    }
  }
}
</style>
