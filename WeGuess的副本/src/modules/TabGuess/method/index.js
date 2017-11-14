const Dimensions = require('Dimensions');
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ScreenScale = Dimensions.get('window').scale;
let Dimension={ScreenWidth,ScreenHeight,ScreenScale}
export default Dimension;