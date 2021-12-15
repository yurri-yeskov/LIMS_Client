import React, { Component } from 'react'
import axios from 'axios';
import ReactFileReader from "react-file-reader";
import {
    CCard,
    CCardBody,
    CDataTable,
    CModal,
    CModalTitle,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CSelect,
    CCol,
    CRow,
    CTextarea
} from "@coreui/react";
import Select from "react-select";
import { CSVLink } from "react-csv";
import jwt_decode from 'jwt-decode';
import { toast } from "react-hot-toast";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { DatePicker as AtndDatePicker, notification, Input, Drawer, Card, List } from "antd";
import moment from "moment";
import GPDF from "../../utils/GeneratePDF";
import { header, weight_fields, charge_fields, object_fields } from "src/utils/LaboratoryTableFields";
import "./style.css";

class InputLab extends Component {

    constructor(props) {
        super(props)

        this.handleChangeMaterial = this.handleChangeMaterial.bind(this)
        this.clearModalData = this.clearModalData.bind(this)
        this.handleClickWeight = this.handleClickWeight.bind(this)
        this.handleClickCharge = this.handleClickCharge.bind(this)
        this.handleSaveCharge = this.handleSaveCharge.bind(this)
        this.handleClickAnalysisTypeColumn = this.handleClickAnalysisTypeColumn.bind(this)
        this.handleClickMButton = this.handleClickMButton.bind(this)
        this.handleChangeStockSelect = this.handleChangeStockSelect.bind(this)
        this.handleChangeStockInput = this.handleChangeStockInput.bind(this)
        this.onChangeAnalyInput = this.onChangeAnalyInput.bind(this)
        // this.handleGetAnalysisHistory = this.handleGetAnalysisHistory.bind(this)
        this.handleClickCertificate = this.handleClickCertificate.bind(this)

        this.state = {
            fields: [
                { key: "due_date", label: props.language_data.filter((item) => item.label === "due_date")[0][props.selected_language] },
                { key: "sample_type", label: props.language_data.filter((item) => item.label === "sample_type")[0][props.selected_language], sorter: false },
                { key: "material", label: props.language_data.filter((item) => item.label === "material")[0][props.selected_language], sorter: false },
                { key: "client", label: props.language_data.filter((item) => item.label === "client")[0][props.selected_language], sorter: false },
                { key: "packing_type", label: props.language_data.filter((item) => item.label === "packing_type")[0][props.selected_language], sorter: false },
                { key: "a_types", label: props.language_data.filter((item) => item.label === "analysis_type")[0][props.selected_language], sorter: false },
                { key: "c_types", label: props.language_data.filter((item) => item.label === "certificate")[0][props.selected_language], sorter: false },
                { key: "sending_date", label: props.language_data.filter((item) => item.label === "sending_date")[0][props.selected_language] },
                { key: "sample_date", label: props.language_data.filter((item) => item.label === "sample_date")[0][props.selected_language] },
                { key: "Weight", label: props.language_data.filter((item) => item.label === "weight_actual")[0][props.selected_language], sorter: false },
                { key: "material_left", label: props.language_data.filter((item) => item.label === "material_left")[0][props.selected_language], sorter: false },
                { key: "Charge", label: props.language_data.filter((item) => item.label === "charge")[0][props.selected_language], sorter: false },
                { key: "stockSample", label: props.language_data.filter((item) => item.label === "stock_sample")[0][props.selected_language], sorter: false },
                { key: "remark", label: props.language_data.filter((item) => item.label === "remark")[0][props.selected_language], sorter: false },
                { key: "buttonGroups", label: "", _style: { width: "84px" } },
            ],
            pdfData: {},
            pdfColumns: [],
            user: {},
            errors: {},
            selected_aType: {},
            defaultClient: {},
            filtered_aTypes: [],
            filtered_cTypes: [],
            allData: [],
            materials: [],
            sampleTypes: [],
            packingTypes: [],
            analysisTypes: [],
            clients: [],
            certificateTypes: [],
            header: [],
            excellData: [],
            weightHistories: [],
            chargeHistories: [],
            stock_data: [],
            reasons: [],
            objectives: [],
            units: [],
            analysisHistories: [],
            certificateTemplates: [],
            search_aType: '',
            labId: '',
            selectedId: '',
            clientData: {},
            // deliveryData: {},
            selectedCertificate: {},
            display_detail: true,
            openCreateModal: false,
            openWeightModal: false,
            openChargeModal: false,
            openClientModal: false,
            openStockModal: false,
            openDeleteModal: false,
            openAnalysisModal: false,
            openCertificateModal: false,
            weight_table_flag: false,
            charge_table_flag: false,
            sameId: false,
            weight_actual: 0,
            weight_comment: '',
            charge_date: new Date(),
            charge_comment: '',
            stock_count: 1,
            deliveryData: {
                address_name1: '',
                address_name2: '',
                address_name3: '',
                address_title: '',
                address_country: '',
                address_street: '',
                address_zip: '',
                customer_product_code: '',
                email_address: [],
                fetch_date: new Date(),
                order_id: '',
                pos_id: '',
                w_target: '',
            },
            modalData: {
                sample_type: '',
                material: '',
                client: '',
                packing_type: '',
                due_date: new Date(),
                sample_date: new Date(),
                sending_date: new Date(),
                aType: [],
                cType: [],
                distributor: '',
                geo_locaion: '',
                remark: ''
            },
            stockModalData: [{
                stock: '',
                weight: ''
            }],
            analysisTypeModalData: {
                comment: ''
            },
            origAnalysisModalData: {}
        };
    }

