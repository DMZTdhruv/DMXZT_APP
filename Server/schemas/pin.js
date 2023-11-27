export default {
  name: 'pin',
  type: 'Pin',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'image',
      type: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'about',
      type: 'About',
      type: 'string',
    },
    {
      name: 'destination',
      type: 'Destination',
      type: 'string',
    },
    {
      name: 'category',
      type: 'Category',
      type: 'string',
    },
    {
      name: 'userId',
      title: 'UserId',
      type: 'string',
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'postedBy',
  },
    {
      name: 'like',
      title: 'Like',
      type: 'array',
      of: [{type: 'like'}],
    },
    {
      name: 'save',
      title: 'Save',
      type: 'array',
      of: [{type: 'save'}],
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'array',
      of: [{type: 'comment'}],
    },
  ],
}
