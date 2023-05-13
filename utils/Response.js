export function success(res, message){
    return res.status(200).json({
        success: 1,
        message: message
    })
}

export function fail(res, message){
    return res.status(200).json({
        success: 0,
        message: message
    })
}

export function system(res, err){
    // TODO
    // log error
    // create reference id
    console.log(err)
    return res.status(200).json({
        success: -1,
        message: 'Failed, Please contact support',
        reference: "f586bc4430cd",
        err: err
    })
}

export function custom(res, message, code){
    return res.status(200).json({
        success: code,
        message: message
      })
}