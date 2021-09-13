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

const axios = require('axios');
const Config = require('../../../Config');

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      username_error: '',
      password_error: '',
      usersData: []
    }
    this.getAllUsers = this.getAllUsers.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }
  componentDidMount() {
    this.getAllUsers();
  }
  getAllUsers = () => {
    axios.get(Config.ServerUri + '/get_all_users')
    .then((res) => {
      this.setState({
        usersData: res.data.users,
        userTypesData: res.data.userTypes,
      });
    })
    .catch((error) => {
      
    })
  }
  handleInputChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    if(name === "userName") {
      var found = true;
      for(var i in this.state.usersData) {
        var item = this.state.usersData[i];
        if(item.userName === value) {
          found = false;
          break;
        }        
      }
      if(found === true) {
        this.setState({ username_error: "User not found" });
      } else {
        this.setState({ username_error: '' });
      }
    } 
    if(name === "password") {
      found = true;
      for(i in this.state.usersData) {
        item = this.state.usersData[i];
        if(item.password === value) {
          found = false;
          break;
        }
      }
      if(found === true) {
        this.setState({ password_error: 'Incorrect password' });
      } else {
        this.setState({ password_error: ''});
      }
    }
    this.setState({
      [name]:value
    })

  }
  loginUser = (e) => {    
    e.preventDefault();
    axios.post(Config.ServerUri + '/login_user', {
      userName: this.state.userName,
      password: this.state.password
    })
    .then((res) => {   
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    })
    .catch(err => {
      console.error(err);
    })
  }  
  render() {
    const { username_error, password_error } = this.state;   
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
                        <CInput type="text" placeholder="Username" autoComplete="username" name="userName" onChange={this.handleInputChange} value={this.state.userName} required/>
                        {
                          username_error === undefined || username_error === '' ? <div></div> : 
                            <div style={{width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353'}}>{username_error}</div>
                        }
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="Password" autoComplete="current-password" name="password" onChange={this.handleInputChange} value={this.state.password} required/>
                        {
                          password_error === undefined || password_error === '' ? <div></div> : 
                            <div style={{width: '100%', marginTop: '0.25rem', fontSize: '80%', color: '#e55353'}}>{password_error}</div>
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
