<template>
  <el-form ref="formData" :rules="formDataRules" :model="formData">
    <el-form-item label="团长可获得下级团长订单提成的佣金比例为" prop="proportionsCope">
      <el-input-number v-model="formData.proportionsCope" :precision="2" :controls="false" :min="0" :max="100"></el-input-number>
      %
    </el-form-item>
    <el-form-item>
      <!--<el-button  @click="restForm">重 置</el-button>-->
      <el-button :loading="loading" type="primary" @click="submitForm">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getAllSysConfig, modifySysconfig } from '@/api/systemSetup'

  export default {
    name: 'systemSetup',
    data () {
      return {
        loading: false,
        formData: {
          proportionsCope: 10
        },
        formDataRules: {
          proportionsCope: [{ required: true, message: '请输入商品提成比例', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
        getAllSysConfig().then(res => {
          if (res.status) {
            // this.formData.proportionsCope = res.data[0].theValue / 100
            this.formData.proportionsCope = res.data.find(v => v.theKey === 'agPro').theValue / 100
          }
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm () {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            modifySysconfig({ theKey: 'agPro', theValue: this.formData.proportionsCope * 100 + '' }).then(res => {
              if (res.status) {
                this.$message.success('设置成功!')
              }
            }).catch(err => {
              console.log(err)
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

<style scoped lang="scss">
  .el-button{
    width: 314px;
  }
</style>
