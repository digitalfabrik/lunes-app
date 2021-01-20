import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {styles} from './styles';
import {
  NextArrow,
  CloseIcon,
  VolumeUpDisabled,
} from '../../assets/images/imports';
import {COLORS} from '../../constants/colors';
import {IAnswerSectionProps} from '../../interfaces/exercise';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import PopoverContent from '../PopoverContent';

export {
  React,
  View,
  Text,
  styles,
  TouchableOpacity,
  useState,
  COLORS,
  TextInput,
  NextArrow,
  CloseIcon,
  Popover,
  PopoverPlacement,
  PopoverContent,
  VolumeUpDisabled,
};

export type {IAnswerSectionProps};
