<template>
  <div class="content">
    <Row>
      <Col span="24" class="center-botoes">
        <Button
          id="btn-Imprimir_Consulta"
          type="primary"
          class="margem-botoes"
          :loading="loadImprimir"
          :disabled="!hasSelected"
          @click="imprimir"
        >
          <span v-if="!loadImprimir">Imprimir</span>
          <span v-else>Imprimindo...</span>
        </Button>
        <Button
          id="btn-Excluir_Consulta"
          type="error"
          class="margem-botoes"
          :loading="loadExcluir"
          :disabled="!hasSelected"
          @click="confirmarExclusao()"
        >
          <span v-if="!loadExcluir">Excluir</span>
          <span v-else>Excluindo...</span>
        </Button>
        <Button id="btn-Voltar_Consulta01" class="margem-botoes" @click="voltar">Voltar</Button>
      </Col>
    </Row>
    <Row v-if="listaPorPagina" span="24">
      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="columns"
          :data="lista"
          :loading="loadTable"
          @on-selection-change="selectItem"
        ></Table>
        <div style="float: left;margin: 10px;">
          <Button id="btn-MostrarTudo_Consulta" @click="listaPorPagina = false">Mostrar tudo</Button>
        </div>
        <div style="float: left;margin-top: 16px;margin-right:10px;">
          <p>Total de faturas: {{ totalLines }}</p>
        </div>
        <div style="float: left;margin-top: 16px;">
          <p>Valor total das faturas: {{ valorTotalFormatted }}</p>
        </div>
        <div style="float: right;margin: 10px;">
          <Page :total="totalLines" :current="currentPage" :page-size="perPage" @on-change="changePage($event)"></Page>
        </div>
      </div>
    </Row>
    <Row v-else span="24">
      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="columns"
          :data="lista2"
          :loading="loadTable"
          @on-selection-change="selectItem"
        ></Table>
        <div style="float: left;margin: 10px;">
          <Button @click="listaPorPagina = true">Mostrar por páginas</Button>
        </div>
        <div style="float: left;margin-top: 16px;margin-right:10px;">
          <p>Total de faturas: {{ totalLines }}</p>
        </div>
        <div style="float: left;margin-top: 16px;">
          <p>Valor total das faturas: {{ valorTotalFormatted }}</p>
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
      columns: [
        {
          type: 'selection',
          width: 55,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'Código',
          sortable: true,
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.abreFatura(params.row.doctoPagtoId)
                  }
                }
              },
              params.row.doctoPagtoId
            )
          }
        },
        {
          title: 'Fatura/Pré-Nota',
          key: 'numDocto',
          sortable: true,
          width: 100,
          align: 'center'
        },
        {
          title: 'Dt Emissão',
          key: 'dataEmissao',
          sortable: true,
          width: 105,
          align: 'center'
        },
        {
          title: 'Dt Vencimento',
          key: 'datavencimento',
          sortable: true,
          width: 130,
          align: 'center'
        },
        {
          title: 'Cliente',
          key: 'cliente',
          sortable: true,
          minWidth: 160,
          align: 'center'
        },
        {
          title: 'Valor',
          key: 'valor',
          sortable: true,
          width: 100,
          align: 'center'
        },
        {
          title: 'Tipo',
          key: 'tipo',
          sortable: true,
          width: 85,
          align: 'center'
        },
        {
          title: 'Status',
          key: 'statusFatura',
          sortable: true,
          width: 110,
          align: 'center'
        },
        {
          title: 'Nosso Número',
          key: 'nossoNumero',
          sortable: true,
          width: 85,
          align: 'center'
        },
        {
          title: 'Tipo Cliente',
          key: 'tipoCliente',
          sortable: true,
          width: 115,
          align: 'center'
        },
        {
          title: 'Responsável Financeiro',
          key: 'nomeUsuario',
          sortable: true,
          minWidth: 115,
          align: 'center'
        }
      ],
      selecionados: [],
      lista: [],
      lista2: [],
      doctoPagtos: [],
      loadTable: false,
      currentPage: 1,
      perPage: 10,
      loadExcluir: false,
      loadImprimir: false,
      listaPorPagina: true,
      quantidadeTentativas: 0
    }
  },
  computed: {
    totalLines() {
      return this.consultaFatura.listaConsulta.length
    },
    valorTotal() {
      return this.consultaFatura.listaConsulta.reduce(
        (acc, item) => acc + parseFloat(item.valor.replace(/\./g, '').replace(',', '.')),
        0
      )
    },
    valorTotalFormatted() {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(this.valorTotal)
    },
    hasSelected() {
      return this.selecionados.length
    },
    ...mapGetters(['consultaFatura', 'usuarioId'])
  },
  created() {
    this.lista = this.consultaFatura.listaConsulta.slice(0, this.perPage)
    this.lista2 = this.consultaFatura.listaConsulta //Lista em paginação
  },
  methods: {
    voltar() {
      this.setConsultaFatura({
        mostraListaConsulta: false,
        listaConsulta: []
      })
    },
    async abreFatura(doctoPagtoId) {
      this.$router.push(`fatura/${doctoPagtoId}/ListaConsulta`)
    },
    confirmarExclusao() {
      this.$Modal.confirm({
        title: 'Confirmar Exclusão',
        content: 'Você confirma a exclusão das faturas selecionadas?',
        onOk: this.excluir
      })
    },
    async imprimir() {
      try {
        this.loadImprimir = true
        this.quantidadeTentativas += 1

        await this.Base.get('Imprimir', {
          params: {
            doctosPagtoId: this.selecionados.join(','),
            usuarioId: this.usuarioId
          }
        })

        await this.download()

        await this.refreshBusca()

        this.$Notice.success({
          desc: 'Fatura impressa com sucesso.'
        })

        this.loadImprimir = false
        this.quantidadeTentativas = 0
        this.selecionados = []
      } catch(error) {
        if (error.response.status == 404 && this.quantidadeTentativas <= 20) {
          setTimeout(() => {
            this.imprimir()
          }, 1000)
          return
        }

        this.loadImprimir = false
        this.quantidadeTentativas = 0

        if (error.response.status == 404){
          this.$Notice.warning({
            desc: 'O processo de impressão está demorando mais que o esperado, tente novamente em alguns instantes.'
          })
          return
        }

        this.$Notice.error({
         desc: 'Problema ao imprimir fatura.'
        })
      }
    },
    async download() {
      const res = await this.Base.get('Download', {
        params: {
          doctosPagtoId: this.selecionados.join(',')
        },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `FATURA${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[-T:]/g, '')}.pdf`
      )
      document.body.appendChild(link)
      link.click()
    },
    excluir() {
      if (this.selecionados.length == 0) {
        this.$Notice.error({
          desc: 'Selecione ao menos uma fatura para excluir.'
        })
        return
      }
      this.loadExcluir = true
      this.Base.post('ExcluirLote', {
        doctosPagtoId: this.selecionados,
        usuarioId: this.usuarioId
      })
        .then(res => {
          this.refreshBusca()
          this.selecionados = []
          this.$Notice.success({
            desc: res.data
          })
        })
        .catch(err => {
          this.$Notice.error({
            desc: err.response.data.Message
          })
        })
        .finally(() => {
          this.loadExcluir = false
        })
    },
    selectItem(evt) {
      this.selecionados = []
      evt.map(item => {
        if (this.selecionados.filter(doctoPagtoId => doctoPagtoId == item.doctoPagtoId).length == 0)
          this.selecionados.push(item.doctoPagtoId)
      })
    },
    changePage(evt) {
      this.lista = this.consultaFatura.listaConsulta.slice(evt * this.perPage - this.perPage, evt * this.perPage)
      this.currentPage = evt
    },
    async refreshBusca() {
      this.loadTable = true
      await this.Base.post('AtualizarFaturas', this.consultaFatura.listaDoctosPagtos).then(res => {
        if (res.data.listaConsulta.length > 0) {
          this.lista = []
          this.lista2 = []
          this.setConsultaFatura({
            mostraListaConsulta: true,
            listaConsulta: res.data.listaConsulta,
            listaDoctosPagtos: res.data.listaDoctosPagtos
          })
          this.lista = res.data.listaConsulta.slice(0, this.perPage)
          this.lista2 = res.data.listaConsulta //Lista em paginação
          this.changePage(this.currentPage)
          this.loadTable = false
        }
      })
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    },
    ...mapActions(['setConsultaFatura'])
  }
}
</script>
