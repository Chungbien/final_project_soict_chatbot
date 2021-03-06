import { Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as botActions from '../../actions/bot';
import * as modalActions from '../../actions/modal';
import { toastMsgError } from '../../commons/Toastify';
import Bot from '../../components/Bot';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import { ZALO_URL_GET_TOKEN } from '../../constants';
import * as messageConstans from '../../constants/Messages';
import { TYPE_MODAL } from '../../constants/modal';
import BotForm from './BotForm';
import styles from './styles';

class LobbyPage extends Component {
    renderAllChatBot = () => {
        const { listBot } = this.props;
        let xhtml = null;
        if (listBot !== null && listBot !== undefined && listBot.length > 0) {
            xhtml = listBot.map((bot, index) => {
                return (
                    <Grid item xs={12} md={6} lg={3} key={index}>
                        <Bot
                            data={bot}
                            handleDelete={this.handleConfirmDeleteBot}
                        />
                    </Grid>
                );
            });
        }
        return xhtml;
    };

    renderBotForm = () => {
        const {
            open,
            modalActionCreators,
            typeModal,
        } = this.props;
        const { hideModal } = modalActionCreators;
        let xhtml = null;
        if (typeModal === TYPE_MODAL.CONFIRM) {
            xhtml = (
                <BotForm>
                    <ConfirmModal
                        formName={TYPE_MODAL.CONFIRM}
                        open={open}
                        handleSubmitBot={this.handleDeleteBot}
                        handleDelete={this.handleDeleteBot}
                        handleClose={hideModal}
                    />
                </BotForm>
            );
        }
        return xhtml;
    };

    handleDeleteBot = data => {
        const { botActionCreators, botDelete } = this.props;
        const { deleteBot } = botActionCreators;
        let { confirmName } = data;
        let { name } = botDelete;
        if (confirmName === name) {
            deleteBot(botDelete._id, botDelete.name);
        } else {
            toastMsgError(messageConstans.ERROR_MESSAGE);
        }
    };

    handleConfirmDeleteBot = bot => {
        const { modalActionCreators, botActionCreators } = this.props;
        const { showModal } = modalActionCreators;
        const { confirmDeleteBot } = botActionCreators;
        showModal(TYPE_MODAL.CONFIRM);
        confirmDeleteBot(bot);
    };

    componentDidMount() {
        const { botActionCreators, match } = this.props;
        const { fetchAllBots } = botActionCreators;
        let { newBotId } = match.params;
        if (newBotId === undefined) {
            fetchAllBots({ newBotId: -1 });
        } else {
            fetchAllBots({ newBotId });
        }
    }
    handleOpenPageGetToken = () => {
        window.location.href = ZALO_URL_GET_TOKEN;
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} spacing={2}>
                <div>
                    <Button
                        className={classes.btnAdd}
                        onClick={this.handleOpenPageGetToken}
                    >
                        <AddIcon
                            style={{
                                display: 'inline-block',
                                marginRight: '8px',
                            }}
                        />
                        Thêm chatbot mới
                    </Button>
                </div>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    {this.renderAllChatBot()}
                </Grid>
                {this.renderBotForm()}
            </div>
        );
    }
}

LobbyPage.propTypes = {
    classes: PropTypes.object,
    listBot: PropTypes.array,
    modalActionCreators: PropTypes.shape({
        showModal: PropTypes.func,
        changeTitle: PropTypes.func,
        hideModal: PropTypes.func,
        changeBotEdit: PropTypes.func,
    }),
    botActionCreators: PropTypes.shape({
        fetchAllBots: PropTypes.func,
        deleteBot: PropTypes.func,
    }),
    open: PropTypes.bool,
    title: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        listBot: state.bot.listBot,
        botEdit: state.modal.botEdit,
        botDelete: state.bot.botDelete,
        open: state.modal.open,
        title: state.modal.title,
        typeModal: state.modal.typeModal,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        modalActionCreators: bindActionCreators(modalActions, dispatch),
        botActionCreators: bindActionCreators(botActions, dispatch),
    };
};
const connectRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withStyles(styles), connectRedux)(LobbyPage);
