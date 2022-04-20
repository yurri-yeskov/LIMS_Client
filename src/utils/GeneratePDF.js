import * as React from "react";
import "../views/LIMS/style.css";
import { PDFExport } from "@progress/kendo-react-pdf";
import { CDataTable } from "@coreui/react";

const Gpdf = ({ pdfdata, pdfcolumns }) => {

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
          fileName={pdfdata[0].filename}
          author="GigaDev0"
        >
          {
            pdfdata.map((data, index) => (
              <div ref={container} key={index}>
                <div className={`d-flex ${(data.header_styles.left === 0 && data.header_styles.top === 0) ? `justify-content-center` : ``} align-items-center mb-4`} id="pdfHeader">
                  {
                    (data.header_styles.width !== 0 || data.header_styles.height !== 0) ? (
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}uploads/certificates/${data.logo}`}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "image-not-found.png";
                        }}
                        style={{
                          marginTop: `${data.header_styles.top}cm`,
                          marginLeft: `${data.header_styles.left}cm`,
                          width: `${data.header_styles.width !== 0 ? data.header_styles.width + `cm` : `auto`}`,
                          height: `${data.header_styles.height !== 0 ? data.header_styles.height + `cm` : `auto`}`
                        }}
                        alt=""
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}uploads/certificates/${data.logo}`}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "image-not-found.png";
                        }}
                        alt=""
                      />
                    )
                  }
                </div>
                <div className="reactPdf">
                  <div className="d-flex">
                    <div className="w-50 pl-4">
                      <p className="transform-scale-1-1 mb-1 pl-4">
                        {data.address.name}&nbsp;
                      </p>
                      {data.address.addressB !== "" && (
                        <p className="transform-scale-1-1 mb-1 pl-4">
                          {data.address.addressB}&nbsp;
                        </p>
                      )}
                      {(data.address.zipcodeB !== "" || data.address.cityB !== "") && (
                        <p className="transform-scale-1-1 mb-1 pl-4">
                          {data.address.zipcodeB}&nbsp;
                          {data.address.cityB}&nbsp;
                        </p>
                      )}
                      {data.address.address2B !== "" && (
                        <p className="transform-scale-1-1 mb-1 pl-4">
                          {data.address.address2B}&nbsp;
                        </p>
                      )}
                      {data.address.country !== "" && (
                        <p className="transform-scale-1-1 mb-1 pl-4">
                          {data.address.country}&nbsp;
                        </p>
                      )}
                    </div>
                    <div className="d-flex justify-content-end w-50 pr-4">
                      <p className="transform-scale-1-1 mb-1 pr-4">
                        {data.place}, {data.date}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex flex-direction-column">
                      <div className="text-center mx-auto bold text-decoration-underline my-2" style={{ fontSize: '28px' }}>
                        {data.c_title}
                      </div>
                      <div className="text-center mx-auto my-2">
                        {data.productName}
                      </div>
                      <table width="100%" className="test px-4">
                        <tbody>
                          {data.productData.map((v, i) => (
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
                    {pdfcolumns[index].length > 0 && (
                      <div className="ctable certificate-doc">
                        <CDataTable
                          items={data.tableValues}
                          fields={pdfcolumns[index].map(col => {
                            return {
                              key: col.fieldname,
                              label: col.name
                            }
                          })}
                          style={{
                            transform: "scale(1,1)",
                            fontcolor: "black",
                            lineHeight: '1rem !important'
                          }}
                        ></CDataTable>
                      </div>
                    )}
                  </div>

                  <div className="d-flex">
                    <table width="100%">
                      <tbody>
                        {data.freetext.split("\n").map((v, i) => (
                          <tr key={i}>
                            <td align="left" style={{ lineHeight: '1rem !important' }}>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={`d-flex ${(data.footer_styles.left === 0 && data.footer_styles.bottom === 0) ? `justify-content-center` : ``} align-items-center mb-4`}>
                    {
                      (data.footer_styles.width !== 0 || data.footer_styles.height !== 0) ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}uploads/certificates/${data.footer}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "image-not-found.png";
                          }}
                          style={{
                            marginBottom: `${data.footer_styles.bottom}cm`,
                            marginLeft: `${data.footer_styles.left}cm`,
                            width: `${data.footer_styles.width !== 0 ? data.footer_styles.width + `cm` : 'auto'}`,
                            height: `${data.footer_styles.height !== 0 ? data.footer_styles.height + `cm` : 'auto'}`
                          }}
                          alt=""
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}uploads/certificates/${data.footer}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "image-not-found.png";
                          }}
                          alt=""
                        />
                      )
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </PDFExport>
      </div>
    </div>
  );
};
export default Gpdf;
