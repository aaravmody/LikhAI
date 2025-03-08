import React from 'react'
import Spline from '@splinetool/react-spline';

function LandingPage() {
  return (
    <>
      <div>LandingPage</div>
      <div className="w-1/3 h-64"> 
        <Spline scene="https://prod.spline.design/ym1BJVuUk-zP9-eV/scene.splinecode" />
      </div>
      <div className="w-1/3 h-64"> 
      <Spline
        scene="https://prod.spline.design/cd2SpXDXmppIbrKL/scene.splinecode" 
      />
      </div>
    </>
  )
}

export default LandingPage