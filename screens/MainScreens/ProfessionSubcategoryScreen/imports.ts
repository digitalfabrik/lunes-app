import React, {useState} from 'react';
import {styles} from './styles';
import {
  View,
  Text,
  LogBox,
  StatusBar,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {
  IProfessionSubcategoryScreenProps,
  IProfessionSubcategoryProps,
} from '../../../interfaces/professionSubcategory';
import Title from '../../../components/Title';
import {SCREENS} from '../../../constants/data';
import axios from '../../../utils/axios';
import {ENDPOINTS} from '../../../constants/endpoints';
import {getProfessionSubcategoryWithIcon} from '../../../utils/helpers';
import {Arrow} from '../../../assets/images';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../../../components/Loading';
import MenuItem from '../../../components/MenuItem';

export {
  React,
  MenuItem,
  FlatList,
  Loading,
  styles,
  View,
  Text,
  LogBox,
  SCREENS,
  axios,
  ENDPOINTS,
  useState,
  useFocusEffect,
  getProfessionSubcategoryWithIcon,
  StatusBar,
  Title,
  Pressable,
  Image,
  Arrow,
};

export type {IProfessionSubcategoryScreenProps, IProfessionSubcategoryProps};
