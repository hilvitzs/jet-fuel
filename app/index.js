const addFolderBtn = $('.folder-submit')

addFolderBtn.on('click', () => {
  let userInput = $('.folder-input')

  $('.folders').prepend(`
    <section class='folder'>
      <img src='./assets/images/folder.png'/>
      <p>${userInput.val()}</p>
    </section>
  `)

  userInput.val('')
})

$('body').on('click', '.folder', () => {
  $('.folder').append(`
    <section class='link'>
      <p>something</p>
    </section>
  `)
})
