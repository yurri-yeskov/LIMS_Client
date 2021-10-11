import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Modal, Button, Input, Upload, Select } from "antd";
import axios from "axios";
import Config from "../../Config";
import "./style.css";
import {
  CDataTable,
  CCard,
  CForm,
  CCardBody,
  CModal,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea,
  CSelect,
} from "@coreui/react";
import { toast } from "react-hot-toast";
const { Option } = Select;

const LabField = [
  "Due Date",
  "Sample Type",
  "Material",
  "Client",
  "Packing Type",
  "Analysis Type",
  "Certificate",
  "Sending Date",
  "Sample Date",
  "Weight(actual)",
  "Charge",
  "Remark",
  "Delivering.Address.Name1",
  "Delivering.Address.Title",
  "Delivering.Address.Country",
  "Delivering.Address.Name2",
  "Delivering.Address.Name3",
  "Delivering.Address.Street",
  "Delivering.Address.ZIP",
  "CustomerProductCode",
  "E-mail Address",
  "FetchDate",
  "OrderId",
  "Pos.ID",
  "Weight(target)",
];
const AnalField = ["Analysis Type", "Norm", "Objectives", "Remark"];
const ClientField = [
  "Name",
  "Country B",
  "Zip Code B",
  "City B",
  "Address B",
  "Address2 B",
];

