import React from 'react';
import {
    View,
    Text,
    NativeModules,
    Platform,
    Image,
    ToastAndroid
} from 'react-native';
import DeviceInfo from 'react-native-device-info'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RNFS from 'react-native-fs';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import * as Actions from '../reducer/action';
import {GetVersionUrl} from '../../Config/apiUrlConfig';
import UpdateView from './updateView';
let currentVersion = DeviceInfo.getVersion();  //当前版本号
let AppVersion = NativeModules.AppVersion;
class AppUpdate extends ContainerComponent {
    constructor(props) {
        super(props);
        this.state = {
            jobId: 0,
            contentLength: 0,
            bytesWritten: 0,
        }
    }
    componentDidMount() {
        if (Platform.OS !== 'ios') {
            setTimeout(()=> {
                this.getVersionNumber();
            },3000)
        }
    }
    getVersionNumber = () => {   		
    	this.networking.get(GetVersionUrl, {})
            .then((data) => {
                if (data.Result == 1) {
                    if (data.Data.Version > currentVersion) {
                        this.refs.UpdateView.show();
			        }
                }
            }, (error) => {

            }).catch((error) => {

        });
    }
    //立即更新
    updateNow=(version, download)=>{   	
    	this.networking.get(GetVersionUrl, {})
            .then((data) => {
                if (data.Result == 1) {
		            this.newVersionDownload(data.Data.Version, data.Data.DownloadUrl);
                }
            }, (error) => {

            }).catch((error) => {

        });
    }
    downloadStart = (DownloadBeginCallbackResult) => {
        this.setState({
            jobId: DownloadBeginCallbackResult.jobId,
            contentLength: DownloadBeginCallbackResult.contentLength
        });
    }
    downloadProgress = (DownloadProgressCallbackResult) => {
        this.setState({
            jobId: DownloadProgressCallbackResult.jobId,
            contentLength: DownloadProgressCallbackResult.contentLength,
            bytesWritten: DownloadProgressCallbackResult.bytesWritten
        });
    }

    newVersionDownload = (version, download) => {

        let fileDir = `${RNFS.ExternalStorageDirectoryPath}/WeGuess/APK/${version}/`;
        let fileApk = `${RNFS.ExternalStorageDirectoryPath}/WeGuess/APK/${version}/WeGuess.apk`;

        let that = this;
        RNFS.exists(fileApk).then((isExist) => {
            if (isExist) {
                AppVersion.install(fileApk);
            } else {
            	ToastAndroid.show('正在下载...', ToastAndroid.SHORT);
                RNFS.mkdir(fileDir).then(() => {
                    let DownloadFileOptions = {
                        fromUrl: download,          // URL to download file from
                        toFile: fileApk,           // Local filesystem path to save the file to
                        background: true,
                        progressDivider: 1,
                        begin: this.downloadStart,
                        progress: this.downloadProgress,
                        connectionTimeout: 30000, // only supported on Android yet
                        readTimeout: 30000        // only supported on Android yet
                    }
                    let Result = RNFS.downloadFile(DownloadFileOptions);
                    this.setState({
                        jobId: Result.jobId
                    });
                    Result.promise.then((DownloadResult) => {
                        AppVersion.install(fileApk);
                    })
                })
            }
        });
    }

    render() {
        let Alert = this.Alert;
        return (
            <View style={{flex:1,position:'absolute',left:0,top:0,right:0,bottom:0}}>
                <UpdateView ref='UpdateView' onPress={()=>this.updateNow()}/>
            </View>
        )
    }
}

export default AppUpdate;