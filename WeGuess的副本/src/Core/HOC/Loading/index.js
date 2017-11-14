/**
 * Created by maple on 2017/10/10.
 * Hoc 模式
 * 封装Loading效果，需要的组件直接使用。
 * 使用方法：
 *      import HocLoading from "/Core/Hoc/Loading" (路径为相对位置,实际使用注意修改)
 *      HocLoading(ComposedComponent);(将需要封装的组件传入)
 *      显示loading:this.props.showLoading(options); (回调参数可选)
 *      隐藏loading:this.props.hideLoading(options); (回调参数可选)
 *
 *      参数options：{
 *          Component：(<View></View>),//组件,只有show方法有用
 *          Callback:()//回调方法
 *      }
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal,
    InteractionManager
} from 'react-native';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;


export default HocLoading = (ComposedComponent) => class extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            modalVisible: false,
            Component: null
        };
    }

    show = (options) => {
        let newOptions = Object.assign({modalVisible: true}, this.state, options);
        this.setState({
            modalVisible: true,
            component: options.Component
        }, () => {
            if (typeof options.Callback === "function") {
                options.Callback()
            }
        });
    };

    hide = (callback) => {
        this.setState({
            modalVisible: false,
        }, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    };

    componentDom = () => {
        if(this.state.component){
            return (this.state.component)
        }else{
            return (
                <View style={styles.loading}>
                    <Image source={require("./resource/loading.gif")} style={styles.image}></Image>
                </View>
            )
        }
    }

    render() {
        let newProps = {
            showLoading: this.show,
            hideLoading: this.hide,
        }
        return (
            <View style={{flex: 1}}>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    }}
                >
                    <View style={[styles.container, {width: ScreenWidth}]}>
                        {this.componentDom()}
                    </View>
                </Modal>
                <ComposedComponent {...this.props} {...newProps}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loading: {
        backgroundColor: 'white',
        height: 128,
        width: 128,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#e5e5e5",
        borderWidth: 1,
        borderRadius: 16,
    },
    image: {
        height: 80,
        width: 80,
    }
});