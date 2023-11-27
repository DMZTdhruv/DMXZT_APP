import React, { useEffect, useState } from "react"

const ImageComponent = ({ lowImageQuality, HighQualityImage, className, defaultLoad }) => {
  const [highQualityImageLoader, setHighQualityImageLoader] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setHighQualityImageLoader(true)
    }
    img.src = HighQualityImage
  }, [HighQualityImage])

  return (
    <>
      {highQualityImageLoader ? (
        <img src={HighQualityImage} className={` ${className} h-auto`} loading="lazy" />
      ) : (
        <img src={lowImageQuality} className={` ${className}  ${defaultLoad && "min-h-[50vh] md:min-w-[458px] w-[80%]"} object-cover object-center animate-pulse`} />
      )}
    </>
  )
}

export default ImageComponent
