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
  CSelect,
  CForm,
  CFormGroup,
  CValidFeedback,
  CInvalidFeedback,
  CLabel,
  CInput,
} from "@coreui/react";

import { CSVLink } from "react-csv";
import ReactFileReader from "react-file-reader";
import { toast } from "react-hot-toast";

import axios from "axios";
import Config from "../../Config.js";

export default class AdminUser extends Component {
  constructor(props) {
    super(props);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      usersData: [],
      userTypesData: [],
      isMatched: true,
      modal_delete: false,
      modal_create: false,
      current_id: null,
      user_id: "",
      userName: "",
      password: "",
      new_password: "",
      confirm_password: "",
      email: "",
      userType: 0,
      remark: "",
      double_error: "",
      export_all_data: [],
      import_label: props.language_data.filter(
        (item) => item.label === "import"
      )[0][props.selected_language],
      export_label: props.language_data.filter(
        (item) => item.label === "export"
      )[0][props.selected_language],
      create_new_label: props.language_data.filter(
        (item) => item.label === "create_new"
      )[0][props.selected_language],
      user_id_label: props.language_data.filter(
        (item) => item.label === "user_id"
      )[0][props.selected_language],
      user_name_label: props.language_data.filter(
        (item) => item.label === "user_name"
      )[0][props.selected_language],
      email_label: props.language_data.filter(
        (item) => item.label === "email"
      )[0][props.selected_language],
      password_label: props.language_data.filter(
        (item) => item.label === "password"
      )[0][props.selected_language],
      user_type_label: props.language_data.filter(
        (item) => item.label === "user_type"
      )[0][props.selected_language],
      remark_label: props.language_data.filter(
        (item) => item.label === "remark"
      )[0][props.selected_language],
      selected_language: props.selected_language,
      fields: [
        {
          key: "user_id",
          label: props.language_data.filter(
            (item) => item.label === "user_id"
          )[0][props.selected_language],
        },
        {
          key: "userName",
          label: props.language_data.filter(
            (item) => item.label === "user_name"
          )[0][props.selected_language],
        },
        {
          key: "email",
          sorter: false,
          label: props.language_data.filter(
            (item) => item.label === "email"
          )[0][props.selected_language],
        },
        {
          key: "password",
          sorter: false,
          label: props.language_data.filter(
            (item) => item.label === "password"
          )[0][props.selected_language],
        },
        {
          key: "userType",
          label: props.language_data.filter(
            (item) => item.label === "user_type"
          )[0][props.selected_language],
        },
        {
          key: "remark",
          sorter: false,
          label: props.language_data.filter(
            (item) => item.label === "remark"
          )[0][props.selected_language],
        },
        { key: "buttonGroups", label: "", _style: { width: "84px" } },
      ],
      header: [
        {
          key: "user_id",
          label: props.language_data.filter(
            (item) => item.label === "user_id"
          )[0][props.selected_language],
        },
        {
          key: "userName",
          label: props.language_data.filter(
            (item) => item.label === "user_name"
          )[0][props.selected_language],
        },
        {
          key: "email",
          label: props.language_data.filter(
            (item) => item.label === "email"
          )[0][props.selected_language],
        },
        {
          key: "password",
          label: props.language_data.filter(
            (item) => item.label === "password"
          )[0][props.selected_language],
        },
        {
          key: "user_type",
          label: props.language_data.filter(
            (item) => item.label === "user_type"
          )[0][props.selected_language],
        },
        {
          key: "remark",
          label: props.language_data.filter(
            (item) => item.label === "remark"
          )[0][props.selected_language],
        },
        {
          key: "_id",
          label: 'Id',
        },
      ],
    };
  }

  componentDidMount() {
    this.getAllUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        import_label: nextProps.language_data.filter(
          (item) => item.label === "import"
        )[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(
          (item) => item.label === "export"
        )[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(
          (item) => item.label === "create_new"
        )[0][nextProps.selected_language],
        user_id_label: nextProps.language_data.filter(
          (item) => item.label === "user_id"
        )[0][nextProps.selected_language],
        user_name_label: nextProps.language_data.filter(
          (item) => item.label === "user_name"
        )[0][nextProps.selected_language],
        email_label: nextProps.language_data.filter(
          (item) => item.label === "email"
        )[0][nextProps.selected_language],
        password_label: nextProps.language_data.filter(
          (item) => item.label === "password"
        )[0][nextProps.selected_language],
        user_type_label: nextProps.language_data.filter(
          (item) => item.label === "user_type"
        )[0][nextProps.selected_language],
        remark_label: nextProps.language_data.filter(
          (item) => item.label === "remark"
        )[0][nextProps.selected_language],
        selected_language: nextProps.selected_language,
        fields: [
          {
            key: "user_id",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_id"
            )[0][nextProps.selected_language],
          },
          {
            key: "userName",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_name"
            )[0][nextProps.selected_language],
          },
          {
            key: "email",
            sorter: false,
            label: nextProps.language_data.filter(
              (item) => item.label === "email"
            )[0][nextProps.selected_language],
          },
          {
            key: "password",
            sorter: false,
            label: nextProps.language_data.filter(
              (item) => item.label === "password"
            )[0][nextProps.selected_language],
          },
          {
            key: "userType",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_type"
            )[0][nextProps.selected_language],
          },
          {
            key: "remark",
            sorter: false,
            label: nextProps.language_data.filter(
              (item) => item.label === "remark"
            )[0][nextProps.selected_language],
          },
          { key: "buttonGroups", label: "", _style: { width: "84px" } },
        ],
        header: [
          {
            key: "user_id",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_id"
            )[0][nextProps.selected_language],
          },
          {
            key: "userName",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_name"
            )[0][nextProps.selected_language],
          },
          {
            key: "email",
            label: nextProps.language_data.filter(
              (item) => item.label === "email"
            )[0][nextProps.selected_language],
          },
          {
            key: "password",
            label: nextProps.language_data.filter(
              (item) => item.label === "password"
            )[0][nextProps.selected_language],
          },
          {
            key: "user_type",
            label: nextProps.language_data.filter(
              (item) => item.label === "user_type"
            )[0][nextProps.selected_language],
          },
          {
            key: "remark",
            label: nextProps.language_data.filter(
              (item) => item.label === "remark"
            )[0][nextProps.selected_language],
          },
          {
            key: "_id",
            label: 'Id',
          },
        ],
      });
    }
  }

  getUserType(userType) {
    var result = "Unknown";
    this.state.userTypesData.map((item, i) => {
      if (item._id === userType) result = item.userType;
      return true;
    });
    return result;
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
      };
    });
    axios.post(Config.ServerUri + "/upload_user_csv", { data: result })
      .then((res) => {
        const user_list = res.data.users.map(user => {
          return {
            user_id: user.user_id,
            userName: user.userName,
            email: user.email,
            password: user.password_text !== undefined ? user.password_text : '',
            user_type: user.user_type,
            remark: user.remark
          }
        })
        this.setState({
          export_all_data: user_list.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          usersData: res.data.users.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          userTypesData: res.data.userTypes,
        });
        toast.success("User CSV file successfully imported");
      });
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;

    if (name === "userName") {
      var found = false;
      for (var i in this.state.usersData) {
        var item = this.state.usersData[i];
        if (item.userName === value && item._id !== this.state.current_id) {
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

  getAllUsers() {
    axios.get(Config.ServerUri + "/get_all_users")
      .then((res) => {
        const user_list = res.data.users.map(user => {
          return {
            user_id: user.user_id,
            userName: user.userName,
            email: user.email,
            password: user.password_text !== undefined ? user.password_text : '',
            user_type: user.user_type,
            remark: user.remark,
            _id: user._id
          }
        })
        this.setState({
          export_all_data: user_list.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          usersData: res.data.users.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          userTypesData: res.data.userTypes,
        });
      })
      .catch((error) => { });
  }

  on_create_clicked() {
    let id = 1;
    if (this.state.usersData.length > 0) {
      const max_id = Math.max.apply(Math, this.state.usersData.map(data => data.user_id));
      if (max_id === this.state.usersData.length) {
        id = max_id + 1
      } else {
        var a = this.state.usersData.map(data => Number(data.user_id));
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
      user_id: id,
      userName: "",
      email: "",
      password: "",
      userType: "",
      remark: "",
      double_error: "",
      new_password: "",
      confirm_password: "",
      modal_create: true
    });
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      user_id: item.user_id,
      userName: item.userName,
      email: item.email,
      password: `${item.password.slice(0, 20)}...`,
      userType: this.state.userTypesData.filter(uType => uType.userType === item.user_type)[0]._id,
      remark: item.remark,
      double_error: "",
      new_password: "",
      confirm_password: "",
      modal_create: true
    });
  }

  deleteUser() {
    this.setState({
      modal_delete: false
    })

    axios.post(Config.ServerUri + "/delete_user", {
      id: this.state.current_id,
    }).then((res) => {
      const user_list = res.data.users.map(user => {
        return {
          user_id: user.user_id,
          userName: user.userName,
          email: user.email,
          password: user.password_text !== undefined ? user.password_text : '',
          user_type: user.user_type,
          remark: user.remark
        }
      })
      toast.success("User successfully deleted");
      this.setState({
        export_all_data: user_list.sort((a, b) => {
          return a.user_id > b.user_id ? 1 : -1;
        }),
        usersData: res.data.users.sort((a, b) => {
          return a.user_id > b.user_id ? 1 : -1;
        }),
        userTypesData: res.data.userTypes,
      });
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  createUser(event) {
    event.preventDefault();
    var last_userid = 0;
    if (this.state.user_id === "") {
      last_userid = 1;
    } else {
      last_userid = this.state.user_id;
    }
    if (this.state.user_id.toString().split(".").length > 1 || this.state.user_id.toString().split("-").length > 1) {
      toast.error("User ID Error");
      return;
    }
    if (this.state.usersData.filter((e) => e.auto_id === last_userid).length > 0) {
      toast.error("User ID Repeated");
      return;
    }
    if (this.state.double_error !== "") return;
    if (this.state.usersData.filter(data => data.user_id === this.state.user_id).length > 0) {
      this.setState({ double_error: "Value already exists" });
      return;
    }
    this.setState({
      modal_create: false
    })
    axios
      .post(Config.ServerUri + "/create_user", {
        user_id: last_userid,
        userName: this.state.userName,
        email: this.state.email,
        password: this.state.password,
        userType: this.state.userType,
        remark: this.state.remark,
      })
      .then((res) => {
        const user_list = res.data.users.map(user => {
          return {
            user_id: user.user_id,
            userName: user.userName,
            email: user.email,
            password: user.password_text !== undefined ? user.password_text : '',
            user_type: user.user_type,
            remark: user.remark
          }
        })
        toast.success("User successfully created");
        this.setState({
          export_all_data: user_list.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          usersData: res.data.users.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          userTypesData: res.data.userTypes,
        });
      })
      .catch((error) => { });
  }

  updateUser(event) {
    event.preventDefault();
    if (this.state.new_password !== "" && this.state.new_password !== this.state.confirm_password) {
      this.setState({ isMatched: false })
      return;
    }
    if (this.state.double_error !== "") return;
    const data = {
      id: this.state.current_id,
      user_id: this.state.user_id,
      userName: this.state.userName,
      email: this.state.email,
      password: this.state.password,
      new_password: this.state.new_password,
      userType: this.state.userType,
      remark: this.state.remark
    }
    axios.post(Config.ServerUri + "/update_user", data)
      .then((res) => {
        const user_list = res.data.users.map(user => {
          return {
            user_id: user.user_id,
            userName: user.userName,
            email: user.email,
            password: user.password_text !== undefined ? user.password_text : '',
            user_type: user.user_type,
            remark: user.remark
          }
        })
        toast.success("User successfully updated");
        this.setState({
          export_all_data: user_list.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          usersData: res.data.users.sort((a, b) => {
            return a.user_id > b.user_id ? 1 : -1;
          }),
          userTypesData: res.data.userTypes,
          modal_create: false
        });
      })
      .catch(err => console.log(err.response.data));
  }

  renderModalCreate() {
    var error = this.state.double_error;

    return (
      <CCard>
        <CCardBody>
          <CForm
            className="was-validated"
            onSubmit={
              this.state.current_id === "" ? this.createUser : this.updateUser
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.user_id_label}
              </CLabel>
              <CInput
                name="user_id"
                value={this.state.user_id}
                onChange={this.handleInputChange}
                type="number"
              />
              {
                this.state.current_id === '' && this.state.usersData.filter(user => user.user_id === this.state.user_id).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>User id already exist</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.user_name_label}
              </CLabel>
              <CInput
                name="userName"
                value={this.state.userName}
                onChange={this.handleInputChange}
                required
              />
              {
                this.state.current_id === '' && this.state.usersData.filter(user => user.userName === this.state.userName).length > 0 &&
                <div className="mt-1" style={{ fontSize: '80%', color: '#e55353' }}>UserName already exist</div>
              }
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.email_label}
              </CLabel>
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
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.password_label}
              </CLabel>
              {
                this.state.current_id === '' ? (
                  <CInput
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                  />
                ) : (
                  <CInput
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                    disabled
                  />
                )
              }
              <CInvalidFeedback className="help-block">
                Please provide a valid information
              </CInvalidFeedback>
              <CValidFeedback className="help-block">
                Input provided
              </CValidFeedback>
            </CFormGroup>
            {
              this.state.current_id !== "" && (
                <>
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>
                      New Password
                    </CLabel>
                    <CInput
                      type="password"
                      value={this.state.new_password}
                      onChange={(e) => this.setState({ new_password: e.target.value, isMatched: true })}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>
                      Confirm Password
                    </CLabel>
                    <CInput
                      type="password"
                      value={this.state.confirm_password}
                      onChange={(e) => this.setState({ confirm_password: e.target.value, isMatched: true })}
                    />
                    {
                      !this.state.isMatched && (
                        <CInvalidFeedback className="help-block d-block">
                          New password does not matched
                        </CInvalidFeedback>
                      )
                    }
                  </CFormGroup>
                </>
              )
            }
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.user_type_label}
              </CLabel>
              <CSelect
                custom
                name="userType"
                value={this.state.userType}
                onChange={this.handleInputChange}
                required
              >
                <option value="" disabled></option>
                {this.state.userTypesData.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.userType}
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
              <CLabel style={{ fontWeight: "500" }}>
                {this.state.remark_label}
              </CLabel>
              <CInput
                name="remark"
                value={this.state.remark}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <div className="float-right">
              <CButton type="submit" color="info">
                {this.state.current_id === "" ? "Create" : "Update"}
              </CButton>
              <span style={{ padding: "4px" }} />
              <CButton
                color="secondary"
                onClick={() => this.setState({
                  modal_create: false
                })}
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
            filename="Export-User.csv"
            data={this.state.export_all_data}
            ref={(r) => (this.csvLink = r)}
          ></CSVLink>
          <ReactFileReader handleFiles={this.handleFiles} fileTypes={".csv"}>
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
        <div>
          <CDataTable
            items={this.state.usersData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              user_id: (item) => <td>{item.user_id}</td>,
              userType: (item) => <td>{item.user_type}</td>,
              remark: (item) => <td>{item.remark}</td>,
              password: (item) => <td>{item.password.slice(0, 20)}...</td>,
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
                        onClick={() => this.setState({ current_id: item._id, modal_delete: true })}
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
          onClose={() => this.setState({ modal_delete: false })}
        >
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>Do you really want to delete current user?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteUser()}>
              Delete
            </CButton>{" "}
            <CButton
              color="secondary"
              onClick={() => this.setState({ modal_delete: false })}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        {

        }
        <CModal
          style={{ width: "40vw" }}
          show={this.state.modal_create}
          onClose={() => this.setState({ modal_create: false })}
          closeOnBackdrop={false}
          centered
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>
              {this.state.current_id === "" ? "Create New User" : "Update User"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>
      </div>
    );
  }

}
