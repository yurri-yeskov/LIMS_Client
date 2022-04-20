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
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import { CSVLink } from "react-csv";
import moment from "moment";
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

        this._chartRef = React.createRef();

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
            clientsData: [],
            client_list: [],
            selected_clients: [],
            avaiable_a_types: [],
            a_type_list: [],
            data_charge_date: [],
            combination_list: [],
            dataset: [],
            export_all_data: [],
            defaultClient: {},
            date_format: 'MM/DD/YYYY'
        }
    };

    componentDidMount() {
        this.getData();
    }

    async on_export_clicked() {
        await this.csvLink.link.click();
    }

    getData() {
        axios.get(Config.ServerUri + "/get_all_materials")
            .then((res) => {
                this.setState({
                    materialsData: res.data.materials,
                    analysisData: res.data.analysisTypes,
                    objectives: res.data.objectives,
                    clientsData: res.data.clients,
                    defaultClient: res.data.clients.filter(d => d.name === 'Default')[0],
                    unitData: res.data.units,
                });
            })
            .catch((error) => { });

        axios.get(process.env.REACT_APP_API_URL + "settings/date_format")
            .then(res => {
                this.setState({ date_format: res.data.date_format })
            }).catch(err => console.log(err.response.data))
    }

    getclientdata(data) {
        var res_client = '';
        return axios.post(Config.ServerUri + "/get_input_laboratory_by_id", { data: data })
            .then((res) => {
                console.log(res.data.client)
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

    getGraphData = async () => {
        if (!this.state.dateRange.length || !this.state.selected_combinations.length) {
            return;
        }
        // var selectedcombination = []
        // var result_selectedcombination = []
        // this.state.selected_combinations.map((combination) => {
        //     selectedcombination.push(combination.value.split('-')[0])       //Analysis Type
        //     result_selectedcombination.push(combination.value.split('-'))
        // });
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
            combinations: this.state.selected_combinations.map(com => com.value),       //aType-objective-unit-material-client
            dateRange: this.state.dateRange,
            client: client_id_list,
            material: material_id_list,
        }
        // console.log("Selected Combinations: ", this.state.selected_combinations);
        console.log("Data: ", data);
        var token = localStorage.getItem("token");

        try {
            const res = await axios.post(Config.ServerUri + "/get_graph_data", { data, token: token });
            console.log("Input History: ", res.data)
            var chart_info = [];
            var export_all_data = [];
            res.data.map(item => {

                let y_axis = [];
                let y_tooltip = [];
                let x_axis = [];
                let tooltip_materials = [];
                let tooltip_clients = [];
                let temp_tooltip_list = [];
                let tooltip_histories = [];

                const historical_values = this.getHistoricalValues(item.history);
                historical_values.map(hh => {
                    tooltip_histories = [];
                    temp_tooltip_list = [];
                    temp_tooltip_list.push(hh.value + " " + hh.user.userName + " " + moment(hh.date).format(this.state.date_format + ' HH:mm') + " " + hh.reason);
                    if (hh.reason !== 'Mehrfach-Probe') {
                        item.history.filter(hist => hist.length > 0 && hist[0].labId._id === hh.labId._id)[0]
                            .filter(hhh => hhh.labId._id === hh.labId._id && hhh._id !== hh._id)
                            .map(hhh => hhh.value + " " + hhh.user.userName + " " + moment(hhh.date).format(this.state.date_format + ' HH:mm') + " " + hhh.reason)
                            .map(hhhh => temp_tooltip_list.push(hhhh));
                    }

                    y_axis.push(hh.value);
                    y_tooltip.push(temp_tooltip_list);
                    x_axis.push(moment(hh.date).format(this.state.date_format + ' HH:mm'));
                    tooltip_materials.push(this.state.materialsData.filter(m => m._id === hh.labId.material)[0].material);
                    tooltip_clients.push(this.state.clientsData.filter(c => c._id === hh.labId.client)[0].name);
                    return true;
                });

                let label = this.state.selected_combinations.filter(com => com.value === item.combination).length > 0 ?
                    this.state.selected_combinations.filter(com => com.value === item.combination)[0].label : '';

                let randomColor = Math.floor(Math.random() * 16777215).toString(16);
                chart_info.push({
                    backgroundColor: '#' + randomColor,
                    borderColor: '#' + randomColor,
                    fill: false,
                    label: label.replace('-', ' / '),
                    lineTension: 0,
                    borderWidth: 1,
                    data: y_axis,
                    tooltip: y_tooltip,
                    x_axis: x_axis,
                    tooltip_materials: tooltip_materials,
                    tooltip_clients: tooltip_clients
                })

                // export_all_data.push({
                //     c_date: x_axis[0],
                //     charge: item.labId.charge[lab.charge.length - 1].date,
                //     client: this.state.clientsData.filter(c => c._id === item.labId.client)[0].name,
                //     combination: label,
                //     his_date_1: x_axis.length > 1 ? x_axis[1] : '',
                //     his_date_2: x_axis.length > 2 ? x_axis[2] : '',
                //     his_date_3: x_axis.length > 3 ? x_axis[3] : '',
                //     his_date_4: x_axis.length > 4 ? x_axis[4] : '',
                //     his_date_5: x_axis.length > 5 ? x_axis[5] : '',
                //     his_date_6: x_axis.length > 6 ? x_axis[6] : '',
                //     his_date_7: x_axis.length > 7 ? x_axis[7] : '',
                //     his_val_1: y_axis.length > 1 ? y_axis[1] : '',
                //     his_val_2: y_axis.length > 2 ? y_axis[2] : '',
                //     his_val_3: y_axis.length > 3 ? y_axis[3] : '',
                //     his_val_4: y_axis.length > 4 ? y_axis[4] : '',
                //     his_val_5: y_axis.length > 5 ? y_axis[5] : '',
                //     his_val_6: y_axis.length > 6 ? y_axis[6] : '',
                //     his_val_7: y_axis.length > 7 ? y_axis[7] : '',
                //     limitValue: y_axis[0],
                //     material: this.state.materialsData.filter(m => m._id === item.labId.material)[0].material,
                //     weight: item.labId.weight,
                // })


            });
            console.log("Chart Info: ", chart_info)
            setTimeout(() => {
                // console.log("Excel Data: ", export_all_data)
                this.setState({
                    dataset: chart_info,
                    export_all_data: export_all_data
                });

            }, 1000);
        } catch (err) {
            console.log(err);
        }
    }

    getHistoricalValues(history_info) {
        let temp_history_list = [];
        let history_list = [];
        let correctValues = [];
        for (let j = 0; j < history_info.length; j++) {
            temp_history_list = [];
            history_list = [];
            const sorted_histories = history_info[j].sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1
            })
            for (let i = 0; i < sorted_histories.length; i++) {
                if (i === sorted_histories.length - 1) {
                    if (sorted_histories[i].reason === "Mehrfach-Probe") {
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                        temp_history_list.push(sorted_histories[i]);
                        history_list.push(temp_history_list);
                        correctValues.push(sorted_histories[i - 1]);
                    } else {
                        temp_history_list.push(sorted_histories[i]);
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                    }
                    correctValues.push(sorted_histories[i]);
                } else {
                    if (sorted_histories[i].reason !== "Mehrfach-Probe") {
                        temp_history_list.push(sorted_histories[i]);
                        continue;
                    } else {
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                        temp_history_list.push(sorted_histories[i]);
                        correctValues.push(sorted_histories[i - 1]);
                    }
                }
            }
        }
        console.log("<<<<<<<<<<<<<<<<<", history_list)
        const sorted_hist = correctValues.sort((a, b) => {
            return new Date(a.date) > new Date(b.date) ? 1 : -1
        });
        return sorted_hist;
    }

    handleChangeRangeDate = (date, dateString) => {
        this.setState({ dateRange: dateString }, () => {
            this.getGraphData();
        });
    }

    handleChangeAnalysisType = (items) => {
        this.setState({
            selected_combinations: items
        }, () => {
            this.getGraphData();
        });
    }

    handleChangeMaterial = (selected_materials) => {

        var filtered_clients = [];
        this.setState({ materials: selected_materials });

        const filtered_material = this.state.materialsData
            .filter(item => selected_materials.map(m => m.value).indexOf(item.material) > -1)

        filtered_material.map((filtered_mat) => {
            filtered_mat.clients.map(client => {
                if (filtered_clients.indexOf(client) === -1) {
                    filtered_clients.push(client)
                }
            })
        });
        var avaiable_client_list = []
        avaiable_client_list.push({ label: 'ALL', value: 'all' });
        avaiable_client_list.push({ label: 'Default', value: this.state.defaultClient._id });
        filtered_clients.map((filter_client) => {
            avaiable_client_list.push({ label: filter_client.name, value: filter_client._id })
        });
        this.setState({ client_list: avaiable_client_list });

        const avaiable_a_types = filtered_material.map(filtered_mat => filtered_mat.aTypesValues);

        this.setState({ avaiable_a_types: avaiable_a_types, client: "" }, () => {
            this.getGraphData();
        });
    }

    handleChangeClient = (client_items) => {
        this.setState({ selected_clients: client_items })

        const client_id_list = client_items.map(client_item => client_item.value);
        const material_id_group = this.state.materials.map((material_item) => material_item.value);     //materials: selected materials

        var data = {
            client: client_id_list,
            material: material_id_group,
        }
        axios
            .post(Config.ServerUri + "/get_available_analysis_type", { data })
            .then((res) => {
                let obj_list = []
                res.data.objValues.map((obj, index) => {
                    obj_list.push({
                        material_id: res.data.material_ids[index],
                        analysisId: obj.analysis,
                        analysis: res.data.analysisTypes.filter(aT => aT._id === obj.analysis)[0].analysisType,
                        objectiveId: obj.id,
                        objective: res.data.objectives.filter(o => o._id === obj.id)[0].objective,
                        unitId: obj.unit,
                        unit: res.data.units.filter(u => u._id === obj.unit)[0].unit,
                        clientId: obj.client,
                        // clientName: this.state.clientsData.filter(c => c._id === obj.client)[0].name
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
                    client_id: client_items,
                }, () => {
                    this.getGraphData();
                });

            });
    }

    render() {
        var materialOption = [];
        materialOption.push({ label: 'ALL', value: 'all' });
        this.state.materialsData.map((material) => {
            materialOption.push({ label: material.material, value: material.material })
        })
        var options = [];
        this.state.combination_list.map((item) => (
            options.push({
                label: item.analysis + '-' + item.objective + ' ' + item.unit,
                value: item.analysisId + '-' + item.objectiveId + '-' + item.unitId + '-' + item.material_id + '-' + item.clientId
            })
        ));
        var clientOption = [];
        this.state.client_list.map((item) => (
            clientOption.push({ label: item.label, value: item.value })
        ));
        return (
            <div className="col-sm-12">
                <div className="row">
                    <div className="col-6">
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
                                                ? this.handleChangeMaterial(materialOption.slice(1))
                                                : this.handleChangeMaterial(selected);
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
                                        placeholder="Select Clients"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={selected => {
                                            selected.length &&
                                                selected.find(option => option.value === "all")
                                                ? this.handleChangeClient(clientOption.slice(1))
                                                : this.handleChangeClient(selected);
                                        }}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel >Select Analysis Type/Objective combinations</CLabel>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={options}
                                        onChange={(e) => this.handleChangeAnalysisType(e)}
                                        placeholder="Select combinations"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <div style={{ textAlign: "left" }}>
                                        <CLabel >Select Charge Range</CLabel>
                                    </div>
                                    <RangePicker
                                        className="w-100"
                                        style={{ minHeight: '38px' }}
                                        showTime
                                        onChange={(date, dateString) => this.handleChangeRangeDate(date, dateString)}
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
                    {
                        this.state.dataset.map((dataset, index) => {
                            const data = {
                                labels: dataset.x_axis,
                                datasets: [{
                                    label: dataset.label,
                                    data: dataset.data,
                                    fill: false,
                                    backgroundColor: dataset.backgroundColor,
                                    borderColor: dataset.borderColor,
                                    tooltip_materials: dataset.tooltip_materials,
                                    tooltip_clients: dataset.tooltip_clients,
                                    tooltip_list: dataset.tooltip
                                }]
                            }
                            return <div className="col-6" key={index}>
                                <CCard>
                                    <CCardHeader className="text-center">
                                        Analysis
                                    </CCardHeader>
                                    <CCardBody>
                                        <Line
                                            data={data}
                                            options={{
                                                spanGaps: true,
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            title: function (context) {
                                                                return ' < ' + context[0].dataset.label + ' >' + context[0].dataset.tooltip_materials[context[0].dataIndex] + context[0].dataset.tooltip_clients[context[0].dataIndex];
                                                            },
                                                            label: function (context) {
                                                                var tooltipIndex = context.dataIndex;
                                                                var label = [];
                                                                if (context.dataset.tooltip_list[tooltipIndex].length === 0) {
                                                                    label = 'No history';
                                                                }
                                                                else {
                                                                    label = context.dataset.tooltip_list[tooltipIndex];
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
                        })
                    }
                </div>
            </div>
        );
    }
}