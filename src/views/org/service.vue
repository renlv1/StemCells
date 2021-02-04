<template>
  <div class="org-w">
    <div class="search-w">
      <div class="left-w">
        <div class="input-item">
          <div class="label">服务ID</div>
          <input type="text" placeholder="输入服务ID" v-model.trim="hosId">
        </div>
        <div class="input-item">
          <div class="label">机构ID</div>
          <input type="text" placeholder="输入机构ID" v-model.trim="hospitalId">
        </div>
        <div class="input-item">
          <button class="search-btn" @click="getData(1)">查询</button>
        </div>
      </div>
      <div class="btn-w">
        <button class="btn-item" @click="$router.push(`/org/service/serviceDetail?add=1`)">新增</button>
<!--        <button class="btn-item">修改</button>-->
      </div>
    </div>
    <load-more  :list="orgList" :total="total" @change="getData"  :pageSize="pageSize">
      <div class="list">
        <table class="table-w">
          <thead>
          <tr>
            <td>序号</td>
            <td>服务名称</td>
            <td>图片</td>
            <td>所属机构</td>
            <td>关联机构ID</td>
            <td>添加时间</td>
            <td>修改时间</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr @click="$router.push(`/org/service/serviceDetail?dataObj=${JSON.stringify(item)}`)" v-for="(item, index) in orgList" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.serviceName}}</td>
            <td><div :style="`background-image:url(${item.serviceIcon})`" class="img-bg" ></div></td>
            <td>{{item.hospitalName}}</td>
            <td>{{item.hospitalId}}</td>
            <td>{{item.createTime | time}}</td>
            <td>{{item.createTime | time}}</td>
            <td class="btn-c">修改</td>
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
				hosId: '',
				hospitalId: '',
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
        this.$fetch.post('/hospital/getServiceList', {
	        id: this.hosId,
	        status: 0,
	        hospitalId: this.hospitalId,
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
  .total-t{
    margin-top: -55px;
  }
  .search-w{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
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
    .btn-c{
      color: #47a4eb;
    }
    thead{
      background-color: #e5e5e5;
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
      .img-bg{
        width: 40px;
        height: 40px;
        margin: 5px 0;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
    tr{
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #d1d1d1;

      td{
        height: 40px;
        line-height: 40px;
        &:nth-child(1) {
          padding-left: 10px;
        }
      }
    }
    .a-t{
      cursor: pointer;
      color: #2c8eff;
    }
  }
}
</style>
