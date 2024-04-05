
        async function fun(event){
            event.preventDefault();
            let amount=event.target.num.value;
            let description=event.target.description.value;
            let catagory=event.target.expense.value

            // console.log(num)

            let obj={
                amount,
                description,
                catagory
            }

            // console.log(obj.num)
            let token = localStorage.getItem('token')
            let res= await axios.post('http://localhost:4444/expense/addexpense',obj,{headers : {'Authorization' : token}})
            showData(res.data.expense)
        }


        function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

        document.addEventListener('DOMContentLoaded', async function() {
            await getData();
        });

    
            async function getData(page,limit ){
                try{
                    let token = localStorage.getItem('token')
                    let adminData = parseJwt(token)
                    let ispremiumuser = adminData.ispremiumuser;
                    if(ispremiumuser){
                        isPremium()
                    }

                    page = page || 1;
                    limit = limit || 5;

                    let res = await axios.get(`http://localhost:4444/expense/getexpense?page=${page}&limit=${limit}`, {
                        headers: { 'Authorization': token }
                    });

                    console.log(res.data)

                    let tableBody = document.getElementById('expenseTableBody');
                    tableBody.innerHTML = ''; 
            
                    let list = document.getElementById('data'); 
                    list.innerHTML = '';
                    for (let i = 0; i < res.data.details.length; i++) {
                        showData(res.data.details[i]);
                    }
            
                // const totalPages = Math.ceil(res.data.totalCount/ 10); 
                updatePaginationButtons(page);
            }
            catch(err){
                console.log(err)
            }
            }
            getData()

            
        document.getElementById('pagenumber').addEventListener('change', async function(event) {
            const selectedLimit = event.target.value;
            // console.log(selectedLimit)
            await getData(1, selectedLimit);
        });





        function showData(obj){
            let tableBody = document.getElementById('expenseTableBody');
        
            let newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${obj.amount}</td>
                <td>${obj.description}</td>
                <td>${obj.catagory}</td>
            `;
        
            let deleteButtonCell = document.createElement('td');
            let deleteButton = document.createElement('input');
            deleteButton.type = 'button';
            deleteButton.value = 'delete';
            deleteButton.addEventListener('click', async () => {
                try {
                    let token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:4444/expense/deleteExpense/${obj.id}`, {
                        headers: {'Authorization': token}
                    });
                    tableBody.removeChild(newRow);
                } catch (err) {
                    console.log(err);
                }
            });
        
            deleteButtonCell.appendChild(deleteButton);
            newRow.appendChild(deleteButtonCell);
            
            tableBody.appendChild(newRow);
        }
            async function getUrl(){
                    try {
                        let token = localStorage.getItem('token');
                        let response = await axios.get('http://localhost:4444/expense/geturl',{headers :{'Authorization':token}});
                        // console.log(response.data.response);
                
                        
                        let urlList = document.getElementById('downlodeList');
                        response.data.response.forEach(url => {
                            let li = document.createElement('li');
                            let a = document.createElement('a');
                            a.href = url.url; 
                            a.style.color='purple'
                            let date = new Date(url.date)
                            a.textContent = 'downloaded file';
                            a.download = 'my_file_name'; 
                            li.appendChild(a);
                            urlList.appendChild(li);
                        });
                    } catch(err) {
                        console.log(err);
                    }
                }
                getUrl();


        document.getElementById('premium').onclick = async function(e) {
            const token = localStorage.getItem('token')
            let res= await axios.get('http://localhost:4444/purchase/getpremium', {headers :{'Authorization': token}})
                    

            var options = {
                "key" : res.data.key_id,
                "order_id": res.data.order.id,

                "handler" : async function (res){
                    try{
                    
                    const response= await axios.post('http://localhost:4444/purchase/updatetransaction',{
                        order_id: options.order_id,
                        payment_id: res.razorpay_payment_id,
                    },{headers :{'Authorization' :token} })

                    alert('you are a premium user now')
                    isPremium()

                    localStorage.setItem('token' , response.data.token)
        
                    }
                catch(err){
                    console.log(err)
                }
                },
            };


        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault()

        rzp1.on('payment.failed' ,async function(res){
            console.log('payment failed', res);
            const updateResponse = await axios.post('http://localhost:4444/purchase/updatetransaction',
            {
                order_id:options.order_id
            },{headers :{'Authorization' :token} })
            
            
        })
        }

        function isPremium(){

            var elem = document.getElementById('premium');
            elem.style.visibility = 'hidden';

            var message = document.createElement('div');
            message.innerHTML = 'YOU ARE A PREMIUM USER';
            message.style.fontSize="20px"
            message.style.fontWeight='bold'
            message.style.display = 'inline-block';
            


            var button = document.createElement('input');
            button.type = 'button';
            button.value = 'Show Leaderboard';
            button.className="btn btn-secondary" ;
            button.style.display = 'inline-block'; 
            button.style.marginLeft='240px'

            var messageDiv = document.getElementById('message');
            messageDiv.innerHTML = ''; 
            messageDiv.appendChild(message);
            messageDiv.appendChild(button);

            var downlodeBut = document.createElement('input');
            downlodeBut.type='button';
            downlodeBut.value='Downlode';
            downlodeBut.className="btn btn-secondary" ;
            button.style.display='inline-block'
            button.style.marginRight='260px'
            messageDiv.appendChild(downlodeBut);

            downlodeBut.onclick = async()=>{
                let token=localStorage.getItem('token')

                try{
                    let response = await axios.get('http://localhost:4444/expense/downlode',{headers :{'Authorization': token}})
                    console.log(response)
                    if(response.status === 200){
                        let a = document.createElement('a');
                        a.href = response.data.fileURL;
                        a.download = 'myexpense.csv';
                        a.click()
                    }
                    
                }
                catch(err){
                    console.log(err)
                }
            }


            button.onclick = async ()=>{
                        const token = localStorage.getItem('token')
                        const result = await axios.get('http://localhost:4444/premium/getfeature',{headers :{'Authorization' :token} })
                        console.log(result)


                        let leaderboard=document.getElementById('leaderboard')
                        leaderboard.innerHTML += '<h1>Leader Board</h1>'

                        result.data.forEach((details)=>{
                            leaderboard.innerHTML += `<b><li>Name :- ${details.name} , Total-Expensecost:- ${details.Total_cost}</li></b>`
                        })
                }

        }



      

        
async function updatePaginationButtons(currentPage) {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    const totalPages = currentPage + 1; 

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add('active');
            button.disabled = true; 
        } else {
            button.addEventListener('click', async () => {
                await getData(i);
            });
        }
        paginationButtons.appendChild(button);
    }
}   

