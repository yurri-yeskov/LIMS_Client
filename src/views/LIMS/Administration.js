import React, { Component } from "react";
import AdminUser from "./AdminUser";
import AdminObjective from "./AdminObjective";
import AdminPackingType from "./AdminPackingType";
import AdminCertificateType from "./AdminCertificateType";
import AdminAnalysisType from "./AdminAnalysisType";
import AdminSampleType from "./AdminSampleType";
import AdminUserType from "./AdminUserType";
import AdminMaterial from "./AdminMaterial.js";
import AdminUnit from "./AdminUnit";
import AdminClient from "./AdminClient";
import AdminReason from "./AdminReason";
import AdminCertificate from "./AdminCertificate";

import { Toaster } from "react-hot-toast";

import {
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CTabs,
} from "@coreui/react";

import "./style.css";

export default class Administration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_tab: 0,
      selected_language: '',
      language_data: [],
      user_label: '',
      user_types_label: '',
      sample_types_label: '',
      material_label: '',
      analysis_types_label: '',
      objectives_label: '',
      packing_types_label: '',
      certificate_types_label: '',
      unit_types: '',
      clients_label: '',
      reason_label: '',
      certificate_template_label: '',
    };
  }
  componentDidMount() {
    this.setState({
      selected_language: this.props.selected_language,
      user_label: this.props.language_data.filter(item => item.label === 'user')[0][this.props.selected_language],
      user_types_label: this.props.language_data.filter(item => item.label === 'user_types')[0][this.props.selected_language],
      sample_types_label: this.props.language_data.filter(item => item.label === 'sample_types')[0][this.props.selected_language],
      material_label: this.props.language_data.filter(item => item.label === 'material')[0][this.props.selected_language],
      analysis_types_label: this.props.language_data.filter(item => item.label === 'analysis_types')[0][this.props.selected_language],
      objectives_label: this.props.language_data.filter(item => item.label === 'objectives')[0][this.props.selected_language],
      packing_types_label: this.props.language_data.filter(item => item.label === 'packing_types')[0][this.props.selected_language],
      certificate_types_label: this.props.language_data.filter(item => item.label === 'certificate_types')[0][this.props.selected_language],
      unit_types: this.props.language_data.filter(item => item.label === 'unit_types')[0][this.props.selected_language],
      clients_label: this.props.language_data.filter(item => item.label === 'clients')[0][this.props.selected_language],
      reason_label: this.props.language_data.filter(item => item.label === 'reason')[0][this.props.selected_language],
      certificate_template_label: this.props.language_data.filter(item => item.label === 'certificate_template')[0][this.props.selected_language],
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_language !== this.props.selected_language) {
      this.setState({
        selected_language: nextProps.selected_language,
        user_label: nextProps.language_data.filter(item => item.label === 'user')[0][nextProps.selected_language],
        user_types_label: nextProps.language_data.filter(item => item.label === 'user_types')[0][nextProps.selected_language],
        sample_types_label: nextProps.language_data.filter(item => item.label === 'sample_types')[0][nextProps.selected_language],
        material_label: nextProps.language_data.filter(item => item.label === 'material')[0][nextProps.selected_language],
        analysis_types_label: nextProps.language_data.filter(item => item.label === 'analysis_types')[0][nextProps.selected_language],
        objectives_label: nextProps.language_data.filter(item => item.label === 'objectives')[0][nextProps.selected_language],
        packing_types_label: nextProps.language_data.filter(item => item.label === 'packing_types')[0][nextProps.selected_language],
        certificate_types_label: nextProps.language_data.filter(item => item.label === 'certificate_types')[0][nextProps.selected_language],
        unit_types: nextProps.language_data.filter(item => item.label === 'unit_types')[0][nextProps.selected_language],
        clients_label: nextProps.language_data.filter(item => item.label === 'clients')[0][nextProps.selected_language],
        reason_label: nextProps.language_data.filter(item => item.label === 'reason')[0][nextProps.selected_language],
        certificate_template_label: nextProps.language_data.filter(item => item.label === 'certificate_template')[0][nextProps.selected_language],
      })
    }
  }
  on_tab_clicked(e, tab) {
    e.preventDefault();
    this.setState({
      current_tab: tab,
    });
  }

  render() {
    return (
      <CRow>
        <CCol xs="12" md="12">
          <CCard>
            <CCardBody>
              <CTabs>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 0)}>
                      {this.state.user_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 1)}>
                      {this.state.user_types_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 2)}>
                      {this.state.sample_types_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 3)}>
                      {this.state.material_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 4)}>
                      {this.state.analysis_types_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 5)}>
                      {this.state.objectives_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 6)}>
                      {this.state.packing_types_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 7)}>
                      {this.state.certificate_types_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 8)}>
                      {this.state.unit_types}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 9)}>
                      {this.state.clients_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 10)}>
                      {this.state.reason_label}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink onClick={(e) => this.on_tab_clicked(e, 11)}>
                      {this.state.certificate_template_label}
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane>
                    {this.state.current_tab !== 0 ? <div /> : <AdminUser selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 1 ? <div /> : <AdminUserType selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 2 ? (
                      <div />
                    ) : (
                      <AdminSampleType selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />
                    )}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 3 ? <div /> : <AdminMaterial selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 4 ? (
                      <div />
                    ) : (
                      <AdminAnalysisType selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />
                    )}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 5 ? (
                      <div />
                    ) : (
                      <AdminObjective selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />
                    )}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 6 ? (
                      <div />
                    ) : (
                      <AdminPackingType selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />
                    )}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 7 ? (
                      <div />
                    ) : (
                      <AdminCertificateType selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />
                    )}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 8 ? <div /> : <AdminUnit selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 9 ? <div /> : <AdminClient selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 10 ? <div /> : <AdminReason selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                  <CTabPane>
                    {this.state.current_tab !== 11 ? <div /> : <AdminCertificate selected_language={this.state.selected_language === '' ? this.props.selected_language : this.state.selected_language} language_data={this.props.language_data} />}
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol>
        <Toaster position="top-right" reverseOrder={true} />
      </CRow>
    );
  }
}

