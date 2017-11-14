import React, { PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';

export default class ButtonComponent extends PureComponent {
    render() {

        const {eachPrise, order, type, submit, showAnswerAllQuestionTips} = this.props;

        if (order === 4) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>活动已取消</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else if (order === 6) {
            if (type === 1) {
                return (null)
            } else {
                return (
                    <View style={styles.eachBar}>
                        {type === 3 ? <Text style={styles.eachBarText}>{'中奖名单:每人分得' + eachPrise + '元'}</Text> :
                            <Text style={styles.eachBarText}>{'中奖名单:每人分得' + eachPrise + '猜豆'}</Text>}
                    </View>
                )
            }
        } else if (order === 5) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>活动已截止</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else if (order === 2) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>活动已投注</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else if (order === 3) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>活动已满额</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else if (order === 1) {
            return (
                <View>
                    {showAnswerAllQuestionTips ? (<Text style={styles.answerTips}>您还有问题未答完</Text>) : null}
                    <TouchableWithoutFeedback onPress={submit}>
                        <View style={[styles.button, styles.submit]}>
                            <Text style={styles.buttonText}>提交</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        } else {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>已截止</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }
}

const styles = StyleSheet.create({
    eachBar: {
        height: 42,
        backgroundColor: '#3a66b3',
        justifyContent: 'center',
        alignItems: 'center'
    },
    eachBarText: {
        fontSize: 14,
        color: '#fff'
    },
    button: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        height: 47,
        backgroundColor: '#b0c2e1',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submit: {
        backgroundColor: '#3a66b3'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '400'
    },
    answerTips: {
        fontSize: 12,
        color: '#d90000',
        textAlign: 'center',
        margin: 10
    }
})