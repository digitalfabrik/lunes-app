require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |spec|
  spec.name         = "SpeechToText"
  spec.version      = package["version"]
  spec.summary      = package["description"]
  spec.homepage     = "https://github.com/digitalfabrik/lunes-app"
  spec.license      = "MIT"
  spec.authors      = "Tür an Tür – Digitalfabrik gGmbH"
  spec.source       = { :path => "." }

  spec.platforms    = { :ios => min_ios_version_supported }

  spec.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  spec.private_header_files = "ios/**/*.h"

  spec.frameworks = "Speech", "AVFoundation"

  install_modules_dependencies(spec)
end
