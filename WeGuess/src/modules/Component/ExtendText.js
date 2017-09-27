/**
 * Created by ml23 on 2017/08/15.
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    Text,
} from 'react-native';

export default class ExtendText extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {txt,textLength,sty} = this.props;
        if(!textLength){
              textLength = 4;
        }
        if(txt.length>textLength){
              txt = txt.substr(0,textLength);
        } 
        return (
           <Text style={sty}>{txt}</Text>
        )
    }
}