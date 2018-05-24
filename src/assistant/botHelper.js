export const RULES = {
  webhook: [{ required: true, message: '请输入webhook', trigger: 'blur' }],
  title: [{ required: true, message: '请输入title', trigger: 'blur' }],
  markdowntxt: [{ required: true, message: '请输入markdown text', trigger: 'blur' }],
  content: [{ required: true, message: '请输入content', trigger: 'blur' }],
  text: [{ required: true, message: '请输入text', trigger: 'blur' }],
  messageUrl: [{ required: true, message: '请输入messgeUrl', trigger: 'blur' }]
}

export const TYPE_KEYS = {
  text: ['webhook', 'isAtAll', 'msgtype', 'content'],
  markdown: ['webhook', 'title', 'isAtAll', 'msgtype', 'markdowntxt'],
  link: ['webhook', 'title', 'msgtype', 'text', 'messageUrl', 'picUrl']
}

export const DEFAULT_VALUES = {
  webhook: '',
  title: 'Hello',
  isAtAll: false,
  msgtype: 'markdown',
  markdowntxt: '',
  messageUrl: '',
  picUrl: '',
  content: '',
  text: ''
}

export function messageComposer(message) {
  if (message.msgtype === 'markdown') {
    return {
      msgtype: 'markdown',
      markdown: {
        title: message.title,
        text: message.markdowntxt
      },
      at: {
        isAtAll: message.isAtAll
      }
    }
  }
  if (message.msgtype === 'link') {
    return {
      msgtype: 'link',
      link: {
        text: message.text,
        title: message.title,
        picUrl: message.picUrl,
        messageUrl: message.messageUrl
      }
    }
  }
  if (message.msgtype === 'text') {
    return {
      msgtype: 'text',
      text: {
        content: message.content
      },
      at: {
        isAtAll: message.isAtAll
      }
    }
  }
}
