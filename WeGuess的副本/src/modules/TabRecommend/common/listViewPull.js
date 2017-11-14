import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';

import {PullList} from 'react-native-pull';

export default class ListViewPull extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.renderFooter = this.renderFooter.bind(this);

    }

    render() {
        return (
            <PullList enableEmptySections={true}
                //topIndicatorRender={this.topIndicatorRender}
                      topIndicatorHeight={60}
                      onEndReachedThreshold={20}
                      renderFooter={this.renderFooter}
                      {...this.props}
            />
        );
    }


    renderFooter() {
        let {isLoading} = this.props;
        if (isLoading !== 2) {
            return null;
        }
        return (
            <View style={{height: 50}}>
                <ActivityIndicator color='#3a66b3'/>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
    },
});