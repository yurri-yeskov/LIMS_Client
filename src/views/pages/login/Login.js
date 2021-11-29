import React, { Component } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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

import axios from 'axios';
import Config from '../../../Config';
import setAuthToken from '../../../utils/setAuthToken';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      usersData: [],
      errors: {}
    }
    this.loginUser = this.loginUser.bind(this);
  }

  componentDidMount() {
    localStorage.removeItem('jwt')
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  loginUser = (e) => {
    e.preventDefault();
    axios.post(Config.ServerUri + '/login_user', {
      userName: this.state.userName,
      password: this.state.password
    })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          setAuthToken(res.data.token);
          window.location.href = '/';
        }
      })
      .catch(err => {
        this.setState({ errors: err.response.data })
      })
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="4">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.loginUser}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="Username" autoComplete="username" name="userName" onChange={this.handleInputChange} value={this.state.userName} required />
                        {
                          errors.userName && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353' }}>{errors.userName}</div>
                        }
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="Password" autoComplete="current-password" name="password" onChange={this.handleInputChange} value={this.state.password} required />
                        {
                          errors.password && <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353' }}>{errors.password}</div>
                        }
                      </CInputGroup>
                      <CRow>
                        <CCol xs="11">
                          <CButton type="submit" className="btn btn-primary mb-3" >Login</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Login
