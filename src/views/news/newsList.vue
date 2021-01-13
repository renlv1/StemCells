<template>
  <div class="c-page">
    <app-header hideReturn>{{$lang === 'cn' ? '资讯列表' : 'News'}}</app-header>
    <div class="row sep">
      <tab class="folder-tab" :arr="[{fileName: $t('common.all')}, ...$store.state.folderList]" :activeIndex.sync="tabIndex"></tab>
      <div class="row">
        <div v-if="isPC">
          <button :disabled="disable" class="btn small" @click="createFolder">{{$t('news.t1')}}</button>
          <button :disabled="disable" class="btn small" @click="showFolderEdit = true">{{$t('news.t2')}}</button>
        </div>
        <div v-else>
          <el-dropdown v-if="!disable" trigger="click" @command="foldManager">
            <div><img height="20px" src="@img/edit2.png" alt=""></div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  :command="1">{{$t('news.t1')}}</el-dropdown-item>
              <el-dropdown-item  :command="2">{{$t('news.t2')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="tools row">
      <div class="vCenter" v-if="selectedNewsList.length">
        <div class="action">
          <span @click="deleteNews()">{{$t('common.delete')}}</span>
          <span @click="showMove = true">{{$t('news.t3')}}</span>
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
      <div class="vCenter">
        <input type="text" v-model="searchVal">
        <div class="btn small" @click="search">{{$t('news.t10')}}</div>
        <el-dropdown trigger="click" @command="jumpNews">
          <button class="btn small" :disabled="disable">{{$t('news.t11')}}</button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-for="(item, index) in [...$t('news.arr1'), '论文']" :key="index" :command="index + 1">{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <load-more ref="loadMore" :list="list" :total="total" @change="getData" :pageSize="pageSize">
      <div class="list" :class="{diff: diffShow}">
        <div class="item" :class="{check: selectedNewsList.includes(item.newsId)}" v-for="(item, index) in list" :key="index">
          <i v-if="diffShow" class="el-icon-check" @click="selectNews(item.newsId)"></i>
          <div class="img pointer" @click="jump(item)" :style="`background-image:url(${item.fileCover || item.imgUrl[0] || require(`@img/empty_img_${$lang}.png`)})`">
            <i class="el-icon-video-play" v-if="item.fileType === 2"></i>
          </div>
          <div class="content">
            <div class="news-title pointer" ><h3 @click="jump(item)">{{item.title}}</h3></div>
            <div class="cgray time">{{$t('news.t12')}}{{item.releaseAt || item.updateTime | time}}</div>
            <!--  "status": 6,//资讯状态  1正常 2删除 3根源删除 4未审核  5审核未通过 6.未提交 7.文件夹删除 8.定时发送 -->
            <div class="row">
              <span>{{(item.fileName === '默认' && $lang === 'en') ? 'Default' : item.fileName}}</span>
              <span class="cblue" v-if="item.status == 1">{{$t('news.t13')}}</span>
              <span class="cblue" v-else-if="item.status == 4">{{$t('news.t14')}}</span>
              <span class="cred" v-else-if="item.status == 5">{{$t('news.t15')}}</span>
              <span class="cblue" v-else-if="item.status == 6">{{$t('news.t16')}}</span>
              <span class="cblue" v-else-if="item.status == 8">{{$t('news.t17')}}</span>
              <span class="cblue" v-else-if="item.status == 10">{{$t('news.t49')}}</span>
            </div>
            <div class="row">
              <span></span>
              <!-- <span class="cblue">查看评论</span> -->
              <!-- <span class="cred" v-if="item.status == 5">查看原因</span> -->
              <span class="cred" v-if="item.status == 8" style="font-size: 13px;">{{item.publishTime | time}}</span>
              <span class="cblue pointer" v-if="(item.status == 6 || item.status == 10) && (diffShow || !isPC)" @click="publishNews(item.newsId)">{{$t('news.t18')}}</span>
              <!-- <div class="cblue pointer" v-if="item.status == 1 && (diffShow || !isPC)" @click="publishNews(item.newsId, true)">{{$t('news.t51')}}</div> -->
            </div>
          </div>
          <div class="mask" v-if="!diffShow">
            <div class="allCenter">
              <i class="el-icon-check" @click="selectNews(item.newsId)"></i>
              <div class="vCenter">
                <i class="el-icon-edit-outline" :class="{hide: item.fileType == 3 || item.status === 4 || item.status === 8}" @click="jump(item, 2)"></i>
                <i style="font-size:20px" @click="deleteNews(item.newsId)" class="el-icon-delete"></i>
              </div>
            </div>
            <div class="link-wrap">
              <div class="link" @click="jump(item)">{{$t('news.t34')}}</div>
              <div class="link" v-if="item.status == 6 || item.status == 10" @click="publishNews(item.newsId)">{{$t('news.t18')}}</div>
              <div class="link" v-if="item.status == 1" @click="publishNews(item.newsId, true)">{{$t('news.t51')}}</div>
            </div>
          </div>
          <div class="vCenter big" v-else>
            <i class="el-icon-edit-outline" :class="{hide: item.status === 4 || item.status === 8}" @click="jump(item, 2)"></i>
            <i class="el-icon-delete" @click="deleteNews(item.newsId)"></i>
          </div>
        </div>
      </div>
    </load-more>

    <el-dialog class="move-dialog" :visible.sync="showMove">
      <div class="dialog-tit">{{$t('news.t3')}}</div>
      <div class="scroll-wrap">
        <div class="item" @click="folderId = item.id" v-for="(item, index) in $store.state.folderList" :key="index">
          <i class="el-icon-check" :class="{active: item.id === folderId}"></i>
          <span>{{item.fileName}}</span>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="moveNews">{{$t('news.t19')}}</div>
        <div class="btn plain" @click="showMove = false">{{$t('news.t7')}}</div>
      </div>
    </el-dialog>
    <el-dialog class="move-dialog" :visible.sync="showFolderEdit">
      <div class="dialog-tit">{{$t('news.t20')}}</div>
        <!-- <div>批量处理</div> -->

      <div class="item" @click="selectAllFolder">
        <i class="el-icon-check" :class="{active: selectedFolderList.length === folderList.length}"></i>
        <span>{{$t('news.t6')}}</span>
      </div>
      <div class="scroll-wrap">
        <div class="item" @click="selectFolder(item.id)" v-for="(item, index) in folderList" :key="index">
          <i class="el-icon-check" :class="{active: selectedFolderList.includes(item.id)}"></i>
          <span class="f1">{{item.fileName}}</span>
          <!-- <i style="font-size:20px" @click="deleteFolder(item.id)" class="el-icon-delete"></i> -->
          <i style="font-size:20px; margin-left: 14px;" v-if="item.backup1 !== 1"  @click.stop="editFolder(item.id)" class="el-icon-edit-outline"></i>
        </div>
      </div>
      <div class="btns" :class="{hide: !selectedFolderList.length}">
        <div class="btn red" @click="showConfirmDelete = true">{{$t('common.delete')}}</div>
        <div class="btn plain" @click="showFolderEdit = false">{{$t('news.t7')}}</div>
      </div>
    </el-dialog>
    <el-dialog class="move-dialog delete-confirm" :visible.sync="showConfirmDelete">
      <div class="dialog-tit">{{$t('news.t21')}}</div>
      <div class="delete-tips">{{$t('news.t22')}}（<span v-for="(item, index) in selectedFolderList" :key="index">{{(folderList.find(it => it.id === item)).fileName}}</span>）{{$t('news.t23')}}？</div>
      <el-checkbox v-model="deepDelete">{{$t('news.t24')}}</el-checkbox>
      <div class="btns">
        <div class="btn red" @click="deleteFolder()">{{$t('common.delete')}}</div>
        <div class="btn plain" @click="showConfirmDelete = false">{{$t('news.t7')}}</div>
      </div>
    </el-dialog>

    <el-dialog class="dialog dialog-tips" :visible.sync="showTips">
      <div class="tit"><i class="el-icon-warning"></i>{{$t('home.t9')}}</div>
      <div class="desc">{{$t('home.t10')}}<span class="cred">{{$store.state.user.auditDesc}}</span></div>
      <router-link @click.native="showTips = false" to="/auth" class="cblue">{{$t('home.t11')}}</router-link>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      pageSize: 10,
      list: [],
      selectedNewsList: [],
      diffShow: false,
      pageIndex: 1,
      showMove: false,
      showFolderEdit: false,
      showConfirmDelete: false,
      folderId: '',
      selectedFolderList: [],
      total: -1,
      deepDelete: false,
      searchVal: '',
      tabIndex: 0,
      showTips: false,
    };
  },
  computed: {
    folderList () {
      return this.$store.state.folderList
    },
    disable () {
      return this.$store.state.user.newsStatus !== 1
    }
  },
  watch: {
    tabIndex () {
      this.getData()
    },
    $route (to, from) {
      if (to.path.includes('/newsList') && !from.path.includes('/newsDetail')) {
        this.$refs.loadMore.resetPageIndex()
        this.pageIndex = 1
        this.tabIndex = 0
      }
    }
  },
  mounted () {
    this.$store.dispatch('getFolderList')
  },
  activated () {
    this.showTips = this.$store.state.user.newsStatus === 4 && !this.isPC
    this.selectedNewsList = []
    this.selectedFolderList = []
    this.searchVal = ''
    this.folderId = ''
    this.$store.commit('SET_CURRENT_NEWS', null)

    if (this.isPC) {
      this.getData(this.pageIndex)
    }

    if (!this.isPC && window.refreshList) {
      window.refreshList = false
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
      this.getData()
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
      } else {
        this.pageIndex = 1
      }
      this.$fetch.post('/back/queryNewsList', {
        data: this.searchVal,
        fileId: this.tabIndex === 0 ? '' : this.folderList[this.tabIndex - 1].id,
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
    search () {
      this.pageIndex = 1
      if (this.tabIndex !== 0) {
        this.tabIndex = 0
      } else {
        this.getData()
      }
    },
    selectNews (id) {
      let idx = this.selectedNewsList.findIndex(item => item === id)
      if (idx > -1) {
        this.selectedNewsList.splice(idx, 1)
      } else {
        this.selectedNewsList.push(id)
      }
    },
    selectFolder (id) {
      let idx = this.selectedFolderList.findIndex(item => item === id)
      if (idx > -1) {
        this.selectedFolderList.splice(idx, 1)
      } else {
        this.selectedFolderList.push(id)
      }
    },
    selectAllFolder () {
      let list = []
      if (this.folderList.length !== this.selectedFolderList.length) {
        this.folderList.forEach(item => {
          list.push(item.id)
        })
      }
      this.selectedFolderList = list
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
    moveNews () {
      if (!this.folderId) {
        this.$message.error(this.$t('news.t27'))
      } else {
        this.$fetch.post('/back/moveCustomFile', {
          newsId: this.selectedNewsList.join(','),
          fileId: this.folderId
        }).then(res => {
          if (res.success) {
            this.$message.success(this.$t('news.t28'))
            this.selectedNewsList = []
            this.getData()
            this.showMove = false
          }
        })
      }
    },
    createFolder () {
      this.$prompt(this.$t('news.t29')).then(({value}) => {
        if (!value) {
          this.$message.error(this.$t('news.t7'))
        } else {
          this.$fetch.post('/back/addUpdateFile', {
            name: value
          }).then(res => {
            if (res.success) {
              this.$message.success(this.$t('news.t30'))
              this.$store.dispatch('getFolderList')
            }
          })
        }
      })
    },
    editFolder (fileId) {
      this.$prompt(this.$t('news.t29')).then(({value}) => {
        if (!value) {
          this.$message.error(this.$t('news.t7'))
        } else {
          this.$fetch.post('/back/addUpdateFile', {
            name: value,
            fileId,
          }).then(res => {
            if (res.success) {
              this.$message.success(this.$t('news.t31'))
              this.$store.dispatch('getFolderList')
            }
          })
        }
      })
    },
    deleteFolder (id) {
      if (!id) {
        id = []
        this.selectedFolderList.forEach(item => {
          id.push(item)
        })
        id = id.join(',')
      }
      this.$fetch.post('/back/deleteFile', {
        fileId: id,
        deleteType: this.deepDelete ? 1 : 2,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$message.success(this.$t('news.t26'))
          this.showConfirmDelete = false
          this.selectedFolderList = []
          this.$store.dispatch('getFolderList')
          this.getData()
        }
      })
    },
    jumpNews (i) {
      this.$router.push(`/news/createNews?type=${i}`)
    },
    foldManager (i) {
      if (i === 1) {
        this.createFolder()
      } else {
        this.showFolderEdit = true
      }
    },
    publishNews (newsId, isUnder) {
      let operateType = isUnder ? 2 : 1
      let tips = isUnder ? this.$t('news.t48') : this.$t('news.t32')
      this.$confirm(tips).then(() => {
        this.$fetch.post('/back/publishNews', {
          newsId,
          operateType,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success(isUnder ? this.$t('news.t47') : this.$t('news.t33') )
            this.getData()
          } else {
            this.$message.erro(res.msg)
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
    @media @mob{
      padding-bottom: 0 !important;
    }
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
        margin-bottom: 22px;
        box-shadow: none;
        border-bottom: 1px dashed #ddd;
        .mask{
          display: none;
        }
        .content{
          padding: 10px 0 20px;
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

  .dialog-tips{
    /deep/ .el-dialog{
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
</style>

<style lang="less">

.tab.folder-tab {
  flex: 1;
  @media @mob{
    margin-right: 10px !important;
    .item{
      width: auto !important;
      padding: 6px 16px !important;
      height: auto !important;
    }

  }
}
</style>

