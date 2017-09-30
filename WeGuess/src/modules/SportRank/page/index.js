/**
 * Created by maple on 2017/6/7.
 */

'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ListView,
    Dimensions
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import TabView from '../../Component/TabView';
import {GetRankList} from "../../Config/apiUrlConfig";
import {BackButton, BlankButton} from "../../Component/BackButton";

export default class SportRank extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "排行榜",
            headerLeft: (
                <BackButton onPress={() => {
                    navigation.goBack();
                }}/>
            ),
            headerRight: (
                <BlankButton/>
            ),
        };
    };


    constructor(props) {
        super(props)
        this.fetchData = this.fetchData.bind(this);
        this.changeType = this.changeType.bind(this);
        this.state = {
            type: 0,
            dataSourceWeek: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            dataSourceMonth: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
        }
        this.weekData=[];
        this.monthData=[];
        this.defaultData = {
            Nickname: '(我自己)',
            WinRate: '-',
            HeadPicture: '',
            Index: "50以下",
            IsOwner: 'true',
        }

        this.tabList = ["周排行", "月排行"];
    }

    changeType = (index) => {
        this.setState({
            type: index
        },()=>{
        	this.fetchData()
        })
    }

    //网络请求
    fetchData() {
        let params = { //请求参数
            type: this.state.type //0 周排行 1 月排行
        };
        let that = this;
        this.networking.get(GetRankList, params, {}).then((responseData) => {
            let {
                Result,
                Data
            } = responseData;
            if (Result == 1) {
                let data = Data.Data;
                let length = data.length;
                for (let i = 0; i < length; i++) {
                    data[i].Index = i + 1;
                    if (data[i].IsOwner === true) {
                        this.defaultData = data[i];
                    }
                }
                data.unshift(this.defaultData)
                if(this.state.type==0){
                	this.weekData=data;
                	that.setState({
	                    dataSourceWeek: this.state.dataSourceWeek.cloneWithRows(this.weekData)
	                });
                }else{
                	this.monthData=data;
                	that.setState({
	                    dataSourceMonth: this.state.dataSourceMonth.cloneWithRows(this.monthData)
	                });
                }
                
            } else {
                that.showError(Result);
            }
        }).catch((error) => {
            that.showError(error);
        })
    }

    componentDidMount() {
        this.fetchData();
    }

    renderRow(rowData, sectionId, ItemId) {
        return (
            <View style={[styles.listContainer, ItemId % 2 === 0 ? styles.even : styles.odd]}>
                <View style={styles.listRank}>
                    <Text
                        style={rowData.IsOwner === false ? styles.listText : styles.listTextOwner}>{rowData.Index}</Text>
                </View>
                {
                    rowData.HeadPicture ?
                        (<View style={styles.listImg}>
                            <Image source={{uri: rowData.HeadPicture}} style={styles.listLogo}/>
                        </View>) : (
                        <View style={styles.listImg}>
                            <Image source={require('../../Resources/head.png')} style={styles.listLogo}/>
                        </View>
                    )

                }

                <View style={styles.listUsers}>
                    <Text
                        style={rowData.IsOwner === false ? styles.listText : styles.listTextOwner}>{rowData.Nickname}</Text>
                </View>
                <View style={styles.listWins}>
                    <Text
                        style={rowData.WinRate == '-' ? styles.listWinsText : styles.listWinsTextColor}>{rowData.WinRate == '-' ? '-' : (rowData.WinRate * 100).toFixed(2) + '%'}</Text>
                </View>
            </View>
        )
    }

    render() {
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <TabView tabList={this.tabList} onPress={this.changeType}></TabView>
                <View style={styles.listTitle}>
                    <View style={styles.Rank}>
                        <Text style={styles.titleText}>排名</Text>
                    </View>
                    <View style={styles.logo}>

                    </View>
                    <View style={styles.Users}>
                        <Text style={styles.titleText}>昵称</Text>
                    </View>
                    <View style={styles.Wins}>
                        <Text style={styles.titleText}>胜率</Text>
                    </View>
                </View>
                {
                	this.state.type==0?(
                		<ListView
		                    style={{maxHeight: Dimensions.get('window').height - 180}}
		                    dataSource={this.state.dataSourceWeek}
		                    renderRow={this.renderRow}
		                    showsVerticalScrollIndicator={false}
		                />
                	):(
                		<ListView
		                    style={{maxHeight: Dimensions.get('window').height - 180}}
		                    dataSource={this.state.dataSourceMonth}
		                    renderRow={this.renderRow}
		                    showsVerticalScrollIndicator={false}
		                />
                	)
                }
                
                <View style={styles.notesContent}>
                    <Text style={styles.notes}>*注: 此排行榜只显示前50名</Text>
                </View>
                 <Loading ref={(refLoading) => {
                    this.loading = refLoading
                }}></Loading>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0eff5',
    },
    odd: {
        backgroundColor: "#fff"
    },
    even: {
        backgroundColor: '#f7faff'
    },
    listTitle: {
        flexDirection: 'row',
        height: 38,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f7f7f7'
    },
    titleText: {
        color: 'grey',
        fontSize: 14,
    },
    listText: {
        fontSize: 12,
        color: 'grey',
    },
    listTextOwner: {
        fontSize: 12,
        color: '#3a66b3',
    },
    Rank: {
        width: 85,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 50,
    },
    Users: {
        width: 175,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    Wins: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f7faff',
    },
    listRank: {
        width: 85,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listImg: {
        width: 50,
        paddingLeft: 16,
    },
    listLogo: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 15,
    },
    listUsers: {
        width: 175,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    listWins: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listWinsText: {},
    listWinsTextColor: {
        color: '#ff5b06',
    },
    notesContent: {
        height: 24,
        justifyContent: 'center',
        backgroundColor: '#E9E9EF',
    },
    notes: {
        fontSize: 12,
        paddingLeft: 8,
        color: "grey"
    }
});