import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CSelect,
  CBreadcrumbRouter,
  //  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import jwt_decode from 'jwt-decode'
// routes config
import routes from '../routes'
import { setLanguage, setSidebarShow, setLanguageData } from 'src/store/action'
const axios = require("axios");
const Config = require("../Config.js");
/*import { 
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
}  from './index'*/


const TheHeader = () => {
  const [userRole, setUserRole] = useState('');
  const [administration_label, setAdministrationLabel] = useState('');
  const [setting_label, setSettingLabel] = useState('');
  const [login_label, setLoginLabel] = useState('');
  const [help_label, setHelpLabel] = useState('');
  const [language_data, setLangugeData] = useState([]);

  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch(setSidebarShow(val))
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch(setSidebarShow(val))
  }

  const getLanguage = () => {
    axios.post(Config.ServerUri + '/get_language')
      .then((res) => {
        setLangugeData(res.data);
        dispatch(setLanguageData(res.data));
        setSettingLabel(res.data.filter(language => language.label === 'setting')[0]['English'])
        setAdministrationLabel(res.data.filter(language => language.label === 'administration')[0]['English'])
        setLoginLabel(res.data.filter(language => language.label === 'login')[0]['English'])
        setHelpLabel(res.data.filter(language => language.label === 'help')[0]['English'])
      })
      .catch((error) => {

      })
  }

  const handleInputChange = (e) => {
    let selected_language = e.target.value;
    dispatch(setLanguage(e.target.value));
    setSettingLabel(language_data.filter(language => language.label === 'setting')[0][selected_language])
    setAdministrationLabel(language_data.filter(language => language.label === 'administration')[0][selected_language])
    setLoginLabel(language_data.filter(language => language.label === 'login')[0][selected_language])
    setHelpLabel(language_data.filter(language => language.label === 'help')[0][selected_language])
  }

  useEffect(() => {
    if (localStorage.token) {
      const token = localStorage.getItem('token');
      const decoded_token = jwt_decode(token);
      const userType = decoded_token.userType;
      setUserRole(userType);
      getLanguage()
      // console.log('component')
    }

  }, [])

  const logOut = () => {
    localStorage.removeItem('token');
  }
  return (

    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="32" alt="Logo" />
      </CHeaderBrand>
      <CHeaderNav className="d-md-down-none mr-auto">
        {
          (userRole === 'admin' || userRole === 'General Admin') ? (
            <CHeaderNavItem className="px-3">
              <CHeaderNavLink to="/administration">{administration_label}</CHeaderNavLink>
            </CHeaderNavItem>
          ) : null
        }
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>{setting_label}</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/login"><span onClick={logOut}>{login_label}</span></CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>{help_label}</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <CSelect
          name="language"
          onChange={(e) => handleInputChange(e)}
        >
          <option value='English'>English</option>
          <option value='German'>German</option>
        </CSelect>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
