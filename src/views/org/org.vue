<template>
  <div class="org-w">
    <div class="search-w">
      <div class="left-w">
        <div class="input-item">
          <div class="label">ID</div>
          <input type="text" placeholder="输入用户名" v-model.trim="orderId">
        </div>
        <div class="input-item">
          <div class="label">机构名称</div>
          <input type="text" placeholder="输入机构名称" v-model.trim="hospitalName">
        </div>
        <div class="input-item">
          <div class="label">状态</div>
          <div class="dropdown-wrap">
            <el-dropdown @command="commandChange">
                            <span class="el-dropdown-link">
                              {{typeText || '全部'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item,index) in  typeArr"
                                  :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="input-item">
          <button class="search-btn" @click="getData(1)">查询</button>
        </div>
      </div>
      <div class="btn-w">
        <button class="btn-item" @click="$router.push('/org/orgIndex/orgAdd')">新增</button>
      </div>
    </div>
    <load-more  :list="orgList" :total="total" @change="getData" :pageSize="pageSize">
      <div class="list">
        <table class="table-w">
          <thead>
          <tr>
            <td>序号</td>
            <td>机构名称</td>
            <td>具体位置</td>
            <td>评分</td>
            <td>标签</td>
            <td class="status-a">状态</td>
            <td>人均价格</td>
            <td>电话</td>
            <td>基础设施</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in orgList" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.hospitalName}}</td>
            <td>{{item.location}}</td>
            <td>{{$empty(item.score)}}</td>
            <td>{{labFn(item.labelList)}}</td>
            <td class="status-a">{{stateFn(item.backup1)}}</td>
            <td>{{$empty(item.backup3)}}</td>
            <td>{{item.mobile}}</td>
            <td>{{labFn(item.deviceList)}}</td>
            <td class="a-t">
              <div class="btn-1" @click="$router.push('/org/service/serviceDetail?id=' + item.id + '&name=' + item.hospitalName)">添加服务</div>
              <div  class="btn-1" @click="$router.push('/org/orgIndex/orgAdd?id=' + item.id)">修改</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </load-more>
    <div class="total-t" v-show="orgList.length > 0">共计：{{total}}条数据</div>
  </div>
</template>

<script>
  /*eslint-disable*/
	export default {
		data () {
			return {
				pageSize: 20,
				orderId: '',
				hospitalName: '',
				tagArr: [],
				backupArr: [],
				total: 0,
				orgList: [],
				typeText: '',
				typeArr: [
					{id: '', text: '全部'},
					{id: 1, text: '失效'},
					{id: 0, text: '正常'},
        ],
        typeId: '',
				pageIndex: 1,
      }
    },
    created () {
    },
    methods: {
	    labFn (arr) {
	    	if (arr) return arr.join('/')
        return '-'
      },
	    stateFn (state) {
		    if (state === 1) return '失效'
		    if (state === 0) return '正常'
        return '-'
      },
	    commandChange (item) {
        this.typeText = item.text
        this.typeId = item.id
      },
	    getData (pageIndex) {
		    if (pageIndex) {
			    this.pageIndex = pageIndex
		    }
        this.$fetch.post('/hospital/queryHospitalList', {
        	id: this.orderId,
	        hospitalName: this.hospitalName,
	        backup1: this.typeId,
          pageIndex:  this.pageIndex,
          pageSize: 20,
	        loading: true,
        }).then(res => {
          if (res.success) {
            this.orgList = res.data.results
            this.total = res.data.totalRecord
          }
        })
      },
    }
	}
</script>

<style scoped lang="less">
.org-w{
  @media screen and (max-width: 1400px){
    padding: 30px 10px;
  }
  .total-t{
    margin-top: -55px;
  }
  .search-w{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    @media screen and (max-width: 1400px){
      justify-content: flex-start;
      flex-wrap: nowrap;
    }
    .left-w{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .input-item{
        display: flex;
        align-items: center;
        margin-right: 30px;
        margin-bottom: 30px;
        .el-dropdown-link{
          width: 168px;
          height: 34px;
          border-radius: 4px;
          padding: 0 10px;
          border: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .search-btn{
          width: 100px;
          height: 34px;
          background-color: #0088ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border-radius: 4px;
        }
        .label{
          font-size: 14px;
          margin-right: 20px;
        }
        input{
          width: 168px;
          height: 34px;
          border-radius: 4px;
          padding-left: 10px;
          border: 1px solid #e8e8e8;
        }
      }
    }
    .btn-w{
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      @media screen and (max-width: 1400px){
        margin-top: 36px;
        margin-bottom: 0;
      }
      @media screen and (max-width: 1200px){
        margin-bottom: 30px;
        margin-top: 0;
      }
      .btn-item{
        width: 100px;
        height: 34px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 30px;
        &:nth-child(1) {
          background-color: #0088ff;
          color: #fff;
        }

        &:nth-child(2) {
          color: #0088ff;
          background-color: rgba(0,136,255,.2);
        }
      }
    }
  }
  .table-w{
    font-size: 14px;
    color: #707070;
    thead{
      background-color: #e5e5e5;
    }
    .status-a{
      padding: 0 10px;
    }
    tbody{
      border-left: 1px solid #d1d1d1;
      border-right: 1px solid #d1d1d1;
      tr{
        cursor: pointer;
        &:hover{
          background-color: #e5e5e5;
        }
      }
    }
    tr{
      height: 40px;
      border-bottom: 1px solid #d1d1d1;

      td{
        height: 40px;
        /*line-height: 40px;*/
        &:nth-child(1) {
          padding-left: 10px;
        }
      }
    }
    .a-t{
      cursor: pointer;
      color: #2c8eff;
      padding: 0;
      height: 50px;
      line-height: initial;
      display: flex;
      align-items: center;
      white-space: nowrap;
      .btn-1{

        height: 15px;
        width: 100%;
        padding: 0 5px;
        &:nth-child(1) {
          top: 0;
        }
        &:nth-child(2) {
          top: 24px;
        }
      }
    }
  }
}
</style>
