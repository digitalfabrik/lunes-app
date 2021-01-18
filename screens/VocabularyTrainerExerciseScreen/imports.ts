import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {styles} from './styles';
import {
  CloseButton,
  NextArrow,
  CloseIcon,
  VolumeUpDisabled,
} from '../../assets/images/imports';
import Modal from '../../components/Modal';
import {ProgressBar} from 'react-native-paper';
import {COLORS} from '../../constants/colors';
import {IDocumentProps} from '../../interfaces/exercise';
import {useFocusEffect} from '@react-navigation/native';
import axios from '../../utils/axios';
import {ENDPOINTS} from '../../constants/endpoints';
import {IVocabularyTrainerScreen} from '../../interfaces/exercise';

export {
  React,
  View,
  Text,
  styles,
  TouchableOpacity,
  CloseButton,
  useState,
  Modal,
  ProgressBar,
  COLORS,
  TextInput,
  Image,
  NextArrow,
  CloseIcon,
  VolumeUpDisabled,
  useFocusEffect,
  ENDPOINTS,
  axios,
};

export type {IDocumentProps, IVocabularyTrainerScreen};
