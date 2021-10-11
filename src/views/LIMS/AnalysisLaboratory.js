import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CLabel,
    CSelect,
    CFormGroup
} from '@coreui/react';
import { DatePicker as AtndDatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import {Line} from 'react-chartjs-2';
import Select from 'react-select';
var uniqid = require('uniqid');
const axios = require("axios");
const Config = require("../../Config.js");
const { RangePicker } = AtndDatePicker;

export default class AnalysisLaboratory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange : [],
            combinations : '',
            selected_combinations : [],
            materials : '',
            clients : '',
            materialsData: [],
            analysisData: [],
            objectives: [],
            objectives_list: [],
            clientsData :[],
            client_list: [],
            avaiable_a_types:[],
            a_type_list : [],
            data_charge_date :[],
            combination_list:[],
            dataset:[],
            top: 0,
            left: 0,
            date: '',
            value: 0,
        }
        
    };
    _chartRef = React.createRef();
    componentDidMount(){
        this.getAllClients();
        this.getAllMaterials();
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
    getAllMaterials(){
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
    handleGetChartdata(){
        if( !this.state.dateRange.length || !this.state.selected_combinations.length){
            return;
        }
        else{
           var selectedcombination = []
           var result_selectedcombination = []
           this.state.selected_combinations.map((combination)=>{
            selectedcombination.push(combination.value.split('-')[0])
            result_selectedcombination.push(combination.value.split('-'))
           });
           var data = {
                combinations: selectedcombination,
                dateRange: this.state.dateRange,
                client: this.state.clients,
                material: this.state.materials,
           }
           var token = localStorage.getItem("token");
           
           axios
            .post(Config.ServerUri + "/get_graph_data", { data, token: token })
            .then((res) => {
                var input_id = []
                var range = []
                for(var i = 0; i< res.data.length; i++){
                    input_id.push(res.data[i]._id);
                    range.push(res.data[i].Charge[0].charge)
                }
                this.setState({
                    data_charge_date: range      
                })
                if(input_id.length > 0){
                    axios
                      .post(Config.ServerUri + "/get_objective_history_for_chart", {data:input_id})
                      .then((history) => {
                          var graph_data = []
                          result_selectedcombination.map((record) => {
                              var temp_list = [];
                              input_id.map((record_value) => {
                                    var record_list = [];
                                    history.data.filter(function(item, index){
                                        if(item.analysis == record[0] && item.label == record[1] && item.id == record_value){
                                            record_list.push(item)
                                        }
                                    })
                                    temp_list.push(record_list);
                              })
                              graph_data.push(temp_list)
                          });
                        console.log(graph_data);
                        var graph_show_list = [];
                        for(var i=0; i<graph_data.length; i++){
                            var tmp_list = [];
                            tmp_list['label'] = result_selectedcombination[i][0]+' / '+result_selectedcombination[i][1];
                            var value_list = [];
                            for(var j = 0; j < graph_data[i].length; j++){
                                for(var k=0;k < graph_data[i][j].length; k++){
                                    if( k == graph_data[i][j].length - 1){
                                        value_list.push(graph_data[i][j][k].limitValue)
                                    }
                                    if(graph_data[i][j].length > 1){
                                        
                                    }

                                }
                                
                            }
                            tmp_list['value'] = value_list;
                            graph_show_list.push(tmp_list);
                        }
                        var dataset_list = [];
                        graph_show_list.map((item)=> {
                            var randomColor = Math.floor(Math.random()*16777215).toString(16);
                            dataset_list.push(
                                {
                                    label: item.label,
                                    fill: false,
                                    lineTension: 0,
                                    backgroundColor: '#'+randomColor,
                                    borderColor: 'rgba(0,0,0,1)',
                                    borderWidth: 1,
                                    data: item.value
                                }
                            )
                        });
                        this.setState({
                            dataset:dataset_list
                        });
                      });
                }
            });
           
        }
        
    }
    handleRangeDateChange = (date, dateString) => {
        this.setState({ dateRange: dateString },() => {
            this.handleGetChartdata();
        });
    }

    handleSubMultiSelectChange = (items) => {
        this.setState({
            selected_combinations : items },() => {
            this.handleGetChartdata();
        });
    }
    handleSelectChangeMaterials = (e) => {
        var filtered_material = [];
        var filtered_clients = [];
        var avaiable_a_types = [];
        var available_a_type_names = [];
        var available_object_list = [];

        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value === "") {
            filtered_material = [];
            filtered_clients = [];
            avaiable_a_types = [];
            available_object_list = [];
        }
        else{
            filtered_material = this.state.materialsData.filter(
                (material) => material.material === e.target.value
            );
            avaiable_a_types = filtered_material[0].aTypesValues;
            filtered_clients = this.state.clientsData.filter(
                (client) => filtered_material[0].clients.indexOf(client._id) > -1
            );
            avaiable_a_types.map((element) => {
                if (filtered_material[0].clients.includes(element.client)) {
                  available_a_type_names.push(
                    this.state.analysisData.filter(
                      (a_data) => a_data._id == element.value
                    )
                  );
                }
            });
            available_object_list =  filtered_material[0].objectiveValues;
        }
        this.setState({ objectives_list: available_object_list });
        this.setState({ client_list: filtered_clients });
        this.setState({ a_type_list: available_a_type_names, client_id: "" });
        this.setState({ avaiable_a_types: avaiable_a_types, client: "" });
    }

    handleSelectChangeClients = (e) => {
        var available_a_type_names = [];
        var client = "";
        if (e.target.value) {
            client = e.target.value;
        }
        var name = e.target.name;
        this.state.avaiable_a_types.map((item) => {
            if (client === item.client) {
                available_a_type_names.push(
                    this.state.analysisData.filter((a_data) => a_data._id == item.value)
                );
            }
        });
        var analysis_option = Array.from(
            available_a_type_names.reduce((a, o) => a.set(`${o[0]._id}`, o), new Map()).values()
        );
        var temp = this.state.objectives_list;
        var reduced_object_list = [];
        for(var i = 0; i<temp.length; i++){
            var flag = true;
            for(var j = i+1; j<temp.length; j++){
                if(temp[i].analysis == temp[j].analysis && temp[i].id == temp[j].id){
                    flag = false;
                }
            }
            if(flag){
                reduced_object_list.push(temp[i]);
            }
        }
        var combination_list = []
        reduced_object_list.map((obj) => {
            if(obj.client = e.target.value){
                var temp_object = this.state.objectives.filter((object) => object._id == obj.id);
                var temp_analysis = analysis_option.filter((option) => option[0]._id == obj.analysis);
                if(temp_object.length>0 && temp_analysis.length>0){
                    combination_list.push([temp_object, temp_analysis]);
                }
            }
        });

        this.setState({
            [name]: e.target.value,
            combination_list: combination_list,
            client_id: client,
        });
    }
    setPositionAndData = (top, left, date, value) => {
        this.setState({top, left, date, value});
    };      
    showTooltip = (tooltip) => {
        if (tooltip.opacity === 0) {
            this.setState({
                tooltip : undefined
            });
        } else {
            this.setState({ 
                tooltip
            });
        }
     }
    render(){
        const state = {
            labels: this.state.data_charge_date,
            datasets: this.state.dataset
        }
        var options = [];
        console.log(this.state.combination_list);
        this.state.combination_list.map((item) => (
            options.push({label : item[1][0][0].analysisType+'/'+item[0][0].objective, value: item[1][0][0].analysisType+'-'+item[0][0].objective })
        ))
        return(
            <div className = "col-sm-12">
                <div className = "row">
                    <div className = "col-sm-7">
                        <CCard>
                            <CCardHeader className = "text-center">
                                Analysis
                            </CCardHeader>
                            <CCardBody>
                            <Line
                                data={state}
                                options={{
                                    title:{
                                        display:true,
                                        text:'Analysis Data',
                                        fontSize:20
                                    },
                                    responsive: true,
                                    legend:{
                                        display:true,
                                        position:'left'
                                    },
                                    scales: {
                                        yAxes: [
                                            {
                                                ticks: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        ],
                                    },
                                    tooltips: {
                                        enabled: false,
                                        mode: "x",
                                        intersect: false,
                                        custom: (tooltipModel) => {
                                          // if chart is not defined, return early
                                          var chart = this._chartRef.current;
                                          if (!chart) {
                                            return;
                                          }
                                  
                                          // hide the tooltip when chartjs determines you've hovered out
                                          if (tooltipModel.opacity === 0) {
                                            this.hide();
                                            return;
                                          }
                                  
                                          const position = chart.chartInstance.canvas.getBoundingClientRect();
                                  
                                          // assuming your tooltip is `position: fixed`
                                          // set position of tooltip
                                          const left = position.left + tooltipModel.caretX;
                                          const top = position.top + tooltipModel.caretY;
                                  
                                          // set values for display of data in the tooltip
                                          const date = tooltipModel.dataPoints[0].xLabel;
                                          const value = tooltipModel.dataPoints[0].yLabel;
                                  
                                          this.setPositionAndData({top, left, date, value});
                                        },
                                      }
                                }}
                                ref={this._chartRef} 
                                />
                                { this.state.showTooltip
                                    ? <div style={{marginTop: this.state.top, marginLeft: this.state.left}}>
                                        <div>Date: {this.state.date}</div>
                                        <div>Value: {this.state.value}</div>
                                    </div>
                                    : null
                                }
                            </CCardBody>
                        </CCard>
                    </div>
                    <div className = "col-sm-5">
                    <CCard>
                        <CCardBody> 
                            <CFormGroup>
                                <CLabel >Select materials</CLabel>
                                <CSelect
                                    name="materials"
                                    value={this.state.materials}
                                    onChange={this.handleSelectChangeMaterials}
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Materials
                                    </option>
                                    {this.state.materialsData.map((item) => (
                                    <option key={item._id} value={item.material}>
                                        {item.material}
                                    </option>
                                    ))}
                                </CSelect>
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel >Select clients</CLabel>
                                <CSelect
                                    name="clients"
                                    value={this.state.clients}
                                    onChange={this.handleSelectChangeClients}
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Clients
                                    </option>
                                    {this.state.client_list.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                    ))}
                                </CSelect>
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel >Select Analysis Type/Objective combinations</CLabel>
                                <Select
                                    isMulti
                                    name="colors"
                                    options={options}
                                    onChange = {(e) =>this.handleSubMultiSelectChange(e)}
                                    placeholder = "Select combinations"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <div  style = {{textAlign:"center"}}>
                                    <CLabel >Select Charge Range</CLabel>
                                </div>
                                    <RangePicker  
                                    showTime 
                                    onChange={(date, dateString) => this.handleRangeDateChange(date, dateString)}
                                    />
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                    </div>
                </div>
            </div>
        );
    }
}