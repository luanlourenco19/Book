<template>
  <div>
    <Header title="Consulta de Faturas" />
    <FormConsulta v-show="!consultaFatura.mostraListaConsulta" />
    <ListaConsulta v-if="consultaFatura.mostraListaConsulta" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import FormConsulta from '@/components/ConsultaFatura/FormConsulta'
import ListaConsulta from '@/components/ConsultaFatura/ListaConsulta'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { Header, FormConsulta, ListaConsulta },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['consultaFatura', 'usuarioId'])
  },
  created() {
    this.montarTela()
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
          permiteLiberarPrefat: res.data.permiteLiberarPrefat,
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
