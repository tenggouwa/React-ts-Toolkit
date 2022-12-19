import React, { useState, useEffect } from 'react';
import { Tree, Space, Typography, Button, Empty } from '@arco-design/web-react';
import { IconExclamation } from '@arco-design/web-react/icon';

import { filterFloatAuthAll, filterOpenByAuth } from '@/assets/js/menu.js';


function EditForm ({ visible, onSubmit, close, loading, dataSource, permission }) {
  if (!visible) return (
    <Empty
      icon={<div
        style={{
          marginTop: '30px',
          background: '#f2994b',
          display: 'inline-flex',
          borderRadius: '50%',
          width: 50,
          height: 50,
          fontSize: 30,
          alignItems: 'center',
          color: 'white',
          justifyContent: 'center'
        }}
      >
        <IconExclamation  />
      </div>}
      description='点击编辑按钮修改权限'
    />
  );

  // 针对提交 半选状态 将父ID找出 并放入
  const filterFatherToArray = (list) => {
    if (!list || list.length === 0) return [];
    let copyResult = [];
    list.forEach(item => {
      copyResult.push(...filterOpenByAuth(dataSource, item, 'id'))
    });
    const allResult = [...list, ...copyResult];
    return Array.from(new Set(allResult)).sort((a, b) => a - b);
  }

  // 针对收到数据 半选状态 去除父ID
  const filterDelFather = (list) => {
    const copyList = list.concat()
    const fatherList = dataSource.map(item => item.id);
    for (let i = 0; i < copyList.length; i += 1) {
      if (fatherList.includes(copyList[i])) {
        copyList.splice(i, 1);
      }
    }
    return copyList;
  }

  const onOk = () => {
    const returnVal = filterFatherToArray(checkedKeys)
    onSubmit(returnVal);
  }

  const [checkedKeys, setCheckedKeys] = useState([])
  useEffect(() => {
    if (visible && permission && permission.length > 0) {
      const floatData = filterFloatAuthAll(permission);
      const treeData = filterDelFather(floatData)
      setCheckedKeys(treeData)
    }
  }, [visible])

  return <div>
    <div style={{margin: '20px 0'}}>
      <Typography.Text>修改用户权限</Typography.Text>
    </div>
    <Tree
      showLine
      checkedStrategy="all"
      
      autoExpandParent
      checkable
      fieldNames={{
        key: 'id',
        title: 'name',
        children: 'children'
      }}
      checkedKeys={checkedKeys}
      onCheck={(value, extra) => {
        setCheckedKeys(value)
      }}
      treeData={dataSource}
    />
    <Space size='medium'>
      <Button type='primary' loading={loading} onClick={() => onOk()}>保存</Button>
      <Button onClick={() => close()}>取消</Button>
    </Space>
  </div>
}


export default EditForm;
