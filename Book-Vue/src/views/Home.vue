<template>
  <div>
    <Header title="Livros" />

    <div class="content">
      <Row>
        
        <div style="width:30%">
            <strong>Pesquisar Livro</strong> 
            <input 
              style="width:100%;height:32px;padding:4px 7px;color:#515a6e;border-radius:4px;cursor;border:1px solid #dcdee2" 
              id="book" @keyup="bookName = $event.target.value" placeholder="Digite o titulo do livro desejado"
            />
        </div>
        <div style="width:30%;margin-top:12px">
            <Button id="btn-teste" type="primary" class="margem-botoes" @click="teste">
              <span>Pesquisar</span>
            </Button>
            <Button id="btn-teste" type="primary" class="margem-botoes" @click="teste">
              <span>Favoritar</span>
            </Button>
        </div>
      </Row>
    </div> 
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: { Header },
  data() {
    return {}
  },
  created() {
    this.resetState()
  },

  methods: {
    teste(){
    console.log('Bateu caralho')
    alert(this.bookName)
    this.Base.get('http://localhost:61190/api/cliente/GetCliente/' + this.bookName).then(response => (this.info = response))
  },
    ...mapActions(['resetState'])
  }
}
</script>
