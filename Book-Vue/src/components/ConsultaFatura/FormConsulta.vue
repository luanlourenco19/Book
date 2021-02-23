<template>
  <div class="content-form">
    <Col span="24">
      <Row :gutter="12">
        <Col span="5">
          <strong>Ponto Operação</strong>
          <Select id="txtPontoOperacao_Consulta" v-model="form.filialId" clearable :disabled="desabilitaPO" filterable>
            <Option v-for="item in telaConsulta.filiais" :key="item.filialId" :value="item.filialId">
              {{ item.nomeFilial }}
            </Option>
          </Select>
        </Col>

        <Col span="5">
          <strong>Pesquisa por:</strong>
          <RadioGroup v-model="form.tipoData" type="button">
            <Radio label="Emissão" type="primary"></Radio>
            <Radio label="Vencimento"></Radio>
          </RadioGroup>
        </Col>

        <Col span="3">
          <strong>Data Inicial</strong>
          <DatePicker
            id="txtDataInical_Consulta"
            v-model="form.dataI"
            v-mask="'##/##/####'"
            type="date"
            format="dd/MM/yyyy"
            style="width: 110px"
          />
        </Col>

        <Col span="3">
          <strong>Data Final</strong>
          <DatePicker
            id="txtDataFinal_Consulta"
            v-model="form.dataF"
            v-mask="'##/##/####'"
            type="date"
            format="dd/MM/yyyy"
            style="width: 110px"
          />
        </Col>

        <Col span="8">
          <strong>Operação</strong>
          <RadioGroup v-model="form.operacao" type="button">
            <Radio label="Nacional" type="primary"></Radio>
            <Radio label="Internacional"></Radio>
            <Radio label="Nota Débito"></Radio>
          </RadioGroup>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="5">
          <strong>Nº BL</strong>
          <Tooltip
            :always="exibirToolTip[1].value"
            placement="top-start"
            content="Se preenchido, apaga e ignora todos os outros filtros."
          >
            <Input
              id="txtNBL"
              v-model="form.numBl"
              clearable
              element-id="numBl"
              @on-focus="exibirToolTip[1].value = true"
              @on-change="limpaCampos('change', 'numBl')"
              @on-blur="limpaCampos('blur', 'numBl')"
            />
          </Tooltip>
        </Col>

        <Col span="6">
          <strong>Nº Fatura</strong>
          <Tooltip
            :always="exibirToolTip[0].value"
            placement="top-start"
            content="Se preenchido, apaga e ignora todos os outros filtros."
          >
            <!-- <Input clearable v-model="form.numFatura" @change.native="limpaCampos('numFatura')" /> -->
            <Input
              id="txtNFatura"
              v-model="form.numFatura"
              clearable
              style="width: 200px"
              element-id="numFatura"
              @on-focus="exibirToolTip[0].value = true"
              @on-change="limpaCampos('change', 'numFatura')"
              @on-blur="limpaCampos('blur', 'numFatura')"
            />
          </Tooltip>
        </Col>

        <Col span="4">
          <strong>CT-e \ ND</strong>

          <Input id="txtCT-c/ND" v-model="form.numCtac" type="number" clearable />
        </Col>

        <Col span="5">
          <strong>Boleto - Nosso Número</strong>
          <Tooltip
            :always="exibirToolTip[2].value"
            placement="top-start"
            content="Se preenchido, apaga e ignora todos os outros filtros."
          >
            <Input
              id="txtBoletoNossoNumero"
              v-model="form.nossoNumero"
              type="number"
              style="width: 190px"
              clearable
              element-id="nossoNumero"
              @on-focus="exibirToolTip[2].value = true"
              @on-change="limpaCampos('change', 'nossoNumero')"
              @on-blur="limpaCampos('blur', 'nossoNumero')"
            />
          </Tooltip>
        </Col>

        <Col span="3">
          <strong>Código Interno</strong>
          <Tooltip
            :always="exibirToolTip[3].value"
            placement="top-start"
            content="Se preenchido, apaga e ignora todos os outros filtros."
          >
            <Input
              id="txtCodigoInterno_Consulta"
              v-model="form.codigoInterno"
              type="number"
              clearable
              element-id="codigoInterno"
              @on-focus="exibirToolTip[3].value = true"
              @on-change="limpaCampos('change', 'codigoInterno')"
              @on-blur="limpaCampos('blur', 'codigoInterno')"
            />
          </Tooltip>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="8">
          <strong>Cliente</strong>
          <Autocomplete
            id="txtCliente_Consulta"
            v-model="form.cliente"
            action="ClienteNome"
            :valor="form.cliente.nomeFantasia"
            campos-visiveis="nomeFantasia,cnpjCpf"
            nomes-campos="Nome,CNPJ/CUIT/CPF"
            width="450px"
            height="200px"
            @clear="form.cliente = {}"
          />
        </Col>

        <Col span="4" style="padding-top: 18px;padding-right: 0px;padding-left: 0px;">
          <RadioGroup v-model="form.cliente.tipoCliente" type="button">
            <Radio label="CNPJ/CUIT" type="primary"></Radio>
            <Radio label="CPF"></Radio>
          </RadioGroup>
        </Col>

        <Col span="4">
          <strong>CNPJ/CUIT/CPF</strong>
          <Autocomplete
            id="txtCNPJ/CUIT/CPF_Consulta"
            v-model="form.cliente"
            action="ClienteCnpjCpf"
            :valor="form.cliente.cnpjCpf"
            campos-visiveis="nomeFantasia,cnpjCpf"
            nomes-campos="Nome,CNPJ/CUIT/CPF"
            width="450px"
            height="200px"
            @clear="form.cliente = {}"
          />
        </Col>

        <Col span="7">
          <strong>Grupo Cliente</strong>
          <Select id="txtGrupoCliente_consulta" v-model="form.grupoClienteId" filterable clearable>
            <Option
              v-for="item in telaConsulta.gruposCliente"
              :key="item.grupoClienteId"
              :value="item.grupoClienteId"
              >{{ item.nomeGrupo }}</Option
            >
          </Select>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="6">
          <strong>Status</strong>
          <Select id="txtStatus_Consulta" v-model="form.statusId" filterable clearable>
            <Option v-for="item in telaConsulta.status" :key="item.statusId" :value="item.statusId">
              {{ item.descStatus }}
            </Option>
          </Select>
        </Col>

        <Col span="6">
          <strong>Tipo Cliente</strong>
          <Select id="txtTipoCliente_Consulta" v-model="form.tipoClienteId" filterable clearable>
            <Option v-for="item in telaConsulta.tiposCliente" :key="item.tipoClienteId" :value="item.tipoClienteId">
              {{ item.descTipoCliente }}
            </Option>
          </Select>
        </Col>

        <Col span="6">
          <strong>Responsável Financeiro</strong>
          <Select id="txtResonsavelFinanceiro_Consulta" v-model="form.respFinanceiroId" filterable clearable>
            <Option
              v-for="item in telaConsulta.respFinanceiros"
              :key="item.respFinanceiroId"
              :value="item.respFinanceiroId"
              >{{ item.descRespFinanceiro }}</Option
            >
          </Select>
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            id="btn-Pesquisar_Consulta"
            type="primary"
            class="margem-botoes"
            :loading="loadConsulta"
            @click="pesquisar"
          >
            <span v-if="!loadConsulta">Pesquisar</span>
            <span v-else>Pesquisando...</span>
          </Button>

          <Button id="btn-Limpar_Consulta" class="margem-botoes" @click="empty">Limpar</Button>

          <router-link to="/">
            <Button id="btn-Voltar_Consulta" class="margem-botoes">Voltar</Button>
          </router-link>
        </Col>
      </Row>
    </Col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Autocomplete from '@/components/Autocomplete'
