<template>
  <el-form
    v-loading="loading" element-loading-text="加载中.."
    ref="diaLogForm"
    :rules="diaLogFormRules"
    size="medium" :model="diaLogForm"
    label-width="110px">
    <el-form-item label="商品名称" prop="comName">
      <el-input v-model="diaLogForm.comName"></el-input>
    </el-form-item>
    <el-form-item label="商品描述" prop="description">
      <el-input v-model="diaLogForm.description"></el-input>
    </el-form-item>
    <el-form-item label="供应商" prop="supplier.id">
      <el-select @change="handleSupplierSelect" v-model="diaLogForm.supplier.id">
        <el-option
          v-for="item in supplierOptions"
          :key="item.id"
          :label="item.supplierName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品分类" prop="classification.id">
      <el-select v-model="diaLogForm.classification.id">
        <el-option
          v-for="item in classOptions"
          :key="item.id"
          :label="item.className"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品提成比例" prop="proportionsCope">
      <el-input-number v-model="diaLogForm.proportionsCope" :precision="2" :controls="false" :min="0"
                       :max="100"></el-input-number>
      % （按照商品团购价设置比例）
    </el-form-item>
    <el-form-item label="商品团购价" prop="groupPriceCope">
      <el-input-number v-model="diaLogForm.groupPriceCope" :precision="2" :controls="false" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="商品零售价" prop="salePriceCope">
      <el-input-number v-model="diaLogForm.salePriceCope" :precision="2" :controls="false" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="商品成本价" prop="costPriceCope">
      <el-input-number v-model="diaLogForm.costPriceCope" :precision="2" :controls="false" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="商品主图" prop="mainImgList">
      <el-upload
        ref="imgMainUpload"
        :file-list="diaLogForm.mainImgList"
        :auto-upload="false"
        :limit="1" list-type="picture-card"
        :on-change="imgMainChange"
        :on-exceed="imgMainExceed"
        :on-remove="imgMainRemove"
        accept="image/jpg,image/png,image/jpeg"
        action="">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="轮播图" prop="imgBroadcastList">
      <el-upload
        ref="imgBroadcastUpload"
        :auto-upload="false"
        :file-list="diaLogForm.imgBroadcastList"
        list-type="picture-card"
        :on-change="imgBroadcastChange"
        :on-remove="imgBroadcastRemove"
        accept="image/jpg,image/png,image/jpeg"
        action="">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="品牌" prop="brand">
      <el-input v-model="diaLogForm.brand"></el-input>
    </el-form-item>
    <el-form-item label="规格" prop="specifications">
      <el-input v-model="diaLogForm.specifications"></el-input>
    </el-form-item>
    <el-form-item label="产地" prop="placeOfOri">
      <el-input v-model="diaLogForm.placeOfOri"></el-input>
    </el-form-item>
    <el-form-item label="图文详情" prop="comDetails">
      <tinymce :height="300" v-model="diaLogForm.comDetails"></tinymce>
    </el-form-item>
    <el-form-item>
      <!--<el-button  @click="restForm">重 置</el-button>-->
      <el-button :loading="dialogFormLoading" type="primary" @click="submitDialogData">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import { addCommodity, getCommodityById, modifyCommodity } from '@/api/goods'
  import { getSupplierByPage } from '@/api/supplier'
  import { uploadImgToBase64, URLImgToBase64 } from '@/utils'
  import { BASE_URL } from '@/utils/fetch'

  export default {
    components: { Tinymce },
    data () {
      return {
        BASE_URL,
        classOptions: [],
        supplierOptions: [],
        loading: false,
        dialogFormLoading: false,
        diaLogForm: {
          'active': true,
          'examine': true, // 后台管理添加商品无需审核
          brand: null,       // 品牌
          classification: { id: null },
          supplier: { id: null },
          comName: null,     // 商品名称
          description: null,
          proportionsCope: 0, // 提成比例
          costPriceCope: 0,    // 成本价格
          groupPriceCope: 0,   // 团购价
          salePriceCope: 0,   // 零售价
          id: null,
          'mainImgList': [], // 储存商品主图数组
          mainImg: '',       // 主图string
          'imgBroadcastList': [], // 轮播图数组
          imgs: '',          // 主图string
          placeOfOri: null, // 产地
          specifications: '',
          comDetails: ''     // 图文详情
        },
        diaLogFormRules: {
          comName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
          description: [{ required: false, trigger: 'blur' }],
          'supplier.id': [{ type: 'number', required: true, message: '请选择供应商', trigger: 'change' }],
          'classification.id': [{ type: 'number', required: true, message: '请选择商品分类', trigger: 'change' }],
          proportionsCope: [{ required: true, message: '请输入商品提成比例', trigger: 'blur' }],
          groupPriceCope: [{ required: false, trigger: 'blur' }],
          salePriceCope: [{ required: true, message: '请输入零售价', trigger: 'blur' }],
          costPriceCope: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
          mainImgList: [{ type: 'array', required: true, message: '请上传商品主图', trigger: 'blur' }],
          imgBroadcastList: [{ type: 'array', required: true, message: '请至少上传一张轮播图', trigger: 'blur' }],
          brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
          specifications: [{ required: true, message: '请输入规格', trigger: 'blur' }],
          placeOfOri: [{ required: true, message: '请输入产地', trigger: 'blur' }],
          comDetails: [{ required: false, trigger: 'blur' }]
        }
      }
    },
    computed: {
      isEdit () {
        return this.$route.meta.isEdit // 根据meta判断
      }
    },
    created () {
      this.initData()
      if (this.isEdit) {
        this.diaLogForm.id = this.$route.query.goodsId
        this.getGoodsData()
      }
    },
    methods: {
      getGoodsData () {
        this.loading = true
        getCommodityById({ cid: this.diaLogForm.id }).then(res => {
          this.loading = false
          if (res.status) {
            Object.assign(this.diaLogForm, res.data)
            this.diaLogForm.proportionsCope = this.diaLogForm.proportions / 100 // 提成比例
            this.diaLogForm.costPriceCope = this.diaLogForm.costPrice / 100     // 成本价格
            this.diaLogForm.groupPriceCope = this.diaLogForm.groupPrice / 100   // 团购价
            this.diaLogForm.salePriceCope = this.diaLogForm.salePrice / 100     // 零售价
            this.diaLogForm.mainImgList = [{ url: this.BASE_URL + '/' + this.diaLogForm.mainImg }]
            this.diaLogForm.imgBroadcastList = this.diaLogForm.imgs.split(',').map(v => ({ url: this.BASE_URL + '/' + v }))
            this.classOptions = res.data.supplier.classifications
          }
        }).catch(err => {
          this.loading = false
          console.log(err.data)
        })
      },
      initData () {
        // 获取供应商数据
        getSupplierByPage({ page: 0, size: 99999 }).then(res => {
          if (res.status) {
            this.supplierOptions = res.data.content
          }
        }).catch(err => {
          console.log(err.data)
        })
      },
      // 供应商下的分类联动
      handleSupplierSelect (val) {
        this.diaLogForm.classification.id = null
        this.classOptions = this.supplierOptions.find(v => v.id === val).classifications.sort((a, b) => a.orderId - b.orderId)
      },
      // 提交弹窗数据
      async submitDialogData () {
        const valid = await this.$refs['diaLogForm'].validate()  // 表单验证
        if (valid) {
          const imgBroadcastListBase64 = []
          const toData = this.formatData()
          console.log('图片转base64开始...')
          this.dialogFormLoading = true
          // 商品主图 转成base64
          if (this.diaLogForm.mainImgList[0].raw) {   // 判断是否是新上传的
            const mainImgRes = await uploadImgToBase64(this.diaLogForm.mainImgList[0].raw)
            toData.mainImg = mainImgRes.result.replace(/.*;base64,/, '')  // 替换前面  data:image/jpeg;base64, 部分
          } else {
            const mainImgRes = await URLImgToBase64(this.diaLogForm.mainImgList[0].url)
            toData.mainImg = mainImgRes.replace(/.*;base64,/, '')
          }
          // 并发 转码轮播图片list => base64
          const filePromises = this.diaLogForm.imgBroadcastList.map(async file => {
            if (file.raw) {  // 如果是 新上传的
              const response = await uploadImgToBase64(file.raw)
              return response.result.replace(/.*;base64,/, '')
            } else {
              const response = await URLImgToBase64(file.url)
              return response.replace(/.*;base64,/, '')
            }
          })
          // 按次序输出 base64图片
          for (const textPromise of filePromises) {
            imgBroadcastListBase64.push(await textPromise)
          }
          console.log('图片转base64结束...')
          toData.imgs = imgBroadcastListBase64.join()
          if (!this.isEdit) {
            const res = await addCommodity(toData)              // 提交表单
            if (res.status) {
              this.$message.success('添加成功')
              this.$router.push('/goods/goods-list')
            }
          } else {
            const res = await modifyCommodity(toData)            // 提交表单
            if (res.status) {
              this.$router.push('/goods/goods-list')
              this.$message.success('编辑成功')
            }
          }
          this.dialogFormLoading = false
        } else {
          console.log('error submit!!')
          return false
        }
      },
      formatData () {
        return {
          'active': true,
          'examine': true, // 后台管理添加商品无需审核
          brand: this.diaLogForm.brand,       // 品牌
          classification: { id: this.diaLogForm.classification.id },
          supplier: { id: this.diaLogForm.supplier.id },
          comName: this.diaLogForm.comName,     // 商品名称
          description: this.diaLogForm.description,
          proportions: this.diaLogForm.proportionsCope * 100, // 提成比例
          costPrice: this.diaLogForm.costPriceCope * 100,    // 成本价格
          groupPrice: this.diaLogForm.groupPriceCope * 100,   // 团购价
          salePrice: this.diaLogForm.salePriceCope * 100,   // 零售价
          id: this.diaLogForm.id,
          mainImg: '',       // 主图string
          imgs: '',          // 主图string
          placeOfOri: this.diaLogForm.placeOfOri, // 产地
          specifications: this.diaLogForm.specifications,
          comDetails: this.diaLogForm.comDetails     // 图文详情
        }
      },
      // 商品主图选择后转
      imgMainChange (file, fileList) {
        const isLt2M = file.size / 1024 / 1024 < 2  // 上传头像图片大小不能超过 2MB
        if (!isLt2M) {
          this.diaLogForm.mainImgList = fileList.filter(v => v.uid !== file.uid)
          this.$message.error('图片选择失败，图片大小不能超过 2MB!')
        } else {
          this.diaLogForm.mainImgList.push(file)
        }
      },
      imgMainRemove (file, fileList) {
        this.diaLogForm.mainImgList = fileList
      },
      imgMainExceed (files, fileList) {
        this.$message.warning('商品主图至多选一张')
      },
      // 轮播图 选择后储存
      imgBroadcastChange (file, fileList) {
        const isLt2M = file.size / 1024 / 1024 < 2  // 上传头像图片大小不能超过 2MB
        if (!isLt2M) {
          this.diaLogForm.imgBroadcastList = fileList.filter(v => v.uid !== file.uid)
          this.$message.error('图片选择失败，每张图片大小不能超过 2MB,请重新选择!')
        } else {
          this.diaLogForm.imgBroadcastList.push(file)
        }
      },
      imgBroadcastRemove (file, fileList) {
        this.diaLogForm.imgBroadcastList = fileList
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-upload__tip {
    color: #66b1ff;
  }
</style>
