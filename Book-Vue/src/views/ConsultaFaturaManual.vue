<template>
  <div>
    <Header title="Fatura Manual" />
    <FormConsultaManual v-show="!consultaFaturaManual.mostraListaConsultaManual" />
    <ListaConsultaManual v-if="consultaFaturaManual.mostraListaConsultaManual" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import FormConsultaManual from '@/components/ConsultaFaturaManual/FormConsultaManual'
import ListaConsultaManual from '@/components/ConsultaFaturaManual/ListaConsultaManual'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { Header, FormConsultaManual, ListaConsultaManual },
  data() {
    return {}
  },
  created() {
    this.montarTela()
  },
  computed: {
    ...mapGetters(['consultaFaturaManual', 'usuarioId'])
  },
  methods: {
    montarTela() {
      this.Base.get('MontarTela', {
        params: {
          usuarioId: this.usuarioId
        }
      }).then(res => {
        this.setTelaConsulta({
          filiais: res.data.filiais,
          gruposCliente: res.data.gruposCliente,
          status: [
            { statusId: 0, descStatus: 'Todas' },
            { statusId: 1, descStatus: 'Exportada' },
            { statusId: 2, descStatus: 'Cancelada' },
            { statusId: 3, descStatus: 'Impressa' },
            { statusId: 4, descStatus: 'Liberada p/ Impressão' },
            { statusId: 5, descStatus: 'Liberar Prefat' }
          ],
          tiposCliente: res.data.tiposCliente,
          respFinanceiros: res.data.respFinanceiros,
          portoOrigem: res.data.portoOrigem,
          portoDestino: res.data.portoDestino,
          observacoes: res.data.observacoes,
          qtdeMaximaDoctosFatura: res.data.qtdeMaximaDoctosFatura,
          FlagObservacaoNumPedido: res.data.FlagObservacaoNumPedido,
          tabTipoModal: res.data.tabTipoModal
        })
      })
    },
    ...mapActions(['setTelaConsulta'])
  }
}
</script>
