import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className='mfs-auto'>
        {/* <span className="mr-1 float-right"><img src="logo_stec_1.png" height={42} alt="LOGO" /></span> */}
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
