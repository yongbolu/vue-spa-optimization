<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.billId" placeholder="订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select v-model="queryForm.billStatus" placeholder="全部" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单时间段:">
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
          <el-input v-model="queryForm.cellphone" placeholder="手机号码" clearable></el-input>
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
      <el-table-column slot="first-column" align="center" label="订单编号" width="120">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="warning" size="mini">{{scope.row.id}}</el-button>
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
  </div>
</template>
<script>
  import { getBills } from '@/api/order'
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
          { prop: 'addTime', label: '订单时间' },
          { label: '订单金额', formatter: priceFormatter },
          { prop: 'receiverName', label: '提货人' },
          { prop: 'receiverCellphone', label: '手机号码' },
          { label: '订单状态', formatter: orderState },
          { prop: 'agents.agentName', label: '所属团长' }
        ],
        tableData: [],
        goodsData: [],
        options: [
          { value: 1, label: '未支付' },
          { value: 0, label: '已支付' },
          { value: 2, label: '已发货' },
          { value: 3, label: '已完成' }
        ],
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        loading: false,
        queryForm: {
          billId: null,  // 订单编号
          billStatus: null, // 订单状态
          start: null,
          end: null,
          cellphone: null,  // 手机号码
          page: 0,
          size: 10,
          dataTime: null
        },
        orderMsg: {
          shoppingCartItems: [],
          agents: {},
          customer: {}
        }
      }
    },
    created () {
      this.queryForm.cellphone = this.$route.query.cellphone
      this.getTableData() // 进入页面调用一次
    },
    methods: {
      // 获取table数据
      getTableData () {
        this.loading = true
        const toData = this.formatData()
        getBills(toData).then(res => {
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
      formatData () {
        return {
          billId: this.queryForm.billId,  // 订单编号
          billStatus: this.queryForm.billStatus, // 订单状态
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
        this.goodsData = row.shoppingCartItems
        console.log(this.orderMsg)
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
</style>
