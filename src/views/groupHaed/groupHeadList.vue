<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item label="手机号码">
          <el-input v-model="queryForm.cellphone" placeholder="手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryForm.agentName" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="getTableData">查询
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button :disabled="batchDeletDisabled" size="medium" type="danger" icon="el-icon-delete" @click="batchDelet">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="openDialog(null,'新增团长')">新增</el-button>
      </div>
    </div>
    <my-table
      :loading="loading"
      @selection-change="tableSelectChange"
      border stripe
      :data="tableData"
      :columns="columns"
      @paging-current-change="handleCurrentChange"
      :current-page="queryForm.page+1"
      :page-size="queryForm.size"
      :total="tableTotal">
      <el-table-column align="center" label="操 作" width="230">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.examine" @click="openDialog(scope.row,'审核团长')" type="success" size="mini">审核
          </el-button>
          <el-button @click="openDialog(scope.row,'编辑团长')" type="primary" size="mini">编辑</el-button>
          <el-button @click="delRow(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 新增团长弹窗 -->
    <el-dialog
      :title="dialogType"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        :rules="diaLogFormRules"
        size="medium" :model="diaLogForm"
        label-width="110px">
        <el-form-item label="姓名" prop="agentName">
          <el-input :disabled="dialogType==='审核团长'" v-model="diaLogForm.agentName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="cellphone">
          <el-input :disabled="dialogType!=='新增团长'" v-model="diaLogForm.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="个性签名" prop="sign">
          <el-input :disabled="dialogType==='审核团长'" v-model="diaLogForm.sign"></el-input>
        </el-form-item>
        <el-form-item label="推荐人手机号码" prop="reCellphone">
          <el-input :disabled="dialogType==='审核团长'" v-model="diaLogForm.reCellphone"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input :disabled="dialogType==='审核团长'" v-model="diaLogForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData">
          {{dialogType==='审核团长'?'审 核':'确 定'}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { validatePhone } from '@/utils/validate'
  import { addAgent, delAgent, examine, getAgentByCellphoneOrName, getAgentsByPage, modifyAgent } from '@/api/groupHead'

  export default {
    data () {
      const validateIsPhone = (rule, value, callback) => {
        if (value) {
          if (!validatePhone(value)) {
            callback(new Error('请输入正确的手机号码'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        columns: [
          { type: 'selection' },
          { prop: 'agentName', label: '姓名', width: '120px' },
          { prop: 'cellphone', label: '手机号码', width: '140px' },
          { prop: 'reCellphone', label: '推荐人手机号码', width: '140px' },
          { prop: 'address', label: '联系地址' }
        ],
        tableData: [],
        loading: false,
        tableSelecedData: [],  // 表格多选选中数据
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        dialogType: '新增团长', // 弹窗类型 新增/编辑/审核
        queryForm: {
          agentName: null,
          cellphone: null,
          page: 0,
          size: 10
        },
        diaLogForm: {
          id: null,
          agentName: '',
          cellphone: '',
          reCellphone: '',
          sign: '',
          address: ''
        },
        diaLogFormRules: {
          agentName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入准确的有效地址', trigger: 'blur' }
          ],
          cellphone: [
            { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
            { validator: validateIsPhone, trigger: 'blur' }
          ],
          reCellphone: [
            { required: false, message: '请输入正确的手机号码', trigger: 'blur' },
            { validator: validateIsPhone, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      batchDeletDisabled () {
        return this.tableSelecedData.length === 0
      }
    },
    created () {
      this.getTableData() // 进入页面调用一次
    },
    methods: {
      // 获取table数据
      getTableData () {
        this.loading = true
        let getTableDatafn = getAgentsByPage
        if (this.queryForm.agentName || this.queryForm.cellphone) {  // 根据是否有参数进行接口调用
          getTableDatafn = getAgentByCellphoneOrName
        }
        getTableDatafn(this.queryForm).then(res => {
          this.loading = false
          if (res.data) {
            if (res.data.content) {  // 处理返回数据
              this.tableData = res.data.content
              this.tableTotal = res.data.totalElements
            } else if (Array.isArray(res.data)) {
              this.tableData = res.data
              this.tableTotal = res.data.length
            } else {
              this.tableData = [res.data]
              this.tableTotal = 0
            }
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
      },
      // 表格复选框选中
      tableSelectChange (val) {
        this.tableSelecedData = val
      },
      delRow (val) {
        this.$confirm('确认删除?', '提示', { type: 'warning' }).then(() => {
          delAgent({ ids: [val] }).then(res => {
            if (res.status) {
              this.getTableData()
              this.$message.success('删除成功!')
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {
        })
      },
      // 批量删除
      batchDelet () {
        this.$confirm('确认批量删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgent({ ids: this.tableSelecedData.map(v => v.id) }).then(res => {
            if (res.status) {
              this.getTableData()
              this.$message.success('删除成功!')
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {})
      },
      // 打开弹窗 的时候进行逻辑处理
      openDialog (row, dialogType) {
        this.diaLogForm = {}
        this.diaLogForm.id = null
        this.diaLogForm.agentName = '' // 清空原有的内容
        this.diaLogForm.cellphone = ''
        this.diaLogForm.reCellphone = ''
        this.diaLogForm.sign = ''
        this.diaLogForm.address = ''
        this.dialogFormVisible = true // 打开 弹窗
        this.dialogType = dialogType
        if (row) {  // id 存在为打开编辑弹窗 或者审核弹窗 合并row 数据到编辑内
          Object.assign(this.diaLogForm, row)
        }
      },
      // 提交弹窗数据
      submitDialogData () {
        this.$refs['diaLogForm'].validate(valid => {
          if (valid) {
            this.dialogFormLoading = true
            switch (this.dialogType) {
              case '新增团长':
                addAgent(this.diaLogForm).then(res => {
                  this.dialogFormLoading = false
                  if (res.status) {
                    this.$message.success('新增团长成功')
                    this.dialogFormVisible = false
                    this.getTableData()
                  }
                }).catch(err => {
                  this.dialogFormLoading = false
                  console.log(err.data)
                })
                break
              case '编辑团长':
                modifyAgent(this.diaLogForm).then(res => {
                  this.dialogFormLoading = false
                  if (res.status) {
                    this.$message.success('编辑团长成功')
                    this.dialogFormVisible = false
                    this.getTableData()
                  }
                }).catch(err => {
                  this.dialogFormLoading = false
                  console.log(err.data)
                })
                break
              case '审核团长':
                examine({ id: this.diaLogForm.id }).then(res => {
                  this.dialogFormLoading = false
                  if (res.status) {
                    this.$message.success('审核团长成功')
                    this.dialogFormVisible = false
                    this.getTableData()
                  }
                }).catch(err => {
                  this.dialogFormLoading = false
                  console.log(err.data)
                })
                break
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
