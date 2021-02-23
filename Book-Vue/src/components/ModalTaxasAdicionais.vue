<template>
  <div>
    <Modal
      v-model="abrirModal"
      width="938"
      title="Taxas Adicionais"
      :scrollable="true"
      @on-visible-change="fecharModal($event)"
    >
      <p slot="header" style="text-align:center;font-size:18px;">
        <span>Taxas Adicionais</span>
      </p>

      <Row :gutter="12">
        <Col span="8" offset="4">
          <strong>Nº BL</strong>
          <p>{{ form.numControleCtac }}</p>
        </Col>

        <Col span="7">
          <strong>Desconto</strong>
          <Input v-model="form.valorDesconto">
            <span slot="prepend">R$</span>
          </Input>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="8" offset="4">
          <strong>Taxa</strong>
          <p>{{ form.descTaxa }}</p>
        </Col>

        <Col span="7">
          <strong>Acréscimo</strong>
          <Input v-model="form.valorAcrescimo">
            <span slot="prepend">R$</span>
          </Input>
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            :disabled="!form.taxaAdicionalDoctoId > 0"
            class="margem-botoes"
            :loading="loadGravar"
            @click="atualizarTaxa"
          >
            <span v-if="!loadGravar">Gravar</span>
            <span v-else>Gravando...</span>
          </Button>

          <Button class="margem-botoes" @click="limpar">Limpar</Button>
        </Col>
      </Row>

      <Table
        ref="selection"
        :row-class-name="rowClassName"
        stripe
        border
        :columns="columns"
        :data="listaTaxasGravadas"
        :loading="loadTable"
        @on-selection-change="selectItemRemove"
        @on-row-click="carregarTaxa($event)"
      ></Table>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            :disabled="selecionadosRemover.length == 0"
            class="margem-botoes"
            :loading="loadRemover"
            @click="adicRemoveTaxa(`R`)"
          >
            <span v-if="!loadRemover">Retirar</span>
            <span v-else>Retirando...</span>
          </Button>
        </Col>
      </Row>

      <Row>
        <Col class="title">
          <strong>Taxas Não Vinculadas à Fatura</strong>
        </Col>
      </Row>
      <Table
        ref="selection"
        :row-class-name="rowClassName"
        stripe
        border
        :columns="columns"
        :data="listaTaxasAdicionais"
        :loading="loadTable"
        @on-selection-change="selectItemAdicionar"
      ></Table>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            :disabled="selecionadosAdicionar.length == 0"
            class="margem-botoes"
            :loading="loadAdicionar"
            @click="adicRemoveTaxa(`A`)"
          >
            <span v-if="!loadAdicionar">Adicionar</span>
            <span v-else>Adicionando...</span>
          </Button>
        </Col>
      </Row>

      <div slot="footer">
        <Button type="primary" size="large" long @click="fecharModal">Fechar</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['open', 'doctoPagtoId'],
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'BL',
          key: 'numControleCtac',
          sortable: true,
          width: 145,
          align: 'center'
        },
        {
          title: 'Taxa',
          key: 'descTaxa',
          sortable: true,
          width: 180,
          align: 'center'
        },
        {
          title: 'R$',
          key: 'valorReal',
          sortable: true,
          width: 130,
          align: 'center'
        },
        {
          title: 'US$',
          key: 'valorDolar',
          sortable: true,
          width: 130,
          align: 'center'
        },
        {
          title: 'Desconto',
          key: 'valorDesconto',
          sortable: true,
          width: 130,
          align: 'center'
        },
        {
          title: 'Acréscimo',
          key: 'valorAcrescimo',
          sortable: true,
          width: 130,
          align: 'center'
        }
      ],
      form: {
        taxaAdicionalDoctoId: 0,
        numControleCtac: '',
        descTaxa: '',
        valorDesconto: '',
        valorAcrescimo: ''
      },
      selecionadosRemover: [],
      selecionadosAdicionar: [],
      listaTaxasGravadas: [],
      listaTaxasAdicionais: [],
      loadTable: false,
      loadGravar: false,
      loadAdicionar: false,
      loadRemover: false,
      evt: '',
      obj: {}
    }
  },
  created() {
    this.$bus.$on('carregarTaxasAdicionais', obj => {
      this.obj = obj
      this.montarTelaTaxasAdicionais(this.obj)
    })
  },
  methods: {
    fecharModal(evt) {
      if (evt != true) this.$emit('close', this.listaTaxasGravadas)
    },
    async montarTelaTaxasAdicionais(obj) {
      this.loadTable = true
      await this.Base.post('MontarTelaTaxasAdicionais', {
        doctoPagtoId: this.doctoPagtoId,
        clienteId: this.obj.clienteId,
        pontoOperacaoId: this.obj.pontoOperacaoId,
        dataInicial: obj.dataInicial,
        dataFinal: obj.dataFinal,
        tabTipoCobrancaId: obj.tabTipoCobrancaId,
        taxasId: this.obj.taxasId.map(item => item.taxaAdicionalDoctoId) //this.listaTaxasGravadas.map(item => item.taxaAdicionalDoctoId)//
      }).then(res => {
        this.listaTaxasGravadas = res.data.listaTaxasGravadas
        this.listaTaxasAdicionais = res.data.listaTaxasAdicionais
        this.loadTable = false
      })
    },
    atualizarTaxa() {
      this.loadGravar = true
      this.Base.post('AtualizarTaxa', {
        doctoPagtoId: this.doctoPagtoId,
        taxaAdicionalDoctoId: this.form.taxaAdicionalDoctoId,
        valorDesconto: this.toFloat(this.form.valorDesconto),
        valorAcrescimo: this.toFloat(this.form.valorAcrescimo),
        usuarioId: this.usuarioId
      })
        .then(res => {
          this.montarTelaTaxasAdicionais(this.obj)
          this.limpar()
          this.$Notice.success({ desc: res.data })
          this.loadGravar = false
        })
        .catch(err => {
          this.$Notice.error({ desc: err.response.data.Message })
          this.loadGravar = false
        })
    },
    adicRemoveTaxa(tipo) {
      if (this.doctoPagtoId > 0) {
        tipo == 'A' ? (this.loadAdicionar = true) : (this.loadRemover = true)
        this.Base.post('AdicRemoveTaxa', {
          doctoPagtoId: this.doctoPagtoId,
          listaTaxaAdicionalDoctoId: tipo == 'A' ? this.selecionadosAdicionar : this.selecionadosRemover,
          tipo: tipo,
          usuarioId: this.usuarioId
        })
          .then(res => {
            this.$Notice.success({ desc: res.data })
            tipo == 'A' ? (this.loadAdicionar = false) : (this.loadRemover = false)
            this.atualizarListas()
            this.montarTelaTaxasAdicionais(this.obj)
            this.selecionadosRemover = []
            this.selecionadosAdicionar = []
          })
          .catch(err => {
            this.$Notice.error({ desc: err.response.data.Message })
            tipo == 'A' ? (this.loadAdicionar = false) : (this.loadRemover = false)
          })
      } else {
        if (tipo == 'R') {
          this.selecionadosRemover.forEach(item => {
            for (let i = 0; i < this.listaTaxasGravadas.length; i++) {
              if (this.listaTaxasGravadas[i].taxaAdicionalDoctoId == item) {
                this.listaTaxasAdicionais.push(this.listaTaxasGravadas[i])
                this.listaTaxasGravadas.splice(i, 1)
              }
            }
          })
        }
        if (tipo == 'A') {
          this.selecionadosAdicionar.forEach(item => {
            for (let i = 0; i < this.listaTaxasAdicionais.length; i++) {
              if (this.listaTaxasAdicionais[i].taxaAdicionalDoctoId == item) {
                this.listaTaxasGravadas.push(this.listaTaxasAdicionais[i])
                this.listaTaxasAdicionais.splice(i, 1)
              }
            }
          })
        }

        this.obj.taxasId = this.listaTaxasGravadas
        //alert(this.obj.taxasId)
        //alert(this.listaTaxasGravadas)
        this.selecionadosRemover = []
        this.selecionadosAdicionar = []
      }
    },
    atualizarListas() {
      this.listaTaxasGravadas = this.listaTaxasAdicionais.filter(
        x => this.selecionadosAdicionar.indexOf(x.taxaAdicionalDoctoId) !== -1
      )

      this.listaTaxasAdicionais = this.listaTaxasAdicionais.filter(
        x => this.selecionadosAdicionar.indexOf(x.taxaAdicionalDoctoId) === -1
      )

      this.listaTaxasGravadas = this.listaTaxasGravadas.filter(
        x => this.selecionadosRemover.indexOf(x.taxaAdicionalDoctoId) === -1
      )

      this.listaTaxasAdicionais = this.listaTaxasAdicionais.filter(
        x => this.selecionadosRemover.indexOf(x.taxaAdicionalDoctoId) !== -1
      )
    },
    carregarTaxa(evt) {
      this.form = evt
    },
    selectItemRemove(evt) {
      this.selecionadosRemover = []
      evt.map(item => {
        if (
          this.selecionadosRemover.filter(taxaAdicionalDoctoId => taxaAdicionalDoctoId == item.taxaAdicionalDoctoId)
            .length == 0
        )
          this.selecionadosRemover.push(item.taxaAdicionalDoctoId)
      })
    },
    selectItemAdicionar(evt) {
      this.selecionadosAdicionar = []
      evt.map(item => {
        if (
          this.selecionadosAdicionar.filter(taxaAdicionalDoctoId => taxaAdicionalDoctoId == item.taxaAdicionalDoctoId)
            .length == 0
        )
          this.selecionadosAdicionar.push(item.taxaAdicionalDoctoId)
      })
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    },
    toFloat(item) {
      return parseFloat(item.replace('.', '').replace(',', '.'))
    },
    limpar() {
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
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
