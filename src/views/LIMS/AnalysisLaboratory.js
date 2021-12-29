import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CLabel,
    CButton,
    CFormGroup
} from '@coreui/react';
import { DatePicker as AtndDatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import { CSVLink } from "react-csv";
const axios = require("axios");
const Config = require("../../Config.js");
const { RangePicker } = AtndDatePicker;


const header = [
    { key: "charge", label: "Charge(LOT)" },
    { key: "material", label: "Material" },
    { key: "client", label: "Client" },
    { key: "combination", label: "Analysis Type/Objective" },
    { key: "weight", label: "Actual Weight" },
    { key: "limitValue", label: "Current Value" },
    { key: "c_date", label: "Date" },
    { key: "his_val_1", label: "Historic Value 1" },
    { key: "his_date_1", label: "Date 1" },
    { key: "his_val_2", label: "Historic Value 2" },
    { key: "his_date_2", label: "Date 2" },
    { key: "his_val_3", label: "Historic Value 3" },
    { key: "his_date_3", label: "Date 3" },
    { key: "his_val_4", label: "Historic Value 4" },
    { key: "his_date_4", label: "Date 4" },
    { key: "his_val_5", label: "Historic Value 5" },
    { key: "his_date_5", label: "Date 5" },
    { key: "his_val_6", label: "Historic Value 6" },
    { key: "his_date_6", label: "Date 6" },
    { key: "his_val_7", label: "Historic Value 7" },
    { key: "his_date_7", label: "Date 7" },
];

export default class AnalysisLaboratory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange: [],
            combinations: '',
            selected_combinations: [],
            unitData: [],
            materials: [],
            clients: [],
            materialsData: [],
            analysisData: [],
            objectives: [],
            objectives_list: [],
            clientsData: [],
            client_list: [],
            selected_clients: [],
            avaiable_a_types: [],
            a_type_list: [],
            data_charge_date: [],
            combination_list: [],
            dataset: [],
            export_all_data: [],
            defaultClient: {}
        }
    };
    _chartRef = React.createRef();
    componentDidMount() {
        this.getAllClients();
        this.getAllMaterials();
        this.getAllUnits();
    }
    async on_export_clicked() {
        await this.csvLink.link.click();
    }
    getAllClients() {
        axios.get(Config.ServerUri + "/get_all_clients")
            .then((res) => {
                this.setState({
                    clientsData: res.data,
                    defaultClient: res.data.filter(d => d.name === 'Default')[0]
                });
            })
            .catch((error) => { });
    }
    getAllUnits() {
        axios.get(Config.ServerUri + "/get_all_units")
            .then((res) => {
                this.setState({
                    unitData: res.data,
                });
            })
            .catch((error) => { });
    }
    getAllMaterials() {
        axios.get(Config.ServerUri + "/get_all_materials")
            .then((res) => {
                this.setState({
                    materialsData: res.data.materials,
                    analysisData: res.data.analysisTypes,
                    objectives: res.data.objectives,
                });
            })
            .catch((error) => { });
    }
    getclientdata(data) {
        var res_client = '';
        return axios.post(Config.ServerUri + "/get_input_laboratory_by_id", { data: data })
            .then((res) => {
                if (res.data.client === this.state.defaultClient._id) {
                    res_client = "Default";
                }
                this.state.client_list.map((client) => {
                    if (client._id === res.data.client) {
                        res_client = client.name;
                    }

                });
                return res_client;
            });
    }
    handleGetChartdata() {
        if (!this.state.dateRange.length || !this.state.selected_combinations.length) {
            return;
        }
        else {
            var selectedcombination = []
            var result_selectedcombination = []
            this.state.selected_combinations.map((combination) => {
                selectedcombination.push(combination.value.split('-')[0])
                result_selectedcombination.push(combination.value.split('-'))
            });
            var client_id_list = []
            this.state.clients.map((client) => {
                client_id_list.push(client.value);
            })
            var material_id_list = [];
            // console.log(this.state.materials)
            this.state.materials.map((material_item) => {
                material_id_list.push(material_item.value);
            });
            var data = {
                combinations: selectedcombination,
                dateRange: this.state.dateRange,
                client: client_id_list,
                material: material_id_list,
            }
            var token = localStorage.getItem("token");

            axios.post(Config.ServerUri + "/get_graph_data", { data, token: token })
                .then((res) => {
                    console.log(res.data)
                    var input_id = []
                    var temp_range = []
                    var inputLaboratory_data = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        input_id.push(res.data[i]._id);
                        temp_range.push(res.data[i].charge[res.data[i].charge.length - 1].date)
                    }
                    var range = Array.from(
                        temp_range.reduce((a, o) => a.set(`${o}`, o), new Map()).values()
                    );
                    var input_ids_by_material = [];
                    material_id_list.map((material_item) => {
                        var temp_material_id = []
                        for (var i = 0; i < res.data.length; i++) {
                            if (material_item === res.data[i].material.material) {
                                temp_material_id.push(res.data[i]);
                            }
                        }
                        input_ids_by_material.push(temp_material_id)
                    });
                    range.sort((a, b) => (a > b) ? 1 : -1)
                    this.setState({
                        data_charge_date: range
                    })
                    if (input_id.length > 0) {
                        axios.post(process.env.REACT_APP_API_URL + "analysis/input_history", { labId: input_id })
                            .then(async (history) => {
                                var graph_data = [];
                                input_ids_by_material.map((each_material_item_id) => {
                                    var mat_list = [];
                                    result_selectedcombination.map((record) => {    //record[0]: analysisId, record[1]: objectiveId
                                        var temp_list = [];
                                        for (var i = 0; i < range.length; i++) {
                                            var record_list = [];
                                            var flag = true;
                                            each_material_item_id.map((material_item_id) => {
                                                if (range[i] === material_item_id.charge[material_item_id.charge.length - 1].date) {
                                                    input_id.map((record_value) => {
                                                        history.data.filter(function (item, index) {
                                                            if (item.analysisId === record[0] && item.obj.split('-')[0] === record[1] && item.labId === record_value && item.labId === material_item_id._id) {
                                                                record_list.push(item)
                                                            }
                                                        })
                                                    });
                                                    flag = false;
                                                }
                                            });
                                            if (flag === true) {
                                                record_list.push('')
                                            }
                                            if (record_list.length === 0) {
                                                record_list.push('')
                                            }
                                            temp_list.push(record_list);
                                        }

                                        if (temp_list.length != 0) {
                                            mat_list.push(temp_list);
                                        }
                                        var empty_flag = 0;
                                        for (var k = 0; k < temp_list.length; k++) {
                                            if (temp_list[k][0] == '') {
                                                empty_flag++;
                                            }
                                        }
                                        if (empty_flag == range.length) {
                                            mat_list.pop()
                                        }
                                    });

                                    graph_data.push(mat_list)   //objective history list
                                });
                                // console.log(graph_data);
                                var export_data = [];
                                for (var index = 0; index < graph_data.length; index++) {
                                    if (graph_data[index].length === 0) {
                                        continue;
                                    }
                                    graph_data[index].map((graph_data_index) => {
                                        graph_data_index.map((graph_data_detail_group) => {
                                            if (graph_data_detail_group[0] != "") {
                                                var filtered_input_data = {}
                                                for (var kk = 0; kk < inputLaboratory_data.length; kk++) {
                                                    if (inputLaboratory_data[kk]._id === graph_data_detail_group[graph_data_detail_group.length - 1].labId) {
                                                        filtered_input_data = inputLaboratory_data[kk];
                                                    }
                                                }
                                                if (filtered_input_data._id !== undefined) {
                                                    var charge_data = filtered_input_data.charge[filtered_input_data.charge.length - 1].date;     //to do
                                                    var weight_data = ''
                                                    weight_data = filtered_input_data.weight;     //to do
                                                    // if (filtered_input_data.weight.length > 0) {
                                                    //     // weight_data = filtered_input_data.Weight[filtered_input_data.Weight.length - 1].weight;     //to do
                                                    // }
                                                    var material = filtered_input_data.material.material;
                                                    var client = '';
                                                    if (filtered_input_data.client === this.state.defaultClient._id) {
                                                        client = "Default";
                                                    }
                                                    else {
                                                        this.state.client_list.map((client_item) => {
                                                            if (client_item._id === filtered_input_data.client) {
                                                                client = client_item.name;
                                                            }
                                                        });
                                                    }
                                                    var combination_data = this.state.analysisData.filter(aType => aType._id === graph_data_detail_group[0].analysisId).length > 0
                                                        ? this.state.analysisData.filter(aType => aType._id === graph_data_detail_group[0].analysisId)[0].analysisType : '' + '/' +
                                                            this.state.objectives.filter(obj => String(obj._id) === String(graph_data_detail_group[0].obj.split('-')[0])).length > 0
                                                            ? this.state.objectives.filter(obj => String(obj._id) === String(graph_data_detail_group[0].obj.split('-')[0]))[0].objective : '' + '(' + material + ')';     //to do
                                                    var cur_date = graph_data_detail_group[graph_data_detail_group.length - 1].date;
                                                    var limitValue = graph_data_detail_group[graph_data_detail_group.length - 1].value;
                                                    var his_date_1 = '';
                                                    var his_val_1 = '';
                                                    if (graph_data_detail_group.length >= 2) {
                                                        his_date_1 = graph_data_detail_group[graph_data_detail_group.length - 2].date;
                                                        his_val_1 = graph_data_detail_group[graph_data_detail_group.length - 2].value;
                                                    }
                                                    var his_date_2 = '';
                                                    var his_val_2 = '';
                                                    if (graph_data_detail_group.length >= 3) {
                                                        his_date_2 = graph_data_detail_group[graph_data_detail_group.length - 3].date;
                                                        his_val_2 = graph_data_detail_group[graph_data_detail_group.length - 3].value;
                                                    }
                                                    var his_date_3 = '';
                                                    var his_val_3 = '';
                                                    if (graph_data_detail_group.length >= 4) {
                                                        his_date_3 = graph_data_detail_group[graph_data_detail_group.length - 4].date;
                                                        his_val_3 = graph_data_detail_group[graph_data_detail_group.length - 4].value;
                                                    }
                                                    var his_date_4 = '';
                                                    var his_val_4 = '';
                                                    if (graph_data_detail_group.length >= 5) {
                                                        his_date_4 = graph_data_detail_group[graph_data_detail_group.length - 5].date;
                                                        his_val_4 = graph_data_detail_group[graph_data_detail_group.length - 5].value;
                                                    }
                                                    var his_date_5 = '';
                                                    var his_val_5 = '';
                                                    if (graph_data_detail_group.length >= 6) {
                                                        his_date_5 = graph_data_detail_group[graph_data_detail_group.length - 6].date;
                                                        his_val_5 = graph_data_detail_group[graph_data_detail_group.length - 6].value;
                                                    }
                                                    var his_date_6 = '';
                                                    var his_val_6 = '';
                                                    if (graph_data_detail_group.length >= 7) {
                                                        his_date_6 = graph_data_detail_group[graph_data_detail_group.length - 7].date;
                                                        his_val_6 = graph_data_detail_group[graph_data_detail_group.length - 7].value;
                                                    }
                                                    var his_date_7 = '';
                                                    var his_val_7 = '';
                                                    if (graph_data_detail_group.length >= 8) {
                                                        his_date_7 = graph_data_detail_group[graph_data_detail_group.length - 8].date;
                                                        his_val_7 = graph_data_detail_group[graph_data_detail_group.length - 8].value;
                                                    }

                                                    export_data.push({ "charge": charge_data, "material": material, "client": client, "combination": combination_data, "weight": weight_data, "limitValue": limitValue, "c_date": cur_date, "his_val_1": his_val_1, "his_date_1": his_date_1, "his_val_2": his_val_2, "his_date_2": his_date_2, "his_val_3": his_val_3, "his_date_3": his_date_3, "his_val_4": his_val_4, "his_date_4": his_date_4, "his_val_5": his_val_5, "his_date_5": his_date_5, "his_val_6": his_val_6, "his_date_6": his_date_6, "his_val_7": his_val_7, "his_date_7": his_date_7 })
                                                }
                                            }
                                        });
                                    });
                                }

                                this.setState({
                                    export_all_data: export_data
                                });
                                var graph_show_list = [];
                                for (var p = 0; p < graph_data.length; p++) {
                                    for (var i = 0; i < graph_data[p].length; i++) {
                                        var tmp_list = [];
                                        tmp_list['label'] = this.state.analysisData.filter(aType => String(aType._id) === String(result_selectedcombination[i][0]))[0].analysisType + ' / ' +
                                            this.state.objectives.filter(obj => String(obj._id) === String(result_selectedcombination[i][1]))[0].objective + ' ' +
                                            this.state.unitData.filter(unit => String(unit._id) === String(result_selectedcombination[i][2]))[0].unit + ' (' + material_id_list[p] + ')';
                                        var value_list = [];
                                        var tooltip_list = [];
                                        var chart_client_list = [];
                                        for (var j = 0; j < graph_data[p][i].length; j++) {
                                            if (graph_data[p][i][j][0] === "") {
                                                value_list.push(null);
                                                chart_client_list.push('');
                                            }
                                            var temp_tooltip_list = [];
                                            for (var k = 0; k < graph_data[p][i][j].length; k++) {
                                                if (graph_data[p][i][j][k] === "") {
                                                    continue
                                                }
                                                if (k === graph_data[p][i][j].length - 1) {
                                                    value_list.push(graph_data[p][i][j][k].value);
                                                    var res_client = await this.getclientdata(graph_data[p][i][j][k].labId);
                                                    chart_client_list.push(res_client);
                                                    temp_tooltip_list.push([graph_data[p][i][j][k].value, graph_data[p][i][j][k].user.userName, graph_data[p][i][j][k].date]);
                                                }
                                                else {
                                                    temp_tooltip_list.push([graph_data[p][i][j][k].value, graph_data[p][i][j][k].user.userName, graph_data[p][i][j][k].date])
                                                }
                                            }
                                            tooltip_list.push(temp_tooltip_list);
                                        }
                                        tmp_list['value'] = value_list;
                                        tmp_list['client'] = chart_client_list;
                                        tmp_list['tooltip'] = tooltip_list;
                                        graph_show_list.push(tmp_list);
                                    }
                                }
                                var dataset_list = [];
                                graph_show_list.map((item) => {
                                    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                                    dataset_list.push(
                                        {
                                            label: item.label,
                                            fill: false,
                                            tooltip_list: item.tooltip,
                                            client: item.client,
                                            lineTension: 0,
                                            backgroundColor: '#' + randomColor,
                                            borderColor: '#' + randomColor,
                                            borderWidth: 1,
                                            data: item.value
                                        }
                                    )
                                });
                                this.setState({
                                    dataset: dataset_list
                                });
                            });
                    }
                });

        }

    }
    handleRangeDateChange = (date, dateString) => {
        this.setState({ dateRange: dateString }, () => {
            this.handleGetChartdata();
        });
    }

    handleSubMultiSelectChange = (items) => {
        this.setState({
            selected_combinations: items
        }, () => {
            this.handleGetChartdata();
        });
    }
    handleSelectChangeMaterials = (selected_materials) => {
        var filtered_material = [];
        var filtered_clients = [];
        var avaiable_a_types = [];
        var available_object_list = [];
        this.setState({ materials: selected_materials });
        if (selected_materials === []) {
            filtered_material = [];
            filtered_clients = [];
            avaiable_a_types = [];
            available_object_list = [];
        }
        else {
            selected_materials.map((mat) => {
                filtered_material.push(
                    this.state.materialsData.filter(
                        (material) => material.material === mat.value
                    )[0]
                )
            });
            filtered_material.map((filtered_mat) => {
                avaiable_a_types.push(filtered_mat.aTypesValues);
            });
            var filtered_clients = []
            filtered_material.map((filtered_mat) => {
                const clients = filtered_mat.clients;
                clients.map(client => {
                    if (filtered_clients.indexOf(client) === -1) {
                        filtered_clients.push(client)
                    }
                })
            });
            // filtered_clients_temp.map((client_group) => {
            //     client_group.map((client) => {
            //         filtered_clients.push(client);
            //     })
            // })
            var available_filtered_client = Array.from(
                filtered_clients.reduce((a, o) => a.set(`${o._id}`, o), new Map()).values()
            );


            filtered_material.map((filtered_mat) => {
                available_object_list.push(filtered_mat.objectiveValues);
            })
        }
        var avaiable_client_list = []
        avaiable_client_list.push({ label: 'ALL', value: 'all' });
        avaiable_client_list.push({ label: 'Default', value: this.state.defaultClient._id });
        available_filtered_client.map((filter_client) => {
            avaiable_client_list.push({ label: filter_client.name, value: filter_client._id })
        });
        this.setState({ objectives_list: available_object_list });
        this.setState({ client_list: available_filtered_client });
        this.setState({ avaiable_a_types: avaiable_a_types, client: "" }, () => {
            this.handleGetChartdata();
        });
        // this.setState({selected_clients: []})
        // this.setState({selected_combinations : []});

    }

    handleSelectChangeClients = (client_items) => {
        var available_a_type_names = [];
        var clients = [];
        if (client_items) {
            clients = client_items;
            this.setState({ selected_clients: client_items })
        }
        var client_id_list = []
        clients.map((client_item) => {
            client_id_list.push(client_item.value);
        })
        var material_id_group = [];
        this.state.materials.map((material_item) => {
            material_id_group.push(material_item.value);
        });
        var data = {
            client: client_id_list,
            material: material_id_group,
        }
        axios
            .post(Config.ServerUri + "/get_available_analysis_type", { data })
            .then((res) => {
                let obj_list = []
                res.data.objValues.map(obj => {
                    obj_list.push({
                        analysisId: obj.analysis,
                        analysis: res.data.analysisTypes.filter(aT => aT._id === obj.analysis)[0].analysisType,
                        objectiveId: obj.id,
                        objective: res.data.objectives.filter(o => o._id === obj.id)[0].objective,
                        unitId: obj.unit,
                        unit: res.data.units.filter(u => u._id === obj.unit)[0].unit
                    })
                })

                var result = obj_list.reduce((unique, o) => {
                    if (!unique.some(obj => obj.analysisId === o.analysisId && obj.objectiveId === o.objectiveId && obj.unitId === o.unitId)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                this.setState({
                    clients: client_items,
                    combination_list: result,
                    client_id: clients,
                }, () => {
                    this.handleGetChartdata();
                });

            });
    }
    render() {
        const state = {
            labels: this.state.data_charge_date,
            datasets: this.state.dataset
        }
        var materialOption = [];
        materialOption.push({ label: 'ALL', value: 'all' });
        this.state.materialsData.map((material) => {
            materialOption.push({ label: material.material, value: material.material })
        })
        var options = [];
        this.state.combination_list.map((item) => (
            options.push({
                label: item.analysis + '-' + item.objective + ' ' + item.unit,
                value: item.analysisId + '-' + item.objectiveId + '-' + item.unitId
            })
        ));
        var clientOption = [];
        if (this.state.client_list.length > 0) {
            clientOption.push({ label: 'ALL', value: "all" });
            clientOption.push({ label: 'Default', value: this.state.defaultClient._id });
        }
        this.state.client_list.map((item) => (
            clientOption.push({ label: item.name, value: item._id })
        ));
        return (
            <div className="col-sm-12">
                <div className="row">
                    <div className="col-sm-7">
                        <CCard>
                            <CCardHeader className="text-center">
                                Analysis
                            </CCardHeader>
                            <CCardBody>
                                <Line
                                    data={state}
                                    options={{
                                        spanGaps: true,
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    title: function (context) {
                                                        console.log(context);
                                                        return context[0].dataset.client[context[0].dataIndex] + '  < ' + context[0].dataset.label + ' >';
                                                    },
                                                    label: function (context) {
                                                        var tooltipIndex = context.dataIndex;
                                                        var label = [];
                                                        if (context.dataset.tooltip_list[tooltipIndex].length === 0) {
                                                            label = 'No history';
                                                        }
                                                        else {
                                                            var tooltipdata = context.dataset.tooltip_list[tooltipIndex];
                                                            for (var i = 0; i < tooltipdata.length; i++) {
                                                                label.unshift(tooltipdata[i][0] + ', ' + tooltipdata[i][1] + ', ' + tooltipdata[i][2]);
                                                            }
                                                        }
                                                        return label;
                                                    }
                                                }
                                            },
                                            responsive: true,
                                            legend: {
                                                display: true,
                                                position: 'top'
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                    ref={this._chartRef}
                                />

                            </CCardBody>
                        </CCard>
                    </div>
                    <div className="col-sm-5">
                        <CCard>
                            <CCardBody>
                                <CFormGroup>
                                    <CLabel >Select materials</CLabel>
                                    <Select
                                        isMulti
                                        name="materials"
                                        options={materialOption}
                                        value={this.state.materials}
                                        className="basic-multi-select"
                                        placeholder="Select Materials"
                                        required
                                        onChange={selected => {
                                            selected.length &&
                                                selected.find(option => option.value === "all")
                                                ? this.handleSelectChangeMaterials(materialOption.slice(1))
                                                : this.handleSelectChangeMaterials(selected);
                                        }}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel >Select clients</CLabel>
                                    <Select
                                        isMulti
                                        name="colors"
                                        value={this.state.selected_clients}
                                        options={clientOption}
                                        // onChange = {(e) =>this.handleSelectChangeClients(e)}
                                        placeholder="Select Clients"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selected => {
                                            selected.length &&
                                                selected.find(option => option.value === "all")
                                                ? this.handleSelectChangeClients(clientOption.slice(1))
                                                : this.handleSelectChangeClients(selected);
                                        }}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel >Select Analysis Type/Objective combinations</CLabel>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={options}
                                        onChange={(e) => this.handleSubMultiSelectChange(e)}
                                        placeholder="Select combinations"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <div style={{ textAlign: "center" }}>
                                        <CLabel >Select Charge Range</CLabel>
                                    </div>
                                    <RangePicker
                                        showTime
                                        onChange={(date, dateString) => this.handleRangeDateChange(date, dateString)}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CButton
                                        color="info"
                                        className="float-right"
                                        style={{ margin: "0px 0px 0px 16px" }}
                                        onClick={() => this.on_export_clicked()}
                                    >
                                        <i className="fa fa-download"></i>
                                        <span style={{ padding: "4px" }} />
                                        Export
                                    </CButton>
                                    <CSVLink
                                        headers={header}
                                        filename="Export-LIMS.csv"
                                        data={this.state.export_all_data}
                                        ref={(r) => (this.csvLink = r)}
                                    ></CSVLink>
                                </CFormGroup>
                            </CCardBody>
                        </CCard>
                    </div>
                </div>
            </div>
        );
    }
}