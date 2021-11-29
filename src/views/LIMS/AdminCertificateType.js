import React, { Component } from "react";
import {
  CCard,
  CCardBody,
  CDataTable,
  CModal,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
  CForm,
  CFormGroup,
  CValidFeedback,
  CInvalidFeedback,
  CLabel,
  CInput,
  CRow,
  CCol,
  CSelect,
} from "@coreui/react";

import Select from "react-select";
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

const axios = require("axios");
const Config = require("../../Config.js");

export default class AdminCertificateType extends Component {
  constructor(props) {
    super(props);
    this.getAllCertificateTypes = this.getAllCertificateTypes.bind(this);
    this.deleteCertificateType = this.deleteCertificateType.bind(this);
    this.createCertificateType = this.createCertificateType.bind(this);
    this.updateCertificateType = this.updateCertificateType.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);

    this.state = {
      materialsData: [],
      clientsData: [],
      certificateTypesData: [],
      packingsdata: [],
      objectivesData: [],
      analysisTypesData: [],
      unitsData: [],
      export_all_data: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      material: '',
      client: '',
      certificateType_id: '',
      certificateType: '',
      packing: '',
      analysises: [],
      _analysises: [],
      remark: "",
      _create: false,
      double_error: "",
      analysisOption: [],
      analysisOpt: [],
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        { key: 'certificateType_id', label: props.language_data.filter(item => item.label === 'certificate_type_id')[0][props.selected_language] },
        { key: 'material', sorter: false, label: props.language_data.filter(item => item.label === 'material')[0][props.selected_language] },
        { key: 'certificateType', label: props.language_data.filter(item => item.label === 'certificate_type')[0][props.selected_language] },
        { key: 'packing', label: props.language_data.filter(item => item.label === 'packing_type')[0][props.selected_language] },
        { key: 'analysises', sorter: false, label: props.language_data.filter(item => item.label === 'analysistype_objectives')[0][props.selected_language] },
        { key: 'remark', sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: 'buttonGroups', label: '', _style: { width: '84px' } },
      ],
      header: [
        { key: 'certificateType_id', label: props.language_data.filter(item => item.label === 'certificate_type_id')[0][props.selected_language] },
        { key: 'material', label: props.language_data.filter(item => item.label === 'material')[0][props.selected_language] },
        { key: 'certificateType', label: props.language_data.filter(item => item.label === 'certificate_type')[0][props.selected_language] },
        { key: 'packing', label: props.language_data.filter(item => item.label === 'packing_type')[0][props.selected_language] },
        { key: 'analysises', label: props.language_data.filter(item => item.label === 'analysistype_objectives')[0][props.selected_language] },
        { key: 'remark', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
      ],
    };
  }

  componentDidMount() {
    this.getAllCertificateTypes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language != this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          { key: 'certificateType_id', label: nextProps.language_data.filter(item => item.label === 'certificate_type_id')[0][nextProps.selected_language] },
          { key: 'material', sorter: false, label: nextProps.language_data.filter(item => item.label === 'material')[0][nextProps.selected_language] },
          { key: 'certificateType', label: nextProps.language_data.filter(item => item.label === 'certificate_type')[0][nextProps.selected_language] },
          { key: 'packing', label: nextProps.language_data.filter(item => item.label === 'packing_type')[0][nextProps.selected_language] },
          { key: 'analysises', sorter: false, label: nextProps.language_data.filter(item => item.label === 'analysistype_objectives')[0][nextProps.selected_language] },
          { key: 'remark', sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: 'buttonGroups', label: '', _style: { width: '84px' } },
        ],
        header: [
          { key: 'certificateType_id', label: nextProps.language_data.filter(item => item.label === 'certificate_type_id')[0][nextProps.selected_language] },
          { key: 'material', label: nextProps.language_data.filter(item => item.label === 'material')[0][nextProps.selected_language] },
          { key: 'certificateType', label: nextProps.language_data.filter(item => item.label === 'certificate_type')[0][nextProps.selected_language] },
          { key: 'packing', label: nextProps.language_data.filter(item => item.label === 'packing_type')[0][nextProps.selected_language] },
          { key: 'analysises', label: nextProps.language_data.filter(item => item.label === 'analysistype_objectives')[0][nextProps.selected_language] },
          { key: 'remark', label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
        ],
      })
    }
  }

  async on_export_clicked() {
    await this.csvLink.link.click();
  }

  async handleFiles(files) {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    const result = await new Promise((resolve, reject) => {
      reader.onload = function (e) {
        resolve(reader.result);
      }
    })
    axios.post(Config.ServerUri + '/upload_certificatetype_csv', {
      data: result
    })
      .then((res) => {
        this.setState({ certificateTypesData: res.data });
        toast.success('Certificate Type CSV file successfully imported');
      });
  }

  getAnalysises(analysises, material, client) {
    if (analysises === "" || analysises === undefined) return "";

    var returnVal = "";
    analysises.map((item, index) => {
      var label = this.getAnalysisName(item.id);
      if (label !== '') {
        item.objectives.map((item0) => {
          var subLabel = this.getObjectiveName(item0.id);
          var subUnit = this.getUnitName(item0.unit);

          if (subLabel !== '' && subUnit !== '')
            returnVal = returnVal + label + ' - ' + subLabel + ' ' + subUnit + ' ' + this.getMaterialMinMax(material, item0.id, item0.unit, client) + '\n';
          return true;
        });
      }
      return true;
    });
    return returnVal;
  }

  getMaterial(material, client) {
    return this.getMaterialName(material) + " - " + this.getClientName(client);
  }

  getPacking(packing) {
    return this.getPackingName(packing);
  }

  handleMaterialInputChange = (e) => {
    var option = [];
    this.state.materialsData.map((item) => {
      if (item._id == e.target.value) {
        this.setState({ analysisOption: item.aTypesValues });
        if (this.state.client === "") {
          item.aTypesValues.map((temp) => {
            if (temp.client === "") {
              option.push({ label: temp.label, value: temp.value });
            }
          });
        }
      }
    });

    this.setState({ [e.target.name]: e.target.value, analysisOpt: option });
    this.setState({ client: "", analysises: [], _analysises: [] });
  };

  handleClientInputChange = (e) => {
    var option = [];
    this.state.analysisOption.map((item) => {
      if (item.client === e.target.value) {
        option.push({ label: item.label, value: item.value });
      }
    });
    this.setState({ [e.target.name]: e.target.value, analysisOpt: option });
    this.setState({ analysises: [], _analysises: [] });
  };

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    /*if (name === 'certificateType') {
      var found = false;
      for (var i in this.state.certificateTypesData) {
        var item = this.state.certificateTypesData[i];
        if (item.certificateType === value && item._id !== this.state.current_id) {
          found = true;
          break;
        }
      }

      if (found === true) {
        this.setState({double_error: 'Value already exists'});
      }
      else this.setState({double_error: ''});
    }*/
    // if (name === 'material')
    //   this.setState({client: '', analysises: [], _analysises: []});
    // if (name === 'client')
    //   this.setState({analysises: [], _analysises: []});

    this.setState({
      [name]: value,
    });
  }

  getObjectivesValue(id) {
    var values = this.state.analysises;
    var retVal = { id: id, objectives: [] };
    for (var i = 0; i < values.length; i++) {
      if (values[i].id === id) {
        retVal = values[i];
        break;
      }
    }

    return retVal;
  }

  handleMultiSelectChange(e) {
    var analysises = [];
    e.map((item) => {
      analysises.push(this.getObjectivesValue(item.value));
      return true;
    });

    this.setState({ analysises: analysises, _analysises: e });
  }

  handleSubMultiSelectChange(e, index) {
    var analysises = this.state.analysises;

    var objectives = [];
    e.map((item) => {
      var ids = item.value.split("-");
      objectives.push({ id: ids[0], unit: ids[1] });
      return true;
    });
    analysises[index].objectives = objectives;

    this.setState({ analysises: analysises });
  }

  getObjectiveName(id) {
    var objectives = this.state.objectivesData;
    for (var i = 0; i < objectives.length; i++) {
      if (objectives[i]._id === id) return objectives[i].objective;
    }
    return "";
  }

  getAnalysisName(id) {
    var analysises = this.state.analysisTypesData;
    for (var i = 0; i < analysises.length; i++) {
      if (analysises[i]._id === id) return analysises[i].analysisType;
    }
    return "";
  }

  getClientName(id) {
    if (id === "") return "Default";
    var clients = this.state.clientsData;
    for (var i = 0; i < clients.length; i++) {
      if (clients[i]._id === id) {
        return clients[i].name;
      }
    }
    return "";
  }

  getMaterialName(id) {
    var materials = this.state.materialsData;
    for (var i = 0; i < materials.length; i++) {
      if (materials[i]._id === id) return materials[i].material;
    }
    return "";
  }

  getPackingName(id) {
    var packings = this.state.packingsData;
    for (var i = 0; i < packings.length; i++) {
      if (packings[i]._id === id) return packings[i].packingType;
    }
    return "";
  }

  getUnitName(id) {
    var units = this.state.unitsData;
    for (var i = 0; i < units.length; i++) {
      if (units[i]._id === id) return units[i].unit;
    }
    return "";
  }

  getAnalysisObjectives(id) {
    var analysises = this.state.analysisTypesData;
    for (var i = 0; i < analysises.length; i++) {
      if (analysises[i]._id === id) return analysises[i].objectives;
    }
    return "";
  }

  getMaterialClients() {
    var clients = [];
    var material = null;
    for (var i in this.state.materialsData) {
      if (this.state.materialsData[i]._id === this.state.material) {
        material = this.state.materialsData[i];
        break;
      }
    }
    if (material !== null) {
      material.clients.map((item) => {
        var name = this.getClientName(item);
        if (name !== "") clients.push({ id: item, name: name });
        return true;
      });
    }

    return clients;
  }

  getMaterialMinMax(id /*material*/, objective, unit, client) {
    for (var i in this.state.materialsData) {
      var material = this.state.materialsData[i];
      if (material._id === id) {
        for (var j in material.objectiveValues) {
          var item = material.objectiveValues[j];
          if (
            item.id === objective &&
            item.unit === unit &&
            item.client === client
          ) {
            return "[" + item.min + "-" + item.max + "]";
          }
        }
        break;
      }
    }
    return "[]";
  }

  getValidMaterialObjs() {
    var objs = [];
    var material = null;
    for (var i in this.state.materialsData) {
      if (this.state.materialsData[i]._id === this.state.material) {
        material = this.state.materialsData[i];
        break;
      }
    }
    if (material !== null) {
      material.objectiveValues.map((item) => {
        if (item.client === this.state.client) objs.push(item);
        return true;
      });
    }

    return objs;
  }

  isValidMaterialObj(validObjs, client, analysis, objective, unit) {
    for (var i in validObjs) {
      if (
        validObjs[i].client === client &&
        validObjs[i].analysis === analysis &&
        validObjs[i].unit === unit &&
        validObjs[i].id === objective
      )
        return true;
    }
    return false;
  }

  isValidMaterialObj_value(validObjs, objective, unit) {
    for (var i in validObjs) {
      if (validObjs[i].unit === unit && validObjs[i].id === objective)
        return true;
    }
    return false;
  }

  renderModalCreate() {
    if (this.state.modal_create === false) return <div></div>;

    // var options = [];
    // this.state.analysisTypesData.map((item) => {
    //   options.push({label: item.analysisType, value: item._id});
    //   return true;
    // })

    var clientOptions = this.getMaterialClients();
    var validObjs = this.getValidMaterialObjs();
    var data = this.state.analysisOpt;
    var anaysis_option = Array.from(
      data.reduce((a, o) => a.set(`${o.value}`, o), new Map()).values()
    );

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state._create === true
                ? this.createCertificateType
                : this.updateCertificateType
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: '500' }}>CertificateType ID</CLabel>
              <CInput name="certificateType_id" value={this.state.certificateType_id} onChange={this.handleInputChange} required />
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">Input provided</CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: '500' }}>Materials</CLabel>
              <CSelect custom name="material" value={this.state.material} onChange={this.handleMaterialInputChange} required >
                <option value="" disabled></option>
                {this.state.materialsData.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.material}
                    </option>
                  );
                })}
              </CSelect>
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Clients</CLabel>
              <CSelect
                custom
                name="client"
                value={this.state.client}
                onChange={this.handleClientInputChange}
              >
                <option value="">Default</option>
                {clientOptions.map((item, i) => {
                  return (
                    <option key={i} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Packing Type</CLabel>
              <CSelect
                custom
                name="packing"
                value={this.state.packing}
                onChange={this.handleInputChange}
                required
              >
                <option value="" disabled></option>
                {this.state.packingsData.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.packingType}
                    </option>
                  );
                })}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>CertificateType</CLabel>
              <CInput
                name="certificateType"
                value={this.state.certificateType}
                onChange={this.handleInputChange}
                required
              />
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CRow>
                <CCol md="2">
                  <CLabel style={{ fontWeight: "500" }}>Analysis Types</CLabel>
                </CCol>
                <CCol md="10">
                  <CFormGroup>
                    <CRow>
                      <CCol>
                        <Select
                          isMulti
                          placeholder=""
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              boxShadow: state.isFocused
                                ? "0 0 0 0.2rem rgba(46, 184, 92, 0.25)"
                                : 0,
                              borderColor: "#2eb85c",
                              "&:hover": {
                                borderColor: "#2eb85c",
                              },
                            }),
                          }}
                          options={anaysis_option}
                          onChange={(e) => this.handleMultiSelectChange(e)}
                          value={this.state._analysises}
                        />
                      </CCol>
                    </CRow>
                  </CFormGroup>
                  {this.state._analysises.map((item, index) => {
                    var label = item.label;

                    var analysisObjs = this.getAnalysisObjectives(item.value);
                    var subOptions = []; // options for analysisType->objective multi-select
                    analysisObjs.map((item0) => {
                      var label = this.getObjectiveName(item0.id);
                      var unit = this.getUnitName(item0.unit);
                      if (
                        label !== "" &&
                        unit !== "" &&
                        this.isValidMaterialObj(
                          validObjs,
                          this.state.client,
                          item.value,
                          item0.id,
                          item0.unit
                        )
                      )
                        subOptions.push({
                          label: label + " " + unit,
                          value: item0.id + "-" + item0.unit,
                        });
                      return true;
                    });

                    var objs = this.state.analysises[index].objectives;
                    var _objs = []; // values for analysisType->objective
                    objs.map((item0) => {
                      var label = this.getObjectiveName(item0.id);
                      var unit = this.getUnitName(item0.unit);
                      if (
                        label !== "" &&
                        unit !== "" &&
                        this.isValidMaterialObj_value(
                          validObjs,
                          item0.id,
                          item0.unit
                        )
                      ) {
                        _objs.push({
                          label: label + " " + unit,
                          value: item0.id + "-" + item0.unit,
                        });
                      }
                      return true;
                    });

                    if (label !== "") {
                      return (
                        <CFormGroup key={index}>
                          <CRow>
                            <CCol md="2">{label}</CCol>
                            <CCol md="10">
                              <Select
                                isMulti
                                placeholder=""
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    boxShadow: state.isFocused
                                      ? "0 0 0 0.2rem rgba(46, 184, 92, 0.25)"
                                      : 0,
                                    borderColor: "#2eb85c",
                                    "&:hover": {
                                      borderColor: "#2eb85c",
                                    },
                                  }),
                                }}
                                options={subOptions}
                                onChange={(e) =>
                                  this.handleSubMultiSelectChange(e, index)
                                }
                                value={_objs}
                              />
                            </CCol>
                          </CRow>
                        </CFormGroup>
                      );
                    }
                    return false;
                  })}
                </CCol>
              </CRow>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Remark</CLabel>
              <CInput
                name="remark"
                value={this.state.remark}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <div className="float-right">
              <CButton type="submit" color="info">
                {this.state._create === true ? "Create" : "Update"}
              </CButton>
              <span style={{ padding: "4px" }} />
              <CButton
                color="secondary"
                onClick={() => this.setModal_Create(false)}
              >
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    );
  }

  render() {
    return (
      <div>
        <div>
          <CButton
            color="info"
            className="float-right"
            style={{ margin: "0px 0px 0px 16px" }}
            //style={{margin: '16px'}}
            onClick={() => { this.on_create_clicked() }}
          ><i className="fa fa-plus" /><span style={{ padding: '4px' }} />{this.state.create_new_label}</CButton>
          <CButton
            color="info"
            className="float-right"
            style={{ margin: "0px 0px 0px 16px" }}
            onClick={() => this.on_export_clicked()}
          >
            <i className="fa fa-download"></i>
            <span style={{ padding: "4px" }} />
            {this.state.export_label}
          </CButton>
          <CSVLink
            headers={this.state.header}
            filename="Export-CertificateType.csv"
            data={this.state.export_all_data}
            ref={(r) => (this.csvLink = r)}
          ></CSVLink>
          <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
            <CButton
              color="info"
              className="float-right"
              style={{ margin: '0px 0px 0px 16px' }}
            //style={{margin: '16px'}}
            ><i className="fa fa-upload" /><span style={{ padding: '4px' }} />{this.state.import_label}</CButton>
          </ReactFileReader>
        </div>
        <div>
          <CDataTable
            items={this.state.certificateTypesData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              material: (item, index) => {
                return <td>{this.getMaterial(item.material, item.client)}</td>;
              },
              packing: (item, index) => {
                return <td>{this.getPacking(item.packing)}</td>;
              },
              analysises: (item, index) => {
                return (
                  <td style={{ whiteSpace: "pre-line" }}>
                    {this.getAnalysises(
                      item.analysises,
                      item.material,
                      item.client
                    )}
                  </td>
                );
              },
              buttonGroups: (item, index) => {
                return (
                  <td>
                    <div style={{ display: "flex" }}>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => {
                          this.on_update_clicked(item);
                        }}
                      >
                        <i className="fa fa-edit" />
                      </CButton>
                      <span style={{ padding: "4px" }} />
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => {
                          this.on_delete_clicked(item._id);
                        }}
                      >
                        <i className="fa fa-trash" />
                      </CButton>
                    </div>
                  </td>
                );
              },
            }}
          />
        </div>

        <CModal
          style={{ width: "40vw" }}
          show={this.state.modal_delete}
          onClose={() => this.setModal_Delete(false)}
        >
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current certificate type?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="danger"
              onClick={() => this.deleteCertificateType()}
            >
              Delete
            </CButton>{" "}
            <CButton
              color="secondary"
              onClick={() => this.setModal_Delete(false)}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          style={{ width: "40vw" }}
          show={this.state.modal_create}
          onClose={() => this.setModal_Create(false)}
          closeOnBackdrop={false}
          centered
        >
          <CModalHeader>
            <CModalTitle>
              {this.state._create === true
                ? "Create New Certificate Type"
                : "Update Certificate Type"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllCertificateTypes() {
    axios.get(Config.ServerUri + '/get_all_certificateTypes')
      .then((res) => {
        this.setState({
          materialsData: res.data.materials,
          clientsData: res.data.clients,
          certificateTypesData: res.data.certificateTypes,
          objectivesData: res.data.objectives,
          analysisTypesData: res.data.analysises,
          unitsData: res.data.units,
          packingsData: res.data.packings,
        });
        var certificate_list = [];
        res.data.certificateTypes.map((certificate) => {
          var client_name = '';
          var material_name = '';
          var packing_name = '';
          var analysis = '';
          if (certificate.client === '') {
            client_name = 'Default';
          }
          res.data.clients.map((client) => {
            if (client._id === certificate.client) {
              client_name = client.name;
            }
          });
          res.data.materials.map((material) => {
            if (material._id === certificate.material) {
              material_name = material.material;
            }
          });
          res.data.packings.map((packing) => {
            if (packing._id === certificate.packing) {
              packing_name = packing.packingType;
            }
          });
          var analysis_data = this.getAnalysises(certificate.analysises, certificate.material, certificate.client)
          certificate_list.push({ 'certificateType_id': certificate.certificateType_id, 'material': material_name + '-' + client_name, 'certificateType': certificate.certificateType, 'packing': packing_name, 'analysises': analysis_data.trim(), 'remark': certificate.remark });
        });
        this.setState({
          export_all_data: certificate_list
        })

      })
      .catch((error) => {

      })
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });

    this.setModal_Delete(true);
  }

  on_create_clicked() {
    this.setState({
      current_id: '',
      certificateType: '',
      certificateType_id: this.state.certificateTypesData.length + 1,
      remark: '',
      analysises: [],
      _analysises: [],
      material: "",
      client: "",
      packing: "",
      _create: true,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    var analysises = [];
    var _analysises = [];

    item.analysises.map((item) => {
      var label = this.getAnalysisName(item.id);
      if (label !== "") {
        analysises.push({ id: item.id, objectives: item.objectives });
        _analysises.push({ label: label, value: item.id });
      }
      return true;
    });

    var material = item.material;
    if (this.getMaterialName(material) === "") material = "";

    var packing = item.packing;
    if (this.getPackingName(packing) === "") packing = "";

    var client = item.client;
    if (this.getClientName(client) === "") client = "";

    this.setState({
      current_id: item._id,
      certificateType: item.certificateType,
      certificateType_id: item.certificateType_id,
      remark: item.remark,
      analysises: analysises,
      _analysises: _analysises,
      material: material,
      client: client,
      packing: packing,
      _create: false,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  deleteCertificateType() {
    this.setModal_Delete(false);
    axios.post(Config.ServerUri + '/delete_certificateType', {
      id: this.state.current_id
    })
      .then((res) => {
        toast.success('CertificateType successfully deleted');
        this.setState({
          materialsData: res.data.materials,
          clientsData: res.data.clients,
          certificateTypesData: res.data.certificateTypes,
          objectivesData: res.data.objectives,
          analysisTypesData: res.data.analysises,
          unitsData: res.data.units,
          packingsData: res.data.packings
        });
        var certificate_list = [];
        res.data.certificateTypes.map((certificate) => {
          var client_name = '';
          var material_name = '';
          var packing_name = '';
          var analysis = '';
          res.data.clients.map((client) => {
            if (client._id === certificate.client) {
              client_name = client.name;
            }
          });
          res.data.materials.map((material) => {
            if (material._id === certificate.material) {
              material_name = material.material;
            }
          });
          res.data.packings.map((packing) => {
            if (packing._id === certificate.packing) {
              packing_name = packing.packingType;
            }
          });
          var analysis_data = this.getAnalysises(certificate.analysises, certificate.material, certificate.client)
          certificate_list.push({ 'certificateType_id': certificate.certificateType_id, 'material': material_name + '-' + client_name, 'certificateType': certificate.certificateType, 'packing': packing_name, 'analysises': analysis_data.trim(), 'remark': certificate.remark });
        });
        this.setState({
          export_all_data: certificate_list
        })
      })
      .catch((error) => {

      })
  }

  createCertificateType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);
    axios.post(Config.ServerUri + '/create_certificateType', {
      material: this.state.material,
      client: this.state.client,
      certificateType_id: this.state.certificateType_id,
      certificateType: this.state.certificateType,
      analysises: this.state.analysises,
      remark: this.state.remark,
      packing: this.state.packing,
    })
      .then((res) => {
        toast.success('CertificateType successfully created');
        this.setState({
          materialsData: res.data.materials,
          clientsData: res.data.clients,
          certificateTypesData: res.data.certificateTypes,
          objectivesData: res.data.objectives,
          analysisTypesData: res.data.analysises,
          unitsData: res.data.units,
          packingsData: res.data.packings
        });
        var certificate_list = [];
        res.data.certificateTypes.map((certificate) => {
          var client_name = '';
          var material_name = '';
          var packing_name = '';
          var analysis = '';
          res.data.clients.map((client) => {
            if (client._id === certificate.client) {
              client_name = client.name;
            }
          });
          res.data.materials.map((material) => {
            if (material._id === certificate.material) {
              material_name = material.material;
            }
          });
          res.data.packings.map((packing) => {
            if (packing._id === certificate.packing) {
              packing_name = packing.packingType;
            }
          });
          var analysis_data = this.getAnalysises(certificate.analysises, certificate.material, certificate.client)
          certificate_list.push({ 'certificateType_id': certificate.certificateType_id, 'material': material_name + '-' + client_name, 'certificateType': certificate.certificateType, 'packing': packing_name, 'analysises': analysis_data.trim(), 'remark': certificate.remark });
        });
        this.setState({
          export_all_data: certificate_list
        });
      })
      .catch((error) => {

      })
  }

  updateCertificateType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;
    this.setModal_Create(false);
    axios.post(Config.ServerUri + '/update_certificateType', {
      id: this.state.current_id,
      certificateType_id: this.state.certificateType_id,
      material: this.state.material,
      client: this.state.client,
      certificateType: this.state.certificateType,
      analysises: this.state.analysises,
      remark: this.state.remark,
      packing: this.state.packing,
    })
      .then((res) => {
        toast.success('CertificateType successfully updated');
        this.setState({
          materialsData: res.data.materials,
          clientsData: res.data.clients,
          certificateTypesData: res.data.certificateTypes,
          objectivesData: res.data.objectives,
          analysisTypesData: res.data.analysises,
          unitsData: res.data.units,
          packingsData: res.data.packings
        });
        var certificate_list = [];
        res.data.certificateTypes.map((certificate) => {
          var client_name = '';
          var material_name = '';
          var packing_name = '';
          var analysis = '';
          res.data.clients.map((client) => {
            if (client._id === certificate.client) {
              client_name = client.name;
            }
          });
          res.data.materials.map((material) => {
            if (material._id === certificate.material) {
              material_name = material.material;
            }
          });
          res.data.packings.map((packing) => {
            if (packing._id === certificate.packing) {
              packing_name = packing.packingType;
            }
          });
          var analysis_data = this.getAnalysises(certificate.analysises, certificate.material, certificate.client)
          certificate_list.push({ 'certificateType_id': certificate.certificateType_id, 'material': material_name + '-' + client_name, 'certificateType': certificate.certificateType, 'packing': packing_name, 'analysises': analysis_data.trim(), 'remark': certificate.remark });
        });
        this.setState({
          export_all_data: certificate_list
        });
      })
      .catch((error) => {

      })
  }

  setModal_Delete(modal) {
    this.setState({
      modal_delete: modal,
    });
  }

  setModal_Create(modal) {
    this.setState({
      modal_create: modal,
    });
  }
}
