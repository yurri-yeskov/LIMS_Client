import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import { getCurrentLanugage, getCurrentSidebarShow, getLanguageData } from 'src/store/reducer'
//import CIcon from '@coreui/icons-react'

// sidebar nav config
import jwt_decode from 'jwt-decode'
import { setSidebarShow } from 'src/store/action'

const TheSidebar = () => {

  const [userRole, setUserRole] = useState([]);
  const [language_state, setChangedLanguageState] = useState({
    input_label: '',
    laboratory_label: '',
    analysis_label: '',
    stock_management_label: '',
    spare_parts_label: '',
    input_export_label: '',
    import_label: '',
    hs_label: '',
    geo_info_system_label: '',
    export_label: '',
    reports_label: '',
    excel_label: '',
    home_label: '',
  });
  const dispatch = useDispatch()
  const language = useSelector(state => getCurrentLanugage(state));
  const show = useSelector(state => getCurrentSidebarShow(state));
  const language_data = useSelector(state => getLanguageData(state));
  if (language_data.length > 0) {
    language_state.input_label = language_data.filter(item => item.label === 'input')[0][language]
    language_state.laboratory_label = language_data.filter(item => item.label === 'laboratory')[0][language]
    language_state.analysis_label = language_data.filter(item => item.label === 'analysis')[0][language]
    language_state.stock_management_label = language_data.filter(item => item.label === 'stock_management')[0][language]
    language_state.spare_parts_label = language_data.filter(item => item.label === 'spare_parts')[0][language]
    language_state.input_export_label = language_data.filter(item => item.label === 'import_export')[0][language]
    language_state.hs_label = language_data.filter(item => item.label === 'hs')[0][language]
    language_state.import_label = language_data.filter(item => item.label === 'import')[0][language]
    language_state.geo_info_system_label = language_data.filter(item => item.label === 'geo_info_system')[0][language]
    language_state.export_label = language_data.filter(item => item.label === 'export')[0][language]
    language_state.reports_label = language_data.filter(item => item.label === 'reports')[0][language]
    language_state.excel_label = language_data.filter(item => item.label === 'excel')[0][language]
    language_state.home_label = language_data.filter(item => item.label === 'home')[0][language]
  }
  var navigation = [];
  navigation.push({ _tag: 'CSidebarNavTitle', _children: [language_state.home_label], });

  if (userRole.indexOf("General Admin") !== -1) {
    navigation.push({
      _tag: 'CSidebarNavDropdown',
      name: language_state.input_label,
      route: '/input',
      icon: 'cil-pencil',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: language_state.laboratory_label,
          to: '/input/laboratory',
        },
      ],
    });
    navigation.push({
      _tag: 'CSidebarNavDropdown',
      name: language_state.analysis_label,
      route: '/analysis',
      icon: 'cil-zoom',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: language_state.laboratory_label,
          to: '/analysis/laboratory',
        },
      ],
    });
    navigation.push({
      _tag: 'CSidebarNavDropdown',
      name: language_state.stock_management_label,
      route: '/stock_management',
      icon: 'cil-basket',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: language_state.spare_parts_label,
          to: '/stock_management/spare_parts',
        },
      ],
    });
    navigation.push({
      _tag: 'CSidebarNavTitle',
      _children: [language_state.input_export_label],
    });
    navigation.push({
      _tag: 'CSidebarNavDropdown',
      name: language_state.import_label,
      route: '/import',
      icon: 'cil-arrow-circle-left',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: language_state.hs_label,
          to: '/import/hs',
        },
        {
          _tag: 'CSidebarNavItem',
          name: language_state.geo_info_system_label,
          to: '/import/geo_information',
        },
      ],
    });
    navigation.push({
      _tag: 'CSidebarNavDropdown',
      name: language_state.export_label,
      route: '/export',
      icon: 'cil-arrow-circle-right',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: language_state.hs_label,
          to: '/export/hs',
        },
        {
          _tag: 'CSidebarNavItem',
          name: language_state.geo_info_system_label,
          to: '/export/geo_information',
        },
        {
          _tag: 'CSidebarNavItem',
          name: language_state.reports_label,
          to: '/export/reports',
        },
        {
          _tag: 'CSidebarNavItem',
          name: language_state.excel_label,
          to: '/export/excel',
        },
      ],
    })
  }

  const userType = [];
  useEffect(() => {
    if (localStorage.token) {
      const token = localStorage.getItem('token');
      const decoded_token = jwt_decode(token);
      //
      if (decoded_token.userType === "General Admin") userType.push('General Admin');
      if (decoded_token.labInput === true) userType.push('labInput');
      if (decoded_token.labAnalysis === true) userType.push('labAnalysis');

      setUserRole(userType);
    }
  }, [])

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch(setSidebarShow(val))}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/*<CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />*/}
        <div
          className="c-sidebar-brand-full"
          height={35}
        >
          <img src="logo-full.png" height={24} alt="LOGO" />
        </div>
        <div
          className="c-sidebar-brand-minimized"
          height={35}
        >
          <img src="logo.png" height={24} alt="LOGO" />
        </div>
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      {/*<CSidebarMinimizer className="c-d-md-down-none"/>*/}
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
