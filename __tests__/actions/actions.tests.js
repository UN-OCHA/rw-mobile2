/* eslint-env jest */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/actions'
import * as actionTypes from '../../constants/actionTypes'
import { mockFeatured, mockHeadlines, mockReports } from '../../__fixtures__/data.fixture'

jest.mock('../../services/requests')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Get Updates', () => {
  it('creates GET_UPDATES when has fetched updates and returns the items and info', () => {
    const expectedActions = [{
      type: actionTypes.GET_UPDATES,
      items: mockReports,
      loadMore: false,
      pageNumber: 1,
      pagination: false
    }]
    const store = mockStore({
      updates: {}
    })
    return store.dispatch(actions.getUpdates()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('returns the correct page number and loadMore flag to GET_UPDATES when load more', () => {
    const expectedActions = [{
      type: actionTypes.GET_UPDATES,
      items: mockReports,
      loadMore: true,
      pageNumber: 2,
      pagination: false
    }]
    const store = mockStore({
      updates: {}
    })
    return store.dispatch(actions.getUpdates(2, true)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('returns the correct page number and loadMore flag to GET_UPDATES when load a paginated page', () => {
    const expectedActions = [{
      type: actionTypes.GET_UPDATES,
      items: mockReports,
      loadMore: false,
      pageNumber: 4,
      pagination: true
    }]
    const store = mockStore({
      updates: {}
    })
    return store.dispatch(actions.getUpdates(4, false, true)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('does not create GET_UPDATES if have recently fetched data', () => {
    const d = new Date()
    d.setSeconds(d.getSeconds() - 30)

    const expectedActions = []
    const store = mockStore({
      updates: {
        lastFetched: d.toString()
      }
    })
    return store.dispatch(actions.getUpdates(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('does not create GET_UPDATES if going back to a paginated page', () => {
    const expectedActions = []
    const store = mockStore({
      updates: {}
    })
    return store.dispatch(actions.getUpdates(5, false, false)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

describe('Get Featured', () => {
  it('creates GET_FEATURED when has fetched featured and returns the items', () => {
    const expectedActions = [{
      type: actionTypes.GET_FEATURED,
      items: mockFeatured
    }]
    const store = mockStore({
      featured: {}
    })
    return store.dispatch(actions.getFeatured()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('does not create GET_FEATURED if have recently fetched data', () => {
    const d = new Date()
    d.setSeconds(d.getSeconds() - 30)

    const expectedActions = []
    const store = mockStore({
      featured: {
        lastFetched: d.toString()
      }
    })
    return store.dispatch(actions.getFeatured()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

describe('Get Headlines', () => {
  it('creates GET_HEADLINES when has fetched headlines and returns the items', () => {
    const expectedActions = [{
      type: actionTypes.GET_HEADLINES,
      items: mockHeadlines
    }]
    const store = mockStore({
      headlines: {}
    })
    return store.dispatch(actions.getHeadlines()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('does not create GET_HEADLINES if have recently fetched data', () => {
    const d = new Date()
    d.setSeconds(d.getSeconds() - 30)

    const expectedActions = []
    const store = mockStore({
      headlines: {
        lastFetched: d.toString()
      }
    })
    return store.dispatch(actions.getHeadlines()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})