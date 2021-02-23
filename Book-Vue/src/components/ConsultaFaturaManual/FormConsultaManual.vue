<template>
  <div class="content-form">

      <Col span="24">
        <Row type="flex" class="code-row-bg">

          <Col :xs="{ span: 6, offset: 2 }" :lg="{ span: 6, offset: 2 }">
            <strong>Ponto Operação</strong>
            <Select id="txtPontoOperacao_Fatura" v-model="form.filialId" filterable clearable :disabled="desabilitaPO"  >
              <Option v-for="item in telaConsulta.filiais" :key="item.filialId" :value="item.filialId">{{item.nomeFilial}}</Option>
            </Select>
          </Col>

          <Col :xs="{ span: 3, offset: 1 }" :lg="{ span: 3, offset: 1 }">
            <strong>Data Inicial</strong>
            <DatePicker id="txtDataInicial_Fatura" v-model="form.dataI" v-mask = "'##/##/####'" placeholder="Emissão" type="date"  format="dd/MM/yyyy" />
          </Col>

            <Col :xs="{ span: 3, offset: 0 }" :lg="{ span: 3, offset: 1 }">
            <strong>Data Final</strong>
            <DatePicker id="txtDataFinal_Fatura" v-model="form.dataF" v-mask = "'##/##/####'" placeholder="Emissão" type="date"  format="dd/MM/yyyy" />
          </Col>

          <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 5, offset: 1 }">
            <strong>Operação</strong>
            <RadioGroup v-model="form.operacao" type="button">
              <Radio label="Nacional" type="primary"></Radio>
              <Radio label="Internacional"></Radio>
            </RadioGroup>
          </Col>
        </Row>

        <Row type="flex" class="code-row-bg top">
          <Col :xs="{ span: 8, offset: 2 }" :lg="{ span: 8, offset: 2 }">
            <strong>Cliente</strong>
            <Autocomplete id="txtCliente_Fatura" v-model="form.cliente" action="ClienteNome" :valor="form.cliente.nomeFantasia" campos-visiveis="nomeFantasia,cnpjCpf" nomes-campos="Nome,CNPJ/CUIT/CPF" width="450px" height="200px" @clear="form.cliente = {}"/>
          </Col>

          <Col :xs="{ span: 4, offset: 1 }" :lg="{ span: 4, offset: 1 }" style="padding-top: 18px;padding-right: 0px;padding-left: 0px;">
            <RadioGroup v-model="form.cliente.tipoCliente" type="button">
              <Radio label="CNPJ/CUIT" type="primary"></Radio>
              <Radio label="CPF"></Radio>
            </RadioGroup>
          </Col>

          <Col :xs="{ span: 5, offset: 2 }" :lg="{ span: 5, offset: 2 }">
            <strong>CNPJ/CUIT/CPF</strong>
            <Autocomplete id="txtCNPJ/CUIT/CPF_Fatura" v-model="form.cliente" action="ClienteCnpjCpf" :valor="form.cliente.cnpjCpf" campos-visiveis="nomeFantasia,cnpjCpf" nomes-campos="Nome,CNPJ/CUIT/CPF" width="450px" height="200px" @clear="form.cliente = {}"/>
          </Col>
        </Row>

        <Row type="flex" class="code-row-bg top">
          <Col :xs="{ span: 8, offset: 2 }" :lg="{ span: 8, offset: 2 }">
            <strong>Tipo Cliente</strong>
            <Select id="txtTipoCliente_Fatura" v-model="form.tipoClienteId" filterable clearable>
              <Option v-for="item in telaConsulta.tiposCliente" :key="item.tipoClienteId" :value="item.tipoClienteId">{{item.descTipoCliente}}</Option>
            </Select>
          </Col>

          <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 5, offset: 1 }">
            <strong>Responsável Financeiro</strong>
            <Select id="txtResponsavelFinanceiro_Fatura" v-model="form.respFinanceiroId" filterable clearable>
              <Option v-for="item in telaConsulta.respFinanceiros" :key="item.respFinanceiroId" :value="item.respFinanceiroId">{{item.descRespFinanceiro}}</Option>
            </Select>
          </Col>
        </Row>

        <Row type="flex" class="code-row-bg top">
          <Col :xs="{ span: 8, offset: 2 }" :lg="{ span: 8, offset: 2 }">
            <strong>Navio/Viagem</strong>
            <Autocomplete id="txtNavio/Viagem_Fatura" v-model="form.navioViagem" action="NavioViagem" :valor="form.navioViagem.descViagemNavio" campos-visiveis="descViagemNavio" nomes-campos="Viagem\Navio" width="450px" height="200px" @clear="form.navioViagem = {}"/>
          </Col>

          <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 5, offset: 1 }">
              <strong>Porto Origem</strong>
              <Select id="txtPortoOrigem_Fatura"
                v-model="form.portoOrigemId"
                filterable
                clearable>
                <Option
                v-for="item in telaConsulta.portoOrigem"
                v-if="form.portoDestinoId != item.portoId"
                :key="item.portoId"
                :value="item.portoId">
                {{item.portoNome}}
                </Option>
              </Select>
          </Col>

          <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 5, offset: 1 }">
            <strong>Porto Destino</strong>
            <Select id="txtPortoDestino_Fatura"
                    v-model="form.portoDestinoId"
                    filterable
                    clearable>
              <Option
              v-for="item in telaConsulta.portoDestino"
              v-if="form.portoOrigemId != item.portoId"
              :key="item.portoId"
              :value="item.portoId" >
                {{item.portoNome}}
              </Option>
            </Select>
          </Col>
        </Row>

        <Row type="flex" class="code-row-bg top">
          <Col :xs="{ span: 5, offset: 2 }" :lg="{ span: 5, offset: 2 }" >
            <strong>Tipo Modal</strong>
            <Select id="txtTipoModal_Fatura" v-model="form.tabTipoModalId" filterable clearable>
                  <Option v-for="item in telaConsulta.tabTipoModal" :key="item.TabTipoModalFreteId" :value="item.TabTipoModalFreteId">{{item.DescModalFrete}}</Option>
            </Select>
          </Col>

          <Col :xs="{ span: 8, offset: 4 }" :lg="{ span: 8, offset: 4 }">
            <div v-if="flagApresentaCTES">
              <strong>CTES</strong>
              <Input id="txtCTES_Fatura" v-model="form.numDoctoTransporte" placeholder="Digite os valores separador por virgula"  clearable   width="450px" height="200px"/>
            </div>
          </Col>
        </Row>

        <Row class="top bottom">
          <Col span="24" class="center-botoes">
            <Button id="btn-Pesquisar_Fatura" type="primary" class="margem-botoes" :loading="loadConsulta" @click="pesquisar">
              <span v-if="!loadConsulta">Pesquisar</span>
              <span v-else>Pesquisando...</span>
            </Button>

            <Button id="btn-Limpar_Fatura" class="margem-botoes" @click="empty">Limpar</Button>

            <router-link to="/"><Button id="btn-Voltar_Fatura" class="margem-botoes">Voltar</Button></router-link>
          </Col>
        </Row>
      </col>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Autocomplete from '@/components/Autocomplete'
