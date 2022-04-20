import React, { Component } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'


class Register extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      password2: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = () => {
    // const newUser = {
    //   username: this.state.newUser,
    //   email: this.state.email,
    //   password: this.state.password,
    //   password2: this.state.password2
    // }
  }
  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={this.onSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" name="username" onChange={this.onChange} value={this.state.username} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Email" autoComplete="email" name="email" onChange={this.onChange} value={this.state.email} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="new-password" name="password" onChange={this.onChange} value={this.state.password} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Repeat password" autoComplete="new-password" name="password2" onChange={this.onChange} value={this.state.password2} />
                    </CInputGroup>
                    <CButton color="success" type="submit" block>Create Account</CButton>
                  </CForm>
                </CCardBody>
                <CCardFooter className="p-4">
                  <CRow>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                    </CCol>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                    </CCol>
                  </CRow>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Register
