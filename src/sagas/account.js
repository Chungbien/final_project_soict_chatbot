import { call } from '@redux-saga/core/effects';
import * as accountApis from '../apis/account';
import { toastMsgError, toastSuccess } from '../commons/Toastify';
import { STATUS_RESPONSE } from '../constants/index';
import history from '../containers/App/history';

export function* signUpAccount({ payload }) {
    const resp = yield call(accountApis.signUpAccount, payload.data);
    const { status, message } = resp.data;
    if (STATUS_RESPONSE.CREATED === status) {
        toastSuccess('Tạo tài khoản thành công ');
        history.push('/sign-in');
    } else {
        toastMsgError('Lỗi:  ' + status + ' - ' + message);
    }
}

export function* signInAccount({ payload }) {
    const resp = yield call(accountApis.signInAccount, payload.data);
    const { status, message } = resp.data;
    if (STATUS_RESPONSE.OK === status) {
        const { account } = resp.data;
        const { firstName, lastName, userEmail } = account;
        window.localStorage.setItem('token', resp.data.access_token);
        window.localStorage.setItem('name', `${firstName} ${lastName}`);
        window.localStorage.setItem('userMail', userEmail);
        history.push('/');
    } else {
        toastMsgError('Lỗi:  ' + status + ' - ' + message);
    }
}
