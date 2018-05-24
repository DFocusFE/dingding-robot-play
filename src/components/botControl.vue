<template>
  <el-form ref="botHelperForm" :model="botMessage" :rules="rules[botMessage.msgtype]" label-width="100px" class="bot-form" @submit.native.prevent="send">
    <el-form-item label="webhook" prop="webhook">
      <el-input v-model="botMessage.webhook"></el-input>
    </el-form-item>
    <el-form-item label="消息类型">
      <el-col :span="10">
        <el-select v-model="botMessage.msgtype" placeholder="请选择消息类型" @change="changeMsgtype" style="width: 100%;">
          <el-option label="markdown" value="markdown"></el-option>
          <el-option label="link" value="link"></el-option>
          <el-option label="text" value="text"></el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item label="消息标题" prop="title" v-if="whetherToDisplay('title')">
      <el-col :span="10">
        <el-input v-model="botMessage.title"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item v-if="whetherToDisplay('messageUrl')" label="messageUrl" prop="messageUrl">
      <el-input v-model="botMessage.messageUrl"></el-input>
    </el-form-item>
    <el-form-item v-if="whetherToDisplay('picUrl')" label="picUrl" prop="picUrl">
      <el-input v-model="botMessage.picUrl"></el-input>
    </el-form-item>
    <el-form-item label="是否@所有人" v-if="whetherToDisplay('isAtAll')">
      <el-checkbox v-model="botMessage.isAtAll">@所有人</el-checkbox>
    </el-form-item>
    <el-form-item prop="markdowntxt" class="editor-area" v-if="whetherToDisplay('markdowntxt')">
      <editor ref="editor" class="editor" @change="setMarkdowntxt" :default-value="''" placeholder="发送你的markdown消息吧..."/>
    </el-form-item>
    <el-form-item prop="text" class="editor-area" v-if="whetherToDisplay('text')">
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="botMessage.text"></el-input>
    </el-form-item>
    <el-form-item prop="content" class="editor-area" v-if="whetherToDisplay('content')">
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="botMessage.content"></el-input>
    </el-form-item>
    <br/>
    <el-form-item>
        <el-button type="primary" @click="send">立即发送</el-button>
        <el-button @click="clear">清空</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
import axios from 'axios'
import Editor from './editor'
import { pick } from '../assistant/object'
import { RULES, TYPE_KEYS, DEFAULT_VALUES, messageComposer } from '../assistant/botHelper'

export default {
  data() {
    return {
      botMessage: pick(DEFAULT_VALUES, ...TYPE_KEYS.markdown),
      rules: {
        markdown: pick(RULES, ...TYPE_KEYS.markdown),
        link: pick(RULES, ...TYPE_KEYS.link),
        text: pick(RULES, ...TYPE_KEYS.text)
      }
    }
  },
  methods: {
    send() {
      this.$refs.botHelperForm.validate(valid => {
        if (!valid) {
          return
        }

        axios.post(this.botMessage.webhook, messageComposer(this.botMessage)).then(({ data }) => {
          if (data.errcode === 0) {
            return this.$message({
              message: '消息已发送',
              type: 'success'
            })
          }
          return this.$message({
            message: data.errmsg,
            type: 'error'
          })
        })
      })
    },
    setMarkdowntxt(text) {
      this.botMessage.markdowntxt = text
    },
    whetherToDisplay(field) {
      return TYPE_KEYS[this.botMessage.msgtype].includes(field)
    },
    changeMsgtype(type) {
      this.botMessage = Object.assign(pick(DEFAULT_VALUES, ...TYPE_KEYS[type]), {
        msgtype: type,
        webhook: this.botMessage.webhook
      })
    },
    clear() {
      this.botMessage = pick(DEFAULT_VALUES, ...TYPE_KEYS.markdown)
      if (this.botMessage.msgtype === 'markdown') {
        this.$refs.editor.reset()
      }
    }
  },
  components: {
    Editor
  }
}
</script>
<style lang="stylus">
.bot-form
  padding 10px 25px 10px 25px

.editor
  border 1px solid #dcdfe6
  line-height 18px

  .CodeMirror
    min-height 450px

  .CodeMirror-placeholder
    color #c7c7cb

.editor-area > div
  margin-left 0 !important
</style>
