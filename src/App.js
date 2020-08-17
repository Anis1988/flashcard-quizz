import React, {useState,useEffect,useRef} from 'react';
import FlashCardList from './FlashCardList';
import './app.css'
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])
  const url = "https://opentdb.com/api.php"
  const urlCat = "https://opentdb.com/api_category.php";
  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(()=> {
    axios.get(urlCat)
    .then(res => {
     setCategories(res.data.trivia_categories)
    })
  },[])

  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handelSubmit(e){
    e.preventDefault();
    axios.get(url,{
      params:{
        amount:amountEl.current.value,
        category:categoryEl.current.value
      }
    })
    .then(res=> {
      setFlashcards(res.data.results.map((questionItem,index)=> {
        const answer =  decodeString(questionItem.correct_answer)
        const options = [...questionItem.incorrect_answers.map(a=> decodeString(a))
          ,answer]
        return {
          id:`${index}-${Date.now()}`, // to overchek it to be unique
          question:decodeString(questionItem.question),
          answer:questionItem.correct_answer,
          options:options.sort(()=> Math.random() - .5)
        }
      }))
    })
  }

  return (
    <>
    <form className="header" onSubmit={handelSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
          {categories.map(category => {
            return  <option value={category.id} key={category.id}>{category.name}</option>
          })}
        </select>
      </div>
      <div className="form-group">
      <label htmlFor="amount">Number of Questions</label>
      <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl}></input>
      </div>
      <div className="form-group">
            <button className="btn">Generate</button>
      </div>
    </form>
    <div className="container">
        <FlashCardList flashcards={flashcards}/>
    </div>
    </>
  )
}



export default App;
