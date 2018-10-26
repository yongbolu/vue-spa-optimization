<template>
  <div class="my-tabble">
    <el-table
      v-loading="loading"  element-loading-text="加载中.."
      v-bind="$attrs" v-on="$listeners">
      <slot name="first-column"></slot>
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :type="column.type"
        :formatter="column.formatter"
        :align="'center'"
      >
      </el-table-column>
      <slot></slot>
    </el-table>
    <div v-if="paging" class="bottom-row">
      <el-pagination
        v-bind="$attrs"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myTable',
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      paging: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.$emit('paging-current-change', val)  // 由于和table current-change 事件重名 所以单独派发一个分页事件
      }
    }
  }
</script>

<style scoped>

</style>