/*Teste pra ver o conteudo da formatURl*/
import { formatUrl } from '../Configurator/Http'

export default {
  components: { Autocomplete },
  data() {
    return {
      form: {},
      loadConsulta: false,
      url:'',
      desabilitaPO: true,
      flagApresentaCTES:false,
    }
  },
  created() {
    this.ApresentaCampo()
    this.form = this.formConsultaFaturaManual
    this.url = formatUrl()
  },
  methods: {
    ApresentaCampo(){
      this.Base.get('BuscaParametro', {params: { parametroId: 22650}})
      .then(res => { this.flagApresentaCTES = res.data })
    },
    pesquisar() {
      if(this.form.filialId == 0 && this.form.respFinanceiroId == 0){
        this.$Notice.error({ desc: 'Ponto Operação ou Responsável Financeiro deve ser preenchido.' })
      }
      else if (this.form.dataI == 0 || this.form.dataF == 0){
        this.$Notice.error({ desc: 'Data inicial e Final devem ser preenchidas.' })
      }
      else if(this.form.filialId > 0 || this.form.respFinanceiroId > 0){
        this.form.clienteId = this.form.cliente.clienteId
        this.form.dataInicial = this.form.dataI
        this.form.dataFinal = this.form.dataF
        this.form.ViagemNavioId = this.form.navioViagem.ViagemNavioId
        this.form.tabTipoModalId = this.form.tabTipoModalId
        this.loadConsulta = true
        this.setFormConsultaFaturaManual(this.form)
        this.Base.post('ConsultarFaturasManual', this.form)
        .then(res => {
          if (res.data.listaConsultaManual.length > 0) {
            this.setConsultaFaturaManual({
              mostraListaConsultaManual: true,
              listaConsultaManual: res.data.listaConsultaManual
            })
          } else {
            this.$Notice.error({ desc: 'Nenhum resultado encontrado.' })
          }
        })
        .catch(()=> {
            this.$Notice.error({ desc: 'Nenhum resultado encontrado.' })
        })
        .finally(()=>{
            this.loadConsulta = false
        })
      }else{
          this.$Notice.error({ desc: 'Falha na pesquisa pelos filtros informados.' })
      }
    },
    empty() {
      Object.keys(this.form).map(item => {
        if (item != 'cliente') this.form[item] = ''
      })

      Object.keys(this.form.cliente).map(item => {
        this.form.cliente[item] = ''
      })

      this.form.operacao = 'Nacional'
    },
    ...mapActions(['setConsultaFaturaManual', 'setFormConsultaFaturaManual'])
  },
  computed: {
    ...mapGetters(['usuarioId', 'telaConsulta', 'formConsultaFaturaManual'])
  },
  watch:{
    'telaConsulta': {
      deep:true,
      handler (filiais) {
      this.desabilitaPO  =  false;
      }
    }
  }
}
</script>

<style>
.esconde{
  visibility: hidden;
}
</style>
