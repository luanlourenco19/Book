<template>
  <div class="content">
    <Col span="24">
      <Row>
        <Col span="24" class="center-botoes">
          <Button class="margem-botoes" @click="voltar">Voltar</Button>
        </Col>
      </Row>

      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="columns"
          :data="consultaRegra.listaConsultaRegra"
          @on-row-click="abrirAcordo"
        ></Table>
      </div>
    </Col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      columns: [
        {
          title: 'Código Acordo',
          key: 'acordoFaturamentoId',
          sortable: true,
          width: 140,
          align: 'center'
        },
        {
          title: 'Cliente',
          key: 'cliente',
          sortable: true,
          align: 'center'
        },
        {
          title: 'CNPJ/CUIT/CPF',
          key: 'cnpjCpf',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Grupo',
          key: 'grupoCliente',
          sortable: true,
          width: 180,
          align: 'center'
        },
        {
          title: 'Operação',
          key: 'operacao',
          sortable: true,
          width: 220,
          align: 'center'
        },
        {
          title: 'Raiz Cnpj',
          key: 'radicalCnpj',
          sortable: true,
          width: 220,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['consultaRegra'])
  },
  methods: {
    voltar() {
      this.setConsultaRegra({
        mostraListaConsultaRegra: false,
        listaConsultaRegra: []
      })
    },
    abrirAcordo(row, index) {
      this.setConsultaRegra({
        mostraListaConsultaRegra: false,
        listaConsultaRegra: []
      })
      this.$router.push(`regras-faturamento/${row.acordoFaturamentoId}`)
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    },
    ...mapActions(['setConsultaRegra'])
  }
}
</script>
