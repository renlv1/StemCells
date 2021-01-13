<template>
  <div class="c-page">
    <app-header hideReturn>{{$lang === 'cn' ? '粉丝列表' : 'Fans list'}}</app-header>
    <div class="sep allCenter" v-if="isPC">
      <span>{{$t('user.t1')}}{{total >=0 ? total : ''}}{{$t('home.t5')}}</span>
      <div class="flex">
        <input type="text" v-model="searchVal">
        <div class="small btn" @click="getData()">{{$t('common.query')}}</div>
      </div>
    </div>
    <div class="label" v-else><span>{{$t('user.t1')}}{{total >=0 ? total : ''}}{{$t('home.t5')}}</span></div>
    <load-more ref="loadMore" :list="list" :total="total" @change="getData" :pageSize="100">
      <div class="info">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="user-head"><img :src="item.imgUrl" alt=""></div>
            <template v-if="isPC">
              <div class="name f1" style="padding-right:10px; font-size: 14px;">{{item.nickName}}</div>
              <span class="time">{{item.attenTime | time('/', false)}}</span>
            </template>
            <div class="fl" v-else>
              <div class="name" style="padding-right:10px; font-size: 14px;">{{item.nickName}}</div>
              <span class="time">{{item.attenTime | time('/', false)}}</span>
            </div>
          </div>
      </div>
    </load-more>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      total: -1,
      searchVal: '',
      pageIndex: 1
    }
  },
  methods: {
    getData (pageIndex) {
      this.$fetch.post('/back/queryFansList', {
        nickName: this.searchVal,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 100
      }).then(res => {
        if (res.success) {
          let list = res.data.data || []
          if (this.isPC) {
            this.list = list
          } else {
            if (this.pageIndex === 1) {
              this.list = list
            } else {
              this.list.push(...list)
            }
            this.$refs.loadMore.done()
          }
          this.total = res.data.totalNumber
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.sep{
  input{
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    width: 150px;
    height: 46px;
    margin-right: 20px;
  }
}
.info{
  .item{
    width: 18%;
    width: 300px;
    margin-right: 1%;
    margin-bottom: 10px;
    background: #fff;
    box-shadow: 0 0 6px rgba(0,0,0,.05);
    .vCenter;
    display: inline-flex;
    padding: 30px 20px;
    border-radius: 6px;
  }
  @media @mob{
    .item{
      box-shadow: none;
      width: 100%;
      padding: 20px;
      margin-bottom: 0;
      border-bottom: 1px dashed #eee;
      .vCenter;
      .name{
        font-size: 16px !important;
      }
    }
  }
}
.label{
  border-left: 4px solid @warn;
  line-height: 1;
  padding-left: 5px;
  margin-bottom: 20px;
}
</style>
