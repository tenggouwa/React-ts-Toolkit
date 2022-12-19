import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { getMenuInfo } from '@/redux/reducer';
// import { compose } from 'lodash/fp'

// 公共路由钩子方法
// @withRouter
// @connect(state => ({
//     userAuth: state.userAuth,
//     swith: state.swith,
//     getMenuInfo: state.getMenuInfo,
//     clearUserAuth: state.clearUserAuth,
//     setWs: state.setWs,
//     setWsData: state.setWsData,
//     clearWsData: state.clearWsData,
//     sessionId: state.sessionId,
//     saveSessionId: state.saveSessionId,
//     setWsStatus: state.setWsStatus,
//     wsObj: state.wsObj,
//     sendWs: state.sendWs,
//     langSrc: state.langSrc,
//     lang: state.lang,
// }))
// export default class Hook extends Component {
//     componentWillMount() {
//         const {
//             dispatch,
//             getMenuInfo,
//             history,
//         } = this.props
//         compose(dispatch, getMenuInfo)()
//         window.t = function t(path = '.', src = langSrc[lang].translation) {
//             const pathArray = path.split('.')
//             return pathArray.length > 2 ? src[pathArray[0]][pathArray[1]][pathArray[2]] : src[pathArray[0]][pathArray[1]]
//         }
//         window.routerHistory = history
//     }
//     componentWillReceiveProps(props) {
//         const { userAuth } = localStorage
//         // if (props.userAuth === 0 || !props.userAuth) {
//         //     if (this.props.location !== props.location && JSON.stringify(props.userAuth) !== userAuth
//         //     ) {
//         //         this.props.dispatch(this.props.clearUserAuth())
//         //         this.props.dispatch(this.props.getUserAuth())
//         //     }
//         // }
//         const { pathname, search } = props.location

//         if (JSON.stringify(props.userAuth) === '0' &&
//             (pathname.startsWith('/community'))) {
//             this.props.dispatch(this.props.clearUserAuth())
//             localStorage.userAuth = 0
//             props.history.replace(`/login?backUrl=${encodeURIComponent(pathname)}${encodeURIComponent(search)}`)
//         }
//         // if (props.userAuth && !props.userAuth.isFutureTradeAuth && pathname.startsWith('/trade/futures')) {
//         //     props.history.replace('/common/futures')
//         // }
//         // if (props.userAuth && props.userAuth.isFutureTradeAuth && localStorage.pathName.startsWith('/common/futures')) {
//         //     props.history.replace('/trade/futures')
//         // }
//         if (JSON.stringify(props.userAuth) !== '0' && (props.userAuth !== this.props.userAuth)) { // 当前是登录状态
//             if (search.indexOf('inviteCode') !== -1) { // 找到邀请码
//                 props.history.replace('/invite')
//             }
//         }
//         if (props.history !== this.props.history) {
//             window.routerHistory = this.props.history
//         }
//     }
//     render() {
//         return null
//     }
// }

declare global {  //设置全局属性
  interface Window {  //window对象属性
    routerHistory: any;   //加入对象
  }
}

const hookComponents: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMenuInfo());
    window.routerHistory = history;
  }, [])

  return null
}

export default hookComponents