## my-table使用 说明
由于此项目内大多数表格都相似，此组件封装了el-table和el-pagination。只要写配置即可生成表格


## 示例

```html
<my-table
  @selection-change="tableSelectChange"
  border :data="tableData"
  :columns="columns"
  @paging-current-change="handleCurrentChange"
  :current-page="currentPage4"
  :page-size="10"
  :total="100">
  <el-table-column align="center" label="操 作" width="120">
    <template slot-scope="scope">
      <el-button @click="delRow(scope.row.id)" type="danger" size="mini">删除ID:{{scope.row.id}}</el-button>
    </template>
  </el-table-column>
</my-table>
```

## prop说明

#### columns
  列属性,要求是一个数组

  1. label: 显示在表头的文字
  2. prop: 对应data的key。Table将显示相应的value
  3. width: 每列的宽度，为一个数字(可选)
  4. type: 列的类型 (selection/index/expand)
  5. formatter: 格式化函数 (Function(row, column, cellValue, index))
  
  其他需要的字段请参照 Table-column Attributes 自己添加
  
  如果你想要每个字段都有自定义的样式或者嵌套其他组件，columns可不提供，直接像在el-table一样写即可，如果没有自定义内容，提供columns将更加的便捷方便
  
  如果你有几个字段是需要自定义的，几个不需要，那么可以将不需要自定义的字段放入columns，将需要自定义的内容放入到slot中，详情见后文
  ```javascript
  [{
    prop:string,
    label:string,
    width:number,
    type:string,
    formatter:Function,
    
  },{
    prop:string,
    label:string,
    width:number,
    type:string,
    formatter:Function
  }]
  ```
  
#### paging
  是否开启分页  默认开启
  ```javascript
  {
    paging:Boolean,
    default:true
  }
    
  ```
 
#### 其他prop

表格和分页其他参数和事件请参照el文档。都可使用

## 事件

关于事件，el-table的相关事件，都可以查看el-table直接使用，

分页的事件，（由于table事件和paging事件冲突）目前只手动提供了一个页面变化时候的事件，有额外需要自己加就是了

@paging-current-change="handleCurrentChange" 返回参数值为当前选中的value



 

