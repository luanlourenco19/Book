<template>
  <div id="app">
    <div class="content-form">
      <Col span="24">
        <Row :gutter="12">
          <Col span="24" class="center-botoes">
            <router-link to="/pesquisar-regras-faturamento">Pesquisar</router-link>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="8">
            <strong>Cliente</strong>
            <Autocomplete
              id="txtCliente_Regra"
              v-model="form.cliente"
              action="ClienteNomeAcordo"
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
              id="txtCNPJ/CUIT/CPF_Regra"
              v-model="form.cliente"
              action="ClienteCnpjCpfAcordo"
              :valor="form.cliente.cnpjCpf"
              campos-visiveis="nomeFantasia,cnpjCpf"
              nomes-campos="Nome,CNPJ/CUIT/CPF"
              @clear="form.cliente = {}"
            />
          </Col>
          <Col span="7">
            <strong>Grupo Cliente</strong>
            <Autocomplete
              id="txtGrupoCliente_Regra"
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
        <Row :gutter="12" class="top">
          <Col span="8">
            <strong>Email Fatura</strong>
            <Input id="txtEmail_Regra" v-model="form.email" @on-change="verificaEnvioAutomatico()" />
          </Col>
          <Col span="5">
            <strong>Operação</strong>
            <RadioGroup v-model="form.operacao" type="button">
              <Radio label="Nacional" type="primary"></Radio>
              <Radio label="Internacional"></Radio>
            </RadioGroup>
          </Col>
          <Col span="3" style="padding-top: 16px;padding-left: 0px;">
            <div v-if="telaConsultaAcordo.FlagHabilitaTipoAgrupamentoEnvio">
              <Checkbox v-model="form.envioAutomatico" :disabled="!form.email != ''">
                <b>Envio Automático</b>
              </Checkbox>
            </div>
            <div v-else>
              <Checkbox
                v-model="form.envioAutomatico"
                :disabled="!form.email != ''"
                @on-change="form.emailAgrupado = form.envioAutomatico"
              >
                <b>Envio Automático</b>
              </Checkbox>
              <br />
              <Checkbox v-model="form.emailAgrupado" :disabled="!form.envioAutomatico">
                <b>Email Agrupado</b>
              </Checkbox>
            </div>
          </Col>
          <Col v-if="telaConsultaAcordo.FlagHabilitaTipoAgrupamentoEnvio" span="3">
            <strong>Tipo Agrupamento </strong>
            <Select v-model="form.TipoAgrupamentoEnvioId">
              <Option
                v-for="item in telaConsultaAcordo.TiposAgrupamentoEnvio"
                :key="item.TipoAgrupamentoEnvioId"
                :value="item.TipoAgrupamentoEnvioId"
                >{{ item.DescricaoAgrupamento }}</Option
              >
            </Select>
          </Col>
          <Col span="4">
            <strong>Tipo Envio Faturamento</strong>
            <Select id="txtTipoEnvio_Regra" v-model="form.TabTipoEnvioFatId">
              <Option
                v-for="item in telaConsultaAcordo.tabTipoEnvioFat"
                :key="item.TabTipoEnvioFatId"
                :value="item.TabTipoEnvioFatId"
                >{{ item.Descricao }}</Option
              >
            </Select>
          </Col>
        </Row>
        <Row :gutter="12" class="top" prop="grupoRadicalCnpj.radicalCnpj">
          <Col v-if="telaConsultaAcordo.ApresentarAcordoRaiz" span="8">
            <strong>Nome Grupo Raiz CNPJ</strong>
            <Autocomplete
              id="txtNomeGrupo_Regra"
              v-model="form.grupoRadicalCnpj"
              action="NomeGrupoRadicalCnpj"
              :valor="form.grupoRadicalCnpj.nomeGrupoRadicalCnpj"
              campos-visiveis="nomeGrupoRadicalCnpj,radicalCnpj"
              nomes-campos="Nome,Raiz Cnpj"
              width="450px"
              height="200px"
              @clear="form.grupoRadicalCnpj = {}"
            />
          </Col>
          <Col v-if="telaConsultaAcordo.ApresentarAcordoRaiz" span="3">
            <strong>Grupo Raiz CNPJ</strong>
            <Autocomplete
              id="txtGrupoRaiz_Regra"
              v-model="form.grupoRadicalCnpj"
              action="GrupoRadicalCnpj"
              :valor="form.grupoRadicalCnpj.radicalCnpj"
              campos-visiveis="radicalCnpj,nomeGrupoRadicalCnpj"
              maxlenght="8"
              nomes-campos="Raiz Cnpj, Grupo"
              @clear="form.grupoRadicalCnpj = {}"
            />
          </Col>
          <Col span="4">
            <strong>Tipo Cliente</strong>
            <Select id="txtTipoCliente_Regra" v-model="form.tipoClienteId" clearable>
              <Option
                v-for="item in telaConsultaAcordo.tiposCliente"
                :key="item.tipoClienteId"
                :value="item.tipoClienteId"
                >{{ item.descTipoCliente }}</Option
              >
            </Select>
          </Col>
          <Col span="5">
            <strong>Responsável Financeiro</strong>
            <Select id="txtResponsavelFinanceiro_Regra" v-model="form.respFinanceiroId" clearable>
              <Option
                v-for="item in telaConsultaAcordo.respFinanceiros"
                :key="item.respFinanceiroId"
                :value="item.respFinanceiroId"
                >{{ item.descRespFinanceiro }}</Option
              >
            </Select>
          </Col>
          <Col v-if="form.operacao == 'Internacional'" span="3">
            <strong>Ajuste Tx PTAX</strong>
            <Input id="txtAjusteTxPTAX_Regra" v-model="form.percAjusteTaxaPTAX">
              <span slot="prepend">%</span>
            </Input>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="6" class="title">
            <strong>Tipo de Faturamento</strong>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="10">
            <strong>Regra Faturamento</strong>
            <Select
              id="txtRegraFaturamento_Regra"
              v-model="form.tabTipoFaturamentoId"
              clearable
              @on-change="verificaTipoFaturamento()"
            >
              <Option
                v-for="item in telaConsultaAcordo.tabTipoFaturamento"
                :key="item.tabTipoFaturamentoId"
                :value="item.tabTipoFaturamentoId"
                >{{ item.descFaturamento }}</Option
              >
            </Select>
          </Col>
          <div
            v-if="form.tabTipoFaturamentoId > 0 && form.tabTipoFaturamentoId != 5 && form.tabTipoFaturamentoId != 10"
            class="infoDias"
          >
            <Col offset="2" span="3">
              <strong style="margin-top: 10px">Dias p/ pagto</strong>
            </Col>
            <Col span="3">
              <strong style="margin-top: 10px">Dias Úteis p/ Pagto</strong>
            </Col>
            <Col
              v-if="
                form.tabTipoFaturamentoId != 1 &&
                  form.tabTipoFaturamentoId != 7 &&
                  form.tabTipoFaturamentoId != 14 &&
                  form.tabTipoFaturamentoId != 15 &&
                  form.tabTipoFaturamentoId != 16 &&
                  form.tabTipoFaturamentoId != 17 &&
                  form.tabTipoFaturamentoId != 18 &&
                  form.tabTipoFaturamentoId != 19
              "
              span="3"
            >
              <strong style="margin-top: 10px">Pagto Dia</strong>
            </Col>
          </div>
        </Row>
        <div class="infoTipoFatu">
          <Row v-if="form.tabTipoFaturamentoId == 6" :gutter="12" class="top">
            <Col span="6">
              <strong>Qtde. Dias p/ Emissão</strong>
              <Input
                id="txtdiasEmissaoNaoAgrupada"
                v-model="form.diasEmissaoNaoAgrupada"
                :maxlength="1"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" offset="6" class="top-col">
              <Input
                id="txtdiasPagtoNaoAgrupada"
                v-model="form.diasPagtoNaoAgrupada"
                clearable
                :maxlength="3"
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" class="top-col">
              <Input
                id="txtdiasPagtoUteisNaoAgrupada"
                v-model="form.diasPagtoUteisNaoAgrupada"
                clearable
                :maxlength="2"
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" class="top-col">
              <Input
                id="txtpagtoDiaNaoAgrupada"
                v-model="form.pagtoDiaNaoAgrupada"
                clearable
                :maxlength="2"
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 6-->
          <!-- Inicio Validação para tabTipoFaturamento = 1 -->
          <Row v-if="form.tabTipoFaturamentoId == 1" :gutter="12" class="top">
            <Col span="6">
              <strong>Dia da Semana</strong>
              <Select id="txtdiaSemanaIdAgrupadaSemana" v-model="form.diaSemanaIdAgrupadaSemana" filterable clearable>
                <Option v-for="item in diasSemana" :key="item.diaSemanaId" :value="item.diaSemanaId">{{
                  item.descDia
                }}</Option>
              </Select>
            </Col>
            <Col span="3" offset="6" class="top-col">
              <Input
                id="txtdiasPagtoAgrupadaSemana"
                v-model="form.diasPagtoAgrupadaSemana"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" class="top-col">
              <Input
                id="txtdiasPagtoUteisAgrupadaSemana"
                v-model="form.diasPagtoUteisAgrupadaSemana"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 1-->
          <!-- Inicio Validação para tabTipoFaturamento = 2 -->
          <div v-if="form.tabTipoFaturamentoId == 2">
            <Row :gutter="12" class="top">
              <Col span="3" class="top-col">
                <span>1º Decêndio:</span>
              </Col>
              <Col span="3">
                <strong>De</strong>
                <Input
                  id="txtprimeiroDecendioDe"
                  v-model="form.primeiroDecendioDe"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Até</strong>
                <Input
                  id="txtprimeiroDecendioAte"
                  v-model="form.primeiroDecendioAte"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Emissão Dia</strong>
                <Input
                  id="txtprimeiroDecendioEmissaoDia"
                  v-model="form.primeiroDecendioEmissaoDia"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoPrimeiroDecendio"
                  v-model="form.diasPagtoPrimeiroDecendio"
                  :maxlength="3"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoUteisPrimeiroDecendio"
                  v-model="form.diasPagtoUteisPrimeiroDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtpagtoDiaPrimeiroDecendio"
                  v-model="form.pagtoDiaPrimeiroDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
            </Row>
            <Row :gutter="12" class="top">
              <Col span="3" class="top-col">
                <span>2º Decêndio:</span>
              </Col>
              <Col span="3">
                <strong>De</strong>
                <Input
                  id="txtsegundoDecendioDe"
                  v-model="form.segundoDecendioDe"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Até</strong>
                <Input
                  id="txtsegundoDecendioAte"
                  v-model="form.segundoDecendioAte"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Emissão Dia</strong>
                <Input
                  id="txtsegundoDecendioEmissaoDia"
                  v-model="form.segundoDecendioEmissaoDia"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoSegundoDecendio"
                  v-model="form.diasPagtoSegundoDecendio"
                  :maxlength="3"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoUteisSegundoDecendio"
                  v-model="form.diasPagtoUteisSegundoDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtpagtoDiaSegundoDecendio"
                  v-model="form.pagtoDiaSegundoDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
            </Row>
            <Row :gutter="12" class="top">
              <Col span="3" class="top-col">
                <span>3º Decêndio:</span>
              </Col>
              <Col span="3">
                <strong>De</strong>
                <Input
                  id="txtterceiroDecendioDe"
                  v-model="form.terceiroDecendioDe"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Até</strong>
                <Input
                  id="txtterceiroDecendioAte"
                  v-model="form.terceiroDecendioAte"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3">
                <strong>Emissão Dia</strong>
                <Input
                  id="txtterceiroDecendioEmissaoDia"
                  v-model="form.terceiroDecendioEmissaoDia"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoTerceiroDecendio"
                  v-model="form.diasPagtoTerceiroDecendio"
                  :maxlength="3"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoUteisTerceiroDecendio"
                  v-model="form.diasPagtoUteisTerceiroDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="pagtoDiaTerceiroDecendio"
                  v-model="form.pagtoDiaTerceiroDecendio"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
            </Row>
          </div>
          <!-- Fim Validação para tabTipoFaturamento = 2 -->
          <!-- Inicio Validação para tabTipoFaturamento = 3 -->
          <div v-if="form.tabTipoFaturamentoId == 3">
            <Row :gutter="12" class="top">
              <Col span="3" class="top-col">
                <span>1ª Quinzena:</span>
              </Col>
              <Col span="3">
                <strong>Emissão Dia</strong>
                <Input
                  id="txtprimeiraQuinzenaEmissaoDia"
                  v-model="form.primeiraQuinzenaEmissaoDia"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" offset="6" class="top-col">
                <Input
                  id="txtdiasPagtoPrimeiraQuinzena"
                  v-model="form.diasPagtoPrimeiraQuinzena"
                  :maxlength="3"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoUteisPrimeiraQuinzena"
                  v-model="form.diasPagtoUteisPrimeiraQuinzena"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtpagtoDiaPrimeiraQuinzena"
                  v-model="form.pagtoDiaPrimeiraQuinzena"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
            </Row>
            <Row :gutter="12" class="top">
              <Col span="3" class="top-col">
                <span>2ª Quinzena:</span>
              </Col>
              <Col span="3">
                <strong>Emissão Dia</strong>
                <Input
                  id="txtsegundaQuinzenaEmissaoDia"
                  v-model="form.segundaQuinzenaEmissaoDia"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" offset="6" class="top-col">
                <Input
                  id="txtdiasPagtoSegundaQuinzena"
                  v-model="form.diasPagtoSegundaQuinzena"
                  :maxlength="3"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtdiasPagtoUteisSegundaQuinzena"
                  v-model="form.diasPagtoUteisSegundaQuinzena"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
              <Col span="3" class="top-col">
                <Input
                  id="txtpagtoDiaSegundaQuinzena"
                  v-model="form.pagtoDiaSegundaQuinzena"
                  :maxlength="2"
                  clearable
                  @on-keyup="returnNumber($event)"
                />
              </Col>
            </Row>
          </div>
          <!-- Fim Validação para tabTipoFaturamento = 3    -->
          <!-- Inicio Validação para tabTipoFaturamento = 4 -->
          <Row v-if="form.tabTipoFaturamentoId == 4" :gutter="12" class="top">
            <Col span="3" offset="3">
              <strong>Emissão Dia</strong>
              <Input
                id="emissaoDiaAgrupadaMes"
                v-model="form.emissaoDiaAgrupadaMes"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" offset="6" class="top-col">
              <Input
                id="txtdiasPagtoAgrupadaMes"
                v-model="form.diasPagtoAgrupadaMes"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" class="top-col">
              <Input
                id="txtdiasPagtoUteisAgrupadaMes"
                v-model="form.diasPagtoUteisAgrupadaMes"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" class="top-col">
              <Input
                id="txtpagtoDiaAgrupadaMes"
                v-model="form.pagtoDiaAgrupadaMes"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento =  4   -->
          <!-- Inicio Validação para tabTipoFaturamento = 7 -->
          <Row v-if="form.tabTipoFaturamentoId == 7" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="7">
              <strong>Dias Após Partida do Navio</strong>
              <Input
                id="txtdiasPartidaNavio"
                v-model="form.diasPartidaNavio"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3" offset="5">
              <br />
              <Input
                id="txtdiasPagtoAgrupadaNavio"
                v-model="form.diasPagtoAgrupadaNavio"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <br />
              <Input
                id="txtdiasPagtoUteisAgrupadaNavio"
                v-model="form.diasPagtoUteisAgrupadaNavio"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 7    -->
          <!-- Inicio Validação para tabTipoFaturamento = 14 -->
          <Row v-if="form.tabTipoFaturamentoId == 14" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="3" offset="12">
              <Input
                id="txtdiasPagtoAgrupadaContainer"
                v-model="form.diasPagtoAgrupadaContainer"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <Input
                id="txtdiasPagtoUteisAgrupadaContainer"
                v-model="form.diasPagtoUteisAgrupadaContainer"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 14    -->
          <!-- Inicio Validação para tabTipoFaturamento = 15 -->
          <Row v-if="form.tabTipoFaturamentoId == 15" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="3" offset="12">
              <Input
                id="txtdiasPagtoAgrupadaDestinatario"
                v-model="form.diasPagtoAgrupadaDestinatario"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <Input
                id="txtdiasPagtoUteisAgrupadaDestinatario"
                v-model="form.diasPagtoUteisAgrupadaDestinatario"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 15    -->
          <!-- Inicio Validação para tabTipoFaturamento = 16 -->
          <Row v-if="form.tabTipoFaturamentoId == 16" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="3" offset="12">
              <Input
                id="txtdiasPagtoAgrupadaPreFatura"
                v-model="form.diasPagtoAgrupadaPreFatura"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <Input
                id="txtdiasPagtoUteisAgrupadaPreFatura"
                v-model="form.diasPagtoUteisAgrupadaPreFatura"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 16    -->
          <!-- Inicio Validação para tabTipoFaturamento = 17 -->
          <Row v-if="form.tabTipoFaturamentoId == 17" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="3" offset="12">
              <Input
                id="txtdiasPagtoAgrupadaDataEntrega"
                v-model="form.diasPagtoAgrupadaDataEntrega"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <Input
                id="txtdiasPagtoUteisAgrupadaDataEntrega"
                v-model="form.diasPagtoUteisAgrupadaDataEntrega"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 17    -->
          <!-- Inicio Validação para tabTipoFaturamento = 18 -->
          <Row v-if="form.tabTipoFaturamentoId == 18" :gutter="12" class="top" style="padding-top: 15px;">
            <Col span="3" offset="12">
              <Input
                id="txtdiasPagtoAgrupadaPorto"
                v-model="form.diasPagtoAgrupadaPorto"
                :maxlength="3"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
            <Col span="3">
              <Input
                id="diasPagtoUteisAgrupadaPorto"
                v-model="form.diasPagtoUteisAgrupadaPorto"
                :maxlength="2"
                clearable
                @on-keyup="returnNumber($event)"
              />
            </Col>
          </Row>
          <!-- Fim Validação para tabTipoFaturamento = 18    -->
        </div>
        <!-- Inicio Validação para tabTipoFaturamento = 19 -->
        <Row v-if="form.tabTipoFaturamentoId == 19" :gutter="12" class="top" style="padding-top: 15px;">
          <Col span="3" offset="12">
            <Input
              id="txtdiasPagtoAgrupadaCanhoto"
              v-model="form.diasPagtoAgrupadaCanhoto"
              :maxlength="3"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="3">
            <Input
              id="txtdiasPagtoUteisAgrupadaCanhoto"
              v-model="form.diasPagtoUteisAgrupadaCanhoto"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
        </Row>
        <!-- Fim Validação para tabTipoFaturamento = 19    -->
        <!--Acabou radio-->
        <Row :gutter="12" class="top">
          <Col span="4" class="title">
            <strong>Regras Adicionais</strong>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="4">
            <strong>Pagamento:</strong>
          </Col>
          <Col span="5">
            <span>Somente nos dias</span>
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia1"
              v-model="form.pagamentoDia1"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia2"
              v-model="form.pagamentoDia2"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia3"
              v-model="form.pagamentoDia3"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia4"
              v-model="form.pagamentoDia4"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia5"
              v-model="form.pagamentoDia5"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2">
            <Input
              id="txtpagamentoDia6"
              v-model="form.pagamentoDia6"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="5" offset="4">
            <span>Somente no dia da semana</span>
          </Col>
          <Col span="4">
            <Select id="txtdiaSemanaId1" v-model="form.diaSemanaId1" clearable>
              <Option v-for="item in diasSemana" :key="item.diaSemanaId" :value="item.diaSemanaId">{{
                item.descDia
              }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select id="txtdiaSemanaId2" v-model="form.diaSemanaId2" clearable>
              <Option v-for="item in diasSemana" :key="item.diaSemanaId" :value="item.diaSemanaId">{{
                item.descDia
              }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select id="txtdiaSemanaId3" v-model="form.diaSemanaId3" clearable>
              <Option v-for="item in diasSemana" :key="item.diaSemanaId" :value="item.diaSemanaId">{{
                item.descDia
              }}</Option>
            </Select>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="7">
            <Checkbox v-model="form.vencimentoMesSeguinte">
              <b>Vencimento no mês seguinte a emissão</b>
            </Checkbox>
          </Col>
          <Col span="3" offset="2">
            <span>Parcelado vezes:</span>
          </Col>
          <Col span="2" offset="1">
            <Input
              id="txtQtdParcelas"
              v-model="form.QtdParcelas"
              :maxlength="1"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="3" offset="9">
            <span>Venc. Parcela:</span>
          </Col>
          <Col span="2" offset="1">
            <Input
              id="txtVencimentoParc1"
              v-model="form.VencimentoParc1"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2" offset="1">
            <Input
              id="txtVencimentoParc2"
              v-model="form.VencimentoParc2"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
          <Col span="2" offset="1">
            <Input
              id="txtVencimentoParc3"
              v-model="form.VencimentoParc3"
              :maxlength="2"
              clearable
              @on-keyup="returnNumber($event)"
            />
          </Col>
        </Row>

        <Row :gutter="12" class="top">
          <!-- <Col span="7">
            <Checkbox v-model="form.calendarioVencimentos">
              <b>Calendário de vencimentos</b>
            </Checkbox>
          </Col> -->
          <Col span="3" offset="9">
            <span>Datas:</span>
          </Col>
          <Col span="4" offset="1">
          <date-picker type="date" multiple placeholder="Selecione a data" v-model="form.DataVencto" :options="datasValidas" style="width: 306px" format="dd/MM/yyyy"></date-picker>
          </Col>
          
        </Row>

        <Row :gutter="12" class="top">
          <Col span="12">
            <Checkbox
              v-if="telaConsultaAcordo.FlagHabilitaCanhoto"
              v-model="form.exigeCanhoto"
              :disabled="form.tabTipoFaturamentoId == 19"
            >
              <b>Exige Canhoto</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.consideraEmissaofatura" @on-change="form.consideraEmissaoCte = false">
              <b>Considera dia de emissão da fatura no cálculo do vencimento</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.consideraEmissaoCte" @on-change="form.consideraEmissaofatura = false">
              <b>Considera dia de emissão do conhecimento no cálculo do vencimento</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.consideraSaidaNavio">
              <b>Considera data de saída do navio como data de emissão</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.geraUnitariaBL">
              <b>Gerar fatura unitária BL</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.separaPorTipoDocumento">
              <b>Separar fatura por tipo de documento</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.ConsideraAgrupa">
              <b>Realizar nova consolidação por agrupamento(Load)</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.NaoAgrupa">
              <b>Gera uma fatura para cada CTe</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.LiberacaoControladoria">
              <b>Necessita liberação dos conhecimentos para efetuar o pagamento</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.ImprimirAutomaticamente">
              <b>Impressão automática de faturas geradas pelo sistema</b>
            </Checkbox>
          </Col>
        </Row>
        <Row v-if="telaConsultaAcordo.FlagHabilitaNumPedidoObsFatura" :gutter="12" class="top-checkbox">
          <Col span="12">
            <Checkbox v-model="form.FlagNumPedidoObsFatura">
              <b>Número do Pedido na Observação da Fatura</b>
            </Checkbox>
          </Col>
        </Row>
        <Row :gutter="12" class="top">
          <Col span="24">
            <strong>Observação</strong>
            <Input
              id="txtobservacao"
              v-model="form.observacao"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
            />
          </Col>
        </Row>
        <Row class="top bottom">
          <Col span="24" class="center-botoes">
            <Button id="btn-Gravar_Regra" type="primary" class="margem-botoes" :loading="loadGravar" @click="gravar">
              <span v-if="!loadGravar">Gravar</span>
              <span v-else>Gravando...</span>
            </Button>
            <Button id="btn-teste" type="primary" class="margem-botoes" :loading="loadGravar" @click="teste">
              <span v-if="!loadGravar">teste</span>
              <span v-else>Gravando...</span>
            </Button>
            <Button id="btn-Nro_Controle_Cliente" class="margem-botoes" @click="addNroControleCliente()"
              ><span>Nro. Controle Cliente</span></Button
            >
            <Button
              v-if="
                form.acordoFaturamentoId > 0 && !telaConsultaAcordo.FlagDesabilitaExcluir && form.FlagPermiteExcluir
              "
              id="btn-Excluir_Regra"
              type="error"
              class="margem-botoes"
              :loading="loadExcluir"
              @click="confirmarExclusao()"
            >
              <span v-if="!loadExcluir">Excluir</span>
              <span v-else>Excluindo...</span>
            </Button>
            <Button
              v-if="telaConsultaAcordo.ApresentarAcordoRaiz && form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0"
              id="btn-Excecao_Regra"
              class="margem-botoes"
              :loading="loadExcecao"
              @click="addExcecao()"
            >
              <span v-if="!loadExcecao">Exceção</span>
              <span v-else>Abrindo Lista...</span>
            </Button>
            <Button
              v-if="form.exigeCanhoto == true"
              id="btn-Canhoto_Regra"
              class="margem-botoes"
              :loading="loadCanhoto"
              @click="addCanhoto()"
              >Canhoto</Button
            >
            <Button class="margem-botoes" @click="empty">Limpar</Button>
            <Button class="margem-botoes" @click="voltar">Voltar</Button>
          </Col>
        </Row>
        <Row :gutter="24" class="top bottom">
          <Col v-if="form.usuarioInclusao != null" span="6">
            <strong>Usuário / Data Inclusão</strong>
            <p>{{ form.usuarioInclusao }} / {{ form.dataInclusao }}</p>
          </Col>
          <Col v-if="form.usuarioAlteracao != null" span="6">
            <strong>Usuário / Data Última Alteração</strong>
            <p>{{ form.usuarioAlteracao }} / {{ form.dataAlteracao }}</p>
          </Col>
        </Row>
      </Col>
    </div>
    <ModalExcecaoRegra
      :open="abrirModalExcecaoRegra"
      :excecao-regra-raiz="form.ExcecaoRegraRaiz"
      @closeExcecao="atualizarListaExcecao($event)"
    />
    <ModalCanhoto
      :open="abrirModalCanhoto"
      :acordo-faturamento-id="form.acordoFaturamentoId"
      :tab-tipo-faturamento-id="form.tabTipoFaturamentoId"
      @close="atualizarCanhoto($event)"
    />
    <ModalNroControleCliente
      :open="abrirModalNroControleCliente"
      :acordo-faturamento-id="form.acordoFaturamentoId"
      :nome-fantasia="form.cliente.nomeFantasia"
      :cnpj-cpf="form.cliente.cnpjCpf"
      :radical-cnpj="form.grupoRadicalCnpj.radicalCnpj"
      :nome-radical="form.grupoRadicalCnpj.nomeGrupoRadicalCnpj"
      @close="atualizarNroControleCliente()"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Autocomplete from '@/components/Autocomplete'
import ModalExcecaoRegra from '@/components/RegrasFaturamento/ModalExcecaoRegraRaiz'
import ModalCanhoto from '@/components/RegrasFaturamento/ModalCanhoto'
import ModalNroControleCliente from '@/components/RegrasFaturamento/ModalNroControleCliente'
export default {
  components: {
    Autocomplete,
    ModalExcecaoRegra,
    ModalCanhoto,
    ModalNroControleCliente
  },
  props: ['id'],
  data() {
    return {
      form: {
        acordoFaturamentoId: 0,
        cliente: {},
        grupoCliente: {},
        email: '',
        envioAutomatico: false,
        emailAgrupado: false,
        tipoClienteId: 0,
        respFinanceiroId: 0,
        operacao: 'Nacional',
        percAjusteTaxaPTAX: '0,00',
        tabTipoFaturamentoId: 0,
        diasEmissaoNaoAgrupada: '',
        diasPagtoNaoAgrupada: '',
        diasPagtoUteisNaoAgrupada: '',
        pagtoDiaNaoAgrupada: '',
        diaSemanaIdAgrupadaSemana: '',
        diasPagtoAgrupadaSemana: '',
        diasPagtoUteisAgrupadaSemana: '',
        primeiroDecendioDe: '',
        primeiroDecendioAte: '',
        primeiroDecendioEmissaoDia: '',
        diasPagtoPrimeiroDecendio: '',
        diasPagtoUteisPrimeiroDecendio: '',
        pagtoDiaPrimeiroDecendio: '',
        segundoDecendioDe: '',
        segundoDecendioAte: '',
        segundoDecendioEmissaoDia: '',
        diasPagtoSegundoDecendio: '',
        diasPagtoUteisSegundoDecendio: '',
        pagtoDiaSegundoDecendio: '',
        terceiroDecendioDe: '',
        terceiroDecendioAte: '',
        terceiroDecendioEmissaoDia: '',
        diasPagtoTerceiroDecendio: '',
        diasPagtoUteisTerceiroDecendio: '',
        pagtoDiaTerceiroDecendio: '',
        primeiraQuinzenaEmissaoDia: '',
        diasPagtoPrimeiraQuinzena: '',
        diasPagtoUteisPrimeiraQuinzena: '',
        pagtoDiaPrimeiraQuinzena: '',
        segundaQuinzenaEmissaoDia: '',
        diasPagtoSegundaQuinzena: '',
        diasPagtoUteisSegundaQuinzena: '',
        pagtoDiaSegundaQuinzena: '',
        emissaoDiaAgrupadaMes: '',
        diasPagtoAgrupadaMes: '',
        diasPagtoUteisAgrupadaMes: '',
        pagtoDiaAgrupadaMes: '',
        diasPartidaNavio: '',
        diasPagtoAgrupadaNavio: '',
        diasPagtoUteisAgrupadaNavio: '',
        diasPagtoAgrupadaContainer: '',
        diasPagtoUteisAgrupadaContainer: '',
        diasPagtoAgrupadaDestinatario: '',
        diasPagtoUteisAgrupadaDestinatario: '',
        diasPagtoAgrupadaPreFatura: '',
        diasPagtoUteisAgrupadaPreFatura: '',
        diasPagtoAgrupadaDataEntrega: '',
        diasPagtoUteisAgrupadaDataEntrega: '',
        diasPagtoAgrupadaPorto: '',
        diasPagtoUteisAgrupadaPorto: '',
        pagamentoDia1: '',
        pagamentoDia2: '',
        pagamentoDia3: '',
        pagamentoDia4: '',
        pagamentoDia5: '',
        pagamentoDia6: '',
        diaSemanaId1: 0,
        diaSemanaId2: 0,
        diaSemanaId3: 0,
        vencimentoMesSeguinte: false,
        calendarioVencimentos: false,
        consideraEmissaofatura: false,
        consideraEmissaoCte: false,
        consideraSaidaNavio: false,
        geraUnitariaBL: false,
        separaPorTipoDocumento: false,
        observacao: '',
        usuarioId: 0,
        flagEmissaoManual: '',
        ExcecaoRegraRaiz: [],
        grupoRadicalCnpjIdent: 0,
        grupoRadicalCnpj: {},
        dataInclusao: '',
        usuarioInclusao: '',
        dataAlteracao: '',
        usuarioAlteracao: '',
        TabTipoEnvioFatId: 0,
        FlagCanhoto: 'Não',
        CondicaoCanhotoId: 0,
        EmailCanhoto: '',
        EnderecoCanhoto: '',
        ConsideraAgrupa: false,
        NaoAgrupa: false,
        LiberacaoControladoria: false,
        ImprimirAutomaticamente: false,
        QtdParcelas: '',
        VencimentoParc1: null,
        VencimentoParc2: null,
        VencimentoParc3: null,
        diasPagtoAgrupadaCanhoto: '',
        diasPagtoUteisAgrupadaCanhoto: '',
        exigeCanhoto: false,
        flagCanhotoGravado: false,
        FlagNumPedidoObsFatura: false,
        FlagPermiteExcluir: false,
        TipoAgrupamentoEnvioId: 1,
        DataVencto: []
      },
      datasValidas: { disabledDate (date) { return (!!date && date.valueOf() < Date.now() - 86400000); } ,
        limparData(date) { if (date == false) return []}},
      DiasPagamentoNacional: 0,
      DiasPagamentoInternacional: 0,
      loadGravar: false,
      loadExcluir: false,
      loadExcecao: false,
      loadCanhoto: false,
      abrirModalExcecaoRegra: false,
      abrirModalCanhoto: false,
      abrirModalNroControleCliente: false,
      diasSemana: [
        {
          diaSemanaId: 1,
          descDia: 'Segunda'
        },
        {
          diaSemanaId: 2,
          descDia: 'Terça'
        },
        {
          diaSemanaId: 3,
          descDia: 'Quarta'
        },
        {
          diaSemanaId: 4,
          descDia: 'Quinta'
        },
        {
          diaSemanaId: 5,
          descDia: 'Sexta'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['usuarioId', 'telaConsultaAcordo', 'doctoPagtoId', 'formModalCanhoto'])
  },
  
  created() {
    this.form.acordoFaturamentoId = this.id
    if (this.form.acordoFaturamentoId > 0) {
      this.consultarRegra()
    }
  },
  methods: {
    voltar() {
      if (this.doctoPagtoId > 0) {
        this.$router.push(`/fatura/${this.doctoPagtoId}`)
      } else {
        this.$router.push('/')
      }
    },
    addExcecao() {
      if (this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent != 0) {
        this.abrirModalExcecaoRegra = true
        this.$bus.$emit('carregarExcecao', this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent)
      }
    },
    atualizarListaExcecao(evt) {
      this.form.ExcecaoRegraRaiz = []
      this.abrirModalExcecaoRegra = false
      evt.item.map(excecao => {
        this.form.ExcecaoRegraRaiz.push({
          acordoFaturamentoIdPai: 0,
          clienteId: excecao,
          excecaoRegraRaizFatId: 0
        })
      })
      if (evt.item2 === true) this.gravar()
    },
    addCanhoto() {
      this.abrirModalCanhoto = true
      this.$bus.$emit('carregarCanhoto', '')
    },
    atualizarCanhoto(evt) {
      this.abrirModalCanhoto = false
      if (evt.parametrosCanhotoClienteId > 0) this.form.flagCanhotoGravado = true
    },
    addNroControleCliente() {
      this.abrirModalNroControleCliente = true
      this.$bus.$emit('carregarNroControleCliente', '')
    },
    atualizarNroControleCliente() {
      this.abrirModalNroControleCliente = false
    },
    async gravarCanhoto() {
      try {
        const res = await this.Base.post('GravarCanhoto', this.formModalCanhoto, {
          params: {
            usuarioId: this.usuarioId
          }
        })
      } catch (err) {
        this.$Notice.error({
          desc: err.response.data.Message
        })
      } finally {
        this.loadGravar = false
      }
    },
    consultarRegra() {
      this.$Spin.show()
      this.Base.get('RegraFaturamento', {
        params: {
          acordoFaturamentoId: this.form.acordoFaturamentoId
        }
      }).then(ret => {
        let retorno = ret.data
        retorno.envioAutomatico = 'S' == retorno.envioAutomatico ? true : false
        retorno.emailAgrupado = 'S' == retorno.emailAgrupado ? true : false
        retorno.vencimentoMesSeguinte = 'S' == retorno.vencimentoMesSeguinte ? true : false
        retorno.calendarioVencimentos = 'S' == retorno.calendarioVencimentos ? true : false
        retorno.consideraEmissaofatura = 'S' == retorno.consideraEmissaofatura ? true : false
        retorno.consideraEmissaoCte = 'S' == retorno.consideraEmissaoCte ? true : false
        retorno.consideraSaidaNavio = 'S' == retorno.consideraSaidaNavio ? true : false
        retorno.geraUnitariaBL = 'S' == retorno.geraUnitariaBL ? true : false
        retorno.separaPorTipoDocumento = 'S' == retorno.separaPorTipoDocumento ? true : false
        retorno.FlagCanhoto = 'S' == retorno.FlagCanhoto ? 'Sim' : 'Não'
        retorno.ConsideraAgrupa = 'S' == retorno.ConsideraAgrupa ? true : false
        retorno.NaoAgrupa = 'S' == retorno.NaoAgrupa ? true : false
        retorno.LiberacaoControladoria = 'S' == retorno.LiberacaoControladoria ? true : false
        retorno.ImprimirAutomaticamente = 'S' == retorno.ImprimirAutomaticamente ? true : false
        retorno.exigeCanhoto = 'S' == retorno.exigeCanhoto ? true : false
        retorno.flagCanhotoGravado = 'S' == retorno.flagCanhotoGravado ? true : false
        retorno.FlagNumPedidoObsFatura = 'S' == retorno.FlagNumPedidoObsFatura ? true : false
        retorno.FlagPermiteExcluir = 'S' == retorno.FlagPermiteExcluir ? true : false
        this.empty()
        this.form = retorno
      })
      this.$Spin.hide()
    },
    confirmarExclusao() {
      this.$Modal.confirm({
        title: 'Confirmar Exclusão',
        content: 'Excluir esta regra poderá gerar inconsistências no faturamento. Deseja prosseguir?',
        onOk: this.excluir
      })
    },
    excluir() {
      this.loadExcluir = true
      this.Base.get('ExcluirRegra', {
        params: {
          acordoFaturamentoId: this.form.acordoFaturamentoId,
          usuarioId: this.usuarioId
        }
      })
        .then(res => {
          this.empty()
          this.$Notice.success({
            desc: res.data
          })
          this.$router.push('/regras-faturamento')
          this.form.reset()
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
    consistir() {
      if (this.telaConsultaAcordo.ApresentarAcordoRaiz) {
        if (
          (!this.form.cliente.clienteId > 0 &&
            !this.form.grupoCliente.grupoClienteId > 0 &&
            !this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0) ||
          (this.form.cliente.clienteId > 0 &&
            this.form.grupoCliente.grupoClienteId > 0 &&
            this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha cliente ou grupo cliente ou Raiz Cliente.'
          })
          return false
        }
        if (this.form.cliente.clienteId > 0 && this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0) {
          this.$Notice.error({
            desc: 'Preencha cliente ou Raiz Cliente.'
          })
          return false
        }
        if (this.form.grupoCliente.grupoClienteId > 0 && this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent > 0) {
          this.$Notice.error({
            desc: 'Preencha grupo cliente ou Raiz Cliente.'
          })
          return false
        }
      } else {
        if (!this.form.cliente.clienteId > 0 && !this.form.grupoCliente.grupoClienteId > 0) {
          this.$Notice.error({
            desc: 'Preencha cliente ou grupo cliente.'
          })
          return false
        }
      }
      if (!this.form.TabTipoEnvioFatId > 0) {
        this.$Notice.error({
          desc: 'Preencha o Tipo Envio Faturamento.'
        })
        return false
      }
      if (!this.form.tipoClienteId > 0) {
        this.$Notice.error({
          desc: 'Preencha a Tipo Cliente.'
        })
        return false
      }
      if (!this.form.respFinanceiroId > 0) {
        this.$Notice.error({
          desc: 'Preencha a Responsável Financeiro.'
        })
        return false
      }
      if (!this.form.tabTipoFaturamentoId > 0) {
        this.$Notice.error({
          desc: 'Preencha a Regra Faturamento.'
        })
        return false
      }
      if (this.form.tabTipoFaturamentoId == 6) {
        if (!this.form.diasEmissaoNaoAgrupada > 0 || this.form.diasEmissaoNaoAgrupada == 0) {
          this.$Notice.error({
            desc: 'Preencha quantidade de dias p/ emissão.'
          })
          return false
        }
        if (
          (this.form.diasPagtoNaoAgrupada > 0 && this.form.diasPagtoUteisNaoAgrupada > 0) ||
          (this.form.diasPagtoNaoAgrupada > 0 && this.form.pagtoDiaNaoAgrupada > 0) ||
          (this.form.diasPagtoUteisNaoAgrupada > 0 && this.form.pagtoDiaNaoAgrupada > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia.'
          })
          return false
        }
        if (
          (this.form.diasPagtoNaoAgrupada == 0 &&
            this.form.diasPagtoUteisNaoAgrupada == 0 &&
            this.form.pagtoDiaNaoAgrupada == 0) ||
          (!this.form.diasPagtoNaoAgrupada > 0 &&
            !this.form.diasPagtoUteisNaoAgrupada > 0 &&
            !this.form.pagtoDiaNaoAgrupada > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 1) {
        if (!this.form.diaSemanaIdAgrupadaSemana > 0) {
          this.$Notice.error({
            desc: 'Preencha dia da semana.'
          })
          return false
        }
        if (this.form.diasPagtoAgrupadaSemana > 0 && this.form.diasPagtoUteisAgrupadaSemana > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaSemana > 0 && !this.form.diasPagtoUteisAgrupadaSemana > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 2) {
        if (
          this.form.primeiroDecendioAte - this.form.primeiroDecendioDe > 9 ||
          this.form.primeiroDecendioAte - this.form.primeiroDecendioDe < 9
        ) {
          this.$Notice.error({
            desc: 'A diferença de dias do 1º decêndio deve ser 10 dias'
          })
          return false
        }
        if (
          this.form.segundoDecendioAte - this.form.segundoDecendioDe > 9 ||
          this.form.segundoDecendioAte - this.form.segundoDecendioDe < 9
        ) {
          this.$Notice.error({
            desc: 'A diferença de dias do 2º decêndio deve ser 10 dias'
          })
          return false
        }
        if (
          this.form.terceiroDecendioAte - this.form.terceiroDecendioDe > 10 ||
          this.form.terceiroDecendioAte - this.form.terceiroDecendioDe < 9
        ) {
          this.$Notice.error({
            desc: 'A diferença de dias do 3º decêndio deve ser 10 dias'
          })
          return false
        }
        if (this.form.segundoDecendioDe < this.form.primeiroDecendioAte) {
          this.$Notice.error({
            desc: 'O 2º decêndio deve iniciar após o 1º decêndio.'
          })
          return false
        }
        if (this.form.terceiroDecendioDe < this.form.segundoDecendioAte) {
          this.$Notice.error({
            desc: 'O 3º decêndio deve iniciar após o 2º decêndio.'
          })
          return false
        }
        if (!this.form.primeiroDecendioEmissaoDia > 0 || this.form.primeiroDecendioEmissaoDia == 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão 1º decêncio.'
          })
          return false
        }
        if (!this.form.segundoDecendioEmissaoDia > 0 || this.form.segundoDecendioEmissaoDia == 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão 2º decêncio.'
          })
          return false
        }
        if (!this.form.terceiroDecendioEmissaoDia > 0 || this.form.terceiroDecendioEmissaoDia == 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão 3º decêncio.'
          })
          return false
        }
        if (
          (this.form.diasPagtoPrimeiroDecendio > 0 && this.form.diasPagtoUteisPrimeiroDecendio > 0) ||
          (this.form.diasPagtoPrimeiroDecendio > 0 && this.form.pagtoDiaPrimeiroDecendio > 0) ||
          (this.form.diasPagtoUteisPrimeiroDecendio > 0 && this.form.pagtoDiaPrimeiroDecendio > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 1º decêndio.'
          })
          return false
        }
        if (
          !this.form.diasPagtoPrimeiroDecendio > 0 &&
          !this.form.diasPagtoUteisPrimeiroDecendio > 0 &&
          !this.form.pagtoDiaPrimeiroDecendio > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 1º decêndio.'
          })
          return false
        }
        if (
          (this.form.diasPagtoSegundoDecendio > 0 && this.form.diasPagtoUteisSegundoDecendio > 0) ||
          (this.form.diasPagtoSegundoDecendio > 0 && this.form.pagtoDiaSegundoDecendio > 0) ||
          (this.form.diasPagtoUteisSegundoDecendio > 0 && this.form.pagtoDiaSegundoDecendio > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 2º decêndio.'
          })
          return false
        }
        if (
          !this.form.diasPagtoSegundoDecendio > 0 &&
          !this.form.diasPagtoUteisSegundoDecendio > 0 &&
          !this.form.pagtoDiaSegundoDecendio > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 2º decêndio.'
          })
          return false
        }
        if (
          (this.form.diasPagtoTerceiroDecendio > 0 && this.form.diasPagtoUteisTerceiroDecendio > 0) ||
          (this.form.diasPagtoTerceiroDecendio > 0 && this.form.pagtoDiaTerceiroDecendio > 0) ||
          (this.form.diasPagtoUteisTerceiroDecendio > 0 && this.form.pagtoDiaTerceiroDecendio > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 3º decêndio.'
          })
          return false
        }
        if (
          !this.form.diasPagtoTerceiroDecendio > 0 &&
          !this.form.diasPagtoUteisTerceiroDecendio > 0 &&
          !this.form.pagtoDiaTerceiroDecendio > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para o 3º decêndio.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 3) {
        if (!this.form.primeiraQuinzenaEmissaoDia > 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão 1ª quinzena.'
          })
          return false
        }
        if (
          (this.form.diasPagtoPrimeiraQuinzena > 0 && this.form.diasPagtoUteisPrimeiraQuinzena > 0) ||
          (this.form.diasPagtoPrimeiraQuinzena > 0 && this.form.pagtoDiaPrimeiraQuinzena > 0) ||
          (this.form.diasPagtoUteisPrimeiraQuinzena > 0 && this.form.pagtoDiaPrimeiraQuinzena > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para a 1ª quinzena.'
          })
          return false
        }
        if (
          !this.form.diasPagtoPrimeiraQuinzena > 0 &&
          !this.form.diasPagtoUteisPrimeiraQuinzena > 0 &&
          !this.form.pagtoDiaPrimeiraQuinzena > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para a 1ª quinzena.'
          })
          return false
        }
        if (!this.form.segundaQuinzenaEmissaoDia > 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão 2ª quinzena.'
          })
          return false
        }
        if (
          (this.form.diasPagtoSegundaQuinzena > 0 && this.form.diasPagtoUteisSegundaQuinzena > 0) ||
          (this.form.diasPagtoSegundaQuinzena > 0 && this.form.pagtoDiaSegundaQuinzena > 0) ||
          (this.form.diasPagtoUteisSegundaQuinzena > 0 && this.form.pagtoDiaSegundaQuinzena > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para a 2ª quinzena.'
          })
          return false
        }
        if (
          !this.form.diasPagtoSegundaQuinzena > 0 &&
          !this.form.diasPagtoUteisSegundaQuinzena > 0 &&
          !this.form.pagtoDiaSegundaQuinzena > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia para a 2ª quinzena.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 4) {
        if (!this.form.emissaoDiaAgrupadaMes > 0) {
          this.$Notice.error({
            desc: 'Preencha dia emissão.'
          })
          return false
        }
        if (
          (this.form.diasPagtoAgrupadaMes > 0 && this.form.diasPagtoUteisAgrupadaMes > 0) ||
          (this.form.diasPagtoAgrupadaMes > 0 && this.form.pagtoDiaAgrupadaMes > 0) ||
          (this.form.diasPagtoUteisAgrupadaMes > 0 && this.form.pagtoDiaAgrupadaMes > 0)
        ) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia.'
          })
          return false
        }
        if (
          !this.form.diasPagtoAgrupadaMes > 0 &&
          !this.form.diasPagtoUteisAgrupadaMes > 0 &&
          !this.form.pagtoDiaAgrupadaMes > 0
        ) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto - Pagto Dia.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 7) {
        if (!this.form.diasPartidaNavio > 0) {
          this.$Notice.error({
            desc: 'Preencha dias após partida navio.'
          })
          return false
        }
        if (this.form.diasPagtoAgrupadaNavio > 0 && this.form.diasPagtoUteisAgrupadaNavio > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaNavio > 0 && !this.form.diasPagtoUteisAgrupadaNavio > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 14) {
        if (this.form.diasPagtoAgrupadaContainer > 0 && this.form.diasPagtoUteisAgrupadaContainer > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaContainer > 0 && !this.form.diasPagtoUteisAgrupadaContainer > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 15) {
        if (this.form.diasPagtoAgrupadaDestinatario > 0 && this.form.diasPagtoUteisAgrupadaDestinatario > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaDestinatario > 0 && !this.form.diasPagtoUteisAgrupadaDestinatario > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 16) {
        if (this.form.diasPagtoAgrupadaPreFatura > 0 && this.form.diasPagtoUteisAgrupadaPreFatura > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaPreFatura > 0 && !this.form.diasPagtoUteisAgrupadaPreFatura > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 17) {
        if (this.form.diasPagtoAgrupadaDataEntrega > 0 && this.form.diasPagtoUteisAgrupadaDataEntrega > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaDataEntrega > 0 && !this.form.diasPagtoUteisAgrupadaDataEntrega > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      } else if (this.form.tabTipoFaturamentoId == 18) {
        if (this.form.diasPagtoAgrupadaPorto > 0 && this.form.diasPagtoUteisAgrupadaPorto > 0) {
          this.$Notice.error({
            desc: 'Preencha somente um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
        if (!this.form.diasPagtoAgrupadaPorto > 0 && !this.form.diasPagtoUteisAgrupadaPorto > 0) {
          this.$Notice.error({
            desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
          })
          return false
        }
      }
      if (!this.form.grupoRadicalCnpjIdent > 0) {
        this.form.grupoRadicalCnpjIdent = this.form.grupoRadicalCnpj.grupoRadicalCnpjIdent
      }
      if (this.form.envioAutomatico == true && this.form.TabTipoEnvioFatId == 3) {
        this.$Notice.warning({
          desc: 'Tipo Envio Faturamento não pode ser Físico.'
        })
        return false
      }
      if (
        this.form.tabTipoFaturamentoId == 19 &&
        !this.form.diasPagtoAgrupadaCanhoto > 0 &&
        !this.form.diasPagtoUteisAgrupadaCanhoto > 0
      ) {
        this.$Notice.warning({
          desc: 'Preencha ao menos um dos campos: Dias p/ Pagto - Dias Úteis p/ Pagto.'
        })
        return false
      }
      if (this.form.exigeCanhoto == true && this.form.flagCanhotoGravado == false) {
        this.$Notice.warning({
          desc: 'Preencha as configurações do Canhoto.'
        })
        return false
      }
      // if (!this.form.email) {
      if (this.form.email != '' && this.form.email != null) {
        if (!this.consistirEmail()) {
          this.$Notice.warning({
            desc: 'E-mail inválido.'
          })
          return false
        }
      }
      return true
    },
    teste(){
      console.log('Bateu caralho')
      this.Base.get('http://localhost:61190/api/cliente/GetCliente').then(response => (this.info = response))
    },
    gravar() {
      if (!this.consistir()) return
      const regraGravar = { ...this.form }
      regraGravar.envioAutomatico =
        regraGravar.envioAutomatico == true || regraGravar.envioAutomatico == 'S' ? 'S' : 'N'
      if (this.telaConsultaAcordo.FlagHabilitaTipoAgrupamentoEnvio) {
        this.telaConsultaAcordo.TiposAgrupamentoEnvio.map(item => {
          if (item.TipoAgrupamentoEnvioId == this.form.TipoAgrupamentoEnvioId) {
            regraGravar.emailAgrupado = item.emailAgrupado
          }
        })
      } else {
        regraGravar.emailAgrupado = regraGravar.emailAgrupado == true || regraGravar.emailAgrupado == 'S' ? 'S' : 'N'
      }
      regraGravar.vencimentoMesSeguinte =
        regraGravar.vencimentoMesSeguinte == true || regraGravar.vencimentoMesSeguinte == 'S' ? 'S' : 'N'
      regraGravar.calendarioVencimentos = 
        regraGravar.calendarioVencimentos == true || regraGravar.calendarioVencimentos == 'S' ? 'S' : 'N'  
      regraGravar.consideraEmissaofatura =
        regraGravar.consideraEmissaofatura == true || regraGravar.consideraEmissaofatura == 'S' ? 'S' : 'N'
      regraGravar.consideraEmissaoCte =
        regraGravar.consideraEmissaoCte == true || regraGravar.consideraEmissaoCte == 'S' ? 'S' : 'N'
      regraGravar.consideraSaidaNavio =
        regraGravar.consideraSaidaNavio == true || regraGravar.consideraSaidaNavio == 'S' ? 'S' : 'N'
      regraGravar.geraUnitariaBL = regraGravar.geraUnitariaBL == true || regraGravar.geraUnitariaBL == 'S' ? 'S' : 'N'
      regraGravar.separaPorTipoDocumento =
        regraGravar.separaPorTipoDocumento == true || regraGravar.separaPorTipoDocumento == 'S' ? 'S' : 'N'
      regraGravar.FlagCanhoto = regraGravar.FlagCanhoto == 'Sim' ? 'S' : 'N'
      regraGravar.ConsideraAgrupa =
        regraGravar.ConsideraAgrupa == true || regraGravar.ConsideraAgrupa == 'S' ? 'S' : 'N'
      regraGravar.NaoAgrupa = regraGravar.NaoAgrupa == true || regraGravar.NaoAgrupa == 'S' ? 'S' : 'N'
      regraGravar.LiberacaoControladoria =
        regraGravar.LiberacaoControladoria == true || regraGravar.LiberacaoControladoria == 'S' ? 'S' : 'N'
      regraGravar.ImprimirAutomaticamente =
        regraGravar.ImprimirAutomaticamente == true || regraGravar.ImprimirAutomaticamente == 'S' ? 'S' : 'N'
      regraGravar.exigeCanhoto = regraGravar.exigeCanhoto == true || regraGravar.exigeCanhoto == 'S' ? 'S' : 'N'
      regraGravar.FlagNumPedidoObsFatura =
        regraGravar.FlagNumPedidoObsFatura == true || regraGravar.FlagNumPedidoObsFatura == 'S' ? 'S' : 'N'
      regraGravar.usuarioId = this.usuarioId



      this.loadGravar = true
      this.Base.post('GravarRegra', regraGravar)
        .then(res => {
          if (this.form.exigeCanhoto && !(this.form.acordoFaturamentoId > 0)) {
            this.formModalCanhoto.parametrosClienteId = res.data.acordoFaturamentoId
            this.formModalCanhoto.parametrosCanhotoClienteId = 0
            this.gravarCanhoto()
          }
          this.emptyFormModalCanhoto()
          this.form.acordoFaturamentoId = res.data.acordoFaturamentoId
          this.consultarRegra()
          this.$Notice.success({
            desc: res.data.Message
          })
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
    verificaEnvioAutomatico() {
      if (this.form.email == '') {
        this.form.envioAutomatico = false
        this.form.emailAgrupado = false
        if (this.telaConsultaAcordo.FlagHabilitaTipoAgrupamentoEnvio) this.form.TipoAgrupamentoEnvioId = 1
      } else {
        this.form.envioAutomatico = true
        this.form.emailAgrupado = true
        if (this.validaAgrupamento()) this.form.TipoAgrupamentoEnvioId = 2
      }
    },
    validaAgrupamento() {
      if (
        this.form.TipoAgrupamentoEnvioId == '' ||
        this.form.TipoAgrupamentoEnvioId == 0 ||
        this.form.TipoAgrupamentoEnvioId == undefined ||
        this.form.TipoAgrupamentoEnvioId == null ||
        this.form.TipoAgrupamentoEnvioId == 1
      )
        return true
      return false
    },
    returnNumber(evt) {
      let valor = evt.target.value
      let ret = ''
      for (let i = 0; i < valor.length; i++) {
        let caract = valor.substr(i, 1)
        let charCode = valor.substr(i, 1).charCodeAt(0)
        if (charCode >= 48 && charCode <= 57) ret = ret.concat(caract)
      }
      evt.target.value = ret
    },
    verificaTipoFaturamento() {
      if (this.form.tabTipoFaturamentoId == 19) {
        this.form.exigeCanhoto = true
      }
      if (this.form.acordoFaturamentoId > 0) return
      switch (this.form.tabTipoFaturamentoId) {
        case 16: //Faturar por Pré-Fatura
          if (this.form.operacao == 'Nacional') this.form.diasPagtoAgrupadaPreFatura = this.DiasPagamentoNacional
          else this.form.diasPagtoAgrupadaPreFatura = this.DiasPagamentoInternacional
          break
        case 18: //Faturar por Porto de Origem e Destino
          if (this.form.operacao == 'Nacional') this.form.diasPagtoAgrupadaPorto = this.DiasPagamentoNacional
          else this.form.diasPagtoAgrupadaPorto = this.DiasPagamentoInternacional
          break
        case 15: //Faturar por Destinatário
          if (this.form.operacao == 'Nacional') this.form.diasPagtoAgrupadaDestinatario = this.DiasPagamentoNacional
          else this.form.diasPagtoAgrupadaDestinatario = this.DiasPagamentoInternacional
          break
        case 17: //Faturar por Data de Entrega
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaDataEntrega = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaDataEntrega = this.DiasPagamentoInternacional
          }
          break
        case 14: //Faturar por Container
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaContainer = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaContainer = this.DiasPagamentoInternacional
          }
          break
        case 19: //Faturar por Canhoto
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaCanhoto = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaCanhoto = this.DiasPagamentoInternacional
          }
          break
        case 6: //Fatura não Agrupada
          this.form.diasEmissaoNaoAgrupada = 1
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoNaoAgrupada = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoNaoAgrupada = this.DiasPagamentoInternacional
          }
          break
        case 1: //Fatura Agrupada por Semana
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaSemana = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaSemana = this.DiasPagamentoInternacional
          }
          break
        case 3: //Fatura Agrupada por Quinzena
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoPrimeiraQuinzena = this.DiasPagamentoNacional
            this.form.diasPagtoSegundaQuinzena = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoPrimeiraQuinzena = this.DiasPagamentoInternacional
            this.form.diasPagtoSegundaQuinzena = this.DiasPagamentoInternacional
          }
          break
        case 7: //Fatura Agrupada por Navio
          this.form.diasPartidaNavio = 1
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaNavio = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaNavio = this.DiasPagamentoInternacional
          }
          break
        case 4: //Fatura Agrupada por Mês
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoAgrupadaMes = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoAgrupadaMes = this.DiasPagamentoInternacional
          }
          break
        case 2: //Fatura Agrupada por Decêndio
          if (this.form.operacao == 'Nacional') {
            this.form.diasPagtoPrimeiroDecendio = this.DiasPagamentoNacional
            this.form.diasPagtoSegundoDecendio = this.DiasPagamentoNacional
            this.form.diasPagtoTerceiroDecendio = this.DiasPagamentoNacional
          } else {
            this.form.diasPagtoPrimeiroDecendio = this.DiasPagamentoInternacional
            this.form.diasPagtoSegundoDecendio = this.DiasPagamentoInternacional
            this.form.diasPagtoTerceiroDecendio = this.DiasPagamentoInternacional
          }
          break
        default:
          break
      }
    },
    consistirEmail() {
      let listaEmails = this.form.email.split(';')
      for (let i = 0; i < listaEmails.length; i++) {
        if (!this.validarEmail(listaEmails[i])) {
          i = listaEmails.length
          return false
        }
      }
      return true
    },
    validarEmail(email) {
      const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      return emailReg.test(email)
    },
    formatarMultiplasDatas(data){
      const [year, month, day] = data.split('-')
      return `${day}/${month}/${year}`
    },
    empty() {
      Object.keys(this.form).map(item => {
        if (item != 'cliente' && item != 'grupoCliente') this.form[item] = ''
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
      this.form.operacao = 'Nacional'
      this.form.envioAutomatico = false
      this.form.emailAgrupado = false
      this.form.consideraEmissaofatura = false
      this.form.consideraEmissaoCte = false
      this.form.consideraSaidaNavio = false
      this.form.geraUnitariaBL = false
      this.form.separaPorTipoDocumento = false
      this.form.vencimentoMesSeguinte = false
      this.form.calendarioVencimentos = false
      this.form.percAjusteTaxaPTAX = '0,00'
      this.form.tabTipoFaturamentoId = 0
      this.form.respFinanceiroId = 0
      this.form.tipoClienteId = 0
      this.form.ExcecaoRegraRaiz = []
      this.form.grupoRadicalCnpjIdent = 0
      this.form.grupoRadicalCnpj = {}
      this.form.dataInclusao = ''
      this.form.TabTipoEnvioFatId = 0
      this.form.usuarioInclusao = ''
      this.form.dataAlteracao = ''
      this.form.usuarioAlteracao = ''
      this.form.FlagCanhoto = 'Não'
      this.form.CondicaoCanhotoId = 0
      this.form.TipoAgrupamentoEnvioId = 1
      this.form.EmailCanhoto = ''
      this.form.acordoFaturamentoId = 0
      this.DiasPagamentoInternacional = 0
      this.DiasPagamentoNacional = 0
      //variaveis de dias de acordo
      this.form.diasEmissaoNaoAgrupada = ''
      this.form.diasPagtoNaoAgrupada = ''
      this.form.diasPagtoUteisNaoAgrupada = ''
      this.form.pagtoDiaNaoAgrupada = ''
      this.form.diaSemanaIdAgrupadaSemana = ''
      this.form.diasPagtoAgrupadaSemana = ''
      this.form.diasPagtoUteisAgrupadaSemana = ''
      this.form.primeiroDecendioDe = ''
      this.form.primeiroDecendioAte = ''
      this.form.primeiroDecendioEmissaoDia = ''
      this.form.diasPagtoPrimeiroDecendio = ''
      this.form.diasPagtoUteisPrimeiroDecendio = ''
      this.form.pagtoDiaPrimeiroDecendio = ''
      this.form.segundoDecendioDe = ''
      this.form.segundoDecendioAte = ''
      this.form.segundoDecendioEmissaoDia = ''
      this.form.diasPagtoSegundoDecendio = ''
      this.form.diasPagtoUteisSegundoDecendio = ''
      this.form.pagtoDiaSegundoDecendio = ''
      this.form.terceiroDecendioDe = ''
      this.form.terceiroDecendioAte = ''
      this.form.terceiroDecendioEmissaoDia = ''
      this.form.diasPagtoTerceiroDecendio = ''
      this.form.diasPagtoUteisTerceiroDecendio = ''
      this.form.pagtoDiaTerceiroDecendio = ''
      this.form.primeiraQuinzenaEmissaoDia = ''
      this.form.diasPagtoPrimeiraQuinzena = ''
      this.form.diasPagtoUteisPrimeiraQuinzena = ''
      this.form.pagtoDiaPrimeiraQuinzena = ''
      this.form.segundaQuinzenaEmissaoDia = ''
      this.form.diasPagtoSegundaQuinzena = ''
      this.form.diasPagtoUteisSegundaQuinzena = ''
      this.form.pagtoDiaSegundaQuinzena = ''
      this.form.emissaoDiaAgrupadaMes = ''
      this.form.diasPagtoAgrupadaMes = ''
      this.form.diasPagtoUteisAgrupadaMes = ''
      this.form.pagtoDiaAgrupadaMes = ''
      this.form.diasPartidaNavio = ''
      this.form.diasPagtoAgrupadaNavio = ''
      this.form.diasPagtoUteisAgrupadaNavio = ''
      this.form.diasPagtoAgrupadaContainer = ''
      this.form.diasPagtoUteisAgrupadaContainer = ''
      this.form.diasPagtoAgrupadaDestinatario = ''
      this.form.diasPagtoUteisAgrupadaDestinatario = ''
      this.form.diasPagtoAgrupadaPreFatura = ''
      this.form.diasPagtoUteisAgrupadaPreFatura = ''
      this.form.diasPagtoAgrupadaDataEntrega = ''
      this.form.diasPagtoUteisAgrupadaDataEntrega = ''
      this.form.diasPagtoAgrupadaPorto = ''
      this.form.diasPagtoUteisAgrupadaPorto = ''
      this.form.diasPagtoAgrupadaCanhoto = ''
      this.form.diasPagtoUteisAgrupadaCanhoto = ''
      this.form.EnderecoCanhoto = ''
      this.form.ConsideraAgrupa = false
      this.form.NaoAgrupa = false
      this.form.LiberacaoControladoria = false
      this.form.ImprimirAutomaticamente = false
      this.form.QtdParcelas = ''
      this.form.VencimentoParc1 = ''
      this.form.VencimentoParc2 = ''
      this.form.VencimentoParc3 = ''
      this.$router.push('/regras-faturamento')
      this.form.exigeCanhoto = false
      this.form.flagCanhotoGravado = false
      this.form.FlagNumPedidoObsFatura = false
      this.form.FlagPermiteExcluir = false
      this.form.DataVencto = []
      this.emptyFormModalCanhoto()
    },
    emptyFormModalCanhoto() {
      this.setformModalCanhoto({
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
      })
    },
    ...mapActions(['setformModalCanhoto'])
  },
  watch: {
    'form.cliente.tipoClienteId': function(val) {
      if (this.form.tipoClienteId == '' || this.form.tipoClienteId == 0 || this.form.tipoClienteId == undefined)
        this.form.tipoClienteId = val
    },
    'form.cliente.respFinanceiroId': function(val) {
      if (
        this.form.respFinanceiroId == '' ||
        this.form.respFinanceiroId == 0 ||
        this.form.respFinanceiroId == undefined
      )
        this.form.respFinanceiroId = val
    },
    'form.grupoRadicalCnpj.tipoClienteId': function(val) {
      if (this.form.tipoClienteId == '' || this.form.tipoClienteId == 0 || this.form.tipoClienteId == undefined)
        this.form.tipoClienteId = val
    },
    'form.grupoRadicalCnpj.respFinanceiroId': function(val) {
      if (
        this.form.respFinanceiroId == '' ||
        this.form.respFinanceiroId == 0 ||
        this.form.respFinanceiroId == undefined
      )
        this.form.respFinanceiroId = val
    },
    'form.grupoRadicalCnpj.DiasPagamentoInternacional': function(val) {
      if (val > 0) this.DiasPagamentoInternacional = val
    },
    'form.grupoRadicalCnpj.DiasPagamentoNacional': function(val) {
      if (val > 0) this.DiasPagamentoNacional = val
    },
    'form.cliente.DiasPagamentoInternacional': function(val) {
      if (val > 0) this.DiasPagamentoInternacional = val
    },
    'form.cliente.DiasPagamentoNacional': function(val) {
      if (val > 0) this.DiasPagamentoNacional = val
    }
  }
}
</script>

<style scoped>
.top-checkbox {
  padding-top: 5px;
}
.top-col {
  padding-top: 18px;
}
</style>