class AdminCertificate extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      addVisible: false,
      productdataVisible: false,
      freetextVisible: false,
      tableColVisible: false,
      samenameerror: false,
      name: "",
      certificatetitle: "",
      company: "",
      place: "",
      previewVisible: false,
      previewImage: "",
      rowid: "",
      fileList: [],
      modal_delete: false,
      previewVisible_Footer: false,
      previewImage_Footer: "",
      fileList_Footer: [],
      freetext: "",
      date_format: "DD.MM.YYYY",

      //Product Modal data variable
      P_name: "",
      P_Modal_data: [
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
      ],
      T_Modal_data: [
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
      ],
    };

    this.columns = [
      {
        key: "name",
      },
      {
        label: "Certificate Title",
        key: "certificatetitle",
      },
      {
        key: "company",
        label: "Company",
      },
      {
        key: "logo",
        label: "Logo",
        sorter: false,
      },
      {
        key: "place",
        label: "Place",
      },
      {
        key: "date_format",
        label: "Date Format",
        sorter: false,
      },
      {
        key: "productdata",
        label: "Product Data",
        sorter: false,
      },
      {
        key: "tablecolumns",
        label: "Table Columns",
        sorter: false,
      },
      {
        key: "freetext",
        label: "Free Text",
        sorter: false,
      },
      {
        key: "footer",
        label: "Footer",
        sorter: false,
      },
      {
        key: "buttonGroups",
        label: "",
      },
    ];
  }

  componentWillMount() {
    this.First();
  }
  showTableCol = (e) => {
    var tablecol_data = [
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
      { name: "", fieldname: null },
    ];
    if (e.tablecol.length > 0)
      this.setState({
        T_Modal_data: e.tablecol,
        tableColVisible: true,
        rowid: e.id,
      });
    else
      this.setState({
        T_Modal_data: tablecol_data,
        tableColVisible: true,
        rowid: e.id,
      });
  };
  FreetextModalOK = () => {
    axios
      .post(Config.ServerUri + "/update_Freetext", {
        rowid: this.state.rowid,
        text: this.state.freetext,
      })
      .then((res) => {
        if (res) {
          this.First();
          this.setState({ rowid: "", freetextVisible: false });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  FreetextModalCancel = () => {
    this.setState({ freetextVisible: false, rowid: "" });
  };
  ShowProduct = (r) => {
    var empty_Modal_data = [
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
      { name: "", pagename: null, fieldname: "" },
    ];
    if (r.productdata.productData.length > 0)
      this.setState({
        P_name: r.productdata.productTitle,
        P_Modal_data: r.productdata.productData,
        productdataVisible: true,
        rowid: r.id,
      });
    else
      this.setState({
        P_name: r.productdata.productTitle,
        productdataVisible: true,
        rowid: r.id,
        P_Modal_data: empty_Modal_data,
      });
  };
  First = () => {
    axios
      .get(Config.ServerUri + "/get_certificate")
      .then((res) => {
        if (res) {
          var data = res.data.map((v, i) => {
            return {
              id: v._id,
              key: i,
              name: v.name,
              company: v.company,
              logo: v.logo.path,
              certificatetitle: v.certificatetitle,
              logodata: v.logo,
              productdata: v.productdata,
              place: v.place,
              tablecol: v.tablecol,
              date_format: v.date_format,
              freetext: v.freetext,
              footer: v.footer.path,
              footerdata: v.footer,
              logoUid: v.logoUid,
              footerUid: v.footerUid,
            };
          });
          this.setState({ data });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  addData = () => {
    this.setState({
      addVisible: true,
      name: "",
      company: "",
      certificatetitle: "",
      fileList: [],
      place: "",
      productdata: "",
      tablecol: "",
      freetext: "",
      fileList_Footer: [],
      rowid: "",
      date_format: "DD.MM.YYYY",
    });
  };
  KhandleCancel = () => {
    this.setState({ addVisible: false, rowid: "" });
  };
  on_update_clicked = (e) => {
    var logodata = {
      originFileObj: { uid: e.logoUid },
      url: e.logo.substr(e.logo.indexOf("public\\") + 6, e.logo.length),
    };
    var footerdata = {
      originFileObj: { uid: e.footerUid },
      url: e.footer.substr(e.footer.indexOf("public\\") + 6, e.footer.length),
    };
    this.setState({
      name: e.name,
      company: e.company,
      rowid: e.id,
      certificatetitle: e.certificatetitle,
      place: e.place,
      fileList_Footer: [footerdata],
      fileList: [logodata],
      addVisible: true,
      date_format: e.date_format,
    });
  };

  date_format_func = (e) => this.setState({ date_format: e });

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true,
    });
  };

  handleUpload = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      name,
      certificatetitle,
      fileList_Footer,
      fileList,
      company,
      place,
      rowid,
      samenameerror,
      date_format,
    } = this.state;
    let formData = new FormData();
    var arr = [];
    if (
      fileList.length == 0 ||
      fileList_Footer.length == 0 ||
      samenameerror == true
    ) {
      return;
    }
    this.setState({ addVisible: false });
    arr.push(fileList[0].originFileObj);
    arr.push(fileList_Footer[0].originFileObj);
    for (let i = 0; i < 2; i++) {
      formData.append("files", arr[i]);
    }
    formData.append("logoUid", fileList[0].originFileObj.uid);
    formData.append("footerUid", fileList_Footer[0].originFileObj.uid);
    formData.append("name", name);
    formData.append("company", company);
    formData.append("place", place);
    formData.append("rowid", rowid);
    formData.append("certificatetitle", certificatetitle);
    formData.append("date_format", date_format);

    axios
      .post(Config.ServerUri + "/add_certificate", formData)
      .then((res) => {
        if (res) {
          toast.success(rowid ? "successfully updated" : "successfully added");
          this.First();
          this.setState({ rowid: "" });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  handleDelete = (id) => {
    axios
      .post(Config.ServerUri + "/del_certificate", { id })
      .then((res) => {
        if (res) {
          toast.success("successfully deleted");
          this.First();
          this.setState({ rowid: "", modal_delete: false });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  ProductPageSelect = (e, i) => {
    let { P_Modal_data } = this.state;
    P_Modal_data[i].pagename = e;
    P_Modal_data[i].fieldname = "";
    this.setState({ P_Modal_data });
  };
  ProductFieldSelect = (e, i) => {
    let { P_Modal_data } = this.state;
    P_Modal_data[i].fieldname = e;
    this.setState({ P_Modal_data });
  };
  ProductFieldInput = (e, i) => {
    let { P_Modal_data } = this.state;
    P_Modal_data[i].name = e.target.value;
    this.setState({ P_Modal_data });
  };
  TableFieldInput = (e, i) => {
    let { T_Modal_data } = this.state;
    T_Modal_data[i].name = e.target.value;
    this.setState({ T_Modal_data });
  };
  TablePageSelect = (e, i) => {
    let { T_Modal_data } = this.state;
    T_Modal_data[i].fieldname = e;
    this.setState({ T_Modal_data });
  };

  handleUpload_footer = ({ fileList }) => {
    this.setState({ fileList_Footer: fileList });
  };
  handleCancel_footer = () => this.setState({ previewVisible_Footer: false });

  handlePreview_footer = (file) => {
    this.setState({
      previewImage_Footer: file.thumbUrl,
      previewVisible_Footer: true,
    });
  };

  onChangeInput = (e) => {
    const { data } = this.state;
    var err = data.filter((v) => v.name == e.target.value).length;
    if (e.target.name == "name") {
      this.setState({
        [e.target.name]: e.target.value,
        samenameerror: err > 0 ? true : false,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  ProductModalCancel = () => {
    this.setState({ productdataVisible: false, rowid: "" });
  };
  ProductModalOK = () => {
    const { P_name, P_Modal_data, rowid } = this.state;
    axios
      .post(Config.ServerUri + "/update_productdata", {
        title: P_name,
        data: P_Modal_data,
        rowid,
      })
      .then((res) => {
        if (res) {
          this.First();
          this.setState({ rowid: "", productdataVisible: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  TableColOK = () => {
    const { T_Modal_data, rowid } = this.state;
    axios
      .post(Config.ServerUri + "/update_tabledata", {
        data: T_Modal_data,
        rowid,
      })
      .then((res) => {
        if (res) {
          this.First();
          this.setState({ rowid: "", tableColVisible: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  TableColCancel = () => {
    this.setState({ tableColVisible: false, rowid: "" });
  };
  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      previewVisible_Footer,
      previewImage_Footer,
      fileList_Footer,
      name,
      certificatetitle,
      company,
      place,
      date_format,
      productdataVisible,
    } = this.state;
    const uploadButton = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const uploadButton_Footer = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <CButton
          color="info"
          className="float-right"
          style={{ margin: "0 0 0 10px" }}
          onClick={() => {
            this.addData();
          }}
        >
          <i className="fa fa-plus" />
          <span style={{ padding: "4px" }} />
          Create New
        </CButton>
        <CDataTable
          items={this.state.data}
          fields={this.columns}
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
                  <div>
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
                      onClick={() =>
                        this.setState({ modal_delete: true, rowid: item.id })
                      }
                    >
                      <i className="fa fa-trash" />
                    </CButton>
                  </div>
                </td>
              );
            },
            logo: (item, index) => {
              var str = item.logo.substr(
                item.logo.indexOf("public\\") + 6,
                item.logo.length
              );
              return (
                <td>
                  <img src={str} width="50px" height="50px" />
                </td>
              );
            },
            footer: (item, index) => {
              var str = item.footer.substr(
                item.footer.indexOf("public\\") + 6,
                item.footer.length
              );
              return (
                <td>
                  <img src={str} width="50px" height="50px" />
                </td>
              );
            },
            productdata: (item, index) => {
              return (
                <td>
                  <a onClick={() => this.ShowProduct(item)}>
                    {item.productdata.productTitle
                      ? item.productdata.productTitle
                      : "N/A"}
                  </a>
                </td>
              );
            },
            freetext: (item, index) => {
              return (
                <td>
                  <a
                    onClick={() =>
                      this.setState({
                        freetext: item.freetext,
                        freetextVisible: true,
                        rowid: item.id,
                      })
                    }
                  >
                    {item.freetext ? item.freetext.substr(0, 5) + "..." : "N/A"}
                  </a>
                </td>
              );
            },
            tablecolumns: (item, index) => {
              var filterdata = 0;
              if (item.tablecol.length == 0) filterdata = 0;
              else {
                filterdata = item.tablecol.filter(
                  (v) => v.name || v.fieldname
                ).length;
              }
              return (
                <td>
                  <CButton
                    color="info"
                    style={{ width: "100px", fontSize: "20px" }}
                    onClick={() => this.showTableCol(item)}
                  >
                    <i
                      className={
                        filterdata != 0 ? "fa fa-check-circle" : "fa fa-ban"
                      }
                    />
                  </CButton>
                </td>
              );
            },
          }}
        />
        <CModal
          show={this.state.addVisible}
          onClose={this.KhandleCancel}
          centered={true}
          style={{ width: "50vw" }}
          closeOnBackdrop={false}
        >
          <CModalHeader>
            <h4>Certificate Template</h4>
          </CModalHeader>
          <CModalBody>
            <CCard>
              <CCardBody>
                <CForm className="was-validated">
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>Name</CLabel>
                    <CInput
                      style={{ width: "100%" }}
                      value={name}
                      name="name"
                      onChange={this.onChangeInput}
                      required
                    />
                    {this.state.samenameerror && (
                      <CLabel style={{ color: "red" }}>
                        Name already exists
                      </CLabel>
                    )}
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>
                      Certificate Title
                    </CLabel>
                    <CInput
                      style={{ width: "100%" }}
                      value={certificatetitle}
                      name="certificatetitle"
                      onChange={this.onChangeInput}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>Company</CLabel>
                    <CInput
                      value={company}
                      name="company"
                      onChange={this.onChangeInput}
                    />
                  </CFormGroup>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CFormGroup>
                        <CLabel style={{ fontWeight: "500" }}>Logo</CLabel>
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onChange={this.handleUpload}
                          beforeUpload={() => false}
                        >
                          {fileList.length > 0 ? "" : uploadButton}
                        </Upload>
                        <Modal
                          visible={previewVisible}
                          footer={null}
                          onCancel={this.handleCancel}
                        >
                          <img
                            alt="example"
                            style={{ width: "100%" }}
                            src={previewImage}
                          />
                        </Modal>
                      </CFormGroup>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CFormGroup>
                        <CLabel style={{ fontWeight: "500" }}>Footer</CLabel>
                        <Upload
                          listType="picture-card"
                          fileList={fileList_Footer}
                          onPreview={this.handlePreview_footer}
                          onChange={this.handleUpload_footer}
                          beforeUpload={() => false}
                        >
                          {fileList_Footer.length > 0
                            ? ""
                            : uploadButton_Footer}
                        </Upload>
                        <Modal
                          visible={previewVisible_Footer}
                          footer={null}
                          onCancel={this.handleCancel_footer}
                        >
                          <img
                            alt="example"
                            style={{ width: "100%" }}
                            src={previewImage_Footer}
                          />
                        </Modal>
                      </CFormGroup>
                    </div>
                  </div>

                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>place</CLabel>
                    <CInput
                      value={place}
                      name="place"
                      onChange={this.onChangeInput}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel style={{ fontWeight: "500" }}>Date Format</CLabel>
                    <Select
                      placeholder="Please select your Date Format"
                      className="form-control"
                      value={date_format}
                      onChange={this.date_format_func}
                    >
                      <Option value="DD.MM.YYYY">DD.MM.YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="YYYY/MM/DD">YYYY/MM/dd</Option>
                    </Select>
                  </CFormGroup>
                </CForm>
              </CCardBody>
            </CCard>
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={this.handleSubmit}>
              {this.state.rowid ? "Update" : "Create"}
            </CButton>
            <CButton color="secondary" onClick={this.KhandleCancel}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={this.state.modal_delete}
          onClose={() => this.setState({ modal_delete: false, rowid: "" })}
        >
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current user type?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="danger"
              onClick={() => this.handleDelete(this.state.rowid)}
            >
              Delete
            </CButton>
            <CButton
              color="secondary"
              onClick={() => this.setState({ modal_delete: false, rowid: "" })}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          style={{ width: "70vw" }}
          centered={true}
          size="xl"
          show={productdataVisible}
          onClose={this.ProductModalCancel}
        >
          <CModalHeader>
            <h3>Product Data</h3>
          </CModalHeader>
          <CModalBody>
            <table width="100%">
              <tbody>
                <tr>
                  <td colSpan={4} style={{ height: "50px" }} align="center">
                    Product Name:{" "}
                    <CInput
                      style={{ width: "20vw" }}
                      value={this.state.P_name}
                      onChange={(e) =>
                        this.setState({ P_name: e.target.value })
                      }
                    />
                  </td>
                </tr>
                {this.state.P_Modal_data.map((v, i) => (
                  <tr key={i} style={{ height: "50px" }}>
                    <td width="10%" align="center">
                      Field{i + 1}
                    </td>
                    <td width="40%" align="center">
                      <CInput
                        value={v.name}
                        onChange={(e) => {
                          this.ProductFieldInput(e, i);
                        }}
                      />
                    </td>
                    <td width="20%" align="center">
                      <Select
                        style={{ width: "80%" }}
                        value={v.pagename}
                        onChange={(e) => {
                          this.ProductPageSelect(e, i);
                        }}
                      >
                        <Option value={0}>Laboratory</Option>
                        <Option value={1}>Analysis Types</Option>
                        <Option value={2}>Client</Option>
                      </Select>
                    </td>
                    <td width="30%" align="center">
                      <Select
                        style={{ width: "80%" }}
                        value={v.fieldname}
                        onChange={(e) => {
                          this.ProductFieldSelect(e, i);
                        }}
                      >
                        {v.pagename === 0 &&
                          LabField.map((vl, il) => (
                            <Option value={vl} key={il + "l"}>
                              {vl}
                            </Option>
                          ))}
                        {v.pagename === 1 &&
                          AnalField.map((vl, il) => (
                            <Option value={vl} key={il + "a"}>
                              {vl}
                            </Option>
                          ))}
                        {v.pagename === 2 &&
                          ClientField.map((vl, il) => (
                            <Option value={vl} key={il + "c"}>
                              {vl}
                            </Option>
                          ))}
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={this.ProductModalOK}>
              OK
            </CButton>
            <CButton color="secondary" onClick={this.ProductModalCancel}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          show={this.state.tableColVisible}
          centered={true}
          style={{ width: "50vw" }}
          size="xl"
          onClose={this.TableColCancel}
        >
          <CModalHeader>
            <h4>Table Columns</h4>
          </CModalHeader>
          <CModalBody>
            <table width="100%">
              <tbody>
                {this.state.T_Modal_data.map((v, i) => (
                  <tr key={i}>
                    <td width="10%" align="center">
                      Field{i + 1}
                    </td>
                    <td width="40%" style={{ height: "50px" }} align="center">
                      <CInput
                        value={v.name}
                        onChange={(e) => {
                          this.TableFieldInput(e, i);
                        }}
                      />
                    </td>
                    <td width="50%" align="center">
                      <Select
                        style={{ width: "80%" }}
                        value={v.fieldname}
                        onChange={(e) => {
                          this.TablePageSelect(e, i);
                        }}
                      >
                        <Option value={0}>Analysis Types</Option>
                        <Option value={1}>Value</Option>
                        <Option value={2}>Author</Option>
                        <Option value={3}>Date</Option>
                        <Option value={4}>Reason</Option>
                        <Option value={5}>Specification</Option>
                        <Option value={6}>Comment</Option>
                        <Option value={7}>Certificate Type</Option>
                        <Option value={8}>AnalysisType-Objective</Option>
                        <Option value={9}>Norm</Option>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={this.TableColOK}>
              OK
            </CButton>
            <CButton color="secondary" onClick={this.TableColCancel}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={this.state.freetextVisible}
          onClose={this.FreetextModalCancel}
          centered={true}
          style={{ width: "70vw" }}
          size="xl"
        >
          <CModalHeader>
            <h4>FreeText</h4>
          </CModalHeader>
          <CModalBody>
            <CTextarea
              rows={10}
              value={this.state.freetext}
              onChange={(e) => this.setState({ freetext: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={this.FreetextModalOK}>
              OK
            </CButton>
            <CButton color="secondary" onClick={this.FreetextModalCancel}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AdminCertificate);
