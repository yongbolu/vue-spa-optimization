<template>
  <div>
    <div class="top-toolbar">
      <el-form size="medium" :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.gbName" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
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
          <el-select v-model="queryForm.active" placeholder="是否结束" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="dialogFormVisible = true">新增</el-button>
      </div>
    </div>
    <my-table
      :loading="loading"
      border stripe
      :data="tableData"
      @paging-current-change="handleCurrentChange"
      :current-page="queryForm.page+1"
      :page-size="queryForm.size"
      :total="tableTotal">
      <el-table-column align="center" label="活动名称" prop="gbName"></el-table-column>
      <el-table-column align="center" label="活动起止时间">
        <template slot-scope="scope">{{scope.row.startTime}} - {{scope.row.endTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="提货时间" prop="pickTime"></el-table-column>
      <el-table-column align="center" label="涉及商品" width="120">
        <template slot-scope="scope">
          <el-button @click="openGoodsDialog(scope.row.id)" type="warning" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="涉及团长" width="120">
        <template slot-scope="scope">
          <el-button @click="openGroupDialog(scope.row.agentIds)" type="warning" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column :formatter="activeFormatter" align="center" label="是否结束" width="120"></el-table-column>
      <el-table-column align="center" label="操 作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.active!==false" @click="endActivity(scope.row.id)" type="danger" size="mini">结束
          </el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 新增团长弹窗 -->
    <el-dialog width="70%" title="新增活动" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form
        ref="diaLogForm"
        :rules="diaLogFormRules"
        size="medium" :model="diaLogForm"
        label-width="110px">
        <el-form-item label="活动名称" prop="gbName">
          <el-input v-model="diaLogForm.gbName"></el-input>
        </el-form-item>
        <el-form-item label="活动起止时间" prop="dataTime">
          <el-date-picker
            @change="activeTimeChange"
            v-model="diaLogForm.dataTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="添加商品" prop="goodsList">
          <el-select v-model="diaLogForm.goodsList" placeholder="点击添加商品" multiple style="width: 100%">
            <el-option
              v-for="item in goodsOption"
              :key="item.id"
              :label="item.comName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动商品" prop="groupbuyItems">
          <div v-for="item in diaLogForm.groupbuyItems" class="active-goods-row">
            <span class="active-goods-name">{{item.comName}}（￥{{item.costPrice}}）</span>
            团购价格：
            <el-input-number v-model="item.groupPrice" :precision="2" :controls="false" :min="0"
                             style="width: 100px"></el-input-number>
            数量：
            <el-input-number v-model="item.totalAmount" :precision="0" :controls="false" :min="0"
                             style="width: 100px"></el-input-number>
            限购：
            <el-input-number v-model="item.limitBuy" :precision="0" :controls="false" :min="0" :max="item.totalAmount"
                             style="width: 100px"></el-input-number>
            <el-date-picker
              v-model="item.dataTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="提货时间" prop="pickTime">
          <el-date-picker
            v-model="diaLogForm.pickTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="涉及团长" prop="agentIds">
          <el-select v-model="diaLogForm.agentIds" placeholder="请选择" multiple style="width: 100%">
            <el-option
              v-for="item in agentsOption"
              :key="item.id"
              :label="item.agentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看商品弹窗 -->
    <el-dialog title="商品详情" :visible.sync="dialogGoodsVisible" :close-on-click-modal="false">
      <my-table
        :loading="dialogGoodsLoading"
        :columns="goodsColumns"
        :paging="false"
        border stripe
        :data="goodsTableData">
      </my-table>
    </el-dialog>
    <!-- 查看团长弹窗 -->
    <el-dialog title="团长详情" :visible.sync="dialogGroupVisible" :close-on-click-modal="false">
      <my-table
        :columns="groupColumns"
        :paging="false"
        border stripe
        :data="groupTableData">
        <el-table-column align="center" label="操 作" width="100">
          <template slot-scope="scope">
            <el-button @click="copeLink(scope.row.shareURL,$event)" type="warning" plain size="mini">复制链接</el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-dialog>
  </div>
</template>
<script>
  import clip from '@/utils/clipboard'
  import {
    addGroupBuy,
    getGroupBuyByPage,
    getItemsByGroupBuyID,
    queryGroupBuyByPage,
    stopGroupBuy
  } from '@/api/activity'
  import { getAgentsByIds, getAgentsByPage } from '@/api/groupHead'
  import { queryCommodityByPage } from '@/api/goods'
  import dayjs from 'dayjs'

  export default {
    data () {
      const priceFormatter = function (row) {
        return row.price / 100
      }
      const goodsSurplusCount = function (row) {
        return row.totalAmount - row.saleCount
      }
      const goodsSaleCount = function (row) {
        return row.saleCount || 0
      }
      return {
        goodsColumns: [
          { prop: 'commodity.comName', label: '商品名称' },
          { label: '团购价格', formatter: priceFormatter },
          { prop: 'totalAmount', label: '团购总数' },
          { label: '剩余数量', formatter: goodsSurplusCount },
          { label: '销售数量', formatter: goodsSaleCount },
          { prop: 'startTime', label: '开始时间', width: 160 },
          { prop: 'endTime', label: '结束时间', width: 160 }
        ],
        groupColumns: [
          { prop: 'agentName', label: '团长姓名', width: 160 },
          { prop: 'cellphone', label: '手机号码', width: 160 },
          { prop: 'shareURL', label: '推广链接' }
        ],
        activeFormatter (row) {
          if (row.active === null) {
            return '未开始'
          } else if (row.active === true) {
            return '进行中'
          } else {
            return '已结束'
          }
        },
        tableData: [],
        groupTableData: [],
        goodsTableData: [],
        options: [{ value: false, label: '已结束' }, { value: true, label: '未结束' }],
        agentsOption: [],
        goodsOption: [],    //  所有商品选项
        loading: false,
        tableTotal: 50,
        dialogFormVisible: false,
        dialogFormLoading: false,
        dialogGoodsVisible: false,
        dialogGoodsLoading: false,
        dialogGroupVisible: false,
        dialogType: '新增活动',
        queryForm: {
          gbName: '',
          dataTime: null,
          active: null,
          page: 0,
          size: 10
        },
        diaLogForm: {
          dataTime: null,
          gbName: null,
          agentIds: [],
          goodsList: [],
          pickTime: null,
          groupbuyItems: []
        },
        diaLogFormRules: {
          gbName: [{ required: true, min: 0, max: 20, message: '活动名称为0-20个汉字', trigger: 'blur' }],
          agentIds: [{ type: 'array', required: true, message: '请至少选择一个涉及团长', trigger: 'change' }],
          goodsList: [{ type: 'array', required: true, message: '请至少添加一个商品', trigger: 'change' }],
          groupbuyItems: [{ type: 'array', required: true, message: '请至少添加一个商品', trigger: 'blur' }],
          pickTime: [{ required: true, message: '请选择提货时间', trigger: 'change' }]
        }
      }
    },
    watch: {
      // 监听商品选中的变化 拼装活动商品数据
      'diaLogForm.goodsList' (val) {
        this.diaLogForm.groupbuyItems = val.map(goodsId => {
          const goods = this.goodsOption.find(v => v.id === goodsId)
          return {
            id: goods.id,
            comName: goods.comName,
            costPrice: goods.costPrice / 100,     // 成本价
            groupPrice: goods.groupPrice / 100,       // 团购价
            totalAmount: null,   // 数量
            limitBuy: null,   // 限购
            dataTime: this.diaLogForm.dataTime
          }
        })
      }
    },
    created () {
      this.getTableData() // 进入页面调用一次
      this.initData()
    },
    methods: {
      // 初始化添加弹窗的数据
      initData () {
        // 获取所有团长
        getAgentsByPage({ page: 0, size: 99999999 }).then(res => {
          if (res.status) {
            this.agentsOption = res.data.content
          }
        }).catch(err => {
          console.log(err.data)
        })
        // 获取所有商品
        queryCommodityByPage({ page: 0, size: 99999999, examine: true }).then(res => {
          if (res.status) {
            this.goodsOption = res.data.content
          }
        }).catch(err => {
          console.log(err.data)
        })
      },
      // 获取table数据
      getTableData () {
        this.loading = true
        let getTableDatafn = getGroupBuyByPage
        const queryData = this.formatQueryData()
        if (queryData.gbName || queryData.start || queryData.active === true || queryData.active === false) {  // 根据是否有参数进行接口调用
          getTableDatafn = queryGroupBuyByPage
        }
        getTableDatafn(queryData).then(res => {
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
          active: this.queryForm.active,
          page: this.queryForm.page,
          size: this.queryForm.size
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
      // 活动时间发生变化的时候
      activeTimeChange (val) {
        this.diaLogForm.groupbuyItems.forEach(v => {
          v.dataTime = val
        })
      },
      // 结束活动
      endActivity (id) {
        this.$confirm('确认结束活动?', '提示', { type: 'warning' }).then(() => {
          stopGroupBuy({ gpId: id }).then(res => {
            if (res.status) {
              this.$message.success('操作成功!')
              this.getTableData()
            }
          }).catch(err => {
            console.log(err.data)
          })
        }).catch(() => {
        })
      },
      // 查看商品 弹窗
      openGoodsDialog (id) {
        this.dialogGoodsVisible = true
        this.dialogGoodsLoading = true
        getItemsByGroupBuyID({ gpId: id }).then(res => {
          this.dialogGoodsLoading = false
          if (res.data) {
            console.log('查看涉及商品 弹窗data=>', res)
            this.goodsTableData = res.data
          } else {
            this.goodsTableData = []
          }
        }).catch(err => {
          this.dialogGoodsLoading = false
          console.log(err.data)
        })
      },
      // 查看团长 弹窗
      openGroupDialog (ids) {
        const data = { ids: ids.split(',').map(s => +s) }
        this.dialogGroupVisible = true
        getAgentsByIds(data).then(res => {
          if (res.data) {
            console.log('查看涉及团长 弹窗data=>', res)
            this.groupTableData = res.data
            this.groupTableData.forEach(v => {
              v.shareURL = window.location.origin + '/m-dist/#/home/goods-list?agentId=' + v.id
            })
          } else {
            this.groupTableData = []
          }
        }).catch(err => {
          console.log(err.data)
        })
      },
      // 复制链接
      copeLink (text, event) {
        clip(text, event)
      },
      // 提交弹窗数据
      submitDialogData () {
        this.$refs['diaLogForm'].validate(valid => {
          if (valid) {
            const toData = this.formatDialogData()
            if (!toData) return
            this.dialogFormLoading = true
            addGroupBuy(toData).then(res => {
              this.dialogFormLoading = false
              if (res.status) {
                this.$message.success('新增活动成功！')
                this.dialogFormVisible = false
                this.$refs['diaLogForm'].resetFields()
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
      // 格式化传输数据
      formatDialogData () {
        const arr = this.diaLogForm.groupbuyItems
        const length = arr.length
        for (let i = 0; i < length; i++) {
          if (!(arr[i].groupPrice && arr[i].totalAmount && arr[i].dataTime)) {
            this.$message.error(`活动商品“${arr[i].comName}”内有字段未填写，提交失败！`)
            return false
          }
          if (arr[i].dataTime) {
            // 如果 提货时间小于 商品活动结束时间
            if (!dayjs(this.diaLogForm.pickTime).isAfter(arr[i].dataTime[1])) {
              this.$message.error('提货时间应大于商品活动结束时间！')
              return false
            }
          }
        }
        const groupbuyItems = this.diaLogForm.groupbuyItems.map(item => {
          return {
            commodity: { id: item.id },
            price: item.groupPrice * 100,       // 团购价,
            totalAmount: item.totalAmount,   // 数量
            limitBuy: item.limitBuy,   // 限购
            startTime: item.dataTime[0],
            endTime: item.dataTime[1]
          }
        })
        return {
          groupbuy: {
            startTime: this.diaLogForm.dataTime ? this.diaLogForm.dataTime[0] : null,
            endTime: this.diaLogForm.dataTime ? this.diaLogForm.dataTime[1] : null,
            agentIds: this.diaLogForm.agentIds.join(),  // 团长id，分隔符自定义，我这边只负责保存
            active: true,
            gbName: this.diaLogForm.gbName,
            pickTime: this.diaLogForm.pickTime         // 提货时间
          },
          groupbuyItems
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .active-goods-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .el-input-number {
      margin-right: 10px;
    }
  }

  .active-goods-name {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
