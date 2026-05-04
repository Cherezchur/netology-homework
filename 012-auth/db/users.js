const records = [
  {
    id: 1,
    username: 'user',
    password: '123456',
    displayName: 'demo user',
    emails: [{ value: 'user@mail.ru' }],
  },
  {
    id: 2,
    username: 'Tayler',
    password: 'creater',
    displayName: 'Tayler',
    emails: [{ value: 'tayler@example.com' }],
  },
]

function createUser(userData, cb) {
  process.nextTick(function () {
    const newUser = {
      id: records.length + 1,
      username: userData.username,
      password: userData.password,
      displayName: userData.displayName || userData.username,
      emails: [{ value: userData.email }],
    }

    records.push(newUser)
    cb(null, newUser)
  })
}

function findById (id, cb) {
  process.nextTick(function () {
    const idx = id - 1
    if (records[idx]) {
      cb(null, records[idx])
    } else {
      cb(new Error('User ' + id + ' does not exist'))
    }
  })
}

function findByUsername (username, cb) {
  process.nextTick(function () {
    let i = 0, len = records.length
    for (; i < len; i++) {
      const record = records[i]
      if (record.username === username) {
        return cb(null, record)
      }
    }
    return cb(null, null)
  })
}

function verifyPassword(user, password) {
  return user.password === password
}

export default {
    createUser,
    findById,
    findByUsername,
    verifyPassword,
}