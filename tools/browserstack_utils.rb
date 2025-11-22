module BrowserstackUtils
  # Converts the app id returned by the upload to browserstack plugin into a url to run the uploaded apk in the browser
  def build_live_url(app_id:, os:, os_version:, device:)
    app_id_without_prefix = app_id.sub(/\Abs:\/\//, '')

    query_params = {
      app_hashed_id: app_id_without_prefix,
      os: os,
      os_version: os_version,
      device: device,
      scale_to_fit: true,
      start: true
    }
    "https://app-live.browserstack.com/dashboard##{URI.encode_www_form(query_params)}"
  end

  def build_android_live_url(app_id:)
    build_live_url(app_id: app_id, os: "android", os_version: "12.0", device: "Google Pixel 6")
  end

  def build_ios_live_url(app_id:)
    build_live_url(app_id: app_id, os: "ios", os_version: "17.0", device: "iPhone 15")
  end
end