const addFolderBtn = $('.folder-submit')

addFolderBtn.on('click', () => {
  let userInput = $('.folder-input')

  $('.folders').prepend(`
    <section>
      <img src='assets/images/folder.png'/>
      <p>${userInput.val()}</p>
    </section>
  `)

  userInput.val('')
})
