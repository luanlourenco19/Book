<template>
  <div>
    <Header title="Regras de Faturamento" />
    <CadastroRegra :id="id" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import CadastroRegra from '@/components/RegrasFaturamento/CadastroRegra'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Header,
    CadastroRegra
  },
  props: ['id'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['usuarioId'])
  },
  created() {
    this.montarTelaAcordo()
  },
  methods: {
    montarTelaAcordo() {
      this.Base.get('MontarTelaAcordo', {
        params: {
          usuarioId: this.usuarioId
        }
      }).then(res => {
        this.setTelaConsultaAcordo({
          tiposCliente: res.data.TiposCliente,
          respFinanceiros: res.data.RespFinanceiros,
          filiais: res.data.Filiais,
          tabTipoFaturamento: res.data.TabTipoFaturamento,
          ApresentarAcordoRaiz: res.data.ApresentarAcordoRaiz,
          FlagDesabilitaExcluir: res.data.FlagDesabilitaExcluir,
          tabTipoEnvioFat: res.data.TabTipoEnvioFat,
          tiposCanhoto: res.data.TiposCanhoto,
          tiposProtocolo: res.data.TiposProtocolo,
          tiposPeriodo: res.data.TiposPeriodo,
          FlagHabilitaCanhoto: res.data.FlagHabilitaCanhoto,
          FlagHabilitaNumPedidoObsFatura: res.data.FlagHabilitaNumPedidoObsFatura,
          FlagHabilitaTipoAgrupamentoEnvio: res.data.FlagHabilitaTipoAgrupamentoEnvio,
          TiposAgrupamentoEnvio: res.data.TiposAgrupamentoEnvio,
          tipoVenda: res.data.TipoVenda
        })
      })
    },
    ...mapActions(['setTelaConsultaAcordo'])
  }
}
</script>
