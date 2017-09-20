import Link from 'next/link'
import React from 'react'
import ReactDOM from 'react-dom'
import formatDate from '../../helpers/formatDate'
import InfoLinks from '../links/InfoLinks'
import { breakpoints, colors, fontSizes, measurements } from '../../theme/variables'

const renderDate = (date) => {
  let dateStr = ''
  if (date.created) {
    return formatDate(date.created)
  }
  if (date.closing) {
    return `Valid until ${formatDate(date.closing)}`
  }
  if (date.start && date.end) {
    dateStr = date.start === date.end ? `On ${formatDate(date.start)}` : `From ${formatDate(date.start)} to ${formatDate(date.end)}`
  }
  if (date.registration) {
    dateStr += ` - Registration before ${formatDate(date.registration)}`
  }
  return dateStr
}

const formatPaths = (report, reportsType = 'update') => {
  const { id, urlCountry, urlTitle } = report
  const type = reportsType === 'update' ? 'report' : reportsType
  let hrefPath = `/${type}?id=${id}`
  let linkPath = urlCountry && reportsType !== 'disaster' ? `/${type}/${id}/${urlCountry}/${urlTitle}` : `/${type}/${id}/${urlTitle}`
  return {
    href: hrefPath,
    link: linkPath
  }
}

class ReportLink extends React.Component {
  componentDidMount () {
    if (this.props.focusId === this.props.report.id) {
      ReactDOM.findDOMNode(this.refs.theLink).focus()
    }
  }

  render () {
    const { fields } = this.props.report
    const headingLevel = this.props.headingLevel || '2'
    const title = fields.title ? fields.title : fields.name
    const sources = fields.source ? fields.source : []
    const disasterTypes = fields.type ? fields.type : ''
    const countries = fields.primary_country ? [fields.primary_country] : fields.country
    const linkPath = formatPaths(this.props.report, this.props.reportsType).link
    const hrefPath = formatPaths(this.props.report, this.props.reportsType).href
    return (
      <div className='report'>
        {headingLevel === '2' &&
          <h2 className='title'>
            <Link prefetch as={linkPath} href={hrefPath}>
              <a ref='theLink'>{title}</a>
            </Link>
          </h2>
        }
        {headingLevel === '3' &&
          <h3 className='title'>
            <Link prefetch as={linkPath} href={hrefPath}>
              <a ref='theLink'>{title}</a>
            </Link>
          </h3>
        }
        {fields.date &&
          <p className='date'>{renderDate(fields.date)}</p>
        }
        {!fields.date && this.props.reportsType === 'training' &&
          <p className='date'>Ongoing course</p>
        }
        {fields.status &&
          <p className={`status ${fields.status}`}>{fields.status}</p>
        }
        <InfoLinks countries={countries} sources={sources} disasterTypes={disasterTypes} searchType={this.props.reportsType} type='summary' />
        <style jsx>{`
          .report {
            border-bottom: 1px solid ${colors.border.light}
            padding: ${measurements.baseUnit * 1.5}em 0 ${measurements.baseUnit}em 0;
            word-break: break-word;
          }
          p {
            line-height: initial;
          }
          .title {
            margin-bottom: ${measurements.baseUnit}em;
          }
          .title a {
            color: ${colors.text.body};
            font-weight: bold;
            text-decoration: none;
          }
          .title a:hover {
            text-decoration: underline;
          }
          .date, .status {
            font-size: ${fontSizes.small};
            margin-bottom: ${measurements.baseUnit * 1.5}em;
          }
          .status {
            text-transform: uppercase;
            font-size: ${fontSizes.tiny};
            display: flex;
            align-items: center;
            line-height: 1;
          }
          .status:before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            margin-right: 4px;
            border-radius: 100%;
            background: ${colors.status.past};
          }
          .status.alert:before {
            background: ${colors.status.alert};
          }
          .status.current:before {
            background: ${colors.status.current};
          }
          @media (min-width: ${breakpoints.md}) {
            .report {
              float: left;
              width: 49%;
            }
            .report:nth-child(odd) {
              margin-right: 1%;
            }
            .report:nth-child(even) {
              margin-left: 1%;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default ReportLink
