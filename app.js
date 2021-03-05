class Squares {
   constructor(squares, rows) {
     this._squares = squares
     this._rows = rows
     
   }
  remove(item, p1, p2 = [0,0]) {
    let loc = (p1[0]+p2[0])*this._rows + p1[1]+p2[1]
    this._squares[loc].classList.remove(item)
  }
  add(item, p1, p2 = [0,0]) {
  //  console.log(p1)
    let loc = (p1[0]+p2[0])*this._rows + p1[1]+p2[1]
    this._squares[loc].classList.add(item)
  }
  contains(item, p1, p2 = [0,0]) {
  //  console.log(p1)
    let loc = (p1[0]+p2[0])*this._rows + p1[1]+p2[1]
    return this._squares[loc].classList.contains(item)
  }
  
}

class Snake {
   constructor() {
      this._currentSnake = [[0,2],[0,1],[0,0]]
   }
   
   
   reset() {
      this._currentSnake = [[0,2],[0,1],[0,0]]
   }
   get head() {
      return this._currentSnake[0]
   }
   
   get tail() {
      return this._currentSnake[this._currentSnake.length - 1]
   }
   
   [Symbol.iterator]() {
        let nextIndex = 0
        return  {
            next: () => {
                if ( nextIndex < this._currentSnake.length ) {
                    let result = { value: this._currentSnake[nextIndex],  done: false }
                    nextIndex ++
                    return result;
                }
                return { value: 9999, done: true };
            }
        }
    }
    
    move(direction,squares) {
      let [r1, c1] = this._currentSnake[0]
      let [r2, c2] = direction
 ///     console.log(`${r1}  ${c1}  ${r2}  ${r2}  `)
      let tail = this._currentSnake.pop() 
      this._currentSnake.unshift([r1+r2,c1+c2])
      
      squares.remove('snake',tail)
      squares.add('snake',this.head)
      
    }
    
    addNewBodyPart(where) {
      this._currentSnake.push(where)
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const squares88 = document.querySelectorAll('.grid div')
  const scoreDisplay = document.querySelector('span')
  const startBtn = document.querySelector('.start')
  const rows = 10
  const cols = 10
  const width = 10
  
  let speed = 0.9
  let direction = [0,1]
  let score = 0
  let squares = new Squares(squares88,rows)
  let currentSnake = new Snake()
  let intervalTime = 1000
  let interval = 0
  let appleRow = 5
  let appleCol = 6
  let gameInPlay = false 
  let right = 39
  let up = 38
  let left = 37
  let down = 40
  
  //to start, and restart the game
  function startGame() {
     if (gameInPlay) {
       return  
     }
     gameInPlay = true
     //Reset timer
     intervalTime = 1000
     
     score = 0
     
     scoreDisplay.textContent = ` ${score} `
      //Remove an old apple from previous game
      //console.log(` clearing apple  ${appleRow}  ${appleCol}`)
      squares.remove('apple',[appleRow,appleCol])  
  
      //Add first apple in same place
      squares.add('apple',[5,6])
    
  
     //Clear out old snake
     for (let n of currentSnake) {
      squares.remove('snake',n)
     } 
     
     //Reset direction
     direction = [0,1] 
 
    //Set up initial snake  
     currentSnake.reset()
     for (let n of currentSnake) {
      squares.add('snake',n)
     } 
     
     //Solution for changing the time interval
     //https://javascript.info/settimeout-setinterval
     //let delay = 5000;

     //let timerId = setTimeout(function request() {
        //  ...send request...

        //if (request failed due to server overload) {
        // increase the interval to the next run
        // delay *= 2;
       //}

       // timerId = setTimeout(request, delay);

      //}, delay);
    
     let timerID = setTimeout( moveOutcomes, intervalTime)

   }

 

  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {
     let [r1, c1] = currentSnake.head
     let [r2, c2] = direction
     let row = r1+r2
     let col = c1+c2
     if ( row < 0|| row >= rows || col < 0 || col >= cols || //if snake hits bottom
        squares.contains('snake',currentSnake.head,direction) //if snake goes into itself
     ) {
       
      //console.log(`Clearing ${row} ${col}`)
      scoreDisplay.textContent = ` ${score} Game Over`
      gameInPlay = false
      return clearInterval(timerID) //this will clear the interval if any of the above happen
      
     }  

     //Note where old tail is as we will use this
     //if we are extending the snake due to head being over an apple
     oldTail = currentSnake.tail 
     currentSnake.move(direction, squares)
        
 
     //Have we moved over an apple
      if (squares.contains('apple',currentSnake.head)) {
        squares.remove('apple', currentSnake.head) 
        squares.add('snake', currentSnake.head)
      
        squares.add('snake',oldTail)
        currentSnake.addNewBodyPart(oldTail)
        randomApple()
        score++
        scoreDisplay.textContent = ` ${score} `
        intervalTime = intervalTime * 0.9
     }

     timerID = setTimeout(moveOutcomes,intervalTime)
  }

 
  
  
  //generate new apple once apple is eaten
  function randomApple() {
 
    do{
      //Going to keep apple of the board edge in my version
      //Not brackets about rows-1,BODMAS
      appleRow = Math.floor(Math.random() * (rows-1))
      if (appleRow === 0) {
         appleRow++
      }
      appleCol = Math.floor(Math.random() * (cols-1))
      if (appleCol === 0) {
         appleCol++
      }
    } while(squares.contains('snake',[appleRow,appleCol])) 
    //making sure apples do not appear on the snake
     //console.log(` new apple ${appleRow}  ${appleCol}`)
     squares.add('apple',[appleRow,appleCol])
  }

 
  //assign functions to keycodes
  function control(e) {
    if(e.keyCode === right) {
      //direction = 1 //if we press the right arrow on 
      //our keyboard, the snake will go right one
       direction = [0, 1]
    } else if (e.keyCode === up) {
      //direction = -width // if we press the up arrow, the 
      //snake will go back ten divs, appearing to go up
      direction = [-1, 0]
    } else if (e.keyCode === left) {
      //direction = -1 // if we press left, the snake will 
      //go left one div
       direction = [0, -1]
    } else if (e.keyCode === down) {
       direction = [1, 0]
    }
    
  }

  document.addEventListener('keyup', control)
  startBtn.addEventListener('click', startGame)
})
