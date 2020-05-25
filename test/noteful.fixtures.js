function makeFoldersArray() {
    return [
      {
        id: 1,
        name: 'test-folder-1',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        name: 'test-folder-2',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        name: 'test-folder-3',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        name: 'test-folder-4',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 5,
        name: 'test-folder-5',
        date_published: '2029-01-22T16:28:32.615Z',
      },
    ]
  }

  function makeNotesArray() {
    return [
      {
        id: 1,
        name: 'test-note-1',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 1,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        name: 'test-note-2',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 1,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        name: 'test-note-3',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 2,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        name: 'test-note-4',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 2,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 5,
        name: 'test-note-5',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 3,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 6,
        name: 'test-note-6',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 3,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 7,
        name: 'test-note-7',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 4,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 8,
        name: 'test-note-8',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 4,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 9,
        name: 'test-note-9',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 5,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 10,
        name: 'test-note-10',
        modified: '2029-01-22T16:28:32.615Z',
        folder_id: 5,
        content: 'content',
        date_published: '2029-01-22T16:28:32.615Z',
      },
    ]
  }
  
module.exports = {
    makeFoldersArray,
    makeNotesArray
}