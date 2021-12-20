import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const axios = require('axios');
const Config = require('../Config');

const TheLayout = () => {

  if (localStorage.token) {
    axios.post(Config.ServerUri + '/get_token', {
      token: localStorage.getItem('token')
    })
      .then((res) => {
        if (res.data === undefined) {
          localStorage.removeItem('token');
          window.location.href = '/#/login';
        }
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = '/#/login';
      })
  } else {
    window.location.href = '/#/login';
  }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
