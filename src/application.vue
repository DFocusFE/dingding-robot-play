<template>
  <div class="app-container">
    <banner />
    <bot-control />
  </div>
</template>

<script>
import banner from './components/banner'
import botControl from './components/botControl'

export default {
  components: {
    banner,
    botControl
  }
}
</script>
<style lang="stylus" scoped>
.app-container
  width 100%
  max-height 100%
  display flex
  flex-direction column
</style>
