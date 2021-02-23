import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Home from '@/views/Home'
import ConsultaFatura from '@/views/ConsultaFatura'
import ConsultaFaturaManual from '@/views/ConsultaFaturaManual'
import RegrasFaturamento from '@/views/RegrasFaturamento'
import Fatura from '@/views/Fatura'
import RegrasFaturamentoPesquisa from '@/views/RegrasFaturamentoPesquisa'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/fatura/:id/:rotaOrigem',
      name: 'Fatura',
      component: Fatura,
      props: true
    },
    {
      path: '/fatura',
      name: 'FaturaManual',
      component: Fatura,
      props: route => ({
        ...route.params
      })
    },
    {
      path: '/consulta',
      name: 'ConsultaFatura',
      component: ConsultaFatura
    },
    {
      path: '/consulta-fatura-manual',
      name: 'ConsultaFaturaManual',
      component: ConsultaFaturaManual
    },
    {
      path: '/regras-faturamento/:id',
      name: 'RegrasFaturamentoId',
      component: RegrasFaturamento,
      props: true
    },
    {
      path: '/regras-faturamento',
      name: 'RegrasFaturamento',
      component: RegrasFaturamento
    },
    {
      path: '/pesquisar-regras-faturamento',
      name: 'RegrasFaturamentoPesquisa',
      component: RegrasFaturamentoPesquisa
    }
  ]
})
