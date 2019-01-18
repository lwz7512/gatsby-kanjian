const path = require(`path`)
const fs = require('fs-extra')

const { createFilePath } = require(`gatsby-source-filesystem`)
const createPaginatedPages = require("gatsby-paginate");

// add public directory clean @2019/01/18
exports.onPreInit = () => {
  console.log('>>>> pre build...');
  let folder = './public';
  fs.emptyDirSync(folder);
}


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        posts: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              excerpt
              fields {
                slug
              }
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    // add pagination @2019/01/18
    createPaginatedPages({
      edges: result.data.posts.edges,
      createPage: createPage,
      pageTemplate: "src/templates/index.js",
      pageLength: 5, // This is optional and defaults to 10 if not used
      pathPrefix: "", // This is optional and defaults to an empty string if not used
      context: {} // This is optional and defaults to an empty object if not used
    });

    // Create blog posts pages.
    const posts = result.data.posts.edges;

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    });

  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
