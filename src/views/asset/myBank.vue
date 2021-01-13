<template>
  <div class="c-page">
    <div class="sep allCenter">
      <div class="tit">我的银行卡 <span>最多可以添加五张银行卡</span></div>
      <div class="btn small" v-if="bankList.length < 5" @click="$router.push('/asset/addBank')">添加银行卡</div>
    </div>
    <div class="bank-list">
      <div class="item" v-for="(item, index) in bankList" :key="index">
        <div class="name">
          {{item.realName}}
          <span>{{item.bankName}}</span>
        </div>
        <div class="num">{{item.bankNumber}}</div>
        <div class="delete" @click="deleteBank(item.id)">
          删除
        </div>
      </div>
      <div v-if="!bankList.length" class="empty" style="position: static;padding-top: 100px;">
        <img src="@img/empty.png" alt>
        <p>{{$t('common.empty')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted () {
    this.$store.dispatch('getBankList')
  },
  computed: {
    bankList () {
      return this.$store.state.bankList
    }
  },
  methods: {
    deleteBank (bankId) {
      this.$confirm('确认删除吗？').then(() => {
        this.$fetch.post('/bank/delBankInfo', {
          bankId,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.$store.dispatch('getBankList')
          }
        })
      })
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
  .item{
    position: relative;
    .delete{
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      .vCenter;
      justify-content: center;
      background: rgba(251,81,134,.8);
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
    &:hover{
      .delete{
        visibility: visible;
      }
    }
  }
</style>
