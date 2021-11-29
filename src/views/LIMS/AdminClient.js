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
  CValidFeedback,
  CInvalidFeedback,
} from "@coreui/react";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';
import { toast } from "react-hot-toast";


const axios = require("axios");
const Config = require("../../Config.js");
export default class AdminClient extends Component {
  constructor(props) {
    super(props);
    this.getAllClients = this.getAllClients.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.createClient = this.createClient.bind(this);
    this.updateClient = this.updateClient.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.state = {
      clientsData: [],
      export_all_data: [],
      modal_delete: false,
      modal_create: false,
      current_id: null,
      name: "",
      clientId: "",
      other: "",
      countryL: "",
      zipCodeL: "",
      cityL: "",
      addressL: "",
      address2L: "",
      countryB: "",
      zipCodeB: "",
      cityB: "",
      addressB: "",
      address2B: "",
      email: "",
      email2: "",
      email3: "",
      remark1: "",
      remark2: "",
      _create: false,
      double_error: "",
      import_label: props.language_data.filter(item => item.label === 'import')[0][props.selected_language],
      export_label: props.language_data.filter(item => item.label === 'export')[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
      fields: [
        { key: "name", label: props.language_data.filter(item => item.label === 'name')[0][props.selected_language] },
        { key: "clientId", label: props.language_data.filter(item => item.label === 'client_id')[0][props.selected_language] },
        { key: "other", sorter: false, label: props.language_data.filter(item => item.label === 'other')[0][props.selected_language] },
        { key: "countryL", sorter: false, label: props.language_data.filter(item => item.label === 'country')[0][props.selected_language] + ' L' },
        { key: "zipCodeL", sorter: false, label: props.language_data.filter(item => item.label === 'zip_code')[0][props.selected_language] + ' L' },
        { key: "cityL", sorter: false, label: props.language_data.filter(item => item.label === 'city')[0][props.selected_language] + ' L' },
        { key: "addressL", sorter: false, label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + ' L' },
        { key: "address2L", sorter: false, label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + '2 L' },
        { key: "countryB", sorter: false, label: props.language_data.filter(item => item.label === 'country')[0][props.selected_language] + ' B' },
        { key: "zipCodeB", sorter: false, label: props.language_data.filter(item => item.label === 'zip_code')[0][props.selected_language] + ' B' },
        { key: "cityB", sorter: false, label: props.language_data.filter(item => item.label === 'city')[0][props.selected_language] + ' B' },
        { key: "addressB", sorter: false, label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + ' B' },
        { key: "address2B", sorter: false, label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + '2 B' },
        { key: "email", sorter: false, label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] },
        { key: "email2", sorter: false, label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] + '2' },
        { key: "email3", sorter: false, label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] + '3' },
        { key: "remark1", sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] + '1' },
        { key: "remark2", sorter: false, label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] + '2' },
        { key: "buttonGroups", label: "", _style: { width: "84px" } },
      ],
      header: [
        { key: 'name', label: props.language_data.filter(item => item.label === 'name')[0][props.selected_language] },
        { key: 'clientId', label: props.language_data.filter(item => item.label === 'client_id')[0][props.selected_language] },
        { key: 'other', label: props.language_data.filter(item => item.label === 'other')[0][props.selected_language] },
        { key: 'countryL', label: props.language_data.filter(item => item.label === 'country')[0][props.selected_language] + ' L' },
        { key: 'zipCodeL', label: props.language_data.filter(item => item.label === 'zip_code')[0][props.selected_language] + ' L' },
        { key: 'cityL', label: props.language_data.filter(item => item.label === 'city')[0][props.selected_language] + ' L' },
        { key: 'addressL', label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + ' L' },
        { key: 'address2L', label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + '2 L' },
        { key: 'countryB', label: props.language_data.filter(item => item.label === 'country')[0][props.selected_language] + ' B' },
        { key: 'zipCodeB', label: props.language_data.filter(item => item.label === 'zip_code')[0][props.selected_language] + ' B' },
        { key: 'cityB', label: props.language_data.filter(item => item.label === 'city')[0][props.selected_language] + ' B' },
        { key: 'addressB', label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + ' B' },
        { key: 'address2B', label: props.language_data.filter(item => item.label === 'address')[0][props.selected_language] + '2 B' },
        { key: 'email', label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] },
        { key: 'email2', label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] + '2' },
        { key: 'email3', label: props.language_data.filter(item => item.label === 'email')[0][props.selected_language] + '3' },
        { key: 'remark1', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] + '1' },
        { key: 'remark2', label: props.language_data.filter(item => item.label === 'remark')[0][props.selected_language] + '2' },
      ],
    };
  }

  componentDidMount() {
    this.getAllClients();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(item => item.label === 'import')[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(item => item.label === 'export')[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        fields: [
          { key: "name", label: nextProps.language_data.filter(item => item.label === 'name')[0][nextProps.selected_language] },
          { key: "clientId", label: nextProps.language_data.filter(item => item.label === 'client_id')[0][nextProps.selected_language] },
          { key: "other", sorter: false, label: nextProps.language_data.filter(item => item.label === 'other')[0][nextProps.selected_language] },
          { key: "countryL", sorter: false, label: nextProps.language_data.filter(item => item.label === 'country')[0][nextProps.selected_language] + ' L' },
          { key: "zipCodeL", sorter: false, label: nextProps.language_data.filter(item => item.label === 'zip_code')[0][nextProps.selected_language] + ' L' },
          { key: "cityL", sorter: false, label: nextProps.language_data.filter(item => item.label === 'city')[0][nextProps.selected_language] + ' L' },
          { key: "addressL", sorter: false, label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + ' L' },
          { key: "address2L", sorter: false, label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + '2 L' },
          { key: "countryB", sorter: false, label: nextProps.language_data.filter(item => item.label === 'country')[0][nextProps.selected_language] + ' B' },
          { key: "zipCodeB", sorter: false, label: nextProps.language_data.filter(item => item.label === 'zip_code')[0][nextProps.selected_language] + ' B' },
          { key: "cityB", sorter: false, label: nextProps.language_data.filter(item => item.label === 'city')[0][nextProps.selected_language] + ' B' },
          { key: "addressB", sorter: false, label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + ' B' },
          { key: "address2B", sorter: false, label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + '2 B' },
          { key: "email", sorter: false, label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] },
          { key: "email2", sorter: false, label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] + '2' },
          { key: "email3", sorter: false, label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] + '3' },
          { key: "remark1", sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] + '1' },
          { key: "remark2", sorter: false, label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] + '2' },
          { key: "buttonGroups", label: "", _style: { width: "84px" } },
        ],
        header: [
          { key: 'name', label: nextProps.language_data.filter(item => item.label === 'name')[0][nextProps.selected_language] },
          { key: 'clientId', label: nextProps.language_data.filter(item => item.label === 'client_id')[0][nextProps.selected_language] },
          { key: 'other', label: nextProps.language_data.filter(item => item.label === 'other')[0][nextProps.selected_language] },
          { key: 'countryL', label: nextProps.language_data.filter(item => item.label === 'country')[0][nextProps.selected_language] + ' L' },
          { key: 'zipCodeL', label: nextProps.language_data.filter(item => item.label === 'zip_code')[0][nextProps.selected_language] + ' L' },
          { key: 'cityL', label: nextProps.language_data.filter(item => item.label === 'city')[0][nextProps.selected_language] + ' L' },
          { key: 'addressL', label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + ' L' },
          { key: 'address2L', label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + '2 L' },
          { key: 'countryB', label: nextProps.language_data.filter(item => item.label === 'country')[0][nextProps.selected_language] + ' B' },
          { key: 'zipCodeB', label: nextProps.language_data.filter(item => item.label === 'zip_code')[0][nextProps.selected_language] + ' B' },
          { key: 'cityB', label: nextProps.language_data.filter(item => item.label === 'city')[0][nextProps.selected_language] + ' B' },
          { key: 'addressB', label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + ' B' },
          { key: 'address2B', label: nextProps.language_data.filter(item => item.label === 'address')[0][nextProps.selected_language] + '2 B' },
          { key: 'email', label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] },
          { key: 'email2', label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] + '2' },
          { key: 'email3', label: nextProps.language_data.filter(item => item.label === 'email')[0][nextProps.selected_language] + '3' },
          { key: 'remark1', label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] + '1' },
          { key: 'remark2', label: nextProps.language_data.filter(item => item.label === 'remark')[0][nextProps.selected_language] + '2' },
        ],
      })
    }
  }

  async on_export_clicked() {
    await this.csvLink.link.click();
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "clientId") {
      var found = false;
      for (var i in this.state.clientsData) {
        var item = this.state.clientsData[i];
        if (item.clientId === value && item._id !== this.state.current_id) {
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
                ? this.createClient
                : this.updateClient
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Name</CLabel>
              <CInput
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>ClientID</CLabel>
              <CInput
                name="clientId"
                value={this.state.clientId}
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
              <CLabel style={{ fontWeight: "500" }}>Other</CLabel>
              <CInput
                name="other"
                value={this.state.other}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Country L</CLabel>
              <CInput
                name="countryL"
                value={this.state.countryL}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Zip Code L</CLabel>
              <CInput
                name="zipCodeL"
                value={this.state.zipCodeL}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>City L</CLabel>
              <CInput
                name="cityL"
                value={this.state.cityL}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Address L</CLabel>
              <CInput
                name="addressL"
                value={this.state.addressL}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Address2 L</CLabel>
              <CInput
                name="address2L"
                value={this.state.address2L}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Country B</CLabel>
              <CInput
                name="countryB"
                value={this.state.countryB}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Zip Code B</CLabel>
              <CInput
                name="zipCodeB"
                value={this.state.zipCodeB}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>City B</CLabel>
              <CInput
                name="cityB"
                value={this.state.cityB}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Address B</CLabel>
              <CInput
                name="addressB"
                value={this.state.addressB}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Address2 B</CLabel>
              <CInput
                name="address2B"
                value={this.state.address2B}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Email</CLabel>
              <CInput
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                autoComplete="username"
              />
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Email2</CLabel>
              <CInput
                name="email2"
                type="email"
                value={this.state.email2}
                onChange={this.handleInputChange}
                autoComplete="username"
              />
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Email3</CLabel>
              <CInput
                name="email3"
                type="email"
                value={this.state.email3}
                onChange={this.handleInputChange}
                autoComplete="username"
              />
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Remark1</CLabel>
              <CInput
                name="remark1"
                value={this.state.remark1}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Remark2</CLabel>
              <CInput
                name="remark2"
                value={this.state.remark2}
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
            style={{ margin: '0px 0px 0px 16px' }}
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
            filename="Export-Client.csv"
            data={this.state.export_all_data}
            ref={(r) => (this.csvLink = r)}
          ></CSVLink>
          <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
            <CButton
              color="info"
              className="float-right"
              style={{ margin: "0px 0px 0px 16px" }}
            //style={{margin: '16px'}}
            >
              <i className="fa fa-upload" />
              <span style={{ padding: "4px" }} />
              {this.state.import_label}
            </CButton>
          </ReactFileReader>
        </div>
        <div id="tableClients">
          <CDataTable
            items={this.state.clientsData}
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
          <CModalBody>Do you really want to delete current client?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteClient()}>
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
                ? "Create New Client"
                : "Update Client"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

  getAllClients() {
    axios.get(Config.ServerUri + '/get_all_clients')
      .then((res) => {
        this.setState({
          export_all_data: res.data,
          clientsData: res.data
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
      current_id: "",
      name: "",
      clientId: this.state.clientsData.length + 1,
      other: "",
      countryL: "",
      zipCodeL: "",
      cityL: "",
      addressL: "",
      address2L: "",
      countryB: "",
      zipCodeB: "",
      cityB: "",
      addressB: "",
      address2B: "",
      email: "",
      email2: "",
      email3: "",
      remark1: "",
      remark2: "",
      _create: true,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      name: item.name,
      clientId: item.clientId,
      other: item.other,
      countryL: item.countryL,
      zipCodeL: item.zipCodeL,
      cityL: item.cityL,
      addressL: item.addressL,
      address2L: item.address2L,
      countryB: item.countryB,
      zipCodeB: item.zipCodeB,
      cityB: item.cityB,
      addressB: item.addressB,
      address2B: item.address2B,
      email: item.email,
      email2: item.email2,
      email3: item.email3,
      remark1: item.remark1,
      remark2: item.remark2,
      _create: false,
      double_error: "",
    });

    this.setModal_Create(true);
  }

  async handleFiles(files) {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    const result = await new Promise((resolve, reject) => {
      reader.onload = function (e) {
        resolve(reader.result);
      };
    });

    axios
      .post(Config.ServerUri + "/upload_client_csv", {
        data: result,
      })
      .then((res) => {
        toast.success("Client successfully uploaded");
        this.setState({
          clientsData: res.data.clients,
        });
      })
      .catch((error) => { });
  }

  deleteClient() {
    this.setModal_Delete(false);
    axios.post(Config.ServerUri + '/delete_client', {
      id: this.state.current_id
    })
      .then((res) => {
        toast.success('Client successfully deleted');
        this.setState({
          export_all_data: res.data,
          clientsData: res.data
        });
      })
      .catch((error) => {

      })
  }

  createClient(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);

    const data = {
      name: this.state.name,
      clientId: this.state.clientId,
      other: this.state.other,
      countryL: this.state.countryL,
      zipCodeL: this.state.zipCodeL,
      cityL: this.state.cityL,
      addressL: this.state.addressL,
      address2L: this.state.address2L,
      countryB: this.state.countryB,
      zipCodeB: this.state.zipCodeB,
      cityB: this.state.cityB,
      addressB: this.state.addressB,
      address2B: this.state.address2B,
      email: this.state.email,
      email2: this.state.email2,
      email3: this.state.email3,
      remark1: this.state.remark1,
      remark2: this.state.remark2
    }

    axios.post(Config.ServerUri + '/create_client', data)
      .then((res) => {
        toast.success('Client successfully created');
        this.setState({
          export_all_data: res.data,
          clientsData: res.data
        });
      })
      .catch((error) => {

      })
  }

  updateClient(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    this.setModal_Create(false);
    const data = {
      id: this.state.current_id,
      name: this.state.name,
      clientId: this.state.clientId,
      other: this.state.other,
      countryL: this.state.countryL,
      zipCodeL: this.state.zipCodeL,
      cityL: this.state.cityL,
      addressL: this.state.addressL,
      address2L: this.state.address2L,
      countryB: this.state.countryB,
      zipCodeB: this.state.zipCodeB,
      cityB: this.state.cityB,
      addressB: this.state.addressB,
      address2B: this.state.address2B,
      email: this.state.email,
      email2: this.state.email2,
      email3: this.state.email3,
      remark1: this.state.remark1,
      remark2: this.state.remark2
    }
    axios.post(Config.ServerUri + '/update_client', data)
      .then((res) => {
        toast.success('Client successfully updated');
        this.setState({
          export_all_data: res.data,
          clientsData: res.data
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
