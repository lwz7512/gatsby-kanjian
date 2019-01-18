import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>;
  } else {
    return <span>{props.text}</span>;
  }
};

class BlogIndex extends React.Component {

  render() {
    const { data, pageContext } = this.props
    const siteTitle = data.site.siteMetadata.title

    const { group, index, first, last, pageCount } = pageContext;
    const previousUrl = index - 1 == 1 ? "" : (index - 1).toString();
    const nextUrl = (index + 1).toString();
    const hasPrev = index > 1;
    const hasNext = index < pageCount;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <Bio />

        {group.map(({ node }) => (
          <div key={node.fields.slug}>
            <h3
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                {node.frontmatter.title}
              </Link>
            </h3>
            <small>{node.frontmatter.date}</small>
            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          </div>
        ))}

        <div className="pagination-row">
          <div className="previousLink">
            {hasPrev?<NavLink test={first} url={previousUrl} text="Go to Previous Page" />:false}
          </div>
          <div className="nextLink">
            {hasNext?<NavLink test={last} url={nextUrl} text="Go to Next Page" />:false}
          </div>
        </div>

      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
