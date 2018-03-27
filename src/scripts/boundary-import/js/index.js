import $ from 'jquery'
import fetch from 'fetch'
import fs from 'fs'
import mime from 'mime-types'
import DOMParser from 'xmldom'
import polyline from '@mapbox/polyline'
import togeo from '@mapbox/togeojson'
import Noty from 'noty'

// Fetch and place html template
var pageFragment = fetch('/scripts/boundary-import/html/template.html')
    .then(response => response.text())

export default function () {
    Promise.all([pageFragment])
        .then(function (body) {
            $('#boundary').closest('tr').before(body)

            let boundaryBox = $('#boundary')
            let kml = $('#importSchoolBoundary')
            kml.on('change', function (e) {
                let fileList = e.target.files[0]
                let poly = fileProcess(fileList)
                if (!poly) {
                    new Noty({
                        type: 'error',
                        text: 'Invalid FIle Format',
                        animation: {
                            open: 'animated bounceInRight',
                            close: 'animated bounceOutRight'
                        }
                    }).show()
                } else {
                    new Noty({
                        type: 'success',
                        text: 'Polyline Generated',
                        animation: {
                            open: 'animated bounceInRight',
                            close: 'animated bounceOutRight'
                        }
                    }).show()
                    boundaryBox.html(poly)
                }
            })
        })
}

function fileProcess (kmlFile) {
    let kmlMimeType = 'application/vnd.google-earth.kml+xml'
    if (mime.lookup(kmlFile) === kmlMimeType) {
        return poly(kmlFile)
    }
    return false
}

// Polyline generator
function poly (kmlFile) {
    // Polyline variables
    var kml = new DOMParser.DOMParser().parseFromString(fs.readFileSync(kmlFile, 'utf8'))
    var converted = togeo.kml(kml)
    var coords = converted.features[1].geometry.coordinates[0].map(element => {
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