import $ from 'jquery'
import mime from 'mime-types'
import polyline from '@mapbox/polyline'
import togeo from '@mapbox/togeojson'
import Notyf from 'notyf'
import notyfCss from 'notyf/dist/notyf.min.css'
import template from '../html/template.html'

export default function () {
  let notyf = new Notyf()
  Promise.all([template])
    .then(function (body) {
      $('#boundary').closest('tr').before(body)
      let kml = $('#importSchoolBoundary')
      kml.on('change', async function (e) {
        let fileList = e.target.files[0]
        let poly = await fileProcess(fileList)
        if (!poly) {
          notyf.alert('Invalid file format!')
        } else {
          document.getElementById('boundary').value = poly
          notyf.confirm('Polyline generated!')
        }
      })
    })
}

function fileProcess (kmlFile) {
  let kmlMimeType = 'application/vnd.google-earth.kml+xml'
  if (mime.lookup(kmlFile.name) === kmlMimeType) {
    return poly(kmlFile)
  }
  return false
}

function toRead (inputFile) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new DOMException('Problem Parsing input file.'))
    }
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsText(inputFile)
  })
}

// Polyline generator
async function poly (kmlFile) {
  // Polyline variables
  let fileString = await toRead(kmlFile)
  let kml = new DOMParser().parseFromString(fileString, 'text/xml')
  let converted = togeo.kml(kml)
  let coords = converted.features[1].geometry.coordinates[0].map(element => {
    return element.slice(0, 2)
  })

  return polyline.fromGeoJSON({
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': coords
    },
    'properties': {}
  })
}
