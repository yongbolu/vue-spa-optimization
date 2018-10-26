<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="getTableData">查询
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button :disabled="batchDeletDisabled" size="medium" type="danger" icon="el-icon-delete" @click="batchDelet">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="openDialog(null)">新增</el-button>
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
      <el-table-column align="center" label="操 作" width="200">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="delRow(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 新增团长弹窗 -->
    <el-dialog :title="isEdit?'编辑分类':'新增分类'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        :rules="diaLogFormRules"
        size="medium" :model="diaLogForm"
        label-width="110px">
        <el-form-item label="分类名称" prop="className">
          <el-input v-model="diaLogForm.className"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input v-model.number="diaLogForm.orderId" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addClass, delClass, getClassByName, getClassByPage, modifyClass } from '@/api/goods'

  export default {
    data () {
      var checkerificaCode = (rule, value, callback) => {
        var r = /^\+?[1-9][0-9]*$/ // 正整数
        var bool = r.test(value)
        if (!bool) {
          return callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      return {
        columns: [
          { type: 'selection' },
          { prop: 'className', label: '分类名称' },
          { prop: 'orderId', label: '排序' }
        ],
        tableData: [],
        tableSelecedData: [],  // 表格多选选中数据
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        loading: false,
        isEdit: false,   // 是否是编辑弹窗
        queryForm: {
          name: '',
          page: 0,
          size: 10
        },
        diaLogForm: {
          className: '',
          orderId: '',
          id: null,
          active: true
        },
        diaLogFormRules: {
          className: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          orderId: [
            { required: true, message: '请输入排序', trigger: 'blur' },
            { validator: checkerificaCode, trigger: 'blur' }
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
      getTableData () {
        this.loading = true
        let getTableDatafn = getClassByPage
        if (this.queryForm.name) {  // 根据是否有参数进行接口调用
          getTableDatafn = getClassByName
        }
        getTableDatafn(this.queryForm).then(res => {
          this.loading = false
          if (res.data.content) {
            this.tableData = res.data.content
            this.tableTotal = res.data.totalElements
          } else if (res.data) {
            this.tableData = [res.data]
            this.tableTotal = 0
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
          delClass({ ids: [val] }).then(res => {
            if (res.status) {
              this.$message.success('删除成功!')
              this.getTableData()
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
          delClass({ ids: this.tableSelecedData.map(v => v.id) }).then(res => {
            if (res.status) {
              this.$message.success('删除成功!')
              this.getTableData()
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {
        })
      },
      // 打开弹窗
      openDialog (row) {
        this.diaLogForm.id = null
        this.diaLogForm.className = '' // 清空原有的内容
        this.diaLogForm.orderId = ''
        this.dialogFormVisible = true
        this.isEdit = !!row
        if (row) {  // row 存在为打开编辑弹窗 或者审核弹窗 合并row 数据到编辑内
          Object.assign(this.diaLogForm, row)
        }
      },
      // 提交弹窗数据
      submitDialogData () {
        this.$refs['diaLogForm'].validate(valid => {
          if (valid) {
            this.dialogFormLoading = true
            const submitFn = this.isEdit ? modifyClass : addClass
            submitFn(this.diaLogForm).then(res => {
              this.dialogFormLoading = false
              if (res.status) {
                this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功！`)
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
      }
    }
  }
</script>
