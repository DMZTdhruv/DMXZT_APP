export default {
  name: 'replyComment',
  title: 'ReplyComment',
  type: 'document',
  fields: [
    {
      name: 'commentId',
      title: 'CommentId',
      type: 'string',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'array',
      of: [{type: 'comment'}],
    },
  ],
}
