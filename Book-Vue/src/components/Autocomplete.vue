<template>
  <main>
    <Input v-model="input" clearable @on-change="limparDict()" @input="autocomplete($event)" />
    <ul v-show="dict && dict.length > 0" :style="dimensoes">
      <li v-for="item in dict" @click="selected(item)">
        <p v-for="(campo, index) in campoVisivel">
          {{ nomesCampos.length > 0 ? `${nomeCampo[index]}:  ${item[campo]}` : item[campo] }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { formatUrl } from './Configurator/Http'

export default {
  props: ['action', 'camposVisiveis', 'nomesCampos', 'valor', 'width', 'height', 'where'],
  data() {
    return {
      dict: [],
      input: '',
      url: '',
      filtro: '',
      dimensoes: { width: this.width, maxHeight: this.height }
    }
  },
  computed: {
    nomeCampo() {
      return this.nomesCampos.split(',')
    },
    campoVisivel() {
      return this.camposVisiveis.split(',')
    }
  },
  watch: {
    valor(val) {
      ;(this.input = this.valor), (this.filtro = this.where)
    }
  },
  created() {
    this.url = formatUrl() + this.action
  },
  methods: {
    autocomplete(e) {
      if (this.input.length >= 3) {
        this.Base.get(this.url, {
          params: {
            query: this.input,
            where: this.where
          }
        }).then(res => {
          if (res.data.length == 1) {
            this.selected(res.data[0])
          } else {
            this.dict = res.data
          }
        })
      }
    },
    selected(item) {
      this.$emit('input', item)
      setTimeout(() => {
        this.dict = []
      }, 100)
    },
    limparDict() {
      this.dict = []
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
input {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dddee1;
  padding: 5px;
}
ul {
  position: absolute;
  z-index: 99;
  list-style: none;
  overflow-y: auto;
  border: 1px solid #e1e1e1;
}

ul li {
  padding: 10px;
  background: #fff;
  cursor: pointer;
  transition: 0.5s;
}

ul li:hover {
  background: #f5f5f5;
}
</style>
