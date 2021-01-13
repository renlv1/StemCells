<template>
  <div class="c-page">
    <app-header hideReturn>{{$lang === 'cn' ? '草稿箱' : 'Drafts'}}</app-header>
    <div class="tools row">
      <div class="vCenter" v-if="selectedNewsList.length">
        <div class="action">
          <span @click="deleteNews()">{{$t('common.delete')}}</span>
        </div>
        <span>{{$t('news.t4')}}{{selectedNewsList.length}}{{$t('news.t5')}}</span>
        <span class="cblue" @click="selectAllNews">{{$t('news.t6')}}</span>
        <span class="cblue" @click="selectedNewsList = []">{{$t('news.t7')}}</span>
      </div>
      <div class="vCenter" v-else>
        <span>{{$t('news.t8')}}{{total >=0 ? total : 0}}{{$t('news.t9')}}</span>
        <img :class="{active: diffShow === false}" @click="diffShow = false" src="@img/icon_menu.png" alt="">
        <img :class="{active: diffShow === true}" @click="diffShow = true" src="@img/icon_column.png" alt="">
      </div>
      <!-- <div class="vCenter">
        <el-dropdown trigger="click" @command="jumpNews">
          <button class="btn small" :disabled="disable">{{$t('news.t11')}}</button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-for="(item, index) in $t('news.arr1')" :key="index" :command="index + 1">{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
    </div>
    <load-more ref="loadMore" :list="list" :total="total" @change="getData" :pageSize="pageSize">
      <div class="list" :class="{diff: diffShow}">
        <div class="item" :class="{check: selectedNewsList.includes(item.newsId)}" v-for="(item, index) in list" :key="index">
          <i v-if="diffShow" class="el-icon-check" @click="selectNews(item.newsId)"></i>
          <div class="img pointer" @click="jump(item)" :style="`background-image:url(${item.imgUrl[0] || require(`@img/empty_img_${$lang}.png`)})`">
            <i class="el-icon-video-play" v-if="item.fileType === 2"></i>
          </div>
          <div class="content">
            <div class="news-title pointer" ><h3 @click="jump(item)">{{item.title}}</h3></div>
            <div class="row">
              <span class="cblue">{{$t('news.t50')}}</span>
              <div class="cgray time">{{item.updateTime | time}}</div>
            </div>
            <div class="row">
              <span></span>
              <span class="cred" v-if="item.status == 8" style="font-size: 13px;">{{item.publishTime | time}}</span>
            </div>
          </div>
          <div class="mask" v-if="!diffShow">
            <div class="allCenter">
              <i class="el-icon-check" @click="selectNews(item.newsId)"></i>
              <div class="vCenter">
                <i class="el-icon-edit-outline" :class="{hide: item.status === 4 || item.status === 8}" @click="jump(item, 2)"></i>
                <i style="font-size:20px" @click="deleteNews(item.newsId)" class="el-icon-delete"></i>
              </div>
            </div>
            <div class="link-wrap">
              <div class="link" @click="jump(item)">{{$t('news.t34')}}</div>
            </div>
          </div>
          <div class="vCenter big" v-else>
            <i class="el-icon-edit-outline" :class="{hide: item.status === 4 || item.status === 8}" @click="jump(item, 2)"></i>
            <i class="el-icon-delete" @click="deleteNews(item.newsId)"></i>
          </div>
        </div>
      </div>
    </load-more>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      list: [],
      selectedNewsList: [],
      diffShow: false,
      pageIndex: 1,
      total: -1,
    };
  },
  computed: {
    disable () {
      return this.$store.state.user.newsStatus !== 1
    }
  },
  methods: {
    jump (item, type) {
      let url = ''
      if (type === 2) {
        url = `/news/createNews?newsId=${item.newsId}`
      } else {
        url = `/news/newsDetail?newsId=${item.newsId}`
      }
      this.$store.commit('SET_CURRENT_NEWS', item)
      this.$router.push(url)
    },
    getData (pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      }
      this.$fetch.post('/back/queryDraftNewsList', {
        data: this.searchVal,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: this.pageSize
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
    },
    selectNews (id) {
      let idx = this.selectedNewsList.findIndex(item => item === id)
      if (idx > -1) {
        this.selectedNewsList.splice(idx, 1)
      } else {
        this.selectedNewsList.push(id)
      }
    },
    selectAllNews () {
      let list = []
      this.list.forEach(item => {
        list.push(item.newsId)
      })
      this.selectedNewsList = list
    },
    deleteNews (newsId) {
      if (!newsId) {
        newsId = []
        this.selectedNewsList.forEach(item => {
          newsId.push(item)
        })
        newsId = newsId.join(',')
      }
      this.$confirm(this.$t('news.t25')).then(() => {
        this.$fetch.post('/back/deleteNews', {
          newsId,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success(this.$t('news.t26'))
            this.selectedNewsList = []
            this.getData()
          }
        })
      })
    },
    jumpNews (i) {
      this.$router.push(`/news/createNews?type=${i}`)
    },
    publishNews (newsId) {
      this.$confirm(this.$t('news.t32')).then(() => {
        this.$fetch.post('/back/publishNews', {
          newsId,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success(this.$t('news.t33'))
            this.getData()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .c-page{
    // max-width: 1300px;
    min-width: 900px;
    overflow-x: auto;
  }
  .move-dialog{
    .dialog-tit{
      font-size: 17px;
      margin-bottom: 17px;
    }
    .item{
      border-bottom: 1px solid #f0f0f0;
      padding: 14px 20px;
      .vCenter;
    }

    &.delete-confirm{
      .delete-tips{
        font-size: 16px;
        padding: 5px 0 10px;
        span{
          &::before{
            content: '/'
          }
          &:first-child{
            &:before{
              display: none;
            }
          }
        }
      }
      span, /deep/ .el-checkbox__label{
        color: #ff2769 !important;
      }
    }
  }
  .el-icon-check{
    background: #d0d4e2;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 18px !important;
    .vCenter;
    display: inline-flex;
    justify-content: center;
    margin-right: 15px;
    &.active{
      background: @blue;
      color: #fff;
    }
  }
  .btn.small{
    margin-left: 20px;
  }
  .tools{
    margin-bottom: 40px;
    img{
      margin-left: 16px;
    }
    input{
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 10px;
      width: 150px;
      height: 46px;
    }
    .action{
      background: #fff;
      border-radius: 4px;
      .vCenter;
      height: 40px;
      line-height: 1;
      cursor: pointer;
      margin-right: 15px;
      span{
        width: 100px;
        text-align: center;
        &+span{
          border-left: 1px solid #ddd;
        }
      }
    }
    .cblue{
      margin-left: 15px;
      cursor: pointer;
    }
    .active{
      filter: brightness(0.6);
    }
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    margin-right: -2%;
    .item{
      width: 18%;
      max-width: 300px;
      margin-right: 2%;
      border-radius: 2px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
      position: relative;
      margin-bottom: 2%;
      .img{
        height: 180px;
        background: #eee no-repeat center center;
        background-size: cover;
        .vCenter;
        justify-content: center;
        i{
          font-size: 50px;
          color: #fff;
        }
      }
      .news-title{
        .vCenter;
        height: 40px;
      }
      h3{
        font-size: 15px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .time{
        font-size: 12px;
        padding: 10px 0;
      }
      .row{
        margin-top: 6px;
        font-size: 14px;
      }
      .content{
        padding: 20px;
        padding-top: 15px;
      }
      .mask{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.6);
        padding: 20px;
        opacity: 0;

        i{
          color: #fff;
          font-size: 22px;
          &+i{
            margin-left: 10px;
          }
        }
      }
      .link-wrap{
        height: 92%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      .link{
        background: #fff;
        width: 150px;
        line-height: 40px;
        border-radius: 5px;
        text-align: center;
        margin: 10px 0;
        font-size: 15px;
        color: @blue;
        cursor: pointer;
      }
      &:hover{
        .mask{
          opacity: 1;
          transition: .3s;
        }
        .el-icon-check{
          visibility: visible;
        }
      }
      &.check{
        .el-icon-check{
          background: @blue;
          visibility: visible;
        }
        .mask{
          display: block;
          opacity: 1;
          .vCenter i,.link{
            display: none;
          }
        }
      }
    }
    &.diff{
      .item{
        .vCenter;
        width: 100%;
        max-width: none;
        background: none;
        padding: 20px;
        padding-left: 0;
        box-shadow: none;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0;
        .img{
          width: 180px;
          height: 96px;
        }
        .content{
          flex: 1;
          padding: 0 12% 0 30px;
        }
        &.check{
          .big{
            visibility: hidden;
          }
        }
      }
      .el-icon-check{
        width: 30px;
        height: 30px;
        margin-right: 30px;
        color: #fff;
        visibility: hidden;
      }
      .big{
        i{
          font-size: 24px;
          margin-left: 20px;
        }
      }
    }
  }
  .move-dialog .btns{
    margin-top: 40px;
    &.hide{
      visibility: hidden;
    }
  }
  .scroll-wrap{
    max-height: 30vh;
    overflow-y: auto;
  }
  @media @mob{
    .tools{
      display: none;
    }
    .list{
      display: block;
      margin-right: 0;
      padding: 0 10px;
      .item{
        .img{
          border-radius: 6px;
          height: 160px;
        }
        width: 100%;
        max-width: 100%;
        margin-bottom: 30px;
        box-shadow: none;
        border-bottom: 1px dashed #ddd;
        .mask{
          display: none;
        }
        .content{
          padding: 10px 0;
        }
        .time{
          padding: 0;
        }
        .news-title{
          height: auto;
          padding-top: 3px;
          margin-bottom: 10px;
          h3{
            font-size: 16px;
          }
        }
      }
    }
    .sep{
      // display: block;
      padding-bottom: 10px;
    }
  }
</style>
