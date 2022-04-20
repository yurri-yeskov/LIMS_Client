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
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

const axios = require("axios");
const Config = require("../../Config.js");

export default class AdminAnalysisType extends Component {
  constructor(props) {
    super(props);
    this.getAllAnalysisTypes = this.getAllAnalysisTypes.bind(this);
    this.deleteAnalysisType = this.deleteAnalysisType.bind(this);
    this.createAnalysisType = this.createAnalysisType.bind(this);
    this.updateAnalysisType = this.updateAnalysisType.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);

    this.state = {
      analysisTypesData: [],
      objectivesData: [],
      unitsData: [],
      export_all_data: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      analysisType: '',
      analysisType_id: '',
      norm: '',
      objectives: [],
      _objectives: [],
      remark: "",
      _create: false,
      double_error: "",
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        { key: 'analysisType_id', label: props.language_data.filter(item => item.label === 'analysistype_id')[0][props.selected_language] },
        { key: 'analysisType', label: props.language_data.filter(item => item.label === 'analysis_type')[0][props.selected_language] },
        { key: 'norm', label: props.language_data.filter(item => item.label === 'norm')[0][props.selected_language] },
        { key: 'objectives', sorter: false, label: props.language_data.filter(item => item.label === 'objectives')[0][props.selected_language] },
        { key: 'remark', sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: 'buttonGroups', label: '', _style: { width: '84px' } }
      ],
      header: [
        { key: 'analysisType_id', label: props.language_data.filter(item => item.label === 'analysistype_id')[0][props.selected_language] },
        { key: 'analysisType', label: props.language_data.filter(item => item.label === 'analysis_type')[0][props.selected_language] },
        { key: 'norm', label: props.language_data.filter(item => item.label === 'norm')[0][props.selected_language] },
        { key: 'objectives', label: props.language_data.filter(item => item.label === 'objectives')[0][props.selected_language] },
        { key: 'remark', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: '_id', label: 'Id' },
      ]
    };
  }

  componentDidMount() {
    this.getAllAnalysisTypes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          { key: 'analysisType_id', label: nextProps.language_data.filter(item => item.label === 'analysistype_id')[0][nextProps.selected_language] },
          { key: 'analysisType', label: nextProps.language_data.filter(item => item.label === 'analysis_type')[0][nextProps.selected_language] },
          { key: 'norm', label: nextProps.language_data.filter(item => item.label === 'norm')[0][nextProps.selected_language] },
          { key: 'objectives', sorter: false, label: nextProps.language_data.filter(item => item.label === 'objectives')[0][nextProps.selected_language] },
          { key: 'remark', sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: 'buttonGroups', label: '', _style: { width: '84px' } }
        ],
        header: [
          { key: 'analysisType_id', label: nextProps.language_data.filter(item => item.label === 'analysistype_id')[0][nextProps.selected_language] },
          { key: 'analysisType', label: nextProps.language_data.filter(item => item.label === 'analysis_type')[0][nextProps.selected_language] },
          { key: 'norm', label: nextProps.language_data.filter(item => item.label === 'norm')[0][nextProps.selected_language] },
          { key: 'objectives', label: nextProps.language_data.filter(item => item.label === 'objectives')[0][nextProps.selected_language] },
          { key: 'remark', label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: '_id', label: 'Id' },
        ]
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
    axios.post(Config.ServerUri + '/upload_analysisType_csv', {
      data: result
    })
      .then((res) => {
        this.setState({
          analysisTypesData: res.data.analysisTypes,
        });
        toast.success('AnalysisType CSV file successfully imported');
      });
  }
  getObjectiveName(id) {
    var objectives = this.state.objectivesData;
    for (var i = 0; i < objectives.length; i++) {
      if (objectives[i]._id === id) return objectives[i].objective;
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

  async handleMultiSelectChange(e) {
    var objectives = [];
    if (e.length < this.state._objectives.length) {
      const removed = this.state._objectives.filter(item => e.indexOf(item) === -1)
      const result = await axios.post(Config.ServerUri + '/check_remove_objective', { data: removed, id: this.state.current_id })
      if (!result.data.removable) {
        toast.error('This Objective-Unit has been already used in Material');
        return;
      }
    }
    e.map((item) => {
      var ids = item.value.split("-");
      objectives.push({ id: ids[0], unit: ids[1] });
      return true;
    });

    this.setState({ objectives: objectives, _objectives: e });
  }

  getObjectives(objectives) {
    if (objectives === "" || objectives === undefined) return "";

    var returnVal = "";
    objectives.map((item, index) => {
      var name = this.getObjectiveName(item.id);
      var unit = this.getUnitName(item.unit);
      if (name !== "" && unit !== "") {
        returnVal = returnVal + name + " " + unit + "\n";
      }

      return true;
    });
    return returnVal;
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "analysisType") {
      var found = false;
      for (var i in this.state.analysisTypesData) {
        var item = this.state.analysisTypesData[i];
        if (item.analysisType === value && item._id !== this.state.current_id) {
          found = true;
          break;
        }
      }

      if (found === true) {
        this.setState({ double_error: "Value already exists" });
      } else {
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        this.setState({ double_error: "" });
      }
    }

    this.setState({
      [name]: value,
    });
  }

  renderModalCreate() {
    var objOptions = [];
    this.state.objectivesData.map((item) => {
      // options for objective multi-select
      item.units.map((item0) => {
        var unit = this.getUnitName(item0);
        if (unit !== "")
          objOptions.push({
            label: item.objective + " " + unit,
            value: item._id + "-" + item0,
          });
        return true;
      });
    });

    var error = this.state.double_error;

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state._create === true
                ? this.createAnalysisType
                : this.updateAnalysisType
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: '500' }}>Analysis Type ID</CLabel>
              <CInput name="analysisType_id" value={this.state.analysisType_id} onChange={this.handleInputChange} required />
              {
                this.state.current_id === '' && this.state.analysisTypesData.filter(aType => aType.analysisType_id === this.state.analysisType_id).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>AnalysisType id already exist</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Analysis Type</CLabel>
              <CInput
                name="analysisType"
                value={this.state.analysisType}
                onChange={this.handleInputChange}
                required
              />
              {
                this.state.current_id === '' && this.state.analysisTypesData.filter(aType => aType.analysisType === this.state.analysisType).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>AnalysisType already exist</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Norm</CLabel>
              <CInput
                name="norm"
                value={this.state.norm}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Objectives</CLabel>
              <Select
                isMulti
                placeholder=""
                styles={{
                  control: (base, state) => ({
                    ...base,
                    boxShadow: state.isFocused
                      ? "0 0 0 0.2rem rgba(46, 184, 92, 0.25)"
                      : 0,
                    /*borderColor: state.isFocused
                      ? '#46beed'
                      : base.borderColor,*/
                    borderColor: "#2eb85c",
                    "&:hover": {
                      /*borderColor: state.isFocused
                        ? '#46beed'
                        : base.borderColor,*/
                      borderColor: "#2eb85c",
                    },
                  }),
                }}
                options={objOptions}
                onChange={(e) => this.handleMultiSelectChange(e)}
                value={this.state._objectives}
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
            filename="Export-AnalysisType.csv"
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
        <div id="tableUserTypes">
          <CDataTable
            items={this.state.analysisTypesData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              objectives: (item) => (
                <td style={{ whiteSpace: "pre-line" }}>
                  {this.getObjectives(item.objectives)}
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
            Do you really want to delete current analysis type?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteAnalysisType()}>
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
                ? "Create New Analysis Type"
                : "Update Analysis Type"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllAnalysisTypes() {
    axios.get(Config.ServerUri + '/get_all_analysisTypes')
      .then((res) => {
        this.setState({
          analysisTypesData: res.data.analysisTypes.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
        });
        var analysis_list = []
        res.data.analysisTypes.map((analysistype) => {
          var objectiveHistory_data = this.getObjectives(analysistype.objectives);
          analysis_list.push({ "analysisType_id": analysistype.analysisType_id, "analysisType": analysistype.analysisType, "norm": analysistype.norm, "objectives": objectiveHistory_data, "remark": analysistype.remark, '_id': analysistype._id })
        });
        this.setState({
          export_all_data: analysis_list.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => {

      })
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });
    this.setModal_Delete(true);
    // axios.get(process.env.REACT_APP_API_URL + 'analysis/check_deleteId')
    // .then(res => {
    //   console.log(res.data)
    //   if(res.data.result) {
    //     this.setModal_Delete(true);
    //   } else {
    //     window.confirm("The selected analysis type is using in material table. Are you sure to delete this ")
    //   }
    // })
    // .catch(err => console.log(err.response.data))
  }

  on_create_clicked() {
    let id = 1;
    if (this.state.analysisTypesData.length > 0) {
      const max_id = Math.max.apply(Math, this.state.analysisTypesData.map(data => data.analysisType_id));
      if (max_id === this.state.analysisTypesData.length) {
        id = max_id + 1
      } else {
        var a = this.state.analysisTypesData.map(data => Number(data.analysisType_id));
        var missing = new Array();

        for (var i = 1; i <= max_id; i++) {
          if (a.indexOf(i) == -1) {
            missing.push(i);
          }
        }
        id = Math.min.apply(Math, missing)
      }
    }
    this.setState({
      current_id: '',
      analysisType_id: id,
      analysisType: '',
      norm: '',
      objectives: [],
      _objectives: [],
      remark: "",
      _create: true,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    var objectives = [];
    var _objectives = [];

    item.objectives.map((item, index) => {
      var label = this.getObjectiveName(item.id);
      var unit = this.getUnitName(item.unit);
      if (label !== "" && unit !== "") {
        objectives.push(item);
        _objectives.push({
          label: label + " " + unit,
          value: item.id + "-" + item.unit,
        });
      }
      return true;
    });

    this.setState({
      current_id: item._id,
      analysisType: item.analysisType,
      analysisType_id: item.analysisType_id,
      norm: item.norm,
      objectives: objectives,
      _objectives: _objectives,
      remark: item.remark,
      _create: false,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  deleteAnalysisType() {
    this.setModal_Delete(false);
    axios.post(Config.ServerUri + '/delete_analysisType', {
      id: this.state.current_id
    })
      .then((res) => {
        toast.success('AnalysisType successfully deleted');
        this.setState({
          analysisTypesData: res.data.analysisTypes.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
        });
        var analysis_list = []
        res.data.analysisTypes.map((analysistype) => {
          var objectiveHistory_data = this.getObjectives(analysistype.objectives);
          analysis_list.push({ "analysisType_id": analysistype.analysisType_id, "analysisType": analysistype.analysisType, "norm": analysistype.norm, "objectives": objectiveHistory_data, "remark": analysistype.remark })
        });
        this.setState({
          export_all_data: analysis_list.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data.message)
        }
      })
  }

  createAnalysisType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;
    if (this.state.analysisTypesData.filter(data => data.analysisType_id === this.state.analysisType_id).length > 0) {
      this.setState({ double_error: "Value already exists" });
      return;
    }

    this.setModal_Create(false);

    const data = {
      analysisType_id: this.state.analysisType_id,
      analysisType: this.state.analysisType,
      norm: this.state.norm,
      objectives: this.state.objectives,
      remark: this.state.remark
    }

    axios.post(Config.ServerUri + '/create_analysisType', data)
      .then((res) => {
        toast.success('AnalysisType successfully created');
        this.setState({
          analysisTypesData: res.data.analysisTypes.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
        });
        var analysis_list = []
        res.data.analysisTypes.map((analysistype) => {
          var objectiveHistory_data = this.getObjectives(analysistype.objectives);
          analysis_list.push({ "analysisType_id": analysistype.analysisType_id, "analysisType": analysistype.analysisType, "norm": analysistype.norm, "objectives": objectiveHistory_data, "remark": analysistype.remark })
        });
        this.setState({
          export_all_data: analysis_list.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => {

      })
  }

  updateAnalysisType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;
    this.setModal_Create(false);
    axios.post(Config.ServerUri + '/update_analysisType', {
      id: this.state.current_id,
      analysisType_id: this.state.analysisType_id,
      analysisType: this.state.analysisType,
      norm: this.state.norm,
      objectives: this.state.objectives,
      remark: this.state.remark
    })
      .then((res) => {
        toast.success('AnalysisType successfully updated');
        this.setState({
          analysisTypesData: res.data.analysisTypes.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
          objectivesData: res.data.objectives,
          unitsData: res.data.units,
        });
        var analysis_list = []
        res.data.analysisTypes.map((analysistype) => {
          var objectiveHistory_data = this.getObjectives(analysistype.objectives);
          analysis_list.push({ "analysisType_id": analysistype.analysisType_id, "analysisType": analysistype.analysisType, "norm": analysistype.norm, "objectives": objectiveHistory_data, "remark": analysistype.remark })
        });
        this.setState({
          export_all_data: analysis_list.sort((a, b) => {
            return a.analysisType_id > b.analysisType_id ? 1 : -1;
          }),
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
