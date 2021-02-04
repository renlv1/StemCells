<template>
  <div class="label-w">
    <div class="back" @click="$router.go(-1)">
      <img src="@img/back.png" alt="">
      <span>返回</span>
    </div>
    <div class="type-w">
      <div class="label">类型</div>
      <el-dropdown @command="commandChange1" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{labelText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  labelArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="save-btn" @click="saveFn">保存</div>
    </div>
    <div class="add-w">
      <div>添加标签</div>
      <div class="add-a" @click="addFn" v-show="!$route.query.dataObj">+新增</div>
    </div>
    <div class="cont-w">
      <div class="tab-w">
        <div class="tab-head">名称</div>
        <div class="a-w">
          <div v-for="(item, index) in nameArr" :key="index" class="flex-item">
            <div class="tab-body" >
              <input type="text" placeholder="请输入名称" v-model="item.name">
            </div>
            <div class="el-icon-remove" @click="deleteFn(index)" v-show="nameArr.length > 1"></div>
          </div>

        </div>

      </div>
      <div class="type-c">
        <div class="label-c">状态</div>
        <el-dropdown @command="commandChange2" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{typeText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
          <el-dropdown-menu class="menu" slot="dropdown">
            <el-dropdown-item :command="item" v-for="(item,index) in  typeArr"
                              :key="index">{{item.text}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
	/*eslint-disable*/
	import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				nameArr: [
          {name: ''}
        ],
				typeText: '正常',
				typeArr: [
					{id: 1, text: '失效'},
					{id: 0, text: '正常'},
				],
				typeId: 0,
				labelText: '标签',
				//类型：1:标签 2:基础设施
				labelArr: [
					{id: 1, text: '标签'},
					{id: 2, text: '基础设施'},
        ],
				labelId: 1,
        dataObj: '',
      }
		},
    created () {
			let dataObj = this.$route.query.dataObj
			if (dataObj) {
				this.dataObj = JSON.parse(dataObj)
        this.labelId = this.dataObj.type
        this.labelText = this.labelArr[this.labelId -1].text
        this.typeId = this.dataObj.status
        if (this.typeId === 1) {
        	this.typeText = '失效'
        } else {
	        this.typeText = '正常'
        }
        this.nameArr = [{name: this.dataObj.labelName}]
      }
    },
    methods: {
	    commandChange1 (v) {
        this.labelText = v.text
        this.labelId = v.id
      },
	    commandChange2 (v) {
        this.typeText = v.text
        this.typeId = v.id
	    },
	    addFn () {
	    	this.nameArr.push({name: ''})
      },
	    deleteFn (index) {
		    this.nameArr.splice(index, 1)
      },
	    saveFn () {
		    Dialog({
          title: '是否保存',
          okFn: ()=> {
          	if (this.$route.query.dataObj) {
		          this.$fetch.post('/hospital/saveLabel', {
			          id: this.dataObj.id, // ;（   编辑服务时，填写    ）
			          labelName: this.nameArr[0].name, // ;（必填）
			          type: this.labelId, // //类型：1:标签 2:基础设施（必填）
			          status: this.typeId, // ;//标签状态 0正常 1失效（必填）
			          loading: true
		          }).then(res => {
			          if (res.success) {
				          Dialog({
					          title: '保存成功',
					          okFn: ()=> {
						          this.$router.go(-1)
					          }
				          })
			          }
		          })
            } else { // 批量保存
          		let listName  = []
		          this.nameArr.forEach(a =>{
			          listName.push(a.name)
              })
		          this.$fetch.postArr('/hospital/saveBatchLabel', {
			          listName: listName, // ;（必填）
			          type: this.labelId, // //类型：1:标签 2:基础设施（必填）
                loading: true
		          }).then(res => {
			          if (res.success) {
				          Dialog({
					          title: '保存成功',
					          okFn: ()=> {
						          this.$router.go(-1)
					          }
				          })
			          }
		          })
            }

          }
        })

      }
    }
	}
</script>

<style scoped lang="less">
.label-w{
  .back{
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    color: #47a4eb;
    img{
      width: 20px;
      margin-right: 5px;
    }
  }
  .dropdown-y{
    width: 300px;
    height: 34px;
    margin: 0 100px 0 20px;
    .el-dropdown-link{
      width: 100%;
      height: 100%;
      border: 1px solid #d1d1d1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }
  }
  .type-w{
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    .label{
      font-size: 16px;
    }


    .save-btn{
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
  }
  .add-w{
    display: flex;
    font-size: 16px;
    margin-bottom: 20px;
    .add-a{
      color: #47a4eb;
      cursor: pointer;
      margin-left: 40px;
    }
  }
  .tab-w{
    /*border: 1px solid #d1d1d1;*/

    .tab-head{
      background-color: #e5e5e5;
      height: 40px;
      width: 320px;
      line-height: 40px;
      padding-left: 20px;
      border: 1px solid #d1d1d1;
    }
    .a-w{
      .flex-item{
        &:nth-child(1) {
          .tab-body{
            border-top:  none;
          }
        }
      }
    }
    .flex-item{
      display: flex;
      align-items: center;
      .el-icon-remove{
        color: #ff4040;
        font-size: 24px;
        cursor: pointer;
        padding-left: 10px;
      }
      .tab-body{
        width: 320px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        border: 1px solid #d1d1d1;
        border-top: none;
        input{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .cont-w{
    display: flex;
    .type-c{
      margin-left: 80px;
      font-size: 16px;
      .label-c{
        font-size: 16px;
        line-height: 40px;
        height: 40px;
      }
      .dropdown-y{
        margin: 0;
        height: 40px;
      }
    }
  }
}
</style>
