/**
 * Created by ml23 on 2017/10/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator
} from 'react-native';
import PullListView from "../../Component/PullListView";
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import {NoticeUrl} from '../../Config/apiUrlConfig';
import HOCFactory from "../../../Core/HOC";
import NetWorking from '../../../Core/WGNetworking/Network';

class NoticeListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataSource: ds,
            pageIndex: 1,
            pageSize: 20,
            canLoad: false,
        }
        this.networking = NetWorking.getInstance();
    }

    componentDidMount() {
        this.onPullRelease(() => {
        });
    }

    onPullRelease = (resolve) => {
        this.getBuyAnalysis(resolve, true);
    }
    onEndReached = (resolve) => {
        this.getBuyAnalysis(resolve);
    }

    getBuyAnalysis = (resolve, isRefresh) => {
        let {pageIndex, pageSize} = this.state;
        let params = {
            PageIndex: isRefresh ? 1 : pageIndex,
            PageSize: pageSize
        }
        let that = this;
        this.networking.get(NoticeUrl, params, {}).then((responense) => {
            let {Result, Data} = responense;
            if (Result == 1) {
                let rowsData = Data ? Data : [];
                let length = rowsData.length;

                if (isRefresh) {
                    that.setState({data: [].concat(rowsData), dataSource: ds.cloneWithRows(rowsData), canLoad: true});
                } else {
                    that.setState({
                        data: that.state.data.concat(rowsData),
                        dataSource: ds.cloneWithRows(rowsData),
                        canLoad: true
                    });
                }
                if (length < pageSize) {
                    resolve(true);
                } else {
                    resolve();
                    that.setState({pageIndex: this.state.pageIndex + 1})
                }
            } else {
                let options = {
                    Content:this.props.getErrorMsg(Result),
                    HideCancel:true
                }
                that.props.showAlert(options);
            }
        }, (error) => {
            let options = {
                Content:this.props.getErrorMsg(error),
                HideCancel:true
            }
            this.props.showAlert(options);
            resolve();
        }).catch((error) => {
            let options = {
                Content:this.props.getErrorMsg(error),
                HideCancel:true
            }
            this.props.showAlert(options);
            resolve();
        })
    }

    renderRow = (rowData,sectionID,rowID) => {     
    	let index=parseInt(rowID);
        return (
            <View style={[styles.NoticeUl,{backgroundColor: index % 2 == 0 ? "#ffffff" : "#f7f7f7"}]}>
	            <View style={styles.NoticeLeft}>
	               <Text style={styles.NoticeTime}>{rowData.NotifiedTime}</Text>
	            </View>
	            <View style={styles.NoticeRight}>
	               <Text style={styles.NoticeText}>{rowData.Contents.ch}</Text>
	            </View>              
            </View>
        )        
    }

    render() {
        if (this.state.canLoad) {
            return (
                <PullListView renderRow={this.renderRow}
                              data={this.state.data}
                              onPullRelease={this.onPullRelease}
                              onEndReached={this.onEndReached}
                              style={styles.container}
                />
            );
        } else {
            return (<ActivityIndicator size="large" color="#3a66b3"/>);
        }
    }
}
export default HOCFactory(NoticeListView,["HocAlert","HocError"]);

const styles = StyleSheet.create({
    NoticeUl:{
    	flexDirection:'row',
    	borderBottomWidth:1,
    	borderBottomColor:'#eee',    	   	
    },
    NoticeLeft:{
    	width:90,
    	justifyContent:'center',
    	alignItems:'center',
    	borderRightWidth:1,
    	borderRightColor:'#ddd',
    	padding:10,
    },
    NoticeRight:{
    	flex:1,
    	padding:10,
    	justifyContent:'center',
    },
    NoticeTime:{
    	color:'#6b6060',
    	fontSize:12,
    	textAlign:'center',
    	lineHeight:20
    },
    NoticeText:{    	
    	fontSize:12,
    	color:'#d60000',   
    	lineHeight:20
    }
})