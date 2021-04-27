#!/usr/bin/env bash

function fetchKeystore {
  sudo gpg --passphrase ${KEYSTORE_ENCRYPTION_KEY} --pinentry-mode loopback -o "android/app/$KEYSTORE_FILENAME" -d "android/$KEYSTORE_FILENAME.gpg"
}