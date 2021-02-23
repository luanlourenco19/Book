<template>
  <div>
    <Header title="Fatura" />
    <div class="content-form">
      <Col span="24">
        <Row :gutter="12">
          <Col span="4" offset="10" align="center">
            <a
              v-if="faturaImpressa"
              h-ref="#"
              style="text-align:center;display:block;padding:0px; margin-top:-20px;"
              @click="historicoEmailModal = true"
              >Histórico Envio</a
            >
          </Col>
        </Row>
        <Row :gutter="24">
          <Col span="5">
            <strong>Ponto Operação</strong>
            <Select v-model="form.filialId" filterable clearable>
              <Option v-for="item in telaConsulta.filiais" :key="item.filialId" :value="item.filialId">
                {{ item.nomeFilial }}
              </Option>
            </Select>
          </Col>
          <Col span="5">
            <strong>Número</strong>
            <p v-if="form.numDocto">{{ form.numDocto }}</p>
            <p v-else>Não Impressa</p>
          </Col>
          <Col span="5">
            <strong>Status</strong>
            <p>{{ form.status }}</p>
          </Col>
          <Col span="5">
            <strong>Acordo Fatura</strong>
            <Button v-if="form.acordoFaturamentoId > 0" type="text" @click="carregarAcordo">
              {{ form.acordoFaturamentoId }}
            </Button>
            <p v-else>Sem Acordo</p>
          </Col>
        </Row>
        <Row :gutter="24" class="top">
          <Col span="8">
            <strong>Cliente</strong>
            <Autocomplete
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
          <Col span="6">
            <strong>CNPJ/CUIT/CPF</strong>
            <Autocomplete
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
        </Row>
        <Row :gutter="12" class="top">
          <Col span="6">
            <strong>Data Emissão</strong>
            <DatePicker v-model="form.dataEmissao" type="date" format="dd/MM/yyyy" readonly style="width: 200px;" />
          </Col>
          <Col span="6">
            <strong>Data Vencimento</strong>
            <DatePicker
              v-model="form.dataVencimento"
              type="date"
              format="dd/MM/yyyy"
              :readonly="faturaImpressa"
              style="width: 200px;"
            />
          </Col>
          <Col span="5">
            <strong>Nosso Número</strong>
            <p>{{ form.nossoNumero }}</p>
          </Col>
        </Row>
        <!-- @on-blur="recalcularValorBL" @on-enter="recalcularValorBL" -->
        <Row :gutter="12" class="top">
          <Col span="4">
            <strong>Taxa de Conversão</strong>
            <Input
              v-model="form.taxaConversao"
              element-id="taxaConversao"
              @on-blur="recalcularValorBL()"
              @on-change="recalcularValorBL()"
            >
              <span slot="prepend">US$</span>
            </Input>
          </Col>
          <Col span="4">
            <strong>Taxa de Conversão Orig.</strong>
            <Input v-model="form.taxaConversaoOriginal" readonly>
              <span slot="prepend">US$</span>
            </Input>
          </Col>
          <Col span="4">
            <strong>Desconto Total</strong>
            <Input v-model="form.descontoTotal" readonly>
              <span slot="prepend">R$</span>
            </Input>
          </Col>
          <Col span="4">
            <strong>Acréscimo Total</strong>
            <Input v-model="form.acrescimoTotal" readonly>
              <span slot="prepend">R$</span>
            </Input>
          </Col>
          <Col span="4">
            <strong>Valor Total</strong>
            <Input v-model="form.valorTotal" readonly>
              <span slot="prepend">R$</span>
            </Input>
          </Col>
          <Col span="4">
            <strong>Valor Total à Receber</strong>
            <Input v-model="form.valorTotalReceber" readonly>
              <span slot="prepend">R$</span>
            </Input>
          </Col>
        </Row>
        <Row v-if="apresentaObservacaoNumPedido()" :gutter="12" class="top">
          <Col span="16">
            <strong>Observação</strong>
            <Input v-model="form.observacao" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
          </Col>
          <Col span="8">
            <strong>Observação Conhecimento</strong>
            <Input
              v-model="form.ObservacaoNumeroPedido"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              :disabled="true"
            />
          </Col>
        </Row>
        <Row v-else :gutter="12" class="top">
          <Col span="24">
            <strong>Observação</strong>
            <Input v-model="form.observacao" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
          </Col>
        </Row>
        <Row v-if="faturaInternacional && !faturaEmitida" :gutter="12" class="top">
          <Col span="12">
            <strong>Justificativa Não Faturamento</strong>
            <Select v-model="form.tabObservacaoId" filterable clearable style="width: 400px;">
              <Option v-for="item in telaConsulta.observacoes" :key="item.observacaoId" :value="item.observacaoId">
                {{ item.observacao }}
              </Option>
            </Select>
          </Col>
          <Col span="5">
            <strong>Usuário Obs Não Faturamento</strong>
            <p>{{ form.usuarioObsNaoFaturado }}</p>
          </Col>
          <Col span="5">
            <strong>Data Obs Não Faturamento</strong>
            <p>{{ form.dataObsNaoFaturado }}</p>
          </Col>
        </Row>
        <Row v-if="faturaInternacional && !faturaEmitida" :gutter="12" class="top">
          <Col span="24">
            <strong>Observação Justificativa Não Faturamento</strong>
            <textarea
              v-model="form.DescObsNaoFat"
              :autosize="{ minRows: 2, maxRows: 5 }"
              :maxlength="3000"
              style="width:100%;"
              placeholder="Digite Observação Justificativa Não Faturamento"
            ></textarea>
          </Col>
        </Row>
        <Row class="top bottom">
          <Col span="24" class="center-botoes">
            <Button
              v-if="!faturaDebito && !faturaImpressa && !faturaExcluida && !faturaPrefat"
              type="primary"
              class="margem-botoes"
              :loading="loadGravar"
              :disabled="loadVoltar || loadGravarJustificativa || loadGravarFaturaUnitaria || loadExcluir || loadImprimir"
              @click="verificaGravarFatura()"
            >
              <span v-if="!loadGravar">Gravar</span>
              <span v-else>Gravando...</span>
            </Button>
            <Button
              v-if="!faturaEmitida"
              type="primary"
              class="margem-botoes"
              :loading="loadGravarFaturaUnitaria"
              :disabled="loadVoltar || loadGravarJustificativa || loadGravar || loadExcluir || loadImprimir"
              @click="gravarFaturaUnitaria()"
            >
              <span v-if="!loadGravar">Fatura Unitária</span>
              <span v-else>Processando...</span>
            </Button>
            <Button
              v-if="faturaInternacional && !faturaEmitida"
              type="primary"
              class="margem-botoes"
              :loading="loadGravarJustificativa"
              :disabled="loadVoltar || loadGravar || loadGravarFaturaUnitaria || loadExcluir || loadImprimir"
              @click="gravarJustificativa()"
            >
              <span v-if="!loadGravarJustificativa">Gravar Justificativa</span>
              <span v-else>Gravando...</span>
            </Button>
            <Button
              v-if="!faturaDebito && faturaEmitida && !faturaExcluida"
              type="error"
              class="margem-botoes"
              :loading="loadExcluir"
              :disabled="loadVoltar || loadGravarJustificativa || loadGravarFaturaUnitaria || loadGravar || loadImprimir"
              @click="confirmarExclusao()"
            >
              <span v-if="!loadExcluir">Excluir</span>
              <span v-else>Excluindo...</span>
            </Button>
            <Button
              v-if="faturaEmitida && !faturaExcluida && !faturaPrefat"
              type="primary"
              class="margem-botoes"
              :loading="loadImprimir"
              :disabled="loadVoltar || loadGravarJustificativa || loadGravarFaturaUnitaria || loadGravar || loadExcluir"
              @click="imprimir"
            >
              <span v-if="!loadImprimir">Imprimir</span>
              <span v-else>Imprimindo...</span>
            </Button>
            <Button class="margem-botoes" :loading="loadVoltar" @click="voltar">
              <span v-if="!loadVoltar">Voltar</span>
              <span v-else>Voltando...</span>
            </Button>
          </Col>
        </Row>
        <div v-if="faturaInternacional" class="bottom">
          <Row v-if="!faturaImpressa && !faturaExcluida" class="top">
            <Col class="align-right-botoes" span="24" style="padding-bottom: 3px;">
              <Button type="primary" @click="carregarTaxasAdicionais">Taxas Adicionais</Button>
            </Col>
          </Row>
          <Row>
            <Col span="4" class="title">
              <strong>TAXAS</strong>
            </Col>
          </Row>
          <Table
            ref="selection"
            :row-class-name="rowClassName"
            stripe
            border
            :columns="columns"
            :data="form.taxas"
          ></Table>
        </div>
        <div v-if="faturaNacional" class="bottom">
          <Row v-if="!faturaDebito && !faturaImpressa && !faturaExcluida" class="top">
            <Col class="align-left-botoes" span="14">
              <strong>Quantidade de Conhecimentos: {{ form.doctosTransporte.length }}</strong>
            </Col>
            <Col class="align-right-botoes" span="5" style="padding-bottom: 3px;">
              <Button v-if="!faturaEmitida" type="primary" @click="carregarJustNaoFaturamento"
                >Justificativa Não Faturamento</Button
              >
            </Col>
            <Col class="align-right-botoes" span="5" style="padding-bottom: 3px;">
              <Button type="primary" @click="carregarDetalhesConhecimentos">Detalhe Conhecimentos</Button>
            </Col>
          </Row>
          <Row>
            <Col span="4" class="title">
              <strong
                v-if="
                  form.doctosTransporte[0].tabTipoDoctoTranspId == 208 ||
                    form.doctosTransporte[0].tabTipoDoctoTranspId == 209
                "
                >Nota Débito</strong
              >
              <strong v-else>CTE</strong>''
            </Col>
          </Row>
          <Row class>
            <Col v-for="docto in form.doctosTransporte" :key="docto.doctoTransporteId" class="center-link" span="3">
              <a @click="buscarDetalhesDoctoTransporte(docto.doctoTransporteId, docto.tabTipoDoctoTranspId)">
                {{ docto.numDoctoTransporte }}
              </a>
            </Col>
          </Row>
        </div>
        <Row :gutter="24" class="top bottom">
          <Col v-if="form.usuarioInclusao != null" span="6">
            <strong>Usuário / Data Inclusão</strong>
            <p>{{ form.usuarioInclusao }} / {{ form.dataInclusao }}</p>
          </Col>
          <Col v-if="form.usuarioAlteracao != null" span="6">
            <strong>Usuário / Data Última Alteração</strong>
            <p>{{ form.usuarioAlteracao }} / {{ form.dataAlteracao }}</p>
          </Col>
          <Col v-if="form.usuarioImpressao != null" span="6">
            <strong>Usuário / Data Impressão</strong>
            <p>{{ form.usuarioImpressao }} / {{ form.dataImpressao }}</p>
          </Col>
          <Col v-if="form.usuarioExclusao != null" span="6">
            <strong>Usuário / Data Exclusão</strong>
            <p>{{ form.usuarioExclusao }} / {{ form.dataExclusao }}</p>
          </Col>
        </Row>
      </Col>
    </div>
    <ModalTaxasAdicionais
      :open="abrirModalTaxasAdicionais"
      :docto-pagto-id="form.doctoPagtoId"
      @close="recarregarFatura($event)"
    />
    <ModalDetalhesConhecimentos
      :open="abrirModalDetalhesConhecimentos"
      :docto-pagto-id="form.doctoPagtoId"
      :filial-id="form.filialId"
      :cliente-id="form.cliente.clienteId"
      :tab-status-id="form.tabStatusId"
      @close="recarregarFatura($event)"
    />
    <ModalJustificativaNaoFaturamento :open="abrirModalJustNaoFaturamento" @close="fecharModalJustNaoFaturamento" />
    <Modal v-model="doctoTransporteModal" title="Detalhes CTAC" width="350">
      <Row :gutter="12">
        <Col span="12">
          <strong>Número Controle</strong>
          <p>{{ doctoTransporte.numControle }}</p>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="12">
          <strong>Número Fiscal</strong>
          <p>{{ doctoTransporte.numDoctoTransporte }}</p>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="12">
          <strong>Porto Origem</strong>
          <p>{{ doctoTransporte.portoOrigem }}</p>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="12">
          <strong>Porto Destino</strong>
          <p>{{ doctoTransporte.portoDestino }}</p>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="12">
          <strong>Navio/Viagem</strong>
          <p>{{ doctoTransporte.navioViagem }}</p>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="12">
          <strong>Valor Total</strong>
          <p>{{ doctoTransporte.valorTotal }}</p>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" @click="fecharDetalheDoctoTransporteModal">Ok</Button>
      </div>
    </Modal>
    <Modal v-model="historicoEmailModal" title="Histórico Envio de Email" width="850">
      <Row :gutter="24">
        <Col span="12">
          <strong>Cliente</strong>
          <p>{{ form.cliente.nomeFantasia }}</p>
        </Col>
        <Col span="12">
          <strong>Fatura</strong>
          <p>{{ form.numDocto }}</p>
        </Col>
      </Row>
      <div class="espc top bottom" justify="center" align="middle">
        <Table
          ref="selection"
          :row-class-name="rowClassName"
          stripe
          border
          :columns="colunasHistorico"
          :data="listaHistorico"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="fecharHistoricoEmailModal">Fechar</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '@/components/Header'
