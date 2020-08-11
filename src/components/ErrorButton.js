import React from 'react'
import {Card, Col, List, Modal, Row} from 'antd'
import {ExclamationCircleFilled} from '@ant-design/icons'
import ErrorInfoItem from './ErrorInfoItem'

const {Meta} = Card

function info(title = 'Case Infos', data, caseAttachInfos) {
  Modal.warning({
    title,
    width: '80%',
    maskClosable: true,
    content: (
        <Row>
          <Col span={24}>
            <ErrorInfoItem data={data} caseAttachInfos={caseAttachInfos}/>
          </Col>
          {!!caseAttachInfos.length && (
              <List
                  header='Attachments'
            bordered
            grid={{ gutter: 16, column: 1 }}
            dataSource={caseAttachInfos}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  bordered
                  style={{ width: '100%' }}
                  cover={<img alt={item.description} src={item.filePath} />}
                >
                  <Meta title={item.description} />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Row>
    ),
  })
}

const ErrorButton = ({fullName, failureMessage, caseAttachInfos = []}) => {
  if (!failureMessage && !caseAttachInfos.length) {
    return null
  }
  return <div
      className='error_button' onClick={() => info(fullName, failureMessage, caseAttachInfos)}
  >
    <ExclamationCircleFilled/>
    Info </div>
}

export default ErrorButton
