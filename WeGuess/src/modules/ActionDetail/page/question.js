/**
 * Created by ml23 on 2017/08/09.
 */

import React, {  PureComponent} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import {numFormat} from '../../Utils/money';

const bgColor = ["bgWhite", "bgBlue", "bgRed", "bgGreen"];

export default class QuestionComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectRowIndexArr:[],
            answerData:[]
        }
        this.displayOptions = this.displayOptions.bind(this);
    }


    pressChangeRed(index,i,value,v,originArray) {
        if (this.props.status === 2 && this.props.order === 1) {
            this.state.answerData[index] = {};
            this.state.answerData[index].QuestionID = value.ID;
            this.state.answerData[index].OptionID = v.ID;
            let arr = this.state.answerData;
            this.setState({
                answerData:arr.concat([])
            })
            this.state.selectRowIndexArr[index] = i;
            this.props.addAnswerData(arr,originArray.length===arr.length);
        }
        return;
    }

    beanDisplay(value, optionsState) {
        return (
            <View style={[styles.raceRow, styles[bgColor[optionsState]]]}>
                <Text style={optionsState?styles.fontColorWhite:styles.fontColorBlack}>{value.Option}</Text>
            </View>
        )
    }

    fightDisplay(value, optionsState,entryFee,isChangePageNumber) {
        return (
            <View style={[styles.raceRow, styles[bgColor[optionsState]]]}>
                <Text>
                    <Text style={[{fontSize:15,color:'#333'},optionsState?styles.fontColorWhite:{}]}>{value.Option+'  '}</Text>
                    <Text style={[{fontSize:12,color:'grey'},optionsState?styles.fontColorWhite:{}]}>{'('+(isChangePageNumber?(value.BetCount+1):value.BetCount)+'人)'}</Text>
                </Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                    <Image style={styles.bee} source={require('../../Resources/bean.png')}/>
                    <Text style={[{fontSize:12,color:'grey'},optionsState?styles.fontColorWhite:{}]}>{' '+numFormat(entryFee*(isChangePageNumber?(value.BetCount+1):value.BetCount))}</Text>
                </View>
            </View>)
    }

    moneyDisplay(value, optionsState,isChangePageNumber) {
        return (
            <View style={[styles.raceRow, styles[bgColor[optionsState]]]}>
                <Text style={optionsState?styles.fontColorWhite:styles.fontColorBlack}>{value.Option}</Text>
                <Text style={optionsState?styles.fontColorWhite:styles.fontColorBlack}>{(isChangePageNumber?(value.BetCount+1):value.BetCount) + '人'}</Text>
            </View>
        )

    }

    displayOptions(index,v, i,type,entryFee,isChangePageNumber) {
        let optionsState = 0;
        if(this.props.BetAnswers){//如果BetAnswers有数据
            if(v.IsRight){
                optionsState = 1;
            }
            if(this.props.BetAnswers[index].OptionID===v.ID){
                optionsState = 2;
            }
            if (this.props.BetAnswers[index].OptionID===v.ID&& v.IsRight){
                 optionsState = 3;
            }
            
        }else{
            if (this.state.selectRowIndexArr[index]===i) {
                optionsState = 2;
            } else if (v.IsRight) {
                optionsState = 1;
            }
        }
        
        if (type == 1) {
            return this.beanDisplay(v, optionsState);
        } else if (type == 2) {
            return this.fightDisplay(v, optionsState,entryFee,isChangePageNumber);
        } else {
            return this.moneyDisplay(v, optionsState,isChangePageNumber);
        }
    }


    render() {
        const {question, entryFee,type,isChangePageNumber} = this.props;

        return (
            <View>
                {question.map((value,index,originArray)=>
                    <View key={index}>
                        <View style={styles.titBarBox}>
                            <Text style={styles.titBar}>{(type===1?(index+1+'.'):'')+value.Question}</Text>
                        </View>
                        <View style={[styles.race,type===1?styles.beanRace:{}]}>
                            {value.Options.map((v,i)=><TouchableWithoutFeedback onPress={this.pressChangeRed.bind(this,index,i,value,v,originArray)} key={i} >
                                {this.displayOptions(index,v, i,type,entryFee,isChangePageNumber)}
                            </TouchableWithoutFeedback>)}
                        </View>
                    </View>
                )}
            </View>
        );
    }
}





const styles = StyleSheet.create({
    titBarBox: {
        height: 36,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        paddingLeft: 10,
    },
    titBar: {
        color: '#4c4c4c',
        fontSize: 14
    },
    race: {
        height: 62,
        flexDirection: 'row'
    },
    beanRace:{
        height: 38,
    },
    raceRow: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    bee:{
        width:14,
        height:14,
        resizeMode:'stretch',
    },
    bgBlue: {
        backgroundColor: '#3a66b3'
    },
    bgRed: {
        backgroundColor: '#d90000'
    },
    bgGreen: {
        backgroundColor: '#009A44'
    },
    bgWhite: {
        backgroundColor: '#ffffff'
    },
    fontColorBlack: {
        color: '#333'
    },
    fontColorWhite: {
        color: '#fff'
    },


})
