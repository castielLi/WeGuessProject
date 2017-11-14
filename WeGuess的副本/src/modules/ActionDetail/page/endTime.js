/**
 * Created by ml23 on 2017/08/09.
 */

import React, {
    PureComponent
} from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import {timeFormat} from '../../Utils/time';


export default class EndTimeComponent extends PureComponent {
    render() {
        const {endTime, maxPlayers} = this.props;

        return (
            <View style={styles.cutOffBox}>
                <Text style={styles.cutOff}>{'截止时间:' + timeFormat(endTime, "yyyy年MM月dd日 hh:mm")}</Text>
                <Text style={styles.cutOff}>{'截止人数:' + maxPlayers + '人'}</Text>
            </View>
        );
    }
}


EndTimeComponent.propTypes = {
    endTime: React.PropTypes.string.isRequired,
    maxPlayers: React.PropTypes.number.isRequired,
};


const styles = StyleSheet.create({
    cutOffBox: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cutOff: {
        fontSize: 13,
        color: 'grey'
    },
})
