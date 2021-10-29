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
  CSelect,
  CCol,
  CRow,
  CTextarea,
} from "@coreui/react";
import "./style.css";
import { StyleSheet } from "@react-pdf/renderer";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import {
  Card,
  Input,
  Row,
  Col,
  List,
  Drawer,
  notification,
  Select,
  DatePicker as AtndDatePicker,
} from "antd";
import "react-multi-email/style.css";
import ReactFileReader from "react-file-reader";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import moment from "moment";
import GPDF from "./GeneratePDF";
const axios = require("axios");
const Config = require("../../Config.js");

const fields = [
  { key: "due_date", label: "Due Date" },
  { key: "sample_type", label: "Sample Type", sorter: false },
  { key: "material", label: "Material", sorter: false },
  { key: "client", label: "Client", sorter: false },
  { key: "packing_type", label: "Packing Type", sorter: false },
  { key: "a_types", label: "Analysis Type", sorter: false },
  { key: "c_types", label: "Certificate", sorter: false },
  { key: "sending_date", label: "Sending Date" },
  { key: "sample_date", label: "Sample Date" },
  { key: "Weight", label: "Weight(actual)", sorter: false },
  { key: "material_left", label: "Material left", sorter: false },
  { key: "Charge", label: "Charge", sorter: false },
  { key: "remark", label: "Remark", sorter: false },
  { key: "buttonGroups", label: "", _style: { width: "84px" } },
];

const header = [
  { key: "due_date", label: "Due Date" },
  { key: "sample_type", label: "Sample Type" },
  { key: "material", label: "Material" },
  { key: "client", label: "Client" },
  { key: "packing_type", label: "Packing Type" },
  { key: "a_types", label: "Analysis Type" },
  { key: "c_types", label: "Certificate" },
  { key: "sending_date", label: "Sending Date" },
  { key: "sample_date", label: "Sample Date" },
  { key: "distributor", label: "Distributor" },
  { key: "geo_locaion", label: "Geo Location" },
  { key: "remark", label: "Remark" },
  { key: "delivering.address_name1", label: "Delivering.Address.Name1" },
  { key: "delivering.address_title", label: "Delivering.Address.Title" },
  { key: "delivering.address_country", label: "Delivering.Address.Country" },
  { key: "delivering.address_name2", label: "Delivering.Address.Name2" },
  { key: "delivering.address_name3", label: "Delivering.Address.Name3" },
  { key: "delivering.address_street", label: "Delivering.Address.Street" },
  { key: "delivering.address_zip", label: "Delivering.Address.ZIP" },
  { key: "delivering.customer_product_code", label: "CustomProductCode" },
  { key: "delivering.email_address", label: "E-mail Address" },
  { key: "delivering.fetch_date", label: "Fetch Date" },
  { key: "delivering.order_id", label: "Order.ID" },
  { key: "delivering.pos_id", label: "Pos.ID" },
  { key: "delivering.w_target", label: "Weight(target)" },
];

const object_fields = [
  { key: "limitValue", label: "Value" },
  { key: "author", label: "Author" },
  { key: "update_date", label: "Date" },
  { key: "reason", label: "Reason" },
  { key: "accept", label: "Accept" },
  { key: "comment", label: "Comment" },
];

const weight_fields = [
  { key: "weight", label: "Weight" },
  { key: "author", label: "Author" },
  { key: "update_date", label: "Update Date" },
  { key: "comment", label: "Comment" },
];

