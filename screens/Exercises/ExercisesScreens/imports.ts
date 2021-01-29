import React, {useState} from 'react';
import {styles} from './styles';
import {
  View,
  Text,
  LogBox,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {IExercisesScreenProps} from '../../../interfaces/exercises';
import {Home} from '../../../assets/images/imports';
import Title from '../../../components/Title';
import {EXERCISES} from '../../../constants/data';
import {Arrow} from '../../../assets/images/imports';
import {useFocusEffect} from '@react-navigation/native';

export {
  React,
  styles,
  View,
  useState,
  useFocusEffect,
  Text,
  LogBox,
  TouchableOpacity,
  Home,
  EXERCISES,
  Title,
  Pressable,
  Image,
  FlatList,
  Arrow,
};

export type {IExercisesScreenProps};
