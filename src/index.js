import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import application from './application'

Vue.use(ElementUI)

function createApp() {
  const app = new Vue({
    render: h => h(application)
  })

  return { app }
}

const { app } = createApp()

document.head.removeChild(document.querySelector('#splash-spinner'))
document.body.removeChild(document.querySelector('.spinner'))

app.$mount('#application')
