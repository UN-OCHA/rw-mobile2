/* eslint-env jest */
import { getCountries, requestFeatured, requestHeadlines, requestUpdate, requestUpdates } from '../../services/requests.js'
import { mockCountries, mockDisasters, mockEndpoints, mockHeadlines, mockReports, mockUpdate } from '../../__fixtures__/data.fixture'
jest.mock('../../services/shuffleArray')
const fetchMock = require('fetch-mock')
let result

describe('API requests', () => {
  describe('Get Featured', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.featuredCountries, {data: mockCountries})
      fetchMock.get(mockEndpoints.featuredDisasters, {data: mockDisasters})
      result = await requestFeatured()
    })

    it('calls the featured countries endpoint', () => {
      expect(fetchMock.called(mockEndpoints.featuredCountries)).toBe(true)
    })

    it('calls the featured disasters endpoint', () => {
      expect(fetchMock.called(mockEndpoints.featuredDisasters)).toBe(true)
    })

    it('returns 6 from the merged and shuffled array data', () => {
      // shuffle is mocked to return first and last 4 items of the array
      expect(result.length).toBe(6)
      expect(result[0].id).toEqual(mockCountries[0].id)
      expect(result[5].id).toEqual(mockDisasters[7].id)
    })

    it('adds the type to each result', () => {
      expect(result[0].type).toBe('country')
      expect(result[5].type).toBe('disaster')
    })

    it('formats and adds the url name to each result', () => {
      expect(result[0].urlName).toBe('a-country-name-0')
      expect(result[5].urlName).toBe('oh-no-a-disaster-name-7')
    })
  })

  describe('Get Headlines', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.headlines, {data: mockHeadlines})
      result = await requestHeadlines()
    })

    it('calls the featured countries endpoint', () => {
      expect(fetchMock.called(mockEndpoints.headlines)).toBe(true)
    })

    it('returns the data', () => {
      expect(result[0].id).toEqual(mockHeadlines[0].id)
      expect(result[1].fields.title).toEqual(mockHeadlines[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result[0].urlTitle).toBe('report-something-words-en-uk-0')
    })
  })

  describe('Get Updates', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.updates, mockReports)
      result = await requestUpdates()
    })

    it('calls the updates endpoint', () => {
      expect(fetchMock.called(mockEndpoints.updates)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockReports.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockReports.data[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('report-something-words-en-uk-0')
    })
  })

  describe('Get next page of updates', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.updatesPage2, mockReports)
      result = await requestUpdates(10)
    })

    it('calls the updates endpoint with offset set to 10', () => {
      expect(fetchMock.called(mockEndpoints.updatesPage2)).toBe(true)
    })
  })

  describe('Get queried Updates', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.queryUpdates, mockReports)
      result = await requestUpdates(0, 10, 'country.exact:"Syria"')
    })

    it('calls the update endpoint with the query', () => {
      expect(fetchMock.called(mockEndpoints.queryUpdates)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockReports.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockReports.data[1].fields.title)
    })
  })

  describe('Get Countries', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.countries, {data: mockCountries})
      result = await getCountries()
    })

    it('calls the countries endpoint', () => {
      expect(fetchMock.called(mockEndpoints.countries)).toBe(true)
    })

    it('returns the data', () => {
      expect(result[0].id).toEqual(mockCountries[0].id)
      expect(result[1].fields.title).toEqual(mockCountries[1].fields.title)
    })

    it('adds the type to each result', () => {
      expect(result[0].type).toBe('country')
    })

    it('formats and adds the url name to each result', () => {
      expect(result[0].urlName).toBe('a-country-name-0')
    })
  })

  describe('Get an Update', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.update, {data: mockUpdate})
      result = await requestUpdate(100)
    })

    it('calls the update endpoint', () => {
      expect(fetchMock.called(mockEndpoints.update)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockUpdate.id)
      expect(result.fields.title).toEqual(mockUpdate.fields.title)
    })
  })
})
