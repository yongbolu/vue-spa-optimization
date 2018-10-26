<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-select v-model="queryForm.classId" placeholder="商品分类" clearable>
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.className"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.comName" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.examine" placeholder="待审核" clearable>
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
      <div>
        <el-button :disabled="batchDeletDisabled" size="medium" type="danger" icon="el-icon-delete" @click="batchDelet">
          批量删除
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="$router.push('/goods/goods-add')">新增</el-button>
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
      <el-table-column align="center" label="商品详情">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="warning" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操 作" width="220">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.examine" @click="examineGoods(scope.row.id)" type="success" size="mini">审核
          </el-button>
          <el-button @click="$router.push('/goods/goods-edit?goodsId='+scope.row.id)" type="primary" size="mini">编辑</el-button>
          <el-button @click="delRow(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 查看详情弹窗 -->
    <el-dialog title="商品详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        size="medium" :model="diaLogForm"
        label-width="120px">
        <el-form-item label="商品名称：">{{diaLogForm.comName}}</el-form-item>
        <el-form-item label="商品描述：">{{diaLogForm.description}}</el-form-item>
        <el-form-item label="供应商：">{{diaLogForm.supplier.supplierName}}</el-form-item>
        <el-form-item label="商品分类：">{{diaLogForm.classification.className}}</el-form-item>
        <el-form-item label="商品提成比例：">{{diaLogForm.proportions | moneyFilter}}%</el-form-item>
        <el-form-item label="商品团购价：">{{diaLogForm.groupPrice | moneyFilter}} 元</el-form-item>
        <el-form-item label="商品零售价：">{{diaLogForm.salePrice | moneyFilter}} 元</el-form-item>
        <el-form-item label="商品成本价：">{{diaLogForm.costPrice | moneyFilter}} 元</el-form-item>
        <el-form-item label="商品主图："><img class="goods-img" :src="BASE_URL+'/'+diaLogForm.mainImg" alt="" /></el-form-item>
        <el-form-item label="商品轮播图：">
          <ul class="broadcast-list">
            <li v-for="item in diaLogForm.imgBroadcastList">
              <img class="goods-img" :src="BASE_URL+'/'+item" alt="轮播图"/>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="品牌：">{{diaLogForm.brand}}</el-form-item>
        <el-form-item label="规格：">{{diaLogForm.specifications}}</el-form-item>
        <el-form-item label="产地：">{{diaLogForm.placeOfOri}}</el-form-item>
        <el-form-item label="图文详情：">
          <div class="fu-wen-ben" v-html="diaLogForm.comDetails"></div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {
    delCommodityByIds,
    examineCommodityById,
    getAllClass,
    getCommodityByPage,
    queryCommodityByPage
  } from '@/api/goods'
  import { moneyFilter } from '@/filters'
  import { BASE_URL } from '@/utils/fetch'

  export default {
    filters: { moneyFilter },
    data () {
      return {
        BASE_URL,
        columns: [
          { type: 'selection' },
          { prop: 'comName', label: '商品名称' },
          { prop: 'classification.className', label: '商品分类' }
        ],
        classOptions: [],
        examineOptions: [{ value: true, label: '已审核' }, { value: false, label: '未审核' }],
        tableData: [],
        loading: false,
        tableSelecedData: [],  // 表格多选选中数据
        dialogFormVisible: false,
        tableTotal: 0,
        isEdit: false,   // 是否是编辑弹窗
        queryForm: {
          classId: null,
          comName: null,
          examine: null,
          page: 0,
          size: 10
        },
        diaLogForm: {
          supplier: {},
          classification: {}
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
        let getTableDataFn = getCommodityByPage
        if (this.queryForm.classId || this.queryForm.comName || this.queryForm.examine === true || this.queryForm.examine === false) {
          getTableDataFn = queryCommodityByPage
        }
        getTableDataFn(this.queryForm).then(res => {
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
          delCommodityByIds({ ids: [val] }).then(res => {
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
        this.$confirm('确认批量删除?', '提示', { type: 'warning' }).then(() => {
          delCommodityByIds({ ids: this.tableSelecedData }).then(res => {
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
      // 审核商品
      examineGoods (id) {
        this.$confirm('确认审核?', '提示', { type: 'warning' }).then(() => {
          examineCommodityById({ id }).then(res => {
            if (res.status) {
              this.getTableData()
              this.$message.success('审核成功!')
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {
        })
      },
      // 打开弹窗
      openDialog (row) {
        this.dialogFormVisible = true   // 打开弹窗
        this.diaLogForm = row           // 把表格行内数据 赋值给弹窗
        this.diaLogForm.imgBroadcastList = this.diaLogForm.imgs.split(',')
      }
    }
  }
</script>

<style scoped lang="scss">
  .broadcast-list{
    list-style: none;
    display: flex;
    flex-wrap: wrap;
  }
  .goods-img {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    border:1px solid #c0ccda;
    margin-right: 15px;
  }
  .fu-wen-ben{
    border: 1px solid #c0ccda;
    padding: 20px;
    /deep/ img{
      max-width: 100%;
    }
  }
</style>
