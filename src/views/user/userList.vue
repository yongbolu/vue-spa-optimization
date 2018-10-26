<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.cellphone" placeholder="登录账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <my-table
      :loading="loading"
      border stripe
      :data="tableData"
      :columns="columns"
      @paging-current-change="handleCurrentChange"
      :current-page="queryForm.page+1"
      :page-size="queryForm.size"
      :total="tableTotal">
      <el-table-column align="center" label="操 作" width="220">
        <template slot-scope="scope">
          <el-button @click="$router.push('/order/activity-order?cellphone='+scope.row.cellphone)" type="warning" size="mini">查看
          </el-button>
        </template>
      </el-table-column>
    </my-table>
  </div>
</template>
<script>
  import { getCustomerByCellphone, getCustomerByPage } from '@/api/user'

  export default {
    data () {
      return {
        columns: [
          { prop: 'openId', label: 'openId' },
          { prop: 'cellphone', label: '登录账号' },
          { prop: 'nickName', label: '微信昵称' }
        ],
        tableData: [],
        loading: false,
        tableTotal: 0,
        queryForm: {
          cellphone: null,
          page: 0,
          size: 10
        }
      }
    },
    created () {
      this.getTableData() // 进入页面调用一次
    },
    methods: {
      // 获取table数据
      getTableData () {
        this.loading = true
        let getTableDatafn = getCustomerByPage
        if (this.queryForm.cellphone) {  // 根据是否有参数进行接口调用
          getTableDatafn = getCustomerByCellphone
        }
        getTableDatafn(this.queryForm).then(res => {
          this.loading = false
          if (res.data && res.data.content) {
            this.tableData = res.data.content
            this.tableTotal = res.data.totalElements
          } else if (res.data) {
            this.tableData = [res.data]
            this.tableTotal = res.data.length
          } else {
            this.tableData = []
            this.tableTotal = 0
          }
        }).catch(err => {
          this.tableData = []
          this.tableTotal = 0
          this.loading = false
          console.log(err.data)
        })
      },
      // 分页发生变化事件
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.queryForm.page = val - 1
        this.getTableData()
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-upload__tip {
    color: #66b1ff;
  }
</style>
