cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(CODEGEN_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../../build/generated/source/codegen/jni)

file(GLOB react_codegen_SRCS CONFIGURE_DEPENDS
  ${CODEGEN_DIR}/*.cpp
  ${CODEGEN_DIR}/react/renderer/components/SpeechToTextSpec/*.cpp)

add_library(react_codegen_SpeechToTextSpec OBJECT ${react_codegen_SRCS})

target_include_directories(react_codegen_SpeechToTextSpec PUBLIC
  ${CODEGEN_DIR}
  ${CODEGEN_DIR}/react/renderer/components/SpeechToTextSpec)

target_link_libraries(react_codegen_SpeechToTextSpec fbjni jsi reactnative)

target_compile_reactnative_options(react_codegen_SpeechToTextSpec PRIVATE)
