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
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CSelect,
} from "@coreui/react";
import Select from "react-select";
import { CSVLink } from "react-csv";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { DatePicker as AtndDatePicker } from "antd";
import moment from "moment";

import "./style.css";

class InputLab extends Component {

    constructor(props) {
        super(props)

        this.handleChangeMaterial = this.handleChangeMaterial.bind(this)
        this.clearModalData = this.clearModalData.bind(this)

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
            errors: {},
            allData: [],
            materials: [],
            sampleTypes: [],
            packingTypes: [],
            analysisTypes: [],
            clients: [],
            certificateTypes: [],
            header: [],
            excelData: [],
            search_aType: '',
            labId: '',
            display_detail: true,
            openCreateModal: false,
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
                pos_id: ''
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
                w_target: '',
                remark: ''
            }
        };

    }

    componentDidMount() {
        this.getInputLabData()
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
                w_target: '',
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
                email_address: '',
                fetch_date: new Date(),
                order_id: '',
                pos_id: ''
            },
            errors: {}
        })
    }

    getInputLabData() {
        axios.get(process.env.REACT_APP_API_URL + "inputLabs")
            .then(res => {
                console.log(res.data)
                this.setState({
                    allData: res.data.inputLabs,
                    materials: res.data.materials,
                    sampleTypes: res.data.sampleTypes,
                    packingTypes: res.data.packingTypes,
                    analysisTypes: res.data.analysisTypes,
                    certificateTypes: res.data.certificateTypes
                })
            })
            .catch(err => console.log(err.response.data))
    }

    handleChangeMaterial(e) {
        axios.get(process.env.REACT_APP_API_URL + `materials/clients/${e.target.value}`)
            .then(res => {
                this.setState({ clients: res.data })
            })
            .catch(err => console.log(err.response.data))
    }

    on_export_clicked() {

    }

    handleFiles() {

    }

    handleSubmit() {
        const data = {
            labs: this.state.modalData,
            delivery: this.state.deliveryData
        }
        axios.post(process.env.REACT_APP_API_URL + "inputLabs", data)
            .then(res => {
                console.log(res.data)
                this.setState({
                    allData: res.data,
                    openCreateModal: false
                })
            })
            .catch(err => {
                console.log(err.response.data)
                this.setState({ errors: err.response.data })
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
                                    this.setState({ modalData: { ...this.state.modalData, sample_type: e.target.value } })
                                    if (this.state.errors.sample_type) delete this.state.errors.sample_type
                                }}
                                required
                            >
                                <option value="" disabled hidden>* Select from Sample Type *</option>
                                {Object.keys(this.state.sampleTypes).length > 0 && this.state.sampleTypes.map((item, index) => (
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
                                    this.setState({ modalData: { ...this.state.modalData, material: e.target.value } })
                                    this.handleChangeMaterial(e)
                                    if (this.state.errors.material) delete this.state.errors.material
                                }}
                                disabled={this.state.disabled_material}
                            >
                                <option value="" disabled hidden>* Material *</option>
                                {Object.keys(this.state.materials).length > 0 && this.state.materials.map((item, index) => (
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
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, client: e.target.value } })}
                            >
                                <option value="">Default</option>
                                {Object.keys(this.state.clients).length > 0 && this.state.clients.map((client, index) => (
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
                                            onChange={(e) => this.setState({ deliveryData: { ...this.state.deliveryData, fetch_date: e.target.value } })}
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
                                        value={this.state.modalData.w_target}
                                        onChange={(e) => this.setState({ modalData: { ...this.state.modalData, w_target: e.target.value } })}
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
                                {this.state.packingTypes.map((item, index) => (
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
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, due_date: e.target.value } })}
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
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, sample_date: e.target.value } })}
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
                                    onChange={(e) => this.setState({ modalData: { ...this.state.modalData, sending_date: e.target.value } })}
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
                                options={this.state.analysisTypes.map(aType => {
                                    return {
                                        label: aType.analysisType,
                                        value: aType._id
                                    }
                                })}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, aType: e } })}
                                value={this.state.modalData.aType.length === 0 ? undefined : this.state.modalData.aType}
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
                                options={this.state.certificateTypes.map(cType => {
                                    return {
                                        label: cType.certificateType,
                                        value: cType._id
                                    }
                                })}
                                onChange={(e) => this.setState({ modalData: { ...this.state.modalData, cType: e } })}
                                value={this.state.modalData.cType.length === 0 ? undefined : this.state.modalData.cType}
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
                            headers={this.state.header}
                            filename="Laboratory.csv"
                            data={this.state.excelData}
                        // ref={(r) => (this.csvLink = r)}
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
                            client: (item, index) => {
                                var button_name = "";
                                if (item.client === "") {
                                    button_name = "Default";
                                } else {
                                    button_name = item.client.name;
                                }
                                return (
                                    <td>
                                        {button_name && (
                                            <CButton className="cursor-pointer" onClick={() => this.on_client_clicked(item)}>{button_name}</CButton>
                                        )}
                                    </td>
                                );
                            },
                            buttonGroups: (item, index) => {
                                var data = item;
                                if (Object.keys(item.client).length > 0) {
                                    data.client = item.client.name;
                                    return (
                                        <td className="d-flex">
                                            <CButton color="warning" size="sm" onClick={() => this.on_add_material(item)}>M</CButton>
                                            <CButton color="info" size="sm" onClick={() => this.on_update_clicked(item)}><i className="fa fa-edit" /></CButton>
                                            <CButton color="danger" size="sm" onClick={() => this.on_delete_clicked(item._id)}><i className="fa fa-trash" /></CButton>
                                        </td>
                                    );
                                }
                            },
                            a_types: (item) => {
                                if (item.stockinfo === 0) {
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
                                            {
                                                item.a_types.length > 0 && (
                                                    <div style={{ display: "column" }}>
                                                        {item.a_types.map((v, k) => {
                                                            if (data.length === 0) {
                                                                return (
                                                                    <div key={k} style={{ padding: "5px" }}>
                                                                        <CButton
                                                                            key={k}
                                                                            style={{
                                                                                backgroundColor: "grey",
                                                                                color: "white",
                                                                            }}
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                this.onRowClicked(item, v._id);
                                                                            }}
                                                                        >
                                                                            {v.analysisType}
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

                                                                if (color === "") {
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
                                                )
                                            }
                                        </td>
                                    );
                                } else {
                                    var data = [];
                                    var color = "";
                                    item.a_types.map((v, k) => {
                                        this.state.objectiveHistory.map((temp) => {
                                            data.push(temp);
                                        });
                                    });
                                    return (
                                        <td>
                                            <div style={{ display: "column" }}>
                                                {item.a_types.map((v, k) => {
                                                    if (data.length === 0) {
                                                        var analysis_name = "";
                                                        if (v.toString().split("-").length === 1) {
                                                            analysis_name = v;
                                                        } else {
                                                            analysis_name =
                                                                v.toString().split("-")[3] +
                                                                "-" +
                                                                v.toString().split("-")[0];
                                                        }
                                                        return (
                                                            <div key={k} style={{ padding: "5px" }}>
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
                                                                    {v.analysisType}
                                                                </CButton>
                                                            </div>
                                                        );
                                                    } else {
                                                        var analysis_history = [];
                                                        var color_group = [];
                                                        if (v.toString().split("-").length === 1) {
                                                            for (var i = data.length - 1; i >= 0; i--) {
                                                                if (
                                                                    !analysis_history.some(
                                                                        (val) =>
                                                                            `${val.label} + ${val.analysis} + ${val.obj_value}+ ${val.stockok}` ===
                                                                            `${data[i].label} + ${data[i].analysis} + ${data[i].obj_value}+ ${data[i].stockok}`
                                                                    )
                                                                ) {
                                                                    analysis_history.push(data[i]);
                                                                }
                                                            }
                                                        } else {
                                                            for (var i = data.length - 1; i >= 0; i--) {
                                                                if (
                                                                    !analysis_history.some(
                                                                        (val) =>
                                                                            `${val.label} + ${val.analysis} + ${val.obj_value}+ ${val.stockok}` ===
                                                                            `${data[i].label} + ${data[i].analysis} + ${data[i].obj_value}`
                                                                    )
                                                                ) {
                                                                    analysis_history.push(data[i]);
                                                                }
                                                            }
                                                        }
                                                        color = "";
                                                        if (v.toString().split("-").length === 1) {
                                                            analysis_history.map((temp, index) => {
                                                                if (temp.stockok === "self") {
                                                                    if (temp.id === item._id) {
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
                                                                    }
                                                                }
                                                            });
                                                        } else {
                                                            analysis_history.map((temp) => {
                                                                if (temp.stockok === "other") {
                                                                    if (
                                                                        temp.analysis === v.toString().split("-")[0]
                                                                    ) {
                                                                        if (temp.id === v.toString().split("-")[1]) {
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
                                                                    }
                                                                }
                                                            });
                                                        }

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

                                                        if (color === "") {
                                                            color = "grey";
                                                        }
                                                        var analysis_name = "";
                                                        if (v.toString().split("-").length === 1) {
                                                            analysis_name = v;
                                                        } else {
                                                            analysis_name =
                                                                v.toString().split("-")[3] +
                                                                "-" +
                                                                v.toString().split("-")[0];
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
                                                                    {v.analysisType}
                                                                </CButton>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </td>
                                    );
                                }
                            },
                            c_types: (item) => {
                                if (item.stockinfo === 0) {
                                    return (
                                        <td>
                                            <div style={{ display: "column" }}>
                                                {item.c_types.map((v, k) => (
                                                    <div key={k} style={{ padding: "5px" }}>
                                                        <CButton onClick={() => this.certificate_modal_state(item, v)}>
                                                            {v.certificateType}
                                                        </CButton>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td>
                                            <div style={{ display: "column" }}>
                                                {item.c_types.map((v, k) => {
                                                    return (
                                                        <div key={k} style={{ padding: "5px" }}>
                                                            <CButton
                                                                onClick={() =>
                                                                    this.certificate_modal_state(item, v)
                                                                }
                                                            >
                                                                {v.certificateType}
                                                            </CButton>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    );
                                }
                            },
                            Weight: (item) => {
                                if (item.Weight === 0 || item.weight === "") {
                                    return (
                                        <td>
                                            <CButton onClick={() => this.onClick_weight(item._id)}>
                                                N/A
                                            </CButton>
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td>
                                            <CButton onClick={() => this.onClick_weight(item._id)}>
                                                {item.weight}
                                            </CButton>
                                        </td>
                                    );
                                }
                            },
                            Charge: (item, index) => {
                                if (item.charge === 0 || item.charge === "") {
                                    return (
                                        <td>
                                            <CButton onClick={() => this.onClick_charge(item._id)}>
                                                N/A
                                            </CButton>
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td>
                                            <CButton onClick={() => this.onClick_charge(item, item.charge)}>
                                                {item.charge}
                                            </CButton>
                                        </td>
                                    );
                                }
                            },
                            material_left: (item) => {
                                return <td>{item.material}</td>;
                            },
                            stockSample: (item) => {
                                return <td></td>;
                            },
                        }}
                    />
                </div>
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
            </div>
        )
    }
}

export default InputLab