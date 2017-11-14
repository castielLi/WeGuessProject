
const BuyBetRecordType={
	"0":"",
	"1":"赢",
	"2":"赢半",
	"3":"输",
	"4":"输半",
	"5":"取消",
	"6":"作废",
	"7":"走",
}
const BuyBetRecordColor={
	"1":"red",
	"2":"red",
	"3":"green",
	"4":"green",
	"5":"#3a66b3",
	"6":"#3a66b3",
	"7":"#3a66b3",
}

export function GetBuyBetRecordType(data){
	return BuyBetRecordType[data];
}
export function GetBuyBetRecordColor(data){
	return BuyBetRecordColor[data];
}