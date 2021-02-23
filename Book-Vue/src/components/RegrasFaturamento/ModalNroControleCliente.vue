<template>
  <div>
    <Modal v-model="abrirModal" width="1300" @on-visible-change="fechaModal($event)">
      <div slot="header">
        <p style="text-align:center;font-size:18px;">
          <span>Número de Controle do Cliente</span>
        </p>
      </div>
      <Row :gutter="12">
        <Col span="6">
          <Input v-if="nomeFantasia" id="txtNome" v-model="nomeFantasia" placeholder="Nome" readonly />
          <Input v-else id="txtNome" v-model="nomeRadical" placeholder="Nome" readonly />
        </Col>
        <Col span="3">
          <Input id="txtCnpjCuit" v-model="cnpjCpf" placeholder="CNPJ-CUIT" readonly />
        </Col>
        <Col span="3">
          <Input id="txtGrupoRaizCnpj" v-model="radicalCnpj" placeholder="Grupo Raiz CNPJ" readonly />
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="6" class="title">
          <strong>Regra de Gravação</strong>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="12" style="text-align: center;">
          <strong>Regra para Número de Controle</strong>
        </Col>
        <Col span="12" style="text-align: center;">
          <strong>Regra para XML</strong>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="1" style="height: 120px;">
          &nbsp;
        </Col>
        <Col span="5" style="height: 120px;">
          <Radio-group v-model="formItem.radioObrigatorio">
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="S">
                <span>Obrigatório</span>
              </Radio>
            </Row>
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="V">
                <span>Obrigatório somente com tipo de venda</span>
              </Radio>
            </Row>
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="N">
                <span>Opcional</span>
              </Radio>
            </Row>
          </Radio-group>
        </Col>
        <Col span="4" style="height: 120px;">
          <Row type="flex" align="middle" style="height: 40px;">&nbsp;</Row>
          <Row type="flex" align="middle" style="height: 40px;">
            <Select v-if="formItem.radioObrigatorio !== 'V'" v-model="formItem.tipoVenda">
              <Option
                v-for="item in telaConsultaAcordo.tipoVenda"
                id="txtTipoVenda"
                :key="item.DescTipoVenda"
                :value="''"
                placeholder="Tipo de Venda"
                disabled
                >{{ item.DescTipoVenda }}
              </Option>
            </Select>
            <Select v-else v-model="formItem.tipoVenda">
              <Option
                v-for="item in telaConsultaAcordo.tipoVenda"
                id="txtTipoVenda"
                :key="item.DescTipoVenda"
                :value="item.TabTipoVendaId"
                placeholder="Tipo de Venda"
                >{{ item.DescTipoVenda }}
              </Option>
            </Select>
          </Row>
          <Row type="flex" align="middle" style="height: 40px;">&nbsp;</Row>
        </Col>
        <Col span="3" style="height: 120px;">
          &nbsp;
        </Col>
        <Col span="3" style="height: 120px;">
          <Radio-group v-model="formItem.radioCte">
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="O">
                <span>xObs do Ct-e</span>
              </Radio>
            </Row>
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="C">
                <span>Obscont do CT-e</span>
              </Radio>
            </Row>
            <Row type="flex" align="middle" style="height: 40px;">
              <Radio label="N">
                <span>Não se Aplica</span>
              </Radio>
            </Row>
          </Radio-group>
        </Col>
        <Col span="4" style="height: 120px;">
          <Row type="flex" align="middle" style="height: 40px;">
            <Input
              v-if="formItem.radioCte !== 'O'"
              id="txtDefinirNome"
              :value="''"
              placeholder="Definir nome"
              disabled
            />
            <Input v-else id="txtDefinirNome" v-model="formItem.definirNome" placeholder="Definir nome" clearable />
          </Row>
          <Row type="flex" align="middle" style="height: 40px;">
            <Input v-if="formItem.radioCte !== 'C'" id="txtCampoxNome" :value="''" placeholder="Campo xNome" disabled />
            <Input v-else id="txtCampoxNome" v-model="formItem.campoxNome" placeholder="Campo xNome" clearable />
          </Row>
          <Row style="height: 40px;">&nbsp;</Row>
        </Col>
      </Row>

      <Row class="top bottom">
        <Col span="24" class="center-botoes">
          <Button
            v-if="editaRegra !== 'S'"
            type="primary"
            class="margem-botoes"
            :loading="loadGrava"
            :disabled="formItem.nroControleClienteId < 0 || formItem.nroControleClienteId > 5"
            @click="regraGravacaoCliente()"
          >
            <span v-if="!loadGrava">Gravar</span>
            <span v-else>Gravando...</span>
          </Button>
          <Button
            v-else-if="editaRegra === 'S'"
            type="primary"
            class="margem-botoes"
            :loading="loadGrava"
            @click="regraGravacaoCliente()"
          >
            <span v-if="!loadGrava">Editar</span>
            <span v-else>Editando...</span>
          </Button>
          <Button v-else class="margem-botoes" disabled><span>Gravar</span></Button>
          <Button id="btn-Limpar" class="margem-botoes" @click="empty()">Limpar</Button>
          <Button id="btn-Fechar" class="margem-botoes" @click="fechaModal($event)">Fechar</Button>
        </Col>
      </Row>

      <Row :gutter="12" class="top">
        <Col span="6" class="title">
          <strong>Regras Cadastradas</strong>
        </Col>
      </Row>

      <Table
        ref="selection"
        :columns="headerRegraCadastrada"
        :data="listaRegra"
        size="small"
        no-data-text="Nenhuma regra cadastrada"
        :loading="loadTable"
        @on-row-click="selecionaRegraGravacao"
      ></Table>

      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['open', 'acordoFaturamentoId', 'nomeFantasia', 'cnpjCpf', 'radicalCnpj', 'nomeRadical'],
  data() {
    return {
      formItem: {
        regraNfNumRefId: 0,
        parametrosClienteId: 0,
        nroControleClienteId: 0,
        radioObrigatorio: '',
        radioCte: '',
        tipoVenda: '',
        definirNome: '',
        campoxNome: '',
        campoBaseId: 0
      },
      array: [],
      listaRegra: [],
      listaCampoBase: [],
      headerRegraCadastrada: [
        {
          title: 'Nº Controle do Cliente',
          key: 'NroControleClienteId'
        },
        {
          title: 'Regras de Gravação',
          key: 'TxtRadioObrigatorio'
        },
        {
          title: 'Regras Geração XML/ CT-e',
          key: 'TxtRadioCte'
        }
      ],
      nroControleClienteId: 0,
      loadGrava: false,
      loadTable: false,
      desc: '',
      editaRegra: ''
    }
  },
  computed: {
    abrirModal: {
      get: function() {
        return this.open
      },
      set: function() {}
    },
    ...mapGetters(['telaConsultaAcordo', 'usuarioId'])
  },
  watch: {
    async open() {
      if (this.open) {
        this.formItem.parametrosClienteId = this.acordoFaturamentoId
        await this.buscaCampoBase()
        await this.buscaRegraGravacao()
        this.loadGrava = false
      }
    }
  },
  created() {
    this.$bus.$once('carregarNroControleCliente', () => {})
  },
  methods: {
    fechaModal(evt) {
      if (evt != true) {
        this.empty()
        this.$emit('close', '')
      }
    },
    empty() {
      this.formItem.regraNfNumRefId = ''
      this.formItem.radioObrigatorio = ''
      this.formItem.radioCte = ''
      this.formItem.tipoVenda = ''
      this.formItem.definirNome = ''
      this.formItem.campoxNome = ''
      this.editaRegra = ''
    },
    consistir() {
      if (!(this.formItem.radioObrigatorio != '')) {
        this.$Notice.warning({
          desc: 'Selecione a obrigatoriedade da regra.'
        })
        return false
      }
      if (this.formItem.radioObrigatorio == 'V') {
        if (!(this.formItem.tipoVenda != '')) {
          this.$Notice.warning({
            desc: 'Informe o tipo de venda.'
          })
          return false
        }
      }
      if (!(this.formItem.radioCte != '')) {
        this.$Notice.warning({
          desc: 'Selecione a regra para o XML.'
        })
        return false
      }
      if (this.formItem.radioCte == 'O') {
        this.formItem.campoxNome = ''
        if (!(this.formItem.definirNome != '')) {
          this.$Notice.warning({
            desc: 'Preencha: Definir nome, para xObs do Ct-e.'
          })
          return false
        }
      }
      if (this.formItem.radioCte == 'C') {
        this.formItem.definirNome = ''
        if (!(this.formItem.campoxNome != '')) {
          this.$Notice.warning({
            desc: 'Preencha: Campo xNome, para Obscont do Ct-e.'
          })
          return false
        }
      }
      this.loadGrava = true
      return true
    },
    async regraGravacaoCliente() {
      if (!this.consistir()) return
      try {
        const res = await this.Base.post('RegraGravacaoCliente', this.formItem)

        this.$Notice.success({
          desc: res.data
        })
      } catch (err) {
        this.$Notice.error({
          desc: err.message || err.data.message
        })
      } finally {
        this.loadGrava = false
        this.buscaRegraGravacao()
        this.empty()
      }
    },
    selecionaRegraGravacao(row) {
      this.formItem.regraNfNumRefId = row.RegraNfNumRefId
      this.formItem.nroControleClienteId = row.NroControleClienteId
      this.formItem.campoBaseId = row.CampoBaseId
      this.formItem.radioObrigatorio = row.RadioObrigatorio
      this.formItem.tipoVenda = row.TipoVenda
      this.formItem.radioCte = row.RadioCte
      this.formItem.definirNome = row.DefinirNome
      this.formItem.campoxNome = row.CampoxNome
      this.editaRegra = 'S'
    },
    async buscaRegraGravacao() {
      this.loadTable = true
      if (this.formItem.parametrosClienteId > 0) {
        try {
          const res = await this.Base.get('BuscaRegraGravacao', {
            params: {
              parametrosClienteId: this.formItem.parametrosClienteId
            }
          })

          this.listaRegra = res.data

          if (this.listaRegra.length) {
            var indice = this.listaRegra
              .map(x => x.NroControleClienteId)
              .reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0)
            this.formItem.campoBaseId = this.listaCampoBase[this.listaRegra[indice].NroControleClienteId]
            this.formItem.nroControleClienteId = this.listaRegra[indice].NroControleClienteId + 1
          }
        } catch (err) {
          this.$Notice.error({
            desc: err.message || err.data.message
          })
        } finally {
          this.loadTable = false
          if (this.formItem.nroControleClienteId == 0) this.formItem.nroControleClienteId = 1
          if (this.formItem.campoBaseId == 0) this.formItem.campoBaseId = this.listaCampoBase[0]
        }
      }
    },
    async buscaCampoBase() {
      if (this.formItem.parametrosClienteId > 0) {
        try {
          const res = await this.Base.get('BuscaCampoBase')

          this.listaCampoBase = res.data
        } catch (err) {
          this.$Notice.error({
            desc: err.message || err.data.message
          })
        }
      }
    }
  }
}
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