export default {
  components: { Autocomplete },
  data() {
    return {
      form: {},
      loadConsulta: false,
      desabilitaPO: true,
      exibirToolTip: [
        { key: 0, value: false },
        { key: 1, value: false },
        { key: 2, value: false },
        { key: 3, value: false }
      ]
    }
  },
  created() {
    this.form = this.formConsultaFatura
  },
  methods: {
    pesquisar() {
      /* <!-- PESQUISAS POR VALORES UNICOS --> */

      if (this.form.numFatura != '') {
        this.form.numFatura = this.form.numFatura.trim()
        this.form.filialId = 0
        this.form.clienteId = 0
        this.form.dataInicial = ''
        this.form.dataFinal = ''
        this.form.numCtac = ''
        this.form.nossoNumero = ''
        this.form.codigoInterno = ''
        this.form.numBl = ''
        this.setFormConsultaFatura(this.form)

        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
            this.form.numFatura = ''
          } else {
            this.$Notice.error({ desc: 'Nenhuma Fatura Encontrada.' })
            this.loadConsulta = false
          }
        })
      } else if ((this.form.numCtac != '') & (this.form.operacao != '')) {
        this.form.numCtac = this.form.numCtac.trim()
        this.form.clienteId = 0
        this.form.dataInicial = ''
        this.form.dataFinal = ''
        this.form.numFatura = ''
        this.form.nossoNumero = ''
        this.form.codigoInterno = ''
        this.form.numBl = ''
        this.form.operacao = this.form.operacao
        this.setFormConsultaFatura(this.form)

        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
            this.form.numCtac = ''
          } else {
            this.$Notice.error({ desc: 'Nenhuma CT-e/ ND encontrada' })
            this.loadConsulta = false
          }
        })
      } else if (this.form.numBl != '') {
        this.form.numBl = this.form.numBl.trim()
        this.form.clienteId = 0
        this.form.dataInicial = ''
        this.form.dataFinal = ''
        this.form.numFatura = ''
        this.form.numCtac = ''
        this.form.nossoNumero = ''
        this.form.codigoInterno = ''
        this.setFormConsultaFatura(this.form)

        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
            this.form.numBl = ''
          } else {
            this.$Notice.error({ desc: 'Nenhum BL Encontrado.' })
            this.loadConsulta = false
          }
        })
      } else if (this.form.nossoNumero != '') {
        this.form.nossoNumero = this.form.nossoNumero.trim()
        this.form.clienteId = 0
        this.form.dataInicial = ''
        this.form.dataFinal = ''
        this.form.numFatura = ''
        this.form.numCtac = ''
        this.form.codigoInterno = ''
        this.setFormConsultaFatura(this.form)

        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
            this.form.nossoNumero = ''
          } else {
            this.$Notice.error({ desc: 'Nenhum Boleto Encontrado.' })
            this.loadConsulta = false
          }
        })
      } else if (this.form.codigoInterno != '') {
        this.form.codigoInterno = this.form.codigoInterno.trim()
        this.form.clienteId = 0
        this.form.dataInicial = ''
        this.form.dataFinal = ''
        this.form.numFatura = ''
        this.form.numCtac = ''
        this.form.nossoNumero = ''
        this.loadConsulta = true
        this.setFormConsultaFatura(this.form)
        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
            this.form.codigoInterno = ''
          } else {
            this.$Notice.error({ desc: 'Nenhum Código Interno Encontrado.' })
            this.loadConsulta = false
          }
        })
      } else if (this.form.filialId == 0 && this.form.respFinanceiroId == 0) {
        this.$Notice.error({ desc: 'Ponto Operação ou Responsável Financeiro deve ser preenchido.' })
      } else if (this.form.dataI == 0) {
        this.$Notice.error({ desc: 'Data inicial e Final devem ser preenchidas.' })
      } else if (this.form.dataF == 0) {
        this.$Notice.error({ desc: 'Data inicial e Final devem ser preenchidas.' })
      } else if (
        (this.form.filialId > 0 || this.form.respFinanceiroId > 0) &&
        this.form.dataI != 0 &&
        this.form.dataF != 0
      ) {
        /* <!-- PESQUISA UTILIZANDO PONTO DE OPERAÇÃO --> */
        this.form.clienteId = this.form.cliente.clienteId
        this.form.dataInicial = this.form.dataI
        this.form.dataFinal = this.form.dataF
        this.loadConsulta = true
        this.form.numFatura = ''
        this.form.numCtac = ''
        this.form.nossoNumero = ''
        this.form.codigoInterno = ''
        this.setFormConsultaFatura(this.form)
        this.Base.post('ConsultarFaturas', this.form).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
            this.loadConsulta = false
          } else {
            this.$Notice.error({ desc: 'Nenhum resultado encontrado.' })
            this.loadConsulta = false
          }
        })
      } else {
        this.$Notice.error({ desc: 'Falha na pesquisa pelos filtros informados.' })
      }
    },

    limpaCampos(evento, elementoId) {
      if (evento == 'blur') {
        Object.keys(this.exibirToolTip).map(item => {
          this.exibirToolTip[item].value = false
        })
      }

      if (document.getElementById(elementoId).value != '') {
        Object.keys(this.form).map(item => {
          if (item != elementoId) this.form[item] = ''
        })

        Object.keys(this.form.cliente).map(item => {
          this.form.cliente[item] = ''
        })

        this.form.tipoData = 'Emissão'

        this.form.operacao = 'Nacional'
      }
    },
    empty() {
      Object.keys(this.form).map(item => {
        if (item != 'cliente') this.form[item] = ''
      })

      Object.keys(this.form.cliente).map(item => {
        this.form.cliente[item] = ''
      })

      this.form.tipoData = 'Emissão'
      this.form.operacao = 'Nacional'
    },

    ...mapActions(['setConsultaFatura', 'setFormConsultaFatura'])
  },
  computed: {
    ...mapGetters(['usuarioId', 'telaConsulta', 'formConsultaFatura'])
  },
  watch: {
    telaConsulta: {
      deep: true,

      handler(filiais) {
        this.desabilitaPO = false
      }
    }
  }
}
</script>
