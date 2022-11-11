const cards = document.querySelectorAll('.card')
const compositions = document.querySelectorAll('.composition')

cards.forEach(card => {
  card.addEventListener('dragstart', () => {
    card.classList.add('dragging')
    card.classList.remove('dropped')
  })

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging')
  })

  card.addEventListener('drop', () => {
    card.classList.add('dropped')
    console.log('dropped')
  })
})

compositions.forEach(composition => {
  composition.addEventListener('dragover', e => {
    e.preventDefault()
  })

  composition.addEventListener('drop', e => {
    e.preventDefault()
    const card = document.querySelector('.dragging')
    const startLocation = card.parentNode.id.toString()
    var dropLocation = composition.id.toString()
    console.log(startLocation)
    if (startLocation == "deck" && dropLocation == "hand" && composition.children.length < 6) {
      const cardClone = card.cloneNode(true);
      composition.appendChild(cardClone)
    } else if (startLocation == "hand" && dropLocation =="trash") {
        card.parentNode.removeChild(card);
    } else {
      // do nothing
    }
  })
})