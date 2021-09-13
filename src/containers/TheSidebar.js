import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  //CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

//import CIcon from '@coreui/icons-react'

// sidebar nav config
import jwt_decode from 'jwt-decode'

const TheSidebar = () => {

const [userRole, setUserRole] = useState([]);

var navigation = [];
navigation.push({_tag: 'CSidebarNavTitle', _children: ['Home'], });

if(userRole.indexOf("General Admin") !== -1) 
{
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Input',
    route: '/input',
    icon: 'cil-pencil',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Laboratory',
        to: '/input/laboratory',
      },
    ],
  });
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Analysis',
    route: '/analysis',
    icon: 'cil-zoom',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Laboratory',
        to: '/analysis/laboratory',
      },
    ],
  });
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Stock Management',
    route: '/stock_management',
    icon: 'cil-basket',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Spare Parts',
        to: '/stock_management/spare_parts',
      },
    ],
  });
  navigation.push({
    _tag: 'CSidebarNavTitle',
    _children: ['Import/Export'],
  });
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Import',
    route: '/import',
    icon: 'cil-arrow-circle-left',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'HS',
        to: '/import/hs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Geo-Information System',
        to: '/import/geo_information',
      },
    ],
  }) ;
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Export',
    route: '/export',
    icon: 'cil-arrow-circle-right',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'HS',
        to: '/export/hs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Geo-Information System',
        to: '/export/geo_information',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Reports',
        to: '/export/reports',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Excel',
        to: '/export/excel',
      },
    ],
  })
}
if(userRole.indexOf('labInput') !== -1) {  
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Input',
    route: '/input',
    icon: 'cil-pencil',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Laboratory',
        to: '/input/laboratory',
      },
    ],
  })
}
if(userRole.indexOf('labAnalysis') !== -1) {
  navigation.push({
    _tag: 'CSidebarNavDropdown',
    name: 'Analysis',
    route: '/analysis',
    icon: 'cil-zoom',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Laboratory',
        to: '/analysis/laboratory',
      },
    ],
  })
}
 if(userRole.indexOf('labInput') !== -1 || userRole.indexOf('labAnalysis') !== -1) {
   navigation.push({
     _tag: 'CSidebarNavDropdown',
     name: 'Input',
     route: '/input',
     icon: 'cil-pencil',
     _children: [
       {
         _tag: 'CSidebarNavItem',
         name: 'Laboratory',
         to: '/input/laboratory',
       },
     ],
     _tag: 'CSidebarNavDropdown',
     name: 'Analysis',
     route: '/analysis',
     icon: 'cil-zoom',
     _children: [
       {
         _tag: 'CSidebarNavItem',
         name: 'Laboratory',
         to: '/analysis/laboratory',
       },
     ],
   })
 }

 

  const dispatch = useDispatch()  
  
  const show = useSelector(state => state.sidebarShow)
  const userType = [];
  useEffect(() => {
    if(localStorage.token) {
      const token = localStorage.getItem('token');
      const decoded_token = jwt_decode(token);
      //
      if(decoded_token.userType === "General Admin") userType.push('General Admin');      
      if(decoded_token.labInput === true) userType.push('labInput');
      if(decoded_token.labAnalysis === true) userType.push('labAnalysis');

      setUserRole(userType);
    }
  }, [])

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
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
          <img src="logo-full.png" height={24} alt="LOGO"/>
        </div>
        <div
          className="c-sidebar-brand-minimized"
          height={35}
        >
          <img src="logo.png" height={24} alt="LOGO"/>
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
