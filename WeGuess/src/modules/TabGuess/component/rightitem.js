/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
let { height} = Dimensions.get('window');

export default class RightItem extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // this.state = {
        //   dataSource: ds.cloneWithRows(this.props.matchList)
        // };
        this.goMatch = this.goMatch.bind(this);
    }

    goMatch(params) {
        this.props.goMatch(params);
    }
    componentWillReceiveProps(newProps) {
        
        if (newProps.currentIndex!== this.props.currentIndex) {
            if(this._scrollView != null && this._scrollView != undefined){
                    setTimeout(()=>{this._scrollView.scrollTo({y:0});},100)
            }
              
        }
    }
    render() {
        const {navigation} = this.props;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(this.props.matchList)
        };
        return (
            <View style={styles.container}>
                <ListView 
                    initialListSize = {10}
                    pageSize = {1}
                    ref={component => this._scrollView = component}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }


    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => {
                this.goMatch(rowData)
            }}>
                <View style={{
                    height: 80,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    paddingLeft: 5,
                    paddingRight: 5,
                }}>
                    <View style={styles.leagueTime}>
                        {
                            this.props.kind == 1 ? (
                                <View style={styles.time}>
                                    <Text style={{color: '#00b5b9',}}>{rowData.LN} </Text>
                                    <Text style={{color: 'grey'}}>{rowData.MD.split(" ")[1]}</Text>
                                </View>
                            ) : (
                                <View style={styles.time}>
                                    <Text style={{color: 'grey'}}>{rowData.MD}</Text>
                                </View>
                            )
                        }

                        <View>
                            <Text style={{color: "#ff5b06"}}>{rowData.OL ? "滚球" : ""}</Text>
                        </View>
                    </View>

                    <View style={styles.teamName}>
                        <View>
                            <Text style={{color: '#333', fontSize: 14}}>{rowData.HN}</Text>
                            <Text style={{marginTop: 5, color: '#333', fontSize: 14}}>{rowData.AN}</Text>
                        </View>
                        <View>
                            <Text>
                                <Icon name="ios-arrow-forward" color="#bbbbbb" size={20}/></Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        marginLeft: 10,
        marginRight: 10,
    },
    balance: {
        width: 50,
        flexDirection: 'row',
    },
    rank: {
        width: 50,
        marginLeft: 100,
        alignItems: 'center',
    },
    list: {
        width: 50,
        alignItems: 'center',
    },
    imgStyle: {
        width: 100,
        height: 30,
    },
    leagueTime: {
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    time: {
        flexDirection: 'row',
        height: 20,
    },
    teamName: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
    },
});
