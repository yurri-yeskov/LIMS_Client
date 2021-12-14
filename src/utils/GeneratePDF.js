import * as React from "react";
import "../views/LIMS/style.css";
import { PDFExport } from "@progress/kendo-react-pdf";
import { CDataTable } from "@coreui/react";

const Gpdf = (pdfdata) => {
  var pdfcolumns = pdfdata.pdfcolumns.map(col => {
    return {
      key: col.fieldname,
      label: col.name
    }
  })
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
      <div className="example-config text-right py-2">
        <button className="button_style" onClick={exportPDFWithComponent}>
          Download PDF
        </button>
      </div>
      <div className="border rounded p-4">
        <PDFExport
          ref={pdfExportComponent}
          paperSize={"A4"}
          margin={{
            top: "0.5cm",
            left: "2.3cm",
            right: "2.3cm",
            bottom: "0.5cm",
          }}
          fileName={pdfdata.pdfdata.filename}
          author="GigaDev0"
        >
          <div ref={container}>
            <div className="d-flex justify-content-center align-items-center mb-4" id="pdfHeader">
              <img src={`/uploads/certificates/${pdfdata.pdfdata.logo}`} width="70px" height="70px" />
            </div>
            <div className="reactPdf">
              <div className="d-flex">
                <div className="w-50 pl-4">
                  <p className="transform-scale-1-1 mb-1 pl-4">
                    {pdfdata.pdfdata.address.name}&nbsp;
                  </p>
                  <p className="transform-scale-1-1 mb-1 pl-4">
                    {pdfdata.pdfdata.address.addressB}&nbsp;
                  </p>
                  <p className="transform-scale-1-1 mb-1 pl-4">
                    {pdfdata.pdfdata.address.zipcodeB}&nbsp;
                    {pdfdata.pdfdata.address.cityB}&nbsp;
                  </p>
                  <p className="transform-scale-1-1 mb-1 pl-4">
                    {pdfdata.pdfdata.address.address2B}&nbsp;
                  </p>
                  <p className="transform-scale-1-1 mb-1 pl-4">
                    {pdfdata.pdfdata.address.country}&nbsp;
                  </p>
                </div>
                <div className="d-flex justify-content-end w-50 pr-4">
                  <p className="transform-scale-1-1 mb-1 pr-4">
                    {pdfdata.pdfdata.place}, {pdfdata.pdfdata.date}
                  </p>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-center align-items-center flex-direction-column">
                  <p className="w-100 text-center bold text-decoration-underline my-2" style={{ fontSize: '28px' }}>
                    {pdfdata.pdfdata.c_title}
                  </p>
                  <p className="w-100 text-center my-2">
                    {pdfdata.pdfdata.productName}
                  </p>
                  <table width="100%" className="test px-4">
                    <tbody>
                      {pdfdata.pdfdata.productData.map((v, i) => (
                        <tr key={i}>
                          <td align="left" className="transform-scale-1-1">{v.name}</td>
                          <td align="left" className="transform-scale-1-1">
                            {v.value ? v.value : "Not yet configured"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mb-3">
                {pdfdata.pdfcolumns.length > 0 && (
                  <div className="ctable">
                    <CDataTable
                      items={pdfdata.pdfdata.tableValues}
                      fields={pdfcolumns}
                      style={{ transform: "scale(1,1)", fontcolor: "black" }}
                    ></CDataTable>
                  </div>
                )}
              </div>

              <div className="d-flex">
                <table width="70%">
                  <tbody>
                    {txt.map((v, i) => (
                      <tr key={i}>
                        <td align="left" className="transform-scale-1-1">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center my-2">
                <img src={`/uploads/certificates/${pdfdata.pdfdata.footer}`} width="70px" height="70px" />
              </div>
            </div>
          </div>
        </PDFExport>
      </div>
    </div>
  );
};
export default Gpdf;
