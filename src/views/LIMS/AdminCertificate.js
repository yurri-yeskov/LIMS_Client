import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Upload, Select } from "antd";
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
} from "@coreui/react";
import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from "react-file-reader";
import { header, client_fields, analysis_fields } from "src/utils/LaboratoryTableFields";
const { Option } = Select;

class AdminCertificate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openCreateModal: false,
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
      import_label: props.language_data.filter(
        (item) => item.label === "import"
      )[0][props.selected_language],
      export_label: props.language_data.filter(
        (item) => item.label === "export"
      )[0][props.selected_language],
      create_new_label: props.language_data.filter(item => item.label === 'create_new')[0][props.selected_language],
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
      columns: [
        {
          key: "name",
          label: props.language_data.filter(item => item.label === 'name')[0][props.selected_language],
        },
        {
          label: props.language_data.filter(item => item.label === 'certificate_title')[0][props.selected_language],
          key: "certificatetitle",
        },
        {
          key: "company",
          label: props.language_data.filter(item => item.label === 'company')[0][props.selected_language],

        },
        {
          key: "logo",
          label: props.language_data.filter(item => item.label === 'logo')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "place",
          label: props.language_data.filter(item => item.label === 'place')[0][props.selected_language],
        },
        {
          key: "date_format",
          label: props.language_data.filter(item => item.label === 'date_format')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "productdata",
          label: props.language_data.filter(item => item.label === 'product_data')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "tablecolumns",
          label: props.language_data.filter(item => item.label === 'table_columns')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "freetext",
          label: props.language_data.filter(item => item.label === 'free_text')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "footer",
          label: props.language_data.filter(item => item.label === 'footer')[0][props.selected_language],
          sorter: false,
        },
        {
          key: "buttonGroups",
          label: "",
        },
      ],
      header: [
        {
          key: "name",
          label: props.language_data.filter(
            (item) => item.label === "name"
          )[0][props.selected_language],
        },
        {
          key: "certificatetitle",
          label: props.language_data.filter(
            (item) => item.label === "certificate_title"
          )[0][props.selected_language],
        },
        {
          key: "company",
          label: props.language_data.filter(
            (item) => item.label === "company"
          )[0][props.selected_language],
        },
        {
          key: "logo",
          label: props.language_data.filter(
            (item) => item.label === "logo"
          )[0][props.selected_language],
        },
        {
          key: "place",
          label: props.language_data.filter(
            (item) => item.label === "place"
          )[0][props.selected_language],
        },
        {
          key: "date_format",
          label: props.language_data.filter(
            (item) => item.label === "date_format"
          )[0][props.selected_language],
        },
        {
          key: "productTitle",
          label: 'Product Title',
        },
        {
          key: "productdata",
          label: props.language_data.filter(
            (item) => item.label === "product_data"
          )[0][props.selected_language],
        },
        {
          key: "tablecolumns",
          label: props.language_data.filter(
            (item) => item.label === "table_columns"
          )[0][props.selected_language],
        },
        {
          key: "freetext",
          label: props.language_data.filter(
            (item) => item.label === "free_text"
          )[0][props.selected_language],
        },
        {
          key: "footer",
          label: props.language_data.filter(
            (item) => item.label === "footer"
          )[0][props.selected_language],
        },
        {
          key: "logoUid",
          label: 'Logo Uid',
        },
        {
          key: "footerUid",
          label: 'Footer Uid',
        },
        {
          key: "id",
          label: 'ID',
        },
      ],
      export_all_data: []
    };
  }

  componentDidMount() {
    this.First();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        create_new_label: nextProps.language_data.filter(item => item.label === 'create_new')[0][nextProps.selected_language],
        columns: [
          {
            key: "name",
            label: nextProps.language_data.filter(item => item.label === 'name')[0][nextProps.selected_language],
          },
          {
            label: nextProps.language_data.filter(item => item.label === 'certificate_title')[0][nextProps.selected_language],
            key: "certificatetitle",
          },
          {
            key: "company",
            label: nextProps.language_data.filter(item => item.label === 'company')[0][nextProps.selected_language],

          },
          {
            key: "logo",
            label: nextProps.language_data.filter(item => item.label === 'logo')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "place",
            label: nextProps.language_data.filter(item => item.label === 'place')[0][nextProps.selected_language],
          },
          {
            key: "date_format",
            label: nextProps.language_data.filter(item => item.label === 'date_format')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "productdata",
            label: nextProps.language_data.filter(item => item.label === 'product_data')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "tablecolumns",
            label: nextProps.language_data.filter(item => item.label === 'table_columns')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "freetext",
            label: nextProps.language_data.filter(item => item.label === 'free_text')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "footer",
            label: nextProps.language_data.filter(item => item.label === 'footer')[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "buttonGroups",
            label: "",
          },
        ],
      })
    }
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
        rowid: e._id,
      });
    else
      this.setState({
        T_Modal_data: tablecol_data,
        tableColVisible: true,
        rowid: e._id,
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
        rowid: r._id,
      });
    else
      this.setState({
        P_name: r.productdata.productTitle,
        productdataVisible: true,
        rowid: r._id,
        P_Modal_data: empty_Modal_data,
      });
  };

  First = () => {
    axios.get(Config.ServerUri + "/get_certificate")
      .then((res) => {
        if (res) {
          const export_data = res.data.map(data => {
            return {
              name: data.name,
              certificatetitle: data.certificatetitle,
              company: data.company,
              logo: data.logo_filename,
              place: data.place,
              date_format: data.date_format,
              productTitle: data.productdata.productTitle,
              productdata: data.productdata.productData
                .filter(pData => pData.name !== '')
                .map(pData => pData.name + " " + pData.pagename + " " + pData.fieldname + "\n").toString().replace(/\,/g, ""),
              tablecolumns: data.tablecol
                .filter(col => col.name !== "")
                .map(col => col.name + " " + col.fieldname + "\n").toString().replace(/\,/g, ""),
              freetext: data.freetext,
              footer: data.footer_filename,
              logoUid: data.logoUid,
              footerUid: data.footerUid,
              id: data._id
            }
          })
          this.setState({
            export_all_data: export_data,
            data: res.data
          })
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  addData = () => {
    this.setState({
      openCreateModal: true,
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

  on_update_clicked = (e) => {
    var logodata = {
      originFileObj: { uid: e.logoUid },
      url: `/uploads/certificates/${e.logo_filename}`,
    };
    var footerdata = {
      originFileObj: { uid: e.footerUid },
      url: `/uploads/certificates/${e.footer_filename}`,
    };
    this.setState({
      name: e.name,
      company: e.company,
      rowid: e._id,
      certificatetitle: e.certificatetitle,
      place: e.place,
      fileList_Footer: [footerdata],
      fileList: [logodata],
      openCreateModal: true,
      date_format: e.date_format,
    });
  };

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
    if (fileList.length === 0 || fileList_Footer.length === 0 || samenameerror === true) {
      return;
    }
    this.setState({ openCreateModal: false });
    arr.push(fileList[0].originFileObj);
    arr.push(fileList_Footer[0].originFileObj);
    for (let i = 0; i < 2; i++) {
      formData.append("files", arr[i]);
    }
    formData.append("logo", fileList[0].originFileObj)
    formData.append("footer", fileList_Footer[0].originFileObj)
    formData.append("logoUid", fileList[0].originFileObj.uid);
    formData.append("footerUid", fileList_Footer[0].originFileObj.uid);
    formData.append("name", name);
    formData.append("company", company);
    formData.append("place", place);
    formData.append("rowid", rowid);
    formData.append("certificatetitle", certificatetitle);
    formData.append("date_format", date_format);

    axios.post(process.env.REACT_APP_API_URL + "certificates", formData)
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
    axios.post(Config.ServerUri + "/del_certificate", { id })
      .then((res) => {
        if (res.data.success) {
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

  onChangeInput = (e) => {
    const { data } = this.state;
    var err = data.filter((v) => v.name === e.target.value).length;
    if (e.target.name === "name") {
      this.setState({
        [e.target.name]: e.target.value,
        samenameerror: err > 0 ? true : false,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  ProductModalOK = () => {
    const { P_name, P_Modal_data, rowid } = this.state;
    const data = {
      title: P_name,
      data: P_Modal_data,
      rowid: rowid
    }
    axios.post(Config.ServerUri + "/update_productdata", data)
      .then((res) => {
        if (res) {
          this.First();
          this.setState({ rowid: "", productdataVisible: false });
        }
      }).catch((err) => {
        console.log(err);
      });
  };

  TableColOK = () => {
    const { T_Modal_data, rowid } = this.state;
    axios.post(Config.ServerUri + "/update_tabledata", {
      data: T_Modal_data,
      rowid,
    }).then((res) => {
      if (res) {
        this.First();
        this.setState({ rowid: "", tableColVisible: false });
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  async on_export_clicked() {
    await this.csvLink.link.click();
  }

  handleFiles = async (files) => {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    const result = await new Promise((resolve, reject) => {
      reader.onload = function (e) {
        resolve(reader.result);
      }
    })
    axios.post(Config.ServerUri + '/upload_certificate_template', {
      data: result
    }).then((res) => {
      const export_data = res.data.map(data => {
        return {
          name: data.name,
          certificatetitle: data.certificatetitle,
          company: data.company,
          logo: data.logo_filename,
          place: data.place,
          date_format: data.date_format,
          productTitle: data.productdata.productTitle,
          productdata: data.productdata.productData
            .filter(pData => pData.name !== '')
            .map(pData => pData.name + " " + pData.pagename + " " + pData.fieldname + "\n").toString().replace(/\,/g, ""),
          tablecolumns: data.tablecol
            .filter(col => col.name !== "")
            .map(col => col.name + " " + col.fieldname + "\n").toString().replace(/\,/g, ""),
          freetext: data.freetext,
          footer: data.footer_filename,
          logoUid: data.logoUid,
          footerUid: data.footerUid,
          id: data._id
        }
      })
      this.setState({
        export_all_data: export_data,
        data: res.data
      })
      toast.success('Certificate Template file successfully imported');
    });
  }

  on_copy_clicked = (id) => {
    axios.post(Config.ServerUri + "/copy_productdata", { id })
      .then((res) => {
        if (res) {
          this.First();
          this.setState({ rowid: "", productdataVisible: false });
        }
      }).catch((err) => {
        console.log(err);
      });
  }

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
        <div>
          <CButton
            color="info"
            className="float-right"
            style={{ margin: "0 0 0 10px" }}
            onClick={() => this.addData()}
          >
            <i className="fa fa-plus" /><span style={{ padding: "4px" }} />{this.state.create_new_label}
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
            filename="Export-CertificateTemplate.csv"
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
            items={this.state.data}
            fields={this.state.columns}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              buttonGroups: (item) => {
                return (
                  <td>
                    <div>
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => this.on_copy_clicked(item._id)}
                        className="mx-1"
                      >
                        <i className="fa fa-copy" />
                      </CButton>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => this.on_update_clicked(item)}
                        className="mx-1"
                      >
                        <i className="fa fa-edit" />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => this.setState({ modal_delete: true, rowid: item._id })}
                        className="mx-1"
                      >
                        <i className="fa fa-trash" />
                      </CButton>
                    </div>
                  </td>
                );
              },
              logo: (item) => {
                return (
                  <td>
                    <img src={`/uploads/certificates/${item.logo_filename}`} width="50px" height="50px" />
                  </td>
                );
              },
              footer: (item) => {
                return (
                  <td>
                    <img src={`/uploads/certificates/${item.footer_filename}`} width="50px" height="50px" />
                  </td>
                );
              },
              productdata: (item) => {
                return (
                  <td>
                    <a onClick={() => this.ShowProduct(item)}>
                      {item.productdata.productTitle ? item.productdata.productTitle : "N/A"}
                    </a>
                  </td>
                );
              },
              freetext: (item) => {
                return (
                  <td>
                    <a
                      onClick={() =>
                        this.setState({
                          freetext: item.freetext,
                          freetextVisible: true,
                          rowid: item._id,
                        })
                      }
                    >
                      {item.freetext ? item.freetext.substr(0, 5) + "..." : "N/A"}
                    </a>
                  </td>
                );
              },
              tablecolumns: (item) => {
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
                      <i className={filterdata != 0 ? "fa fa-check-circle" : "fa fa-ban"} />
                    </CButton>
                  </td>
                );
              },
            }}
          />
        </div>

        <CModal
          show={this.state.openCreateModal}
          onClose={() => this.setState({ openCreateModal: false, rowid: '' })}
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
                          onCancel={() => this.setState({ previewVisible: false })}
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
                          onPreview={(file) => {
                            this.setState({
                              previewImage_Footer: file.thumbUrl,
                              previewVisible_Footer: true,
                            })
                          }}
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
                          onCancel={() => this.setState({ previewVisible_Footer: false })}
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
                      onChange={(e) => this.setState({ date_format: e })}
                    >
                      <Option value="DD.MM.YYYY">DD.MM.YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="MM-DD-YYYY">MM-DD-YYYY</Option>
                      <Option value="YYYY/MM/DD">YYYY/MM/dd</Option>
                    </Select>
                  </CFormGroup>
                </CForm>
              </CCardBody>
            </CCard>
          </CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={this.handleSubmit}>
              {this.state.rowid !== "" ? "Update" : "Create"}
            </CButton>
            <CButton color="secondary" onClick={() => this.setState({ openCreateModal: false, rowid: '' })}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal show={this.state.modal_delete} onClose={() => this.setState({ modal_delete: false, rowid: "" })}>
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current user type?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.handleDelete(this.state.rowid)}>
              Delete
            </CButton>
            <CButton color="secondary" onClick={() => this.setState({ modal_delete: false, rowid: "" })}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          style={{ width: "70vw" }}
          centered={true}
          size="xl"
          show={productdataVisible}
          onClose={() => this.setState({ productdataVisible: false, rowid: "" })}
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
                          header.map((vl, il) => (
                            <Option value={vl.key} key={il + "l"}>
                              {vl.label}
                            </Option>
                          ))}
                        {v.pagename === 1 &&
                          analysis_fields.map((vl, il) => (
                            <Option value={vl.key} key={il + "a"}>
                              {vl.label}
                            </Option>
                          ))}
                        {v.pagename === 2 &&
                          client_fields.map((vl, il) => (
                            <Option value={vl.key} key={il + "c"}>
                              {vl.label}
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
            <CButton color="secondary" onClick={() => this.setState({ productdataVisible: false, rowid: "" })}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          show={this.state.tableColVisible}
          centered={true}
          style={{ width: "50vw" }}
          size="xl"
          onClose={() => this.setState({ tableColVisible: false, rowid: "" })}
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
                        <Option value="analysis">Analysis Types</Option>
                        <Option value="value">Value</Option>
                        <Option value="user">Author</Option>
                        <Option value="date">Date</Option>
                        <Option value="reason">Reason</Option>
                        <Option value="spec">Specification</Option>
                        <Option value="comment">Comment</Option>
                        <Option value="certificate">Certificate Type</Option>
                        <Option value="obj">AnalysisType-Objective</Option>
                        <Option value="norm">Norm</Option>
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
            <CButton color="secondary" onClick={() => this.setState({ tableColVisible: false, rowid: "" })}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          show={this.state.freetextVisible}
          onClose={() => this.setState({ freetextVisible: false, rowid: "" })}
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
            <CButton color="secondary" onClick={() => this.setState({ freetextVisible: false, rowid: "" })}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </div >
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AdminCertificate);
