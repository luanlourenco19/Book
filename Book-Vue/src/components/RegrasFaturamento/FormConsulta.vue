<template>
  <div class="content-form">
    <Col span="24">
      <Row :gutter="12">
        <Col span="3" offset="4">
          <strong>Código Acordo</strong>
          <Input v-model="form.acordoFaturamentoId" clearable />
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="8" offset="4">
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

        <Col span="4">
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
        <Col span="8" offset="4">
          <strong>Grupo Cliente</strong>
          <Autocomplete
            v-model="form.grupoCliente"
            action="GrupoCliente"
            :valor="form.grupoCliente.nomeGrupo"
            campos-visiveis="nomeGrupo"
            nomes-campos
            width="300px"
            height="200px"
            @clear="form.grupoCliente = {}"
          />
        </Col>
      </Row>

      <Row v-if="telaConsultaAcordo.ApresentarAcordoRaiz" :gutter="12" class="top">
        <Col span="8" offset="4">
          <strong>Nome Grupo Raiz CNPJ</strong>
          <Autocomplete
            v-model="form.grupoRadicalCnpj"
            action="NomeGrupoRadicalCnpj"
            :valor="form.grupoRadicalCnpj.nomeGrupoRadicalCnpj"
            campos-visiveis="nomeGrupoRadicalCnpj,radicalCnpj"
            nomes-campos="Nome Grupo,Raiz Cnpj"
            width="300px"
            height="200px"
            @clear="form.grupoRadicalCnpj = {}"
          />
        </Col>
        <Col span="4">
          <strong>Grupo Raiz CNPJ</strong>
          <Autocomplete
            v-model="form.grupoRadicalCnpj"
            action="GrupoRadicalCnpj"
            :valor="form.grupoRadicalCnpj.radicalCnpj"
            campos-visiveis="radicalCnpj,nomeGrupoRadicalCnpj"
            nomes-campos="Raiz Cnpj, Nome Grupo"
            @clear="form.grupoRadicalCnpj = {}"
          />
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            type="primary"
            class="margem-botoes"
            :loading="loadConsulta"
            :disabled="!liberarPesquisa"
            @click="pesquisar"
          >
            <span v-if="!loadConsulta">Pesquisar</span>
            <span v-else>Pesquisando...</span>
          </Button>

          <Button class="margem-botoes" @click="empty">Limpar</Button>

          <Button class="margem-botoes" @click="voltar">Voltar</Button>
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
      form: {
        acordoFaturamentoId: '',
        clienteId: '',
        grupoClienteId: '',
        cliente: {},
        grupoCliente: {},
        grupoRadicalCnpjIdent: '',
        grupoRadicalCnpj: {}
      },
      loadConsulta: false
    }
  },
  computed: {
    liberarPesquisa() {
      return (
        this.form.acordoFaturamentoId > 0 ||
        this.form.cliente.clienteId > 0 ||
        this.form.grupoCliente.grupoClienteId > 0 ||
        (this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0 && this.telaConsultaAcordo.ApresentarAcordoRaiz)
      )
    },
    ...mapGetters(['telaConsultaAcordo'])
  },
  methods: {
    async pesquisar() {
      this.loadConsulta = true

      let res = await this.Base.get('ConsultarRegrasFaturamento', {
        params: {
          acordoFaturamentoId: this.form.acordoFaturamentoId || 0,
          clienteId: this.form.cliente.clienteId || 0,
          grupoClienteId: this.form.grupoCliente.grupoClienteId || 0,
          grupoRadicalCnpjIdent: this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent || 0
        }
      })

      if (res.data.listaConsultaRegra.length > 0) {
        this.setConsultaRegra({
          mostraListaConsultaRegra: true,
          listaConsultaRegra: res.data.listaConsultaRegra
        })
        this.loadConsulta = false
      } else {
        this.$Notice.error({ desc: 'Nenhum resultado encontrado.' })
        this.loadConsulta = false
      }
    },
    voltar() {
      this.$router.go(-1)
    },
    empty() {
      Object.keys(this.form).map(item => {
        if (item != 'cliente' && item != 'grupoCliente' && item != 'grupoRadicalCnpj') this.form[item] = ''
      })

      Object.keys(this.form.cliente).map(item => {
        this.form.cliente[item] = ''
      })

      Object.keys(this.form.grupoCliente).map(item => {
        this.form.grupoCliente[item] = ''
      })

      Object.keys(this.form.grupoRadicalCnpj).map(item => {
        this.form.grupoRadicalCnpj[item] = ''
      })

      this.form = {
        acordoFaturamentoId: '',
        clienteId: '',
        cliente: {
          nomeFantasia: ''
        },
        grupoClienteId: '',
        grupoCliente: {
          nomeGrupo: ''
        },
        grupoRadicalCnpjIdent: '',
        grupoRadicalCnpj: {
          radicalCnpj: ''
        }
      }
    },
    ...mapActions(['setConsultaRegra'])
  }
}
</script>
