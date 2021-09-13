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
  CLabel,
  CInput,
  CCol,
  CRow,
  CTextarea,
} from "@coreui/react";

import "./style.css";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { Select, DatePicker as AtndDatePicker } from "antd";
import ReactFileReader from "react-file-reader";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import moment from "moment";

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
  { key: "comment", label: "Comment" },
];

const weight_fields = [
  { key: "weight", label: "Weight" },
  { key: "author", label: "Author" },
  { key: "update_date", label: "Update Date" },
  { key: "comment", label: "Comment" },
];

const charge_fields = [
  { key: "charge", label: "Charge" },
  { key: "author", label: "Author" },
  { key: "update_date", label: "Update Date" },
  { key: "comment", label: "Comment" },
];

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
    this.onChangeweight = this.onChangeweight.bind(this);
    this.on_export_clicked = this.on_export_clicked.bind(this);

    this.state = {
      clientsData: [],
      materialsData: [],
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
      charge_history: "",
      charge_table_flag: false,
      charge_value: new Date(),
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
  }

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

    this.setState({
      weight_history: item.Weight,
      weight_acutal_value: weight,
      weigt_comment: weight_comment,
      weight_id: weight_id,
      weight_flag: true,
      parent_id: item._id,
    });
  }

  onClick_charge(item) {
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
      charge_value: charge_value,
      weigt_comment: charge_comment,
      charge_id: charge_id,
      charge_flag: true,
      parent_id: item._id,
    });
    this.setState({ charge: item.Charge, charge_flag: true });
  }

  async on_export_clicked() {
    // var history = [];
    // await axios.get(Config.ServerUri + "/get_objective_history").then((res) => {
    //   res.data.objectivehistory.map((item) => {
    //     res.data.unit.map((temp) => {
    //       if (item.unit === temp._id) {
    //         item.unit_name = temp.unit;
    //         history.push(item);
    //       }
    //     });
    //   });
    // });

    // console.log(history);

    // var header_item = [];
    // if (history.length > 0) {
    //   history.map((item, index) => {
    //     var list = [
    //       {
    //         key: "objective" + (index + 1),
    //         label: "Objective" + (index + 1),
    //       },
    //       { key: "unit" + (index + 1), label: "Unit" + (index + 1) },
    //       {
    //         key: "max_min_value" + (index + 1),
    //         label: "MinMaxValue" + (index + 1),
    //       },
    //       {
    //         key: "update_date" + (index + 1),
    //         label: "UpdateDate" + (index + 1),
    //       },
    //       { key: "author" + (index + 1), label: "author" + (index + 1) },
    //       {
    //         key: "limitvalue" + (index + 1),
    //         label: "LimitValue" + (index + 1),
    //       },
    //     ];
    //     header_item = header_item.concat(list);
    //     data["objective" + (index + 1)] = item.label;
    //     data["unit" + (index + 1)] = item.unit_name;
    //     data["max_min_value" + (index + 1)] =
    //       "[" + item.max + "," + item.min + "]";
    //     data["update_date" + (index + 1)] = item.update_date;
    //     data["author" + (index + 1)] = item.userid.userName;
    //     data["limitvalue" + (index + 1)] = item.limitValue;
    //   });
    // }

    // var title = header.concat(header_item);

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
      // display_detail: false
    });

    this.setModal_Create(true);
  }

  on_update_clicked(item) {
    this.setState({
      current_id: item._id,
      sample_type: item.sample_type,
      material: item.material,
      client: item.client,
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
        console.log(res);
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

  onChangeChargeDate(e, i) {
    this.setState({ charge_value: i });
  }

  onSaveWeight = () => {
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

  async onRowClicked(item, analysis) {
    var history_item = [];

    await axios.get(Config.ServerUri + "/get_objective_history").then((res) => {
      res.data.objectivehistory.map((temp) => {
        if (analysis === temp.analysis && item._id === temp.id) {
          this.onChangeValue(temp);
          history_item.push(temp);
        }
      });
    });

    this.setState({
      laboratory: item._id,
      a_types: item.a_types,
      material: item.material,
      anaylsis_button: analysis,
      history_item: history_item,
      client_id: item.client_id,
    });
    this.setModal_detail(true);
  }

  onChangeValue(data) {
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
      data.analysis]: data.limitValue,
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
              <CRow style={{ marginTop: "5px" }}>
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
                    Charge:
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
              <CRow style={{ marginTop: "5px" }}>
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
    if (
      e.target.value < Number(item.min) ||
      e.target.value > Number(item.max)
    ) {
      this.setState({
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "red",
      });
    } else {
      this.setState({
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "green",
      });
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onChangeComment(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCancelModal(objectives) {
    objectives.map((item) => {
      this.setState({
        [item.id + "-" + item.label]: "",
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
            [label.label +
            "-" +
            label.analysis +
            "-" +
            label.unit +
            "-" +
            label.value +
            "-" +
            label.id]: false,
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
      if (
        this.state[
          item.id +
            "-" +
            item.label +
            "-" +
            item.unit +
            "-" +
            item.value +
            "-" +
            item.analysis
        ] !== undefined
      ) {
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
                item.analysis
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
      }

      this.setState({
        [item.label]: false,
        comment: "",
        [item.id + "-" + item.label]: "",
        [item.id + "-" + item.analysis + "-" + item.label + item.unit]: "black",
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
      });
  }

  renderDetailModalCreate(objectives) {
    var data = {};
    data = objectives.map((item) => {
      return this.state.unitData.map((temp) => {
        if (item.analysis === this.state.anaylsis_button) {
          if (temp._id === item.unit) {
            return (
              <>
                <CRow>
                  <CCol md="5">
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
                  <CCol md="5">
                    <CInput
                      type="number"
                      name={
                        item.id +
                        "-" +
                        item.label +
                        "-" +
                        item.unit +
                        "-" +
                        item.value +
                        "-" +
                        item.analysis
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
                            item.analysis
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
                    />
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
    const { analysisData, sampleTypesData, filteredData } = this.state;
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
              Analysis Type
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
              Sample Type
            </CLabel>
            <ReactFileReader handleFiles={this.handleFiles} fileTypes={".csv"}>
              <CButton
                color="info"
                className="float-right"
                style={{ margin: "0px 0px 0px 16px" }}
              >
                <i className="fa fa-download" />
                <span style={{ padding: "4px" }} />
                Import
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
              Export
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
              Create New
            </CButton>
          </div>
        </div>
        <div id="tableInputLaboratory">
          <CDataTable
            items={filteredData}
            fields={fields}
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
                      data = [temp];
                    }
                  });
                });

                return (
                  <td>
                    <div style={{ display: "flex" }}>
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
                          color = "";
                          data.map((temp) => {
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
                              } else {
                                color = "#e55353";
                              }
                            }
                          });
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
                  var charge = "";
                  item.Charge.map((item) => {
                    charge = item.charge;
                  });
                  return (
                    <td>
                      <CButton onClick={() => this.onClick_charge(item)}>
                        {charge}
                      </CButton>
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
          show={this.state.modal_detail}
          onClose={() => this.AnalysisTypeChange()}
        >
          <CModalHeader>
            <CModalTitle>{this.state.anaylsis_button}</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderDetailModalData()}</CModalBody>
        </CModal>
        <CModal
          show={this.state.client_detail_flag}
          onClose={() => this.client_detail_cancel()}
        >
          <CModalHeader>
            <CModalTitle>{this.state.client_title}</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.renderClientDetailData()}</CModalBody>
        </CModal>
        <CModal
          show={this.state.weight_flag}
          onClose={() => this.weight_data_cancel()}
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
      </div>
    );
  }
}
