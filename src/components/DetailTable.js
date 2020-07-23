import React, {useState} from 'react'
import {Checkbox, InputNumber, Table, Tooltip} from 'antd'
import {CheckOutlined, CloseOutlined, Loading3QuartersOutlined, PushpinOutlined} from '@ant-design/icons'
import {formatCollapsableData, getFormatTime, getRecordClass, renderRootRowClass} from '@/untils'
import ErrorButton from './ErrorButton'
import {renderStatus as parentRowRenderStatus} from './Table'

const renderStatus = ({status}) => {
  let info
  switch (status) {
    case 'passed':
      info = <span style={{color: 'green'}}>
        <CheckOutlined/>
        <span className='detail_status_text'>{status}</span>
      </span>
      break
    case 'pending':
      info = <span style={{color: '#faad14'}}>
        <Loading3QuartersOutlined/>
        <span className='detail_status_text'>{status}</span>
      </span>
      break
    case 'failed' :
      info = <span style={{color: '#fafafa'}}>
        <CloseOutlined/>
        <span className='detail_status_text'>{status}</span>
      </span>
      break
    case 'todo':
      info = <span style={{ color: '#950098' }} >
        <PushpinOutlined />
        <span className='detail_status_text'>{status}</span>
      </span>
      break
  }
  return info
}

const renderTime = ({
  duration,
  subGroups
}) => !subGroups && getFormatTime(0, duration)

const MAX_TITLE_LENGTH = 85
const renderTitleContent = (title = '') => {
  const len = title.length
  if (len > MAX_TITLE_LENGTH) {
    return title.substr(0, 85) + '...'
  }
  return title
}

const renderTitle = ({ ancestorTitles = [], subGroups, subTitle, title, fullName }) => {
  const sep = ' > '
  const nestedTitle = subGroups ? subTitle : [...ancestorTitles, title].join(sep)
  const tooltip = subGroups ? subTitle : fullName

  return (
    <Tooltip overlayStyle={{ maxWidth: '800px' }} title={tooltip}>
      <span className='inner_path_text'>{renderTitleContent(nestedTitle)}</span>
    </Tooltip>
  )
}

const columns = [
  { title: 'title', key: 'Name', render: renderTitle },
  { title: 'UseTime', key: 'UseTime', render: renderTime, width: '150px' },
  { title: 'status',
    align: 'center',
    width: '150px',
    render: (item) => item.subGroups ? parentRowRenderStatus(item) : renderStatus(item)
  },
  {
    width: '100px',
    title: 'action',
    key: 'operation',
    render: ({failureMessages = [], fullName, fileAttachInfos = {}, subGroups}) => !subGroups &&
        <ErrorButton caseAttachInfos={fileAttachInfos[fullName]} failureMessage={failureMessages[0]}/>
  }
]

const DetailTable = ({ data }) =>
  <Table
    bordered
    size='small'
    showHeader={false}
    rowKey={(_, index) => `${index}`}
    rowClassName={({ status }, index) => getRecordClass(status, index)}
    dataSource={data}
    columns={columns}
    pagination={false} />

const RootTable = ({data = [], mergeLevel = 1}) => {
  const [isMergence, setIsMergence] = useState(mergeLevel > 1)
  const [currentMergeLevel, setMergeLevel] = useState(mergeLevel)

  return (
      <div>
        {data.length > 8 && (
            <div className='merge-box'>
              <Checkbox checked={isMergence} onChange={e => setIsMergence(e.target.checked)}>
                Merge Data
              </Checkbox>
          {isMergence && (
            <span>| Merge Level: <InputNumber size='small' min={1} max={10} value={currentMergeLevel} onChange={setMergeLevel} /></span>
          )}
        </div>
      )}

      <Table
        bordered
        size='small'
        showHeader={false}
        rowKey={(_, index) => `${index}`}
        expandable={{
          expandedRowRender: ({ tests }) => <DetailTable data={tests} />,
          rowExpandable: record => record.subGroups,
        }}
        rowClassName={({ status, subGroups, ...rest }, index) => subGroups
          ? renderRootRowClass({ ...rest }) : getRecordClass(status, index)
        }
        dataSource={isMergence ? formatCollapsableData(data, currentMergeLevel) : data}
        columns={columns}
        pagination={false} />
    </div>
  )
}

export default RootTable
