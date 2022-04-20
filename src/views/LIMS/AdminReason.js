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
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';
import { toast } from "react-hot-toast";

import axios from "axios";
import Config from "../../Config.js";

export default class AdminReason extends Component {
  constructor(props) {
    super(props);
    this.getAllReason = this.getAllReason.bind(this);
    this.deleteReason = this.deleteReason.bind(this);
    this.createReason = this.createReason.bind(this);
    this.updateReason = this.updateReason.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);

    this.state = {
      reasonData: [],
      export_all_data: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      reason_id: "",
      reason: "",
      remark: "",
      _create: false,
      double_error: "",
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        { key: 'reason_id', _style: { width: "25%" }, label: props.language_data.filter(item => item.label === 'reason_id')[0][props.selected_language] },
        { key: "reason", _style: { width: "25%" }, label: props.language_data.filter(item => item.label === 'reason')[0][props.selected_language] },
        { key: "remark", sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: "buttonGroups", label: "", _style: { width: "84px" } },
      ],
      header: [
        { key: 'reason_id', label: props.language_data.filter(item => item.label === 'reason_id')[0][props.selected_language] },
        { key: 'reason', label: props.language_data.filter(item => item.label === 'reason')[0][props.selected_language] },
        { key: 'remark', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] },
        { key: '_id', label: "Id" },
      ],
    };
  }

  componentDidMount() {
    this.getAllReason();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          { key: 'reason_id', _style: { width: "25%" }, label: nextProps.language_data.filter(item => item.label === 'reason_id')[0][nextProps.selected_language] },
          { key: "reason", _style: { width: "25%" }, label: nextProps.language_data.filter(item => item.label === 'reason')[0][nextProps.selected_language] },
          { key: "remark", sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: "buttonGroups", label: "", _style: { width: "84px" } },
        ],
        header: [
          { key: 'reason_id', label: nextProps.language_data.filter(item => item.label === 'reason_id')[0][nextProps.selected_language] },
          { key: 'reason', label: nextProps.language_data.filter(item => item.label === 'reason')[0][nextProps.selected_language] },
          { key: 'remark', label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] },
          { key: '_id', label: "Id" },
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
    axios.post(Config.ServerUri + '/upload_reason_csv', {
      data: result
    })
      .then((res) => {
        this.setState({ reasonData: res.data });
        toast.success('Reason CSV file successfully imported');
      });
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "reason") {
      var found = false;
      for (var i in this.state.reasonData) {
        var item = this.state.reasonData[i];
        if (item.reason === value && item._id !== this.state.current_id) {
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
                ? this.createReason
                : this.updateReason
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Reason ID</CLabel>
              <CInput
                name="reason_id"
                value={this.state.reason_id}
                onChange={this.handleInputChange}
                required
              />
              {
                this.state.current_id === '' && this.state.reasonData.filter(reason => reason.reason_id === this.state.reason_id).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>Reason id already exist</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Reason</CLabel>
              <CInput
                name="reason"
                value={this.state.reason}
                onChange={this.handleInputChange}
                required
              />
              {
                this.state.current_id === '' && this.state.reasonData.filter(reason => reason.reason === this.state.reason).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>Reason already exist</div>
              }
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
            onClick={() => {
              this.on_create_clicked();
            }}
          >
            <i className="fa fa-plus" />
            <span style={{ padding: "4px" }} />
            {this.state.create_new_label}
          </CButton>
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
            filename="Export-Reason.csv"
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
            items={this.state.reasonData}
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
          <CModalBody>Do you really want to delete current reason?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteReason()}>
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
                ? "Create New Reason"
                : "Update Reason"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllReason() {
    axios.get(Config.ServerUri + "/get_all_reason")
      .then((res) => {
        this.setState({
          export_all_data: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
          reasonData: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => { });
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });

    this.setModal_Delete(true);
  }

  on_create_clicked() {
    let id = 1;
    if (this.state.reasonData.filter(c => c.name !== 'Default').length > 0) {
      const max_id = Math.max.apply(Math, this.state.reasonData.filter(c => c.name !== 'Default').map(data => data.reason_id));
      if (max_id === this.state.reasonData.filter(c => c.name !== 'Default').length) {
        id = max_id + 1
      } else {
        var a = this.state.reasonData.filter(c => c.name !== 'Default').map(data => Number(data.reason_id));
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
      current_id: "",
      reason_id: id,
      reason: "",
      remark: "",
      _create: true,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      reason_id: item.reason_id,
      reason: item.reason,
      remark: item.remark,
      _create: false,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  deleteReason() {
    this.setModal_Delete(false);

    axios
      .post(Config.ServerUri + "/delete_reason", {
        id: this.state.current_id,
      })
      .then((res) => {
        toast.success("Reason successfully deleted");
        this.setState({
          export_all_data: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
          reasonData: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => toast.error(error.response.data.message));
  }

  createReason(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;
    if (this.state.reasonData.filter(data => data.reason_id === this.state.reason_id).length > 0) {
      this.setState({ double_error: "Value already exists" });
      return;
    }

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/create_reason", {
        reason_id: this.state.reason_id,
        reason: this.state.reason,
        remark: this.state.remark,
      })
      .then((res) => {
        toast.success("Reason successfully created");
        this.setState({
          export_all_data: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
          reasonData: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => { });
  }

  updateReason(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/update_reason", {
        id: this.state.current_id,
        reason_id: this.state.reason_id,
        reason: this.state.reason,
        remark: this.state.remark,
      })
      .then((res) => {
        toast.success("Reason successfully updated");
        this.setState({
          export_all_data: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
          reasonData: res.data.sort((a, b) => {
            return a.reason_id > b.reason_id ? 1 : -1;
          }),
        });
      })
      .catch((error) => { });
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
