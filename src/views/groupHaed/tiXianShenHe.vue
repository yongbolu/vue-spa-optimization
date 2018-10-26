<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.cellphone" placeholder="手机号码" clearable></el-input>
        </el-form-item>
        <!--<el-form-item>
          <el-input v-model="queryForm.agentName" placeholder="姓名" clearable></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-date-picker
            v-model="queryForm.dataTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            start-placeholder="申请提现开始时间"
            end-placeholder="申请提现结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.examine" placeholder="提现状态">
            <el-option
              v-for="item in examineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
      <el-table-column align="center" label="操 作" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.examined" @click="openDialog(scope.row,'查看详情')" type="warning" size="mini">查看
          </el-button>
          <el-button v-if="!scope.row.examined" @click="openDialog(scope.row,'审核提现')" type="success" size="mini">审核
          </el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 提现审核弹窗 -->
    <el-dialog :title="dialogType" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        :rules="diaLogFormRules"
        size="medium" :model="diaLogForm"
        label-width="120px">
        <el-form-item label="姓名：">{{diaLogForm.agents.agentName||'--'}}</el-form-item>
        <el-form-item label="手机号码：">{{diaLogForm.agents.cellphone||'--'}}</el-form-item>
        <el-form-item label="提现时间：">{{diaLogForm.examineTime||'--'}}</el-form-item>
        <el-form-item label="提现金额：">{{diaLogForm.amount | moneyFilter}} 元</el-form-item>
        <el-form-item label="账户余额：">
          <el-button v-if="!balanceVisible" type="text" @click="getBalance">查看</el-button>
          <template v-else>{{diaLogForm.balance|moneyFilter}}</template>
        </el-form-item>
        <el-form-item v-if="dialogType==='审核提现'" label="审核提现金额：" prop="examineAmountCope">
          <el-input-number size="small" v-model="diaLogForm.examineAmountCope" controls-position="right" :min="0"
                           :precision="2" :max="maxBalance"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType==='审核提现'" :loading="dialogFormLoading" type="primary" @click="submitDialogData">审
          核
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { examineWithdraw, getAgentsByIds, getWithdrawList } from '@/api/groupHead'
  import { moneyFilter } from '@/filters'

  export default {
    filters: { moneyFilter },
    data () {
      const examineStatusFormatter = function (row, column, cellValue, index) {
        return row.examined ? '已提现' : '未提现'
      }
      const moneyFormatter = row => (row.amount / 100).toFixed(2)
      const validateExamineAmountCope = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('审核提现金额必须大于0'))
        } else if (value > this.diaLogForm.balance) {
          callback(new Error('提现金额不能大于账户余额'))
        } else {
          callback()
        }
      }
      return {
        columns: [
          { prop: 'agents.agentName', label: '姓名' },
          { prop: 'agents.cellphone', label: '手机号码' },
          { label: '提现金额', formatter: moneyFormatter },
          { prop: 'examineTime', label: '提现时间' },
          { prop: 'examined', label: '提现状态', formatter: examineStatusFormatter }
        ],
        tableData: [],
        examineOptions: [{ value: null, label: '全部' }, { value: true, label: '已提现' }, { value: false, label: '未提现' }],
        tableSelecedData: [],  // 表格多选选中数据
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        loading: false,
        dialogType: '查看',
        balanceVisible: false,
        maxBalance: 0,
        queryForm: {
          dataTime: null,
          agentName: '',
          cellphone: '',
          examine: null,
          page: 0,
          size: 10
        },
        diaLogForm: {
          agentName: '',
          cellphone: '',
          amount: '',        // 金额
          examineTime: '',
          examineAmountCope: null, // 提现金额
          balance: 0,  // 用户余额
          agents: {}
        },
        diaLogFormRules: {
          examineAmountCope: [
            { required: true, message: '请输入审核提现金额', trigger: 'blur' },
            { validator: validateExamineAmountCope, trigger: 'blur' }
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
        const toData = this.formatQueryForm()
        getWithdrawList(toData).then(res => {
          this.loading = false
          if (res.data) {
            this.tableData = res.data.content
            this.tableTotal = res.data.totalElements
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
      // 格式化 查询表单数据数据
      formatQueryForm () {
        return {
          agentName: this.queryForm.agentName,
          cellphone: this.queryForm.cellphone,
          examine: this.queryForm.examine,
          page: this.queryForm.page,
          size: this.queryForm.size,
          start: this.queryForm.dataTime ? this.queryForm.dataTime[0] : null,
          end: this.queryForm.dataTime ? this.queryForm.dataTime[1] : null
        }
      },
      // 分页发生变化事件
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.queryForm.page = val - 1
        this.getTableData()
      },
      // 打开弹窗
      openDialog (row, dialogType) {
        this.dialogType = dialogType    // 打开弹窗的类型
        this.dialogFormVisible = true   // 打开弹窗
        this.diaLogForm = row           // 把表格行内数据 赋值给弹窗
        this.diaLogForm.balance = 0 // 置空余额
        this.maxBalance = 0
        this.balanceVisible = false
        getAgentsByIds({ ids: [row.agents.id] }).then(res => {
          if (res.status) {
            this.maxBalance = res.data[0].balance / 100
          }
        }).catch(err => {
          console.log(err.data)
        })
      },
      // 提交弹窗数据
      submitDialogData () {
        if (!this.balanceVisible) {
          this.$message.warning('请先查看余额！')
          return
        }
        this.$refs['diaLogForm'].validate(valid => {
          if (valid) {
            this.formatDiaLogForm()
            this.dialogFormLoading = true
            examineWithdraw(this.diaLogForm).then(res => {
              this.dialogFormLoading = false
              if (res.status) {
                this.$message.success('审核提现成功')
                this.dialogFormVisible = false
                this.getTableData()
              }
            }).catch(err => {
              this.dialogFormLoading = false
              console.log(err.data)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 格式化弹窗提交数据
      formatDiaLogForm () {
        this.diaLogForm.examineAmount = (this.diaLogForm.examineAmountCope * 100)
      },
      // 查看余额
      getBalance () {
        getAgentsByIds({ ids: [this.diaLogForm.agents.id] }).then(res => {
          if (res.status) {
            this.diaLogForm.balance = res.data[0].balance
            this.maxBalance = res.data[0].balance / 100
            this.balanceVisible = true
          }
        }).catch(err => {
          console.log(err.data)
        })
      }
    }
  }
</script>
