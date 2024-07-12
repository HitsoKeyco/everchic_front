import React from 'react'
import './css/BannerHome.css'
const BannerHome = () => {

    return (
        <div className="banner_home_container" style={{ width: '100%', height: 'auto', overflow: 'hidden' }}>
          <iframe
            className='banner_home_iframe'
            src={`/banner_home/Banner.html`}
            width="1250"
            height="160"
            style={{ border: 'none' }}
            title="Banner"
          ></iframe>
        </div>
      );
}

export default BannerHome