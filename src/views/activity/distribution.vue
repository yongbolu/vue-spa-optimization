<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.gbName" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="结束时间段:">
          <el-date-picker
            v-model="queryForm.dataTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="是否完成配送:">
          <el-select v-model="queryForm.picked" placeholder="全部" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
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
      <el-table-column align="center" label="配送单" width="150">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="warning" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="是否配送完成" width="150">
        <template slot-scope="scope">
          &#45;&#45;
        </template>
      </el-table-column>-->
    </my-table>
    <!-- 新增团长弹窗 -->
    <el-dialog title="配送单详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="70%">
      <div class="distribution-list">
        <el-button id="btn-print" icon="el-icon-printer" type="success" class="btn-print" @click="handlerPrint">打印
        </el-button>
        <div id="distribution-list-warpper">
          <div class="distribution-row">
            <span class="title">团购名称：</span>
            <div class="content">{{dialogForm.gbName}}</div>
          </div>
          <div class="distribution-row">
            <span class="title">活动起止时间：</span>
            <div class="content">{{dialogForm.startTime}} - {{dialogForm.endTime}}</div>
          </div>
          <div class="distribution-row">
            <span class="title">配送信息：</span>
            <div class="content">
              <el-table border stripe :data="dialogFormTableData">
                <el-table-column type="index" label="配送建议" width="80"></el-table-column>
                <el-table-column label="团长信息" width="180">
                  <template slot-scope="scope">
                    {{scope.row.agents.agentName}}（{{scope.row.agents.cellphone}}）
                  </template>
                </el-table-column>
                <el-table-column label="配送点地址" prop="agents.address" width="150"></el-table-column>
                <el-table-column label="配送商品（数量）" width="150">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.items">{{item.itemName}}（{{item.count}}）</p>
                  </template>
                </el-table-column>
                <el-table-column label="签收情况" prop="name">
                  <template slot-scope="scope">
                    {{scope.row.sign?'已签收':'未签收'}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="distribution-row">
          <span class="title">建议配送路线：</span>
          <div class="content">
            <b-map-marker height="500px" :data="mapMarker"></b-map-marker>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import BMapMarker from '@/components/BMapMarker'
  import { getDistributionListByGroupBuyID, queryGroupBuyByPage } from '@/api/activity'

  export default {
    components: { BMapMarker },
    data () {
      return {
        columns: [
          { prop: 'gbName', label: '活动名称' },
          { prop: 'endTime', label: '活动结束时间' }
        ],
        mapMarker: [
          // [116.417854, 39.921988, '李白', 15197155678],
        ],
        tableData: [],
        options: [{ value: true, label: '是' }, { value: false, label: '否' }],
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        loading: false,
        queryForm: {
          gbName: '',
          dataTime: null,
          picked: null,
          page: 0,
          size: 10
        },
        dialogForm: {
          gbName: '',
          startTime: '',
          endTime: ''
        },
        dialogFormTableData: [],
        dialogFormRules: {
          address: [
            { required: true, message: '请输入审核提现金额', trigger: 'blur' }
          ]
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
        const queryData = this.formatQueryData()
        queryGroupBuyByPage(queryData).then(res => {
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
      formatQueryData () {
        const data = {
          gbName: this.queryForm.gbName,
          active: false
        }
        if (this.queryForm.dataTime) {
          data.start = this.queryForm.dataTime[0]
          data.end = this.queryForm.dataTime[1]
        }
        return data
      },
      // 分页发生变化事件
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.queryForm.page = val - 1
        this.getTableData()
      },
      // 打开弹窗
      openDialog (row) {
        this.dialogForm = row
        this.dialogFormTableData = []
        getDistributionListByGroupBuyID({ gpId: row.id }).then(res => {
          if (res.status && res.data) {
            this.dialogFormVisible = true
            this.dialogFormTableData = res.data
            if (res.data.length > 0 && res.data[0].agents.coordinate) {
              const arr = res.data.map(v => {
                const coordinate = v.agents.coordinate.split(',')
                return [...coordinate, v.agents.agentName, v.agents.cellphone, v.agents.address]
              })
              this.mapMarker = arr
            } else {
              this.$message.error('该团长经纬度坐标为空，无法绘制地图！')
            }
          } else {
            this.$message.error('该配送单无任何配送信息！')
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 打印弹窗
      handlerPrint () {
        const subOutputRankPrint = document.getElementById('distribution-list-warpper').innerHTML
        document.body.innerHTML = subOutputRankPrint
        window.print()
        window.location.reload()
        return false
      }
    }
  }
</script>

<style lang="scss">
  .distribution-list {
    list-style: none;
    font-size: 16px;
    position: relative;
    .btn-print {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .distribution-row {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    .title{
      display: block;
      width: 130px;
      text-align: right;
      margin-right: 10px;
    }
    .content{
      flex: 1;
      overflow: hidden;
    }
  }
</style>
