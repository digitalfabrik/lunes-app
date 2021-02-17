import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import {CloseButton} from '../../../assets/images/imports';
import Modal from '../../../components/Modal';
import {ProgressBar} from 'react-native-paper';
import {COLORS} from '../../../constants/colors';
import {IDocumentProps} from '../../../interfaces/exercise';
import {useFocusEffect} from '@react-navigation/native';
import axios from '../../../utils/axios';
import {ENDPOINTS} from '../../../constants/endpoints';
import {IVocabularyTrainerScreen} from '../../../interfaces/exercise';
import AnswerSection from '../../../components/AnswerSection';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  Image,
  useFocusEffect,
  ENDPOINTS,
  axios,
  AnswerSection,
  BackHandler,
  AsyncStorage,
  KeyboardAwareScrollView,
  ActivityIndicator,
};

export type {IDocumentProps, IVocabularyTrainerScreen};
