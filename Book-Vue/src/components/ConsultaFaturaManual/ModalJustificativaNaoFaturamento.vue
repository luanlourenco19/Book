<template>
  <div>
    <Modal v-model="abrirModal" width="900" :scrollable="true" @on-visible-change="fecharModal($event)">
      <p slot="header" style="text-align:center;font-size:18px;">
        <span>Justificativa de Não faturamento</span>
      </p>

      <Row :gutter="12" class="top bottom">
        <Col span="24">
          <strong>Justificativa Não Faturamento</strong>
          <Select v-model="tabObservacaoId" filterable clearable style="width: 400px;">
            <Option v-for="item in telaConsulta.observacoes" :key="item.observacaoId" :value="item.observacaoId">{{
              item.observacao
            }}</Option>
          </Select>
        </Col>
      </Row>

      <Row :gutter="12" class="top bottom">
        <Col span="24">
          <strong>Observação Justificativa Não Faturamento</strong>
          <textarea
            v-model="observacaoNaoFat"
            :autosize="{ minRows: 2, maxRows: 5 }"
            :maxlength="3000"
            style="width:100%;"
            placeholder="Digite Observação Justificativa Não Faturamento"
          ></textarea>
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
        @on-selection-change="selectItem"
      ></Table>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button type="primary" class="margem-botoes" :loading="loadGravar" @click="gravar">
            <span v-if="!loadGravar">Gravar</span>
            <span v-else>Gravando...</span>
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
//import Autocomplete from '@/components/Autocomplete'
export default {
  props: ['open'],
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: 'Nº Fiscal',
          key: 'numDoctoTransporte',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'Nº Documento',
          key: 'numControleCtac',
          sortable: true,
          width: 140,
          align: 'center'
        },
        {
          title: 'Justificativa',
          key: 'observacao',
          sortable: true,
          width: 140,
          align: 'center'
        },
        {
          title: 'Data Observação',
          key: 'dataObsNaoFaturado',
          sortable: true,
          width: 155,
          align: 'center'
        },
        {
          title: 'Usuário Observação',
          key: 'usuarioObsNaoFaturado',
          sortable: true,
          width: 170,
          align: 'center'
        },
        {
          title: 'Obs.',
          key: 'Detalhes',
          sortable: false,
          width: 90,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                },
                '+'
              )
            ])
          }
        }
      ],
      listaConhecimentos: [],
      listaDoctos: [],
      selecionados: [],
      tabObservacaoId: 0,
      loadGravar: false,
      loadTable: false,
      observacaoNaoFat: ''
    }
  },
  created() {
    this.$bus.$on('carregarConhecimentosJustNaoFaturamento', listaDoctos => {
      this.listaDoctos = listaDoctos
      this.montarTelaJustificativaNaoFaturamento(listaDoctos)
    })
  },
  methods: {
    show(index) {
      if (this.listaConhecimentos[index].observacaoNaoFat == null)
        this.listaConhecimentos[index].observacaoNaoFat = 'Sem Observação cadastrada'

      this.$Modal.info({
        title: ' Observação Justificativa Não Faturamento ',
        content: `<br>${this.listaConhecimentos[index].observacaoNaoFat}`,
        scrollable: true,
        width: 500
      })
    },
    fecharModal(evt) {
      if (evt != true) this.$emit('close')
    },
    montarTelaJustificativaNaoFaturamento(listaDoctos) {
      this.loadTable = true
      this.Base.post('montarTelaJustificativaNaoFaturamento', {
        doctosTransporteId: listaDoctos.map(item => item.doctoTransporteId)
      }).then(res => {
        this.listaConhecimentos = res.data
        this.loadTable = false
      })
    },
    gravar() {
      if (this.selecionados.length == 0) {
        this.$Notice.error({ desc: 'Selecione ao menos um documento.' })
        return
      }

      if (this.tabObservacaoId == 0) {
        this.$Notice.error({ desc: 'Selecione observação.' })
        return
      }

      if (this.tabObservacaoId > 0 && this.tabObservacaoId !== null) {
        this.loadGravar = true

        this.Base.post('GravarJustificativaCte', {
          doctosTransporteId: this.selecionados,
          tabObservacaoId: this.tabObservacaoId,
          usuarioId: this.usuarioId,
          observacaoNaoFat: this.observacaoNaoFat == null ? '' : this.observacaoNaoFat
        })
          .then(res => {
            this.$Notice.success({ desc: res.data })
            this.loadGravar = false
            this.selecionados = []
            this.montarTelaJustificativaNaoFaturamento(this.listaDoctos)
          })
          .catch(err => {
            this.$Notice.error({ desc: err.response.data.Message })
            this.loadGravar = false
          })
      } else {
        this.$Notice.error({ desc: 'Selecione observação.' })
        return
      }
    },
    selectItem(evt) {
      this.selecionados = []
      evt.map(item => {
        if (this.selecionados.filter(doctoTransporteId => doctoTransporteId == item.doctoTransporteId).length == 0)
          this.selecionados.push(item.doctoTransporteId)
      })
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
    ...mapGetters(['usuarioId', 'telaConsulta'])
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
