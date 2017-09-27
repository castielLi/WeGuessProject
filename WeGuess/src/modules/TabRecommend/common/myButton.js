/**
 * Created by Hsu. on 2017/8/11.
 */
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

export default class MyButton extends Component {
    constructor(props) {
        super(props);
        this.Opacity = null;
    }

    static defaultProps = {
        btnImage: false,
        btnText: '查看',
        btnImageUri: require('../../Resources/gold.png'),
        btnImageStyle: {height: 14, width: 14},
    };


    render() {
        const props = this.props;

        return (
            <TouchableOpacity {...props} activeOpacity={0.8} style={[styles.lookBtn, props.style]}>
                {props.btnImage ?
                    <Image source={props.btnImageUri} style={props.btnImageStyle}/> :
                    null
                }
                <Text style={styles.textStyle}>&nbsp;{props.btnText}&nbsp;</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    lookBtn: {
        height: 30,
        width: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#3b66b4',
    },
    iconImage: {
        height: 14,
        width: 14
    },
    textStyle: {
        color: '#fff',
        fontSize: 12
    }
});