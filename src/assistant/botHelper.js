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
        atMobiles: findAtMobiles(message.markdowntxt),
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
        atMobiles: findAtMobiles(message.content),
        isAtAll: message.isAtAll
      }
    }
  }
}

const MOBILE_REGEX = /@1(3|4|5|7|8)\d{9}([\s\S]|$)/gm

/**
 *
 * @param {string} text message content
 */
function findAtMobiles(text) {
  return text.match(MOBILE_REGEX).map(txt => txt.substring(1, 12))
}

export function checkWebhookExist(webhook) {
  return getWebhooks().some(wh => wh.webhook === webhook)
}

export function checkAliasExist(alias) {
  return getWebhooks().some(wh => wh.alias === alias)
}

export function getWebhooks() {
  const raw = localStorage.getItem('dingbot-webhooks')
  if (!raw) {
    return []
  }
  return JSON.parse(raw)
}

export function addWebhook(webhook) {
  const webhooks = getWebhooks()
  webhooks.push(webhook)
  return localStorage.setItem('dingbot-webhooks', JSON.stringify(webhooks))
}

export function removeWebhook(webhook) {
  const webhooks = getWebhooks()
  const newWebhooks = webhooks.filter(wh => !(wh.webhook === webhook.webhook && wh.alias === webhook.alias))
  localStorage.setItem('dingbot-webhooks', JSON.stringify(newWebhooks))
  return newWebhooks
}
