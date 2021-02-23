<template>
  <div>
    <Modal
      v-model="abrirModal"
      :width="width"
      title="Lista de Conhecimentos da Fatura"
      :scrollable="true"
      @on-visible-change="fecharModal($event)"
    >
      <p slot="header" style="text-align:center;font-size:18px;">
        <span>Lista de Conhecimentos da Fatura</span>
      </p>

      <Row :gutter="12">
        <Col span="8" offset="2">
          <strong>Nº Fiscal</strong>
          <Autocomplete
            v-model="doctoTransporte"
            action="DoctoTransporte"
            :valor="doctoTransporte.numDoctoTransporte"
            campos-visiveis="numDoctoTransporte,numControleCtac"
            nomes-campos=""
            width="200px"
            height="200px"
            :where="filialId"
            @clear="doctoTransporte = {}"
          />
        </Col>

        <Col span="5">
          <strong>Valor Total</strong>
          <p>{{ doctoTransporte.valorTotal }}</p>
        </Col>

        <Col span="5">
          <strong>Ponto Operação</strong>
          <p>{{ doctoTransporte.pontoOperacao }}</p>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="22" offset="2">
          <strong>Cliente</strong>
          <p>{{ doctoTransporte.cliente }}</p>
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            :disabled="!doctoTransporte.doctoTransporteId > 0"
            class="margem-botoes"
            :loading="loadAdicionar"
            @click="adicionarDocto"
          >
            <span v-if="!loadAdicionar">Adicionar</span>
            <span v-else>Adicionando...</span>
          </Button>

          <Button class="margem-botoes" @click="limpar">Limpar</Button>

          <Button
            v-if="faturaPrefat && !faturaLiberada"
            type="primary"
            :disabled="!permiteLiberarPrefat"
            class="margem-botoes"
            :loading="loadLiberar"
            @click="liberarPrefat"
          >
            <span v-if="!loadLiberar">Liberar</span>
            <span v-else>Liberando...</span>
          </Button>
        </Col>
      </Row>

      <Table
        ref="selection"
        :row-class-name="rowClassName"
        stripe
        border
        :columns="columns"
        :data="listaConhecimentos"
        :loading="loadTable"
        @on-selection-change="selectItemRemove"
      ></Table>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            :disabled="selecionadosRemover.length == 0"
            class="margem-botoes"
            :loading="loadRemover"
            @click="removerDoctos"
          >
            <span v-if="!loadRemover">Remover</span>
            <span v-else>Removendo...</span>
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
import Autocomplete from '@/components/Autocomplete'
export default {
  components: { Autocomplete },
  props: ['open', 'doctoPagtoId', 'filialId', 'clienteId', 'tabStatusId'],
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
          title: 'Número Fiscal',
          key: 'numDoctoTransporte',
          sortable: true,
          width: 140,
          align: 'center'
        },
        {
          title: 'Nº Documento',
          key: 'numControleCtac',
          sortable: true,
          width: 145,
          align: 'center'
        },
        {
          title: 'Data Emissão',
          key: 'dataEmissao',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Tipo Documento',
          key: 'tipoDocto',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Valor Total',
          key: 'valorTotal',
          sortable: true,
          width: 130,
          align: 'center'
        }
      ],
      selecionadosRemover: [],
      listaConhecimentos: [],
      loadTable: false,
      loadRemover: false,
      loadLiberar: false,
      doctoTransporte: {},
      loadAdicionar: false,
      width: 700,
      faturaLiberada: false
    }
  },
  created() {
    this.$bus.$on('carregarDetalhesConhecimentos', listaDoctos => {
      this.montarTelaDetalhesConhecimentos(listaDoctos)
      this.limpar()
      if (this.faturaPrefat) {
        this.columns.push({
          title: 'Valor Prefat',
          key: 'valorPrefat',
          sortable: true,
          width: 140,
          align: 'center'
        })

        this.columns.push({
          title: 'Diferença Prefat',
          key: 'diferencaPrefat',
          sortable: true,
          width: 150,
          align: 'center'
        })

        this.width = 948
      }
    })
  },
  methods: {
    fecharModal(evt) {
      if (evt != true) this.$emit('close', this.listaConhecimentos)
    },
    montarTelaDetalhesConhecimentos(listaDoctos) {
      this.loadTable = true
      this.Base.post('MontarTelaDetalhesConhecimentos', {
        doctoPagtoId: this.doctoPagtoId,
        doctosTransporteId: listaDoctos.map(item => item.doctoTransporteId)
      }).then(res => {
        this.listaConhecimentos = res.data
        this.loadTable = false
      })
    },
    removerDoctos() {
      if(this.selecionadosRemover.length != this.listaConhecimentos.length)
      {
        if (this.doctoPagtoId > 0) {
          this.loadRemover = true
          this.Base.post('RemoverDoctos', {
            doctoPagtoId: this.doctoPagtoId,
            listaDoctoTransporteId: this.selecionadosRemover,
            usuarioId: this.usuarioId
          })
            .then(res => {
              this.montarTelaDetalhesConhecimentos([])
              this.$Notice.success({ desc: res.data })
              this.loadRemover = false
              this.selecionadosRemover = []
            })
            .catch(err => {
              this.$Notice.error({ desc: err.response.data.Message })
              this.loadRemover = false
            })
        } else {
          this.selecionadosRemover.forEach(item => {
            for (let i = 0; i < this.listaConhecimentos.length; i++) {
              if (this.listaConhecimentos[i].doctoTransporteId == item) {
                this.listaConhecimentos.splice(i, 1)
              }
            }
          })
        }
      }else{
        this.$Notice.error({ desc: 'Não é possível remover todos os CTEs' })
      }
    },
    selectItemRemove(evt) {
      this.selecionadosRemover = []
      evt.map(item => {
        if (
          this.selecionadosRemover.filter(doctoTransporteId => doctoTransporteId == item.doctoTransporteId).length == 0
        )
          this.selecionadosRemover.push(item.doctoTransporteId)
      })
    },
    adicionarDocto() {
      if (this.doctoPagtoId > 0) {
        this.loadAdicionar = true
        this.Base.post('AdicionarDocto', {
          doctoPagtoId: this.doctoPagtoId,
          doctoTransporteId: this.doctoTransporte.doctoTransporteId,
          usuarioId: this.usuarioId
        })
          .then(res => {
            this.montarTelaDetalhesConhecimentos([])
            this.$Notice.success({ desc: res.data })
            this.loadAdicionar = false
            this.doctoTransporte = {}
          })
          .catch(err => {
            this.$Notice.error({ desc: err.response.data.Message })
            this.loadAdicionar = false
          })
      } else {
        if (this.listaConhecimentos.length >= this.telaConsulta.qtdeMaximaDoctosFatura) {
          this.$Notice.error({
            desc: `A quantidades de documentos vinculados a fatura ultrapassa o máximo permitido (${this.telaConsulta.qtdeMaximaDoctosFatura}).`
          })
          return
        }

        if (this.doctoTransporte.pontoOperacaoId != this.filialId) {
          this.$Notice.error({
            desc:
              'Não será possível adicionar este documento pois o ponto de operação é diferente do ponto de operação da fatura.'
          })
          return
        }

        if (this.doctoTransporte.clienteId != this.clienteId) {
          this.$Notice.error({
            desc: 'Não será possível adicionar este documento pois o cliente é diferente do cliente da fatura.'
          })
          return
        }

        if (this.doctoTransporte.doctoPagtoId > 0) {
          this.$Notice.error({
            desc: 'Não será possível adicionar este documento pois o mesmo já possui fatura.'
          })
          return
        }

        if (
          this.listaConhecimentos.filter(item => item.doctoTransporteId == this.doctoTransporte.doctoTransporteId)
            .length > 0
        ) {
          this.$Notice.error({
            desc: 'Não será possível adicionar este documento pois o mesmo já está nessa fatura.'
          })
          return
        }

        this.listaConhecimentos.push(this.doctoTransporte)
      }
    },
    liberarPrefat() {
      this.loadLiberar = true
      this.Base.get('LiberarPrefat', {
        params: {
          doctoPagtoId: this.doctoPagtoId,
          usuarioId: this.usuarioId
        }
      })
        .then(res => {
          this.$Notice.success({ desc: res.data })
          this.loadLiberar = false
          this.faturaLiberada = true
        })
        .catch(err => {
          this.$Notice.error({ desc: err.response.data.Message })
          this.loadLiberar = false
        })
    },
    limpar() {
      this.doctoTransporte = {}
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    }
  },
  computed: {
    abrirModal: {
      get: function() {
        return this.open
      },
      set: function() {}
    },
    faturaPrefat() {
      return this.tabStatusId == 127
    },
    permiteLiberarPrefat() {
      return this.telaConsulta.permiteLiberarPrefat
    },
    ...mapGetters(['usuarioId', 'telaConsulta'])
  }
}
</script>
