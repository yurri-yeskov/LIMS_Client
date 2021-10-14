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

import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

const axios = require("axios");
const Config = require("../../Config.js");


export default class AdminPackingType extends Component {
  constructor(props) {
    super(props);
    this.getAllPackingTypes = this.getAllPackingTypes.bind(this);
    this.deletePackingType = this.deletePackingType.bind(this);
    this.createPackingType = this.createPackingType.bind(this);
    this.updatePackingType = this.updatePackingType.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);

    this.state = {
      packingTypesData: [],
      export_all_data: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      packingType_id: '',
      packingType: '',
      remark: '',
      _create: false,
      double_error: "",
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        { key: 'packingType_id', label: props.language_data.filter(item => item.label === 'packing_type_id')[0][props.selected_language] },
        { key: 'packingType', _style: { width: '25%' }, label: props.language_data.filter(item => item.label === 'packing_type')[0][props.selected_language] },
        { key: 'remark', sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: 'buttonGroups', label: '', _style: { width: '84px' } }
      ],
      header: [
        { key: 'packingType_id', label: props.language_data.filter(item => item.label === 'packing_type_id')[0][props.selected_language] },
        { key: 'packingType', label: props.language_data.filter(item => item.label === 'packing_type')[0][props.selected_language] },
        { key: 'remark', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
      ],
    };
  }

  componentDidMount() {
    this.getAllPackingTypes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language != this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          { key: 'packingType_id', label: nextProps.language_data.filter(item => item.label === 'packing_type_id')[0][nextProps.selected_language] },
          { key: 'packingType', _style: { width: '25%' }, label: nextProps.language_data.filter(item => item.label === 'packing_type')[0][nextProps.selected_language] },
          { key: 'remark', sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: 'buttonGroups', label: '', _style: { width: '84px' } }
        ],
        header: [
          { key: 'packingType_id', label: nextProps.language_data.filter(item => item.label === 'packing_type_id')[0][nextProps.selected_language] },
          { key: 'packingType', label: nextProps.language_data.filter(item => item.label === 'packing_type')[0][nextProps.selected_language] },
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
    axios.post(Config.ServerUri + '/upload_packingType_csv', {
      data: result
    })
      .then((res) => {
        this.setState({ packingTypesData: res.data });
        toast.success('User CSV file successfully imported');
      });
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "packingType") {
      var found = false;
      for (var i in this.state.packingTypesData) {
        var item = this.state.packingTypesData[i];
        if (item.packingType === value && item._id !== this.state.current_id) {
          found = true;
          break;
        }
      }

      if (found === true) {
        this.setState({ double_error: "Value already exists" });
      } else this.setState({ double_error: "" });
    }

    this.setState({
      [name]: value,
    });
  }

  renderModalCreate() {
    var error = this.state.double_error;

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state._create === true
                ? this.createPackingType
                : this.updatePackingType
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: '500' }}>PackingType ID</CLabel>
              <CInput name="packingType_id" value={this.state.packingType_id} onChange={this.handleInputChange} required />
              {
                error === undefined || error === '' ? <div></div> :
                  <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353' }}>{error}</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>PackingType</CLabel>
              <CInput
                name="packingType"
                value={this.state.packingType}
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
            filename="Export-PackingType.csv"
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
            items={this.state.packingTypesData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
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
            Do you really want to delete current packing type?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deletePackingType()}>
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
                ? "Create New Packing Type"
                : "Update Packing Type"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllPackingTypes() {
    axios.get(Config.ServerUri + '/get_all_packingTypes')
      .then((res) => {
        var packingtype_list = [];
        res.data.map((packingType) => {
          packingtype_list.push({ 'packingType_id': packingType.packingType_id, 'packingType': packingType.packingType, 'remark': packingType.remark })
        })
        this.setState({
          export_all_data: packingtype_list,
          packingTypesData: res.data
        });
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
      packingType: '',
      packingType_id: '',
      remark: '',
      _create: true,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      packingType: item.packingType,
      packingType_id: item.packingType_id,
      remark: item.remark,
      _create: false,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  deletePackingType() {
    this.setModal_Delete(false);

    axios.post(Config.ServerUri + '/delete_packingType', {
      id: this.state.current_id
    })
      .then((res) => {
        toast.success('PackingType successfully deleted');
        var packingtype_list = [];
        res.data.map((packingType) => {
          packingtype_list.push({ 'packingType_id': packingType.packingType_id, 'packingType': packingType.packingType, 'remark': packingType.remark })
        })
        this.setState({
          export_all_data: packingtype_list,
          packingTypesData: res.data
        });
      })
      .catch((error) => {

      })
  }

  createPackingType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);

    axios.post(Config.ServerUri + '/create_packingType', {
      packingType_id: this.state.packingType_id,
      packingType: this.state.packingType,
      remark: this.state.remark
    })
      .then((res) => {
        toast.success('PackingType successfully created');
        var packingtype_list = [];
        res.data.map((packingType) => {
          packingtype_list.push({ 'packingType_id': packingType.packingType_id, 'packingType': packingType.packingType, 'remark': packingType.remark })
        })
        this.setState({
          export_all_data: packingtype_list,
          packingTypesData: res.data
        });
      })
      .catch((error) => {

      })
  }

  updatePackingType(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);
    axios.post(Config.ServerUri + '/update_packingType', {
      id: this.state.current_id,
      packingType_id: this.state.packingType_id,
      packingType: this.state.packingType,
      remark: this.state.remark
    })
      .then((res) => {
        toast.success('PackingType successfully updated');
        var packingtype_list = [];
        res.data.map((packingType) => {
          packingtype_list.push({ 'packingType_id': packingType.packingType_id, 'packingType': packingType.packingType, 'remark': packingType.remark })
        })
        this.setState({
          export_all_data: packingtype_list,
          packingTypesData: res.data
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
