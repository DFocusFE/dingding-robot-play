<template>
  <div ref="editor"/>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/placeholder'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/elegant.css'

export default {
  props: {
    defaultValue: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorInstance: null
    }
  },
  mounted() {
    this.editorInstance = CodeMirror(this.$refs.editor, {
      value: '',
      mode: 'markdown',
      theme: 'elegant',
      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      indentWithTabs: false,
      placeholder: this.placeholder
    })
    this.editorInstance.doc.cm.on('change', this._emitChange)

    if (this.defaultValue) {
      this.editorInstance.doc.setValue(this.defaultValue)
    }
  },
  beforeDestroy() {
    this.editorInstance.doc.cm.off('change', this._emitChange)
  },
  methods: {
    _emitChange(instance) {
      this.$emit('change', instance.doc.getValue())
    },
    reset() {
      this.editorInstance.doc.setValue(this.defaultValue)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