    componentDidMount() {
        this.getInputLabData()
        if (localStorage.getItem('token')) {
            const decoded = jwt_decode(localStorage.getItem('token'));
            this.setState({ user: decoded })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected_language !== this.props.selected_language) {
            this.setState({
                analysisType_label: nextProps.language_data.filter((item) => item.label === "analysis_type")[0][nextProps.selected_language],
                sampleType_label: nextProps.language_data.filter((item) => item.label === "sample_type")[0][nextProps.selected_language],
                import_label: nextProps.language_data.filter((item) => item.label === "import")[0][nextProps.selected_language],
                export_label: nextProps.language_data.filter((item) => item.label === "export")[0][nextProps.selected_language],
                create_new_label: nextProps.language_data.filter((item) => item.label === "create_new")[0][nextProps.selected_language],
                fields: [
                    {
                        key: "due_date",
                        label: nextProps.language_data.filter((item) => item.label === "due_date")[0][nextProps.selected_language],
                    },
                    {
                        key: "sample_type",
                        label: nextProps.language_data.filter((item) => item.label === "sample_type")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "material",
                        label: nextProps.language_data.filter((item) => item.label === "material")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "client",
                        label: nextProps.language_data.filter((item) => item.label === "client")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "packing_type",
                        label: nextProps.language_data.filter((item) => item.label === "packing_type")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "a_types",
                        label: nextProps.language_data.filter((item) => item.label === "analysis_type")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "c_types",
                        label: nextProps.language_data.filter((item) => item.label === "certificate")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "sending_date",
                        label: nextProps.language_data.filter((item) => item.label === "sending_date")[0][nextProps.selected_language],
                    },
                    {
                        key: "sample_date",
                        label: nextProps.language_data.filter((item) => item.label === "sample_date")[0][nextProps.selected_language],
                    },
                    {
                        key: "Weight",
                        label: nextProps.language_data.filter((item) => item.label === "weight_actual")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "Charge",
                        label: nextProps.language_data.filter((item) => item.label === "charge")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "stockSample",
                        label: nextProps.language_data.filter((item) => item.label === "stock_sample")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    {
                        key: "remark",
                        label: nextProps.language_data.filter((item) => item.label === "remark")[0][nextProps.selected_language],
                        sorter: false,
                    },
                    { key: "buttonGroups", label: "", _style: { width: "84px" } },
                ],
            });
        }
    }

    clearModalData() {
        this.setState({
            filtered_aTypes: [],
            filtered_cTypes: [],
            modalData: {
                ...this.state.modalData,
                sample_type: '',
                material: '',
                client: '',
                packing_type: '',
                due_date: new Date(),
                sample_date: new Date(),
                sending_date: new Date(),
                aType: [],
                cType: [],
                distributor: '',
                geo_locaion: '',
                remark: ''
            },
            deliveryData: {
                ...this.state.deliveryData,
                address_name1: '',
                address_name2: '',
                address_name3: '',
                address_title: '',
                address_country: '',
                address_street: '',
                address_zip: '',
                customer_product_code: '',
                email_address: [],
                fetch_date: new Date(),
                order_id: '',
                w_target: '',
                pos_id: ''
            },
            errors: {}
        })
    }

    getInputLabData = async () => {
        const res = await axios.get(process.env.REACT_APP_API_URL + "inputLabs")
        // console.log(res.data)
        const excellData = res.data.inputLabs.map(data => {
            return {
                _id: data._id,
                due_date: moment(data.due_date).format("YYYY-MM-DD HH:mm:ss"),
                sample_type: data.sample_type.sampleType,
                material: data.material.material,
                client: data.client.name,
                packing_type: data.packing_type.length > 0 ? data.packing_type[0].packing_type : '',
                a_types: data.a_types.map(aType => { return aType.analysisType + ' ' }),
                c_types: data.c_types.map(cType => { return cType.certificateType }),
                sending_date: moment(data.sending_date).format("YYYY-MM-DD HH:mm:ss"),
                sample_date: moment(data.sample_date).format("YYYY-MM-DD HH:mm:ss"),
                distributor: data.distributor,
                geo_locaion: data.geo_locaion,
                remark: data.remark,
                weight: data.weight,
                material_left: data.material_left,
                lot_number: data.charge.map(ch => moment(ch.date).format("YYYY-MM-DD HH:mm:ss")),
                stock_sample: data.charge.length > 0 ? (data.sample_type.stockSample === false ? res.data.inputLabs.filter(d => d.sample_type.stockSample === true)
                    .filter(data1 =>
                        data1.material._id === data.material._id &&
                        // data1.material_left > 0 && data1.charge.length > 0 &&
                        data1.charge.length > 0 && data.charge.filter(i => i.date === data1.charge[0].date).length > 0
                    ).map(i => i.sample_type.sampleType + " " + i.material.material + " " + i.client.name + " " + moment(i.charge[0].date).format('YYYY-MM-DD HH:mm:ss')) : ''
                ) : '',
                delivering_address_name1: data.delivery.name1,
                delivering_address_name2: data.delivery.name2,
                delivering_address_name3: data.delivery.name3,
                delivering_address_title: data.delivery.title,
                delivering_address_country: data.delivery.country,
                delivering_address_street: data.delivery.street,
                delivering_address_zip: data.delivery.zipcode,
                delivering_customer_product_code: data.delivery.productCode,
                delivering_email_address: data.delivery.email,
                delivering_fetch_date: moment(data.delivery.fetch_date).format("YYYY-MM-DD HH:mm:ss"),
                delivering_order_id: data.delivery.orderId,
                delivering_pos_id: data.delivery.posId,
                delivering_w_target: data.delivery.w_target
            }
        })
        this.setState({
            allData: res.data.inputLabs,
            excellData: excellData,
            materials: res.data.materials,
            sampleTypes: res.data.sampleTypes,
            packingTypes: res.data.packingTypes,
            analysisTypes: res.data.analysisTypes,
            certificateTypes: res.data.certificateTypes,
            defaultClient: res.data.defaultClient
        })
    }

    handleChangeMaterial(e) {
        axios.get(process.env.REACT_APP_API_URL + `materials/clients/${e.target.value}`)
            .then(res => {
                const aTypes = res.data.material.aTypesValues.filter(aType => aType.client === this.state.modalData.client)
                this.setState({
                    clients: res.data.material.clients,
                    filtered_aTypes: aTypes,
                    filtered_cTypes: res.data.certTypes
                })
            })
            .catch(err => console.log(err.response.data))
    }

    clearDeliveryData = () => {
        this.setState({
            deliveryData: {
                address_name1: '',
                address_name2: '',
                address_name3: '',
                address_title: '',
                address_country: '',
                address_street: '',
                address_zip: '',
                customer_product_code: '',
                email_address: [],
                fetch_date: new Date(),
                order_id: '',
                pos_id: '',
                w_target: '',
            }
        })
    }

    handleChangeClient(e) {
        this.setState({
            modalData: {
                ...this.state.modalData,
                client: e.target.value,
                aType: [],
                cType: []
            }
        })
        this.clearDeliveryData()
        if (e.target.value !== '') {
            axios.get(process.env.REACT_APP_API_URL + `materials/clients/${this.state.modalData.material}`)
                .then(res => {
                    const aTypes = res.data.material.aTypesValues.filter(aType => aType.client === e.target.value)
                    this.setState({
                        filtered_aTypes: aTypes,
                    })
                })
                .catch(err => console.log(err.response.data))
        }
    }

    on_export_clicked() {
        this.csvLink.link.click();
    }

    handleFiles = async (files) => {
        // var reader = new FileReader();
        // reader.readAsText(files[0]);
        // const result = await new Promise((resolve, reject) => {
        //     reader.onload = function (e) {
        //         resolve(reader.result);
        //     };
        // });

        // axios.post(Config.ServerUri + "/upload_laboratory_csv", {
        //     data: result,
        // }).then((res) => {
        //     toast.success("Laboratory successfully uploaded");
        //     this.setState({
        //         allData: res.data,
        //         filteredData: res.data,
        //     });
        // }).catch((error) => { });
    }

    handleSubmit() {
        const data = {
            labs: this.state.modalData,
            delivery: this.state.deliveryData
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs", data)
            .then(res => {
                this.setState({
                    allData: res.data,
                    openCreateModal: false
                })
            })
            .catch(err => {
                // console.log(err.response.data)
                this.setState({ errors: err.response.data })
            })
    }

    handleSaveAnalysis() {
        let _flags = []
        const inputData = this.state.analysisTypeModalData
        const obj_rows = Object.keys(inputData).filter(key => key.indexOf('accept-') > -1).length
        for (let i = 0; i < obj_rows; i++) {
            _flags.push(false)
        }
        if (inputData.comment !== this.state.origAnalysisModalData.comment) {
            for (let i = 0; i < obj_rows; i++) {
                _flags.push(true)
            }
        } else {
            if (Object.keys(inputData).length === Object.keys(this.state.origAnalysisModalData).length) {
                Object.keys(inputData).map(key => {
                    if (inputData[key] !== this.state.origAnalysisModalData[key] && key.indexOf('-') > -1) {
                        _flags[key.split('-')[1]] = true;
                    }
                })
            }
        }
        if (_flags.filter(f => f === true).length === 0) {
            this.setState({ openAnalysisModal: false })
            return;
        }

        let data = []
        const obj_count = this.state.materials.filter(m => m._id === this.state.allData.filter(d => d._id === this.state.selectedId)[0].material._id)[0]
            .aTypesValues.filter(aT => aT.client === this.state.allData.filter(d => d._id === this.state.selectedId)[0].client._id)
            .filter(d => d.value === this.state.selected_aType._id).length;
        for (let i = 0; i < obj_count; i++) {
            if (_flags[i]) {
                const temp = {
                    comment: inputData.comment,
                    obj: inputData[`obj-${i}`],
                    input: (inputData[`input-${i}`] !== null && inputData[`input-${i}`] !== undefined) ? inputData[`input-${i}`] : '',
                    reason: (inputData[`reason-${i}`] !== null && inputData[`reason-${i}`] !== undefined) ? inputData[`reason-${i}`] : '',
                    isValid: (inputData[`isValid-${i}`] !== null && inputData[`isValid-${i}`] !== undefined) ? inputData[`isValid-${i}`] : true,
                    accept: (inputData[`accept-${i}`] !== null && inputData[`accept-${i}`] !== undefined) ? inputData[`accept-${i}`] : false,
                }
                temp.final_validate = temp.accept ? true : temp.isValid
                if (temp.input !== '') {
                    data.push(temp)
                }
            }
        }
        let _flag = true
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                _flag = data[i].final_validate
            } else {
                _flag = _flag & data[i].final_validate
            }
        }

        const requestData = {
            data: data,
            labId: this.state.selectedId,
            analysisId: inputData.analysisId,
            validate: _flag ? 1 : 2
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs/saveAnalysisTypes", requestData)
            .then(res => {
                this.setState({
                    openAnalysisModal: false,
                    analysisTypeModalData: { comment: '' },
                    allData: res.data
                })
            })
            .catch(err => console.log(err.response.data))
    }

    handleClickWeight(id) {
        this.setState({
            openWeightModal: true,
            selectedId: id,
            weight_actual: this.state.allData.filter(d => d._id === id)[0].weight,
            weight_comment: this.state.allData.filter(d => d._id === id)[0].weight_comment,
            weight_table_flag: false
        })
        axios.get(process.env.REACT_APP_API_URL + `weights/${id}`)
            .then(res => {
                this.setState({ weightHistories: res.data })
            })
            .catch(err => console.log(err.response.data))
    }

    handleSaveWeight() {
        const data = {
            id: this.state.selectedId,
            weight: this.state.weight_actual,
            comment: this.state.weight_comment
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs/saveWeight", data)
            .then(res => {
                this.setState({ openWeightModal: false })
                toast.success('Weight data successfully saved')
                const updatedData = this.state.allData.map(d => d._id === res.data._id ? res.data : d)
                this.setState({ allData: updatedData })
            })
            .catch(err => console.log(err.response.data))
    }

    handleClickCharge(data) {
        this.setState({
            openChargeModal: true,
            selectedId: data._id,
            charge_date: data.charge.length > 0 ? data.charge[data.charge.length - 1].date : new Date(),
            charge_comment: data.charge.length > 0 ? data.charge[data.charge.length - 1].comment : '',
            charge_table_flag: false
        })
        axios.get(process.env.REACT_APP_API_URL + `charges/${data._id}`)
            .then(res => {
                this.setState({ chargeHistories: res.data })
            })
            .catch(err => console.log(err.response.data))
    }

    handleSaveCharge() {
        const data = {
            is_stock: this.state.sampleTypes.filter(i => i._id === this.state.allData.filter(d => d._id === this.state.selectedId)[0].sample_type._id).length > 0 ?
                this.state.sampleTypes.filter(i => i._id === this.state.allData.filter(d => d._id === this.state.selectedId)[0].sample_type._id)[0].stockSample : false,
            id: this.state.selectedId,
            charge_date: this.state.charge_date,
            comment: this.state.charge_comment
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs/saveCharge", data)
            .then(res => {
                this.setState({ openChargeModal: false })
                toast.success('Lot number successfully saved')
                const updatedData = this.state.allData.map(d => d._id === res.data._id ? res.data : d)
                this.setState({ allData: updatedData })
            })
            .catch(err => console.log(err.response.data))
    }

    deleteInputLaboratory() {
        axios.delete(process.env.REACT_APP_API_URL + `inputLabs/${this.state.selectedId}`)
            .then(res => {
                if (res.data.success) {
                    const removedData = this.state.allData.filter(data => data._id !== this.state.selectedId)
                    this.setState({ allData: removedData, openDeleteModal: false })
                }
            })
            .catch(err => console.log(err.response.data.message))
    }

    handleClickAnalysisTypeColumn(id, aType, rowId) {
        this.setState({
            openAnalysisModal: true,
            selectedId: id,
            selected_aType: aType,
            analysisTypeModalData: {
                comment: ''
            },
            analysisHistories: []
        })
        Object.keys(this.state).filter(key => key.indexOf('analysis_table_flag') > -1)
            .map(s => this.setState({ [s]: false }))

        axios.post(process.env.REACT_APP_API_URL + "inputLabs/analysisTypes", { labStockId: id, labRowId: rowId, analysisId: aType._id })
            .then(res => {
                this.setState({
                    reasons: res.data.reasons,
                    objectives: res.data.objectives,
                    units: res.data.units,
                    analysisHistories: res.data.histories
                })
                // console.log("analysisHistory: ", res.data.histories)
                let latestHistory = []
                let modalData = []
                if (id === rowId) {
                    modalData = this.state.materials.filter(m => m._id === this.state.allData.filter(d => d._id === this.state.selectedId)[0].material._id)[0]
                        .aTypesValues.filter(aT => aT.client === this.state.allData.filter(d => d._id === this.state.selectedId)[0].client._id)
                        .filter(d => d.value === this.state.selected_aType._id)
                        .map((data, index) => {
                            latestHistory = res.data.histories.map(hist => hist[0])
                            const histObj = latestHistory.filter(hist => hist.obj === data.obj)
                            return {
                                [`obj-${index}`]: histObj.length > 0 ? histObj[0].obj : '',
                                [`input-${index}`]: histObj.length > 0 ? histObj[0].value : '',
                                [`accept-${index}`]: histObj.length > 0 ? histObj[0].accept === 1 : false,
                                [`reason-${index}`]: histObj.length > 0 ? (
                                    res.data.reasons.filter(r => r.reason === histObj[0].reason).length > 0 ?
                                        res.data.reasons.filter(r => r.reason === histObj[0].reason)[0].reason : ''
                                ) : '',
                                [`isValid-${index}`]: histObj.length > 0 ? histObj[0].isValid === 1 : false
                            }
                        })
                    modalData.map(mData => {
                        Object.keys(mData).map(k => {
                            this.setState({
                                analysisTypeModalData: {
                                    ...this.state.analysisTypeModalData,
                                    [k]: mData[k]
                                }
                            })
                        })
                    })
                    this.setState({
                        analysisTypeModalData: {
                            ...this.state.analysisTypeModalData,
                            comment: latestHistory.length > 0 ? latestHistory[0].comment : '',
                            analysisId: aType._id
                        },
                        origAnalysisModalData: {
                            ...this.state.analysisTypeModalData,
                            comment: latestHistory.length > 0 ? latestHistory[0].comment : '',
                            analysisId: aType._id
                        },
                    })
                } else {
                    let hist = {}
                    const specValues = this.state.allData.filter(d => d._id === rowId)[0].stock_specValues.filter(sv => sv.aType === aType._id)
                    modalData = specValues.map((sv, index) => {
                        hist = this.state.analysisHistories[index].filter(h => String(h._id) === String(sv.histId))[0]
                        return {
                            [`obj-${index}`]: sv.obj,
                            [`input-${index}`]: sv.value,
                            [`accept-${index}`]: hist.accept === 1,
                            [`reason-${index}`]: (
                                res.data.reasons.filter(r => r.reason === hist.reason).length > 0 ?
                                    res.data.reasons.filter(r => r.reason === hist.reason)[0]._id : ''
                            ),
                            [`isValid-${index}`]: sv.isValid === 1
                        }
                    })
                    modalData.map(mData => {
                        Object.keys(mData).map(k => {
                            this.setState({
                                analysisTypeModalData: {
                                    ...this.state.analysisTypeModalData,
                                    [k]: mData[k]
                                }
                            })
                        })
                    })
                    this.setState({
                        analysisTypeModalData: {
                            ...this.state.analysisTypeModalData,
                            comment: hist.comment,
                            analysisId: aType._id
                        },
                        origAnalysisModalData: {
                            ...this.state.analysisTypeModalData,
                            comment: hist.comment,
                            analysisId: aType._id
                        },
                    })
                }
            })
            .catch(err => console.log(err.response.data))
    }

    handleClickMButton = (item) => {
        this.setState({ stockModalData: [{ stock: '', weight: 0 }] })
        let _isStock = false;
        if (this.state.sampleTypes.filter(sT => sT._id === item.sample_type._id).length > 0) {
            _isStock = this.state.sampleTypes.filter(sT => sT._id === item.sample_type._id)[0].stockSample
        }
        if (_isStock) {
            if (item.material_left === 0) {
                notification.warning({
                    message: "Warning",
                    description: "Please Input Weight!",
                    className: "not-css",
                });
                return;
            }
            if (item.charge.length === 0) {
                notification.warning({
                    message: "Warning",
                    description: "Please Input Charge!",
                    className: "not-css",
                });
                return;
            }
            const data = {
                value: item._id,
                label: item.material.material + " " + item.client.name + " " + moment(item.charge[0].date).format("YYYY-MM-DD HH:mm:ss") + " " + item.material_left
            }
            this.setState({ stock_data: [data] })
        } else {
            const stocks = this.state.allData.filter(data => data.sample_type.stockSample === true)
                .filter(data1 => data1.material._id === item.material._id)
            const filtered_stocks = stocks.filter(s => s.material_left > 0 && s.charge.length > 0)
            if (filtered_stocks.length === 0) {
                notification.warning({
                    message: "Warning",
                    description: "Please Input wegith and charge!",
                    className: "not-css",
                });
                return;
            }
            let data = [];
            filtered_stocks.map(s => {
                data.push({
                    value: s._id,
                    label: s.material.material + " " + s.client.name + " " + moment(s.charge[0].date).format("YYYY-MM-DD HH:mm:ss") + " " + s.material_left,
                    material: s.material_left,
                    inputed_material: 0
                })
            })
            this.setState({ stock_data: data })
        }
        this.setState({ openStockModal: true, selectedId: item._id, stock_count: 1, stockModalData: [{ stock: '', weight: 0 }] })
    }

    handleChangeStockSelect(e, i) {
        this.setState({
            stockModalData: this.state.stockModalData.map((data, index) =>
                index !== i ? data : { stock: e.target.value, weight: data.weight })
        })
    }

    handleChangeStockInput(e, i) {
        this.setState({
            stockModalData: this.state.stockModalData.map((data, index) =>
                index !== i ? data : { stock: data.stock, weight: e.target.value })
        })
    }

    handleClickOK() {
        if (this.state.stockModalData.filter(sData => sData.stock === '' || sData.weight === 0 || sData.weight === '').length > 0) {
            notification.warning({
                message: "Warning",
                description: "Please input stock sample correctly",
                className: "not-css"
            });
            return;
        }
        this.state.stock_data.map(data => data.inputed_material = 0)

        this.state.stock_data.map(data => this.state.stockModalData.filter(d =>
            d.stock === data.value).map(i => data.inputed_material += Number(i.weight))
        )
        let isExceed = true
        for (let i = 0; i < this.state.stock_data.length; i++) {
            if (Number(this.state.stock_data[i].inputed_material) > Number(this.state.stock_data[i].material)) {
                isExceed = false
                break;
            }
        }
        if (!isExceed) {
            notification.warning({
                message: "Warning",
                description: "Inputed data exceed than current data",
                className: "not-css"
            });
            return;
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs/saveStockSample", {
            data: this.state.stockModalData,
            selectedId: this.state.selectedId
        }).then(res => {
            this.setState({
                allData: res.data,
                openStockModal: false
            })
        }).catch(err => {
            notification.warning({
                message: "Warning",
                description: err.response.data,
                className: "not-css",
            });
        })
    }

    validate(e) {
        var theEvent = e || window.event;

        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\.|\,/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    onChangeAnalyInput(e, i, aType) {
        let val = e.target.value.replace(",", ".");
        if (val.substr(0, 1) === ".") {
            val = "";
            return false;
        }
        if (val.substr(val.length - 1, val.length) === ".") {
            if (val.substr(0, val.length - 1).indexOf(".") > 0) {
                val = val.substr(0, val.length - 1);
            }
        }
        if (val.substr(val.indexOf("."), val.length).length > 5) {
            val = val.substr(0, val.length - 1);
        }
        if (val < Number(aType.min) || val > Number(aType.max)) {
            this.setState({
                analysisTypeModalData: {
                    ...this.state.analysisTypeModalData,
                    analysisId: aType.value,
                    [`input-${i}`]: val,
                    [`isValid-${i}`]: false,
                    [`obj-${i}`]: aType.obj
                }
            });
        } else {
            this.setState({
                analysisTypeModalData: {
                    ...this.state.analysisTypeModalData,
                    analysisId: aType.value,
                    [`input-${i}`]: val,
                    [`isValid-${i}`]: true,
                    [`obj-${i}`]: aType.obj
                }
            });
        }
    }

    handleClickCertificate = (data, cType) => {
        this.setState({
            openCertificateModal: true,
            selectedId: data._id,
            selectedCertificate: cType,
            pdfData: {}
        });
        axios.get(process.env.REACT_APP_API_URL + "inputLabs/certTemplates")
            .then(res => {
                this.setState({
                    certificateTemplates: res.data.certTemplates,
                    units: res.data.units,
                    objectives: res.data.objectives
                })
            })
            .catch(err => console.log(err.response.data))
    };

    getCertificateData = async (row) => {
        const selectedRow = this.state.allData.filter(d => d._id === this.state.selectedId)[0]
        const pdfData = {}
        const clientData = await axios.get(process.env.REACT_APP_API_URL + `clients/${selectedRow.client._id}`)

        pdfData.filename = this.state.selectedCertificate.certificateType
        pdfData.c_title = row.certificatetitle
        pdfData.footer = row.footer_filename
        pdfData.logo = row.logo_filename
        pdfData.place = row.place
        pdfData.date = moment(selectedRow.sample_date).format(row.date_format)
        pdfData.productName = row.productdata.productTitle
        pdfData.freetext = row.freetext
        pdfData.address = {
            name: selectedRow.client.name,
            addressB: clientData.data.addressB,
            zipcodeB: clientData.data.zipCodeB,
            cityB: clientData.data.cityB,
            address2B: clientData.data.address2B,
            country: clientData.data.countryB
        }
        pdfData.productData = row.productdata.productData.filter(pD => pD.name !== '')
            .map(d => {
                let fieldValue = ''
                if (d.pagename === 0) {
                    switch (d.fieldname) {
                        case 'due_date':
                            fieldValue = moment(selectedRow.due_date).format(row.date_format)
                            break;
                        case 'sample_type':
                            fieldValue = selectedRow.sample_type.sampleType
                            break;
                        case 'material':
                            fieldValue = selectedRow.material.material
                            break;
                        case 'client':
                            fieldValue = selectedRow.client.name
                            break;
                        case 'packing_type':
                            fieldValue = selectedRow.packing_type.map(pType => pType.packingType + ', ')
                            break;
                        case 'a_types':
                            fieldValue = selectedRow.a_types.map(aType => aType.analysisType + ', ')
                            break;
                        case 'c_types':
                            fieldValue = selectedRow.c_types.map(cType => cType.certificateType + ', ')
                            break;
                        case 'sending_date':
                            fieldValue = moment(selectedRow.sending_date).format(row.date_format)
                            break;
                        case 'sample_date':
                            fieldValue = moment(selectedRow.sample_date).format(row.date_format)
                            break;
                        case 'distributor':
                            fieldValue = selectedRow.distributor
                            break;
                        case 'geo_location':
                            fieldValue = selectedRow.geo_locaion
                            break;
                        case 'remark':
                            fieldValue = selectedRow.remark
                            break;
                        case 'delivering_address_name1':
                            fieldValue = selectedRow.delivery.name1
                            break;
                        case 'delivering_address_name2':
                            fieldValue = selectedRow.delivery.name2
                            break;
                        case 'delivering_address_name3':
                            fieldValue = selectedRow.delivery.name3
                            break;
                        case 'delivering_address_title':
                            fieldValue = selectedRow.delivery.title
                            break;
                        case 'delivering_address_country':
                            fieldValue = selectedRow.delivery.country
                            break;
                        case 'delivering_address_street':
                            fieldValue = selectedRow.delivery.street
                            break;
                        case 'delivering_address_zip':
                            fieldValue = selectedRow.delivery.zipCode
                            break;
                        case 'delivering_customer_product_code':
                            fieldValue = selectedRow.delivery.productCode
                            break;
                        case 'delivering_email_address':
                            fieldValue = selectedRow.delivery.email
                            break;
                        case 'delivering_fetch_date':
                            fieldValue = selectedRow.delivery.fetchDate
                            break;
                        case 'delivering_order_id':
                            fieldValue = selectedRow.delivery.orderId
                            break;
                        case 'delivering_pos_id':
                            fieldValue = selectedRow.delivery.posId
                            break;
                        case 'delivering_w_target':
                            fieldValue = selectedRow.delivery.w_target
                            break;
                        default:
                            break;
                    }
                }
                return {
                    name: d.name,
                    value: d.pagename === 0 ? (
                        fieldValue
                    ) : (
                        d.pagename === 1 ? (
                            d.fieldname === 'objectives'
                                ? this.state.selectedCertificate.analysises.map(aT => aT.objectives.map(obj => this.state.objectives.filter(o => o._id === obj.id)[0].objective + "-" + this.state.units.filter(u => u._id === obj.unit)[0].unit + ", "))
                                : this.state.selectedCertificate.analysises.map(aT => this.state.analysisTypes.filter(aType => aType._id === aT.id)[0][d.fieldname] + ', ')
                        ) : (
                            selectedRow.client[d.fieldname]
                        )

                    )
                }
            })

        let cert_array = []
        const certificate = this.state.selectedCertificate.analysises;
        certificate.map(c => c.objectives.map(obj => cert_array.push(obj)))
        const analysisIds = selectedRow.a_types.map(aT => aT._id)
        const rowObjectives = this.state.materials.filter(m => m._id === selectedRow.material._id)[0]
            .objectiveValues.filter(obj => obj.client === selectedRow.client._id && analysisIds.indexOf(obj.analysis) > -1)

        const filtered_certs = rowObjectives.filter(rObj => cert_array.filter(c => c.id === rObj.id && c.unit === rObj.unit).length > 0)

        try {
            const data = {
                labId: this.state.selectedId,
                analysisIds: filtered_certs.map(d => d.analysis)
            }
            const res = await axios.post(process.env.REACT_APP_API_URL + "inputLabs/analysisInputValue", data)

            let tableValues = res.data.map(data => {
                return {
                    analysis: this.state.analysisTypes.filter(aType => aType._id === data.analysisId).length > 0 ?
                        this.state.analysisTypes.filter(aType => aType._id === data.analysisId)[0].analysisType : '',
                    value: data.value,
                    user: data.user.userName,
                    date: moment(data.date).format(row.date_format),
                    reason: data.reason,
                    spec: '[' + filtered_certs.filter(c => c.analysis === data.analysisId)[0].min + ', ' + filtered_certs.filter(c => c.analysis === data.analysisId)[0].max + ']',
                    comment: data.comment,
                    certificate: this.state.selectedCertificate.certificateType,
                    obj: this.state.analysisTypes.filter(aType => aType._id === data.analysisId)[0].analysisType + "-" +
                        this.state.objectives.filter(o => o._id === data.obj.split('-')[0])[0].objective + ', ' +
                        this.state.units.filter(u => u._id === data.obj.split('-')[1])[0].unit,
                    norm: this.state.analysisTypes.filter(aType => aType._id === data.analysisId)[0].norm
                }
            })
            const tableColumns = row.tablecol.filter(col => col.name !== '')
            tableValues = tableValues.map(col => {
                let tempObj = {}
                tableColumns.map(tCol => {
                    tempObj[tCol.fieldname] = col[tCol.fieldname]
                })
                return tempObj
            })
            pdfData.tableValues = tableValues
            this.setState({
                pdfData: pdfData,
                pdfColumns: tableColumns
            })
        } catch (err) {
            // console.log(err)
            notification.warning({
                message: "Warning",
                description: "Server error!",
                className: "not-css",
            });
        }
    }

    handleClickUpdate = (item) => {
        this.setState({
            selectedId: item._id,
            openCreateModal: true,
            deliveryData: {
                address_name1: item.delivery.name1,
                address_name2: item.delivery.name2,
                address_name3: item.delivery.name3,
                address_title: item.delivery.title,
                address_country: item.delivery.country,
                address_street: item.delivery.street,
                address_zip: item.delivery.zipcode,
                customer_product_code: item.delivery.productCode,
                email_address: item.delivery.email.split(","),
                fetch_date: item.delivery.fetchDate,
                order_id: item.delivery.orderId,
                pos_id: item.delivery.posId,
                w_target: item.delivery.w_target
            },
            modalData: {
                sample_type: item.sample_type._id,
                material: item.material._id,
                client: item.client._id,
                packing_type: item.packing_type._id,
                due_date: item.due_date,
                sample_date: item.sample_date,
                sending_date: item.sending_date,
                aType: item.a_types.map(aT => aT._id),
                cType: item.c_types.map(cT => cT._id),
                distributor: item.distributor,
                geo_locaion: item.geo_locaion,
                remark: item.remark
            },
        })
    }

    renderModalCreate() {
        return (
            <CCard>
                <CCardBody>
                    <CForm onSubmit={this.handleSubmit.bind(this)}>
                        <CFormGroup>
                            <CLabel className="bold">Sample Type</CLabel>
                            <CSelect
                                name="sample_type"
                                value={this.state.modalData.sample_type}
                                onChange={(e) => {
                                    this.setState({
                                        modalData: {
                                            ...this.state.modalData,
                                            sample_type: e.target.value,
                                            packing_type: '',
                                            distributor: '',
                                            geo_locaion: '',
                                            remark: ''
                                        }
                                    })
                                    this.clearDeliveryData()
                                    if (this.state.errors.sample_type) delete this.state.errors.sample_type
                                }}
                                required
                            >
                                <option value="" disabled hidden>* Select from Sample Type *</option>
                                {Object.keys(this.state.sampleTypes).length > 0 && this.state.sampleTypes
                                    .sort((a, b) => { return String(a.sampleType).toUpperCase() > String(b.sampleType).toUpperCase() ? 1 : -1 })
                                    .map((item, index) => (
                                        <option key={index} value={item._id}>{item.sampleType}</option>
                                    ))}
                            </CSelect>
                            {
                                this.state.errors.sample_type && <div className="invalid-feedback d-block">{this.state.errors.sample_type}</div>
                            }
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Material</CLabel>
                            <CSelect
                                value={this.state.modalData.material}
                                onChange={(e) => {
                                    this.setState({
                                        modalData: {
                                            ...this.state.modalData,
                                            material: e.target.value,
                                            packing_type: '',
                                            distributor: '',
                                            geo_locaion: '',
                                            remark: '',
                                            aType: [],
                                            cType: []
                                        }
                                    })
                                    this.clearDeliveryData()
                                    this.handleChangeMaterial(e)
                                    if (this.state.errors.material) delete this.state.errors.material
                                }}
                                disabled={this.state.disabled_material}
                            >
                                <option value="" disabled hidden>* Material *</option>
                                {Object.keys(this.state.materials).length > 0 && this.state.materials
                                    .sort((a, b) => { return String(a.material).toUpperCase() > String(b.material).toUpperCase() ? 1 : -1 })
                                    .map((item, index) => (
                                        <option key={index} value={item._id}>{item.material}</option>
                                    ))}
                            </CSelect>
                            {
                                this.state.errors.material && <div className="invalid-feedback d-block">{this.state.errors.material}</div>
                            }
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Client</CLabel>
                            <CSelect
                                disabled={this.state.disabled_client}
                                name="client"
                                value={this.state.modalData.client}
                                onChange={this.handleChangeClient.bind(this)}
                            >
                                <option value={this.state.defaultClient._id}>Default</option>
                                {Object.keys(this.state.clients).length > 0 && this.state.clients
                                    .sort((a, b) => { return String(a.name).toUpperCase() > String(b.name).toUpperCase() ? 1 : -1 })
                                    .map((client, index) => (
                                        <option key={index} value={client._id}>{client.name}</option>
                                    ))}
                            </CSelect>
                        </CFormGroup>
                        {this.state.display_detail === true && (
                            <>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Name1</CLabel>
                                    <CInput
                                        name="address_name1"
                                        value={this.state.deliveryData.address_name1}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_name1: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Title</CLabel>
                                    <CInput
                                        name="address_title"
                                        value={this.state.deliveryData.address_title}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_title: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Country</CLabel>
                                    <CInput
                                        name="address_country"
                                        value={this.state.deliveryData.address_country}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_country: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Name2</CLabel>
                                    <CInput
                                        name="address_name2"
                                        value={this.state.deliveryData.address_name2}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_name2: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Name3</CLabel>
                                    <CInput
                                        name="address_name3"
                                        value={this.state.deliveryData.address_name3}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_name3: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Delivering.Address.Street</CLabel>
                                    <CInput
                                        name="address_street"
                                        value={this.state.deliveryData.address_street}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_street: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold"> Delivering.Address.ZIP</CLabel>
                                    <CInput
                                        name="address_zip"
                                        value={this.state.deliveryData.address_zip}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, address_zip: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Customer Product Code</CLabel>
                                    <CInput
                                        name="customer_product_code"
                                        value={this.state.deliveryData.customer_product_code}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, customer_product_code: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">E-mail Address</CLabel>
                                    <ReactMultiEmail
                                        placeholder=""
                                        emails={this.state.deliveryData.email_address}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, email_address: e } })}
                                        validateEmail={(email) => {
                                            return isEmail(email);
                                        }}
                                        getLabel={(email, index, removeEmail) => {
                                            return (
                                                <div data-tag key={index}>
                                                    {email}
                                                    <span data-tag-handle onClick={() => removeEmail(index)}>×</span>
                                                </div>
                                            );
                                        }}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Fetch Date</CLabel>
                                    <div id="charge">
                                        <AtndDatePicker
                                            style={{ width: "700px" }}
                                            bordered={false}
                                            format="YYYY-MM-DD"
                                            onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, fetch_date: e } })}
                                            value={moment(this.state.deliveryData.fetch_date)}
                                        ></AtndDatePicker>
                                    </div>
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Order.ID</CLabel>
                                    <CInput
                                        name="order_id"
                                        value={this.state.deliveryData.order_id}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, order_id: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Pos.ID</CLabel>
                                    <CInput
                                        name="pos_id"
                                        value={this.state.deliveryData.pos_id}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, pos_id: e.target.value } })}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel className="bold">Weight(target)</CLabel>
                                    <CInput
                                        type="number"
                                        name="weight"
                                        value={this.state.deliveryData.w_target}
                                        onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, w_target: e.target.value } })}
                                    />
                                </CFormGroup>
                            </>
                        )}
                        <CFormGroup>
                            <CLabel className="bold">Packing Type</CLabel>
                            <CSelect
                                name="packing_type"
                                value={this.state.modalData.packing_type}
                                disabled={this.state.disabled_packing_type}
                                onChange={(e) => {
                                    this.setState({ modalData: { ...this.state.modalData, packing_type: e.target.value } })
                                    if (this.state.errors.packing_type) delete this.state.errors.packing_type
                                }}
                            >
                                <option value="" disabled hidden>* Packing Type *</option>
                                {this.state.packingTypes
                                    .sort((a, b) => { return String(a.packingType).toUpperCase() > String(b.packingType).toUpperCase() ? 1 : -1 })
                                    .map((item, index) => (
                                        <option key={index} value={item._id}>{item.packingType}</option>
                                    ))}
                            </CSelect>
                            {
                                this.state.errors.packing_type && <div className="invalid-feedback d-block">{this.state.errors.packing_type}</div>
                            }
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Due Date</CLabel>
                            <div id="charge">
                                <AtndDatePicker
                                    style={{ width: "700px" }}
                                    bordered={false}
                                    format="YYYY-MM-DD"
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, due_date: e } })}
                                    value={moment(this.state.modalData.due_date)}
                                    disabled={this.state.disabled_due_date}
                                ></AtndDatePicker>
                            </div>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Sample Date</CLabel>
                            <div id="charge">
                                <AtndDatePicker
                                    style={{ width: "700px" }}
                                    bordered={false}
                                    format="YYYY-MM-DD"
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, sample_date: e } })}
                                    value={moment(this.state.modalData.sample_date)}
                                    disabled={this.state.disabled_sample_date}
                                ></AtndDatePicker>
                            </div>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Sending Date</CLabel>
                            <div id="charge">
                                <AtndDatePicker
                                    style={{ width: "700px" }}
                                    bordered={false}
                                    format="YYYY-MM-DD"
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, sending_date: e } })}
                                    value={moment(this.state.modalData.sending_date)}
                                    disabled={this.state.disabled_sending_date}
                                ></AtndDatePicker>
                            </div>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Analysis Types</CLabel>
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
                                options={this.state.filtered_aTypes
                                    .sort((a, b) => { return String(a.label).toUpperCase() > String(b.label).toUpperCase() ? 1 : -1 })
                                    .map(aType => {
                                        return {
                                            label: aType.label,
                                            value: aType.value
                                        }
                                    })}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, aType: e } })}
                                value={this.state.modalData.aType.length === 0 ? [] : this.state.modalData.aType}
                                disabled={this.state.disabled_analysisType}
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Certificate Types</CLabel>
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
                                options={this.state.filtered_cTypes
                                    .sort((a, b) => { return String(a.certificateType).toUpperCase() > String(b.certificateType).toUpperCase() ? 1 : -1 })
                                    .map(cType => {
                                        return {
                                            label: cType.certificateType,
                                            value: cType._id
                                        }
                                    })}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, cType: e } })}
                                value={this.state.modalData.cType.length === 0 ? [] : this.state.modalData.cType}
                                disabled={this.state.disabled_certificateType}
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Distributor</CLabel>
                            <CInput
                                value={this.state.modalData.distributor}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, distributor: e.target.value } })}
                                disabled={this.state.disabled_distributor}
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Geo-Location</CLabel>
                            <CInput
                                value={this.state.modalData.geo_locaion}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, geo_locaion: e.target.value } })}
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel className="bold">Remark</CLabel>
                            <CInput
                                value={this.state.modalData.remark}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, remark: e.target.value } })}
                            />
                        </CFormGroup>
                        <div className="float-right">
                            <CButton type="button" onClick={this.handleSubmit.bind(this)} color="info">
                                {this.state.labId === '' ? "Create" : "Update"}
                            </CButton>
                            <CButton color="secondary" className="ml-4" onClick={() => this.setState({ openCreateModal: false })}>
                                Cancel
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        );
    }

    render() {

        const children = []
        for (let i = 0; i < this.state.stock_count; i++) {
            children.push(<div key={i} className="row mx-0 mb-2">
                <div className="col-lg-6">
                    <label htmlFor="stock" className="control-label">Stock Sample</label>
                    <div className="col-lg-12 px-0">
                        <select className="form-control" onChange={(e) => this.handleChangeStockSelect(e, i)}>
                            <option value="">*Select stock sample*</option>
                            {
                                this.state.stock_data.map((d, index) => (
                                    <option key={index} value={d.value}>{d.label}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="weight" className="control-label">Weight</label>
                    <div className="col-lg-12 px-0 d-flex">
                        <input type="number" value={this.state.stockModalData[i].weight} className="form-control" onChange={(e) => this.handleChangeStockInput(e, i)} />
                        <CButton color="danger" onClick={() => {
                            if (children.length > 1) {
                                children.splice(i, 1)
                                this.setState({ stock_count: parseInt(this.state.stock_count - 1) })
                                this.setState({ stockModalData: [...this.state.stockModalData.filter((d, index) => index !== i)] })
                            }
                        }}><i className="fa fa-trash" /></CButton>
                    </div>
                </div>
            </div>)
        }

        return (
            <div>
                <div className="d-flex justify-content-between">
                    <div>
                        <CSelect name="search_aType" onChange={(e) => this.setState({ [e.target.name]: e.target.value })}>
                            <option value="">*Search Analysis Type*</option>
                            {Object.keys(this.state.analysisTypes).length > 0 && this.state.analysisTypes.map((item, index) => (
                                <option key={index} value={item._id}>{item.analysisType}</option>
                            ))}
                        </CSelect>
                    </div>
                    <div className="d-flex align-items-center">
                        <ReactFileReader handleFiles={this.handleFiles.bind(this)} fileTypes={".csv"} className="ml-4">
                            <CButton color="info">
                                <i className="fa fa-upload" />&nbsp;Upload{this.state.import_label}
                            </CButton>
                        </ReactFileReader>
                        <CButton color="info" className="ml-4" onClick={this.on_export_clicked.bind(this)}>
                            <i className="fa fa-download"></i>&nbsp;Download{this.state.export_label}
                        </CButton>
                        <CSVLink
                            headers={header}
                            filename="Laboratory.csv"
                            data={this.state.excellData}
                            ref={(r) => (this.csvLink = r)}
                        />
                        <CButton color="info" className="float-right ml-4" onClick={() => {
                            this.setState({ openCreateModal: true })
                            this.clearModalData()
                        }}>
                            <i className="fa fa-plus" />&nbsp;Create
                        </CButton>
                    </div>
                </div>
                <div className="mt-4">
                    <CDataTable
                        items={this.state.allData}
                        fields={this.state.fields}
                        itemsPerPage={10}
                        itemsPerPageSelect
                        sorter
                        tableFilter
                        pagination
                        hover
                        scopedSlots={{
                            due_date: (item) => {
                                return (
                                    <td>{moment(item.due_date).format('YYYY-MM-DD')}</td>
                                )
                            },
                            sending_date: (item) => {
                                return (
                                    <td>{moment(item.sending_date).format('YYYY-MM-DD')}</td>
                                )
                            },
                            sample_date: (item) => {
                                return (
                                    <td>{moment(item.sample_date).format('YYYY-MM-DD')}</td>
                                )
                            },
                            client: (item) => {
                                return (
                                    <td>
                                        <CButton className="cursor-pointer" onClick={() => {
                                            this.setState({ openClientModal: true, clientData: item.client, deliveryData: item.delivery })
                                        }}>
                                            {item.client === undefined ? '' : item.client.name}
                                        </CButton>
                                    </td>
                                );
                            },
                            buttonGroups: (item) => {
                                if (Object.keys(item.client).length > 0) {
                                    return (
                                        <td>
                                            <div className="d-flex">
                                                <CButton className="mx-1" color="warning" size="sm" onClick={() => this.handleClickMButton(item)}>M</CButton>
                                                <CButton className="mx-1" color="info" size="sm" onClick={() => this.handleClickUpdate(item)}><i className="fa fa-edit" /></CButton>
                                                <CButton className="mx-1" color="danger" size="sm" onClick={() => this.setState({ openDeleteModal: true, selectedId: item._id })}><i className="fa fa-trash" /></CButton>
                                            </div>
                                        </td>
                                    );
                                }
                            },
                            sample_type: (item) => {
                                return (
                                    <td>{item.sample_type.sampleType}</td>
                                )
                            },
                            material: (item) => {
                                return (
                                    <td>{item.material.material}</td>
                                )
                            },
                            packing_type: (item) => {
                                return (
                                    <td>{item.packing_type.map((pT, index) => <div key={index}>{pT.packingType}</div>)}</td>
                                )
                            },
                            a_types: (item) => {
                                if (!item.sample_type.stockSample) {
                                    return (
                                        <td>
                                            {
                                                item.a_types.length > 0 && (
                                                    item.a_types.map((aType, k) => {
                                                        return (
                                                            <div key={k} className="px-2 py-1">
                                                                <CButton className={`color-white ${item.aT_validate.filter(a => a.aType === aType._id).length === 0 ?
                                                                    `background-grey` :
                                                                    (item.aT_validate.filter(a => a.aType === aType._id)[0].isValid === 1 ? `background-green` : `background-red`)}`}
                                                                    size="sm" onClick={() => {
                                                                        this.setState({ sameId: true })
                                                                        this.handleClickAnalysisTypeColumn(item._id, aType, item._id)
                                                                    }}
                                                                >{aType.analysisType}</CButton>
                                                            </div>
                                                        );
                                                    })
                                                )
                                            }
                                            {
                                                item.charge.length > 0 &&
                                                this.state.allData.filter(d => d.sample_type.stockSample === true && d.material._id === item.material._id)
                                                    .filter(dd => item.stock_specValues.filter(ii => ii.stock === dd._id).length > 0)
                                                    .map(data => data.a_types.map((aT, i) => {
                                                        const specValues = item.stock_specValues.filter(sv => sv.stock.toString() === data._id.toString() && sv.aType.toString() === aT._id.toString())
                                                        // console.log(">>>>>>>>", specValues)
                                                        let color_info = []
                                                        if (this.state.materials.filter(mat => mat._id === item.material._id)[0]
                                                            .aTypesValues.filter(aTValue => aTValue.client === item.client._id && aTValue.value === aT._id).length > 0) {
                                                            specValues.map((sv) => {
                                                                if (sv.value !== 0 && sv.obj !== '') {
                                                                    const matched_obj = this.state.materials.filter(mat => mat._id === item.material._id)[0].objectiveValues
                                                                        .filter(objValue1 => objValue1.client === item.client._id && objValue1.analysis === aT._id)
                                                                        .filter(objValue2 => String(objValue2.id + '-' + objValue2.unit) === sv.obj)
                                                                    if (matched_obj.length === 0) {
                                                                        color_info.push(1)
                                                                    } else {
                                                                        color_info.push(sv.value >= matched_obj[0].min && sv.value <= matched_obj[0].max ? 1 : 2)
                                                                    }
                                                                } else {
                                                                    color_info.push(0)
                                                                }
                                                            })
                                                        } else {
                                                            color_info.push(2)
                                                        }
                                                        // console.log("color_info: ", color_info)
                                                        return (
                                                            <div key={i} className="px-2 py-1">
                                                                <CButton
                                                                    className={`color-white ${color_info.length > 0 ? (
                                                                        color_info.filter(color => color === 0).length > 0 ? `background-grey` : (
                                                                            color_info.filter(color => color === 2).length > 0 ? `background-red` : `background-green`
                                                                        )
                                                                    ) : `background-grey`}`}
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        this.setState({ sameId: false })
                                                                        this.handleClickAnalysisTypeColumn(data._id, aT, item._id)
                                                                    }}
                                                                >{data.sample_type.sampleType + "-" + aT.analysisType}</CButton>
                                                            </div>
                                                        )
                                                    }))
                                            }
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td>
                                            {item.a_types.map((aT, k) => {
                                                return (
                                                    <div key={k} className="px-2 py-1">
                                                        <CButton className={`color-white ${item.aT_validate.filter(a => a.aType === aT._id).length === 0 ?
                                                            `background-grey` :
                                                            (item.aT_validate.filter(a => a.aType === aT._id)[0].isValid === 1 ? `background-green` : `background-red`)}`}
                                                            size="sm"
                                                            onClick={() => {
                                                                this.setState({ sameId: true })
                                                                this.handleClickAnalysisTypeColumn(item._id, aT, item._id)
                                                            }}
                                                        >{aT.analysisType}</CButton>
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    );
                                }
                            },
                            c_types: (item) => {
                                if (!item.sample_type.stockSample) {
                                    return (
                                        <td>
                                            {item.c_types.map((cT, k) => (
                                                <div key={k} className="p-2">
                                                    {
                                                        (item.aT_validate.length > 0 && item.aT_validate.filter(v => parseInt(v.isValid) !== 1).length === 0) ? (
                                                            <CButton onClick={() => this.handleClickCertificate(item, cT)}>
                                                                {cT.certificateType}
                                                            </CButton>
                                                        ) : (
                                                            <CButton>
                                                                {cT.certificateType}
                                                            </CButton>
                                                        )
                                                    }
                                                </div>
                                            ))}
                                            {
                                                item.charge.length > 0 &&
                                                this.state.allData.filter(d => d.sample_type.stockSample === true && d.material._id === item.material._id)
                                                    .map(data => data.c_types.map((cT, i) => {
                                                        return (
                                                            <div key={i} className="px-2 py-1">
                                                                <CButton>
                                                                    {data.sample_type.sampleType + "-" + cT.certificateType}
                                                                </CButton>
                                                            </div>
                                                        )
                                                    }))
                                            }
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td>
                                            <div style={{ display: "column" }}>
                                                {item.c_types.map((v, k) => {
                                                    return (
                                                        <div key={k} className="p-2">
                                                            {
                                                                (item.aT_validate.length > 0 && item.aT_validate.length === item.a_types.length &&
                                                                    item.aT_validate.filter(v => parseInt(v.isValid) !== 1).length === 0) ? (
                                                                    <CButton onClick={() => this.handleClickCertificate(item, v)}>
                                                                        {v.certificateType}
                                                                    </CButton>
                                                                ) : (
                                                                    <CButton>
                                                                        {v.certificateType}
                                                                    </CButton>
                                                                )
                                                            }
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    );
                                }
                            },
                            Weight: (item) => {
                                return (
                                    <td>
                                        {
                                            this.state.sampleTypes.filter(st => st._id === item.sample_type._id)[0].stockSample ? (
                                                <CButton onClick={(e) => this.handleClickWeight(item._id)}>
                                                    {item.weight === 0 ? 'N/A' : item.weight}
                                                </CButton>
                                            ) : (
                                                <div>{item.weight === 0 ? 'N/A' : item.weight}</div>
                                            )
                                        }
                                    </td>
                                );
                            },
                            Charge: (item) => {
                                return (
                                    <td>
                                        {
                                            this.state.sampleTypes.filter(st => st._id === item.sample_type._id)[0].stockSample ? (
                                                item.charge.length > 0 ? item.charge.map((data, index) => (
                                                    <CButton key={index} onClick={() => this.handleClickCharge(item)}>
                                                        {(data.date === undefined || data.date === '') ? 'N/A' : moment(data.date).format('YYYY-MM-DD HH:mm:ss')}
                                                    </CButton>
                                                )) : <div className="text-center">
                                                    <CButton onClick={() => this.handleClickCharge(item)}>N/A</CButton>
                                                </div>
                                            ) : (
                                                item.charge.length > 0 ? (
                                                    <ul>
                                                        {
                                                            item.charge.map((data, index) => (
                                                                <li key={index}>{moment(data.date).format('YYYY-MM-DD HH:mm:ss')}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                ) : <div className="text-center">N/A</div>
                                            )
                                        }
                                    </td>
                                );
                            },
                            material_left: (item) => {
                                return <td>{item.sample_type.stockSample ? item.material_left : ''}</td>;
                            },
                            stockSample: (item) => {
                                return (
                                    <td>
                                        {
                                            item.sample_type.stockSample === false &&
                                            (
                                                <ul>
                                                    {
                                                        this.state.allData.filter(data => data.sample_type.stockSample === true)
                                                            .filter(data1 =>
                                                                data1.material._id === item.material._id &&
                                                                // data1.material_left > 0 && data1.charge.length > 0 &&
                                                                data1.charge.length > 0 && item.charge.filter(i => i.date === data1.charge[0].date).length > 0
                                                            )
                                                            .map((i, index) => (
                                                                <li key={index}>
                                                                    {i.sample_type.sampleType + " " + i.material.material + " " + i.client.name + " " + moment(i.charge[0].date).format('YYYY-MM-DD HH:mm:ss')}
                                                                </li>
                                                            ))
                                                    }
                                                </ul>
                                            )
                                        }
                                    </td>
                                );
                            },
                        }}
                    />
                </div>
                {/**------Create Laboratory date------ */}
                <CModal
                    show={this.state.openCreateModal}
                    onClose={() => this.setState({ openCreateModal: false })}
                    closeOnBackdrop={false}
                    centered
                    size="lg"
                >
                    <CModalHeader>
                        <CModalTitle>{this.state.labId === '' ? "New Sample" : "Update Sample"}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>{this.renderModalCreate()}</CModalBody>
                </CModal>
                {/**------Input weight------ */}
                {
                    this.state.openWeightModal && (
                        <CModal style={{ width: "40vw" }} show={this.state.openWeightModal} onClose={() => this.setState({ openWeightModal: false })}>
                            <CModalHeader>
                                <CModalTitle>Weight(actual)</CModalTitle>
                            </CModalHeader>
                            <CModalBody className="p-4">
                                <CCard>
                                    <CCardBody>
                                        <CForm>
                                            <CFormGroup>
                                                <CRow className="my-2">
                                                    <CCol md="3">
                                                        <CLabel className="float-right cursor-pointer"
                                                            onClick={() => this.setState({ weight_table_flag: !this.state.weight_table_flag })}
                                                        >
                                                            Weight(actual):
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="9">
                                                        <CInput
                                                            type="number"
                                                            name="weight_actual"
                                                            value={this.state.weight_actual}
                                                            onChange={(e) => this.setState({ weight_actual: e.target.value })}
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="my-2">
                                                    <CCol md="3">
                                                        <CLabel className="float-right">Comment:</CLabel>
                                                    </CCol>
                                                    <CCol md="9">
                                                        <CTextarea
                                                            name="weight_comment"
                                                            value={this.state.weight_comment}
                                                            onChange={(e) => this.setState({ weight_comment: e.target.value })}
                                                        ></CTextarea>
                                                    </CCol>
                                                </CRow>
                                                {this.state.weight_table_flag === true && (
                                                    <CDataTable
                                                        items={this.state.weightHistories}
                                                        fields={weight_fields}
                                                        scopedSlots={{
                                                            author: (item) => {
                                                                return <td>{item.user.userName}</td>;
                                                            },
                                                            update_date: (item) => {
                                                                return <td>{moment(item.updateDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                            }
                                                        }}
                                                    ></CDataTable>
                                                )}
                                            </CFormGroup>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CModalBody>
                            <CModalFooter>
                                <CButton onClick={this.handleSaveWeight.bind(this)} color="info">OK</CButton>
                                <CButton onClick={(e) => this.setState({ openWeightModal: false })} color="secondary">Cancel</CButton>
                            </CModalFooter>
                        </CModal>
                    )
                }
                {/**------Input charge------ */}
                {
                    this.state.openChargeModal && (
                        <CModal
                            show={this.state.openChargeModal}
                            onClose={() => this.setState({ openChargeModal: false })}
                            style={{ width: "40vw" }}
                        >
                            <CModalHeader>
                                <CModalTitle>Lot Number</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CCard>
                                    <CCardBody>
                                        <CForm>
                                            <CFormGroup>
                                                <CRow className="my-2">
                                                    <CCol md="3">
                                                        <CLabel className="float-right"
                                                            onClick={() => this.setState({ charge_table_flag: !this.state.charge_table_flag })}
                                                        >
                                                            Lot Number:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="9">
                                                        <AtndDatePicker
                                                            className="w-100"
                                                            format="YYYY-MM-DD HH:mm:ss"
                                                            onChange={(e) => this.setState({ charge_date: e })}
                                                            value={moment(this.state.charge_date)}
                                                            showTime={{ defaultValue: moment(this.state.charge_date, "HH:mm:ss") }}
                                                        // defaultValue={moment(this.state.charge_date, "YYYY-MM-DD HH:mm:ss")}
                                                        ></AtndDatePicker>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="my-2">
                                                    <CCol md="3">
                                                        <CLabel className="float-right">Comment:</CLabel>
                                                    </CCol>
                                                    <CCol md="9">
                                                        <CTextarea
                                                            name="charge_comment"
                                                            value={this.state.charge_comment}
                                                            onChange={(e) => this.setState({ charge_comment: e.target.value })}
                                                        ></CTextarea>
                                                    </CCol>
                                                </CRow>
                                                {this.state.charge_table_flag === true && (
                                                    <CDataTable
                                                        items={this.state.chargeHistories}
                                                        fields={charge_fields}
                                                        scopedSlots={{
                                                            author: (item) => {
                                                                return <td>{item.user.userName}</td>;
                                                            },
                                                            charge: (item) => {
                                                                return <td>{moment(item.chargeDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                            },
                                                            update_date: (item) => {
                                                                return <td>{moment(item.updateDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                            }
                                                        }}
                                                    ></CDataTable>
                                                )}
                                            </CFormGroup>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="info" onClick={() => this.handleSaveCharge()}>OK</CButton>
                                <CButton onClick={() => this.setState({ openChargeModal: false })} color="secondary">Cancel</CButton>
                            </CModalFooter>
                        </CModal>
                    )
                }
                {/**------View client data------ */}
                {
                    Object.keys(this.state.clientData).length > 0 && (
                        <CModal
                            show={this.state.openClientModal}
                            onClose={() => this.setState({ openClientModal: false })}
                            style={{ width: "40vw" }}
                        >
                            <CModalHeader>
                                <CModalTitle>{this.state.clientData.name}</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CCard>
                                    <CCardBody>
                                        <CForm>
                                            <CFormGroup>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Name1:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_name1"
                                                            value={this.state.deliveryData.address_name1}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Title:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_title"
                                                            value={this.state.deliveryData.address_title}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Country:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_country"
                                                            value={this.state.deliveryData.address_country}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Name2:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_name2"
                                                            value={this.state.deliveryData.address_name2}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Name3:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_name3"
                                                            value={this.state.deliveryData.address_name3}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.Street:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_street"
                                                            value={this.state.deliveryData.address_street}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            Delivering.Address.ZIP:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="address_zip"
                                                            value={this.state.deliveryData.address_zip}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>
                                                            CustomerProductCode:
                                                        </CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="customer_product_code"
                                                            value={this.state.deliveryData.customer_product_code}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>E-mail Address:</CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            type="email"
                                                            name="email_address"
                                                            value={this.state.deliveryData.email}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>FetchDate:</CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="fetch_date"
                                                            value={moment(this.state.deliveryData.fetch_date).format("YYYY-MM-DD HH:mm:ss")}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>OrderId:</CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="order_id"
                                                            value={this.state.deliveryData.order_id}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>Pos.ID:</CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="pos_id"
                                                            value={this.state.deliveryData.pos_id}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="mt-2">
                                                    <CCol md="5">
                                                        <CLabel style={{ float: "right" }}>Weight(target):</CLabel>
                                                    </CCol>
                                                    <CCol md="7">
                                                        <CInput
                                                            name="weight"
                                                            value={this.state.deliveryData.w_target}
                                                            readOnly
                                                        ></CInput>
                                                    </CCol>
                                                </CRow>
                                            </CFormGroup>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CModalBody>
                        </CModal>
                    )
                }
                {/**------Delete laboratory------ */}
                <CModal show={this.state.openDeleteModal} onClose={() => this.setState({ openDeleteModal: false })}>
                    <CModalHeader>
                        <CModalTitle>Confirm</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        Do you really want to delete current inputLaboratory?
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={this.deleteInputLaboratory.bind(this)}>Delete</CButton>{" "}
                        <CButton color="secondary" onClick={() => this.setState({ openDeleteModal: false })}>Cancel</CButton>
                    </CModalFooter>
                </CModal>
                {/**------Click M button------ */}
                {
                    this.state.openStockModal && (
                        <CModal
                            show={this.state.openStockModal}
                            onClose={() => this.setState({ openStockModal: false })}
                            style={{ width: "40vw" }}
                            closeOnBackdrop={false}
                        >
                            <CModalHeader>
                                <CModalTitle>Stock Sample</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <div className="p-3">
                                    {children}
                                    <div className="col-lg-12 text-right mt-1">
                                        <CButton color="info" onClick={() => {
                                            this.setState({ stock_count: parseInt(this.state.stock_count + 1) })
                                            this.setState({ stockModalData: [...this.state.stockModalData, { stock: '', weight: '' }] })
                                        }}>
                                            <i className="fa fa-plus" />
                                        </CButton>
                                    </div>
                                </div>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="info" onClick={this.handleClickOK.bind(this)}>OK</CButton>
                                <CButton onClick={() => this.setState({ openStockModal: false })} color="secondary">Cancel</CButton>
                            </CModalFooter>
                        </CModal>
                    )
                }
                {/**------Click AnalysisType------ */}
                {
                    this.state.openAnalysisModal && (
                        <CModal
                            className="anaylsis_types_modal"
                            show={this.state.openAnalysisModal}
                            onClose={() => this.setState({ openAnalysisModal: false })}
                            style={{ width: "60vw" }}
                            size="lg"
                        >
                            <CModalHeader>
                                <CModalTitle>{this.state.selected_aType.analysisType}</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <div className="border-grey p-4">
                                    {
                                        this.state.materials.filter(m => m._id === this.state.allData.filter(d => d._id === this.state.selectedId)[0].material._id)[0]
                                            .aTypesValues.filter(aT => aT.client === this.state.allData.filter(d => d._id === this.state.selectedId)[0].client._id)
                                            .filter(d => d.value === this.state.selected_aType._id)
                                            .map((data, index) => (
                                                <CRow key={index} className="mx-0 my-2">
                                                    <CCol md="4">
                                                        <CRow>
                                                            <CCol md="6">
                                                                <CLabel className="cursor-pointer" htmlFor="objective" onClick={() => {
                                                                    this.setState({
                                                                        [`analysis_table_flag-${index}`]: (
                                                                            this.state[`analysis_table_flag-${index}`] === null || this.state[`analysis_table_flag-${index}`] === undefined
                                                                        ) ? true : !this.state[`analysis_table_flag-${index}`]
                                                                    })
                                                                }}>
                                                                    {(Object.keys(this.state.objectives).length > 0 && Object.keys(this.state.units).length > 0) ?
                                                                        this.state.objectives.filter(obj => obj._id === data.obj.split("-")[0])[0].objective + " " +
                                                                        this.state.units.filter(u => u._id === data.obj.split("-")[1])[0].unit + " " +
                                                                        "[" + data.min + ", " + data.max + "]" : ''
                                                                    }
                                                                </CLabel>
                                                            </CCol>
                                                            <CCol md="6">
                                                                <Input
                                                                    type="text"
                                                                    className={`form-control-sm ${this.state.analysisTypeModalData[`accept-${index}`] === true ? `color-green` : (this.state.analysisTypeModalData[`isValid-${index}`] !== null && this.state.analysisTypeModalData[`isValid-${index}`] !== undefined && this.state.analysisTypeModalData[`isValid-${index}`] ? `color-green` : `color-red`)}`}
                                                                    required={true}
                                                                    pattern="[^0-9.,]"
                                                                    onKeyPress={this.validate.bind(this)}
                                                                    onChange={(e) => this.onChangeAnalyInput(e, index, data)}
                                                                    value={this.state.analysisTypeModalData[`input-${index}`]}
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
                                                                <CSelect value={(this.state.analysisTypeModalData[`reason-${index}`] !== null && this.state.analysisTypeModalData[`reason-${index}`] !== undefined) ? this.state.analysisTypeModalData[`reason-${index}`] : ''} onChange={(e) => this.setState({ analysisTypeModalData: { ...this.state.analysisTypeModalData, [`reason-${index}`]: e.target.value } })}>
                                                                    <option value="" disabled>
                                                                        Select reason [from Admin/reasons]
                                                                    </option>
                                                                    {this.state.reasons.map((item) => (
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
                                                            <CCol md="8">
                                                                <CLabel>Accept value anyway</CLabel>
                                                            </CCol>
                                                            <CCol md="2 p-0">
                                                                {
                                                                    this.state.user.labAdmin ? (
                                                                        Number(this.state.analysisTypeModalData[`input-${index}`]) >= Number(data.min) && Number(this.state.analysisTypeModalData[`input-${index}`]) <= Number(data.max) ? (
                                                                            <span
                                                                                className={`cursor-pointer border-dark ${(this.state.analysisTypeModalData[`accept-${index}`] !== undefined && this.state.analysisTypeModalData[`accept-${index}`] !== null && this.state.analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                                style={{ width: '20px', height: '20px' }}
                                                                            ></span>
                                                                        ) : (
                                                                            <span
                                                                                className={`cursor-pointer border-dark ${(this.state.analysisTypeModalData[`accept-${index}`] !== undefined && this.state.analysisTypeModalData[`accept-${index}`] !== null && this.state.analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                                style={{ width: '20px', height: '20px' }}
                                                                                onClick={(e) => this.setState({
                                                                                    analysisTypeModalData: { ...this.state.analysisTypeModalData, [`accept-${index}`]: (this.state.analysisTypeModalData[`accept-${index}`] === undefined || this.state.analysisTypeModalData[`accept-${index}`] === null) ? true : !this.state.analysisTypeModalData[`accept-${index}`] }
                                                                                })}
                                                                            ></span>
                                                                        )
                                                                    ) : (
                                                                        <span
                                                                            className={`cursor-pointer border-dark ${(this.state.analysisTypeModalData[`accept-${index}`] !== undefined && this.state.analysisTypeModalData[`accept-${index}`] !== null && this.state.analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                            style={{ width: '20px', height: '20px' }}
                                                                        ></span>
                                                                    )
                                                                }
                                                            </CCol>
                                                        </CRow>
                                                    </CCol>
                                                    {
                                                        (Object.keys(this.state.analysisHistories).length > 0 && Object.keys(this.state.analysisHistories[index]).length > 0 && this.state[`analysis_table_flag-${index}`] === true) && (
                                                            <CCol md="12" className="mt-2">
                                                                <CDataTable
                                                                    items={this.state.analysisHistories[index]}
                                                                    fields={object_fields}
                                                                    scopedSlots={{
                                                                        author: (item) => {
                                                                            return <td>{item.user.userName}</td>;
                                                                        },
                                                                        update_date: (item) => {
                                                                            return <td>{moment(item.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                                                                        },
                                                                        limitValue: (item) => <td>{item.value}</td>,
                                                                        accept: (item) => {
                                                                            return (
                                                                                <td>
                                                                                    <div className="d-flex">
                                                                                        <span className={`cursor-pointer border-dark ${item.accept === 1 && `background-green`}`} style={{ width: '20px', height: '20px' }}></span>
                                                                                    </div>
                                                                                </td>
                                                                            );
                                                                        },
                                                                    }}
                                                                />
                                                            </CCol>
                                                        )
                                                    }
                                                </CRow>
                                            ))
                                    }
                                    <CRow className="mx-0 my-3">
                                        <CCol md="2">
                                            <CLabel>Comment</CLabel>
                                        </CCol>
                                        <CCol md="10">
                                            <CTextarea
                                                name="comment"
                                                value={this.state.analysisTypeModalData.comment}
                                                onChange={(e) => this.setState({ analysisTypeModalData: { ...this.state.analysisTypeModalData, comment: e.target.value } })}
                                            ></CTextarea>
                                        </CCol>
                                    </CRow>
                                </div>
                            </CModalBody>
                            {
                                this.state.sameId && (
                                    <CModalFooter className="text-right">
                                        <CButton type="button" onClick={this.handleSaveAnalysis.bind(this)} color="info">
                                            OK
                                        </CButton>
                                        <CButton color="secondary" className="ml-2" onClick={() => this.setState({ openAnalysisModal: false })}>
                                            Cancel
                                        </CButton>
                                    </CModalFooter>
                                )
                            }
                        </CModal>
                    )
                }
                {/**-------Click CertificateType */}
                <Drawer
                    width="70vw"
                    title="PDF GENERATE"
                    style={{ marginTop: "100px" }}
                    visible={this.state.openCertificateModal}
                    onClose={() => this.setState({ openCertificateModal: false })}
                >
                    <Card hoverable>
                        <div className="row">
                            <div className="col-md-3 col-12 p-0">
                                <List
                                    className="cursor-pointer"
                                    style={{ height: "75vh" }}
                                    header={<h4>Certificate Template</h4>}
                                    bordered
                                    dataSource={this.state.certificateTemplates}
                                    renderItem={(item) => (
                                        <List.Item style={{ fontSize: '22px' }} onClick={() => this.getCertificateData(item)}>
                                            {item.name}
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className="col-md-9 col-12 p-0">
                                {Object.keys(this.state.pdfData).length > 0 && (
                                    <div style={{ overflow: "auto", height: "73vh" }}>
                                        <GPDF
                                            pdfdata={this.state.pdfData}
                                            pdfcolumns={this.state.pdfColumns}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </Drawer>

            </div >
        )
    }
}

export default InputLab