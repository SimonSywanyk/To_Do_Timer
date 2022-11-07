const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    getCompleted: async (req,res)=>{
        console.log(req.user)
        try{
            const todosCompleted = await Todo.find({userId:req.user.id,completed: true})
            const itemsCompleted = await Todo.countDocuments({userId:req.user.id,completed: true})
            res.render('history.ejs', {todos: todosCompleted, completed: itemsCompleted, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    todoTimer: async (req, res)=>{
        try{
        //INSERT CODE BELOW
        // Ten minutes to seconds to milliseconds
        const countdownTime = 10 * 60 * 1000;

        // The countdown end instant is calculed by the addition of the current time when timer is created. 
        const expireTime = Date.now() + countdownTime;

        // Now, if you want to calculate the remaining time (in milliseconds):
        remainingTime = expireTime - Date.now();

        // If you want to know if countdown has reached its end: 

        isEnded = Date.now() < expireTime;

        // I don't know how do you want to implement the UI for showing the countdown stuff, but I recommend to convert the time in milliseconds to h, m, s only on browser at render time.
        // Here is an implementation that I made for a pomodoro application:

        function msToHHMMSS(timeInMs) {
        const timeInSeconds = timeInMs / 1000;
        const s = timeInSeconds % 60;
        const m = Math.floor(timeInSeconds / 60) % 60;
        const h = Math.floor(timeInSeconds / 3600);
        // You can use the returned values separately where do you want
        return [h, m, s];
        };

        // Use array inferencing for extracting values from the returned array
        const [hours, minutes, seconds] = msToHHMMSS(remainingTime);

        // For example, if I want to use an element with the "timer" ID for rendering the countdown time on browser:
        document.getElementById("timer").innerText(`${hours}:${minutes}:${seconds}`)
        // The render should be upgraded once on a second. You can use the setInterval for that.

        res.redirect('/todos')
    }catch(err){
        console.log(err)
    }
    }
}    