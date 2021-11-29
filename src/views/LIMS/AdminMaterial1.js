import { useEffect, useRef, useState } from "react"
import axios from "axios";
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
  CRow,
  CCol,
} from "@coreui/react";
import Select from "react-select";
// import { toast } from "react-hot-toast";
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

const AdminMaterial1 = ({ selected_language, language_data }) => {

    const import_label = language_data.filter(item => item.label === 'import')[0][selected_language]
    const export_label = language_data.filter(item => item.label === 'export')[0][selected_language]
    const create_new_label = language_data.filter(item => item.label === 'create_new')[0][selected_language]

    const fields = [
        { key: 'material_id', label: language_data.filter(item => item.label === 'material_id')[0][selected_language] },
        { key: 'material', _style: { width: '25%' }, label: language_data.filter(item => item.label === 'material')[0][selected_language] },
        { key: 'objectives', sorter: false, label: language_data.filter(item => item.label === 'analysistype_objectives')[0][selected_language] },
        { key: 'remark', sorter: false, label: language_data.filter(item => item.label === 'remark')[0][selected_language] },
        { key: 'buttonGroups', label: '', _style: { width: '84px' } }
    ];
    const header = [
        { key: 'material_id', label: language_data.filter(item => item.label === 'material_id')[0][selected_language] },
        { key: 'material', label: language_data.filter(item => item.label === 'material')[0][selected_language] },
        { key: 'client', label: language_data.filter(item => item.label === 'clients')[0][selected_language] },
        { key: 'combination', label: language_data.filter(item => item.label === 'analysistype_objectives')[0][selected_language] },
        { key: 'remark', label: language_data.filter(item => item.label === 'remark')[0][selected_language] },
    ];

    const data = {
        current_id: '',
        material_id: '',
        material: '',
        remark: ''
    }

    const csvLink = useRef()

    const [errors, setErrors] = useState('')
    const [pending, setPending] = useState(false)
    const [modalData, setModalData] = useState(data)
    const [show_create_modal, setShowCreateModal] = useState(false)
    const [show_delete_modal, setShowDeleteModal] = useState(false)
    const [_clients, set_Clients] = useState([])
    const [clients, setClients] = useState([])
    const [excelData, setExportData] = useState([])
    const [materialsData, setMaterialData] = useState([])
    const [objectivesData, setObjectivesData] = useState([])
    const [clientsData, setClientsData] = useState([])
    const [objectives, setObjectives] = useState([])
    const [unitsData, setUnitsData] = useState([])
    const [objectiveValues, setObjectiveValues] = useState([])
    const [filteredObjectives, setFilteredObjectives] = useState([])
    const [analysisData, setAnalysisData] = useState([])
    const [analysisTypes, setAnalysisTypes] = useState([])
    const [objOptions, setObjOptions] = useState([])
    const [clientOptions, setClientOptions] = useState([])
    const [clientObjs, setClientObjs] = useState([{ label: "Default", value: "" }])

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + "materials")
        .then(res => {
            console.log(res.data)
            setMaterialData(res.data.materials)
            setObjectivesData(res.data.objectives)
            setUnitsData(res.data.units)
            setClientsData(res.data.clients)
            setAnalysisData(res.data.analysisTypes)
            setObjOptions(res.data.obj_units)
            const data = res.data.clients.map(client => {
                return {
                    label: client.name,
                    value: client._id
                }
            })
            setClientOptions(data)

            setModalData({...modalData, material_id: res.data.materials.length + 1})

            let material_list = [];
            let client_list = 'Default\n';
            let combination_list = '';
            Object.keys(res.data.materials).length > 0 && res.data.materials.map((material) => {
                combination_list += getTooltip(material, '') + '\n';
                material.clients.map((client) => {
                    client_list += client.name + '\n';
                    combination_list += getTooltip(material, client._id) + '\n';
                });
                material_list.push({ 'material_id': material.material_id, "material": material.material, "client": client_list, "combination": combination_list, "remark": material.remark })
            });
            setExportData(material_list)
            setPending(true)
        })

    }, [])

    useEffect(() => {
        if(Object.keys(_clients).length > 0) {
            const data = _clients.map(_client => {
                return {
                    label: _client.label, 
                    value: _client.value
                }
            })
            setClientObjs([...clientObjs, data])
        }
    }, [_clients, clientObjs])

    const handleMultiSelectChange_Client = (e) => {
        const data = e.map((item) => { return item.value });
        
        set_Clients(e)
        // setClients(clients)
    }

    const handleFiles = () => {

    }

    const on_export_clicked = () => {

    }

    const on_create_clicked = () => {
        const initialData = {
            current_id: '',
            material_id: materialsData.length + 1,
            material: '',
            remark: ''
        }
        // setModalData(initialData)
        // setObjectives([])
        // setObjectiveValues([])
        // setClients([])
        // set_Clients([])
        // setErrors({})
        // setFilteredObjectives([])
        // setAnalysisTypes([])
        setShowCreateModal(true)
    }

    const on_update_clicked = () => {

    }

    const on_delete_clicked = () => {

    }

    const getClientName = (param) => {

    }

    const getTooltip = (item, client) => {
        let count = 0;
        let ret = "";
        item.objectiveValues.map((item0) => {
            if (item0.client !== client) return false;
            let name = getObjectiveName(item0.id);
            let unit = getUnitName(item0.unit);
            let analysis = getAnalysisName(item0.analysis);
            if (name !== "" && unit !== "") {
                ret =
                ret +
                analysis +
                "-" +
                name +
                " " +
                unit +
                ": " +
                "[" +
                item0.min +
                "-" +
                item0.max +
                "]" +
                ", ";
                count++;
            }

            return true;
        });

        return count === 0 ? "No Objectives" : ret;
    }

    const getObjectiveName = (id) => {
        let objectives = objectivesData;
        for (let i = 0; i < objectives.length; i++) {
            if (objectives[i]._id === id) return objectives[i].objective;
        }
        return "";
    }

    const getUnitName = (id) => {
        let units = unitsData;
        for (let i = 0; i < units.length; i++) {
            if (units[i]._id === id) return units[i].unit;
        }
        return "";
    }

    const getAnalysisName = (id) => {
        let analysis = analysisData;
        for (let i = 0; i < analysis.length; i++) {
            if (analysis[i]._id === id) return analysis[i].analysisType;
        }
        return "";
    }

    const deleteMaterial = () => {

    }

    const createMaterial = () => {

    }

    const updateMaterial = () => {
        
    }

    const handleMultiSelectChange_Obj = () => {

    }

    const handleObjectiveInputChange = (e, client, obj, type, typeIdx) => {
        let atData = analysisTypes

        atData[typeIdx][e.target.name] = e.target.value;
        setAnalysisTypes(atData)
    }

    const handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name === "material") {
            let found = false;
            for (let i in materialsData) {
                let item = materialsData[i];
                if (item.material === value && item._id !== modalData.current_id) {
                    found = true;
                    break;
                }
            }
            found === true ? setErrors("Value already exists") : setErrors("")

            setModalData({ [name]: value });
        }
    }

    const getObjectiveValue = (id /*objective id*/, unit /*unit id*/, client, analysis) => {
        let values = objectiveValues;
        let retVal;
        if (analysis === undefined) {
        retVal = {
            id: id,
            unit: unit,
            client: client,
            analysis: "",
            min: 0,
            max: 0,
        };
        } else {
        retVal = {
            id: id,
            unit: unit,
            client: client,
            analysis: analysis,
            min: 0,
            max: 0,
        };
        }

        for (let i = 0; i < values.length; i++) {
        if (
            values[i].id === id &&
            values[i].unit === unit &&
            values[i].client === client &&
            values[i].analysis === analysis
        ) {
            retVal = values[i];
            break;
        }
        }

        return retVal;
    }

    const handleMultiSelectChange_A_Types = (e, obj, client) => {
        let analysisTypes = [];
        let objectiveValues = [];

        analysisTypes.map((item) => {
        if (item.obj !== obj || item.client !== client) {
            analysisTypes.push(item);
        }
        return true;
        });

        objectiveValues.map((item) => {
        if (item !== undefined) {
            let unit = item.id + "-" + item.unit;
            if (item.client !== client || unit !== obj) {
            objectiveValues.push(item);
            }
            return true;
        }
        });

        e.map((item) => {
        let ids = obj.split("-");
        objectiveValues.push(
            getObjectiveValue(ids[0], ids[1], client, item.value)
        );
        analysisTypes.push({
            label: item.label,
            value: item.value,
            obj: obj,
            client: client,
            min: 0,
            max: 0,
        });
        return true;
        });
        setAnalysisTypes(analysisTypes)
        setObjectiveValues(objectiveValues)
    }


    const renderObjectives = (client, objs, options, clientIndex) => {
        let analysisOptions = [];
        analysisData?.map((item) => {
            objs.map((temp) => {
                item.objectives.map((item0) => {
                    if (temp.value === item0.id + "-" + item0.unit) {
                        analysisOptions.push({
                            label: item.analysisType,
                            value: item._id,
                            client: client.value,
                            objective: item0.id + "-" + item0.unit,
                        });
                    }
                });
            });

            return true;
        });

        return (
        <CFormGroup key={clientIndex}>
            <CRow>
                <CCol md="2" style={{ fontWeight: "500" }}>
                    {"Objectives - " + client.label}
                </CCol>
                <CCol md="10">
                    <CFormGroup>
                    <CRow>
                        <CCol>
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
                                options={options}
                                onChange={(e) => handleMultiSelectChange_Obj(e, client.value)}
                                value={objs}
                            />
                        </CCol>
                    </CRow>
                    </CFormGroup>
                    {filteredObjectives.length > 0 && filteredObjectives.map((obj, objIdx) => {
                    let _analyisTypes = [];
                    let label = "";
                    let _analysisOptions = [];
                    /**
                     *  ....very important.....
                     */
                    if (obj.client !== client.value) return false;

                    analysisTypes.map((type) => {
                        if (type.obj === obj.value && type.client === client.value) {
                        if (_analyisTypes.length === 0) {
                            _analyisTypes.push({
                            label: type.label,
                            value: type.value,
                            });
                        } else {
                            _analyisTypes.map((temp) => {
                            if (
                                temp.label !== type.label &&
                                temp.value !== type.value
                            ) {
                                _analyisTypes.push({
                                label: type.label,
                                value: type.value,
                                });
                            }
                            });
                        }
                        }

                        return true;
                    });

                    _analyisTypes = Array.from(
                        _analyisTypes
                        .reduce(
                            (a, o) => a.set(`${o.value}-${o.client}-${o.obj}`, o),
                            new Map()
                        )
                        .values()
                    );

                    analysisOptions.map((item) => {
                        if (item.objective === obj.value) {
                        _analysisOptions.push(item);
                        }

                        return true;
                    });

                    label = obj.label;
                    if (label !== "") {
                        return renderATypes(
                            client,
                            obj,
                            objIdx,
                            _analysisOptions,
                            _analyisTypes
                        );
                    }
                    return true;
                    })}
                </CCol>
            </CRow>
        </CFormGroup>
        );
    }

    const renderATypes = (client, obj, objIdx, aOptions, aTypes) => {
        return (
        <CFormGroup key={objIdx}>
            <CRow>
            <CCol md="5" style={{ fontWeight: "500" }}>
                {"Analysis Types - " + obj.label}
            </CCol>
            <CCol md="7">
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
                options={aOptions}
                onChange={(e) =>
                    handleMultiSelectChange_A_Types(e, obj.value, client.value)
                }
                value={aTypes}
                />
            </CCol>
            </CRow>
            {analysisTypes.map((type, typeIdx) => {
            let label = type.label;

            let objValue = {
                min: type.min,
                max: type.max,
            };

            if (type.obj !== obj.value) return true;
            if (type.client !== client.value) return true;

            return renderminMaxValues(
                client,
                obj,
                type,
                typeIdx,
                label,
                objValue
            );
            })}
        </CFormGroup>
        );
    }

    const renderminMaxValues = (client, obj, type, typeIdx, typeLabel, objValue) => {
        return (
        <CFormGroup key={typeIdx}>
            <CRow style={{ marginTop: "13px" }}>
            <CCol md="2"></CCol>
            <CCol md="3">{typeLabel}</CCol>
            <CCol md="2">Min Value</CCol>
            <CCol md="1">
                {/* <CInput pattern="[+-]?\d+(?:[.]\d+)?" name="min" value={objValue.min} onChange={(e) => handleObjectiveInputChange(e, client, obj, type, typeIdx)} /> */}
                <input
                type="number"
                name="min"
                style={{
                    width: "50px",
                    height: "30px",
                    borderColor: "lightseagreen",
                    borderRadius: "5px",
                }}
                value={objValue.min}
                onChange={(e) =>
                    handleObjectiveInputChange(e, client, obj, type, typeIdx)
                }
                />
            </CCol>
            <CCol md="2">Max Value</CCol>
            <CCol md="1">
                {/* <CInput pattern="[+-]?\d+(?:[.]\d+)?" name="max" value={objValue.max} onChange={(e) => handleObjectiveInputChange(e, client, obj, type, typeIdx)} /> */}
                <input
                type="number"
                name="max"
                style={{
                    width: "50px",
                    height: "30px",
                    borderColor: "lightseagreen",
                    borderRadius: "5px",
                }}
                value={objValue.max}
                onChange={(e) =>
                    handleObjectiveInputChange(e, client, obj, type, typeIdx)
                }
                />
            </CCol>
            </CRow>
            <CRow style={{ marginLeft: "16%", paddingLeft: "15px" }}>
            {/* {
            error === undefined || error === '' ? <div></div> : 
            <div style={{width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353'}}>Min value must be equal or less than Max Value</div>
        } */}
            </CRow>
        </CFormGroup>
        );
    }

    const renderModalCreate = () => {
        let error = errors;
        let fileteredObj = []
        if(Object.keys(objectives).length > 0) {
            fileteredObj = Array.from(
                objectives.reduce((a, o) => a.set(`${o.value}-${o.client}`, o), new Map()).values()
            );
        }
        console.log(">>>", modalData)
        console.log(fileteredObj)
        // setFilteredObjectives(fileteredObj)

        return (
            <CCard>
                <CCardBody>
                    <CForm
                    className="was-validated"
                    onSubmit={ modalData.current_id === '' ? createMaterial : updateMaterial }>
                    <CFormGroup>
                        <CLabel style={{ fontWeight: '500' }}>Material ID</CLabel>
                        <CInput name="material_id" value={modalData.material_id} onChange={(e) => setModalData({...modalData, material_id: e.target.value})} required />
                        {
                            errors.material_id && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353' }}>{error}</div>
                        }
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel style={{ fontWeight: "500" }}>Material</CLabel>
                        <CInput name="material" value={modalData.material} onChange={(e) => setModalData({...modalData, material: e.target.value})} required/>
                        {errors.errors && (
                            <div className="w-100" style={{ marginTop: "0.25rem", fontSize: "80%", color: "#e55353" }}>
                                {error}
                            </div>
                        )}
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel style={{ fontWeight: "500" }}>Clients</CLabel>
                        <Select
                            isMulti
                            placeholder=""
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(46, 184, 92, 0.25)" : 0,
                                    borderColor: "#2eb85c",
                                    "&:hover": {
                                        borderColor: "#2eb85c",
                                    },
                                }),
                            }}
                            options={clientOptions}
                            onChange={(e) => handleMultiSelectChange_Client(e)}
                            value={_clients}
                        />
                    </CFormGroup>
                    {Object.keys(clientObjs).length > 0 && clientObjs.map((item, index) => {
                        let _objectives = [];
                        Object.keys(filteredObjectives).length > 0 && filteredObjectives.map((item0) => {
                            if (item0.client === item.value) {
                                if (_objectives.length === 0) {
                                    _objectives.push({
                                        label: item0.label,
                                        value: item0.value,
                                    });
                                } else {
                                    for (let i = 0; i < _objectives.length; i++) {
                                        if (_objectives[i].value !== item0.value) {
                                            _objectives.push({
                                                label: item0.label,
                                                value: item0.value,
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                            return true;
                        });
                        return renderObjectives(
                            item,
                            _objectives,
                            objOptions,
                            index
                        );
                    })}
                    <CFormGroup>
                        <CLabel style={{ fontWeight: "500" }}>Remark</CLabel>
                        <CInput
                        name="remark"
                        value={modalData.remark}
                        onChange={handleInputChange}
                        />
                    </CFormGroup>
                    <div className="float-right">
                        <CButton type="submit" color="info">
                        {modalData.current_id === '' ? "Create" : "Update"}
                        </CButton>
                        <span style={{ padding: "4px" }} />
                        <CButton
                        color="secondary"
                        onClick={(e) => setShowCreateModal(false)}
                        >
                        Cancel
                        </CButton>
                    </div>
                    </CForm>
                </CCardBody>
            </CCard>
        );
    }

    return (
      <div>
        <div>
          <CButton color="info" className="float-right" style={{ margin: "0px 0px 0px 16px" }} onClick={on_create_clicked}>
              <i className="fa fa-plus" />&nbsp;{create_new_label}
          </CButton>
          <CButton  color="info" className="float-right" style={{ margin: "0px 0px 0px 16px" }} onClick={on_export_clicked}>
            <i className="fa fa-download"></i>&nbsp;{export_label}
          </CButton>
          <CSVLink headers={header} filename="Export-Material.csv" data={excelData} ref={csvLink}></CSVLink>
          <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
            <CButton color="info" className="float-right" style={{ margin: '0px 0px 0px 16px' }}>
                <i className="fa fa-upload" />&nbsp;{import_label}
            </CButton>
          </ReactFileReader>
        </div>
        <div>
          <CDataTable
            items={materialsData}
            fields={fields}
            itemsPerPage={50}
            itemsPerPageSelect
            sorter
            //tableFilter
            pagination
            hover
            clickableRows
            scopedSlots={{
              material: (item) => {
                let clientObjs = []; // clients including default client
                clientObjs.push({ label: "Default", value: "" });
                item.clients.map((item0) => {
                  let label = getClientName(item0);
                  if (label !== "")
                    clientObjs.push({ label: label, value: item0 });
                  return true;
                });

                return (
                  <td>
                    {clientObjs.map((client, index) => {
                      return (
                        <div
                          style={{
                            marginLeft: client.value === "" ? "0px" : "0.6em",
                          }}
                        >
                          {item.material + " - " + client.label}
                        </div>
                      );
                    })}
                  </td>
                );
              },
              buttonGroups: (item, index) => {
                return (
                  <td>
                    <div style={{ display: "flex" }}>
                      <CButton color="info" size="sm" onClick={() => on_update_clicked(item)}>
                        <i className="fa fa-edit" />
                      </CButton>
                      <span style={{ padding: "4px" }} />
                      <CButton color="danger" size="sm" onClick={() => on_delete_clicked(item._id)}>
                        <i className="fa fa-trash" />
                      </CButton>
                    </div>
                  </td>
                );
              },
              objectives: (item, index) => {
                let clientObjs = []; // clients including default client
                clientObjs.push({ label: "Default", value: "" });
                item.clients.map((item0) => {
                  let label = getClientName(item0);
                  if (label !== "")
                    clientObjs.push({ label: label, value: item0 });
                  return true;
                });
                return (
                  <td>
                    {clientObjs.map((client, index) => {
                      let tooltip = getTooltip(item, client.value);
                      return <div>{tooltip}</div>;
                    })}
                  </td>
                );
              },
            }}
          />
        </div>

        <CModal style={{ width: "50vw" }} show={show_delete_modal} onClose={() => setShowDeleteModal(true)}>
          <CModalHeader>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Do you really want to delete current material?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => deleteMaterial()}>
              Delete
            </CButton>{" "}
            <CButton
              color="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>

        {
            show_create_modal && (
                <CModal
                    style={{ width: "50vw" }}
                    show={show_create_modal}
                    onClose={() => setShowCreateModal(true)}
                    closeOnBackdrop={false}
                    centered
                    size="lg"
                >
                    <CModalHeader>
                        <CModalTitle>{modalData.current_id === '' ? "Create New Material" : "Update Material"}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>{renderModalCreate()}</CModalBody>
                </CModal>
            )
        }
      </div>
    )
}


export default AdminMaterial1