import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info'
import DisplayComponent from '../../../Core/Component/index';
import Swiper from 'react-native-swiper';  
var width=Dimensions.get('window').width;
var height=Dimensions.get('window').height;

class EventDetails extends DisplayComponent {
    constructor(props) {
        super(props); 
    }
    static navigationOptions = {
        header: null
    }
    componentDidMount() {    	
    }
    render(){
    	let {navigation}=this.props;
      return(
      	<View style={{flex:1}} >      	    
      	    <Swiper  
                loop={false}  
                showsButtons={true}  
                index={0}  
                autoplay={true}  
                horizontal={true} 
                height={height}
                paginationStyle={{bottom:5}}
                activeDot={<View style={{backgroundColor:'#fff',width:8,height:8,borderRadius:4}}/>}
                nextButton={<Text style={{color:'#fff',fontSize:80,opacity:0.6}}>›</Text>}
                prevButton={<Text style={{color:'#fff',fontSize:80,opacity:0.6}}>‹</Text>}
	        >  	        
    			<View style={{flex:1}}>
			      	<Image source={require('../resources/activity_1.jpg')} style={styles.swiperImage}/>
 			    </View>
 			    <View style={{flex:1}}>
			      	<Image source={require('../resources/activity_2.jpg')} style={styles.swiperImage}/>
 			    </View>
 			    <View style={{flex:1}}>
			      	<Image source={require('../resources/activity_3.jpg')} style={styles.swiperImage}/>
			      	<TouchableOpacity style={styles.beginWeg} onPress={()=>this.props.onPress()}>
		      	        <Text style={{textAlign:'center',color:'#fff',fontSize:16}}>立即体验</Text>
		      	    </TouchableOpacity>
 			    </View>	           
	        </Swiper> 
	      	<TouchableOpacity style={styles.overAdvert} onPress={()=>this.props.onPress()}>
      	        <Text style={{textAlign:'center',color:'#fff',fontSize:14}}>跳过该广告</Text>
      	    </TouchableOpacity>     	    
      	</View>
      )
    }
}
const styles=StyleSheet.create({
	swiperImage:{
		width:width,
		height:height
	},
	overAdvert:{
		position:'absolute',
		top:20,
		right:20,
		paddingVertical:5,
      	paddingHorizontal:10,
      	backgroundColor:'rgba(165,160,160,0.6)',
      	borderRadius:15
	},
	beginWeg:{
		position:'absolute',
		bottom:50,
		alignSelf:'center',
		paddingVertical:8,
		paddingHorizontal:20,
		backgroundColor:'orange',
		borderRadius:20
	}
})
export default EventDetails;