<template>
  <el-dialog title="机器人" :visible="visible" :show-close="false">
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="save">
      <el-form-item label="webhook" label-width="100" prop="webhook">
        <el-input v-model="form.webhook"></el-input>
      </el-form-item>
      <el-form-item label="别名" label-width="100" prop="alias">
        <el-input v-model="form.alias"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { checkWebhookExist, checkAliasExist, addWebhook } from '../assistant/botHelper'
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        webhook: '',
        alias: ''
      },
      rules: {
        webhook: [
          { required: true, message: '请输入webhook', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (checkWebhookExist(value)) {
                callback(new Error('webhook已存在'))
              }
              return callback()
            }
          }
        ],
        alias: [
          { required: true, message: '请输入别名', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (checkAliasExist(value)) {
                callback(new Error('别名已存在'))
              }
              return callback()
            }
          }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.$refs.form.resetFields()
      this.$emit('cancel')
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        addWebhook(this.form)
        this.$refs.form.resetFields()
        this.$emit('saved')
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
