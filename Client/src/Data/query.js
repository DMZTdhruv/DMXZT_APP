export const userQuery = userId => {
  const query = `*[_type == 'user' && _id == '${userId}']`
  return query
}

export const searchQuery = searchTerm => {
  const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*' ] {
    image {
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    postedBy -> {
      _id,
      username,
      userId,
      image {
        asset -> {
          url
        }
      },
    },
    comment[]{
      date,
      id,
      _key,
      userComment,
      username,
      image,
      postedBy,
    },
    userId,
    like[] {
      postedBy,
      _key,
      userId,
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        username,
        image,
      },
      userId,
    },
  }`
  return query
}

export const userProfile = id => {
  const query = `*[_type == 'userSection' && googleId == '${id}']{
    _id,
    banner {
      asset -> {
        url
      }
    },
    googleId,
    image {
      asset -> {
        url
      }
    },
    bannerPosition,
    username,
    about,
  }`
  return query
}

export const likeQuery = id => {
  const query = `*[_type == 'pin' && _id == '${id}']{
    like
  }`
  return query
}

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
  image {
    asset -> {
      url
    }
  },
  _id,
  title,
  about,
  category,
  destination,
  postedBy -> {
    _id,
    username,
    userId,
    image {
      asset -> {
        url
      }
    },
  },
  comment[]{
    date,
    id,
    _key,
    userComment,
    username,
    image,
    postedBy,
  },
  userId,
  like[] {
    postedBy,
    _key,
    userId,
  },
  save[] {
    _key,
    postedBy -> {
      _id,
      username,
      image,
    },
    userId,
  },
}`

export const deleteQuery = id => {}

export const commentQuery = id => {
  const query = `*[_type == 'pin' && _id == '${id}']{
    comment[]{
      date,
      id,
      _key,
      userComment,
      username,
      image,
      postedBy,
    }
  }`
  return query
}

export const pinDetailQuery = pinId => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image {
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    postedBy -> {
      _id,
      username,
      image {
        asset -> {
          url
        }
      },
    },
    comment[] {
      date,
      _key,
      id,
      postedBy,
      userComment,
      username,
      image,
    },
    userId,
    like[] {
      postedBy,
      _key,
      userId,
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        username,
        image
      },
      userId,
    },
  }`
  return query
}

export const pinDetailMorePinQuery = pin => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ] | order(_createdAt desc) {
    image {
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    postedBy -> {
      _id,
      username,
      image {
        asset -> {
          url
        }
      },
    },
    comment[] {
      date,
      _key,
      id,
      postedBy,
      userComment,
      username,
      image,
    },
    userId,
    like[] {
      postedBy,
      _key,
      userId,
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        username,
        image
      },
      userId,
    },
  }`
  return query
}

export const userPinQuery = id => {
  const query = `*[_type == 'pin' && userId == '${id}'] | order(_createdAt desc) {
    image {
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    postedBy -> {
      _id,
      username,
      image {
        asset -> {
          url
        }
      },
    },
    comment[] {
      date,
      _key,
      id,
      postedBy,
      userComment,
      username,
      image,
    },
    userId,
    like[] {
      postedBy,
      _key,
      userId,
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        username,
        image
      },
      userId,
    },
  }`
  return query
}
export const userSavedQuery = id => {
  const query = `*[_type == 'pin' && '${id}' in save[].userId] | order(_createdAt desc) {
    image {
      asset -> {
        url
      }
    },
    _id,
    title,
    about,
    category,
    destination,
    postedBy -> {
      _id,
      username,
      image {
        asset -> {
          url
        }
      },
    },
    comment[] {
      date,
      _key,
      id,
      postedBy,
      userComment,
      username,
      image,
    },
    userId,
    like[] {
      postedBy,
      _key,
      userId,
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        username,
        image
      },
      userId,
    },
  }`
  return query
}
