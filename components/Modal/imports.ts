import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {styles} from './styles';
import {IConfirmationModalProps} from '../../interfaces/exercise';
import {CloseIcon} from '../../assets/images/imports';
import Button from '../Button';
import {BUTTONS_THEME} from '../Button/imports';
import AsyncStorage from '@react-native-community/async-storage';

export {
  React,
  View,
  Text,
  TouchableOpacity,
  Modal,
  styles,
  CloseIcon,
  Button,
  BUTTONS_THEME,
  AsyncStorage,
};

export type {IConfirmationModalProps};
