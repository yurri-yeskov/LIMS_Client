import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Table } from "antd";
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
const Gpdf = (pdfdata) => {
    var pdfcolumns = pdfdata.pdfcolumns.filter(v => v.key);
    var txt = pdfdata.pdfdata.freetext.split("\n");
    const container = React.useRef(null);
    const pdfExportComponent = React.useRef(null);
    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    return (
        <div>
            <div className="example-config" style={{ display: "flex", justifyContent: "flex-end", margin: "0 10px 10px 0" }}>
                <button className="button_style" onClick={exportPDFWithComponent}>
                    Export with component
                </button>
            </div>
            <div className="border rounded p-2">
                <PDFExport
                    ref={pdfExportComponent}
                    paperSize="auto"
                    margin={40}
                    fileName={pdfdata.pdfdata.pdfname}
                    author="KendoReact Team"
                >
                    <div ref={container}>
                        <div id="pdfHeader" style={{ marginBottom: "40px", padding: "20px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><img src={pdfdata.pdfdata.logo.substr(pdfdata.pdfdata.logo.indexOf("public\\") + 6, pdfdata.pdfdata.logo.length)} width="100px" height="100px" /></div>
                        <div className="reactPdf">
                            <div style={{ display: "flex", padding: "0 0 50px 0" }}>
                                <div style={{ marginBottom: "50px", display: "flex", width: "50%", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <p style={{ marginTop: "20px", fontStretch: "expanded", transform: "scale(5,5)" }}>Address</p>
                                    <p style={{
                                        margin: "20px",
                                        marginTop: "40px",
                                        lineHeight: "5px",
                                        transform: "scale(2,2)"
                                    }}>{pdfdata.pdfdata.address.name}</p>
                                    <p style={{
                                        margin: "20px",
                                        lineHeight: "5px",
                                        transform: "scale(2,2)"
                                    }}>{pdfdata.pdfdata.address.addressB}</p>
                                    <p style={{
                                        margin: "20px",
                                        lineHeight: "5px",
                                        transform: "scale(2,2)"
                                    }}>{pdfdata.pdfdata.address.zipcodeB}{pdfdata.pdfdata.address.cityB}</p>
                                    <p style={{
                                        margin: "20px",
                                        lineHeight: "5px",
                                        transform: "scale(2,2)"
                                    }}>{pdfdata.pdfdata.address.address2B}</p>
                                    <p style={{
                                        margin: "20px",
                                        lineHeight: "5px",
                                        transform: "scale(2,2)"
                                    }}>{pdfdata.pdfdata.address.country}</p>
                                </div>
                                <div style={{ display: "flex", width: "50%", flexDirection: "column", alignItems: "center" }}>
                                    <p style={{ margin: "20px 0 50px 0", fontStretch: "expanded", transform: "scale(3,3)" }}>{pdfdata.pdfdata.place}</p>
                                    <p style={{ fontStretch: "expanded", transform: "scale(3,3)" }}>{pdfdata.pdfdata.date}</p>
                                </div>
                            </div>
                            <div style={{

                                margin: "20px",
                                padding: "20px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                    <div style={{
                                        transform: "scale(5,5)"
                                    }}>{pdfdata.pdfdata.certificateName}</div>
                                    <div style={{
                                        transform: "scale(3,3)",
                                        margin: "50px 0 30px 0"
                                    }}>{pdfdata.pdfdata.productName}</div>
                                    <table width="100%" className="test">
                                        {pdfdata.pdfdata.productData.map(v => <tr>
                                            <td align="center" width="50%"><p style={{
                                                transform: "scale(2,2)"
                                            }}>{v.name}</p></td>
                                            <td align="center"><p style={{
                                                transform: "scale(2,2)"
                                            }}>{v.value ? v.value : "Not yet configured"}</p></td>
                                        </tr>)}
                                    </table>

                                </div>
                            </div>

                            <div style={{ marginBottom: "50px" }}>
                                {pdfdata.pdfcolumns.length > 0 &&
                                    <CDataTable
                                        items={pdfdata.pdfdata.history}
                                        fields={pdfcolumns}
                                    ></CDataTable>
                                }
                            </div>


                            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h5>
                                    <table>
                                        {
                                            txt.map(v => <tr><td align="center" style={{ transform: "scale(1.5,1.5)", lineHeight: "25px" }}>{v}</td></tr>)
                                        }
                                    </table>
                                </h5>
                            </div>
                            <div style={{ marginTop: "30px", width: "100%", display: "flex", justifyContent: "center" }}><img src={pdfdata.pdfdata.footer.substr(pdfdata.pdfdata.footer.indexOf("public\\") + 6, pdfdata.pdfdata.footer.length)} width="100px" height="100px" /></div>
                        </div>
                    </div>
                </PDFExport>
            </div>
        </div>
    );
};
export default Gpdf;