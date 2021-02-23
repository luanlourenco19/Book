import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    consultaFatura: {
      mostraListaConsulta: false,
      listaConsulta: [],
      listaDoctosPagtos: []
    },
    consultaFaturaManual: {
      mostraListaConsultaManual: false,
      listaConsultaManual: []
    },
    consultaRegra: {
      mostraListaConsultaRegra: false,
      listaConsultaRegra: []
    },
    telaConsulta: {
      filiais: [],
      gruposCliente: [],
      status: [],
      tiposCliente: [],
      respFinanceiros: [],
      portoOrigem: [],
      portoDestino: [],
      observacoes: [],
      qtdeMaximaDoctosFatura: 0,
      permiteLiberarPrefat: false,
      tabTipoModal: [],
      tabTipoFaturamento: [],
      FlagObservacaoNumPedido: false
    },
    telaConsultaAcordo: {
      filiais: [],
      status: [],
      tiposCliente: [],
      respFinanceiros: [],
      permiteLiberarPrefat: false,
      tabTipoFaturamento: [],
      ApresentarAcordoRaiz: false,
      FlagDesabilitaExcluir: false,
      tabTipoEnvioFat: [],
      tiposCanhoto: [],
      tiposProtocolo: [],
      tiposPeriodo: [],
      FlagHabilitaCanhoto: false,
      FlagHabilitaTipoAgrupamentoEnvio: false,
      TipoAgrupamentoEnvioId: 1,
      tipoVenda: []
    },
    formConsultaFatura: {
      data: '',
      dataInicial: '',
      dataFinal: '',
      tipoData: 'Emissão',
      operacao: 'Nacional',
      filialId: 0,
      numBl: '',
      numFatura: '',
      numCtac: '',
      nossoNumero: '',
      grupoClienteId: 0,
      statusId: 0,
      tipoClienteId: 0,
      respFinanceiroId: 0,
      cliente: {},
      clienteId: 0,
      codigoInterno: ''
    },
    formConsultaFaturaManual: {
      data: '',
      dataInicial: '',
      dataFinal: '',
      operacao: 'Nacional',
      filialId: 0,
      tipoClienteId: 0,
      respFinanceiroId: 0,
      cliente: {},
      clienteId: 0,
      navioViagem: {},
      ViagemNavioId: 0,
      portoOrigemId: 0,
      portoDestinoId: 0,
      numDoctoTransporte: '',
      tabTipoModalId: 0
    },
    formModalCanhoto: {
      parametrosCanhotoClienteId: 0,
      parametrosClienteId: 0,
      tabTipoCanhotoPagtoId: 0,
      txtPdfFornecedor: '',
      tabTipoCanhotoEmailCliId: 0,
      emailCanhoto: '',
      endCanhotoFisicoCliente: '',
      tabTipoCanhotoFatId: 0,
      tabTipoProtocoloId: 0,
      tabTipoPeriodoId: 0,
      flagProcessoCliente: '',
      flagProcessoClienteBool: false,
      tabStatusId: 0,
      listaEmails: []
    },
    doctoPagtoId: 0,
    usuarioId: localStorage.getItem('usuarioId') ? localStorage.getItem('usuarioId') : 1
  }
}

const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    RESET_STATE(state, payload) {
      Object.assign(state, payload)
    },
    SET_CONSULTA_FATURA(state, payload) {
      state.consultaFatura = payload
    },
    SET_CONSULTA_FATURA_MANUAL(state, payload) {
      state.consultaFaturaManual = payload
    },
    SET_CONSULTA_REGRA(state, payload) {
      state.consultaRegra = payload
    },
    SET_TELA_CONSULTA(state, payload) {
      state.telaConsulta = payload
    },
    SET_TELA_CONSULTA_ACORDO(state, payload) {
      state.telaConsultaAcordo = payload
    },
    SET_FORM_CONSULTA_FATURA(state, payload) {
      state.formConsultaFatura = payload
    },
    SET_FORM_CONSULTA_FATURA_MANUAL(state, payload) {
      state.formConsultaFaturaManual = payload
    },
    SET_DOCTO_PAGTO_ID(state, payload) {
      state.doctoPagtoId = payload.doctoPagtoId
    },
    SET_MODAL_CANHOTO(state, payload) {
      state.formModalCanhoto = { ...payload }
    }
  },
  actions: {
    resetState(context) {
      context.commit('RESET_STATE', getDefaultState())
    },
    setConsultaFatura(context, payload) {
      context.commit('SET_CONSULTA_FATURA', payload)
    },
    setConsultaFaturaManual(context, payload) {
      context.commit('SET_CONSULTA_FATURA_MANUAL', payload)
    },
    setConsultaRegra(context, payload) {
      context.commit('SET_CONSULTA_REGRA', payload)
    },
    setTelaConsulta(context, payload) {
      context.commit('SET_TELA_CONSULTA', payload)
    },
    setTelaConsultaAcordo(context, payload) {
      context.commit('SET_TELA_CONSULTA', payload)
    },
    setFormConsultaFatura(context, payload) {
      context.commit('SET_FORM_CONSULTA_FATURA', payload)
    },
    setFormConsultaFaturaManual(context, payload) {
      context.commit('SET_FORM_CONSULTA_FATURA_MANUAL', payload)
    },
    setDoctoPagtoId(context, payload) {
      context.commit('SET_DOCTO_PAGTO_ID', payload)
    },
    setformModalCanhoto({ commit }, payload) {
      commit('SET_MODAL_CANHOTO', payload)
    }
  },
  getters: {
    usuarioId(state) {
      return state.usuarioId
    },
    consultaFatura(state) {
      return state.consultaFatura
    },
    consultaFaturaManual(state) {
      return state.consultaFaturaManual
    },
    consultaRegra(state) {
      return state.consultaRegra
    },
    telaConsulta(state) {
      return state.telaConsulta
    },
    telaConsultaAcordo(state) {
      return state.telaConsulta
    },
    formConsultaFatura(state) {
      return state.formConsultaFatura
    },
    formConsultaFaturaManual(state) {
      return state.formConsultaFaturaManual
    },
    doctoPagtoId(state) {
      return state.doctoPagtoId
    },
    formModalCanhoto(state) {
      return state.formModalCanhoto
    }
  }
})

export default store
