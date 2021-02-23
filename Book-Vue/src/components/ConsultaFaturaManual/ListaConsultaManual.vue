<template>
  <div class="content">
    <Row>
      <Col span="24" class="center-botoes">
        <Button id="btn-Voltar_Fatura01" class="margem-botoes" @click="voltar">Voltar</Button>
      </Col>
    </Row>
    <Row v-if="listaPorPagina" :gutter="24">
      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="columns"
          :data="lista"
          @on-row-click="abrirFatura($event)"
        ></Table>
        <div style="float: left;margin: 10px;">
          <Button id="btn-MostrarTudo_Fatura" @click="listaPorPagina = false">Mostrar tudo</Button>
        </div>
        <div style="float: right;margin: 10px;">
          <Page :total="totalLines" :current="currentPage" :page-size="perPage" @on-change="changePage($event)"></Page>
        </div>
      </div>
    </Row>
    <Row v-else :gutter="24">
      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="columns"
          :data="lista2"
          @on-row-click="abrirFatura($event)"
        ></Table>
        <div style="float: left;margin: 10px;">
          <Button @click="listaPorPagina = true">Mostrar por páginas</Button>
        </div>
      </div>
    </Row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      columnsCte: [
        {
          title: 'Cliente',
          key: 'cliente',
          sortable: true,
          align: 'center',
          minWidth: 100
        },
        {
          title: 'CNPJ/CUIT/CPF',
          key: 'cnpjCpf',
          sortable: true,
          minWidth: 100,
          align: 'center'
        },
        {
          title: 'Ponto Operação',
          key: 'pontoOperacao',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Quant',
          key: 'quantidade',
          sortable: true,
          align: 'center',
          minWidth: 60
        },
        {
          title: 'Valor Total',
          key: 'valorTotal',
          sortable: true,
          width: 115,
          align: 'center'
        },
        {
          title: 'Tipo Cliente',
          key: 'tipoCliente',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Resp. Financeiro',
          key: 'nomeUsuario',
          sortable: true,
          width: 160,
          align: 'center'
        }
      ],
      columnsBL: [
        {
          title: 'Cliente',
          key: 'cliente',
          sortable: true,
          maxWidth: 280,
          minWidth: 120,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'CNPJ    /CUIT/CPF',
          key: 'cnpjCpf',
          sortable: true,
          maxWidth: 160,
          minWidth: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'BL',
          key: 'numControleCtac',
          sortable: true,
          maxWidth: 150,
          minWidth: 90,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'Ponto Operação',
          key: 'pontoOperacao',
          sortable: true,
          maxWidth: 150,
          minWidth: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'Quant',
          key: 'quantidade',
          sortable: true,
          maxWidth: 90,
          minWidth: 70,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'R$',
          key: 'valorReal',
          sortable: true,
          maxWidth: 90,
          minWidth: 70,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'US$',
          key: 'valorDolar',
          sortable: true,
          maxWidth: 90,
          minWidth: 70,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'Tipo Cliente',
          key: 'tipoCliente',
          sortable: true,
          maxWidth: 120,
          minWidth: 80,
          align: 'center',
          ellipsis: true
        },
        {
          title: 'Resp. Financeiro',
          key: 'nomeUsuario',
          sortable: true,
          align: 'center',
          ellipsis: true
        }
      ],
      lista: [],
      lista2: [],
      currentPage: 1,
      perPage: 10,
      listaPorPagina: true
    }
  },
  created() {
    this.lista = this.consultaFaturaManual.listaConsultaManual.slice(0, this.perPage)
    this.lista2 = this.consultaFaturaManual.listaConsultaManual
  },
  mounted() {},
  computed: {
    totalLines() {
      return this.consultaFaturaManual.listaConsultaManual.length
    },
    columns() {
      return this.formConsultaFaturaManual.operacao == 'Nacional' ? this.columnsCte : this.columnsBL
    },
    /*lista() {
      return this.consultaFaturaManual.listaConsultaManual.slice(0,this.perPage)
    },
    lista2(){
      return this.consultaFaturaManual.listaConsultaManual
    },*/
    ...mapGetters(['consultaFaturaManual', 'usuarioId', 'formConsultaFaturaManual'])
  },
  methods: {
    voltar() {
      this.setConsultaFaturaManual({
        mostraListaConsultaManual: false,
        listaConsultaManual: []
      })
    },

    async abrirFatura(evt) {
      const faturaManualBusca = await {
        clienteId: evt.clienteId,
        pontoOperacaoId: evt.pontoOperacaoId,
        tabTipoCobrancaId: evt.tabTipoCobrancaId,
        dataInicial: this.formConsultaFaturaManual.dataInicial,
        dataFinal: this.formConsultaFaturaManual.dataFinal,
        operacao: this.formConsultaFaturaManual.operacao,
        doctoTransporteId: evt.doctoTransporteId,
        doctosTransporteIDs: evt.doctoTransporteId /*Tom - Adicionada ï¿½ busca os CTES por doctoTransporte_Id*/
      }

      this.$router.push({
        name: 'FaturaManual',
        params: {
          faturaManualBusca: faturaManualBusca
        }
      })
    },
    changePage(evt) {
      this.lista = this.consultaFaturaManual.listaConsultaManual.slice(
        evt * this.perPage - this.perPage,
        evt * this.perPage
      )
      this.currentPage = evt
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    },
    ...mapActions(['setConsultaFaturaManual'])
  }
}
</script>
