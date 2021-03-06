/**
 * Individual Report page
 */

import React from 'react'
import Layout from '../components/Layout'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getUpdate } from '../actions/actions'
import withRedux from 'next-redux-wrapper'
import ArticleLayout from '../components/article/ArticleLayout'
import buildKeywords from '../helpers/keywords'
import Error from './_error'
import registerServiceWorker from '../helpers/registerServiceWorker'

export class Report extends React.Component {
  static async getInitialProps ({store, isServer, pathname, query}) {
    const id = query.id
    await store.dispatch(getUpdate(id))
    const reports = store.getState().updateReports
    const report = reports.filter((obj) => {
      return parseInt(obj.id, 10) === parseInt(id, 10)
    })[0]
    return report ? { report } : { error: 404 }
  }

  componentDidMount () {
    registerServiceWorker()
  }

  render () {
    const { report } = this.props
    const title = report && report.fields && report.fields.title ? report.fields.title : ''
    const url = report && report.fields && report.fields.url_alias ? report.fields.url_alias : ''
    const keywords = report && report.fields ? buildKeywords(report.fields) : ''
    return (
      <div>
        {!this.props.error &&
          <Layout title={title} url={url} keywords={keywords}>
            <ArticleLayout report={report} />
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
    getUpdate: bindActionCreators(getUpdate, dispatch)
  }
}

export default withRedux(initStore, null, mapDispatchToProps)(Report)
