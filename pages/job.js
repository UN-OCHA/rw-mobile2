import React from 'react'
import Layout from '../components/Layout'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getJob } from '../actions/actions'
import withRedux from 'next-redux-wrapper'
import ArticleLayout from '../components/article/ArticleLayout'
import Error from './_error'

export class Job extends React.Component {
  static async getInitialProps ({store, isServer, pathname, query}) {
    const id = query.id
    await store.dispatch(getJob(id))
    const reports = store.getState().jobReports
    const report = reports.filter((obj) => {
      return parseInt(obj.id, 10) === parseInt(id, 10)
    })[0]
    return report ? { report } : { error: 404 }
  }

  render () {
    const { report } = this.props
    const title = report && report.fields && report.fields.title ? report.fields.title : ''
    const url = report && report.fields && report.fields.url_alias ? report.fields.url_alias : ''
    return (
      <div>
        {!this.props.error &&
          <Layout title={title} url={url}>
            <ArticleLayout report={report} type='job' />
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
    getJob: bindActionCreators(getJob, dispatch)
  }
}

export default withRedux(initStore, null, mapDispatchToProps)(Job)
