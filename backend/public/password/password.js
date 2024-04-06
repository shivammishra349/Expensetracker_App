 async function forgotpassword(event){
    try{
                event.preventDefault()
            let email = event.target.email.value
            console.log(email)
            
         await axios.post('http://localhost:4444/password/forgetpassword',{email : email})
         alert('Email sent successfully');
        
    }
    catch(err){
        alert(err.response.data.message)
    }
    
}


