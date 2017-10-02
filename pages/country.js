import React from 'react'
import Layout from '../components/Layout'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getCountry, getReports } from '../actions/actions'
import withRedux from 'next-redux-wrapper'
import PaginatedReportsList from '../components/lists/PaginatedReportsList'
import { Arrow } from '../components/icons/Icons'
import { smallButton } from '../theme/buttons'
import { breakpoints, colors, fonts, fontSizes, measurements } from '../theme/variables'
import Error from './_error'

export class Country extends React.Component {
  static async getInitialProps ({store, isServer, pathname, query}) {
    const id = query.id
    let pageNumber = query && query.page ? query.page : 1
    const showPagination = isServer && pageNumber > 1
    await store.dispatch(getCountry(id))
    const countries = store.getState().countryReports
    const country = countries.filter((obj) => {
      return parseInt(obj.id, 10) === parseInt(id, 10)
    })[0]
    if (country) {
      const searchQuery = `country.exact:"${country.fields.name}"`
      await store.dispatch(getReports(1, false, true, searchQuery))
      return {
        canLoadMore: store.getState().reports.canLoadMore,
        currentPage: pageNumber,
        showPagination: showPagination,
        query: searchQuery,
        country: country
      }
    }
    return {
      error: 404
    }
  }

  render () {
    const { country } = this.props
    const title = country && country.fields && country.fields.name ? country.fields.name : ''
    const url = country && country.fields && country.fields.url_alias ? country.fields.url_alias : ''
    return (
      <div>
        {!this.props.error &&
          <Layout title={title} url={url}>
            <div className='heading-container'>
              <h1 className='section-heading'>{title}</h1>
              <a href={`https://reliefweb.int/country/${country.fields.iso3}`} target='_blank' className='btn-small'>
                Full country information
                <span className='icon-holder'><Arrow direction='right' /></span>
              </a>
            </div>
            <PaginatedReportsList
              canLoadMore={this.props.canLoadMore}
              query={this.props.query}
              reportsType='report'
              showPagination={this.props.showPagination} />
            <style jsx>{smallButton}</style>
            <style jsx>{`
              .heading-container {
                position: relative;
              }
              .section-heading {
                font-size: ${fontSizes.mediumLarge};
                font-family: ${fonts.heading};
                font-weight: normal;
                border-bottom: 1px solid ${colors.border.highlight};
                padding-bottom: ${measurements.baseUnit / 2}em;
                margin: ${measurements.baseUnit * 1.5}em 0 0 0;
              }
              .btn-small {
                margin: ${measurements.baseUnit * 2}em 0 ${measurements.baseUnit}em 0;
              }
              .icon-holder {
                display: inline-block;
                width: 10px;
                height: 10px;
                line-height: 10px;
                margin-left: 4px;
              }
              @media (min-width: ${breakpoints.md}) {
                .section-heading {
                  font-size: ${fontSizes.large};
                  margin: ${measurements.baseUnit * 2}em 0 ${measurements.baseUnit}em 0;
                  padding-right: 200px;
                }
                .btn-small {
                  position: absolute;
                  right: 0;
                  bottom: 4px;
                }
              }
            `}</style>
          </Layout>
        }
        {this.props.error &&
          <Error statusCode={this.props.error} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCountry: bindActionCreators(getCountry, dispatch),
    getReports: bindActionCreators(getReports, dispatch)
  }
}

export default withRedux(initStore, null, mapDispatchToProps)(Country)
