require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |spec|
  spec.name         = "SpeechToText"
  spec.version      = package["version"]
  spec.summary      = package["description"]
  spec.homepage     = package["homepage"]
  spec.license      = package["license"]
  spec.authors      = package["author"]
  spec.source       = { :path => "." }

  spec.platforms    = { :ios => min_ios_version_supported }

  spec.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  spec.private_header_files = "ios/**/*.h"

  spec.frameworks = "Speech", "AVFoundation"

  install_modules_dependencies(spec)
end
