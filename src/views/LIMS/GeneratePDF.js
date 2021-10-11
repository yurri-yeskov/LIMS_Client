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
  var pdfcolumns = pdfdata.pdfcolumns.filter((v) => v.key);
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
      <div
        className="example-config"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 5px 5px 0",
        }}
      >
        <button className="button_style" onClick={exportPDFWithComponent}>
          Download PDF
        </button>
      </div>
      <div className="border rounded p-2">
        <PDFExport
          ref={pdfExportComponent}
          paperSize={"A4"}
          margin={{
            top: "0.5cm",
            left: "2.3cm",
            right: "2.3cm",
            bottom: "0.5cm",
          }}
          fileName={pdfdata.pdfdata.pdfname}
          author="GigaDev0"
        >
          <div ref={container}>
            <div
              id="pdfHeader"
              style={{
                marginBottom: "30px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={pdfdata.pdfdata.logo.substr(
                  pdfdata.pdfdata.logo.indexOf("public\\") + 6,
                  pdfdata.pdfdata.logo.length
                )}
                width="70px"
                height="70px"
              />
            </div>
            <div className="reactPdf">
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      textAlign: "left",
                      width: "60%",
                    }}
                  >
                    <p
                      style={{
                        // marginTop: "40px",
                        lineHeight: "5px",
                        transform: "scale(1,1)",
                      }}
                    >
                      {pdfdata.pdfdata.address.name}
                    </p>
                    <p
                      style={{
                        lineHeight: "5px",
                        transform: "scale(1,1)",
                      }}
                    >
                      {pdfdata.pdfdata.address.addressB}
                    </p>
                    <p
                      style={{
                        lineHeight: "5px",
                        transform: "scale(1,1)",
                      }}
                    >
                      {pdfdata.pdfdata.address.zipcodeB}
                      {pdfdata.pdfdata.address.cityB}
                    </p>
                    <p
                      style={{
                        lineHeight: "5px",
                        transform: "scale(1,1)",
                      }}
                    >
                      {pdfdata.pdfdata.address.address2B}
                    </p>
                    <p
                      style={{
                        lineHeight: "5px",
                        transform: "scale(1,1)",
                      }}
                    >
                      {pdfdata.pdfdata.address.country}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "20px 0 0 0",
                      transform: "scale(1,1)",
                    }}
                  >
                    {pdfdata.pdfdata.place}, {pdfdata.pdfdata.date}
                  </p>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(1.5,1.5)",
                      marginTop: "10px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      <u>{pdfdata.pdfdata.c_title}</u>
                    </p>
                  </div>
                  <div
                    style={{
                      transform: "scale(1.1,1.1)",
                      margin: "5px 0 0 0",
                    }}
                  >
                    {pdfdata.pdfdata.productName}
                  </div>
                  <table width="100%" className="test" height="70%">
                    {pdfdata.pdfdata.productData.map((v) => (
                      <tr>
                        <td
                          align="left"
                          style={{
                            transform: "scale(1,1)",
                            lineHeight: "5px",
                            width: "30%",
                          }}
                        >
                          <p>{v.name}</p>
                        </td>
                        <td
                          align="left"
                          style={{
                            transform: "scale(1,1)",
                            lineHeight: "5px",
                            width: "70%",
                          }}
                        >
                          <p>{v.value ? v.value : "Not yet configured"}</p>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                {pdfdata.pdfcolumns.length > 0 && (
                  <div className="ctable">
                    <CDataTable
                      items={pdfdata.pdfdata.history}
                      fields={pdfcolumns}
                      style={{ transform: "scale(1,1)", fontcolor: "black" }}
                    ></CDataTable>
                  </div>
                )}
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <table width="70%">
                  {txt.map((v) => (
                    <tr>
                      <td align="left" style={{ transform: "scale(1,1)" }}>
                        {v}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: "60px",
                }}
              >
                <img
                  src={pdfdata.pdfdata.footer.substr(
                    pdfdata.pdfdata.footer.indexOf("public\\") + 6,
                    pdfdata.pdfdata.footer.length
                  )}
                />
              </div>
            </div>
          </div>
        </PDFExport>
      </div>
    </div>
  );
};
export default Gpdf;
