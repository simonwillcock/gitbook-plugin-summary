const fs = require('fs'),
      glob = require('glob'),
      jsonMark = require('jsonmark'),
      path = require('path')

function generateEntry( title, path, readmeFilename ) {
  let depth = path.match(/\//g).length

  if ( path.indexOf( readmeFilename ) === -1 )
    depth++

  if (depth === 1){
    return generateSection(title);
  }

  return `${Array(depth).join('    ')}- [${title}](${path})\n`
}

function generateSection( title , sectionFilename) {
  return `\n## ${title}\n`
}

module.exports = {
  hooks: {
    init: function () {
      const root = this.resolve(''),
            bookTitle = this.config.get('title'),
            readmeFilename = this.config.get('structure.readme'),
            sectionFilename = this.config.get('pluginConfig.summary.section'),
            summaryFilename = this.config.get('structure.summary');

      glob(
        `*/**/*.md`,
        {
          cwd: root
        },
        ( err, files ) => {
          let summaryContent = ( bookTitle ? `# ${bookTitle}\n\n` : '' )
          console.log(sectionFilename)
          files.forEach( ( filePath ) => {
            if (filePath.indexOf("node_modules") === -1)
            {
              console.log(`Parsing: ${root}/${filePath}`);
              const markdown = jsonMark.parse( fs.readFileSync( `${root}/${filePath}`, { encoding: 'utf8' } ) ),
                    fileTitle = markdown.order[0] || filePath;
              if ( filePath.indexOf( sectionFilename ) !== -1  && 1 == 2) {
                summaryContent += generateSection( fileTitle, sectionFilename );
              } else {
                summaryContent += generateEntry( fileTitle, filePath, readmeFilename );
              }
            }
          })
          console.log(`${root}/${summaryFilename}`);
          fs.writeFileSync( `${root}/${summaryFilename}`, summaryContent, { encoding: 'utf8' } )

          console.log(`\x1b[36mgitbook-plugin-summary: \x1b[32m${summaryFilename} generated successfully.`)
        }
      )
    }
  }
}
