export function filterAuthority(authorityArr) {
  let min = 0
  let result = ''
  authorityArr.forEach(item => {
    const tempNum = item.split('-')
    if (tempNum.length > min) {
      min = tempNum.length
      result = item
    } else if (tempNum.length === min.length) {
      if (parseInt(tempNum, 10) < parseInt(min, 10)) {
        min = tempNum
        result = item
      }
    }
  })
  return result
}

export function filterAuthByPath (dataSource, path) {
  const delPath = changeColon2Slash(path.slice(1), false);
  if (dataSource && dataSource.length > 0) {
    let auth;
    const recursionFun = (list) => {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        if (item.authority === delPath) {
          auth = item.authority
          break;
        }
        if (item.children && item.children.length > 0) {
          recursionFun(item.children)
        }
      }
    }
    recursionFun(dataSource)
    return auth
  }
}

export function filterOpenByAuth(dataSource, auth, key) {
  if (!auth || !Array.isArray(dataSource)) return []
    const result = []
    let valid = false
    const seek = (dataSource, auth) => {
        let parentValue = ''
        const up = (dataSource, auth, lastValue) => {
          dataSource.forEach(v => {
                const val = v[key]
                const child = v.children
                if (val === auth) {
                    valid = true
                    parentValue = lastValue
                    return
                }
                if (child && child.length) up(child, auth, val)
            })
        }
        up(dataSource, auth)
        if (parentValue) {
            result.unshift(parentValue)
            seek(dataSource, parentValue)
        }
    }
    seek(dataSource, auth)
    return valid ? [...result] : []
}

export function changeColon2Slash (val, type = true) {
  if (!val) return '';
  if (!type) return val.replace('/', ':');
  return val.replace(':', '/');
}

export function filterComponentByAuth(dataSource, key) {
  if (!dataSource || dataSource.length === 0) return false;
  const itemArr = dataSource.filter(item => changeColon2Slash(key) === item.key);
  if (itemArr && itemArr.length > 0) {
    return itemArr[0].component;
  }
  return null;
}

export function filterFloatAuthAll(dataSource) {
  if (dataSource && dataSource.length > 0) {
    let authList = [];
    const recursionFun = (list) => {
      for(var i in list){
        authList.push(list[i].id) //将第一层的那么保存出来，
        if(list[i].children && list[i].children.length > 0) { //如果有children层，则继续遍历
          recursionFun(list[i].children)
        }
      }
      return authList
    }
    recursionFun(dataSource)
    return authList
  }
}