const charge_fields = [
  { key: "charge", label: "Charge Date" },
  { key: "author", label: "Author" },
  { key: "update_date", label: "Update Date" },
  { key: "comment", label: "Comment" },
];
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
export default class InputLaboratory extends Component {
  constructor(props) {
    super(props);
    this.getAllData = this.getAllData.bind(this);
    this.deleteInputLaboratory = this.deleteInputLaboratory.bind(this);
    this.createInputLaboratory = this.createInputLaboratory.bind(this);
    this.updateInputLaboratory = this.updateInputLaboratory.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChangeSampleType =
      this.handleSelectChangeSampleType.bind(this);
    this.handleSelectChangeMaterial =
      this.handleSelectChangeMaterial.bind(this);
    this.PlusStockdata = this.PlusStockdata.bind(this);
    this.handleSelectChangeClient = this.handleSelectChangeClient.bind(this);
    this.handleSearchAnalysisType = this.handleSearchAnalysisType.bind(this);
    this.handleSearchSampleType = this.handleSearchSampleType.bind(this);
    this.handleChangeDueDate = this.handleChangeDueDate.bind(this);
    this.handleChangeSampleDate = this.handleChangeSampleDate.bind(this);
    this.handleChangeFetchDate = this.handleChangeFetchDate.bind(this);
    this.handleChangeSendingDate = this.handleChangeSendingDate.bind(this);
    this.handleMultiSelectChangeCertificateType =
      this.handleMultiSelectChangeCertificateType.bind(this);
    this.handleMultiSelectChangeAnalysisType =
      this.handleMultiSelectChangeAnalysisType.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.onChangeMinMaxValues = this.onChangeMinMaxValues.bind(this);
    this.onClickLabel = this.onClickLabel.bind(this);
    this.onClickSaveObjectiveHistory =
      this.onClickSaveObjectiveHistory.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onChangeChargeDate = this.onChangeChargeDate.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.renderWeightDetail = this.renderWeightDetail.bind(this);
    this.renderChargeDetail = this.renderChargeDetail.bind(this);
    this.renderStockDetail = this.renderStockDetail.bind(this);
    this.onChangeweight = this.onChangeweight.bind(this);
    this.on_export_clicked = this.on_export_clicked.bind(this);
    this.onChangeStock = this.onChangeStock.bind(this);
    this.onChange_material = this.onChange_material.bind(this);
    this.DeleteItem = this.DeleteItem.bind(this);

    this.state = {
      analysisType: [],
      certificate: [],
      lotcharge: "",
      lotupdatedate: "",
      lotuser: "",
      realarr: [],
      multiarr: [],
      onlynumarr: [],
      selfree: 0,
      selfid: "",
      param: "single",
      stock_disable_arr: [],
      formatValue: 0,
      stockid: 0,
      freeValue: 0,
      mat_left: 0,
      stock_data: [""],
      c_rowdata: [],
      selectCertificate: "",
      pdfcolumns: [],
      pdfdata: {},
      clientsData: [],
      materialsData: [],
      rowObj: [],
      packingTypesData: [],
      analysisData: [],
      certificateTypesData: [],
      sampleTypesData: [],
      allData: [],
      analysisTypes: [],
      filteredData: [],
      modal_delete: false,
      modal_create: false,
      modal_detail: false,
      certificateVisible: false,
      current_id: null,
      material: "",
      client: "",
      packing_type: "",
      due_date: "",
      sample_date: "",
      sending_date: "",
      a_types: [],
      c_types: [],
      distributor: "",
      geo_locaion: "",
      remark: "",
      search_a_types: "",
      search_sample_type: "",
      _create: false,
      double_error: "",
      client_list: [],
      a_type_list: [],
      c_type_list: [],
      disabled_due_date: false,
      disabled_sample_date: false,
      disabled_sending_date: false,
      history_item: [],
      objectiveHistory: [],
      objectives: [],
      client_detail_flag: false,
      rowData: "",
      charge: "",
      display_detail: false,
      header: [],
      data: [],
      title: [],
      weight_flag: false,
      charge_flag: false,
      weight_acutal_value: "",
      weight_id: "",
      parent_id: "",
      weight_history: "",
      weight: "",
      weight_table_flag: false,
      charge_id: "",
      mat: [],
      charge_history: "",
      charge_table_flag: false,
      stock_flag: false,
      stock_sample: "",
      charge_value: new Date(),
      stock_modal_flag: false,
      reason: [],
      opt_material: [],
      chk_full: false,
      certificatedata: [],
      addId: "",
      addVal: "",
      preId: "",
      // analysisType_label: props.language_data.filter(
      //   (item) => item.label === "analysis_type"
      // )[0][props.selected_language],
      // sampleType_label: props.language_data.filter(
      //   (item) => item.label === "sample_type"
      // )[0][props.selected_language],
      // import_label: props.language_data.filter(
      //   (item) => item.label === "import"
      // )[0][props.selected_language],
      // export_label: props.language_data.filter(
      //   (item) => item.label === "export"
      // )[0][props.selected_language],
      // create_new_label: props.language_data.filter(
      //   (item) => item.label === "create_new"
      // )[0][props.selected_language],
      fields: [
        {
          key: "due_date",
          label: props.language_data.filter(
            (item) => item.label === "due_date"
          )[0][props.selected_language],
        },
        {
          key: "sample_type",
          label: props.language_data.filter(
            (item) => item.label === "sample_type"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "material",
          label: props.language_data.filter(
            (item) => item.label === "material"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "client",
          label: props.language_data.filter(
            (item) => item.label === "client"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "packing_type",
          label: props.language_data.filter(
            (item) => item.label === "packing_type"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "a_types",
          label: props.language_data.filter(
            (item) => item.label === "analysis_type"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "c_types",
          label: props.language_data.filter(
            (item) => item.label === "certificate"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "sending_date",
          label: props.language_data.filter(
            (item) => item.label === "sending_date"
          )[0][props.selected_language],
        },
        {
          key: "sample_date",
          label: props.language_data.filter(
            (item) => item.label === "sample_date"
          )[0][props.selected_language],
        },
        {
          key: "Weight",
          label: props.language_data.filter(
            (item) => item.label === "weight_actual"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "material_left",
          label: props.language_data.filter(
            (item) => item.label === "material_left"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "Charge",
          label: props.language_data.filter(
            (item) => item.label === "charge"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "stockSample",
          label: props.language_data.filter(
            (item) => item.label === "stock_sample"
          )[0][props.selected_language],
          sorter: false,
        },
        {
          key: "remark",
          label: props.language_data.filter(
            (item) => item.label === "remark"
          )[0][props.selected_language],
          sorter: false,
        },
        { key: "buttonGroups", label: "", _style: { width: "84px" } },
      ],
    };
  }

  componentDidMount() {
    this.getAllMaterials();
    this.getAllPackingTypes();
    this.getAllClients();
    this.getAllCertificateTypes();
    this.getAllAnalysisTypes();
    this.getAllSampleTypes();
    this.getAllData();
    this.getObjectiveHistory();
    this.getUserType();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language != this.props.selected_language) {
      this.setState({
        analysisType_label: nextProps.language_data.filter(
          (item) => item.label === "analysis_type"
        )[0][nextProps.selected_language],
        sampleType_label: nextProps.language_data.filter(
          (item) => item.label === "sample_type"
        )[0][nextProps.selected_language],
        import_label: nextProps.language_data.filter(
          (item) => item.label === "import"
        )[0][nextProps.selected_language],
        export_label: nextProps.language_data.filter(
          (item) => item.label === "export"
        )[0][nextProps.selected_language],
        create_new_label: nextProps.language_data.filter(
          (item) => item.label === "create_new"
        )[0][nextProps.selected_language],
        fields: [
          {
            key: "due_date",
            label: nextProps.language_data.filter(
              (item) => item.label === "due_date"
            )[0][nextProps.selected_language],
          },
          {
            key: "sample_type",
            label: nextProps.language_data.filter(
              (item) => item.label === "sample_type"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "material",
            label: nextProps.language_data.filter(
              (item) => item.label === "material"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "client",
            label: nextProps.language_data.filter(
              (item) => item.label === "client"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "packing_type",
            label: nextProps.language_data.filter(
              (item) => item.label === "packing_type"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "a_types",
            label: nextProps.language_data.filter(
              (item) => item.label === "analysis_type"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "c_types",
            label: nextProps.language_data.filter(
              (item) => item.label === "certificate"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "sending_date",
            label: nextProps.language_data.filter(
              (item) => item.label === "sending_date"
            )[0][nextProps.selected_language],
          },
          {
            key: "sample_date",
            label: nextProps.language_data.filter(
              (item) => item.label === "sample_date"
            )[0][nextProps.selected_language],
          },
          {
            key: "Weight",
            label: nextProps.language_data.filter(
              (item) => item.label === "weight_actual"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "Charge",
            label: nextProps.language_data.filter(
              (item) => item.label === "charge"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "stockSample",
            label: nextProps.language_data.filter(
              (item) => item.label === "stock_sample"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          {
            key: "remark",
            label: nextProps.language_data.filter(
              (item) => item.label === "remark"
            )[0][nextProps.selected_language],
            sorter: false,
          },
          { key: "buttonGroups", label: "", _style: { width: "84px" } },
        ],
      });
    }
  }
  getAllData() {
    axios
      .get(Config.ServerUri + "/get_all_input_laboratory")
      .then((res) => {
        this.setState({
          allData: res.data,
          filteredData: res.data,
        });
      })
      .catch((error) => {});
    axios
      .get(Config.ServerUri + "/get_certificate")
      .then((res) => {
        if (res) {
          var data = [];
          res.data.map((v) => {
            data.push(v);
          });
          this.setState({ certificatedata: data });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  getUserType = () => {
    var token = localStorage.getItem("token");
    axios.post(Config.ServerUri + "/get_userTypes", { token }).then((res) => {
      this.setState({ accept_visible: res.data.accept_visible });
    });
  };

  getObjectiveHistory() {
    axios.get(Config.ServerUri + "/get_objective_history").then((res) => {
      this.setState({
        objectiveHistory: res.data.objectivehistory,
        unitData: res.data.unit,
      });
    });
  }

  getAllSampleTypes() {
    axios
      .get(Config.ServerUri + "/get_all_sampleTypes")
      .then((res) => {
        this.setState({
          sampleTypesData: res.data,
        });
      })
      .catch((error) => {});
  }

  getAllAnalysisTypes() {
    axios
      .get(Config.ServerUri + "/get_all_analysisTypes")
      .then((res) => {
        this.setState({
          analysisTypes: res.data,
        });
      })
      .catch((error) => {});
  }

  getAllMaterials() {
    axios
      .get(Config.ServerUri + "/get_all_materials")
      .then((res) => {
        this.setState({
          materialsData: res.data.materials,
          analysisData: res.data.analysisTypes,
          objectives: res.data.objectives,
          unitsData: res.data.units,
        });
      })
      .catch((error) => {});
  }

  getAllClients() {
    axios
      .get(Config.ServerUri + "/get_all_clients")
      .then((res) => {
        this.setState({
          clientsData: res.data,
        });
      })
      .catch((error) => {});
  }

  getAllPackingTypes() {
    axios
      .get(Config.ServerUri + "/get_all_packingTypes")
      .then((res) => {
        this.setState({
          packingTypesData: res.data,
        });
      })
      .catch((error) => {});
  }

  getAllCertificateTypes() {
    axios
      .get(Config.ServerUri + "/get_all_certificateTypes")
      .then((res) => {
        this.setState({
          certificateTypesData: res.data.certificateTypes,
        });
      })
      .catch((error) => {});
  }

  on_delete_clicked(id) {
    this.setState({ current_id: id });

    this.setModal_Delete(true);
  }

  on_client_clicked(item) {
    this.setState({
      client_detail_flag: true,
      client_title: item.client,
      rowData: item,
    });
  }

  onClick_weight(item) {
    var weight = "";
    var weight_id = "";
    var weight_comment = "";

    item.Weight.map((temp) => {
      weight = temp.weight;
      weight_id = temp._id;
      weight_comment = temp.comment;
    });

    this.state.sampleTypesData.map((sample) => {
      if (sample.sampleType === item.sample_type) {
        if (sample.stockSample === true) {
          this.setState({ stock_flag: true });
        }
      }
    });

    this.setState({
      weight_history: item.Weight,
      weight_acutal_value: weight,
      weigt_comment: weight_comment,
      weight_id: weight_id,
      weight_flag: true,
      parent_id: item._id,
    });
  }

  onChangeStock(e, item) {
    const { stock_data } = this.state;
    stock_data[e.target.name] = e.target.value;

    // var num = 0;
    // stock_data.map((e) => {
    //   num = Number(num) + Number(e);
    // });
    // if (this.state.param == "single") {
    //   if (num > this.state.freeValue) {
    //     alert("the sum of input values must smaller than Material left.");
    //     stock_data[item] = "";
    //   }
    // }
    this.setState({ stock_data });
  }

  getUnitName(id) {
    var units = this.state.unitsData;
    for (var i = 0; i < units.length; i++) {
      if (units[i]._id === id) return units[i].unit;
    }
    return "";
  }

  getObjectiveName(id) {
    var objectives = this.state.objectives;
    for (var i = 0; i < objectives.length; i++) {
      if (objectives[i]._id === id) return objectives[i].objective;
    }
    return "";
  }

  onClick_charge(item, chargedate) {
    var charge_value = new Date();
    var charge_id = "";
    var charge_comment = "";

    item.Charge.map((temp) => {
      if (temp.charge == "") {
        charge_value = charge_value;
      }
      charge_value = temp.charge;
      charge_id = temp._id;
      charge_comment = temp.comment;
    });

    this.setState({
      charge_history: item.Charge,
      charge_value: chargedate,
      weigt_comment: charge_comment,
      charge_id: charge_id,
      charge_flag: true,
      parent_id: item._id,
    });
    this.setState({ charge: item.Charge, charge_flag: true });
  }

  async on_export_clicked() {
    await this.csvLink.link.click();
  }

  on_create_clicked() {
    this.setState({
      current_id: "",
      sample_type: "",
      material: "",
      client: "",
      packing_type: "",
      due_date: new Date(),
      sample_date: new Date(),
      sending_date: new Date(),
      fetch_date: new Date(),
      a_types: [],
      c_types: [],
      distributor: "",
      geo_locaion: "",
      remark: "",
      _create: true,
      double_error: "",
      address_name1: "",
      address_name2: "",
      address_name3: "",
      address_country: "",
      address_title: "",
      address_street: "",
      address_zip: "",
      customer_product_code: "",
      email_address: [],
      order_id: "",
      pos_id: "",
      weight: "",
      stock_flag: false,
    });

    this.setModal_Create(true);
  }
  PlusStockdata() {
    const { stock_data, mat, stock_disable_arr, stock_sample } = this.state;
    var flag = 0;
    var num = 0;

    stock_data.map((e) => {
      if (e == "") {
        flag = 0;
      } else {
        num = Number(num) + Number(e);
        flag = 1;
      }
    });
    if (this.state.param == "single") {
      if (flag == 0) {
        notification.warning({
          message: "Error",
          description: "Please enter your data!",
          className: "not-css",
        });
        return;
      } else if (num > this.state.freeValue) {
        notification.warning({
          message: "Error",
          description: "Value exceeded!",
          className: "not-css",
        });
        return;
      } else if (num == this.state.freeValue) {
        notification.warning({
          message: "Error",
          description: "Do Not Add",
          className: "not-css",
        });
        return;
      } else {
      }
    } else {
      var sumVal = 0;
      var numarr = {
        id: this.state.stockid,
        val: stock_data[stock_data.length - 1],
      };
      this.state.onlynumarr.push(numarr);
      if (flag == 0) {
        notification.warning({
          message: "Error",
          description: "Please enter your data!",
          className: "not-css",
        });
        return;
      } else if (
        stock_data[stock_data.length - 1] > Number(this.state.selfree)
      ) {
        notification.warning({
          message: "Error",
          description: "Value exceeded!",
          className: "not-css",
        });
        this.state.onlynumarr.splice(this.state.onlynumarr.length - 1);
        return;
      } else {
        this.state.onlynumarr.map((e) => {
          if (e.id.toString() == this.state.stockid.toString()) {
            sumVal += Number(e.val);
          }
        });
        if (sumVal > Number(this.state.selfree)) {
          notification.warning({
            message: "Error",
            description: "Value exceeded!",
            className: "not-css",
          });
          this.state.onlynumarr.splice(this.state.onlynumarr.length - 1);
          return;
        } else if (sumVal == Number(this.state.selfree)) {
          notification.warning({
            message: "Error",
            description: "Do Not Add",
            className: "not-css",
          });
          this.state.onlynumarr.splice(this.state.onlynumarr.length - 1);
          return;
        } else {
          if (this.state.multiarr.length == 0) {
            this.state.multiarr.push(numarr);
          } else {
            if (
              this.state.multiarr.filter(
                (vv) => vv.id == this.state.stockid.toString()
              ).length == 0
            ) {
              this.state.multiarr.push(numarr);
            } else {
              this.state.multiarr.map((v) => {
                if (v.id.toString() == this.state.stockid.toString()) {
                  v.val = Number(numarr.val) + Number(v.val);
                }
              });
            }
          }
        }
      }
    }
    stock_disable_arr[mat.length - 1] = false;
    stock_disable_arr.push(true);
    var endSelVal = mat[mat.length - 1];
    mat.push(endSelVal);
    stock_data.push("");
    this.setState({ mat, stock_data, stock_disable_arr });
  }

  DeleteItem(item) {
    const { mat, stock_data, stock_disable_arr, onlynumarr } = this.state;
    stock_disable_arr.splice(item, 1);
    mat.splice(item, 1);
    stock_data.splice(item, 1);
    onlynumarr.splice(item, 1);
    this.setState({ mat, stock_data, stock_disable_arr, onlynumarr });

    // let getid = mat[item].split(",")[0].split(" ")[
    //   mat[item].split(",")[0].split(" ").length - 1
    // ];
    // let getValue = stock_data[item];
    // axios
    //   .post(Config.ServerUri + "/del_mat", {
    //     mat_left: getValue,
    //     _id: getid,
    //   })
    //   .then((res) => {
    //     this.setState({
    //       allData: res.data,
    //       filteredData: res.data,
    //       stock_disable_arr,
    //     });
    //   })
    //   .catch((err) => console.log(err));

    // axios
    //   .post(Config.ServerUri + "/remove_mat", {
    //     mat_left: stock_data[stock_data.length - 1],
    //     sampleinfo: stock_sample,
    //     selfid: this.state.selfid,
    //     stockid: this.state.stockid,
    //   })
    //   .then((res) => {
    //     this.setState({
    //       allData: res.data,
    //       filteredData: res.data,
    //       stock_disable_arr,
    //     });
    //   })
    //   .catch((err) => console.log(err));
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      sample_type: item.sample_type,
      material: item.material,
      client: item.client,
      client_id: item.client_id,
      packing_type: item.packing_type,
      due_date: item.due_date,
      sample_date: item.sample_date,
      sending_date: item.sending_date,
      a_types: item.a_types,
      c_types: item.c_types,
      distributor: item.distributor,
      geo_locaion: item.geo_locaion,
      remark: item.remark,
      _create: false,
      double_error: "",
      modal_detail: false,
      address_name1: item.delivering.address_name1,
      address_name2: item.delivering.address_name2,
      address_name3: item.delivering.address_name3,
      address_title: item.delivering.address_title,
      address_country: item.delivering.address_country,
      address_street: item.delivering.address_street,
      address_zip: item.delivering.address_zip,
      customer_product_code: item.delivering.customer_product_code,
      email_address: item.delivering.email_address,
      order_id: item.delivering.order_id,
      fetch_date: item.delivering.fetch_date,
      pos_id: item.delivering.pos_id,
      w_target: item.delivering.w_target,
    });

    if (item.client !== "undefined") {
      this.setState({ display_detail: true });
    } else {
      this.setState({ display_detail: false });
    }

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
      .post(Config.ServerUri + "/upload_laboratory_csv", {
        data: result,
      })
      .then((res) => {
        toast.success("Laboratory successfully uploaded");
        this.setState({
          allData: res.data,
          filteredData: res.data,
        });
      })
      .catch((error) => {});
  }

  deleteInputLaboratory() {
    this.setModal_Delete(false);

    axios
      .post(Config.ServerUri + "/delete_input_laboratory", {
        id: this.state.current_id,
      })
      .then((res) => {
        toast.success("InputLaboratory successfully deleted");
        this.setState({
          allData: res.data,
          filteredData: res.data,
        });
      })
      .catch((error) => {});
  }

  on_add_material(item) {
    var ty = item.sample_type;
    var vv = this.state.sampleTypesData.map((v) => {
      if (v.sampleType == ty) {
        if (v.stockSample == true) {
          return true;
        } else {
          return false;
        }
      }
    });
    var opt_material = [];
    let material = item.material_left;
    vv = vv.filter((re) => re != undefined);
    if (vv[0] == true) {
      if (item.Weight.length == 0) {
        notification.warning({
          message: "Warning",
          description: "Please Input Charge!",
          className: "not-css",
        });
        return;
      } else if (item.Charge.length == 0) {
        notification.warning({
          message: "Warning",
          description: "Please Input Charge!",
          className: "not-css",
        });
        return;
      }
      this.setState({ param: "single" });
      this.state.sampleTypesData.map((sample) => {
        if (
          sample.sampleType == item.sample_type &&
          sample.stockSample == true
        ) {
          opt_material.push(
            item.material +
              " " +
              item.client +
              " " +
              item.Charge[item.Charge.length - 1].charge +
              "  " +
              item.material_left +
              " " +
              item._id
          );
          var ee = "";
          ee += opt_material.map((e) => {
            return e;
          });
          this.setState({
            stockid: item._id,
            freeValue: material,
            mat: [ee],
          });
        }
      });
    } else {
      this.setState({ param: "multi", selfid: item._id });
      var valary = [];
      var stex = "";
      var formatValue = [];
      this.state.sampleTypesData.map((sample) => {
        if (sample.stockSample == true) {
          this.state.filteredData.map((temp) => {
            if (sample.sampleType === temp.sample_type) {
              if (item.material == temp.material) {
                if (sample.stockSample === true) {
                  opt_material.push(
                    temp.material +
                      " " +
                      temp.client +
                      " " +
                      temp.Charge[temp.Charge.length - 1].charge +
                      " " +
                      temp.material_left +
                      " " +
                      temp._id
                  );

                  if (formatValue == "") {
                    formatValue.push(temp.material_left);
                  } else {
                    return;
                  }
                  if (valary == "") {
                    valary.push(temp._id);
                    stex =
                      temp.material +
                      " " +
                      temp.client +
                      " " +
                      temp.Charge[temp.Charge.length - 1].charge;
                  } else {
                    return;
                  }
                }
              }
            }
          });
        }
      });
      var ee = "";
      ee += opt_material.map((e) => {
        return e;
      });
      const { mat } = this.state;
      mat.push(ee);
      this.setState({
        stockid: valary,
        mat,
        freeValue: formatValue,
        selfree: formatValue,
        stock_sample: stex,
      });
    }
    this.setState({
      stock_modal_flag: true,
      opt_material: opt_material,
      stock_data: [""],
      stock_disable_arr: [true],
    });
  }

  createInputLaboratory(event) {
    event.preventDefault();

    var client = "";
    if (this.state.double_error !== "") {
      return;
    }

    if (this.state.client === undefined) {
      client = "undefined";
    } else {
      client = this.state.client;
    }

    var delivering = {
      address_name1: this.state.address_name1,
      address_name2: this.state.address_name2,
      address_name3: this.state.address_name3,
      address_title: this.state.address_title,
      address_country: this.state.address_country,
      address_street: this.state.address_street,
      address_zip: this.state.address_zip,
      customer_product_code: this.state.customer_product_code,
      email_address: this.state.email_address,
      fetch_date: moment(this.state.fetch_date).format("YYYY-MM-DD"),
      order_id: this.state.order_id,
      pos_id: this.state.pos_id,
      w_target: this.state.w_target,
    };

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/create_input_laboratory", {
        sample_type: this.state.sample_type,
        material: this.state.material,
        client: client,
        packing_type: this.state.packing_type,
        due_date: this.state.due_date,
        sample_date: this.state.sample_date,
        sending_date: this.state.sending_date,
        a_types: this.state.a_types,
        c_types: this.state.c_types,
        distributor: this.state.distributor,
        geo_locaion: this.state.geo_locaion,
        remark: this.state.remark,
        client_id: this.state.client_id,
        delivering: delivering,
      })
      .then((res) => {
        toast.success("InputLaborary successfully created");
        this.setState({
          allData: res.data,
          filteredData: res.data,
        });
      })
      .catch((error) => {});
  }

  updateInputLaboratory(event) {
    event.preventDefault();

    if (this.state.double_error !== "") return;

    var delivering = {
      address_name1: this.state.address_name1,
      address_name2: this.state.address_name2,
      address_name3: this.state.address_name3,
      address_title: this.state.address_title,
      address_country: this.state.address_country,
      address_street: this.state.address_street,
      address_zip: this.state.address_zip,
      customer_product_code: this.state.customer_product_code,
      email_address: this.state.email_address,
      fetch_date: moment(this.state.fetch_date).format("YYYY-MM-DD"),
      order_id: this.state.order_id,
      pos_id: this.state.pos_id,
      w_target: this.state.w_target,
    };

    this.setModal_Create(false);

    axios
      .post(Config.ServerUri + "/update_input_laboratory", {
        id: this.state.current_id,
        sample_type: this.state.sample_type,
        material: this.state.material,
        client: this.state.client,
        packing_type: this.state.packing_type,
        due_date: this.state.due_date,
        sample_date: this.state.sample_date,
        sending_date: this.state.sending_date,
        a_types: this.state.a_types,
        c_types: this.state.c_types,
        distributor: this.state.distributor,
        geo_locaion: this.state.geo_locaion,
        remark: this.state.remark,
        client_id: this.state.client_id,
        delivering: delivering,
      })
      .then((res) => {
        toast.success("InputLaboratory successfully updated");
        this.setState({
          allData: res.data,
          filteredData: res.data,
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
    if (modal == true) {
      // $("#material").prop("disabled", true);
      // $("#client").prop("disabled", true);
      // $("#packingType").prop("disabled", true);
      // $("#due_date").prop("disabled", true);
      // $("#sample_date").prop("disabled", true);
      // $("#sending_date").prop("disabled", true);
      // $("#analysisType").prop("disabled", true);
      // $("#distributor").prop("disabled", true);
      // $("#geo_locaion").prop("disabled", true);
      // $("#remark").prop("disabled", true);
    }
    this.setState({
      modal_create: modal,
    });
  }

  handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSelectChangeSampleType(e) {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({
      [name]: value,
      material: "",
    });
    this.state.sampleTypesData.map((item) => {
      if (item.sampleType === value) {
        if (item.material === false) {
          // $("#material").prop("disabled", true);
          this.setState({ disabled_material: true });
          //return false;
        } else {
          this.setState({ disabled_material: false });
        }
        if (item.client === false) {
          // $("#client").prop("disabled", true);
          this.setState({
            disabled_client: true,
            display_detail: false,
            client: undefined,
          });
        } else {
          this.setState({
            disabled_client: false,
            display_detail: true,
            client: "",
          });
        }
        if (item.packingType === false) {
          // $("#packing_type").prop("disabled", true);
          this.setState({ disabled_packing_type: true });
        } else {
          this.setState({ disabled_packing_type: false });
        }
        if (item.dueDate === false) {
          // this.state.disabled_due_date = true;
          this.setState({ disabled_due_date: true });
        } else {
          this.setState({ disabled_due_date: false });
        }
        if (item.sampleDate === false) {
          // this.state.disabled_sample_date = true;
          this.setState({ disabled_sample_date: true });
        } else {
          this.setState({ disabled_sample_date: false });
        }
        if (item.sendingDate === false) {
          // this.state.disabled_sending_date = true;
          this.setState({ disabled_sending_date: true });
        } else {
          this.setState({ disabled_sending_date: false });
        }
        if (item.analysisType === false) {
          // $("#analysisType").prop("disabled", true);
          this.setState({ disabled_analysisType: true });
        } else {
          this.setState({ disabled_analysisType: false });
        }
        if (item.distributor === false) {
          // $("#distributor").prop("disabled", true);
          this.setState({ disabled_distributor: true });
        } else {
          this.setState({ disabled_distributor: false });
        }
        if (item.certificateType === false) {
          // $("#certificateType").prop("disabled", true);
          this.setState({ disabled_certificateType: true });
        } else {
          this.setState({ disabled_certificateType: false });
        }
      }
    });
  }
  getcertificatedata = async (item) => {
    const { c_rowdata, selectCertificate, rowObj } = this.state;
    var tabletol = [];
    item.tablecol.map((vv) => {
      tabletol.push({
        key: vv.name,
      });
    });
    var dateformat = "";
    var pdfdata = {
      pdfname: item.name,
      logo: item.logo.path,
      address: {
        name: c_rowdata.client,
        addressB: "",
        zipcodeB: "",
        cityB: "",
        address2B: "",
        country: "",
      },
      place: item.place,
      c_title: item.certificatetitle,
      date: c_rowdata.sample_date,
      certificateName: selectCertificate,
      productName: item.productdata.productTitle,
      productData: [],
      freetext: item.freetext,
      footer: item.footer.path,
      history: [],
    };
    await axios
      .post(Config.ServerUri + "/get_certificate_datefotmat", {
        name: item.name,
      })
      .then((res) => {
        if (res.data) {
          dateformat = res.data.date_format;
          pdfdata.date = moment(c_rowdata.sample_date).format(dateformat);
        }
      });

    await axios
      .post(Config.ServerUri + "/pdf_getaddressdata", {
        id: c_rowdata.client_id,
        dateformat,
      })
      .then((res) => {
        if (res.data) {
          pdfdata.address.addressB = res.data.addressB;
          pdfdata.address.zipcodeB = res.data.zipCodeB;
          pdfdata.address.cityB = res.data.cityB;
          pdfdata.address.address2B = res.data.address2B;
          pdfdata.address.country = res.data.countryB;
        }
      });
    await axios
      .post(Config.ServerUri + "/pdf_getanaldata", {
        clientid: c_rowdata.client_id,
        analdata: c_rowdata.a_types,
        c_rowdata,
        productdata: item.productdata.productData,
        rowid: c_rowdata._id,
        dateformat,
      })
      .then((res) => {
        if (res.data) {
          pdfdata.productData = res.data;
        }
      });

    await axios
      .post(Config.ServerUri + "/pdf_gethistorydata", {
        data: item.tablecol,
        rowid: c_rowdata._id,
        rowdata: c_rowdata,
        selectCertificate,
        rowObj,
        analdata: c_rowdata.a_types,
        dateformat,
      })
      .then((res) => {
        if (res.data) {
          pdfdata.history = res.data;
        }
      });

    this.setState({ pdfdata, pdfcolumns: tabletol, history: pdfdata.history });
  };
  handleSeltectedChangeReason = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelectChangeMaterial(e) {
    var filtered_material = [];
    var avaiable_a_types = [];
    var filtered_clients = [];
    var filtered_c_type = [];
    var available_a_type_names = [];

    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value === "") {
      filtered_material = [];
      avaiable_a_types = [];
      filtered_clients = [];
      filtered_c_type = [];
    } else {
      filtered_material = this.state.materialsData.filter(
        (material) => material.material === e.target.value
      );
      avaiable_a_types = filtered_material[0].aTypesValues;
      filtered_clients = this.state.clientsData.filter(
        (client) => filtered_material[0].clients.indexOf(client._id) > -1
      );
      filtered_c_type = this.state.certificateTypesData.filter(
        (c_type) => filtered_material[0]._id == c_type.material
      );
      avaiable_a_types.map((element) => {
        if (this.state.client == element.client) {
          available_a_type_names.push(
            this.state.analysisData.filter(
              (a_data) => a_data._id == element.value
            )
          );
        }
      });
    }

    this.setState({ client_list: filtered_clients });
    this.setState({ a_type_list: available_a_type_names, client_id: "" });
    this.setState({ c_type_list: filtered_c_type });
    this.setState({ avaiable_a_types: avaiable_a_types, client: "" });
  }

  handleSelectChangeClient(e) {
    var available_a_type_names = [];
    var client = "";
    if (e.target.value) {
      client = e.target.value.split("-")[1];
    }
    var name = e.target.name;

    this.state.avaiable_a_types.map((item) => {
      if (client === item.client) {
        available_a_type_names.push(
          this.state.analysisData.filter((a_data) => a_data._id == item.value)
        );
      }
    });

    this.setState({
      [name]: e.target.value,
      a_type_list: available_a_type_names,
      client_id: client,
    });
  }

  handleMultiSelectChangeCertificateType(e) {
    var c_types = [];
    e.map((type) => {
      c_types.push(type);
      return true;
    });

    this.setState({ c_types: c_types });
  }

  handleMultiSelectChangeAnalysisType(e) {
    var a_types = [];
    e.map((type) => {
      a_types.push(type);
      return true;
    });
    this.setState({ a_types: a_types });
  }

  handleSearchAnalysisType(e) {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({ [name]: value });

    if (value == "") {
      this.setState({
        filteredData: this.state.allData,
      });
    } else {
      this.setState({
        filteredData: this.state.allData.filter(
          (item) => item.a_types === value
        ),
      });
    }
  }

  handleSearchSampleType(e) {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({ [name]: value });

    if (value == "") {
      this.setState({
        filteredData: this.state.allData,
      });
    } else {
      this.setState({
        filteredData: this.state.allData.filter(
          (item) => item.a_sample_type === value
        ),
      });
    }
  }

  handleChangeDueDate(due_date) {
    var due_date = due_date || this.state.due_date;
    this.setState({ due_date });
  }

  handleChangeSampleDate(sample_date) {
    var sample_date = sample_date || this.state.sample_date;
    this.setState({ sample_date });
  }

  handleChangeSendingDate(sending_date) {
    var sending_date = sending_date || this.state.sending_date;
    this.setState({ sending_date });
  }

  handleChangeFetchDate(fetch_date) {
    var fetch_date = fetch_date || this.state.fetch_date;
    this.setState({ fetch_date });
  }

  onChangeChargeDate(charge_value) {
    var charge_value = charge_value || this.state.charge_value;
    this.setState({ charge_value });
  }

  onSaveWeight = () => {
    let material_left = "";
    if (this.state.stock_flag === true) {
      material_left = this.state.weight_acutal_value;
    }
    var data = {
      parent_id: this.state.parent_id,
      id: this.state.weight_id,
      weight: this.state.weight_acutal_value,
    };
    var token = localStorage.getItem("token");

    axios
      .post(Config.ServerUri + "/add_weight", {
        data,
        comment: this.state.weight_comment,
        token: token,
        material_left: material_left,
      })
      .then((res) => {
        this.setState({
          allData: res.data,
          filteredData: res.data,
          weight_flag: false,
        });
      });

    this.setState({
      weight_acutal_value: "",
      weight_comment: "",
      weight_table_flag: false,
    });
  };

  onSaveCharge() {
    var data = {
      parent_id: this.state.parent_id,
      id: this.state.weight_id,
      charge: this.state.charge_value,
      comment: this.state.charge_comment,
    };
    var token = localStorage.getItem("token");
    axios
      .post(Config.ServerUri + "/add_charge", { data, token: token })
      .then((res) => {
        this.setState({
          allData: res.data,
          filteredData: res.data,
          charge_flag: false,
        });
      });

    this.setState({
      charge_value: "",
      charge_comment: "",
      charge_table_flag: false,
    });
  }

  onChange_material(e, i) {
    const { mat } = this.state;
    var da = mat[i].split(",");
    var ddd = da.filter((v) => v != e.target.value);
    ddd.unshift(e.target.value);
    mat[i] = ddd.toString();
    var pattern = e.target.value.toString().split(" ");
    var free = e.target.value
      .toString()
      .substr(0, e.target.value.toString().lastIndexOf(" "));
    var real = free.toString().substr(0, free.toString().lastIndexOf(" "));
    var selfreeValue = free.toString().split(" ");
    var stockid = pattern[pattern.length - 1];
    this.setState({
      stockid: stockid,
      stock_sample: real,
      selfree: selfreeValue[selfreeValue.length - 1],
    });
  }

  onSaveStock() {
    const { stock_data, stock_sample, stock_disable_arr } = this.state;
    var flag = 0;
    var num = 0;
    stock_data.map((e) => {
      if (e == "") {
        flag = 0;
      } else {
        num = Number(num) + Number(e);
        flag = 1;
      }
    });
    // Single
    if (this.state.param == "single") {
      if (flag == 0) {
        notification.warning({
          message: "Error",
          description: "Please enter your data!",
          className: "not-css",
        });
        return;
      } else if (num > this.state.freeValue) {
        notification.warning({
          message: "Error",
          description: "Value exceeded!",
          className: "not-css",
        });
        return;
      } else {
        axios
          .post(Config.ServerUri + "/add_mat", {
            totalValue: num,
            _id: this.state.stockid,
          })
          .then((res) => {
            this.setState({
              allData: res.data,
              filteredData: res.data,
              mat: [],
              stock_modal_flag: false,
              multiarr: [],
            });
          })
          .catch((err) => console.log(err));
      }
      // Multiple
    } else {
      console.log(this.state.multiarr);
      var tSum = 0;
      this.state.multiarr.map((m) => {
        this.state.onlynumarr.map((o) => {
          if (m.id == o.id) {
            tSum += Number(o.val);
            m.num = tSum;
          }
        });
      });
      if (stock_data[stock_data.length - 1] != "") {
        notification.warning({
          message: "Error",
          description: "Click the Add button and then click the OK button.",
          className: "not-css",
        });
        return;
      } else {
        axios
          .post(Config.ServerUri + "/add_multi_mat", {
            sendarrval: this.state.multiarr,
            lastid: this.state.stockid,
            lastval: stock_data[stock_data.length - 1],
          })
          .then((res) => {
            this.setState({
              allData: res.data,
              filteredData: res.data,
              mat: [],
              stock_modal_flag: false,
              multiarr: [],
              onlynumarr: [],
            });
          })
          .catch((err) => console.log(err));

        this.state.allData.map((e) => {
          if (e._id == this.state.stockid) {
            this.state.analysisType = e.a_types.toString();
            this.state.certificate = e.c_types.toString();
            this.state.lotcharge = e.Charge[0].charge;
            this.state.lotupdatedate = e.Charge[0].update_date;
            this.state.lotuser = e.Charge[0].user._id;
          }
        });
        axios
          .post(Config.ServerUri + "/sample_mat", {
            mat_left: stock_data[stock_data.length - 1],
            sampleinfo: stock_sample,
            selfid: this.state.selfid,
            stockid: this.state.stockid,
            analysisType: this.state.analysisType,
            certificate: this.state.certificate,
            lotcharge: this.state.lotcharge,
            lotupdatedate: this.state.lotupdatedate,
            lotuser: this.state.lotuser,
            tSum: tSum,
          })
          .then((res) => {
            this.setState({
              allData: res.data,
              filteredData: res.data,
              stock_disable_arr,
            });
          })
          .catch((err) => console.log(err));
      }
    }
  }

  async onRowClicked(item, analysis) {
    var history_item = [];
    var reason = [];

    await axios.get(Config.ServerUri + "/get_objective_history").then((res) => {
      res.data.objectivehistory.map((temp) => {
        if (analysis === temp.analysis && item._id === temp.id) {
          this.onChangeValue(temp);
          history_item.push(temp);
        }
      });
    });

    await axios.get(Config.ServerUri + "/get_all_reason").then((res) => {
      reason = res.data;
    });
    this.setState({
      laboratory: item._id,
      a_types: item.a_types,
      material: item.material,
      anaylsis_button: analysis,
      history_item: history_item,
      client_id: item.client_id,
      reason: reason,
    });
    this.setModal_detail(true);
  }

  onChangeValue(data) {
    console.log(data);
    var color = "";
    var accept = false;
    var reason = "";
    if (data.accept) {
      console.log(111);
      accept = data.accept;
    }

    if (data.reason) {
      console.log(222);
      reason = data.reason;
    }

    if (data.min <= data.limitValue && data.limitValue <= data.max) {
      color = "#2eb85c";
    } else {
      color = "#e55353";
    }

    if (data.accept === true) {
      console.log(555);
      color = "#2eb85c";
    }

    this.setState({
      [data.id + "-" + data.analysis + "-" + data.obj_value + "-" + data.unit]:
        data._id,
      [data.id +
      "-" +
      data.label +
      "-" +
      data.unit +
      "-" +
      data.obj_value +
      "-" +
      data.analysis +
      `[${data.min}, ${data.max}]`]: data.limitValue,
      [data.id +
      "-" +
      data.label +
      "-" +
      data.unit +
      "-" +
      data.obj_value +
      "-" +
      data.analysis +
      `[${data.min}, ${data.max}]` +
      "reason"]: reason,
      [data.id +
      "-" +
      data.label +
      "-" +
      data.unit +
      "-" +
      data.obj_value +
      "-" +
      data.analysis +
      `[${data.min}, ${data.max}]` +
      "checkbox"]: accept,
      [data.id + "-" + data.analysis + "-" + data.label + data.unit]: color,
    });
  }

  setModal_detail(modal) {
    this.setState({ modal_detail: modal, object_history: false });
  }

  client_detail_cancel() {
    this.setState({ client_detail_flag: false });
  }

  weight_data_cancel() {
    this.setState({ weight_flag: false, weight_table_flag: false });
  }

  charge_data_cancel() {
    this.setState({ charge_flag: false, charge_table_flag: false });
  }

  stock_modal_cancel() {
    this.setState({ stock_modal_flag: false, stock_data: [""], mat: [] });
  }

  certificate_modal_state = (data, v) => {
    var objectives = [];
    this.state.analysisData.map((item) => {
      data.a_types.map((temp) => {
        if (item.analysisType === temp) {
          item.objectives.map((item0) => {
            this.state.objectives.map((temp0) => {
              temp0.units.map((ind) => {
                if (item0.id === temp0._id && item0.unit === ind) {
                  this.state.materialsData.map((mat) => {
                    if (mat.material === data.material) {
                      mat.aTypesValues.map((obj) => {
                        if (
                          obj.label === temp &&
                          obj.obj === temp0._id + "-" + ind &&
                          obj.client === data.client_id
                        ) {
                          objectives.push({
                            label: temp0.objective,
                            value: temp0._id,
                            min: obj.min,
                            max: obj.max,
                            id: data._id,
                            analysis: obj.label,
                            certificate: v,
                            unit: this.getUnitName(item0.unit),
                            unit_id: item0.unit,
                            material: mat._id,
                            client: data.client_id,
                          });
                        }
                      });
                    }
                  });
                }
              });
            });
          });
        }
      });
    });

    this.setState({
      pdfdata: {},
      certificateVisible: true,
      c_rowdata: data,
      selectCertificate: v,
      rowObj: objectives,
    });
  };
  certificate_Modal_cancel = () => {
    this.setState({ certificateVisible: false });
  };
  AnalysisTypeChange() {
    this.setState({ history_item: [] });
    this.setModal_detail(false);
  }

  onChangeweight(e) {
    this.setState({ weight_acutal_value: e.target.value });
  }

  weight_history_table = () => {
    this.setState({ weight_table_flag: !this.state.weight_table_flag });
  };

  charge_history_table = () => {
    this.setState({ charge_table_flag: !this.state.charge_table_flag });
  };

  renderWeightDetail() {
    return (
      <CCard>
        <CCardBody>
          <CForm>
            <CFormGroup>
              <CRow style={{ marginTop: "5px" }}>
                <CCol md="4">
                  <CLabel
                    style={{ float: "right", cursor: "pointer" }}
                    onClick={this.weight_history_table}
                  >
                    Weight(actual):
                  </CLabel>
                </CCol>
                <CCol md="8">
                  <CInput
                    type="number"
                    name="weight_actual"
                    value={this.state.weight_acutal_value}
                    onChange={this.onChangeweight}
                  ></CInput>
                </CCol>
              </CRow>
              <CRow style={{ marginTop: "5px", marginBottom: "5px" }}>
                <CCol md="4">
                  <CLabel style={{ float: "right" }}>Comment:</CLabel>
                </CCol>
                <CCol md="8">
                  <CTextarea
                    name="weight_comment"
                    value={this.state.weight_comment}
                    onChange={(e) => this.onChangeComment(e)}
                  ></CTextarea>
                </CCol>
              </CRow>
              {this.state.weight_table_flag === true ? (
                <CDataTable
                  items={this.state.weight_history}
                  fields={weight_fields}
                  scopedSlots={{
                    author: (item, index) => {
                      return <td>{item.user.userName}</td>;
                    },
                    comment: (item) => {
                      if (item.comment === undefined) {
                        return <td></td>;
                      } else {
                        return <td>{item.comment}</td>;
                      }
                    },
                  }}
                ></CDataTable>
              ) : (
                <></>
              )}
            </CFormGroup>
          </CForm>
        </CCardBody>
      </CCard>
    );
  }

  renderStockDetail() {
    return (
      <CCard>
        <CCardBody>
          <CForm>
            <CFormGroup>
              <div
                style={{
                  marginTop: "5px",
                  display: "flex",
                }}
              >
                <div style={{ width: "65%" }}>
                  <CLabel
                    style={{ float: "left" }}
                    onClick={this.charge_history_table}
                  >
                    Stock Sample
                  </CLabel>
                  {this.state.mat.map((v, i) => (
                    <CSelect
                      onChange={(v) => this.onChange_material(v, i)}
                      value={v}
                      disabled={!this.state.stock_disable_arr[i]}
                      style={{ marginBottom: "10px" }}
                    >
                      {v
                        .toString()
                        .split(",")
                        .map((v1) => (
                          <option key={i} value={v1}>
                            {isNaN(v1.toString().split(" "))
                              ? v1.substr(0, v1.lastIndexOf(" "))
                              : v1}
                          </option>
                        ))}
                    </CSelect>
                  ))}
                </div>
                <div style={{ width: "5%" }} />
                <div style={{ width: "45%" }}>
                  <CLabel
                    style={{ float: "left" }}
                    onClick={this.charge_history_table}
                  >
                    Weight
                  </CLabel>
                  {this.state.stock_data.map((v, item) => (
                    <CInput
                      name={item}
                      disabled={!this.state.stock_disable_arr[item]}
                      style={{ marginBottom: "10px" }}
                      value={v}
                      onChange={(e) => this.onChangeStock(e, item)}
                    />
                  ))}
                </div>
                <div style={{ width: "3%" }} />
                <div style={{ width: "5%", marginTop: "20px" }}>
                  {[...Array(this.state.stock_data.length - 1)].map(
                    (v, item) => (
                      <CButton
                        style={{ marginBottom: "10px" }}
                        color="danger"
                        onClick={() => this.DeleteItem(item)}
                        className="btndel"
                      >
                        <i className="fa fa-trash" />
                      </CButton>
                    )
                  )}
                </div>
              </div>
              <CRow>
                <CCol md="10"></CCol>
                <CCol md="2">
                  <CButton color="info" onClick={() => this.PlusStockdata()}>
                    Add
                  </CButton>
                </CCol>
              </CRow>
            </CFormGroup>
          </CForm>
        </CCardBody>
      </CCard>
    );
  }

  renderChargeDetail() {
    return (
      <CCard>
        <CCardBody>
          <CForm>
            <CFormGroup>
              <CRow style={{ marginTop: "5px" }}>
                <CCol md="4">
                  <CLabel
                    style={{ float: "right" }}
                    onClick={this.charge_history_table}
                  >
                    Charge Date:
                  </CLabel>
                </CCol>
                <CCol md="8">
                  <AtndDatePicker
                    style={{ width: "200px" }}
                    // bordered={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.onChangeChargeDate}
                    value={moment(this.state.charge_value)}
                    showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                  ></AtndDatePicker>
                </CCol>
              </CRow>
              <CRow style={{ marginTop: "5px", marginBottom: "5px" }}>
                <CCol md="4">
                  <CLabel style={{ float: "right" }}>Comment:</CLabel>
                </CCol>
                <CCol md="8">
                  <CTextarea
                    name="charge_comment"
                    value={this.state.charge_comment}
                    onChange={(e) => this.onChangeComment(e)}
                  ></CTextarea>
                </CCol>
              </CRow>
              {this.state.charge_table_flag === true ? (
                <CDataTable
                  items={this.state.charge_history}
                  fields={charge_fields}
                  scopedSlots={{
                    author: (item, index) => {
                      return <td>{item.user.userName}</td>;
                    },
                    comment: (item) => {
                      if (item.comment === undefined) {
                        return <td></td>;
                      } else {
                        return <td>{item.comment}</td>;
                      }
                    },
                  }}
                ></CDataTable>
              ) : (
                <></>
              )}
            </CFormGroup>
          </CForm>
        </CCardBody>
      </CCard>
    );
  }

  renderDetailModalData() {
    var objectives = [];
    var _objectives = [];
    this.state.analysisData.map((item) => {
      this.state.a_types.map((temp) => {
        if (item.analysisType === temp) {
          item.objectives.map((item0) => {
            this.state.objectives.map((temp0) => {
              temp0.units.map((ind) => {
                if (item0.id === temp0._id && item0.unit === ind) {
                  this.state.materialsData.map((mat) => {
                    if (mat.material === this.state.material) {
                      mat.aTypesValues.map((obj) => {
                        if (
                          obj.label === temp &&
                          obj.obj === temp0._id + "-" + ind &&
                          obj.client === this.state.client_id
                        ) {
                          objectives.push({
                            label: temp0.objective,
                            value: temp0._id,
                            min: obj.min,
                            max: obj.max,
                            id: this.state.laboratory,
                            analysis: obj.label,
                            unit: item0.unit,
                          });
                        }
                      });
                    }
                  });
                }
              });
            });
          });
        }
      });
    });

    objectives.map((item) => {
      if (item.analysis === this.state.anaylsis_button) {
        _objectives.push(item);
      }
    });

    this.state._objectives = _objectives;

    return this.renderDetailModalCreate(_objectives);
  }

  renderClientDetailData() {
    var data = this.state.rowData;
    if (data !== "") {
      return (
        <CCard>
          <CCardBody>
            <CForm>
              <CFormGroup>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Name1:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_name1"
                      value={data.delivering.address_name1}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Title:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_title"
                      value={data.delivering.address_title}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Country:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_country"
                      value={data.delivering.address_country}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Name2:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_name2"
                      value={data.delivering.address_name2}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Name3:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_name3"
                      value={data.delivering.address_name3}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.Street:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_street"
                      value={data.delivering.address_street}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      Delivering.Address.ZIP:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="address_zip"
                      value={data.delivering.address_zip}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>
                      CustomerProductCode:
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="customer_product_code"
                      value={data.delivering.customer_product_code}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>E-mail Address:</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      type="email"
                      name="email_address"
                      value={data.delivering.email_address}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>FetchDate:</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="fetch_date"
                      value={data.delivering.fetch_date}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>OrderId:</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="order_id"
                      value={data.delivering.order_id}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>Pos.ID:</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="pos_id"
                      value={data.delivering.pos_id}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol md="5">
                    <CLabel style={{ float: "right" }}>Weight(target):</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      name="weight"
                      value={data.delivering.w_target}
                      readOnly
                    ></CInput>
                  </CCol>
                </CRow>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCard>
      );
    }
  }

  onChangeMinMaxValues(e, item) {
    var value = e.target.value.replace(",", ".");
    if (value.substr(0, 1) === ".") {
      value = "";
    }
    var pattern = "[^0-9.]";
    if (value.match(pattern) != null) {
      value = value.substr(0, value.length - 1);
    }
    if (value.substr(value.length - 1, value.length) === ".") {
      if (value.substr(0, value.length - 1).indexOf(".") > 0) {
        value = value.substr(0, value.length - 1);
      }
    }
    if (value.substr(value.indexOf("."), value.length).length > 5) {
      value = value.substr(0, value.length - 1);
    }
    if (value < Number(item.min) || value > Number(item.max)) {
      this.setState({
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "red",
        accept_disable: false,
      });
    } else {
      this.setState({
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "green",
        accept_disable: true,
      });
    }

    this.setState({
      [e.target.name]: value,
      [item.id +
      "-" +
      item.label +
      "-" +
      item.unit +
      "-" +
      item.value +
      "-" +
      item.analysis +
      `[${item.min}, ${item.max}]` +
      "reason"]: "",
      [item.id +
      "-" +
      item.label +
      "-" +
      item.unit +
      "-" +
      item.value +
      "-" +
      item.analysis +
      `[${item.min}, ${item.max}]` +
      "checkbox"]: false,
    });
  }

  onChangeComment(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCancelModal(objectives) {
    objectives.map((item) => {
      this.setState({
        [item.id +
        "-" +
        item.label +
        "-" +
        item.unit +
        "-" +
        item.value +
        "-" +
        item.analysis +
        `[${item.min}, ${item.max}]`]: "",
        [item.id +
        "-" +
        item.label +
        "-" +
        item.unit +
        "-" +
        item.value +
        "-" +
        item.analysis +
        `[${item.min}, ${item.max}]` +
        "reason"]: "",
        [item.id +
        "-" +
        item.label +
        "-" +
        item.unit +
        "-" +
        item.value +
        "-" +
        item.analysis +
        `[${item.min}, ${item.max}]` +
        "checkbox"]: false,
        [item.label]: false,
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "black",
      });
    });
    this.setState({ comment: "" });

    this.setModal_detail(false);
  }

  onClickLabel(label, objectives) {
    var history_item = [];
    axios.get(Config.ServerUri + "/get_objective_history").then((res) => {
      res.data.objectivehistory.map((item) => {
        if (this.state.laboratory === item.id) {
          var comment = "";
          if (item.comment !== undefined) {
            comment = item.comment;
          }
          var data = {};
          data.author = item.userid.userName;
          data.update_date = item.update_date;
          data.comment = comment;
          data.label = item.label;
          data.analysis = item.analysis;
          data.limitValue = item.limitValue;
          data._id = item._id;
          data.unit = item.unit;
          data.value = item.obj_value;
          data.reason = item.reason;
          data.accept = item.accept;

          if (data.constructor === Object && Object.keys(data).length === 0) {
          } else {
            if (
              data.label == label.label &&
              data.unit == label.unit &&
              data.value == label.value &&
              data.analysis == this.state.anaylsis_button
            ) {
              history_item.push(data);
            }
          }
        }
      });

      objectives.map((item) => {
        if (item.label !== label.label) {
          this.setState({
            [item.label +
            "-" +
            item.analysis +
            "-" +
            item.unit +
            "-" +
            item.value +
            "-" +
            item.id]: false,
          });
        }
      });

      this.setState({
        objectiveHistory: res.data.objectivehistory,
        [label.label +
        "-" +
        label.analysis +
        "-" +
        label.unit +
        "-" +
        label.value +
        "-" +
        label.id]:
          !this.state[
            label.label +
              "-" +
              label.analysis +
              "-" +
              label.unit +
              "-" +
              label.value +
              "-" +
              label.id
          ],
        history_item: history_item,
      });
    });
  }

  onClickSaveObjectiveHistory(objectives) {
    var history_item = [];
    var data = [];

    objectives.map((item) => {
      data.push({
        label: item.label,
        value:
          this.state[
            item.id +
              "-" +
              item.label +
              "-" +
              item.unit +
              "-" +
              item.value +
              "-" +
              item.analysis +
              `[${item.min}, ${item.max}]`
          ],
        reason:
          this.state[
            item.id +
              "-" +
              item.label +
              "-" +
              item.unit +
              "-" +
              item.value +
              "-" +
              item.analysis +
              `[${item.min}, ${item.max}]` +
              "reason"
          ],
        accept:
          this.state[
            item.id +
              "-" +
              item.label +
              "-" +
              item.unit +
              "-" +
              item.value +
              "-" +
              item.analysis +
              `[${item.min}, ${item.max}]` +
              "checkbox"
          ],
        id: item.id,
        analysis: item.analysis,
        min: item.min,
        max: item.max,
        obj_value: item.value,
        unit: item.unit,
        _id: this.state[
          item.id + "-" + item.analysis + "-" + item.value + "-" + item.unit
        ],
      });
    });

    var token = localStorage.getItem("token");

    axios
      .post(Config.ServerUri + "/create_objective_history", {
        data: data,
        comment: this.state.comment,
        token: token,
      })
      .then((res) => {
        res.data.map((item) => {
          if (this.state.laboratory === item.id) {
            var data = {};
            data.author = item.userid.userName;
            data.update_date = item.update_date;
            data.comment = item.comment;

            if (data.constructor === Object && Object.keys(data).length === 0) {
            } else {
              history_item.push(data);
            }
          }
        });
        this.setState({
          objectiveHistory: res.data,
          history_item: history_item,
          object_history: false,
          modal_detail: false,
        });

        objectives.map((item) => {
          this.setState({
            [item.label]: false,
            comment: "",
            [item.id +
            "-" +
            item.label +
            "-" +
            item.unit +
            "-" +
            item.value +
            "-" +
            item.analysis +
            `[${item.min}, ${item.max}]`]: "",
            [item.id +
            "-" +
            item.label +
            "-" +
            item.unit +
            "-" +
            item.value +
            "-" +
            item.analysis +
            `[${item.min}, ${item.max}]` +
            "reason"]: "",
            [item.id +
            "-" +
            item.label +
            "-" +
            item.unit +
            "-" +
            item.value +
            "-" +
            item.analysis +
            `[${item.min}, ${item.max}]` +
            "checkbox"]: false,
            [item.id + "-" + item.analysis + "-" + item.label + item.unit]:
              "black",
          });
        });
      });
  }

  renderDetailModalCreate(objectives) {
    var data = {};
    var dis = "";
    data = objectives.map((item) => {
      return this.state.unitData.map((temp) => {
        if (item.analysis === this.state.anaylsis_button) {
          if (temp._id === item.unit) {
            return (
              <>
                <CRow>
                  <CCol md="4">
                    <CRow>
                      <CCol md="8">
                        <CLabel
                          htmlFor="objective"
                          onClick={() => this.onClickLabel(item, objectives)}
                        >
                          {item.label +
                            " " +
                            temp.unit +
                            " " +
                            `[${item.min}, ${item.max}]`}
                        </CLabel>
                      </CCol>
                      <CCol md="4">
                        <Input
                          type="text"
                          name={
                            item.id +
                            "-" +
                            item.label +
                            "-" +
                            item.unit +
                            "-" +
                            item.value +
                            "-" +
                            item.analysis +
                            `[${item.min}, ${item.max}]`
                          }
                          value={
                            this.state[
                              item.id +
                                "-" +
                                item.label +
                                "-" +
                                item.unit +
                                "-" +
                                item.value +
                                "-" +
                                item.analysis +
                                `[${item.min}, ${item.max}]`
                            ]
                          }
                          style={{
                            color:
                              this.state[
                                item.id +
                                  "-" +
                                  item.analysis +
                                  "-" +
                                  item.label +
                                  item.unit
                              ],
                          }}
                          className="form-control-sm"
                          onChange={(e) => this.onChangeMinMaxValues(e, item)}
                          required={true}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md="4">
                    <CRow>
                      <CCol md="3">
                        <CLabel>Reason</CLabel>
                      </CCol>
                      <CCol md="9">
                        <CSelect
                          name={
                            item.id +
                            "-" +
                            item.label +
                            "-" +
                            item.unit +
                            "-" +
                            item.value +
                            "-" +
                            item.analysis +
                            `[${item.min}, ${item.max}]` +
                            "reason"
                          }
                          value={
                            this.state[
                              item.id +
                                "-" +
                                item.label +
                                "-" +
                                item.unit +
                                "-" +
                                item.value +
                                "-" +
                                item.analysis +
                                `[${item.min}, ${item.max}]` +
                                "reason"
                            ] === undefined
                              ? ""
                              : this.state[
                                  item.id +
                                    "-" +
                                    item.label +
                                    "-" +
                                    item.unit +
                                    "-" +
                                    item.value +
                                    "-" +
                                    item.analysis +
                                    `[${item.min}, ${item.max}]` +
                                    "reason"
                                ]
                          }
                          onChange={this.handleSeltectedChangeReason}
                        >
                          <option key="default" value="" disabled>
                            Select reason [from Admin/reasons]
                          </option>
                          {this.state.reason.map((item) => (
                            <option key={item._id} value={item.reason}>
                              {item.reason}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md="4">
                    <CRow>
                      <CCol md="7">
                        <CLabel
                          style={{
                            display:
                              this.state.accept_visible === true
                                ? "block"
                                : "none",
                          }}
                        >
                          Accept value anyway
                        </CLabel>
                      </CCol>
                      <CCol md="2">
                        <div
                          style={{
                            display:
                              this.state.accept_visible == true
                                ? "block"
                                : "none",
                            pointerEvents: this.state.accept_disable
                              ? "none"
                              : "auto",
                          }}
                          className={
                            this.state[
                              item.id +
                                "-" +
                                item.label +
                                "-" +
                                item.unit +
                                "-" +
                                item.value +
                                "-" +
                                item.analysis +
                                `[${item.min}, ${item.max}]` +
                                "checkbox"
                            ] === true
                              ? "chk clr-full"
                              : "chk"
                          }
                          onClick={(e) => {
                            this.setState({
                              [item.id +
                              "-" +
                              item.label +
                              "-" +
                              item.unit +
                              "-" +
                              item.value +
                              "-" +
                              item.analysis +
                              `[${item.min}, ${item.max}]` +
                              "checkbox"]:
                                !this.state[
                                  item.id +
                                    "-" +
                                    item.label +
                                    "-" +
                                    item.unit +
                                    "-" +
                                    item.value +
                                    "-" +
                                    item.analysis +
                                    `[${item.min}, ${item.max}]` +
                                    "checkbox"
                                ],
                            });
                          }}
                        ></div>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow style={{ marginTop: "5px" }}>
                  <CCol>
                    {this.state[
                      item.label +
                        "-" +
                        item.analysis +
                        "-" +
                        item.unit +
                        "-" +
                        item.value +
                        "-" +
                        item.id
                    ] === true ? (
                      <>
                        <CDataTable
                          items={this.state.history_item}
                          fields={object_fields}
                          scopedSlots={{
                            author: (item, index) => {
                              return <td>{item.author}</td>;
                            },
                            accept: (item, index) => {
                              return (
                                <td>
                                  <div
                                    className={
                                      item.accept === true
                                        ? "chk clr-full"
                                        : "chk"
                                    }
                                  ></div>
                                </td>
                              );
                            },
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </CCol>
                </CRow>
              </>
            );
          }
        }
      });
    });

    return (
      <CCard>
        <CCardBody>
          <CForm>
            <CFormGroup>
              {data}
              <CRow style={{ marginTop: "5px" }}>
                <CCol md="2">
                  <CLabel>Comment</CLabel>
                </CCol>
                <CCol md="10">
                  <CTextarea
                    name="comment"
                    value={this.state.comment}
                    onChange={(e) => this.onChangeComment(e)}
                  ></CTextarea>
                </CCol>
              </CRow>
            </CFormGroup>
          </CForm>
          <div className="float-right">
            <CButton
              type="submit"
              color="info"
              onClick={() => this.onClickSaveObjectiveHistory(objectives)}
            >
              OK
            </CButton>
            <span style={{ padding: "4px" }} />
            <CButton
              color="secondary"
              onClick={() => this.onCancelModal(objectives)}
            >
              Cancel
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    );
  }

  renderModalCreate() {
    const {
      sampleTypesData,
      packingTypesData,
      materialsData,
      client_list,
      a_type_list,
      c_type_list,
    } = this.state;
    var clientOptions = [];
    this.state.client_list.map((item) => {
      clientOptions.push({ label: item.name, value: item._id });
      return true;
    });

    var c_types_options = [];
    this.state.c_type_list.map((item) => {
      c_types_options.push({ label: item.certificateType, value: item._id });
      return true;
    });

    var analysis_option = Array.from(
      a_type_list.reduce((a, o) => a.set(`${o[0]._id}`, o), new Map()).values()
    );

    var error = this.state.double_error;

    return (
      <CCard>
        <CCardBody>
          <CForm
            onSubmit={
              this.state._create === true
                ? this.createInputLaboratory
                : this.updateInputLaboratory
            }
          >
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Sample Type</CLabel>
              <CSelect
                name="sample_type"
                value={this.state.sample_type}
                onChange={this.handleSelectChangeSampleType}
                required
              >
                <option value="" disabled hidden>
                  * Select from Sample Type *
                </option>
                {sampleTypesData.map((item) => (
                  <option key={item._id} value={item.sampleType}>
                    {item.sampleType}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Material</CLabel>
              <CSelect
                id="material"
                name="material"
                value={this.state.material}
                onChange={this.handleSelectChangeMaterial}
                disabled={this.state.disabled_material}
              >
                <option value="">* Material *</option>
                {materialsData.map((item) => (
                  <option key={item._id} value={item.material}>
                    {item.material}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Client</CLabel>
              <CSelect
                id="client_id"
                name="client"
                /* options={clientOptions} */ disabled={
                  this.state.disabled_client
                }
                value={this.state.client}
                onChange={this.handleSelectChangeClient}
              >
                <option value="">Default</option>
                {client_list.map((client) => (
                  <option
                    key={client._id}
                    value={client.name + "-" + client._id}
                  >
                    {client.name}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            {this.state.display_detail === true ? (
              <>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Name1
                  </CLabel>
                  <CInput
                    id="address_name1"
                    name="address_name1"
                    value={this.state.address_name1}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Title
                  </CLabel>
                  <CInput
                    id="address_title"
                    name="address_title"
                    value={this.state.address_title}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Country
                  </CLabel>
                  <CInput
                    id="address_country"
                    name="address_country"
                    value={this.state.address_country}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Name2
                  </CLabel>
                  <CInput
                    id="address_name2"
                    name="address_name2"
                    value={this.state.address_name2}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Name3
                  </CLabel>
                  <CInput
                    id="address_name3"
                    name="address_name3"
                    value={this.state.address_name3}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.Street
                  </CLabel>
                  <CInput
                    id="address_street"
                    name="address_street"
                    value={this.state.address_street}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Delivering.Address.ZIP
                  </CLabel>
                  <CInput
                    id="address_zip"
                    name="address_zip"
                    value={this.state.address_zip}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>
                    Customer Product Code
                  </CLabel>
                  <CInput
                    id="customer_product_code"
                    name="customer_product_code"
                    value={this.state.customer_product_code}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>E-mail Address</CLabel>
                  <ReactMultiEmail
                    placeholder="placeholder"
                    emails={this.state.email_address}
                    onChange={(_emails) => {
                      this.setState({ email_address: _emails });
                    }}
                    validateEmail={(email) => {
                      return isEmail(email); // return boolean
                    }}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          {email}
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>Fetch Date</CLabel>
                  <div id="charge">
                    <AtndDatePicker
                      style={{ width: "700px" }}
                      bordered={false}
                      format="YYYY-MM-DD"
                      onChange={this.handleChangeFetchDate}
                      value={moment(this.state.fetch_date)}
                    ></AtndDatePicker>
                  </div>
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>Order.ID</CLabel>
                  <CInput
                    id="order_id"
                    name="order_id"
                    value={this.state.order_id}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>Pos.ID</CLabel>
                  <CInput
                    id="pos_id"
                    name="pos_id"
                    value={this.state.pos_id}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel style={{ fontWeight: "500" }}>Weight(target)</CLabel>
                  <CInput
                    type="number"
                    id="w_target"
                    name="w_target"
                    value={this.state.w_target}
                    onChange={this.handleInputChange}
                  />
                </CFormGroup>
              </>
            ) : (
              <></>
            )}
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Packing Type</CLabel>
              <CSelect
                id="packing_type"
                name="packing_type"
                value={this.state.packing_type}
                disabled={this.state.disabled_packing_type}
                onChange={this.handleInputChange}
              >
                <option value="0" disabled hidden>
                  * Packing Type *
                </option>
                {packingTypesData.map((item) => (
                  <option key={item.id} value={item.packingType}>
                    {item.packingType}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Due Date</CLabel>
              <div id="charge">
                <AtndDatePicker
                  style={{ width: "700px" }}
                  bordered={false}
                  format="YYYY-MM-DD"
                  onChange={this.handleChangeDueDate}
                  value={moment(this.state.due_date)}
                  disabled={this.state.disabled_due_date}
                ></AtndDatePicker>
              </div>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Sample Date</CLabel>
              <div id="charge">
                <AtndDatePicker
                  style={{ width: "700px" }}
                  bordered={false}
                  format="YYYY-MM-DD"
                  onChange={this.handleChangeSampleDate}
                  value={moment(this.state.sample_date)}
                  disabled={this.state.disabled_sample_date}
                ></AtndDatePicker>
              </div>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Sending Date</CLabel>
              <div id="charge">
                <AtndDatePicker
                  style={{ width: "700px" }}
                  bordered={false}
                  format="YYYY-MM-DD"
                  onChange={this.handleChangeSendingDate}
                  value={moment(this.state.sending_date)}
                  disabled={this.state.disabled_sending_date}
                ></AtndDatePicker>
              </div>
            </CFormGroup>

            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Analysis Types</CLabel>
              <Select
                style={{
                  width: "100%",
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
                id="analysisType"
                size="large"
                name="a_types"
                mode="multiple"
                value={
                  this.state.a_types === "" ? undefined : this.state.a_types
                }
                disabled={this.state.disabled_analysisType}
                onChange={(e) => this.handleMultiSelectChangeAnalysisType(e)}
              >
                {analysis_option.map((a_type, key) => (
                  <Select.Option key={key} value={a_type[0].analysisType}>
                    {a_type[0].analysisType}
                  </Select.Option>
                ))}
              </Select>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Certificate Types</CLabel>
              <Select
                style={{
                  width: "100%",
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
                id="certificateType"
                name="c_types"
                size="large"
                mode="multiple"
                value={
                  this.state.c_types === "" ? undefined : this.state.c_types
                }
                disabled={this.state.disabled_certificateType}
                onChange={(e) => this.handleMultiSelectChangeCertificateType(e)}
              >
                {c_type_list.map((item) => (
                  <Select.Option key={item._id} value={item.certificateType}>
                    {item.certificateType}
                  </Select.Option>
                ))}
              </Select>
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Distributor</CLabel>
              <CInput
                id="distributor"
                name="distributor"
                value={this.state.distributor}
                onChange={this.handleInputChange}
                disabled={this.state.disabled_distributor}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Geo-Location</CLabel>
              <CInput
                id="geo_locaion"
                name="geo_locaion"
                value={this.state.geo_locaion}
                onChange={this.handleInputChange}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel style={{ fontWeight: "500" }}>Remark</CLabel>
              <CInput
                id="remark"
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
    const { analysisData, sampleTypesData, filteredData, pdfdata } = this.state;
    return (
      <div>
        <div>
          <div style={{ display: "flex" }}>
            <CLabel
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minWidth: "100px",
                textAlign: "right",
              }}
            >
              {this.state.analysisType_label}
            </CLabel>
            <CSelect
              style={{ maxWidth: "20%", margin: "0 20px" }}
              name="search_a_types"
              onChange={this.handleSearchAnalysisType}
              value={this.state.search_a_types}
            >
              <option value="">*Search Analysis Type*</option>
              {analysisData.map((item) => (
                <option key={item._id} value={item.analysisType}>
                  {item.analysisType}
                </option>
              ))}
            </CSelect>
            <CLabel
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minWidth: "100px",
                textAlign: "right",
              }}
            >
              {this.state.sampleType_label}
            </CLabel>
            <ReactFileReader handleFiles={this.handleFiles} fileTypes={".csv"}>
              <CButton
                color="info"
                className="float-right"
                style={{ margin: "0px 0px 0px 16px" }}
              >
                <i className="fa fa-upload" />
                <span style={{ padding: "4px" }} />
                upload
                {this.state.import_label}
              </CButton>
            </ReactFileReader>
            <CButton
              color="info"
              className="float-right"
              style={{ margin: "0px 0px 0px 16px" }}
              onClick={this.on_export_clicked}
            >
              <i className="fa fa-download"></i>
              <span style={{ padding: "4px" }} />
              download
              {this.state.export_label}
            </CButton>
            <CSVLink
              headers={header}
              filename="Laboratory.csv"
              data={this.state.allData}
              ref={(r) => (this.csvLink = r)}
            ></CSVLink>
            <CButton
              color="info"
              className="float-right"
              style={{ margin: "0px 0px 0px 16px" }}
              onClick={() => {
                this.on_create_clicked();
              }}
            >
              <i className="fa fa-plus" />
              <span style={{ padding: "4px" }} />
              create
              {this.state.create_new_label}
            </CButton>
          </div>
        </div>
        <div id="tableInputLaboratory">
          <CDataTable
            items={filteredData}
            fields={this.state.fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            tableFilter
            pagination
            hover
            scopedSlots={{
              client: (item, index) => {
                var button_name = "";
                if (item.client === "") {
                  button_name = "Default";
                } else if (item.client === "undefined") {
                  button_name = "";
                } else {
                  button_name = item.client.split("-")[0];
                }
                return (
                  <td>
                    {button_name ? (
                      <CButton
                        style={{ cursor: "pointer" }}
                        onClick={() => this.on_client_clicked(item)}
                      >
                        {button_name}
                      </CButton>
                    ) : (
                      ""
                    )}
                  </td>
                );
              },
              buttonGroups: (item, index) => {
                var data = item;
                if (item.client != undefined) {
                  data.client = item.client.split("-")[0];
                  return (
                    <td>
                      <div style={{ display: "flex" }}>
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => {
                            this.on_add_material(item);
                          }}
                        >
                          M
                        </CButton>
                        <span style={{ padding: "4px" }} />
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
                        <span style={{ padding: "4px" }} />
                      </div>
                    </td>
                  );
                }
              },
              a_types: (item, index) => {
                var data = [];
                var color = "";
                item.a_types.map((v, k) => {
                  data = [];
                  this.state.objectiveHistory.map((temp) => {
                    if (temp.id === item._id) {
                      data.push(temp);
                    }
                  });
                });

                return (
                  <td>
                    <div style={{ display: "column" }}>
                      {item.a_types.map((v, k) => {
                        if (data.length === 0) {
                          return (
                            <div style={{ padding: "5px" }}>
                              <CButton
                                key={k}
                                style={{
                                  backgroundColor: "grey",
                                  color: "white",
                                }}
                                size="sm"
                                onClick={() => {
                                  this.onRowClicked(item, v);
                                }}
                              >
                                {v}
                              </CButton>
                            </div>
                          );
                        } else {
                          var analysis_history = [];
                          var color_group = [];
                          for (var i = data.length - 1; i >= 0; i--) {
                            if (
                              !analysis_history.some(
                                (val) =>
                                  `${val.label} + ${val.analysis} + ${val.obj_value}` ===
                                  `${data[i].label} + ${data[i].analysis} + ${data[i].obj_value}`
                              )
                            ) {
                              analysis_history.push(data[i]);
                            }
                          }
                          // console.log(111, analysis_history);

                          color = "";
                          analysis_history.map((temp, index) => {
                            if (temp.analysis === v) {
                              if (
                                temp.limitValue >= temp.min &&
                                temp.limitValue <= temp.max
                              ) {
                                if (color === "#e55353") {
                                  color = "#e55353";
                                } else {
                                  color = "#2eb85c";
                                }
                                color_group.push(color);
                              } else {
                                if (temp.accept === true) {
                                  color = "#2eb85c";
                                } else {
                                  color = "#e55353";
                                }
                                color_group.push(color);
                              }
                            }
                          });

                          if (color_group.length !== 0) {
                            var a = color_group.filter(
                              (temp) => temp === "#e55353"
                            );

                            if (a.length === 0) {
                              color = "#2eb85c";
                            } else {
                              color = "#e55353";
                            }
                          }

                          if (color == "") {
                            color = "grey";
                          }

                          return (
                            <div style={{ padding: "5px" }}>
                              <CButton
                                key={k}
                                style={{
                                  backgroundColor: color,
                                  color: "white",
                                }}
                                size="sm"
                                onClick={() => {
                                  this.onRowClicked(item, v);
                                }}
                              >
                                {v}
                              </CButton>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </td>
                );
              },
              c_types: (item, index) => {
                var data = [];
                var color = "";
                var color_group = [];
                item.a_types.map((v, k) => {
                  data = [];
                  this.state.objectiveHistory.map((temp) => {
                    if (temp.id === item._id) {
                      data.push(temp);
                    }
                  });
                });
                data.map((temp) => {
                  color = "";
                  if (
                    temp.limitValue >= temp.min &&
                    temp.limitValue <= temp.max
                  ) {
                    if (color === "#e55353") {
                      color = "#e55353";
                    } else {
                      color = "#2eb85c";
                    }
                    color_group.push(color);
                  } else {
                    if (temp.accept === true) {
                      color = "#2eb85c";
                    } else {
                      color = "#e55353";
                    }
                  }
                });

                if (color == "") {
                  color = "#e55353";
                }
                if (item.client == "") {
                  color = "#e55353";
                }

                if (color == "#e55353") {
                  return (
                    <td>
                      {item.c_types.map((v) => (
                        <CButton>{v}</CButton>
                      ))}
                    </td>
                  );
                } else {
                  return (
                    <td>
                      {item.c_types.map((v) => (
                        <CButton
                          onClick={() => this.certificate_modal_state(item, v)}
                        >
                          {v}
                        </CButton>
                      ))}
                    </td>
                  );
                }
              },
              Weight: (item, index) => {
                if (item.Weight.length === 0) {
                  return (
                    <td>
                      <CButton onClick={() => this.onClick_weight(item)}>
                        N/A
                      </CButton>
                    </td>
                  );
                } else {
                  var weight = "";
                  item.Weight.map((item) => {
                    weight = item.weight;
                  });
                  return (
                    <td>
                      <CButton onClick={() => this.onClick_weight(item)}>
                        {weight}
                      </CButton>
                    </td>
                  );
                }
              },
              Charge: (item, index) => {
                if (item.Charge.length === 0) {
                  return (
                    <td>
                      <CButton onClick={() => this.onClick_charge(item)}>
                        N/A
                      </CButton>
                    </td>
                  );
                } else {
                  return (
                    <td>
                      {item.Charge.map((v) => (
                        <CButton
                          onClick={() => this.onClick_charge(item, v.charge)}
                        >
                          {v.charge}
                        </CButton>
                      ))}
                    </td>
                  );
                }
              },
              material_left: (item) => {
                if (item.material_left === "") {
                  return <td></td>;
                } else {
                  return <td>{item.material_left}</td>;
                }
              },
              stockSample: (item) => {
                if (item.stockSample[0] == "") {
                  return <td></td>;
                } else {
                  return (
                    <td>
                      <ul>
                        {item.stockSample.map((v) => {
                          return <li>{v.val}</li>;
                        })}
                      </ul>
                    </td>
                  );
                }
              },
            }}
          />
        </div>
        <CModal
          show={this.state.modal_delete}
          onClose={() => this.setModal_Delete(false)}
        >
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current inputLaboratory?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="danger"
              onClick={() => this.deleteInputLaboratory()}
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
          show={this.state.modal_create}
          onClose={() => this.setModal_Create(false)}
          closeOnBackdrop={false}
          centered
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>
              {this.state._create === true ? "New Sample" : "Update Sample"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderModalCreate()}</CModalBody>
        </CModal>

        <CModal
          className="anaylsis_types_modal"
          show={this.state.modal_detail}
          onClose={() => this.AnalysisTypeChange()}
          style={{ width: "60vw" }}
          size="lg"
          centered
        >
          <CModalHeader>
            <CModalTitle>{this.state.anaylsis_button}</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderDetailModalData()}</CModalBody>
        </CModal>
        <CModal
          show={this.state.client_detail_flag}
          onClose={() => this.client_detail_cancel()}
          style={{ width: "30vw" }}
        >
          <CModalHeader>
            <CModalTitle>{this.state.client_title}</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderClientDetailData()}</CModalBody>
        </CModal>
        <CModal
          show={this.state.weight_flag}
          onClose={() => this.weight_data_cancel()}
          style={{ width: "30vw" }}
        >
          <CModalHeader>
            <CModalTitle>Weight(actual)</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderWeightDetail()}</CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={() => this.onSaveWeight()}>
              OK
            </CButton>
            <CButton
              onClick={() => this.weight_data_cancel()}
              color="secondary"
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal
          show={this.state.charge_flag}
          onClose={() => this.charge_data_cancel()}
          style={{ width: "30vw" }}
        >
          <CModalHeader>
            <CModalTitle>Charge</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderChargeDetail()}</CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={() => this.onSaveCharge()}>
              OK
            </CButton>
            <CButton
              onClick={() => this.charge_data_cancel()}
              color="secondary"
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          show={this.state.stock_modal_flag}
          onClose={() => this.stock_modal_cancel()}
          style={{ width: "40vw" }}
          closeOnBackdrop={false}
        >
          <CModalHeader>
            <CModalTitle>Stock Sample</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderStockDetail()}</CModalBody>
          <CModalFooter>
            <CButton color="info" onClick={() => this.onSaveStock()}>
              OK
            </CButton>
            <CButton
              onClick={() => this.stock_modal_cancel()}
              color="secondary"
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        <Drawer
          width="70vw"
          title="PDF GENERATE"
          style={{ marginTop: "100px" }}
          visible={this.state.certificateVisible}
          onClose={this.certificate_Modal_cancel}
        >
          <Card hoverable>
            <Row>
              <Col span={5}>
                <List
                  style={{
                    width: "250px",
                    cursor: "pointer",
                    height: "75vh",
                  }}
                  header={<h4>Certificate Template</h4>}
                  bordered
                  dataSource={this.state.certificatedata}
                  renderItem={(item) => (
                    <List.Item onClick={() => this.getcertificatedata(item)}>
                      {item.name}
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={19}>
                {Object.keys(pdfdata).length > 0 && (
                  <div
                    style={{
                      overflowY: "scroll",
                      overflowX: "hidden",
                      height: "73vh",
                    }}
                  >
                    <GPDF
                      pdfdata={pdfdata}
                      pdfcolumns={this.state.pdfcolumns}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </Drawer>
      </div>
    );
  }
}
