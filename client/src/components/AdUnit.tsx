import { useEffect } from 'react';

// Extend Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

const AdUnit = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const adClient=`${import.meta.env.VITE_AD_CLIENT}`
  const adSlot=`${import.meta.env.VITE_AD_SLOT}`

  return (
    <ins className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default AdUnit;