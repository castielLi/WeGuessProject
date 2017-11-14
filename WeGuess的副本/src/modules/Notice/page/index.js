import React, {Component} from 'react';
import {connect} from "react-redux";
import ContainerComponent from '../../.././Core/Component/ContainerComponent';
import {BackButton, BlankButton} from "../../Component/BackButton";
import NoticeListView from "../components/NoticeListView"

class NoticePage extends ContainerComponent {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: "公告",
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
        super(props);
    }
    render() {
        return (<NoticeListView></NoticeListView>)
    }
}


const mapStateToProps = (state) => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NoticePage);