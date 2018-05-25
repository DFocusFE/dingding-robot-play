<template>
  <div>
    <el-form ref="botHelperForm" :model="botMessage" :rules="rules[botMessage.msgtype]" label-width="100px" class="bot-form" @submit.native.prevent="send">
      <el-form-item label="机器人" prop="webhook" >
        <el-col :span="10">
          <el-select v-model="botMessage.webhook" placeholder="请选择你要假装的机器人" style="width: 100%;">
            <el-option v-for="item in webhooks" :key="item.webhook" :label="item.webhook" :value="item.webhook">
              <span style="width: 100px">{{ item.alias }}</span>
              <i class="el-icon-delete" style="float: right; line-height: 34px" @click.stop.prevent="delWebhook(item)"></i>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-button @click="displayWebhook = true">新增</el-button>
        </el-col>
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
    <webhook :visible="displayWebhook" @cancel="displayWebhook = false" @saved="newWebhookCreated"/>
  </div>
</template>

<script>
import axios from 'axios'
import Editor from './editor'
import Webhook from './webhook'
import { pick } from '../assistant/object'
import { RULES, TYPE_KEYS, DEFAULT_VALUES, messageComposer, getWebhooks, removeWebhook } from '../assistant/botHelper'

export default {
  data() {
    return {
      displayWebhook: false,
      botMessage: pick(DEFAULT_VALUES, ...TYPE_KEYS.markdown),
      rules: {
        markdown: pick(RULES, ...TYPE_KEYS.markdown),
        link: pick(RULES, ...TYPE_KEYS.link),
        text: pick(RULES, ...TYPE_KEYS.text)
      },
      webhooks: getWebhooks()
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
    },
    newWebhookCreated() {
      this.webhooks = getWebhooks()
      this.displayWebhook = false
    },
    delWebhook(webhook) {
      this.webhooks = removeWebhook(webhook)
      if (webhook.webhook === this.botMessage.webhook) {
        this.botMessage.webhook = ''
      }
    }
  },
  components: {
    Editor,
    Webhook
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
