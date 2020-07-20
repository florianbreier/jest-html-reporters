import React from 'react'
import Information, {SimpleBarChart} from '@/components/Information'
import {BarChart, PieChart} from 'recharts'
import {mount} from 'enzyme'

const mockProps = {
  config: {
    rootDir: '/root/dir/name',
    maxWorkers: 7
  },
  startTime: Date.parse("2018-09-29T05:58:51.831Z").valueOf().toString(10),
  endTime: Date.parse("2018-09-29T05:58:54.761Z").valueOf().toString(10),
  testResults: [],
}

describe('test Information component', () => {
  const wrapper = mount(<Information {...mockProps} />)
  test('there should have a main information area to display main information', () => {
    expect(wrapper.find('div.main_information')).toExist()
  })

  test('there should have a main BarChart area to display bar chart', () => {
    expect(wrapper.find(SimpleBarChart)).toExist()
    expect(wrapper.find(BarChart)).toExist()
  })

  test('there should have a main PieChart area to display pie chart', () => {
    expect(wrapper.find(PieChart)).toExist()
  })

  test('main information area shoule container stuff informations', () => {
    // start time
    expect(wrapper.find('div.main_information')).toIncludeText('2018-09-29 ')
    expect(wrapper.find('div.main_information')).toIncludeText(':58:51')
    // time
    expect(wrapper.find('div.main_information')).toIncludeText('00:02.930')
    // root dir
    expect(wrapper.find('div.main_information')).toIncludeText('/root/dir/name')
    // max worker
    expect(wrapper.find('div.main_information')).toIncludeText(7)
  })
})
