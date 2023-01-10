# This is the Gemfile for the Fastlane config in ./fastlane/Fastfile

source "https://rubygems.org"

ruby "2.7.5"

gem "fastlane"
plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
