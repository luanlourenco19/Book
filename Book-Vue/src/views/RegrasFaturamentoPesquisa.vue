<template>
  <div>
    <Header title="Consulta de Acordo de Faturamento" />
    <FormConsulta v-show="!consultaRegra.mostraListaConsultaRegra" />
    <ListaConsulta v-if="consultaRegra.mostraListaConsultaRegra" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import FormConsulta from '@/components/RegrasFaturamento/FormConsulta'
import ListaConsulta from '@/components/RegrasFaturamento/ListaConsulta'
import { mapGetters } from 'vuex'
export default {
  components: { Header, FormConsulta, ListaConsulta },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['consultaRegra'])
  }
}
</script>
