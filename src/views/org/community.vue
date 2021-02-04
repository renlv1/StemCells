<template>
  <div class="org-w">
    <div class="search-w">
      <div class="left-w">
        <div class="input-item">
          <div class="label">标题</div>
          <input type="text" placeholder="输入标题" v-model.trim="labelName">
        </div>
        <div class="input-item">
          <button class="search-btn" @click="getData(1)">查询</button>
        </div>
      </div>
      <div class="btn-w">
        <button class="btn-item"  @click="$router.push(`/org/community/communityDetails`)">新增</button>
      </div>
    </div>
    <load-more  :list="orgList" :total="total" @change="getData"  :pageSize="pageSize">
      <div class="list">
        <table class="table-w">
          <thead>
          <tr>
            <td>序号</td>
            <td>公开课标题</td>
            <td>状态</td>
            <td>修改时间</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr @click="$router.push(`/org/community/communityDetails?dataObj=${JSON.stringify(item)}`)" v-for="(item, index) in orgList" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.title}}</td>
            <td>{{typeFn(item.status)}}</td>
            <td>{{item.updateAt | time}}</td>
            <td class="editor-a">修改</td>
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
				orderId: '',
				labelName: '',
				tagArr: [],
				backupArr: [],
				total: 0,
				totalRecord: 0,
				orgList: [],
				typeText: '',
				typeArr: [
					{id: '', text: '全部'},
					{id: 1, text: '失效'},
					{id: 0, text: '正常'},
				],
				typeId: '',
				pageIndex: 1,
				pageSize: 20,
			}
		},
		created () {
		},
		methods: {
			//  0正常 1失效
			statusFn (state) {
				if (state === 1) return '失效'
				if (state === 0) return '正常'
				return '-'
			},
			typeFn (state) { //类型：1未审核 2正常 3审核未通过 4删除 5草稿箱  6下架
				if (state === 1) return '未审核'
				if (state === 2) return '正常'
				if (state === 3) return '审核未通过'
				if (state === 4) return '删除'
				if (state === 5) return '草稿箱'
				if (state === 6) return '下架'
				return '-'
			},
			getData (pageIndex) {
				if (pageIndex) {
					this.pageIndex = pageIndex
				}
				this.$fetch.post('/hospital/getCommunityList', {
					title: this.labelName,
					pageIndex:  this.pageIndex,
					pageSize: this.pageSize,
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
      thead{
        background-color: #e5e5e5;
      }
      .editor-a{
        color: #47a4eb;
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
