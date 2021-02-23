<template>
  <div>
    <Modal v-model="abrirModal" width="900" :scrollable="true" @on-visible-change="fecharModal($event)">
      <p slot="header" style="text-align:center;font-size:18px;">
        <span>Lista de Clientes Exceção</span>
      </p>
      <Row :gutter="12" class="top bottom">
        <Col span="24">
          <strong>Clientes Exceção</strong>
          <Select v-model="clientesExcecao" multiple>
            <Option v-for="item in ListaClientesExcecao" :key="item.clienteId" :value="item.clienteId"
              >{{ item.nomeFantasia }} | {{ item.cnpjCpf }} | {{ item.inscricaoEstadual }}</Option
            >
          </Select>
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button type="primary" class="margem-botoes" :loading="loadGravar" @click="gravar">
            <span v-if="!loadGravar">Gravar</span>
            <span v-else>Gravando...</span>
          </Button>
          <Button class="margem-botoes" @click="limpar">Limpar</Button>
        </Col>
      </Row>

      <div slot="footer">
        <Button type="primary" size="small" long @click="fecharModal($event)">Fechar</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['open', 'excecaoRegraRaiz'],
  data() {
    return {
      clientesExcecao: [],
      loadGravar: false,
      loadTable: false,
      ListaClientesExcecao: [],
      gravou: false,
      modalAberto: false
    }
  },
  created() {
    this.$bus.$on('carregarExcecao', id => {
      this.modalAberto = true
      this.montarTelaExecaoRegraRaiz(id)
    })
  },
  methods: {
    fecharModal(evt) {
      if (evt != true && this.modalAberto == true) {
        this.modalAberto = false
        this.$emit('closeExcecao', {
          item: this.clientesExcecao,
          item2: this.gravou
        })
      }
    },
    async montarTelaExecaoRegraRaiz(grpRadicalId) {
      this.loadTable = true
      let ret = await this.Base.get('ClientePorRaizCnpj', {
        params: { grupoRadicalCnpjIdent: grpRadicalId }
      })
      if (ret.data != null) {
        this.ListaClientesExcecao = ret.data
        this.limpar()
        if (this.excecaoRegraRaiz.length > 0) {
          this.excecaoRegraRaiz.map(x => {
            this.clientesExcecao.push(x.clienteId)
          })
        }
      } else {
        this.$Notice.error({
          desc: 'Nenhuma informação encontrada para o cliente selecionado.'
        })
      }
      this.loadTable = false
    },
    gravar() {
      this.$Notice.success({ desc: 'Lista de Excecão incluida com sucesso' })
      this.gravou = true
      this.fecharModal(false)
    },
    limpar() {
      this.clientesExcecao = []
      this.gravou = false
    }
  },
  computed: {
    abrirModal: {
      get: function() {
        return this.open
      },
      set: function() {}
    },
    ...mapGetters(['usuarioId'])
  }
}
</script>
<style type="text/css">
.ivu-modal-confirm-body div {
  margin: 15px 0;
  max-height: 250px;
  overflow-y: auto;
}
</style>
