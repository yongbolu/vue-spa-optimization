<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.billId" placeholder="订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单创建时间段:">
          <el-date-picker
            v-model="queryForm.dataTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.cellphone" placeholder="收货人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询
          </el-button>
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
      <el-table-column slot="first-column" align="center" label="订单编号" width="150">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="warning" size="mini">{{scope.row.id}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操 作" width="150">
        <template slot-scope="scope">
          <el-button @click="openSaleDialog(scope.row)" type="success" size="mini">售后处理</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 订单信息 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <h4 class="a-row">
        <div class="half-row">
          <span class="title">团购名称:</span>
          <div class="content" v-if="orderMsg.shoppingCartItems[0]">
            {{orderMsg.shoppingCartItems[0].groupbuyItem.groupbuy.gbName}}
          </div>
        </div>
        <div class="half-row">
          <span class="title">所属团长：</span>
          <div class="content">{{orderMsg.agents.agentName}}（{{orderMsg.agents.cellphone}}）</div>
        </div>
      </h4>
      <el-card style="margin-bottom: 20px">
        <ul class="a-row">
          <li class="half-row"><span class="title">订单编号:</span>
            <div class="content">{{orderMsg.id}}</div>
          </li>
          <li class="half-row"><span class="title">订单创建时间:</span>
            <div class="content">{{orderMsg.addTime}}</div>
          </li>
          <li class="half-row"><span class="title">收货人:</span>
            <div class="content">{{orderMsg.receiverName}}</div>
          </li>
          <li class="half-row"><span class="title">收货人手机号码:</span>
            <div class="content">{{orderMsg.receiverCellphone}}</div>
          </li>
          <li class="half-row"><span class="title">订单总金额:</span>
            <div class="content">{{orderMsg.pay|moneyFilter}}</div>
          </li>
          <li class="half-row"><span class="title">订单状态:</span>
            <div class="content">{{orderState(orderMsg)}}</div>
          </li>
          <li class="half-row"><span class="title">提货地点:</span>
            <div class="content">{{orderMsg.agents.address}}</div>
          </li>
        </ul>
      </el-card>
      <el-card>
        <el-table border stripe :data="goodsData">
          <el-table-column label="商品名称" prop="groupbuyItem.commodity.comName" align="center"></el-table-column>
          <el-table-column label="商品数量" prop="buyCount" align="center"></el-table-column>
          <el-table-column label="团购价格" align="center">
            <template slot-scope="scope">
              {{scope.row.groupbuyItem.price|moneyFilter}}
            </template>
          </el-table-column>
          <el-table-column label="总价格" align="center">
            <template slot-scope="scope">
              {{scope.row.groupbuyItem.price * scope.row.buyCount|moneyFilter}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
    <!-- 售后处理弹窗 -->
    <el-dialog :visible.sync="dialogSaleVisible" :close-on-click-modal="false">
      <h4 class="a-row">
        <div class="half-row">
          <span class="title">团购名称:</span>
          <div class="content" v-if="orderMsg.shoppingCartItems[0]">
            {{orderMsg.shoppingCartItems[0].groupbuyItem.groupbuy.gbName}}
          </div>
        </div>
        <div class="half-row">
          <span class="title">所属团长：</span>
          <div class="content">{{orderMsg.agents.agentName}}（{{orderMsg.agents.cellphone}}）</div>
        </div>
      </h4>
      <el-card style="margin-bottom: 20px">
        <ul class="a-row">
          <li class="half-row"><span class="title">订单编号:</span>
            <div class="content">{{orderMsg.id}}</div>
          </li>
          <li class="half-row"><span class="title">订单创建时间:</span>
            <div class="content">{{orderMsg.addTime}}</div>
          </li>
          <li class="half-row"><span class="title">收货人:</span>
            <div class="content">{{orderMsg.receiverName}}</div>
          </li>
          <li class="half-row"><span class="title">收货人手机号码:</span>
            <div class="content">{{orderMsg.receiverCellphone}}</div>
          </li>
          <li class="half-row"><span class="title">订单总金额:</span>
            <div class="content">{{orderMsg.due|moneyFilter}}</div>
          </li>
          <li class="half-row"><span class="title">订单状态:</span>
            <div class="content">{{orderState(orderMsg)}}</div>
          </li>
          <li class="half-row"><span class="title">提货地点:</span>
            <div class="content">{{orderMsg.agents.address}}</div>
          </li>
        </ul>
      </el-card>
      <el-card class="table-box">
        <span class="title">申请退款明细:</span>
        <el-table border stripe :data="customerBill.rejectLogs" style="margin-bottom: 15px">
          <el-table-column label="商品名称" prop="comName" align="center"></el-table-column>
          <el-table-column label="退款数量"  align="center">
            <template slot-scope="scope">
              <el-input-number @change="handleRejectCount(scope.row.rejectCount,scope.row)" size="small"
                               v-model="scope.row.rejectCount"
                               controls-position="right"
                               :min="1" :max="scope.row.buyCount"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="团购价格" align="center">
            <template slot-scope="scope">
              {{scope.row.price|moneyFilter}}
            </template>
          </el-table-column>
          <el-table-column label="退款总价格" align="center">
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.rejectMoney" controls-position="right" :min="0"
                               :max="scope.row.maxCount"
                               :precision="2"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <span class="title">申请退款理由:</span>
        <p class="reject-desc">{{customerBill.rejectDesc}}</p>
        <span class="title">退款/驳回意见:
          <el-tag v-if="customerBill.rejectResult===true" type="success">已同意</el-tag>
          <el-tag v-else-if="customerBill.rejectResult===false" type="danger">已驳回</el-tag>
        </span>
        <el-input :disabled="!btnIsShow" v-model.trim="customerBill.description" type="textarea"/>
      </el-card>
      <div v-if="btnIsShow" slot="footer">
        <el-button :loading="dialogFormLoading" @click="submitDialogData(false)">驳回退款</el-button>
        <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData(true)">同意退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { finishReject, getRejectBill } from '@/api/order'
  import { moneyFilter, orderState } from '@/filters'

  export default {
    filters: { moneyFilter },
    data () {
      const priceFormatter = function (row) {
        return row.due / 100
      }
      return {
        orderState,
        columns: [
          { prop: 'shoppingCartItems[0].groupbuyItem.groupbuy.gbName', label: '活动名称' },
          { prop: 'payTime', label: '订单创建时间' },
          { label: '订单金额', formatter: priceFormatter },
          { label: '订单状态', formatter: orderState }
        ],
        detailList: [
          { title: '订单编号', value: '2054998' },
          { title: '订单创建时间', value: '2015-56-666' },
          { title: '收货人', value: '黄金' }
        ],
        tableData: [],
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        dialogSaleVisible: false,
        loading: false,
        queryForm: {
          dataTime: null,
          billId: null,
          cellphone: '',
          page: 0,
          size: 10
        },
        diaLogForm: {
          name: '',
          phone: '',
          address: ''
        },
        diaLogFormRules: {},
        goodsData: [],
        orderMsg: {
          shoppingCartItems: [],
          agents: {},
          customer: {}
        },
        refundsData: [],    // 退款明细table
        btnIsShow: true,   // 按钮是否能点击
        customerBill: {
          id: null,
          rejectResult: '',  // 退款结果
          description: null,
          success: null,
          rejectLogs: [/* {
            comName: '',
            shoppingCartItem: { id: 12 },
            rejectCount: 0,  // 退款总数
            rejectMoney: 0, // 退款总价
            buyCount: 0,   // 最大数量
            price: 0      // 团购价
          } */]
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
        const toData = this.formatData()
        getRejectBill(toData).then(res => {
          this.loading = false
          if (res.data && res.data.result) {
            this.tableData = res.data.result
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
      formatData () {
        return {
          billId: this.queryForm.billId,  // 订单编号
          start: this.queryForm.dataTime ? this.queryForm.dataTime[0] : null,
          end: this.queryForm.dataTime ? this.queryForm.dataTime[1] : null,
          cellphone: this.queryForm.cellphone,  // 手机号码
          page: this.queryForm.page,
          size: this.queryForm.size
        }
      },
      // 分页发生变化事件
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.queryForm.page = val - 1
        this.getTableData()
      },
      // 打开弹窗
      openDialog (row) {
        this.dialogFormVisible = true
        this.orderMsg = row
        console.log(this.orderMsg)
        this.goodsData = row.shoppingCartItems
      },
      // 退款数量和价格联动
      handleRejectCount (val, row) {
        row.rejectMoney = row.price * val / 100
      },
      // 打开售后弹窗
      openSaleDialog (row) {
        console.log(row)
        this.dialogSaleVisible = true
        this.orderMsg = row
        this.customerBill.id = row.id
        this.customerBill.rejectLogs = row.rejectLogs.map(v => {
          this.btnIsShow = (v.success === null)
          this.customerBill.rejectResult = v.success
          this.customerBill.rejectDesc = v.rejectDesc  // 退款理由
          this.customerBill.description = v.description
          return {
            success: v.success || null,
            comName: v.shoppingCartItem.groupbuyItem.commodity.comName,
            shoppingCartItem: { id: v.shoppingCartItem.id },
            id: v.id,
            rejectCount: v.rejectCount,  // 退款总数
            rejectMoney: v.rejectMoney / 100, // 退款总价
            maxCount: v.rejectMoney / 100, // 退款总价
            buyCount: v.rejectCount,   // 最大数量
            price: v.shoppingCartItem.groupbuyItem.price      // 团购价
          }
        })
      },
      // 提交弹窗数据
      submitDialogData (success) {
        this.dialogFormLoading = true
        const toData = {
          id: this.customerBill.id,
          rejectLogs: []
        }
        toData.rejectLogs = this.customerBill.rejectLogs.map(v => {
          return {
            shoppingCartItem: v.shoppingCartItem,
            id: v.id,
            rejectCount: v.rejectCount,  // 退款总数
            rejectMoney: v.rejectMoney * 100, // 退款总价
            success: success, // 退款总价
            description: this.customerBill.description // 退款总价
          }
        })
        finishReject(toData).then(res => {
          this.dialogFormLoading = false
          if (res.status) {
            this.getTableData()
            this.dialogSaleVisible = false
            this.$message.success(success ? '同意退款成功！' : '驳回退款成功！')
          }
        }).catch(err => {
          this.dialogFormLoading = false
          console.log(err.data)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  h4.a-row {
    padding: 0 20px;
  }

  .a-row {
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    margin-bottom: 20px;
    .half-row {
      margin-bottom: 20px;
      width: 50%;
      display: flex;
      .title {
        width: 120px;
        display: block;
        text-align: right;
        margin-right: 20px;
      }
    }
  }
  .table-box{
    .title{
      display: block;
      margin-bottom: 15px;
    }
  }
  .reject-desc{
    margin-bottom: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 5px 15px;
    line-height: 24px;
    min-height: 30px;
  }
</style>
