import { CustomError } from "../errors/CustomError.js"
import { ErrorPossibilities } from "../errors/SessionErrors.js"
import {randomBytes} from "crypto"

export const create_session = (req, res, next) => {
    const {profId, userId, role} = req.body
    const session_id = randomBytes(16).toString("hex")
    new Promise((resolve, reject) => {
        memcached.set(session_id, JSON.stringify({ profId, userId, role }), 604800, (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(session_id)
        });
    }).then((data) => {
        console.log(data)
        res.status(200).send(data)
    }).catch((err) => {
        const error_response = new ErrorPossibilities(err.name).all()
        res.status(500).send(error_response)
    })
}

export const get_session = async (req, res, next) => {
    const {session} = req.body
    new Promise((resolve, reject) => {
        memcached.get(session, (err, session) => {
            if (err) {
                return reject(err)
            }
            resolve(session)            
        });
    }).then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        const error_response = new ErrorPossibilities(err.name).all()
        res.status(500).send(error_response)
    })
}

export const delete_session = async (req, res, next) => {
    try {   
        const {session} = req.body
        memcached.del(session, (err) => {
            if (err) return console.log(err)
            res.status(200).send('success')
        });
    } catch (error) {
        console.log(error)
    }
}