import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Animated,
    Easing,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
let Dimensions = require('Dimensions');
import BackgroundTimer from 'react-native-background-timer';
import {NoticeUrl} from '../../Config/apiUrlConfig';
import NetWorking from '../../../Core/WGNetworking/Network';
var {height, width} = Dimensions.get('window');
export default class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(-40),
            dataSource: [],
            newData: [],
            pageIndex:1,
            pageSize:20,
        };

        this.timer = null;
        this.networking = NetWorking.getInstance();

    }

    componentDidMount() {
        
        this.fetchData(NoticeUrl);
    }

    componentWillUnmount() {
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
        }
    }

    fetchData = (url = NoticeUrl) => {
        let that = this;
        let {pageSize,pageIndex} = this.state;
        let params = {
            pageIndex:pageIndex,
            pageSize:pageSize
        }
        this.networking.get(url, params, {}).then((responseData) => {
            let {Result, Data} = responseData
            if (Result == 1 && Data.length > 0) {
                let arr = Data;
                that.setState({
                    dataSource: arr,
                });
                that.showHeadBar(1, Data.length);
            }
        }, (error) => {
        }).catch((err) => {
            console.log(err);
        });

        this.timer = BackgroundTimer.setInterval(() => {
            that.fetchRefreshData();
        }, 10000);
    }

    fetchRefreshData = (url = NoticeUrl) => {
        let that = this;
        let {pageSize,pageIndex} = this.state;
        let params = {
            pageIndex:pageIndex,
            pageSize:pageSize
        }
        this.networking.get(url, params, {}).then((responseData) => {
            let {Result, Data} = responseData
            if (Result == 1 && Data.length > 0) {
                if(Data.length>=pageSize){
                     that.setState({
                            pageIndex: pageIndex+1,
                        });
                }
                that.setState({
                    newData: Data,
                });
            }
        }, (error) => {
        }).catch(function (err) {
            console.log(err);
        })
    }

    showHeadBar(index, count) {
        index++;
        Animated.timing(this.state.translateY, {
            toValue: -40 * index,             //40为文本View的高度
            duration: 1000,                        //动画时间
            Easing: Easing.linear,
            delay: 1000                            //文字停留时间
        }).start(() => {                  //每一个动画结束后的回调
            if (index >= count) {
                let arr = this.state.newData, len = this.state.dataSource.length - 1;
                arr.unshift(this.state.dataSource[len]);
                this.setState({
                    dataSource: arr
                })
                index = 1;
                this.state.translateY.setValue(-40);
                count = arr.length;

            }
            this.showHeadBar(index, count);  //循环动画
        })
    }

    renderRow(rowData, key) {

        return (
            <TouchableOpacity key={key} onPress={() => {
                this.props.navigation.navigate("NoticePage")
            }}>
                <View style={{height: 40, justifyContent: "center"}}><Text
                    style={{color: "#333", fontSize: 14}}>{rowData.Contents.ch}</Text></View>
            </TouchableOpacity>
        )

    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{width:0.2*width,height: 40, justifyContent: "center",alignItems:"center"}}>
                    <View style={{width:50,paddingLeft:5,}}><Image
                        resizeMode="contain"
                        style={styles.icon}
                        source={require('../resources/notice.png')}
                    /></View>
                </View>

                <Animated.View style={[styles.wrapper, {
                    transform: [{
                        translateY: this.state.translateY
                    }]
                }]}>
                    {
                        this.state.dataSource.map((item, index) => {
                            return this.renderRow(item, index);
                        })
                    }
                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
    container: {
        height: 40,
        overflow: 'hidden',
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    wrapper: {
        marginHorizontal: 5,
        marginLeft: 70,
    },


    bar: {
        height: 40,
        justifyContent: 'center',
    },


    barText: {
        width: Dimensions.get('window').width - 30 - 16,
        marginLeft: 5,
        color: '#ff7e00',
        fontSize: 14,
    },
});