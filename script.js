console.log("hej")
// hej
let content = document.querySelector("#content");
let header = document.querySelector("#header");


fetch("http://localhost:8888/test/wp-json/wp/v2/pages") 
.then(res => res.json())
.then(data => {
    console.log("posts", data);
})

// tar alla pages som finns o skapar en slaks meny!!
  fetch('http://157.230.107.76/index.php/wp-json/wp/v2/pages')
  .then(response => response.json())
  .then(pages => {

    pages.forEach(page => {
        let menuItem = document.createElement("button")
        menuItem.classList.add("MenuButton")
        menuItem.innerText = page.title.rendered
        menuItem.setAttribute("href", page.link)
        menuItem.addEventListener("click", function() {
            content.innerHTML = '';
            if (menuItem.innerText === "Shop") {
                WoocommerceShop()
            } else {
                content.innerHTML = page.content.rendered;
            }
            
            console.log(page.link)
            console.log(page.title.rendered)
        })
        header.appendChild(menuItem)
    });
    
  })

  let cart = [

  ]

function WoocommerceShop() {
  fetch("http://157.230.107.76/index.php/wp-json/wc/store/products")
  .then(res => res.json())
  .then(data => {
      console.log("produkter", data);
      printProductList(data);
  })
  
  function printProductList(products) {
      let ul = document.createElement("ul")
      
      products.map(product => {
        let newBtn = document.createElement("button");
        
          let li = document.createElement("li")
          li.innerHTML = `${product.name} <br> 
          ${product.prices.price} ${product.prices.currency_code}`;
          newBtn.innerText = `Buy now!`
          
          newBtn.addEventListener("click", () => {
            let existingShoeIndex = -1;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].product_id === product.id) {
                    existingShoeIndex = i;
                    break;
                }
            }

            if (existingShoeIndex > -1) {
                cart[existingShoeIndex].quantity += 1; // Update quantity if shoe already 
            }   
            else {
                let addshoe = {
                product_id: product.id,
                quantity: 1
                }
                cart.push(addshoe)
                console.log(cart)
            }
          })
          

          
        ul.appendChild(li)
        ul.appendChild(newBtn)
      })
      const sendorderBtn = document.createElement("button");
      sendorderBtn.innerText = "Send"
      
      content.appendChild(ul)
      content.appendChild(sendorderBtn)
      sendorderBtn.addEventListener("click", postOrder)
      sendorderBtn.addEventListener("click", () => {

      })
    }
}

  
function postOrder() {
    console.log("Skicka order");
    
    // SKAPA BODY
    let order = {
        payment_method: "bacs", 
        payment_method_title: "Direct Bank Transfer",
        set_paid: true,
        customer_id: 1,
        billing: {
            first_name: "Janne",
            last_name: "Kemi",
            adress_1: "Gatan 10",
            city: "Uddebo",
            postcode: "514 92",
            country: "SE",
            email: "janne@hiveandfive.se",
            phone: "070123456"
        },
        shipping: {
            first_name: "Janne",
            last_name: "Kemi",
            adress_1: "Gatan 10",
            city: "Uddebo",
            postcode: "514 92",
            country: "SE",
            email: "janne@hiveandfive.se",
            phone: "070123456"
        },
        line_items: [    
        ],
        shipping_lines: [
            {
                method_id: "flat_rate",
                method_title: "Flat rate",
                total: "100"
            }    
        ],
        
    }
    for (let i = 0; i < cart.length; i++) {
        order.line_items.push(cart[i])
    }
    fetch("http://157.230.107.76/index.php/wp-json/wc/v3/orders", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(order),
    })
    .then(res => res.json())
    .then(data => {
        console.log("Order skickad", data);
        localStorage.setItem("cart", JSON.stringify([]));
        printCart();
    })
    .catch(err => console.log("err", err));
}

