<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.name" placeholder="供应商名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button :disabled="batchDeletDisabled" size="medium" type="danger" icon="el-icon-delete" @click="batchDelet">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="openDialog(null,'新增供应商')">新增</el-button>
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
      <el-table-column align="center" label="经营分类">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.classifications" :key="item.id">{{item.className}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操 作" width="160">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row,'编辑供应商')" type="primary" size="mini">编辑</el-button>
          <el-button @click="delRow(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 新增团长弹窗 -->
    <el-dialog :title="dialogType" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        :rules="diaLogFormRules"
        size="medium" :model="diaLogForm"
        label-width="120px">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="diaLogForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商账号" prop="supAcc">
          <el-input placeholder="请输入手机号码" :disabled="dialogType==='编辑供应商'" v-model.trim="diaLogForm.supAcc"></el-input>
        </el-form-item>
        <el-form-item label="供应商密码" prop="supPwd" >
          <el-input v-model="diaLogForm.supPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="经营分类" prop="classifications">
          <el-select
            v-model="diaLogForm.classifications" multiple
            value-key="id"
            style="width: 100%">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.className"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        {{diaLogForm.value3}}
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { validatePassword, validatePhone } from '@/utils/validate'
  import { addSupplier, delSupplierByIds, getSupplierByName, getSupplierByPage, modifySupplier } from '@/api/supplier'
  import { getAllClass } from '@/api/goods'

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
      const validateIsPassword = (rule, value, callback) => {
        if (value) {
          if (!validatePassword(value)) {
            callback(new Error('密码长度为6-12位'))
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
          { prop: 'supplierName', label: '供应商名称' },
          { prop: 'supAcc', label: '供应商账号' }
        ],
        tableData: [],
        classOptions: [],
        loading: false,
        tableSelecedData: [],  // 表格多选选中数据
        tableTotal: 0,
        dialogFormVisible: false,
        dialogFormLoading: false,
        dialogType: '新增供应商',   // 是否是编辑弹窗
        queryForm: {
          name: null,
          page: 0,
          size: 10
        },
        diaLogForm: {
          active: true,
          id: null,
          supplierName: '',
          supAcc: '',
          supPwd: '',
          classifications: []
        },
        diaLogFormRules: {
          supplierName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          supAcc: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: validateIsPhone, trigger: 'blur' }
          ],
          supPwd: [
            { required: true, message: '请输入供应商密码', trigger: 'blur' },
            { validator: validateIsPassword, trigger: 'blur' }
          ],
          classifications: [{ type: 'array', required: true, message: '经营分类至少要一个以上', trigger: 'change' }]
        }
      }
    },
    computed: {
      batchDeletDisabled () {
        return this.tableSelecedData.length === 0
      }
    },
    created () {
      this.initData()
      this.getTableData() // 进入页面调用一次
    },
    methods: {
      initData () {
        getAllClass().then(res => {
          if (res.status) {
            this.classOptions = res.data
          }
        }).catch(err => {
          console.log(err.data)
        })
      },
      // 获取table数据
      getTableData () {
        this.loading = true
        let getTableDatafn = getSupplierByPage
        if (this.queryForm.name) {              // 根据是否有参数 更换接口
          getTableDatafn = getSupplierByName
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
      },
      // 表格复选框选中
      tableSelectChange (val) {
        this.tableSelecedData = val
      },
      delRow (val) {
        this.$confirm('确认删除?', '提示', { type: 'warning' }).then(() => {
          delSupplierByIds({ ids: [val] }).then(res => {
            if (res.status) {
              this.getTableData()
              this.$message({ type: 'success', message: '删除成功!' })
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
          delSupplierByIds({ ids: this.tableSelecedData.map(v => v.id) }).then(res => {
            if (res.status) {
              this.getTableData()
              this.$message({ type: 'success', message: '删除成功!' })
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {})
      },
      // 打开弹窗
      openDialog (row, dialogType) {
        this.diaLogForm.id = null        // 清空原有数据
        this.diaLogForm.supplierName = ''
        this.diaLogForm.supAcc = ''
        this.diaLogForm.supPwd = ''
        this.diaLogForm.classifications = []
        this.dialogFormVisible = true
        this.dialogType = dialogType
        this.diaLogFormRules.supPwd[0].required = true
        if (row) {  // row 存在为打开编辑弹窗
          Object.assign(this.diaLogForm, row) // 合并对象
          this.diaLogFormRules.supPwd[0].required = false
        }
      },
      // 提交弹窗数据
      submitDialogData () {
        this.$refs['diaLogForm'].validate(valid => {
          if (valid) {
            this.dialogFormLoading = true
            switch (this.dialogType) {
              case '新增供应商':
                addSupplier(this.diaLogForm).then(res => {
                  this.dialogFormLoading = false
                  if (res.status) {
                    this.$message.success('新增供应商成功！')
                    this.dialogFormVisible = false
                    this.getTableData()
                  }
                }).catch(err => {
                  this.dialogFormLoading = false
                  console.log(err.data)
                })
                break
              case '编辑供应商':
                modifySupplier(this.diaLogForm).then(res => {
                  this.dialogFormLoading = false
                  if (res.status) {
                    this.$message.success('编辑供应商成功！')
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

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
