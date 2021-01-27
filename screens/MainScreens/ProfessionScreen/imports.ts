import React, {useState} from 'react';
import Header from '../../../components/Header';
import ListView from '../../../components/ListView';
import {View, Text} from 'react-native';
import {styles} from './styles';
import axios from '../../../utils/axios';
import {useFocusEffect} from '@react-navigation/native';
import {IProfessionsProps} from '../../../interfaces/profession';
import {ENDPOINTS} from '../../../constants/endpoints';
import {SCREENS} from '../../../constants/data';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';

export {
  React,
  Header,
  ListView,
  View,
  styles,
  Text,
  axios,
  useFocusEffect,
  useState,
  ENDPOINTS,
  SCREENS,
  SafeAreaInsetsContext,
};

export type {IProfessionsProps};
