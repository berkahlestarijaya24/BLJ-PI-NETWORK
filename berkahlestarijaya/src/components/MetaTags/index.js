import React from "react"
import { Helmet } from "react-helmet"
import { useSettings } from "../../Context/SettingsContext"

const MetaTags = ({ pageTitle }) => {
  const { settings } = useSettings()

  if (!settings) return null

  return (
    <Helmet>
      <title>
        {pageTitle ? `${pageTitle} - ${settings.app_name}` : settings.app_name}
      </title>
      <meta name="description" content={settings.meta_description} />
      <meta name="keywords" content={settings.meta_keywords} />
      <meta name="author" content={settings.meta_author} />
      <link rel="icon" type="image/png" href={settings.favico} />
    </Helmet>
  )
}

export default MetaTags
