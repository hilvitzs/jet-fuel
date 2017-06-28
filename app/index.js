const addFolderBtn = $('.folder-submit')
const folders = $('.folders')
const submitURL = $('.url-submit')

submitURL.on('click', () => {
  addLink()
})


addFolderBtn.on('click', () => {
  let userInput = $('.folder-input')
  addFolder(userInput.val())
  getFolders()
  userInput.val('')
})


const addFolder = (input) => {
  fetch('/api/v1/folders',
  {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: input })
  })
}

const getFolders = () => {
  fetch('/api/v1/folders',
  {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json())
    .then(folders => prepend(folders))
}

const prepend = (array) => {
  array.map(folder => {
    return folders.prepend(`<section class='folder'>
      <img src='./assets/images/folder.png'/>
      <p>${folder.title}</p>
    </section>`)
  })
}

const addLink = () => {
  const folderTitle = $('.folder-selection').val()
  const url = $('.url-input').val()

  fetch('/api/v1/folders',
  {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json())
    .then(folders => {
      const foundFolder = folders.find(folder => folder.title === folderTitle)
      return postLink(url, foundFolder)
    })
}

const postLink = (url, folder) => {
  fetch(`/api/v1/links`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        url,
        visits: 0,
        folder_id: folder.id
      })
    }
  )
}
