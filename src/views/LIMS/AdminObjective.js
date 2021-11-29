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
} from "@coreui/react";

import Select from "react-select";
import {toast} from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

const axios = require("axios");
const Config = require("../../Config.js");


export default class AdminObjective extends Component {
  constructor(props) {
    super(props);
    this.getAllObjectives = this.getAllObjectives.bind(this);
    this.deleteObjective = this.deleteObjective.bind(this);
    this.createObjective = this.createObjective.bind(this);
    this.updateObjective = this.updateObjective.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      objectivesData: [],
      unitsData: [],
      export_all_data:[],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      objective_id: '',
      objective: '',
      units: [],
      _units: [],
      remark: "",
      _create: false,
      objective_error: "",
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        {key: 'objective_id', label:props.language_data.filter(item => item.label === 'objective_id')[0][props.selected_language]},
        {key: 'objective', label:props.language_data.filter(item => item.label === 'objective')[0][props.selected_language]},
        {key: 'units', sorter: false , label:props.language_data.filter(item => item.label === 'units')[0][props.selected_language]},
        {key: 'remark', sorter: false, label:props.language_data.filter(item => item.label === 'remark')[0][props.selected_language]},
        {key: 'buttonGroups', label: '', _style: { width: '84px'}}
      ],
      header: [
        {key: 'objective_id',label:props.language_data.filter(item => item.label === 'objective_id')[0][props.selected_language]},
        {key: 'objective', label:props.language_data.filter(item => item.label === 'objective')[0][props.selected_language]},
        {key: 'units', label:props.language_data.filter(item => item.label === 'units')[0][props.selected_language]},
        {key: 'remark', label:props.language_data.filter(item => item.label === 'remark')[0][props.selected_language]},
      ]
    };
  }

  componentDidMount() {
    this.getAllObjectives();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          {key: 'objective_id', label:nextProps.language_data.filter(item => item.label === 'objective_id')[0][nextProps.selected_language]},
          {key: 'objective', label:nextProps.language_data.filter(item => item.label === 'objective')[0][nextProps.selected_language]},
          {key: 'units', sorter: false , label:nextProps.language_data.filter(item => item.label === 'units')[0][nextProps.selected_language]},
          {key: 'remark', sorter: false, label:nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language]},
          {key: 'buttonGroups', label: '', _style: { width: '84px'}}
        ],
        header: [
          {key: 'objective_id',label:nextProps.language_data.filter(item => item.label === 'objective_id')[0][nextProps.selected_language]},
          {key: 'objective', label:nextProps.language_data.filter(item => item.label === 'objective')[0][nextProps.selected_language]},
          {key: 'units', label:nextProps.language_data.filter(item => item.label === 'units')[0][nextProps.selected_language]},
          {key: 'remark', label:nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language]},
        ]
      })
    }
  }
  getUnitName(id) {
    var units = this.state.unitsData;
    for (var i = 0; i < units.length; i++) {
      if (units[i]._id === id) return units[i].unit;
    }
    return "";
  }

  async on_export_clicked () {
    await this.csvLink.link.click();
  }

  async handleFiles(files) {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    const result = await new Promise((resolve, reject) => {
      reader.onload = function(e) {
        resolve(reader.result);
      }
    })
    axios.post(Config.ServerUri + '/upload_objective_csv', {
      data: result
    })
    .then((res) => {
      this.setState({objectivesData: res.data.objectives});
      toast.success('Objective CSV file successfully imported');
    });
  }

  handleMultiSelectChange(e) {
    var units = [];
    e.map((item) => {
      units.push(item.value);
      return true;
    });

    this.setState({ units: units, _units: e });
  }

  getUnits(units) {
    if (units === "" || units === undefined) return "";

    var returnVal = "";
    units.map((item, index) => {
      var label = this.getUnitName(item);
      if (label !== "") {
        if (index < units.length - 1) returnVal = returnVal + label + "\n";
        else returnVal = returnVal + label;
      }

      return true;
    });

    return returnVal;
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "objective") {
      var found = false;
      for (var i in this.state.objectivesData) {
        var item = this.state.objectivesData[i];
        if (item.objective === value && item._id !== this.state.current_id) {
          found = true;
          break;
        }
      }

      if (found === true) {
        this.setState({ objective_error: "Value already exists" });
      } else this.setState({ objective_error: "" });
    }

    this.setState({
      [name]: value,
    });
  }

  renderModalCreate() {
    var options = [];
    this.state.unitsData.map((item) => {
      options.push({ label: item.unit, value: item._id });
      return true;
    });

    var error = this.state.objective_error;

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state._create === true
                ? this.createObjective
                : this.updateObjective
            }
          >
            <CFormGroup>
              <CLabel style={{fontWeight: '500'}}>Objective ID</CLabel>
              <CInput name="objective_id" value={this.state.objective_id} onChange={this.handleInputChange} required />
              {
                error === undefined || error === '' ? <div></div> : 
                  <div style={{width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353'}}>{error}</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Objective</CLabel>
              <CInput
                name="objective"
                value={this.state.objective}
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
              <CLabel style={{ fontWeight: "500" }}>Units</CLabel>
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
                onChange={(e) => this.handleMultiSelectChange(e)}
                value={this.state._units}
              />
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
            onClick={()=>{ this.on_create_clicked() }}
          ><i className="fa fa-plus"/><span style={{padding: '4px'}}/>{this.state.create_new_label}</CButton>
           <CButton
          color="info"
          className="float-right"
          style={{ margin: "0px 0px 0px 16px" }}
          onClick={()=>this.on_export_clicked()}
          >
          <i className="fa fa-download"></i>
          <span style={{ padding: "4px" }} />
          {this.state.export_label}
          </CButton>
          <CSVLink
          headers={this.state.header}
          filename="Export-Objective.csv"
          data={this.state.export_all_data}
          ref={(r) => (this.csvLink = r)}
          ></CSVLink>
          <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
            <CButton
              color="info"
              className="float-right"
              style={{margin: '0px 0px 0px 16px'}}
              //style={{margin: '16px'}}
            ><i className="fa fa-upload"/><span style={{padding: '4px'}}/>{this.state.import_label}</CButton>
          </ReactFileReader>
        </div>
        <div id="tableUserTypes">
          <CDataTable
            items={this.state.objectivesData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              units: (item, index) => (
                <td style={{ whiteSpace: "pre-line" }} key={index}>
                  {
                    item.units.length > 0 && item.units.map(unit => <p className="mb-0">{unit.unit}</p>)
                  }
                </td>
              ),
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
            Do you really want to delete current objective?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteObjective()}>
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
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>
              {this.state._create === true
                ? "Create New Objective"
                : "Update Objective"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  formatedUnits(items) {
    let str = ''
    items.map(item => str += item.unit)
    str.replace(/,/g, '<br/>')
    console.log(str)
    return str;
  }

  getAllObjectives() {
    axios.get(Config.ServerUri + '/get_all_objectives')
    .then((res) => {
      this.setState({
        objectivesData: res.data.objectives,
        unitsData: res.data.units
      });
      const excelData = res.data.objectives.map(obj => {
        return {
          objective: obj.objective,
          objective_id: obj.objective_id,
          remark: obj.remark,
          units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n")
        }
      })
      this.setState({
        export_all_data: excelData,
      });
    })
    .catch((error) => {})
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });

    this.setModal_Delete(true);
  }

  on_create_clicked() {
    this.setState({
      current_id: '',
      objective: '',
      objective_id: this.state.objectivesData.length + 1,
      units: [],
      _units: [],
      remark: "",
      _create: true,
      objective_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    var units = [];
    var _units = [];

    item.units.map((item, index) => {
      units.push(item);
      _units.push({ label: item.unit, value: item._id });
      return true;
    });

    this.setState({
      current_id: item._id,
      objective: item.objective,
      objective_id:item.objective_id,
      units: units,
      _units: _units,
      remark: item.remark,
      _create: false,
      objective_error: "",
    });

    this.setModal_Create(true);
  }

  deleteObjective() {
    this.setModal_Delete(false);
    axios.post(Config.ServerUri + '/delete_objective', {
      id: this.state.current_id
    })
    .then((res) => {
      toast.success("Objective successfully deleted.")
      this.setState({
        objectivesData: res.data.objectives,
        unitsData: res.data.units
      });
      var objective_list = [];
      res.data.objectives.map((objective)=>{
        var unit_data_list = this.getUnits(objective.units);
        objective_list.push({"objective_id":objective.objective_id, 'objective':objective.objective,'units':unit_data_list,'remark':objective.remark})
      });
      console.log(objective_list);
      this.setState({
        export_all_data:objective_list,
      });
    })
    .catch((error) => {
      
    })
  }

  createObjective(event) {
    event.preventDefault();

    if (this.state.objective_error !== "") return;
    
    this.setModal_Create(false);

    const data = {
      objective: this.state.objective,
      objective_id: this.state.objective_id,
      units: this.state.units,
      remark: this.state.remark
    }
    axios.post(Config.ServerUri + '/create_objective', data)
    .then((res) => {
      if (res.data.status === 0) {
        toast.error("Objective already exists.")
      }
      else {
        toast.success("Objective successfully created.")
        this.setState({
          objectivesData: res.data.objectives,
          unitsData: res.data.units
        });
        const excelData = res.data.objectives.map(obj => {
          return {
            objective: obj.objective,
            objective_id: obj.objective_id,
            remark: obj.remark,
            units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n")
          }
        })
        this.setState({
          export_all_data: excelData,
        });
      }
    })
    .catch((error) => {})
  }

  updateObjective(event) {
    event.preventDefault();

    if (this.state.objective_error !== "") return;

    this.setModal_Create(false);

    const data = {
      id: this.state.current_id,
      objective_id: this.state.objective_id,
      objective: this.state.objective,
      units: this.state.units,
      remark: this.state.remark
    }
    axios.post(Config.ServerUri + '/update_objective', data)
    .then((res) => {
      if (res.data.status === 0) {
        toast.error("Objective already exists.")
      }
      else {
        toast.success("Objective successfully updated.")
        this.setState({
          objectivesData: res.data.objectives,
          unitsData: res.data.units
        });
        const excelData = res.data.objectives.map(obj => {
          return {
            objective: obj.objective,
            objective_id: obj.objective_id,
            remark: obj.remark,
            units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n")
          }
        })
        this.setState({
          export_all_data: excelData,
        });
      }
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
