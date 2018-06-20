require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
const { map, prop, propOr, merge, filter } = require('ramda')

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const getCars = cb =>
  listDocs({ include_docs: true, startkey: 'car_', endkey: 'car_\ufff0' }, cb)

const getMfgs = cb =>
  listDocs(
    { include_docs: true, startkey: 'mfg_', endkey: 'mfg_\ufff0' },
    function(err, mfgs) {
      if (err) {
        cb(err)
        return
      }

      getCars(function(err, cars) {
        if (err) {
          cb(err)
          return
        }

        cb(
          null,
          map(
            mfg =>
              merge(mfg, { cars: filter(car => car.mfgId === mfg._id, cars) }),
            mfgs
          )
        )
      })
      //const changedMfgs = map(mfg => merge(mfg, { cars: [] }), mfgs)
      //cb(null, mfgs)
    }
  )

//////////////////////
/// helper function
//////////////////////

const listDocs = (options, cb) =>
  db.allDocs(options, function(err, result) {
    if (err) cb(err)
    cb(null, map(row => row.doc, result.rows))
  })

/*
db.allDocs({ include_docs: true }, function(err, result) {
  if (err) console.log('Error!', err)
  //console.log('SUCCESS!', map(row => row.doc, result.rows))
  console.log('SUCCESS!', map(prop('doc'), propOr([], 'rows', result)))
})
*/

const dal = { getCars, getMfgs }
module.exports = dal
