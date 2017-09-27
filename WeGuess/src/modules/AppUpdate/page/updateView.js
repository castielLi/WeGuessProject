import React, { Component } from 'react';
import {
  StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Platform,
    TextInput,
    Image,
    Dimensions
} from 'react-native';
import{StackNavigator} from 'react-navigation';
const screenW=Dimensions.get('window').width;
const screenH=Dimensions.get('window').height;
export default class UpdateView extends Component{
	constructor(props){
		super(props);
		this.state={
			isShow:false,
			opacityValue:new Animated.Value(0),
			scaleValue:new Animated.Value(0)
		}
	}
	show=()=>{
		    this.setState({
            isShow: true,
        });
        //Animated.parallel == 同时执行多个动画
        Animated.parallel([
            //Animated.timing == 推动一个值按照一个过渡曲线而随时间变化
            Animated.timing(this.state.opacityValue, {
                toValue: 1,
                duration: 200 + 100
            }),
            //Animated.spring == 产生一个基于Rebound和Origami实现的Spring动画。它会在toValue值更新的同时跟踪当前的速度状态，以确保动画连贯,比timing动画连贯流畅
            Animated.spring(this.state.scaleValue, {
                toValue: 1,
                duration: 200,
                friction: 5
            })
        ]).start();
	}
	cancelUpdate=()=>{
		    this.setState({isShow: false});
        this.state.opacityValue.setValue(0);
        this.state.scaleValue.setValue(0);
	}
	//立即更新
	updateNow(){
		 this.props.onPress();
		 this.cancelUpdate();
	}
	render() {
        if (!this.state.isShow) return null;       
        return (
            <Animated.View style={[styles.container, {opacity: this.state.opacityValue}]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1, alignItems: 'center', justifyContent:'center'}}
                >
                    <Animated.View
                        style={[styles.contentContainer, {transform: [{scale: this.state.scaleValue}]}]}
                    >
                        <Image source={require('../resources/update_bg.png')} style={styles.contentContainer}/>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={[styles.buttons,{opacity:0.8}]}
                                onPress={()=>this.cancelUpdate()}
                            >
                                <Text style={{fontSize: 16, color: 'black'}}>暂不更新</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.buttons}
                                onPress={() =>this.updateNow()}
                            >
                                <Text style={{fontSize: 16, color: 'black'}}>立即更新</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
    },
    contentContainer: {
        height: screenH*0.75,
        width: screenW * 0.75,
    },
    buttonContainer: {
    	  position:'absolute',
    	  left:0,
    	  bottom:0,
        height: 80,
        width: screenW * 0.75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'red',
        borderRadius:10,
        paddingVertical:8,
        paddingHorizontal:20
    }
})