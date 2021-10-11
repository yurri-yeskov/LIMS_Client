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
  CLabel,
  CInput,
  CRow,
  CCol,
  CTooltip,
} from "@coreui/react";

import Select from "react-select";
import { toast } from "react-hot-toast";

const axios = require("axios");
const Config = require("../../Config.js");

const fields = [
  { key: "material", _style: { width: "25%" } },
  { key: "objectives", label: "AnalysisType-Objectives", sorter: false },
  { key: "remark", sorter: false },
  { key: "buttonGroups", label: "", _style: { width: "84px" } },
];

export default class AdminMaterial extends Component {
  constructor(props) {
    super(props);
    this.getAllMaterials = this.getAllMaterials.bind(this);
    this.deleteMaterial = this.deleteMaterial.bind(this);
    this.createMaterial = this.createMaterial.bind(this);
    this.updateMaterial = this.updateMaterial.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      materialsData: [],
      objectivesData: [],
      unitsData: [],
      clientsData: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      material: "",
      objectives: [],
      objectiveValues: [],
      objectivesError: [],
      clients: [],
      _clients: [],
      remark: "",
      _create: false,
      material_error: "",

      analysisData: [],
      analysisTypes: [],
      minMaxValues: [],
    };
  }

  componentDidMount() {
    this.getAllMaterials();
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "material") {
      var found = false;
      for (var i in this.state.materialsData) {
        var item = this.state.materialsData[i];
        if (item.material === value && item._id !== this.state.current_id) {
          found = true;
          break;
        }
      }

      if (found === true) {
        this.setState({ material_error: "Value already exists" });
      } else this.setState({ material_error: "" });
    }

    this.setState({
      [name]: value,
    });
  }

  handleObjectiveInputChange(e, client, obj, type, typeIdx) {
    var analysisTypes = this.state.analysisTypes;

    analysisTypes[typeIdx][e.target.name] = e.target.value;
    this.setState({ analysisTypes: analysisTypes });
  }

  getObjectiveValue(id /*objective id*/, unit /*unit id*/, client, analysis) {
    var values = this.state.objectiveValues;

    if (analysis == undefined) {
      var retVal = {
        id: id,
        unit: unit,
        client: client,
        analysis: "",
        min: 0,
        max: 0,
      };
    } else {
      var retVal = {
        id: id,
        unit: unit,
        client: client,
        analysis: analysis,
        min: 0,
        max: 0,
      };
    }

    for (var i = 0; i < values.length; i++) {
      if (
        values[i].id === id &&
        values[i].unit === unit &&
        values[i].client === client &&
        values[i].analysis === analysis
      ) {
        retVal = values[i];
        break;
      }
    }

    return retVal;
  }

  handleMultiSelectChange_Obj(e, client) {
    var objectives = [];
    var objectiveValues = [];

    this.state.objectives.map((item) => {
      if (item.client !== client) objectives.push(item);
      return true;
    });

    this.state.objectiveValues.map((item) => {
      if (item != undefined) {
        if (item.client !== client) objectiveValues.push(item);
        return true;
      }
    });

    e.map((item) => {
      var ids = item.value.split("-");
      objectives.push({ label: item.label, value: item.value, client: client });
      objectiveValues.push(this.getObjectiveValue(ids[0], ids[1], client));
      return true;
    });

    this.setState({ objectives: objectives, objectiveValues: objectiveValues });
  }

  handleMultiSelectChange_A_Types(e, obj, client) {
    var analysisTypes = [];
    var minMaxValues = [];
    var objectiveValues = [];

    this.state.analysisTypes.map((item) => {
      if (item.obj !== obj || item.client !== client) {
        analysisTypes.push(item);
      }
      return true;
    });

    this.state.objectiveValues.map((item) => {
      if (item != undefined) {
        var unit = item.id + "-" + item.unit;
        if (item.client !== client || unit !== obj) {
          objectiveValues.push(item);
        }
        return true;
      }
    });

    e.map((item) => {
      var ids = obj.split("-");
      objectiveValues.push(
        this.getObjectiveValue(ids[0], ids[1], client, item.value)
      );
      analysisTypes.push({
        label: item.label,
        value: item.value,
        obj: obj,
        client: client,
        min: 0,
        max: 0,
      });
      return true;
    });

    this.setState({
      analysisTypes: analysisTypes,
      objectiveValues: objectiveValues,
    });
  }
  handleMultiSelectChange_Client(e) {
    var clients = [];
    e.map((item) => {
      clients.push(item.value);
      return true;
    });

    this.setState({ clients: clients, _clients: e });
  }

  getObjectiveName(id) {
    var objectives = this.state.objectivesData;
    for (var i = 0; i < objectives.length; i++) {
      if (objectives[i]._id === id) return objectives[i].objective;
    }
    return "";
  }

  getClientName(id) {
    var clients = this.state.clientsData;
    for (var i = 0; i < clients.length; i++) {
      if (clients[i]._id === id) return clients[i].name;
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

  getAnalysisName(id) {
    var analysis = this.state.analysisData;
    for (var i = 0; i < analysis.length; i++) {
      if (analysis[i]._id === id) return analysis[i].analysisType;
    }
    return "";
  }

  renderModalCreate() {
    const { objectives } = this.state;
    var objOptions = [];
    this.state.objectivesData.map((item) => {
      // options for objective multi-select
      item.units.map((item0) => {
        var unit = this.getUnitName(item0);
        if (unit !== "") {
          objOptions.push({
            label: item.objective + " " + unit,
            value: item._id + "-" + item0,
          });
        }

        return true;
      });
      return true;
    });
    objOptions.sort((a, b) =>
      a.label > b.label ? 1 : b.label > a.label ? -1 : 0
    );

    var clientOptions = [];
    this.state.clientsData.map((item) => {
      // options for client multi-select
      clientOptions.push({ label: item.name, value: item._id });
      return true;
    });

    var clientObjs = []; // clients including default client
    clientObjs.push({ label: "Default", value: "" });
    this.state._clients.map((item) => {
      clientObjs.push({ label: item.label, value: item.value });
      return true;
    });

    var error = this.state.material_error;

    this.state.filteredObjectives = Array.from(
      objectives
        .reduce((a, o) => a.set(`${o.value}-${o.client}`, o), new Map())
        .values()
    );

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state._create === true
                ? this.createMaterial
                : this.updateMaterial
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Material</CLabel>
              <CInput
                name="material"
                value={this.state.material}
                onChange={this.handleInputChange}
                required
              />
              {error === undefined || error === "" ? (
                <div></div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    fontSize: "80%",
                    color: "#e55353",
                  }}
                >
                  {error}
                </div>
              )}
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Clients</CLabel>
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
                options={clientOptions}
                onChange={(e) => this.handleMultiSelectChange_Client(e)}
                value={this.state._clients}
              />
            </CFormGroup>
            {clientObjs.map((item, index) => {
              var _objectives = [];
              this.state.filteredObjectives.map((item0) => {
                if (item0.client === item.value) {
                  if (_objectives.length == 0) {
                    _objectives.push({
                      label: item0.label,
                      value: item0.value,
                    });
                  } else {
                    for (var i = 0; i < _objectives.length; i++) {
                      if (_objectives[i].value !== item0.value) {
                        _objectives.push({
                          label: item0.label,
                          value: item0.value,
                        });
                        break;
                      }
                    }
                  }
                }
                return true;
              });
              return this.renderObjectives(
                item,
                _objectives,
                objOptions,
                index
              );
            })}
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

  renderObjectives(client, objs, options, clientIndex) {
    var analysisOptions = [];
    this.state.analysisData.map((item) => {
      objs.map((temp) => {
        item.objectives.map((item0) => {
          if (temp.value == item0.id + "-" + item0.unit) {
            analysisOptions.push({
              label: item.analysisType,
              value: item._id,
              client: client.value,
              objective: item0.id + "-" + item0.unit,
            });
          }
        });
      });

      return true;
    });

    return (
      <CFormGroup key={clientIndex}>
        <CRow>
          <CCol md="2" style={{ fontWeight: "500" }}>
            {"Objectives - " + client.label}
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
                    options={options}
                    onChange={(e) =>
                      this.handleMultiSelectChange_Obj(e, client.value)
                    }
                    value={objs}
                  />
                </CCol>
              </CRow>
            </CFormGroup>
            {this.state.filteredObjectives.map((obj, objIdx) => {
              var _analyisTypes = [];
              var label = "";
              var _analysisOptions = [];
              /**
               *  ....very important.....
               */
              if (obj.client !== client.value) return false;

              this.state.analysisTypes.map((type) => {
                if (type.obj === obj.value && type.client === client.value) {
                  if (_analyisTypes.length == 0) {
                    _analyisTypes.push({
                      label: type.label,
                      value: type.value,
                    });
                  } else {
                    _analyisTypes.map((temp) => {
                      if (
                        temp.label != type.label &&
                        temp.value != type.value
                      ) {
                        _analyisTypes.push({
                          label: type.label,
                          value: type.value,
                        });
                      }
                    });
                  }
                }

                return true;
              });

              _analyisTypes = Array.from(
                _analyisTypes
                  .reduce(
                    (a, o) => a.set(`${o.value}-${o.client}-${o.obj}`, o),
                    new Map()
                  )
                  .values()
              );

              analysisOptions.map((item) => {
                if (item.objective === obj.value) {
                  _analysisOptions.push(item);
                }

                return true;
              });

              label = obj.label;
              if (label != "") {
                return this.renderATypes(
                  client,
                  obj,
                  objIdx,
                  _analysisOptions,
                  _analyisTypes
                );
              }
              return true;
            })}
          </CCol>
        </CRow>
      </CFormGroup>
    );
  }

  renderATypes(client, obj, objIdx, aOptions, aTypes) {
    return (
      <CFormGroup key={objIdx}>
        <CRow>
          <CCol md="5" style={{ fontWeight: "500" }}>
            {"Analysis Types - " + obj.label}
          </CCol>
          <CCol md="7">
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
              options={aOptions}
              onChange={(e) =>
                this.handleMultiSelectChange_A_Types(e, obj.value, client.value)
              }
              value={aTypes}
            />
          </CCol>
        </CRow>
        {this.state.analysisTypes.map((type, typeIdx) => {
          var label = type.label;
          var _minMaxValues = [];

          var objValue = {
            min: type.min,
            max: type.max,
          };

          if (type.obj !== obj.value) return true;
          if (type.client !== client.value) return true;

          return this.renderminMaxValues(
            client,
            obj,
            type,
            typeIdx,
            label,
            objValue
          );
        })}
      </CFormGroup>
    );
  }

  renderminMaxValues(client, obj, type, typeIdx, typeLabel, objValue) {
    return (
      <CFormGroup key={typeIdx}>
        <CRow style={{ marginTop: "13px" }}>
          <CCol md="2"></CCol>
          <CCol md="3">{typeLabel}</CCol>
          <CCol md="2">Min Value</CCol>
          <CCol md="1">
            {/* <CInput pattern="[+-]?\d+(?:[.]\d+)?" name="min" value={objValue.min} onChange={(e) => this.handleObjectiveInputChange(e, client, obj, type, typeIdx)} /> */}
            <input
              type="number"
              name="min"
              style={{
                width: "50px",
                height: "30px",
                borderColor: "lightseagreen",
                borderRadius: "5px",
              }}
              value={objValue.min}
              onChange={(e) =>
                this.handleObjectiveInputChange(e, client, obj, type, typeIdx)
              }
            />
          </CCol>
          <CCol md="2">Max Value</CCol>
          <CCol md="1">
            {/* <CInput pattern="[+-]?\d+(?:[.]\d+)?" name="max" value={objValue.max} onChange={(e) => this.handleObjectiveInputChange(e, client, obj, type, typeIdx)} /> */}
            <input
              type="number"
              name="max"
              style={{
                width: "50px",
                height: "30px",
                borderColor: "lightseagreen",
                borderRadius: "5px",
              }}
              value={objValue.max}
              onChange={(e) =>
                this.handleObjectiveInputChange(e, client, obj, type, typeIdx)
              }
            />
          </CCol>
        </CRow>
        <CRow style={{ marginLeft: "16%", paddingLeft: "15px" }}>
          {/* {
        error === undefined || error === '' ? <div></div> : 
          <div style={{width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353'}}>Min value must be equal or less than Max Value</div>
      } */}
        </CRow>
      </CFormGroup>
    );
  }

  getTooltip(item, client) {
    var count = 0;
    var ret = "";
    item.objectiveValues.map((item0) => {
      if (item0.client !== client) return false;
      var name = this.getObjectiveName(item0.id);
      var unit = this.getUnitName(item0.unit);
      var analysis = this.getAnalysisName(item0.analysis);
      if (name !== "" && unit !== "") {
        ret =
          ret +
          analysis +
          "-" +
          name +
          " " +
          unit +
          ": " +
          "[" +
          item0.min +
          "-" +
          item0.max +
          "]" +
          ", ";
        count++;
      }

      return true;
    });

    return count === 0 ? "No Objectives" : ret;
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
            onClick={() => {
              this.on_create_clicked();
            }}
          >
            <i className="fa fa-plus" />
            <span style={{ padding: "4px" }} />
            Create New
          </CButton>
        </div>
        <div>
          <CDataTable
            items={this.state.materialsData}
            fields={fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              material: (item) => {
                var clientObjs = []; // clients including default client
                clientObjs.push({ label: "Default", value: "" });
                item.clients.map((item0) => {
                  var label = this.getClientName(item0);
                  if (label !== "")
                    clientObjs.push({ label: label, value: item0 });
                  return true;
                });

                return (
                  <td>
                    {clientObjs.map((client, index) => {
                      return (
                        <div
                          style={{
                            marginLeft: client.value === "" ? "0px" : "0.6em",
                          }}
                        >
                          {item.material + " - " + client.label}
                        </div>
                      );
                    })}
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
              objectives: (item, index) => {
                var clientObjs = []; // clients including default client
                clientObjs.push({ label: "Default", value: "" });
                item.clients.map((item0) => {
                  var label = this.getClientName(item0);
                  if (label !== "")
                    clientObjs.push({ label: label, value: item0 });
                  return true;
                });
                return (
                  <td>
                    {clientObjs.map((client, index) => {
                      let tooltip = this.getTooltip(item, client.value);
                      return <div>{tooltip}</div>;
                    })}
                  </td>
                );
              },
            }}
          />
        </div>

        <CModal
          style={{ width: "50vw" }}
          show={this.state.modal_delete}
          onClose={() => this.setModal_Delete(false)}
        >
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current material?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteMaterial()}>
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
          style={{ width: "50vw" }}
          show={this.state.modal_create}
          onClose={() => this.setModal_Create(false)}
          closeOnBackdrop={false}
          centered
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>
              {this.state._create === true
                ? "Create New Material"
                : "Update Material"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllMaterials() {
    axios
      .get(Config.ServerUri + "/get_all_materials")
      .then((res) => {
        this.setState({
          materialsData: res.data.materials,
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
          clientsData: res.data.clients,
          analysisData: res.data.analysisTypes,
        });
      })
      .catch((error) => {});
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });

    this.setModal_Delete(true);
  }

  on_create_clicked() {
    this.setState({
      current_id: "",
      material: "",
      remark: "",
      objectives: [],
      objectiveValues: [],
      objectivesError: [],
      clients: [],
      _clients: [],
      _create: true,
      material_error: "",
      filteredObjectives: [],
      analysisTypes: [],
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    var clients = [];
    var _clients = [];

    item.clients.map((temp, index) => {
      var label = this.getClientName(temp);
      if (label !== "") {
        clients.push(temp);
        _clients.push({ label: label, value: temp });
      }
      return true;
    });

    var objectives = [];
    var objectiveValues = [];
    var analysisTypes = [];

    item.objectiveValues.map((temp) => {
      var label = this.getObjectiveName(temp.id);
      var unit = this.getUnitName(temp.unit);
      var clientIndex = clients.indexOf(temp.client);
      var analysis = this.getAnalysisName(temp.analysis);

      if (temp.client === "") clientIndex = 0;
      if (label !== "" && unit !== "" && clientIndex >= 0) {
        objectiveValues.push(temp);

        objectives.push({
          label: label + " " + unit,
          value: temp.id + "-" + temp.unit,
          client: temp.client,
          analysis: temp.analysis,
        });

        analysisTypes.push({
          label: analysis,
          value: temp.analysis,
          obj: temp.id + "-" + temp.unit,
          client: temp.client,
          min: temp.min,
          max: temp.max,
        });

        return true;
      }
    });
    this.setState({
      current_id: item._id,
      material: item.material,
      objectives: objectives,
      objectiveValues: objectiveValues,
      objectivesError: [],
      analysisTypes: analysisTypes,
      clients: clients,
      _clients: _clients,
      remark: item.remark,
      _create: false,
      material_error: "",
    });

    this.setModal_Create(true);
  }

  deleteMaterial() {
    this.setModal_Delete(false);

    axios
      .post(Config.ServerUri + "/delete_material", {
        id: this.state.current_id,
      })
      .then((res) => {
        toast.success("Material successfully deleted");
        this.setState({
          materialsData: res.data.materials,
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
          clientsData: res.data.clients,
        });
      })
      .catch((error) => {});
  }

  checkMinMax() {
    var objectiveValues = this.state.objectiveValues;
    var objectivesError = [];
    var check = true;

    objectiveValues.map((item, i) => {
      item.min = parseFloat(item.min);
      item.max = parseFloat(item.max);
      if (item.min > item.max) {
        objectivesError.push("error");
        check = false;
      } else objectivesError.push("");

      return true;
    });

    this.setState({ objectiveValues, objectivesError });
    return check;
  }

  createMaterial(event) {
    event.preventDefault();

    const objectiveValues = this.state.objectiveValues;
    const analysisTypes = this.state.analysisTypes;

    objectiveValues.map((item) => {
      analysisTypes.map((data) => {
        if (
          item.client === data.client &&
          item.analysis === data.value &&
          item.id === data.obj.split("-")[0] &&
          item.unit === data.obj.split("-")[1]
        ) {
          item.min = data.min;
          item.max = data.max;
        }
      });
    });

    if (this.checkMinMax() === false) return;
    if (this.state.material_error !== "") return;

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/create_material", {
        material: this.state.material,
        objectiveValues: objectiveValues,
        clients: this.state.clients,
        remark: this.state.remark,
        aTypesValues: analysisTypes,
      })
      .then((res) => {
        toast.success("Material successfully created");
        this.setState({
          materialsData: res.data.materials,
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
          clientsData: res.data.clients,
          analysisTypes: res.data.analysisTypes,
        });
      })
      .catch((error) => {});
  }

  updateMaterial(event) {
    event.preventDefault();

    const objectiveValues = this.state.objectiveValues;
    const analysisTypes = this.state.analysisTypes;

    objectiveValues.map((item) => {
      analysisTypes.map((data) => {
        if (
          item.client === data.client &&
          item.analysis === data.value &&
          item.id === data.obj.split("-")[0] &&
          item.unit === data.obj.split("-")[1]
        ) {
          item.min = data.min;
          item.max = data.max;
        }
      });
    });

    if (this.checkMinMax() === false) return;
    if (this.state.material_error !== "") return;

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/update_material", {
        id: this.state.current_id,
        material: this.state.material,
        objectiveValues: this.state.objectiveValues,
        clients: this.state.clients,
        remark: this.state.remark,
        aTypesValues: analysisTypes,
      })
      .then((res) => {
        toast.success("Material successfully updated");
        this.setState({
          materialsData: res.data.materials,
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
          clientsData: res.data.clients,
          analysisTypes: res.data.analysisTypes,
        });
      })
      .catch((error) => {});
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