import Autocomplete from '@/components/Autocomplete'
import ModalTaxasAdicionais from '@/components/ModalTaxasAdicionais'
import ModalDetalhesConhecimentos from '@/components/ModalDetalhesConhecimentos'
import ModalJustificativaNaoFaturamento from '@/components/ConsultaFaturaManual/ModalJustificativaNaoFaturamento'
export default {
  components: {
    Header,
    Autocomplete,
    ModalTaxasAdicionais,
    ModalDetalhesConhecimentos,
    ModalJustificativaNaoFaturamento
  },
  props: ['id', 'rotaOrigem', 'faturaManualBusca'],
  data() {
    return {
      listaHistorico: [],
      colunasHistorico: [
        {
          title: 'Data/Hora',
          key: 'dataEnvio',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Tipo',
          key: 'tipo',
          sortable: true,
          width: 135,
          align: 'center'
        },
        {
          title: 'Usuário Envio manual',
          key: 'usuarioEnvioManual',
          sortable: true,
          width: 130,
          align: 'center'
        },
        {
          title: 'Assunto do Email',
          key: 'observacao',
          sortable: true,
          width: 400,
          align: 'center'
        }
      ],
      columns: [
        {
          title: 'BL',
          key: 'numControleCtac',
          sortable: true,
          width: 150,
          align: 'center'
        },
        {
          title: 'Descrição da Taxa',
          key: 'descTaxa',
          sortable: true,
          //width: 200,
          align: 'Left'
        },
        {
          title: 'R$',
          key: 'valorReal',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'US$',
          key: 'valorDolar',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'Desconto',
          key: 'valorDesconto',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'Acréscimo',
          key: 'valorAcrescimo',
          sortable: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'Export References',
          key: 'exportReferences',
          sortable: true,
          align: 'left'
        }
      ],
      form: {
        filialId: 0,
        doctoPagtoId: 0,
        numDocto: '',
        status: '',
        acordoFaturamentoId: 0,
        cliente: {
          nomeFantasia: '',
          clienteId: '',
          cnpjCpf: '',
          tipoClienteId: '',
          tipoCliente: ''
        },
        dataEmissao: '',
        dataVencimento: '',
        nossoNumero: '',
        descontoTotal: '',
        acrescimoTotal: '',
        taxaConversao: '',
        taxaConversaoOriginal: '',
        valorTotal: '',
        valorTotalReceber: '',
        observacao: '',
        flagNacional: '',
        tabStatusId: '',
        doctosTransporte: [],
        taxas: [],
        dataInclusao: '',
        usuarioInclusao: '',
        dataAlteracao: '',
        usuarioAlteracao: '',
        dataExclusao: '',
        usuarioExclusao: '',
        dataImpressao: '',
        usuarioImpressao: '',
        tabObservacaoId: '',
        dataObsNaoFaturado: '',
        usuarioObsNaoFaturado: '',
        DescObsNaoFat: '',
        tabTipoDoctoPagtoId: 0,
        ObservacaoNumeroPedido: ''
      },
      abrirModalTaxasAdicionais: false,
      abrirModalDetalhesConhecimentos: false,
      abrirModalJustNaoFaturamento: false,
      historicoEmailModal: false,
      loadExcluir: false,
      loadGravar: false,
      loadGravarFaturaUnitaria: false,
      loadImprimir: false,
      loadGravarJustificativa: false,
      doctoTransporteModal: false,
      doctoTransporte: {},
      nomeCliente: '',
      tempClienteNOmeFantasia: 'Nome Fantasia',
      tempCnpjCpf: 'Cpf/Cnpj',   
      loadVoltar: false,   
      quantidadeTentativas: 0
    }
  },
  computed: {
    faturaImpressa() {
      return this.form.numDocto > ''
    },
    faturaEmitida() {
      return this.form.doctoPagtoId > 0
    },
    faturaExcluida() {
      return this.form.tabStatusId == 2
    },
    faturaPrefat() {
      return this.form.tabStatusId == 127
    },
    faturaNacional() {
      return this.form.flagNacional == 'S'
    },
    faturaInternacional() {
      return this.form.flagNacional == 'N'
    },
    faturaDebito() {
      if (this.form.tabTipoDoctoPagtoId == 20) {
        return 'S'
      }
    },
    ...mapGetters(['telaConsulta', 'usuarioId', 'consultaFatura', 'formConsultaFaturaManual', 'doctoPagtoId'])
  },
  created() {
    
    if (this.doctoPagtoId > 0) {
      this.form.doctoPagtoId = this.doctoPagtoId
      this.setDoctoPagtoId({
        doctoPagtoId: 0
      })
    } else {
      this.form.doctoPagtoId = this.id
    }
    if (this.form.doctoPagtoId > 0) {
      this.consultarFatura(false)
    } else {
      this.consultarFaturaManual()
    }
    if (this.form.doctoPagtoId > 0) this.listarHistorico()
  },
  mounted() {},
  methods: {
    listarHistorico() {
      let id = this.form.doctoPagtoId > 0 ? this.form.doctoPagtoId : this.id
      this.Base.get(`ListarHistoricoEmail/${id}`).then(res => {
        this.listaHistorico = res.data
      })
    },
    async pesquisaFaturaManual() {
      var res = await this.Base.post('ConsultarFaturasManual', this.formConsultaFaturaManual)
      
      this.setConsultaFaturaManual({
        mostraListaConsultaManual: true,
        listaConsultaManual: res.data.listaConsultaManual
      })
      this.$router.go(-1)         
    },
    calculaTaxasFaturaManualInternacional() {
      if (this.doctoPagtoId == 0) {
        var valorAcrescimoTemp = []
        var valorDescontoTemp = []
        var totalAcrescimo = 0
        var totalDesconto = 0
        this.form.taxas.forEach(item => {
          valorAcrescimoTemp.push(item.valorAcrescimo.replace('.', ''))
          valorDescontoTemp.push(item.valorDesconto.replace('.', ''))
        })
        valorAcrescimoTemp.forEach(item => {
          totalAcrescimo += parseFloat(item.replace(',', '.'))
        })
        valorDescontoTemp.forEach(item => {
          totalDesconto += parseFloat(item.replace(',', '.'))
        })
        this.form.acrescimoTotal = totalAcrescimo.toLocaleString('pt-br', {
          minimumFractionDigits: 2
        })
        this.form.descontoTotal = totalDesconto.toLocaleString('pt-br', {
          minimumFractionDigits: 2
        })
      }
    },
    voltar() {
      this.loadVoltar = true
      if (this.rotaOrigem == 'ListaConsulta') {
        this.$router.go(-1)
      } else if (this.form.doctoPagtoId != 0) {
        this.pesquisaFaturaManual()
      } else {
        this.$router.go(-1)
      }
    },
    carregarAcordo() {
      this.setDoctoPagtoId({
        doctoPagtoId: this.form.doctoPagtoId
      })
      this.$router.push(`/regras-faturamento/${this.form.acordoFaturamentoId}`)
    },
    async consultarFatura(limpaObs) {
      this.$Spin.show()
      var res = await this.Base.get('Fatura', {
        params: {
          doctoPagtoId: this.form.doctoPagtoId
        }
      })
      this.form = res.data
      this.ManagementObservacao(this.form.ObservacaoNumeroPedido, limpaObs)
      this.$Spin.hide()
    },
    consultarFaturaManual() {
      this.$Spin.show()
      this.Base.post('FaturaManual', this.faturaManualBusca)
        .then(res => {
          this.form = res.data
          this.ManagementObservacao(this.form.ObservacaoNumeroPedido, false)
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },
    confirmarExclusao() {
      this.$Modal.confirm({
        title: 'Confirmar Exclusão',
        content: 'Você confirma a exclusão das fatura?',
        onOk: this.excluir
      })
    },
    apresentaObservacaoNumPedido() {
      if (this.telaConsulta.FlagObservacaoNumPedido == true && !this.faturaImpressa && this.faturaNacional) return true
      return false
    },
    gravarJustificativa() {
      this.loadGravarJustificativa = true
      if (this.form.tabObservacaoId > 0 && this.form.tabObservacaoId !== null) {
        this.Base.get('GravarJustificativaBL', {
          params: {
            doctoTransporteId: this.faturaManualBusca.doctoTransporteId,
            tabObservacaoId: this.form.tabObservacaoId,
            usuarioId: this.usuarioId,
            observacaoNaoFat: this.form.DescObsNaoFat == null ? '' : this.form.DescObsNaoFat
          }
        })
          .then(res => {
            this.$Notice.success({
              desc: res.data
            })
            if (this.form.doctoPagtoId > 0) {
              this.consultarFatura(false)
            } else {
              this.consultarFaturaManual()
            }
          })
          .catch(err => {
            this.$Notice.error({
              desc: err.response.data.Message
            })
          })
          .finally(() => {
            this.loadGravarJustificativa = false
          })
      } else {
        this.$Notice.error({
          desc: 'Selecione a Justificativa.'
        })
        this.loadGravarJustificativa = false
      }
    },
    async imprimir() {
      try {
        this.loadImprimir = true
        this.quantidadeTentativas += 1

        await this.Base.get('Imprimir', {
          params: {
            doctosPagtoId: this.form.doctoPagtoId,
            usuarioId: this.usuarioId
          }
        })

        await this.download()

        await this.consultarFatura(false)
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
          doctosPagtoId: this.form.doctoPagtoId
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
      this.loadExcluir = true
      this.Base.get('Excluir', {
        params: {
          doctoPagtoId: this.form.doctoPagtoId,
          usuarioId: this.usuarioId
        }
      })
        .then(res => {
          this.consultarFatura(false)
          this.refreshBusca()
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
    refreshBusca() {
      if (this.consultaFatura.listaDoctosPagtos.length > 0) {
        this.Base.post('AtualizarFaturas', this.consultaFatura.listaDoctosPagtos).then(res => {
          if (res.data.listaConsulta.length > 0) {
            this.setConsultaFatura({
              mostraListaConsulta: true,
              listaConsulta: res.data.listaConsulta,
              listaDoctosPagtos: res.data.listaDoctosPagtos
            })
          }
        })
      }
    },
    carregarTaxasAdicionais() {
      let obj = {
        clienteId: 0,
        pontoOperacaoId: 0,
        dataInicial: '',
        dataFinal: '',
        tabTipoCobrancaId: 0,
        taxasId: []
      }
      if (this.form.numDocto == null) {
        obj = {
          clienteId: this.form.clienteId,
          pontoOperacaoId: this.form.filialId,
          dataInicial: null,
          dataFinal: null,
          tabTipoCobrancaId: this.consultarFatura.tabTipoCobrancaId,
          taxasId: this.form.taxas
        }
      }
      this.abrirModalTaxasAdicionais = true
      this.$bus.$emit('carregarTaxasAdicionais', obj)
    },
    carregarDetalhesConhecimentos() {
      this.abrirModalDetalhesConhecimentos = true
      this.$bus.$emit('carregarDetalhesConhecimentos', this.form.doctosTransporte)
    },
    carregarJustNaoFaturamento() {
      this.abrirModalJustNaoFaturamento = true
      this.$bus.$emit('carregarConhecimentosJustNaoFaturamento', this.form.doctosTransporte)
    },
    fecharModalJustNaoFaturamento() {
      this.abrirModalJustNaoFaturamento = false
    },
    fecharHistoricoEmailModal() {
      this.historicoEmailModal = false
    },
    recarregarFatura(evt) {
      if (this.faturaEmitida) {
        this.consultarFatura(true)
      } else {
        if (this.faturaNacional) {
          this.form.doctosTransporte = evt
          this.recalcularValorCteManual()
          if (this.telaConsulta.FlagObservacaoNumPedido) this.buscaObservacaoNumPedido()
        } else {
          this.form.taxas = evt
          this.recalcularValorBL()
          this.calculaTaxasFaturaManualInternacional()
        }
      }
      this.abrirModalTaxasAdicionais = false
      this.abrirModalDetalhesConhecimentos = false
    },
    buscarDetalhesDoctoTransporte(doctoTransporteId, tabTipoDoctoTranspId) {
      //NOTA DE DÉBITO
      if (tabTipoDoctoTranspId == 208 || tabTipoDoctoTranspId == 209) {
        this.Base.get('BuscaPDFNotaDebito/' + doctoTransporteId).then(res => {
          let link = res.data
          window.open(link, '_blank')
        })
      } else {
        let link = `${window.location.origin}/Vue/ConsultaCte/index.html#/?doctoTransporteId=${doctoTransporteId}`
        window.open(link, '_blank')
      }
    },
    fecharDetalheDoctoTransporteModal() {
      this.doctoTransporteModal = false
      this.doctoTransporte = []
    },
    recalcularValorBL() {
      this.Base.post('RecalcularValorBL', {
        taxasId: this.form.taxas.map(item => item.taxaAdicionalDoctoId),
        taxaConversao: this.toFloat(this.form.taxaConversao.replace('.', ','))
      }).then(res => {
        this.form.valorTotal = res.data.valorTotal
        this.form.valorTotalReceber = res.data.valorTotalReceber
      })
    },
    recalcularValorCteManual() {
      this.Base.post('RecalcularValorCteManual', {
        doctosTransporteId: this.form.doctosTransporte.map(item => item.doctoTransporteId)
      }).then(res => {
        this.form.valorTotal = res.data.valorTotal
        this.form.valorTotalReceber = res.data.valorTotalReceber
      })
    },
    buscaObservacaoNumPedido() {
      this.Base.post('BuscaObsercaoNumPedido', {
        doctosTransporteId: this.form.doctosTransporte.map(item => item.doctoTransporteId)
      }).then(res => {
        this.form.ObservacaoNumeroPedido = res.data
        this.ManagementObservacao(this.form.ObservacaoNumeroPedido, true)
      })
    },
    toFloat(item) {
      item = item.replace(/\./g, '')
      item = item.replace(',', '.')
      return parseFloat(item)
    },
    consistirFatura() {
      if (this.faturaInternacional) {
        if (!this.toFloat(this.form.taxaConversao) > 0) {
          this.$Notice.error({
            desc: 'Taxa de conversão deve ser maior que zero.'
          })
          return false
        }
      }
      if (!this.form.filialId > 0) {
        this.$Notice.error({
          desc: 'Preenche ponto de operação..'
        })
        return false
      }
      if (!this.form.cliente.clienteId > 0) {
        this.$Notice.error({
          desc: 'Preencha cliente.'
        })
        return false
      }
      return true
    },

    ManagementObservacao(obsNumPedido, limpa){
      if(this.telaConsulta.FlagObservacaoNumPedido == true){

        if(limpa == true && !this.form.observacao.includes('Número do Prefat:')){
          this.form.observacao = null
        }
        if(this.form.observacao != null){
          if(this.form.observacao.indexOf(obsNumPedido) != -1 ){
            return(
              this.form.observacao
            )
          }
          
        }else{
          return(
            this.form.observacao = obsNumPedido
          )
        }
      }else{
        return this.form.observacao
      }
    },
    gravarFatura() {
      if (this.faturaNacional) {
        if (this.form.doctosTransporte.length > this.telaConsulta.qtdeMaximaDoctosFatura) {
          this.$Notice.error({
            desc: `A quantidades de documentos vinculados a fatura ultrapassa o máximo permitido (${this.telaConsulta.qtdeMaximaDoctosFatura}).`
          })
          return
        }
      }
      if (!this.consistirFatura()) return
      const fatura = {
        filialId: this.form.filialId,
        doctoPagtoId: this.form.doctoPagtoId,
        acordoFaturamentoId: this.form.acordoFaturamentoId,
        clienteId: this.form.cliente.clienteId,
        dataEmissao: this.form.dataEmissao,
        dataVencimento: this.form.dataVencimento,
        nossoNumero: this.form.nossoNumero,
        descontoTotal: this.toFloat(this.form.descontoTotal),
        acrescimoTotal: this.toFloat(this.form.acrescimoTotal),
        taxaConversao: this.toFloat(this.form.taxaConversao),
        taxaConversaoOriginal: this.toFloat(this.form.taxaConversaoOriginal),
        valorTotal: this.toFloat(this.form.valorTotal),
        valorTotalReceber: this.toFloat(this.form.valorTotalReceber),
        observacao: this.form.observacao,
        flagNacional:
          this.form.flagNacional != ''
            ? this.form.flagNacional
            : this.formConsultaFaturaManual.operacao == 'Nacional'
            ? 'S'
            : 'N',
        usuarioId: this.usuarioId,
        taxasId: this.form.taxas ? this.form.taxas.map(item => item.taxaAdicionalDoctoId) : [],
        doctosTransporteId: this.form.doctosTransporte
          ? this.form.doctosTransporte.map(item => item.doctoTransporteId)
          : []
      }
      this.loadGravar = true
      this.Base.post('GravarFatura', fatura)
        .then(res => {
          this.$Notice.success({
            desc: res.data.Message
          })
          this.form.doctoPagtoId = res.data.doctoPagtoId
          this.consultarFatura(false)
        })
        .catch(err => {
          this.$Notice.error({
            desc: err.response.data.Message
          })
        })
        .finally(() => {
          this.loadGravar = false
        })
    },
    gravarFaturaUnitaria() {
      this.consistirFatura()
      const fatura = {
        filialId: this.form.filialId,
        acordoFaturamentoId: this.form.acordoFaturamentoId,
        clienteId: this.form.cliente.clienteId,
        dataEmissao: this.form.dataEmissao,
        dataVencimento: this.form.dataVencimento,
        taxaConversao: this.toFloat(this.form.taxaConversao),
        taxaConversaoOriginal: this.toFloat(this.form.taxaConversaoOriginal),
        observacao:
          this.telaConsulta.FlagObservacaoNumPedido == true
            ? this.form.observacao != null
              ? this.form.observacao + ' - ' + this.form.ObservacaoNumeroPedido
              : ' - ' + this.form.ObservacaoNumeroPedido
            : this.form.observacao,
        flagNacional:
          this.form.flagNacional != ''
            ? this.form.flagNacional
            : this.formConsultaFaturaManual.operacao == 'Nacional'
            ? 'S'
            : 'N',
        usuarioId: this.usuarioId,
        taxasId: this.form.taxas ? this.form.taxas.map(item => item.taxaAdicionalDoctoId) : [],
        doctosTransporteId: this.form.doctosTransporte
          ? this.form.doctosTransporte.map(item => item.doctoTransporteId)
          : []
      }
      this.loadGravarFaturaUnitaria = true
      this.Base.post('GravarFaturaUnitaria', fatura)
        .then(res => {
          this.$Notice.success({
            desc: res.data.Message
          })
         
          this.loadVoltar = true
          this.pesquisaFaturaManual()          
        })
        .catch(err => {
          this.$Notice.error({
            desc: err.response.data.Message
          })
        })
        .finally(() => {
          this.loadGravar = false
        })
    },
    verificaGravarFatura() {
      let ctesCanhotoPendente = this.form.doctosTransporte
        ? this.form.doctosTransporte.filter(x => x.FlagCanhotoPendente == 'S').map(x => x.numDoctoTransporte)
        : []
      if (ctesCanhotoPendente.length > 0) {
        this.confirmarCanhotoPendente(ctesCanhotoPendente)
      } else {
        this.gravarFatura()
      }
    },
    confirmarCanhotoPendente(ctesCanhotoPendente) {
      this.$Modal.confirm({
        title: 'Confirmar Gravação',
        content: 'Há canhoto pendente para o(s) CTe(s) ' + ctesCanhotoPendente.join(',') + ', deseja prosseguir?',
        onOk: this.gravarFatura
      })
    },
    rowClassName(row, index) {
      return 'tamanhoLinha'
    },
    ...mapActions(['setConsultaFatura', 'setDoctoPagtoId', 'setConsultaFaturaManual'])
  }
}
</script>
