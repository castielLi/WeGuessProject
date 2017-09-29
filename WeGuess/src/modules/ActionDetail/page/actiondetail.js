/**
 * Created by maple on 2017/08/09.
 */
import React, {
    Component
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ListView,
    ActivityIndicator
} from 'react-native';
import QuestionComponent from './question';
import EndTimeComponent from './endTime';
import ResultComponent from './result';
import ButtonComponent from './button';
import renderRow from './winnerList';
import MoneyTipsComponent from './moneyTips';
import {dealStatus, dataFormat} from '../../Utils/data';
import {numFormat} from '../../Utils/money';

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderRow = renderRow.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
        this.renderEndingTime = this.renderEndingTime.bind(this);
        this.renderBeanTips = this.renderBeanTips.bind(this);
        this.renderResult = this.renderResult.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderMoneyTips = this.renderMoneyTips.bind(this);
        this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    }


    renderQuestion() {
        const {Action, Question, BetInfo} = this.props.Data;
        const {addAnswerData, order, isChangePageNumber} = this.props;
        return (
            <QuestionComponent question={Question} order={order ? order : dealStatus(BetInfo).Order}
                               entryFee={Action.EntryFee} type={Action.Type} status={Action.Status}
                               addAnswerData={addAnswerData} BetAnswers={BetInfo.BetAnswers}
                               isChangePageNumber={isChangePageNumber}></QuestionComponent>
        )
    }

    renderEndingTime() {
        const {Action} = this.props.Data;
        return (
            Action.Type === 3 ? (
                <EndTimeComponent endTime={Action.EndTime} maxPlayers={Action.MaxPlayers}></EndTimeComponent>) : null

        )
    }

    renderResult() {
        const {Action} = this.props.Data;
        return (
            Action.Status === 3 ? (<ResultComponent></ResultComponent>) : null
        )
    }

    renderButton() {
        const {Action, BetInfo} = this.props.Data;
        const {winners, submit, showAnswerAllQuestionTips, order} = this.props;
        return (
            <ButtonComponent order={order ? order : dealStatus(BetInfo).Order} type={Action.Type}
                             eachPrise={winners[0] ? winners[0].WinLose : ''} submit={submit}
                             showAnswerAllQuestionTips={showAnswerAllQuestionTips}></ButtonComponent>
        )
    }

    renderBeanListTab() {
        const {Type, Status, EntryFee} = this.props.Data.Action;
        return (
            Type === 1 && Status === 3 ? (<View style={styles.beanListTabBox}>
                <Text style={styles.beanListTabText}>中奖用户</Text>
                <Text style={styles.beanListTabText}>中奖额度</Text>
            </View>) : null

        )
    }

    renderBeanTips() {
        const {Action} = this.props.Data;
        return (
            Action.Type === 1 ? (<Text style={styles.tips}>注：参与活动就能获得猜豆奖励。</Text>) : null
        )
    }

    renderMoneyTips() {
        const {Action, isHiddenFooter} = this.props.Data;
        return (
            Action.Type === 3 ? (
                <MoneyTipsComponent status={Action.Status} entryFee={Action.EntryFee}></MoneyTipsComponent>) : null
        )
    }

    renderActivityIndicator() {
        const {isHiddenFooter} = this.props;
        return (
            isHiddenFooter ? null : (<View><ActivityIndicator size="small" color="#3a66b3"/></View>)
        )
    }

    renderFightTips() {
        const {Type, Status, EntryFee} = this.props.Data.Action;
        return (
            Type === 2 && Status === 2 ? (
                <View><Text style={styles.tips}>{'参与活动将扣除' + numFormat(EntryFee) + '猜豆。'}</Text><Text
                    style={styles.fightTips}>用户缴纳的所有报名费均会计入到该场比赛，胜平负三个结果的各自最终奖池。</Text><Text style={styles.fightTips}>用户之间对战竞猜。选项正确的所有用户平分其余错误选项所累积的奖池猜豆并返还报名费。</Text></View>) : null
        )
    }

    renderHeader() {
        return (
            <View>
                {this.renderQuestion()}
                {this.renderEndingTime()}
                {this.renderBeanTips()}
                {this.renderResult()}
                {this.renderButton()}
                {this.renderBeanListTab()}
            </View>
        )
    }

    renderFooter() {
        return (
            <View>
                {this.renderMoneyTips()}
                {this.renderFightTips()}
                {this.renderActivityIndicator()}
            </View>
        )
    }

    render() {
        const {Data, winners, hasWinner, loadMore} = this.props;
        const winner = (Data.Action.Type === 1 ? winners : dataFormat(winners))
        return (
            <ListView dataSource={this.state.ds.cloneWithRows(hasWinner ? winner : [])}
                      renderRow={this.renderRow.bind(this, Data.Action.Type)}
                      enableEmptySections={true}
                      onEndReached={loadMore}
                      onEndReachedThreshold={10}
                      renderHeader={this.renderHeader}
                      renderFooter={this.renderFooter}
                      initialListSize={6}
            />
        );

    }

}

const styles = StyleSheet.create({
    tips: {
        fontSize: 12,
        color: '#d90000',
        marginTop: 10,
        marginLeft: 10,
        lineHeight: 25
    },
    fightTips: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        marginLeft: 10,
        lineHeight: 25
    },
    beanListTabBox: {
        height: 44,
        backgroundColor: '#3a66b3',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    beanListTabText: {
        fontSize: 14,
        color: '#fff'
    }
})

