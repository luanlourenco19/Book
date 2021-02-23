<template>
  <div>
    <Modal v-model="abrirModal" width="1300" @on-visible-change="fecharModal($event)">
      <p slot="header" style="text-align:center;font-size:18px;">
        <span>Configurações Canhoto</span>
      </p>
      <Row :gutter="12">
        <Col span="24" class="center-botoes">
        <a v-if="form.parametrosCanhotoClienteId > 0" @click="abrirModalHistorico()">
          <strong>Histórico</strong>
        </a>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="9" class="title-right">
        <strong>Fornecedor - Configuração Liberação Pagamento</strong>
        </Col>
        <Col span="12" class="title-left">
        <strong>Cliente - Configuração Envio Canhoto</strong>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="10">
        <strong>Tipo Canhoto</strong>
        <Select id="txttabTipoCanhotoPagtoId" ref="oSelectTabTipoCanhotoPagtoId" v-model="form.tabTipoCanhotoPagtoId" filterable clearable style="width: 200px;">
                            <Option
                              v-for="itemTipoCanhotoPagtoId in telaConsultaAcordo.tiposCanhoto"
                              :key="itemTipoCanhotoPagtoId.tabTipoCanhotoId"
                              :value="itemTipoCanhotoPagtoId.tabTipoCanhotoId"
                            >{{itemTipoCanhotoPagtoId.descCanhoto}}</Option>
                          </Select>
        </Col>
        <Col span="3">
        <strong>Tipo Canhoto</strong>
        <Select id="txttabTipoCanhotoEmailCliId" ref="oSelectTabTipoCanhotoEmailCliId" v-model="form.tabTipoCanhotoEmailCliId" filterable clearable>
                            <Option
                              v-for="itemTipoCanhotoEmailCliId in telaConsultaAcordo.tiposCanhoto"
                              :key="itemTipoCanhotoEmailCliId.tabTipoCanhotoId"
                              :value="itemTipoCanhotoEmailCliId.tabTipoCanhotoId"
                            >{{itemTipoCanhotoEmailCliId.descCanhoto}}</Option>
                             <!--:disabled="!(itemC.tabTipoCanhotoId == form.tabTipoCanhotoPagtoId) && form.tabTipoCanhotoPagtoId != 3"-->
                          </Select>
        </Col>
        <Col span="3">
        <strong>Periodicidade de Envio</strong>
        <Select id="txttabTipoPeriodoId" ref="oSelectTabTipoPeriodoId" v-model="form.tabTipoPeriodoId" filterable clearable :disabled="!(
                                          (tabTipoFaturamentoId == 5 && form.tabTipoCanhotoPagtoId == 3    && form.tabTipoCanhotoEmailCliId == 3 && form.tabTipoCanhotoFatId == 2  && form.tabTipoProtocoloId == 8)
                                      || (tabTipoFaturamentoId == 5 && (form.tabTipoCanhotoPagtoId == 1 || form.tabTipoCanhotoPagtoId == 3) && (form.tabTipoCanhotoEmailCliId == 1 || form.tabTipoCanhotoEmailCliId == 3) && (form.tabTipoProtocoloId == 9 || form.tabTipoProtocoloId == 10))
                                      || (tabTipoFaturamentoId == 19 && form.tabTipoCanhotoPagtoId == 3 && form.tabTipoCanhotoEmailCliId == 3 && form.tabTipoCanhotoFatId == 2  && form.tabTipoProtocoloId == 8)
                                      || ((tabTipoFaturamentoId != 5 && tabTipoFaturamentoId != 19) && (form.tabTipoCanhotoPagtoId == 1 || form.tabTipoCanhotoPagtoId == 3) && (form.tabTipoCanhotoEmailCliId == 1 || form.tabTipoCanhotoEmailCliId == 3)  && (form.tabTipoProtocoloId == 9 || form.tabTipoProtocoloId == 10)))">
                            <Option
                              v-for="itemTipoPeriodoId in telaConsultaAcordo.tiposPeriodo"
                              :key="itemTipoPeriodoId.tabTipoPeriodoId"
                              :value="itemTipoPeriodoId.tabTipoPeriodoId"
                            >{{itemTipoPeriodoId.descTipoPeriodo}}</Option>
                          </Select>
        </Col>
        <Col span="7">
        <strong>E-mail Cliente</strong>
        <Row class="one-line">
          <Input id="txtcampoEmail" v-model="campoEmail" clearable :disabled="(form.listaEmails.length >= 10
                                      || !((tabTipoFaturamentoId == 5 && form.tabTipoCanhotoPagtoId == 3    && form.tabTipoCanhotoEmailCliId == 3 && form.tabTipoCanhotoFatId == 2  && form.tabTipoProtocoloId == 8)
                                      || (tabTipoFaturamentoId == 5 && (form.tabTipoCanhotoPagtoId == 1 || form.tabTipoCanhotoPagtoId == 3) && (form.tabTipoCanhotoEmailCliId == 1 || form.tabTipoCanhotoEmailCliId == 3) && (form.tabTipoProtocoloId == 9 || form.tabTipoProtocoloId == 10))
                                      || (tabTipoFaturamentoId == 19 && form.tabTipoCanhotoPagtoId == 3 && form.tabTipoCanhotoEmailCliId == 3 && form.tabTipoCanhotoFatId == 2  && form.tabTipoProtocoloId == 8)
                                      || ((tabTipoFaturamentoId != 5 && tabTipoFaturamentoId != 19) && (form.tabTipoCanhotoPagtoId == 1 || form.tabTipoCanhotoPagtoId == 3) && (form.tabTipoCanhotoEmailCliId == 1 || form.tabTipoCanhotoEmailCliId == 3)  && (form.tabTipoProtocoloId == 9 || form.tabTipoProtocoloId == 10))))"
            style="width: 100%;" />
          <Tooltip placement="top-start" content="Adicionar E-mail">
            <Icon type="md-add" size="24" @click="adicionarEmail()" />
          </Tooltip>
        </Row>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="9">
        <strong>Texto PDF Ordem de Serviço</strong>
        <Input id="txtPdfFornecedor" v-model="form.txtPdfFornecedor" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width: 100%;" />
        </Col>
        <Col span="6" offset="1">
        <strong>Endereço Envio Canhoto</strong>
        <Input id="txtendCanhotoFisicoCliente" v-model="form.endCanhotoFisicoCliente" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width: 100%;" :disabled="!(form.tabTipoCanhotoEmailCliId == 2 || form.tabTipoCanhotoEmailCliId == 3)" />
        </Col>
        <Col span="7">
        <div v-for="(email, index) in form.listaEmails">
          <Row v-show="form.tabTipoCanhotoEmailCliId == 1 || form.tabTipoCanhotoEmailCliId == 3" :gutter="24">
            <Col span="18" class="one-line-email">
            <strong>{{ email }}</strong>
            </Col>
            <Col span="6" class="one-line-email">
            <Icon type="md-create" size="18" @click="editarEmail(email,index)" />
            <Icon type="md-trash" size="18" @click="removerEmail(email,index)" />
            </Col>
          </Row>
        </div>
        </Col>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="6" class="title">
        <strong>Condição Canhoto para Faturamento</strong>
        </Col>
      </Row>
      <Row :gutter="12" class="top">
        <Col span="6">
        <strong>Tipo Canhoto</strong>
        <Select id="txttabTipoCanhotoFatId" ref="oSelectTabTipoCanhotoFatId" v-model="form.tabTipoCanhotoFatId" filterable clearable style="width: 200px;" :disabled="!( (tabTipoFaturamentoId == 5 && form.tabTipoProtocoloId == 8)     ||      tabTipoFaturamentoId == 19)">
                            <Option
                              v-for="itemTipoCanhotoFatId in telaConsultaAcordo.tiposCanhoto"
                              :key="itemTipoCanhotoFatId.tabTipoCanhotoId"
                              :value="itemTipoCanhotoFatId.tabTipoCanhotoId"
                            >{{itemTipoCanhotoFatId.descCanhoto}}</Option>
                          </Select>
        <!--:disabled="!(itemF.tabTipoCanhotoId == form.tabTipoCanhotoEmailCliId) && form.tabTipoCanhotoEmailCliId != 3"-->
        </Col>
        <Col span="6">
        <strong>Condição</strong>
        <Select id="txttabTipoProtocoloId" ref="oSelectTabTipoProtocoloId" v-model="form.tabTipoProtocoloId" filterable clearable style="width: 200px;" :disabled="(tabTipoFaturamentoId == 19)">
                            <Option
                              v-for="itemTipoProtocoloId in telaConsultaAcordo.tiposProtocolo"
                              :key="itemTipoProtocoloId.tabTipoProtocoloId"
                              :value="itemTipoProtocoloId.tabTipoProtocoloId"
                            >{{itemTipoProtocoloId.descricao}}</Option>
                          </Select>
        </Col>
        <Col span="6">
        <div>
          </br>
          <Row :gutter="24">
            <Col span="2">
            <Checkbox v-model="form.flagProcessoClienteBool" :disabled="!(tabTipoFaturamentoId == 19)"></Checkbox>
            </Col>
            <Col span="16">
            <strong>Geração de Fatura Condicionada a Processo do Cliente</strong>
            </Col>
          </Row>
        </div>
        </Col>
      </Row>
      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            v-if="!(acordoFaturamentoId > 0)"
            id="btn-Gravar"
            type="primary"
            class="margem-botoes"
            @click="fecharModalGravar($event)"
          >
         <span>Gravar</span>
        </Button>
        <Button v-if="acordoFaturamentoId > 0" type="primary" class="margem-botoes" :loading="loadGravar" @click="gravarCanhoto()">
            <span v-if="!loadGravar">Gravar</span>
            <span v-else>Gravando...</span>
        </Button>
        <Button id="btn-Limpar" class="margem-botoes" @click="empty()">Limpar</Button>
        <Button id="btn-Fechar" class="margem-botoes" @click="fecharModalGravar($event)">Fechar</Button>
        </col>
      </Row>
      <Modal v-model="modalHistorico" title="Histórico" width="1300">
        <Table ref="selection" :row-class-name="rowClassName" stripe border :columns="columns" :data="listaHistoricoCanhoto" :height="470"></Table>
        <div slot="footer"></div>
      </Modal>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from "vuex";
  export default {
    props: ["open", "acordoFaturamentoId", "tabTipoFaturamentoId"],
    data() {
      return {
        modalAberto: false,
        form: {
          parametrosCanhotoClienteId: 0,
          parametrosClienteId: 0,
          tabTipoCanhotoPagtoId: 0,
          txtPdfFornecedor: "",
          tabTipoCanhotoEmailCliId: 0,
          emailCanhoto: "",
          endCanhotoFisicoCliente: "",
          tabTipoCanhotoFatId: 0,
          tabTipoProtocoloId: 0,
          tabTipoPeriodoId: 0,
          flagProcessoCliente: "",
          flagProcessoClienteBool: false,
          tabStatusId: 0,
          listaEmails: []
        },
        campoEmail: "",
        loadGravar: false,
        modalHistorico: false,
        flagAtualizarEmail: false,
        listaHistoricoCanhoto: [],
        copiaForm: "",
        columns: [{
            title: "Data",
            key: "dataIncl",
            sortable: true,
            width: 150,
            align: "center"
          },
          {
            title: "Canhoto Fornecedor",
            key: "tabTipoCanhotoPagto",
            sortable: true,
            width: 180,
            align: "center"
          },
          {
            title: "Texto PDF Ordem de Serviço",
            key: "txtPdfFornecedor",
            sortable: true,
            width: 250,
            align: "center"
          },
          {
            title: "Canhoto Cliente",
            key: "tabTipoCanhotoEmailCli",
            sortable: true,
            width: 150,
            align: "center"
          },
          {
            title: "E-mail Cliente",
            key: "emailCanhoto",
            sortable: true,
            width: 200,
            align: "center"
          },
          {
            title: "Endereço Envio Canhoto",
            key: "endCanhotoFisicoCliente",
            sortable: true,
            width: 200,
            align: "center"
          },
          {
            title: "Canhoto Faturamento",
            key: "tabTipoCanhotoFat",
            sortable: true,
            width: 180,
            align: "center"
          },
          {
            title: "Condição",
            key: "tabTipoProtocolo",
            sortable: true,
            width: 170,
            align: "center"
          },
          {
            title: "Periodicidade de Envio",
            key: "tabTipoPeriodo",
            sortable: true,
            width: 190,
            align: "center"
          },
          {
            title: "Fatura Condic. Cliente",
            key: "flagProcessoCliente",
            sortable: true,
            width: 190,
            align: "center"
          },
          {
            title: "Usuário",
            key: "usuarioIncl",
            sortable: true,
            width: 200,
            align: "center"
          }
        ]
      };
    },
    computed: {
      abrirModal: {
        get: function() {
          return this.open;
        },
        set: function() {}
      },
      ...mapGetters(["telaConsultaAcordo", "usuarioId", "formModalCanhoto"]),
    },
    watch: {
      open() {
        if (this.open) {
          if (this.acordoFaturamentoId > 0) {
            this.form.parametrosClienteId = this.acordoFaturamentoId;
            this.buscarCanhoto();
          } else {
            this.form = this.formModalCanhoto;
          }
          if (this.tabTipoFaturamentoId == 19)
            this.form.tabTipoProtocoloId = 8;
          if (this.tabTipoFaturamentoId == 5 && this.form.tabTipoProtocoloId == 0)
            this.form.tabTipoProtocoloId = 10;
          this.loadGravar = false;
          this.modalAberto = true;
        }
      },
    },
    created() {
      this.$bus.$once("carregarCanhoto", () => {});
    },
    methods: {
      fecharModal(evt) {
        if (evt != true && this.modalAberto == true) {
          this.modalAberto = false;
          this.empty();
          this.$emit("close", {
            parametrosCanhotoClienteId: this.form.parametrosCanhotoClienteId
          });
        }
      },
      fecharModalGravar(evt) {
        if (evt != true && this.modalAberto == true) {
          if (!(this.acordoFaturamentoId > 0)) {
            if (!this.consistir()) return;
            this.form.parametrosCanhotoClienteId = 1;
            this.setformModalCanhoto(this.form);
          } else {
            this.empty();
          }
          this.modalAberto = false;
          this.$emit("close", {
            parametrosCanhotoClienteId: this.form.parametrosCanhotoClienteId
          });
        }
      },
      async buscarCanhoto() {
        if (this.form.parametrosClienteId > 0) {
          await this.Base.get("BuscarCanhoto", {
              params: {
                parametrosClienteId: this.form.parametrosClienteId
              }
            })
            .then(res => {
              if (res.data != null) {
                this.form = res.data;
                this.form.flagProcessoClienteBool =
                  this.form.flagProcessoCliente == "S" ? true : false;
                this.form.listaEmails =
                  (this.form.emailCanhoto && this.form.emailCanhoto.split(";")) || [];
                if (this.tabTipoFaturamentoId == 19) {
                  this.form.tabTipoProtocoloId = 8;
                }
                if (this.flagAtualizarEmail) {
                  let formConvert = JSON.parse(this.copiaForm);
                  this.form.tabTipoCanhotoPagtoId = formConvert.tabTipoCanhotoPagtoId;
                  this.form.tabTipoProtocoloId = formConvert.tabTipoProtocoloId;
                  this.form.tabTipoCanhotoFatId = formConvert.tabTipoCanhotoFatId;
                  this.form.tabTipoCanhotoEmailCliId = formConvert.tabTipoCanhotoEmailCliId;
                  this.form.tabTipoPeriodoId = formConvert.tabTipoPeriodoId;
                  this.flagAtualizarEmail = false;
                  this.copiaForm = "";
                }
              }
            })
            .catch(err => {
              this.$Notice.error({
                desc: err.response.data.Message
              });
            })
        }
      },
      consistir() {
        if (!(this.form.tabTipoCanhotoPagtoId > 0)) {
          this.$Notice.warning({
            desc: "Preencha Tipo de Canhoto Fornecedor."
          });
          return false;
        }
        if (!(this.form.tabTipoCanhotoEmailCliId > 0)) {
          this.$Notice.warning({
            desc: "Preencha Tipo de Canhoto Cliente."
          });
          return false;
        }
        if ((this.form.tabTipoCanhotoPagtoId == 1 && (this.form.tabTipoCanhotoEmailCliId == 2 || this.form.tabTipoCanhotoEmailCliId == 3)) ||
          (this.form.tabTipoCanhotoPagtoId == 2 && (this.form.tabTipoCanhotoEmailCliId == 1 || this.form.tabTipoCanhotoEmailCliId == 3))) {
          this.$Notice.warning({
            desc: "Tipo de Canhoto Cliente incompatível."
          });
          return false;
        }
        if ((this.tabTipoFaturamentoId == 19 && this.form.tabTipoCanhotoEmailCliId == 1 && (this.form.tabTipoCanhotoFatId == 2 || this.form.tabTipoCanhotoFatId == 3)) ||
          (this.tabTipoFaturamentoId == 19 && this.form.tabTipoCanhotoEmailCliId == 2 && (this.form.tabTipoCanhotoFatId == 1 || this.form.tabTipoCanhotoFatId == 3)) ||
          (this.tabTipoFaturamentoId == 5 && this.form.tabTipoCanhotoEmailCliId == 1 && (this.form.tabTipoCanhotoFatId == 2 || this.form.tabTipoCanhotoFatId == 3) && this.form.tabTipoProtocoloId == 8) ||
          (this.tabTipoFaturamentoId == 5 && this.form.tabTipoCanhotoEmailCliId == 2 && (this.form.tabTipoCanhotoFatId == 1 || this.form.tabTipoCanhotoFatId == 3) && this.form.tabTipoProtocoloId == 8) ||
          (this.tabTipoFaturamentoId == 5 && this.form.tabTipoCanhotoEmailCliId > 0 && this.form.tabTipoCanhotoFatId == 0 && this.form.tabTipoProtocoloId == 8)
        ) {
          this.$Notice.warning({
            desc: "Tipo de Canhoto Faturamento incompatível."
          });
          return false;
        }
        if (this.ValidarPeriodicidadeEnvio() &&
          this.form.listaEmails.length == 0) {
          this.$Notice.warning({
            desc: "Preencha E-mail Cliente"
          });
          return false;
        }
        if (
          this.tabTipoFaturamentoId == 19 &&
          !(this.form.tabTipoCanhotoFatId > 0)
        ) {
          this.$Notice.warning({
            desc: "Preencha Tipo de Canhoto Faturamento."
          });
          return false;
        }
        if (!(this.form.tabTipoProtocoloId > 0)) {
          this.$Notice.warning({
            desc: "Preencha Condição de Envio."
          });
          return false;
        }
        if ((this.tabTipoFaturamentoId != 5 && this.tabTipoFaturamentoId != 19 && this.form.tabTipoProtocoloId == 8)) {
          this.$Notice.warning({
            desc: "Condição Faturamento incompatível."
          });
          return false;
        }
        if (this.form.tabTipoPeriodoId > 0) {
          if (!this.ValidarPeriodicidadeEnvio()) {
            this.form.tabTipoPeriodoId = 0;
          }
        } else {
          if (this.ValidarPeriodicidadeEnvio()) {
            this.$Notice.warning({
              desc: "Preencha Periodicidade de Envio."
            });
            return false;
          }
        }
        if (this.tabTipoFaturamentoId != 19)
          this.form.flagProcessoClienteBool = false;
        this.verificaTipoCanhotoCli();
        this.verificaTipoCanhotoFat();
        this.form.emailCanhoto = this.form.listaEmails.join(";");
        this.form.flagProcessoCliente =
          this.form.flagProcessoClienteBool == true ? "S" : "N";
        this.loadGravar = true;
        return true;
      },
      async gravarCanhoto() {
        if (!this.consistir()) return;
        await this.Base.post("GravarCanhoto", this.form, {
            params: {
              usuarioId: this.usuarioId
            }
          })
          .then(res => {
            this.$Notice.success({
              desc: res.data
            });
            this.buscarCanhoto();
          })
          .catch(err => {
            this.$Notice.error({
              desc: err.response.data.Message
            });
          })
          .finally(() => {
            this.loadGravar = false;
          });
      },
      async gravarEmail(mensagem) {
        if (this.form.parametrosCanhotoClienteId > 1) {
          this.form.emailCanhoto = this.form.listaEmails.join(";");
          await this.Base.post("GravarEmailCanhoto", this.form, {
              params: {
                usuarioId: this.usuarioId
              }
            })
            .then(() => {
              this.$Notice.success({
                desc: mensagem
              });
              this.copiaForm = JSON.stringify(this.form);
              this.flagAtualizarEmail = true;
              this.empty();
              this.buscarCanhoto();
            })
            .catch(err => {
              this.$Notice.error({
                desc: err.response.data.Message
              });
            })
        }
      },
      adicionarEmail() {
        if (this.form.listaEmails.length < 10) {
          if (this.campoEmail == "" || this.campoEmail == null) {
            this.$Notice.warning({
              desc: "Preencha E-mail Cliente."
            });
            return;
          }
          if (!this.validarEmail()) {
            this.$Notice.warning({
              desc: "E-mail inválido."
            });
            return;
          }
          this.form.listaEmails.push(this.campoEmail);
          this.gravarEmail("E-mail gravado com sucesso.");
          this.campoEmail = "";
        }
      },
      async editarEmail(email, index) {
        await this.form.listaEmails.splice(index, 1);
        this.campoEmail = email;
      },
      async removerEmail(email, index) {
        await this.form.listaEmails.splice(index, 1);
        this.gravarEmail("E-mail excluído com sucesso.");
      },
      abrirModalHistorico() {
        this.listaHistoricoCanhoto = [];
        this.buscarHistoricoCanhoto();
      },
      async buscarHistoricoCanhoto() {
        await this.Base.get("BuscarHistoricoCanhoto", {
            params: {
              parametrosCanhotoClienteId: this.form.parametrosCanhotoClienteId
            }
          })
          .then(res => {
            this.listaHistoricoCanhoto = res.data;
            this.modalHistorico = true;
          })
          .catch(err => {
            this.$Notice.error({
              desc: err.response.data.Message
            });
          });
      },
      verificaTipoCanhotoCli() {
        if (!(
            this.form.tabTipoCanhotoEmailCliId == 2 ||
            this.form.tabTipoCanhotoEmailCliId == 3
          )) {
          this.form.endCanhotoFisicoCliente = "";
        }
        if (!(
            this.form.tabTipoCanhotoEmailCliId == 1 ||
            this.form.tabTipoCanhotoEmailCliId == 3
          )) {
          this.form.emailCanhoto = "";
          this.form.listaEmails = [];
          //this.form.tabTipoPeriodoId = 0;
        }
      },
      verificaTipoCanhotoFat() {
        if (!((this.tabTipoFaturamentoId == 5 && this.form.tabTipoProtocoloId == 8) || this.tabTipoFaturamentoId == 19)) {
          this.form.tabTipoCanhotoFatId = 0;
        }
      },
      validarEmail() {
        const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        return emailReg.test(this.campoEmail);
      },
      empty() {
        this.campoEmail = "";
        this.form.listaEmails = [];
        this.form.tabTipoCanhotoPagtoId = 0;
        this.form.txtPdfFornecedor = "";
        this.form.tabTipoCanhotoEmailCliId = 0;
        this.form.emailCanhoto = "";
        this.form.endCanhotoFisicoCliente = "";
        this.form.tabTipoCanhotoFatId = 0;
        this.form.tabTipoProtocoloId = 0;
        this.form.tabTipoPeriodoId = 0;
        this.form.flagProcessoCliente = "";
        this.form.flagProcessoClienteBool = false;
        this.form.tabStatusId = 0;
        this.setformModalCanhoto({
          parametrosClienteId: 0,
          tabTipoCanhotoPagtoId: 0,
          tabTipoCanhotoEmailCliId: 0,
          txtPdfFornecedor: "",
          emailCanhoto: "",
          endCanhotoFisicoCliente: "",
          tabTipoCanhotoFatId: 0,
          tabTipoProtocoloId: 0,
          tabTipoPeriodoId: 0,
          flagProcessoCliente: "",
          flagProcessoClienteBool: false,
          tabStatusId: 0,
          listaEmails: []
        });
        this.$refs.oSelectTabTipoCanhotoPagtoId.clearSingleSelect();
        this.$refs.oSelectTabTipoCanhotoEmailCliId.clearSingleSelect();
        this.$refs.oSelectTabTipoPeriodoId.clearSingleSelect();
        this.$refs.oSelectTabTipoCanhotoFatId.clearSingleSelect();
        this.$refs.oSelectTabTipoProtocoloId.clearSingleSelect();
      },
      ValidarPeriodicidadeEnvio() {
        if (!((this.tabTipoFaturamentoId == 5 && this.form.tabTipoCanhotoPagtoId == 3 && this.form.tabTipoCanhotoEmailCliId == 3 && this.form.tabTipoCanhotoFatId == 2 && this.form.tabTipoProtocoloId == 8) ||
            (this.tabTipoFaturamentoId == 5 && (this.form.tabTipoCanhotoPagtoId == 1 || this.form.tabTipoCanhotoPagtoId == 3) && (this.form.tabTipoCanhotoEmailCliId == 1 || this.form.tabTipoCanhotoEmailCliId == 3) && (this.form.tabTipoProtocoloId == 9 || this.form.tabTipoProtocoloId == 10)) ||
            (this.tabTipoFaturamentoId == 19 && this.form.tabTipoCanhotoPagtoId == 3 && this.form.tabTipoCanhotoEmailCliId == 3 && this.form.tabTipoCanhotoFatId == 2 && this.form.tabTipoProtocoloId == 8) ||
            ((this.tabTipoFaturamentoId != 5 && this.tabTipoFaturamentoId != 19) && (this.form.tabTipoCanhotoPagtoId == 1 || this.form.tabTipoCanhotoPagtoId == 3) && (this.form.tabTipoCanhotoEmailCliId == 1 || this.form.tabTipoCanhotoEmailCliId == 3) && (this.form.tabTipoProtocoloId == 9 || this.form.tabTipoProtocoloId == 10)))) {
          return false;
        }
        return true;
      },
      rowClassName(row) {
        return "tamanhoLinha";
      },
      ...mapActions(["setformModalCanhoto"])
    },
  };
</script>

<style scoped>
  .one-line {
    white-space: nowrap;
  }
  .one-line-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
