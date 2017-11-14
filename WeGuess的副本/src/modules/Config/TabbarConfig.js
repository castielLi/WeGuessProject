/**
 * Created by ml23 on 2017/08/04.
 */

import React from 'react';
import {StyleSheet, Image, Text} from 'react-native';
import {TabNavigator} from "react-navigation";
import TabRecommend from '../TabRecommend/page';
import TabLeague from '../TabLeague/page';
import TabGuess from '../TabGuess/page';
import TabAction from '../TabAction/page';
import TabMe from '../TabMe/page';

const MainTabBar = TabNavigator({
    TabRecommend: {
        screen: TabRecommend,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '推荐',
            tabBarIcon: ({tintColor}) => (
                <Text style={[styles.mfIcon,{color:tintColor}]}>&#xe900;</Text>)
        })
    },
    TabLeague: {
        screen: TabLeague,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '赛事',
            tabBarIcon: ({tintColor}) => (
                <Text style={[styles.mfIcon,{color:tintColor}]}>&#xe904;</Text>)
        })
    },
    TabGuess: {
        screen: TabGuess,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '竞猜',
            tabBarIcon: ({tintColor}) => (
                <Text style={[styles.mfIcon,{color:tintColor}]}>&#xe903;</Text>)
        })
    },
    TabAction: {
        screen: TabAction,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '活动',
            tabBarIcon: ({tintColor}) => (
                <Text style={[styles.mfIcon,{color:tintColor}]}>&#xe901;</Text>)
        })
    },
    TabMe: {
        screen: TabMe,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '我',
            tabBarIcon: ({tintColor}) => (
                <Text style={[styles.mfIcon,{color:tintColor}]}>&#xe902;</Text>)
        })
    },
}, {
    initialRouteName: "TabGuess",
    animationEnabled: true, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#3a66b3', // 文字和图片选中颜色
        activeBackgroundColor: "#ffffff",// 文字和图片选中背景颜色
        inactiveTintColor: '#444', // 文字和图片未选中颜色
        inactiveBackgroundColor: "#ffffff",// 文字和图片未选中背景颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {
            height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        },
        style: {
            backgroundColor: '#fff', // TabBar 背景色
            height: 44,
            borderColor: "#b2b2b2",
            borderTopWidth: 1,
        },
        tabStyle: {
            height: 44
        },
        labelStyle: {
            fontSize: 10, // 文字大小
            lineHeight: 10,
            margin: 0
        },
        iconStyle: {
            height: 25
        }
    }
});


const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24
    },
    mfIcon: {
        fontFamily: 'IoniconsMf',
        fontSize: 24,
        width: 24,
        height: 24
    }
});
export default MainTabBar;

